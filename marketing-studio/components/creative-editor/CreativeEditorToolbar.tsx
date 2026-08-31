import React from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Smartphone,
  Square,
  Tv,
  ShieldAlert,
  ZoomIn,
  SlidersHorizontal,
  Sparkles,
  Download,
  LoaderCircle,
  Image as ImageIcon,
} from 'lucide-react';
import type { VideoAspectRatio, ZoomLevel } from './VideoStage';
import { LiveStatus } from '../../../components/backoffice-shell/primitives';
import type { CreativeStudioEditorState } from '../../../components/backoffice-shell/contracts/creativeStudioShell';

export interface CreativeEditorToolbarProps {
  projectTitle?: string;
  aspectRatio: VideoAspectRatio;
  onAspectRatioChange: (ratio: VideoAspectRatio) => void;
  showSafeZones: boolean;
  onToggleSafeZones: () => void;
  zoomLevel: ZoomLevel;
  onZoomLevelChange: (zoom: ZoomLevel) => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  onLoadPreset?: () => void;
  onExportMp4?: () => void;
  isExporting?: boolean;
  renderStatus?: CreativeStudioEditorState;
  renderStatusMessage?: string;
  onRetryRender?: () => void;
}

const segmentedButtonClass = (active: boolean) =>
  `flex min-h-11 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
    active
      ? 'border-brand-cyan/30 bg-primary/30 text-brand-cyan shadow-xs'
      : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
  }`;

const toolbarButtonClass =
  'flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300 transition-all hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80';

export const CreativeEditorToolbar: React.FC<CreativeEditorToolbarProps> = ({
  projectTitle = 'Reel Visa Rejection',
  aspectRatio,
  onAspectRatioChange,
  showSafeZones,
  onToggleSafeZones,
  zoomLevel,
  onZoomLevelChange,
  isInspectorOpen,
  onToggleInspector,
  onLoadPreset,
  onExportMp4,
  isExporting = false,
  renderStatus = 'saved',
  renderStatusMessage,
  onRetryRender,
}) => (
  <div
    role="toolbar"
    aria-label="Controles de Video Studio"
    data-visual-contract="image-studio-toolbar"
    className="flex min-h-11 w-full max-w-full flex-wrap items-center justify-between gap-2.5 overflow-x-auto py-0.5 text-white select-none"
  >
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <div className="flex min-w-0 max-w-[280px] items-center gap-2 sm:max-w-xs md:max-w-sm">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-brand-cyan">
          <Film className="size-3.5" aria-hidden="true" />
        </div>
        <span className="truncate text-xs font-bold text-slate-100" title={projectTitle}>
          {projectTitle}
        </span>
      </div>

      <div className="flex shrink-0 items-center rounded-xl border border-slate-800 bg-slate-950 p-0.5">
        <button
          type="button"
          onClick={() => onAspectRatioChange('vertical')}
          aria-label="Formato vertical 9:16"
          aria-pressed={aspectRatio === 'vertical'}
          className={segmentedButtonClass(aspectRatio === 'vertical')}
          title="9:16 Vertical (Stories, Reels, TikTok)"
        >
          <Smartphone className="size-3.5" aria-hidden="true" />
          <span>9:16</span>
        </button>
        <button
          type="button"
          onClick={() => onAspectRatioChange('square')}
          aria-label="Formato cuadrado 1:1"
          aria-pressed={aspectRatio === 'square'}
          className={segmentedButtonClass(aspectRatio === 'square')}
          title="1:1 Cuadrado (Instagram Feed, LinkedIn)"
        >
          <Square className="size-3.5" aria-hidden="true" />
          <span>1:1</span>
        </button>
        <button
          type="button"
          onClick={() => onAspectRatioChange('landscape')}
          aria-label="Formato panorámico 16:9"
          aria-pressed={aspectRatio === 'landscape'}
          className={segmentedButtonClass(aspectRatio === 'landscape')}
          title="16:9 Panorámico (YouTube, Web Player)"
        >
          <Tv className="size-3.5" aria-hidden="true" />
          <span>16:9</span>
        </button>
      </div>
    </div>

    <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
      {aspectRatio === 'vertical' && (
        <button
          type="button"
          onClick={onToggleSafeZones}
          aria-label={showSafeZones ? 'Ocultar zonas seguras' : 'Mostrar zonas seguras'}
          aria-pressed={showSafeZones}
          className={`flex min-h-11 items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
            showSafeZones
              ? 'border-accent bg-accent/20 text-accent shadow-xs'
              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
          title="Guías de márgenes seguros para Instagram Reels y TikTok"
        >
          <ShieldAlert className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Safe Zones</span>
        </button>
      )}

      <div className="flex min-h-11 items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 px-1.5">
        <ZoomIn className="size-3.5 text-slate-500" aria-hidden="true" />
        <select
          aria-label="Nivel de zoom del visor"
          value={zoomLevel.toString()}
          onChange={(e) => {
            const value = e.target.value;
            onZoomLevelChange(value === 'fit' ? 'fit' : Number(value));
          }}
          className="min-h-9 rounded-lg border border-transparent bg-transparent px-1.5 py-1 text-[11px] font-bold text-slate-300 focus:border-brand-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
        >
          <option value="fit">Ajustar</option>
          {typeof zoomLevel === 'number' && ![50, 75, 100, 150].includes(zoomLevel) && (
            <option value={zoomLevel.toString()}>{zoomLevel}%</option>
          )}
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="100">100%</option>
          <option value="150">150%</option>
        </select>
      </div>

      <LiveStatus
        status={renderStatus}
        message={renderStatusMessage}
        onRetry={onRetryRender}
        className="hidden min-h-0 rounded-full border border-slate-800 px-2 py-0.5 text-[10px] font-mono sm:flex"
      />

      <button
        type="button"
        onClick={onToggleInspector}
        aria-label="Mostrar panel de propiedades"
        aria-pressed={isInspectorOpen}
        className={`${toolbarButtonClass} ${
          isInspectorOpen ? 'border-primary bg-primary text-white shadow-xs' : ''
        }`}
        title="Mostrar / Ocultar panel de propiedades"
      >
        <SlidersHorizontal className="size-3.5" aria-hidden="true" />
        <span className="hidden md:inline">Propiedades</span>
      </button>

      {onLoadPreset && (
        <button
          type="button"
          onClick={onLoadPreset}
          aria-label="Cargar preset"
          className={toolbarButtonClass}
          title="Cargar presets preconfigurados"
        >
          <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
          <span className="hidden sm:inline">Preset</span>
        </button>
      )}

      <Link
        to="/backoffice/marketing-studio/image-studio"
        aria-label="Abrir Image Studio"
        className={toolbarButtonClass}
        title="Abrir Image & Graphic Studio (Canva)"
      >
        <ImageIcon className="size-3.5 text-brand-cyan" aria-hidden="true" />
        <span className="hidden lg:inline">Image Studio</span>
      </Link>

      {onExportMp4 && (
        <button
          type="button"
          onClick={onExportMp4}
          disabled={isExporting}
          aria-label={isExporting ? 'Exportando vídeo MP4' : 'Exportar vídeo MP4'}
          className="flex min-h-11 items-center gap-1.5 rounded-xl bg-accent px-3 py-1 text-xs font-bold text-primary-dark shadow-sm transition-all hover:bg-amber-400 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
          title="Renderizar y exportar vídeo MP4"
        >
          {isExporting ? (
            <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Download className="size-3.5" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">Exportar MP4</span>
        </button>
      )}
    </div>
  </div>
);
