import { describe, expect, it } from 'vitest';
import type { ImageLayer } from '../types/imageStudio';
import { clientToCanvasPoint, getLayerCanvasBounds, getLayersInMarquee } from './imageStageGeometry';

const layer = (id: string, position: { x: number; y: number }, geometry: Partial<ImageLayer> = {}): ImageLayer => ({
  id,
  type: 'block',
  title: id,
  props: {},
  position,
  zIndex: 1,
  scale: 1,
  width: 100,
  height: 100,
  ...geometry,
});

describe('image stage marquee geometry', () => {
  it('converts client coordinates through the rendered, zoomed and panned artboard', () => {
    expect(clientToCanvasPoint(250, 170, { left: 50, top: 20, width: 400, height: 300 }, 800, 600)).toEqual({ x: 400, y: 300 });
  });

  it('selects intersecting layer bounds in either drag direction', () => {
    const layers = [
      layer('inside', { x: 25, y: 25 }),
      layer('outside', { x: 80, y: 80 }),
    ];
    const marquee = { startX: 350, startY: 350, currentX: 50, currentY: 50 };
    expect(getLayersInMarquee(layers, marquee, 800, 600)).toEqual(['inside']);
  });

  it('accounts for rotation and scale and preserves modifier selections', () => {
    const rotated = layer('rotated', { x: 50, y: 50 }, { width: 80, height: 40, scale: 2, rotation: 45 });
    const bounds = getLayerCanvasBounds(rotated, 800, 600);
    expect(bounds.left).toBeLessThan(400);
    expect(bounds.right).toBeGreaterThan(400);
    expect(getLayersInMarquee([rotated], { startX: 390, startY: 290, currentX: 410, currentY: 310 }, 800, 600, ['existing'], true)).toEqual(['existing', 'rotated']);
    expect(getLayersInMarquee([rotated], { startX: 390, startY: 290, currentX: 410, currentY: 310 }, 800, 600)).toEqual(['rotated']);
  });
});
