export type CanvasGridPattern = 'dotted' | 'technical';
export type CanvasGridDimension = number | string;

export interface CanvasGridPatternConfig {
  backgroundImage: string;
  backgroundSize: string;
}

const GRID_COLOR = 'var(--canvas-grid-color, var(--color-primary))';

/**
 * Keep renderer-independent pattern values in one place so a future grid
 * treatment can be changed without touching Image Studio or Video Studio.
 */
export const CANVAS_GRID_PATTERNS: Record<CanvasGridPattern, CanvasGridPatternConfig> = {
  dotted: {
    backgroundImage: `radial-gradient(circle, ${GRID_COLOR} 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
  },
  technical: {
    backgroundImage: [
      `linear-gradient(to right, ${GRID_COLOR} 1px, transparent 1px)`,
      `linear-gradient(to bottom, ${GRID_COLOR} 1px, transparent 1px)`,
      `radial-gradient(circle, ${GRID_COLOR} 1px, transparent 1px)`,
    ].join(', '),
    backgroundSize: '24px 24px',
  },
};

export const CANVAS_GRID_DEFAULTS = {
  visible: true,
  pattern: 'dotted',
  spacing: 24,
  opacity: 1,
  decorative: true,
} as const satisfies Required<Pick<CanvasGridPropsLike, 'visible' | 'pattern' | 'spacing' | 'opacity' | 'decorative'>>;

type CanvasGridPropsLike = {
  visible?: boolean;
  pattern?: CanvasGridPattern;
  spacing?: CanvasGridDimension;
  opacity?: number | string;
  decorative?: boolean;
};
