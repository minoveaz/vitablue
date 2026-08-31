import React from 'react';
import { CANVAS_GRID_DEFAULTS, CANVAS_GRID_PATTERNS } from './CanvasGrid.config';
import type { CanvasGridDimension, CanvasGridPattern } from './CanvasGrid.config';

export type CanvasGridStyle = React.CSSProperties & Record<`--canvas-grid-${string}`, string | number | undefined>;

export interface CanvasGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Keeps the grid out of the DOM when a host needs an untextured stage. */
  visible?: boolean;
  /** Visual treatment owned by the shared canvas surface, not by an editor. */
  pattern?: CanvasGridPattern;
  /** Alias for pattern for hosts that use variant-oriented configuration. */
  variant?: CanvasGridPattern;
  /** Alias for spacing, useful when configuring a visual scale in pixels. */
  size?: CanvasGridDimension;
  spacing?: CanvasGridDimension;
  /** A CSS color/token or variable such as `var(--color-primary)`. */
  color?: string;
  opacity?: number | string;
  /** Grid surfaces are decorative by default and never capture pointer input. */
  decorative?: boolean;
  style?: CanvasGridStyle;
}

export type { CanvasGridDimension, CanvasGridPattern } from './CanvasGrid.config';

const toCssDimension = (value: CanvasGridDimension) =>
  typeof value === 'number' ? `${value}px ${value}px` : value;

export const CanvasGrid: React.FC<CanvasGridProps> = ({
  visible = CANVAS_GRID_DEFAULTS.visible,
  pattern = CANVAS_GRID_DEFAULTS.pattern,
  variant,
  size,
  spacing,
  color,
  opacity = CANVAS_GRID_DEFAULTS.opacity,
  decorative = CANVAS_GRID_DEFAULTS.decorative,
  className = '',
  style,
  ...props
}) => {
  if (!visible) return null;

  const patternConfig = CANVAS_GRID_PATTERNS[variant ?? pattern];
  const configuredSpacing = spacing ?? size;
  const gridStyle: React.CSSProperties = {
    backgroundColor: 'var(--canvas-grid-background, var(--color-secondary))',
    backgroundImage: patternConfig.backgroundImage,
    backgroundSize: patternConfig.backgroundSize,
    opacity,
    ...style,
    ...(color ? { '--canvas-grid-color': color } : {}),
    ...(configuredSpacing !== undefined ? { backgroundSize: toCssDimension(configuredSpacing) } : {}),
  } as React.CSSProperties;

  return (
    <div
      {...props}
      aria-hidden={decorative ? true : props['aria-hidden']}
      data-creative-studio-region="canvas-grid"
      data-visual-contract="creative-studio-canvas-grid"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={gridStyle}
    />
  );
};
