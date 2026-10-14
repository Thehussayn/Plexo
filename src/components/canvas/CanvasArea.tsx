import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Copy, Check, FileCode2, Code2 } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { PageFrame } from './PageFrame';
import { CanvasControls } from './CanvasControls';
import { DocumentNode } from '../../types/editor';

// Generate clean HTML string recursively
function generateHtml(node: DocumentNode, indent = 0): string {
  const pad = '  '.repeat(indent);
  const tag =
    node.type === 'heading'
      ? `h${node.props?.level || 2}`
      : node.type === 'paragraph'
      ? 'p'
      : node.type === 'button'
      ? 'button'
      : 'div';
  const classes = node.styles.customClasses ? ` class="${node.styles.customClasses}"` : '';

  if (!node.children || node.children.length === 0) {
    return `${pad}<${tag} id="${node.id}"${classes}>${node.content || ''}</${tag}>\n`;
  }

  let html = `${pad}<${tag} id="${node.id}" data-type="${node.type}"${classes}>\n`;
  for (const child of node.children) {
    html += generateHtml(child, indent + 1);
  }
  html += `${pad}</${tag}>\n`;
  return html;
}

export const CanvasArea: React.FC = () => {
  const {
    viewMode,
    documentTree,
    viewportMode,
    canvasCustomWidth,
    canvasZoom,
    setCanvasZoom,
    canvasPan,
    setCanvasPan,
    canvasTool,
    setCanvasTool,
    canvasViewMode,
    isFitMode,
    setIsFitMode,
    setContainerSize,
    fitToPage,
    fitAllFrames,
    zoomIn,
    zoomOut,
    resetZoom100,
    selectNode,
    selectNodes,
    selectedNodeIds,
    marquee,
    setMarquee,
    openContextMenu,
  } = useEditor();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const panDistanceRef = useRef<number>(0);
  const initialFitDoneRef = useRef(false);
  const isMarqueeDraggingRef = useRef<boolean>(false);
  const marqueeStartRef = useRef<{ x: number; y: number } | null>(null);

  const [copied, setCopied] = useState(false);
  const [codeTab, setCodeTab] = useState<'html' | 'json'>('html');

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard navigation & tools (Space for Hand, V for Select, H for Hand, Zoom shortcuts)
  useEffect(() => {
    const isTyping = (el: Element | null): boolean => {
      if (!el) return false;
      const tag = el.tagName.toLowerCase();
      return (
        tag === 'input' ||
        tag === 'textarea' ||
        el.getAttribute('contenteditable') === 'true'
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTyping(document.activeElement)) return;

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
      } else if (e.key === 'v' || e.key === 'V') {
        setCanvasTool('select');
      } else if (e.key === 'h' || e.key === 'H') {
        setCanvasTool('hand');
      } else if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        zoomIn();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        resetZoom100();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    const handleBlur = () => {
      setIsSpacePressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [setCanvasTool, zoomIn, zoomOut, resetZoom100]);

  // Keep track of container size with live ResizeObserver & recalculate fit on mount or resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.round(entry.contentRect.width);
        const height = Math.round(entry.contentRect.height);
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });

          if (!initialFitDoneRef.current) {
            initialFitDoneRef.current = true;
            if (canvasViewMode === 'all') {
              fitAllFrames(width, height);
            } else {
              fitToPage(width, height);
            }
          } else if (isFitMode) {
            if (canvasViewMode === 'all') {
              fitAllFrames(width, height);
            } else {
              fitToPage(width, height);
            }
          }
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [isFitMode, canvasViewMode, fitToPage, fitAllFrames, setContainerSize]);

  // Native non-passive wheel event listener for trackpad panning and cursor-centered zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Cursor-centered zoom
        const zoomDelta = -e.deltaY * 0.005;
        const factor = Math.exp(zoomDelta);
        const targetZoom = Math.max(25, Math.min(300, Math.round(canvasZoom * factor)));

        if (targetZoom !== canvasZoom) {
          const rect = el.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          const scaleRatio = targetZoom / canvasZoom;

          setCanvasPan((prev) => ({
            x: mouseX - (mouseX - prev.x) * scaleRatio,
            y: mouseY - (mouseY - prev.y) * scaleRatio,
          }));
          setCanvasZoom(targetZoom);
          setIsFitMode(false);
        }
      } else {
        // Trackpad 2-finger scroll or mouse wheel panning
        setCanvasPan((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
        setIsFitMode(false);
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [canvasZoom, setCanvasPan, setCanvasZoom, setIsFitMode]);

  // Pointer drag panning (Middle mouse, Hand tool, or Space + drag)
  const isHandMode = canvasTool === 'hand' || isSpacePressed;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const isMiddleButton = e.button === 1;
    const isPrimaryWithHand = e.button === 0 && isHandMode;

    if (isMiddleButton || isPrimaryWithHand) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setIsDraggingCanvas(true);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      panDistanceRef.current = 0;
    } else if (e.button === 0 && e.target === containerRef.current) {
      // Direct click on empty canvas background: start Marquee Selection
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      isMarqueeDraggingRef.current = true;
      marqueeStartRef.current = { x: e.clientX, y: e.clientY };
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      panDistanceRef.current = 0;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!lastMousePosRef.current) return;

    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    panDistanceRef.current += Math.hypot(deltaX, deltaY);

    if (isDraggingCanvas) {
      setCanvasPan((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      setIsFitMode(false);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else if (isMarqueeDraggingRef.current && marqueeStartRef.current) {
      const left = Math.min(e.clientX, marqueeStartRef.current.x);
      const top = Math.min(e.clientY, marqueeStartRef.current.y);
      const width = Math.abs(e.clientX - marqueeStartRef.current.x);
      const height = Math.abs(e.clientY - marqueeStartRef.current.y);

      if (width > 4 || height > 4) {
        const box = { left, top, width, height };
        setMarquee({
          isActive: true,
          startX: marqueeStartRef.current.x,
          startY: marqueeStartRef.current.y,
          currentX: e.clientX,
          currentY: e.clientY,
          box,
        });

        const elements = containerRef.current?.querySelectorAll<HTMLElement>('[id^="node-"]');
        const intersectingIds: string[] = [];
        if (elements) {
          elements.forEach((el) => {
            if (el.id === documentTree.id) return;
            const r = el.getBoundingClientRect();
            if (
              r.right >= box.left &&
              r.left <= box.left + box.width &&
              r.bottom >= box.top &&
              r.top <= box.top + box.height
            ) {
              intersectingIds.push(el.id);
            }
          });
        }
        selectNodes(intersectingIds);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingCanvas) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setIsDraggingCanvas(false);
    }

    if (isMarqueeDraggingRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      isMarqueeDraggingRef.current = false;
      marqueeStartRef.current = null;
      setMarquee({ isActive: false, startX: 0, startY: 0, currentX: 0, currentY: 0, box: null });
    }

    // Deselect element when clicking empty canvas without dragging
    if (panDistanceRef.current < 4 && e.target === containerRef.current) {
      selectNode(null);
    }

    lastMousePosRef.current = null;
    panDistanceRef.current = 0;
  };

  const getCursorStyle = () => {
    if (isDraggingCanvas) return 'cursor-grabbing';
    if (isHandMode) return 'cursor-grab';
    return 'cursor-default';
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(null, e.clientX, e.clientY);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={handleContextMenu}
      className={`flex-1 relative w-full h-full overflow-hidden bg-[#101010] select-none ${getCursorStyle()}`}
      style={{
        backgroundImage: 'radial-gradient(circle, #1F1F1F 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Design Mode: Infinite 2D Workspace Plane */}
      {viewMode === 'design' && (
        <div
          style={{
            transform: `translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${canvasZoom / 100})`,
            transformOrigin: '0 0',
          }}
          className="absolute top-0 left-0 will-change-transform"
        >
          {canvasViewMode === 'all' ? (
            /* Multi-Frame Side-by-Side View (Shared document model) */
            <div className="flex items-start gap-16 p-12">
              <PageFrame breakpoint="desktop" width={1200} />
              <PageFrame breakpoint="tablet" width={768} />
              <PageFrame breakpoint="mobile" width={375} />
            </div>
          ) : (
            /* Single Focused Frame View */
            <div className="flex justify-center items-start p-12">
              <PageFrame
                breakpoint={viewportMode}
                width={
                  viewportMode === 'mobile'
                    ? 375
                    : viewportMode === 'tablet'
                    ? 768
                    : (canvasCustomWidth || 1200)
                }
                isFocusedMode={true}
              />
            </div>
          )}
        </div>
      )}

      {/* Code & JSON Mode (Centered modal-like preview) */}
      {(viewMode === 'code' || viewMode === 'html' || viewMode === 'json') && (
        <div className="flex items-center justify-center w-full h-full p-8 z-10 relative">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#161616] border border-[#242424] rounded-xl p-4 shadow-2xl overflow-hidden font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#242424] mb-3">
              <div className="flex items-center gap-1 bg-[#1F1F1F] p-0.5 rounded-lg border border-[#2A2A2A]">
                <button
                  onClick={() => setCodeTab('html')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                    codeTab === 'html'
                      ? 'bg-[#2A2A2A] text-emerald-300 font-semibold'
                      : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>HTML</span>
                </button>
                <button
                  onClick={() => setCodeTab('json')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                    codeTab === 'json'
                      ? 'bg-[#2A2A2A] text-purple-300 font-semibold'
                      : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>JSON Model</span>
                </button>
              </div>

              <button
                onClick={() =>
                  handleCopyCode(
                    codeTab === 'html'
                      ? generateHtml(documentTree)
                      : JSON.stringify(documentTree, null, 2)
                  )
                }
                className="flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-white bg-[#1F1F1F] px-2.5 py-1 rounded-lg border border-[#2A2A2A] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="text-[#EDEDED] overflow-x-auto max-h-[72vh] p-2 leading-relaxed font-mono">
              {codeTab === 'html' ? generateHtml(documentTree) : JSON.stringify(documentTree, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Marquee Selection Box Overlay */}
      {marquee.isActive && marquee.box && (
        <div
          style={{
            position: 'fixed',
            left: `${marquee.box.left}px`,
            top: `${marquee.box.top}px`,
            width: `${marquee.box.width}px`,
            height: `${marquee.box.height}px`,
            zIndex: 9998,
            pointerEvents: 'none',
          }}
          className="bg-purple-600/15 border border-purple-500/80 rounded-[2px]"
        />
      )}

      {/* Floating Canvas Navigation & Zoom Controls */}
      {viewMode === 'design' && <CanvasControls />}
    </div>
  );
};
