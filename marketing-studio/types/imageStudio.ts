import { MotionBrandTokens } from '../../packages/video-studio/src/motion-kit';

export interface ImageFormatPreset {
  id: string;
  name: string;
  category: 'instagram' | 'tiktok' | 'linkedin' | 'facebook' | 'twitter' | 'youtube' | 'email_marketing' | 'documents' | 'sheets' | 'web_marketing' | 'custom';
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  iconName: string;
  recommendedFor: string;
}

export const IMAGE_FORMAT_PRESETS: ImageFormatPreset[] = [
  // 1. REDES SOCIALES & ADS
  {
    id: 'instagram-portrait',
    name: 'Post de Instagram (4:5)',
    category: 'instagram',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    description: 'Máxima retención visual en el feed de Instagram y Meta Ads',
    iconName: 'Instagram',
    recommendedFor: 'Anuncios y publicaciones principales',
  },
  {
    id: 'story-vertical',
    name: 'Historia & Reel (9:16)',
    category: 'instagram',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    description: 'Pantalla completa vertical inmersiva para Stories, Reels y TikTok',
    iconName: 'Smartphone',
    recommendedFor: 'Stories, Reels de Instagram y TikTok Ads',
  },
  {
    id: 'instagram-square',
    name: 'Post Cuadrado (1:1)',
    category: 'instagram',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    description: 'Formato clásico para Instagram, Facebook y carruseles',
    iconName: 'Square',
    recommendedFor: 'Feed tradicional y carruseles de producto',
  },
  {
    id: 'linkedin-post',
    name: 'Post Feed de LinkedIn',
    category: 'linkedin',
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    description: 'Optimizado para publicaciones profesionales B2B en LinkedIn',
    iconName: 'Linkedin',
    recommendedFor: 'Contenido corporativo y artículos',
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
  {
    id: 'facebook-cover',
    name: 'Portada de Facebook',
    category: 'facebook',
    width: 820,
    height: 312,
    aspectRatio: '820:312',
    description: 'Cabecera oficial para páginas corporativas de Facebook',
    iconName: 'Facebook',
    recommendedFor: 'Branding de página corporativa en Facebook',
  },
  {
    id: 'twitter-header',
    name: 'Cabecera de X (Twitter)',
    category: 'twitter',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    description: 'Banner superior de perfil oficial en X',
    iconName: 'Twitter',
    recommendedFor: 'Perfil oficial de marca en X',
  },
  {
    id: 'landscape-banner',
    name: 'Banner Horizontal (16:9)',
    category: 'youtube',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    description: 'Horizontal para YouTube, pantallas y displays de Google',
    iconName: 'Tv',
    recommendedFor: 'Miniaturas de YouTube y presentaciones',
  },

  // 2. EMAIL MARKETING & NEWSLETTERS
  {
    id: 'email-header-newsletter',
    name: 'Cabecera de Newsletter (Email)',
    category: 'email_marketing',
    width: 600,
    height: 250,
    aspectRatio: '2.4:1',
    description: 'Cabecera principal de boletines en Mailchimp, Brevo y HubSpot',
    iconName: 'Mail',
    recommendedFor: 'Header corporativo de emails y newsletters',
  },
  {
    id: 'email-promo-banner',
    name: 'Banner Promocional Email',
    category: 'email_marketing',
    width: 600,
    height: 400,
    aspectRatio: '3:2',
    description: 'Cuerpo promocional para campañas de descuentos y lanzamientos',
    iconName: 'Mail',
    recommendedFor: 'Bloques de oferta en plantillas HTML de email',
  },
  {
    id: 'email-signature-banner',
    name: 'Firma de Correo Corporativa',
    category: 'email_marketing',
    width: 600,
    height: 150,
    aspectRatio: '4:1',
    description: 'Pie de firma profesional para el equipo de asesores',
    iconName: 'Mail',
    recommendedFor: 'Firmas de Gmail, Outlook y HubSpot',
  },
  {
    id: 'email-product-card',
    name: 'Tarjeta de Seguro en Email',
    category: 'email_marketing',
    width: 600,
    height: 300,
    aspectRatio: '2:1',
    description: 'Módulo de producto o comparativa para emails transaccionales',
    iconName: 'Mail',
    recommendedFor: 'Confirmaciones de póliza y cotizaciones por correo',
  },

  // 3. DOCUMENTOS & EDITORIAL (WORD / PDF / DOSSIERS)
  {
    id: 'doc-a4-cover',
    name: 'Portada Dossier A4 (Word / PDF)',
    category: 'documents',
    width: 1240,
    height: 1754,
    aspectRatio: '1:1.41',
    description: 'Portada oficial tamaño A4 para guías y dossiers consulares',
    iconName: 'FileText',
    recommendedFor: 'Guías en PDF de visados y propuestas comerciales',
  },
  {
    id: 'doc-header-banner',
    name: 'Cabecera de Documento Word',
    category: 'documents',
    width: 1200,
    height: 350,
    aspectRatio: '3.4:1',
    description: 'Encabezado visual de página para informes y cartas oficiales',
    iconName: 'FileText',
    recommendedFor: 'Membretes y cartas oficiales de extranjería',
  },
  {
    id: 'doc-infographic-banner',
    name: 'Gráfico Explicativo Documento',
    category: 'documents',
    width: 1200,
    height: 600,
    aspectRatio: '2:1',
    description: 'Módulo gráfico para incrustar dentro de PDFs y manuales',
    iconName: 'FileText',
    recommendedFor: 'Flujos de visado y tablas comparativas en documentos',
  },

  // 4. HOJAS DE CÁLCULO & DASHBOARDS (SHEETS / EXCEL)
  {
    id: 'sheet-dashboard-header',
    name: 'Cabecera de Dashboard (Sheets/Excel)',
    category: 'sheets',
    width: 1400,
    height: 200,
    aspectRatio: '7:1',
    description: 'Banner superior para organizar hojas de cálculo compartidas con clientes',
    iconName: 'Table',
    recommendedFor: 'Google Sheets de seguimiento y dashboards de clientes',
  },
  {
    id: 'sheet-kpi-card',
    name: 'Tarjeta de Métricas / KPI Sheet',
    category: 'sheets',
    width: 800,
    height: 400,
    aspectRatio: '2:1',
    description: 'Gráfico resumen para embeber en reportes financieros y de ventas',
    iconName: 'Table',
    recommendedFor: 'Resúmenes de primas y comisiones en hojas de cálculo',
  },

  // 5. WEB & BLOG
  {
    id: 'web-featured-blog',
    name: 'Imagen Destacada Blog (16:9)',
    category: 'web_marketing',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    description: 'Cabecera de artículos de blog optimizada para SEO y OpenGraph',
    iconName: 'Monitor',
    recommendedFor: 'Artículos de blog y entradas de visados',
  },
  {
    id: 'web-hero',
    name: 'Hero Banner Web (16:9)',
    category: 'web_marketing',
    width: 1920,
    height: 700,
    aspectRatio: '2.74:1',
    description: 'Cabecera principal panorámica para landing pages de conversión',
    iconName: 'Monitor',
    recommendedFor: 'Landing pages de visados y seguros',
  },
  {
    id: 'web-modal-popup',
    name: 'Modal Popup Web (4:3)',
    category: 'web_marketing',
    width: 800,
    height: 600,
    aspectRatio: '4:3',
    description: 'Banner de ventana emergente para captación de leads en web',
    iconName: 'Monitor',
    recommendedFor: 'Popups de asesoría gratuita y descuentos',
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
  | 'TrustHighlightPill'
  | 'TrustBadgeTitle'
  | 'TrustBadgeSubtitle'
  | 'TrustVerifiedPill'
  | 'ComparisonHeader'
  | 'ComparisonWrongBox'
  | 'ComparisonCorrectBox'
  | 'GeometricShape'
  | 'WebIllustration'
  | 'BrandLogo'
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
  textEffect?: 'none' | 'box' | 'stroke' | 'glow';
  boxColor?: string;
  boxPadding?: number;
  boxBorderRadius?: number;
  src?: string; // Image source URL
  filter?: 'none' | 'grayscale' | 'sepia' | 'contrast' | 'blur' | 'teal_tint' | 'gold_tint';
  brightness?: number; // 50 to 150
  contrast?: number; // 50 to 150
  blur?: number; // 0 to 20 px
  clipShape?: 'none' | 'circle' | 'squircle' | 'pill' | 'phone_mockup' | 'shield' | 'hexagon' | 'rounded-2xl';
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
