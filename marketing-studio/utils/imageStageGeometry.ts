import type { ImageLayer } from '../types/imageStudio';

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface LayerCanvasBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface MarqueeRectangle {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

/**
 * Convert viewport coordinates into the artboard's unscaled coordinate system.
 * Using the rendered rect (rather than zoom alone) also accounts for pan and
 * for browsers which apply a fractional transform.
 */
export const clientToCanvasPoint = (
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>,
  canvasWidth: number,
  canvasHeight: number,
  fallbackScale = 1,
): CanvasPoint => ({
  x: (clientX - rect.left) / (rect.width > 0 ? rect.width / canvasWidth : fallbackScale),
  y: (clientY - rect.top) / (rect.height > 0 ? rect.height / canvasHeight : fallbackScale),
});

export const getLayerCanvasBounds = (
  layer: ImageLayer,
  canvasWidth: number,
  canvasHeight: number,
): LayerCanvasBounds => {
  const width = Math.max(0, layer.width ?? 380) * Math.abs(layer.scale ?? 1);
  const height = Math.max(0, layer.height ?? 200) * Math.abs(layer.scale ?? 1);
  const angle = ((layer.rotation ?? 0) * Math.PI) / 180;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const rotatedHalfWidth = Math.abs(Math.cos(angle)) * halfWidth + Math.abs(Math.sin(angle)) * halfHeight;
  const rotatedHalfHeight = Math.abs(Math.sin(angle)) * halfWidth + Math.abs(Math.cos(angle)) * halfHeight;
  const centerX = (layer.position.x / 100) * canvasWidth;
  const centerY = (layer.position.y / 100) * canvasHeight;

  return {
    left: centerX - rotatedHalfWidth,
    top: centerY - rotatedHalfHeight,
    right: centerX + rotatedHalfWidth,
    bottom: centerY + rotatedHalfHeight,
  };
};

export const getLayersInMarquee = (
  layers: ImageLayer[],
  marquee: MarqueeRectangle,
  canvasWidth: number,
  canvasHeight: number,
  initialSelection: string[] = [],
  additive = false,
): string[] => {
  const marqueeLeft = Math.min(marquee.startX, marquee.currentX);
  const marqueeTop = Math.min(marquee.startY, marquee.currentY);
  const marqueeRight = Math.max(marquee.startX, marquee.currentX);
  const marqueeBottom = Math.max(marquee.startY, marquee.currentY);
  const intersectedIds = layers
    .filter((layer) => layer.visible !== false)
    .filter((layer) => {
      const bounds = getLayerCanvasBounds(layer, canvasWidth, canvasHeight);
      return bounds.left <= marqueeRight
        && bounds.right >= marqueeLeft
        && bounds.top <= marqueeBottom
        && bounds.bottom >= marqueeTop;
    })
    .map((layer) => layer.id);

  if (!additive) return intersectedIds;
  return [...new Set([...initialSelection, ...intersectedIds])];
};
