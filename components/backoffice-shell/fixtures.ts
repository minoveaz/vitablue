import type { BackofficeModuleConfig } from './types';

export const BACKOFFICE_MODULES: BackofficeModuleConfig[] = [
  {
    moduleId: 'backoffice-home',
    title: 'Backoffice VitaBlue',
    breadcrumbs: [{ label: 'Backoffice VitaBlue' }],
    shellMode: 'standard',
    sidebar: 'suite',
    state: 'saved',
  },
  {
    moduleId: 'product-catalog',
    title: 'Catálogo de productos',
    breadcrumbs: [
      { label: 'Backoffice VitaBlue', href: '/backoffice' },
      { label: 'Catálogo de productos' },
    ],
    shellMode: 'standard',
    sidebar: 'suite',
    state: 'saved',
  },
  {
    moduleId: 'marketing-studio',
    title: 'Marketing Studio',
    breadcrumbs: [{ label: 'Backoffice VitaBlue', href: '/backoffice' }, { label: 'Marketing Studio' }],
    shellMode: 'standard',
    sidebar: 'suite',
    state: 'saved',
  },
  {
    moduleId: 'creative-editor',
    title: 'Marketing Video Studio',
    breadcrumbs: [
      { label: 'Marketing Studio', href: '/backoffice/marketing-studio' },
      { label: 'Editor de vídeo' },
    ],
    shellMode: 'full-bleed',
    sidebar: 'context',
    state: 'saved',
  },
];

export const CREATIVE_EDITOR_REGIONS = [
  'module-header',
  'asset-sidebar',
  'stage',
  'transport',
  'timeline',
  'inspector',
] as const;

export type CreativeEditorRegion = (typeof CREATIVE_EDITOR_REGIONS)[number];
