import React from 'react';
import {
  CanvasGuideSettings,
  ImageBlockType,
  ImageProject,
  ImageStyleVariantId,
} from '../../types/imageStudio';
import { ImageStudioLayersPanel } from './ImageStudioLayersPanel';
import { ImageStudioTextDrawer } from './drawers/ImageStudioTextDrawer';
import { ImageStudioMyDesignsDrawer } from './drawers/ImageStudioMyDesignsDrawer';
import { ImageStudioElementsDrawer } from './drawers/ImageStudioElementsDrawer';
import { ImageStudioMediaDrawer } from './drawers/ImageStudioMediaDrawer';
import { ImageStudioBrandKitDrawer } from './drawers/ImageStudioBrandKitDrawer';
import { ImageStudioLayoutDrawer } from './drawers/ImageStudioLayoutDrawer';
import { ImageStudioTemplatesDrawer } from './drawers/ImageStudioTemplatesDrawer';
import { ImageStudioBlocksDrawer } from './drawers/ImageStudioBlocksDrawer';
import { TextPresetItem } from '../../data/textPresets';
import { ImageLayer } from '../../types/imageStudio';
import { ImageStudioAiCopyDrawer } from './drawers/ImageStudioAiCopyDrawer';
import { ImageStudioVideoBridgeDrawer, VideoPreparationSettings } from './drawers/ImageStudioVideoBridgeDrawer';
import { ImageStudioBackgroundDrawer } from './drawers/ImageStudioBackgroundDrawer';
import type { CarouselBackgroundCompositionInput } from '../../types/carouselBackgroundComposition';

export interface ImageStudioAssetDrawerContentProps {
  activeTab: string | null;
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
}

export const ImageStudioAssetDrawerContent: React.FC<ImageStudioAssetDrawerContentProps> = ({
  activeTab,
  project,
  selectedLayerId,
  selectedLayer,
  selectedLayerIds = [],
  onSelectLayer,
  onLoadTemplate,
  onAddBlock,
  onAddTextLayer,
  onAddImageLayer,
  onInsertSavedLayer,
  onUpdateBackground,
  onToggleLock,
  onToggleVisibility,
  onToggleAllLock,
  onToggleAllVisibility,
  onMoveZIndex,
  onReorderLayers,
  onRenameLayer,
  onDuplicateLayer,
  onRemoveLayer,
  onDeleteSelectedLayers,
  onUpdateGuideSettings,
  onAutoLayout,
  onFitText,
  onApplyVariant,
  onAlignSelectedLayers,
  onDistributeSelectedLayers,
  onGroupSelectedLayers,
  onUngroupLayer,
  onUpdateLayerProps,
  onReplaceLayerContent,
  onUpdateLayerPosition,
  onUpdateLayerOpacity,
  onUpdateLayerShadowPreset,
  onUpdateLayerBorder,
  onPrepareVideo,
  onRegenerateBackground,
}) => {
  return (
    <div className="space-y-4 select-none">
      {/* 0. MIS DISEÑOS & BIBLIOTECA PERSONAL (POSICIÓN 1) */}
      {activeTab === 'my-designs' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioMyDesignsDrawer
            onLoadProject={onLoadTemplate}
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

      {/* 1. TEXTO & TIPOGRAFÍAS */}
      {activeTab === 'text' && onAddTextLayer && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioTextDrawer onAddTextLayer={onAddTextLayer} />
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

      {/* 3. ÁRBOL DE CAPAS (LAYERS TREE) */}
      {activeTab === 'layers' && (
        <ImageStudioLayersPanel
          project={project}
          selectedLayerId={selectedLayerId}
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onToggleLock={onToggleLock}
          onToggleVisibility={onToggleVisibility}
          onToggleAllLock={onToggleAllLock}
          onToggleAllVisibility={onToggleAllVisibility}
          onMoveZIndex={onMoveZIndex}
          onReorderLayers={onReorderLayers}
          onRenameLayer={onRenameLayer}
          onDuplicateLayer={onDuplicateLayer}
          onRemoveLayer={onRemoveLayer}
          onDeleteSelectedLayers={onDeleteSelectedLayers}
        />
      )}
      {activeTab === 'backgrounds' && onRegenerateBackground && (
        <div className="-m-4 h-[calc(100vh-140px)] overflow-y-auto p-4">
          <ImageStudioBackgroundDrawer
            project={project}
            onRegenerateBackground={onRegenerateBackground}
          />
        </div>
      )}
      {activeTab === 'layout' && onUpdateGuideSettings && onAutoLayout && onFitText && onApplyVariant && (
        <ImageStudioLayoutDrawer
          project={project}
          selectedLayers={project.layers.filter((layer) => selectedLayerIds.includes(layer.id))}
          onUpdateGuideSettings={onUpdateGuideSettings}
          onAutoLayout={onAutoLayout}
          onFitText={onFitText}
          onApplyVariant={onApplyVariant}
          onToggleLock={onToggleLock}
          onAlignSelectedLayers={onAlignSelectedLayers}
          onDistributeSelectedLayers={onDistributeSelectedLayers}
          onMoveZIndex={onMoveZIndex}
          onGroupSelectedLayers={onGroupSelectedLayers}
          onUngroupLayer={onUngroupLayer}
          onUpdateLayerProps={onUpdateLayerProps}
          onReplaceLayerContent={onReplaceLayerContent}
          onUpdateLayerPosition={onUpdateLayerPosition}
          onUpdateLayerOpacity={onUpdateLayerOpacity}
          onUpdateLayerShadowPreset={onUpdateLayerShadowPreset}
          onUpdateLayerBorder={onUpdateLayerBorder}
        />
      )}

      {/* 4. BRAND KIT OFICIAL (LOGOS, ISOTIPOS, DESTACADOS IG, COLORES Y GRADIENTES) */}
      {activeTab === 'brand' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioBrandKitDrawer
            onAddBlock={onAddBlock}
            onUpdateBackground={onUpdateBackground}
          />
        </div>
      )}

      {/* 5. MEDIOS, FOTOS DE STOCK & ASESORAS */}
      {activeTab === 'media' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioMediaDrawer
            onInsertImageLayer={(url, options) => {
              if (onAddImageLayer) {
                onAddImageLayer(url, options);
              } else {
                onAddBlock('ImageMedia' as ImageBlockType, { imageUrl: url, ...options });
              }
            }}
            onSetBackgroundImage={(url) => {
              onUpdateBackground(
                `linear-gradient(rgba(0, 18, 25, 0.75), rgba(0, 18, 25, 0.85)), url('${url}') center/cover no-repeat`,
                '#001219'
              );
            }}
          />
        </div>
      )}

      {/* 6. ELEMENTOS Y FORMAS (DRAWER MODULAR PROFESIONAL) */}
      {activeTab === 'elements' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioElementsDrawer
            onAddBlock={onAddBlock}
            onAddImageLayer={onAddImageLayer}
            onInsertSavedLayer={onInsertSavedLayer}
          />
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

// Backwards-compatible wrapper
export const ImageStudioAssetSidebar = ImageStudioAssetDrawerContent;
