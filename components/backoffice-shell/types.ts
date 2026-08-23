export * from './contracts';
export * from './PlatformHeader';
export * from './SuiteSidebar';
export * from './SuiteCanvas';
export * from './ModuleHeader';
export * from './ModuleContextSidebar';
export * from './ModuleContextPanel';
export * from './SuiteShell';
export * from './SuiteRuntime';

// Compatibilidad hacia atrás con el adapter legacy
export type BackofficeShellMode = 'standard' | 'full-bleed';
export type BackofficeModuleState = 'saved' | 'saving' | 'unsaved' | 'error';
export type BackofficeSidebarMode = 'suite' | 'context' | 'none';
export type BackofficeNavigationMode = 'expanded' | 'rail' | 'hidden';

export interface BackofficeBreadcrumb {
  label: string;
  href?: string;
}

export interface BackofficeModuleConfig {
  moduleId: string;
  title: string;
  breadcrumbs: BackofficeBreadcrumb[];
  shellMode: BackofficeShellMode;
  sidebar: BackofficeSidebarMode;
  state?: BackofficeModuleState;
}

export interface BackofficeShellProps {
  children: React.ReactNode;
  navigation?: React.ReactNode;
  header?: React.ReactNode;
  context?: React.ReactNode;
  overlay?: React.ReactNode;
  mode?: BackofficeShellMode;
  contextOpen?: boolean;
  navigationMode?: BackofficeNavigationMode;
  onNavigationModeChange?: (mode: BackofficeNavigationMode) => void;
}
