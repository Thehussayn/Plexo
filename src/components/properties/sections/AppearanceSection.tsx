import React from 'react';
import { DocumentNode } from '../../../types/editor';
import { useEditor } from '../../../context/EditorContext';

interface AppearanceSectionProps {
  node: DocumentNode;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({ node }) => {
  const { updateNodeStyles } = useEditor();

  return (
    <div className="space-y-4">
      {/* Background Color */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Background</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={node.styles.backgroundColor || 'transparent'}
            onChange={(e) => updateNodeStyles(node.id, { backgroundColor: e.target.value })}
            className="bg-[#10131E] border border-[#23293D] rounded-lg px-2 py-1 text-xs text-gray-200 w-28 font-mono focus:outline-none focus:border-purple-500"
          />
          <input
            type="color"
            value={
              node.styles.backgroundColor && node.styles.backgroundColor.startsWith('#')
                ? node.styles.backgroundColor
                : '#161B28'
            }
            onChange={(e) => updateNodeStyles(node.id, { backgroundColor: e.target.value })}
            className="w-7 h-7 rounded-md cursor-pointer border border-[#23293D] bg-transparent p-0"
          />
        </div>
      </div>

      {/* Background Image URL (for sections/containers) */}
      {(node.type === 'section' || node.type === 'container' || node.type === 'page') && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Background Image URL
          </span>
          <input
            type="text"
            placeholder="https://images.unsplash.com/..."
            value={node.styles.backgroundImage || ''}
            onChange={(e) => updateNodeStyles(node.id, { backgroundImage: e.target.value })}
            className="w-full bg-[#10131E] border border-[#23293D] rounded-lg p-2 text-xs text-gray-200 focus:outline-none focus:border-purple-500 font-mono truncate"
          />
        </div>
      )}

      {/* Opacity Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium">Opacity</span>
          <span className="text-gray-200 font-mono">
            {Math.round((node.styles.opacity !== undefined ? node.styles.opacity : 1) * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={node.styles.opacity !== undefined ? node.styles.opacity : 1}
          onChange={(e) => updateNodeStyles(node.id, { opacity: parseFloat(e.target.value) })}
          className="w-full accent-purple-500 cursor-pointer"
        />
      </div>

      {/* Border Radius */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Border Radius</span>
        <div className="flex items-center bg-[#10131E] border border-[#23293D] rounded-lg px-2 py-1 text-xs w-24 justify-between">
          <input
            type="text"
            value={node.styles.borderRadius || '0px'}
            onChange={(e) => updateNodeStyles(node.id, { borderRadius: e.target.value })}
            className="bg-transparent text-gray-200 w-16 focus:outline-none text-right font-mono"
          />
        </div>
      </div>

      {/* Border Width & Style */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Border Width</span>
        <div className="flex items-center bg-[#10131E] border border-[#23293D] rounded-lg px-2 py-1 text-xs w-24 justify-between">
          <input
            type="text"
            value={node.styles.borderWidth || '0px'}
            onChange={(e) => updateNodeStyles(node.id, { borderWidth: e.target.value })}
            className="bg-transparent text-gray-200 w-16 focus:outline-none text-right font-mono"
          />
        </div>
      </div>

      {/* Border Color */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Border Color</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={node.styles.borderColor || '#283044'}
            onChange={(e) => updateNodeStyles(node.id, { borderColor: e.target.value })}
            className="bg-[#10131E] border border-[#23293D] rounded-lg px-2 py-1 text-xs text-gray-200 w-24 font-mono uppercase focus:outline-none focus:border-purple-500"
          />
          <input
            type="color"
            value={node.styles.borderColor?.startsWith('#') ? node.styles.borderColor : '#283044'}
            onChange={(e) => updateNodeStyles(node.id, { borderColor: e.target.value })}
            className="w-7 h-7 rounded-md cursor-pointer border border-[#23293D] bg-transparent p-0"
          />
        </div>
      </div>
    </div>
  );
};
