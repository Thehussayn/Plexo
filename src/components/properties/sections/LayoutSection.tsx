import React from 'react';
import {
  Columns,
  Rows,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalDistributeCenter,
  RotateCcw,
  Sparkles,
  Smartphone,
  WrapText,
  Maximize2,
  Minimize2,
  Box,
} from 'lucide-react';
import { DocumentNode, SizingMode, ElementStyles } from '../../../types/editor';
import { useEditor } from '../../../context/EditorContext';
import { BreakpointIndicator } from '../common/BreakpointIndicator';

interface LayoutSectionProps {
  node: DocumentNode;
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({ node }) => {
  const {
    resolveStyles,
    isOverridden,
    resetResponsiveStyle,
    updateNodeStyles,
    viewportMode,
  } = useEditor();

  const styles = resolveStyles(node);

  const isContainer =
    node.type === 'container' ||
    node.type === 'section' ||
    node.type === 'card' ||
    node.type === 'columns' ||
    node.type === 'column';

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

  const handleWidthSizingChange = (mode: SizingMode) => {
    if (mode === 'fill') {
      updateNodeStyles(node.id, {
        widthSizing: 'fill',
        width: '100%',
        customWidth: '100%',
        isFullWidth: true,
      });
    } else if (mode === 'hug') {
      updateNodeStyles(node.id, {
        widthSizing: 'hug',
        width: 'auto',
        customWidth: undefined,
        isFullWidth: false,
      });
    } else {
      updateNodeStyles(node.id, {
        widthSizing: 'fixed',
        customWidth: '80%',
        isFullWidth: false,
      });
    }
  };

  const handleHeightSizingChange = (mode: SizingMode) => {
    if (mode === 'fixed') {
      updateNodeStyles(node.id, {
        heightSizing: 'fixed',
        minHeight: '240px',
      });
    } else {
      updateNodeStyles(node.id, {
        heightSizing: 'hug',
        minHeight: 'auto',
      });
    }
  };

  // Helper to render override indicator with reset button
  const renderOverrideBadge = (propKey: keyof ElementStyles) => {
    return <BreakpointIndicator node={node} propKey={propKey} />;
  };

  return (
    <div className="space-y-4 select-none">
      {/* 1. Sizing Model: Width & Height (Hug, Fill, Fixed) */}
      <div className="space-y-2 p-2.5 bg-[#121624] border border-[#21283B] rounded-xl">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-300">Sizing</span>
          <span className="text-[10px] text-purple-400 font-medium">Visual Layout</span>
        </div>

        {/* Width Sizing Mode */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[11px]">Width Sizing</span>
            {renderOverrideBadge('widthSizing')}
          </div>
          <div className="grid grid-cols-3 p-0.5 bg-[#0B0E17] rounded-lg border border-[#1E2436] text-xs">
            {(['hug', 'fill', 'fixed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleWidthSizingChange(mode)}
                className={`py-1 rounded text-center text-xs capitalize transition-all ${
                  widthSizing === mode
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Width value input if Fixed */}
        {widthSizing === 'fixed' && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-400 text-[11px]">Fixed Width</span>
            <input
              type="text"
              value={styles.customWidth || styles.width || '80%'}
              onChange={(e) => updateNodeStyles(node.id, { customWidth: e.target.value })}
              className="bg-[#0B0E17] border border-[#23293D] rounded px-2 py-0.5 text-xs text-gray-200 w-24 font-mono text-right focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Height Sizing Mode */}
        <div className="space-y-1 pt-1 border-t border-[#1C2234]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[11px]">Height Sizing</span>
            {renderOverrideBadge('heightSizing')}
          </div>
          <div className="grid grid-cols-2 p-0.5 bg-[#0B0E17] rounded-lg border border-[#1E2436] text-xs">
            {(['hug', 'fixed'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleHeightSizingChange(mode)}
                className={`py-1 rounded text-center text-xs capitalize transition-all ${
                  heightSizing === mode
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {mode === 'hug' ? 'Hug Content' : 'Fixed Height'}
              </button>
            ))}
          </div>
        </div>

        {heightSizing === 'fixed' && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-400 text-[11px]">Min Height</span>
            <input
              type="text"
              value={styles.minHeight || '240px'}
              onChange={(e) => updateNodeStyles(node.id, { minHeight: e.target.value })}
              className="bg-[#0B0E17] border border-[#23293D] rounded px-2 py-0.5 text-xs text-gray-200 w-24 font-mono text-right focus:outline-none focus:border-purple-500"
            />
          </div>
        )}
      </div>

      {/* 2. Container Direction & Flow (Horizontal vs Vertical) */}
      {isContainer && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Flow Direction</span>
            {renderOverrideBadge('flexDirection')}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => updateNodeStyles(node.id, { display: 'flex', flexDirection: 'row' })}
              className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all ${
                styles.display === 'flex' && (styles.flexDirection === 'row' || !styles.flexDirection)
                  ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm'
                  : 'bg-[#10131E] border-[#23293D] text-gray-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-purple-400" />
              <span>Horizontal</span>
            </button>

            <button
              onClick={() => updateNodeStyles(node.id, { display: 'flex', flexDirection: 'column' })}
              className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all ${
                styles.flexDirection === 'column'
                  ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm'
                  : 'bg-[#10131E] border-[#23293D] text-gray-400 hover:text-white'
              }`}
            >
              <Rows className="w-3.5 h-3.5 text-blue-400" />
              <span>Vertical</span>
            </button>
          </div>

          {/* Stack on Mobile Toggle */}
          <div className="flex items-center justify-between p-2 bg-[#121624] border border-[#20273B] rounded-lg mt-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              <div>
                <div className="text-xs font-medium text-gray-200">Stack on Mobile</div>
                <div className="text-[10px] text-gray-500">Flows vertically on small screens</div>
              </div>
            </div>
            <button
              onClick={() => updateNodeStyles(node.id, { stackOnMobile: !styles.stackOnMobile })}
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                styles.stackOnMobile ? 'bg-purple-600' : 'bg-[#212739]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  styles.stackOnMobile ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* 3. Alignment Matrix */}
      {styles.display === 'flex' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Alignment</span>
            {renderOverrideBadge('justifyContent')}
          </div>
          <div className="flex items-center bg-[#10131E] p-1 rounded-lg border border-[#23293D] justify-between">
            <button
              onClick={() => updateNodeStyles(node.id, { justifyContent: 'flex-start' })}
              className={`p-1.5 rounded transition-colors ${
                (styles.justifyContent || 'flex-start') === 'flex-start'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Align Start"
            >
              <AlignHorizontalJustifyStart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateNodeStyles(node.id, { justifyContent: 'center' })}
              className={`p-1.5 rounded transition-colors ${
                styles.justifyContent === 'center'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Align Center"
            >
              <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateNodeStyles(node.id, { justifyContent: 'flex-end' })}
              className={`p-1.5 rounded transition-colors ${
                styles.justifyContent === 'flex-end'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Align End"
            >
              <AlignHorizontalJustifyEnd className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => updateNodeStyles(node.id, { justifyContent: 'space-between' })}
              className={`p-1.5 rounded transition-colors ${
                styles.justifyContent === 'space-between'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Space Between"
            >
              <AlignHorizontalDistributeCenter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. Gap & Wrap */}
      {styles.display === 'flex' && (
        <div className="grid grid-cols-2 gap-2">
          {/* Gap */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Gap</span>
              {renderOverrideBadge('gap')}
            </div>
            <input
              type="text"
              value={styles.gap || '16px'}
              onChange={(e) => updateNodeStyles(node.id, { gap: e.target.value })}
              className="w-full bg-[#10131E] border border-[#23293D] rounded-lg px-2.5 py-1 text-xs text-gray-200 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Wrap */}
          <div className="space-y-1">
            <span className="text-xs text-gray-400 block">Wrap items</span>
            <button
              onClick={() =>
                updateNodeStyles(node.id, {
                  flexWrap: styles.flexWrap === 'wrap' ? 'nowrap' : 'wrap',
                })
              }
              className={`w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg border text-xs transition-colors ${
                styles.flexWrap === 'wrap'
                  ? 'bg-purple-600 text-white font-medium border-purple-500'
                  : 'bg-[#10131E] text-gray-400 border-[#23293D] hover:text-white'
              }`}
            >
              <WrapText className="w-3.5 h-3.5" />
              <span>{styles.flexWrap === 'wrap' ? 'Wrap' : 'No Wrap'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Padding & Margin */}
      <div className="space-y-2 pt-2 border-t border-[#1C2130]">
        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
          <span>Padding (Top/Bottom, Left/Right)</span>
          {renderOverrideBadge('paddingTop')}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between bg-[#10131E] border border-[#23293D] rounded-lg px-2 py-1">
            <span className="text-gray-500 text-[10px]">T/B</span>
            <input
              type="text"
              value={styles.paddingTop || styles.padding || '0px'}
              onChange={(e) =>
                updateNodeStyles(node.id, {
                  paddingTop: e.target.value,
                  paddingBottom: e.target.value,
                })
              }
              className="bg-transparent text-gray-200 text-right w-14 focus:outline-none font-mono"
            />
          </div>
          <div className="flex items-center justify-between bg-[#10131E] border border-[#23293D] rounded-lg px-2 py-1">
            <span className="text-gray-500 text-[10px]">L/R</span>
            <input
              type="text"
              value={styles.paddingLeft || styles.padding || '0px'}
              onChange={(e) =>
                updateNodeStyles(node.id, {
                  paddingLeft: e.target.value,
                  paddingRight: e.target.value,
                })
              }
              className="bg-transparent text-gray-200 text-right w-14 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
