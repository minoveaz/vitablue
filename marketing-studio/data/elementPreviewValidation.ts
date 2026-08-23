import {
  ElementPreviewMetadata,
  TraditionalShapeType,
  UNIVERSAL_ICON_IDS,
  UniversalIconId,
} from '../types/elementCatalog';
import { ELEMENT_SHAPE_SECTIONS } from './elementShapes';

const LEGACY_SHAPE_ALIASES: TraditionalShapeType[] = ['arrow', 'square', 'star', 'triangle'];
const CATALOG_SHAPE_TYPES = new Set<TraditionalShapeType>([
  ...ELEMENT_SHAPE_SECTIONS.flatMap((section) => section.items.map((item) => item.shapeType)),
  ...LEGACY_SHAPE_ALIASES,
]);

export function isRenderableTraditionalShapeType(value: string): value is TraditionalShapeType {
  if (CATALOG_SHAPE_TYPES.has(value as TraditionalShapeType)) return true;
  if (!value.startsWith('icon-')) return false;
  return UNIVERSAL_ICON_IDS.includes(value.slice(5) as UniversalIconId);
}

export function hasValidElementPreviewMetadata(preview: ElementPreviewMetadata): boolean {
  switch (preview.renderer) {
    case 'graphic':
      return isRenderableTraditionalShapeType(preview.shapeType);
    case 'illustration':
      return preview.illustrationId.trim().length > 0;
    case 'label':
      return preview.text.trim().length > 0;
    case 'surface':
      return preview.variant.trim().length > 0;
    case 'external':
      return preview.url.trim().length > 0 && preview.alt.trim().length > 0;
    case 'fallback':
      return preview.label.trim().length > 0;
    case 'saved':
      return true;
  }
}
