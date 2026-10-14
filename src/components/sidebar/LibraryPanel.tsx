import React, { useState } from 'react';
import {
  LayoutGrid,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Search,
  Plus,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const LibraryPanel: React.FC = () => {
  const { insertComponent } = useEditor();
  const [activeTab, setActiveTab] = useState<'components' | 'sections' | 'media'>('components');
  const [searchQuery, setSearchQuery] = useState('');

  const prebuiltSections = [
    { id: 'hero-minimal', name: 'Hero Minimal', desc: 'Heading + CTA button + subtext', icon: '✨' },
    { id: 'feature-grid', name: '3-Column Features', desc: 'Balanced card row with organic badges', icon: '🍱' },
    { id: 'testimonial-card', name: 'Client Quote', desc: 'Large quote mark + author avatar', icon: '💬' },
    { id: 'pricing-table', name: 'Pricing Tiers', desc: 'Monthly / annual tier comparison', icon: '🏷️' },
    { id: 'cta-banner', name: 'Call to Action', desc: 'High-contrast conversion strip', icon: '🎯' },
  ];

  const mediaAssets = [
    { id: 'm-1', name: 'Herbal_Harvest.jpg', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80' },
    { id: 'm-2', name: 'Botanical_Lab.jpg', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80' },
    { id: 'm-3', name: 'Plexo_Mark.svg', url: '' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden select-none font-sans text-xs text-[#EDEDED]">
      {/* Category Tabs */}
      <div className="flex items-center p-2 gap-1 border-b border-[#242424] bg-[#141414]">
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'components'
              ? 'bg-[#222222] text-[#EDEDED] font-semibold'
              : 'text-[#9CA3AF] hover:text-[#EDEDED]'
          }`}
        >
          Blocks
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'sections'
              ? 'bg-[#222222] text-[#EDEDED] font-semibold'
              : 'text-[#9CA3AF] hover:text-[#EDEDED]'
          }`}
        >
          Sections
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'media'
              ? 'bg-[#222222] text-[#EDEDED] font-semibold'
              : 'text-[#9CA3AF] hover:text-[#EDEDED]'
          }`}
        >
          Media
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-[#242424]">
        <div className="flex items-center gap-1.5 px-2.5 h-7 bg-[#1F1F1F] rounded-lg border border-[#2C2C2C] text-[#9CA3AF]">
          <Search className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="bg-transparent text-[11px] text-[#EDEDED] placeholder-[#6B7280] focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeTab === 'components' && (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Reusable Component Blocks
            </span>
            <div className="space-y-2">
              <div
                onClick={() => insertComponent(null, 'comp-card')}
                className="p-3 bg-[#1C1C1C] hover:bg-[#242424] rounded-xl border border-[#282828] hover:border-purple-500/50 cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-[#EDEDED]">Container Card</span>
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Structured 24px padded container with 12px radius</p>
              </div>

              <div
                onClick={() => insertComponent(null, 'comp-columns')}
                className="p-3 bg-[#1C1C1C] hover:bg-[#242424] rounded-xl border border-[#282828] hover:border-purple-500/50 cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-[#EDEDED]">Multi-Column Grid</span>
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Responsive flex/grid columns with 20px gap</p>
              </div>

              <div
                onClick={() => insertComponent(null, 'comp-badge')}
                className="p-3 bg-[#1C1C1C] hover:bg-[#242424] rounded-xl border border-[#282828] hover:border-purple-500/50 cursor-pointer transition-all shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-[#EDEDED]">Status Eyebrow Badge</span>
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-1">Uppercase pill label with purple accent</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Full Page Sections
            </span>
            <div className="space-y-2">
              {prebuiltSections.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => insertComponent(null, 'comp-card')}
                  className="p-3 bg-[#1C1C1C] hover:bg-[#242424] rounded-xl border border-[#282828] hover:border-purple-500/50 cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{sec.icon}</span>
                      <span className="font-medium text-xs text-[#EDEDED]">{sec.name}</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mt-1 pl-6">{sec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
              Media Assets
            </span>
            <div className="grid grid-cols-2 gap-2">
              {mediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-[#1C1C1C] p-2 rounded-xl border border-[#282828] hover:border-purple-500/50 cursor-pointer flex flex-col items-center gap-1.5 transition-all"
                >
                  {asset.url ? (
                    <img src={asset.url} alt={asset.name} className="w-full h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-full h-16 rounded-lg bg-[#242424] flex items-center justify-center text-purple-400 font-bold text-sm">
                      Plexo
                    </div>
                  )}
                  <span className="text-[10px] text-[#9CA3AF] truncate w-full text-center">
                    {asset.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
