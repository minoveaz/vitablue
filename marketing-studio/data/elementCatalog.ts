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
  | { source: 'preset'; preset: ElementPresetItem };

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

export const ELEMENT_CATALOG_RESOURCES: ElementCatalogResource<StaticElementCatalogPayload>[] = [
  ...ELEMENT_SHAPE_SECTIONS.flatMap((section) =>
    section.items.map((item) => createUniversalShapeResource(section.title, item)),
  ),
  ...UNIVERSAL_ICON_CATALOG.map(createUniversalIconResource),
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
