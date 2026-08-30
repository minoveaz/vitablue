import type { CreativeLayer, Geometry, Point, Transform } from '../types';
import { clampPoint } from './helpers';
import { CreativeCommandError } from './errors';

export interface TransformConstraints {
  clampToCanvas?: boolean;
  preserveAspectRatio?: boolean;
  minScale?: number;
  maxScale?: number;
}

export interface MoveLayerInput {
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
}

export interface ResizeLayerInput {
  width: number;
  height: number;
}

export interface ResizeLayerOptions extends TransformConstraints {
  /** Point inside the layer that remains fixed while resizing. */
  anchor?: Point;
}

const finite = (value: number, label: string): number => {
  if (!Number.isFinite(value)) throw new CreativeCommandError('invalid-input', `${label} must be finite.`);
  return value;
};

const positive = (value: number, label: string): number => {
  finite(value, label);
  if (value <= 0) throw new CreativeCommandError('invalid-input', `${label} must be greater than zero.`);
  return value;
};

const effectiveSize = (layer: CreativeLayer): Point => ({
  x: layer.geometry.width * layer.transform.scale.x,
  y: layer.geometry.height * layer.transform.scale.y,
});

export const clampTransformPosition = (
  layer: CreativeLayer,
  position: Point,
  clampToCanvas = true,
): Point => {
  const next = clampPoint(position);
  if (!clampToCanvas) return next;
  const size = effectiveSize(layer);
  const anchor = clampPoint(layer.transform.anchor);
  const minX = size.x * anchor.x;
  const maxX = 1 - size.x * (1 - anchor.x);
  const minY = size.y * anchor.y;
  const maxY = 1 - size.y * (1 - anchor.y);
  return {
    x: Math.max(0, Math.min(1, Math.max(minX, Math.min(maxX, next.x)))),
    y: Math.max(0, Math.min(1, Math.max(minY, Math.min(maxY, next.y)))),
  };
};

export const moveTransform = (
  layer: CreativeLayer,
  input: MoveLayerInput,
  constraints: TransformConstraints = {},
): Transform => {
  const current = layer.transform.position;
  const position = {
    x: input.x === undefined ? current.x + (input.dx ?? 0) : input.x,
    y: input.y === undefined ? current.y + (input.dy ?? 0) : input.y,
  };
  const safePosition = {
    x: finite(position.x, 'x'),
    y: finite(position.y, 'y'),
  };
  return {
    ...layer.transform,
    position: clampTransformPosition(layer, safePosition, constraints.clampToCanvas !== false),
  };
};

export const resizeGeometry = (
  layer: CreativeLayer,
  input: ResizeLayerInput,
  options: ResizeLayerOptions = {},
): { geometry: Geometry; transform: Transform } => {
  let width = positive(input.width, 'width');
  let height = positive(input.height, 'height');
  const oldRatio = layer.geometry.width / layer.geometry.height;
  if (options.preserveAspectRatio) {
    const widthRatio = width / layer.geometry.width;
    const heightRatio = height / layer.geometry.height;
    if (Math.abs(widthRatio - 1) >= Math.abs(heightRatio - 1)) height = width / oldRatio;
    else width = height * oldRatio;
    const fit = Math.min(1 / width, 1 / height, 1);
    width *= fit;
    height *= fit;
  }
  width = Math.min(1, width);
  height = Math.min(1, height);
  const anchor = clampPoint(options.anchor ?? layer.transform.anchor);
  const oldSize = effectiveSize(layer);
  const oldAnchorWorld = {
    x: layer.transform.position.x - oldSize.x * layer.transform.anchor.x,
    y: layer.transform.position.y - oldSize.y * layer.transform.anchor.y,
  };
  const nextGeometry: Geometry = {
    ...layer.geometry,
    x: Math.max(0, Math.min(1 - width, oldAnchorWorld.x)),
    y: Math.max(0, Math.min(1 - height, oldAnchorWorld.y)),
    width,
    height,
  };
  const nextLayer = { ...layer, geometry: nextGeometry, transform: { ...layer.transform, anchor } };
  const nextPosition = {
    x: nextGeometry.x + width * layer.transform.scale.x * anchor.x,
    y: nextGeometry.y + height * layer.transform.scale.y * anchor.y,
  };
  return {
    geometry: nextGeometry,
    transform: {
      ...nextLayer.transform,
      position: clampTransformPosition(nextLayer, nextPosition, options.clampToCanvas !== false),
    },
  };
};

export const scaleTransform = (
  layer: CreativeLayer,
  value: number | Point,
  constraints: TransformConstraints = {},
): Transform => {
  const requested = typeof value === 'number' ? { x: value, y: value } : value;
  let x = positive(requested.x, 'scale.x');
  let y = positive(requested.y, 'scale.y');
  if (constraints.preserveAspectRatio) {
    const factor = Math.abs(x - layer.transform.scale.x) >= Math.abs(y - layer.transform.scale.y) ? x : y;
    x = factor;
    y = factor;
  }
  const min = constraints.minScale ?? 0.01;
  const max = constraints.maxScale ?? Number.POSITIVE_INFINITY;
  if (!Number.isFinite(min) || min <= 0 || (!Number.isFinite(max) && max !== Number.POSITIVE_INFINITY) || max < min) {
    throw new CreativeCommandError('invalid-input', 'Invalid scale constraints.');
  }
  x = Math.max(min, Math.min(max, x));
  y = Math.max(min, Math.min(max, y));
  if (constraints.clampToCanvas !== false) {
    const canvasMax = constraints.preserveAspectRatio
      ? Math.min(1 / layer.geometry.width, 1 / layer.geometry.height)
      : undefined;
    x = canvasMax === undefined ? Math.min(x, 1 / layer.geometry.width) : Math.min(x, canvasMax);
    y = canvasMax === undefined ? Math.min(y, 1 / layer.geometry.height) : Math.min(y, canvasMax);
  }
  return {
    ...layer.transform,
    scale: { x, y },
    position: clampTransformPosition({ ...layer, transform: { ...layer.transform, scale: { x, y } } }, layer.transform.position, constraints.clampToCanvas !== false),
  };
};
