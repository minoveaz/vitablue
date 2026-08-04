import { describe, expect, it } from 'vitest';
import { PRODUCT_CATALOG } from './catalog';
import { rankRecommendations } from './ranking';

describe('product ranking', () => {
  it('places the explicitly recommended product first', () => {
    const products = [
      { ...PRODUCT_CATALOG.adeslas, whyItFits: 'alternative', isRecommended: false },
      { ...PRODUCT_CATALOG.sanitas, whyItFits: 'best fit', isRecommended: true },
    ];
    const result = rankRecommendations(products);
    expect(result[0].product.id).toBe('sanitas');
    expect(result[0].score).toBe(100);
  });
});
