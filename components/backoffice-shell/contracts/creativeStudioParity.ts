/**
 * Stable, reviewable parity matrix for the two creative workspaces.
 *
 * The matrix describes shared ownership only. Domain controls stay in each
 * editor's extension and are intentionally not compared as identical markup.
 */
export const CREATIVE_STUDIO_PARITY_MATRIX = [
  { id: 'platform-header', owner: 'PlatformHeader', image: 'CreativeStudioShellAdapter', video: 'CreativeStudioShellAdapter' },
  { id: 'module-header', owner: 'ModuleHeader', image: 'slots.moduleHeader', video: 'slots.moduleHeader' },
  { id: 'suite-shell', owner: 'SuiteShell', image: 'CreativeStudioShellAdapter', video: 'CreativeStudioShellAdapter' },
  { id: 'suite-canvas', owner: 'SuiteCanvas', image: 'CreativeStudioShellAdapter', video: 'CreativeStudioShellAdapter' },
  { id: 'canvas-grid', owner: 'CanvasChrome', image: 'CanvasGrid', video: 'CanvasGrid' },
  { id: 'tool-rail', owner: 'StudioToolRail', image: 'slots.toolRail', video: 'slots.toolRail' },
  { id: 'resource-panel', owner: 'StudioResourcePanel', image: 'slots.resourcePanel', video: 'slots.resourcePanel' },
  { id: 'main-toolbar', owner: 'SuiteCanvas', image: 'slots.toolbar', video: 'slots.toolbar' },
  { id: 'stage', owner: 'SuiteCanvas', image: 'slots.stage', video: 'slots.stage' },
  { id: 'inspector', owner: 'SuiteCanvas', image: 'slots.inspector', video: 'slots.inspector' },
  { id: 'bottom-workspace', owner: 'SuiteCanvas', image: 'slots.bottomWorkspace', video: 'extensions.timeline/transport' },
  { id: 'overlays', owner: 'CreativeStudioShellAdapter', image: 'slots.overlays', video: 'slots.overlays' },
  { id: 'lifecycle-status', owner: 'LiveStatus', image: 'saveState', video: 'renderStatus' },
  { id: 'shortcuts', owner: 'ShortcutManager', image: 'scope.consumer', video: 'scope.consumer' },
] as const;

export type CreativeStudioParitySurface = (typeof CREATIVE_STUDIO_PARITY_MATRIX)[number]['id'];
