import React, { useState } from 'react';
import type { AccessMap, NavigationSchema, NavMode, NavRouteRef, TelemetryMap } from './contracts/navigation';
import { PlatformHeader } from './PlatformHeader';
import { SuiteSidebar } from './SuiteSidebar';

export interface SuiteShellProps {
  schema: NavigationSchema;
  navMode?: NavMode;
  activeModuleId?: string;
  accessMap?: AccessMap;
  telemetry?: TelemetryMap;
  suiteTitle?: string;
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  profileSlot?: React.ReactNode;
  contextualSidebarAction?: React.ReactNode | ((isRail: boolean) => React.ReactNode);
  onNavigate: (route: NavRouteRef) => void;
  onNavModeChange?: (mode: 'expanded' | 'rail') => void;
  overlay?: React.ReactNode;
  children: React.ReactNode;
}

export const SuiteShell: React.FC<SuiteShellProps> = ({
  schema,
  navMode = 'expanded',
  activeModuleId,
  accessMap,
  telemetry,
  suiteTitle,
  leftSlot,
  centerSlot,
  rightSlot,
  profileSlot,
  contextualSidebarAction,
  onNavigate,
  onNavModeChange,
  overlay,
  children,
}) => {
  const [internalNavMode, setInternalNavMode] = useState<'expanded' | 'rail'>(navMode === 'rail' ? 'rail' : 'expanded');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const effectiveNavMode = onNavModeChange ? (navMode === 'hidden' ? 'hidden' : navMode) : internalNavMode;

  const handleNavModeChange = (nextMode: 'expanded' | 'rail') => {
    setInternalNavMode(nextMode);
    onNavModeChange?.(nextMode);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 text-slate-800 antialiased">
      <PlatformHeader
        suiteTitle={suiteTitle ?? schema.suite.suiteName}
        leftSlot={leftSlot}
        centerSlot={centerSlot}
        rightSlot={rightSlot}
        profileSlot={profileSlot}
        onOpenMobileNav={() => setIsMobileOpen(true)}
        isMobileNavOpen={isMobileOpen}
      />

      <div className="flex min-h-0 flex-1 flex-row overflow-hidden">
        <SuiteSidebar
          schema={schema}
          navMode={effectiveNavMode}
          activeModuleId={activeModuleId}
          accessMap={accessMap}
          telemetry={telemetry}
          contextualSidebarAction={contextualSidebarAction}
          onNavigate={onNavigate}
          onNavModeChange={handleNavModeChange}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
          {children}
        </main>
      </div>

      {overlay}
    </div>
  );
};
