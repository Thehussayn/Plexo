import React from 'react';
import { AlignmentGuide } from '../../types/editor';

interface AlignmentGuidesOverlayProps {
  guides: AlignmentGuide[];
}

export const AlignmentGuidesOverlay: React.FC<AlignmentGuidesOverlayProps> = ({ guides }) => {
  if (!guides || guides.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-visible">
      {guides.map((guide, idx) => {
        if (guide.type === 'x') {
          // Vertical alignment line
          return (
            <div
              key={`guide-x-${idx}-${guide.position}`}
              style={{
                left: `${guide.position}px`,
                top: 0,
                bottom: 0,
              }}
              className="absolute w-[1px] bg-[#96F02E]"
            >
              {/* Coordinate tag badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#96F02E] text-black font-semibold font-mono text-[9px] px-1 py-0.2 rounded shadow">
                {Math.round(guide.position)}px
              </div>
            </div>
          );
        } else {
          // Horizontal alignment line
          return (
            <div
              key={`guide-y-${idx}-${guide.position}`}
              style={{
                top: `${guide.position}px`,
                left: 0,
                right: 0,
              }}
              className="absolute h-[1px] bg-[#96F02E]"
            >
              {/* Coordinate tag badge */}
              <div className="absolute -left-7 top-1/2 -translate-y-1/2 bg-[#96F02E] text-black font-semibold font-mono text-[9px] px-1 py-0.2 rounded shadow">
                {Math.round(guide.position)}px
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};
