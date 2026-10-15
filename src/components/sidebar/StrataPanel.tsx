import React, { useState } from 'react';
import {
  Boxes,
  Palette,
  Type,
  Layout,
  Sliders,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const StrataPanel: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'tokens' | 'layout' | 'layers'>('tokens');
  const [expandedSection, setExpandedSection] = useState<string | null>('colors');

  return (
    <div className="flex flex-col h-full overflow-hidden select-none font-sans text-xs text-[#EDEDED]">
      {/* Category Tabs */}
      <div className="flex items-center p-2 gap-1 border-b border-[#242424] bg-[#141414]">
        <button
          onClick={() => setActiveCategory('tokens')}
          className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
            activeCategory === 'tokens'
              ? 'bg-[#222222] text-[#EDEDED] font-semibold'
              : 'text-[#9CA3AF] hover:text-[#EDEDED]'
          }`}
        >
          Design Tokens
        </button>
        <button
          onClick={() => setActiveCategory('layout')}
          className={`flex-1 py-1 rounded-lg text-[11px] font-medium transition-colors ${
            activeCategory === 'layout'
              ? 'bg-[#222222] text-[#EDEDED] font-semibold'
              : 'text-[#9CA3AF] hover:text-[#EDEDED]'
          }`}
        >
          Strata Grid
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeCategory === 'tokens' && (
          <div className="space-y-3">
            {/* Color Palette Strata */}
            <div className="bg-[#1C1C1C] rounded-xl border border-[#282828] overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'colors' ? null : 'colors')}
                className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-[#EDEDED] hover:bg-[#222222] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-purple-400" />
                  <span>Color Strata</span>
                </div>
                {expandedSection === 'colors' ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                )}
              </button>

              {expandedSection === 'colors' && (
                <div className="p-3 pt-0 border-t border-[#242424] space-y-2 mt-1">
                  <div className="grid grid-cols-4 gap-1.5 pt-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-lg bg-[#96F02E] border border-[#85DC20]" />
                      <span className="text-[10px] text-[#9CA3AF] font-mono">Brand</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2E2E2E]" />
                      <span className="text-[10px] text-[#9CA3AF] font-mono">Dark</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-lg bg-[#10B981] shadow-sm border border-emerald-400/30" />
                      <span className="text-[10px] text-[#9CA3AF] font-mono">Accent</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-lg bg-[#F59E0B] shadow-sm border border-amber-400/30" />
                      <span className="text-[10px] text-[#9CA3AF] font-mono">Warm</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Typography Scale Strata */}
            <div className="bg-[#1C1C1C] rounded-xl border border-[#282828] overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'typography' ? null : 'typography')}
                className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-[#EDEDED] hover:bg-[#222222] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-blue-400" />
                  <span>Typography Scale</span>
                </div>
                {expandedSection === 'typography' ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
                )}
              </button>

              {expandedSection === 'typography' && (
                <div className="p-3 pt-2 border-t border-[#242424] space-y-2">
                  <div className="flex items-center justify-between py-1 border-b border-[#242424]">
                    <span className="text-sm font-bold">Display H1</span>
                    <span className="text-[11px] text-[#9CA3AF] font-mono">44px / 1.15</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-[#242424]">
                    <span className="text-xs font-semibold">Heading H2</span>
                    <span className="text-[11px] text-[#9CA3AF] font-mono">28px / 1.25</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs">Body Regular</span>
                    <span className="text-[11px] text-[#9CA3AF] font-mono">16px / 1.5</span>
                  </div>
                </div>
              )}
            </div>

            {/* Spacing & Radii */}
            <div className="bg-[#1C1C1C] rounded-xl border border-[#282828] p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#EDEDED]">
                <Layout className="w-3.5 h-3.5 text-purple-400" />
                <span>Radius & Rhythm</span>
              </div>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Global baseline: 4px grid rhythm with 8–16px contextual component curves.
              </p>
            </div>
          </div>
        )}

        {activeCategory === 'layout' && (
          <div className="space-y-3">
            <div className="bg-[#1C1C1C] rounded-xl border border-[#282828] p-3 space-y-2">
              <span className="text-xs font-semibold text-[#EDEDED]">12-Column Responsive Grid</span>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Strata alignment bounds auto-adjust when switching between Desktop (12-col), Tablet (8-col), and Mobile (4-col).
              </p>
              <div className="grid grid-cols-6 gap-1 pt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 rounded bg-[#242424] border border-[#2E2E2E]" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
