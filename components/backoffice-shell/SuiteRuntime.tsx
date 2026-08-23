import React from 'react';
import type { NavRouteRef } from './contracts/navigation';
import type { ModuleConfig, SuiteCanvasMode, SuiteConfig } from './contracts/shell';
import { SUITE_SHELL_MODE_PRESETS } from './contracts/presets';
import { SuiteShell } from './SuiteShell';
import { SuiteCanvas } from './SuiteCanvas';
import { ModuleHeader } from './ModuleHeader';
import { ModuleContextSidebar } from './ModuleContextSidebar';
import { ModuleContextPanel } from './ModuleContextPanel';

export type SuiteModuleRenderer = (module: ModuleConfig) => React.ReactNode;
export type SuiteModuleHeaderRenderer = (module: ModuleConfig) => React.ReactNode;
export type SuiteModuleToolbarRenderer = (module: ModuleConfig) => React.ReactNode;
export type SuiteModuleContextRenderer = (module: ModuleConfig) => React.ReactNode;
export type SuiteModuleContextPanelRenderer = (module: ModuleConfig) => React.ReactNode;

export interface SuiteRuntimeProps {
  config: SuiteConfig;
  activeModuleId?: string;
  moduleRenderers?: Record<string, SuiteModuleRenderer>;
  moduleHeaderRenderers?: Record<string, SuiteModuleHeaderRenderer>;
  moduleToolbarRenderers?: Record<string, SuiteModuleToolbarRenderer>;
  moduleContextRenderers?: Record<string, SuiteModuleContextRenderer>;
  moduleContextPanelRenderers?: Record<string, SuiteModuleContextPanelRenderer>;
  onNavigate: (route: NavRouteRef) => void;
  onNavModeChange?: (mode: 'expanded' | 'rail') => void;
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  profileSlot?: React.ReactNode;
  overlay?: React.ReactNode;
  children?: React.ReactNode;
}

export const SuiteRuntime: React.FC<SuiteRuntimeProps> = ({
  config,
  activeModuleId,
  moduleRenderers,
  moduleHeaderRenderers,
  moduleToolbarRenderers,
  moduleContextRenderers,
  moduleContextPanelRenderers,
  onNavigate,
  onNavModeChange,
  leftSlot,
  centerSlot,
  rightSlot,
  profileSlot,
  overlay,
  children,
}) => {
  const activeModule = config.modules.find((mod) => mod.moduleId === activeModuleId);
  const canvasMode: SuiteCanvasMode = activeModule?.shell?.canvasMode ?? 'overview';
  const modePreset = SUITE_SHELL_MODE_PRESETS[canvasMode];

  const renderedContent = activeModule && moduleRenderers?.[activeModule.moduleId]
    ? moduleRenderers[activeModule.moduleId](activeModule)
    : children;

  const renderedHeader = activeModule && moduleHeaderRenderers?.[activeModule.moduleId]
    ? moduleHeaderRenderers[activeModule.moduleId](activeModule)
    : activeModule
    ? (
      <ModuleHeader
        title={activeModule.label}
        breadcrumbs={activeModule.breadcrumbs}
        eyebrow={config.identity.suiteName}
      />
    )
    : undefined;

  const renderedToolbar = activeModule && moduleToolbarRenderers?.[activeModule.moduleId]
    ? moduleToolbarRenderers[activeModule.moduleId](activeModule)
    : undefined;

  const renderedContextLeft = activeModule && moduleContextRenderers?.[activeModule.moduleId]
    ? (
      <ModuleContextSidebar
        label={activeModule.shell?.moduleContextSidebar?.label ?? 'Recursos'}
        width={modePreset.contextSidebarWidth}
      >
        {moduleContextRenderers[activeModule.moduleId](activeModule)}
      </ModuleContextSidebar>
    )
    : undefined;

  const renderedContextRight = activeModule && moduleContextPanelRenderers?.[activeModule.moduleId]
    ? (
      <ModuleContextPanel
        label={activeModule.shell?.moduleContextPanel?.label ?? 'Inspector'}
        width={modePreset.contextPanelWidth}
      >
        {moduleContextPanelRenderers[activeModule.moduleId](activeModule)}
      </ModuleContextPanel>
    )
    : undefined;

  return (
    <SuiteShell
      schema={config.navigation}
      navMode={config.navMode ?? 'expanded'}
      activeModuleId={activeModuleId}
      accessMap={config.accessMap}
      suiteTitle={config.identity.suiteName}
      leftSlot={leftSlot}
      centerSlot={centerSlot}
      rightSlot={rightSlot}
      profileSlot={profileSlot}
      onNavigate={onNavigate}
      onNavModeChange={onNavModeChange}
      overlay={overlay}
    >
      <SuiteCanvas
        mode={canvasMode}
        geometryPreset={modePreset.canvasGeometry}
        header={renderedHeader}
        toolbar={renderedToolbar}
        contextAside={renderedContextLeft}
        aside={renderedContextRight}
      >
        {renderedContent}
      </SuiteCanvas>
    </SuiteShell>
  );
};
