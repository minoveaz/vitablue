import React from 'react';
import {
  Film,
  Image as ImageIcon,
  Smartphone,
  Sparkles,
  Square,
  Tv,
  ZoomIn,
} from 'lucide-react';
import type { VideoAspectRatio, ZoomLevel } from './VideoStage';
import {
  StudioToolbar,
  studioToolbarButtonClass,
  studioToolbarChoiceButtonClass,
} from '../../../components/backoffice-shell/primitives';
import type { CreativeStudioEditorState } from '../../../components/backoffice-shell/contracts/creativeStudioShell';

export interface CreativeEditorToolbarProps {
  projectTitle?: string;
  onUpdateTitle?: (title: string) => void;
  onBackToHub?: () => void;
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
  onCopyProject?: () => void | Promise<void>;
  isExporting?: boolean;
  renderStatus?: CreativeStudioEditorState;
  renderStatusMessage?: string;
  lastSavedAt?: string;
  onRetryRender?: () => void;
}

const VideoToolbarExtensions: React.FC<
  Pick<
    CreativeEditorToolbarProps,
    'aspectRatio' | 'onAspectRatioChange' | 'zoomLevel' | 'onZoomLevelChange' | 'onLoadPreset'
  >
> = ({ aspectRatio, onAspectRatioChange, zoomLevel, onZoomLevelChange, onLoadPreset }) => (
  <>
    <div className="flex shrink-0 items-center rounded-xl border border-slate-800 bg-slate-950 p-0.5">
      {([
        ['vertical', Smartphone, '9:16', 'Formato vertical 9:16', '9:16 Vertical (Stories, Reels, TikTok)'],
        ['square', Square, '1:1', 'Formato cuadrado 1:1', '1:1 Cuadrado (Instagram Feed, LinkedIn)'],
        ['landscape', Tv, '16:9', 'Formato panorámico 16:9', '16:9 Panorámico (YouTube, Web Player)'],
      ] as const).map(([ratio, Icon, label, ariaLabel, title]) => (
        <button
          key={ratio}
          type="button"
          onClick={() => onAspectRatioChange(ratio)}
          aria-label={ariaLabel}
          aria-pressed={aspectRatio === ratio}
          className={studioToolbarChoiceButtonClass(aspectRatio === ratio)}
          title={title}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>

    <div className="flex min-h-11 items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 px-1.5">
      <ZoomIn className="size-3.5 text-slate-500" aria-hidden="true" />
      <label className="sr-only" htmlFor="video-toolbar-zoom">
        Nivel de zoom del visor
      </label>
      <select
        id="video-toolbar-zoom"
        aria-label="Nivel de zoom del visor"
        value={zoomLevel.toString()}
        onChange={(event) => {
          const value = event.target.value;
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

    {onLoadPreset && (
      <button
        type="button"
        onClick={onLoadPreset}
        aria-label="Cargar preset"
        className={studioToolbarButtonClass}
        title="Cargar presets preconfigurados"
      >
        <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
        <span className="hidden sm:inline">Preset</span>
      </button>
    )}
  </>
);

export const CreativeEditorToolbar: React.FC<CreativeEditorToolbarProps> = ({
  projectTitle = 'Reel Visa Rejection',
  onUpdateTitle,
  onBackToHub,
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
  onCopyProject,
  isExporting = false,
  renderStatus = 'saved',
  renderStatusMessage,
  lastSavedAt,
  onRetryRender,
}) => (
  <StudioToolbar
    ariaLabel="Controles de Video Studio"
    title={projectTitle}
    titleIcon={<Film className="size-3.5" aria-hidden="true" />}
    titlePlaceholder="Nombre del vídeo..."
    titleLabel="Nombre del vídeo"
    onUpdateTitle={onUpdateTitle}
    onBackToHub={onBackToHub}
    showSafeZones={showSafeZones}
    safeZonesVisible={aspectRatio === 'vertical'}
    onToggleSafeZones={onToggleSafeZones}
    extensions={
      <VideoToolbarExtensions
        aspectRatio={aspectRatio}
        onAspectRatioChange={onAspectRatioChange}
        zoomLevel={zoomLevel}
        onZoomLevelChange={onZoomLevelChange}
        onLoadPreset={onLoadPreset}
      />
    }
    isInspectorOpen={isInspectorOpen}
    onToggleInspector={onToggleInspector}
    onCopyToClipboard={onCopyProject}
    copyLabel="Copiar proyecto"
    copySuccessLabel="¡Copiado!"
    copyAriaLabel="Copiar proyecto de vídeo"
    moreActions={[
      {
        label: 'Abrir Image Studio',
        icon: <ImageIcon className="size-4 text-brand-cyan" aria-hidden="true" />,
        to: '/backoffice/marketing-studio/image-studio',
      },
    ]}
    exportOptions={
      onExportMp4
        ? [
            {
              label: 'Exportar vídeo MP4',
              badge: 'MP4',
              onSelect: onExportMp4,
            },
          ]
        : []
    }
    exportLabel="Exportar MP4"
    isExporting={isExporting}
    status={renderStatus}
    statusMessage={renderStatusMessage}
    lastSavedAt={lastSavedAt}
    onRetryStatus={onRetryRender}
  />
);
