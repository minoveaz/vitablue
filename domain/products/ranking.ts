import type { Recommendation } from './types';

export interface RankedRecommendation {
  product: Recommendation;
  score: number;
}

/** Ranking only: it does not decide eligibility or render UI copy. */
export const rankRecommendations = (products: Recommendation[]): RankedRecommendation[] =>
  products
    .map((product, index) => ({
      product,
      score: product.isRecommended ? 100 : Math.max(0, 90 - index * 10),
    }))
    .sort((a, b) => b.score - a.score);
