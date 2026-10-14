import React from 'react';
import { Monitor, Tablet, Smartphone, Eye, EyeOff } from 'lucide-react';
import { DocumentNode } from '../../../types/editor';
import { useEditor } from '../../../context/EditorContext';

interface ResponsiveVisibilitySectionProps {
  node: DocumentNode;
}

export const ResponsiveVisibilitySection: React.FC<ResponsiveVisibilitySectionProps> = ({ node }) => {
  const { updateNodeResponsiveVisibility, viewportMode } = useEditor();
  const visibility = node.responsiveVisibility || {};

  const isDesktopVisible = !visibility.hideOnDesktop;
  const isTabletVisible = !visibility.hideOnTablet;
  const isMobileVisible = !visibility.hideOnMobile;

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Device Visibility</span>
        <span className="text-[10px] text-gray-500 font-mono">Per-device</span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {/* Desktop Toggle */}
        <button
          onClick={() =>
            updateNodeResponsiveVisibility(node.id, {
              hideOnDesktop: isDesktopVisible ? true : false,
            })
          }
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
            isDesktopVisible
              ? 'bg-[#141926] border-[#252E44] text-gray-200 hover:border-purple-500/50'
              : 'bg-red-950/20 border-red-900/40 text-red-400'
          } ${viewportMode === 'desktop' ? 'ring-1 ring-purple-500' : ''}`}
        >
          <div className="flex items-center gap-1 mb-1">
            <Monitor className="w-3.5 h-3.5" />
            {isDesktopVisible ? <Eye className="w-2.5 h-2.5 text-emerald-400" /> : <EyeOff className="w-2.5 h-2.5 text-red-400" />}
          </div>
          <span className="text-[10px] font-medium">Desktop</span>
          <span className="text-[9px] text-gray-500">{isDesktopVisible ? 'Visible' : 'Hidden'}</span>
        </button>

        {/* Tablet Toggle */}
        <button
          onClick={() =>
            updateNodeResponsiveVisibility(node.id, {
              hideOnTablet: isTabletVisible ? true : false,
            })
          }
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
            isTabletVisible
              ? 'bg-[#141926] border-[#252E44] text-gray-200 hover:border-purple-500/50'
              : 'bg-red-950/20 border-red-900/40 text-red-400'
          } ${viewportMode === 'tablet' ? 'ring-1 ring-purple-500' : ''}`}
        >
          <div className="flex items-center gap-1 mb-1">
            <Tablet className="w-3.5 h-3.5" />
            {isTabletVisible ? <Eye className="w-2.5 h-2.5 text-emerald-400" /> : <EyeOff className="w-2.5 h-2.5 text-red-400" />}
          </div>
          <span className="text-[10px] font-medium">Tablet</span>
          <span className="text-[9px] text-gray-500">{isTabletVisible ? 'Visible' : 'Hidden'}</span>
        </button>

        {/* Mobile Toggle */}
        <button
          onClick={() =>
            updateNodeResponsiveVisibility(node.id, {
              hideOnMobile: isMobileVisible ? true : false,
            })
          }
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
            isMobileVisible
              ? 'bg-[#141926] border-[#252E44] text-gray-200 hover:border-purple-500/50'
              : 'bg-red-950/20 border-red-900/40 text-red-400'
          } ${viewportMode === 'mobile' ? 'ring-1 ring-purple-500' : ''}`}
        >
          <div className="flex items-center gap-1 mb-1">
            <Smartphone className="w-3.5 h-3.5" />
            {isMobileVisible ? <Eye className="w-2.5 h-2.5 text-emerald-400" /> : <EyeOff className="w-2.5 h-2.5 text-red-400" />}
          </div>
          <span className="text-[10px] font-medium">Mobile</span>
          <span className="text-[9px] text-gray-500">{isMobileVisible ? 'Visible' : 'Hidden'}</span>
        </button>
      </div>
    </div>
  );
};
