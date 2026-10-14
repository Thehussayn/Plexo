import { NodeType, ElementStyles } from '../types/editor';

export interface InsertableComponentItem {
  id: string;
  name: string;
  type: NodeType;
  icon: string;
  category: 'layout' | 'typography' | 'media' | 'interactive';
  badge?: string;
  defaultContent?: string;
  defaultStyles: ElementStyles;
  defaultProps?: Record<string, any>;
}

export const insertableComponents: InsertableComponentItem[] = [
  {
    id: 'comp-section',
    name: 'Section',
    type: 'section',
    icon: 'LayoutTemplate',
    category: 'layout',
    defaultStyles: {
      backgroundColor: '#181818',
      paddingTop: '64px',
      paddingBottom: '64px',
      paddingLeft: '32px',
      paddingRight: '32px',
      minHeight: '360px',
      position: 'relative',
      layoutMode: 'free',
      width: '100%',
    },
  },
  {
    id: 'comp-container',
    name: 'Container',
    type: 'container',
    icon: 'Box',
    category: 'layout',
    defaultStyles: {
      backgroundColor: '#1E1E1E',
      padding: '32px',
      minHeight: '240px',
      position: 'relative',
      layoutMode: 'free',
      borderRadius: '12px',
      width: '100%',
    },
  },
  {
    id: 'comp-columns',
    name: 'Columns',
    type: 'columns',
    icon: 'Columns',
    category: 'layout',
    defaultStyles: {
      display: 'grid',
      gap: '20px',
      padding: '24px 0',
      width: '100%',
    },
  },
  {
    id: 'comp-heading',
    name: 'Heading',
    type: 'heading',
    icon: 'Heading',
    category: 'typography',
    defaultContent: 'Enter your headline here',
    defaultStyles: {
      fontSize: '32px',
      fontWeight: '700',
      textColor: '#FFFFFF',
      marginBottom: '16px',
      lineHeight: '1.2',
    },
    defaultProps: { level: 2 },
  },
  {
    id: 'comp-paragraph',
    name: 'Paragraph',
    type: 'paragraph',
    icon: 'AlignLeft',
    category: 'typography',
    defaultContent: 'Craft compelling text that engages your readers with thoughtful typography and layout.',
    defaultStyles: {
      fontSize: '16px',
      textColor: '#C9CBD4',
      lineHeight: '1.6',
      marginBottom: '20px',
      fontWeight: '400',
    },
  },
  {
    id: 'comp-button',
    name: 'Button',
    type: 'button',
    icon: 'Square',
    category: 'interactive',
    defaultContent: 'Get Started Now',
    defaultStyles: {
      backgroundColor: '#7C3AED',
      textColor: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      display: 'inline-block',
    },
    defaultProps: { variant: 'primary' },
  },
  {
    id: 'comp-image',
    name: 'Image',
    type: 'image',
    icon: 'Image',
    category: 'media',
    defaultStyles: {
      width: '100%',
      borderRadius: '8px',
      minHeight: '200px',
      backgroundColor: '#1E1E1E',
    },
    defaultProps: {
      src: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      alt: 'Sample Image',
    },
  },
  {
    id: 'comp-icon',
    name: 'Icon',
    type: 'icon',
    icon: 'Star',
    category: 'media',
    defaultStyles: {
      textColor: '#F59E0B',
      fontSize: '24px',
    },
  },
  {
    id: 'comp-divider',
    name: 'Divider',
    type: 'divider',
    icon: 'Minus',
    category: 'layout',
    defaultStyles: {
      borderWidth: '1px 0 0 0',
      borderStyle: 'solid',
      borderColor: '#262626',
      margin: '24px 0',
      width: '100%',
    },
  },
  {
    id: 'comp-spacer',
    name: 'Spacer',
    type: 'spacer',
    icon: 'MoveVertical',
    category: 'layout',
    defaultStyles: {
      minHeight: '32px',
      width: '100%',
    },
  },
  {
    id: 'comp-badge',
    name: 'Badge',
    type: 'badge',
    icon: 'Tag',
    category: 'typography',
    defaultContent: 'NEW FEATURE',
    defaultStyles: {
      backgroundColor: 'rgba(124, 58, 237, 0.15)',
      textColor: '#A78BFA',
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.08em',
      display: 'inline-block',
    },
  },
  {
    id: 'comp-card',
    name: 'Container Card',
    type: 'card',
    icon: 'LayoutGrid',
    category: 'layout',
    defaultStyles: {
      backgroundColor: '#1C1C1C',
      padding: '24px',
      borderRadius: '12px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#262626',
    },
  },
];
