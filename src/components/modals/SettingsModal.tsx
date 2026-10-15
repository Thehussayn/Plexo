import React, { useEffect } from 'react';
import { X, Settings, Magnet, Grid, Layers, Sparkles, Check } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    snapToGrid,
    setSnapToGrid,
    snapToElements,
    setSnapToElements,
    gridSnapSize,
    setGridSnapSize,
  } = useEditor();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#161616] border border-[#2A2A2A] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#242424] bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#96F02E]/15 border border-[#96F02E]/30 flex items-center justify-center text-[#96F02E]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#EDEDED]">Workspace Settings</h2>
              <p className="text-[11px] text-[#8E8E93]">Configure canvas snapping and editing behavior</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-white hover:bg-[#222222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Snapping & Alignment */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#96F02E] font-mono">
              Snapping & Alignment
            </h3>

            {/* Snap to Elements Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C1C1C] border border-[#262626]">
              <div className="flex items-center gap-2.5">
                <Magnet className="w-4 h-4 text-[#96F02E]" />
                <div>
                  <div className="text-xs font-medium text-[#EDEDED]">Snap to Elements</div>
                  <div className="text-[11px] text-[#71717A]">
                    Show alignment guides and snap to sibling edges & centers
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSnapToElements(!snapToElements)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  snapToElements ? 'bg-[#96F02E]' : 'bg-[#2E2E2E]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${
                    snapToElements ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Snap to Grid Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C1C1C] border border-[#262626]">
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4 text-[#96F02E]" />
                <div>
                  <div className="text-xs font-medium text-[#EDEDED]">Snap to Grid</div>
                  <div className="text-[11px] text-[#71717A]">
                    Snap element positions and dimensions to fixed increments
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  snapToGrid ? 'bg-[#96F02E]' : 'bg-[#2E2E2E]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform ${
                    snapToGrid ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Grid Step Size */}
            {snapToGrid && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1C1C1C] border border-[#262626]">
                <div className="text-xs font-medium text-[#EDEDED]">Grid Step Size</div>
                <div className="flex items-center gap-1.5">
                  {[4, 8, 16].map((size) => (
                    <button
                      key={size}
                      onClick={() => setGridSnapSize(size)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        gridSnapSize === size
                          ? 'bg-[#96F02E] text-black font-bold'
                          : 'bg-[#262626] text-[#9CA3AF] hover:text-[#EDEDED]'
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* System Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#96F02E] font-mono">
              System Architecture
            </h3>
            <div className="p-3 rounded-xl bg-[#1C1C1C] border border-[#262626] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span>Version</span>
                <span className="font-mono text-[#EDEDED]">2.0.0 Pro</span>
              </div>
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span>Canvas Pipeline</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Hardware-Accelerated
                </span>
              </div>
              <div className="flex items-center justify-between text-[#9CA3AF]">
                <span>Layout Mode</span>
                <span className="text-[#96F02E]">Unified Smart Canvas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#242424] bg-[#141414] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#96F02E] hover:bg-[#85DC20] text-black text-xs font-semibold shadow-none transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
