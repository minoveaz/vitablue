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
  { id: 'shapes', name: '📐 Formas Tradicionales', iconName: 'Shapes' },
  { id: 'trust_stamps', name: '🛡️ Sellos Consulares', iconName: 'ShieldCheck' },
  { id: 'ctas', name: '💬 Botones & CTAs', iconName: 'MousePointerClick' },
  { id: 'surfaces', name: '🪟 Superficies Glass', iconName: 'Layers' },
];

export const ELEMENT_PRESETS: ElementPresetItem[] = [
  // 1. FORMAS GEOMÉTRICAS TRADICIONALES (EDICIÓN ESTILO FIGMA / CANVA)
  {
    id: 'shape-rounded-rect',
    category: 'shapes',
    title: 'Rectángulo Redondeado',
    description: 'Caja con esquinas suaves para contenedores y tarjetas',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'rounded_rect',
      fill: '#005F73',
      stroke: '#94D2BD',
      strokeWidth: 2,
      borderRadius: 24,
      width: 260,
      height: 160,
    },
    badge: 'Básico',
  },
  {
    id: 'shape-rectangle',
    category: 'shapes',
    title: 'Rectángulo / Cuadrado',
    description: 'Forma geométrica recta con esquinas vivas',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'rectangle',
      fill: '#001219',
      stroke: '#005F73',
      strokeWidth: 2,
      width: 240,
      height: 160,
    },
    badge: 'Básico',
  },
  {
    id: 'shape-circle',
    category: 'shapes',
    title: 'Círculo / Elipse',
    description: 'Círculo simétrico para avatares, sellos o fondos de iconos',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'circle',
      fill: '#EE9B00',
      stroke: '#FFFFFF',
      strokeWidth: 0,
      width: 180,
      height: 180,
    },
    badge: 'Básico',
  },
  {
    id: 'shape-star',
    category: 'shapes',
    title: 'Estrella de 5 Puntas',
    description: 'Estrella vectorial para valoraciones y elementos destacados',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'star',
      fill: '#EE9B00',
      stroke: '#FFFFFF',
      strokeWidth: 1,
      width: 180,
      height: 180,
    },
    badge: 'Destacado',
  },
  {
    id: 'shape-triangle',
    category: 'shapes',
    title: 'Triángulo',
    description: 'Triángulo equilátero para indicadores, punteros o diseño',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'triangle',
      fill: '#94D2BD',
      stroke: '#005F73',
      strokeWidth: 2,
      width: 180,
      height: 180,
    },
    badge: 'Básico',
  },
  {
    id: 'shape-diamond',
    category: 'shapes',
    title: 'Rombo / Diamante',
    description: 'Polígono de 4 vértices para badges y acentos visuales',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'diamond',
      fill: '#005F73',
      stroke: '#EE9B00',
      strokeWidth: 2,
      width: 180,
      height: 180,
    },
    badge: 'Geometría',
  },
  {
    id: 'shape-hexagon',
    category: 'shapes',
    title: 'Hexágono',
    description: 'Forma hexagonal moderna para sellos técnicos e insignias',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'hexagon',
      fill: '#001219',
      stroke: '#94D2BD',
      strokeWidth: 3,
      width: 180,
      height: 180,
    },
    badge: 'Geometría',
  },
  {
    id: 'shape-line',
    category: 'shapes',
    title: 'Línea Divisoria',
    description: 'Separador horizontal para dividir secciones visuales',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'line',
      fill: '#EE9B00',
      strokeWidth: 4,
      width: 400,
      height: 12,
    },
    badge: 'Separador',
  },
  {
    id: 'shape-arrow',
    category: 'shapes',
    title: 'Flecha Indicadora',
    description: 'Flecha direccional horizontal para guiar la atención y CTAs',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'arrow',
      fill: '#EE9B00',
      stroke: '#001219',
      strokeWidth: 1,
      width: 200,
      height: 100,
    },
    badge: 'Dirección',
  },
  {
    id: 'shape-speech-bubble',
    category: 'shapes',
    title: 'Bocadillo de Diálogo',
    description: 'Globo de mensaje de cómic / chat para testimonios y citas',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'speech_bubble',
      fill: '#005F73',
      stroke: '#94D2BD',
      strokeWidth: 2,
      width: 220,
      height: 180,
    },
    badge: 'Social',
  },
  {
    id: 'shape-heart',
    category: 'shapes',
    title: 'Corazón',
    description: 'Símbolo de salud, bienestar y confianza médica',
    blockType: 'GeometricShape',
    defaultProps: {
      shapeType: 'heart',
      fill: '#E63946',
      stroke: '#FFFFFF',
      strokeWidth: 1,
      width: 180,
      height: 180,
    },
    badge: 'Salud',
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
