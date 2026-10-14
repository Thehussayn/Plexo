import React, { useState, useMemo } from 'react';
import {
  X,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw,
  Sliders,
  MousePointer,
  Grid,
  Layers,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Move,
  ArrowDownToLine,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
} from 'lucide-react';
import { useEditor, findParentNode } from '../../context/EditorContext';
import { DocumentNode, SizingMode, ElementStyles, LayoutMode } from '../../types/editor';
import { ConstraintsSection } from './sections/ConstraintsSection';
import { LayoutDiagnostics } from './sections/LayoutDiagnostics';
import { PageInspector } from './PageInspector';

function getTrail(root: DocumentNode, targetId: string): DocumentNode[] {
  if (root.id === targetId) return [root];
  if (root.children) {
    for (const child of root.children) {
      const sub = getTrail(child, targetId);
      if (sub.length > 0) return [root, ...sub];
    }
  }
  return [];
}

export const PropertiesPanel: React.FC = () => {
  const {
    selectedNode,
    selectedNodeIds,
    selectNodes,
    selectNode,
    deleteNode,
    duplicateNode,
    documentTree,
    viewportMode,
    resolveStyles,
    updateNodeStyles,
    updateNodeContent,
    updateNodeProps,
    resetResponsiveStyle,
    resetAllResponsiveOverrides,
    isOverridden,
    updateNodeResponsiveVisibility,
    currentPage,
    setContainerLayoutMode,
    alignNodeInParent,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    detachElementToFreePosition,
    returnElementToStructuredLayout,
    alignSelectedNodes,
    distributeSelectedNodes,
    canvasZoom,
  } = useEditor();

  const [responsiveOpen, setResponsiveOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const trail = useMemo(() => {
    if (!selectedNode) return [];
    return getTrail(documentTree, selectedNode.id);
  }, [documentTree, selectedNode]);

  // When Multiple Elements are selected, show MultiSelectionInspector
  if (selectedNodeIds && selectedNodeIds.length > 1) {
    return (
      <div className="flex flex-col h-full bg-[#18181B] text-[#EDEDED] select-none text-xs">
        {/* Header */}
        <div className="h-10 px-3 flex items-center justify-between border-b border-[#2C2C2C]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-semibold text-xs text-[#EDEDED]">
              {selectedNodeIds.length} Elements Selected
            </span>
          </div>
          <button
            onClick={() => selectNodes([])}
            className="text-[11px] text-[#9CA3AF] hover:text-[#EDEDED] px-1.5 py-0.5 rounded hover:bg-[#2A2A2A] transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2C2C2C]">
          {/* Alignment & Distribution Section */}
          <div className="p-3 space-y-3">
            <div className="text-[11px] font-semibold text-[#EDEDED]">Alignment</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="w-16 text-[11px] text-[#9CA3AF] shrink-0">Horizontal</label>
                <div className="flex items-center gap-1 bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1 justify-between">
                  <button
                    onClick={() => alignSelectedNodes('left')}
                    title="Align Left"
                    className="flex-1 py-1 flex items-center justify-center rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] transition-colors"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alignSelectedNodes('center')}
                    title="Align Center"
                    className="flex-1 py-1 flex items-center justify-center rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] transition-colors"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alignSelectedNodes('right')}
                    title="Align Right"
                    className="flex-1 py-1 flex items-center justify-center rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] transition-colors"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-16 text-[11px] text-[#9CA3AF] shrink-0">Vertical</label>
                <div className="flex items-center gap-1 bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1 justify-between">
                  <button
                    onClick={() => alignSelectedNodes('top')}
                    title="Align Top"
                    className="flex-1 py-1 flex items-center justify-center rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] transition-colors"
                  >
                    <AlignStartVertical className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alignSelectedNodes('middle')}
                    title="Align Middle"
                    className="flex-1 py-1 flex items-center justify-center rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] transition-colors"
                  >
                    <AlignCenterVertical className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alignSelectedNodes('bottom')}
                    title="Align Bottom"
                    className="flex-1 py-1 flex items-center justify-center rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] transition-colors"
                  >
                    <AlignEndVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-16 text-[11px] text-[#9CA3AF] shrink-0">Distribute</label>
                <div className="flex items-center gap-1 bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1">
                  <button
                    onClick={() => distributeSelectedNodes('horizontal')}
                    title="Distribute Horizontally"
                    className="flex-1 py-1 flex items-center justify-center gap-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] transition-colors text-[11px]"
                  >
                    <AlignHorizontalDistributeCenter className="w-3.5 h-3.5" />
                    <span>Horizontal</span>
                  </button>
                  <button
                    onClick={() => distributeSelectedNodes('vertical')}
                    title="Distribute Vertically"
                    className="flex-1 py-1 flex items-center justify-center gap-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED] transition-colors text-[11px]"
                  >
                    <AlignVerticalDistributeCenter className="w-3.5 h-3.5" />
                    <span>Vertical</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 space-y-2">
            <div className="text-[11px] font-semibold text-[#EDEDED]">Actions</div>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => {
                  selectedNodeIds.forEach((id) => {
                    const el = document.getElementById(id);
                    const parentEl = el?.parentElement;
                    if (el && parentEl) {
                      const elRect = el.getBoundingClientRect();
                      const parentRect = parentEl.getBoundingClientRect();
                      const zoomScale = Math.max(0.2, (canvasZoom || 100) / 100);
                      const relX = (elRect.left - parentRect.left) / zoomScale;
                      const relY = (elRect.top - parentRect.top) / zoomScale;
                      detachElementToFreePosition(id, {
                        x: Math.round(relX),
                        y: Math.round(relY),
                        width: Math.round(elRect.width / zoomScale),
                        height: Math.round(elRect.height / zoomScale),
                      });
                    } else {
                      detachElementToFreePosition(id);
                    }
                  });
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-700/50 text-purple-300 transition-colors cursor-pointer"
              >
                <Move className="w-3.5 h-3.5" />
                <span className="font-medium text-[11px]">Free Position All</span>
              </button>

              <button
                onClick={() => {
                  selectedNodeIds.forEach((id) => returnElementToStructuredLayout(id));
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-[#242427] hover:bg-[#2A2A2E] border border-[#333336] text-[#EDEDED] transition-colors cursor-pointer"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-medium text-[11px]">Return All to Layout</span>
              </button>

              <button
                onClick={() => {
                  selectedNodeIds.forEach((id) => deleteNode(id));
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 text-red-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="font-medium text-[11px]">Delete Selected</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // When Page is selected (or no child element is selected), show PageInspector
  if (!selectedNode || selectedNode.type === 'page' || selectedNode.id === documentTree.id) {
    return <PageInspector />;
  }

  const styles = resolveStyles(selectedNode);

  const parentInfo = findParentNode(documentTree, selectedNode.id);
  const parent = parentInfo?.parent;
  const parentLayoutMode = parent?.styles.layoutMode || 'free';
  const isFreeChild = true;
  const isGridChild = parentLayoutMode === 'grid';

  const isTextElement =
    selectedNode.type === 'heading' ||
    selectedNode.type === 'paragraph' ||
    selectedNode.type === 'button' ||
    selectedNode.type === 'badge';

  const isContainer =
    selectedNode.type === 'container' ||
    selectedNode.type === 'section' ||
    selectedNode.type === 'card' ||
    selectedNode.type === 'columns' ||
    selectedNode.type === 'column';

  // Sizing mode determination
  const widthSizing: SizingMode =
    styles.widthSizing ||
    (styles.isFullWidth || styles.width === '100%' || styles.customWidth === '100%'
      ? 'fill'
      : styles.customWidth || (styles.width && styles.width !== 'auto')
      ? 'fixed'
      : 'hug');

  const heightSizing: SizingMode =
    styles.heightSizing ||
    (styles.minHeight && styles.minHeight !== '0px' && styles.minHeight !== 'auto'
      ? 'fixed'
      : 'hug');

  const handleWidthChange = (mode: SizingMode) => {
    if (mode === 'fill') {
      updateNodeStyles(selectedNode.id, {
        widthSizing: 'fill',
        width: '100%',
        customWidth: '100%',
        isFullWidth: true,
      });
    } else if (mode === 'hug') {
      updateNodeStyles(selectedNode.id, {
        widthSizing: 'hug',
        width: 'auto',
        customWidth: undefined,
        isFullWidth: false,
      });
    } else {
      updateNodeStyles(selectedNode.id, {
        widthSizing: 'fixed',
        customWidth: '80%',
        isFullWidth: false,
      });
    }
  };

  const handleHeightChange = (mode: SizingMode) => {
    if (mode === 'fixed') {
      updateNodeStyles(selectedNode.id, {
        heightSizing: 'fixed',
        minHeight: '240px',
      });
    } else {
      updateNodeStyles(selectedNode.id, {
        heightSizing: 'hug',
        minHeight: 'auto',
      });
    }
  };

  const hasResponsiveOverrides =
    viewportMode !== 'desktop' &&
    Boolean(
      selectedNode.responsive?.[viewportMode] &&
        Object.keys(selectedNode.responsive[viewportMode] || {}).length > 0
    );

  return (
    <aside className="w-[260px] bg-[#161616] border-l border-[#242424] flex flex-col h-full select-none shrink-0 z-20 font-sans text-xs text-[#9CA3AF]">
      {/* 1. Header: Element Name, Tag & Header Actions */}
      <div className="h-10 px-3.5 border-b border-[#242424] flex items-center justify-between shrink-0 bg-[#141414]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-[#EDEDED] capitalize truncate max-w-[110px]">
            {selectedNode.name}
          </span>
          <span className="text-[10px] text-purple-400 font-mono bg-purple-950/60 px-1 py-0.2 rounded border border-purple-800/40 shrink-0">
            {selectedNode.type === 'heading' ? `H${selectedNode.props?.level || 2}` : selectedNode.type}
          </span>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => duplicateNode(selectedNode.id)}
            title="Duplicate (⌘D)"
            className="w-6 h-6 rounded flex items-center justify-center text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#242424] transition-colors"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={() => deleteNode(selectedNode.id)}
            title="Delete (⌫)"
            className="w-6 h-6 rounded flex items-center justify-center text-[#9CA3AF] hover:text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => selectNode(documentTree.id)}
            title="Deselect to Page (Esc)"
            className="w-6 h-6 rounded flex items-center justify-center text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#242424] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Semantic Breadcrumb Path */}
      {trail.length > 1 && (
        <div className="px-3 py-1 bg-[#121212] border-b border-[#262626] text-[10px] text-[#6B7280] truncate font-mono">
          {trail.map((t, idx) => (
            <React.Fragment key={t.id}>
              {idx > 0 && <span className="mx-1 text-[#3E424F]">&gt;</span>}
              <span className={idx === trail.length - 1 ? 'text-purple-300 font-medium' : ''}>
                {t.name}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Continuous Properties Panel Body (Hairline 1px dividers, zero cards) */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#262626]">
        {/* SECTION: CONTENT (Text, Level, Links) */}
        {('content' in selectedNode || isTextElement || selectedNode.type === 'image') && (
          <div className="p-3 space-y-2">
            <div className="text-[11px] font-semibold text-[#EDEDED]">Content</div>

            {/* Direct Text Input */}
            {'content' in selectedNode && (
              <div className="flex items-start gap-2">
                <label className="w-14 text-[11px] text-[#9CA3AF] pt-1 shrink-0">Text</label>
                {selectedNode.type === 'paragraph' ? (
                  <textarea
                    rows={2}
                    value={selectedNode.content || ''}
                    onChange={(e) => updateNodeContent(selectedNode.id, e.target.value)}
                    className="flex-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none focus:border-[#7C3AED] resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={selectedNode.content || ''}
                    onChange={(e) => updateNodeContent(selectedNode.id, e.target.value)}
                    className="flex-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none focus:border-[#7C3AED]"
                  />
                )}
              </div>
            )}

            {/* Heading Level H1-H6 */}
            {selectedNode.type === 'heading' && (
              <div className="flex items-center gap-2">
                <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Level</label>
                <div className="flex items-center bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1">
                  {[1, 2, 3, 4, 5, 6].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateNodeProps(selectedNode.id, { level: lvl })}
                      className={`flex-1 py-0.5 text-[10px] font-semibold rounded ${
                        (selectedNode.props?.level || 2) === lvl
                          ? 'bg-[#252834] text-[#EDEDED] shadow-sm'
                          : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                      }`}
                    >
                      H{lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Button Props */}
            {selectedNode.type === 'button' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">URL</label>
                  <input
                    type="text"
                    value={selectedNode.props?.href || '#'}
                    onChange={(e) => updateNodeProps(selectedNode.id, { href: e.target.value })}
                    className="flex-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Variant</label>
                  <select
                    value={selectedNode.props?.variant || 'primary'}
                    onChange={(e) => updateNodeProps(selectedNode.id, { variant: e.target.value })}
                    className="flex-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                  </select>
                </div>
              </>
            )}

            {/* Image Props */}
            {selectedNode.type === 'image' && (
              <div className="flex items-center gap-2">
                <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Alt</label>
                <input
                  type="text"
                  value={selectedNode.props?.alt || ''}
                  onChange={(e) => updateNodeProps(selectedNode.id, { alt: e.target.value })}
                  placeholder="Image description"
                  className="flex-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            )}
          </div>
        )}

        {/* SECTION: POSITION & LAYOUT (Flow | Grid | Free) */}
        <div className="p-3 space-y-2">
          <div className="text-[11px] font-semibold text-[#EDEDED]">Layout</div>

          {/* Container Layout Mode Switcher */}
          {isContainer && (
            <div className="flex items-center gap-2">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0 flex items-center gap-1">
                Layout
                {isOverridden(selectedNode, 'layoutMode') && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"
                    title={`Layout mode overridden on ${viewportMode}`}
                  />
                )}
              </label>
              <div className="flex items-center bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1">
                {(['flow', 'grid', 'free'] as LayoutMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setContainerLayoutMode(selectedNode.id, mode)}
                    className={`flex-1 py-1 text-[11px] font-medium capitalize rounded transition-colors ${
                      (styles.layoutMode || 'free') === mode
                        ? 'bg-[#252834] text-purple-300 shadow-sm font-semibold'
                        : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              {isOverridden(selectedNode, 'layoutMode') && (
                <button
                  onClick={() => resetResponsiveStyle(selectedNode.id, 'layoutMode')}
                  title="Reset layout mode to inherited"
                  className="p-1 rounded text-purple-400 hover:text-purple-300 hover:bg-[#2A2A2A]"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Free Layout Child: Position X & Y */}
          {isFreeChild && (
            <div className="flex items-center gap-2">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Position</label>
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-1.5 py-0.5 flex-1 relative group">
                  <span className="text-[10px] text-[#6B7280] font-mono flex items-center gap-0.5">
                    X
                    {isOverridden(selectedNode, 'x') && (
                      <span className="w-1 h-1 rounded-full bg-purple-400 inline-block" title="Overridden on current breakpoint" />
                    )}
                  </span>
                  <input
                    type="number"
                    value={Math.round(styles.x || 0)}
                    onChange={(e) =>
                      updateNodeStyles(selectedNode.id, {
                        x: parseInt(e.target.value, 10) || 0,
                        position: 'absolute',
                      })
                    }
                    className="w-full bg-transparent text-xs text-[#EDEDED] font-mono focus:outline-none"
                  />
                  {isOverridden(selectedNode, 'x') && (
                    <button
                      onClick={() => resetResponsiveStyle(selectedNode.id, 'x')}
                      title="Reset X to inherited"
                      className="opacity-0 group-hover:opacity-100 text-purple-400 hover:text-purple-300 transition-opacity"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-1.5 py-0.5 flex-1 relative group">
                  <span className="text-[10px] text-[#6B7280] font-mono flex items-center gap-0.5">
                    Y
                    {isOverridden(selectedNode, 'y') && (
                      <span className="w-1 h-1 rounded-full bg-purple-400 inline-block" title="Overridden on current breakpoint" />
                    )}
                  </span>
                  <input
                    type="number"
                    value={Math.round(styles.y || 0)}
                    onChange={(e) =>
                      updateNodeStyles(selectedNode.id, {
                        y: parseInt(e.target.value, 10) || 0,
                        position: 'absolute',
                      })
                    }
                    className="w-full bg-transparent text-xs text-[#EDEDED] font-mono focus:outline-none"
                  />
                  {isOverridden(selectedNode, 'y') && (
                    <button
                      onClick={() => resetResponsiveStyle(selectedNode.id, 'y')}
                      title="Reset Y to inherited"
                      className="opacity-0 group-hover:opacity-100 text-purple-400 hover:text-purple-300 transition-opacity"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Width Sizing Mode */}
          <div className="flex items-center gap-2">
            <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Width</label>
            <div className="flex items-center bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1">
              {(['hug', 'fill', 'fixed'] as SizingMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleWidthChange(mode)}
                  className={`flex-1 py-1 text-[11px] font-medium capitalize rounded transition-colors ${
                    widthSizing === mode
                      ? 'bg-[#252834] text-[#EDEDED] shadow-sm font-semibold'
                      : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Height Sizing Mode */}
          <div className="flex items-center gap-2">
            <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Height</label>
            <div className="flex items-center bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1">
              {(['hug', 'fixed'] as SizingMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleHeightChange(mode)}
                  className={`flex-1 py-1 text-[11px] font-medium capitalize rounded transition-colors ${
                    heightSizing === mode
                      ? 'bg-[#252834] text-[#EDEDED] shadow-sm font-semibold'
                      : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Free Layout Child Alignment Buttons */}
          {isFreeChild && (
            <div className="flex items-center gap-2">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Align</label>
              <div className="flex items-center gap-1 bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1 justify-between">
                <button
                  onClick={() => alignNodeInParent(selectedNode.id, 'left')}
                  title="Align Left"
                  className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                >
                  <AlignLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => alignNodeInParent(selectedNode.id, 'center')}
                  title="Align Center Horizontal"
                  className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                >
                  <AlignCenter className="w-3 h-3" />
                </button>
                <button
                  onClick={() => alignNodeInParent(selectedNode.id, 'right')}
                  title="Align Right"
                  className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                >
                  <AlignRight className="w-3 h-3" />
                </button>
                <div className="w-[1px] h-3 bg-[#2D2D2D]" />
                <button
                  onClick={() => alignNodeInParent(selectedNode.id, 'top')}
                  title="Align Top"
                  className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                >
                  <ChevronsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => alignNodeInParent(selectedNode.id, 'middle')}
                  title="Align Middle Vertical"
                  className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                >
                  <Sliders className="w-3 h-3" />
                </button>
                <button
                  onClick={() => alignNodeInParent(selectedNode.id, 'bottom')}
                  title="Align Bottom"
                  className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                >
                  <ChevronsDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Free Layout Child Stacking / Layer Order */}
          {isFreeChild && (
            <div className="flex items-center gap-2">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Layer</label>
              <div className="flex items-center gap-1 flex-1">
                <div className="flex items-center gap-0.5 bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C]">
                  <button
                    onClick={() => bringForward(selectedNode.id)}
                    title="Bring Forward (⌘])"
                    className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => sendBackward(selectedNode.id)}
                    title="Send Backward (⌘[)"
                    className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => bringToFront(selectedNode.id)}
                    title="Bring to Front (⇧⌘])"
                    className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                  >
                    <ChevronsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => sendToBack(selectedNode.id)}
                    title="Send to Back (⇧⌘[)"
                    className="p-1 rounded hover:bg-[#2A2A2A] text-[#9CA3AF] hover:text-[#EDEDED]"
                  >
                    <ChevronsDown className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-1.5 py-0.5 ml-auto">
                  <span className="text-[10px] text-[#6B7280] font-mono">Z</span>
                  <input
                    type="number"
                    value={styles.zIndex || 1}
                    onChange={(e) =>
                      updateNodeStyles(selectedNode.id, {
                        zIndex: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-10 bg-transparent text-xs text-[#EDEDED] font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Grid Child Column Span */}
          {isGridChild && (
            <div className="flex items-center gap-2">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Col Span</label>
              <div className="flex items-center bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1">
                {[1, 2, 3, 4].map((span) => (
                  <button
                    key={span}
                    onClick={() => updateNodeStyles(selectedNode.id, { gridColumnSpan: span })}
                    className={`flex-1 py-1 text-[11px] rounded transition-colors ${
                      (styles.gridColumnSpan || 1) === span
                        ? 'bg-[#252834] text-purple-300 font-semibold'
                        : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                    }`}
                  >
                    {span}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Container Grid Layout: Columns & Gap */}
          {isContainer && styles.layoutMode === 'grid' && (
            <>
              <div className="flex items-center gap-2">
                <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Columns</label>
                <div className="flex items-center bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1">
                  {[1, 2, 3, 4, 6].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => updateNodeStyles(selectedNode.id, { gridColumns: cols })}
                      className={`flex-1 py-1 text-[11px] rounded transition-colors ${
                        (styles.gridColumns || 3) === cols
                          ? 'bg-[#252834] text-purple-300 font-semibold'
                          : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                      }`}
                    >
                      {cols}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Grid Gap</label>
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    type="number"
                    value={parseInt(styles.gap || styles.gridGap || '20', 10)}
                    onChange={(e) =>
                      updateNodeStyles(selectedNode.id, {
                        gap: `${e.target.value}px`,
                        gridGap: `${e.target.value}px`,
                      })
                    }
                    className="w-16 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-[#6B7280]">px</span>
                </div>
              </div>
            </>
          )}

          {/* Container Flow Layout: Flex Direction & Gap */}
          {isContainer && (styles.layoutMode === 'flow' || !styles.layoutMode) && (
            <>
              <div className="flex items-center gap-2">
                <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Direction</label>
                <div className="flex items-center bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] flex-1">
                  <button
                    onClick={() => updateNodeStyles(selectedNode.id, { flexDirection: 'row' })}
                    className={`flex-1 py-1 text-[11px] rounded ${
                      styles.flexDirection === 'row' || !styles.flexDirection
                        ? 'bg-[#252834] text-[#EDEDED] font-medium'
                        : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                    }`}
                  >
                    Row
                  </button>
                  <button
                    onClick={() => updateNodeStyles(selectedNode.id, { flexDirection: 'column' })}
                    className={`flex-1 py-1 text-[11px] rounded ${
                      styles.flexDirection === 'column'
                        ? 'bg-[#252834] text-[#EDEDED] font-medium'
                        : 'text-[#9CA3AF] hover:text-[#EDEDED]'
                    }`}
                  >
                    Column
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Gap</label>
                <div className="flex items-center gap-1.5 flex-1">
                  <input
                    type="number"
                    value={parseInt(styles.gap || '16', 10)}
                    onChange={(e) => updateNodeStyles(selectedNode.id, { gap: `${e.target.value}px` })}
                    className="w-16 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-[#6B7280]">px</span>
                </div>
              </div>
            </>
          )}

          {/* Padding */}
          <div className="flex items-center gap-2">
            <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Padding</label>
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="number"
                value={parseInt(styles.padding || '0', 10)}
                onChange={(e) => updateNodeStyles(selectedNode.id, { padding: `${e.target.value}px` })}
                className="w-16 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#6B7280]">px</span>
            </div>
          </div>
        </div>

        {/* SECTION: CONSTRAINTS (Free Layout Child Only) */}
        {isFreeChild && <ConstraintsSection node={selectedNode} />}

        {/* SECTION: TYPOGRAPHY (Font, Weight, Size, Line, Align, Style) */}
        {isTextElement && (
          <div className="p-3 space-y-2">
            <div className="text-[11px] font-semibold text-[#EDEDED]">Typography</div>

            {/* Font Family */}
            <div className="flex items-center gap-2">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Font</label>
              <select
                value={styles.fontFamily || 'Inter'}
                onChange={(e) => updateNodeStyles(selectedNode.id, { fontFamily: e.target.value })}
                className="flex-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                <option value="Outfit">Outfit</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            {/* Font Weight */}
            <div className="flex items-center gap-2">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Weight</label>
              <select
                value={styles.fontWeight || '400'}
                onChange={(e) => updateNodeStyles(selectedNode.id, { fontWeight: e.target.value })}
                className="flex-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none"
              >
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">ExtraBold (800)</option>
              </select>
            </div>

            {/* Size & Line Height Row */}
            <div className="flex items-center gap-2">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Size</label>
              <div className="flex items-center gap-1.5 flex-1">
                <input
                  type="number"
                  value={parseInt(styles.fontSize || '16', 10)}
                  onChange={(e) => updateNodeStyles(selectedNode.id, { fontSize: `${e.target.value}px` })}
                  className="w-16 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none font-mono"
                />
                <span className="text-[10px] text-[#6B7280]">px</span>

                <span className="text-[11px] text-[#9CA3AF] ml-auto mr-1">Line</span>
                <input
                  type="text"
                  value={styles.lineHeight || '1.2'}
                  onChange={(e) => updateNodeStyles(selectedNode.id, { lineHeight: e.target.value })}
                  className="w-12 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none font-mono text-center"
                />
              </div>
            </div>

            {/* Text Color */}
            <div className="flex items-center gap-2">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Color</label>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="color"
                  value={styles.textColor || '#FFFFFF'}
                  onChange={(e) => updateNodeStyles(selectedNode.id, { textColor: e.target.value })}
                  className="w-5 h-5 rounded border border-[#2C2C2C] bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={styles.textColor || '#FFFFFF'}
                  onChange={(e) => updateNodeStyles(selectedNode.id, { textColor: e.target.value })}
                  className="flex-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] font-mono"
                />
              </div>
            </div>

            {/* Align & Style Formats */}
            <div className="flex items-center gap-2 pt-0.5">
              <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Align</label>
              <div className="flex items-center bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C]">
                <button
                  onClick={() => updateNodeStyles(selectedNode.id, { textAlign: 'left' })}
                  className={`p-1 rounded ${styles.textAlign === 'left' || !styles.textAlign ? 'bg-[#252834] text-[#EDEDED]' : 'text-[#9CA3AF] hover:text-[#EDEDED]'}`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateNodeStyles(selectedNode.id, { textAlign: 'center' })}
                  className={`p-1 rounded ${styles.textAlign === 'center' ? 'bg-[#252834] text-[#EDEDED]' : 'text-[#9CA3AF] hover:text-[#EDEDED]'}`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateNodeStyles(selectedNode.id, { textAlign: 'right' })}
                  className={`p-1 rounded ${styles.textAlign === 'right' ? 'bg-[#252834] text-[#EDEDED]' : 'text-[#9CA3AF] hover:text-[#EDEDED]'}`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center bg-[#1F1F1F] p-0.5 rounded border border-[#2C2C2C] ml-auto">
                <button
                  onClick={() => updateNodeStyles(selectedNode.id, { isBold: !styles.isBold })}
                  className={`p-1 rounded ${styles.isBold ? 'bg-[#7C3AED] text-white' : 'text-[#9CA3AF] hover:text-[#EDEDED]'}`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateNodeStyles(selectedNode.id, { isItalic: !styles.isItalic })}
                  className={`p-1 rounded ${styles.isItalic ? 'bg-[#7C3AED] text-white' : 'text-[#9CA3AF] hover:text-[#EDEDED]'}`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateNodeStyles(selectedNode.id, { isUnderline: !styles.isUnderline })}
                  className={`p-1 rounded ${styles.isUnderline ? 'bg-[#7C3AED] text-white' : 'text-[#9CA3AF] hover:text-[#EDEDED]'}`}
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION: APPEARANCE (Background, Radius, Opacity) */}
        <div className="p-3 space-y-2">
          <div className="text-[11px] font-semibold text-[#EDEDED]">Appearance</div>

          {/* Background Color */}
          <div className="flex items-center gap-2">
            <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Background</label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="color"
                value={styles.backgroundColor && styles.backgroundColor !== 'transparent' ? styles.backgroundColor : '#121622'}
                onChange={(e) => updateNodeStyles(selectedNode.id, { backgroundColor: e.target.value })}
                className="w-5 h-5 rounded border border-[#2C2C2C] bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={styles.backgroundColor || 'transparent'}
                onChange={(e) => updateNodeStyles(selectedNode.id, { backgroundColor: e.target.value })}
                className="flex-1 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] font-mono"
              />
            </div>
          </div>

          {/* Corner Radius */}
          <div className="flex items-center gap-2">
            <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Radius</label>
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="number"
                value={parseInt(styles.borderRadius || '0', 10)}
                onChange={(e) => updateNodeStyles(selectedNode.id, { borderRadius: `${e.target.value}px` })}
                className="w-16 bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-[#6B7280]">px</span>
            </div>
          </div>

          {/* Opacity */}
          <div className="flex items-center gap-2">
            <label className="w-14 text-[11px] text-[#9CA3AF] shrink-0">Opacity</label>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={styles.opacity ?? 1}
                onChange={(e) => updateNodeStyles(selectedNode.id, { opacity: parseFloat(e.target.value) })}
                className="flex-1 accent-purple-500 cursor-pointer"
              />
              <span className="text-[11px] font-mono text-[#9CA3AF] w-8 text-right">
                {Math.round((styles.opacity ?? 1) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* SECTION: RESPONSIVE › (Progressive Disclosure) */}
        <div>
          <button
            onClick={() => setResponsiveOpen(!responsiveOpen)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#202020] transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {responsiveOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span>Responsive</span>
              {hasResponsiveOverrides && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse ml-1" />
              )}
            </div>
            <span className="text-[10px] text-[#6B7280] font-mono capitalize">{viewportMode}</span>
          </button>

          {responsiveOpen && (
            <div className="p-3 pt-1 space-y-2 bg-[#131313]">
              <div className="text-[11px] text-[#9CA3AF]">
                Breakpoint: <span className="font-semibold text-purple-300 capitalize">{viewportMode}</span>
                {viewportMode === 'desktop' ? ' (Base Default)' : ' (Delta Overrides)'}
              </div>

              {/* Reset to Inherited if overridden */}
              {hasResponsiveOverrides && (
                <button
                  onClick={() => resetAllResponsiveOverrides(selectedNode.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-1 rounded bg-[#222222] hover:bg-[#2A2A2A] text-purple-300 text-[11px] border border-[#303030] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All to Inherited</span>
                </button>
              )}

              {/* Device Visibility Toggles */}
              <div className="pt-2 border-t border-[#262626] space-y-1.5">
                <div className="text-[10px] font-semibold text-[#6B7280] uppercase">Visibility</div>
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <span>Hide on Desktop</span>
                  <input
                    type="checkbox"
                    checked={Boolean(selectedNode.responsiveVisibility?.hideOnDesktop)}
                    onChange={(e) =>
                      updateNodeResponsiveVisibility(selectedNode.id, { hideOnDesktop: e.target.checked })
                    }
                    className="accent-purple-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <span>Hide on Tablet</span>
                  <input
                    type="checkbox"
                    checked={Boolean(selectedNode.responsiveVisibility?.hideOnTablet)}
                    onChange={(e) =>
                      updateNodeResponsiveVisibility(selectedNode.id, { hideOnTablet: e.target.checked })
                    }
                    className="accent-purple-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#9CA3AF]">
                  <span>Hide on Mobile</span>
                  <input
                    type="checkbox"
                    checked={Boolean(selectedNode.responsiveVisibility?.hideOnMobile)}
                    onChange={(e) =>
                      updateNodeResponsiveVisibility(selectedNode.id, { hideOnMobile: e.target.checked })
                    }
                    className="accent-purple-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION: ADVANCED › (Progressive Disclosure) */}
        <div>
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#202020] transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {advancedOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span>Advanced</span>
            </div>
          </button>

          {advancedOpen && (
            <div className="p-3 pt-1 space-y-2 bg-[#131313]">
              <div className="space-y-1">
                <label className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Custom CSS Classes</label>
                <input
                  type="text"
                  value={styles.customClasses || ''}
                  onChange={(e) => updateNodeStyles(selectedNode.id, { customClasses: e.target.value })}
                  placeholder="e.g. shadow-xl hover:scale-105"
                  className="w-full bg-[#1F1F1F] border border-[#2C2C2C] rounded px-2 py-1 text-xs text-[#EDEDED] font-mono focus:outline-none"
                />
              </div>

              {/* Layout Diagnostics */}
              <div className="pt-2">
                <LayoutDiagnostics node={selectedNode} />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
