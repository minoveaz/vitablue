import type { Product, RecommendationCriteria } from './types';

export interface EligibilityResult {
  eligible: boolean;
  restrictions: string[];
}

/** Pure eligibility rules; pricing and ranking deliberately do not belong here. */
export const evaluateEligibility = (
  product: Product,
  criteria: RecommendationCriteria,
): EligibilityResult => {
  const restrictions: string[] = [];

  if (criteria.profile === 'student' && !product.eligibility.visaStudent) {
    restrictions.push('No disponible para perfil de estudiante/visado');
  }
  if (criteria.profile === 'expat' && !product.eligibility.expatriate) {
    restrictions.push('No disponible para perfil expatriado');
  }
  if (criteria.profile === 'nomad' && !product.eligibility.nomad) {
    restrictions.push('No disponible para perfil nómada');
  }

  return { eligible: restrictions.length === 0, restrictions };
};
