import React from 'react';
import { Plus } from 'lucide-react';

interface DropIndicatorProps {
  position: 'before' | 'after' | 'inside';
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({ position }) => {
  if (position === 'inside') {
    return (
      <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-[#96F02E] bg-[#96F02E]/10 rounded-lg z-50 flex items-center justify-center animate-pulse">
        <div className="bg-[#96F02E] text-black text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-[#85DC20]">
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>DROP INSIDE CONTAINER</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`absolute left-0 right-0 z-50 pointer-events-none flex items-center ${
        position === 'before' ? '-top-2' : '-bottom-2'
      }`}
    >
      <div className="w-2.5 h-2.5 rounded-full bg-[#96F02E] border-2 border-black shrink-0" />
      <div className="flex-1 h-0.5 bg-[#96F02E]" />
      <div className="bg-[#96F02E] text-black text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md border border-[#85DC20] shrink-0 mx-2 flex items-center gap-1">
        <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
        <span>ADD HERE</span>
      </div>
      <div className="flex-1 h-0.5 bg-[#96F02E]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#96F02E] border-2 border-black shrink-0" />
    </div>
  );
};
