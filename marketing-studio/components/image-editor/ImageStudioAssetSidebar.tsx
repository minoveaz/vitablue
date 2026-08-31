import React from 'react';
import {
  CanvasGuideSettings,
  ImageBlockType,
  ImageProject,
  ImageStyleVariantId,
} from '../../types/imageStudio';
import { ImageStudioMyDesignsDrawer } from './drawers/ImageStudioMyDesignsDrawer';
import { ImageStudioTemplatesDrawer } from './drawers/ImageStudioTemplatesDrawer';
import { ImageStudioBlocksDrawer } from './drawers/ImageStudioBlocksDrawer';
import { TextPresetItem } from '../../data/textPresets';
import { ImageLayer } from '../../types/imageStudio';
import { ImageStudioAiCopyDrawer } from './drawers/ImageStudioAiCopyDrawer';
import { ImageStudioVideoBridgeDrawer, VideoPreparationSettings } from './drawers/ImageStudioVideoBridgeDrawer';
import type { CarouselBackgroundCompositionInput } from '../../types/carouselBackgroundComposition';
import type { BrandVisualCompositionConfigInput } from '../../types/carouselCompositionIdentity';
import type { RuntimeCreativeAsset } from '../../utils/creativeStudioRemote';
import {
  CreativeResourceRegistry,
  createImageCreativeResourceContext,
  CreativeResourceSlot,
  type CreativeResourceBlockId,
} from '../../../components/creative-resources';

type RemoteImageMedia = RuntimeCreativeAsset;

export interface ImageStudioAssetDrawerContentProps {
  activeTab: string | null;
  onActiveTabChange?: (tab: CreativeResourceBlockId) => void;
  project: ImageProject;
  selectedLayerId: string | null;
  selectedLayer?: ImageLayer | null;
  selectedLayerIds?: string[];
  onSelectLayer: (id: string, isShift?: boolean) => void;
  onLoadTemplate: (template: ImageProject) => void;
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
  onAddTextLayer?: (preset: TextPresetItem) => void;
  onAddImageLayer?: (
    imageUrl: string,
    options?: {
      title?: string;
      assetId?: string;
      width?: number;
      height?: number;
      clipShape?: 'none' | 'circle' | 'squircle' | 'rounded-2xl' | 'hexagon';
    }
  ) => void;
  onInsertSavedLayer?: (layer: ImageLayer) => void;
  onUpdateBackground: (gradient: string, color: string) => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleAllLock?: (locked: boolean) => void;
  onToggleAllVisibility?: (visible: boolean) => void;
  onMoveZIndex: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  onReorderLayers?: (layerIds: string[]) => void;
  onRenameLayer: (id: string, title: string) => void;
  onDuplicateLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onDeleteSelectedLayers?: () => void;
  onUpdateGuideSettings?: (patch: Partial<CanvasGuideSettings>) => void;
  onAutoLayout?: (direction: 'vertical' | 'horizontal' | 'grid') => void;
  onFitText?: () => void;
  onApplyVariant?: (variant: ImageStyleVariantId) => void;
  onAlignSelectedLayers?: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistributeSelectedLayers?: (direction: 'horizontal' | 'vertical') => void;
  onGroupSelectedLayers?: () => void;
  onUngroupLayer?: (id: string) => void;
  onUpdateLayerProps?: (id: string, patch: Record<string, unknown>) => void;
  onReplaceLayerContent?: (id: string, replacement: { text?: string; imageUrl?: string }) => void;
  onUpdateLayerPosition?: (id: string, position: { x: number; y: number }) => void;
  onUpdateLayerOpacity?: (id: string, opacity: number) => void;
  onUpdateLayerShadowPreset?: (id: string, preset: ImageLayer['shadowPreset']) => void;
  onUpdateLayerBorder?: (
    id: string,
    border: { borderWidth?: number; borderColor?: string; borderRadius?: number }
  ) => void;
  onPrepareVideo?: (settings: VideoPreparationSettings) => void;
  onRegenerateBackground?: (composition: CarouselBackgroundCompositionInput) => void;
  onUpdateBrandCompositionConfig?: (patch: BrandVisualCompositionConfigInput) => void;
  onUploadImage?: (file: File) => Promise<RemoteImageMedia>;
  onListImages?: () => Promise<RemoteImageMedia[]>;
  onDeleteImage?: (asset: RemoteImageMedia) => Promise<void>;
  onListProjects?: () => Promise<ImageProject[]>;
  onDuplicateProject?: (project: ImageProject) => Promise<void>;
  onArchiveProject?: (project: ImageProject) => Promise<void>;
}

const LegacyImageStudioAssetDrawerContent: React.FC<ImageStudioAssetDrawerContentProps> = ({
  activeTab,
  onLoadTemplate,
  onAddBlock,
  onAddTextLayer,
  onInsertSavedLayer,
  selectedLayer,
  onReplaceLayerContent,
  onPrepareVideo,
  onListProjects,
  onDuplicateProject,
  onArchiveProject,
}) => {
  return (
    <div className="space-y-4 select-none" data-visual-contract="shared-studio-resource-content">
      {/* 0. MIS DISEÑOS & BIBLIOTECA PERSONAL (POSICIÓN 1) */}
      {activeTab === 'my-designs' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioMyDesignsDrawer
            onLoadProject={onLoadTemplate}
            onListProjects={onListProjects}
            onDuplicateProject={onDuplicateProject}
            onArchiveProject={onArchiveProject}
            onInsertSavedLayer={(layer) => {
              if (onInsertSavedLayer) {
                onInsertSavedLayer(layer);
              } else {
                onAddBlock(layer.blockType as ImageBlockType, layer.props as Record<string, unknown>);
              }
            }}
          />
        </div>
      )}

      {/* 1. PLANTILLAS EN GRID DE 2 COLUMNAS (AMPLIO Y VISUAL) */}
      {activeTab === 'templates' && <ImageStudioTemplatesDrawer onLoadTemplate={onLoadTemplate} />}

      {/* 2. BLOQUES VISUALES DE MOTIONKIT */}
      {activeTab === 'blocks' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioBlocksDrawer onAddBlock={onAddBlock} />
        </div>
      )}


      {/* 8. COPYS CON IA & HOOKS DE CONVERSIÓN */}
      {activeTab === 'ai-copy' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioAiCopyDrawer
            selectedLayer={selectedLayer}
            onAddTextLayer={onAddTextLayer}
            onReplaceLayerContent={onReplaceLayerContent}
          />
        </div>
      )}

      {/* 9. PREPARACIÓN DE VÍDEO */}
      {activeTab === 'video-bridge' && (
        <div className="-m-4 h-[calc(100vh-140px)] overflow-y-auto p-4">
          <ImageStudioVideoBridgeDrawer onPrepare={onPrepareVideo ?? (() => undefined)} />
        </div>
        /*
        <div className="space-y-4">
          <div className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Film className="size-4 text-teal-400" />
              <strong className="text-xs font-bold text-teal-200">Puente Remotion Video Studio</strong>
            </div>
            <p className="text-[11px] text-teal-300/80 leading-relaxed mb-3">
              Convierte este arte gráfico estático en una escena de vídeo animada con voz en off y música para reels / stories.
            </p>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-primary-dark px-3 py-2.5 text-xs font-black transition-transform active:scale-95 shadow-md"
            >
              <Sparkles className="size-3.5" />
              <span>Convertir a Escena de Vídeo</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="size-4 text-brand-cyan" />
              <strong className="text-xs font-bold text-slate-200">Exportación de Imagen en Alta Definición</strong>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 px-3 py-2 text-xs font-bold text-brand-cyan transition-colors"
              >
                <span>Descargar PNG (Transparente / Alta Calidad)</span>
                <Download className="size-3.5" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 text-xs font-bold text-slate-200 transition-colors"
              >
                <span>Descargar JPG (Optimizado para Web)</span>
                <Download className="size-3.5" />
              </button>
            </div>
          </div>
        </div>*/
      )}
    </div>
  );
};

const isCreativeResourceBlockId = (value: string | null): value is CreativeResourceBlockId =>
  value !== null && Boolean(CreativeResourceRegistry.get(value as CreativeResourceBlockId));

/** Resolves shared core resources and keeps Image-only extensions on the legacy path. */
export const ImageStudioAssetDrawerContent: React.FC<ImageStudioAssetDrawerContentProps> = (props) => {
  const { activeTab, project, selectedLayerIds = [] } = props;
  const registryTab = activeTab === 'video-bridge' ? 'prepare-video' : activeTab;
  const resourceId = isCreativeResourceBlockId(registryTab) ? registryTab : null;
  const content = !resourceId || !CreativeResourceRegistry.resolve(resourceId, 'image')
    ? <LegacyImageStudioAssetDrawerContent {...props} />
    : (
      <CreativeResourceSlot
        id={resourceId}
        domain="image"
        context={createImageCreativeResourceContext({
          project,
          selectedLayerIds,
          capabilities: ['legacy-content-slot', 'layout-update', 'background-update', 'visibility', 'lock', 'reorder'],
          actions: {
          upload: async (file: File) => {
            if (!props.onUploadImage || !props.onAddImageLayer) throw new Error('Subida de medios no disponible.');
            const asset = await props.onUploadImage(file);
            props.onAddImageLayer(asset.signedUrl, { title: asset.name, assetId: asset.id });
          },
          insert: ({ kind, value }: { kind?: string; value?: unknown }) => {
              if (kind === 'text' && props.onAddTextLayer) {
                props.onAddTextLayer(value && typeof value === 'object' ? value as TextPresetItem : {
                  id: `shared-text-${Date.now()}`,
                  category: 'basics',
                  title: 'Texto',
                  previewText: String(value ?? 'Nuevo texto'),
                  defaultText: String(value ?? 'Nuevo texto'),
                  tag: 'h2',
                  fontSize: 42,
                  fontWeight: '700',
                  fontFamily: 'Poppins, sans-serif',
                  fill: '#FFFFFF',
                  align: 'center',
                });
              } else if (kind === 'element') {
                const element = value && typeof value === 'object' ? value as { blockType?: ImageBlockType; defaultProps?: Record<string, unknown>; savedLayer?: ImageLayer } : undefined;
                if (element?.savedLayer && props.onInsertSavedLayer) props.onInsertSavedLayer(element.savedLayer);
                else props.onAddBlock(element?.blockType ?? 'GeometricShape', element?.defaultProps ?? { shapeType: value ?? 'circle' });
              } else if (kind === 'media') {
                const media = value && typeof value === 'object'
                  ? value as { imageUrl?: string; options?: { title?: string; assetId?: string } }
                  : undefined;
                props.onAddImageLayer?.(media?.imageUrl ?? (typeof value === 'string' && value.startsWith('http') ? value : ''), media?.options ?? { title: String(value ?? 'Medio') });
              } else if (kind === 'brand') {
                const brand = value && typeof value === 'object' ? value as { blockType?: ImageBlockType; defaultProps?: Record<string, unknown> } : undefined;
                props.onAddBlock(brand?.blockType ?? 'BrandLogo', brand?.defaultProps ?? { variant: value ?? 'default' });
              } else if (kind === 'background') {
                const background = value && typeof value === 'object' ? value as { gradient?: string; color?: string } : undefined;
                props.onUpdateBackground(background?.gradient ?? 'linear-gradient(135deg, rgba(0, 95, 115, 0.85), #001219)', background?.color ?? '#001219');
              }
            },
            update: ({ kind, value }: { kind?: string; value?: unknown }) => {
              if (kind === 'background' && props.onUpdateBackground) {
                if (value && typeof value === 'object' && ('shape' in value || 'trajectory' in value || 'colorVariant' in value)) {
                  props.onRegenerateBackground?.(value as CarouselBackgroundCompositionInput);
                } else {
                  const background = value && typeof value === 'object' ? value as { gradient?: string; color?: string } : undefined;
                  props.onUpdateBackground(background?.gradient ?? 'linear-gradient(135deg, rgba(0, 95, 115, 0.85), #001219)', background?.color ?? '#001219');
                }
              }
              if (kind === 'brand-config' && value && typeof value === 'object') {
                props.onUpdateBrandCompositionConfig?.(value as BrandVisualCompositionConfigInput);
              }
              if (kind === 'layout' && value && typeof value === 'object' && 'action' in value) {
                const action = value as { action?: string; value?: string };
                if (action.action === 'align' && props.onAlignSelectedLayers) props.onAlignSelectedLayers(action.value as 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom');
                if (action.action === 'auto-layout' && props.onAutoLayout) props.onAutoLayout(action.value as 'vertical' | 'horizontal' | 'grid');
                if (action.action === 'guide-settings') props.onUpdateGuideSettings?.((value as { patch?: Partial<CanvasGuideSettings> }).patch ?? {});
                if (action.action === 'fit-text') props.onFitText?.();
                if (action.action === 'variant') props.onApplyVariant?.(action.value as ImageStyleVariantId);
                if (action.action === 'distribute') props.onDistributeSelectedLayers?.(action.value as 'horizontal' | 'vertical');
                if (action.action === 'position') props.onUpdateLayerPosition?.((value as { layerId?: string }).layerId ?? '', (value as { value?: { x: number; y: number } }).value ?? { x: 50, y: 50 });
                if (action.action === 'opacity') props.onUpdateLayerOpacity?.((value as { layerId?: string }).layerId ?? '', Number((value as { value?: number }).value ?? 1));
                if (action.action === 'shadow') props.onUpdateLayerShadowPreset?.((value as { layerId?: string }).layerId ?? '', (value as { value?: ImageLayer['shadowPreset'] }).value);
                if (action.action === 'border') props.onUpdateLayerBorder?.((value as { layerId?: string }).layerId ?? '', (value as { value?: { borderWidth?: number; borderColor?: string; borderRadius?: number } }).value ?? {});
                if (action.action === 'layer-props') props.onUpdateLayerProps?.((value as { layerId?: string }).layerId ?? '', (value as { patch?: Record<string, unknown> }).patch ?? {});
                if (action.action === 'replace-content') props.onReplaceLayerContent?.((value as { layerId?: string }).layerId ?? '', (value as { value?: { text?: string; imageUrl?: string } }).value ?? {});
              }
            },
            select: (id, options) => props.onSelectLayer(id, options?.additive),
            remove: (id) => props.onRemoveLayer(id),
            toggleVisibility: props.onToggleVisibility,
            toggleLock: props.onToggleLock,
            move: props.onMoveZIndex,
            rename: props.onRenameLayer,
            reorder: (ids) => props.onReorderLayers?.([...ids]),
            duplicate: props.onDuplicateLayer,
          },
          media: resourceId === 'media' ? {
            insert: (source, options) => {
              if (props.onAddImageLayer) props.onAddImageLayer(source, options);
              else props.onAddBlock('ImageMedia' as ImageBlockType, { imageUrl: source, ...options });
            },
            setBackground: (source) => props.onUpdateBackground(
              `linear-gradient(rgba(0, 18, 25, 0.75), rgba(0, 18, 25, 0.85)), url('${source}') center/cover no-repeat`,
              '#001219',
            ),
            upload: props.onUploadImage,
            list: props.onListImages,
            delete: props.onDeleteImage
              ? async (asset) => { await props.onDeleteImage?.(asset as RemoteImageMedia); }
              : undefined,
          } : undefined,
        })}
      />
    );

  return <div className="min-w-0 space-y-3">{content}</div>;
};

// Backwards-compatible wrapper
export const ImageStudioAssetSidebar = ImageStudioAssetDrawerContent;
