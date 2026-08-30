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
}) => {
  return (
    <div role="toolbar" aria-label="Controles de Video Studio" className="flex min-h-11 w-full max-w-full flex-wrap items-center justify-between gap-3 overflow-x-auto py-0.5 text-white select-none">
      {/* SECCIÓN IZQUIERDA: TÍTULO DE PROYECTO + SELECTOR DE FORMATO */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-800 shrink-0">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-brand-cyan">
            <Film className="size-3.5" aria-hidden="true" />
          </div>
          <span className="truncate text-xs font-bold text-slate-100 max-w-[180px] sm:max-w-[240px]">
            {projectTitle}
          </span>
        </div>

        {/* SELECTOR DE RESOLUCIÓN Y FORMATO */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onAspectRatioChange('vertical')}
            aria-label="Formato vertical 9:16"
            aria-pressed={aspectRatio === 'vertical'}
            className={`flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
              aspectRatio === 'vertical'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
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
            className={`flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
              aspectRatio === 'square'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
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
            className={`flex min-h-11 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
              aspectRatio === 'landscape'
                ? 'bg-primary text-white shadow-xs'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            title="16:9 Panorámico (YouTube, Web Player)"
          >
            <Tv className="size-3.5" aria-hidden="true" />
            <span>16:9</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN CENTRO / DERECHA: SAFE ZONES, ZOOM, ESTADO, INSPECTOR Y EXPORTAR */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* SAFE ZONES TOGGLE */}
        {aspectRatio === 'vertical' && (
          <button
            type="button"
            onClick={onToggleSafeZones}
            aria-label="Mostrar zonas seguras"
            aria-pressed={showSafeZones}
            className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
              showSafeZones
                ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
            }`}
            title="Guías de márgenes seguros para Instagram Reels y TikTok"
          >
            <ShieldAlert className="size-3.5" aria-hidden="true" />
            <span>Safe Zones</span>
          </button>
        )}

        {/* SELECTOR DE ZOOM */}
        <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
          <ZoomIn className="size-3.5 text-slate-500" aria-hidden="true" />
          <select
            aria-label="Nivel de zoom del visor"
            value={zoomLevel.toString()}
            onChange={(e) => {
              const val = e.target.value;
              onZoomLevelChange(val === 'fit' ? 'fit' : Number(val));
            }}
            className="min-h-11 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] font-bold text-slate-300 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
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

        {/* BADGE DE ESTADO */}
        <LiveStatus
          status={renderStatus}
          message={renderStatusMessage}
          onRetry={onRetryRender}
          className="hidden min-h-0 border-l border-slate-800 pl-2.5 text-[11px] sm:flex"
        />

        {/* TOGGLE PANEL PROPIEDADES */}
        <button
          type="button"
          onClick={onToggleInspector}
          aria-label="Mostrar panel de propiedades"
          aria-pressed={isInspectorOpen}
          className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
            isInspectorOpen
              ? 'border-primary bg-primary text-white shadow-xs'
              : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Mostrar / Ocultar panel de propiedades"
        >
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          <span>Propiedades</span>
        </button>

        {/* BOTÓN PRESET */}
        {onLoadPreset && (
          <button
            type="button"
            onClick={onLoadPreset}
            className="flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
            title="Cargar presets preconfigurados"
          >
            <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
            <span>Preset</span>
          </button>
        )}

        {/* LINK TO IMAGE STUDIO */}
        <Link
          to="/backoffice/marketing-studio/image-studio"
          className="flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
          title="Abrir Image & Graphic Studio (Canva)"
        >
          <ImageIcon className="size-3.5 text-primary" aria-hidden="true" />
          <span className="hidden md:inline">Image Studio</span>
        </Link>

        {/* BOTÓN PRINCIPAL EXPORTAR MP4 */}
        {onExportMp4 && (
          <button
            type="button"
            onClick={onExportMp4}
            disabled={isExporting}
            className="flex min-h-11 items-center gap-1.5 rounded-lg bg-accent px-3 py-1 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-sm transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
          >
            {isExporting ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Download className="size-3.5" aria-hidden="true" />}
            <span>Exportar MP4</span>
          </button>
        )}
      </div>
    </div>
  );
};
