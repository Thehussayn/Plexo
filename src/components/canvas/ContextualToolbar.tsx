import React, { useState, useRef, useEffect } from 'react';
import {
  Edit3,
  Copy,
  Trash2,
  MoreHorizontal,
  EyeOff,
  Lock,
  ArrowUp,
  Sparkles,
  MousePointer,
  Crop,
} from 'lucide-react';
import { DocumentNode } from '../../types/editor';
import { useEditor } from '../../context/EditorContext';

interface ContextualToolbarProps {
  node: DocumentNode;
}

export const ContextualToolbar: React.FC<ContextualToolbarProps> = ({ node }) => {
  const {
    startInlineEditing,
    duplicateNode,
    deleteNode,
    toggleNodeVisibility,
    toggleNodeLock,
    selectParentNode,
    toggleSidebarTab,
    detachElementToFreePosition,
    returnElementToStructuredLayout,
    canvasZoom,
  } = useEditor();

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMoreMenu) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMoreMenu]);

  const isTextElement =
    node.type === 'heading' ||
    node.type === 'paragraph' ||
    node.type === 'button' ||
    node.type === 'badge';

  const isRootPage = node.type === 'page';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-9 left-0 z-50 flex items-center bg-[#161616]/95 backdrop-blur-md border border-[#2A2A2A] rounded-xl px-2 h-7.5 shadow-xl select-none text-[11px] text-[#9CA3AF] font-sans gap-1 animate-in fade-in duration-100"
    >
      {/* Green Mouse Pointer Icon (Reference Image) */}
      <div className="flex items-center justify-center pl-0.5 pr-0.5" title={`${node.type} element`}>
        <MousePointer className="w-3.5 h-3.5 fill-[#96F02E] text-[#96F02E]" />
      </div>

      <div className="w-[1px] h-3 bg-[#2D2D2D] mx-0.5" />

      {/* Edit text button (if text element) */}
      {isTextElement && (
        <button
          onClick={() => startInlineEditing(node.id)}
          title="Edit Text (T or Enter)"
          className="flex items-center gap-1 px-1.5 h-5 rounded-md text-[10px] text-[#EDEDED] hover:bg-[#252525] transition-colors cursor-pointer"
        >
          <Edit3 className="w-3 h-3 text-[#96F02E]" />
          <span>Edit</span>
        </button>
      )}

      {/* Subtle SOL Action */}
      <button
        onClick={() => toggleSidebarTab('sol')}
        title="Open SOL AI Suggestions"
        className="flex items-center gap-1 px-1.5 h-5 rounded-md text-[10px] text-[#9CA3AF] hover:text-[#96F02E] hover:bg-[#252525] transition-colors cursor-pointer"
      >
        <Sparkles className="w-2.5 h-2.5 text-[#96F02E]" />
        <span>SOL</span>
      </button>

      {/* Duplicate */}
      {!isRootPage && (
        <button
          onClick={() => duplicateNode(node.id)}
          title="Duplicate (⌘D)"
          className="w-5 h-5 rounded-md flex items-center justify-center hover:text-[#EDEDED] hover:bg-[#252525] transition-colors cursor-pointer"
        >
          <Copy className="w-3 h-3" />
        </button>
      )}

      {/* Delete */}
      {!isRootPage && (
        <button
          onClick={() => deleteNode(node.id)}
          title="Delete (⌫)"
          className="w-5 h-5 rounded-md flex items-center justify-center hover:text-red-400 hover:bg-[#252525] transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* ••• More Actions Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          title="More Actions"
          className="w-5 h-5 rounded-md flex items-center justify-center hover:text-[#EDEDED] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
        >
          <MoreHorizontal className="w-3 h-3" />
        </button>

        {showMoreMenu && (
          <div className="absolute top-7 left-0 bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl shadow-2xl py-1 w-36 z-50 text-[11px] divide-y divide-[#282828]">
            <div className="py-0.5">
              <button
                onClick={() => {
                  selectParentNode(node.id);
                  setShowMoreMenu(false);
                }}
                className="w-full px-2.5 py-1 text-left text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#282828] flex items-center gap-2 cursor-pointer"
              >
                <ArrowUp className="w-3 h-3" />
                <span>Select Parent</span>
              </button>
            </div>
            <div className="py-0.5">
              <button
                onClick={() => {
                  toggleNodeVisibility(node.id);
                  setShowMoreMenu(false);
                }}
                className="w-full px-2.5 py-1 text-left text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#282828] flex items-center gap-2 cursor-pointer"
              >
                <EyeOff className="w-3 h-3" />
                <span>Hide Element</span>
              </button>
              <button
                onClick={() => {
                  toggleNodeLock(node.id);
                  setShowMoreMenu(false);
                }}
                className="w-full px-2.5 py-1 text-left text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#282828] flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Lock Element</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
