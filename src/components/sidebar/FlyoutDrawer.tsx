import React from 'react';
import { X, Layers, Plus, FileText, Boxes, LayoutGrid, Sparkles } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { LayersPanel } from './LayersPanel';
import { InsertPanel } from './InsertPanel';
import { PagesPanel } from './PagesPanel';
import { StrataPanel } from './StrataPanel';
import { LibraryPanel } from './LibraryPanel';
import { SolPanel } from './SolPanel';

export const FlyoutDrawer: React.FC = () => {
  const { activeSidebarTab, setActiveSidebarTab } = useEditor();

  if (!activeSidebarTab) return null;

  const getTitle = () => {
    switch (activeSidebarTab) {
      case 'add':
      case 'insert':
        return { label: 'Add Elements', icon: <Plus className="w-3.5 h-3.5 text-purple-400" /> };
      case 'layers':
        return { label: 'Layers', icon: <Layers className="w-3.5 h-3.5 text-purple-400" /> };
      case 'pages':
        return { label: 'Pages', icon: <FileText className="w-3.5 h-3.5 text-purple-400" /> };
      case 'strata':
        return { label: 'Strata & Tokens', icon: <Boxes className="w-3.5 h-3.5 text-purple-400" /> };
      case 'library':
        return { label: 'Component Library', icon: <LayoutGrid className="w-3.5 h-3.5 text-purple-400" /> };
      case 'sol':
        return { label: 'SOL Assistant', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> };
      default:
        return { label: 'Workspace Tool', icon: null };
    }
  };

  const { label, icon } = getTitle();

  return (
    <aside
      className="w-[260px] bg-[#161616] border-r border-[#242424] flex flex-col h-full shrink-0 select-none z-20 animate-in fade-in slide-in-from-left-2 duration-150"
      aria-label={`${label} Panel`}
    >
      {/* Panel Header */}
      <div className="h-10 px-3.5 border-b border-[#242424] flex items-center justify-between shrink-0 bg-[#141414]">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-semibold text-gray-200 tracking-tight">{label}</span>
        </div>
        <button
          onClick={() => setActiveSidebarTab(null)}
          title="Close panel (Esc)"
          aria-label="Close panel"
          className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#202020] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-hidden">
        {(activeSidebarTab === 'add' || activeSidebarTab === 'insert') && <InsertPanel />}
        {activeSidebarTab === 'layers' && <LayersPanel />}
        {activeSidebarTab === 'pages' && <PagesPanel />}
        {activeSidebarTab === 'strata' && <StrataPanel />}
        {activeSidebarTab === 'library' && <LibraryPanel />}
        {activeSidebarTab === 'sol' && <SolPanel />}
      </div>
    </aside>
  );
};
