import React, { useState, useRef, useEffect } from 'react';
import {
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns3,
  RotateCcw,
  Magnet,
  Grid,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const CanvasControls: React.FC = () => {
  const {
    canvasTool,
    setCanvasTool,
    canvasZoom,
    setCanvasZoom,
    isFitMode,
    setIsFitMode,
    canvasViewMode,
    setCanvasViewMode,
    zoomIn,
    zoomOut,
    setZoomCentered,
    resetZoom100,
    fitToPage,
    fitAllFrames,
    snapToGrid,
    setSnapToGrid,
    snapToElements,
    setSnapToElements,
  } = useEditor();

  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowZoomMenu(false);
      }
    };
    if (showZoomMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showZoomMenu]);

  const zoomPresets = [25, 50, 75, 100, 125, 150, 200];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center bg-[#161616]/95 backdrop-blur-md border border-[#262626] rounded-full px-2 py-1 shadow-2xl text-xs text-[#9CA3AF] gap-1 select-none"
    >
      {/* Canvas Tool Mode (Pointer vs Hand) */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setCanvasTool('select')}
          title="Select Tool (V)"
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            canvasTool === 'select'
              ? 'bg-[#2A2A2A] text-[#96F02E]'
              : 'hover:text-[#EDEDED] hover:bg-[#222222]'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setCanvasTool('hand')}
          title="Hand Tool (H or hold Space)"
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            canvasTool === 'hand'
              ? 'bg-[#2A2A2A] text-[#96F02E]'
              : 'hover:text-[#EDEDED] hover:bg-[#222222]'
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-[1px] h-3.5 bg-[#262626] mx-0.5" />

      {/* Snapping Controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => setSnapToElements(!snapToElements)}
          title={`Snap to Elements: ${snapToElements ? 'ON' : 'OFF'}`}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            snapToElements
              ? 'bg-[#96F02E]/15 text-[#96F02E]'
              : 'text-[#6B7280] hover:text-[#EDEDED] hover:bg-[#222222]'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          title={`Snap to 8px Grid: ${snapToGrid ? 'ON' : 'OFF'}`}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            snapToGrid
              ? 'bg-[#96F02E]/15 text-[#96F02E]'
              : 'text-[#6B7280] hover:text-[#EDEDED] hover:bg-[#222222]'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-[1px] h-3.5 bg-[#262626] mx-1" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => zoomOut()}
          title="Zoom out (⌘-)"
          className="p-1.5 rounded-full hover:text-[#EDEDED] hover:bg-[#222222] transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Dropdown Trigger */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowZoomMenu((prev) => !prev)}
            title="Zoom options"
            className="px-2 py-1 rounded-md text-[11px] font-mono text-[#EDEDED] hover:bg-[#222222] transition-colors cursor-pointer min-w-[46px] text-center"
          >
            {canvasZoom}%
          </button>

          {showZoomMenu && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-1 shadow-2xl min-w-[100px] z-50 flex flex-col gap-0.5">
              {zoomPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setZoomCentered(preset);
                    setShowZoomMenu(false);
                  }}
                  className={`px-2.5 py-1 text-left text-[11px] font-mono rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    canvasZoom === preset
                      ? 'bg-[#96F02E]/15 text-[#96F02E] font-semibold'
                      : 'text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#242424]'
                  }`}
                >
                  <span>{preset}%</span>
                  {canvasZoom === preset && <span className="w-1.5 h-1.5 rounded-full bg-[#96F02E]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => zoomIn()}
          title="Zoom in (⌘+)"
          className="p-1.5 rounded-full hover:text-[#EDEDED] hover:bg-[#222222] transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="w-[1px] h-3.5 bg-[#262626] mx-1" />

      {/* Preset Fit & Reset Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            if (canvasViewMode === 'all') {
              setCanvasViewMode('focused');
            } else {
              fitToPage();
            }
          }}
          title="Fit active frame to viewport"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
            isFitMode && canvasViewMode === 'focused'
              ? 'bg-[#96F02E]/15 text-[#96F02E] border border-[#96F02E]/30 font-semibold'
              : 'hover:text-[#EDEDED] hover:bg-[#222222]'
          }`}
        >
          <Maximize2 className="w-3 h-3" />
          <span>Fit Page</span>
        </button>

        <button
          onClick={() => {
            setCanvasViewMode('all');
          }}
          title="View all breakpoints side-by-side"
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
            canvasViewMode === 'all'
              ? 'bg-[#96F02E]/15 text-[#96F02E] border border-[#96F02E]/30 font-semibold'
              : 'hover:text-[#EDEDED] hover:bg-[#222222]'
          }`}
        >
          <Columns3 className="w-3 h-3" />
          <span>Fit All</span>
        </button>

        <button
          onClick={() => resetZoom100()}
          title="Reset Zoom to 100% (⇧0)"
          className={`px-2 py-1 rounded-full text-[11px] font-mono transition-colors cursor-pointer ${
            !isFitMode && canvasZoom === 100
              ? 'bg-[#2A2A2A] text-[#EDEDED] font-semibold'
              : 'hover:text-[#EDEDED] hover:bg-[#222222]'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
