export const getBlockDefaultWidth = (blockType?: string, customWidth?: number, blockProps?: Record<string, unknown>): string => {
  if (customWidth) return `${customWidth}px`;
  switch (blockType) {
    case 'CustomGroup':
      return blockProps?.width ? `${Number(blockProps.width)}px` : '420px';
    case 'MarketingBlockPart':
      return blockProps?.width ? `${Number(blockProps.width)}px` : 'auto';
    case 'MotionAdvisorCard':
      return '380px';
    case 'GlassCardSurface':
      return blockProps?.width ? `${blockProps.width}px` : '420px';
    case 'GeometricShape':
      return blockProps?.width ? `${blockProps.width}px` : '180px';
    case 'WebIllustration':
      return blockProps?.width ? `${blockProps.width}px` : '280px';
    case 'MotionTrustBadge':
      return '420px';
    case 'MotionComparisonCard':
    case 'MotionProviderGrid':
      return '420px';
    case 'MarketingBrandHero':
    case 'MarketingFeatureGrid':
    case 'InsuranceProductHero':
    case 'InsuranceCoverageGrid':
    case 'InsuranceTestimonialGrid':
    case 'InsurancePlanComparison':
    case 'InsuranceTrustBar':
    case 'InsuranceProviderBar':
    case 'InsuranceTransparency':
    case 'InsuranceFaq':
    case 'InsuranceAdvisorCta':
      return '760px';
    case 'MarketingSectionIntro':
      return '620px';
    case 'MarketingPromoCard':
    case 'InsuranceProductCard':
    case 'MarketingTestimonial':
      return '420px';
    case 'HookAlertBadge':
    case 'TrustHighlightPill':
    case 'TrustVerifiedPill':
      return 'auto';
    case 'AdvisorAvatarBadge':
      return '340px';
    case 'AdvisorQuoteBox':
      return '340px';
    case 'WhatsAppCtaButton':
      return '340px';
    case 'ProviderGridHeader':
      return '380px';
    case 'ProviderBadge':
      return '185px';
    case 'TrustShieldIcon':
      return 'auto';
    case 'TrustBadgeTitle':
      return '380px';
    case 'TrustBadgeSubtitle':
      return '380px';
    case 'ComparisonHeader':
      return '380px';
    case 'ComparisonWrongBox':
    case 'ComparisonCorrectBox':
      return '380px';
    case 'CustomText':
      return blockProps?.tag === 'badge' ? 'auto' : '420px';
    default:
      return '420px';
  }
};
