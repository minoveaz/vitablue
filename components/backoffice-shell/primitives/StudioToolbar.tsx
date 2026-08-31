import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Download,
  Focus,
  Image as ImageIcon,
  LoaderCircle,
  MoreHorizontal,
  PanelTop,
  Pencil,
  Redo2,
  Ruler,
  Scan,
  ShieldAlert,
  SlidersHorizontal,
  Smartphone,
  Undo2,
} from 'lucide-react';
import type { CreativeStudioEditorState } from '../contracts/creativeStudioShell';
import { LiveStatus } from './StudioPrimitives';

export type StudioToolbarPreviewMode = 'normal' | 'focus' | 'guides' | 'overview';

export interface StudioToolbarMenuAction {
  label: string;
  activeLabel?: string;
  activeIcon?: React.ReactNode;
  icon?: React.ReactNode;
  onSelect?: () => void;
  to?: string;
}

export interface StudioToolbarExportOption {
  label: string;
  badge?: string;
  badgeClassName?: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface StudioToolbarProps {
  title: string;
  titleIcon?: React.ReactNode;
  titlePlaceholder?: string;
  titleLabel?: string;
  onUpdateTitle?: (title: string) => void;
  onBackToHub?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  showSafeZones?: boolean;
  onToggleSafeZones?: () => void;
  safeZonesVisible?: boolean;
  previewMode?: StudioToolbarPreviewMode;
  onSetPreviewMode?: (mode: StudioToolbarPreviewMode) => void;
  mobilePreview?: {
    onOpen: () => void;
    label?: string;
  };
  extensions?: React.ReactNode;
  isInspectorOpen?: boolean;
  onToggleInspector?: () => void;
  onCopyToClipboard?: () => void | Promise<void>;
  copyLabel?: string;
  copySuccessLabel?: string;
  copyAriaLabel?: string;
  moreActions?: readonly StudioToolbarMenuAction[];
  exportOptions?: readonly StudioToolbarExportOption[];
  exportHeading?: string;
  exportLabel?: string;
  isExporting?: boolean;
  status?: CreativeStudioEditorState;
  statusMessage?: string;
  lastSavedAt?: string;
  onRetryStatus?: () => void;
  ariaLabel?: string;
  className?: string;
}

export const studioToolbarButtonClass =
  'flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80';

export const studioToolbarSegmentedButtonClass = (active: boolean) =>
  `flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
    active
      ? 'bg-primary/30 text-brand-cyan'
      : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'
  }`;

export const studioToolbarChoiceButtonClass = (active: boolean) =>
  `flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
    active
      ? 'border-brand-cyan/30 bg-primary/30 text-brand-cyan shadow-xs'
      : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
  }`;

export const StudioToolbar: React.FC<StudioToolbarProps> = ({
  title,
  titleIcon = <ImageIcon className="size-3.5" aria-hidden="true" />,
  titlePlaceholder = 'Nombre del diseño...',
  titleLabel = 'Nombre del diseño',
  onUpdateTitle,
  onBackToHub,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  showSafeZones = false,
  onToggleSafeZones,
  safeZonesVisible = true,
  previewMode,
  onSetPreviewMode,
  mobilePreview,
  extensions,
  isInspectorOpen = false,
  onToggleInspector,
  onCopyToClipboard,
  copyLabel = 'Copiar',
  copySuccessLabel = '¡Copiada!',
  copyAriaLabel = 'Copiar imagen',
  moreActions = [],
  exportOptions = [],
  exportHeading,
  exportLabel = 'Descargar',
  isExporting = false,
  status = 'saved',
  statusMessage,
  lastSavedAt,
  onRetryStatus,
  ariaLabel = 'Controles del estudio',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [activeActionLabel, setActiveActionLabel] = useState<string | null>(null);
  const titleInputId = React.useId();
  const exportRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExportMenuOpen(false);
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCopy = async () => {
    await onCopyToClipboard?.();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = (action: StudioToolbarMenuAction) => {
    action.onSelect?.();
    if (action.activeLabel) {
      setActiveActionLabel(action.label);
      window.setTimeout(() => setActiveActionLabel(null), 2500);
    }
    setIsMoreMenuOpen(false);
  };

  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      data-visual-contract="image-studio-toolbar"
      data-creative-studio-contract="creative-studio-toolbar"
      className={`flex min-h-11 w-full max-w-full flex-wrap items-center justify-between gap-2.5 overflow-x-auto py-0.5 text-white select-none ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {onBackToHub && (
          <button
            type="button"
            onClick={onBackToHub}
            aria-label="Volver al Hub de proyectos"
            className={`${studioToolbarButtonClass} shrink-0 px-2.5 text-slate-300`}
            title="Volver al Hub de proyectos"
          >
            <ArrowLeft className="size-3.5 text-slate-400" aria-hidden="true" />
            <span className="hidden sm:inline">Hub</span>
          </button>
        )}

        <div className="flex min-w-0 max-w-[280px] flex-1 items-center gap-2 sm:max-w-xs md:max-w-sm">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-brand-cyan">
            {titleIcon}
          </div>
          {onUpdateTitle ? (
            <div className="group relative flex min-w-0 flex-1 items-center">
              <label className="sr-only" htmlFor={titleInputId}>
                {titleLabel}
              </label>
              <input
                id={titleInputId}
                type="text"
                value={title}
                onChange={(event) => onUpdateTitle(event.target.value)}
                placeholder={titlePlaceholder}
                className="w-full truncate rounded-lg border border-slate-800 bg-slate-900/60 py-1 pl-2.5 pr-7 text-xs font-bold text-slate-100 shadow-inner outline-none transition-all hover:border-slate-700 hover:bg-slate-900 focus:border-brand-cyan focus:bg-slate-950"
                title={titleLabel}
              />
              <Pencil className="pointer-events-none absolute right-2 size-3 text-slate-500 transition-colors group-hover:text-slate-300" aria-hidden="true" />
            </div>
          ) : (
            <span className="truncate text-xs font-bold text-slate-100" title={title}>
              {title}
            </span>
          )}
        </div>

        <LiveStatus
          status={status}
          message={statusMessage}
          lastSavedAt={lastSavedAt}
          onRetry={onRetryStatus}
          className="min-h-0 shrink-0 rounded-full border border-slate-800 px-2 py-0.5 text-[10px] font-mono"
        />
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        {(onUndo || onRedo) && (
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-0.5 shadow-xs">
            {onUndo && (
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Deshacer"
                className="flex min-h-11 min-w-11 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                title="Deshacer (Cmd+Z)"
              >
                <Undo2 className="size-3.5" aria-hidden="true" />
              </button>
            )}
            {onRedo && (
              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Rehacer"
                className="flex min-h-11 min-w-11 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                title="Rehacer (Cmd+Shift+Z)"
              >
                <Redo2 className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {previewMode && onSetPreviewMode && (
          <div className="hidden items-center gap-0.5 rounded-xl border border-slate-800 bg-slate-950 p-0.5 lg:flex">
            {([
              ['normal', PanelTop, 'Vista normal'],
              ['focus', Focus, 'Enfocar slide activo'],
              ['guides', Ruler, 'Vista de guías'],
              ['overview', Scan, 'Vista panorámica'],
            ] as const).map(([mode, Icon, label]) => (
              <button
                key={mode}
                type="button"
                aria-pressed={previewMode === mode}
                onClick={() => onSetPreviewMode(mode)}
                aria-label={label}
                className={studioToolbarSegmentedButtonClass(previewMode === mode)}
                title={label}
              >
                <Icon className="size-3.5" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        {onToggleSafeZones && safeZonesVisible && (
          <button
            type="button"
            onClick={onToggleSafeZones}
            aria-label={showSafeZones ? 'Ocultar zonas seguras' : 'Mostrar zonas seguras'}
            aria-pressed={showSafeZones}
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
              showSafeZones
                ? 'border-accent bg-accent/20 text-accent shadow-xs'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
            title={showSafeZones ? 'Ocultar reglas, guías y zonas seguras' : 'Mostrar reglas, guías y zonas seguras de plataforma'}
          >
            <ShieldAlert className="size-3.5" aria-hidden="true" />
          </button>
        )}

        {mobilePreview && (
          <button
            type="button"
            onClick={mobilePreview.onOpen}
            className="flex min-h-11 items-center gap-1.5 rounded-lg border border-brand-cyan/40 bg-brand-cyan/15 px-2.5 py-1 text-xs font-bold text-brand-cyan transition-all hover:bg-brand-cyan/25 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
            title={mobilePreview.label ?? 'Abrir simulador móvil interactivo'}
          >
            <Smartphone className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">{mobilePreview.label ?? 'Vista Previa Móvil'}</span>
          </button>
        )}

        {extensions}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {onToggleInspector && (
          <button
            type="button"
            onClick={onToggleInspector}
            aria-label="Mostrar panel de propiedades"
            aria-pressed={isInspectorOpen}
            className={`${studioToolbarButtonClass} ${
              isInspectorOpen ? 'border-primary bg-primary text-white shadow-xs' : ''
            }`}
            title="Mostrar / Ocultar panel de propiedades"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            <span className="hidden md:inline">Propiedades</span>
          </button>
        )}

        {onCopyToClipboard && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? `${copyLabel} copiado` : copyAriaLabel}
            className={`${studioToolbarButtonClass} ${
              copied ? 'border-teal-500 bg-teal-950/60 text-brand-cyan shadow-xs' : ''
            }`}
            title={copyAriaLabel}
          >
            {copied ? (
              <Check className="size-3.5 text-brand-cyan" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5 text-slate-400" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{copied ? copySuccessLabel : copyLabel}</span>
          </button>
        )}

        {moreActions.length > 0 && (
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen((open) => !open)}
              aria-label="Más opciones e integraciones"
              aria-haspopup="menu"
              aria-expanded={isMoreMenuOpen}
              className={`${studioToolbarButtonClass} min-w-11 px-0`}
              title="Más opciones e integraciones"
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
            </button>
            {isMoreMenuOpen && (
              <div role="menu" className="absolute right-0 top-full z-[100] mt-2 w-52 rounded-2xl border border-slate-800 bg-slate-950 p-1.5 text-xs text-white shadow-2xl">
                {moreActions.map((action) =>
                  action.to ? (
                    <Link
                      key={action.label}
                      to={action.to}
                      role="menuitem"
                      onClick={() => handleAction(action)}
                      className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 transition-colors hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                    >
                      <span aria-hidden="true">
                        {activeActionLabel === action.label ? action.activeIcon ?? action.icon : action.icon}
                      </span>
                      <span>{activeActionLabel === action.label ? action.activeLabel ?? action.label : action.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={action.label}
                      type="button"
                      role="menuitem"
                      onClick={() => handleAction(action)}
                      className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-bold text-slate-200 transition-colors hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                    >
                      <span aria-hidden="true">
                        {activeActionLabel === action.label ? action.activeIcon ?? action.icon : action.icon}
                      </span>
                      <span>{activeActionLabel === action.label ? action.activeLabel ?? action.label : action.label}</span>
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        {exportOptions.length > 0 && (
          <div className="relative" ref={exportRef}>
          <button
            type="button"
            disabled={isExporting}
            onClick={() => setIsExportMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={isExportMenuOpen}
            aria-label={exportLabel}
            className="flex min-h-11 items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-primary-dark shadow-sm transition-all hover:bg-amber-400 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
          >
            {isExporting ? (
              <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="size-3.5" aria-hidden="true" />
            )}
            <span>{exportLabel}</span>
            <ChevronDown className="size-3" aria-hidden="true" />
          </button>
          {isExportMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-[100] mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-950 p-1.5 text-white shadow-2xl"
            >
              {exportHeading && (
                <div className="mb-1 border-b border-slate-800/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-cyan">
                  {exportHeading}
                </div>
              )}
              {exportOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  role="menuitem"
                  disabled={option.disabled}
                  onClick={() => {
                    option.onSelect();
                    setIsExportMenuOpen(false);
                  }}
                  className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 transition-colors hover:bg-slate-900 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                >
                  <span>{option.label}</span>
                  {option.badge && (
                    <span className={`rounded px-1.5 py-0.5 text-[9px] ${option.badgeClassName ?? 'bg-slate-800 text-brand-cyan'}`}>
                      {option.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
};
