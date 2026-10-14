import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { DocumentNode, ElementStyles } from '../../../types/editor';
import { useEditor } from '../../../context/EditorContext';
import { BreakpointIndicator } from '../common/BreakpointIndicator';

interface TypographySectionProps {
  node: DocumentNode;
}

export const TypographySection: React.FC<TypographySectionProps> = ({ node }) => {
  const {
    updateNodeStyles,
    updateNodeContent,
    resolveStyles,
  } = useEditor();

  const styles = resolveStyles(node);

  const handleFontSizeChange = (delta: number) => {
    const currentSize = parseInt(styles.fontSize || '16', 10);
    const newSize = Math.max(10, currentSize + delta);
    updateNodeStyles(node.id, { fontSize: `${newSize}px` });
  };

  const handleCustomWidthChange = (delta: number) => {
    const current = parseInt(styles.customWidth || '100', 10);
    const next = Math.max(10, Math.min(100, current + delta));
    updateNodeStyles(node.id, { customWidth: `${next}%` });
  };

  const renderOverrideBadge = (propKey: keyof ElementStyles) => {
    return <BreakpointIndicator node={node} propKey={propKey} />;
  };

  return (
    <div className="space-y-4">
      {/* Content Textarea (if applicable) */}
      {('content' in node || node.type === 'paragraph' || node.type === 'heading' || node.type === 'button' || node.type === 'badge') && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            {node.type.toUpperCase()} TEXT
          </label>
          <textarea
            rows={4}
            value={node.content || ''}
            onChange={(e) => updateNodeContent(node.id, e.target.value)}
            className="w-full bg-[#10131E] border border-[#23293D] rounded-lg p-2.5 text-xs text-gray-200 focus:outline-none focus:border-purple-500 transition-colors resize-y leading-relaxed"
          />
        </div>
      )}

      {/* Style Formatting (B, I, U) */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Style</span>
        <div className="flex items-center bg-[#10131E] p-1 rounded-lg border border-[#23293D] gap-0.5">
          <button
            onClick={() => updateNodeStyles(node.id, { isBold: !styles.isBold })}
            className={`p-1.5 rounded transition-colors ${
              styles.isBold ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => updateNodeStyles(node.id, { isItalic: !styles.isItalic })}
            className={`p-1.5 rounded transition-colors ${
              styles.isItalic ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => updateNodeStyles(node.id, { isUnderline: !styles.isUnderline })}
            className={`p-1.5 rounded transition-colors ${
              styles.isUnderline ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Font Family */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Font Family</span>
        <select
          value={styles.fontFamily || 'Inter'}
          onChange={(e) => updateNodeStyles(node.id, { fontFamily: e.target.value })}
          className="bg-[#10131E] border border-[#23293D] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-purple-500 w-36"
        >
          <option value="Inter">Inter</option>
          <option value="system-ui">System UI</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>

      {/* Font Weight */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Font Weight</span>
        <select
          value={styles.fontWeight || '400'}
          onChange={(e) => updateNodeStyles(node.id, { fontWeight: e.target.value })}
          className="bg-[#10131E] border border-[#23293D] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-purple-500 w-36"
        >
          <option value="300">Light (300)</option>
          <option value="400">Regular (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">SemiBold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">ExtraBold (800)</option>
        </select>
      </div>

      {/* Font Size with Stepper & Breakpoint Override */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-medium">Font Size</span>
          {renderOverrideBadge('fontSize')}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-[#10131E] border border-[#23293D] rounded-lg px-2 py-1 text-xs w-20 justify-between">
            <input
              type="text"
              value={parseInt(styles.fontSize || '16', 10)}
              onChange={(e) => updateNodeStyles(node.id, { fontSize: `${e.target.value}px` })}
              className="bg-transparent text-gray-200 w-8 focus:outline-none text-right font-mono"
            />
            <span className="text-gray-500 text-[11px] ml-1">px</span>
          </div>

          <button
            onClick={() => handleFontSizeChange(-1)}
            className="p-1.5 rounded-lg bg-[#10131E] hover:bg-[#1E2436] border border-[#23293D] text-gray-300"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleFontSizeChange(1)}
            className="p-1.5 rounded-lg bg-[#10131E] hover:bg-[#1E2436] border border-[#23293D] text-gray-300"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Text Color with Swatch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-medium">Color</span>
          {renderOverrideBadge('textColor')}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={styles.textColor || '#FFFFFF'}
            onChange={(e) => updateNodeStyles(node.id, { textColor: e.target.value })}
            className="bg-[#10131E] border border-[#23293D] rounded-lg px-2 py-1 text-xs text-gray-200 w-24 font-mono uppercase focus:outline-none focus:border-purple-500"
          />
          <input
            type="color"
            value={styles.textColor?.startsWith('#') ? styles.textColor : '#FFFFFF'}
            onChange={(e) => updateNodeStyles(node.id, { textColor: e.target.value })}
            className="w-7 h-7 rounded-md cursor-pointer border border-[#23293D] bg-transparent p-0"
          />
        </div>
      </div>

      {/* Text Align & Breakpoint Override */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-medium">Text Align</span>
          {renderOverrideBadge('textAlign')}
        </div>
        <div className="flex items-center bg-[#10131E] p-1 rounded-lg border border-[#23293D] gap-0.5">
          {(['left', 'center', 'right', 'justify'] as const).map((align) => (
            <button
              key={align}
              onClick={() => updateNodeStyles(node.id, { textAlign: align })}
              className={`p-1.5 rounded transition-colors ${
                (styles.textAlign || 'left') === align
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              title={`Align ${align}`}
            >
              {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
              {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
              {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
              {align === 'justify' && <AlignJustify className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Width: Full width toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1C2130]">
        <span className="text-xs text-gray-400 font-medium">Full Width</span>
        <button
          onClick={() => updateNodeStyles(node.id, { isFullWidth: !styles.isFullWidth })}
          className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
            styles.isFullWidth ? 'bg-purple-600' : 'bg-[#20273A]'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              styles.isFullWidth ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Custom Width */}
      {!styles.isFullWidth && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">Custom Width</span>
          <div className="flex items-center gap-1">
            <div className="flex items-center bg-[#10131E] border border-[#23293D] rounded-lg px-2 py-1 text-xs w-20 justify-between">
              <input
                type="text"
                value={parseInt(styles.customWidth || '100', 10)}
                onChange={(e) => updateNodeStyles(node.id, { customWidth: `${e.target.value}%` })}
                className="bg-transparent text-gray-200 w-8 focus:outline-none text-right font-mono"
              />
              <span className="text-gray-500 text-[11px] ml-1">%</span>
            </div>
            <button
              onClick={() => handleCustomWidthChange(-5)}
              className="p-1.5 rounded-lg bg-[#10131E] hover:bg-[#1E2436] border border-[#23293D] text-gray-300"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleCustomWidthChange(5)}
              className="p-1.5 rounded-lg bg-[#10131E] hover:bg-[#1E2436] border border-[#23293D] text-gray-300"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
