import React, { useState, useRef } from 'react';
import { DocumentNode } from '../../types/editor';
import { useEditor } from '../../context/EditorContext';

interface ResizeHandlesProps {
  node: DocumentNode;
  elementRef: React.RefObject<HTMLElement>;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({ node, elementRef }) => {
  const { updateNodeStyles, canvasZoom, resolveStyles } = useEditor();
  const [isResizing, setIsResizing] = useState(false);
  const [liveDimensions, setLiveDimensions] = useState<{ width: number; height: number } | null>(null);

  const startDragRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    parentWidth: number;
    startXPos: number;
    startYPos: number;
    handle: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'right' | 'left' | 'top' | 'bottom';
  } | null>(null);

  const pendingUpdatesRef = useRef<any>(null);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    handle: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'right' | 'left' | 'top' | 'bottom'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    if (!elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    const parentRect = elementRef.current.parentElement?.getBoundingClientRect();
    const resolved = resolveStyles(node);

    startDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      parentWidth: parentRect ? parentRect.width : 1200,
      startXPos: resolved.x || 0,
      startYPos: resolved.y || 0,
      handle,
    };

    setIsResizing(true);
    setLiveDimensions({ width: Math.round(rect.width), height: Math.round(rect.height) });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing || !startDragRef.current) return;
    e.stopPropagation();
    e.preventDefault();

    const { startX, startY, startWidth, startHeight, parentWidth, startXPos, startYPos, handle } = startDragRef.current;
    const zoomFactor = Math.max(0.2, (canvasZoom || 100) / 100);
    const deltaX = (e.clientX - startX) / zoomFactor;
    const deltaY = (e.clientY - startY) / zoomFactor;

    let newWidth = startWidth;
    let newHeight = startHeight;

    if (handle.includes('right')) {
      newWidth = Math.max(40, startWidth + deltaX);
    } else if (handle.includes('left')) {
      newWidth = Math.max(40, startWidth - deltaX);
    }

    if (handle.includes('bottom')) {
      newHeight = Math.max(24, startHeight + deltaY);
    } else if (handle.includes('top')) {
      newHeight = Math.max(24, startHeight - deltaY);
    }

    const roundedW = Math.round(newWidth);
    const roundedH = Math.round(newHeight);
    setLiveDimensions({ width: roundedW, height: roundedH });

    // Direct DOM manipulation during resize for smooth 60fps response
    if (elementRef.current) {
      elementRef.current.style.width = `${roundedW}px`;
      elementRef.current.style.height = `${roundedH}px`;
    }

    const resolved = resolveStyles(node);
    if (resolved.position === 'absolute') {
      const updates: any = {};

      if (handle.includes('left') || handle.includes('right')) {
        updates.width = `${roundedW}px`;
        updates.customWidth = `${roundedW}px`;
        updates.widthSizing = 'fixed';
        const currX = handle.includes('left') ? startXPos + (startWidth - roundedW) : startXPos;
        if (handle.includes('left')) {
          updates.x = Math.round(currX);
          if (elementRef.current) elementRef.current.style.left = `${Math.round(currX)}px`;
        }
        updates.rightOffset = Math.round(Math.max(0, parentWidth - (currX + roundedW)));
        updates.centerOffsetX = Math.round((currX + roundedW / 2) - parentWidth / 2);
        updates.scaleWidth = parseFloat(((roundedW / parentWidth) * 100).toFixed(2));
      }

      if (handle.includes('top') || handle.includes('bottom')) {
        updates.height = `${roundedH}px`;
        updates.minHeight = `${roundedH}px`;
        updates.heightSizing = 'fixed';
        if (handle.includes('top')) {
          const currY = startYPos + (startHeight - roundedH);
          updates.y = Math.round(currY);
          if (elementRef.current) elementRef.current.style.top = `${Math.round(currY)}px`;
        }
      }

      pendingUpdatesRef.current = updates;
    } else {
      const updates: any = {};
      if (handle.includes('bottom') || handle.includes('top')) {
        updates.minHeight = `${roundedH}px`;
        updates.height = `${roundedH}px`;
      }
      if (handle.includes('right') || handle.includes('left')) {
        updates.customWidth = `${roundedW}px`;
        updates.width = `${roundedW}px`;
        updates.widthSizing = 'fixed';
      }
      pendingUpdatesRef.current = updates;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isResizing) return;
    e.stopPropagation();
    e.preventDefault();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (pendingUpdatesRef.current) {
      updateNodeStyles(node.id, pendingUpdatesRef.current);
      pendingUpdatesRef.current = null;
    }

    setIsResizing(false);
    setLiveDimensions(null);
    startDragRef.current = null;
  };

  return (
    <>
      {/* Live Dimension Tooltip during active resize */}
      {isResizing && liveDimensions && (
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-50 bg-[#161A24] text-white font-mono text-[10px] px-1.5 py-0.5 rounded border border-[#2B3245] shadow pointer-events-none whitespace-nowrap">
          {liveDimensions.width} × {liveDimensions.height}px
        </div>
      )}

      {/* 4 Corner Handles */}
      <div
        onPointerDown={(e) => handlePointerDown(e, 'top-left')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Resize"
        className="absolute -top-1 -left-1 w-2 h-2 bg-white border-[1.5px] border-[#96F02E] rounded-[1px] cursor-nwse-resize z-40"
      />
      <div
        onPointerDown={(e) => handlePointerDown(e, 'top-right')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Resize"
        className="absolute -top-1 -right-1 w-2 h-2 bg-white border-[1.5px] border-[#96F02E] rounded-[1px] cursor-nesw-resize z-40"
      />
      <div
        onPointerDown={(e) => handlePointerDown(e, 'bottom-left')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Resize"
        className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border-[1.5px] border-[#96F02E] rounded-[1px] cursor-nesw-resize z-40"
      />
      <div
        onPointerDown={(e) => handlePointerDown(e, 'bottom-right')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Resize"
        className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border-[1.5px] border-[#96F02E] rounded-[1px] cursor-nwse-resize z-40"
      />

      {/* Mid-edge horizontal & vertical resize drag targets */}
      <div
        onPointerDown={(e) => handlePointerDown(e, 'right')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Resize width"
        className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-white border-[1.5px] border-[#96F02E] rounded-[1px] cursor-ew-resize z-40"
      />
      <div
        onPointerDown={(e) => handlePointerDown(e, 'left')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Resize width"
        className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-white border-[1.5px] border-[#96F02E] rounded-[1px] cursor-ew-resize z-40"
      />
      <div
        onPointerDown={(e) => handlePointerDown(e, 'bottom')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Resize height"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-4 bg-white border-[1.5px] border-[#96F02E] rounded-[1px] cursor-ns-resize z-40"
      />
      <div
        onPointerDown={(e) => handlePointerDown(e, 'top')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        title="Resize height"
        className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-4 bg-white border-[1.5px] border-[#96F02E] rounded-[1px] cursor-ns-resize z-40"
      />
    </>
  );
};
