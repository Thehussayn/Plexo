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
    documentTree,
  } = useEditor();

  const [isPublished, setIsPublished] = useState(false);
  const [isSavedDraft, setIsSavedDraft] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);

  const handlePublish = () => {
    try {
      localStorage.setItem(
        'plexo_editor_published_v2',
        JSON.stringify({
          documentTree,
          pages,
          publishedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.error('Publish error:', e);
    }
    setIsPublished(true);
    setTimeout(() => setIsPublished(false), 2500);
  };

  const handleSaveDraft = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      localStorage.setItem(
        'plexo_editor_draft_v2',
        JSON.stringify({
          documentTree,
          pages,
          savedAt: timeStr,
        })
      );
    } catch (e) {
      console.error('Save draft error:', e);
    }
    setSavedTime(timeStr);
    setIsSavedDraft(true);
    setTimeout(() => setIsSavedDraft(false), 2000);
  };

  return (
    <header className="h-11 bg-[#161616] border-b border-[#242424] flex items-center justify-between px-3.5 select-none z-30 shrink-0 text-xs font-sans text-[#9CA3AF]">
      {/* LEFT: Page Selector Dropdown */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 bg-[#1C1C1C] hover:bg-[#222222] px-2.5 py-1 rounded-lg border border-[#282828] transition-colors">
          <span className="text-[10px] font-semibold text-[#96F02E] font-mono uppercase tracking-wider">
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
        <div className="flex items-center bg-[#1C1C1C] p-0.5 rounded-xl border border-[#282828]">
          <button
            onClick={() => {
              if (canvasViewMode === 'all') setCanvasViewMode('focused');
              setViewportMode('desktop');
            }}
            title="Desktop · Fluid Canvas"
            className={`px-2.5 h-6 rounded-lg flex items-center gap-1.5 text-[11px] transition-all cursor-pointer ${
              canvasViewMode === 'focused' && viewportMode === 'desktop'
                ? 'bg-[#2A2A2A] text-[#EDEDED] font-semibold'
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
                ? 'bg-[#2A2A2A] text-[#EDEDED] font-semibold'
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
                ? 'bg-[#2A2A2A] text-[#EDEDED] font-semibold'
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
                ? 'bg-[#2A2A2A] text-[#96F02E] font-semibold'
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
          className="flex items-center gap-1 px-2.5 h-7 rounded-lg text-[#9CA3AF] hover:text-[#96F02E] hover:bg-[#202020] border border-[#2A2A2A] transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#96F02E]" />
          <span className="text-[11px] font-medium hidden sm:inline">SOL</span>
        </button>

        {/* Preview Toggle */}
        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          title={isPreviewMode ? 'Exit Preview' : 'Preview Site'}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors border cursor-pointer ${
            isPreviewMode
              ? 'bg-[#96F02E]/15 text-[#96F02E] border-[#96F02E]/30'
              : 'border-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#202020]'
          }`}
        >
          {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>

        {/* Save Draft */}
        <button
          onClick={handleSaveDraft}
          title={savedTime ? `Last saved at ${savedTime}` : 'Save current canvas to local draft'}
          className={`flex items-center gap-1.5 px-2.5 h-7 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
            isSavedDraft
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50'
              : 'bg-[#1C1C1C] hover:bg-[#242424] border-[#2A2A2A] text-[#EDEDED]'
          }`}
        >
          {isSavedDraft ? <Check className="w-3 h-3 text-emerald-400" /> : null}
          <span>{isSavedDraft ? 'Saved!' : 'Save Draft'}</span>
        </button>

        {/* Publish CTA */}
        <button
          onClick={handlePublish}
          className="flex items-center gap-1.5 px-3.5 h-7 rounded-lg bg-[#96F02E] hover:bg-[#85DC20] active:bg-[#78C91C] text-black text-xs font-semibold shadow-none transition-all cursor-pointer"
        >
          {isPublished ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : null}
          <span>{isPublished ? 'Published' : 'Publish'}</span>
        </button>
      </div>
    </header>
  );
};
