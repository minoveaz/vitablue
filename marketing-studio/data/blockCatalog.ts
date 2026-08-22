import { ImageBlockType } from '../types/imageStudio';

export type BlockScope = 'system' | 'organization' | 'user';

export type BlockPreviewVariant =
  | 'hero'
  | 'grid'
  | 'steps'
  | 'testimonial'
  | 'comparison'
  | 'legal'
  | 'metric'
  | 'trust'
  | 'advisor'
  | 'providers';

export interface BlockCatalogItem {
  id: string;
  name: string;
  description: string;
  type: ImageBlockType;
  scope: Exclude<BlockScope, 'user'>;
  category: string;
  preview: BlockPreviewVariant;
  previewLabel: string;
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
    name: 'Hero con titular y CTA',
    description: 'Composición de apertura con jerarquía y llamada a la acción.',
    type: 'MotionAdvisorCard',
    scope: 'system',
    category: 'Conversión',
    preview: 'hero',
    previewLabel: 'Titular + acción',
  },
  {
    id: 'benefits-universal',
    name: 'Beneficios en tres columnas',
    description: 'Bloque multicapa para presentar ventajas de forma escaneable.',
    type: 'MotionProviderGrid',
    scope: 'system',
    category: 'Información',
    preview: 'grid',
    previewLabel: '3 beneficios',
  },
  {
    id: 'steps-universal',
    name: 'Proceso en pasos',
    description: 'Recorrido visual numerado para explicar un proceso.',
    type: 'MotionComparisonCard',
    scope: 'system',
    category: 'Procesos',
    preview: 'steps',
    previewLabel: 'Proceso guiado',
  },
  {
    id: 'testimonial-universal',
    name: 'Testimonio con valoración',
    description: 'Cita, valoración y contexto preparados para editar.',
    type: 'MotionTrustBadge',
    scope: 'system',
    category: 'Prueba social',
    preview: 'testimonial',
    previewLabel: 'Cita + valoración',
  },
  {
    id: 'comparison-universal',
    name: 'Comparativa genérica',
    description: 'Dos alternativas enfrentadas con estructura editable.',
    type: 'MotionComparisonCard',
    scope: 'system',
    category: 'Información',
    preview: 'comparison',
    previewLabel: 'Dos alternativas',
  },
  {
    id: 'legal-universal',
    name: 'Aviso legal estructurado',
    description: 'Jerarquía compacta para notas y condiciones.',
    type: 'MotionTrustBadge',
    scope: 'system',
    category: 'Legal',
    preview: 'legal',
    previewLabel: 'Notas y condiciones',
  },
] satisfies BlockCatalogItem[];

export const COMPANY_BLOCK_CATALOG = [
  {
    id: 'hero-company',
    name: 'Hero de seguro médico',
    description: 'Apertura VitaBlue orientada a captación de seguros.',
    type: 'MotionAdvisorCard',
    scope: 'organization',
    category: 'Seguros',
    preview: 'hero',
    previewLabel: 'Seguro médico',
  },
  {
    id: 'saving-company',
    name: 'Bloque de ahorro',
    description: 'Propuesta de valor con ahorro y acción principal.',
    type: 'MotionTrustBadge',
    scope: 'organization',
    category: 'Captación',
    preview: 'metric',
    previewLabel: 'Ahorro destacado',
  },
  {
    id: 'coverage-company',
    name: 'Comparador de coberturas',
    description: 'Comparación de coberturas de seguros.',
    type: 'MotionComparisonCard',
    scope: 'organization',
    category: 'Comparación',
    preview: 'comparison',
    previewLabel: 'Coberturas',
  },
  {
    id: 'confidence-company',
    name: 'Banner de confianza VitaBlue',
    description: 'Prueba social y garantías de la marca.',
    type: 'MotionTrustBadge',
    scope: 'organization',
    category: 'Confianza',
    preview: 'trust',
    previewLabel: 'Confianza VitaBlue',
  },
  {
    id: 'advisor-company',
    name: 'CTA de asesoría',
    description: 'Contacto directo con una asesora.',
    type: 'MotionAdvisorCard',
    scope: 'organization',
    category: 'Captación',
    preview: 'advisor',
    previewLabel: 'Habla con una asesora',
  },
  {
    id: 'providers-company',
    name: 'Bloque de aseguradoras asociadas',
    description: 'Marcas y proveedores integrados en una composición.',
    type: 'MotionProviderGrid',
    scope: 'organization',
    category: 'Seguros',
    preview: 'providers',
    previewLabel: 'Red de aseguradoras',
  },
] satisfies BlockCatalogItem[];

export const BLOCK_CATALOGS: Record<
  Exclude<BlockScope, 'user'>,
  readonly BlockCatalogItem[]
> = {
  system: UNIVERSAL_BLOCK_CATALOG,
  organization: COMPANY_BLOCK_CATALOG,
};
