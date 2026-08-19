import { describe, it, expect } from 'vitest';
import { calculateSnapping } from '../hooks/useKonvaSnapping';
import { ImageLayer } from '../types/imageStudio';

describe('calculateSnapping', () => {
  const dummyLayers: ImageLayer[] = [
    {
      id: 'layer-1',
      type: 'text',
      title: 'Título Principal',
      props: {},
      position: { x: 50, y: 50 },
      zIndex: 1,
      scale: 1,
      width: 400,
      height: 100,
      visible: true,
    },
  ];

  const canvasWidth = 1080;
  const canvasHeight = 1080;

  it('snaps dragging layer to canvas center horizontal and vertical when within threshold', () => {
    // Canvas center is 540x540.
    // Layer dragged near (542, 538)
    const result = calculateSnapping(
      'layer-dragging',
      542,
      538,
      300,
      150,
      canvasWidth,
      canvasHeight,
      dummyLayers
    );

    expect(result.x).toBe(540); // Snapped to center X
    expect(result.y).toBe(540); // Snapped to center Y
    expect(result.guides.length).toBe(2);
    expect(result.guides[0].color).toBe('#EE9B00'); // Center gold guide
    expect(result.guides[1].color).toBe('#EE9B00');
  });

  it('snaps dragging layer edge to canvas edge', () => {
    // Left edge of layer is targetX - width/2. For width 200, halfW is 100.
    // If targetX is 103, left edge is 3 (close to 0).
    const result = calculateSnapping(
      'layer-dragging',
      103,
      300,
      200,
      100,
      canvasWidth,
      canvasHeight,
      dummyLayers
    );

    expect(result.x).toBe(100); // 100 - 100 = 0 (snapped to canvas left edge)
    expect(result.guides.some((g) => g.orientation === 'vertical')).toBe(true);
  });

  it('does not snap if distance is greater than threshold', () => {
    const result = calculateSnapping(
      'layer-dragging',
      250,
      250,
      200,
      100,
      canvasWidth,
      canvasHeight,
      dummyLayers
    );

    expect(result.x).toBe(250);
    expect(result.y).toBe(250);
    expect(result.guides.length).toBe(0);
  });
});
