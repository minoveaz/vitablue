import {
  ELEMENT_CATALOG_CATEGORY_IDS,
  ElementCatalogCategoryId,
  ElementCatalogFilters,
  ElementCatalogMetadata,
  ElementPreviewMetadata,
  ElementCatalogResource,
  ElementResourceKind,
  ElementResourceLicense,
  ElementResourceScope,
  TraditionalShapeType,
} from '../types/elementCatalog';
import { UNIVERSAL_ICON_CATALOG, UniversalIconCatalogItem } from './elementIcons';
import { ELEMENT_SHAPE_SECTIONS, ShapeCatalogItem } from './elementShapes';
import { ELEMENT_PRESETS, ElementPresetItem } from './elementsPresets';

const UNDRAW_DAY_DREAMING_URL = '/universal-assets/day-dreaming.svg';

export interface ElementCatalogCategory {
  id: ElementCatalogCategoryId;
  label: string;
  shortLabel: string;
  description: string;
}

export const ELEMENT_CATALOG_CATEGORIES: ElementCatalogCategory[] = [
  { id: 'forms_lines', label: 'Formas y líneas', shortLabel: 'Formas', description: 'Geometría, flechas y divisores' },
  { id: 'icons_symbols', label: 'Iconos y símbolos', shortLabel: 'Iconos', description: 'Símbolos visuales reutilizables' },
  { id: 'frames_masks', label: 'Marcos y máscaras', shortLabel: 'Marcos', description: 'Contenedores y recortes visuales' },
  { id: 'illustrations', label: 'Ilustraciones', shortLabel: 'Ilustraciones', description: 'Recursos gráficos y escenas' },
  { id: 'backgrounds_surfaces', label: 'Fondos y superficies', shortLabel: 'Fondos', description: 'Fondos, paneles y superficies' },
  { id: 'badges_labels', label: 'Badges y etiquetas', shortLabel: 'Badges', description: 'Estados, sellos y etiquetas' },
  { id: 'buttons_ctas', label: 'Botones y CTAs', shortLabel: 'Botones', description: 'Acciones y llamadas a la acción' },
  { id: 'reusable_components', label: 'Componentes reutilizables', shortLabel: 'Componentes', description: 'Bloques listos para reutilizar' },
  { id: 'saved_elements', label: 'Elementos guardados', shortLabel: 'Guardados', description: 'Recursos guardados por el usuario' },
];

const BUILT_IN_LICENSE: ElementResourceLicense = {
  id: 'built-in',
  label: 'Incluida',
  allowsCommercialUse: true,
  requiresAttribution: false,
};

const ORGANIZATION_LICENSE: ElementResourceLicense = {
  id: 'organization-owned',
  label: 'Uso de la organización',
  allowsCommercialUse: true,
  requiresAttribution: false,
};

const LEGACY_CATEGORY_MAP: Record<ElementPresetItem['category'], ElementCatalogCategoryId> = {
  shapes: 'forms_lines',
  trust_stamps: 'badges_labels',
  ctas: 'buttons_ctas',
  surfaces: 'backgrounds_surfaces',
  illustrations: 'illustrations',
};

const LEGACY_KIND_MAP: Record<ElementPresetItem['category'], ElementResourceKind> = {
  shapes: 'shape',
  trust_stamps: 'badge',
  ctas: 'button',
  surfaces: 'surface',
  illustrations: 'illustration',
};

export type StaticElementCatalogPayload =
  | { source: 'shape'; item: ShapeCatalogItem }
  | { source: 'icon'; item: UniversalIconCatalogItem }
  | { source: 'preset'; preset: ElementPresetItem }
  | { source: 'universal'; blockType: import('../types/imageStudio').ImageBlockType; defaultProps: Record<string, unknown> }
  | { source: 'external'; imageUrl: string };

const getPresetPreview = (preset: ElementPresetItem): ElementPreviewMetadata => {
  if (preset.blockType === 'GeometricShape') {
    return {
      renderer: 'graphic',
      shapeType: String(preset.defaultProps.shapeType ?? 'rectangle') as TraditionalShapeType,
      fill: String(preset.defaultProps.fill ?? '#005F73'),
      stroke: String(preset.defaultProps.stroke ?? 'transparent'),
      strokeWidth: Number(preset.defaultProps.strokeWidth ?? 0),
      borderRadius: Number(preset.defaultProps.borderRadius ?? 0),
    };
  }
  if (preset.category === 'illustrations') {
    return {
      renderer: 'illustration',
      illustrationId: String(preset.defaultProps.illustrationId ?? ''),
    };
  }
  if (preset.category === 'ctas') {
    return {
      renderer: 'label',
      variant: 'button',
      text: String(preset.defaultProps.ctaText ?? preset.title),
    };
  }
  if (preset.category === 'trust_stamps') {
    return {
      renderer: 'label',
      variant: 'badge',
      text: String(
        preset.defaultProps.verifiedLabel
          ?? preset.defaultProps.highlight
          ?? preset.defaultProps.badge
          ?? preset.title,
      ),
    };
  }
  if (preset.category === 'surfaces') {
    return {
      renderer: 'surface',
      variant: String(preset.defaultProps.variant ?? 'default'),
    };
  }
  return { renderer: 'fallback', label: preset.title };
};

export function getDefaultPresetMetadata(preset: ElementPresetItem): ElementCatalogMetadata {
  const isUniversal = preset.category === 'shapes';
  const scope: ElementResourceScope = isUniversal ? 'system' : 'organization';

  return {
    kind: LEGACY_KIND_MAP[preset.category],
    category: LEGACY_CATEGORY_MAP[preset.category],
    scope,
    organizationId: isUniversal ? undefined : 'vitablue',
    brandId: isUniversal ? undefined : 'vitablue',
    tags: [preset.category, preset.badge, preset.subCategory].filter((tag): tag is string => Boolean(tag)),
    license: isUniversal ? BUILT_IN_LICENSE : ORGANIZATION_LICENSE,
    editableFields: Object.keys(preset.defaultProps),
    lockedFields: [],
    supportedFormats: ['image', 'video'],
    version: 1,
    approvalStatus: 'approved',
    locked: false,
    recommended: Boolean(preset.badge),
    sourcePackage: isUniversal ? 'universal' : 'organization',
  };
}

export function normalizeElementPreset(
  preset: ElementPresetItem,
): ElementCatalogResource<ElementPresetItem> {
  const defaults = getDefaultPresetMetadata(preset);
  const metadata = preset.catalogMetadata;

  return {
    ...defaults,
    ...metadata,
    license: metadata?.license ?? defaults.license,
    tags: metadata?.tags ?? defaults.tags,
    editableFields: metadata?.editableFields ?? defaults.editableFields,
    lockedFields: metadata?.lockedFields ?? defaults.lockedFields,
    supportedFormats: metadata?.supportedFormats ?? defaults.supportedFormats,
    id: preset.id,
    title: preset.title,
    description: preset.description,
    resourceType: preset.blockType,
    preview: getPresetPreview(preset),
    payload: preset,
  };
}

const createUniversalShapeResource = (
  sectionTitle: string,
  item: ShapeCatalogItem,
): ElementCatalogResource<StaticElementCatalogPayload> => ({
  id: `system-${item.id}`,
  title: item.name,
  description: `${sectionTitle} de la biblioteca universal`,
  resourceType:
    item.kind === 'line'
      ? 'Línea'
      : item.kind === 'symbol'
        ? 'Símbolo'
        : item.kind === 'frame'
          ? 'Marco'
          : item.kind === 'mask'
            ? 'Máscara'
            : 'Forma',
  kind: item.kind,
  category: item.category,
  scope: 'system',
  tags: [sectionTitle, item.name, ...item.tags],
  license: BUILT_IN_LICENSE,
  editableFields: [
    'fill',
    'stroke',
    'strokeWidth',
    'width',
    'height',
    'borderRadius',
    ...(item.shapeType === 'polygon-parametric' ? ['sides'] : []),
    ...(item.shapeType === 'star-parametric' ? ['points', 'innerRadius'] : []),
  ],
  lockedFields: [],
  supportedFormats: ['image', 'video'],
  version: 1,
  approvalStatus: 'approved',
  locked: false,
  recommended: [
    'shape-circle',
    'shape-rounded-rect',
    'shape-star-5',
    'shape-arrow-right',
    'frame-rounded',
    'mask-blob',
  ].includes(item.id),
  sourcePackage: 'universal',
  preview: {
    renderer: 'graphic',
    shapeType: item.shapeType,
    fill: item.defaultFill,
    stroke: item.defaultStroke,
    strokeWidth: item.defaultStrokeWidth,
    borderRadius: item.defaultBorderRadius,
    sides: item.defaultSides,
    points: item.defaultPoints,
    innerRadius: item.defaultInnerRadius,
  },
  payload: { source: 'shape', item },
});

const createUniversalIconResource = (
  item: UniversalIconCatalogItem,
): ElementCatalogResource<StaticElementCatalogPayload> => ({
  id: `system-${item.id}`,
  title: item.name,
  description: 'Icono vectorial editable de la biblioteca universal',
  resourceType: 'Icono',
  kind: 'icon',
  category: 'icons_symbols',
  scope: 'system',
  tags: ['icono', item.section, item.name, ...item.tags],
  license: BUILT_IN_LICENSE,
  editableFields: ['stroke', 'strokeWidth', 'width', 'height'],
  lockedFields: [],
  supportedFormats: ['image', 'video'],
  version: 1,
  approvalStatus: 'approved',
  locked: false,
  recommended: ['check', 'heart', 'message', 'star', 'arrow-right'].includes(item.iconId),
  sourcePackage: 'universal',
  preview: {
    renderer: 'graphic',
    shapeType: `icon-${item.iconId}`,
    fill: 'transparent',
    stroke: '#FFFFFF',
    strokeWidth: 2,
  },
  payload: { source: 'icon', item },
});

const UNIVERSAL_COMPONENTS = [
  ['universal-badge-new', 'Badge Nuevo', 'badges_labels', 'badge', 'NUEVO'],
  ['universal-badge-verified', 'Badge Verificado', 'badges_labels', 'badge', 'VERIFICADO'],
  ['universal-badge-recommended', 'Badge Recomendado', 'badges_labels', 'badge', 'RECOMENDADO'],
  ['universal-badge-offer', 'Badge Oferta', 'badges_labels', 'badge', 'OFERTA'],
  ['universal-badge-status', 'Estado activo', 'badges_labels', 'badge', 'ACTIVO'],
  ['universal-badge-metric', 'Métrica destacada', 'badges_labels', 'badge', '4.9 / 5'],
  ['universal-badge-price', 'Precio desde', 'badges_labels', 'badge', 'DESDE 29 €'],
  ['universal-badge-trust', 'Sello de confianza', 'badges_labels', 'badge', 'SEGURO'],
  ['universal-badge-ribbon', 'Cinta de sección', 'badges_labels', 'badge', 'DESTACADO'],
  ['universal-badge-stamp', 'Sello circular', 'badges_labels', 'badge', 'TOP'],
  ['universal-cta-primary', 'CTA principal', 'buttons_ctas', 'button', 'Saber más'],
  ['universal-cta-secondary', 'CTA secundario', 'buttons_ctas', 'button', 'Ver opciones'],
  ['universal-card', 'Tarjeta de contenido', 'reusable_components', 'component', ''],
] as const;

const createUniversalComponentResource = (
  [id, title, category, kind, text]: (typeof UNIVERSAL_COMPONENTS)[number],
): ElementCatalogResource<StaticElementCatalogPayload> => {
  const isCard = id === 'universal-card';
  const blockType = isCard ? 'GlassCardSurface' : 'CustomText';
  const defaultProps = isCard
    ? { variant: 'teal', width: 420 }
    : { tag: kind === 'badge' ? 'badge' : 'p', text, badgeVariant: id.includes('ribbon') ? 'ribbon' : id.includes('stamp') ? 'stamp' : id.includes('status') || id.includes('trust') ? 'outline' : 'pill', textEffect: kind === 'button' ? 'box' : undefined, boxColor: kind === 'button' ? '#EE9B00' : undefined };
  return {
    id, title, description: 'Componente universal editable', resourceType: 'Componente universal',
    kind, category, scope: 'system', tags: ['universal', category], license: BUILT_IN_LICENSE,
    editableFields: Object.keys(defaultProps), lockedFields: [], supportedFormats: ['image', 'video'],
    version: 1, approvalStatus: 'approved', locked: false, recommended: true, sourcePackage: 'universal',
    preview: isCard ? { renderer: 'surface', variant: 'default' } : { renderer: 'label', variant: kind === 'badge' ? 'badge' : 'button', text },
    payload: { source: 'universal', blockType, defaultProps },
  };

};

const EXTERNAL_UNIVERSAL_RESOURCES: ElementCatalogResource<StaticElementCatalogPayload>[] = [
    {
      id: 'undraw-people',
      title: 'Personas colaborando',
      description: 'Ilustración universal de unDraw',
      resourceType: 'Ilustración SVG',
      kind: 'illustration',
      category: 'illustrations',
      scope: 'system',
      tags: ['undraw', 'personas', 'colaboración'],
      license: { id: 'custom', label: 'unDraw license', allowsCommercialUse: true, requiresAttribution: false },
      editableFields: ['imageUrl'], lockedFields: [], supportedFormats: ['image', 'video'],
      version: 1, approvalStatus: 'approved', locked: false, sourcePackage: 'universal',
      preview: { renderer: 'external', url: UNDRAW_DAY_DREAMING_URL, alt: 'Ilustración unDraw' },
      payload: { source: 'external', imageUrl: UNDRAW_DAY_DREAMING_URL },
    },
    {
      id: 'openmoji-grinning',
      title: 'Emoji sonriente',
      description: 'Símbolo universal de OpenMoji',
      resourceType: 'Símbolo SVG',
      kind: 'symbol',
      category: 'icons_symbols',
      scope: 'system',
      tags: ['openmoji', 'emoji', 'sonrisa'],
      license: { id: 'custom', label: 'OpenMoji CC BY-SA 4.0', allowsCommercialUse: true, requiresAttribution: true },
      editableFields: ['imageUrl'], lockedFields: [], supportedFormats: ['image', 'video'],
      version: 1, approvalStatus: 'approved', locked: false, sourcePackage: 'universal',
      preview: { renderer: 'external', url: 'https://openmoji.org/data/color/svg/1F600.svg', alt: 'Emoji sonriente' },
      payload: { source: 'external', imageUrl: 'https://openmoji.org/data/color/svg/1F600.svg' },
    },
];

const OPENMOJI_RESOURCES: ElementCatalogResource<StaticElementCatalogPayload>[] = ['1F44D', '1F4A1', '1F525'].map((code) => ({
  id: `openmoji-${code.toLowerCase()}`,
  title: `OpenMoji ${code}`,
  description: 'Símbolo universal de OpenMoji',
  resourceType: 'Símbolo SVG',
  kind: 'symbol',
  category: 'icons_symbols',
  scope: 'system',
  tags: ['openmoji', 'símbolo'],
  license: { id: 'custom', label: 'OpenMoji CC BY-SA 4.0', allowsCommercialUse: true, requiresAttribution: true },
  editableFields: ['imageUrl'],
  lockedFields: [],
  supportedFormats: ['image', 'video'],
  version: 1,
  approvalStatus: 'approved',
  locked: false,
  sourcePackage: 'universal',
  preview: { renderer: 'external', url: `https://openmoji.org/data/color/svg/${code}.svg`, alt: `OpenMoji ${code}` },
  payload: { source: 'external', imageUrl: `https://openmoji.org/data/color/svg/${code}.svg` },
}));

const UNDRAW_RESOURCES: ElementCatalogResource<StaticElementCatalogPayload>[] = [
  ['invite', 'Invitación', 'Comunicación'],
  ['cloud-hosting', 'Cloud hosting', 'Tecnología'],
  ['online-shopping', 'Compra online', 'Comercio'],
].map(([slug, title, tag]) => {
  const url = `/universal-assets/${slug}.svg`;
  return {
    id: `undraw-${slug}`,
    title,
    description: `Ilustración universal de unDraw: ${tag}`,
    resourceType: 'Ilustración SVG',
    kind: 'illustration',
    category: 'illustrations',
    scope: 'system',
    tags: ['undraw', tag.toLowerCase()],
    license: { id: 'custom', label: 'unDraw license', allowsCommercialUse: true, requiresAttribution: false },
    editableFields: ['imageUrl'], lockedFields: [], supportedFormats: ['image', 'video'],
    version: 1, approvalStatus: 'approved', locked: false, recommended: false, sourcePackage: 'universal',
    preview: { renderer: 'external', url, alt: title },
    payload: { source: 'external', imageUrl: url },
  };
});

export const ELEMENT_CATALOG_RESOURCES: ElementCatalogResource<StaticElementCatalogPayload>[] = [
  ...ELEMENT_SHAPE_SECTIONS.flatMap((section) =>
    section.items.map((item) => createUniversalShapeResource(section.title, item)),
  ),
  ...UNIVERSAL_ICON_CATALOG.map(createUniversalIconResource),
  ...UNIVERSAL_COMPONENTS.map(createUniversalComponentResource),
  ...EXTERNAL_UNIVERSAL_RESOURCES,
  ...OPENMOJI_RESOURCES,
  ...UNDRAW_RESOURCES,
  ...ELEMENT_PRESETS.filter((preset) => preset.category !== 'shapes').map((preset) => {
    const normalized = normalizeElementPreset(preset);
    return {
      ...normalized,
      payload: { source: 'preset' as const, preset },
    };
  }),
];

export function filterElementCatalog<T>(
  resources: ElementCatalogResource<T>[],
  filters: ElementCatalogFilters,
): ElementCatalogResource<T>[] {
  const normalizedQuery = filters.query?.trim().toLocaleLowerCase('es') ?? '';

  return resources.filter((resource) => {
    if (filters.category && filters.category !== 'all' && resource.category !== filters.category) {
      return false;
    }
    if (filters.scope && filters.scope !== 'all' && resource.scope !== filters.scope) {
      return false;
    }
    if (filters.format && filters.format !== 'all' && !resource.supportedFormats.includes(filters.format)) {
      return false;
    }
    if (filters.state === 'approved' && resource.approvalStatus !== 'approved') {
      return false;
    }
    if (filters.state === 'locked' && !resource.locked) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }

    return [
      resource.title,
      resource.description,
      resource.resourceType,
      resource.category,
      resource.scope,
      resource.license.label,
      ...resource.tags,
    ].some((value) => value.toLocaleLowerCase('es').includes(normalizedQuery));
  });
}

export function isElementCatalogCategory(value: string): value is ElementCatalogCategoryId {
  return ELEMENT_CATALOG_CATEGORY_IDS.includes(value as ElementCatalogCategoryId);
}
