import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Boxes,
  Globe,
  Image,
  LayoutDashboard,
  Link2,
  Palette,
  Wrench,
  FileScan,
  Layers,
  Video,
  BarChart3,
} from 'lucide-react';
import {
  SuiteShell,
  SuiteCanvas,
  ModuleHeader,
  type NavigationSchema,
  type AccessMap,
  type NavRouteRef,
  type SuiteCanvasMode,
  type BackofficeShellMode,
  type ModuleHeaderState,
} from '@/components/backoffice-shell';

export const backofficeNavigation = [
  { to: '/backoffice', label: 'Inicio del backoffice', icon: LayoutDashboard, end: true },
  { to: '/backoffice/catalogo', label: 'Catálogo de productos', icon: Boxes, end: true },
  { to: '/backoffice/tools', label: 'Tools', icon: Wrench, end: true },
  { to: '/backoffice/tools/document-intelligence', label: 'Document Intelligence', icon: FileScan, end: true },
  { to: '/backoffice/marketing-studio/identidad-de-marca', label: 'Identidad de marca', icon: Palette },
  { to: '/backoffice/marketing-studio/perfiles-sociales', label: 'Perfiles sociales', icon: Image },
  { to: '/backoffice/marketing-studio/assets', label: 'Asset Manager (DAM)', icon: Layers },
  { to: '/backoffice/marketing-studio/generador-contenido', label: 'Video Studio (Reels)', icon: Video },
  { to: '/backoffice/marketing-studio/image-studio', label: 'Image Studio (Canva)', icon: Image },
  { to: '/backoffice/marketing-studio/campanas', label: 'Gestión de campañas', icon: BarChart3 },
  { to: '/backoffice/marketing-studio/enlaces', label: 'Enlaces y UTMs', icon: Link2 },
  { to: '/backoffice/marketing-studio/conexiones', label: 'Conexiones API', icon: Globe },
];

export const vitablueBackofficeSchema: NavigationSchema = {
  version: '1.0',
  suite: {
    suiteId: 'vitablue-os',
    suiteName: 'VitaBlue Backoffice',
    suiteIcon: 'LayoutDashboard',
    surfaceVariant: 'canvas',
    route: { routeId: '/backoffice' },
  },
  exitHatch: {
    label: 'Inicio del backoffice',
    icon: 'Home',
    route: { routeId: '/backoffice' },
  },
  groups: [
    {
      id: 'general',
      label: 'General',
      priority: 1,
      items: [
        { id: 'home', kind: 'module', moduleId: 'home', label: 'Inicio', icon: 'LayoutDashboard', priority: 1, route: { routeId: '/backoffice' } },
        { id: 'catalogo', kind: 'module', moduleId: 'catalogo', label: 'Catálogo de productos', icon: 'Boxes', priority: 2, route: { routeId: '/backoffice/catalogo' } },
        { id: 'tools', kind: 'module', moduleId: 'tools', label: 'Tools Transversales', icon: 'Wrench', priority: 3, route: { routeId: '/backoffice/tools' } },
      ],
    },
    {
      id: 'brand-hub',
      label: '1. Brand Hub',
      priority: 2,
      items: [
        { id: 'brand', kind: 'module', moduleId: 'brand', label: 'Identidad de marca', icon: 'Palette', priority: 1, route: { routeId: '/backoffice/marketing-studio/identidad-de-marca' } },
        { id: 'profiles', kind: 'module', moduleId: 'profiles', label: 'Perfiles sociales', icon: 'Image', priority: 2, route: { routeId: '/backoffice/marketing-studio/perfiles-sociales' } },
      ],
    },
    {
      id: 'asset-manager',
      label: '2. Asset Manager (DAM)',
      priority: 3,
      items: [
        { id: 'assets', kind: 'module', moduleId: 'assets', label: 'Biblioteca & MotionKit', icon: 'Layers', priority: 1, route: { routeId: '/backoffice/marketing-studio/assets' } },
      ],
    },
    {
      id: 'creative-studio',
      label: '3. Creative Studio',
      priority: 4,
      items: [
        { id: 'content', kind: 'module', moduleId: 'content', label: 'Video Studio (Reels)', icon: 'Video', priority: 1, route: { routeId: '/backoffice/marketing-studio/generador-contenido' } },
        { id: 'image-studio', kind: 'module', moduleId: 'image-studio', label: 'Image Studio (Canva)', icon: 'Image', priority: 2, route: { routeId: '/backoffice/marketing-studio/image-studio' } },
      ],
    },
    {
      id: 'campaign-orchestrator',
      label: '4. Campaign Orchestrator',
      priority: 5,
      items: [
        { id: 'campaigns', kind: 'module', moduleId: 'campaigns', label: 'Gestión de campañas', icon: 'BarChart3', priority: 1, route: { routeId: '/backoffice/marketing-studio/campanas' } },
        { id: 'links', kind: 'module', moduleId: 'links', label: 'Enlaces y UTMs', icon: 'Link2', priority: 2, route: { routeId: '/backoffice/marketing-studio/enlaces' } },
        { id: 'connections', kind: 'module', moduleId: 'connections', label: 'Conexiones API', icon: 'Globe', priority: 3, route: { routeId: '/backoffice/marketing-studio/conexiones' } },
      ],
    },
    {
      id: 'ai-tools',
      label: 'Herramientas IA',
      priority: 6,
      items: [
        { id: 'doc-intel', kind: 'module', moduleId: 'doc-intel', label: 'Document Intelligence', icon: 'FileScan', priority: 1, route: { routeId: '/backoffice/tools/document-intelligence' } },
      ],
    },
  ],
};

export const defaultAccessMap: AccessMap = {
  home: 'enabled',
  catalogo: 'enabled',
  tools: 'enabled',
  brand: 'enabled',
  profiles: 'enabled',
  assets: 'enabled',
  content: 'enabled',
  'image-studio': 'enabled',
  campaigns: 'enabled',
  links: 'enabled',
  connections: 'enabled',
  'doc-intel': 'enabled',
};

export interface BackofficeShellProps {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  breadcrumbs?: string[];
  mode?: SuiteCanvasMode | BackofficeShellMode;
  state?: ModuleHeaderState;
  stateLabel?: string;
  actionsSlot?: React.ReactNode;
  toolbar?: React.ReactNode;
  contextAside?: React.ReactNode;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
  schema?: NavigationSchema;
  accessMap?: AccessMap;
  contextualSidebarAction?: React.ReactNode | ((isRail: boolean) => React.ReactNode);
  navigationMode?: 'expanded' | 'rail' | 'hidden';
  onNavigationModeChange?: (mode: 'expanded' | 'rail') => void;
  hideModuleHeader?: boolean;
}

const BackofficeShell: React.FC<BackofficeShellProps> = ({
  children,
  title = 'Backoffice VitaBlue',
  eyebrow = 'Panel de Administración',
  breadcrumbs = [],
  mode = 'overview',
  state = 'saved',
  stateLabel,
  actionsSlot,
  toolbar,
  contextAside,
  aside,
  footer,
  schema = vitablueBackofficeSchema,
  accessMap = defaultAccessMap,
  contextualSidebarAction,
  navigationMode = 'expanded',
  onNavigationModeChange,
  hideModuleHeader = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mapear modo legado a SuiteCanvasMode
  const canvasMode: SuiteCanvasMode = mode === 'standard' ? 'overview' : mode;

  const getActiveModuleId = (): string | undefined => {
    const path = location.pathname;
    if (path === '/backoffice') return 'home';
    if (path.startsWith('/backoffice/catalogo')) return 'catalogo';
    if (path === '/backoffice/tools') return 'tools';
    if (path.includes('/identidad-de-marca')) return 'brand';
    if (path.includes('/perfiles-sociales')) return 'profiles';
    if (path.includes('/campanas')) return 'campaigns';
    if (path.includes('/enlaces')) return 'links';
    if (path.includes('/conexiones')) return 'connections';
    if (path.includes('/generador-contenido') || path.includes('/video')) return 'content';
    if (path.includes('/document-intelligence')) return 'doc-intel';
    return undefined;
  };

  const handleNavigate = (route: NavRouteRef) => {
    navigate(route.routeId);
  };

  return (
    <SuiteShell
      schema={schema}
      navMode={navigationMode}
      activeModuleId={getActiveModuleId()}
      accessMap={accessMap}
      contextualSidebarAction={contextualSidebarAction}
      onNavigate={handleNavigate}
      onNavModeChange={onNavigationModeChange}
    >
      <SuiteCanvas
        mode={canvasMode}
        header={
          !hideModuleHeader ? (
            <ModuleHeader
              title={title}
              eyebrow={eyebrow}
              breadcrumbs={breadcrumbs.length > 0 ? breadcrumbs : [eyebrow, title]}
              state={state}
              stateLabel={stateLabel}
              actionsSlot={actionsSlot}
            />
          ) : undefined
        }
        toolbar={toolbar}
        contextAside={contextAside}
        aside={aside}
        footer={footer}
      >
        {children}
      </SuiteCanvas>
    </SuiteShell>
  );
};

export default BackofficeShell;
