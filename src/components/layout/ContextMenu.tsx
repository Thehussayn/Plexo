import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import {
  Group,
  Ungroup,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCcw,
  Move,
  ArrowDownToLine,
} from 'lucide-react';
import { useEditor, findNode } from '../../context/EditorContext';

export const ContextMenu: React.FC = () => {
  const {
    contextMenu,
    closeContextMenu,
    documentTree,
    selectedNodeIds,
    groupSelectedNodes,
    ungroupNode,
    duplicateNode,
    deleteNode,
    toggleNodeLock,
    toggleNodeVisibility,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    zoomIn,
    zoomOut,
    resetZoom100,
    fitToPage,
    fitAllFrames,
    detachElementToFreePosition,
    returnElementToStructuredLayout,
    canvasZoom,
  } = useEditor();

  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Close handlers on outside click, escape, or wheel
  useEffect(() => {
    if (!contextMenu.isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeContextMenu();
      }
    };

    const handleWheel = () => {
      closeContextMenu();
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [contextMenu.isOpen, closeContextMenu]);

  // Adjust coords so menu is never clipped by viewport boundaries
  useLayoutEffect(() => {
    if (!contextMenu.isOpen) return;

    const menuEl = menuRef.current;
    const width = menuEl ? menuEl.offsetWidth : 210;
    const height = menuEl ? menuEl.offsetHeight : 300;
    const padding = 10;

    let targetX = contextMenu.x;
    let targetY = contextMenu.y;

    if (targetX + width > window.innerWidth - padding) {
      targetX = Math.max(padding, window.innerWidth - width - padding);
    }
    if (targetY + height > window.innerHeight - padding) {
      targetY = Math.max(padding, window.innerHeight - height - padding);
    }

    setCoords({ x: targetX, y: targetY });
  }, [contextMenu.isOpen, contextMenu.x, contextMenu.y]);

  if (!contextMenu.isOpen) return null;

  const targetNode = contextMenu.nodeId ? findNode(documentTree, contextMenu.nodeId) : null;
  const isRootPage = targetNode?.type === 'page';
  const isFree = targetNode?.styles?.position === 'absolute';
  const hasChildren = Boolean(targetNode?.children && targetNode.children.length > 0);

  const runAction = (action: () => void) => {
    action();
    closeContextMenu();
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        zIndex: 9999,
      }}
      className="w-56 bg-[#161616]/95 backdrop-blur-md border border-[#2A2A2A] rounded-lg shadow-2xl p-1 text-xs text-[#EDEDED] select-none"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {targetNode ? (
        <>
          {/* Header with Element Name & Type */}
          <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] border-b border-[#242424] mb-1">
            <span className="font-medium text-[#EDEDED] truncate max-w-[120px]">{targetNode.name}</span>
            <span className="font-mono text-[9px] text-[#71717A] uppercase bg-[#202020] px-1.5 py-0.5 rounded">
              {targetNode.type}
            </span>
          </div>

          {/* Free Position / Return to Layout Actions */}
          {!isRootPage && (
            <>
              {isFree ? (
                <button
                  onClick={() => runAction(() => returnElementToStructuredLayout(targetNode.id))}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Return to Layout</span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() =>
                    runAction(() => {
                      const el = document.getElementById(targetNode.id);
                      const parentEl = el?.parentElement;
                      if (el && parentEl) {
                        const elRect = el.getBoundingClientRect();
                        const parentRect = parentEl.getBoundingClientRect();
                        const zoomScale = Math.max(0.2, (canvasZoom || 100) / 100);
                        const relX = (elRect.left - parentRect.left) / zoomScale;
                        const relY = (elRect.top - parentRect.top) / zoomScale;
                        detachElementToFreePosition(targetNode.id, {
                          x: Math.round(relX),
                          y: Math.round(relY),
                          width: Math.round(elRect.width / zoomScale),
                          height: Math.round(elRect.height / zoomScale),
                        });
                      } else {
                        detachElementToFreePosition(targetNode.id);
                      }
                    })
                  }
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Move className="w-3.5 h-3.5 text-purple-400" />
                    <span>Free Position</span>
                  </div>
                </button>
              )}
              <div className="my-1 border-t border-[#242424]" />
            </>
          )}

          {/* Grouping Actions */}
          {!isRootPage && (
            <>
              <button
                onClick={() =>
                  runAction(() =>
                    groupSelectedNodes(
                      selectedNodeIds && selectedNodeIds.length > 1 && selectedNodeIds.includes(targetNode.id)
                        ? selectedNodeIds
                        : [targetNode.id]
                    )
                  )
                }
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Group className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
                  <span>Group</span>
                </div>
                <span className="text-[10px] text-[#71717A] font-mono">⌘G</span>
              </button>

              {hasChildren && (
                <button
                  onClick={() => runAction(() => ungroupNode(targetNode.id))}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Ungroup className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
                    <span>Ungroup</span>
                  </div>
                  <span className="text-[10px] text-[#71717A] font-mono">⇧⌘G</span>
                </button>
              )}

              <div className="my-1 border-t border-[#242424]" />
            </>
          )}

          {/* Stacking / Ordering Actions (Child elements only) */}
          {!isRootPage && (
            <>
              <button
                onClick={() => runAction(() => bringForward(targetNode.id))}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <ChevronUp className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
                  <span>Bring Forward</span>
                </div>
                <span className="text-[10px] text-[#71717A] font-mono">⌘]</span>
              </button>

              <button
                onClick={() => runAction(() => sendBackward(targetNode.id))}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
                  <span>Send Backward</span>
                </div>
                <span className="text-[10px] text-[#71717A] font-mono">⌘[</span>
              </button>

              <button
                onClick={() => runAction(() => bringToFront(targetNode.id))}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <ChevronsUp className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
                  <span>Bring to Front</span>
                </div>
                <span className="text-[10px] text-[#71717A] font-mono">⇧⌘]</span>
              </button>

              <button
                onClick={() => runAction(() => sendToBack(targetNode.id))}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <ChevronsDown className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
                  <span>Send to Back</span>
                </div>
                <span className="text-[10px] text-[#71717A] font-mono">⇧⌘[</span>
              </button>

              <div className="my-1 border-t border-[#242424]" />
            </>
          )}

          {/* Visibility and Lock Controls */}
          <button
            onClick={() => runAction(() => toggleNodeLock(targetNode.id))}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              {targetNode.locked ? (
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-amber-400" />
              )}
              <span>{targetNode.locked ? 'Unlock' : 'Lock'}</span>
            </div>
            <span className="text-[10px] text-[#71717A] font-mono">
              {targetNode.locked ? 'Locked' : ''}
            </span>
          </button>

          <button
            onClick={() => runAction(() => toggleNodeVisibility(targetNode.id))}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              {targetNode.hidden ? (
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-cyan-400" />
              )}
              <span>{targetNode.hidden ? 'Show Layer' : 'Hide Layer'}</span>
            </div>
            <span className="text-[10px] text-[#71717A] font-mono">
              {targetNode.hidden ? 'Hidden' : ''}
            </span>
          </button>

          {/* Duplicate & Delete (Child elements only) */}
          {!isRootPage && (
            <>
              <div className="my-1 border-t border-[#242424]" />

              <button
                onClick={() => runAction(() => duplicateNode(targetNode.id))}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
                  <span>Duplicate</span>
                </div>
                <span className="text-[10px] text-[#71717A] font-mono">⌘D</span>
              </button>

              <button
                onClick={() => runAction(() => deleteNode(targetNode.id))}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300" />
                  <span>Delete</span>
                </div>
                <span className="text-[10px] text-red-400/70 font-mono">⌫</span>
              </button>
            </>
          )}
        </>
      ) : (
        /* Canvas Background Context Menu */
        <>
          <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] border-b border-[#242424] mb-1">
            <span className="font-medium text-[#EDEDED]">Canvas</span>
            <span className="font-mono text-[9px] text-[#71717A]">WORKSPACE</span>
          </div>

          <button
            onClick={() => runAction(() => zoomIn())}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <ZoomIn className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
              <span>Zoom In</span>
            </div>
            <span className="text-[10px] text-[#71717A] font-mono">⌘+</span>
          </button>

          <button
            onClick={() => runAction(() => zoomOut())}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <ZoomOut className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
              <span>Zoom Out</span>
            </div>
            <span className="text-[10px] text-[#71717A] font-mono">⌘-</span>
          </button>

          <button
            onClick={() => runAction(() => resetZoom100())}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
              <span>Zoom to 100%</span>
            </div>
            <span className="text-[10px] text-[#71717A] font-mono">⌘0</span>
          </button>

          <div className="my-1 border-t border-[#242424]" />

          <button
            onClick={() => runAction(() => fitToPage())}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Maximize className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
              <span>Fit to Page</span>
            </div>
            <span className="text-[10px] text-[#71717A] font-mono">⇧1</span>
          </button>

          <button
            onClick={() => runAction(() => fitAllFrames())}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#242424] hover:text-white transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Maximize className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-purple-400" />
              <span>Fit All Frames</span>
            </div>
            <span className="text-[10px] text-[#71717A] font-mono">⇧2</span>
          </button>
        </>
      )}
    </div>
  );
};
