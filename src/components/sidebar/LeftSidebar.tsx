import React, { useState } from 'react';
import {
  Layers,
  PlusCircle,
  FileCode,
  Search,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { LayersPanel } from './LayersPanel';
import { InsertPanel } from './InsertPanel';
import { PagesPanel } from './PagesPanel';
import { LeftSidebarTab } from '../../types/editor';

export const LeftSidebar: React.FC = () => {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
  } = useEditor();

  const [searchQuery, setSearchQuery] = useState('');

  const currentTab = activeSidebarTab || 'layers';

  return (
    <aside className="w-[230px] bg-[#161616] border-r border-[#262626] flex flex-col h-full select-none shrink-0 z-20 font-sans text-xs">
      {/* 1. Clean Top Text Tabs: Layers | Insert | Pages */}
      <div className="flex items-center px-2 pt-2 pb-1.5 gap-0.5 border-b border-[#262626]">
        <button
          onClick={() => setActiveSidebarTab('layers')}
          className={`flex-1 py-1 rounded text-[11px] font-medium transition-colors text-center ${
            currentTab === 'layers'
              ? 'bg-[#242424] text-[#EDEDED] font-semibold'
              : 'text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#1E1E1E]'
          }`}
        >
          Layers
        </button>

        <button
          onClick={() => setActiveSidebarTab('insert')}
          className={`flex-1 py-1 rounded text-[11px] font-medium transition-colors text-center ${
            currentTab === 'insert'
              ? 'bg-[#242424] text-[#EDEDED] font-semibold'
              : 'text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#1E1E1E]'
          }`}
        >
          Insert
        </button>

        <button
          onClick={() => setActiveSidebarTab('pages')}
          className={`flex-1 py-1 rounded text-[11px] font-medium transition-colors text-center ${
            currentTab === 'pages'
              ? 'bg-[#242424] text-[#EDEDED] font-semibold'
              : 'text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#1E1E1E]'
          }`}
        >
          Pages
        </button>
      </div>

      {/* 2. Search Input (Shown when on Layers tab) */}
      {currentTab === 'layers' && (
        <div className="px-2 pt-2 pb-1 border-b border-[#262626]">
          <div className="flex items-center gap-1.5 px-2 h-6 bg-[#1F1F1F] rounded border border-[#2C2C2C] text-[#9CA3AF]">
            <Search className="w-3 h-3 text-[#6B7280] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search layers..."
              className="bg-transparent text-[11px] text-[#EDEDED] placeholder-[#6B7280] focus:outline-none w-full"
            />
          </div>
        </div>
      )}

      {/* 3. Real Plexo Panels */}
      <div className="flex-1 overflow-hidden">
        {currentTab === 'layers' && <LayersPanel />}
        {currentTab === 'insert' && <InsertPanel />}
        {currentTab === 'pages' && <PagesPanel />}
      </div>
    </aside>
  );
};
