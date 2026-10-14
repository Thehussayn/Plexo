import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  Heading as HeadingIcon,
  AlignLeft,
  Square,
  Image as ImageIcon,
  Columns as ColumnsIcon,
  Tag,
  LayoutTemplate,
  Box,
  GripVertical,
  Group,
  Ungroup,
} from 'lucide-react';
import { useEditor, findParentNode, isDescendant } from '../../context/EditorContext';
import { DocumentNode, NodeType } from '../../types/editor';

const getNodeIcon = (type: NodeType) => {
  switch (type) {
    case 'page':
      return <LayoutTemplate className="w-3 h-3 text-[#9CA3AF]" />;
    case 'section':
      return <Box className="w-3 h-3 text-blue-400" />;
    case 'container':
    case 'card':
      return <Box className="w-3 h-3 text-[#9CA3AF]" />;
    case 'columns':
    case 'column':
      return <ColumnsIcon className="w-3 h-3 text-cyan-400" />;
    case 'heading':
      return <HeadingIcon className="w-3 h-3 text-amber-400" />;
    case 'paragraph':
      return <AlignLeft className="w-3 h-3 text-[#9CA3AF]" />;
    case 'button':
      return <Square className="w-3 h-3 text-emerald-400" />;
    case 'image':
      return <ImageIcon className="w-3 h-3 text-pink-400" />;
    case 'badge':
      return <Tag className="w-3 h-3 text-purple-400" />;
    default:
      return <Layers className="w-3 h-3 text-[#9CA3AF]" />;
  }
};

interface LayerItemProps {
  node: DocumentNode;
  depth: number;
}

const LayerItem: React.FC<LayerItemProps> = ({ node, depth }) => {
  const {
    documentTree,
    selectedNodeId,
    selectedNodeIds,
    selectNode,
    toggleNodeSelection,
    hoveredNodeId,
    setHoveredNodeId,
    toggleNodeVisibility,
    toggleNodeLock,
    dragState,
    setDragState,
    clearDragState,
    moveNode,
    viewportMode,
    openContextMenu,
  } = useEditor();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [layerDropPos, setLayerDropPos] = useState<'before' | 'after' | null>(null);

  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isSelected = selectedNodeIds ? selectedNodeIds.includes(node.id) : selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;
  const isRootPage = node.type === 'page';

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      toggleNodeSelection(node.id);
    } else {
      selectNode(node.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectNode(node.id);
    openContextMenu(node.id, e.clientX, e.clientY);
  };

  // Drag and drop for reordering layers
  const handleDragStart = (e: React.DragEvent) => {
    if (isRootPage) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
    setDragState({ draggingNodeId: node.id });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dragState.draggingNodeId || dragState.draggingNodeId === node.id) return;
    if (isDescendant(documentTree, dragState.draggingNodeId, node.id)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const pos = offsetY < rect.height / 2 ? 'before' : 'after';
    setLayerDropPos(pos);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setLayerDropPos(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const draggingId = dragState.draggingNodeId;
    if (!draggingId || draggingId === node.id || !layerDropPos) {
      setLayerDropPos(null);
      clearDragState();
      return;
    }

    const parentInfo = findParentNode(documentTree, node.id);
    if (parentInfo) {
      const targetIndex = layerDropPos === 'before' ? parentInfo.index : parentInfo.index + 1;
      moveNode(draggingId, parentInfo.parent.id, targetIndex);
      selectNode(draggingId);
    }

    setLayerDropPos(null);
    clearDragState();
  };

  return (
    <div className="relative">
      {/* Sibling insertion indicator line */}
      {layerDropPos && (
        <div
          className={`absolute left-1 right-1 h-0.5 bg-[#8B5CF6] z-30 pointer-events-none rounded ${
            layerDropPos === 'before' ? 'top-0' : 'bottom-0'
          }`}
        />
      )}

      <div
        draggable={!isRootPage}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleSelect}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setHoveredNodeId(node.id)}
        onMouseLeave={() => setHoveredNodeId(null)}
        style={{ paddingLeft: `${depth * 12 + 6}px` }}
        className={`group relative flex items-center justify-between h-[26px] pr-1.5 rounded text-xs cursor-pointer transition-colors ${
          isSelected
            ? 'bg-[#7C3AED]/20 text-white font-medium'
            : isHovered
            ? 'bg-[#242424] text-[#EDEDED]'
            : 'text-[#9CA3AF] hover:bg-[#1F1F1F]'
        } ${node.hidden ? 'opacity-40' : ''}`}
      >
        <div className="flex items-center gap-1 min-w-0 truncate">
          {/* Drag Handle (Hover only) */}
          {!isRootPage && (
            <GripVertical className="w-2.5 h-2.5 text-[#6B7280] opacity-0 group-hover:opacity-100 cursor-grab shrink-0 -ml-1" />
          )}

          {/* Expand/Collapse Chevron */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 text-[#6B7280] hover:text-[#EDEDED] rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <span className="w-2.5" />
          )}

          {/* Node Icon */}
          <div className="shrink-0">{getNodeIcon(node.type)}</div>

          {/* Node Name */}
          <span className="truncate select-none text-[11px] leading-none">{node.name}</span>

          {/* Layout Mode Badge */}
          {node.styles.layoutMode === 'free' && (
            <span
              title="Free Layout Container"
              className="text-[9px] px-1 py-0.2 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40 font-mono shrink-0"
            >
              free
            </span>
          )}
          {node.styles.position === 'absolute' && node.type !== 'page' && (
            <span
              title="Free Position (Absolute)"
              className="text-[9px] px-1 py-0.2 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40 font-mono shrink-0"
            >
              free
            </span>
          )}
          {node.styles.layoutMode === 'grid' && (
            <span
              title="CSS Grid Layout"
              className="text-[9px] px-1 py-0.2 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-800/40 font-mono shrink-0"
            >
              grid
            </span>
          )}

          {/* Responsive Hidden Indicator */}
          {((viewportMode === 'desktop' && node.responsiveVisibility?.hideOnDesktop) ||
            (viewportMode === 'tablet' && node.responsiveVisibility?.hideOnTablet) ||
            (viewportMode === 'mobile' && node.responsiveVisibility?.hideOnMobile)) && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-red-950/80 text-red-400 border border-red-800/40 shrink-0 font-mono">
              hidden
            </span>
          )}
        </div>

        {/* Actions (Lock and Eye only) */}
        <div
          className={`flex items-center gap-0.5 shrink-0 transition-opacity ${
            isSelected || node.hidden || node.locked
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {/* Lock */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleNodeLock(node.id);
            }}
            title={node.locked ? 'Unlock element' : 'Lock element'}
            className="p-1 rounded text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#2C2C2C]"
          >
            {node.locked ? <Lock className="w-2.5 h-2.5 text-amber-400" /> : <Unlock className="w-2.5 h-2.5" />}
          </button>

          {/* Visibility (Eye) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleNodeVisibility(node.id);
            }}
            title={node.hidden ? 'Show element' : 'Hide element'}
            className="p-1 rounded text-[#9CA3AF] hover:text-[#EDEDED] hover:bg-[#2C2C2C]"
          >
            {node.hidden ? <EyeOff className="w-2.5 h-2.5 text-red-400" /> : <Eye className="w-2.5 h-2.5" />}
          </button>
        </div>
      </div>

      {/* Children layers */}
      {hasChildren && isExpanded && (
        <div className="flex flex-col">
          {node.children!.map((child) => (
            <LayerItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const LayersPanel: React.FC = () => {
  const { documentTree, selectedNodeId, selectedNode, groupSelectedNodes, ungroupNode } = useEditor();

  const isSelectedRoot = !selectedNodeId || selectedNodeId === documentTree.id;
  const canUngroup = Boolean(selectedNode?.children && selectedNode.children.length > 0 && !isSelectedRoot);

  return (
    <div className="flex flex-col h-full overflow-hidden select-none font-sans text-xs">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[#222] bg-[#141414] text-[11px] text-[#9CA3AF]">
        <span className="font-medium text-[#737373] uppercase tracking-wider text-[10px]">Hierarchy</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => selectedNodeId && groupSelectedNodes([selectedNodeId])}
            disabled={isSelectedRoot}
            title="Group Selected (⌘G)"
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-[#9CA3AF] hover:bg-[#222] hover:text-[#EDEDED] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Group className="w-3 h-3" />
            <span>Group</span>
          </button>
          <button
            onClick={() => selectedNodeId && ungroupNode(selectedNodeId)}
            disabled={!canUngroup}
            title="Ungroup Selected (⇧⌘G)"
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-[#9CA3AF] hover:bg-[#222] hover:text-[#EDEDED] disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Ungroup className="w-3 h-3" />
            <span>Ungroup</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1.5 py-1 space-y-0.5">
        {/* Render Document Tree directly */}
        {documentTree.children && documentTree.children.map((child) => (
          <LayerItem key={child.id} node={child} depth={0} />
        ))}
      </div>
    </div>
  );
};
