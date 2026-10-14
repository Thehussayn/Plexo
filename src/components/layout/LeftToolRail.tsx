import React from 'react';
import {
  Plus,
  Layers,
  FileText,
  Boxes,
  LayoutGrid,
  Sparkles,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { LeftSidebarTab } from '../../types/editor';

interface ToolItem {
  id: LeftSidebarTab;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
}

export const LeftToolRail: React.FC = () => {
  const { activeSidebarTab, toggleSidebarTab } = useEditor();

  const workspaceTools: ToolItem[] = [
    {
      id: 'layers',
      label: 'Layers (L)',
      icon: <Layers className="w-5 h-5" />,
      shortcut: 'L',
    },
    {
      id: 'pages',
      label: 'Pages (P)',
      icon: <FileText className="w-5 h-5" />,
      shortcut: 'P',
    },
    {
      id: 'strata',
      label: 'Strata (S)',
      icon: <Boxes className="w-5 h-5" />,
      shortcut: 'S',
    },
    {
      id: 'library',
      label: 'Library',
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      id: 'sol',
      label: 'SOL AI Assistant',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
    },
  ];

  const isAddActive = activeSidebarTab === 'add' || activeSidebarTab === 'insert';

  return (
    <aside className="w-[68px] bg-[#161616] border-r border-[#242424] flex flex-col items-center justify-between py-3 shrink-0 select-none z-30 transition-colors">
      {/* Top: Brand Logo + Primary Add Action */}
      <div className="flex flex-col items-center gap-3.5 w-full">
        {/* Plexo Mark */}
        <div
          title="Plexo Workspace"
          className="w-9 h-9 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center text-[#A78BFA] font-bold text-sm shadow-sm select-none"
        >
          P
        </div>

        {/* Primary + Add Action (Squircle Button) */}
        <button
          onClick={() => toggleSidebarTab('add')}
          title="Add Elements & Sections (A)"
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
            isAddActive
              ? 'bg-[#7C3AED] text-white ring-2 ring-[#7C3AED]/50'
              : 'bg-[#222222] hover:bg-[#7C3AED] text-[#EDEDED] hover:text-white border border-[#2D2D2D] hover:border-[#7C3AED]'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Logical Tool Group */}
        <div className="flex flex-col items-center gap-2 w-full pt-1.5">
          {workspaceTools.map((tool) => {
            const isActive = activeSidebarTab === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => toggleSidebarTab(tool.id)}
                title={tool.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                  isActive
                    ? 'bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/40 shadow-sm'
                    : 'text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#222222]'
                }`}
              >
                {tool.icon}
                {/* Active Indicator Pip */}
                {isActive && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-r bg-[#7C3AED]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom: Secondary Actions (Shortcuts, Settings) */}
      <div className="flex flex-col items-center gap-2 w-full pt-3 border-t border-[#242424]">
        <button
          title="Keyboard Shortcuts (?)"
          onClick={() =>
            alert(
              'Plexo Shortcuts:\n\n⌘Z : Undo\n⇧⌘Z : Redo\n⌘D : Duplicate element\n⌫ : Delete element\nEsc : Deselect / Select parent\nEnter : Inline text editing\nFit : Intelligent canvas fit'
            )
          }
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#222222] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button
          title="Workspace Settings"
          onClick={() => alert('Plexo Workspace: v2.0 Creative Architecture')}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#222222] transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
