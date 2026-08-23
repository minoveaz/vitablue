/**
 * Format-independent layout contracts.
 *
 * Coordinates are stored as percentages so the same project can be rendered
 * in Image Studio and Video Studio without baking a canvas size into a layer.
 */
export const LAYOUT_CONSTRAINTS_VERSION = 1 as const;

export type LayoutAxisConstraint = 'scale' | 'start' | 'center' | 'end' | 'stretch';
export type LayoutDimensionConstraint = 'scale' | 'fixed' | 'stretch';

export interface LayerLayoutConstraints {
  version?: typeof LAYOUT_CONSTRAINTS_VERSION;
  horizontal?: LayoutAxisConstraint;
  vertical?: LayoutAxisConstraint;
  width?: LayoutDimensionConstraint;
  height?: LayoutDimensionConstraint;
  preserveAspectRatio?: boolean;
  /** A layer can opt out of one or more editor operations without being locked. */
  participatesInAutoLayout?: boolean;
  snapToGuides?: boolean;
  minScale?: number;
  maxScale?: number;
}

export type LayoutConstraintMetadata = LayerLayoutConstraints;

export interface LayoutProjectMetadata {
  version: typeof LAYOUT_CONSTRAINTS_VERSION;
  coordinateSpace: 'percent';
  defaultLayerConstraints?: LayerLayoutConstraints;
}

export interface LayoutCanvasSize {
  width: number;
  height: number;
}

export interface LayoutGeometry {
  position: { x: number; y: number };
  width?: number;
  height?: number;
  scale?: number;
  fontSize?: number;
}

export const DEFAULT_LAYER_LAYOUT_CONSTRAINTS: Readonly<LayerLayoutConstraints> = {
  version: LAYOUT_CONSTRAINTS_VERSION,
  horizontal: 'scale',
  vertical: 'scale',
  width: 'scale',
  height: 'scale',
  preserveAspectRatio: false,
  participatesInAutoLayout: true,
  snapToGuides: true,
};

export const createDefaultLayoutMetadata = (): LayoutProjectMetadata => ({
  version: LAYOUT_CONSTRAINTS_VERSION,
  coordinateSpace: 'percent',
});

export const normalizeLayerLayoutConstraints = (
  constraints?: LayerLayoutConstraints | null,
  defaults?: LayerLayoutConstraints
): LayerLayoutConstraints => ({
  ...DEFAULT_LAYER_LAYOUT_CONSTRAINTS,
  ...(defaults ?? {}),
  ...(constraints ?? {}),
  version: LAYOUT_CONSTRAINTS_VERSION,
});

const clampScale = (value: number, constraints: LayerLayoutConstraints): number => {
  const min = Math.max(0.05, constraints.minScale ?? 0.05);
  const max = Math.max(min, constraints.maxScale ?? 10);
  return Math.max(min, Math.min(max, value));
};

/**
 * Resolves one layer from one format into another. Missing metadata follows
 * the old proportional smart-resize behavior, keeping legacy projects safe.
 */
export const resizeLayerForFormat = <T extends LayoutGeometry>(
  layer: T,
  from: LayoutCanvasSize,
  to: LayoutCanvasSize,
  rawConstraints?: LayerLayoutConstraints,
  defaults?: LayerLayoutConstraints
): T => {
  const embedded = (layer as T & { constraints?: LayerLayoutConstraints }).constraints;
  const constraints = normalizeLayerLayoutConstraints(rawConstraints ?? embedded, defaults);
  const scaleX = to.width / Math.max(1, from.width);
  const scaleY = to.height / Math.max(1, from.height);
  const uniformScale = Math.min(scaleX, scaleY);
  const oldWidth = layer.width;
  const oldHeight = layer.height;
  const widthScale = constraints.width === 'fixed' ? 1 : constraints.width === 'stretch' ? scaleX : uniformScale;
  const heightScale = constraints.height === 'fixed' ? 1 : constraints.height === 'stretch' ? scaleY : uniformScale;
  const nextWidth = oldWidth === undefined ? undefined : Math.max(1, Math.round(oldWidth * widthScale));
  const nextHeight = oldHeight === undefined ? undefined : Math.max(1, Math.round(oldHeight * heightScale));
  const nextFontSize = layer.fontSize === undefined
    ? undefined
    : Math.max(1, Math.round(layer.fontSize * (constraints.width === 'fixed' ? 1 : uniformScale)));
  const oldScale = layer.scale ?? 1;
  // Image Studio stores dimensions and visual scale independently. Resizing a
  // format changes the former; multiplying both would scale legacy layers
  // twice. Video layers generally have no scale and retain the same value.
  const nextScale = clampScale(oldScale, constraints);

  const oldX = (layer.position.x / 100) * from.width;
  const oldY = (layer.position.y / 100) * from.height;
  const resolvedWidth = oldWidth ?? 0;
  const resolvedHeight = oldHeight ?? 0;
  const resultWidth = nextWidth ?? resolvedWidth;
  const resultHeight = nextHeight ?? resolvedHeight;
  const resolveAxis = (
    value: number,
    axisScale: number,
    oldSize: number,
    nextSize: number,
    axis: LayoutAxisConstraint | undefined
  ) => {
    if (axis === 'start') return (value - oldSize / 2) * axisScale + nextSize / 2;
    if (axis === 'end') return to.width - (from.width - value - oldSize / 2) * axisScale - nextSize / 2;
    return value * axisScale;
  };
  const resolveVerticalAxis = (
    value: number,
    axisScale: number,
    oldSize: number,
    nextSize: number,
    axis: LayoutAxisConstraint | undefined
  ) => {
    if (axis === 'start') return (value - oldSize / 2) * axisScale + nextSize / 2;
    if (axis === 'end') return to.height - (from.height - value - oldSize / 2) * axisScale - nextSize / 2;
    return value * axisScale;
  };

  return {
    ...layer,
    position: {
      x: Math.round((resolveAxis(oldX, scaleX, resolvedWidth, resultWidth, constraints.horizontal) / to.width) * 1000) / 10,
      y: Math.round((resolveVerticalAxis(oldY, scaleY, resolvedHeight, resultHeight, constraints.vertical) / to.height) * 1000) / 10,
    },
    ...(nextWidth === undefined ? {} : { width: nextWidth }),
    ...(nextHeight === undefined ? {} : { height: nextHeight }),
    ...(nextFontSize === undefined ? {} : { fontSize: nextFontSize }),
    scale: Math.round(nextScale * 100) / 100,
  };
};

export const getLayerLayoutConstraints = (
  layer: { constraints?: LayerLayoutConstraints; props?: Record<string, unknown> },
  defaults?: LayerLayoutConstraints
): LayerLayoutConstraints => {
  const legacy = layer.props?.constraints;
  const embedded = legacy && typeof legacy === 'object' ? legacy as LayerLayoutConstraints : undefined;
  return normalizeLayerLayoutConstraints(layer.constraints ?? embedded, defaults);
};

export const resizeLayersForFormat = <T extends LayoutGeometry & { locked?: boolean; constraints?: LayerLayoutConstraints }>(
  layers: T[],
  from: LayoutCanvasSize,
  to: LayoutCanvasSize,
  defaults?: LayerLayoutConstraints
): T[] =>
  layers.map((layer) =>
    layer.locked
      ? layer
      : resizeLayerForFormat(layer, from, to, layer.constraints, defaults)
  );
