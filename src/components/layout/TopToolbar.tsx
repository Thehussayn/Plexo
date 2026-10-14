import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  EyeOff,
  Code2,
  ChevronDown,
  Check,
  Sparkles,
  Columns3,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const TopToolbar: React.FC = () => {
  const {
    viewportMode,
    setViewportMode,
    canvasViewMode,
    setCanvasViewMode,
    viewMode,
    setViewMode,
    isPreviewMode,
    setIsPreviewMode,
    canUndo,
    canRedo,
    undo,
    redo,
    pages,
    currentPageId,
    setCurrentPageId,
    toggleSidebarTab,
  } = useEditor();

  const [isPublished, setIsPublished] = useState(false);
  const [isSavedDraft, setIsSavedDraft] = useState(false);

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 2200);
  };

  const handleSaveDraft = () => {
    setIsSavedDraft(true);
    setTimeout(() => setIsSavedDraft(false), 1800);
  };

  return (
    <header className="h-11 bg-[#161616] border-b border-[#242424] flex items-center justify-between px-3.5 select-none z-30 shrink-0 text-xs font-sans text-[#9CA3AF]">
      {/* LEFT: Page Selector Dropdown */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-[#1C1C1C] hover:bg-[#222222] px-2.5 py-1 rounded-lg border border-[#282828] transition-colors">
          <span className="text-[10px] font-semibold text-purple-400 font-mono uppercase tracking-wider">
            PAGE
          </span>
          <div className="relative flex items-center">
            <select
              value={currentPageId}
              onChange={(e) => setCurrentPageId(e.target.value)}
              className="appearance-none bg-transparent text-[#EDEDED] font-medium text-xs pr-4 cursor-pointer focus:outline-none"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#161616] text-[#EDEDED]">
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#6B7280] absolute right-0 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* CENTER: Responsive Device Modes + View Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (⌘Z)"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              canUndo
                ? 'text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#222222] cursor-pointer'
                : 'text-[#444444] cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (⇧⌘Z)"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              canRedo
                ? 'text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#222222] cursor-pointer'
                : 'text-[#444444] cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-3.5 bg-[#262626]" />

        {/* Compact Responsive Device Pill */}
        <div className="flex items-center bg-[#1C1C1C] p-0.5 rounded-xl border border-[#282828] shadow-inner">
          <button
            onClick={() => {
              if (canvasViewMode === 'all') setCanvasViewMode('focused');
              setViewportMode('desktop');
            }}
            title="Desktop · Fluid Canvas"
            className={`px-2.5 h-6 rounded-lg flex items-center gap-1.5 text-[11px] transition-all cursor-pointer ${
              canvasViewMode === 'focused' && viewportMode === 'desktop'
                ? 'bg-[#2A2A2A] text-[#EDEDED] font-semibold shadow-sm'
                : 'text-[#9CA3AF] hover:text-[#EDEDED]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => {
              if (canvasViewMode === 'all') setCanvasViewMode('focused');
              setViewportMode('tablet');
            }}
            title="Tablet · 768px"
            className={`px-2.5 h-6 rounded-lg flex items-center gap-1.5 text-[11px] transition-all cursor-pointer ${
              canvasViewMode === 'focused' && viewportMode === 'tablet'
                ? 'bg-[#2A2A2A] text-[#EDEDED] font-semibold shadow-sm'
                : 'text-[#9CA3AF] hover:text-[#EDEDED]'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] hidden sm:inline">768px</span>
          </button>
          <button
            onClick={() => {
              if (canvasViewMode === 'all') setCanvasViewMode('focused');
              setViewportMode('mobile');
            }}
            title="Mobile · 375px"
            className={`px-2.5 h-6 rounded-lg flex items-center gap-1.5 text-[11px] transition-all cursor-pointer ${
              canvasViewMode === 'focused' && viewportMode === 'mobile'
                ? 'bg-[#2A2A2A] text-[#EDEDED] font-semibold shadow-sm'
                : 'text-[#9CA3AF] hover:text-[#EDEDED]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] hidden sm:inline">375px</span>
          </button>
          <button
            onClick={() => {
              setCanvasViewMode('all');
            }}
            title="All Breakpoints · Side-by-side"
            className={`px-2.5 h-6 rounded-lg flex items-center gap-1.5 text-[11px] transition-all cursor-pointer ${
              canvasViewMode === 'all'
                ? 'bg-[#2A2A2A] text-purple-300 font-semibold shadow-sm'
                : 'text-[#9CA3AF] hover:text-[#EDEDED]'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] hidden sm:inline">All</span>
          </button>
        </div>

        <div className="w-[1px] h-3.5 bg-[#262626]" />

        {/* View Mode Toggle: Design | Code */}
        <div className="flex items-center bg-[#1C1C1C] p-0.5 rounded-xl border border-[#282828]">
          <button
            onClick={() => setViewMode('design')}
            className={`px-2.5 h-6 rounded-lg text-[11px] transition-all cursor-pointer ${
              viewMode === 'design'
                ? 'bg-[#2A2A2A] text-[#EDEDED] font-semibold'
                : 'text-[#9CA3AF] hover:text-[#EDEDED]'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'code' ? 'design' : 'code')}
            className={`px-2.5 h-6 rounded-lg text-[11px] transition-all cursor-pointer ${
              viewMode === 'code'
                ? 'bg-[#2A2A2A] text-[#EDEDED] font-semibold'
                : 'text-[#9CA3AF] hover:text-[#EDEDED]'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* RIGHT: SOL Tool | Preview | Draft | Publish */}
      <div className="flex items-center gap-2">
        {/* SOL Workspace Tool Trigger */}
        <button
          onClick={() => toggleSidebarTab('sol')}
          title="Open SOL AI Tool"
          className="flex items-center gap-1 px-2.5 h-7 rounded-lg text-[#9CA3AF] hover:text-purple-300 hover:bg-[#202020] border border-[#2A2A2A] transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-medium hidden sm:inline">SOL</span>
        </button>

        {/* Preview Toggle */}
        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          title={isPreviewMode ? 'Exit Preview' : 'Preview Site'}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors border cursor-pointer ${
            isPreviewMode
              ? 'bg-[#7C3AED]/20 text-purple-300 border-[#7C3AED]/40'
              : 'border-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#202020]'
          }`}
        >
          {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>

        {/* Save Draft */}
        <button
          onClick={handleSaveDraft}
          className="px-2.5 h-7 rounded-lg bg-[#1C1C1C] hover:bg-[#242424] border border-[#2A2A2A] text-[#EDEDED] text-[11px] font-medium transition-colors cursor-pointer"
        >
          {isSavedDraft ? 'Saved!' : 'Save Draft'}
        </button>

        {/* Publish CTA */}
        <button
          onClick={handlePublish}
          className="flex items-center gap-1.5 px-3 h-7 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          {isPublished ? <Check className="w-3.5 h-3.5" /> : null}
          <span>{isPublished ? 'Published' : 'Publish'}</span>
        </button>
      </div>
    </header>
  );
};
