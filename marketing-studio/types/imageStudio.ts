import { MotionBrandTokens } from '../../packages/video-studio/src/motion-kit';

export interface ImageFormatPreset {
  id: string;
  name: string;
  category: 'instagram' | 'tiktok' | 'linkedin' | 'facebook' | 'twitter' | 'youtube' | 'web_marketing' | 'custom';
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  iconName: string;
  recommendedFor: string;
}

export const IMAGE_FORMAT_PRESETS: ImageFormatPreset[] = [
  // INSTAGRAM
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
    category: 'instagram',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Pantalla completa vertical para Reels e Stories',
    iconName: 'Smartphone',
    recommendedFor: 'Stories y Reels de Instagram',
  },

  // TIKTOK
  {
    id: 'tiktok-vertical',
    name: 'TikTok Full Screen (9:16)',
    category: 'tiktok',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Formato vertical inmersivo para TikTok y Shorts',
    iconName: 'Smartphone',
    recommendedFor: 'TikTok Ads y Organic Feed',
  },
  {
    id: 'tiktok-cover',
    name: 'TikTok Video Cover (1:1)',
    category: 'tiktok',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Miniatura y portada de perfil en TikTok',
    iconName: 'Square',
    recommendedFor: 'Portada de vídeos de TikTok',
  },

  // LINKEDIN
  {
    id: 'linkedin-post',
    name: 'Post Feed de LinkedIn',
    category: 'linkedin',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    description: 'Optimizado para el feed profesional de LinkedIn',
    iconName: 'Linkedin',
    recommendedFor: 'Contenido B2B y artículos profesionales',
  },
  {
    id: 'linkedin-square',
    name: 'LinkedIn Cuadrado (1:1)',
    category: 'linkedin',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Carruseles y posts visuales de alto engagement en LinkedIn',
    iconName: 'Square',
    recommendedFor: 'Carruseles en PDF y posts de infografía',
  },
  {
    id: 'linkedin-cover',
    name: 'Portada de Empresa LinkedIn',
    category: 'linkedin',
    width: 1128,
    height: 191,
    aspectRatio: '5.9:1',
    description: 'Banner corporativo de página de empresa en LinkedIn',
    iconName: 'Tv',
    recommendedFor: 'Página de empresa VitaBlue',
  },

  // FACEBOOK / META
  {
    id: 'facebook-post',
    name: 'Post de Facebook (1.91:1)',
    category: 'facebook',
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    description: 'Post horizontal para el feed de noticias de Facebook',
    iconName: 'Facebook',
    recommendedFor: 'Campañas de Meta Ads y feed de noticias',
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
    recommendedFor: 'Branding de página corporativa en Facebook',
  },

  // X (TWITTER)
  {
    id: 'twitter-header',
    name: 'Cabecera de X (Twitter)',
    category: 'twitter',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    description: 'Banner superior de perfil en X',
    iconName: 'Twitter',
    recommendedFor: 'Perfil oficial de marca en X',
  },
  {
    id: 'twitter-post',
    name: 'Post con Imagen en X',
    category: 'twitter',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    description: 'Publicación horizontal optimizada para la cronología de X',
    iconName: 'Twitter',
    recommendedFor: 'Hilos y anuncios en X',
  },

  // YOUTUBE
  {
    id: 'landscape-banner',
    name: 'Miniatura & YouTube (16:9)',
    category: 'youtube',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    description: 'Horizontal para YouTube, web y displays de Google',
    iconName: 'Tv',
    recommendedFor: 'Miniaturas de YouTube y cabeceras web',
  },
  {
    id: 'youtube-channel-art',
    name: 'Banner de Canal YouTube',
    category: 'youtube',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    description: 'Cabecera de canal para desktop, TV y móvil',
    iconName: 'Tv',
    recommendedFor: 'Canal oficial de YouTube',
  },

  // WEB & MARKETING (NO REDES SOCIALES)
  {
    id: 'web-hero',
    name: 'Hero Banner Web (16:9)',
    category: 'web_marketing',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    description: 'Cabecera principal para landing pages y sitios web',
    iconName: 'Monitor',
    recommendedFor: 'Landing pages de visados y seguros',
  },
  {
    id: 'web-display-square',
    name: 'Display Ad Cuadrado (300×250 / 600×600)',
    category: 'web_marketing',
    width: 600,
    height: 600,
    aspectRatio: '1:1',
    description: 'Banner Display para Google Ads y medios digitales',
    iconName: 'Square',
    recommendedFor: 'Campañas de Google Display Network',
  },
  {
    id: 'web-newsletter',
    name: 'Cabecera Newsletter / Email (2:1)',
    category: 'web_marketing',
    width: 600,
    height: 300,
    aspectRatio: '2:1',
    description: 'Encabezado para boletines y comunicaciones por correo',
    iconName: 'Mail',
    recommendedFor: 'Plantillas de email marketing',
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
  | 'CustomText'
  | 'CustomGroup';

export interface ImageLayer {
  id: string;
  type: 'block' | 'text' | 'image' | 'badge' | 'shape';
  blockType?: ImageBlockType;
  title: string;
  props: Record<string, unknown>;
  position: { x: number; y: number }; // Percentage (0-100) or canvas pixels
  zIndex: number;
  scale: number;
  width?: number; // Width in px
  height?: number; // Height in px
  rotation?: number; // Degrees (0-360)
  opacity?: number; // (0-1)
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number | number[];
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  shadowPreset?: 'none' | 'soft' | 'deep' | 'glow_teal' | 'glow_gold' | 'neon';
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  src?: string; // Image source URL
  filter?: 'none' | 'grayscale' | 'sepia' | 'contrast' | 'blur' | 'teal_tint' | 'gold_tint';
  brightness?: number; // 50 to 150
  contrast?: number; // 50 to 150
  blur?: number; // 0 to 20 px
  clipShape?: 'none' | 'circle' | 'squircle' | 'pill' | 'phone_mockup' | 'shield';
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
  carouselPages?: number;
  currentSlide?: number;
  createdAt: string;
  updatedAt: string;
}
