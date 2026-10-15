import React, { useState } from 'react';
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
import { ShortcutsModal } from '../modals/ShortcutsModal';
import { SettingsModal } from '../modals/SettingsModal';

interface ToolItem {
  id: LeftSidebarTab;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
}

export const LeftToolRail: React.FC = () => {
  const { activeSidebarTab, toggleSidebarTab } = useEditor();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      icon: <Sparkles className="w-5 h-5 text-[#96F02E]" />,
    },
  ];

  const isAddActive = activeSidebarTab === 'add' || activeSidebarTab === 'insert';

  return (
    <aside className="w-[68px] bg-[#161616] border-r border-[#242424] flex flex-col items-center justify-between py-3 shrink-0 select-none z-30 transition-colors">
      {/* Top: Brand Logo + Primary Add Action */}
      <div className="flex flex-col items-center gap-3.5 w-full">
        {/* Plexo Mark: 2x2 rounded square mark from logo image */}
        <div
          title="Plexo Workspace"
          className="w-10 h-10 flex items-center justify-center select-none cursor-pointer hover:opacity-90 transition-opacity"
        >
          <svg width="26" height="26" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="11" height="11" rx="3.5" fill="#96F02E" />
            <rect x="15" y="2" width="11" height="11" rx="3.5" fill="#2E2E2E" />
            <rect x="2" y="15" width="11" height="11" rx="3.5" fill="#2E2E2E" />
            <rect x="15" y="15" width="11" height="11" rx="3.5" fill="#2E2E2E" />
          </svg>
        </div>

        {/* Primary + Add Action (Lime Green Squircle Button from reference image, no glow) */}
        <button
          onClick={() => toggleSidebarTab('add')}
          title="Add Elements & Sections (A)"
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-none active:scale-95 ${
            isAddActive
              ? 'bg-[#96F02E] text-[#0A0A0A] ring-2 ring-[#96F02E]/40'
              : 'bg-[#96F02E] hover:bg-[#85DC20] text-[#0A0A0A]'
          }`}
        >
          <Plus className="w-5 h-5 stroke-[2.4]" />
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
                    ? 'bg-[#96F02E]/15 text-[#96F02E] border border-[#96F02E]/30 shadow-none'
                    : 'text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#222222]'
                }`}
              >
                {tool.icon}
                {/* Active Indicator Pip */}
                {isActive && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-r bg-[#96F02E]" />
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
          onClick={() => setIsShortcutsOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#222222] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button
          title="Workspace Settings"
          onClick={() => setIsSettingsOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#222222] transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Native Modals */}
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </aside>
  );
};
