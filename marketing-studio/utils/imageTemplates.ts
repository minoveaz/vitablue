import { ImageLayer, ImageProject, IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import type { CarouselConfig } from '../types/imageStudio';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';
import {
  createCarouselBackgroundComposition,
  generateCarouselBackgroundLayers,
} from './carouselBackgroundComposition';

export const INITIAL_IMAGE_TEMPLATES: ImageProject[] = [
  // 🎓 1. DISEÑO OFICIAL POST BLOG (INSTAGRAM 4:5)
  {
    id: 'template-student-visa-instagram',
    title: 'Guía Blog: Requisitos Visado Estudiante (4:5)',
    preset: IMAGE_FORMAT_PRESETS[0], // 4:5 (1080x1350)
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 16%, rgba(0, 95, 115, 0.8) 0%, #001219 84%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-badge-hook',
        type: 'block',
        blockType: 'HookAlertBadge',
        title: 'Insignia Guía Oficial 2026',
        position: { x: 50, y: 9 },
        zIndex: 10,
        scale: 1,
        width: 340,
        height: 40,
        props: {
          badge: 'GUÍA OFICIAL 2026 · EXTRANJERÍA',
          pulseColor: '#94D2BD',
        },
      },
      {
        id: 'layer-headline-title',
        type: 'text',
        title: 'Titular Principal',
        position: { x: 50, y: 20 },
        zIndex: 12,
        scale: 1,
        width: 880,
        props: {
          text: 'Seguro Médico Obligatorio para Visado de Estudiante',
          tag: 'h1',
          fontWeight: '800',
          fontSize: 34,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.25,
        },
      },
      {
        id: 'layer-illustration-student',
        type: 'block',
        blockType: 'WebIllustration',
        title: 'Ilustración Estudiante & Visado',
        position: { x: 50, y: 44 },
        zIndex: 15,
        scale: 1,
        width: 380,
        height: 270,
        props: {
          illustrationId: 'student',
          title: 'Estudiantes & Visados',
          colorPrimary: '#005F73',
          colorPastel: '#94D2BD',
          colorSecondary: '#FFFFFF',
          colorAccent: '#EE9B00',
          colorNeutral: '#1e293b',
        },
      },
      {
        id: 'layer-glass-card',
        type: 'block',
        blockType: 'GlassCardSurface',
        title: 'Tarjeta Glass Requisitos',
        position: { x: 50, y: 68 },
        zIndex: 20,
        scale: 1,
        width: 920,
        height: 160,
        props: {
          variant: 'teal',
          blur: 'backdrop-blur-md',
          borderOpacity: 'border-teal-500/30',
        },
      },
      {
        id: 'layer-glass-text',
        type: 'text',
        title: 'Checklist 4 Requisitos',
        position: { x: 50, y: 68 },
        zIndex: 22,
        scale: 1,
        width: 860,
        props: {
          text: '✓ 0€ Copagos   ·   ✓ 0 Días Carencia   ·   ✓ Repatriación 100%   ·   ✓ Sanitas Students',
          tag: 'p',
          fontWeight: '700',
          fontSize: 20,
          color: '#94D2BD',
          textAlign: 'center',
        },
      },
      {
        id: 'layer-trust-verified',
        type: 'block',
        blockType: 'TrustVerifiedPill',
        title: 'Sello Homologación Consular',
        position: { x: 50, y: 81 },
        zIndex: 25,
        scale: 1,
        width: 480,
        height: 44,
        props: {
          verifiedLabel: '100% HOMOLOGADO PARA CONSULADOS Y EXTRANJERÍA',
        },
      },
      {
        id: 'layer-cta-whatsapp',
        type: 'block',
        blockType: 'WhatsAppCtaButton',
        title: 'Botón CTA Asesoría WhatsApp',
        position: { x: 50, y: 91 },
        zIndex: 30,
        scale: 1,
        width: 460,
        height: 56,
        props: {
          ctaText: '💬 Asesoría Gratuita con Lucía Delgado',
          phoneNumber: '+34600000000',
          primaryColor: '#EE9B00',
          accentColor: '#005F73',
          textColor: '#001219',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 📱 2. DISEÑO OFICIAL TIKTOK & STORIES (9:16)
  {
    id: 'template-student-visa-tiktok',
    title: 'TikTok & Reel: Guía Visado Estudiante 2026 (9:16)',
    preset: IMAGE_FORMAT_PRESETS[1], // 9:16 (1080x1920)
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 12%, rgba(0, 95, 115, 0.85) 0%, #001219 90%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-tiktok-highlight',
        type: 'block',
        blockType: 'TrustHighlightPill',
        title: 'Sello Garantía Consular',
        position: { x: 50, y: 9 },
        zIndex: 10,
        scale: 1,
        width: 320,
        height: 42,
        props: {
          highlight: 'GARANTÍA CONSULAR 100%',
        },
      },
      {
        id: 'layer-tiktok-hook',
        type: 'text',
        title: 'Pregunta Gancho',
        position: { x: 50, y: 17 },
        zIndex: 12,
        scale: 1,
        width: 900,
        props: {
          text: '¿Vas a estudiar en España este año?',
          tag: 'h1',
          fontWeight: '900',
          fontSize: 40,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.2,
        },
      },
      {
        id: 'layer-tiktok-subtitle',
        type: 'text',
        title: 'Subtítulo Explicativo',
        position: { x: 50, y: 24 },
        zIndex: 14,
        scale: 1,
        width: 880,
        props: {
          text: 'Las 4 condiciones obligatorias que exige Extranjería para tu seguro médico',
          tag: 'h2',
          fontWeight: '600',
          fontSize: 22,
          color: '#94D2BD',
          textAlign: 'center',
          lineHeight: 1.3,
        },
      },
      {
        id: 'layer-tiktok-illustration',
        type: 'block',
        blockType: 'WebIllustration',
        title: 'Ilustración Estudiante',
        position: { x: 50, y: 41 },
        zIndex: 16,
        scale: 1,
        width: 440,
        height: 310,
        props: {
          illustrationId: 'student',
          title: 'Estudiantes & Visados',
          colorPrimary: '#005F73',
          colorPastel: '#94D2BD',
          colorSecondary: '#FFFFFF',
          colorAccent: '#EE9B00',
          colorNeutral: '#1e293b',
        },
      },
      {
        id: 'layer-tiktok-glass',
        type: 'block',
        blockType: 'GlassCardSurface',
        title: 'Superficie Glass Ámbar',
        position: { x: 50, y: 62 },
        zIndex: 20,
        scale: 1,
        width: 920,
        height: 240,
        props: {
          variant: 'amber',
          blur: 'backdrop-blur-md',
          borderOpacity: 'border-amber-500/30',
        },
      },
      {
        id: 'layer-tiktok-items',
        type: 'text',
        title: 'Lista de 4 Requisitos',
        position: { x: 50, y: 62 },
        zIndex: 22,
        scale: 1,
        width: 860,
        props: {
          text: '1. Sin Copagos (0€ adicionales)\n2. Sin Carencias (Válido desde el día 1)\n3. Cobertura Sanidad Pública Completa\n4. Repatriación Sanitaria y de Restos',
          tag: 'p',
          fontWeight: '700',
          fontSize: 21,
          color: '#FFFFFF',
          textAlign: 'center',
          lineHeight: 1.6,
        },
      },
      {
        id: 'layer-tiktok-advisor',
        type: 'block',
        blockType: 'HookAlertBadge',
        title: 'Insignia Asesora Asignada',
        position: { x: 50, y: 77 },
        zIndex: 25,
        scale: 1,
        width: 380,
        height: 44,
        props: {
          badge: 'ASESORA ASIGNADA · LUCÍA DELGADO',
          pulseColor: '#94D2BD',
        },
      },
      {
        id: 'layer-tiktok-cta',
        type: 'block',
        blockType: 'WhatsAppCtaButton',
        title: 'Botón CTA Sanitas Students',
        position: { x: 50, y: 88 },
        zIndex: 30,
        scale: 1,
        width: 480,
        height: 60,
        props: {
          ctaText: '👉 Cotizar Sanitas Students en 1 Minuto',
          phoneNumber: '+34600000000',
          primaryColor: '#25D366',
          accentColor: '#FFFFFF',
          textColor: '#FFFFFF',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 3. PLANTILLAS BASE
  {
    id: 'template-advisor-portrait',
    title: 'Post Asesora de Visados (4:5)',
    preset: IMAGE_FORMAT_PRESETS[0], // 4:5
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 95, 115, 0.75) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-advisor-main',
        type: 'block',
        blockType: 'MotionAdvisorCard',
        title: 'Tarjeta de Asesora',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        props: {
          name: 'Sofía',
          role: 'Asesora Especialista en Visados',
          badge: 'ASESORA ASIGNADA · EN DIRECTO',
          message: 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
          whatsAppText: 'Pregúntanos por WhatsApp',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-trust-square',
    title: 'Garantía Consular 100% (1:1)',
    preset: IMAGE_FORMAT_PRESETS[2], // 1:1
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 30%, rgba(238, 155, 0, 0.45) 0%, #001219 75%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-trust-main',
        type: 'block',
        blockType: 'MotionTrustBadge',
        title: 'Sello de Garantía',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        props: {
          title: 'PÓLIZA 100% VÁLIDA PARA VISADO',
          subtitle: 'Sin Copagos · Cobertura Completa · Repatriación Incluida',
          highlight: 'GARANTÍA CONSULAR',
          verifiedLabel: 'VERIFICADO PARA EXTRANJERÍA',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-comparison-portrait',
    title: 'Comparativa Seguro Viaje vs Visado (4:5)',
    preset: IMAGE_FORMAT_PRESETS[0], // 4:5
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 25%, rgba(0, 95, 115, 0.6) 0%, #001219 85%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-comp-main',
        type: 'block',
        blockType: 'MotionComparisonCard',
        title: 'Comparativa Visual',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        props: {
          title: '¿SEGURO DE VIAJE O SEGURO DE VISADO?',
          wrongOptionTitle: 'Seguro de Viaje Común',
          wrongOptionDesc: 'Denegación de visado: no cumple requisitos consulares ni incluye red médica completa.',
          correctOptionTitle: 'Seguro VitaBlue Extranjería',
          correctOptionDesc: 'Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-providers-square',
    title: 'Parrilla Aseguradoras Aprobadas (1:1)',
    preset: IMAGE_FORMAT_PRESETS[2], // 1:1
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 20%, rgba(148, 210, 189, 0.4) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-providers-main',
        type: 'block',
        blockType: 'MotionProviderGrid',
        title: 'Grid de Aseguradoras',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        props: {
          title: 'COMPAÑÍAS LÍDERES AUTORIZADAS',
          subtitle: 'Aceptadas oficialmente por Extranjería y Consulados',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 🌟 5. DESTACADOS DE INSTAGRAM OFICIALES (PORTADAS CIRCULARES 1:1)
  {
    id: 'template-highlight-approved',
    title: 'Destacado Instagram: Aprobados (1:1)',
    preset: IMAGE_FORMAT_PRESETS[2], // 1:1 (1080x1080)
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 35%, rgba(0, 95, 115, 0.85) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-highlight-approved',
        type: 'block',
        blockType: 'InstagramHighlightBadge',
        title: 'Portada Destacado Aprobados',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 820,
        height: 820,
        props: {
          iconKey: 'approved',
          label: 'Aprobados',
          showLabel: false,
          ringColor: '#94D2BD',
          glowColor: 'rgba(148, 210, 189, 0.55)',
          strokeColor: '#FFFFFF',
          accentColor: '#94D2BD',
          isFullCover: true,
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-highlight-visa',
    title: 'Destacado Instagram: Visados (1:1)',
    preset: IMAGE_FORMAT_PRESETS[2], // 1:1 (1080x1080)
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 35%, rgba(0, 95, 115, 0.85) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-highlight-visa',
        type: 'block',
        blockType: 'InstagramHighlightBadge',
        title: 'Portada Destacado Visados',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 820,
        height: 820,
        props: {
          iconKey: 'visa',
          label: 'Visados',
          showLabel: false,
          ringColor: '#94D2BD',
          glowColor: 'rgba(148, 210, 189, 0.55)',
          strokeColor: '#FFFFFF',
          accentColor: '#94D2BD',
          isFullCover: true,
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-highlight-process',
    title: 'Destacado Instagram: Paso a Paso (1:1)',
    preset: IMAGE_FORMAT_PRESETS[2], // 1:1 (1080x1080)
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 35%, rgba(0, 95, 115, 0.85) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-highlight-process',
        type: 'block',
        blockType: 'InstagramHighlightBadge',
        title: 'Portada Destacado Proceso',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 820,
        height: 820,
        props: {
          iconKey: 'process',
          label: 'Paso a Paso',
          showLabel: false,
          ringColor: '#94D2BD',
          glowColor: 'rgba(148, 210, 189, 0.55)',
          strokeColor: '#FFFFFF',
          accentColor: '#94D2BD',
          isFullCover: true,
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-highlight-faq',
    title: 'Destacado Instagram: Dudas & FAQ (1:1)',
    preset: IMAGE_FORMAT_PRESETS[2], // 1:1 (1080x1080)
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 35%, rgba(0, 95, 115, 0.85) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-highlight-faq',
        type: 'block',
        blockType: 'InstagramHighlightBadge',
        title: 'Portada Destacado FAQ',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 820,
        height: 820,
        props: {
          iconKey: 'faq',
          label: 'Dudas & FAQ',
          showLabel: false,
          ringColor: '#94D2BD',
          glowColor: 'rgba(148, 210, 189, 0.55)',
          strokeColor: '#FFFFFF',
          accentColor: '#94D2BD',
          isFullCover: true,
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-highlight-contact',
    title: 'Destacado Instagram: Contacto WhatsApp (1:1)',
    preset: IMAGE_FORMAT_PRESETS[2], // 1:1 (1080x1080)
    background: {
      type: 'mesh',
      gradient: 'radial-gradient(circle at 50% 35%, rgba(0, 95, 115, 0.85) 0%, #001219 80%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-highlight-contact',
        type: 'block',
        blockType: 'InstagramHighlightBadge',
        title: 'Portada Destacado Contacto',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 820,
        height: 820,
        props: {
          iconKey: 'contact',
          label: 'Contacto WhatsApp',
          showLabel: false,
          ringColor: '#94D2BD',
          accentColor: '#94D2BD',
          isFullCover: true,
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'template-consular-certificate-guide-carousel',
    title: 'Carrusel: Paso a Paso Certificado Consular (Instagram 4:5)',
    preset: IMAGE_FORMAT_PRESETS[3], // instagram-carousel-portrait (5400x1350)
    background: {
      type: 'mesh',
      gradient: 'linear-gradient(90deg, #001219 0%, #002d38 25%, #005F73 50%, #002d38 75%, #001219 100%)',
      color: '#001219',
    },
    brandTokens: defaultMotionBrandTokens,
    layers: [
      {
        id: 'layer-carousel-s1-hero',
        type: 'block',
        blockType: 'InsuranceProductHero',
        title: 'Slide 1: Hook Portada',
        position: { x: 10, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 900,
        height: 640,
        props: {
          badges: ['PASO A PASO EXTRANJERÍA', 'GUÍA 2026'],
          title: 'Cómo Conseguir tu Certificado Consular',
          description: 'El documento exacto que te pide el consulado para aprobar tu visado a España.',
          primaryAction: 'Desliza para ver la guía 👉',
          highlights: ['100% Válido en Consulados', 'Emisión Inmediata en PDF'],
        },
      },
      {
        id: 'layer-carousel-s2-requirements',
        type: 'block',
        blockType: 'InsuranceCoverageGrid',
        title: 'Slide 2: Requisitos Clave',
        position: { x: 30, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 900,
        height: 520,
        props: {
          eyebrow: 'PASO 1: VERIFICA CLÁUSULAS',
          title: 'Las 3 Cláusulas Obligatorias',
          items: [
            { title: 'Sin Copagos', description: '0€ adicionales por consulta o prueba.' },
            { title: 'Sin Carencias', description: 'Activo desde el primer día de viaje.' },
            { title: 'Repatriación', description: 'Cobertura ilimitada de restos y sanitaria.' },
          ],
        },
      },
      {
        id: 'layer-carousel-s3-comparison',
        type: 'block',
        blockType: 'InsurancePlanComparison',
        title: 'Slide 3: Aseguradoras',
        position: { x: 50, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 920,
        height: 680,
        props: {
          eyebrow: 'PASO 2: ELIGE ASEGURADORA',
          title: 'Aseguradoras Homologadas',
          description: 'Certificados emitidos en español y formato oficial.',
          plans: [
            { name: 'Sanitas', subtitle: 'Estudiantes & Visados', description: 'Certificado directo en 24h sin carencias.', priceText: 'Recomendado', isFeatured: true },
            { name: 'Adeslas', subtitle: 'Nómadas & Residencia', description: 'Amplia red médica en toda España.', priceText: 'Popular' },
            { name: 'DKV', subtitle: 'Familias', description: 'Cobertura dental incluida.', priceText: 'Consultar' },
          ],
        },
      },
      {
        id: 'layer-carousel-s4-trust',
        type: 'block',
        blockType: 'InsuranceTrustBar',
        title: 'Slide 4: Validación y Descarga',
        position: { x: 70, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 900,
        height: 320,
        props: {
          items: [
            { title: 'Firma Digital Oficial', description: 'Código seguro de verificación (CSV).' },
            { title: 'Bilingüe ES/EN', description: 'Aceptado en consulados de todo el mundo.' },
            { title: 'Garantía de Devolución', description: '100% reembolso si deniegan el visado.' },
          ],
        },
      },
      {
        id: 'layer-carousel-s5-cta',
        type: 'block',
        blockType: 'InsuranceAdvisorCta',
        title: 'Slide 5: CTA Comparador',
        position: { x: 90, y: 50 },
        zIndex: 10,
        scale: 1,
        width: 900,
        height: 500,
        props: {
          title: '¿Tramitando tu visado a España?',
          description: 'Compara las mejores opciones y obtén tu certificado listo para entregar.',
          ctaText: 'Calcular mi Seguro con Certificado',
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Templates shown in the marketing-studio drawer are intentionally separate
 * projects from the legacy Image Studio seed templates above. Keeping these
 * compositions here (rather than deriving them in the drawer) means every
 * catalog item has its own editable layers, preset and background.
 */
const templatePreset = (aspectRatio: '1:1' | '4:5' | '9:16' | '16:9' | '4:1' | '9:16 (Multi)') => {
  const presetId = {
    '1:1': 'instagram-square',
    '4:5': 'instagram-portrait',
    '9:16': 'story-vertical',
    '16:9': 'landscape-banner',
    '4:1': 'instagram-carousel-portrait',
    '9:16 (Multi)': 'tiktok-carousel-photo',
  }[aspectRatio];
  return IMAGE_FORMAT_PRESETS.find((preset) => preset.id === presetId) ?? IMAGE_FORMAT_PRESETS[0];
};

const UNIVERSAL_BRAND_TOKENS = {
  brandName: 'Universal',
  primaryColor: '#334155',
  accentColor: '#64748b',
  mintColor: '#cbd5e1',
  surfaceBg: '#0f172a',
  cardBg: 'rgba(30, 41, 59, 0.9)',
  textColor: '#f8fafc',
  mutedTextColor: '#cbd5e1',
  fontDisplay: 'sans-serif',
  fontSans: 'sans-serif',
};

const createTextLayer = (
  projectId: string,
  key: string,
  title: string,
  text: string,
  position: { x: number; y: number },
  options: Partial<ImageLayer> = {},
): ImageLayer => ({
  id: `${projectId}-${key}`,
  type: 'text',
  title,
  position,
  zIndex: options.zIndex ?? 10,
  scale: 1,
  width: options.width ?? 860,
  height: options.height,
  fill: options.fill ?? '#f8fafc',
  align: options.align ?? 'center',
  fontSize: options.fontSize ?? 28,
  fontWeight: options.fontWeight ?? '700',
  ...options,
  props: { text, tag: 'p', ...(options.props ?? {}) },
});

const createShapeLayer = (
  projectId: string,
  key: string,
  title: string,
  position: { x: number; y: number },
  fill: string,
  width: number,
  height: number,
  zIndex = 1,
): ImageLayer => ({
  id: `${projectId}-${key}`,
  type: 'block',
  blockType: 'GeometricShape',
  title,
  position,
  zIndex,
  scale: 1,
  width,
  height,
  props: { shapeType: 'rectangle', fill, borderRadius: 28, width, height },
});

const createUniversalProject = (
  id: string,
  title: string,
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9',
  background: string,
  layers: ImageLayer[],
): ImageProject => ({
  id: `universal-${id}`,
  title,
  preset: templatePreset(aspectRatio),
  background: { type: 'gradient', gradient: background, color: '#0f172a' },
  brandTokens: UNIVERSAL_BRAND_TOKENS,
  layers,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/** Neutral, sector-agnostic compositions with no VitaBlue copy or colors. */
export const UNIVERSAL_IMAGE_TEMPLATES: ImageProject[] = [
  createUniversalProject('informative-square', 'Post informativo', '1:1', 'linear-gradient(145deg, #0f172a 0%, #334155 100%)', [
    createShapeLayer('universal-informative-square', 'panel', 'Panel principal', { x: 50, y: 55 }, '#1e293b', 900, 620),
    createTextLayer('universal-informative-square', 'eyebrow', 'Etiqueta informativa', 'EN UN VISTAZO', { x: 50, y: 22 }, { fontSize: 16, fill: '#cbd5e1' }),
    createTextLayer('universal-informative-square', 'headline', 'Titular informativo', 'Información clara para decidir mejor', { x: 50, y: 43 }, { fontSize: 34, fontWeight: '800', width: 760, zIndex: 4 }),
    createTextLayer('universal-informative-square', 'body', 'Texto de apoyo', 'Presenta aquí el dato o la idea principal de tu publicación.', { x: 50, y: 67 }, { fontSize: 19, fill: '#cbd5e1', width: 700, zIndex: 4 }),
    createTextLayer('universal-informative-square', 'footer', 'Llamada a la acción', 'DESCUBRE MÁS', { x: 50, y: 87 }, { fontSize: 15, fill: '#f8fafc', zIndex: 4 }),
  ]),
  createUniversalProject('vertical-promo', 'Promoción vertical', '4:5', 'linear-gradient(160deg, #172554 0%, #475569 100%)', [
    createShapeLayer('universal-vertical-promo', 'accent', 'Franja de acento', { x: 50, y: 12 }, '#64748b', 920, 150, 2),
    createTextLayer('universal-vertical-promo', 'label', 'Etiqueta de oferta', 'NOVEDAD', { x: 50, y: 13 }, { fontSize: 15, zIndex: 4 }),
    createTextLayer('universal-vertical-promo', 'headline', 'Titular promocional', 'Una propuesta pensada para ti', { x: 50, y: 31 }, { fontSize: 36, fontWeight: '800', width: 820 }),
    createTextLayer('universal-vertical-promo', 'detail', 'Detalle promocional', 'Explica el beneficio principal con un mensaje breve y directo.', { x: 50, y: 52 }, { fontSize: 19, fill: '#cbd5e1', width: 760 }),
    createShapeLayer('universal-vertical-promo', 'cta', 'Botón de acción', { x: 50, y: 82 }, '#94a3b8', 430, 100, 3),
    createTextLayer('universal-vertical-promo', 'cta-text', 'Texto de acción', 'VER OPCIONES', { x: 50, y: 82 }, { fontSize: 17, fill: '#0f172a', zIndex: 5 }),
  ]),
  createUniversalProject('announcement-story', 'Anuncio para stories', '9:16', 'linear-gradient(180deg, #111827 0%, #475569 100%)', [
    createTextLayer('universal-announcement-story', 'label', 'Etiqueta de story', 'ATENCIÓN', { x: 50, y: 11 }, { fontSize: 15, fill: '#cbd5e1' }),
    createTextLayer('universal-announcement-story', 'headline', 'Anuncio principal', 'Tenemos algo importante que contarte', { x: 50, y: 27 }, { fontSize: 34, fontWeight: '800', width: 850 }),
    createShapeLayer('universal-announcement-story', 'visual', 'Área visual', { x: 50, y: 51 }, '#334155', 760, 520, 2),
    createTextLayer('universal-announcement-story', 'visual-text', 'Texto del área visual', 'IMAGEN O ILUSTRACIÓN', { x: 50, y: 51 }, { fontSize: 15, fill: '#cbd5e1', zIndex: 4 }),
    createTextLayer('universal-announcement-story', 'body', 'Detalle del anuncio', 'Añade aquí la fecha, el beneficio o el siguiente paso.', { x: 50, y: 73 }, { fontSize: 19, fill: '#cbd5e1', width: 760 }),
    createTextLayer('universal-announcement-story', 'cta', 'Acción del anuncio', 'DESLIZA PARA SABER MÁS', { x: 50, y: 90 }, { fontSize: 15, zIndex: 4 }),
  ]),
  createUniversalProject('educational-carousel', 'Carrusel educativo', '1:1', 'linear-gradient(135deg, #1e293b 0%, #164e63 100%)', [
    createTextLayer('universal-educational-carousel', 'counter', 'Contador de diapositiva', '01 / 05', { x: 14, y: 11 }, { fontSize: 15, align: 'left', fill: '#cbd5e1' }),
    createTextLayer('universal-educational-carousel', 'headline', 'Titular de carrusel', 'Cinco ideas para entenderlo mejor', { x: 50, y: 29 }, { fontSize: 34, fontWeight: '800', width: 820 }),
    createShapeLayer('universal-educational-carousel', 'card', 'Tarjeta educativa', { x: 50, y: 62 }, '#0f172a', 850, 430, 2),
    createTextLayer('universal-educational-carousel', 'point', 'Punto educativo', '01  ·  Explica una idea con ejemplos sencillos.', { x: 50, y: 62 }, { fontSize: 21, fill: '#f8fafc', width: 730, zIndex: 4 }),
    createTextLayer('universal-educational-carousel', 'next', 'Siguiente diapositiva', 'DESLIZA →', { x: 50, y: 88 }, { fontSize: 15, fill: '#cbd5e1' }),
  ]),
  createUniversalProject('video-cover', 'Portada de vídeo', '16:9', 'linear-gradient(115deg, #0f172a 0%, #1e3a8a 100%)', [
    createShapeLayer('universal-video-cover', 'visual', 'Imagen de portada', { x: 72, y: 50 }, '#334155', 720, 500, 2),
    createTextLayer('universal-video-cover', 'visual-label', 'Etiqueta visual', 'VISTA PREVIA', { x: 72, y: 50 }, { fontSize: 15, fill: '#cbd5e1', zIndex: 4 }),
    createTextLayer('universal-video-cover', 'eyebrow', 'Etiqueta de vídeo', 'NUEVO EPISODIO', { x: 22, y: 28 }, { fontSize: 15, align: 'left', fill: '#cbd5e1' }),
    createTextLayer('universal-video-cover', 'headline', 'Título de vídeo', 'Una conversación que merece la pena', { x: 24, y: 50 }, { fontSize: 32, fontWeight: '800', width: 600, align: 'left' }),
    createTextLayer('universal-video-cover', 'meta', 'Metadatos de vídeo', 'TEMA · 08:30 MIN', { x: 24, y: 75 }, { fontSize: 14, align: 'left', fill: '#cbd5e1' }),
  ]),
  createUniversalProject('horizontal-banner', 'Banner horizontal', '16:9', 'linear-gradient(90deg, #0f172a 0%, #475569 100%)', [
    createTextLayer('universal-horizontal-banner', 'headline', 'Titular de banner', 'Haz visible tu próximo mensaje', { x: 31, y: 40 }, { fontSize: 31, fontWeight: '800', width: 650, align: 'left' }),
    createTextLayer('universal-horizontal-banner', 'body', 'Texto de banner', 'Un formato flexible para campañas, eventos o novedades.', { x: 31, y: 61 }, { fontSize: 17, fill: '#cbd5e1', width: 620, align: 'left' }),
    createShapeLayer('universal-horizontal-banner', 'cta', 'Acción del banner', { x: 31, y: 82 }, '#94a3b8', 300, 76, 2),
    createTextLayer('universal-horizontal-banner', 'cta-text', 'Texto de acción', 'CONOCER MÁS', { x: 31, y: 82 }, { fontSize: 14, fill: '#0f172a', zIndex: 4 }),
    createShapeLayer('universal-horizontal-banner', 'graphic', 'Gráfico decorativo', { x: 78, y: 50 }, '#334155', 430, 430, 1),
  ]),
  createUniversalProject('generic-comparison', 'Comparativa neutral', '4:5', 'linear-gradient(165deg, #0f172a 0%, #334155 100%)', [
    createTextLayer('universal-generic-comparison', 'headline', 'Titular comparativo', 'Compara antes de elegir', { x: 50, y: 16 }, { fontSize: 34, fontWeight: '800' }),
    createShapeLayer('universal-generic-comparison', 'left-card', 'Alternativa A', { x: 29, y: 52 }, '#1e293b', 430, 480, 2),
    createShapeLayer('universal-generic-comparison', 'right-card', 'Alternativa B', { x: 71, y: 52 }, '#475569', 430, 480, 2),
    createTextLayer('universal-generic-comparison', 'left-title', 'Título alternativa A', 'OPCIÓN A', { x: 29, y: 38 }, { fontSize: 16, zIndex: 4 }),
    createTextLayer('universal-generic-comparison', 'right-title', 'Título alternativa B', 'OPCIÓN B', { x: 71, y: 38 }, { fontSize: 16, zIndex: 4 }),
    createTextLayer('universal-generic-comparison', 'footer', 'Cierre comparativo', 'Revisa las diferencias y elige con información.', { x: 50, y: 88 }, { fontSize: 16, fill: '#cbd5e1', width: 780 }),
  ]),
  createUniversalProject('generic-testimonial', 'Testimonio neutral', '1:1', 'linear-gradient(145deg, #172554 0%, #334155 100%)', [
    createTextLayer('universal-generic-testimonial', 'quote', 'Cita destacada', '“Una experiencia sencilla, clara y cercana.”', { x: 50, y: 37 }, { fontSize: 30, fontWeight: '800', width: 820 }),
    createTextLayer('universal-generic-testimonial', 'author', 'Autor del testimonio', 'Nombre de la persona', { x: 50, y: 59 }, { fontSize: 18, fill: '#f8fafc' }),
    createTextLayer('universal-generic-testimonial', 'context', 'Contexto del testimonio', 'Cliente · Ciudad', { x: 50, y: 66 }, { fontSize: 15, fill: '#cbd5e1' }),
    createShapeLayer('universal-generic-testimonial', 'rule', 'Separador', { x: 50, y: 76 }, '#64748b', 180, 8, 2),
    createTextLayer('universal-generic-testimonial', 'label', 'Etiqueta social', 'HISTORIA REAL', { x: 50, y: 20 }, { fontSize: 14, fill: '#cbd5e1' }),
  ]),
];

const companyBlockLayer = (
  projectId: string,
  key: string,
  title: string,
  blockType: ImageLayer['blockType'],
  position: { x: number; y: number },
  props: Record<string, unknown>,
  width = 900,
  height = 420,
  zIndex = 2,
): ImageLayer => ({
  id: `${projectId}-${key}`,
  type: 'block',
  blockType,
  title,
  position,
  zIndex,
  scale: 1,
  width,
  height,
  props,
});

const createCompanyProject = (
  id: string,
  title: string,
  aspectRatio: '1:1' | '4:5' | '9:16' | '16:9' | '4:1',
  background: string,
  layers: ImageLayer[],
): ImageProject => ({
  id: `vitablue-${id}`,
  title,
  preset: templatePreset(aspectRatio),
  background: { type: 'mesh', gradient: background, color: '#001219' },
  brandTokens: defaultMotionBrandTokens,
  layers,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const REFERENCE_CAROUSEL_SLIDES: CarouselConfig['slides'] = [
  { index: 0, title: 'Portada / Hook', role: 'hook' },
  { index: 1, title: 'Contexto', role: 'content' },
  { index: 2, title: 'Comparativa', role: 'comparison' },
  { index: 3, title: 'Prueba / Beneficio', role: 'proof' },
  { index: 4, title: 'Cierre / CTA', role: 'cta' },
];

const REFERENCE_SLIDE_WIDTH = 1080;
const REFERENCE_SLIDE_HEIGHT = 1350;
const REFERENCE_PANORAMA_WIDTH = REFERENCE_SLIDE_WIDTH * 5;

type ReferencePalette = {
  background: string;
  foreground: string;
  muted: string;
  primary: string;
  mint: string;
  gold: string;
  surface: string;
  surfaceStrong: string;
};

const REFERENCE_PALETTES: Record<'white' | 'midnight' | 'ocean', ReferencePalette> = {
  white: {
    background: '#FFFFFF',
    foreground: '#001219',
    muted: '#4A5568',
    primary: '#005F73',
    mint: '#94D2BD',
    gold: '#EE9B00',
    surface: '#F4FAF8',
    surfaceStrong: '#E7F8F2',
  },
  midnight: {
    background: '#001219',
    foreground: '#FFFFFF',
    muted: '#D5E5E2',
    primary: '#005F73',
    mint: '#94D2BD',
    gold: '#EE9B00',
    surface: '#F4FAF8',
    surfaceStrong: '#123B46',
  },
  ocean: {
    background: '#005F73',
    foreground: '#FFFFFF',
    muted: '#DDF3EC',
    primary: '#001219',
    mint: '#94D2BD',
    gold: '#EE9B00',
    surface: '#F4FAF8',
    surfaceStrong: '#0B5262',
  },
};

const referenceSlideLayer = (
  projectId: string,
  slideIndex: number,
  key: string,
  title: string,
  type: ImageLayer['type'],
  position: { x: number; y: number },
  size: { width: number; height: number },
  props: Record<string, unknown> = {},
  style: Partial<ImageLayer> = {},
): ImageLayer => ({
  id: `${projectId}-slide-${slideIndex + 1}-${key}`,
  type,
  blockType: type === 'block'
    ? (props.blockType as ImageLayer['blockType'])
    : type === 'text'
    ? 'CustomText'
    : undefined,
  title,
  position: {
    x: Math.round(((slideIndex * REFERENCE_SLIDE_WIDTH + position.x) / REFERENCE_PANORAMA_WIDTH) * 100 * 100000) / 100000,
    y: Math.round((position.y / REFERENCE_SLIDE_HEIGHT) * 100 * 100000) / 100000,
  },
  zIndex: style.zIndex ?? 2,
  scale: style.scale ?? 1,
  width: size.width,
  height: size.height,
  props: { slideIndex, ...props },
  visible: true,
  styleVariant: style.styleVariant,
  ...style,
});

const referenceShape = (
  projectId: string,
  slideIndex: number,
  key: string,
  title: string,
  position: { x: number; y: number },
  size: { width: number; height: number },
  props: Record<string, unknown>,
  style: Partial<ImageLayer> = {},
) =>
  referenceSlideLayer(projectId, slideIndex, key, title, 'block', position, size, {
    blockType: 'GeometricShape',
    shapeType: 'rounded_rect',
    ...props,
  }, style);

const referenceText = (
  projectId: string,
  slideIndex: number,
  key: string,
  title: string,
  text: string,
  position: { x: number; y: number },
  size: { width: number; height: number },
  palette: ReferencePalette,
  style: Partial<ImageLayer> = {},
  props: Record<string, unknown> = {},
) =>
  referenceSlideLayer(projectId, slideIndex, key, title, 'text', position, size, {
    blockType: 'CustomText',
    text,
    tag: 'p',
    textFit: { mode: 'auto', minFontSize: 12, maxFontSize: style.fontSize ?? 32, maxLines: 3 },
    ...props,
  }, {
    fontFamily: 'Poppins, sans-serif',
    fontSize: 24,
    fontWeight: '600',
    fill: palette.foreground,
    align: 'left',
    lineHeight: 1.2,
    zIndex: 8,
    ...style,
  });

const referencePart = (
  projectId: string,
  slideIndex: number,
  key: string,
  title: string,
  part: string,
  text: string,
  position: { x: number; y: number },
  size: { width: number; height: number },
  parentBlockType: ImageLayer['blockType'],
  style: Partial<ImageLayer> = {},
) =>
  referenceSlideLayer(projectId, slideIndex, key, title, 'block', position, size, {
    blockType: 'MarketingBlockPart',
    parentBlockType,
    part,
    text,
  }, {
    zIndex: 10,
    ...style,
  });

const referenceIllustration = (
  projectId: string,
  slideIndex: number,
  key: string,
  title: string,
  illustrationId: string,
  position: { x: number; y: number },
  size: { width: number; height: number },
  palette: ReferencePalette,
  style: Partial<ImageLayer> = {},
) =>
  referenceSlideLayer(projectId, slideIndex, key, title, 'block', position, size, {
    blockType: 'WebIllustration',
    illustrationId,
    colorPrimary: palette.primary,
    colorPastel: palette.mint,
    colorSecondary: palette.background,
    colorAccent: palette.gold,
    colorNeutral: palette.foreground,
  }, {
    zIndex: 6,
    ...style,
  });

const createReferenceCarouselLayers = (
  projectId: string,
  colorVariant: 'white' | 'midnight' | 'ocean',
): ImageLayer[] => {
  const palette = REFERENCE_PALETTES[colorVariant];
  const dark = colorVariant !== 'white';
  const parentBlockType: ImageLayer['blockType'] = 'InsuranceProductHero';
  const geometry = {
    slideCount: 5,
    slideWidth: REFERENCE_SLIDE_WIDTH,
    slideHeight: REFERENCE_SLIDE_HEIGHT,
    panoramaWidth: REFERENCE_PANORAMA_WIDTH,
    panoramaHeight: REFERENCE_SLIDE_HEIGHT,
  };
  const layers: ImageLayer[] = generateCarouselBackgroundLayers({
    projectId,
    geometry,
    composition: createCarouselBackgroundComposition(colorVariant, {
      id: `${projectId}-composition`,
      height: 0.3,
      intensity: 0.78,
      continuity: 'seamless',
      shape: 'wave',
      mask: 'safe-zone',
    }),
  });
  const add = (...next: ImageLayer[]) => layers.push(...next);

  for (let slideIndex = 0; slideIndex < 5; slideIndex += 1) {
    add(
      referenceShape(projectId, slideIndex, 'editorial-rule', 'Regla editorial', { x: 118, y: 1180 }, { width: 220, height: 10 }, {
        shapeType: 'separator-wave',
        fill: 'transparent',
        stroke: palette.mint,
        strokeWidth: 5,
      }, { opacity: 0.85, zIndex: 2 }),
      referenceText(projectId, slideIndex, 'slide-count', 'Número de slide', `${String(slideIndex + 1).padStart(2, '0')} / 05`, { x: 100, y: 84 }, { width: 170, height: 38 }, palette, {
        fontFamily: 'Inter, sans-serif',
        fontSize: 16,
        fontWeight: '800',
        fill: dark ? palette.mint : palette.primary,
        letterSpacing: 2,
        zIndex: 9,
      }),
    );
  }

  // 01 · Hook: editorial cover with an illustration and a clear promise.
  add(
    referenceSlideLayer(projectId, 0, 'logo', 'Logo VitaBlue', 'block', { x: 190, y: 180 }, { width: 230, height: 64 }, {
      blockType: 'BrandLogo',
      variant: dark ? 'white' : 'default',
      showText: true,
    }, { zIndex: 12 }),
    referenceText(projectId, 0, 'eyebrow', 'Eyebrow editable', 'GUÍA VITABLUE', { x: 300, y: 300 }, { width: 420, height: 42 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 18,
      fontWeight: '800',
      fill: palette.gold,
      letterSpacing: 2,
    }),
    referenceText(projectId, 0, 'title', 'Titular de portada', 'Tu seguro, más fácil de entender', { x: 390, y: 390 }, { width: 590, height: 225 }, palette, {
      fontSize: 58,
      fontWeight: '800',
      lineHeight: 1.08,
    }, { tag: 'h1', textFit: { mode: 'auto', minFontSize: 34, maxFontSize: 58, maxLines: 3 } }),
    referenceText(projectId, 0, 'body', 'Descripción de portada', 'Una guía visual para comparar coberturas con confianza.', { x: 350, y: 680 }, { width: 500, height: 100 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 24,
      fontWeight: '500',
      fill: palette.muted,
    }),
    referenceIllustration(projectId, 0, 'illustration', 'Ilustración de estudiante', 'student', { x: 805, y: 625 }, { width: 430, height: 430 }, palette, {
      clipShape: 'circle',
      borderWidth: 14,
      borderColor: palette.mint,
      shadowPreset: 'soft',
      zIndex: 5,
    }),
    referencePart(projectId, 0, 'cta', 'CTA portada', 'cta', 'Desliza para conocerla', { x: 300, y: 930 }, { width: 370, height: 76 }, parentBlockType, {
      shadowPreset: 'glow_gold',
      borderRadius: 20,
    }),
    referenceText(projectId, 0, 'continuity', 'Continuidad de portada', 'Información clara  ·  Acompañamiento humano', { x: 430, y: 1110 }, { width: 640, height: 52 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      fontWeight: '700',
      fill: palette.muted,
    }),
  );

  // 02 · Context: three cards orbit a phone-style policy preview.
  add(
    referenceText(projectId, 1, 'title', 'Titular de contexto', 'Empieza por lo importante', { x: 400, y: 255 }, { width: 600, height: 120 }, palette, {
      fontSize: 48,
      fontWeight: '800',
    }, { tag: 'h2', textFit: { mode: 'auto', minFontSize: 30, maxFontSize: 48, maxLines: 2 } }),
    referenceText(projectId, 1, 'body', 'Texto de contexto', 'La letra pequeña se entiende mejor cuando la ves por partes.', { x: 370, y: 410 }, { width: 510, height: 94 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 21,
      fontWeight: '500',
      fill: palette.muted,
    }),
    referenceShape(projectId, 1, 'phone-frame', 'Mockup de póliza', { x: 840, y: 645 }, { width: 330, height: 610 }, {
      shapeType: 'rounded_rect',
      fill: palette.foreground,
    }, { clipShape: 'phone_mockup', borderWidth: 5, borderColor: palette.mint, shadowPreset: 'deep', zIndex: 4 }),
    referenceShape(projectId, 1, 'phone-screen', 'Pantalla de póliza', { x: 840, y: 670 }, { width: 276, height: 492 }, {
      shapeType: 'rounded_rect',
      fill: palette.surfaceStrong,
    }, { zIndex: 5 }),
    referenceText(projectId, 1, 'phone-label', 'Etiqueta del mockup', 'MI PÓLIZA', { x: 840, y: 505 }, { width: 250, height: 34 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 14,
      fontWeight: '800',
      fill: palette.mint,
      align: 'center',
      zIndex: 8,
    }),
    referenceText(projectId, 1, 'phone-metric', 'Métrica del mockup', '100%\\nCLARO', { x: 840, y: 700 }, { width: 220, height: 120 }, palette, {
      fontSize: 36,
      fontWeight: '800',
      fill: dark ? palette.foreground : palette.primary,
      align: 'center',
      zIndex: 8,
    }, { textFit: { mode: 'auto', minFontSize: 24, maxFontSize: 36, maxLines: 2 } }),
    ...[
      ['coverage', 'Cobertura clara', 'Qué incluye cada opción.'],
      ['conditions', 'Sin sorpresas', 'Condiciones visibles antes de decidir.'],
      ['support', 'Apoyo humano', 'Resolvemos tus dudas.'],
    ].flatMap(([key, title, body], index) => {
      const y = 620 + index * 175;
      return [
        referenceShape(projectId, 1, `${key}-card`, `Tarjeta ${title}`, { x: 340, y }, { width: 420, height: 122 }, {
          shapeType: 'rounded_rect',
          fill: palette.surface,
          stroke: palette.mint,
          strokeWidth: 2,
        }, { borderRadius: 22, shadowPreset: 'soft', zIndex: 3 }),
        referencePart(projectId, 1, `${key}-item`, `Contenido ${title}`, 'item', `${title} · ${body}`, { x: 340, y }, { width: 380, height: 92 }, 'InsuranceCoverageGrid', {
          zIndex: 7,
        }),
      ];
    }),
  );

  // 03 · Comparison: a strong split card makes the decision tangible.
  add(
    referenceText(projectId, 2, 'title', 'Titular de comparativa', 'Compara tus alternativas', { x: 430, y: 260 }, { width: 650, height: 120 }, palette, {
      fontSize: 48,
      fontWeight: '800',
    }, { tag: 'h2', textFit: { mode: 'auto', minFontSize: 30, maxFontSize: 48, maxLines: 2 } }),
    referenceText(projectId, 2, 'body', 'Descripción de comparativa', 'Elige con datos, no con suposiciones.', { x: 375, y: 410 }, { width: 520, height: 76 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 21,
      fontWeight: '500',
      fill: palette.muted,
    }),
    referenceShape(projectId, 2, 'plan-left', 'Plan esencial', { x: 335, y: 760 }, { width: 380, height: 470 }, {
      shapeType: 'rounded_rect',
      fill: palette.surface,
      stroke: palette.mint,
      strokeWidth: 2,
    }, { borderRadius: 28, shadowPreset: 'soft', zIndex: 3 }),
    referenceShape(projectId, 2, 'plan-right', 'Plan completo', { x: 755, y: 730 }, { width: 380, height: 530 }, {
      shapeType: 'rounded_rect',
      fill: palette.primary,
      stroke: palette.gold,
      strokeWidth: 5,
    }, { borderRadius: 28, shadowPreset: 'glow_gold', zIndex: 3 }),
    referencePart(projectId, 2, 'plan-left-content', 'Contenido plan esencial', 'plan', 'ESENCIAL\\nLo necesario\\nProtección para empezar', { x: 335, y: 760 }, { width: 320, height: 390 }, 'InsurancePlanComparison', { zIndex: 8 }),
    referencePart(projectId, 2, 'plan-right-content', 'Contenido plan completo', 'plan', 'COMPLETO\\nMás elegido\\nCobertura amplia', { x: 755, y: 730 }, { width: 320, height: 450 }, 'InsuranceProductHero', {
      zIndex: 8,
    }),
    referencePart(projectId, 2, 'featured-badge', 'Badge plan recomendado', 'badge', 'MÁS ELEGIDO', { x: 755, y: 500 }, { width: 210, height: 46 }, 'InsurancePlanComparison', {
      shadowPreset: 'glow_gold',
      zIndex: 10,
    }),
    referenceText(projectId, 2, 'connector', 'Conector de comparativa', '→ elige con calma', { x: 540, y: 1210 }, { width: 310, height: 46 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      fontWeight: '800',
      fill: palette.gold,
      align: 'center',
    }),
  );

  // 04 · Proof: metric, quote and the visual seal of trust.
  add(
    referenceText(projectId, 3, 'title', 'Titular de confianza', 'Decidir acompañado cambia todo', { x: 465, y: 260 }, { width: 700, height: 120 }, palette, {
      fontSize: 48,
      fontWeight: '800',
    }, { tag: 'h2', textFit: { mode: 'auto', minFontSize: 30, maxFontSize: 48, maxLines: 2 } }),
    referenceShape(projectId, 3, 'metric-card', 'Métrica 24 horas', { x: 280, y: 650 }, { width: 360, height: 300 }, {
      shapeType: 'rounded_rect',
      fill: palette.primary,
    }, { borderRadius: 32, shadowPreset: 'glow_teal', zIndex: 3 }),
    referenceText(projectId, 3, 'metric-value', 'Valor métrico editable', '24 h', { x: 280, y: 620 }, { width: 260, height: 110 }, palette, {
      fontSize: 68,
      fontWeight: '800',
      fill: palette.mint,
      align: 'center',
      zIndex: 8,
    }, { tag: 'h2', textFit: { mode: 'auto', minFontSize: 40, maxFontSize: 68, maxLines: 1 } }),
    referenceText(projectId, 3, 'metric-label', 'Etiqueta métrica', 'para recibir tu documentación', { x: 280, y: 760 }, { width: 270, height: 72 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      fontWeight: '700',
      fill: palette.foreground,
      align: 'center',
      zIndex: 8,
    }),
    referenceShape(projectId, 3, 'quote-card', 'Tarjeta testimonial', { x: 785, y: 650 }, { width: 470, height: 340 }, {
      shapeType: 'rounded_rect',
      fill: palette.surface,
      stroke: palette.mint,
      strokeWidth: 2,
    }, { borderRadius: 32, shadowPreset: 'soft', zIndex: 3 }),
    referenceText(projectId, 3, 'quote', 'Cita editable', '“Me explicaron todo con mucha claridad.”', { x: 785, y: 650 }, { width: 370, height: 145 }, palette, {
      fontSize: 27,
      fontWeight: '700',
      lineHeight: 1.18,
      zIndex: 8,
    }),
    referencePart(projectId, 3, 'quote-author', 'Autor del testimonio', 'meta', 'María · Cliente VitaBlue', { x: 785, y: 830 }, { width: 330, height: 42 }, 'InsuranceTestimonialGrid', {
      zIndex: 8,
    }),
    referenceIllustration(projectId, 3, 'trust-illustration', 'Ilustración de confianza', 'accompaniment', { x: 180, y: 1050 }, { width: 180, height: 180 }, palette, {
      clipShape: 'circle',
      zIndex: 6,
    }),
    referencePart(projectId, 3, 'trust-badge', 'Sello de confianza', 'badge', 'OPCIONES REVISADAS', { x: 470, y: 1100 }, { width: 260, height: 52 }, 'InsuranceTrustBar', {
      zIndex: 9,
    }),
  );

  // 05 · CTA: a calm, high-contrast ending with one obvious action.
  add(
    referenceSlideLayer(projectId, 4, 'logo', 'Logo VitaBlue final', 'block', { x: 190, y: 190 }, { width: 230, height: 64 }, {
      blockType: 'BrandLogo',
      variant: 'white',
      showText: true,
    }, { zIndex: 12 }),
    referenceText(projectId, 4, 'title', 'Titular final', '¿Listo para comparar?', { x: 540, y: 405 }, { width: 760, height: 130 }, palette, {
      fontSize: 54,
      fontWeight: '800',
      align: 'center',
    }, { tag: 'h2', textFit: { mode: 'auto', minFontSize: 34, maxFontSize: 54, maxLines: 2 } }),
    referenceText(projectId, 4, 'body', 'Descripción final', 'Guarda esta guía y empieza con una asesora cuando quieras.', { x: 540, y: 600 }, { width: 660, height: 92 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 22,
      fontWeight: '500',
      fill: palette.muted,
      align: 'center',
    }),
    referenceShape(projectId, 4, 'cta-surface', 'Superficie de CTA', { x: 540, y: 810 }, { width: 690, height: 190 }, {
      shapeType: 'rounded_rect',
      fill: palette.surfaceStrong,
      stroke: palette.gold,
      strokeWidth: 3,
    }, { borderRadius: 36, shadowPreset: 'glow_gold', zIndex: 3 }),
    referencePart(projectId, 4, 'cta-action', 'CTA final editable', 'cta', 'Ver mis opciones', { x: 540, y: 810 }, { width: 370, height: 76 }, 'InsuranceAdvisorCta', {
      shadowPreset: 'glow_gold',
      zIndex: 10,
    }),
    referenceText(projectId, 4, 'footer', 'Cierre de marca', 'vitablue.es  ·  Decisiones más claras', { x: 540, y: 1110 }, { width: 600, height: 46 }, palette, {
      fontFamily: 'Inter, sans-serif',
      fontSize: 16,
      fontWeight: '700',
      fill: palette.muted,
      align: 'center',
    }),
  );

  return layers.map((layer) => ({
    ...layer,
    styleVariant: colorVariant,
    props: { ...layer.props, variant: colorVariant },
  }));
};

const createReferenceCarouselProject = (
  colorVariant: 'white' | 'midnight' | 'ocean',
): ImageProject => {
  const projectId = `vitablue-reference-carousel-${colorVariant}`;
  const base = createCompanyProject(
    `reference-carousel-${colorVariant}`,
    `Referencia VitaBlue · Fondo ${colorVariant === 'white' ? 'blanco' : colorVariant === 'midnight' ? 'midnight blue' : 'ocean teal'}`,
    '4:1',
    colorVariant === 'white' ? '#FFFFFF' : colorVariant === 'midnight' ? '#001219' : '#005F73',
    createReferenceCarouselLayers(projectId, colorVariant),
  );

  return {
    ...base,
    id: projectId,
    background: {
      type: 'solid',
      color: colorVariant === 'white' ? '#FFFFFF' : colorVariant === 'midnight' ? '#001219' : '#005F73',
    },
    layers: base.layers.map((layer) => ({
      ...layer,
      styleVariant: colorVariant,
      props: { ...layer.props, variant: colorVariant },
    })),
    carouselBackground: createCarouselBackgroundComposition(colorVariant, {
      id: `${projectId}-composition`,
      height: 0.3,
      intensity: 0.78,
      continuity: 'seamless',
      shape: 'wave',
      mask: 'safe-zone',
    }),
    carouselPages: 5,
    currentSlide: 0,
    carouselConfig: {
      enabled: true,
      platform: 'instagram',
      slideCount: 5,
      slideWidth: 1080,
      slideHeight: 1350,
      layoutId: 'educational-five-step',
      currentSlideIndex: 0,
      slides: REFERENCE_CAROUSEL_SLIDES,
      showSlideDividers: true,
      showSlideNumbers: true,
      autoSnapToSlides: true,
    },
  };
};

/** Reference VitaBlue carousel in the three approved background treatments. */
export const VITABLUE_REFERENCE_CAROUSEL_TEMPLATES: ImageProject[] = [
  createReferenceCarouselProject('white'),
  createReferenceCarouselProject('midnight'),
  createReferenceCarouselProject('ocean'),
];

/** Independent VitaBlue insurance campaign compositions. */
export const EMPRESA_IMAGE_TEMPLATES: ImageProject[] = [
  createCompanyProject('health-campaign', 'Campaña de seguro médico', '4:5', 'radial-gradient(circle at 30% 15%, rgba(0, 95, 115, 0.9), #001219 78%)', [
    companyBlockLayer('vitablue-health-campaign', 'hero', 'Hero seguro médico', 'InsuranceProductHero', { x: 50, y: 45 }, { badges: ['Seguro médico', 'Desde el primer día'], title: 'Tu salud, siempre acompañada', description: 'Comparamos coberturas médicas para que elijas con tranquilidad.', primaryAction: 'Calcular mi seguro', secondaryAction: 'Hablar con una asesora', highlights: ['Red médica amplia', 'Atención cercana'] }, 940, 700, 2),
    companyBlockLayer('vitablue-health-campaign', 'trust', 'Confianza médica', 'InsuranceTrustBar', { x: 50, y: 87 }, { items: [{ title: 'Cobertura clara', description: 'Condiciones visibles.' }, { title: 'Gestión rápida', description: 'Te acompañamos.' }, { title: 'Soporte humano', description: 'Estamos contigo.' }] }, 940, 190, 3),
  ]),
  createCompanyProject('travel-campaign', 'Campaña de seguro de viaje', '4:5', 'radial-gradient(circle at 80% 20%, rgba(0, 95, 115, 0.85), #001219 82%)', [
    companyBlockLayer('vitablue-travel-campaign', 'card', 'Producto viaje', 'InsuranceProductCard', { x: 50, y: 50 }, { title: 'Seguro de viaje', tagline: 'Viaja con respaldo', description: 'Asistencia y protección para disfrutar cada destino.', features: ['Asistencia 24 horas', 'Equipaje protegido'], price: 'Desde 12€/viaje', badge: 'VIAJA TRANQUILO' }, 620, 700, 2),
    companyBlockLayer('vitablue-travel-campaign', 'advisor', 'Asesoría de viaje', 'InsuranceAdvisorCta', { x: 50, y: 88 }, { title: 'Prepara tu próximo viaje', description: 'Una asesora te ayuda a revisar las coberturas.', ctaText: 'Hablar con una asesora' }, 900, 260, 3),
  ]),
  createCompanyProject('coverage-comparison', 'Comparativa de coberturas', '1:1', 'linear-gradient(135deg, rgba(0, 95, 115, 0.9), #001219 80%)', [
    companyBlockLayer('vitablue-coverage-comparison', 'comparison', 'Comparador de planes', 'InsurancePlanComparison', { x: 50, y: 49 }, { eyebrow: 'COMPARA COBERTURAS', title: 'Elige la protección que necesitas', description: 'Tres opciones para comparar con calma.', plans: [{ name: 'Esencial', subtitle: 'Lo básico', description: 'Acceso a servicios fundamentales.', priceText: 'Consultar' }, { name: 'Completo', subtitle: 'Más elegido', description: 'Cobertura amplia y asistencia.', priceText: 'Recomendado', isFeatured: true }, { name: 'Premium', subtitle: 'Máxima libertad', description: 'Servicios adicionales y reembolso.', priceText: 'Consultar' }] }, 940, 720, 2),
    companyBlockLayer('vitablue-coverage-comparison', 'transparency', 'Transparencia de planes', 'InsuranceTransparency', { x: 50, y: 90 }, { title: 'Mira todos los detalles', description: 'Incluye y exclusiones con la misma claridad.', inclusions: ['Asistencia médica', 'Orientación personalizada'], exclusions: ['Servicios no contratados'] }, 940, 260, 3),
  ]),
  createCompanyProject('saving-ad', 'Anuncio de ahorro', '1:1', 'radial-gradient(circle at 20% 10%, rgba(238, 155, 0, 0.45), #001219 76%)', [
    companyBlockLayer('vitablue-saving-ad', 'hero', 'Propuesta de ahorro', 'InsuranceProductHero', { x: 50, y: 47 }, { badges: ['OPORTUNIDAD', 'COMPARA GRATIS'], title: 'Ahorra sin renunciar a tu cobertura', description: 'Encuentra una póliza que se ajuste a tus necesidades y presupuesto.', primaryAction: 'Ver opciones', secondaryAction: 'Resolver dudas', highlights: ['Sin compromiso', 'Acompañamiento experto'] }, 940, 680, 2),
    companyBlockLayer('vitablue-saving-ad', 'proof', 'Prueba de ahorro', 'InsuranceTrustBar', { x: 50, y: 88 }, { items: [{ title: 'Compara', description: 'Varias alternativas.' }, { title: 'Ajusta', description: 'A tu presupuesto.' }, { title: 'Decide', description: 'Con información.' }] }, 940, 190, 3),
  ]),
  createCompanyProject('advisor-story', 'Story de asesoría VitaBlue', '9:16', 'linear-gradient(180deg, rgba(0, 95, 115, 0.9), #001219 90%)', [
    companyBlockLayer('vitablue-advisor-story', 'advisor', 'Asesora VitaBlue', 'InsuranceAdvisorCta', { x: 50, y: 36 }, { title: '¿Tienes dudas sobre tu seguro?', description: 'Sofía te orienta para entender cada cobertura antes de elegir.', ctaText: 'Escribir a Sofía' }, 900, 500, 2),
    companyBlockLayer('vitablue-advisor-story', 'stories', 'Experiencias de clientes', 'InsuranceTestimonialGrid', { x: 50, y: 72 }, { eyebrow: 'HISTORIAS REALES', title: 'Personas que decidieron acompañadas', items: [{ author: 'Lucía', meta: 'Cliente VitaBlue', comment: 'Me explicaron todo con mucha claridad.', stars: 5 }, { author: 'Álvaro', meta: 'Asegurado', comment: 'Pude comparar antes de contratar.', stars: 5 }] }, 900, 520, 3),
  ]),
  createCompanyProject('trust-post', 'Post de confianza VitaBlue', '1:1', 'radial-gradient(circle at 50% 20%, rgba(0, 95, 115, 0.8), #001219 82%)', [
    companyBlockLayer('vitablue-trust-post', 'trust', 'Barra de confianza VitaBlue', 'InsuranceTrustBar', { x: 50, y: 42 }, { items: [{ title: 'Información transparente', description: 'Lee antes de decidir.' }, { title: 'Aseguradoras fiables', description: 'Opciones revisadas.' }, { title: 'Personas reales', description: 'Acompañamiento humano.' }] }, 940, 260, 2),
    companyBlockLayer('vitablue-trust-post', 'faq', 'Preguntas de confianza', 'InsuranceFaq', { x: 50, y: 75 }, { eyebrow: 'PREGUNTAS FRECUENTES', title: 'Decide con tranquilidad', items: [{ question: '¿Puedo comparar antes de contratar?', answer: 'Sí, te mostramos las diferencias principales.' }, { question: '¿Hay acompañamiento?', answer: 'Sí, nuestro equipo está disponible para ayudarte.' }] }, 940, 440, 3),
  ]),
  createCompanyProject('providers-carousel', 'Carrusel de aseguradoras', '1:1', 'linear-gradient(145deg, #001219 0%, rgba(0, 95, 115, 0.85) 100%)', [
    companyBlockLayer('vitablue-providers-carousel', 'providers', 'Aseguradoras disponibles', 'InsuranceProviderBar', { x: 50, y: 27 }, { eyebrow: 'ASEGURADORAS DISPONIBLES', providers: ['Sanitas', 'Adeslas', 'DKV', 'Asisa'] }, 940, 250, 2),
    companyBlockLayer('vitablue-providers-carousel', 'coverage', 'Resumen de coberturas', 'InsuranceCoverageGrid', { x: 50, y: 70 }, { eyebrow: 'ENCUENTRA TU OPCIÓN', title: 'Coberturas para cada situación', items: [{ title: 'Salud', description: 'Especialistas y pruebas.' }, { title: 'Viaje', description: 'Asistencia en destino.' }, { title: 'Familia', description: 'Protección compartida.' }] }, 940, 500, 3),
  ]),
  createCompanyProject('campaign-cover', 'Portada de campaña VitaBlue', '16:9', 'linear-gradient(110deg, rgba(0, 95, 115, 0.95), #001219 82%)', [
    companyBlockLayer('vitablue-campaign-cover', 'hero', 'Portada de campaña', 'InsuranceProductHero', { x: 38, y: 50 }, { badges: ['CAMPAÑA VITABLUE', 'SEGUROS 2026'], title: 'Tu próxima decisión, más clara', description: 'Compara seguros y cuenta con una asesora cuando lo necesites.', primaryAction: 'Empezar ahora', secondaryAction: 'Conocer VitaBlue', highlights: ['Opciones comparables', 'Atención personalizada'] }, 900, 620, 2),
    companyBlockLayer('vitablue-campaign-cover', 'providers', 'Proveedores de campaña', 'InsuranceProviderBar', { x: 82, y: 51 }, { eyebrow: 'NUESTRAS OPCIONES', providers: ['Sanitas', 'Adeslas', 'DKV'] }, 500, 300, 3),
  ]),
  createCompanyProject('seamless-educational-carousel', 'Carrusel Oficial: Guía 5 Pasos Visado', '4:1', 'linear-gradient(90deg, #001219 0%, #005F73 50%, #001219 100%)', [
    companyBlockLayer('vitablue-seamless-educational-carousel', 'slide1', 'Slide 1: Hook Portada', 'InsuranceProductHero', { x: 10, y: 50 }, { badges: ['GUÍA OFICIAL 2026'], title: 'Requisitos de Seguro para Visados', description: 'Todo lo que Extranjería exige para aprobar tu expediente.', primaryAction: 'Desliza para ver los 5 pasos 👉' }, 900, 600, 2),
    companyBlockLayer('vitablue-seamless-educational-carousel', 'slide2', 'Slide 2: Coberturas Clave', 'InsuranceCoverageGrid', { x: 30, y: 50 }, { eyebrow: 'PASO 1 & 2', title: 'Sin Copagos y Sin Carencias', items: [{ title: '0€ Copago', description: 'Acceso ilimitado sin pagos extra.' }, { title: 'Día 1', description: 'Válido desde la llegada a España.' }] }, 900, 500, 2),
    companyBlockLayer('vitablue-seamless-educational-carousel', 'slide3', 'Slide 3: Comparativa', 'InsurancePlanComparison', { x: 50, y: 50 }, { eyebrow: 'PASO 3', title: 'Opciones de Aseguradoras', description: 'Aprobadas por Consulados y Extranjería.', plans: [{ name: 'Sanitas', subtitle: 'Estudiantes', description: 'Certificado directo visado.' }, { name: 'Adeslas', subtitle: 'Nómadas', description: 'Cobertura completa.' }] }, 900, 550, 2),
    companyBlockLayer('vitablue-seamless-educational-carousel', 'slide4', 'Slide 4: Confianza y Repatriación', 'InsuranceTrustBar', { x: 70, y: 50 }, { items: [{ title: 'Repatriación 100%', description: 'Incluida obligatoria.' }, { title: '30.000€ Mínimo', description: 'Cumple normativa Schengen.' }] }, 900, 300, 2),
    companyBlockLayer('vitablue-seamless-educational-carousel', 'slide5', 'Slide 5: CTA Final', 'InsuranceAdvisorCta', { x: 90, y: 50 }, { title: '¿Dudas con tu visado?', description: 'Calcula tu precio o habla con una asesora experta.', ctaText: 'Calcular Seguro en 1 Minuto' }, 900, 480, 2),
  ]),
  createCompanyProject('consular-certificate-guide-carousel', 'Carrusel: Paso a Paso Certificado Consular', '4:1', 'linear-gradient(90deg, #001219 0%, #002d38 25%, #005F73 50%, #002d38 75%, #001219 100%)', [
    companyBlockLayer('vitablue-consular-certificate-guide-carousel', 'slide1', 'Slide 1: Hook Portada', 'InsuranceProductHero', { x: 10, y: 50 }, { badges: ['PASO A PASO EXTRANJERÍA', 'GUÍA 2026'], title: 'Cómo Conseguir tu Certificado Consular', description: 'El documento exacto que te pide el consulado para aprobar tu visado a España.', primaryAction: 'Desliza para ver la guía 👉', highlights: ['100% Válido en Consulados', 'Emisión Inmediata en PDF'] }, 900, 640, 2),
    companyBlockLayer('vitablue-consular-certificate-guide-carousel', 'slide2', 'Slide 2: Requisitos Clave', 'InsuranceCoverageGrid', { x: 30, y: 50 }, { eyebrow: 'PASO 1: VERIFICA CLÁUSULAS', title: 'Las 3 Cláusulas Obligatorias', items: [{ title: 'Sin Copagos', description: '0€ adicionales por consulta o prueba.' }, { title: 'Sin Carencias', description: 'Activo desde el primer día de viaje.' }, { title: 'Repatriación', description: 'Cobertura ilimitada de restos y sanitaria.' }] }, 900, 520, 2),
    companyBlockLayer('vitablue-consular-certificate-guide-carousel', 'slide3', 'Slide 3: Aseguradoras', 'InsurancePlanComparison', { x: 50, y: 50 }, { eyebrow: 'PASO 2: ELIGE ASEGURADORA', title: 'Aseguradoras Homologadas', description: 'Certificados emitidos en español y formato oficial.', plans: [{ name: 'Sanitas', subtitle: 'Estudiantes & Visados', description: 'Certificado directo en 24h sin carencias.', priceText: 'Recomendado', isFeatured: true }, { name: 'Adeslas', subtitle: 'Nómadas & Residencia', description: 'Amplia red médica en toda España.', priceText: 'Popular' }, { name: 'DKV', subtitle: 'Familias', description: 'Cobertura dental incluida.', priceText: 'Consultar' }] }, 920, 680, 2),
    companyBlockLayer('vitablue-consular-certificate-guide-carousel', 'slide4', 'Slide 4: Validación y Descarga', 'InsuranceTrustBar', { x: 70, y: 50 }, { items: [{ title: 'Firma Digital Oficial', description: 'Código seguro de verificación (CSV).' }, { title: 'Bilingüe ES/EN', description: 'Aceptado en consulados de todo el mundo.' }, { title: 'Garantía de Devolución', description: '100% reembolso si deniegan el visado.' }] }, 900, 320, 2),
    companyBlockLayer('vitablue-consular-certificate-guide-carousel', 'slide5', 'Slide 5: CTA Comparador', 'InsuranceAdvisorCta', { x: 90, y: 50 }, { title: '¿Tramitando tu visado a España?', description: 'Compara las mejores opciones y obtén tu certificado listo para entregar.', ctaText: 'Calcular mi Seguro con Certificado' }, 900, 500, 2),
  ]),
  ...VITABLUE_REFERENCE_CAROUSEL_TEMPLATES,
];

// English alias for consumers that use the block catalog naming convention.
export const COMPANY_IMAGE_TEMPLATES = EMPRESA_IMAGE_TEMPLATES;

/** Lookup used by the catalog and drawer; every value is a real project. */
export const MARKETING_TEMPLATE_PROJECTS = [...UNIVERSAL_IMAGE_TEMPLATES, ...EMPRESA_IMAGE_TEMPLATES];
export const MARKETING_TEMPLATE_PROJECT_BY_ID = new Map(
  MARKETING_TEMPLATE_PROJECTS.map((project) => [project.id, project]),
);
