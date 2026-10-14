import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { DocumentNode, ElementStyles } from '../../../types/editor';
import { useEditor } from '../../../context/EditorContext';

interface BreakpointIndicatorProps {
  node: DocumentNode;
  propKey: keyof ElementStyles;
  label?: string;
}

export const BreakpointIndicator: React.FC<BreakpointIndicatorProps> = ({
  node,
  propKey,
  label,
}) => {
  const { viewportMode, isOverridden, resetResponsiveStyle, getInheritedStyle, resolveStyles } = useEditor();
  const [showTooltip, setShowTooltip] = useState(false);

  if (viewportMode === 'desktop') {
    return null;
  }

  const hasOverride = isOverridden(node, propKey);
  const inheritedValue = getInheritedStyle(node, propKey);
  const currentStyles = resolveStyles(node);
  const currentValue = currentStyles[propKey];

  const formattedInherited =
    inheritedValue === undefined || inheritedValue === '' ? 'default' : String(inheritedValue);

  if (hasOverride) {
    return (
      <div className="relative inline-flex items-center gap-1 select-none">
        {/* Subtle Purple Dot with Tooltip on Hover */}
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="flex items-center gap-1 cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shadow-sm" />
          <span className="text-[10px] text-purple-300 font-medium hidden sm:inline">
            Override
          </span>
        </div>

        {/* Reset to Inherited Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetResponsiveStyle(node.id, propKey);
          }}
          title={`Reset to inherited (${formattedInherited})`}
          className="p-0.5 text-gray-400 hover:text-white hover:bg-purple-900/50 rounded transition-colors group"
        >
          <RotateCcw className="w-2.5 h-2.5 group-hover:rotate-[-45deg] transition-transform text-purple-300" />
        </button>

        {/* Informative Floating Tooltip on Hover */}
        {showTooltip && (
          <div className="absolute right-0 bottom-full mb-1 z-50 bg-[#121624] border border-purple-500/50 rounded-md px-2 py-1 shadow-xl text-[10px] whitespace-nowrap pointer-events-none">
            <span className="text-purple-300 font-semibold">{viewportMode} override: </span>
            <span className="text-white">{String(currentValue)}</span>
            <div className="text-gray-400 text-[9px]">
              Inherited was: <span className="text-gray-200">{formattedInherited}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Inherited state: clean, minimal, non-cluttering
  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative inline-flex items-center text-[10px] text-gray-500 hover:text-gray-400 cursor-help select-none"
    >
      <span className="text-[9px] font-mono opacity-80">
        Inherited
      </span>

      {showTooltip && (
        <div className="absolute right-0 bottom-full mb-1 z-50 bg-[#121624] border border-[#263148] rounded-md px-2 py-1 shadow-xl text-[10px] whitespace-nowrap pointer-events-none">
          <span className="text-gray-300">Inherited from Desktop: </span>
          <span className="text-purple-300 font-mono font-medium">{formattedInherited}</span>
        </div>
      )}
    </div>
  );
};
