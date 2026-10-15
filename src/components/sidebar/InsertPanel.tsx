import React, { useState } from 'react';
import {
  Columns,
  Heading,
  AlignLeft,
  Square,
  Image as ImageIcon,
  Star,
  Minus,
  MoveVertical,
  SlidersHorizontal,
  Video,
  Share2,
  Menu as MenuIcon,
  Code2,
  Table as TableIcon,
  Clock,
  CheckSquare,
  ChevronDownSquare,
  Plus,
  Search,
  LayoutTemplate,
  Box,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { insertableComponents } from '../../data/insertableComponents';

const iconMap: Record<string, React.ReactNode> = {
  LayoutTemplate: <LayoutTemplate className="w-4 h-4 text-purple-400" />,
  Box: <Box className="w-4 h-4 text-purple-400" />,
  Columns: <Columns className="w-4 h-4 text-gray-300" />,
  Heading: <Heading className="w-4 h-4 text-gray-300" />,
  AlignLeft: <AlignLeft className="w-4 h-4 text-gray-300" />,
  Square: <Square className="w-4 h-4 text-gray-300" />,
  Image: <ImageIcon className="w-4 h-4 text-gray-300" />,
  Star: <Star className="w-4 h-4 text-gray-300" />,
  Minus: <Minus className="w-4 h-4 text-gray-300" />,
  MoveVertical: <MoveVertical className="w-4 h-4 text-gray-300" />,
  Tag: <Plus className="w-4 h-4 text-gray-300" />,
  LayoutGrid: <Columns className="w-4 h-4 text-gray-300" />,
};

export const InsertPanel: React.FC = () => {
  const { insertComponent, addSection, selectedNode } = useEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'layout' | 'typography' | 'media' | 'interactive'>('all');

  const filteredItems = insertableComponents.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderIcon = (iconName: string) => {
    if (iconMap[iconName]) return iconMap[iconName];
    if (iconName === 'SlidersHorizontal') return <SlidersHorizontal className="w-4 h-4 text-gray-300" />;
    if (iconName === 'Video') return <Video className="w-4 h-4 text-gray-300" />;
    if (iconName === 'Share2') return <Share2 className="w-4 h-4 text-gray-300" />;
    if (iconName === 'Menu') return <MenuIcon className="w-4 h-4 text-gray-300" />;
    if (iconName === 'Code2') return <Code2 className="w-4 h-4 text-gray-300" />;
    if (iconName === 'Table') return <TableIcon className="w-4 h-4 text-gray-300" />;
    if (iconName === 'Clock') return <Clock className="w-4 h-4 text-gray-300" />;
    if (iconName === 'CheckSquare') return <CheckSquare className="w-4 h-4 text-gray-300" />;
    if (iconName === 'ChevronDownSquare') return <ChevronDownSquare className="w-4 h-4 text-gray-300" />;
    return <Plus className="w-4 h-4 text-gray-300" />;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none bg-[#161616]">
      {/* Search & Categories */}
      <div className="p-3 border-b border-[#242424] space-y-2.5 bg-[#141414]">
        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#96F02E]/60 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
          {(['all', 'layout', 'typography', 'media', 'interactive'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-md capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#96F02E] text-black font-semibold'
                  : 'bg-[#202020] text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Target insertion indicator */}
      <div className="px-3 py-1.5 bg-[#141414] border-b border-[#242424] text-[11px] text-gray-400 flex items-center justify-between">
        <span>Target:</span>
        <span className="font-semibold text-[#96F02E] truncate max-w-[140px]">
          {selectedNode ? selectedNode.name : 'Page Root'}
        </span>
      </div>

      {/* Grid of Components */}
      <div className="flex-1 overflow-y-auto p-2.5">
        <div className="grid grid-cols-2 gap-2">
          {filteredItems.map((comp) => (
            <button
              key={comp.id}
              onClick={() => insertComponent(null, comp.id)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1B1B1B] hover:bg-[#222222] border border-[#262626] hover:border-[#96F02E]/40 group transition-all cursor-pointer shadow-sm active:scale-95 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#242424] group-hover:bg-[#96F02E]/15 flex items-center justify-center mb-1.5 text-gray-300 group-hover:text-[#96F02E] transition-colors">
                {renderIcon(comp.icon)}
              </div>
              <span className="text-[11px] font-medium text-gray-200 group-hover:text-white text-center leading-tight">
                {comp.name}
              </span>
              <span className="text-[9px] text-gray-500 capitalize mt-0.5">
                {comp.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
