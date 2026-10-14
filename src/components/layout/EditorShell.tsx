import React, { useEffect } from 'react';
import { TopToolbar } from './TopToolbar';
import { LeftToolRail } from './LeftToolRail';
import { FlyoutDrawer } from '../sidebar/FlyoutDrawer';
import { CanvasArea } from '../canvas/CanvasArea';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { ContextMenu } from './ContextMenu';
import { useEditor } from '../../context/EditorContext';

export const EditorShell: React.FC = () => {
  const {
    selectedNodeId,
    selectedNodeIds,
    selectedNode,
    deleteNode,
    duplicateNode,
    undo,
    redo,
    selectParentNode,
    selectNode,
    selectAll,
    editingNodeId,
    stopInlineEditing,
    startInlineEditing,
    documentTree,
    activeSidebarTab,
    groupSelectedNodes,
    ungroupNode,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    nudgeSelectedNodes,
  } = useEditor();

  // Keyboard shortcut system
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      // If user is currently typing in an input, textarea, or contentEditable
      if (isInputFocused) {
        if (e.key === 'Escape') {
          (activeEl as HTMLElement)?.blur();
          stopInlineEditing();
        }
        return;
      }

      // Select All: Cmd+A / Ctrl+A
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }

      // Undo: Cmd+Z / Ctrl+Z
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Cmd+Shift+Z / Ctrl+Shift+Z / Ctrl+Y
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && e.shiftKey) ||
        (e.ctrlKey && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        redo();
        return;
      }

      // Group: Cmd+G / Ctrl+G
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g' && !e.shiftKey) {
        const activeIds = selectedNodeIds.filter((id) => id !== documentTree.id);
        if (activeIds.length > 0) {
          e.preventDefault();
          groupSelectedNodes(activeIds);
        }
        return;
      }

      // Ungroup: Cmd+Shift+G / Ctrl+Shift+G
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g' && e.shiftKey) {
        if (selectedNodeId && selectedNodeId !== documentTree.id) {
          e.preventDefault();
          ungroupNode(selectedNodeId);
        }
        return;
      }

      // Duplicate: Cmd+D / Ctrl+D
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        if (selectedNodeId && selectedNodeId !== documentTree.id) {
          e.preventDefault();
          duplicateNode(selectedNodeId);
        }
        return;
      }

      // Delete: Backspace / Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        const activeIds = selectedNodeIds.filter((id) => id !== documentTree.id);
        if (activeIds.length > 0) {
          e.preventDefault();
          activeIds.forEach((id) => deleteNode(id));
        }
        return;
      }

      // Keyboard Nudge: Arrow keys (1px, or 10px with Shift)
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        if (selectedNodeIds.length > 0) {
          e.preventDefault();
          const dir =
            e.key === 'ArrowUp'
              ? 'up'
              : e.key === 'ArrowDown'
              ? 'down'
              : e.key === 'ArrowLeft'
              ? 'left'
              : 'right';
          nudgeSelectedNodes(dir, e.shiftKey);
        }
        return;
      }

      // Bring to Front: Shift+Cmd+] / Shift+Ctrl+]
      // Bring Forward: Cmd+] / Ctrl+]
      if ((e.metaKey || e.ctrlKey) && (e.key === ']' || e.key === '}')) {
        if (selectedNodeId && selectedNodeId !== documentTree.id) {
          e.preventDefault();
          if (e.shiftKey) {
            bringToFront(selectedNodeId);
          } else {
            bringForward(selectedNodeId);
          }
        }
        return;
      }

      // Send to Back: Shift+Cmd+[ / Shift+Ctrl+[
      // Send Backward: Cmd+[ / Ctrl+[
      if ((e.metaKey || e.ctrlKey) && (e.key === '[' || e.key === '{')) {
        if (selectedNodeId && selectedNodeId !== documentTree.id) {
          e.preventDefault();
          if (e.shiftKey) {
            sendToBack(selectedNodeId);
          } else {
            sendBackward(selectedNodeId);
          }
        }
        return;
      }

      // Escape: Exit inline editing or navigate to parent container or deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        if (editingNodeId) {
          stopInlineEditing();
        } else if (selectedNodeId && selectedNodeId !== documentTree.id) {
          selectParentNode();
        } else {
          selectNode(null);
        }
        return;
      }

      // Enter: Enter selected container or start inline text editing
      if (e.key === 'Enter') {
        if (!selectedNode) return;
        const isText =
          selectedNode.type === 'heading' ||
          selectedNode.type === 'paragraph' ||
          selectedNode.type === 'button' ||
          selectedNode.type === 'badge';

        if (isText) {
          e.preventDefault();
          startInlineEditing(selectedNode.id);
        } else if (selectedNode.children && selectedNode.children.length > 0) {
          e.preventDefault();
          selectNode(selectedNode.children[0].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedNodeId,
    selectedNode,
    deleteNode,
    duplicateNode,
    undo,
    redo,
    selectParentNode,
    selectNode,
    editingNodeId,
    stopInlineEditing,
    startInlineEditing,
    documentTree.id,
    groupSelectedNodes,
    ungroupNode,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
  ]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#101010] text-[#EDEDED] font-sans antialiased">
      {/* 1. Global Toolbar (44px) */}
      <TopToolbar />

      {/* 2. Core Workspace 4-Zone Model: Tool Rail (68px) | Optional Drawer (260px) | Canvas (Dominant) | Contextual Inspector (260px) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Zone 1: Primary Tool Rail (68px) */}
        <LeftToolRail />

        {/* Zone 2: Optional Left Tool Panel (260px) */}
        {activeSidebarTab && <FlyoutDrawer />}

        {/* Zone 3: Central Canvas (Intelligent Fit & Breathing Room) */}
        <CanvasArea />

        {/* Zone 4: Right Contextual Inspector (260px) */}
        <PropertiesPanel />
      </div>

      {/* 5. Global Context Menu (Triggered via Right Click on Canvas or Layers) */}
      <ContextMenu />
    </div>
  );
};
