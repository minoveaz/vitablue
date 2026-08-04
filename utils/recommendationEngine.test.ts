import { describe, expect, it } from 'vitest';
import { getRecommendationDecisions } from './recommendationEngine';

describe('recommendation decisions', () => {
  it('returns explainable decisions and pending data status', () => {
    const result = getRecommendationDecisions({ profile: 'expat', visaRequired: 'yes', duration: 'annual', ageRange: '30_45', residencyType: 'non_lucrative' });
    expect(result[0].productId).toBe('adeslas');
    expect(result[0].reasons.length).toBeGreaterThan(0);
    expect(result[0].dataStatus).toBe('pending');
    expect(result[0].restrictions).toContain('Precio y coberturas pendientes de verificación oficial');
  });

  it('adds an explicit USA/North America reason for a highly mobile nomad', () => {
    const result = getRecommendationDecisions({
      profile: 'nomad', visaRequired: 'no', duration: 'annual', ageRange: '30_45',
      travelFrequency: 'high', continents: ['NorthAmerica'],
    });
    expect(result[0].reasons[0]).toContain('Norteam');
  });

  it('handles incomplete criteria without throwing', () => {
    const result = getRecommendationDecisions({ profile: null, visaRequired: null, duration: null, ageRange: null });
    expect(result.length).toBe(2);
    expect(result.every((decision) => decision.reasons.length > 0)).toBe(true);
  });

  it('returns eligibility metadata for a profile without residency details', () => {
    const result = getRecommendationDecisions({
      profile: 'nomad', visaRequired: null, duration: null, ageRange: null,
    });
    expect(result.every((decision) => typeof decision.eligible === 'boolean')).toBe(true);
  });
});
