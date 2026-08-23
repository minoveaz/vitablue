import React from 'react';

export interface MotionBrandTokens {
  brandName: string;
  logoUrl?: string;
  primaryColor: string;    // Ocean Teal / Main Brand Color
  accentColor: string;     // Amber Gold / CTA Color
  mintColor: string;       // Mint Green / Trust Color
  surfaceBg: string;       // Dark Surface Background (e.g. #001219)
  cardBg: string;          // Glassmorphism card bg (e.g. rgba(15, 23, 42, 0.85))
  textColor: string;       // Primary text color (e.g. #ffffff)
  mutedTextColor: string;  // Secondary text color (e.g. #94a3b8)
  fontDisplay?: string;    // e.g. Poppins
  fontSans?: string;       // e.g. Inter
}

export const defaultMotionBrandTokens: MotionBrandTokens = {
  brandName: 'VitaBlue',
  primaryColor: '#005F73',
  accentColor: '#EE9B00',
  mintColor: '#94D2BD',
  surfaceBg: '#001219',
  cardBg: 'rgba(15, 23, 42, 0.85)',
  textColor: '#ffffff',
  mutedTextColor: '#94a3b8',
  fontDisplay: 'sans-serif',
  fontSans: 'sans-serif',
};

export interface MotionAdvisorCardProps {
  name?: string;
  role?: string;
  badge?: string;
  message?: string;
  avatarUrl?: string;
  whatsAppText?: string;
  tokens?: Partial<MotionBrandTokens>;
  className?: string;
  style?: React.CSSProperties;
}

export interface MotionTrustBadgeProps {
  title?: string;
  subtitle?: string;
  highlight?: string;
  verifiedLabel?: string;
  tokens?: Partial<MotionBrandTokens>;
  className?: string;
  style?: React.CSSProperties;
}

export interface MotionProviderGridProps {
  title?: string;
  subtitle?: string;
  providers?: Array<{ name: string; tag?: string; highlight?: boolean }>;
  tokens?: Partial<MotionBrandTokens>;
  className?: string;
  style?: React.CSSProperties;
}

export interface MotionComparisonCardProps {
  title?: string;
  wrongOptionTitle?: string;
  wrongOptionDesc?: string;
  correctOptionTitle?: string;
  correctOptionDesc?: string;
  tokens?: Partial<MotionBrandTokens>;
  className?: string;
  style?: React.CSSProperties;
}

export interface MotionComponentMetadata {
  id: string;
  name: string;
  description: string;
  category: 'advisor' | 'trust' | 'provider' | 'comparison';
  thumbnailIcon: string;
  defaultProps: Record<string, unknown>;
}
