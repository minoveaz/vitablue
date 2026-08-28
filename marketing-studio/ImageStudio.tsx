import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackofficeShell from '../components/layouts/BackofficeShell';
import { StudioWorkspaceShell, StudioToolItem } from '../components/backoffice-shell';
import { useImageProjectEditor } from './hooks/useImageProjectEditor';
import { ImageEditorToolbar } from './components/image-editor/ImageEditorToolbar';
import { ImageStudioAssetSidebar } from './components/image-editor/ImageStudioAssetSidebar';
import { ImageStudioInspector } from './components/image-editor/ImageStudioInspector';
import { ImageStage } from './components/image-editor/ImageStage';
import { CarouselSlideStrip } from './components/image-editor/CarouselSlideStrip';
import { ImageStudioHub } from './components/image-editor/ImageStudioHub';
import { CarouselMobileSimulator } from './components/image-editor/CarouselMobileSimulator';
import { InlineEditorProvider } from './components/image-editor/InlineEditorProvider';
import { InlineEditingProvider } from './components/image-editor/InlineEditingProvider';
import { InlineTextControls } from './components/image-editor/InlineEditableText';
import { ContextualToolbar } from './components/image-editor/ContextualToolbar';
import { MultiSelectionContextualToolbar } from './components/image-editor/MultiSelectionContextualToolbar';
import { ImageContextualToolbar } from './components/image-editor/ImageContextualToolbar';
import { exportCarouselSlices } from './utils/carouselExporter';
import {
  getCreativeProject,
  saveCreativeProject,
  listCreativeProjects,
  archiveCreativeProject,
  CreativeStudioScopeError,
  uploadCreativeImage,
  uploadCreativeExport,
  listCreativeAssets,
  removeCreativeAsset,
  createCreativeThumbnailBlob,
  uploadCreativeThumbnail,
  isCreativeProjectId,
} from './utils/creativeStudioRemote';
import { saveImageVideoHandoff } from './utils/imageVideoBridge';
import { getCarouselGeometry, isCarouselProject } from './utils/imageDesignSystem';
import type { CarouselAspectRatio, CarouselCreativeVariant, ImageCrop, ImageProject } from './types/imageStudio';
import { DEFAULT_IMAGE_CROP, normalizeImageCrop } from './utils/imageCrop';
import {
  LayoutTemplate,
  Type,
  Shapes,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Layers,
  Wand2,
  FolderHeart,
  Grid3X3,
  Video,
  Waves,
} from 'lucide-react';

export const ImageStudio: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const assetId = searchParams.get('assetId');

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [activeToolId, setActiveToolId] = useState<string | null>('text');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isCarouselSimulatorOpen, setIsCarouselSimulatorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [persistenceReady, setPersistenceReady] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const [carouselComparisonBefore, setCarouselComparisonBefore] = useState<ImageProject | null>(null);
  const [remoteProject, setRemoteProject] = useState<ImageProject | undefined>(undefined);

  useEffect(() => {
    if (!assetId || !isCreativeProjectId(assetId)) {
      setRemoteProject(undefined);
      setPersistenceReady(true);
      if (assetId) setSearchParams({}, { replace: true });
      return;
    }
    let active = true;
    setRemoteProject(undefined);
    setPersistenceReady(false);
    setPersistenceError(null);
    void getCreativeProject(assetId)
      .then((found) => {
        if (!active) return;
        if (found) {
          setRemoteProject(found);
          setPersistenceReady(true);
        } else {
          setPersistenceError('No se encontró esta creatividad en LoopDev.');
        }
      })
      .catch((error) => {
        if (!active) return;
        setPersistenceError(error instanceof CreativeStudioScopeError
          ? error.message
          : import.meta.env.DEV && error instanceof Error
            ? `No se pudo conectar con LoopDev (${error.name}).`
            : 'No se pudo conectar con LoopDev.');
      });
    return () => {
      active = false;
    };
  }, [assetId, setSearchParams]);

  const persistRemoteProject = React.useCallback(
    (project: ImageProject, expectedUpdatedAt?: string, clientMutationId?: string) =>
      saveCreativeProject(project, { expectedUpdatedAt, clientMutationId }),
    [],
  );
  const persistRemoteExport = React.useCallback(
    async (blob: Blob, format: string) => {
      if (!remoteProject) return;
      await uploadCreativeExport(remoteProject.id, blob, format);
      if (format !== 'svg') {
        const thumbnail = await createCreativeThumbnailBlob(blob);
        await uploadCreativeThumbnail(remoteProject.id, thumbnail);
      }
    },
    [remoteProject],
  );
  const editor = useImageProjectEditor(remoteProject, {
    persistenceReady,
    persistProject: persistRemoteProject,
    reloadProject: getCreativeProject,
    onExported: (blob, format) => persistRemoteExport(blob, format),
  });
  const uploadImage = React.useCallback(
    (file: File) => uploadCreativeImage(file, remoteProject?.id),
    [remoteProject?.id],
  );
  const listImages = React.useCallback(() => listCreativeAssets(), []);
  const listProjects = React.useCallback(() => listCreativeProjects(), []);
  const deleteImage = React.useCallback((asset: Parameters<typeof removeCreativeAsset>[0]) => removeCreativeAsset(asset), []);
  const duplicateProject = React.useCallback((project: ImageProject) => saveCreativeProject({
    ...project,
    id: crypto.randomUUID(),
    title: `${project.title} (Copia)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }, { createNew: true }).then(() => undefined), []);
  const archiveProject = React.useCallback(
    (project: ImageProject) => archiveCreativeProject(project.id, project.updatedAt),
    [],
  );
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [cropEditingLayerId, setCropEditingLayerId] = useState<string | null>(null);
  const [cropDraft, setCropDraft] = useState<ImageCrop>(DEFAULT_IMAGE_CROP);
  const selectedLayer = editor.project.layers.find((layer) => layer.id === editor.selectedLayerId);
  const selectedImageLayer =
    selectedLayer &&
    (selectedLayer.type === 'image' ||
      Boolean(selectedLayer.props.imageUrl) ||
      Boolean(selectedLayer.src))
      ? selectedLayer
      : null;
  const carouselGeometry = React.useMemo(
    () =>
      getCarouselGeometry(
        editor.project.preset,
        editor.project.carouselConfig?.slideCount ?? editor.project.preset.defaultSlideCount,
        editor.project.carouselConfig?.enabled,
      ),
    [
      editor.project.preset,
      editor.project.carouselConfig?.slideCount,
      editor.project.carouselConfig?.enabled,
    ],
  );
  const activeSlideIndex = Math.max(
    0,
    Math.min(
      carouselGeometry.slideCount - 1,
      editor.project.currentSlide ?? editor.project.carouselConfig?.currentSlideIndex ?? 0,
    ),
  );
  const activeInlineLayerId =
    editingLayerId &&
    selectedLayer?.id === editingLayerId &&
    (selectedLayer.type === 'text' || selectedLayer.blockType === 'CustomText')
      ? selectedLayer.id
      : null;

  const [isCanvasSelected, setIsCanvasSelected] = useState(false);
  const showToast = React.useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Abrir automáticamente el inspector al seleccionar una capa
  useEffect(() => {
    if (editor.selectedLayerId) {
      setIsInspectorOpen(true);
    } else {
      setIsInspectorOpen(false);
    }
  }, [editor.selectedLayerId]);

  useEffect(() => {
    if (editingLayerId && editor.selectedLayerId !== editingLayerId) {
      setEditingLayerId(null);
    }
  }, [editingLayerId, editor.selectedLayerId]);

  useEffect(() => {
    if (cropEditingLayerId && editor.selectedLayerId !== cropEditingLayerId) {
      setCropEditingLayerId(null);
    }
  }, [cropEditingLayerId, editor.selectedLayerId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          editor.redo();
        } else {
          editor.undo();
        }
        e.preventDefault();
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        editor.redo();
        e.preventDefault();
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          if (editor.selectedLayer) {
            editor.ungroupLayer(editor.selectedLayer.id);
          }
        } else {
          editor.groupSelectedLayers();
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
        if (e.altKey) {
          editor.copyLayerStyle();
          showToast('Estilo copiado al portapapeles');
        } else {
          editor.copySelectedLayers();
          showToast('Capa(s) copiada(s) al portapapeles');
        }
        e.preventDefault();
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'v') {
        if (e.altKey) {
          editor.pasteLayerStyle();
          showToast('Estilo pegado');
        } else {
          editor.pasteLayers();
          showToast('Capa(s) pegada(s)');
        }
        e.preventDefault();
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (editor.selectedLayerIds.length > 1) {
          editor.duplicateSelectedLayers();
        } else if (editor.selectedLayerId) {
          editor.duplicateLayer(editor.selectedLayerId);
        }
      }

      if (e.key === 'ArrowLeft') {
        editor.nudgeSelectedLayers(e.shiftKey ? -2.0 : -0.2, 0);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        editor.nudgeSelectedLayers(e.shiftKey ? 2.0 : 0.2, 0);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        editor.nudgeSelectedLayers(0, e.shiftKey ? -2.0 : -0.2);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        editor.nudgeSelectedLayers(0, e.shiftKey ? 2.0 : 0.2);
        e.preventDefault();
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (editor.selectedLayerIds.length > 0) {
          editor.deleteSelectedLayers();
          e.preventDefault();
        } else if (editor.selectedLayerId) {
          editor.removeLayer(editor.selectedLayerId);
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, showToast]);

  const handleSelectLayer = (id: string, isShift?: boolean) => {
    if (editingLayerId && editingLayerId !== id) {
      setEditingLayerId(null);
    }
    if (cropEditingLayerId && cropEditingLayerId !== id) {
      setCropEditingLayerId(null);
    }
    if (isShift) {
      editor.toggleLayerSelection(id);
    } else {
      editor.selectLayer(id);
    }
    setIsCanvasSelected(false);
  };

  const handleRequestEdit = React.useCallback(
    (layerId: string) => {
      if (editor.selectedLayerId !== layerId) {
        editor.selectLayer(layerId);
      }
      setEditingLayerId(layerId);
    },
    [editor]
  );

  const handleSelectCanvas = () => {
    setEditingLayerId(null);
    setCropEditingLayerId(null);
    editor.selectLayer('');
    setIsCanvasSelected(true);
    setIsInspectorOpen(false);
  };

  const handleDeselectAll = () => {
    setEditingLayerId(null);
    setCropEditingLayerId(null);
    editor.selectLayer('');
    setIsCanvasSelected(false);
  };

  const handleStartCrop = React.useCallback(
    (layerId: string) => {
      const layer = editor.project.layers.find((item) => item.id === layerId);
      if (!layer || layer.locked) return;
      setEditingLayerId(null);
      setCropEditingLayerId(layerId);
      setCropDraft(normalizeImageCrop(layer.crop));
    },
    [editor.project.layers],
  );

  const handleApplyCrop = React.useCallback(() => {
    if (!cropEditingLayerId) return;
    editor.updateLayerCrop(cropEditingLayerId, cropDraft);
    setCropEditingLayerId(null);
  }, [cropDraft, cropEditingLayerId, editor]);

  const handleCancelCrop = React.useCallback(() => {
    setCropEditingLayerId(null);
  }, []);

  const handleResetCrop = React.useCallback(() => {
    setCropDraft(DEFAULT_IMAGE_CROP);
  }, []);

  const handleLoadTemplate = (template: typeof editor.project) => {
    if (template.id !== editor.project.id) {
      editor.loadTemplate({
        ...template,
        id: editor.project.id,
        createdAt: editor.project.createdAt,
        updatedAt: new Date().toISOString(),
      });
      showToast('Plantilla cargada con éxito');
      return;
    }
    editor.loadTemplate(template);
    showToast('Plantilla cargada con éxito');
  };

  const handleAddBlock = (
    blockType: Parameters<typeof editor.addBlockLayer>[0],
    defaultProps?: Parameters<typeof editor.addBlockLayer>[1]
  ) => {
    editor.addBlockLayer(blockType, defaultProps);
    showToast('Elemento añadido al lienzo');
  };

  const handleExport = (format: 'png' | 'jpeg' | 'svg') => {
    editor.exportImage(canvasRef.current, format);
    showToast(`Exportando ${format.toUpperCase()}...`);
  };

  const handleExportCarousel = async (format: 'zip' | 'pdf' | 'full') => {
    if (!canvasRef.current) return;
    try {
      showToast(format === 'pdf' ? 'Compilando documento PDF...' : format === 'zip' ? 'Cortando diapositivas y generando ZIP...' : 'Descargando tira continua...');
      const result = await exportCarouselSlices(canvasRef.current, editor.project, format);
      const exportBlob = format === 'pdf'
        ? result.pdfBlob
        : format === 'zip'
          ? result.zipBlob
          : result.panoramaBlob;
      if (exportBlob) {
        await uploadCreativeExport(editor.project.id, exportBlob, format === 'full' ? 'panorama' : format);
      }
      showToast('¡Descarga completada!');
    } catch (err) {
      console.error('Error exporting carousel:', err);
      showToast('Error al exportar el carrusel');
    }
  };

  const handleCopyToClipboard = async () => {
    const success = await editor.copyToClipboard(canvasRef.current);
    if (success) {
      showToast('¡Copiado al portapapeles!');
    } else {
      showToast('Error al copiar imagen');
    }
  };

  const handleSaveToDam = () => {
    editor.exportImage(canvasRef.current, 'png');
    showToast('Guardando en DAM...');
  };

  const handleApplyCarouselVariant = React.useCallback((variant: CarouselCreativeVariant) => {
    setCarouselComparisonBefore(editor.project);
    editor.applyCarouselVariant(variant);
    showToast(`Variante aplicada: ${variant.label}`);
  }, [editor, showToast]);

  const handleAdaptCarouselAspectRatio = React.useCallback((aspectRatio: CarouselAspectRatio) => {
    setCarouselComparisonBefore(null);
    editor.adaptCarouselAspectRatio(aspectRatio);
    showToast(`Formato adaptado a ${aspectRatio}`);
  }, [editor, showToast]);

  // VISTA 1: HUB / DAM GALLERY DE ASSETS DE IMAGEN
  if (!assetId) {
    return (
      <BackofficeShell
        title="Hub de Creatividades Sociales"
        eyebrow="3. Creative Studio"
        breadcrumbs={['Marketing Studio', '3. Creative Studio', 'Image Studio (Canva)']}
        mode="overview"
      >
        <ImageStudioHub
          onOpenProject={(id) => {
            setSearchParams({ assetId: id });
          }}
        />
      </BackofficeShell>
    );
  }

  if (persistenceError) {
    return (
      <BackofficeShell
        title="Image Studio"
        eyebrow="3. Creative Studio"
        breadcrumbs={['Marketing Studio', '3. Creative Studio', 'Image Studio (Canva)']}
        mode="overview"
      >
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-sm font-semibold text-rose-700">
          <p>{persistenceError}</p>
          <button type="button" onClick={() => setSearchParams({})} className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-white">
            Volver a mis diseños
          </button>
        </div>
      </BackofficeShell>
    );
  }

  if (!persistenceReady || !remoteProject) {
    return (
      <BackofficeShell
        title="Image Studio"
        eyebrow="3. Creative Studio"
        breadcrumbs={['Marketing Studio', '3. Creative Studio', 'Image Studio (Canva)']}
        mode="overview"
      >
        <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-500">
          Cargando tu diseño…
        </div>
      </BackofficeShell>
    );
  }

  const studioTools: StudioToolItem[] = [
    // 🌟 Posición 1: Biblioteca Personal Unificada
    { id: 'my-designs', label: 'Mis Diseños', icon: <FolderHeart className="size-4" /> },

    // 🟢 Zona 1: Creación Atómica y Frecuente (2 - 5)
    { id: 'text', label: 'Texto', icon: <Type className="size-4" /> },
    { id: 'elements', label: 'Elementos', icon: <Shapes className="size-4" /> },
    { id: 'media', label: 'Medios', icon: <ImageIcon className="size-4" /> },
    { id: 'layers', label: 'Capas', icon: <Layers className="size-4" />, badge: editor.project.layers.length },
    { id: 'backgrounds', label: 'Fondos', icon: <Waves className="size-4" /> },
    { id: 'layout', label: 'Diseño', icon: <Grid3X3 className="size-4" /> },

    // 🔵 Zona 2: Identidad y Marca (6)
    { id: 'brand', label: 'Kit de Marca', icon: <Palette className="size-4" /> },

    // 🟣 Zona 3: Aceleración y Composición Rápida (7 - 8)
    { id: 'blocks', label: 'Bloques', icon: <Sparkles className="size-4" /> },
    { id: 'templates', label: 'Plantillas', icon: <LayoutTemplate className="size-4" /> },

    // 🟡 Zona 4: Inteligencia y Multimedia (9 - 10)
    { id: 'ai-copy', label: 'Copys con IA', icon: <Wand2 className="size-4" /> },
    { id: 'video-bridge', label: 'Preparar vídeo', icon: <Video className="size-4" /> },
  ];

  // VISTA 2: EDITOR DE LIENZO DE ASSET INDIVIDUAL (STUDIO WORKSPACE SHELL ESTILO CANVA)
  return (
    <InlineEditingProvider
      editingLayerId={editingLayerId}
      onRequestEdit={handleRequestEdit}
      onExitEditing={() => setEditingLayerId(null)}
    >
      <InlineEditorProvider activeLayerId={activeInlineLayerId}>
      <StudioWorkspaceShell
      suiteTitle="Image & Graphic Studio"
      tools={studioTools}
      activeToolId={activeToolId}
      onSelectTool={setActiveToolId}
      drawerContent={
        <ImageStudioAssetSidebar
          activeTab={activeToolId}
          project={editor.project}
          selectedLayerId={editor.selectedLayerId}
          selectedLayer={editor.project.layers.find((l) => l.id === editor.selectedLayerId) ?? null}
          selectedLayerIds={editor.selectedLayerIds}
          onSelectLayer={handleSelectLayer}
          onLoadTemplate={handleLoadTemplate}
          onAddBlock={handleAddBlock}
          onAddTextLayer={editor.addTextLayer}
          onAddImageLayer={editor.addImageLayer}
          onInsertSavedLayer={editor.insertSavedLayer}
          onUpdateBackground={(gradient, color) => editor.updateBackground({ gradient, color })}
          onToggleLock={editor.toggleLayerLock}
          onToggleVisibility={editor.toggleLayerVisibility}
          onToggleAllLock={editor.toggleAllLayersLock}
          onToggleAllVisibility={editor.toggleAllLayersVisibility}
          onMoveZIndex={editor.moveLayerZIndex}
          onDistributeSelectedLayers={editor.distributeSelectedLayers}
          onReorderLayers={editor.reorderLayers}
          onRenameLayer={editor.renameLayer}
          onDuplicateLayer={editor.duplicateLayer}
          onRemoveLayer={editor.removeLayer}
          onDeleteSelectedLayers={editor.deleteSelectedLayers}
          onUpdateGuideSettings={editor.updateGuideSettings}
          onAutoLayout={editor.applyAutoLayout}
          onFitText={editor.fitSelectedText}
          onApplyVariant={editor.applyStyleVariant}
          onAlignSelectedLayers={editor.alignSelectedLayers}
          onGroupSelectedLayers={editor.groupSelectedLayers}
          onUngroupLayer={editor.ungroupLayer}
          onUpdateLayerProps={editor.updateLayerProps}
          onReplaceLayerContent={editor.replaceLayerContent}
          onUpdateLayerPosition={editor.updateLayerPosition}
          onUpdateLayerOpacity={editor.updateLayerOpacity}
          onUpdateLayerShadowPreset={editor.updateLayerShadowPreset}
          onUpdateLayerBorder={editor.updateLayerBorder}
          onPrepareVideo={(settings) => {
            const videoProject = saveImageVideoHandoff(editor.project);
            localStorage.setItem('vitablue:image-video-preparation', JSON.stringify(settings));
            showToast(`Vídeo preparado: ${settings.durationInSeconds}s`);
            window.location.href = '/backoffice/marketing-studio/generador-contenido?from=image-studio&videoProject=' + encodeURIComponent(videoProject.id);
          }}
          onRegenerateBackground={editor.regenerateCarouselBackground}
          onUploadImage={uploadImage}
          onListImages={listImages}
          onDeleteImage={deleteImage}
          onListProjects={listProjects}
          onDuplicateProject={duplicateProject}
          onArchiveProject={archiveProject}
        />
      }
      toolbar={
        <ImageEditorToolbar
          project={editor.project}
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          isExporting={editor.isExporting}
          showSafeZones={editor.showSafeZones}
          previewMode={editor.previewMode}
          isInspectorOpen={isInspectorOpen}
          lastSavedAt={editor.lastSavedAt}
          saveState={editor.saveState}
          onRetrySave={editor.retrySave}
          onBackToHub={() => setSearchParams({})}
          onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
          onToggleSafeZones={() => {
            const next = !editor.showSafeZones;
            editor.setShowSafeZones(next);
            editor.setPreviewMode(next ? 'guides' : 'normal');
          }}
          onSetPreviewMode={(mode) => {
            editor.setPreviewMode(mode);
            editor.setShowSafeZones(mode === 'guides');
          }}
          onOpenCarouselSimulator={() => setIsCarouselSimulatorOpen(true)}
          onUndo={editor.undo}
          onRedo={editor.redo}
          onUpdateTitle={editor.updateTitle}
          onSetPreset={editor.setPreset}
          onCopyToClipboard={handleCopyToClipboard}
          onExport={handleExport}
          onExportCarousel={handleExportCarousel}
          onSaveToDam={handleSaveToDam}
          onSendToVideoStudio={() => {
            saveImageVideoHandoff(editor.project);
            showToast('Composición enviada a Video Studio');
          }}
        />
      }
      contextualToolbar={
        <ContextualToolbar
          context={
            editor.selectedLayerIds.length > 1
              ? { kind: 'shape', layerId: editor.selectedLayerIds[0] ?? '' }
              : activeInlineLayerId
              ? { kind: 'text', layerId: activeInlineLayerId }
              : selectedImageLayer
                ? { kind: 'image', layerId: selectedImageLayer.id, slideIndex: activeSlideIndex }
                : null
          }
          onDismiss={() => {
            setEditingLayerId(null);
            handleDeselectAll();
          }}
        >
          {editor.selectedLayerIds.length > 1 ? (
            <MultiSelectionContextualToolbar
              count={editor.selectedLayerIds.length}
              onAlign={editor.alignSelectedLayers}
              onDistribute={editor.distributeSelectedLayers}
              onGroup={editor.groupSelectedLayers}
            />
          ) : activeInlineLayerId ? (
            <InlineTextControls compact selectedLayerId={activeInlineLayerId} />
          ) : selectedImageLayer ? (
            <ImageContextualToolbar
              layer={selectedImageLayer}
              isCarousel={isCarouselProject(editor.project.preset, editor.project.carouselConfig?.enabled)}
              activeSlideIndex={activeSlideIndex}
              carouselGeometry={carouselGeometry}
              cropEditing={cropEditingLayerId === selectedImageLayer.id}
              cropZoom={cropDraft.zoom}
              onCrop={handleStartCrop}
              onCropZoomChange={(zoom) => setCropDraft((current) => normalizeImageCrop({ ...current, zoom }))}
              onApplyCrop={handleApplyCrop}
              onCancelCrop={handleCancelCrop}
              onResetCrop={handleResetCrop}
              onRotate={(layerId, rotation) => editor.updateLayerRotation(layerId, rotation)}
              onToggleFlipHorizontal={editor.toggleFlipHorizontal}
              onToggleFlipVertical={editor.toggleFlipVertical}
              onFitToActiveSlide={editor.fitLayerToActiveSlide}
              onReplaceLayerContent={editor.replaceLayerContent}
              onUploadImage={uploadImage}
              onResetAdjustments={editor.resetLayerAdjustments}
            />
          ) : null}
        </ContextualToolbar>
      }
      asideVisible={isInspectorOpen}
      aside={
          <ImageStudioInspector
            project={editor.project}
            selectedLayer={editor.project.layers.find((l) => l.id === editor.selectedLayerId) ?? null}
            onUpdateLayerProps={editor.updateLayerProps}
            onReplaceLayerContent={editor.replaceLayerContent}
            onApplyStyleVariant={editor.applyStyleVariant}
            onToggleLayerLock={editor.toggleLayerLock}
            onUpdateLayerScale={editor.updateLayerScale}
            onUpdateLayerWidth={editor.updateLayerWidth}
            onUpdateLayerHeight={editor.updateLayerHeight}
            onUpdateLayerRotation={editor.updateLayerRotation}
            onUpdateLayerPosition={editor.updateLayerPosition}
            onUpdateLayerFilter={editor.updateLayerFilter}
            onUpdateLayerAdjustments={editor.updateLayerAdjustments}
            onUpdateLayerClipShape={editor.updateLayerClipShape}
            onToggleFlipHorizontal={editor.toggleFlipHorizontal}
            onToggleFlipVertical={editor.toggleFlipVertical}
            onFitToActiveSlide={editor.fitLayerToActiveSlide}
            onResetAdjustments={editor.resetLayerAdjustments}
            activeSlideIndex={activeSlideIndex}
            onUpdateLayerOpacity={editor.updateLayerOpacity}
            onUpdateLayerShadowPreset={editor.updateLayerShadowPreset}
            onUpdateLayerBorder={editor.updateLayerBorder}
            onCopyStyle={editor.copyLayerStyle}
            onPasteStyle={editor.pasteLayerStyle}
            onFitToCanvas={editor.fitLayerToCanvas}
            onUngroupLayer={editor.ungroupLayer}
            onSaveToMyDesigns={editor.saveLayerToMyDesigns}
            onSetPreset={editor.setPreset}
            onComposeSmartCanvas={editor.composeSmartCanvas}
            onClearCanvas={editor.clearCanvas}
            onUpdateBackground={editor.updateBackground}
            onClose={() => setIsInspectorOpen(false)}
          />
      }
    >
      <div className="flex h-full w-full flex-col overflow-hidden relative">
        {/* CENTER CANVAS STAGE (MOTIONKIT + 8-POINT BOUNDING BOX + ROTATION + SNAPPING) */}
        <ImageStage
          project={editor.project}
          selectedLayerId={editor.selectedLayerId}
          selectedLayerIds={editor.selectedLayerIds}
          isCanvasSelected={isCanvasSelected}
          zoom={editor.zoom}
          showSafeZones={editor.showSafeZones}
          previewMode={editor.previewMode}
          onSetCurrentSlide={editor.setCurrentSlide}
          canvasRef={canvasRef}
          onSelectLayer={handleSelectLayer}
          editingLayerId={editingLayerId}
          onExitEditing={() => setEditingLayerId(null)}
          onRequestEdit={handleRequestEdit}
          onSelectMultipleLayers={editor.selectMultipleLayers}
          onGroupSelectedLayers={editor.groupSelectedLayers}
          onDeleteSelectedLayers={editor.deleteSelectedLayers}
          onDuplicateSelectedLayers={editor.duplicateSelectedLayers}
          onCopySelectedLayers={editor.copySelectedLayers}
          onPasteLayers={editor.pasteLayers}
          onCopyLayerStyle={editor.copyLayerStyle}
          onPasteLayerStyle={editor.pasteLayerStyle}
          onToggleFlipHorizontal={editor.toggleFlipHorizontal}
          onToggleFlipVertical={editor.toggleFlipVertical}
          onNudgeSelectedLayers={editor.nudgeSelectedLayers}
          onToggleLock={editor.toggleLayerLock}
          onToggleVisibility={editor.toggleLayerVisibility}
          onMoveZIndex={editor.moveLayerZIndex}
          onAlignSelectedLayers={editor.alignSelectedLayers}
          onDistributeSelectedLayers={editor.distributeSelectedLayers}
          onSelectCanvas={handleSelectCanvas}
          onDeselectAll={handleDeselectAll}
          onUpdatePosition={editor.updateLayerPosition}
          onUpdateScale={editor.updateLayerScale}
          onUpdateWidth={editor.updateLayerWidth}
          onUpdateHeight={editor.updateLayerHeight}
          onUpdateRotation={editor.updateLayerRotation}
          onUpdateLayerProps={editor.updateLayerProps}
          cropEditingLayerId={cropEditingLayerId}
          cropDraft={cropDraft}
          onCropChange={setCropDraft}
          onCommitPositionChange={editor.commitPositionChange}
          onFitToCanvas={editor.fitLayerToCanvas}
          onUngroupLayer={editor.ungroupLayer}
          onSaveToMyDesigns={editor.saveLayerToMyDesigns}
          onDuplicateLayer={editor.duplicateLayer}
          onRemoveLayer={editor.removeLayer}
          onSetZoom={editor.setZoom}
        />
        <CarouselSlideStrip
          project={editor.project}
          activeSlideIndex={activeSlideIndex}
          onSelectSlide={editor.setCurrentSlide}
          onReorderSlides={editor.reorderCarouselSlides}
          onDuplicateSlide={editor.duplicateCarouselSlide}
          onChangeLayout={editor.updateCarouselLayout}
        />

        {/* CAROUSEL MOBILE INTERACTIVE SIMULATOR MODAL */}
        <CarouselMobileSimulator
          isOpen={isCarouselSimulatorOpen}
          onClose={() => setIsCarouselSimulatorOpen(false)}
          project={editor.project}
          comparisonBefore={carouselComparisonBefore}
          onApplyVariant={handleApplyCarouselVariant}
          onAdaptAspectRatio={handleAdaptCarouselAspectRatio}
        />

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-slate-700 animate-slideUp">
            {toastMessage}
          </div>
        )}
      </div>
      </StudioWorkspaceShell>
      </InlineEditorProvider>
    </InlineEditingProvider>
  );
};

export default ImageStudio;
