import type { VideoBrandAdapter } from '../engine/brandAdapter';
import { MotionAdvisorCard, MotionTrustBadge, MotionProviderGrid, MotionComparisonCard } from '../motion-kit';

export const vitablueBrandAdapter: VideoBrandAdapter = {
  brandTokens: {
    brandName: 'VitaBlue',
    primaryColor: '#005F73',
    accentColor: '#EE9B00',
    mintColor: '#94D2BD',
    surfaceBg: '#001219',
    cardBg: 'rgba(0, 18, 25, 0.85)',
    textColor: '#ffffff',
    mutedTextColor: '#94D2BD',
  },
  AdvisorCard: MotionAdvisorCard,
  TrustBadge: MotionTrustBadge,
  ProviderGrid: MotionProviderGrid,
  ComparisonCard: MotionComparisonCard,
};