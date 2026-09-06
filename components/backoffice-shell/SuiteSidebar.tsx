import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Home,
  Lock,
  Clock,
  LayoutDashboard,
  Boxes,
  Wrench,
  Palette,
  Image,
  Layers,
  Video,
  BarChart3,
  Link2,
  Globe,
  FileScan,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  MessageCircle,
  Mail,
  type LucideIcon
} from 'lucide-react';
import type { AccessMap, NavigationSchema, NavMode, NavRouteRef, TelemetryMap } from './contracts/navigation';

const iconMap: Record<string, LucideIcon> = {
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Home,
  Lock,
  Clock,
  LayoutDashboard,
  Boxes,
  Wrench,
  Palette,
  Image,
  Layers,
  Video,
  BarChart3,
  Link2,
  Globe,
  FileScan,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  MessageCircle,
  Mail
};

export interface SuiteSidebarProps {
  schema: NavigationSchema;
  navMode?: NavMode;
  activeModuleId?: string;
  accessMap?: AccessMap;
  telemetry?: TelemetryMap;
  contextualSidebarAction?: React.ReactNode | ((isRail: boolean) => React.ReactNode);
  onNavigate: (route: NavRouteRef) => void;
  onNavModeChange?: (mode: 'expanded' | 'rail') => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SuiteSidebar: React.FC<SuiteSidebarProps> = ({
  schema,
  navMode = 'expanded',
  activeModuleId,
  accessMap = {},
  telemetry = {},
  contextualSidebarAction,
  onNavigate,
  onNavModeChange,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const isHidden = navMode === 'hidden';
  const isRail = navMode === 'rail';

  const renderIcon = (iconName: string, className = 'size-4 shrink-0') => {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent className={className} aria-hidden={true} />;
    }
    return <Home className={className} aria-hidden={true} />;
  };

  const sidebarWidthClass = isRail ? 'w-16 min-w-16' : 'w-64 min-w-64';

  return (
    <>
      {/* Backdrop móvil */}
      {isMobileOpen && !isHidden && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          aria-label="Cerrar navegación del backoffice"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`${isHidden ? 'hidden' : isMobileOpen ? 'fixed inset-y-0 left-0 z-40 flex w-[min(84vw,20rem)] min-w-0 flex-col' : 'hidden'} ${
          !isMobileOpen && !isHidden ? sidebarWidthClass : ''
        } shrink-0 overflow-hidden border-r border-slate-800 bg-slate-900 text-white lg:static lg:flex lg:flex-col`}
        aria-label="Suite sidebar"
      >
        {/* Identidad de la Suite */}
        <div className="border-b border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className={`min-w-0 ${isRail && !isMobileOpen ? 'sr-only' : ''}`}>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Suite</span>
              <p className="mt-0.5 truncate text-sm font-bold text-white">{schema.suite.suiteName}</p>
            </div>
            {schema.exitHatch && (
              <button
                type="button"
                onClick={() => {
                  onNavigate(schema.exitHatch!.route);
                  onCloseMobile?.();
                }}
                className="flex size-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title={schema.exitHatch.label}
                aria-label={schema.exitHatch.label}
              >
                {renderIcon(schema.exitHatch.icon, 'size-3.5')}
              </button>
            )}
            {isMobileOpen && (
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                aria-label="Cerrar navegación"
                onClick={onCloseMobile}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Acción Contextual cuando el panel está colapsado */}
        {contextualSidebarAction && (
          <div className="border-b border-slate-800 p-2">
            {typeof contextualSidebarAction === 'function'
              ? contextualSidebarAction(isRail && !isMobileOpen)
              : contextualSidebarAction}
          </div>
        )}

        {/* Grupos de navegación */}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 space-y-4">
          {schema.groups.map((group) => (
            <div key={group.id} className="space-y-1">
              {group.label && !isRail && (
                <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-500 block">
                  {group.label}
                </span>
              )}
              {group.items.map((item) => {
                const isModule = item.kind === 'module';
                const accessState = isModule ? (accessMap[item.moduleId] ?? 'enabled') : 'enabled';
                if (accessState === 'hidden') return null;

                const isForbidden = accessState === 'forbidden';
                const isComingSoon = accessState === 'coming-soon';
                const isDisabled = accessState === 'disabled' || isForbidden || isComingSoon;
                const isActive = isModule && activeModuleId === item.moduleId;
                const badge = isModule ? telemetry[item.moduleId] : undefined;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (item.kind === 'module') {
                        onNavigate(item.route);
                      } else if (item.kind === 'link') {
                        window.open(item.href, item.target ?? '_self');
                      }
                      onCloseMobile?.();
                    }}
                    title={isRail && !isMobileOpen ? item.label : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold transition-all text-left ${
                      isRail && !isMobileOpen ? 'justify-center px-0' : ''
                    } ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : isDisabled
                        ? 'opacity-40 cursor-not-allowed text-slate-400'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    {renderIcon(item.icon, 'size-4 shrink-0')}
                    {(!isRail || isMobileOpen) && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {(!isRail || isMobileOpen) && isComingSoon && (
                      <span className="flex items-center gap-1 text-[9px] text-amber-400">
                        <Clock className="size-3" />
                      </span>
                    )}
                    {(!isRail || isMobileOpen) && isForbidden && (
                      <span className="flex items-center gap-1 text-[9px] text-slate-500">
                        <Lock className="size-3" />
                      </span>
                    )}
                    {(!isRail || isMobileOpen) && badge && (
                      <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] font-black text-brand-cyan">
                        {badge.value}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer del sidebar con selector de expansión */}
        {!isHidden && onNavModeChange && (
          <button
            type="button"
            className="flex min-h-11 shrink-0 items-center justify-center gap-2 border-t border-slate-800 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label={isMobileOpen ? 'Cerrar menú' : isRail ? 'Expandir sidebar' : 'Contraer sidebar'}
            onClick={() => {
              if (isMobileOpen) {
                onCloseMobile?.();
              } else {
                onNavModeChange(isRail ? 'expanded' : 'rail');
              }
            }}
          >
            {isMobileOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : isRail ? (
              <PanelLeftOpen className="size-4" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="size-4" aria-hidden="true" />
            )}
            <span className={isRail && !isMobileOpen ? 'sr-only' : ''}>
              {isMobileOpen ? 'Cerrar' : isRail ? 'Expandir' : 'Contraer sidebar'}
            </span>
          </button>
        )}
      </aside>
    </>
  );
};
