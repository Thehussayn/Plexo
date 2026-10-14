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

// Additional Plexo components
const allCatalogItems = [
  ...insertableComponents,
  {
    id: 'comp-carousel',
    name: 'Carousel',
    type: 'container' as const,
    icon: 'SlidersHorizontal',
    category: 'media' as const,
    defaultStyles: { padding: '20px', minHeight: '180px', backgroundColor: '#1A1A1A', borderRadius: '12px' },
  },
  {
    id: 'comp-video',
    name: 'Video',
    type: 'container' as const,
    icon: 'Video',
    category: 'media' as const,
    defaultStyles: { padding: '24px', minHeight: '220px', backgroundColor: '#141414', borderRadius: '12px' },
  },
  {
    id: 'comp-social',
    name: 'Social',
    type: 'container' as const,
    icon: 'Share2',
    category: 'interactive' as const,
    defaultStyles: { display: 'flex' as const, gap: '12px', padding: '12px 0' },
  },
  {
    id: 'comp-menu',
    name: 'Menu',
    type: 'container' as const,
    icon: 'Menu',
    category: 'layout' as const,
    defaultStyles: { display: 'flex' as const, gap: '16px' },
  },
  {
    id: 'comp-html',
    name: 'HTML',
    type: 'container' as const,
    icon: 'Code2',
    category: 'interactive' as const,
    defaultStyles: { padding: '16px', fontFamily: 'monospace', fontSize: '13px' },
  },
  {
    id: 'comp-table',
    name: 'Table',
    type: 'container' as const,
    icon: 'Table',
    category: 'layout' as const,
    defaultStyles: { width: '100%', minHeight: '120px' },
  },
  {
    id: 'comp-timer',
    name: 'Timer',
    type: 'badge' as const,
    icon: 'Clock',
    category: 'interactive' as const,
    defaultContent: '02 : 14 : 35',
    defaultStyles: { fontSize: '20px', fontWeight: '700', textColor: '#F59E0B' },
  },
  {
    id: 'comp-form',
    name: 'Form',
    type: 'container' as const,
    icon: 'CheckSquare',
    category: 'interactive' as const,
    defaultStyles: { padding: '24px', backgroundColor: '#141414', borderRadius: '12px', width: '100%' },
  },
  {
    id: 'comp-accordion',
    name: 'Accordion',
    type: 'container' as const,
    icon: 'ChevronDownSquare',
    category: 'layout' as const,
    defaultStyles: { padding: '16px', backgroundColor: '#181818', borderRadius: '8px', width: '100%' },
  },
];

export const InsertPanel: React.FC = () => {
  const { insertComponent, addSection, selectedNode } = useEditor();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'layout' | 'typography' | 'media' | 'interactive'>('all');

  const filteredItems = allCatalogItems.filter((item) => {
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
      {/* Header, Add Section & Search */}
      <div className="p-3 border-b border-[#242424] space-y-2.5 bg-[#141414]">
        {/* Primary Add Section Action */}
        <button
          onClick={() => addSection()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-lg shadow-purple-950/40 transition-all cursor-pointer active:scale-[0.98] group"
        >
          <Plus className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform" />
          <span>Add Section</span>
        </button>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#7C3AED]/60 transition-colors"
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
                  ? 'bg-[#7C3AED] text-white font-medium'
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
        <span className="font-semibold text-purple-300 truncate max-w-[140px]">
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
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1B1B1B] hover:bg-[#222222] border border-[#262626] hover:border-[#7C3AED]/40 group transition-all cursor-pointer shadow-sm active:scale-95 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#242424] group-hover:bg-[#7C3AED]/20 flex items-center justify-center mb-1.5 text-gray-300 group-hover:text-purple-300 transition-colors">
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
