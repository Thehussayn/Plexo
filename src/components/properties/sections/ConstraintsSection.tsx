import React from 'react';
import { RotateCcw, Anchor } from 'lucide-react';
import { DocumentNode, HorizontalConstraint, VerticalConstraint } from '../../../types/editor';
import { useEditor } from '../../../context/EditorContext';

interface ConstraintsSectionProps {
  node: DocumentNode;
}

export const ConstraintsSection: React.FC<ConstraintsSectionProps> = ({ node }) => {
  const {
    resolveStyles,
    updateNodeStyles,
    isOverridden,
    resetResponsiveStyle,
    viewportMode,
  } = useEditor();

  const styles = resolveStyles(node);
  const hConstraint: HorizontalConstraint = styles.horizontalConstraint || 'left';
  const vConstraint: VerticalConstraint = styles.verticalConstraint || 'top';

  const isHOverridden = isOverridden(node, 'horizontalConstraint');
  const isVOverridden = isOverridden(node, 'verticalConstraint');

  const handleHChange = (val: HorizontalConstraint) => {
    updateNodeStyles(node.id, { horizontalConstraint: val });
  };

  const handleVChange = (val: VerticalConstraint) => {
    updateNodeStyles(node.id, { verticalConstraint: val });
  };

  const togglePin = (pin: 'left' | 'right' | 'top' | 'bottom' | 'center') => {
    if (pin === 'left') {
      if (hConstraint === 'left') handleHChange('right');
      else if (hConstraint === 'right') handleHChange('stretch');
      else handleHChange('left');
    } else if (pin === 'right') {
      if (hConstraint === 'right') handleHChange('left');
      else if (hConstraint === 'left') handleHChange('stretch');
      else handleHChange('right');
    } else if (pin === 'top') {
      if (vConstraint === 'top') handleVChange('bottom');
      else if (vConstraint === 'bottom') handleVChange('stretch');
      else handleVChange('top');
    } else if (pin === 'bottom') {
      if (vConstraint === 'bottom') handleVChange('top');
      else if (vConstraint === 'top') handleVChange('stretch');
      else handleVChange('bottom');
    } else if (pin === 'center') {
      handleHChange(hConstraint === 'center' ? 'left' : 'center');
      handleVChange(vConstraint === 'center' ? 'top' : 'center');
    }
  };

  const isLeftActive = hConstraint === 'left' || hConstraint === 'stretch';
  const isRightActive = hConstraint === 'right' || hConstraint === 'stretch';
  const isTopActive = vConstraint === 'top' || vConstraint === 'stretch';
  const isBottomActive = vConstraint === 'bottom' || vConstraint === 'stretch';
  const isCenterActive = hConstraint === 'center' || vConstraint === 'center';

  return (
    <div className="border-b border-[#242424] p-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Anchor className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-semibold text-[#EDEDED] uppercase tracking-wider">
            Constraints
          </span>
        </div>
        {(isHOverridden || isVOverridden) && (
          <button
            onClick={() => {
              if (isHOverridden) resetResponsiveStyle(node.id, 'horizontalConstraint');
              if (isVOverridden) resetResponsiveStyle(node.id, 'verticalConstraint');
            }}
            title={`Reset constraints to inherited (${viewportMode})`}
            className="flex items-center gap-1 text-[10px] text-purple-300 hover:text-purple-200"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Interactive Visual Anchoring Box */}
        <div
          title="Click pins to adjust constraints"
          className="relative w-16 h-16 rounded bg-[#121212] border border-[#2D2D2D] flex items-center justify-center shrink-0 shadow-inner group cursor-pointer"
        >
          {/* Inner Element Representation */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              togglePin('center');
            }}
            className={`w-6 h-6 rounded-sm border flex items-center justify-center transition-all ${
              isCenterActive
                ? 'bg-purple-950/80 border-[#8B5CF6] text-purple-300 shadow-sm'
                : 'bg-[#222222] border-[#383838] text-[#737373] hover:border-[#555]'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isCenterActive ? 'bg-[#8B5CF6]' : 'bg-[#555]'
              }`}
            />
          </div>

          {/* Top Pin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin('top');
            }}
            title="Pin Top"
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-2.5 flex items-center justify-center cursor-pointer`}
          >
            <div
              className={`w-0.5 h-full rounded transition-colors ${
                isTopActive ? 'bg-[#8B5CF6] shadow-sm' : 'bg-[#3A3A3A] hover:bg-[#666]'
              }`}
            />
          </button>

          {/* Bottom Pin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin('bottom');
            }}
            title="Pin Bottom"
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 h-2.5 flex items-center justify-center cursor-pointer`}
          >
            <div
              className={`w-0.5 h-full rounded transition-colors ${
                isBottomActive ? 'bg-[#8B5CF6] shadow-sm' : 'bg-[#3A3A3A] hover:bg-[#666]'
              }`}
            />
          </button>

          {/* Left Pin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin('left');
            }}
            title="Pin Left"
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-3.5 flex items-center justify-center cursor-pointer`}
          >
            <div
              className={`h-0.5 w-full rounded transition-colors ${
                isLeftActive ? 'bg-[#8B5CF6] shadow-sm' : 'bg-[#3A3A3A] hover:bg-[#666]'
              }`}
            />
          </button>

          {/* Right Pin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin('right');
            }}
            title="Pin Right"
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-3.5 flex items-center justify-center cursor-pointer`}
          >
            <div
              className={`h-0.5 w-full rounded transition-colors ${
                isRightActive ? 'bg-[#8B5CF6] shadow-sm' : 'bg-[#3A3A3A] hover:bg-[#666]'
              }`}
            />
          </button>
        </div>

        {/* Dropdowns */}
        <div className="flex-1 space-y-2">
          {/* Horizontal */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mb-1">
              <span className="flex items-center gap-1">
                Horizontal
                {isHOverridden && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"
                    title={`Overridden on ${viewportMode}`}
                  />
                )}
              </span>
              {isHOverridden && (
                <button
                  onClick={() => resetResponsiveStyle(node.id, 'horizontalConstraint')}
                  title="Reset to inherited"
                  className="text-purple-400 hover:text-purple-300"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
            <select
              value={hConstraint}
              onChange={(e) => handleHChange(e.target.value as HorizontalConstraint)}
              className="w-full bg-[#1C1C1C] text-[#EDEDED] text-xs px-2 py-1 rounded border border-[#2D2D2D] hover:border-[#3D3D3D] focus:border-[#7C3AED] focus:outline-none cursor-pointer"
            >
              <option value="left" className="bg-[#1C1C1C]">Left</option>
              <option value="right" className="bg-[#1C1C1C]">Right</option>
              <option value="center" className="bg-[#1C1C1C]">Center</option>
              <option value="stretch" className="bg-[#1C1C1C]">Left & Right (Stretch)</option>
              <option value="scale" className="bg-[#1C1C1C]">Scale</option>
            </select>
          </div>

          {/* Vertical */}
          <div>
            <div className="flex items-center justify-between text-[10px] text-[#8E8E93] mb-1">
              <span className="flex items-center gap-1">
                Vertical
                {isVOverridden && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"
                    title={`Overridden on ${viewportMode}`}
                  />
                )}
              </span>
              {isVOverridden && (
                <button
                  onClick={() => resetResponsiveStyle(node.id, 'verticalConstraint')}
                  title="Reset to inherited"
                  className="text-purple-400 hover:text-purple-300"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
            <select
              value={vConstraint}
              onChange={(e) => handleVChange(e.target.value as VerticalConstraint)}
              className="w-full bg-[#1C1C1C] text-[#EDEDED] text-xs px-2 py-1 rounded border border-[#2D2D2D] hover:border-[#3D3D3D] focus:border-[#7C3AED] focus:outline-none cursor-pointer"
            >
              <option value="top" className="bg-[#1C1C1C]">Top</option>
              <option value="bottom" className="bg-[#1C1C1C]">Bottom</option>
              <option value="center" className="bg-[#1C1C1C]">Center</option>
              <option value="stretch" className="bg-[#1C1C1C]">Top & Bottom (Stretch)</option>
              <option value="scale" className="bg-[#1C1C1C]">Scale</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
