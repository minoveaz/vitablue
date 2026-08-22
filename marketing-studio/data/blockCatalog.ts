import { ImageBlockType } from '../types/imageStudio';

export type BlockScope = 'system' | 'organization' | 'user';

export interface BlockCatalogItem {
  id: string;
  name: string;
  description: string;
  type: ImageBlockType;
  scope: Exclude<BlockScope, 'user'>;
  category: string;
  /** Props shared by the catalog renderer and the inserted canvas layer. */
  defaultProps: Record<string, unknown>;
}

export const BLOCK_SCOPE_OPTIONS: ReadonlyArray<{
  id: BlockScope;
  label: string;
}> = [
  { id: 'system', label: 'Universal' },
  { id: 'organization', label: 'Empresa' },
  { id: 'user', label: 'Míos' },
];

export const UNIVERSAL_BLOCK_CATALOG = [
  {
    id: 'hero-universal',
    name: 'Tarjeta de asesora',
    description: 'Contacto directo con una asesora y llamada a la acción por WhatsApp.',
    type: 'MotionAdvisorCard',
    scope: 'system',
    category: 'Conversión',
    defaultProps: {
      name: 'Sofía',
      role: 'Asesora Especialista en Visados',
      badge: 'ASESORA ASIGNADA · EN DIRECTO',
      message: 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
      whatsAppText: 'Pregúntanos por WhatsApp',
    },
  },
  {
    id: 'benefits-universal',
    name: 'Red de aseguradoras',
    description: 'Cuadrícula de compañías autorizadas para mostrar opciones de cobertura.',
    type: 'MotionProviderGrid',
    scope: 'system',
    category: 'Información',
    defaultProps: {
      title: 'COMPAÑÍAS LÍDERES AUTORIZADAS',
      subtitle: 'Aceptadas oficialmente por Extranjería y Consulados',
    },
  },
  {
    id: 'steps-universal',
    name: 'Comparativa de opciones',
    description: 'Dos alternativas enfrentadas para explicar una decisión.',
    type: 'MotionComparisonCard',
    scope: 'system',
    category: 'Información',
    defaultProps: {
      title: '¿QUÉ OPCIÓN TE CONVIENE?',
      wrongOptionTitle: 'Opción básica',
      wrongOptionDesc: 'Puede dejar fuera coberturas importantes para tu trámite.',
      correctOptionTitle: 'Opción completa',
      correctOptionDesc: 'Incluye la protección y documentación que necesitas.',
    },
  },
  {
    id: 'testimonial-universal',
    name: 'Sello de garantía',
    description: 'Garantía destacada con validación y cobertura editable.',
    type: 'MotionTrustBadge',
    scope: 'system',
    category: 'Confianza',
    defaultProps: {
      title: 'PÓLIZA 100% VÁLIDA PARA VISADO',
      subtitle: 'Sin Copagos · Cobertura Completa · Repatriación Incluida',
      highlight: 'GARANTÍA CONSULAR',
      verifiedLabel: 'VERIFICADO PARA EXTRANJERÍA',
    },
  },
  {
    id: 'comparison-universal',
    name: 'Comparativa genérica',
    description: 'Dos alternativas enfrentadas con estructura editable.',
    type: 'MotionComparisonCard',
    scope: 'system',
    category: 'Información',
    defaultProps: {
      title: '¿SEGURO DE VIAJE O SEGURO DE VISADO?',
      wrongOptionTitle: 'Seguro de Viaje Común',
      wrongOptionDesc: 'Denegación de visado: no cumple requisitos consulares ni incluye red médica completa.',
      correctOptionTitle: 'Seguro VitaBlue Extranjería',
      correctOptionDesc: 'Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
    },
  },
  {
    id: 'legal-universal',
    name: 'Validación de póliza',
    description: 'Sello compacto para destacar condiciones y validez.',
    type: 'MotionTrustBadge',
    scope: 'system',
    category: 'Legal',
    defaultProps: {
      title: 'CONDICIONES CLARAS',
      subtitle: 'Consulta coberturas, límites y documentación antes de contratar.',
      highlight: 'INFORMACIÓN VERIFICADA',
      verifiedLabel: 'LISTO PARA REVISAR',
    },
  },
] satisfies BlockCatalogItem[];

export const COMPANY_BLOCK_CATALOG = [
  {
    id: 'hero-company',
    name: 'Asesora de seguro médico',
    description: 'Contacto VitaBlue orientado a la captación de seguros médicos.',
    type: 'MotionAdvisorCard',
    scope: 'organization',
    category: 'Seguros',
    defaultProps: {
      name: 'Sofía',
      role: 'Especialista en seguros médicos',
      badge: 'ASESORA VITABLUE · EN DIRECTO',
      message: 'Encuentra una póliza médica que encaje contigo y con los requisitos de tu trámite.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
      whatsAppText: 'Hablar con una asesora',
    },
  },
  {
    id: 'saving-company',
    name: 'Bloque de ahorro',
    description: 'Propuesta de valor con ahorro y acción principal.',
    type: 'MotionTrustBadge',
    scope: 'organization',
    category: 'Captación',
    defaultProps: {
      title: 'AHORRA EN TU SEGURO MÉDICO',
      subtitle: 'Compara opciones y encuentra una cobertura a tu medida.',
      highlight: 'AHORRO DESTACADO',
      verifiedLabel: 'COTIZACIÓN SIN COMPROMISO',
    },
  },
  {
    id: 'coverage-company',
    name: 'Comparador de coberturas',
    description: 'Comparación de coberturas de seguros.',
    type: 'MotionComparisonCard',
    scope: 'organization',
    category: 'Comparación',
    defaultProps: {
      title: 'COMPARA TUS COBERTURAS',
      wrongOptionTitle: 'Cobertura limitada',
      wrongOptionDesc: 'Menos servicios y más límites cuando necesitas atención.',
      correctOptionTitle: 'Cobertura completa',
      correctOptionDesc: 'Más protección, asistencia y tranquilidad para tu día a día.',
    },
  },
  {
    id: 'confidence-company',
    name: 'Banner de confianza VitaBlue',
    description: 'Prueba social y garantías de la marca.',
    type: 'MotionTrustBadge',
    scope: 'organization',
    category: 'Confianza',
    defaultProps: {
      title: 'CONFÍA EN VITABLUE',
      subtitle: 'Te acompañamos con coberturas transparentes y asistencia experta.',
      highlight: 'MARCA DE CONFIANZA',
      verifiedLabel: 'ASESORAMIENTO EXPERTO',
    },
  },
  {
    id: 'advisor-company',
    name: 'CTA de asesoría',
    description: 'Contacto directo con una asesora.',
    type: 'MotionAdvisorCard',
    scope: 'organization',
    category: 'Captación',
    defaultProps: {
      name: 'Sofía',
      role: 'Asesora de seguros',
      badge: 'ATENCIÓN PERSONALIZADA',
      message: 'Cuéntame qué necesitas y te ayudo a encontrar la mejor opción.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
      whatsAppText: 'Contactar',
    },
  },
  {
    id: 'providers-company',
    name: 'Bloque de aseguradoras asociadas',
    description: 'Marcas y proveedores integrados en una composición.',
    type: 'MotionProviderGrid',
    scope: 'organization',
    category: 'Seguros',
    defaultProps: {
      title: 'ASEGURADORAS ASOCIADAS',
      subtitle: 'Elige entre proveedores integrados y autorizados.',
    },
  },
] satisfies BlockCatalogItem[];

export const BLOCK_CATALOGS: Record<
  Exclude<BlockScope, 'user'>,
  readonly BlockCatalogItem[]
> = {
  system: UNIVERSAL_BLOCK_CATALOG,
  organization: COMPANY_BLOCK_CATALOG,
};
