import type { CSSProperties } from 'react';
import type { ImageCrop, ImageCropBounds } from '../types/imageStudio';

export const DEFAULT_IMAGE_CROP: ImageCrop = { x: 50, y: 50, zoom: 1 };
export const DEFAULT_IMAGE_CROP_BOUNDS: ImageCropBounds = {
  left: 0,
  top: 0,
  right: 100,
  bottom: 100,
};
export const MIN_IMAGE_CROP_SIZE_PX = 48;

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const normalizeBound = (value: unknown, fallback: number): number =>
  clamp(Number.isFinite(value) ? Number(value) : fallback, 0, 100);

const hasBounds = (crop?: Partial<ImageCrop> | null): crop is Partial<ImageCrop> & { bounds: Partial<ImageCropBounds> } =>
  Boolean(crop?.bounds);

const normalizeBounds = (bounds?: Partial<ImageCropBounds> | null): ImageCropBounds => {
  const left = normalizeBound(bounds?.left, DEFAULT_IMAGE_CROP_BOUNDS.left);
  const top = normalizeBound(bounds?.top, DEFAULT_IMAGE_CROP_BOUNDS.top);
  const right = Math.max(left, normalizeBound(bounds?.right, DEFAULT_IMAGE_CROP_BOUNDS.right));
  const bottom = Math.max(top, normalizeBound(bounds?.bottom, DEFAULT_IMAGE_CROP_BOUNDS.bottom));
  return { left, top, right, bottom };
};

export const getImageCropBounds = (crop?: ImageCrop | Partial<ImageCrop> | null): ImageCropBounds => {
  if (hasBounds(crop)) return normalizeBounds(crop.bounds);

  const normalizedZoom = clamp(
    Number.isFinite(crop?.zoom) ? Number(crop?.zoom) : DEFAULT_IMAGE_CROP.zoom,
    1,
    3,
  );
  const width = 100 / normalizedZoom;
  const height = 100 / normalizedZoom;
  const centerX = clamp(Number.isFinite(crop?.x) ? Number(crop?.x) : DEFAULT_IMAGE_CROP.x, 0, 100);
  const centerY = clamp(Number.isFinite(crop?.y) ? Number(crop?.y) : DEFAULT_IMAGE_CROP.y, 0, 100);
  const left = clamp(centerX - width / 2, 0, 100 - width);
  const top = clamp(centerY - height / 2, 0, 100 - height);
  return { left, top, right: left + width, bottom: top + height };
};

export const normalizeImageCrop = (crop?: Partial<ImageCrop> | null): ImageCrop => {
  const normalized: ImageCrop = {
    x: clamp(Number.isFinite(crop?.x) ? Number(crop?.x) : DEFAULT_IMAGE_CROP.x, 0, 100),
    y: clamp(Number.isFinite(crop?.y) ? Number(crop?.y) : DEFAULT_IMAGE_CROP.y, 0, 100),
    zoom: clamp(Number.isFinite(crop?.zoom) ? Number(crop?.zoom) : DEFAULT_IMAGE_CROP.zoom, 1, 3),
  };
  return hasBounds(crop) ? { ...normalized, bounds: normalizeBounds(crop.bounds) } : normalized;
};

export const isDefaultImageCrop = (crop?: ImageCrop): boolean => {
  const normalized = normalizeImageCrop(crop);
  const bounds = normalized.bounds;
  const hasDefaultBounds =
    !bounds ||
    (bounds.left === DEFAULT_IMAGE_CROP_BOUNDS.left &&
      bounds.top === DEFAULT_IMAGE_CROP_BOUNDS.top &&
      bounds.right === DEFAULT_IMAGE_CROP_BOUNDS.right &&
      bounds.bottom === DEFAULT_IMAGE_CROP_BOUNDS.bottom);
  return normalized.x === 50 && normalized.y === 50 && normalized.zoom === 1 && hasDefaultBounds;
};

/**
 * The image remains non-destructive: object-position chooses the source window
 * while scale gives the user a familiar Canva-style zoom control.
 */
export const getCropImageStyle = (crop?: ImageCrop): CSSProperties => {
  const normalized = normalizeImageCrop(crop);
  const bounds = normalized.bounds;
  const centerX = bounds ? (bounds.left + bounds.right) / 2 : normalized.x;
  const centerY = bounds ? (bounds.top + bounds.bottom) / 2 : normalized.y;
  // Bounds can be loaded from older/manual project data without the zoom
  // value having been recalculated. Derive the minimum zoom required to fill
  // the selected rectangle so applying a crop always changes the rendered
  // image, not just its focal point.
  const boundsZoom = bounds
    ? Math.max(
        100 / Math.max(0.0001, bounds.right - bounds.left),
        100 / Math.max(0.0001, bounds.bottom - bounds.top),
      )
    : 1;
  const effectiveZoom = Math.max(normalized.zoom, boundsZoom);
  return {
    objectFit: 'cover',
    objectPosition: `${centerX}% ${centerY}%`,
    transform: `scale(${effectiveZoom})`,
    transformOrigin: `${centerX}% ${centerY}%`,
  };
};

export type ImageCropHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const getFramePercentDelta = (
  delta: { x: number; y: number },
  frame: { width: number; height: number },
): { x: number; y: number } => ({
  x: (delta.x / Math.max(1, frame.width)) * 100,
  y: (delta.y / Math.max(1, frame.height)) * 100,
});

const finalizeBoundsCrop = (
  crop: ImageCrop,
  bounds: ImageCropBounds,
  updateZoom = true,
): ImageCrop => {
  const normalizedBounds = normalizeBounds(bounds);
  const width = Math.max(0.0001, normalizedBounds.right - normalizedBounds.left);
  const height = Math.max(0.0001, normalizedBounds.bottom - normalizedBounds.top);
  return normalizeImageCrop({
    ...crop,
    x: (normalizedBounds.left + normalizedBounds.right) / 2,
    y: (normalizedBounds.top + normalizedBounds.bottom) / 2,
    zoom: updateZoom ? Math.max(1, 100 / Math.max(width, height)) : crop.zoom,
    bounds: normalizedBounds,
  });
};

export const moveImageCrop = (
  crop: ImageCrop,
  delta: { x: number; y: number },
  frame: { width: number; height: number },
): ImageCrop => {
  const normalized = normalizeImageCrop(crop);
  const percentDelta = getFramePercentDelta(delta, frame);
  if (!normalized.bounds) {
    return normalizeImageCrop({
      ...normalized,
      x: normalized.x - percentDelta.x,
      y: normalized.y - percentDelta.y,
    });
  }

  const bounds = normalized.bounds;
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const left = clamp(bounds.left + percentDelta.x, 0, 100 - width);
  const top = clamp(bounds.top + percentDelta.y, 0, 100 - height);
  return finalizeBoundsCrop(normalized, { left, top, right: left + width, bottom: top + height }, false);
};

/**
 * Resizes one edge or corner while keeping the opposite edge fixed. Bounds
 * stay inside the frame and never shrink below the supplied minimum size.
 */
export const resizeImageCrop = (
  crop: ImageCrop,
  handle: ImageCropHandle,
  delta: { x: number; y: number },
  frame: { width: number; height: number },
  minimumSize = MIN_IMAGE_CROP_SIZE_PX,
): ImageCrop => {
  const normalized = normalizeImageCrop(crop);
  const currentBounds = normalized.bounds ?? getImageCropBounds(normalized);
  const percentDelta = getFramePercentDelta(delta, frame);
  const frameWidth = Math.max(1, frame.width);
  const frameHeight = Math.max(1, frame.height);
  const minWidth = Math.min(100, (Math.max(1, minimumSize) / frameWidth) * 100);
  const minHeight = Math.min(100, (Math.max(1, minimumSize) / frameHeight) * 100);
  let { left, top, right, bottom } = currentBounds;

  if (handle.includes('w')) left = clamp(left + percentDelta.x, 0, right - minWidth);
  if (handle.includes('e')) right = clamp(right + percentDelta.x, left + minWidth, 100);
  if (handle.includes('n')) top = clamp(top + percentDelta.y, 0, bottom - minHeight);
  if (handle.includes('s')) bottom = clamp(bottom + percentDelta.y, top + minHeight, 100);

  return finalizeBoundsCrop(normalized, { left, top, right, bottom });
};
