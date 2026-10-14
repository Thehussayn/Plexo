import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  DocumentNode,
  PageDefinition,
  ViewportMode,
  LeftSidebarTab,
  ViewMode,
  ElementStyles,
  DragDropState,
  ResponsiveVisibility,
  CanvasToolMode,
  CanvasViewMode,
  LayoutMode,
  AlignmentGuide,
  ContextMenuState,
  MarqueeState,
} from '../types/editor';
import { samplePagesList } from '../data/samplePageData';
import { insertableComponents } from '../data/insertableComponents';

interface EditorContextType {
  // Page & Document Tree
  pages: PageDefinition[];
  currentPageId: string;
  currentPage: PageDefinition;
  setCurrentPageId: (id: string) => void;
  documentTree: DocumentNode;

  // Selection & Multi-Selection & Hover
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  selectedNode: DocumentNode | null;
  selectNode: (id: string | null) => void;
  selectNodes: (ids: string[]) => void;
  toggleNodeSelection: (id: string) => void;
  selectAll: () => void;
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
  selectParentNode: (nodeId?: string) => void;

  // Marquee Selection State
  marquee: MarqueeState;
  setMarquee: React.Dispatch<React.SetStateAction<MarqueeState>>;

  // Inline Text Editing
  editingNodeId: string | null;
  startInlineEditing: (nodeId: string) => void;
  stopInlineEditing: () => void;

  // Drag and Drop (Structured Reordering)
  dragState: DragDropState;
  setDragState: (state: Partial<DragDropState>) => void;
  clearDragState: () => void;
  handleDrop: () => void;
  moveNode: (sourceId: string, targetParentId: string, targetIndex: number) => void;
  moveNodeUp: (nodeId: string) => void;
  moveNodeDown: (nodeId: string) => void;

  // Viewport & Mode
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isPreviewMode: boolean;
  setIsPreviewMode: (preview: boolean) => void;
  canvasZoom: number;
  setCanvasZoom: (zoom: number | ((prev: number) => number)) => void;
  isFitMode: boolean;
  setIsFitMode: (fit: boolean) => void;

  // Infinite Canvas Viewport State & Navigation
  canvasPan: { x: number; y: number };
  setCanvasPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  canvasTool: CanvasToolMode;
  setCanvasTool: (tool: CanvasToolMode) => void;
  canvasViewMode: CanvasViewMode;
  setCanvasViewMode: (mode: CanvasViewMode) => void;
  setContainerSize: (size: { width: number; height: number }) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom100: (containerW?: number, containerH?: number) => void;
  fitToPage: (containerW?: number, containerH?: number) => void;
  fitAllFrames: (containerW?: number, containerH?: number) => void;

  // Canvas Custom Width (Intermediate widths)
  canvasCustomWidth: number | null;
  setCanvasCustomWidth: (width: number | null) => void;

  // Sidebar Tabs & Drawer
  activeSidebarTab: LeftSidebarTab | null;
  setActiveSidebarTab: (tab: LeftSidebarTab | null) => void;
  toggleSidebarTab: (tab: LeftSidebarTab) => void;

  // Inspector Panel State
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleInspector: () => void;

  // History & Atomic Commits
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  commitHistory: () => void;

  // Responsive & Tree mutations
  resolveStyles: (node: DocumentNode) => ElementStyles;
  isOverridden: (node: DocumentNode, propKey: keyof ElementStyles) => boolean;
  getInheritedStyle: (node: DocumentNode, propKey: keyof ElementStyles) => any;
  updateNodeStyles: (nodeId: string, styles: Partial<ElementStyles>) => void;
  updateNodeStylesLive: (nodeId: string, styles: Partial<ElementStyles>) => void;
  resetResponsiveStyle: (nodeId: string, propKey: keyof ElementStyles) => void;
  resetAllResponsiveOverrides: (nodeId: string) => void;
  updateNodeResponsiveVisibility: (nodeId: string, visibility: Partial<ResponsiveVisibility>) => void;
  updateNodeContent: (nodeId: string, content: string) => void;
  updateNodeProps: (nodeId: string, props: Record<string, any>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  insertComponent: (parentId: string | null, componentId: string) => void;
  addSection: (name?: string) => void;
  toggleNodeVisibility: (nodeId: string) => void;
  toggleNodeLock: (nodeId: string) => void;

  // Flexible Layout & Free Positioning (Phase 2)
  setContainerLayoutMode: (containerId: string, mode: LayoutMode) => void;
  alignNodeInParent: (
    nodeId: string,
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom',
    parentWidth?: number,
    parentHeight?: number,
    nodeWidth?: number,
    nodeHeight?: number
  ) => void;
  bringForward: (nodeId: string) => void;
  sendBackward: (nodeId: string) => void;
  bringToFront: (nodeId: string) => void;
  sendToBack: (nodeId: string) => void;
  groupSelectedNodes: (nodeIds: string[]) => void;
  ungroupNode: (containerId: string) => void;

  // Snapping & Guidelines
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  snapToElements: boolean;
  setSnapToElements: (snap: boolean) => void;
  gridSnapSize: number;
  setGridSnapSize: (size: number) => void;
  activeAlignmentGuides: AlignmentGuide[];
  setActiveAlignmentGuides: (guides: AlignmentGuide[]) => void;

  // Non-Destructive Free Position & Return to Layout
  detachElementToFreePosition: (
    nodeId: string,
    renderedRect?: { x: number; y: number; width?: number; height?: number }
  ) => void;
  returnElementToStructuredLayout: (nodeId: string, targetIndex?: number) => void;

  // Multi-element Manipulation & Nudging
  alignSelectedNodes: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  distributeSelectedNodes: (axis: 'horizontal' | 'vertical') => void;
  nudgeSelectedNodes: (direction: 'up' | 'down' | 'left' | 'right', isLarge: boolean) => void;

  // Context Menu System
  contextMenu: ContextMenuState;
  openContextMenu: (nodeId: string | null, x: number, y: number) => void;
  closeContextMenu: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

// Deep clone utility
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Find node in tree by ID
export function findNode(root: DocumentNode, id: string): DocumentNode | null {
  if (root.id === id) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

// Find parent node of an ID
export function findParentNode(
  root: DocumentNode,
  childId: string
): { parent: DocumentNode; index: number } | null {
  if (!root.children) return null;
  const idx = root.children.findIndex((c) => c.id === childId);
  if (idx !== -1) {
    return { parent: root, index: idx };
  }
  for (const child of root.children) {
    const found = findParentNode(child, childId);
    if (found) return found;
  }
  return null;
}

// Check if testChildId is a descendant of ancestorId
export function isDescendant(root: DocumentNode, ancestorId: string, testChildId: string): boolean {
  if (ancestorId === testChildId) return true;
  const ancestor = findNode(root, ancestorId);
  if (!ancestor) return false;
  return Boolean(findNode(ancestor, testChildId));
}

// Resolve styles with Desktop -> Tablet -> Mobile cascading inheritance
export function resolveNodeStyles(node: DocumentNode, viewport: ViewportMode): ElementStyles {
  const base = node.styles || {};
  if (viewport === 'desktop') {
    return base;
  }
  if (viewport === 'tablet') {
    return {
      ...base,
      ...(node.responsive?.tablet || {}),
    };
  }
  // Mobile cascades: Base -> Tablet Overrides -> Mobile Overrides
  return {
    ...base,
    ...(node.responsive?.tablet || {}),
    ...(node.responsive?.mobile || {}),
  };
}

// Check if a specific style key has an explicit override on current breakpoint
export function checkIsOverridden(
  node: DocumentNode,
  viewport: ViewportMode,
  propKey: keyof ElementStyles
): boolean {
  if (viewport === 'desktop') return false;
  if (viewport === 'tablet') {
    return Boolean(node.responsive?.tablet && propKey in node.responsive.tablet);
  }
  if (viewport === 'mobile') {
    return Boolean(node.responsive?.mobile && propKey in node.responsive.mobile);
  }
  return false;
}

// Get the inherited value for a specific style key on current breakpoint
export function getInheritedValue(
  node: DocumentNode,
  viewport: ViewportMode,
  propKey: keyof ElementStyles
): any {
  if (viewport === 'desktop' || viewport === 'tablet') {
    return node.styles ? node.styles[propKey] : undefined;
  }
  if (viewport === 'mobile') {
    if (node.responsive?.tablet && propKey in node.responsive.tablet) {
      return node.responsive.tablet[propKey];
    }
    return node.styles ? node.styles[propKey] : undefined;
  }
  return undefined;
}

// Mutate node in tree immutably
function updateNodeInTree(
  root: DocumentNode,
  id: string,
  updater: (node: DocumentNode) => DocumentNode
): DocumentNode {
  if (root.id === id) {
    return updater({ ...root });
  }
  if (!root.children) return root;
  return {
    ...root,
    children: root.children.map((child) => updateNodeInTree(child, id, updater)),
  };
}

// Remove node from tree
function deleteNodeFromTree(root: DocumentNode, id: string): DocumentNode {
  if (!root.children) return root;
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== id)
      .map((child) => deleteNodeFromTree(child, id)),
  };
}

// Duplicate node in tree
function duplicateNodeInTree(root: DocumentNode, id: string): DocumentNode {
  if (!root.children) return root;
  const newChildren: DocumentNode[] = [];
  for (const child of root.children) {
    if (child.id === id) {
      const cloned = deepClone(child);
      const newId = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const assignNewIds = (n: DocumentNode) => {
        n.id = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        n.children?.forEach(assignNewIds);
      };
      cloned.id = newId;
      cloned.name = `${cloned.name} (Copy)`;
      cloned.children?.forEach(assignNewIds);
      newChildren.push(child);
      newChildren.push(cloned);
    } else {
      newChildren.push(duplicateNodeInTree(child, id));
    }
  }
  return { ...root, children: newChildren };
}

// Move node in tree to a target parent at a specified index
function moveNodeInTree(
  root: DocumentNode,
  sourceId: string,
  targetParentId: string,
  targetIndex: number
): DocumentNode {
  if (sourceId === root.id || isDescendant(root, sourceId, targetParentId)) {
    return root;
  }

  const sourceNode = findNode(root, sourceId);
  if (!sourceNode) return root;

  const treeWithoutSource = deleteNodeFromTree(root, sourceId);

  const treeWithInserted = updateNodeInTree(treeWithoutSource, targetParentId, (parent) => {
    const children = parent.children ? [...parent.children] : [];
    const safeIndex = Math.max(0, Math.min(targetIndex, children.length));
    children.splice(safeIndex, 0, sourceNode);
    return { ...parent, children };
  });

  return treeWithInserted;
}

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pages, setPages] = useState<PageDefinition[]>(samplePagesList);
  const [currentPageId, setCurrentPageId] = useState<string>('page-home');
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>(['node-hero-paragraph']);
  const selectedNodeId = selectedNodeIds[0] || null;
  const setSelectedNodeId = useCallback((id: string | null) => {
    setSelectedNodeIds(id ? [id] : []);
  }, []);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Marquee Selection State
  const [marquee, setMarquee] = useState<MarqueeState>({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    box: null,
  });

  // Inline editing state
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // Drag and drop state
  const [dragState, setDragStateInternal] = useState<DragDropState>({
    draggingNodeId: null,
    dropTargetId: null,
    dropPosition: null,
    isValidTarget: false,
  });

  const [viewportMode, setViewportModeInternal] = useState<ViewportMode>('desktop');
  const [canvasCustomWidth, setCanvasCustomWidth] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('design');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [canvasZoom, setCanvasZoom] = useState<number>(100);
  const [isFitMode, setIsFitMode] = useState<boolean>(true);
  const [canvasPan, setCanvasPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [canvasTool, setCanvasTool] = useState<CanvasToolMode>('select');
  const [canvasViewMode, setCanvasViewModeInternal] = useState<CanvasViewMode>('focused');
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 1200, height: 800 });
  const [activeSidebarTab, setActiveSidebarTab] = useState<LeftSidebarTab | null>('layers');
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(false);
  const [snapToElements, setSnapToElements] = useState<boolean>(true);
  const [gridSnapSize, setGridSnapSize] = useState<number>(8);
  const [activeAlignmentGuides, setActiveAlignmentGuides] = useState<AlignmentGuide[]>([]);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    nodeId: null,
  });

  const openContextMenu = useCallback((nodeId: string | null, x: number, y: number) => {
    setContextMenu({
      isOpen: true,
      x,
      y,
      nodeId,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => {
      if (!prev.isOpen) return prev;
      return {
        ...prev,
        isOpen: false,
        nodeId: null,
      };
    });
  }, []);

  const zoomIn = useCallback(() => {
    setCanvasZoom((prev) => Math.min(300, Math.round((prev + 10) / 10) * 10));
    setIsFitMode(false);
  }, []);

  const zoomOut = useCallback(() => {
    setCanvasZoom((prev) => Math.max(25, Math.round((prev - 10) / 10) * 10));
    setIsFitMode(false);
  }, []);

  const fitToPage = useCallback((containerW?: number, containerH?: number) => {
    const width = containerW ?? containerSize.width;
    const height = containerH ?? containerSize.height;
    const frameW = canvasCustomWidth || (viewportMode === 'mobile' ? 375 : viewportMode === 'tablet' ? 768 : 1200);
    const frameH = 850;
    const availW = Math.max(200, width - 96);
    const availH = Math.max(200, height - 96);
    const scaleX = availW / frameW;
    const scaleY = availH / frameH;
    const targetScale = Math.min(scaleX, scaleY, 1.0);
    const newZoom = Math.max(25, Math.min(150, Math.round(targetScale * 100)));
    const scale = newZoom / 100;
    const panX = Math.round((width - frameW * scale) / 2);
    const panY = Math.max(32, Math.round((height - frameH * scale) / 2));
    setCanvasZoom(newZoom);
    setCanvasPan({ x: panX, y: panY });
    setIsFitMode(true);
  }, [containerSize, canvasCustomWidth, viewportMode]);

  const fitAllFrames = useCallback((containerW?: number, containerH?: number) => {
    const width = containerW ?? containerSize.width;
    const height = containerH ?? containerSize.height;
    const totalW = 1200 + 64 + 768 + 64 + 375; // 2471px
    const frameH = 850;
    const availW = Math.max(200, width - 96);
    const availH = Math.max(200, height - 96);
    const scaleX = availW / totalW;
    const scaleY = availH / frameH;
    const targetScale = Math.min(scaleX, scaleY, 1.0);
    const newZoom = Math.max(25, Math.min(100, Math.round(targetScale * 100)));
    const scale = newZoom / 100;
    const panX = Math.round((width - totalW * scale) / 2);
    const panY = Math.max(32, Math.round((height - frameH * scale) / 2));
    setCanvasZoom(newZoom);
    setCanvasPan({ x: panX, y: panY });
    setIsFitMode(true);
  }, [containerSize]);

  const resetZoom100 = useCallback((containerW?: number, containerH?: number) => {
    const width = containerW ?? containerSize.width;
    const height = containerH ?? containerSize.height;
    const frameW = canvasViewMode === 'all'
      ? (1200 + 64 + 768 + 64 + 375)
      : (viewportMode === 'mobile' ? 375 : viewportMode === 'tablet' ? 768 : 1200);
    const panX = Math.round((width - frameW) / 2);
    const panY = 48;
    setCanvasZoom(100);
    setCanvasPan({ x: panX, y: panY });
    setIsFitMode(false);
  }, [containerSize, canvasViewMode, viewportMode]);

  const setCanvasViewMode = useCallback((mode: CanvasViewMode) => {
    setCanvasViewModeInternal(mode);
    if (mode === 'all') {
      fitAllFrames();
    } else {
      fitToPage();
    }
  }, [fitAllFrames, fitToPage]);

  const toggleSidebarTab = useCallback((tab: LeftSidebarTab) => {
    setActiveSidebarTab((prev) => (prev === tab ? null : tab));
  }, []);

  const toggleInspector = useCallback(() => {
    setIsInspectorOpen((prev) => !prev);
  }, []);

  // When switching viewport mode, clear custom intermediate width
  const setViewportMode = useCallback((mode: ViewportMode) => {
    setViewportModeInternal(mode);
    setCanvasCustomWidth(null);
  }, []);

  // History stack for current page
  const [history, setHistory] = useState<DocumentNode[]>(() => [deepClone(samplePagesList[0].rootNode)]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const currentPage = useMemo(() => {
    return pages.find((p) => p.id === currentPageId) || pages[0];
  }, [pages, currentPageId]);

  const documentTree = history[historyIndex] || currentPage.rootNode;

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return documentTree;
    return findNode(documentTree, selectedNodeId) || documentTree;
  }, [documentTree, selectedNodeId]);

  const pushHistory = useCallback((newRoot: DocumentNode) => {
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, newRoot];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const commitHistory = useCallback(() => {
    setHistory((prev) => {
      if (prev[historyIndex] === documentTree) return prev;
      const next = prev.slice(0, historyIndex + 1);
      return [...next, deepClone(documentTree)];
    });
  }, [documentTree, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex((prev) => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex((prev) => prev + 1);
    }
  }, [canRedo]);

  const selectNode = useCallback((id: string | null) => {
    setSelectedNodeIds(id ? [id] : []);
    if (id !== editingNodeId) {
      setEditingNodeId(null);
    }
  }, [editingNodeId]);

  const selectNodes = useCallback((ids: string[]) => {
    setSelectedNodeIds(ids);
    if (!ids.includes(editingNodeId || '')) {
      setEditingNodeId(null);
    }
  }, [editingNodeId]);

  const toggleNodeSelection = useCallback((id: string) => {
    setSelectedNodeIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        return [...prev, id];
      }
    });
    setEditingNodeId(null);
  }, []);

  const selectAll = useCallback(() => {
    const allIds: string[] = [];
    const collect = (n: DocumentNode) => {
      if (n.type !== 'page') allIds.push(n.id);
      if (n.children) n.children.forEach(collect);
    };
    collect(documentTree);
    setSelectedNodeIds(allIds);
  }, [documentTree]);

  const startInlineEditing = useCallback((nodeId: string) => {
    setSelectedNodeIds([nodeId]);
    setEditingNodeId(nodeId);
  }, []);

  const stopInlineEditing = useCallback(() => {
    setEditingNodeId(null);
  }, []);

  const selectParentNode = useCallback((nodeId?: string) => {
    const targetId = nodeId || selectedNodeId;
    if (!targetId) return;
    const parentInfo = findParentNode(documentTree, targetId);
    if (parentInfo && parentInfo.parent) {
      setSelectedNodeIds([parentInfo.parent.id]);
      setEditingNodeId(null);
    }
  }, [documentTree, selectedNodeId]);

  const handleSetCurrentPageId = useCallback((id: string) => {
    const page = pages.find((p) => p.id === id);
    if (page) {
      setCurrentPageId(id);
      setSelectedNodeId(page.rootNode.id);
      setEditingNodeId(null);
      setHistory([deepClone(page.rootNode)]);
      setHistoryIndex(0);
    }
  }, [pages]);

  // Drag state handlers
  const setDragState = useCallback((partial: Partial<DragDropState>) => {
    setDragStateInternal((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearDragState = useCallback(() => {
    setDragStateInternal({
      draggingNodeId: null,
      dropTargetId: null,
      dropPosition: null,
      isValidTarget: false,
    });
  }, []);

  const handleDrop = useCallback(() => {
    const { draggingNodeId, dropTargetId, dropPosition, isValidTarget } = dragState;
    if (!draggingNodeId || !dropTargetId || !isValidTarget || draggingNodeId === dropTargetId) {
      clearDragState();
      return;
    }

    const targetNode = findNode(documentTree, dropTargetId);
    if (!targetNode) {
      clearDragState();
      return;
    }

    let targetParentId = dropTargetId;
    let targetIndex = 0;

    if (dropPosition === 'inside') {
      targetParentId = dropTargetId;
      targetIndex = targetNode.children ? targetNode.children.length : 0;
    } else {
      const parentInfo = findParentNode(documentTree, dropTargetId);
      if (!parentInfo) {
        clearDragState();
        return;
      }
      targetParentId = parentInfo.parent.id;
      targetIndex = dropPosition === 'before' ? parentInfo.index : parentInfo.index + 1;
    }

    const updated = moveNodeInTree(documentTree, draggingNodeId, targetParentId, targetIndex);
    pushHistory(updated);
    setSelectedNodeId(draggingNodeId);
    clearDragState();
  }, [dragState, documentTree, pushHistory, clearDragState]);

  const moveNode = useCallback((sourceId: string, targetParentId: string, targetIndex: number) => {
    const updated = moveNodeInTree(documentTree, sourceId, targetParentId, targetIndex);
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const moveNodeUp = useCallback((nodeId: string) => {
    const parentInfo = findParentNode(documentTree, nodeId);
    if (!parentInfo || parentInfo.index <= 0) return;
    const updated = moveNodeInTree(
      documentTree,
      nodeId,
      parentInfo.parent.id,
      parentInfo.index - 1
    );
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const moveNodeDown = useCallback((nodeId: string) => {
    const parentInfo = findParentNode(documentTree, nodeId);
    if (!parentInfo || !parentInfo.parent.children || parentInfo.index >= parentInfo.parent.children.length - 1) return;
    const updated = moveNodeInTree(
      documentTree,
      nodeId,
      parentInfo.parent.id,
      parentInfo.index + 2
    );
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  // Resolves styles for any node using current viewport
  const resolveStyles = useCallback((node: DocumentNode): ElementStyles => {
    return resolveNodeStyles(node, viewportMode);
  }, [viewportMode]);

  const isOverridden = useCallback((node: DocumentNode, propKey: keyof ElementStyles): boolean => {
    return checkIsOverridden(node, viewportMode, propKey);
  }, [viewportMode]);

  const getInheritedStyle = useCallback(
    (node: DocumentNode, propKey: keyof ElementStyles): any => {
      return getInheritedValue(node, viewportMode, propKey);
    },
    [viewportMode]
  );

  // Node mutations: updates base styles if desktop, or breakpoint override if tablet/mobile
  const updateNodeStyles = useCallback((nodeId: string, styles: Partial<ElementStyles>) => {
    const updated = updateNodeInTree(documentTree, nodeId, (node) => {
      if (viewportMode === 'desktop') {
        return {
          ...node,
          styles: { ...node.styles, ...styles },
        };
      } else {
        const currentResponsive = node.responsive || {};
        const bpOverrides = currentResponsive[viewportMode] || {};
        return {
          ...node,
          responsive: {
            ...currentResponsive,
            [viewportMode]: { ...bpOverrides, ...styles },
          },
        };
      }
    });
    pushHistory(updated);
  }, [documentTree, viewportMode, pushHistory]);

  // Live style update for continuous dragging/resizing
  const updateNodeStylesLive = useCallback((nodeId: string, styles: Partial<ElementStyles>) => {
    setHistory((prev) => {
      const current = prev[historyIndex];
      const updated = updateNodeInTree(current, nodeId, (node) => {
        if (viewportMode === 'desktop') {
          return {
            ...node,
            styles: { ...node.styles, ...styles },
          };
        } else {
          const currentResponsive = node.responsive || {};
          const bpOverrides = currentResponsive[viewportMode] || {};
          return {
            ...node,
            responsive: {
              ...currentResponsive,
              [viewportMode]: { ...bpOverrides, ...styles },
            },
          };
        }
      });
      const copy = [...prev];
      copy[historyIndex] = updated;
      return copy;
    });
  }, [historyIndex, viewportMode]);

  // Reset a specific property override back to inherited value
  const resetResponsiveStyle = useCallback((nodeId: string, propKey: keyof ElementStyles) => {
    if (viewportMode === 'desktop') return;
    const updated = updateNodeInTree(documentTree, nodeId, (node) => {
      if (!node.responsive || !node.responsive[viewportMode]) return node;
      const bpOverrides = { ...node.responsive[viewportMode] };
      delete bpOverrides[propKey];
      return {
        ...node,
        responsive: {
          ...node.responsive,
          [viewportMode]: bpOverrides,
        },
      };
    });
      pushHistory(updated);
    },
    [documentTree, viewportMode, pushHistory]
  );

  // Reset all overrides on current breakpoint for a node
  const resetAllResponsiveOverrides = useCallback(
    (nodeId: string) => {
      if (viewportMode === 'desktop') return;
      const updated = updateNodeInTree(documentTree, nodeId, (node) => {
        if (!node.responsive || !node.responsive[viewportMode]) return node;
        const currentResponsive = { ...node.responsive };
        delete currentResponsive[viewportMode];
        return {
          ...node,
          responsive: currentResponsive,
        };
      });
      pushHistory(updated);
    },
    [documentTree, viewportMode, pushHistory]
  );

  // Update responsive device visibility
  const updateNodeResponsiveVisibility = useCallback(
    (nodeId: string, visibility: Partial<ResponsiveVisibility>) => {
      const updated = updateNodeInTree(documentTree, nodeId, (node) => ({
        ...node,
        responsiveVisibility: {
          ...(node.responsiveVisibility || {}),
          ...visibility,
        },
      }));
      pushHistory(updated);
    },
    [documentTree, pushHistory]
  );

  const updateNodeContent = useCallback((nodeId: string, content: string) => {
    const updated = updateNodeInTree(documentTree, nodeId, (node) => ({
      ...node,
      content,
    }));
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const updateNodeProps = useCallback((nodeId: string, props: Record<string, any>) => {
    const updated = updateNodeInTree(documentTree, nodeId, (node) => ({
      ...node,
      props: { ...node.props, ...props },
    }));
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === documentTree.id) return;
    const parentInfo = findParentNode(documentTree, nodeId);
    const updated = deleteNodeFromTree(documentTree, nodeId);
    setSelectedNodeId(parentInfo ? parentInfo.parent.id : null);
    setEditingNodeId(null);
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const duplicateNode = useCallback((nodeId: string) => {
    if (nodeId === documentTree.id) return;
    const updated = duplicateNodeInTree(documentTree, nodeId);
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const insertComponent = useCallback((parentId: string | null, componentId: string) => {
    const compDef = insertableComponents.find((c) => c.id === componentId);
    if (!compDef) return;

    const targetParent = parentId ? findNode(documentTree, parentId) : null;
    const isParentFree = targetParent ? targetParent.styles.layoutMode !== 'flow' : true;

    const defaultStyles: ElementStyles = {
      ...compDef.defaultStyles,
      horizontalConstraint: 'left',
      verticalConstraint: 'top',
    };

    if (compDef.type === 'section' || compDef.type === 'container') {
      defaultStyles.layoutMode = defaultStyles.layoutMode || 'free';
      defaultStyles.position = defaultStyles.position || 'relative';
    }

    if (compDef.type === 'image') {
      defaultStyles.maxWidth = '100%';
      defaultStyles.height = defaultStyles.height || 'auto';
    } else if (compDef.type === 'heading' || compDef.type === 'paragraph') {
      defaultStyles.maxWidth = '100%';
    }

    if (isParentFree && compDef.type !== 'section') {
      defaultStyles.position = 'absolute';
      defaultStyles.x = defaultStyles.x ?? 40;
      defaultStyles.y = defaultStyles.y ?? 40;
    }

    const newNode: DocumentNode = {
      id: `node-${Date.now()}`,
      type: compDef.type,
      name: compDef.name,
      content: compDef.defaultContent,
      styles: defaultStyles,
      props: compDef.defaultProps ? { ...compDef.defaultProps } : undefined,
      children: compDef.type === 'columns' ? [
        {
          id: `node-${Date.now()}-col1`,
          type: 'column',
          name: 'Column 1',
          styles: { padding: '16px', backgroundColor: '#1A2030', borderRadius: '8px', layoutMode: 'free' },
          children: [
            {
              id: `node-${Date.now()}-col1-h`,
              type: 'heading',
              name: 'Column Header',
              content: 'Column One',
              styles: { fontSize: '18px', fontWeight: '600', textColor: '#FFFFFF', marginBottom: '8px' },
            },
            {
              id: `node-${Date.now()}-col1-p`,
              type: 'paragraph',
              name: 'Column Text',
              content: 'Add content to this column.',
              styles: { fontSize: '14px', textColor: '#94A3B8' },
            },
          ],
        },
        {
          id: `node-${Date.now()}-col2`,
          type: 'column',
          name: 'Column 2',
          styles: { padding: '16px', backgroundColor: '#1A2030', borderRadius: '8px', layoutMode: 'free' },
          children: [
            {
              id: `node-${Date.now()}-col2-h`,
              type: 'heading',
              name: 'Column Header',
              content: 'Column Two',
              styles: { fontSize: '18px', fontWeight: '600', textColor: '#FFFFFF', marginBottom: '8px' },
            },
            {
              id: `node-${Date.now()}-col2-p`,
              type: 'paragraph',
              name: 'Column Text',
              content: 'Add content to this column.',
              styles: { fontSize: '14px', textColor: '#94A3B8' },
            },
          ],
        },
      ] : undefined,
    };

    let targetId = parentId || selectedNodeId || documentTree.id;
    if (compDef.type === 'section') {
      targetId = documentTree.id;
    }

    const updated = updateNodeInTree(documentTree, targetId, (node) => {
      const children = node.children ? [...node.children, newNode] : [newNode];
      return { ...node, children };
    });

    setSelectedNodeId(newNode.id);
    pushHistory(updated);
  }, [documentTree, selectedNodeId, pushHistory]);

  const addSection = useCallback((name?: string) => {
    const newSectionId = `section-${Date.now()}`;
    const newSection: DocumentNode = {
      id: newSectionId,
      type: 'section',
      name: name || `Section ${(documentTree.children?.length || 0) + 1}`,
      styles: {
        backgroundColor: '#181818',
        paddingTop: '64px',
        paddingBottom: '64px',
        paddingLeft: '32px',
        paddingRight: '32px',
        minHeight: '360px',
        position: 'relative',
        layoutMode: 'free',
        width: '100%',
      },
      children: [],
    };
    const updated = {
      ...documentTree,
      children: [...(documentTree.children || []), newSection],
    };
    pushHistory(updated);
    selectNode(newSection.id);
  }, [documentTree, pushHistory, selectNode]);

  const toggleNodeVisibility = useCallback((nodeId: string) => {
    const updated = updateNodeInTree(documentTree, nodeId, (node) => ({
      ...node,
      hidden: !node.hidden,
    }));
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const toggleNodeLock = useCallback((nodeId: string) => {
    const updated = updateNodeInTree(documentTree, nodeId, (node) => ({
      ...node,
      locked: !node.locked,
    }));
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  // Phase 2 & 3: Layout mode switcher (Flow | Grid | Free) with responsive breakpoint overrides
  const setContainerLayoutMode = useCallback((containerId: string, newMode: LayoutMode) => {
    const updated = updateNodeInTree(documentTree, containerId, (container) => {
      const activeStyles = resolveNodeStyles(container, viewportMode);
      const currentMode = activeStyles.layoutMode || 'flow';
      if (currentMode === newMode) return container;

      // Breakpoint override for Tablet / Mobile
      if (viewportMode !== 'desktop') {
        const currentResponsive = container.responsive || {};
        const bpOverrides = currentResponsive[viewportMode] || {};
        const updatedBpStyles: Partial<ElementStyles> = {
          ...bpOverrides,
          layoutMode: newMode,
        };
        if (newMode === 'free') {
          updatedBpStyles.position = 'relative';
          if (!activeStyles.minHeight || activeStyles.minHeight === 'auto') {
            updatedBpStyles.minHeight = '380px';
          }
        } else if (newMode === 'grid') {
          updatedBpStyles.display = 'grid';
          updatedBpStyles.position = 'relative';
        } else {
          updatedBpStyles.display = 'flex';
          updatedBpStyles.position = 'relative';
        }

        return {
          ...container,
          responsive: {
            ...currentResponsive,
            [viewportMode]: updatedBpStyles,
          },
        };
      }

      // Base Desktop Mode
      let updatedStyles: Partial<ElementStyles> = { layoutMode: newMode };
      let updatedChildren = container.children ? [...container.children] : [];

      if (newMode === 'free') {
        updatedStyles = {
          ...updatedStyles,
          position: 'relative',
          minHeight:
            container.styles.minHeight && container.styles.minHeight !== 'auto'
              ? container.styles.minHeight
              : '380px',
        };
        updatedChildren = updatedChildren.map((child, index) => {
          const x = child.styles.x !== undefined ? child.styles.x : 32;
          const y = child.styles.y !== undefined ? child.styles.y : (32 + index * 72);
          const zIndex = child.styles.zIndex !== undefined ? child.styles.zIndex : (index + 1);
          return {
            ...child,
            styles: {
              ...child.styles,
              position: 'absolute',
              x,
              y,
              zIndex,
              horizontalConstraint: child.styles.horizontalConstraint || 'left',
              verticalConstraint: child.styles.verticalConstraint || 'top',
            },
          };
        });
      } else if (newMode === 'grid') {
        updatedStyles = {
          ...updatedStyles,
          display: 'grid',
          position: 'relative',
          gridColumns: container.styles.gridColumns || 3,
          gridGap: container.styles.gridGap || '20px',
        };
        updatedChildren = updatedChildren.map((child) => {
          const { position, x, y, ...restStyles } = child.styles;
          return {
            ...child,
            styles: {
              ...restStyles,
              position: 'relative',
            },
          };
        });
      } else {
        // Flow
        updatedChildren.sort((a, b) => {
          const yA = a.styles.y || 0;
          const yB = b.styles.y || 0;
          if (yA !== yB) return yA - yB;
          return (a.styles.x || 0) - (b.styles.x || 0);
        });
        updatedStyles = {
          ...updatedStyles,
          display: 'flex',
          flexDirection: container.styles.flexDirection || 'column',
          position: 'relative',
        };
        updatedChildren = updatedChildren.map((child) => {
          const { position, x, y, zIndex, ...restStyles } = child.styles;
          return {
            ...child,
            styles: {
              ...restStyles,
              position: 'relative',
            },
          };
        });
      }

      return {
        ...container,
        styles: {
          ...container.styles,
          ...updatedStyles,
        },
        children: updatedChildren,
      };
    });

    pushHistory(updated);
  }, [documentTree, viewportMode, pushHistory]);

  const alignNodeInParent = useCallback((
    nodeId: string,
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom',
    parentWidth = 1000,
    parentHeight = 400,
    nodeWidth = 200,
    nodeHeight = 100
  ) => {
    const parentInfo = findParentNode(documentTree, nodeId);
    if (!parentInfo) return;

    const node = findNode(documentTree, nodeId);
    if (!node) return;

    let newX = node.styles.x || 0;
    let newY = node.styles.y || 0;

    switch (alignment) {
      case 'left':
        newX = 0;
        break;
      case 'center':
        newX = Math.round(Math.max(0, (parentWidth - nodeWidth) / 2));
        break;
      case 'right':
        newX = Math.round(Math.max(0, parentWidth - nodeWidth));
        break;
      case 'top':
        newY = 0;
        break;
      case 'middle':
        newY = Math.round(Math.max(0, (parentHeight - nodeHeight) / 2));
        break;
      case 'bottom':
        newY = Math.round(Math.max(0, parentHeight - nodeHeight));
        break;
    }

    const rightOffset = Math.round(Math.max(0, parentWidth - (newX + nodeWidth)));
    const bottomOffset = Math.round(Math.max(0, parentHeight - (newY + nodeHeight)));
    const centerOffsetX = Math.round((newX + nodeWidth / 2) - parentWidth / 2);
    const centerOffsetY = Math.round((newY + nodeHeight / 2) - parentHeight / 2);
    const scaleLeft = parseFloat(((newX / parentWidth) * 100).toFixed(2));
    const scaleWidth = parseFloat(((nodeWidth / parentWidth) * 100).toFixed(2));
    const scaleTop = parseFloat(((newY / parentHeight) * 100).toFixed(2));
    const scaleHeight = parseFloat(((nodeHeight / parentHeight) * 100).toFixed(2));

    updateNodeStyles(nodeId, {
      x: newX,
      y: newY,
      position: 'absolute',
      rightOffset,
      bottomOffset,
      centerOffsetX,
      centerOffsetY,
      scaleLeft,
      scaleWidth,
      scaleTop,
      scaleHeight,
    });
  }, [documentTree, updateNodeStyles]);

  const bringForward = useCallback((nodeId: string) => {
    const parentInfo = findParentNode(documentTree, nodeId);
    if (!parentInfo || !parentInfo.parent.children) return;

    const children = [...parentInfo.parent.children];
    const idx = parentInfo.index;
    if (idx < children.length - 1) {
      const temp = children[idx];
      children[idx] = children[idx + 1];
      children[idx + 1] = temp;
    }

    const updated = updateNodeInTree(documentTree, parentInfo.parent.id, (parent) => {
      const updatedChildren = children.map((c) => ({
        ...c,
        styles: {
          ...c.styles,
          zIndex: (c.styles.zIndex || 1) + (c.id === nodeId ? 1 : 0),
        },
      }));
      return { ...parent, children: updatedChildren };
    });
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const sendBackward = useCallback((nodeId: string) => {
    const parentInfo = findParentNode(documentTree, nodeId);
    if (!parentInfo || !parentInfo.parent.children) return;

    const children = [...parentInfo.parent.children];
    const idx = parentInfo.index;
    if (idx > 0) {
      const temp = children[idx];
      children[idx] = children[idx - 1];
      children[idx - 1] = temp;
    }

    const updated = updateNodeInTree(documentTree, parentInfo.parent.id, (parent) => {
      const updatedChildren = children.map((c) => ({
        ...c,
        styles: {
          ...c.styles,
          zIndex: Math.max(1, (c.styles.zIndex || 1) - (c.id === nodeId ? 1 : 0)),
        },
      }));
      return { ...parent, children: updatedChildren };
    });
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const bringToFront = useCallback((nodeId: string) => {
    const parentInfo = findParentNode(documentTree, nodeId);
    if (!parentInfo || !parentInfo.parent.children) return;

    const targetNode = parentInfo.parent.children.find((c) => c.id === nodeId);
    if (!targetNode) return;
    const children = parentInfo.parent.children.filter((c) => c.id !== nodeId);
    children.push(targetNode);

    const maxZ = Math.max(0, ...parentInfo.parent.children.map((c) => c.styles.zIndex || 1));
    const updated = updateNodeInTree(documentTree, parentInfo.parent.id, (parent) => ({
      ...parent,
      children: children.map((c) =>
        c.id === nodeId ? { ...c, styles: { ...c.styles, zIndex: maxZ + 1 } } : c
      ),
    }));
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const sendToBack = useCallback((nodeId: string) => {
    const parentInfo = findParentNode(documentTree, nodeId);
    if (!parentInfo || !parentInfo.parent.children) return;

    const targetNode = parentInfo.parent.children.find((c) => c.id === nodeId);
    if (!targetNode) return;
    const children = [targetNode, ...parentInfo.parent.children.filter((c) => c.id !== nodeId)];

    const updated = updateNodeInTree(documentTree, parentInfo.parent.id, (parent) => ({
      ...parent,
      children: children.map((c) =>
        c.id === nodeId ? { ...c, styles: { ...c.styles, zIndex: 1 } } : c
      ),
    }));
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const groupSelectedNodes = useCallback((nodeIds: string[]) => {
    if (nodeIds.length < 1) return;

    const firstNode = findNode(documentTree, nodeIds[0]);
    if (!firstNode) return;
    const parentInfo = findParentNode(documentTree, firstNode.id);
    if (!parentInfo || !parentInfo.parent.children) return;

    const parent = parentInfo.parent;
    const parentChildren = parent.children || [];
    const isFree = parent.styles.layoutMode === 'free';
    const targetNodes = parentChildren.filter((c) => nodeIds.includes(c.id));
    if (targetNodes.length === 0) return;

    const groupId = `node-group-${Date.now()}`;

    let groupStyles: ElementStyles = {
      layoutMode: isFree ? 'free' : 'flow',
      display: isFree ? 'block' : 'flex',
      flexDirection: 'column',
      gap: '16px',
    };

    let mappedChildren = targetNodes;

    if (isFree) {
      const minX = Math.min(...targetNodes.map((n) => n.styles.x || 0));
      const minY = Math.min(...targetNodes.map((n) => n.styles.y || 0));
      const maxX = Math.max(...targetNodes.map((n) => (n.styles.x || 0) + 160));
      const maxY = Math.max(...targetNodes.map((n) => (n.styles.y || 0) + 80));

      groupStyles = {
        layoutMode: 'free',
        position: 'absolute',
        x: minX,
        y: minY,
        width: `${Math.max(100, maxX - minX)}px`,
        minHeight: `${Math.max(60, maxY - minY)}px`,
      };

      mappedChildren = targetNodes.map((c) => ({
        ...c,
        styles: {
          ...c.styles,
          x: (c.styles.x || 0) - minX,
          y: (c.styles.y || 0) - minY,
        },
      }));
    }

    const groupContainer: DocumentNode = {
      id: groupId,
      type: 'container',
      name: 'Group Container',
      styles: groupStyles,
      children: mappedChildren,
    };

    const remainingChildren: DocumentNode[] = [];
    let inserted = false;
    for (const child of parentChildren) {
      if (nodeIds.includes(child.id)) {
        if (!inserted) {
          remainingChildren.push(groupContainer);
          inserted = true;
        }
      } else {
        remainingChildren.push(child);
      }
    }

    const updated = updateNodeInTree(documentTree, parent.id, (p) => ({
      ...p,
      children: remainingChildren,
    }));

    setSelectedNodeId(groupId);
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const ungroupNode = useCallback((containerId: string) => {
    const container = findNode(documentTree, containerId);
    if (!container || !container.children || container.children.length === 0) return;
    const parentInfo = findParentNode(documentTree, containerId);
    if (!parentInfo || !parentInfo.parent.children) return;

    const parent = parentInfo.parent;
    const parentChildren = parent.children || [];
    const isFree = container.styles.layoutMode === 'free';
    const offsetX = container.styles.x || 0;
    const offsetY = container.styles.y || 0;

    const unpackedChildren = container.children.map((c) => {
      if (isFree) {
        return {
          ...c,
          styles: {
            ...c.styles,
            x: (c.styles.x || 0) + offsetX,
            y: (c.styles.y || 0) + offsetY,
          },
        };
      }
      return c;
    });

    const newChildren: DocumentNode[] = [];
    for (const child of parentChildren) {
      if (child.id === containerId) {
        newChildren.push(...unpackedChildren);
      } else {
        newChildren.push(child);
      }
    }

    const updated = updateNodeInTree(documentTree, parent.id, (p) => ({
      ...p,
      children: newChildren,
    }));

    if (unpackedChildren.length > 0) {
      setSelectedNodeIds([unpackedChildren[0].id]);
    }
    pushHistory(updated);
  }, [documentTree, pushHistory]);

  const detachElementToFreePosition = useCallback(
    (
      nodeId: string,
      renderedRect?: { x: number; y: number; width?: number; height?: number }
    ) => {
      const target = findNode(documentTree, nodeId);
      if (!target || target.type === 'page') return;

      const parentInfo = findParentNode(documentTree, nodeId);
      if (!parentInfo) return;
      const parent = parentInfo.parent;

      const maxZ = Math.max(
        0,
        ...(parent.children?.map((c) => c.styles.zIndex || 1) || [1])
      );

      const targetX = renderedRect?.x ?? target.styles.x ?? 32;
      const targetY = renderedRect?.y ?? target.styles.y ?? 32;
      const targetW = renderedRect?.width ?? (target.styles.width ? parseInt(target.styles.width) : 240);
      const targetH = renderedRect?.height ?? (target.styles.height ? parseInt(target.styles.height) : 100);

      const updated = updateNodeInTree(documentTree, nodeId, (curr) => ({
        ...curr,
        styles: {
          ...curr.styles,
          position: 'absolute',
          x: Math.round(targetX),
          y: Math.round(targetY),
          width: curr.styles.width || `${Math.round(targetW)}px`,
          customWidth: curr.styles.customWidth || `${Math.round(targetW)}px`,
          zIndex: maxZ + 1,
          horizontalConstraint: curr.styles.horizontalConstraint || 'left',
          verticalConstraint: curr.styles.verticalConstraint || 'top',
        },
      }));

      pushHistory(updated);
    },
    [documentTree, pushHistory]
  );

  const returnElementToStructuredLayout = useCallback(
    (nodeId: string, targetIndex?: number) => {
      const target = findNode(documentTree, nodeId);
      if (!target || target.type === 'page') return;

      const parentInfo = findParentNode(documentTree, nodeId);
      if (!parentInfo) return;

      const updated = updateNodeInTree(documentTree, nodeId, (curr) => {
        const nextStyles = { ...curr.styles };
        delete nextStyles.position;
        delete nextStyles.x;
        delete nextStyles.y;
        delete nextStyles.zIndex;
        delete nextStyles.rightOffset;
        delete nextStyles.bottomOffset;
        delete nextStyles.centerOffsetX;
        delete nextStyles.centerOffsetY;
        delete nextStyles.scaleLeft;
        delete nextStyles.scaleWidth;
        delete nextStyles.scaleTop;
        delete nextStyles.scaleHeight;
        delete nextStyles.horizontalConstraint;
        delete nextStyles.verticalConstraint;
        return {
          ...curr,
          styles: nextStyles,
        };
      });

      if (targetIndex !== undefined && parentInfo.parent.children) {
        const reordered = moveNodeInTree(
          updated,
          nodeId,
          parentInfo.parent.id,
          targetIndex
        );
        pushHistory(reordered);
      } else {
        pushHistory(updated);
      }
    },
    [documentTree, pushHistory]
  );

  const alignSelectedNodes = useCallback(
    (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
      if (selectedNodeIds.length < 2) return;

      const nodes = selectedNodeIds
        .map((id) => findNode(documentTree, id))
        .filter((n): n is DocumentNode => Boolean(n && n.type !== 'page'));

      if (nodes.length < 2) return;

      const minX = Math.min(...nodes.map((n) => n.styles.x || 0));
      const maxX = Math.max(
        ...nodes.map((n) => (n.styles.x || 0) + (parseInt(n.styles.customWidth || n.styles.width || '120') || 120))
      );
      const minY = Math.min(...nodes.map((n) => n.styles.y || 0));
      const maxY = Math.max(
        ...nodes.map((n) => (n.styles.y || 0) + (parseInt(n.styles.minHeight || n.styles.height || '60') || 60))
      );

      let updatedTree = documentTree;

      nodes.forEach((n) => {
        const w = parseInt(n.styles.customWidth || n.styles.width || '120') || 120;
        const h = parseInt(n.styles.minHeight || n.styles.height || '60') || 60;
        let newX = n.styles.x || 0;
        let newY = n.styles.y || 0;

        switch (alignment) {
          case 'left':
            newX = minX;
            break;
          case 'center':
            newX = Math.round((minX + maxX) / 2 - w / 2);
            break;
          case 'right':
            newX = maxX - w;
            break;
          case 'top':
            newY = minY;
            break;
          case 'middle':
            newY = Math.round((minY + maxY) / 2 - h / 2);
            break;
          case 'bottom':
            newY = maxY - h;
            break;
        }

        updatedTree = updateNodeInTree(updatedTree, n.id, (curr) => ({
          ...curr,
          styles: {
            ...curr.styles,
            position: 'absolute',
            x: newX,
            y: newY,
          },
        }));
      });

      pushHistory(updatedTree);
    },
    [selectedNodeIds, documentTree, pushHistory]
  );

  const distributeSelectedNodes = useCallback(
    (axis: 'horizontal' | 'vertical') => {
      if (selectedNodeIds.length < 3) return;

      const nodes = selectedNodeIds
        .map((id) => findNode(documentTree, id))
        .filter((n): n is DocumentNode => Boolean(n && n.type !== 'page'));

      if (nodes.length < 3) return;

      let updatedTree = documentTree;

      if (axis === 'horizontal') {
        const sorted = [...nodes].sort((a, b) => (a.styles.x || 0) - (b.styles.x || 0));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const firstX = first.styles.x || 0;
        const lastX = last.styles.x || 0;
        const totalSpan = lastX - firstX;
        const step = totalSpan / (sorted.length - 1);

        sorted.forEach((n, idx) => {
          if (idx === 0 || idx === sorted.length - 1) return;
          const newX = Math.round(firstX + step * idx);
          updatedTree = updateNodeInTree(updatedTree, n.id, (curr) => ({
            ...curr,
            styles: {
              ...curr.styles,
              position: 'absolute',
              x: newX,
            },
          }));
        });
      } else {
        const sorted = [...nodes].sort((a, b) => (a.styles.y || 0) - (b.styles.y || 0));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const firstY = first.styles.y || 0;
        const lastY = last.styles.y || 0;
        const totalSpan = lastY - firstY;
        const step = totalSpan / (sorted.length - 1);

        sorted.forEach((n, idx) => {
          if (idx === 0 || idx === sorted.length - 1) return;
          const newY = Math.round(firstY + step * idx);
          updatedTree = updateNodeInTree(updatedTree, n.id, (curr) => ({
            ...curr,
            styles: {
              ...curr.styles,
              position: 'absolute',
              y: newY,
            },
          }));
        });
      }

      pushHistory(updatedTree);
    },
    [selectedNodeIds, documentTree, pushHistory]
  );

  const nudgeSelectedNodes = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right', isLarge: boolean) => {
      if (selectedNodeIds.length === 0) return;
      const dist = isLarge ? 10 : 1;
      let updatedTree = documentTree;

      selectedNodeIds.forEach((id) => {
        const node = findNode(documentTree, id);
        if (!node || node.type === 'page') return;

        const currX = node.styles.x || 0;
        const currY = node.styles.y || 0;

        let nextX = currX;
        let nextY = currY;

        if (direction === 'left') nextX -= dist;
        if (direction === 'right') nextX += dist;
        if (direction === 'up') nextY -= dist;
        if (direction === 'down') nextY += dist;

        updatedTree = updateNodeInTree(updatedTree, id, (curr) => ({
          ...curr,
          styles: {
            ...curr.styles,
            position: 'absolute',
            x: nextX,
            y: nextY,
          },
        }));
      });

      pushHistory(updatedTree);
    },
    [selectedNodeIds, documentTree, pushHistory]
  );

  return (
    <EditorContext.Provider
      value={{
        pages,
        currentPageId,
        currentPage,
        setCurrentPageId: handleSetCurrentPageId,
        documentTree,
        selectedNodeId,
        selectedNodeIds,
        selectedNode,
        selectNode,
        selectNodes,
        toggleNodeSelection,
        selectAll,
        hoveredNodeId,
        setHoveredNodeId,
        selectParentNode,
        marquee,
        setMarquee,
        editingNodeId,
        startInlineEditing,
        stopInlineEditing,
        dragState,
        setDragState,
        clearDragState,
        handleDrop,
        moveNode,
        moveNodeUp,
        moveNodeDown,
        viewportMode,
        setViewportMode,
        canvasCustomWidth,
        setCanvasCustomWidth,
        viewMode,
        setViewMode,
        isPreviewMode,
        setIsPreviewMode,
        canvasZoom,
        setCanvasZoom,
        isFitMode,
        setIsFitMode,
        canvasPan,
        setCanvasPan,
        canvasTool,
        setCanvasTool,
        canvasViewMode,
        setCanvasViewMode,
        setContainerSize,
        zoomIn,
        zoomOut,
        resetZoom100,
        fitToPage,
        fitAllFrames,
        activeSidebarTab,
        setActiveSidebarTab,
        toggleSidebarTab,
        isInspectorOpen,
        setIsInspectorOpen,
        toggleInspector,
        canUndo,
        canRedo,
        undo,
        redo,
        commitHistory,
        resolveStyles,
        isOverridden,
        getInheritedStyle,
        updateNodeStyles,
        updateNodeStylesLive,
        resetResponsiveStyle,
        resetAllResponsiveOverrides,
        updateNodeResponsiveVisibility,
        updateNodeContent,
        updateNodeProps,
        deleteNode,
        duplicateNode,
        insertComponent,
        addSection,
        toggleNodeVisibility,
        toggleNodeLock,
        setContainerLayoutMode,
        alignNodeInParent,
        bringForward,
        sendBackward,
        bringToFront,
        sendToBack,
        groupSelectedNodes,
        ungroupNode,
        snapToGrid,
        setSnapToGrid,
        snapToElements,
        setSnapToElements,
        gridSnapSize,
        setGridSnapSize,
        activeAlignmentGuides,
        setActiveAlignmentGuides,
        detachElementToFreePosition,
        returnElementToStructuredLayout,
        alignSelectedNodes,
        distributeSelectedNodes,
        nudgeSelectedNodes,
        contextMenu,
        openContextMenu,
        closeContextMenu,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
