export type NodeType =
  | 'page'
  | 'section'
  | 'container'
  | 'columns'
  | 'column'
  | 'heading'
  | 'paragraph'
  | 'button'
  | 'image'
  | 'badge'
  | 'divider'
  | 'spacer'
  | 'card'
  | 'icon';

export type SizingMode = 'hug' | 'fill' | 'fixed';
export type LayoutMode = 'flow' | 'grid' | 'free';

export type HorizontalConstraint = 'left' | 'right' | 'center' | 'stretch' | 'scale';
export type VerticalConstraint = 'top' | 'bottom' | 'center' | 'stretch' | 'scale';

export interface ElementStyles {
  // Layout Mode (Phase 2)
  layoutMode?: LayoutMode;

  // Free Layout & Positioning (Parent-Relative)
  position?: 'static' | 'relative' | 'absolute';
  x?: number;
  y?: number;
  zIndex?: number;

  // Responsive Constraints (Phase 3)
  horizontalConstraint?: HorizontalConstraint;
  verticalConstraint?: VerticalConstraint;
  rightOffset?: number;
  bottomOffset?: number;
  centerOffsetX?: number;
  centerOffsetY?: number;
  scaleLeft?: number;
  scaleWidth?: number;
  scaleTop?: number;
  scaleHeight?: number;

  // Grid Layout
  gridColumns?: number;
  gridRows?: number;
  gridColumnSpan?: number;
  gridRowSpan?: number;
  gridGap?: string;

  // Sizing Model (Phase 3)
  widthSizing?: SizingMode;
  heightSizing?: SizingMode;
  stackOnMobile?: boolean;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flexShrink?: number | string;
  pointerEvents?: 'auto' | 'none' | 'inherit';

  // Layout
  display?: 'block' | 'flex' | 'grid' | 'inline-block';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: string;
  width?: string;
  customWidth?: string;
  isFullWidth?: boolean;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;

  // Typography
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: string;
  fontSizeUnit?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;

  // Appearance
  backgroundColor?: string;
  darkModeBackgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  opacity?: number;
  borderRadius?: string;
  borderWidth?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderColor?: string;
  boxShadow?: string;

  // Links (Page-level defaults)
  linkColor?: string;
  linkHoverColor?: string;
  underlineLinks?: boolean;
  underlineOnHover?: boolean;

  // Page alignment
  horizontalAlign?: 'left' | 'center' | 'right';

  // Advanced
  customClasses?: string;
}

export interface ResponsiveOverrides {
  tablet?: Partial<ElementStyles>;
  mobile?: Partial<ElementStyles>;
}

export interface ResponsiveVisibility {
  hideOnDesktop?: boolean;
  hideOnTablet?: boolean;
  hideOnMobile?: boolean;
}

export interface DocumentNode {
  id: string;
  type: NodeType;
  name: string;
  content?: string;
  props?: {
    href?: string;
    alt?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    iconName?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6; // for headings
    highlightText?: string;
    [key: string]: any;
  };
  styles: ElementStyles; // Base styles (Desktop)
  responsive?: ResponsiveOverrides; // Overrides for tablet and mobile
  responsiveVisibility?: ResponsiveVisibility;
  children?: DocumentNode[];
  locked?: boolean;
  hidden?: boolean;
}

export interface PageDefinition {
  id: string;
  name: string;
  slug: string;
  isHome?: boolean;
  rootNode: DocumentNode;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export type LeftSidebarTab =
  | 'add'
  | 'layers'
  | 'pages'
  | 'strata'
  | 'library'
  | 'sol'
  | 'insert';

export type ViewMode = 'design' | 'code' | 'json' | 'html' | 'plaintext';

export interface DragDropState {
  draggingNodeId: string | null;
  dropTargetId: string | null;
  dropPosition: 'before' | 'after' | 'inside' | null;
  isValidTarget: boolean;
}

export type CanvasToolMode = 'select' | 'hand';
export type CanvasViewMode = 'focused' | 'all';

export interface CanvasTransform {
  panX: number;
  panY: number;
  zoom: number;
}

export interface AlignmentGuide {
  type: 'x' | 'y'; // 'x' = vertical guide at x coordinate, 'y' = horizontal guide at y coordinate
  position: number;
  start: number;
  end: number;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  nodeId: string | null;
}

export interface MarqueeState {
  isActive: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  box: {
    left: number;
    top: number;
    width: number;
    height: number;
  } | null;
}
