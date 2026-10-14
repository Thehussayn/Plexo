import React from 'react';
import { DocumentNode } from '../../../types/editor';
import { useEditor } from '../../../context/EditorContext';

interface AdvancedSectionProps {
  node: DocumentNode;
}

export const AdvancedSection: React.FC<AdvancedSectionProps> = ({ node }) => {
  const { updateNodeStyles } = useEditor();

  return (
    <div className="space-y-4">
      {/* Node ID */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
          Element Identifier
        </label>
        <input
          type="text"
          readOnly
          value={node.id}
          className="w-full bg-[#10131E] border border-[#23293D] rounded-lg p-2 text-xs text-purple-300 font-mono select-all focus:outline-none"
        />
      </div>

      {/* Custom Classes */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
          Custom Classes / Tailwind
        </label>
        <input
          type="text"
          placeholder="e.g. shadow-lg hover:opacity-80 transition"
          value={node.styles.customClasses || ''}
          onChange={(e) => updateNodeStyles(node.id, { customClasses: e.target.value })}
          className="w-full bg-[#10131E] border border-[#23293D] rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500 font-mono"
        />
      </div>

      {/* Node Type Badge */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#1C2130]">
        <span>Element Type:</span>
        <span className="font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
          {node.type}
        </span>
      </div>
    </div>
  );
};
