import React, { useRef, useEffect, useState } from 'react';
import { EyeOff } from 'lucide-react';
import { DocumentNode, AlignmentGuide, ElementStyles } from '../../types/editor';
import { useEditor, isDescendant, resolveNodeStyles, findNode, findParentNode } from '../../context/EditorContext';
import { useFrameBreakpoint } from '../../context/FrameContext';
import { useParentLayout, ParentLayoutContext } from '../../context/ParentLayoutContext';
import { ContextualToolbar } from './ContextualToolbar';
import { ResizeHandles } from './ResizeHandles';
import { SpacingOverlay } from './SpacingOverlay';
import { DropIndicator } from './DropIndicator';
import { AlignmentGuidesOverlay } from './AlignmentGuidesOverlay';

interface NodeRendererProps {
  node: DocumentNode;
}

export const NodeRenderer: React.FC<NodeRendererProps> = ({ node }) => {
  const {
    documentTree,
    selectedNodeId,
    selectedNodeIds,
    selectNode,
    toggleNodeSelection,
    hoveredNodeId,
    setHoveredNodeId,
    isPreviewMode,
    editingNodeId,
    startInlineEditing,
    stopInlineEditing,
    updateNodeContent,
    dragState,
    setDragState,
    clearDragState,
    handleDrop,
    resolveStyles,
    viewportMode,
    setViewportMode,
    canvasZoom,
    updateNodeStylesLive,
    commitFreeMovement,
    commitHistory,
    snapToGrid,
    snapToElements,
    gridSnapSize,
    activeAlignmentGuides,
    setActiveAlignmentGuides,
    openContextMenu,
  } = useEditor();

  const frameBreakpoint = useFrameBreakpoint();
  const activeViewport = frameBreakpoint || viewportMode;

  // Resolve styles early based on active breakpoint
  const styles = resolveNodeStyles(node, activeViewport);

  const parentLayout = useParentLayout();
  // Sections and Root Pages stay in structured document flow; children inside sections/containers move freely
  const isFreeChild = node.type !== 'page' && node.type !== 'section';
  const isGridChild = parentLayout.layoutMode === 'grid';
  const hasFreeCoords = typeof styles.x === 'number' || typeof styles.y === 'number' || styles.position === 'absolute';

  const elementRef = useRef<HTMLElement | null>(null);
  const inlineInputRef = useRef<HTMLDivElement | HTMLInputElement | HTMLTextAreaElement | null>(null);

  const isSelected = selectedNodeIds.includes(node.id) && !isPreviewMode;
  const isPrimarySelected = selectedNodeId === node.id && !isPreviewMode;
  const isHovered = hoveredNodeId === node.id && !isSelected && !isPreviewMode;
  const isEditing = editingNodeId === node.id;
  const isRootPage = node.type === 'page';

  // Responsive device visibility check
  const isHiddenOnCurrentDevice =
    (activeViewport === 'desktop' && node.responsiveVisibility?.hideOnDesktop) ||
    (activeViewport === 'tablet' && node.responsiveVisibility?.hideOnTablet) ||
    (activeViewport === 'mobile' && node.responsiveVisibility?.hideOnMobile);

  // Dragging state for this node
  const isBeingDragged = dragState.draggingNodeId === node.id;
  const isDropTarget = dragState.dropTargetId === node.id;

  // Auto-focus when entering inline text editing
  useEffect(() => {
    if (isEditing && inlineInputRef.current) {
      inlineInputRef.current.focus();
      if ('contentEditable' in inlineInputRef.current) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(inlineInputRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [isEditing]);

  // Flow Spacer placeholder check - preserves surrounding flow layout without collapse
  if (node.props?.isFlowSpacer) {
    return (
      <div
        id={node.id}
        aria-hidden="true"
        style={{
          display: 'block',
          width: styles.width || '100%',
          height: styles.height || styles.minHeight || '0px',
          minHeight: styles.minHeight || styles.height || '0px',
          flexShrink: 0,
          margin: styles.margin,
          marginTop: styles.marginTop,
          marginBottom: styles.marginBottom,
          marginLeft: styles.marginLeft,
          marginRight: styles.marginRight,
          padding: 0,
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      />
    );
  }

  // If node is hidden globally or hidden on current device in Preview Mode, omit
  if (node.hidden || (isHiddenOnCurrentDevice && isPreviewMode)) {
    return null;
  }

  // Click & Double-click handlers
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (frameBreakpoint && frameBreakpoint !== viewportMode) {
      setViewportMode(frameBreakpoint);
    }
    if (!isEditing) {
      if (e.shiftKey) {
        toggleNodeSelection(node.id);
      } else {
        selectNode(node.id);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (frameBreakpoint && frameBreakpoint !== viewportMode) {
      setViewportMode(frameBreakpoint);
    }
    if (!isEditing) {
      selectNode(node.id);
      openContextMenu(node.id, e.clientX, e.clientY);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isTextElement =
      node.type === 'heading' ||
      node.type === 'paragraph' ||
      node.type === 'button' ||
      node.type === 'badge';

    if (isTextElement) {
      startInlineEditing(node.id);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredNodeId(node.id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredNodeId(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (isRootPage || isEditing) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', node.id);
    e.dataTransfer.effectAllowed = 'move';
    setDragState({
      draggingNodeId: node.id,
      isValidTarget: false,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dragState.draggingNodeId) return;

    if (isDescendant(documentTree, dragState.draggingNodeId, node.id)) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }

    e.dataTransfer.dropEffect = 'move';

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const isContainer =
      node.type === 'section' ||
      node.type === 'container' ||
      node.type === 'card' ||
      node.type === 'columns' ||
      node.type === 'page';

    let position: 'before' | 'after' | 'inside' = 'after';

    if (isContainer && offsetY > rect.height * 0.25 && offsetY < rect.height * 0.75) {
      position = 'inside';
    } else if (offsetY < rect.height * 0.5) {
      position = 'before';
    } else {
      position = 'after';
    }

    setDragState({
      dropTargetId: node.id,
      dropPosition: position,
      isValidTarget: true,
    });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    if (dragState.dropTargetId === node.id) {
      setDragState({ dropTargetId: null, dropPosition: null, isValidTarget: false });
    }
  };

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDrop();
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    clearDragState();
  };

  // Free Layout Pointer-Drag Movement Engine
  const [isFreeDragging, setIsFreeDragging] = useState(false);
  const isFreeDraggingRef = useRef(false);
  const coordBadgeRef = useRef<HTMLDivElement | null>(null);
  const freeDragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
    parentW: number;
    parentH: number;
    nodeW: number;
    nodeH: number;
    wasInFlow: boolean;
    parentId: string | null;
    childIndex: number;
    siblings: DocumentNode[];
    nodeStarts: Array<{ id: string; startX: number; startY: number }>;
  } | null>(null);
  const lastDragPosRef = useRef<{
    targetX: number;
    targetY: number;
    parentW: number;
    parentH: number;
    nodeW: number;
    nodeH: number;
  } | null>(null);

  const handleFreePointerDown = (e: React.PointerEvent) => {
    if (isEditing || !isFreeChild) return;
    const target = e.target as HTMLElement;
    if (
      target.closest('.no-drag') ||
      target.tagName.toLowerCase() === 'input' ||
      target.tagName.toLowerCase() === 'textarea'
    ) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (e.shiftKey) {
      toggleNodeSelection(node.id);
    } else if (!selectedNodeIds.includes(node.id)) {
      selectNode(node.id);
    }

    const parentEl = (e.currentTarget as HTMLElement).parentElement;
    if (!parentEl) return;
    const parentRect = parentEl.getBoundingClientRect();
    const nodeRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const zoomScale = Math.max(0.2, (canvasZoom || 100) / 100);

    const parentBorderLeft = parentEl.clientLeft || 0;
    const parentBorderTop = parentEl.clientTop || 0;
    const renderedRelX = (nodeRect.left - (parentRect.left + parentBorderLeft * zoomScale)) / zoomScale;
    const renderedRelY = (nodeRect.top - (parentRect.top + parentBorderTop * zoomScale)) / zoomScale;

    const startX = typeof styles.x === 'number' ? styles.x : Math.round(renderedRelX);
    const startY = typeof styles.y === 'number' ? styles.y : Math.round(renderedRelY);

    const parentInfo = findParentNode(documentTree, node.id);
    const siblings = parentInfo?.parent.children?.filter((c) => c.id !== node.id && !c.props?.isFlowSpacer) || [];

    const wasInFlow = styles.position !== 'absolute' && typeof styles.x !== 'number';

    const activeSelectedIds = selectedNodeIds.includes(node.id)
      ? selectedNodeIds
      : [node.id];

    const freeNodes = activeSelectedIds
      .map((id) => findNode(documentTree, id))
      .filter((n): n is DocumentNode => Boolean(n && n.type !== 'page' && n.type !== 'section'));

    const nodeStarts = freeNodes.map((n) => {
      const nEl = document.getElementById(n.id);
      const nParentEl = nEl?.parentElement;
      const nRect = nEl?.getBoundingClientRect();
      const nPRect = nParentEl?.getBoundingClientRect();
      const nPBLeft = nParentEl?.clientLeft || 0;
      const nPBTop = nParentEl?.clientTop || 0;
      const nRelX = (nRect && nPRect) ? (nRect.left - (nPRect.left + nPBLeft * zoomScale)) / zoomScale : 0;
      const nRelY = (nRect && nPRect) ? (nRect.top - (nPRect.top + nPBTop * zoomScale)) / zoomScale : 0;
      return {
        id: n.id,
        startX: typeof n.styles.x === 'number' ? n.styles.x : Math.round(nRelX),
        startY: typeof n.styles.y === 'number' ? n.styles.y : Math.round(nRelY),
      };
    });

    const parentW = parentEl.clientWidth || (parentRect.width / zoomScale);
    const parentH = parentEl.clientHeight || (parentRect.height / zoomScale);
    const nodeW = nodeRect.width / zoomScale;
    const nodeH = nodeRect.height / zoomScale;

    freeDragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX,
      startY,
      parentW,
      parentH,
      nodeW,
      nodeH,
      wasInFlow,
      parentId: parentInfo ? parentInfo.parent.id : null,
      childIndex: parentInfo ? parentInfo.index : -1,
      siblings,
      nodeStarts: nodeStarts.length > 0 ? nodeStarts : [{ id: node.id, startX, startY }],
    };
    lastDragPosRef.current = {
      targetX: startX,
      targetY: startY,
      parentW,
      parentH,
      nodeW,
      nodeH,
    };
    isFreeDraggingRef.current = true;
    setIsFreeDragging(true);
  };

  const handleFreePointerMove = (e: React.PointerEvent) => {
    if (!isFreeDraggingRef.current || !freeDragStartRef.current) return;
    e.stopPropagation();
    e.preventDefault();

    const {
      pointerX,
      pointerY,
      startX,
      startY,
      parentW,
      parentH,
      nodeW,
      nodeH,
      siblings,
      nodeStarts,
    } = freeDragStartRef.current;

    const zoomFactor = Math.max(0.2, (canvasZoom || 100) / 100);
    const deltaX = (e.clientX - pointerX) / zoomFactor;
    const deltaY = (e.clientY - pointerY) / zoomFactor;

    let targetX = startX + deltaX;
    let targetY = startY + deltaY;

    const guides: AlignmentGuide[] = [];
    const bypassSnapping = e.altKey || !snapToElements;

    if (!bypassSnapping && snapToElements) {
      const SNAP_THRESHOLD = 6;
      const xTargets = [
        0,
        parentW / 2,
        parentW,
        ...siblings.flatMap((s) => {
          const sx = s.styles.x || 0;
          const sw = parseFloat(s.styles.width || '200') || 200;
          return [sx, sx + sw / 2, sx + sw];
        }),
      ];

      const yTargets = [
        0,
        parentH / 2,
        parentH,
        ...siblings.flatMap((s) => {
          const sy = s.styles.y || 0;
          const sh = parseFloat(s.styles.minHeight || s.styles.height || '100') || 100;
          return [sy, sy + sh / 2, sy + sh];
        }),
      ];

      let snappedX = false;
      for (const tx of xTargets) {
        if (Math.abs(targetX - tx) < SNAP_THRESHOLD) {
          targetX = tx;
          guides.push({ type: 'x', position: tx, start: 0, end: parentH });
          snappedX = true;
          break;
        } else if (Math.abs(targetX + nodeW / 2 - tx) < SNAP_THRESHOLD) {
          targetX = tx - nodeW / 2;
          guides.push({ type: 'x', position: tx, start: 0, end: parentH });
          snappedX = true;
          break;
        } else if (Math.abs(targetX + nodeW - tx) < SNAP_THRESHOLD) {
          targetX = tx - nodeW;
          guides.push({ type: 'x', position: tx, start: 0, end: parentH });
          snappedX = true;
          break;
        }
      }

      let snappedY = false;
      for (const ty of yTargets) {
        if (Math.abs(targetY - ty) < SNAP_THRESHOLD) {
          targetY = ty;
          guides.push({ type: 'y', position: ty, start: 0, end: parentW });
          snappedY = true;
          break;
        } else if (Math.abs(targetY + nodeH / 2 - ty) < SNAP_THRESHOLD) {
          targetY = ty - nodeH / 2;
          guides.push({ type: 'y', position: ty, start: 0, end: parentW });
          snappedY = true;
          break;
        } else if (Math.abs(targetY + nodeH - ty) < SNAP_THRESHOLD) {
          targetY = ty - nodeH;
          guides.push({ type: 'y', position: ty, start: 0, end: parentW });
          snappedY = true;
          break;
        }
      }

      if (!snappedX && snapToGrid) {
        targetX = Math.round(targetX / gridSnapSize) * gridSnapSize;
      }
      if (!snappedY && snapToGrid) {
        targetY = Math.round(targetY / gridSnapSize) * gridSnapSize;
      }
    } else if (snapToGrid && !e.altKey) {
      targetX = Math.round(targetX / gridSnapSize) * gridSnapSize;
      targetY = Math.round(targetY / gridSnapSize) * gridSnapSize;
    }

    lastDragPosRef.current = {
      targetX,
      targetY,
      parentW,
      parentH,
      nodeW,
      nodeH,
    };

    // Direct GPU-accelerated DOM transform: zero React re-renders during pointermove!
    const effectiveDeltaX = Math.round(targetX - startX);
    const effectiveDeltaY = Math.round(targetY - startY);

    if (elementRef.current) {
      const existingTransforms = transformParts.filter((t) => !t.startsWith('translate3d'));
      const combined = [`translate3d(${effectiveDeltaX}px, ${effectiveDeltaY}px, 0px)`, ...existingTransforms].join(' ');
      elementRef.current.style.transform = combined;
    }

    // Direct update for other selected nodes
    nodeStarts.forEach(({ id }) => {
      if (id !== node.id) {
        const otherEl = document.getElementById(id);
        if (otherEl) {
          otherEl.style.transform = `translate3d(${effectiveDeltaX}px, ${effectiveDeltaY}px, 0px)`;
        }
      }
    });

    // Direct update for coordinate badge text
    if (coordBadgeRef.current) {
      coordBadgeRef.current.textContent = `X: ${Math.round(targetX)}px · Y: ${Math.round(targetY)}px`;
    }

    if (guides.length > 0 || activeAlignmentGuides.length > 0) {
      setActiveAlignmentGuides(guides);
    }
  };

  const handleFreePointerUp = (e: React.PointerEvent) => {
    if (!isFreeDraggingRef.current) return;
    isFreeDraggingRef.current = false;
    e.stopPropagation();
    e.preventDefault();

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Clear direct DOM transforms
    if (elementRef.current) {
      elementRef.current.style.transform = transformParts.length > 0 ? transformParts.join(' ') : '';
    }

    const dragStart = freeDragStartRef.current;
    const lastPos = lastDragPosRef.current;
    freeDragStartRef.current = null;
    lastDragPosRef.current = null;
    setIsFreeDragging(false);
    setActiveAlignmentGuides([]);

    if (!dragStart || !lastPos) return;

    // Reset direct transforms on other multi-selected nodes
    dragStart.nodeStarts.forEach(({ id }) => {
      if (id !== node.id) {
        const otherEl = document.getElementById(id);
        if (otherEl) otherEl.style.transform = '';
      }
    });

    const { startX, startY, parentW, parentH, nodeW, nodeH, wasInFlow, parentId, childIndex } = dragStart;
    const { targetX, targetY } = lastPos;

    // Ignore tiny accidental micro-movements (< 2px threshold)
    const moved = Math.hypot(targetX - startX, targetY - startY) > 2;
    if (!moved) return;

    const finalX = Math.round(targetX);
    const finalY = Math.round(targetY);
    const rightOffset = Math.round(Math.max(0, parentW - (finalX + nodeW)));
    const bottomOffset = Math.round(Math.max(0, parentH - (finalY + nodeH)));
    const centerOffsetX = Math.round((finalX + nodeW / 2) - parentW / 2);
    const centerOffsetY = Math.round((finalY + nodeH / 2) - parentH / 2);
    const scaleLeft = parseFloat(((finalX / parentW) * 100).toFixed(2));
    const scaleWidth = parseFloat(((nodeW / parentW) * 100).toFixed(2));
    const scaleTop = parseFloat(((finalY / parentH) * 100).toFixed(2));
    const scaleHeight = parseFloat(((nodeH / parentH) * 100).toFixed(2));

    const nodeStyleUpdates: Partial<ElementStyles> = {
      position: 'absolute',
      x: finalX,
      y: finalY,
      width: `${Math.round(nodeW)}px`,
      customWidth: `${Math.round(nodeW)}px`,
      height: `${Math.round(nodeH)}px`,
      rightOffset,
      bottomOffset,
      centerOffsetX,
      centerOffsetY,
      scaleLeft,
      scaleWidth,
      scaleTop,
      scaleHeight,
    };

    const updates: Array<{ id: string; styles: Partial<ElementStyles> }> = [
      { id: node.id, styles: nodeStyleUpdates },
    ];

    const effectiveDeltaX = targetX - startX;
    const effectiveDeltaY = targetY - startY;

    dragStart.nodeStarts.forEach(({ id, startX: origX, startY: origY }) => {
      if (id !== node.id) {
        updates.push({
          id,
          styles: {
            position: 'absolute',
            x: Math.round(origX + effectiveDeltaX),
            y: Math.round(origY + effectiveDeltaY),
          },
        });
      }
    });

    let spacer: { parentId: string; index: number; spacerNode: DocumentNode } | undefined = undefined;
    let parentLock: { parentId: string; styles: Partial<ElementStyles> } | undefined = undefined;

    if (wasInFlow && parentId && childIndex !== -1) {
      // 1. Create invisible flow spacer to reserve the vacated slot in document flow
      spacer = {
        parentId,
        index: childIndex,
        spacerNode: {
          id: `spacer-${node.id}`,
          type: 'spacer',
          name: '',
          props: { isFlowSpacer: true },
          styles: {
            width: `${Math.round(nodeW)}px`,
            height: `${Math.round(nodeH)}px`,
            minHeight: `${Math.round(nodeH)}px`,
            flexShrink: 0,
            margin: node.styles.margin,
            marginTop: node.styles.marginTop,
            marginBottom: node.styles.marginBottom,
            marginLeft: node.styles.marginLeft,
            marginRight: node.styles.marginRight,
            padding: '0px',
            opacity: 0,
            pointerEvents: 'none',
          },
        },
      };

      // 2. Lock parent container minHeight to prevent content-driven collapse
      const parentNode = findNode(documentTree, parentId);
      if (!parentNode?.styles.height || parentNode.styles.height === 'auto') {
        parentLock = {
          parentId,
          styles: {
            minHeight: parentNode?.styles.minHeight || `${Math.round(parentH)}px`,
          },
        };
      }
    }

    commitFreeMovement({
      updates,
      parentLock,
      spacer,
    });
  };

  // Apply Stack on Mobile responsive behavior
  let resolvedFlexDirection = styles.flexDirection;
  if (activeViewport === 'mobile' && styles.stackOnMobile && styles.display === 'flex') {
    resolvedFlexDirection = 'column';
  }

  // Calculate width and height based on Sizing Model (Hug, Fill, Fixed)
  let resolvedWidth: string | undefined = styles.isFullWidth
    ? '100%'
    : styles.customWidth || styles.width;
  let resolvedMaxWidth = styles.maxWidth;

  if (styles.widthSizing === 'fill') {
    resolvedWidth = '100%';
    resolvedMaxWidth = '100%';
  } else if (styles.widthSizing === 'hug') {
    resolvedWidth = 'fit-content';
    resolvedMaxWidth = 'max-content';
  } else if (styles.widthSizing === 'fixed') {
    resolvedWidth = styles.customWidth || styles.width || '80%';
  }

  let resolvedMinHeight = styles.minHeight;
  if (styles.heightSizing === 'hug') {
    resolvedMinHeight = 'auto';
  }

  const isFreeContainer = (styles.layoutMode || 'free') === 'free';
  const isGridContainer = styles.layoutMode === 'grid';

  // Responsive Constraints (Phase 3)
  const hConstraint = styles.horizontalConstraint || 'left';
  const vConstraint = styles.verticalConstraint || 'top';

  let leftPos: string | undefined = undefined;
  let rightPos: string | undefined = undefined;
  let topPos: string | undefined = undefined;
  let bottomPos: string | undefined = undefined;
  let computedWidth: string | undefined = resolvedWidth;
  let computedHeight: string | undefined = styles.height;
  const transformParts: string[] = [];

  if (hasFreeCoords) {
    // Horizontal Constraint
    switch (hConstraint) {
      case 'right':
        rightPos = `${styles.rightOffset ?? 0}px`;
        leftPos = 'auto';
        break;
      case 'center':
        leftPos = `calc(50% + ${styles.centerOffsetX ?? 0}px)`;
        rightPos = 'auto';
        transformParts.push('translateX(-50%)');
        break;
      case 'stretch':
        leftPos = `${styles.x ?? 0}px`;
        rightPos = `${styles.rightOffset ?? 0}px`;
        computedWidth = 'auto';
        break;
      case 'scale':
        leftPos = `${styles.scaleLeft ?? 0}%`;
        computedWidth = `${styles.scaleWidth ?? 100}%`;
        rightPos = 'auto';
        break;
      case 'left':
      default:
        leftPos = `${styles.x ?? 0}px`;
        rightPos = 'auto';
        break;
    }

    // Vertical Constraint
    switch (vConstraint) {
      case 'bottom':
        bottomPos = `${styles.bottomOffset ?? 0}px`;
        topPos = 'auto';
        break;
      case 'center':
        topPos = `calc(50% + ${styles.centerOffsetY ?? 0}px)`;
        bottomPos = 'auto';
        transformParts.push('translateY(-50%)');
        break;
      case 'stretch':
        topPos = `${styles.y ?? 0}px`;
        bottomPos = `${styles.bottomOffset ?? 0}px`;
        computedHeight = 'auto';
        resolvedMinHeight = 'auto';
        break;
      case 'scale':
        topPos = `${styles.scaleTop ?? 0}%`;
        computedHeight = `${styles.scaleHeight ?? 100}%`;
        resolvedMinHeight = 'auto';
        bottomPos = 'auto';
        break;
      case 'top':
      default:
        topPos = `${styles.y ?? 0}px`;
        bottomPos = 'auto';
        break;
    }
  }

  // Convert ElementStyles to inline style object
  const computedStyles: React.CSSProperties = {
    // Layout
    display: isGridContainer ? 'grid' : styles.display,
    gridTemplateColumns: isGridContainer
      ? `repeat(${styles.gridColumns || 3}, minmax(0, 1fr))`
      : undefined,
    gridColumn: isGridChild && styles.gridColumnSpan ? `span ${styles.gridColumnSpan}` : undefined,
    gridRow: isGridChild && styles.gridRowSpan ? `span ${styles.gridRowSpan}` : undefined,
    flexDirection: resolvedFlexDirection,
    justifyContent: styles.justifyContent,
    alignItems: styles.alignItems,
    flexWrap: styles.flexWrap,
    flexShrink: styles.flexShrink,
    gap: styles.gap || (isGridContainer ? styles.gridGap || '20px' : undefined),
    width: hasFreeCoords ? computedWidth : resolvedWidth,
    maxWidth: resolvedMaxWidth,
    minHeight: resolvedMinHeight,
    height: hasFreeCoords ? computedHeight : styles.height,
    transform: transformParts.length > 0 ? transformParts.join(' ') : undefined,
    padding: styles.padding,
    paddingTop: styles.paddingTop,
    paddingBottom: styles.paddingBottom,
    paddingLeft: styles.paddingLeft,
    paddingRight: styles.paddingRight,
    margin: styles.margin,
    marginTop: styles.marginTop,
    marginBottom: styles.marginBottom,
    marginLeft: styles.marginLeft,
    marginRight: styles.marginRight,

    // Free Positioning & Constraints
    position: hasFreeCoords
      ? 'absolute'
      : isFreeContainer || isGridContainer || isRootPage
      ? 'relative'
      : ((styles.position as any) || 'relative'),
    left: hasFreeCoords ? leftPos : undefined,
    right: hasFreeCoords ? rightPos : undefined,
    top: hasFreeCoords ? topPos : undefined,
    bottom: hasFreeCoords ? bottomPos : undefined,
    zIndex: hasFreeCoords ? styles.zIndex || 1 : undefined,

    // Typography
    fontFamily: styles.fontFamily,
    fontWeight: styles.isBold ? '700' : styles.fontWeight,
    fontStyle: styles.isItalic ? 'italic' : undefined,
    textDecoration: styles.isUnderline ? 'underline' : undefined,
    fontSize: styles.fontSize,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    color: styles.textColor,
    textAlign: styles.textAlign,

    // Appearance
    backgroundColor: styles.backgroundColor,
    backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
    backgroundSize: styles.backgroundSize,
    backgroundPosition: styles.backgroundPosition,
    opacity: isBeingDragged ? 0.35 : isHiddenOnCurrentDevice ? 0.45 : styles.opacity,
    borderRadius: styles.borderRadius,
    borderWidth: styles.borderWidth,
    borderStyle: styles.borderStyle,
    borderColor: styles.borderColor,
    boxShadow: styles.boxShadow,
    pointerEvents: styles.pointerEvents,
  };

  // Selection overlay, badges, handles, and drop indicators
  const renderInteractiveChrome = () => {
    if (isPreviewMode) return null;

    return (
      <>
        {/* Responsive Hidden Device Watermark Badge (Design mode discovery) */}
        {isHiddenOnCurrentDevice && (
          <div className="absolute top-1 right-1 z-40 bg-red-950/90 text-red-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-red-700/50 flex items-center gap-1 shadow pointer-events-none">
            <EyeOff className="w-2.5 h-2.5" />
            <span>Hidden on {activeViewport}</span>
          </div>
        )}

        {/* Drop Insertion Line / Container Highlight */}
        {isDropTarget && dragState.dropPosition && (
          <DropIndicator position={dragState.dropPosition} />
        )}

        {/* Hover Outline & Badge (Only for child elements, never for root page) */}
        {!isRootPage && isHovered && !isSelected && (
          <div className="absolute -top-5 left-0 z-30 bg-[#1C1C1C] text-[#EDEDED] text-[9px] font-mono px-1 py-0.5 rounded shadow pointer-events-none border border-[#2A2A2A]">
            {node.name}
          </div>
        )}

        {/* Live Coordinate Badge during active Free drag */}
        {isFreeDragging && (
          <div
            ref={coordBadgeRef}
            className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 bg-[#161A24] text-[#96F02E] font-mono text-[10px] px-2 py-0.5 rounded border border-[#96F02E]/60 shadow-xl pointer-events-none whitespace-nowrap"
          >
            X: {styles.x || 0}px · Y: {styles.y || 0}px
          </div>
        )}

        {/* Selected State: Professional Bounding Box + Contextual Toolbar (Child elements only) */}
        {!isRootPage && isSelected && (
          <>
            {/* Contextual Toolbar */}
            <ContextualToolbar node={node} />

            {/* Resize Handles */}
            <ResizeHandles
              node={node}
              elementRef={elementRef as React.RefObject<HTMLElement>}
            />

            {/* Spacing Visualization */}
            <SpacingOverlay node={node} />

            {/* Visual Constraint Indicators on Canvas (Phase 3) */}
            {isFreeChild && (
              <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
                {/* Left Ray */}
                {(hConstraint === 'left' || hConstraint === 'stretch') && (styles.x ?? 0) > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `-${styles.x || 0}px`, width: `${styles.x || 0}px` }}
                  >
                    <div className="w-full border-t border-dashed border-[#8B5CF6]/70 relative">
                      <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-[#8B5CF6] ring-2 ring-[#101010]" />
                    </div>
                  </div>
                )}
                {/* Right Ray */}
                {(hConstraint === 'right' || hConstraint === 'stretch') && (styles.rightOffset ?? 0) > 0 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 left-full pointer-events-none"
                    style={{ width: `${styles.rightOffset || 0}px` }}
                  >
                    <div className="w-full border-t border-dashed border-[#8B5CF6]/70 relative">
                      <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-[#8B5CF6] ring-2 ring-[#101010]" />
                    </div>
                  </div>
                )}
                {/* Top Ray */}
                {(vConstraint === 'top' || vConstraint === 'stretch') && (styles.y ?? 0) > 0 && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                    style={{ top: `-${styles.y || 0}px`, height: `${styles.y || 0}px` }}
                  >
                    <div className="h-full border-l border-dashed border-[#8B5CF6]/70 relative">
                      <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-[#8B5CF6] ring-2 ring-[#101010]" />
                    </div>
                  </div>
                )}
                {/* Bottom Ray */}
                {(vConstraint === 'bottom' || vConstraint === 'stretch') && (styles.bottomOffset ?? 0) > 0 && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full pointer-events-none"
                    style={{ height: `${styles.bottomOffset || 0}px` }}
                  >
                    <div className="h-full border-l border-dashed border-[#8B5CF6]/70 relative">
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-[#8B5CF6] ring-2 ring-[#101010]" />
                    </div>
                  </div>
                )}
                {/* Center H Indicator */}
                {hConstraint === 'center' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none">
                    <span className="text-[8px] font-mono text-purple-300 bg-purple-950/90 px-1 py-0.2 rounded border border-purple-500/50">
                      Center H
                    </span>
                  </div>
                )}
                {/* Center V Indicator */}
                {vConstraint === 'center' && (
                  <div className="absolute top-1/2 -left-3 -translate-y-1/2 -translate-x-full pointer-events-none">
                    <span className="text-[8px] font-mono text-purple-300 bg-purple-950/90 px-1 py-0.2 rounded border border-purple-500/50">
                      Center V
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const selectionClass = isRootPage
    ? 'relative cursor-default transition-shadow'
    : isFreeChild
    ? isSelected
      ? 'outline outline-1 outline-[#96F02E] -outline-offset-1 cursor-move'
      : isHovered
      ? 'outline outline-1 outline-dashed outline-[#96F02E]/50 cursor-move'
      : 'cursor-pointer transition-shadow'
    : isSelected
    ? 'relative outline outline-1 outline-[#96F02E] -outline-offset-1 cursor-pointer'
    : isHovered
    ? 'relative outline outline-1 outline-dashed outline-[#96F02E]/50 cursor-pointer'
    : 'relative cursor-pointer transition-shadow';

  const hiddenWatermarkClass = isHiddenOnCurrentDevice && !isPreviewMode
    ? 'border border-dashed border-red-500/60 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.06)_10px,rgba(239,68,68,0.06)_20px)]'
    : '';

  // Common drag attributes
  const dragProps = isFreeChild
    ? {
        draggable: false,
        onPointerDown: handleFreePointerDown,
        onPointerMove: handleFreePointerMove,
        onPointerUp: handleFreePointerUp,
        onPointerCancel: handleFreePointerUp,
        onContextMenu: handleContextMenu,
      }
    : {
        draggable: !isEditing && !isRootPage,
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDropEvent,
        onDragEnd: handleDragEnd,
        onContextMenu: handleContextMenu,
      };

  // Inline Editable Text Component
  const renderInlineEditableContent = (initialContent: string) => {
    if (!isEditing) {
      const highlight = node.props?.highlightText;
      if (highlight && initialContent.includes(highlight)) {
        const parts = initialContent.split(highlight);
        return (
          <>
            {parts[0]}
            <span className="text-[#FBBF24] italic font-serif font-normal">{highlight}</span>
            {parts[1]}
          </>
        );
      }
      return initialContent;
    }

    return (
      <span
        ref={inlineInputRef as React.RefObject<HTMLSpanElement>}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          updateNodeContent(node.id, e.currentTarget.textContent || '');
          stopInlineEditing();
        }}
        onInput={(e) => {
          updateNodeContent(node.id, e.currentTarget.textContent || '');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            stopInlineEditing();
          } else if (e.key === 'Enter' && node.type !== 'paragraph') {
            e.preventDefault();
            stopInlineEditing();
          }
        }}
        className="outline-none bg-purple-950/40 text-white border-b-2 border-purple-500 px-1 rounded-sm selection:bg-purple-600 inline-block min-w-[20px]"
      >
        {initialContent}
      </span>
    );
  };

  // Render specific element by type
  switch (node.type) {
    case 'page':
      return (
        <div
          id={node.id}
          ref={elementRef as React.RefObject<HTMLDivElement>}
          style={{
            ...computedStyles,
            maxWidth: styles.maxWidth || undefined,
            marginLeft:
              styles.horizontalAlign === 'left'
                ? '0px'
                : styles.horizontalAlign === 'right'
                ? 'auto'
                : styles.marginLeft || 'auto',
            marginRight:
              styles.horizontalAlign === 'left'
                ? 'auto'
                : styles.horizontalAlign === 'right'
                ? '0px'
                : styles.marginRight || 'auto',
          }}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onDragOver={handleDragOver}
          onDrop={handleDropEvent}
          className={`min-h-screen w-full relative ${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        >
          {renderInteractiveChrome()}
          {isFreeContainer && <AlignmentGuidesOverlay guides={activeAlignmentGuides} />}
          <ParentLayoutContext.Provider
            value={{
              layoutMode: styles.layoutMode || 'free',
              parentId: node.id,
            }}
          >
            {node.children?.map((child) => (
              <NodeRenderer key={child.id} node={child} />
            ))}
          </ParentLayoutContext.Provider>
        </div>
      );

    case 'section':
      return (
        <section
          id={node.id}
          ref={elementRef as React.RefObject<HTMLElement>}
          style={computedStyles}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        >
          {renderInteractiveChrome()}
          {isFreeContainer && <AlignmentGuidesOverlay guides={activeAlignmentGuides} />}
          <ParentLayoutContext.Provider
            value={{
              layoutMode: styles.layoutMode || 'free',
              parentId: node.id,
            }}
          >
            {node.children?.map((child) => (
              <NodeRenderer key={child.id} node={child} />
            ))}
          </ParentLayoutContext.Provider>
        </section>
      );

    case 'container':
    case 'card':
      return (
        <div
          id={node.id}
          ref={elementRef as React.RefObject<HTMLDivElement>}
          style={computedStyles}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        >
          {renderInteractiveChrome()}
          {isFreeContainer && <AlignmentGuidesOverlay guides={activeAlignmentGuides} />}
          <ParentLayoutContext.Provider
            value={{
              layoutMode: styles.layoutMode || 'free',
              parentId: node.id,
            }}
          >
            {node.children?.map((child) => (
              <NodeRenderer key={child.id} node={child} />
            ))}
          </ParentLayoutContext.Provider>
        </div>
      );

    case 'columns': {
      const gridResponsiveClass =
        activeViewport === 'mobile'
          ? 'grid-cols-1'
          : activeViewport === 'tablet'
          ? 'grid-cols-2'
          : 'grid-cols-1 md:grid-cols-3';

      return (
        <div
          id={node.id}
          ref={elementRef as React.RefObject<HTMLDivElement>}
          style={computedStyles}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`grid ${gridResponsiveClass} ${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        >
          {renderInteractiveChrome()}
          {node.children?.map((child) => (
            <NodeRenderer key={child.id} node={child} />
          ))}
        </div>
      );
    }

    case 'column':
      return (
        <div
          id={node.id}
          ref={elementRef as React.RefObject<HTMLDivElement>}
          style={computedStyles}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        >
          {renderInteractiveChrome()}
          {node.children?.map((child) => (
            <NodeRenderer key={child.id} node={child} />
          ))}
        </div>
      );

    case 'heading': {
      const Tag = (`h${node.props?.level || 2}`) as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return (
        <Tag
          id={node.id}
          ref={elementRef as any}
          style={computedStyles}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        >
          {renderInteractiveChrome()}
          {renderInlineEditableContent(node.content || '')}
        </Tag>
      );
    }

    case 'paragraph':
      return (
        <p
          id={node.id}
          ref={elementRef as React.RefObject<HTMLParagraphElement>}
          style={computedStyles}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        >
          {renderInteractiveChrome()}
          {renderInlineEditableContent(node.content || '')}
        </p>
      );

    case 'button':
      return (
        <button
          id={node.id}
          ref={elementRef as React.RefObject<HTMLButtonElement>}
          style={computedStyles}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`cursor-pointer hover:opacity-90 active:scale-95 transition-transform ${selectionClass} ${hiddenWatermarkClass} ${
            styles.customClasses || ''
          }`}
        >
          {renderInteractiveChrome()}
          {renderInlineEditableContent(node.content || '')}
        </button>
      );

    case 'image':
      return (
        <div
          id={node.id}
          ref={elementRef as React.RefObject<HTMLDivElement>}
          style={computedStyles}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`overflow-hidden ${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        >
          {renderInteractiveChrome()}
          <img
            src={
              node.props?.src ||
              'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
            }
            alt={node.props?.alt || 'Visual content'}
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      );

    case 'badge':
      return (
        <div
          id={node.id}
          ref={elementRef as React.RefObject<HTMLDivElement>}
          style={computedStyles}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        >
          {renderInteractiveChrome()}
          {renderInlineEditableContent(node.content || '')}
        </div>
      );

    case 'divider':
      return (
        <hr
          id={node.id}
          ref={elementRef as React.RefObject<HTMLHRElement>}
          style={computedStyles}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`${selectionClass} ${hiddenWatermarkClass} ${styles.customClasses || ''}`}
        />
      );

    case 'spacer':
      return (
        <div
          id={node.id}
          ref={elementRef as React.RefObject<HTMLDivElement>}
          style={computedStyles}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`${selectionClass} ${hiddenWatermarkClass} ${isSelected ? 'bg-[#96F02E]/10' : ''} ${
            styles.customClasses || ''
          }`}
        >
          {renderInteractiveChrome()}
          {isSelected && (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#96F02E] font-mono">
              Spacer ({styles.minHeight || '32px'})
            </div>
          )}
        </div>
      );

    default:
      return (
        <div
          id={node.id}
          ref={elementRef as React.RefObject<HTMLDivElement>}
          style={computedStyles}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...dragProps}
          className={`${selectionClass} ${hiddenWatermarkClass}`}
        >
          {renderInteractiveChrome()}
          {node.content || node.name}
          {node.children?.map((child) => (
            <NodeRenderer key={child.id} node={child} />
          ))}
        </div>
      );
  }
};
