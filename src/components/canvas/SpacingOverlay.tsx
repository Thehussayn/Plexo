import React from 'react';
import { DocumentNode } from '../../types/editor';
import { useEditor } from '../../context/EditorContext';

interface SpacingOverlayProps {
  node: DocumentNode;
}

export const SpacingOverlay: React.FC<SpacingOverlayProps> = ({ node }) => {
  const { updateNodeStyles, commitHistory } = useEditor();

  const isContainer =
    node.type === 'container' ||
    node.type === 'section' ||
    node.type === 'card' ||
    node.type === 'columns';

  if (!isContainer) return null;

  const currentPaddingTop = node.styles.paddingTop || node.styles.padding || '0px';
  const currentGap = node.styles.gap || '0px';

  const handleAdjustGap = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    const curr = parseInt(currentGap, 10) || 16;
    const next = Math.max(0, curr + delta);
    updateNodeStyles(node.id, { gap: `${next}px` });
  };

  const handleAdjustPadding = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    const curr = parseInt(currentPaddingTop, 10) || 24;
    const next = Math.max(0, curr + delta);
    updateNodeStyles(node.id, {
      paddingTop: `${next}px`,
      paddingBottom: `${next}px`,
    });
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none">
      {/* Inner Padding Visual Indicator (Dotted boundary) */}
      <div className="absolute inset-2 border border-dashed border-purple-400/40 rounded pointer-events-none" />

      {/* Top Padding Badge with interactive stepper */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center bg-[#141826] border border-purple-500/40 rounded px-1.5 py-0.5 text-[9px] font-mono text-purple-300 shadow">
        <span className="mr-1">pad: {currentPaddingTop}</span>
        <button
          onClick={(e) => handleAdjustPadding(e, -4)}
          className="hover:text-white px-1 font-bold"
          title="Decrease padding"
        >
          -
        </button>
        <button
          onClick={(e) => handleAdjustPadding(e, 4)}
          className="hover:text-white px-1 font-bold"
          title="Increase padding"
        >
          +
        </button>
      </div>

      {/* Gap Badge for flex/grid items */}
      {(node.styles.display === 'flex' || node.styles.display === 'grid' || node.type === 'columns') && (
        <div className="absolute bottom-1 right-2 pointer-events-auto flex items-center bg-[#141826] border border-cyan-500/40 rounded px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 shadow">
          <span className="mr-1">gap: {currentGap}</span>
          <button
            onClick={(e) => handleAdjustGap(e, -4)}
            className="hover:text-white px-1 font-bold"
            title="Decrease gap"
          >
            -
          </button>
          <button
            onClick={(e) => handleAdjustGap(e, 4)}
            className="hover:text-white px-1 font-bold"
            title="Increase gap"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};
