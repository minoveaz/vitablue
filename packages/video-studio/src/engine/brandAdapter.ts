import type React from 'react';
import type {
  MotionAdvisorCardProps,
  MotionTrustBadgeProps,
  MotionProviderGridProps,
  MotionComparisonCardProps,
  MotionBrandTokens,
} from '../motion-kit/types';

export interface VideoBrandAdapter {
  brandTokens: MotionBrandTokens;
  AdvisorCard: React.ComponentType<MotionAdvisorCardProps>;
  TrustBadge: React.ComponentType<MotionTrustBadgeProps>;
  ProviderGrid: React.ComponentType<MotionProviderGridProps>;
  ComparisonCard: React.ComponentType<MotionComparisonCardProps>;
}