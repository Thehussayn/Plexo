import React, { useRef, useState } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw, Plus } from 'lucide-react';
import { ViewportMode } from '../../types/editor';
import { useEditor } from '../../context/EditorContext';
import { FrameBreakpointContext } from '../../context/FrameContext';
import { NodeRenderer } from './NodeRenderer';

interface PageFrameProps {
  breakpoint: ViewportMode;
  width: number;
  isFocusedMode?: boolean;
}

export const PageFrame: React.FC<PageFrameProps> = ({
  breakpoint,
  width,
  isFocusedMode = false,
}) => {
  const {
    documentTree,
    viewportMode,
    setViewportMode,
    selectedNodeId,
    selectNode,
    isPreviewMode,
    canvasCustomWidth,
    setCanvasCustomWidth,
    addSection,
  } = useEditor();

  const [isDraggingWidth, setIsDraggingWidth] = useState(false);
  const dragStartRef = useRef<{ startX: number; startW: number; side: 'left' | 'right' } | null>(null);

  const isCurrentBreakpoint = viewportMode === breakpoint;
  const isPageSelected = selectedNodeId === documentTree.id || selectedNodeId === null;
  const isFrameActive = isCurrentBreakpoint && isPageSelected;

  const getLabel = () => {
    const activeW = isCurrentBreakpoint && canvasCustomWidth && isFocusedMode ? canvasCustomWidth : width;
    switch (breakpoint) {
      case 'mobile':
        return `Mobile · ${activeW}px`;
      case 'tablet':
        return `Tablet · ${activeW}px`;
      case 'desktop':
      default:
        return `Desktop · ${activeW}px`;
    }
  };

  const getIcon = () => {
    switch (breakpoint) {
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5" />;
      case 'desktop':
      default:
        return <Monitor className="w-3.5 h-3.5" />;
    }
  };

  const handleSelectFrame = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewportMode(breakpoint);
    selectNode(documentTree.id);
  };

  // Edge drag resize handlers for desktop in focused mode
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    side: 'left' | 'right'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    dragStartRef.current = {
      startX: e.clientX,
      startW: canvasCustomWidth || width,
      side,
    };
    setIsDraggingWidth(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingWidth || !dragStartRef.current) return;
    e.stopPropagation();
    e.preventDefault();

    const { startX, startW, side } = dragStartRef.current;
    const deltaX = (e.clientX - startX) * (side === 'right' ? 2 : -2);
    const newWidth = Math.max(320, Math.min(1920, startW + deltaX));
    setCanvasCustomWidth(Math.round(newWidth));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingWidth) return;
    e.stopPropagation();
    e.preventDefault();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDraggingWidth(false);
    dragStartRef.current = null;
  };

  const allowResize = isFocusedMode && isCurrentBreakpoint && !isPreviewMode;

  return (
    <FrameBreakpointContext.Provider value={breakpoint}>
      <div className="relative flex flex-col items-center select-none group">
        {/* Subtle Frame Header Label */}
        {!isPreviewMode && (
          <div
            onClick={handleSelectFrame}
            className={`mb-2.5 flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              isFrameActive
                ? 'bg-[#7C3AED]/20 text-purple-300 border border-[#7C3AED]/40 shadow-sm'
                : isCurrentBreakpoint
                ? 'bg-[#1C1C1C] text-[#EDEDED] border border-[#2D2D2D]'
                : 'bg-[#161616]/80 text-[#8E8E93] hover:text-[#EDEDED] hover:bg-[#202020] border border-transparent'
            }`}
            title={`Select ${getLabel()} frame (sets editing context)`}
          >
            <span className={isFrameActive ? 'text-purple-400' : 'text-[#8E8E93]'}>
              {getIcon()}
            </span>
            <span className="font-medium tracking-tight">{getLabel()}</span>

            {isCurrentBreakpoint && canvasCustomWidth && isFocusedMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCanvasCustomWidth(null);
                }}
                title="Reset custom width"
                className="ml-1 text-[#6B7280] hover:text-[#EDEDED] flex items-center gap-0.5"
              >
                <RotateCcw className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        )}

        {/* Outer Frame Wrapper with potential width resize handles */}
        <div className="relative">
          {allowResize && (
            <div
              onPointerDown={(e) => handlePointerDown(e, 'left')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              title="Drag to resize width"
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-16 rounded-full bg-[#2A2A2A] hover:bg-[#7C3AED] cursor-ew-resize z-40 transition-colors opacity-0 group-hover:opacity-100"
            />
          )}

          {/* Render Frame Container */}
          <div
            onClick={(e) => {
              // Clicking frame border / background selects page
              if (e.target === e.currentTarget) {
                handleSelectFrame(e);
              }
            }}
            style={{
              width: `${isCurrentBreakpoint && canvasCustomWidth && isFocusedMode ? canvasCustomWidth : width}px`,
              transition: isDraggingWidth ? 'none' : 'width 0.15s ease-out',
            }}
            className={`bg-[#141414] rounded-xl shadow-2xl border overflow-hidden transition-colors ${
              isFrameActive
                ? 'border-[#7C3AED] ring-1 ring-[#7C3AED]/30'
                : 'border-[#242424] hover:border-[#383838]'
            }`}
          >
            <NodeRenderer node={documentTree} />
            {!isPreviewMode && (
              <div className="p-4 flex items-center justify-center border-t border-dashed border-[#242424] hover:border-[#7C3AED]/40 bg-[#161616]/40 transition-colors">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addSection();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#202020] hover:bg-[#7C3AED] text-[#9CA3AF] hover:text-white border border-[#2D2D2D] hover:border-[#7C3AED] text-xs font-medium transition-all cursor-pointer shadow-sm active:scale-95 group"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                  <span>Add Section</span>
                </button>
              </div>
            )}
          </div>

          {allowResize && (
            <div
              onPointerDown={(e) => handlePointerDown(e, 'right')}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              title="Drag to resize width"
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-16 rounded-full bg-[#2A2A2A] hover:bg-[#7C3AED] cursor-ew-resize z-40 transition-colors opacity-0 group-hover:opacity-100"
            />
          )}
        </div>
      </div>
    </FrameBreakpointContext.Provider>
  );
};
