import type { MotionComponentMetadata } from './types';

export const MOTION_KIT_REGISTRY: MotionComponentMetadata[] = [
  {
    id: 'MotionAdvisorCard',
    name: 'Tarjeta de Asesor (Vertical)',
    description: 'Tarjeta de asesor en Glassmorphism con avatar, estado en directo y botón WhatsApp gigante.',
    category: 'advisor',
    thumbnailIcon: 'UserCheck',
    defaultProps: {
      name: 'Sofía',
      role: 'Asesora Especialista en Visados',
      badge: 'ASESORA ASIGNADA · EN DIRECTO',
      message: 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.',
      whatsAppText: 'Pregúntanos por WhatsApp',
    },
  },
  {
    id: 'MotionTrustBadge',
    name: 'Sello de Garantía Consular',
    description: 'Insignia con resorte animado que certifica póliza 100% válida para visado.',
    category: 'trust',
    thumbnailIcon: 'ShieldCheck',
    defaultProps: {
      title: 'PÓLIZA 100% VÁLIDA PARA VISADO',
      subtitle: 'Sin Copagos · Cobertura Completa · Repatriación Incluida',
      highlight: 'GARANTÍA CONSULAR',
      verifiedLabel: 'VERIFICADO',
    },
  },
  {
    id: 'MotionProviderGrid',
    name: 'Grid de Aseguradoras',
    description: 'Tarjetas brillantes con logos y etiquetas de Sanitas, Adeslas, Asisa y DKV.',
    category: 'provider',
    thumbnailIcon: 'Grid',
    defaultProps: {
      title: 'COMPAÑÍAS LÍDERES AUTORIZADAS',
      subtitle: 'Aceptadas oficialmente por Extranjería y Consulados',
      providers: [
        { name: 'SANITAS', tag: 'Sin Copagos', highlight: true },
        { name: 'ADESLAS', tag: 'Visa Ready' },
        { name: 'ASISA', tag: '100% Válido' },
        { name: 'DKV', tag: 'Repatriación' },
      ],
    },
  },
  {
    id: 'MotionComparisonCard',
    name: 'Comparativa Visual (Antes vs Después)',
    description: 'Contraste visual entre el error común de seguro de viaje y el seguro de visado aprobado.',
    category: 'comparison',
    thumbnailIcon: 'SplitSquareVertical',
    defaultProps: {
      title: '¿SEGURO DE VIAJE O SEGURO DE VISADO?',
      wrongOptionTitle: 'Seguro de Viaje Común',
      wrongOptionDesc: '❌ Denegación inmediata: no cumple requisitos de Extranjería ni tiene red médica completa en España.',
      correctOptionTitle: 'Seguro VitaBlue Extranjería',
      correctOptionDesc: '✅ Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
    },
  },
];
