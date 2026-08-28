import { describe, expect, it } from 'vitest';
import { CAROUSEL_LAYOUT_CATALOG, getCarouselLayout } from './carouselLayoutCatalog';

describe('carousel layout catalog', () => {
  it('defines variable slide bounds and valid recommendations', () => {
    for (const layout of CAROUSEL_LAYOUT_CATALOG) {
      expect(layout.minSlides).toBeGreaterThanOrEqual(2);
      expect(layout.maxSlides).toBeGreaterThanOrEqual(layout.minSlides);
      expect(layout.recommendedSlides.every((count) => count >= layout.minSlides && count <= layout.maxSlides)).toBe(true);
      expect(layout.slides.some((slide) => slide.role === 'hook')).toBe(true);
      expect(layout.slides.some((slide) => slide.role === 'cta')).toBe(true);
    }
  });

  it('resolves layouts by stable id', () => {
    expect(getCarouselLayout('educational-flow')?.name).toBe('Flujo educativo');
    expect(getCarouselLayout('missing-layout')).toBeUndefined();
  });
});
