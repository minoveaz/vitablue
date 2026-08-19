import { MotionBrandTokens } from '../../packages/video-studio/src/motion-kit';

export interface ImageFormatPreset {
  id: string;
  name: string;
  category: 'instagram' | 'stories' | 'facebook' | 'linkedin' | 'twitter' | 'youtube' | 'custom';
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  iconName: string;
  recommendedFor: string;
}

export const IMAGE_FORMAT_PRESETS: ImageFormatPreset[] = [
  {
    id: 'instagram-portrait',
    name: 'Post de Instagram (4:5)',
    category: 'instagram',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    description: 'Máxima retención visual en el feed de Instagram',
    iconName: 'Instagram',
    recommendedFor: 'Anuncios y posts de alto impacto',
  },
  {
    id: 'instagram-square',
    name: 'Post Cuadrado (1:1)',
    category: 'instagram',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Estándar para Instagram, Facebook y LinkedIn',
    iconName: 'Square',
    recommendedFor: 'Feed tradicional y carruseles',
  },
  {
    id: 'story-vertical',
    name: 'Historia & Reel (9:16)',
    category: 'stories',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Pantalla completa vertical para TikTok, Reels y Stories',
    iconName: 'Smartphone',
    recommendedFor: 'Stories, TikTok y overlays de vídeo',
  },
  {
    id: 'landscape-banner',
    name: 'Banner & YouTube (16:9)',
    category: 'youtube',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    description: 'Horizontal para YouTube, web y displays de Google',
    iconName: 'Tv',
    recommendedFor: 'Miniaturas y cabeceras web',
  },
  {
    id: 'facebook-cover',
    name: 'Portada de Facebook',
    category: 'facebook',
    width: 820,
    height: 312,
    aspectRatio: '820:312',
    description: 'Cabecera oficial para páginas de Facebook',
    iconName: 'Facebook',
    recommendedFor: 'Branding de página corporativa',
  },
  {
    id: 'linkedin-post',
    name: 'Post para LinkedIn',
    category: 'linkedin',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    description: 'Optimizado para el feed profesional de LinkedIn',
    iconName: 'Linkedin',
    recommendedFor: 'Contenido B2B y artículos',
  },
  {
    id: 'twitter-header',
    name: 'Cabecera de X (Twitter)',
    category: 'twitter',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    description: 'Banner superior de perfil en X',
    iconName: 'Twitter',
    recommendedFor: 'Perfil de marca en X',
  },
];

export type ImageBlockType =
  | 'MotionAdvisorCard'
  | 'MotionTrustBadge'
  | 'MotionProviderGrid'
  | 'MotionComparisonCard'
  | 'GlassCardSurface'
  | 'HookAlertBadge'
  | 'AdvisorAvatarBadge'
  | 'AdvisorQuoteBox'
  | 'WhatsAppCtaButton'
  | 'ProviderGridHeader'
  | 'ProviderBadge'
  | 'TrustShieldIcon'
  | 'TrustBadgeTitle'
  | 'TrustBadgeSubtitle'
  | 'ComparisonHeader'
  | 'ComparisonWrongBox'
  | 'ComparisonCorrectBox'
  | 'CustomText';

export interface ImageLayer {
  id: string;
  type: 'block' | 'text' | 'image' | 'badge';
  blockType?: ImageBlockType;
  title: string;
  props: Record<string, unknown>;
  position: { x: number; y: number }; // Percentage (0-100)
  zIndex: number;
  scale: number;
  width?: number; // Width in px or relative
  rotation?: number;
  opacity?: number;
  locked?: boolean;
  visible?: boolean;
}

export interface CanvasBackground {
  type: 'solid' | 'gradient' | 'image' | 'mesh';
  color?: string;
  gradient?: string;
  imageUrl?: string;
  overlayOpacity?: number;
}

export interface ImageProject {
  id: string;
  title: string;
  preset: ImageFormatPreset;
  background: CanvasBackground;
  layers: ImageLayer[];
  brandTokens: MotionBrandTokens;
  createdAt: string;
  updatedAt: string;
}
