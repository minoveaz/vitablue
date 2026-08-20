import { ImageLayer, ImageProject, CanvasBackground, IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';

export type SmartCanvasObjective =
  | 'visa_student'
  | 'medical_no_copay'
  | 'whatsapp_advisor'
  | 'comparison_approved'
  | 'newsletter_header'
  | 'promo_discount';

export interface SmartComposerOptions {
  objective: SmartCanvasObjective;
  theme: 'light' | 'dark';
  presetId?: string;
}

export interface SmartObjectiveMeta {
  id: SmartCanvasObjective;
  name: string;
  badge: string;
  icon: string;
  description: string;
  recommendedPreset: string;
}

export const SMART_OBJECTIVES: SmartObjectiveMeta[] = [
  {
    id: 'visa_student',
    name: 'Visado de Estudiante & Nómada',
    badge: '🎓 ESTUDIANTES & NÓMADAS',
    icon: 'GraduationCap',
    description: 'Evita denegaciones de visado consular con seguro 100% homologado.',
    recommendedPreset: 'instagram-portrait',
  },
  {
    id: 'medical_no_copay',
    name: 'Seguro Médico Sin Copagos',
    badge: '🩺 100% REQUISITOS CONSULARES',
    icon: 'ShieldCheck',
    description: 'Cobertura médica ilimitada sin carencias para trámites de extranjería.',
    recommendedPreset: 'instagram-portrait',
  },
  {
    id: 'whatsapp_advisor',
    name: 'Atención Directa por WhatsApp',
    badge: '💬 ASESORÍA PERSONALIZADA',
    icon: 'MessageCircle',
    description: 'Conecta a los clientes directamente con una asesora real en tiempo récord.',
    recommendedPreset: 'story-vertical',
  },
  {
    id: 'comparison_approved',
    name: 'Comparativa Aprobado vs Denegado',
    badge: '⚖️ TABLA COMPARATIVA',
    icon: 'SplitSquareVertical',
    description: 'Demuestra las diferencias clave entre un seguro genérico y uno válido para visado.',
    recommendedPreset: 'instagram-portrait',
  },
  {
    id: 'newsletter_header',
    name: 'Cabecera de Newsletter / Email',
    badge: '📩 EMAIL MARKETING',
    icon: 'Mail',
    description: 'Banner horizontal de alto impacto para boletines informativos y bienvenida.',
    recommendedPreset: 'email-header-newsletter',
  },
  {
    id: 'promo_discount',
    name: 'Oferta Especial & Descuento',
    badge: '🔥 PROMOCIÓN EXCLUSIVA',
    icon: 'Sparkles',
    description: 'Atrae conversiones inmediatas con descuentos por pago anual.',
    recommendedPreset: 'instagram-portrait',
  },
];

export const generateSmartCanvasProject = (options: SmartComposerOptions): ImageProject => {
  const { objective, theme } = options;
  const targetPresetId = options.presetId ?? SMART_OBJECTIVES.find((o) => o.id === objective)?.recommendedPreset ?? 'instagram-portrait';
  const preset = IMAGE_FORMAT_PRESETS.find((p) => p.id === targetPresetId) ?? IMAGE_FORMAT_PRESETS[0];

  const w = preset.width;
  const h = preset.height;
  const isLight = theme === 'light';

  // Fondos según el tema
  const background: CanvasBackground = isLight
    ? objective === 'whatsapp_advisor' || objective === 'promo_discount'
      ? {
          type: 'mesh',
          color: '#FFFBF2',
          gradient: 'radial-gradient(circle at 50% 20%, rgba(238, 155, 0, 0.22) 0%, rgba(255, 251, 242, 0.95) 55%, #FFFFFF 100%)',
        }
      : objective === 'medical_no_copay'
      ? {
          type: 'mesh',
          color: '#F0FDF4',
          gradient: 'radial-gradient(circle at 50% 15%, rgba(148, 210, 189, 0.35) 0%, #F0FDF4 50%, #FFFFFF 100%)',
        }
      : {
          type: 'mesh',
          color: '#F0F9FA',
          gradient: 'radial-gradient(circle at 50% 15%, rgba(148, 210, 189, 0.45) 0%, rgba(240, 249, 250, 0.95) 55%, #FFFFFF 100%)',
        }
    : objective === 'whatsapp_advisor' || objective === 'promo_discount'
    ? {
        type: 'mesh',
        color: '#EE9B00',
        gradient: 'radial-gradient(circle at 50% 25%, rgba(238, 155, 0, 0.45) 0%, #001219 80%)',
      }
    : objective === 'medical_no_copay'
    ? {
        type: 'mesh',
        color: '#94D2BD',
        gradient: 'radial-gradient(circle at 50% 25%, rgba(148, 210, 189, 0.45) 0%, #001219 80%)',
      }
    : {
        type: 'mesh',
        color: '#005F73',
        gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 95, 115, 0.75) 0%, #001219 80%)',
      };

  const primaryTextColor = isLight ? '#001219' : '#FFFFFF';
  const secondaryTextColor = isLight ? '#4A5568' : '#94D2BD';
  const scale = w / 1080;

  const now = Date.now();
  let layers: ImageLayer[] = [];

  switch (objective) {
    case 'visa_student': {
      layers = [
        // 1. Badge superior
        {
          id: `badge-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Badge Categoría',
          props: { text: '🎓 GUÍA OFICIAL ESTUDIANTES & NÓMADAS', tag: 'badge' },
          position: { x: Math.round(w * 0.5 - 200 * scale), y: Math.round(h * 0.08) },
          zIndex: 10,
          scale: 1,
          width: Math.round(400 * scale),
          fontSize: Math.round(15 * scale),
          fontWeight: '800',
          fontFamily: 'Inter, sans-serif',
          fill: '#005F73',
          align: 'center',
          textEffect: 'box',
          boxColor: isLight ? '#E0F2FE' : '#94D2BD',
          boxPadding: 8,
          boxBorderRadius: 20,
        },
        // 2. Titular Principal Gancho
        {
          id: `h1-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Titular de Alto Impacto',
          props: { text: '¿Te mudas a España? 🇪🇸 Evita denegaciones de visado', tag: 'h1' },
          position: { x: Math.round(w * 0.5 - 450 * scale), y: Math.round(h * 0.17) },
          zIndex: 20,
          scale: 1,
          width: Math.round(900 * scale),
          fontSize: Math.round(42 * scale),
          fontWeight: '900',
          fontFamily: 'Poppins, sans-serif',
          fill: primaryTextColor,
          align: 'center',
          lineHeight: 1.15,
          letterSpacing: -0.5,
        },
        // 3. Subtítulo / Gancho legal
        {
          id: `lead-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Subtítulo Requisito Legal',
          props: { text: 'Póliza médica homologada: Sin copagos, sin carencias y con repatriación ilimitada.', tag: 'p' },
          position: { x: Math.round(w * 0.5 - 400 * scale), y: Math.round(h * 0.32) },
          zIndex: 30,
          scale: 1,
          width: Math.round(800 * scale),
          fontSize: Math.round(20 * scale),
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
          fill: secondaryTextColor,
          align: 'center',
        },
        // 4. Tarjeta Asesora de Confianza
        {
          id: `card-${now}`,
          type: 'block',
          blockType: 'MotionAdvisorCard',
          title: 'Tarjeta Asesora Sofía',
          props: {
            advisorName: 'Sofía Martínez',
            advisorRole: 'Especialista en Visados de Estudiante',
            quote: '“Tramitamos tu certificado de cobertura consular en menos de 2 horas”',
            rating: 5,
            reviewsCount: 1420,
            avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 380 * scale), y: Math.round(h * 0.44) },
          zIndex: 40,
          scale: Math.max(0.7, Math.min(scale, 1.1)),
          width: Math.round(760 * scale),
        },
        // 5. Botón CTA WhatsApp
        {
          id: `cta-${now}`,
          type: 'block',
          blockType: 'WhatsAppCtaButton',
          title: 'Botón WhatsApp Directo',
          props: {
            ctaText: '💬 Chatear con Asesora por WhatsApp',
            phoneNumber: '+34600000000',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 280 * scale), y: Math.round(h * 0.82) },
          zIndex: 50,
          scale: Math.max(0.75, Math.min(scale, 1.15)),
          width: Math.round(560 * scale),
        },
      ];
      break;
    }

    case 'medical_no_copay': {
      layers = [
        {
          id: `badge-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Badge Consular',
          props: { text: '🩺 REQUISITO CONSULAR OFICIAL 100% CUMPLIDO', tag: 'badge' },
          position: { x: Math.round(w * 0.5 - 220 * scale), y: Math.round(h * 0.08) },
          zIndex: 10,
          scale: 1,
          width: Math.round(440 * scale),
          fontSize: Math.round(14 * scale),
          fontWeight: '800',
          fontFamily: 'Inter, sans-serif',
          fill: '#005F73',
          align: 'center',
          textEffect: 'box',
          boxColor: '#94D2BD',
          boxPadding: 8,
          boxBorderRadius: 20,
        },
        {
          id: `h1-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Titular Sin Copagos',
          props: { text: 'Seguro Médico de Extranjería: Cobertura Completa Sin Copagos', tag: 'h1' },
          position: { x: Math.round(w * 0.5 - 450 * scale), y: Math.round(h * 0.17) },
          zIndex: 20,
          scale: 1,
          width: Math.round(900 * scale),
          fontSize: Math.round(40 * scale),
          fontWeight: '900',
          fontFamily: 'Poppins, sans-serif',
          fill: primaryTextColor,
          align: 'center',
          lineHeight: 1.15,
        },
        {
          id: `trust-${now}`,
          type: 'block',
          blockType: 'MotionTrustBadge',
          title: 'Insignia de Seguridad Legal',
          props: {
            title: '100% Aceptado por Consulados y Extranjería',
            subtitle: 'Reembolso total garantizado en caso de denegación de visado',
            highlightText: 'Garantía VitaBlue',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 380 * scale), y: Math.round(h * 0.38) },
          zIndex: 30,
          scale: Math.max(0.75, Math.min(scale, 1.1)),
          width: Math.round(760 * scale),
        },
        {
          id: `providers-${now}`,
          type: 'block',
          blockType: 'MotionProviderGrid',
          title: 'Aseguradoras Homologadas',
          props: {
            headerText: 'Comparamos las mejores aseguradoras de España:',
            providers: [
              { name: 'Sanitas', logo: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=128&auto=format&fit=crop', verified: true },
              { name: 'Adeslas', logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=128&auto=format&fit=crop', verified: true },
              { name: 'Asisa', logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=128&auto=format&fit=crop', verified: true },
            ],
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 380 * scale), y: Math.round(h * 0.58) },
          zIndex: 40,
          scale: Math.max(0.7, Math.min(scale, 1.05)),
          width: Math.round(760 * scale),
        },
        {
          id: `cta-${now}`,
          type: 'block',
          blockType: 'WhatsAppCtaButton',
          title: 'Botón CTA',
          props: {
            ctaText: '👉 Cotizar Mi Seguro en 1 Minuto',
            phoneNumber: '+34600000000',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 270 * scale), y: Math.round(h * 0.84) },
          zIndex: 50,
          scale: Math.max(0.75, Math.min(scale, 1.15)),
          width: Math.round(540 * scale),
        },
      ];
      break;
    }

    case 'whatsapp_advisor': {
      layers = [
        {
          id: `badge-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Badge WhatsApp',
          props: { text: '⚡ ASESORÍA GRATUITA EN ESPAÑOL & INGLÉS', tag: 'badge' },
          position: { x: Math.round(w * 0.5 - 200 * scale), y: Math.round(h * 0.08) },
          zIndex: 10,
          scale: 1,
          width: Math.round(400 * scale),
          fontSize: Math.round(14 * scale),
          fontWeight: '800',
          fontFamily: 'Inter, sans-serif',
          fill: '#001219',
          align: 'center',
          textEffect: 'box',
          boxColor: '#EE9B00',
          boxPadding: 8,
          boxBorderRadius: 20,
        },
        {
          id: `h1-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Titular Humano',
          props: { text: '¿Dudas con tu visado? Habla con una asesora real ahora mismo', tag: 'h1' },
          position: { x: Math.round(w * 0.5 - 450 * scale), y: Math.round(h * 0.17) },
          zIndex: 20,
          scale: 1,
          width: Math.round(900 * scale),
          fontSize: Math.round(42 * scale),
          fontWeight: '900',
          fontFamily: 'Poppins, sans-serif',
          fill: primaryTextColor,
          align: 'center',
          lineHeight: 1.15,
        },
        {
          id: `card-${now}`,
          type: 'block',
          blockType: 'MotionAdvisorCard',
          title: 'Tarjeta Asesora Elena',
          props: {
            advisorName: 'Elena Gómez',
            advisorRole: 'Asesora Senior de Extranjería',
            quote: '“Te ayudo paso a paso a elegir la póliza que aprueba tu consulado sin pagar de más”',
            rating: 5,
            reviewsCount: 2310,
            avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 380 * scale), y: Math.round(h * 0.38) },
          zIndex: 40,
          scale: Math.max(0.75, Math.min(scale, 1.15)),
          width: Math.round(760 * scale),
        },
        {
          id: `cta-${now}`,
          type: 'block',
          blockType: 'WhatsAppCtaButton',
          title: 'Botón WhatsApp',
          props: {
            ctaText: '💬 Iniciar Chat por WhatsApp',
            phoneNumber: '+34600000000',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 280 * scale), y: Math.round(h * 0.82) },
          zIndex: 50,
          scale: Math.max(0.8, Math.min(scale, 1.2)),
          width: Math.round(560 * scale),
        },
      ];
      break;
    }

    case 'comparison_approved': {
      layers = [
        {
          id: `badge-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Badge Comparativa',
          props: { text: '⚖️ REQUISITOS CONSULARES EN ESPAÑA', tag: 'badge' },
          position: { x: Math.round(w * 0.5 - 190 * scale), y: Math.round(h * 0.08) },
          zIndex: 10,
          scale: 1,
          width: Math.round(380 * scale),
          fontSize: Math.round(14 * scale),
          fontWeight: '800',
          fontFamily: 'Inter, sans-serif',
          fill: '#005F73',
          align: 'center',
          textEffect: 'box',
          boxColor: '#94D2BD',
          boxPadding: 8,
          boxBorderRadius: 20,
        },
        {
          id: `h1-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Titular Comparativa',
          props: { text: '¿Tu seguro cumple con Extranjería?', tag: 'h1' },
          position: { x: Math.round(w * 0.5 - 450 * scale), y: Math.round(h * 0.16) },
          zIndex: 20,
          scale: 1,
          width: Math.round(900 * scale),
          fontSize: Math.round(44 * scale),
          fontWeight: '900',
          fontFamily: 'Poppins, sans-serif',
          fill: primaryTextColor,
          align: 'center',
        },
        {
          id: `comparison-${now}`,
          type: 'block',
          blockType: 'MotionComparisonCard',
          title: 'Tabla Comparativa',
          props: {
            headerTitle: 'Compara antes de solicitar tu visado:',
            wrongTitle: 'Seguro Genérico de Viaje',
            wrongReason: 'Denegación consular por copagos o límites',
            wrongIcon: 'AlertTriangle',
            correctTitle: 'Seguro Homologado VitaBlue',
            correctReason: '100% válido para Extranjería sin copagos',
            correctIcon: 'ShieldCheck',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 380 * scale), y: Math.round(h * 0.32) },
          zIndex: 30,
          scale: Math.max(0.75, Math.min(scale, 1.1)),
          width: Math.round(760 * scale),
        },
        {
          id: `cta-${now}`,
          type: 'block',
          blockType: 'WhatsAppCtaButton',
          title: 'Botón CTA',
          props: {
            ctaText: '👉 Comprobar Mi Seguro Gratis',
            phoneNumber: '+34600000000',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 270 * scale), y: Math.round(h * 0.84) },
          zIndex: 50,
          scale: Math.max(0.75, Math.min(scale, 1.15)),
          width: Math.round(540 * scale),
        },
      ];
      break;
    }

    case 'newsletter_header': {
      layers = [
        {
          id: `badge-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Badge Newsletter',
          props: { text: '📩 BOLETÍN INFORMATIVO VITABLUE', tag: 'badge' },
          position: { x: Math.round(w * 0.08), y: Math.round(h * 0.15) },
          zIndex: 10,
          scale: 1,
          width: Math.round(280 * scale),
          fontSize: Math.round(12 * scale),
          fontWeight: '800',
          fontFamily: 'Inter, sans-serif',
          fill: '#005F73',
          align: 'left',
          textEffect: 'box',
          boxColor: '#94D2BD',
          boxPadding: 6,
          boxBorderRadius: 14,
        },
        {
          id: `h1-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Titular Newsletter',
          props: { text: 'Novedades sobre Visados y Normativas 2026', tag: 'h1' },
          position: { x: Math.round(w * 0.08), y: Math.round(h * 0.38) },
          zIndex: 20,
          scale: 1,
          width: Math.round(w * 0.84),
          fontSize: Math.round(26 * scale),
          fontWeight: '900',
          fontFamily: 'Poppins, sans-serif',
          fill: primaryTextColor,
          align: 'left',
          lineHeight: 1.2,
        },
        {
          id: `lead-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Subtítulo Newsletter',
          props: { text: 'Consejos de expertos de extranjería para asegurar tu estancia en España sin imprevistos.', tag: 'p' },
          position: { x: Math.round(w * 0.08), y: Math.round(h * 0.7) },
          zIndex: 30,
          scale: 1,
          width: Math.round(w * 0.84),
          fontSize: Math.round(13 * scale),
          fontWeight: '500',
          fontFamily: 'Inter, sans-serif',
          fill: secondaryTextColor,
          align: 'left',
        },
      ];
      break;
    }

    case 'promo_discount':
    default: {
      layers = [
        {
          id: `badge-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Badge Promo',
          props: { text: '🔥 OFERTA EXCLUSIVA DE TEMPORADA', tag: 'badge' },
          position: { x: Math.round(w * 0.5 - 190 * scale), y: Math.round(h * 0.08) },
          zIndex: 10,
          scale: 1,
          width: Math.round(380 * scale),
          fontSize: Math.round(14 * scale),
          fontWeight: '800',
          fontFamily: 'Inter, sans-serif',
          fill: '#001219',
          align: 'center',
          textEffect: 'box',
          boxColor: '#EE9B00',
          boxPadding: 8,
          boxBorderRadius: 20,
        },
        {
          id: `h1-${now}`,
          type: 'text',
          blockType: 'CustomText',
          title: 'Titular Oferta',
          props: { text: 'Obtén hasta un 20% de Descuento en tu Póliza Anual', tag: 'h1' },
          position: { x: Math.round(w * 0.5 - 450 * scale), y: Math.round(h * 0.17) },
          zIndex: 20,
          scale: 1,
          width: Math.round(900 * scale),
          fontSize: Math.round(42 * scale),
          fontWeight: '900',
          fontFamily: 'Poppins, sans-serif',
          fill: primaryTextColor,
          align: 'center',
          lineHeight: 1.15,
        },
        {
          id: `trust-${now}`,
          type: 'block',
          blockType: 'MotionTrustBadge',
          title: 'Insignia Promo',
          props: {
            title: 'Certificado de Cobertura Inmediato',
            subtitle: 'Válido para estudiantes, nómadas digitales y visados no lucrativos',
            highlightText: 'Descuento Limitado',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 380 * scale), y: Math.round(h * 0.42) },
          zIndex: 30,
          scale: Math.max(0.75, Math.min(scale, 1.1)),
          width: Math.round(760 * scale),
        },
        {
          id: `cta-${now}`,
          type: 'block',
          blockType: 'WhatsAppCtaButton',
          title: 'Botón CTA',
          props: {
            ctaText: '🎁 Reclamar Mi Descuento por WhatsApp',
            phoneNumber: '+34600000000',
            primaryColor: '#005F73',
            accentColor: '#EE9B00',
            textColor: '#FFFFFF',
          },
          position: { x: Math.round(w * 0.5 - 280 * scale), y: Math.round(h * 0.82) },
          zIndex: 50,
          scale: Math.max(0.75, Math.min(scale, 1.15)),
          width: Math.round(560 * scale),
        },
      ];
      break;
    }
  }

  return {
    id: `smart-canvas-${now}`,
    title: `Diseño: ${SMART_OBJECTIVES.find((o) => o.id === objective)?.name ?? 'Generado'} (${preset.name})`,
    preset,
    background,
    brandTokens: defaultMotionBrandTokens,
    layers,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
