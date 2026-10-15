import React, { useState } from 'react';
import {
  Sliders,
  ChevronDown,
  ChevronRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Plus,
  Minus,
  Check,
  Globe,
  FileText,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { ElementStyles } from '../../types/editor';

const fontFamilies = [
  'Public Sans',
  'Inter',
  'Plus Jakarta Sans',
  'Geist',
  'Roboto',
  'Fira Code',
  'Playfair Display',
];

const fontWeights = [
  { label: 'Light', value: '300' },
  { label: 'Regular', value: '400' },
  { label: 'Medium', value: '500' },
  { label: 'SemiBold', value: '600' },
  { label: 'Bold', value: '700' },
];

const presetBackgroundImages = [
  { name: 'None', url: '' },
  { name: 'Subtle Grid', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Dark Mesh', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Radial Glow', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80' },
];

export const PageInspector: React.FC = () => {
  const {
    documentTree,
    resolveStyles,
    updateNodeStyles,
    currentPage,
    viewportMode,
  } = useEditor();

  const styles = resolveStyles(documentTree);

  // Section collapse states (Advanced collapsed by default)
  const [layoutOpen, setLayoutOpen] = useState(true);
  const [appearanceOpen, setAppearanceOpen] = useState(true);
  const [typographyOpen, setTypographyOpen] = useState(true);
  const [linksOpen, setLinksOpen] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [showImagePresets, setShowImagePresets] = useState(false);

  // Layout helper values
  const currentMaxWidth = styles.maxWidth || '1200px';
  const numericMaxWidth = parseInt(currentMaxWidth, 10) || 1200;
  const currentAlign = styles.horizontalAlign || 'center';
  const currentPadding = parseInt(styles.padding || '24px', 10) || 24;
  const currentMargin = parseInt(styles.margin || '0px', 10) || 0;

  const handleUpdate = (updated: Partial<ElementStyles>) => {
    updateNodeStyles(documentTree.id, updated);
  };

  return (
    <aside className="w-[260px] bg-[#161616] border-l border-[#242424] flex flex-col h-full select-none shrink-0 z-20 font-sans text-xs text-[#9CA3AF]">
      {/* 1. Header: Page Title */}
      <div className="h-10 px-3.5 border-b border-[#242424] flex items-center justify-between shrink-0 bg-[#141414]">
        <div className="flex items-center gap-2 min-w-0">
          <Sliders className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="font-semibold text-[#EDEDED] text-xs tracking-tight truncate">
            Page
          </span>
          <span className="text-[10px] text-purple-300 font-mono bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40 shrink-0">
            {currentPage?.name || 'Home'}
          </span>
        </div>
        <span className="text-[10px] text-[#6B7280] font-mono capitalize">{viewportMode}</span>
      </div>

      {/* 2. Scrollable Sections (Divided by subtle 1px dividers) */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#242424]">
        {/* SECTION: LAYOUT */}
        <div>
          <button
            onClick={() => setLayoutOpen(!layoutOpen)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-[#EDEDED] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <span>Layout</span>
            {layoutOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />}
          </button>

          {layoutOpen && (
            <div className="px-3.5 pb-3.5 space-y-3">
              {/* Max Page Width */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="text-[#9CA3AF]">Max Width</label>
                  <span className="text-[#6B7280] font-mono text-[10px]">{numericMaxWidth}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="640"
                    max="1920"
                    step="20"
                    value={numericMaxWidth}
                    onChange={(e) => handleUpdate({ maxWidth: `${e.target.value}px` })}
                    className="flex-1 accent-purple-600 cursor-pointer h-1 bg-[#262626] rounded"
                  />
                  <div className="w-16 flex items-center bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2 py-1 text-xs text-[#EDEDED] font-mono">
                    <input
                      type="number"
                      value={numericMaxWidth}
                      onChange={(e) => handleUpdate({ maxWidth: `${e.target.value || 1200}px` })}
                      className="w-full bg-transparent focus:outline-none"
                    />
                    <span className="text-[10px] text-[#6B7280]">px</span>
                  </div>
                </div>
              </div>

              {/* Horizontal Alignment */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9CA3AF] block">Alignment</label>
                <div className="grid grid-cols-3 gap-1 bg-[#1A1A1A] p-0.5 rounded-lg border border-[#282828]">
                  <button
                    onClick={() => handleUpdate({ horizontalAlign: 'left' })}
                    title="Align Left"
                    className={`py-1 rounded-md flex items-center justify-center gap-1 text-[11px] transition-colors cursor-pointer ${
                      currentAlign === 'left'
                        ? 'bg-[#2A2A2A] text-[#EDEDED] font-medium shadow-sm'
                        : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                    }`}
                  >
                    <AlignLeft className="w-3 h-3" />
                    <span>Left</span>
                  </button>
                  <button
                    onClick={() => handleUpdate({ horizontalAlign: 'center' })}
                    title="Align Center"
                    className={`py-1 rounded-md flex items-center justify-center gap-1 text-[11px] transition-colors cursor-pointer ${
                      currentAlign === 'center'
                        ? 'bg-[#2A2A2A] text-[#EDEDED] font-medium shadow-sm'
                        : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                    }`}
                  >
                    <AlignCenter className="w-3 h-3" />
                    <span>Center</span>
                  </button>
                  <button
                    onClick={() => handleUpdate({ horizontalAlign: 'right' })}
                    title="Align Right"
                    className={`py-1 rounded-md flex items-center justify-center gap-1 text-[11px] transition-colors cursor-pointer ${
                      currentAlign === 'right'
                        ? 'bg-[#2A2A2A] text-[#EDEDED] font-medium shadow-sm'
                        : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                    }`}
                  >
                    <AlignRight className="w-3 h-3" />
                    <span>Right</span>
                  </button>
                </div>
              </div>

              {/* Padding */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="text-[#9CA3AF]">Padding</label>
                  <span className="text-[#6B7280] font-mono text-[10px]">All Sides</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1 text-xs text-[#EDEDED] font-mono">
                    <input
                      type="number"
                      value={currentPadding}
                      onChange={(e) => handleUpdate({ padding: `${e.target.value || 0}px` })}
                      className="w-full bg-transparent focus:outline-none"
                    />
                    <span className="text-[10px] text-[#6B7280]">px</span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg p-0.5">
                    <button
                      onClick={() => handleUpdate({ padding: `${Math.max(0, currentPadding - 4)}px` })}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#2A2A2A] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleUpdate({ padding: `${currentPadding + 4}px` })}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#2A2A2A] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Margin */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="text-[#9CA3AF]">Margin</label>
                  <span className="text-[#6B7280] font-mono text-[10px]">Top / Bottom</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1 text-xs text-[#EDEDED] font-mono">
                    <input
                      type="number"
                      value={currentMargin}
                      onChange={(e) => handleUpdate({ margin: `${e.target.value || 0}px` })}
                      className="w-full bg-transparent focus:outline-none"
                    />
                    <span className="text-[10px] text-[#6B7280]">px</span>
                  </div>
                  <div className="flex items-center gap-0.5 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg p-0.5">
                    <button
                      onClick={() => handleUpdate({ margin: `${Math.max(0, currentMargin - 4)}px` })}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#2A2A2A] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleUpdate({ margin: `${currentMargin + 4}px` })}
                      className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#2A2A2A] text-gray-300 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: APPEARANCE */}
        <div>
          <button
            onClick={() => setAppearanceOpen(!appearanceOpen)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-[#EDEDED] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <span>Appearance</span>
            {appearanceOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />}
          </button>

          {appearanceOpen && (
            <div className="px-3.5 pb-3.5 space-y-3">
              {/* Background Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9CA3AF] block">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.backgroundColor || '#141414'}
                    onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-[#2A2A2A] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.backgroundColor || '#141414'}
                    onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                    className="flex-1 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1 text-xs text-[#EDEDED] font-mono focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              {/* Dark Mode Background */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9CA3AF] block">Dark Mode Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.darkModeBackgroundColor || '#0D0D0D'}
                    onChange={(e) => handleUpdate({ darkModeBackgroundColor: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-[#2A2A2A] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.darkModeBackgroundColor || '#0D0D0D'}
                    onChange={(e) => handleUpdate({ darkModeBackgroundColor: e.target.value })}
                    className="flex-1 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1 text-xs text-[#EDEDED] font-mono focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              {/* Background Image */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <label className="text-[#9CA3AF]">Background Image</label>
                  <button
                    onClick={() => setShowImagePresets(!showImagePresets)}
                    className="text-[10px] text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    {showImagePresets ? 'Hide presets' : 'Choose Image'}
                  </button>
                </div>

                {showImagePresets && (
                  <div className="grid grid-cols-2 gap-1.5 p-2 bg-[#1A1A1A] rounded-lg border border-[#282828] mb-2">
                    {presetBackgroundImages.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          handleUpdate({
                            backgroundImage: preset.url || undefined,
                            backgroundSize: preset.url ? 'cover' : undefined,
                          });
                        }}
                        className={`px-2 py-1.5 rounded text-[10px] text-left truncate transition-colors cursor-pointer ${
                          (styles.backgroundImage || '') === preset.url
                            ? 'bg-purple-900/40 text-purple-300 font-medium border border-purple-700/50'
                            : 'bg-[#222222] text-gray-400 hover:text-gray-200 hover:bg-[#282828]'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Image URL (optional)"
                      value={styles.backgroundImage || ''}
                      onChange={(e) =>
                        handleUpdate({
                          backgroundImage: e.target.value || undefined,
                          backgroundSize: e.target.value ? 'cover' : undefined,
                        })
                      }
                      className="w-full bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg pl-7 pr-2.5 py-1 text-xs text-[#EDEDED] placeholder-[#555] font-mono focus:outline-none focus:border-purple-500/60"
                    />
                    <ImageIcon className="w-3.5 h-3.5 text-gray-500 absolute left-2 top-1/2 -translate-y-1/2" />
                  </div>
                  {styles.backgroundImage && (
                    <button
                      onClick={() => handleUpdate({ backgroundImage: undefined })}
                      title="Clear background image"
                      className="px-2 py-1 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] text-gray-400 hover:text-red-400 text-xs transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: TYPOGRAPHY */}
        <div>
          <button
            onClick={() => setTypographyOpen(!typographyOpen)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-[#EDEDED] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <span>Typography</span>
            {typographyOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />}
          </button>

          {typographyOpen && (
            <div className="px-3.5 pb-3.5 space-y-3">
              {/* Font Family */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9CA3AF] block">Font Family</label>
                <div className="relative">
                  <select
                    value={styles.fontFamily || 'Inter'}
                    onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                    className="w-full appearance-none bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1.5 text-xs text-[#EDEDED] font-medium pr-7 cursor-pointer focus:outline-none focus:border-purple-500/60"
                  >
                    {fontFamilies.map((font) => (
                      <option key={font} value={font} className="bg-[#181818] text-[#EDEDED]">
                        {font}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Font Weight */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9CA3AF] block">Font Weight</label>
                <div className="relative">
                  <select
                    value={styles.fontWeight || '400'}
                    onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
                    className="w-full appearance-none bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1.5 text-xs text-[#EDEDED] font-medium pr-7 cursor-pointer focus:outline-none focus:border-purple-500/60"
                  >
                    {fontWeights.map((w) => (
                      <option key={w.value} value={w.value} className="bg-[#181818] text-[#EDEDED]">
                        {w.label} ({w.value})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9CA3AF] block">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.textColor || '#F3F4F6'}
                    onChange={(e) => handleUpdate({ textColor: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-[#2A2A2A] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.textColor || '#F3F4F6'}
                    onChange={(e) => handleUpdate({ textColor: e.target.value })}
                    className="flex-1 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1 text-xs text-[#EDEDED] font-mono focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: LINKS */}
        <div>
          <button
            onClick={() => setLinksOpen(!linksOpen)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-[#EDEDED] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <span>Links</span>
            {linksOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />}
          </button>

          {linksOpen && (
            <div className="px-3.5 pb-3.5 space-y-3">
              {/* Link Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9CA3AF] block">Link Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.linkColor || '#8B5CF6'}
                    onChange={(e) => handleUpdate({ linkColor: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-[#2A2A2A] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.linkColor || '#8B5CF6'}
                    onChange={(e) => handleUpdate({ linkColor: e.target.value })}
                    className="flex-1 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1 text-xs text-[#EDEDED] font-mono focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              {/* Hover Color */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-[#9CA3AF] block">Hover Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.linkHoverColor || '#A78BFA'}
                    onChange={(e) => handleUpdate({ linkHoverColor: e.target.value })}
                    className="w-7 h-7 rounded-lg border border-[#2A2A2A] bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.linkHoverColor || '#A78BFA'}
                    onChange={(e) => handleUpdate({ linkHoverColor: e.target.value })}
                    className="flex-1 bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1 text-xs text-[#EDEDED] font-mono focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              {/* Underline Links Toggle */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-[#9CA3AF]">Underline Links</span>
                <button
                  type="button"
                  onClick={() => handleUpdate({ underlineLinks: !styles.underlineLinks })}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    styles.underlineLinks ? 'bg-[#96F02E]' : 'bg-[#2A2A2A]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full ${styles.underlineLinks ? 'bg-black' : 'bg-white'} shadow transform transition-transform absolute top-0.5 ${
                      styles.underlineLinks ? 'left-4.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Underline on Hover Toggle */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#9CA3AF]">Underline on Hover</span>
                <button
                  type="button"
                  onClick={() => handleUpdate({ underlineOnHover: !styles.underlineOnHover })}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    styles.underlineOnHover ? 'bg-[#96F02E]' : 'bg-[#2A2A2A]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full ${styles.underlineOnHover ? 'bg-black' : 'bg-white'} shadow transform transition-transform absolute top-0.5 ${
                      styles.underlineOnHover ? 'left-4.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: ADVANCED (Collapsed by default) */}
        <div>
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-[#EDEDED] hover:bg-[#1A1A1A] transition-colors cursor-pointer"
          >
            <span>Advanced</span>
            {advancedOpen ? <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />}
          </button>

          {advancedOpen && (
            <div className="px-3.5 pb-3.5 space-y-3 bg-[#131313]">
              {/* Page Title & Slug */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Page Title</label>
                <div className="px-2.5 py-1 rounded-lg bg-[#1F1F1F] border border-[#2A2A2A] text-xs text-[#EDEDED] font-medium">
                  {currentPage?.name || 'Home'}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#9CA3AF] uppercase font-semibold">URL Path</label>
                <div className="px-2.5 py-1 rounded-lg bg-[#1F1F1F] border border-[#2A2A2A] text-xs text-[#9CA3AF] font-mono">
                  {currentPage?.slug || '/'}
                </div>
              </div>

              {/* Custom CSS Classes */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Custom Classes</label>
                <input
                  type="text"
                  placeholder="e.g. site-home antialiased"
                  value={styles.customClasses || ''}
                  onChange={(e) => handleUpdate({ customClasses: e.target.value })}
                  className="w-full bg-[#1F1F1F] border border-[#2A2A2A] rounded-lg px-2.5 py-1 text-xs text-[#EDEDED] font-mono focus:outline-none focus:border-purple-500/60"
                />
              </div>

              {/* SEO Summary */}
              <div className="p-2.5 bg-[#181818] rounded-lg border border-[#262626] text-[11px] text-[#888] space-y-1">
                <div className="font-semibold text-gray-300 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-purple-400" />
                  <span>Search Engine Preview</span>
                </div>
                <div className="text-purple-300 font-medium truncate">{currentPage?.name} | Plexo Site</div>
                <div className="text-[10px] text-gray-500 font-mono">https://yoursite.plexo.app/{currentPage?.slug || ''}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
