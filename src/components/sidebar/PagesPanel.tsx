import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Home,
  MoreVertical,
  ExternalLink,
  Search,
  Sliders,
  Edit3,
  Copy,
  Trash2,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const PagesPanel: React.FC = () => {
  const {
    pages,
    currentPageId,
    setCurrentPageId,
    selectNode,
  } = useEditor();

  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpenPageId, setMenuOpenPageId] = useState<string | null>(null);

  const filteredPages = pages.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPage = (pageId: string, rootId: string) => {
    setCurrentPageId(pageId);
    selectNode(rootId);
    setMenuOpenPageId(null);
  };

  const handleOpenPageSettings = (pageId: string, rootId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPageId(pageId);
    selectNode(rootId);
    setMenuOpenPageId(null);
  };

  return (
    <div
      onClick={() => setMenuOpenPageId(null)}
      className="flex flex-col h-full overflow-hidden select-none bg-[#161616] text-xs"
    >
      {/* 1. Header with New Page CTA */}
      <div className="px-3 py-2.5 border-b border-[#242424] flex items-center justify-between bg-[#141414]">
        <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Pages</span>
        <button
          title="Add new page"
          onClick={() => alert('New page creation dialog')}
          className="flex items-center gap-1 text-[11px] font-semibold text-black bg-[#96F02E] hover:bg-[#85DC20] px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-none"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span>New Page</span>
        </button>
      </div>

      {/* 2. Search Input */}
      <div className="p-2.5 border-b border-[#242424] bg-[#141414]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-[#EDEDED] placeholder-gray-500 focus:outline-none focus:border-[#96F02E]/60 transition-colors"
          />
        </div>
      </div>

      {/* 3. Page List */}
      <div className="p-2.5 space-y-1.5 overflow-y-auto flex-1">
        {filteredPages.map((page) => {
          const isActive = page.id === currentPageId;
          const isMenuOpen = menuOpenPageId === page.id;

          return (
            <div
              key={page.id}
              onClick={() => handleSelectPage(page.id, page.rootNode.id)}
              className={`relative flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#96F02E]/15 border-[#96F02E]/40 text-white'
                  : 'bg-[#1B1B1B] border-[#242424] text-gray-300 hover:bg-[#222222] hover:border-[#303030]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-[#96F02E]/25 text-[#96F02E]' : 'bg-[#242424] text-gray-400'
                  }`}
                >
                  {page.isHome ? <Home className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium truncate">{page.name}</span>
                    {page.isHome && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                        Home
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">/{page.slug}</span>
                </div>
              </div>

              {/* Action Menu (•••) */}
              <div className="relative shrink-0">
                <button
                  title="Page options"
                  className="p-1 rounded-md text-gray-400 hover:text-gray-100 hover:bg-[#282828] transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenPageId(isMenuOpen ? null : page.id);
                  }}
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-7 w-36 bg-[#1C1C1C] border border-[#2E2E2E] rounded-xl shadow-2xl py-1 z-50 text-[11px] divide-y divide-[#262626] animate-in fade-in duration-100"
                  >
                    <div className="py-0.5">
                      <button
                        onClick={(e) => handleOpenPageSettings(page.id, page.rootNode.id, e)}
                        className="w-full px-2.5 py-1.5 text-left text-purple-300 hover:text-white hover:bg-purple-950/40 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Sliders className="w-3 h-3 text-purple-400" />
                        <span className="font-medium">Page Settings</span>
                      </button>
                    </div>

                    <div className="py-0.5">
                      <button
                        onClick={() => {
                          const newName = prompt('Rename page:', page.name);
                          if (newName) page.name = newName;
                          setMenuOpenPageId(null);
                        }}
                        className="w-full px-2.5 py-1 text-left text-gray-300 hover:text-white hover:bg-[#282828] flex items-center gap-2 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3 text-gray-400" />
                        <span>Rename</span>
                      </button>

                      <button
                        onClick={() => {
                          alert(`Duplicate "${page.name}"`);
                          setMenuOpenPageId(null);
                        }}
                        className="w-full px-2.5 py-1 text-left text-gray-300 hover:text-white hover:bg-[#282828] flex items-center gap-2 cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                        <span>Duplicate</span>
                      </button>
                    </div>

                    {!page.isHome && (
                      <div className="py-0.5">
                        <button
                          onClick={() => {
                            if (confirm(`Delete page "${page.name}"?`)) {
                              alert('Page deleted.');
                            }
                            setMenuOpenPageId(null);
                          }}
                          className="w-full px-2.5 py-1 text-left text-red-400 hover:text-red-300 hover:bg-red-950/30 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Pages footer note */}
      <div className="p-3 bg-[#141414] border-t border-[#242424] text-[11px] text-gray-500 flex items-center justify-between">
        <span>Total pages: {pages.length}</span>
        <span
          onClick={() => alert('Sitemap XML preview')}
          className="text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>Sitemap</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
};
