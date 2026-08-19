/**
 * @file presets.ts
 * @description Presets de geometría de lienzo (SuiteCanvas) y anchos de zonas para cada SuiteCanvasMode.
 */

import type { ModuleShellZoneWidth, SuiteCanvasMode } from './shell';

export type SuiteCanvasGeometry = 'bounded' | 'split' | 'wide' | 'full-bleed';
export type SuiteCanvasGridColumns = 12 | 8 | 4;
export type SuiteCanvasPadding = 'none' | 'compact' | 'comfortable';
export type SuiteCanvasMaxWidth = 'bounded' | 'wide' | 'full';
export type SuiteCanvasOverflowX = 'hidden' | 'zone-only';

export interface SuiteCanvasGeometryPreset {
  mode: SuiteCanvasMode;
  geometry: SuiteCanvasGeometry;
  columns: SuiteCanvasGridColumns;
  mobileColumns: 4;
  maxWidth: SuiteCanvasMaxWidth;
  padding: SuiteCanvasPadding;
  gap: 'sm' | 'md' | 'lg';
  overflowX: SuiteCanvasOverflowX;
  overflowY: 'canvas';
}

export interface SuiteShellModePreset {
  canvasGeometry: SuiteCanvasGeometryPreset;
  contextSidebarWidth: ModuleShellZoneWidth;
  contextPanelWidth: ModuleShellZoneWidth;
  contextPanelPresentation: 'inline' | 'drawer' | 'overlay';
  contextHeaderRows: 1 | 2 | 3;
  contextFooterRows: 1 | 2 | 3;
  contextContentScrollable: boolean;
  contextSidebarHasCollapseControl: boolean;
}

export const SUITE_CANVAS_GEOMETRY_CLASSES: Record<SuiteCanvasGeometry, string> = {
  bounded: 'mx-auto w-full max-w-7xl px-4 py-4 sm:px-6',
  split: 'h-full min-h-0 w-full',
  wide: 'w-full px-4 py-4 sm:px-6',
  'full-bleed': 'h-full min-h-0 w-full p-0',
};

export const SUITE_CANVAS_PADDING_CLASSES: Record<SuiteCanvasPadding, string> = {
  none: 'p-0',
  compact: 'p-2 sm:p-3',
  comfortable: 'p-4 sm:p-6',
};

export const SUITE_CANVAS_GAP_CLASSES: Record<SuiteCanvasGeometryPreset['gap'], string> = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export const SUITE_CANVAS_GRID_CLASSES: Record<SuiteCanvasGridColumns, string> = {
  12: 'grid-cols-12',
  8: 'grid-cols-8',
  4: 'grid-cols-4',
};

export const SUITE_CANVAS_MOBILE_GRID_CLASSES: Record<SuiteCanvasGridColumns, string> = {
  12: 'max-lg:grid-cols-4',
  8: 'max-lg:grid-cols-4',
  4: 'max-lg:grid-cols-4',
};

export const SUITE_SHELL_MODE_PRESETS: Record<SuiteCanvasMode, SuiteShellModePreset> = {
  overview: {
    canvasGeometry: {
      mode: 'overview',
      geometry: 'bounded',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'bounded',
      padding: 'comfortable',
      gap: 'md',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  data: {
    canvasGeometry: {
      mode: 'data',
      geometry: 'bounded',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'bounded',
      padding: 'comfortable',
      gap: 'md',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  workspace: {
    canvasGeometry: {
      mode: 'workspace',
      geometry: 'bounded',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'bounded',
      padding: 'comfortable',
      gap: 'md',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  split: {
    canvasGeometry: {
      mode: 'split',
      geometry: 'split',
      columns: 8,
      mobileColumns: 4,
      maxWidth: 'full',
      padding: 'none',
      gap: 'md',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  board: {
    canvasGeometry: {
      mode: 'board',
      geometry: 'wide',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'wide',
      padding: 'comfortable',
      gap: 'lg',
      overflowX: 'zone-only',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
  'full-bleed': {
    canvasGeometry: {
      mode: 'full-bleed',
      geometry: 'full-bleed',
      columns: 12,
      mobileColumns: 4,
      maxWidth: 'full',
      padding: 'none',
      gap: 'sm',
      overflowX: 'hidden',
      overflowY: 'canvas',
    },
    contextSidebarWidth: 'standard',
    contextPanelWidth: 'standard',
    contextPanelPresentation: 'inline',
    contextHeaderRows: 1,
    contextFooterRows: 1,
    contextContentScrollable: true,
    contextSidebarHasCollapseControl: true,
  },
};
