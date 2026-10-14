import React, { useState } from 'react';
import {
  Edit3,
  Copy,
  Trash2,
  MoreHorizontal,
  EyeOff,
  Lock,
  ArrowUp,
  Sparkles,
  Move,
  ArrowDownToLine,
  GripVertical,
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
    setDragState,
  } = useEditor();

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isTextElement =
    node.type === 'heading' ||
    node.type === 'paragraph' ||
    node.type === 'button' ||
    node.type === 'badge';

  const isRootPage = node.type === 'page';
  const isFree = node.styles.position === 'absolute';

  const handleDetachToFree = () => {
    const el = document.getElementById(node.id);
    const parentEl = el?.parentElement;
    if (el && parentEl) {
      const elRect = el.getBoundingClientRect();
      const parentRect = parentEl.getBoundingClientRect();
      const zoomScale = Math.max(0.2, (canvasZoom || 100) / 100);
      const relX = (elRect.left - parentRect.left) / zoomScale;
      const relY = (elRect.top - parentRect.top) / zoomScale;
      detachElementToFreePosition(node.id, {
        x: Math.round(relX),
        y: Math.round(relY),
        width: Math.round(elRect.width / zoomScale),
        height: Math.round(elRect.height / zoomScale),
      });
    } else {
      detachElementToFreePosition(node.id);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute -top-9 left-0 z-50 flex items-center bg-[#1E1E1E] border border-[#2E2E2E] rounded-xl px-1.5 h-7 shadow-2xl select-none text-[11px] text-[#9CA3AF] font-sans gap-1 animate-in fade-in duration-100"
    >
      {/* Node Tag Pill */}
      <span className="text-[10px] font-semibold text-purple-300 bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-md px-1.5 py-0.5 select-none mr-0.5">
        {node.type === 'heading' ? `H${node.props?.level || 2}` : node.type}
      </span>

      {/* Edit text button (if text element) */}
      {isTextElement && (
        <button
          onClick={() => startInlineEditing(node.id)}
          title="Edit Text (T or Enter)"
          className="flex items-center gap-1 px-1.5 h-5 rounded-md text-[10px] text-[#EDEDED] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
        >
          <Edit3 className="w-3 h-3 text-purple-400" />
          <span>Edit</span>
        </button>
      )}

      {/* Subtle SOL Action */}
      <button
        onClick={() => toggleSidebarTab('sol')}
        title="Open SOL AI Suggestions"
        className="flex items-center gap-1 px-1.5 h-5 rounded-md text-[10px] text-[#9CA3AF] hover:text-purple-300 hover:bg-[#2A2A2A] transition-colors cursor-pointer"
      >
        <Sparkles className="w-2.5 h-2.5 text-purple-400" />
        <span>SOL</span>
      </button>

      {/* Duplicate */}
      {!isRootPage && (
        <button
          onClick={() => duplicateNode(node.id)}
          title="Duplicate (⌘D)"
          className="w-5 h-5 rounded-md flex items-center justify-center hover:text-[#EDEDED] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
        >
          <Copy className="w-3 h-3" />
        </button>
      )}

      {/* Delete */}
      {!isRootPage && (
        <button
          onClick={() => deleteNode(node.id)}
          title="Delete (⌫)"
          className="w-5 h-5 rounded-md flex items-center justify-center hover:text-red-400 hover:bg-[#2A2A2A] transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}

      {/* ••• More Actions Menu */}
      <div className="relative">
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
