import React, { useEffect, useId, useRef, useState } from 'react';
import {
  Check,
  Maximize2,
  LoaderCircle,
  Minus,
  Move,
  Plus,
  RotateCcw,
  X,
  AlertCircle,
  CloudOff,
} from 'lucide-react';
import type {
  CreativeStudioEditorState,
  CreativeStudioShortcutScope,
  CreativeStudioShellState,
} from '../contracts/creativeStudioShell';
import type { ModuleShellZoneWidth } from '../contracts/shell';
import { CanvasGrid } from './CanvasGrid';
import { CANVAS_GRID_DEFAULTS } from './CanvasGrid.config';
import type { CanvasGridProps } from './CanvasGrid';

export interface StudioToolRailItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
  section?: 'core' | 'extensions';
  sectionLabel?: string;
}

export interface StudioToolRailProps {
  items: readonly StudioToolRailItem[];
  activeToolId?: string | null;
  onSelect: (toolId: string) => void;
  label?: string;
  visible?: boolean;
  orientation?: 'vertical' | 'horizontal';
  footerSlot?: React.ReactNode;
  className?: string;
}

/**
 * Small, domain-neutral tool navigation. It owns selection feedback only;
 * editors keep ownership of the selected tool and its associated content.
 */
export const StudioToolRail: React.FC<StudioToolRailProps> = ({
  items,
  activeToolId = null,
  onSelect,
  label = 'Herramientas creativas',
  visible = true,
  orientation = 'vertical',
  footerSlot,
  className = '',
}) => {
  if (!visible) return null;

  return (
    <nav
      aria-label={label}
      data-creative-studio-region="tool-rail"
      className={`flex shrink-0 gap-1 border-slate-800 bg-slate-900 p-1.5 text-white ${
        orientation === 'vertical'
          ? 'w-16 flex-col items-center overflow-y-auto border-r'
          : 'w-full flex-row flex-wrap items-center border-b'
      } ${className}`}
    >
      {items.map((item, index) => {
        const active = item.id === activeToolId;
        const previousItem = items[index - 1];
        const startsSection = item.section && item.section !== previousItem?.section;
        return (
          <React.Fragment key={item.id}>
            {startsSection && index > 0 && (
              <div
                role="separator"
                aria-label={item.sectionLabel}
                data-creative-resource-navigation={item.section}
                className="mx-2 my-2 border-t border-slate-700"
              />
            )}
            {startsSection && item.sectionLabel && (
              <span
                aria-hidden="true"
                className="max-w-14 truncate px-1 py-1 text-center text-[8px] font-black uppercase tracking-wider text-slate-500"
              >
                {item.sectionLabel}
              </span>
            )}
            <button
              type="button"
              disabled={item.disabled}
              aria-label={item.label}
              aria-pressed={active}
              title={item.label}
              data-creative-resource-item={item.id}
              data-creative-resource-section={item.section}
              onClick={() => onSelect(item.id)}
              className={`group relative flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 rounded-xl border px-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                orientation === 'vertical' ? 'flex-col' : 'flex-row'
              } ${
                active
                  ? 'border-brand-cyan/50 bg-primary/25 text-brand-cyan'
                  : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
              } disabled:pointer-events-none disabled:opacity-40`}
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              <span className={orientation === 'vertical' ? 'max-w-14 truncate text-[9px] font-bold' : 'text-xs font-semibold'}>
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-black text-primary-dark">
                  {item.badge}
                </span>
              )}
            </button>
          </React.Fragment>
        );
      })}
      {footerSlot && <div className="mt-auto shrink-0">{footerSlot}</div>}
    </nav>
  );
};

interface StudioPanelProps {
  title?: string;
  visible?: boolean;
  open?: boolean;
  onClose?: () => void;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'light';
  presentation?: 'inline' | 'drawer' | 'overlay';
  width?: ModuleShellZoneWidth;
  ariaLabel?: string;
  /** Identifies the shared chrome contract for visual/integration tests. */
  panelKind?: 'resource' | 'inspector';
  /** Avoids nested landmark elements when SuiteCanvas already owns the aside. */
  as?: 'aside' | 'div';
}

const StudioPanel: React.FC<StudioPanelProps> = ({
  title,
  visible = true,
  open = true,
  onClose,
  headerSlot,
  footerSlot,
  children,
  className = '',
  variant = 'dark',
  presentation = 'inline',
  width,
  ariaLabel,
  panelKind = 'resource',
  as = 'aside',
}) => {
  const titleId = useId();
  if (!visible || !open) return null;
  const dark = variant === 'dark';
  const PanelElement = as;
  const widthClasses: Record<ModuleShellZoneWidth, string> = {
    narrow: 'sm:max-w-56',
    standard: 'sm:max-w-64',
    wide: 'sm:max-w-80',
    'extra-wide': 'sm:max-w-96',
  };
  const widthClass = as === 'aside' && width ? widthClasses[width] : '';

  return (
    <PanelElement
      role={as === 'div' ? 'complementary' : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : ariaLabel}
      data-panel-presentation={presentation}
      data-creative-studio-visible="true"
      data-visual-contract={`shared-studio-${panelKind}-panel`}
      className={`flex min-h-0 w-full shrink-0 flex-col overflow-hidden ${widthClass} ${
        presentation === 'overlay' ? 'absolute inset-y-0 right-0 z-30 shadow-2xl sm:max-w-sm' : ''
      } ${dark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'} ${className}`}
    >
      {(title || headerSlot || onClose) && (
        <div className={`flex min-h-12 shrink-0 items-center justify-between gap-2 border-b px-4 py-2 ${
          dark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="min-w-0 flex-1">
            {title && <h2 id={titleId} className={`truncate text-xs font-black uppercase tracking-wider ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{title}</h2>}
            {headerSlot}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={`Cerrar ${title ?? 'panel'}`}
              className={`flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
                dark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">{children}</div>
      {footerSlot && <div className={`shrink-0 border-t p-3 ${dark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>{footerSlot}</div>}
    </PanelElement>
  );
};

export type StudioResourcePanelProps = Omit<StudioPanelProps, 'ariaLabel'> & { ariaLabel?: string };
export const StudioResourcePanel: React.FC<StudioResourcePanelProps> = (props) => (
  <StudioPanel
    {...props}
    panelKind="resource"
    title={props.title ?? 'Recursos'}
    ariaLabel={props.ariaLabel ?? 'Panel de recursos'}
  />
);

export type StudioInspectorPanelProps = Omit<StudioPanelProps, 'ariaLabel'> & { ariaLabel?: string };
export const StudioInspectorPanel: React.FC<StudioInspectorPanelProps> = (props) => (
  <StudioPanel
    {...props}
    panelKind="inspector"
    title={props.title ?? 'Inspector'}
    ariaLabel={props.ariaLabel ?? 'Panel de inspección'}
  />
);

export interface CanvasChromeProps {
  toolbar?: React.ReactNode;
  topSlot?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  overlays?: React.ReactNode;
  stage?: React.ReactNode;
  stageSlot?: React.ReactNode;
  children?: React.ReactNode;
  stageLabel?: string;
  /** Shared stage backdrop. Pass false to opt out without changing layout. */
  grid?: CanvasGridProps | false;
  className?: string;
}

export const STUDIO_STAGE_TOOLBAR_CLASS =
  'absolute bottom-5 left-1/2 z-40 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-800/90 bg-primary-dark/95 p-1.5 text-xs text-white shadow-2xl backdrop-blur-xl sm:gap-2.5';

export interface StudioStageToolbarProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
  role?: 'toolbar';
  'aria-label'?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  'data-visual-contract'?: string;
}

/** Shared stage-control chrome. Domain tools are supplied as children. */
export const StudioStageToolbar: React.FC<StudioStageToolbarProps> = ({
  children,
  label = 'Controles del lienzo',
  className = '',
  role = 'toolbar',
  'aria-label': ariaLabel,
  onClick,
  'data-visual-contract': visualContract = 'image-studio-stage-toolbar',
}) => (
  <div
    role={role}
    aria-label={ariaLabel ?? label}
    data-visual-contract={visualContract}
    className={`${STUDIO_STAGE_TOOLBAR_CLASS} ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CanvasChrome: React.FC<CanvasChromeProps> = ({
  toolbar,
  topSlot,
  bottomSlot,
  overlays,
  stage,
  stageSlot,
  children,
  stageLabel = 'Lienzo de diseño',
  grid = CANVAS_GRID_DEFAULTS,
  className = '',
}) => {
  const stageContent = stageSlot ?? stage ?? children;

  return (
    <section data-creative-studio-region="canvas" data-visual-contract="creative-studio-canvas-chrome" aria-label="Lienzo de diseño" className={`relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-primary-dark ${className}`}>
      {grid !== false && <CanvasGrid {...grid} />}
      {topSlot && <div className="relative z-10 shrink-0">{topSlot}</div>}
      {toolbar && <div className="relative z-10 shrink-0 border-b border-slate-800 bg-slate-900/95 px-3 py-2">{toolbar}</div>}
      <div className="relative z-10 min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="flex h-full w-full min-h-0 min-w-0 flex-col" role="region" tabIndex={0} aria-label={stageLabel}>{stageContent}</div>
        {overlays && <div className="pointer-events-none absolute inset-0 z-20">{overlays}</div>}
      </div>
      {bottomSlot && <div className="relative z-10 shrink-0 border-t border-slate-800 bg-slate-900">{bottomSlot}</div>}
    </section>
  );
};

export interface ZoomPanControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen?: () => void;
  onReset?: () => void;
  panMode?: boolean;
  onPanModeChange?: (enabled: boolean) => void;
  minZoom?: number;
  maxZoom?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const ZoomPanControls: React.FC<ZoomPanControlsProps> = ({
  zoom,
  onZoomChange,
  onFitToScreen,
  onReset,
  panMode = false,
  onPanModeChange,
  minZoom = 0.25,
  maxZoom = 2,
  step = 0.05,
  disabled = false,
  className = '',
}) => {
  const updateZoom = (next: number) => onZoomChange(Number(clamp(next, minZoom, maxZoom).toFixed(2)));
  return (
    <div role="toolbar" aria-label="Controles de zoom y desplazamiento" className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}>
      {onPanModeChange && (
        <button
          type="button"
          aria-pressed={panMode}
          aria-label={panMode ? 'Desactivar desplazamiento' : 'Activar desplazamiento'}
          onClick={() => onPanModeChange(!panMode)}
          disabled={disabled}
          className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${panMode ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          <Move className="size-4" aria-hidden="true" />
        </button>
      )}
      <button type="button" aria-label="Reducir zoom" onClick={() => updateZoom(zoom - step)} disabled={disabled || zoom <= minZoom} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80">
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <input
        type="range"
        min={minZoom}
        max={maxZoom}
        step={step}
        value={zoom}
        onChange={(event) => updateZoom(Number(event.target.value))}
        disabled={disabled}
        aria-label="Nivel de zoom"
        className="w-20 accent-primary sm:w-28"
      />
      <output className="min-w-12 text-center font-mono text-xs font-bold text-brand-cyan">{Math.round(zoom * 100)}%</output>
      <button type="button" aria-label="Aumentar zoom" onClick={() => updateZoom(zoom + step)} disabled={disabled || zoom >= maxZoom} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80">
        <Plus className="size-4" aria-hidden="true" />
      </button>
          {onFitToScreen && <button type="button" aria-label="Ajustar al lienzo" onClick={onFitToScreen} disabled={disabled} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"><Maximize2 className="size-4" aria-hidden="true" /></button>}
      {onReset && <button type="button" aria-label="Restablecer vista" onClick={onReset} disabled={disabled} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"><RotateCcw className="size-4" aria-hidden="true" /></button>}
    </div>
  );
};

export interface SelectionBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SelectionOverlayProps {
  bounds: SelectionBounds;
  visible?: boolean;
  unit?: '%' | 'px';
  label?: string;
  showHandles?: boolean;
  onSelect?: () => void;
  onResize?: (handle: SelectionHandle, event: React.PointerEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

export type SelectionHandle = 'nw' | 'ne' | 'sw' | 'se';

const handlePosition: Record<SelectionHandle, string> = {
  nw: '-left-2 -top-2',
  ne: '-right-2 -top-2',
  sw: '-bottom-2 -left-2',
  se: '-bottom-2 -right-2',
};

export const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  bounds,
  visible = true,
  unit = '%',
  label = 'Selección',
  showHandles = true,
  onSelect,
  onResize,
  children,
  className = '',
}) => {
  if (!visible) return null;
  const position = (value: number) => `${value}${unit}`;
  return (
    <div
      role="group"
      aria-label={label}
      data-creative-studio-region="selection-overlay"
      onClick={onSelect}
      className={`pointer-events-auto absolute border-2 border-primary bg-primary/5 focus-within:ring-2 focus-within:ring-brand-cyan/80 ${className}`}
      style={{ left: position(bounds.left), top: position(bounds.top), width: position(bounds.width), height: position(bounds.height) }}
    >
      {children}
      {showHandles && (
        (['nw', 'ne', 'sw', 'se'] as const).map((handle) => (
          <button
            key={handle}
            type="button"
            aria-label={`Redimensionar ${label} (${handle})`}
            onPointerDown={(event) => onResize?.(handle, event)}
            className={`absolute ${handlePosition[handle]} min-h-11 min-w-11 rounded-full border-2 border-primary bg-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80`}
          />
        ))
      )}
    </div>
  );
};

export interface LayerAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  tone?: 'neutral' | 'accent' | 'danger';
}

export interface LayerActionMenuProps {
  actions: readonly LayerAction[];
  onAction: (actionId: string) => void;
  visible?: boolean;
  label?: string;
  className?: string;
}

export const LayerActionMenu: React.FC<LayerActionMenuProps> = ({
  actions,
  onAction,
  visible = true,
  label = 'Acciones de capa',
  className = '',
}) => {
  if (!visible) return null;
  const toneClasses: Record<NonNullable<LayerAction['tone']>, string> = {
    neutral: 'text-slate-300 hover:bg-slate-800 hover:text-white',
    accent: 'text-brand-cyan hover:bg-primary/30',
    danger: 'text-red-200 hover:bg-red-500/20 hover:text-red-100',
  };
  return (
    <div role="toolbar" aria-label={label} className={`flex flex-wrap items-center gap-1 rounded-xl border border-slate-700 bg-slate-900/95 p-1 text-white shadow-xl ${className}`}>
      {actions.filter((action) => !action.hidden).map((action) => (
        <button
          key={action.id}
          type="button"
          aria-label={action.label}
          title={action.label}
          disabled={action.disabled}
          onClick={() => onAction(action.id)}
          className={`flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 disabled:opacity-40 ${toneClasses[action.tone ?? 'neutral']}`}
        >
          {action.icon && <span aria-hidden="true">{action.icon}</span>}
          <span className="hidden sm:inline">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export interface ShortcutBinding {
  id?: string;
  shortcut: string;
  onTrigger: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  allowInInput?: boolean;
}

export interface ShortcutManagerProps {
  bindings: readonly ShortcutBinding[];
  enabled?: boolean;
  scope?: CreativeStudioShortcutScope;
  target?: EventTarget;
  onShortcut?: (shortcut: string, event: KeyboardEvent) => void;
  children?: React.ReactNode;
}

const isEditableTarget = (target: EventTarget | null) => {
  if (typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
};

export const matchesShortcut = (event: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey'>, shortcut: string) => {
  const parts = shortcut.toLowerCase().split('+').map((part) => part.trim()).filter(Boolean);
  const keyPart = parts.find((part) => !['mod', 'cmd', 'command', 'ctrl', 'control', 'alt', 'option', 'shift'].includes(part));
  const keyAliases: Record<string, string> = { esc: 'escape', space: ' ', return: 'enter', del: 'delete' };
  const key = keyPart ? keyAliases[keyPart] ?? keyPart : undefined;
  if (!key) return false;
  const mod = parts.includes('mod') || parts.includes('cmd') || parts.includes('command');
  const ctrl = parts.includes('ctrl') || parts.includes('control');
  const alt = parts.includes('alt') || parts.includes('option');
  const shift = parts.includes('shift');
  const modifierMatch = mod
    ? event.metaKey || event.ctrlKey
    : event.metaKey === false && event.ctrlKey === ctrl;
  return event.key.toLowerCase() === key &&
    modifierMatch &&
    event.altKey === alt &&
    event.shiftKey === shift;
};

export const handleShortcutEvent = (
  event: KeyboardEvent,
  bindings: readonly ShortcutBinding[],
  onShortcut?: (shortcut: string, event: KeyboardEvent) => void,
) => {
  const binding = bindings.find((candidate) => (candidate.allowInInput || !isEditableTarget(event.target)) && matchesShortcut(event, candidate.shortcut));
  if (!binding) return false;
  if (binding.preventDefault !== false) event.preventDefault();
  if (binding.stopPropagation) event.stopPropagation();
  binding.onTrigger(event);
  onShortcut?.(binding.shortcut, event);
  return true;
};

export interface ShortcutManagerController {
  setOptions: (options: Pick<ShortcutManagerProps, 'bindings' | 'onShortcut' | 'enabled'>) => void;
  dispose: () => void;
}

interface ShortcutRegistration {
  id: number;
  bindings: readonly ShortcutBinding[];
  onShortcut?: (shortcut: string, event: KeyboardEvent) => void;
}

interface ShortcutScopeRegistry {
  registrations: Map<number, ShortcutRegistration>;
  listener: (event: Event) => void;
}

const shortcutRegistries = new WeakMap<EventTarget, Map<CreativeStudioShortcutScope, ShortcutScopeRegistry>>();
const handledShortcutEvents = new WeakSet<KeyboardEvent>();
let nextShortcutRegistrationId = 1;

const getShortcutRegistry = (
  target: EventTarget,
  scope: CreativeStudioShortcutScope,
): ShortcutScopeRegistry => {
  let scopes = shortcutRegistries.get(target);
  if (!scopes) {
    scopes = new Map();
    shortcutRegistries.set(target, scopes);
  }
  const existing = scopes.get(scope);
  if (existing) return existing;

  const registry: ShortcutScopeRegistry = {
    registrations: new Map(),
    listener: () => undefined,
  };
  registry.listener = (event) => {
    if (!('key' in event) || handledShortcutEvents.has(event as KeyboardEvent)) return;
    const keyboardEvent = event as KeyboardEvent;
    for (const registration of registry.registrations.values()) {
      if (handleShortcutEvent(keyboardEvent, registration.bindings, registration.onShortcut)) {
        handledShortcutEvents.add(keyboardEvent);
        break;
      }
    }
  };
  scopes.set(scope, registry);
  target.addEventListener('keydown', registry.listener);
  return registry;
};

export interface CreateShortcutManagerOptions {
  bindings: readonly ShortcutBinding[];
  enabled?: boolean;
  scope?: CreativeStudioShortcutScope;
  target?: EventTarget;
  onShortcut?: (shortcut: string, event: KeyboardEvent) => void;
}

/**
 * Registers one shared listener per target/scope. Registrations are ordered,
 * so an exact shortcut is handled once and a later duplicate cannot fire.
 */
export const createShortcutManager = ({
  bindings,
  enabled = true,
  scope = 'consumer',
  target,
  onShortcut,
}: CreateShortcutManagerOptions): ShortcutManagerController => {
  const eventTarget = target ?? (typeof document !== 'undefined' ? document : undefined);
  const registrationId = nextShortcutRegistrationId++;
  let registry: ShortcutScopeRegistry | undefined;
  let currentBindings = bindings;
  let currentCallback = onShortcut;
  let currentEnabled = false;
  let disposed = false;

  const enable = () => {
    if (currentEnabled || !eventTarget) return;
    registry = getShortcutRegistry(eventTarget, scope);
    registry.registrations.set(registrationId, {
      id: registrationId,
      get bindings() {
        return currentBindings;
      },
      get onShortcut() {
        return currentCallback;
      },
    });
    currentEnabled = true;
  };
  const disable = () => {
    if (!currentEnabled || !registry || !eventTarget) return;
    registry.registrations.delete(registrationId);
    if (registry.registrations.size === 0) {
      eventTarget.removeEventListener('keydown', registry.listener);
      shortcutRegistries.get(eventTarget)?.delete(scope);
    }
    registry = undefined;
    currentEnabled = false;
  };

  if (enabled) enable();
  return {
    setOptions: (options) => {
      if (disposed) return;
      currentBindings = options.bindings;
      currentCallback = options.onShortcut;
      if (options.enabled && !currentEnabled) enable();
      if (!options.enabled && currentEnabled) disable();
    },
    dispose: () => {
      disposed = true;
      disable();
    },
  };
};

export const ShortcutManager: React.FC<ShortcutManagerProps> = ({
  bindings,
  enabled = true,
  scope = 'consumer',
  target,
  onShortcut,
  children,
}) => {
  const controllerRef = useRef<ShortcutManagerController | null>(null);
  const eventTarget = target ?? (typeof document !== 'undefined' ? document : undefined);
  useEffect(() => {
    const controller = createShortcutManager({ bindings: [], enabled: false, scope, target: eventTarget });
    controllerRef.current = controller;
    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, [eventTarget, scope]);
  useEffect(() => {
    controllerRef.current?.setOptions({ bindings, enabled, onShortcut });
  }, [bindings, enabled, onShortcut]);
  return <>{children}</>;
};

/** Shared online signal used by both editors without taking persistence ownership. */
export const useCreativeStudioOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    () => typeof navigator === 'undefined' || navigator.onLine !== false,
  );
  useEffect(() => {
    const handleOffline = () => setIsOnline(false);
    const handleOnline = () => setIsOnline(true);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  return isOnline;
};

const statusMeta: Record<CreativeStudioEditorState, { label: string; className: string; icon: React.ReactNode }> = {
  saved: { label: 'Guardado', className: 'text-emerald-400', icon: <Check className="size-3.5" aria-hidden="true" /> },
  saving: { label: 'Guardando', className: 'text-accent', icon: <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> },
  error: { label: 'Error', className: 'text-red-400', icon: <AlertCircle className="size-3.5" aria-hidden="true" /> },
  offline: { label: 'Sin conexión', className: 'text-slate-300', icon: <CloudOff className="size-3.5" aria-hidden="true" /> },
  rendering: { label: 'Renderizando', className: 'text-accent', icon: <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> },
};

export interface LiveStatusProps {
  status?: CreativeStudioEditorState;
  state?: Pick<CreativeStudioShellState, 'status' | 'message' | 'lastSavedAt' | 'error'>;
  message?: string;
  lastSavedAt?: string;
  visible?: boolean;
  politeness?: 'polite' | 'assertive';
  onRetry?: () => void;
  className?: string;
}

export const LiveStatus: React.FC<LiveStatusProps> = ({
  status,
  state,
  message,
  lastSavedAt,
  visible = true,
  politeness,
  onRetry,
  className = '',
}) => {
  if (!visible) return null;
  const resolvedStatus = status ?? state?.status ?? 'saved';
  const resolvedMessage = message ?? state?.message ?? state?.error?.message;
  const resolvedLastSavedAt = lastSavedAt ?? state?.lastSavedAt;
  const meta = statusMeta[resolvedStatus];
  const resolvedPoliteness = politeness ?? (resolvedStatus === 'error' ? 'assertive' : 'polite');
  return (
    <div role={resolvedPoliteness === 'assertive' ? 'alert' : 'status'} aria-live={resolvedPoliteness} data-status={resolvedStatus} className={`flex min-h-11 items-center gap-1.5 text-xs font-semibold ${meta.className} ${className}`}>
      {meta.icon}
      <span>{resolvedMessage ?? meta.label}</span>
      {resolvedLastSavedAt && resolvedStatus === 'saved' && <time className="text-slate-500" dateTime={resolvedLastSavedAt}>· {resolvedLastSavedAt}</time>}
      {resolvedStatus === 'error' && onRetry && (
        <button type="button" onClick={onRetry} className="min-h-11 min-w-11 px-2 underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80">
          Reintentar
        </button>
      )}
    </div>
  );
};

export interface BottomWorkspaceProps {
  title?: string;
  'aria-label'?: string;
  visible?: boolean;
  open?: boolean;
  onClose?: () => void;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const BottomWorkspace: React.FC<BottomWorkspaceProps> = ({
  title = 'Área de trabajo',
  'aria-label': ariaLabel,
  visible = true,
  open = true,
  onClose,
  headerSlot,
  footerSlot,
  children,
  className = '',
}) => {
  if (!visible || !open) return null;
  return (
    <section aria-label={ariaLabel ?? title} data-creative-studio-region="bottom-workspace" data-visual-contract="creative-studio-bottom-workspace" className={`flex max-h-[45vh] min-h-0 w-full flex-col border-t border-slate-800 bg-slate-900 text-white ${className}`}>
      <header className="flex min-h-12 shrink-0 items-center justify-between gap-2 border-b border-slate-800 px-3 py-2">
        <h2 className="truncate text-xs font-black uppercase tracking-wider text-slate-200">{title}</h2>
        <div className="flex items-center gap-1">
          {headerSlot}
          {onClose && <button type="button" onClick={onClose} aria-label={`Cerrar ${title}`} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"><X className="size-4" aria-hidden="true" /></button>}
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-3">{children}</div>
      {footerSlot && <footer className="shrink-0 border-t border-slate-800 p-3">{footerSlot}</footer>}
    </section>
  );
};
