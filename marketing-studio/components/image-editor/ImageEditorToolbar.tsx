import React from 'react';
import { CheckCircle2, Image as ImageIcon, Layers, Video } from 'lucide-react';
import type { ImageFormatPreset, ImagePreviewMode, ImageProject } from '../../types/imageStudio';
import { useActiveInlineEditor } from './InlineEditorContext';
import {
  StudioToolbar,
  type StudioToolbarExportOption,
} from '../../../components/backoffice-shell/primitives';
import type { CreativeStudioEditorState } from '../../../components/backoffice-shell/contracts/creativeStudioShell';

export interface ImageEditorToolbarProps {
  project: ImageProject;
  canUndo: boolean;
  canRedo: boolean;
  isExporting: boolean;
  showSafeZones: boolean;
  previewMode: ImagePreviewMode;
  isInspectorOpen: boolean;
  lastSavedAt?: string;
  saveState?: CreativeStudioEditorState;
  onRetrySave?: () => void;
  onBackToHub?: () => void;
  onToggleInspector: () => void;
  onToggleSafeZones: () => void;
  onSetPreviewMode: (mode: ImagePreviewMode) => void;
  onOpenCarouselSimulator?: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onUpdateTitle: (title: string) => void;
  onSetPreset?: (preset: ImageFormatPreset) => void;
  onCopyToClipboard?: () => void | Promise<void>;
  onExport: (format: 'png' | 'jpeg' | 'svg') => void;
  onExportCarousel?: (format: 'zip' | 'pdf' | 'full') => void;
  onSaveToDam: () => void;
  onSendToVideoStudio?: () => void;
}

export const ImageEditorToolbar: React.FC<ImageEditorToolbarProps> = ({
  project,
  canUndo,
  canRedo,
  isExporting,
  showSafeZones,
  previewMode,
  isInspectorOpen,
  lastSavedAt,
  saveState,
  onRetrySave,
  onBackToHub,
  onToggleInspector,
  onToggleSafeZones,
  onSetPreviewMode,
  onOpenCarouselSimulator,
  onUndo,
  onRedo,
  onUpdateTitle,
  onCopyToClipboard,
  onExport,
  onExportCarousel,
  onSaveToDam,
  onSendToVideoStudio,
}) => {
  const activeInlineEditor = useActiveInlineEditor();
  const exportOptions: StudioToolbarExportOption[] = project.preset.isCarousel
    ? [
        {
          label: 'Pack de Diapositivas (ZIP)',
          badge: '1-Click',
          badgeClassName: 'bg-brand-cyan/20 text-brand-cyan',
          onSelect: () => onExportCarousel?.('zip') ?? onExport('png'),
        },
        {
          label: 'Documento LinkedIn (PDF)',
          badge: 'Doc',
          badgeClassName: 'bg-blue-500/20 text-blue-300',
          onSelect: () => onExportCarousel?.('pdf') ?? onExport('png'),
        },
        {
          label: 'Tira Panorámica Completa',
          badge: 'PNG',
          badgeClassName: 'bg-slate-800 text-slate-400',
          onSelect: () => onExportCarousel?.('full') ?? onExport('png'),
        },
      ]
    : [
        {
          label: 'Descargar PNG',
          badge: '1080p',
          badgeClassName: 'bg-slate-800 text-brand-cyan',
          onSelect: () => onExport('png'),
        },
        {
          label: 'Descargar JPEG',
          badge: 'Web',
          badgeClassName: 'bg-slate-800 text-slate-400',
          onSelect: () => onExport('jpeg'),
        },
        {
          label: 'Descargar SVG',
          badge: 'Vector',
          badgeClassName: 'bg-slate-800 text-slate-400',
          onSelect: () => onExport('svg'),
        },
      ];

  return (
    <StudioToolbar
      ariaLabel="Controles de Image Studio"
      title={project.title}
      titleIcon={<ImageIcon className="size-3.5" aria-hidden="true" />}
      onUpdateTitle={onUpdateTitle}
      onBackToHub={onBackToHub}
      canUndo={activeInlineEditor ? activeInlineEditor.editor.can().undo() : canUndo}
      canRedo={activeInlineEditor ? activeInlineEditor.editor.can().redo() : canRedo}
      onUndo={() => {
        if (activeInlineEditor) {
          activeInlineEditor.editor.commands.undo();
          activeInlineEditor.save();
        } else {
          onUndo();
        }
      }}
      onRedo={() => {
        if (activeInlineEditor) {
          activeInlineEditor.editor.commands.redo();
          activeInlineEditor.save();
        } else {
          onRedo();
        }
      }}
      showSafeZones={showSafeZones}
      onToggleSafeZones={onToggleSafeZones}
      previewMode={previewMode}
      onSetPreviewMode={onSetPreviewMode}
      mobilePreview={
        project.preset.isCarousel && onOpenCarouselSimulator
          ? { onOpen: onOpenCarouselSimulator, label: 'Vista Previa Móvil' }
          : undefined
      }
      isInspectorOpen={isInspectorOpen}
      onToggleInspector={onToggleInspector}
      onCopyToClipboard={onCopyToClipboard}
      moreActions={[
        {
          label: 'Guardar en DAM',
          activeLabel: 'Guardado en DAM',
          icon: <Layers className="size-4 text-slate-400" aria-hidden="true" />,
          activeIcon: <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />,
          onSelect: onSaveToDam,
        },
        ...(onSendToVideoStudio
          ? [
              {
                label: 'Preparar para Video Studio',
                icon: <Video className="size-4 text-brand-cyan" aria-hidden="true" />,
                to: '/backoffice/marketing-studio/generador-contenido?from=image-studio',
                onSelect: onSendToVideoStudio,
              },
            ]
          : []),
      ]}
      exportOptions={exportOptions}
      exportHeading={project.preset.isCarousel ? 'Exportación de Carrusel' : undefined}
      isExporting={isExporting}
      status={saveState ?? 'saved'}
      lastSavedAt={lastSavedAt}
      onRetryStatus={onRetrySave}
    />
  );
};
