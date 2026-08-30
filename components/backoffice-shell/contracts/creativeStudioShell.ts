/**
 * Contrato neutral del shell compartido por Image Studio y Video Studio.
 *
 * Este archivo describe composición y ownership de interacción. No contiene
 * lógica de carrusel, timeline, audio, exportación ni renderer.
 */

import type { ReactNode } from 'react';

export const CREATIVE_STUDIO_SHELL_REGIONS = [
  'platformHeader',
  'suiteNavigation',
  'moduleHeader',
  'toolRail',
  'resourcePanel',
  'toolbar',
  'stage',
  'inspector',
  'layersPanel',
  'bottomWorkspace',
  'overlays',
] as const;

export type CreativeStudioShellRegion = (typeof CREATIVE_STUDIO_SHELL_REGIONS)[number];

export const CREATIVE_STUDIO_EDITOR_STATES = [
  'saved',
  'saving',
  'error',
  'offline',
  'rendering',
] as const;

export type CreativeStudioEditorState = (typeof CREATIVE_STUDIO_EDITOR_STATES)[number];
export type CreativeStudioShellStatus = CreativeStudioEditorState;
export type CreativeStudioShortcutScope = 'shell' | 'stage' | 'consumer';

export interface CreativeStudioSelectionState {
  selectedIds: readonly string[];
  primaryId?: string | null;
}

export interface CreativeStudioContextualAction {
  id: string;
  label: string;
  disabled?: boolean;
  hidden?: boolean;
}

export interface CreativeStudioShellError {
  code?: string;
  message: string;
  retryable?: boolean;
}

export interface CreativeStudioShellState {
  status: CreativeStudioEditorState;
  message?: string;
  error?: CreativeStudioShellError;
  lastSavedAt?: string;
}

export interface CreativeStudioShellInteraction {
  /**
   * El consumidor conserva el ownership por defecto durante la migración.
   * El shell solo podrá asumirlo cuando una futura implementación lo declare.
   */
  ownership?: Partial<{
    panelVisibility: 'consumer' | 'shell';
    focus: 'consumer' | 'shell';
    shortcuts: 'consumer' | 'shell';
  }>;
  panelVisibility?: Partial<Record<CreativeStudioShellRegion, boolean>>;
  focusedRegion?: CreativeStudioShellRegion;
  selection?: CreativeStudioSelectionState;
  contextualActions?: readonly CreativeStudioContextualAction[];
  shortcuts?: {
    enabled?: boolean;
    scope?: CreativeStudioShortcutScope;
  };
  onPanelVisibilityChange?: (region: CreativeStudioShellRegion, visible: boolean) => void;
  onFocusRegionChange?: (region: CreativeStudioShellRegion | null) => void;
  onSelectionChange?: (selection: CreativeStudioSelectionState) => void;
  onContextualAction?: (actionId: string) => void;
  onShortcut?: (shortcut: string, event: KeyboardEvent) => void;
}

export const CREATIVE_STUDIO_DEFAULT_INTERACTION_OWNERSHIP = {
  panelVisibility: 'consumer',
  focus: 'consumer',
  shortcuts: 'consumer',
} as const;

export interface CreativeStudioShellSlotContext<
  TDomainExtension extends CreativeStudioShellExtension = CreativeStudioShellExtension,
> {
  domain: TDomainExtension['domain'];
  extension?: TDomainExtension;
  state: CreativeStudioShellState;
  interaction: CreativeStudioShellInteraction;
}

export type CreativeStudioShellSlot<
  TDomainExtension extends CreativeStudioShellExtension = CreativeStudioShellExtension,
> =
  | ReactNode
  | ((context: CreativeStudioShellSlotContext<TDomainExtension>) => ReactNode);

/**
 * All regions are optional at the type level so a host can progressively adopt
 * the contract. `stage` is required by CreativeStudioShellSlots because an
 * editor without a stage is not a valid workspace.
 */
export type CreativeStudioShellRegions<
  TDomainExtension extends CreativeStudioShellExtension = CreativeStudioShellExtension,
> = Partial<
  Record<CreativeStudioShellRegion, CreativeStudioShellSlot<TDomainExtension>>
>;

export type CreativeStudioShellSlots<
  TDomainExtension extends CreativeStudioShellExtension = CreativeStudioShellExtension,
> = Omit<
  CreativeStudioShellRegions<TDomainExtension>,
  'stage'
> & {
  stage: CreativeStudioShellSlot<TDomainExtension>;
};

export type CreativeStudioShellRegionSlots<
  TDomainExtension extends CreativeStudioShellExtension = CreativeStudioShellExtension,
> =
  CreativeStudioShellSlots<TDomainExtension>;

export type CreativeStudioCommonCapability =
  | 'platform-header'
  | 'suite-navigation'
  | 'module-header'
  | 'tool-rail'
  | 'resource-panel'
  | 'toolbar'
  | 'stage'
  | 'inspector'
  | 'layers-panel'
  | 'bottom-workspace'
  | 'overlays';

export type CreativeStudioImageCapability = 'slide-strip' | 'preview' | 'crop' | 'export';
export type CreativeStudioVideoCapability = 'scenes' | 'timeline' | 'transport' | 'audio' | 'remotion';

export const CREATIVE_STUDIO_DOMAIN_CAPABILITIES = {
  image: ['slide-strip', 'preview', 'crop', 'export'],
  video: ['scenes', 'timeline', 'transport', 'audio', 'remotion'],
} as const;

export interface CreativeStudioImageExtensionSlots {
  slideStrip?: CreativeStudioShellSlot<CreativeStudioImageStudioExtension>;
  preview?: CreativeStudioShellSlot<CreativeStudioImageStudioExtension>;
  crop?: CreativeStudioShellSlot<CreativeStudioImageStudioExtension>;
  export?: CreativeStudioShellSlot<CreativeStudioImageStudioExtension>;
}

export interface CreativeStudioImageStudioExtension {
  domain: 'image';
  capabilities?: readonly CreativeStudioImageCapability[];
  slots?: CreativeStudioImageExtensionSlots;
}

export interface CreativeStudioVideoExtensionSlots {
  scenes?: CreativeStudioShellSlot<CreativeStudioVideoStudioExtension>;
  timeline?: CreativeStudioShellSlot<CreativeStudioVideoStudioExtension>;
  transport?: CreativeStudioShellSlot<CreativeStudioVideoStudioExtension>;
  audio?: CreativeStudioShellSlot<CreativeStudioVideoStudioExtension>;
  remotion?: CreativeStudioShellSlot<CreativeStudioVideoStudioExtension>;
}

export interface CreativeStudioVideoStudioExtension {
  domain: 'video';
  capabilities?: readonly CreativeStudioVideoCapability[];
  slots?: CreativeStudioVideoExtensionSlots;
}

export type CreativeStudioShellExtension =
  | CreativeStudioImageStudioExtension
  | CreativeStudioVideoStudioExtension;

export interface CreativeStudioShellProps<
  TDomainExtension extends CreativeStudioShellExtension = CreativeStudioShellExtension,
> {
  domain: TDomainExtension['domain'];
  state: CreativeStudioShellState;
  slots: CreativeStudioShellSlots<TDomainExtension>;
  capabilities?: readonly CreativeStudioCommonCapability[];
  extensions?: TDomainExtension;
  interaction?: CreativeStudioShellInteraction;
  className?: string;
}

/** Alias nominal del contrato, reservado para la futura implementación React. */
export type CreativeStudioShell<
  TDomainExtension extends CreativeStudioShellExtension = CreativeStudioShellExtension,
> = CreativeStudioShellProps<TDomainExtension>;

/**
 * Non-negotiable requirements for future shell implementations. They are
 * declared here without claiming that existing shells already implement them.
 */
export interface CreativeStudioShellRequirements {
  mobileFirst: true;
  minTouchTargetPx: 44;
  labelledRegions: true;
  visibleFocus: true;
  keyboardNavigation: true;
  statusLiveRegion: 'polite' | 'assertive';
}

export const CREATIVE_STUDIO_SHELL_REQUIREMENTS: CreativeStudioShellRequirements = {
  mobileFirst: true,
  minTouchTargetPx: 44,
  labelledRegions: true,
  visibleFocus: true,
  keyboardNavigation: true,
  statusLiveRegion: 'polite',
};
