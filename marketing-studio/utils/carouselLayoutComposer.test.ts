import { describe, expect, it } from 'vitest';
import { getCarouselLayout } from '../data/carouselLayoutCatalog';
import { getCarouselSlotFrame, getCarouselSlideLayout } from './carouselLayoutComposer';

describe('carousel layout composer', () => {
  it('cycles a layout narrative for any supported slide count', () => {
    const layout = getCarouselLayout('educational-flow')!;
    expect(getCarouselSlideLayout(layout, 0).role).toBe('hook');
    expect(getCarouselSlideLayout(layout, 4).role).toBe('hook');
    expect(getCarouselSlideLayout(layout, 6).role).toBe('proof');
  });

  it('keeps slots inside the slide safe area', () => {
    const layout = getCarouselLayout('educational-flow')!;
    for (const slide of layout.slides) {
      for (const slot of slide.slots) {
        const frame = getCarouselSlotFrame(slot);
        expect(frame.x).toBeGreaterThanOrEqual(0);
        expect(frame.y).toBeGreaterThanOrEqual(0);
        expect(frame.x + frame.width).toBeLessThanOrEqual(100);
        expect(frame.y + frame.height).toBeLessThanOrEqual(100);
      }
    }
  });
});
