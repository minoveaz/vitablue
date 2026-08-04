import { describe, expect, it } from 'vitest';
import { PRODUCT_CATALOG } from './catalog';
import { evaluateEligibility } from './eligibility';

const baseCriteria = { profile: null, visaRequired: null, duration: null, ageRange: null };

describe('product eligibility', () => {
  it('allows a student product for a student profile', () => {
    expect(evaluateEligibility(PRODUCT_CATALOG.sanitas, { ...baseCriteria, profile: 'student' }).eligible).toBe(true);
  });

  it('reports restrictions when a product is not eligible for the profile', () => {
    const product = { ...PRODUCT_CATALOG.sanitas, eligibility: { ...PRODUCT_CATALOG.sanitas.eligibility, nomad: false } };
    const result = evaluateEligibility(product, { ...baseCriteria, profile: 'nomad' });
    expect(result.eligible).toBe(false);
    expect(result.restrictions).toHaveLength(1);
  });
});
