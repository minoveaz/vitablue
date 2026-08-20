import { ImageBlockType } from '../types/imageStudio';

export interface ElementPresetCategory {
  id: string;
  name: string;
  iconName: string;
}

export interface ElementPresetItem {
  id: string;
  category: 'shapes' | 'trust_stamps' | 'ctas' | 'surfaces';
  title: string;
  description: string;
  blockType: ImageBlockType;
  defaultProps: Record<string, unknown>;
  previewColor?: string;
  badge?: string;
}

export const ELEMENT_PRESET_CATEGORIES: ElementPresetCategory[] = [
  { id: 'all', name: '✨ Todos', iconName: 'Sparkles' },
  { id: 'shapes', name: '📐 Formas & Geometría', iconName: 'Shapes' },
  { id: 'trust_stamps', name: '🛡️ Sellos Consulares', iconName: 'ShieldCheck' },
  { id: 'ctas', name: '💬 Botones & CTAs', iconName: 'MousePointerClick' },
  { id: 'surfaces', name: '🪟 Superficies Glass', iconName: 'Layers' },
];

export const ELEMENT_PRESETS: ElementPresetItem[] = [
  // 1. FORMAS & GEOMETRÍA
  {
    id: 'elem-shield-icon',
    category: 'shapes',
    title: 'Escudo de Protección Consular',
    description: 'Icono vectorial de blindaje médico y visado',
    blockType: 'TrustShieldIcon',
    defaultProps: {
      primaryColor: '#005F73',
      accentColor: '#EE9B00',
    },
    badge: 'Icono Oficial',
  },
  {
    id: 'elem-rating-stars',
    category: 'shapes',
    title: '5 Estrellas Trustpilot / Google',
    description: 'Indicador de máxima calificación ⭐⭐⭐⭐⭐ (5.0)',
    blockType: 'TrustBadgeSubtitle',
    defaultProps: {
      text: '⭐⭐⭐⭐⭐ 5.0 · Más de 1.500 reseñas verificadas',
      color: '#EE9B00',
    },
    badge: 'Social Proof',
  },
  {
    id: 'elem-divider-line',
    category: 'shapes',
    title: 'Línea Separadora Gradiente',
    description: 'Divisor estético para estructurar secciones en el lienzo',
    blockType: 'GlassCardSurface',
    defaultProps: {
      width: 400,
      height: 4,
      variant: 'amber',
    },
    badge: 'Separador',
  },

  // 2. SELLOS CONSULARES & INSIGNIAS
  {
    id: 'elem-verified-extranjeria',
    category: 'trust_stamps',
    title: 'Verificado para Extranjería',
    description: 'Insignia con check esmeralda para certificar cumplimiento',
    blockType: 'TrustVerifiedPill',
    defaultProps: {
      verifiedLabel: 'VERIFICADO PARA EXTRANJERÍA',
    },
    badge: 'Consulado 100%',
  },
  {
    id: 'elem-garantia-consular',
    category: 'trust_stamps',
    title: 'Garantía Consular 100%',
    description: 'Píldora destacada de seguridad legal',
    blockType: 'TrustHighlightPill',
    defaultProps: {
      highlight: 'GARANTÍA CONSULAR 100%',
    },
    badge: 'Destacado',
  },
  {
    id: 'elem-live-advisor-badge',
    category: 'trust_stamps',
    title: 'Asesora Asignada en Directo',
    description: 'Badge con punto de estado verde en vivo parpadeante',
    blockType: 'HookAlertBadge',
    defaultProps: {
      badge: 'ASESORA ASIGNADA · EN DIRECTO',
    },
    badge: 'En Vivo',
  },
  {
    id: 'elem-sin-copagos-badge',
    category: 'trust_stamps',
    title: 'Badge Sin Copagos ni Carencias',
    description: 'Destaca la cobertura completa sin gastos ocultos',
    blockType: 'TrustVerifiedPill',
    defaultProps: {
      verifiedLabel: 'SIN COPAGOS · SIN CARENCIAS',
    },
    badge: 'Beneficio Clave',
  },
  {
    id: 'elem-reembolso-badge',
    category: 'trust_stamps',
    title: 'Garantía de Devolución Total',
    description: 'Reembolso del 100% si el visado no es aprobado',
    blockType: 'TrustHighlightPill',
    defaultProps: {
      highlight: 'DEVOLUCIÓN GARANTIZADA 100%',
    },
    badge: 'Seguridad',
  },

  // 3. BOTONES & LLAMADAS A LA ACCIÓN (CTAs)
  {
    id: 'elem-cta-whatsapp',
    category: 'ctas',
    title: 'Botón Oficial WhatsApp',
    description: 'Conecta al usuario con una asesora por chat directo',
    blockType: 'WhatsAppCtaButton',
    defaultProps: {
      ctaText: '💬 Chatear con Asesora por WhatsApp',
      phoneNumber: '+34600000000',
      primaryColor: '#005F73',
      accentColor: '#EE9B00',
      textColor: '#FFFFFF',
    },
    badge: 'Alta Conversión',
  },
  {
    id: 'elem-cta-quote',
    category: 'ctas',
    title: 'Botón Cotizar Seguro en 1 Minuto',
    description: 'Llamada a la acción para cotización online',
    blockType: 'WhatsAppCtaButton',
    defaultProps: {
      ctaText: '👉 Cotizar Mi Seguro en 1 Minuto',
      phoneNumber: '+34600000000',
      primaryColor: '#EE9B00',
      accentColor: '#005F73',
      textColor: '#001219',
    },
    badge: 'Cotizador',
  },
  {
    id: 'elem-cta-call',
    category: 'ctas',
    title: 'Botón Solicitar Llamada Gratuita',
    description: 'Ideal para personas que prefieren atención telefónica',
    blockType: 'WhatsAppCtaButton',
    defaultProps: {
      ctaText: '⚡ Solicitar Llamada Gratuita',
      phoneNumber: '+34600000000',
      primaryColor: '#005F73',
      accentColor: '#94D2BD',
      textColor: '#FFFFFF',
    },
    badge: 'Asesoría',
  },

  // 4. SUPERFICIES GLASS & CONTENEDORES
  {
    id: 'elem-glass-teal',
    category: 'surfaces',
    title: 'Tarjeta Glass Teal (Oscura)',
    description: 'Superficie translúcida con aura turquesa y backdrop blur',
    blockType: 'GlassCardSurface',
    defaultProps: {
      width: 420,
      height: 240,
      variant: 'teal',
    },
    badge: 'Mesh Dark',
  },
  {
    id: 'elem-glass-amber',
    category: 'surfaces',
    title: 'Tarjeta Glass Oro (Ámbar)',
    description: 'Superficie translúcida con borde dorado brillante',
    blockType: 'GlassCardSurface',
    defaultProps: {
      width: 420,
      height: 240,
      variant: 'amber',
    },
    badge: 'Gold Trust',
  },
];
