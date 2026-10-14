import React, { useState } from 'react';
import { AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { DocumentNode } from '../../../types/editor';
import { useEditor } from '../../../context/EditorContext';

interface LayoutDiagnosticsProps {
  node: DocumentNode;
}

export const LayoutDiagnostics: React.FC<LayoutDiagnosticsProps> = ({ node }) => {
  const { resolveStyles, viewportMode, canvasCustomWidth, selectNode } = useEditor();
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);

  const styles = resolveStyles(node);

  const activeWidth =
    canvasCustomWidth || (viewportMode === 'mobile' ? 375 : viewportMode === 'tablet' ? 768 : 1240);

  const issues: {
    id: string;
    message: string;
    recommendation: string;
  }[] = [];

  // Check 1: Fixed element wider than active viewport
  if (styles.width && styles.width.endsWith('px')) {
    const pxVal = parseInt(styles.width, 10);
    if (pxVal > activeWidth - 16) {
      issues.push({
        id: 'fixed-width-overflow',
        message: `${node.name} width (${pxVal}px) is wider than the ${viewportMode} viewport (${activeWidth}px).`,
        recommendation:
          'Set width sizing to "Fill", adjust constraints to "Stretch", or use responsive percentage width.',
      });
    }
  }

  // Check 2: Element positioned outside parent bounds in Free Layout
  if (styles.position === 'absolute') {
    const posX = styles.x || 0;
    const posY = styles.y || 0;
    const elW = parseInt(styles.width || '160', 10) || 160;

    if (posX < -5 || posY < -5) {
      issues.push({
        id: 'boundary-escape-negative',
        message: `${node.name} extends outside the top/left parent boundary (X: ${posX}px, Y: ${posY}px).`,
        recommendation:
          'Reposition element inside container boundaries or anchor with Left / Top constraints.',
      });
    } else if (posX + elW > activeWidth + 10) {
      issues.push({
        id: 'boundary-escape-right',
        message: `${node.name} extends beyond the ${viewportMode} viewport boundary.`,
        recommendation:
          'Pin to right edge using Right constraint or adjust position on mobile.',
      });
    }
  }

  // Check 3: Grid child column span exceeds parent column count
  if (styles.gridColumnSpan && styles.gridColumnSpan > 3 && viewportMode === 'mobile') {
    issues.push({
      id: 'grid-span-mobile',
      message: `${node.name} spans ${styles.gridColumnSpan} columns, which may cause overflow on single-column mobile viewports.`,
      recommendation:
        'Set mobile column span override to 1 column in the Grid Child section.',
    });
  }

  // Check 4: Text clipping with fixed height
  const isText = node.type === 'heading' || node.type === 'paragraph';
  if (isText && styles.height && styles.height !== 'auto' && parseInt(styles.height, 10) < 36) {
    issues.push({
      id: 'text-clipping-height',
      message: `${node.name} has a fixed height (${styles.height}) which may clip text content.`,
      recommendation:
        'Set height sizing to "Hug" (auto height) so text container expands with content.',
    });
  }

  // Check 5: Navigation overflow on mobile
  const isNav =
    node.id.toLowerCase().includes('nav') ||
    node.name.toLowerCase().includes('nav') ||
    (node.type === 'section' && node.children?.some((c) => c.name.toLowerCase().includes('nav')));

  if (isNav && viewportMode === 'mobile') {
    issues.push({
      id: 'nav-overflow',
      message: 'Navigation links may overflow or collide on narrow screens.',
      recommendation:
        'Verify navigation fits on 375px mobile screens or enable vertical stacking.',
    });
  }

  // Check 6: Large heading font on mobile (potential text clipping)
  if (node.type === 'heading' && viewportMode === 'mobile') {
    const fontSize = parseInt(styles.fontSize || '32', 10);
    if (fontSize >= 40) {
      issues.push({
        id: 'heading-clipping',
        message: `Heading font size (${fontSize}px) may clip or break awkwardly on mobile.`,
        recommendation:
          'Set a mobile-specific font size override (e.g. 28px - 34px) in the Typography section.',
      });
    }
  }

  // Check 7: Horizontal row with multiple children not stacking on mobile
  const isHorizontalRow =
    styles.display === 'flex' && (styles.flexDirection === 'row' || !styles.flexDirection);

  if (
    viewportMode === 'mobile' &&
    isHorizontalRow &&
    !styles.stackOnMobile &&
    node.children &&
    node.children.length >= 3
  ) {
    issues.push({
      id: 'row-overflow',
      message: 'Horizontal row with multiple items may cause horizontal overflow on mobile.',
      recommendation:
        'Enable "Stack on Mobile" in the Layout section so items flow vertically on small screens.',
    });
  }

  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5 select-none mb-3">
      {issues.map((issue) => {
        const isExpanded = expandedIssueId === issue.id;
        return (
          <div
            key={issue.id}
            className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-2.5 transition-all text-xs"
          >
            <div
              onClick={() => {
                selectNode(node.id);
                setExpandedIssueId(isExpanded ? null : issue.id);
              }}
              className="flex items-start justify-between gap-2 cursor-pointer"
            >
              <div className="flex items-start gap-1.5 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-medium text-[11px] leading-tight text-amber-200">
                  {issue.message}
                </span>
              </div>
              <button
                className="text-amber-400 hover:text-amber-200 shrink-0 p-0.5"
                title={isExpanded ? 'Collapse' : 'Inspect Details'}
              >
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {isExpanded && (
              <div className="mt-2 pt-2 border-t border-amber-800/30 text-[11px] text-amber-300/80 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-amber-200">
                  <Info className="w-3 h-3 text-amber-400" />
                  <span>Recommendation:</span>
                </div>
                <p className="leading-relaxed pl-4">{issue.recommendation}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
