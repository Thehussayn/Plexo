import React, { useEffect } from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  title: string;
  shortcuts: ShortcutItem[];
}

const categories: ShortcutCategory[] = [
  {
    title: 'Canvas & Navigation',
    shortcuts: [
      { keys: ['V'], description: 'Pointer / Select tool' },
      { keys: ['H'], description: 'Hand / Pan tool' },
      { keys: ['Space', 'Drag'], description: 'Pan canvas freely' },
      { keys: ['⌘', '+'], description: 'Zoom in (centered)' },
      { keys: ['⌘', '-'], description: 'Zoom out (centered)' },
      { keys: ['⇧', '0'], description: 'Reset zoom to 100%' },
    ],
  },
  {
    title: 'Selection & Editing',
    shortcuts: [
      { keys: ['⌘', 'Z'], description: 'Undo last action' },
      { keys: ['⇧', '⌘', 'Z'], description: 'Redo action' },
      { keys: ['⌘', 'D'], description: 'Duplicate selected element' },
      { keys: ['⌫'], description: 'Delete selected element' },
      { keys: ['Enter'], description: 'Edit text inline' },
      { keys: ['Esc'], description: 'Deselect or select parent' },
      { keys: ['⇧', 'Click'], description: 'Multi-select elements' },
    ],
  },
  {
    title: 'Arrangement & Stacking',
    shortcuts: [
      { keys: ['⌘', 'G'], description: 'Group selected elements' },
      { keys: ['⇧', '⌘', 'G'], description: 'Ungroup container' },
      { keys: ['⌘', ']'], description: 'Bring layer forward' },
      { keys: ['⌘', '['], description: 'Send layer backward' },
      { keys: ['⇧', '⌘', ']'], description: 'Bring layer to front' },
      { keys: ['⇧', '⌘', '['], description: 'Send layer to back' },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
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
        className="bg-[#161616] border border-[#2A2A2A] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#242424] bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#96F02E]/15 border border-[#96F02E]/30 flex items-center justify-center text-[#96F02E]">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#EDEDED]">Keyboard Shortcuts</h2>
              <p className="text-[11px] text-[#8E8E93]">Essential shortcuts for fast canvas editing</p>
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
        <div className="p-5 overflow-y-auto space-y-6">
          {categories.map((cat) => (
            <div key={cat.title} className="space-y-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#96F02E] font-mono">
                {cat.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.shortcuts.map((sc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#1C1C1C] border border-[#262626] text-xs"
                  >
                    <span className="text-[#9CA3AF] truncate mr-2">{sc.description}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {sc.keys.map((k, ki) => (
                        <kbd
                          key={ki}
                          className="px-1.5 py-0.5 rounded bg-[#27272A] border border-[#3F3F46] text-[10px] font-mono font-medium text-[#E4E4E7] shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#242424] bg-[#141414] flex items-center justify-between text-[11px] text-[#71717A]">
          <div className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5" />
            <span>Plexo Editor 2.0 Pro</span>
          </div>
          <span>Press Esc to close</span>
        </div>
      </div>
    </div>
  );
};
