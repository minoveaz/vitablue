export type ProductId = 'adeslas' | 'sanitas';

export interface RecommendationCriteria {
  profile: string | null;
  visaRequired: string | null;
  duration: string | null;
  ageRange: string | null;
  travelFrequency?: string | null;
  residencyType?: string | null;
  continents?: string[];
}

export interface Product {
  id: ProductId;
  name: string;
  providerName: string;
  providerLogo: string;
  price: string;
  pricePeriod: string;
  ctaText: string;
  ctaHref: string;
  externalUrl: string;
  canonicalUrl: string;
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  whyItFits: string;
  isRecommended?: boolean;
  disclaimers: string[];
  eligibility: {
    visaStudent: boolean;
    expatriate: boolean;
    nomad: boolean;
  };
  priceStatus: 'verified' | 'pending';
  coverageStatus: 'verified' | 'pending';
  source: string;
}

export interface Recommendation extends Product {
  isRecommended?: boolean;
  whyItFits: string;
}

export interface RecommendationDecision {
  productId: ProductId;
  eligible: boolean;
  score: number;
  reasons: string[];
  restrictions: string[];
  dataStatus: 'verified' | 'pending' | 'needs-review';
}
