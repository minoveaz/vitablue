import type { ReactNode } from 'react';
import type {
  AccessMap,
  NavMode,
  NavRouteRef,
  NavigationSchema,
  TelemetryMap,
} from './contracts/navigation';
import type { SuiteCanvasMode } from './contracts/shell';
import type {
  CreativeStudioShellExtension,
  CreativeStudioShellProps,
} from './contracts/creativeStudioShell';
import { SuiteShell } from './SuiteShell';
import { SuiteCanvas } from './SuiteCanvas';
import { mapCreativeStudioShellSlots } from './CreativeStudioShellAdapter.utils';
import { LiveStatus } from './primitives';

/**
 * Composition boundary for the typed Creative Studio shell contract.
 *
 * SuiteShell remains the only owner of global navigation and PlatformHeader;
 * SuiteCanvas remains the only owner of the common canvas layout. This adapter
 * only maps contract slots to those existing owners and does not extract or
 * replace editor primitives.
 */
export interface CreativeStudioShellAdapterProps<
  TDomainExtension extends CreativeStudioShellExtension = CreativeStudioShellExtension,
> extends CreativeStudioShellProps<TDomainExtension> {
  schema: NavigationSchema;
  onNavigate: (route: NavRouteRef) => void;
  activeModuleId?: string;
  navMode?: NavMode;
  accessMap?: AccessMap;
  telemetry?: TelemetryMap;
  suiteTitle?: string;
  leftSlot?: ReactNode;
  centerSlot?: ReactNode;
  rightSlot?: ReactNode;
  profileSlot?: ReactNode;
  onNavModeChange?: (mode: 'expanded' | 'rail') => void;
  canvasMode?: SuiteCanvasMode;
  /** Opt-in mobile guard; the editor remains available only from md upward. */
  mobileSafeMode?: boolean;
  mobileSafeModeTitle?: string;
  mobileSafeModeDescription?: string;
  /**
   * Opt-in status presentation for hosts that want the shared lifecycle
   * primitive. Existing editors keep their current status UI by default.
   */
  showLiveStatus?: boolean;
}

export const CreativeStudioShellAdapter = <
  TDomainExtension extends CreativeStudioShellExtension = CreativeStudioShellExtension,
>(
  props: CreativeStudioShellAdapterProps<TDomainExtension>,
) => {
  const mappedSlots = mapCreativeStudioShellSlots(props);
  const footer = props.showLiveStatus ? (
    <div className="flex flex-wrap items-center gap-3" aria-label="Estado del editor">
      <LiveStatus
        status={props.state.status}
        message={props.state.message ?? props.state.error?.message}
        lastSavedAt={props.state.lastSavedAt}
      />
      {mappedSlots.footer}
    </div>
  ) : mappedSlots.footer;
  // Global header and navigation are deliberately owned by SuiteShell. The
  // contract slots for those regions are reserved for a future host override,
  // so accepting them here must not render a second header or sidebar.
  return (
    <div className={props.className} data-creative-studio-shell="adapter">
      <SuiteShell
        schema={props.schema}
        navMode={props.navMode}
        activeModuleId={props.activeModuleId}
        accessMap={props.accessMap}
        telemetry={props.telemetry}
        suiteTitle={props.suiteTitle}
        leftSlot={props.leftSlot}
        centerSlot={props.centerSlot}
        rightSlot={props.rightSlot}
        profileSlot={props.profileSlot}
        onNavigate={props.onNavigate}
        onNavModeChange={props.onNavModeChange}
        overlay={mappedSlots.overlays}
      >
        <SuiteCanvas
          mode={props.canvasMode ?? 'workspace'}
          header={mappedSlots.moduleHeader}
          toolbar={mappedSlots.toolbar}
          contextAside={mappedSlots.contextAside}
          aside={mappedSlots.aside}
          footer={footer}
          mobileSafeMode={props.mobileSafeMode}
          mobileSafeModeTitle={props.mobileSafeModeTitle}
          mobileSafeModeDescription={props.mobileSafeModeDescription}
        >
          {mappedSlots.stage}
        </SuiteCanvas>
      </SuiteShell>
    </div>
  );
};
