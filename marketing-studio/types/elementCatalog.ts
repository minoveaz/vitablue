export const ELEMENT_CATALOG_CATEGORY_IDS = [
  'forms_lines',
  'icons_symbols',
  'frames_masks',
  'illustrations',
  'backgrounds_surfaces',
  'badges_labels',
  'buttons_ctas',
  'reusable_components',
  'saved_elements',
] as const;

export type ElementCatalogCategoryId = (typeof ELEMENT_CATALOG_CATEGORY_IDS)[number];
export type ElementResourceScope = 'system' | 'organization' | 'workspace' | 'user';
export type ElementStudioFormat = 'image' | 'video';
export type ElementApprovalStatus = 'approved' | 'pending' | 'rejected' | 'not_required';
export const UNIVERSAL_ICON_IDS = [
  'activity',
  'alert',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'bell',
  'briefcase',
  'calendar',
  'camera',
  'car',
  'check',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'clock',
  'copy',
  'credit-card',
  'download',
  'edit',
  'eye',
  'file',
  'globe',
  'graduation-cap',
  'heart',
  'help',
  'home',
  'image',
  'info',
  'link',
  'lock',
  'mail',
  'map-pin',
  'menu',
  'message',
  'minus',
  'pause',
  'phone',
  'plane',
  'play',
  'plus',
  'search',
  'settings',
  'share',
  'shield',
  'shopping-cart',
  'star',
  'stethoscope',
  'thumbs-up',
  'trash',
  'unlock',
  'upload',
  'user',
  'users',
  'wifi',
  'x',
  'zap',
] as const;

export type UniversalIconId = (typeof UNIVERSAL_ICON_IDS)[number];

export type TraditionalShapeType =
  | 'line'
  | 'line-dashed'
  | 'line-dotted'
  | 'line-arrow-right'
  | 'line-arrow-both'
  | 'curve'
  | 'arc'
  | 'connector-elbow'
  | 'connector-curved'
  | 'rectangle'
  | 'square'
  | 'rounded_rect'
  | 'circle'
  | 'triangle'
  | 'triangle-up'
  | 'triangle-down'
  | 'diamond'
  | 'pentagon'
  | 'hexagon'
  | 'octagon'
  | 'polygon-parametric'
  | 'star'
  | 'star-4'
  | 'star-5'
  | 'star-6'
  | 'star-8'
  | 'burst-12'
  | 'star-parametric'
  | 'arrow'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-both'
  | 'speech_bubble'
  | 'heart'
  | 'shield'
  | 'blob-1'
  | 'blob-2'
  | 'blob-3'
  | 'bracket-square-left'
  | 'bracket-square-right'
  | 'bracket-square-pair'
  | 'bracket-curly-pair'
  | 'separator-wave'
  | 'separator-zigzag'
  | 'separator-dots'
  | 'separator-diamond'
  | 'frame-simple'
  | 'frame-rounded'
  | 'frame-circle'
  | 'frame-corners'
  | 'frame-polaroid'
  | 'frame-film'
  | 'mask-circle'
  | 'mask-rounded'
  | 'mask-hexagon'
  | 'mask-arch'
  | 'mask-blob'
  | 'mask-heart'
  | `icon-${UniversalIconId}`;

export type ElementResourceKind =
  | 'shape'
  | 'line'
  | 'icon'
  | 'symbol'
  | 'frame'
  | 'mask'
  | 'illustration'
  | 'background'
  | 'surface'
  | 'badge'
  | 'label'
  | 'button'
  | 'component'
  | 'saved_element';

export type ElementPreviewMetadata =
  | {
      renderer: 'graphic';
      shapeType: TraditionalShapeType;
      fill?: string;
      stroke?: string;
      strokeWidth?: number;
      borderRadius?: number;
      sides?: number;
      points?: number;
      innerRadius?: number;
    }
  | { renderer: 'illustration'; illustrationId: string }
  | { renderer: 'label'; variant: 'badge' | 'button'; text: string }
  | { renderer: 'surface'; variant: string }
  | { renderer: 'external'; url: string; alt: string }
  | { renderer: 'saved' }
  | { renderer: 'fallback'; label: string };

export interface ElementResourceLicense {
  id: 'built-in' | 'organization-owned' | 'workspace-owned' | 'user-created' | 'custom';
  label: string;
  allowsCommercialUse: boolean;
  requiresAttribution: boolean;
}

export interface ElementCatalogMetadata {
  kind: ElementResourceKind;
  category: ElementCatalogCategoryId;
  scope: ElementResourceScope;
  organizationId?: string;
  brandId?: string;
  tags: string[];
  license: ElementResourceLicense;
  editableFields: string[];
  lockedFields: string[];
  supportedFormats: ElementStudioFormat[];
  version: number;
  approvalStatus: ElementApprovalStatus;
  locked: boolean;
  recommended?: boolean;
  sourcePackage: 'universal' | 'organization' | 'workspace' | 'user';
}

export interface ElementCatalogResource<TPayload = unknown> extends ElementCatalogMetadata {
  id: string;
  title: string;
  description: string;
  resourceType: string;
  preview: ElementPreviewMetadata;
  payload: TPayload;
}

export interface ElementCatalogFilters {
  query?: string;
  category?: ElementCatalogCategoryId | 'all';
  scope?: ElementResourceScope | 'all';
  format?: ElementStudioFormat | 'all';
  state?: 'all' | 'approved' | 'locked';
}
