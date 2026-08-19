/**
 * @file shell.ts
 * @description Contratos de estado, configuración y zonas de Shell compatibles con LoopDev OS.
 */

import type { AccessMap, NavGroup, NavigationSchema, NavMode, SuiteIdentity } from './navigation';

export type ShellStructuralState =
  | 'ready'
  | 'loading'
  | 'error'
  | 'forbidden'
  | 'no-tenant-context'
  | 'module-disabled'
  | 'empty'
  | 'read-only'
  | 'offline';

export type ShellAccessState =
  | 'enabled'
  | 'disabled'
  | 'hidden'
  | 'coming-soon'
  | 'forbidden'
  | 'read-only';

export type WorkspaceCapability =
  | 'sidebar'
  | 'flyout'
  | 'toolbar'
  | 'inspector'
  | 'resource-tabs'
  | 'operation-panel'
  | 'responsive-inspector'
  | 'mobile-navigation';

export type WorkspaceCapabilities = WorkspaceCapability[];

export interface ShellPermissionConfig {
  required?: string[];
  accessState?: ShellAccessState;
  readOnly?: boolean;
}

export interface ShellState {
  structuralState: ShellStructuralState;
  message?: string;
  retryActionId?: string;
}

export type ModuleShellZoneWidth = 'narrow' | 'standard' | 'wide' | 'extra-wide';
export type ModuleShellZoneIcon = 'menu' | 'panel-left-close' | 'panel-left-open';
export type ModuleShellCollapsedPresentation = 'rail' | 'trigger' | 'drawer';
export type ModuleShellContextActionTone = 'neutral' | 'accent' | 'attention';

export interface ModuleShellZoneUsage {
  label?: string;
  contentKey?: string;
  visible?: boolean;
  headerRows?: 1 | 2 | 3;
  showFooter?: boolean;
  footerRows?: 1 | 2 | 3;
  contentScrollable?: boolean;
  footer?: {
    contentKey: string;
  };
  width?: ModuleShellZoneWidth;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsedPresentation?: ModuleShellCollapsedPresentation;
  collapseIcon?: ModuleShellZoneIcon;
  expandIcon?: ModuleShellZoneIcon;
}

export type SuiteCanvasMode = 'overview' | 'data' | 'workspace' | 'split' | 'board' | 'full-bleed';

export interface ModuleShellUsage {
  canvasMode: SuiteCanvasMode;
  contextualAction?: {
    label: string;
    icon: ModuleShellZoneIcon;
    tone?: ModuleShellContextActionTone;
  };
  suiteHeader?: ModuleShellZoneUsage;
  suiteToolbar?: ModuleShellZoneUsage;
  moduleContextSidebar?: ModuleShellZoneUsage;
  moduleContextPanel?: ModuleShellZoneUsage;
}

export interface ModuleConfig {
  moduleId: string;
  label: string;
  route: string;
  breadcrumbs: string[];
  navigation?: {
    groups: NavGroup[];
    activeRouteId?: string;
  };
  permissions?: ShellPermissionConfig;
  capabilities: WorkspaceCapabilities;
  initialState?: ShellState;
  shell?: ModuleShellUsage;
}

export interface SuiteConfig {
  identity: SuiteIdentity;
  navigation: NavigationSchema;
  accessMap: AccessMap;
  requiredPermissions?: string[];
  themeId?: string;
  navMode?: NavMode;
  modules: ModuleConfig[];
}
