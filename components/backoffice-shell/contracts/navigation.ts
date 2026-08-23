/**
 * @file navigation.ts
 * @description Contrato universal para el sistema de navegación de LoopDev OS adaptado para VitaBlue Backoffice.
 */

export type NavMode = 'expanded' | 'rail' | 'hover' | 'hidden';
export type LayoutContext = 'normal' | 'focus' | 'inmersive';

export type ModuleAccessState =
  | 'enabled'
  | 'disabled'
  | 'hidden'
  | 'coming-soon'
  | 'forbidden'
  | 'read-only';

export type NavItemKind = 'module' | 'link' | 'action';

export type NavBadgeKind = 'count' | 'dot' | 'text';

export interface NavRouteRef {
  /** Identificador o ruta en el router de la aplicación */
  routeId: string;
  params?: Record<string, string | number>;
}

export interface NavBadge {
  kind: NavBadgeKind;
  value?: number | string;
  max?: number;
  ariaLabel?: string;
}

export interface NavItemBase {
  id: string;
  kind: NavItemKind;
  label: string;
  /** Nombre del icono (Lucide) */
  icon: string;
  priority: number;
  tooltip?: string;
  enabledByDefault?: boolean;
}

export interface NavModuleItem extends NavItemBase {
  kind: 'module';
  moduleId: string;
  route: NavRouteRef;
}

export interface NavLinkItem extends NavItemBase {
  kind: 'link';
  href: string;
  target?: '_blank' | '_self';
}

export interface NavActionItem extends NavItemBase {
  kind: 'action';
  actionId: string;
}

export type NavItem = NavModuleItem | NavLinkItem | NavActionItem;

export interface NavGroup {
  id: string;
  label: string;
  priority: number;
  collapsible?: boolean;
  items: NavItem[];
}

export interface SuiteIdentity {
  suiteId: string;
  suiteName: string;
  suiteIcon: string;
  /** Token de color de acento */
  accentColor?: string;
  /** Variante de superficie */
  surfaceVariant?: 'canvas';
  /** Ruta raíz de la suite */
  route?: NavRouteRef;
}

export interface NavigationSchema {
  version: '1.0';
  suite: SuiteIdentity;
  /** Botón de salida del contexto de la suite hacia el home del backoffice */
  exitHatch?: {
    label: string;
    icon: string;
    route: NavRouteRef;
  };
  groups: NavGroup[];
}

// Mapa de acceso para lógica de permisos y capacidades
export type AccessMap = Record<string, ModuleAccessState>;

// Mapa de telemetría para badges vivos
export type TelemetryMap = Record<string, NavBadge | undefined>;
