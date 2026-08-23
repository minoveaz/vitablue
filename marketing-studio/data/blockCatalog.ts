import { ImageBlockType } from '../types/imageStudio';

export type BlockScope = 'system' | 'organization' | 'user';

export type BlockAspect = 'square' | 'portrait' | 'story' | 'landscape';
export type BlockPropType = 'text' | 'textarea' | 'url' | 'number' | 'color' | 'select';

export interface BlockEditableProp {
  key: string;
  label: string;
  type: BlockPropType;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: ReadonlyArray<{ label: string; value: string }>;
}

export interface BlockResponsiveMetadata {
  supportedAspects: readonly BlockAspect[];
  /** Whether text and columns should reflow when the layer is resized. */
  layout: 'fluid' | 'stacked' | 'compact';
  safeArea: 'standard' | 'story';
}

export interface BlockCatalogItem {
  id: string;
  name: string;
  description: string;
  type: ImageBlockType;
  scope: Exclude<BlockScope, 'user'>;
  category: string;
  /** Props shared by the catalog renderer and the inserted canvas layer. */
  defaultProps: Record<string, unknown>;
  /** Aspect families in which the composition is designed to remain legible. */
  supportedAspects?: readonly BlockAspect[];
  /** Alias kept explicit for consumers building format pickers. */
  aspectCompatibility?: readonly BlockAspect[];
  responsive?: BlockResponsiveMetadata;
  editableProps?: readonly BlockEditableProp[];
  defaultSize?: { width: number; height: number };
}

export const BLOCK_SCOPE_OPTIONS: ReadonlyArray<{
  id: BlockScope;
  label: string;
}> = [
  { id: 'system', label: 'Universal' },
  { id: 'organization', label: 'Empresa' },
  { id: 'user', label: 'Míos' },
];

const UNIVERSAL_BLOCK_CATALOG_BASE = [
  {
    id: 'hero-universal',
    name: 'Tarjeta de especialista',
    description: 'Contacto directo con una especialista y llamada a la acción.',
    type: 'MotionAdvisorCard',
    scope: 'system',
    category: 'Conversión',
    defaultProps: {
      name: 'Sofía',
      role: 'Especialista en soluciones',
      badge: 'ESPECIALISTA ASIGNADA · EN DIRECTO',
      message: 'Te ayudo a comparar alternativas y elegir con información clara.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
      whatsAppText: 'Hablar con una especialista',
    },
  },
  {
    id: 'benefits-universal',
    name: 'Red de proveedores',
    description: 'Cuadrícula de proveedores y alternativas para mostrar opciones.',
    type: 'MotionProviderGrid',
    scope: 'system',
    category: 'Información',
    defaultProps: {
      title: 'PROVEEDORES Y OPCIONES DESTACADAS',
      subtitle: 'Alternativas seleccionadas para ayudarte a decidir',
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
      wrongOptionDesc: 'Puede quedarse corta para lo que necesitas.',
      correctOptionTitle: 'Opción completa',
      correctOptionDesc: 'Incluye la protección y servicios que necesitas.',
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
      title: 'PROTECCIÓN CLARA Y TRANSPARENTE',
      subtitle: 'Condiciones visibles · Opciones comparables · Acompañamiento humano',
      highlight: 'DECISIÓN INFORMADA',
      verifiedLabel: 'CONTENIDO VERIFICADO',
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
      title: '¿QUÉ OPCIÓN TE CONVIENE?',
      wrongOptionTitle: 'Opción estándar',
      wrongOptionDesc: 'Puede dejar fuera servicios importantes para tu situación.',
      correctOptionTitle: 'Opción completa',
      correctOptionDesc: 'Incluye una protección amplia y acompañamiento continuo.',
    },
  },
  {
    id: 'legal-universal',
    name: 'Validación de condiciones',
    description: 'Sello compacto para destacar condiciones y claridad.',
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

const COMPANY_BLOCK_CATALOG_BASE = [
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

const UNIVERSAL_MARKETING_BLOCKS: BlockCatalogItem[] = [
  {
    id: 'brand-hero-neutral',
    name: 'Hero de marca neutral',
    description: 'Cabecera editorial con mensaje, contexto y llamada a la acción.',
    type: 'MarketingBrandHero',
    scope: 'system',
    category: 'Conversión',
    defaultProps: {
      eyebrow: 'ASESORAMIENTO CLARO',
      title: 'Encuentra una opción que encaje contigo',
      description: 'Información sencilla y acompañamiento humano para tomar una decisión con confianza.',
      ctaText: 'Ver opciones',
    },
    supportedAspects: ['square', 'portrait', 'story', 'landscape'],
    responsive: { supportedAspects: ['square', 'portrait', 'story', 'landscape'], layout: 'stacked', safeArea: 'standard' },
    editableProps: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'ctaText', label: 'Texto CTA', type: 'text' },
    ],
    defaultSize: { width: 720, height: 520 },
  },
  {
    id: 'section-intro-neutral',
    name: 'Intro de sección',
    description: 'Jerarquía tipográfica para introducir una idea sin tono de producto.',
    type: 'MarketingSectionIntro',
    scope: 'system',
    category: 'Editorial',
    defaultProps: {
      eyebrow: 'CÓMO TE AYUDAMOS',
      title: 'Una explicación clara antes de decidir',
      description: 'Presenta el contexto con una jerarquía consistente y fácil de leer.',
      align: 'center',
    },
    supportedAspects: ['square', 'portrait', 'story', 'landscape'],
    responsive: { supportedAspects: ['square', 'portrait', 'story', 'landscape'], layout: 'fluid', safeArea: 'standard' },
    editableProps: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'align', label: 'Alineación', type: 'select', options: [{ label: 'Centro', value: 'center' }, { label: 'Izquierda', value: 'left' }] },
    ],
    defaultSize: { width: 620, height: 300 },
  },
  {
    id: 'testimonial-neutral',
    name: 'Testimonio neutral',
    description: 'Prueba social editable con valoración, autor y contexto.',
    type: 'MarketingTestimonial',
    scope: 'system',
    category: 'Confianza',
    defaultProps: {
      comment: 'El proceso fue sencillo y pude decidir con toda la información.',
      author: 'Sarah Jenkins',
      meta: 'Cliente VitaBlue',
      stars: 5,
    },
    supportedAspects: ['square', 'portrait', 'story'],
    responsive: { supportedAspects: ['square', 'portrait', 'story'], layout: 'fluid', safeArea: 'standard' },
    editableProps: [
      { key: 'comment', label: 'Testimonio', type: 'textarea' },
      { key: 'author', label: 'Autor', type: 'text' },
      { key: 'meta', label: 'Contexto', type: 'text' },
      { key: 'stars', label: 'Estrellas', type: 'number', min: 1, max: 5 },
    ],
    defaultSize: { width: 360, height: 300 },
  },
  {
    id: 'feature-grid-neutral',
    name: 'Cuadrícula de beneficios',
    description: 'Tres beneficios editoriales para resumir una propuesta de valor.',
    type: 'MarketingFeatureGrid',
    scope: 'system',
    category: 'Información',
    defaultProps: {
      eyebrow: 'PUNTOS CLAVE',
      title: 'Lo importante, en un vistazo',
      items: ['Información transparente', 'Opciones comparables', 'Acompañamiento humano'],
    },
    supportedAspects: ['square', 'portrait', 'landscape'],
    responsive: { supportedAspects: ['square', 'portrait', 'landscape'], layout: 'stacked', safeArea: 'standard' },
    editableProps: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'items', label: 'Beneficios (uno por línea)', type: 'textarea' },
    ],
    defaultSize: { width: 720, height: 420 },
  },
  {
    id: 'promo-card-neutral',
    name: 'Tarjeta promocional neutral',
    description: 'Tarjeta compacta para presentar una propuesta sin datos de póliza.',
    type: 'MarketingPromoCard',
    scope: 'system',
    category: 'Conversión',
    defaultProps: {
      provider: 'VitaBlue',
      productName: 'Una opción más clara',
      badgeText: 'SIN COMPROMISO',
      visaLabel: 'ACOMPAÑAMIENTO HUMANO',
      features: ['Compara alternativas', 'Decide con calma'],
    },
    supportedAspects: ['square', 'portrait', 'story'],
    responsive: { supportedAspects: ['square', 'portrait', 'story'], layout: 'compact', safeArea: 'standard' },
    editableProps: [
      { key: 'provider', label: 'Marca', type: 'text' },
      { key: 'productName', label: 'Propuesta', type: 'text' },
      { key: 'badgeText', label: 'Badge', type: 'text' },
      { key: 'features', label: 'Puntos (uno por línea)', type: 'textarea' },
    ],
    defaultSize: { width: 400, height: 300 },
  },
];

const COMPANY_MARKETING_BLOCKS: BlockCatalogItem[] = [
  {
    id: 'product-hero-insurance',
    name: 'Hero de producto asegurador',
    description: 'Cabecera VitaBlue con badges, acciones y beneficios de una póliza.',
    type: 'InsuranceProductHero',
    scope: 'organization',
    category: 'Seguros',
    defaultProps: {
      badges: ['Seguro médico para estudiantes', 'Visado garantizado'],
      title: 'Encuentra una cobertura que cumple con tu visado',
      description: 'Comparamos alternativas para ayudarte a decidir con información sencilla.',
      primaryAction: 'Calcular mi seguro',
      secondaryAction: 'Hablar con un asesor',
      highlights: ['Certificado en 24 horas', 'Repatriación incluida'],
    },
    supportedAspects: ['portrait', 'story', 'landscape'],
    responsive: { supportedAspects: ['portrait', 'story', 'landscape'], layout: 'stacked', safeArea: 'story' },
    editableProps: [
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'primaryAction', label: 'CTA principal', type: 'text' },
      { key: 'secondaryAction', label: 'CTA secundario', type: 'text' },
      { key: 'highlights', label: 'Beneficios (uno por línea)', type: 'textarea' },
    ],
    defaultSize: { width: 760, height: 620 },
  },
  {
    id: 'coverage-grid-insurance',
    name: 'Cuadrícula de coberturas',
    description: 'Tres coberturas VitaBlue con icono, título y explicación.',
    type: 'InsuranceCoverageGrid',
    scope: 'organization',
    category: 'Seguros',
    defaultProps: {
      eyebrow: 'COBERTURAS PRINCIPALES',
      title: 'Todo lo que incluye tu póliza',
      items: [
        { title: 'Hospitalización completa', description: 'Especialistas, pruebas y hospitalización en una red amplia.' },
        { title: 'Asistencia 24 horas', description: 'Atención urgente y soporte humano cuando lo necesitas.' },
        { title: 'Repatriación sanitaria', description: 'Traslado médico incluido para tu situación.' },
      ],
    },
    supportedAspects: ['square', 'portrait', 'landscape'],
    responsive: { supportedAspects: ['square', 'portrait', 'landscape'], layout: 'stacked', safeArea: 'standard' },
    editableProps: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'items', label: 'Coberturas (JSON)', type: 'textarea' },
    ],
    defaultSize: { width: 760, height: 520 },
  },
  {
    id: 'testimonials-grid-insurance',
    name: 'Opiniones de asegurados',
    description: 'Prueba social VitaBlue en formato de tarjetas adaptable.',
    type: 'InsuranceTestimonialGrid',
    scope: 'organization',
    category: 'Confianza',
    defaultProps: {
      eyebrow: 'OPINIONES REALES',
      title: 'La experiencia de quienes ya confían en nosotros',
      items: [
        { author: 'María García', meta: 'Asegurada VitaBlue', comment: 'Un asesoramiento claro, rápido y muy humano.', stars: 5 },
        { author: 'Carlos López', meta: 'Cliente desde 2024', comment: 'Encontré la póliza que necesitaba sin llamadas comerciales.', stars: 5 },
      ],
    },
    supportedAspects: ['portrait', 'story', 'landscape'],
    responsive: { supportedAspects: ['portrait', 'story', 'landscape'], layout: 'stacked', safeArea: 'standard' },
    editableProps: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'items', label: 'Opiniones (JSON)', type: 'textarea' },
    ],
    defaultSize: { width: 760, height: 560 },
  },
  {
    id: 'plan-comparison-insurance',
    name: 'Comparador de planes',
    description: 'Modalidades de seguro comparadas con una opción destacada.',
    type: 'InsurancePlanComparison',
    scope: 'organization',
    category: 'Comparación',
    defaultProps: {
      eyebrow: 'MODALIDADES',
      title: 'Compara tu protección',
      description: 'Tres alternativas para elegir con claridad.',
      plans: [
        { name: 'Seguro Básico', subtitle: 'Acceso esencial', description: 'Cobertura médica para el día a día.', priceText: 'Consultar' },
        { name: 'Seguro Completo', subtitle: 'Cobertura amplia', description: 'Hospitalización y especialistas incluidos.', priceText: 'Recomendado', isFeatured: true },
        { name: 'Seguro Premium', subtitle: 'Máxima libertad', description: 'Reembolso y elección de centros.', priceText: 'Consultar' },
      ],
    },
    supportedAspects: ['portrait', 'landscape'],
    responsive: { supportedAspects: ['portrait', 'landscape'], layout: 'stacked', safeArea: 'standard' },
    editableProps: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'plans', label: 'Planes (JSON)', type: 'textarea' },
    ],
    defaultSize: { width: 760, height: 620 },
  },
  {
    id: 'product-card-insurance',
    name: 'Tarjeta de seguro',
    description: 'Tarjeta de producto VitaBlue con características, precio y CTA.',
    type: 'InsuranceProductCard',
    scope: 'organization',
    category: 'Seguros',
    defaultProps: {
      title: 'Sanitas Más Salud',
      tagline: 'Cobertura médica completa',
      description: 'Hospitalización, especialistas y servicios digitales en una póliza completa.',
      features: ['Hospitalización incluida', 'Blua Digital'],
      price: 'Desde 35€/mes',
      badge: 'Más vendido',
    },
    supportedAspects: ['square', 'portrait', 'story'],
    responsive: { supportedAspects: ['square', 'portrait', 'story'], layout: 'compact', safeArea: 'standard' },
    editableProps: [
      { key: 'title', label: 'Producto', type: 'text' },
      { key: 'tagline', label: 'Subtítulo', type: 'text' },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'features', label: 'Características (uno por línea)', type: 'textarea' },
      { key: 'price', label: 'Precio', type: 'text' },
      { key: 'badge', label: 'Badge', type: 'text' },
    ],
    defaultSize: { width: 420, height: 520 },
  },
  {
    id: 'trust-bar-insurance',
    name: 'Barra de confianza',
    description: 'Tres señales de confianza para reforzar una creatividad aseguradora.',
    type: 'InsuranceTrustBar',
    scope: 'organization',
    category: 'Confianza',
    defaultProps: {
      items: [
        { title: 'Homologación oficial', description: 'Pólizas autorizadas y revisadas.' },
        { title: 'Gestión en 24 horas', description: 'Recibe tu documentación rápidamente.' },
        { title: 'Soporte continuo', description: 'Te acompañamos durante todo el proceso.' },
      ],
    },
    supportedAspects: ['square', 'portrait', 'landscape'],
    responsive: { supportedAspects: ['square', 'portrait', 'landscape'], layout: 'stacked', safeArea: 'standard' },
    editableProps: [{ key: 'items', label: 'Señales (JSON)', type: 'textarea' }],
    defaultSize: { width: 760, height: 230 },
  },
  {
    id: 'provider-bar-insurance',
    name: 'Aseguradoras homologadas',
    description: 'Franja de proveedores asociados para reforzar credibilidad.',
    type: 'InsuranceProviderBar',
    scope: 'organization',
    category: 'Seguros',
    defaultProps: {
      eyebrow: 'ASEGURADORAS OFICIALES HOMOLOGADAS',
      providers: ['Sanitas', 'Adeslas'],
    },
    supportedAspects: ['square', 'portrait', 'landscape'],
    responsive: { supportedAspects: ['square', 'portrait', 'landscape'], layout: 'fluid', safeArea: 'standard' },
    editableProps: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'providers', label: 'Proveedores (uno por línea)', type: 'textarea' },
    ],
    defaultSize: { width: 760, height: 220 },
  },
  {
    id: 'transparency-insurance',
    name: 'Transparencia de cobertura',
    description: 'Incluye y exclusiones con la misma jerarquía visual.',
    type: 'InsuranceTransparency',
    scope: 'organization',
    category: 'Legal',
    defaultProps: {
      title: 'Seguro para visado de estudiante extranjero',
      description: 'Comprueba lo que cubre cada póliza antes de contratar.',
      inclusions: ['Sin copagos por acto médico', 'Repatriación sanitaria incluida', 'Cobertura activa desde el primer día'],
      exclusions: ['Tratamientos estéticos', 'Enfermedades preexistentes no declaradas'],
    },
    supportedAspects: ['portrait', 'story', 'landscape'],
    responsive: { supportedAspects: ['portrait', 'story', 'landscape'], layout: 'stacked', safeArea: 'standard' },
    editableProps: [
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'inclusions', label: 'Incluye (uno por línea)', type: 'textarea' },
      { key: 'exclusions', label: 'No cubre (uno por línea)', type: 'textarea' },
    ],
    defaultSize: { width: 760, height: 560 },
  },
  {
    id: 'faq-insurance',
    name: 'Preguntas frecuentes',
    description: 'Respuestas cortas para resolver objeciones antes de contratar.',
    type: 'InsuranceFaq',
    scope: 'organization',
    category: 'Información',
    defaultProps: {
      eyebrow: 'PREGUNTAS FRECUENTES',
      title: 'Resolvemos tus dudas antes de contratar',
      items: [
        { question: '¿El seguro cumple los requisitos de mi visado?', answer: 'Sí. Mostramos las condiciones relevantes de cada póliza.' },
        { question: '¿Puedo recibir ayuda antes de decidir?', answer: 'Sí, un asesor puede resolver tus dudas sin compromiso.' },
      ],
    },
    supportedAspects: ['portrait', 'story', 'landscape'],
    responsive: { supportedAspects: ['portrait', 'story', 'landscape'], layout: 'stacked', safeArea: 'story' },
    editableProps: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'items', label: 'Preguntas (JSON)', type: 'textarea' },
    ],
    defaultSize: { width: 760, height: 520 },
  },
  {
    id: 'advisor-cta-insurance',
    name: 'CTA de asesoría',
    description: 'Cierre VitaBlue con acompañamiento humano y acción de contacto.',
    type: 'InsuranceAdvisorCta',
    scope: 'organization',
    category: 'Captación',
    defaultProps: {
      title: '¿Necesitas ayuda para elegir tu seguro?',
      description: 'Nuestros asesores te orientan de forma gratuita y sin compromiso.',
      ctaText: 'Hablar con un asesor',
    },
    supportedAspects: ['square', 'portrait', 'story', 'landscape'],
    responsive: { supportedAspects: ['square', 'portrait', 'story', 'landscape'], layout: 'stacked', safeArea: 'standard' },
    editableProps: [
      { key: 'title', label: 'Título', type: 'textarea' },
      { key: 'description', label: 'Descripción', type: 'textarea' },
      { key: 'ctaText', label: 'CTA', type: 'text' },
    ],
    defaultSize: { width: 720, height: 320 },
  },
];

const ALL_ASPECTS: readonly BlockAspect[] = ['square', 'portrait', 'story', 'landscape'];
const DEFAULT_BLOCK_SIZES: Partial<Record<ImageBlockType, { width: number; height: number }>> = {
  MotionAdvisorCard: { width: 380, height: 260 },
  MotionTrustBadge: { width: 420, height: 240 },
  MotionProviderGrid: { width: 420, height: 260 },
  MotionComparisonCard: { width: 420, height: 300 },
  GlassCardSurface: { width: 420, height: 240 },
  GeometricShape: { width: 200, height: 200 },
};

const enrichCatalog = (items: readonly BlockCatalogItem[]): BlockCatalogItem[] =>
  items.map((item) => {
    const supportedAspects = item.supportedAspects ?? item.responsive?.supportedAspects ?? ALL_ASPECTS;
    return {
      ...item,
      supportedAspects,
      aspectCompatibility: item.aspectCompatibility ?? supportedAspects,
      responsive: item.responsive ?? { supportedAspects, layout: 'fluid', safeArea: 'standard' },
      editableProps: item.editableProps ?? [],
      defaultSize: item.defaultSize ?? DEFAULT_BLOCK_SIZES[item.type] ?? { width: 420, height: 280 },
    };
  });

export const UNIVERSAL_BLOCK_CATALOG = enrichCatalog([
  ...UNIVERSAL_BLOCK_CATALOG_BASE,
  ...UNIVERSAL_MARKETING_BLOCKS,
]);

export const COMPANY_BLOCK_CATALOG = enrichCatalog([
  ...COMPANY_BLOCK_CATALOG_BASE,
  ...COMPANY_MARKETING_BLOCKS,
]);

export const BLOCK_CATALOGS: Record<
  Exclude<BlockScope, 'user'>,
  readonly BlockCatalogItem[]
> = {
  system: UNIVERSAL_BLOCK_CATALOG,
  organization: COMPANY_BLOCK_CATALOG,
};

export const getBlockCatalogItem = (blockType: ImageBlockType): BlockCatalogItem | undefined =>
  Object.values(BLOCK_CATALOGS).flat().find((block) => block.type === blockType);

export const isBlockCompatibleWithAspect = (block: BlockCatalogItem, aspect: BlockAspect): boolean =>
  (block.aspectCompatibility ?? block.supportedAspects ?? ALL_ASPECTS).includes(aspect);

export const getBlockAspect = (preset: Pick<{ width: number; height: number }, 'width' | 'height'>): BlockAspect => {
  const ratio = preset.width / preset.height;
  if (ratio <= 0.7) return 'story';
  if (ratio < 0.9) return 'portrait';
  if (ratio <= 1.1) return 'square';
  return 'landscape';
};

export const isBlockCompatibleWithPreset = (
  block: BlockCatalogItem,
  preset: Pick<{ width: number; height: number }, 'width' | 'height'>,
): boolean => isBlockCompatibleWithAspect(block, getBlockAspect(preset));
