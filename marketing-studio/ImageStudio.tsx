import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BackofficeShell, { vitablueBackofficeSchema } from '../components/layouts/BackofficeShell';
import {
  CreativeStudioShellAdapter,
  ShortcutManager,
  StudioToolRail,
  StudioResourcePanel,
  type StudioToolRailItem,
} from '../components/backoffice-shell';
import type { ShortcutBinding } from '../components/backoffice-shell';
import type { CreativeStudioImageStudioExtension } from '../components/backoffice-shell/contracts';
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
import type { EditableVectorPoint } from './types/vectorGeometry';
import { DEFAULT_IMAGE_CROP, normalizeImageCrop } from './utils/imageCrop';
import {
  LayoutTemplate,
  Sparkles,
  Wand2,
  FolderHeart,
  Video,
} from 'lucide-react';
import { createCreativeResourceToolRail } from '../components/creative-resources';

export const ImageStudio: React.FC = () => {
  const navigate = useNavigate();
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
  const addBlockLayer = editor.addBlockLayer;
  const canvasWidth = editor.project.preset.width;
  const canvasHeight = editor.project.preset.height;
  const handleCreateVectorLayer = React.useCallback(
    (points: EditableVectorPoint[], mode: 'line' | 'curve' | 'polyline') => {
      const minX = Math.min(...points.map((point) => point.x));
      const maxX = Math.max(...points.map((point) => point.x));
      const minY = Math.min(...points.map((point) => point.y));
      const maxY = Math.max(...points.map((point) => point.y));
      const widthRatio = Math.max(0.04, maxX - minX);
      const heightRatio = Math.max(mode === 'line' ? 0.02 : 0.04, maxY - minY);
      const normalizedPoints = points.map((point) => ({
        x: (point.x - minX) / widthRatio,
        y: (point.y - minY) / heightRatio,
      }));
      addBlockLayer('GeometricShape', {
        shapeType: mode,
        fill: 'transparent',
        stroke: '#94D2BD',
        strokeWidth: 4,
        width: Math.round(widthRatio * canvasWidth),
        height: Math.round(heightRatio * canvasHeight),
        position: {
          x: ((minX + maxX) / 2) * 100,
          y: ((minY + maxY) / 2) * 100,
        },
        vectorGeometry: {
          version: 1,
          kind: 'bezier',
          points: normalizedPoints,
        },
      });
    },
    [addBlockLayer, canvasHeight, canvasWidth],
  );
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

  const studioTools: StudioToolRailItem[] = [
    // 🌟 Posición 1: Biblioteca Personal Unificada
    { id: 'my-designs', label: 'Mis Diseños', icon: <FolderHeart className="size-4" /> },

    ...createCreativeResourceToolRail({ domain: 'image', layerCount: editor.project.layers.length }),

    // Extensiones específicas de Image Studio.
    { id: 'blocks', label: 'Bloques', icon: <Sparkles className="size-4" />, section: 'extensions', sectionLabel: 'Extensiones de Image Studio' },
    { id: 'templates', label: 'Plantillas', icon: <LayoutTemplate className="size-4" />, section: 'extensions' },

    // 🟡 Zona 4: Inteligencia y Multimedia (9 - 10)
    { id: 'ai-copy', label: 'Copys con IA', icon: <Wand2 className="size-4" />, section: 'extensions' },
    { id: 'video-bridge', label: 'Preparar vídeo', icon: <Video className="size-4" />, section: 'extensions' },
  ];

  const shortcutBindings: ShortcutBinding[] = [
    { shortcut: 'mod+z', onTrigger: (event) => event.shiftKey ? editor.redo() : editor.undo() },
    { shortcut: 'mod+y', onTrigger: () => editor.redo() },
    { shortcut: 'mod+g', onTrigger: (event) => event.shiftKey
      ? editor.selectedLayer && editor.ungroupLayer(editor.selectedLayer.id)
      : editor.groupSelectedLayers() },
    { shortcut: 'mod+c', onTrigger: (event) => {
      if (event.altKey) {
        editor.copyLayerStyle();
        showToast('Estilo copiado al portapapeles');
      } else {
        editor.copySelectedLayers();
        showToast('Capa(s) copiada(s) al portapapeles');
      }
    } },
    { shortcut: 'mod+v', onTrigger: (event) => {
      if (event.altKey) {
        editor.pasteLayerStyle();
        showToast('Estilo pegado');
      } else {
        editor.pasteLayers();
        showToast('Capa(s) pegada(s)');
      }
    } },
    { shortcut: 'mod+d', onTrigger: () => {
      if (editor.selectedLayerIds.length > 1) editor.duplicateSelectedLayers();
      else if (editor.selectedLayerId) editor.duplicateLayer(editor.selectedLayerId);
    } },
    { shortcut: 'ArrowLeft', onTrigger: (event) => editor.nudgeSelectedLayers(event.shiftKey ? -2 : -0.2, 0) },
    { shortcut: 'ArrowRight', onTrigger: (event) => editor.nudgeSelectedLayers(event.shiftKey ? 2 : 0.2, 0) },
    { shortcut: 'ArrowUp', onTrigger: (event) => editor.nudgeSelectedLayers(0, event.shiftKey ? -2 : -0.2) },
    { shortcut: 'ArrowDown', onTrigger: (event) => editor.nudgeSelectedLayers(0, event.shiftKey ? 2 : 0.2) },
    { shortcut: 'Delete', preventDefault: false, onTrigger: (event) => {
      if (editor.selectedLayerIds.length > 0) {
        event.preventDefault();
        editor.deleteSelectedLayers();
      } else if (editor.selectedLayerId) {
        event.preventDefault();
        editor.removeLayer(editor.selectedLayerId);
      }
    } },
    { shortcut: 'Backspace', preventDefault: false, onTrigger: (event) => {
      if (editor.selectedLayerIds.length > 0) {
        event.preventDefault();
        editor.deleteSelectedLayers();
      } else if (editor.selectedLayerId) {
        event.preventDefault();
        editor.removeLayer(editor.selectedLayerId);
      }
    } },
  ];

  const assetSidebar = (
    <ImageStudioAssetSidebar
      activeTab={activeToolId}
      onActiveTabChange={(tab) => setActiveToolId(tab)}
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
      onUpdateBrandCompositionConfig={editor.updateBrandCompositionConfig}
      onUploadImage={uploadImage}
      onListImages={listImages}
      onDeleteImage={deleteImage}
      onListProjects={listProjects}
      onDuplicateProject={duplicateProject}
      onArchiveProject={archiveProject}
    />
  );

  const imageExtension: CreativeStudioImageStudioExtension = {
    domain: 'image',
    capabilities: ['slide-strip', 'preview', 'crop', 'export'],
    slots: {
      slideStrip: (
        <CarouselSlideStrip
          project={editor.project}
          activeSlideIndex={activeSlideIndex}
          onSelectSlide={editor.setCurrentSlide}
          onReorderSlides={editor.reorderCarouselSlides}
          onDuplicateSlide={editor.duplicateCarouselSlide}
          onChangeLayout={editor.updateCarouselLayout}
        />
      ),
      preview: (
        <CarouselMobileSimulator
          isOpen={isCarouselSimulatorOpen}
          onClose={() => setIsCarouselSimulatorOpen(false)}
          project={editor.project}
          comparisonBefore={carouselComparisonBefore}
          onApplyVariant={handleApplyCarouselVariant}
          onAdaptAspectRatio={handleAdaptCarouselAspectRatio}
        />
      ),
    },
  };

  // VISTA 2: EDITOR DE LIENZO DE ASSET INDIVIDUAL (ADAPTER DEL SHELL COMPARTIDO)
  return (
    <ShortcutManager scope="consumer" bindings={shortcutBindings}>
      <InlineEditingProvider
      editingLayerId={editingLayerId}
      onRequestEdit={handleRequestEdit}
      onExitEditing={() => setEditingLayerId(null)}
    >
      <InlineEditorProvider activeLayerId={activeInlineLayerId}>
      <CreativeStudioShellAdapter
      domain="image"
      state={{ status: editor.saveState, lastSavedAt: editor.lastSavedAt }}
      navMode="hidden"
      extensions={imageExtension}
      capabilities={['platform-header', 'suite-navigation', 'toolbar', 'stage', 'inspector', 'bottom-workspace', 'overlays']}
      mobileSafeMode
      mobileSafeModeTitle="Image Studio disponible en tablet y escritorio"
      mobileSafeModeDescription="La edición completa del lienzo requiere una pantalla de al menos 768 px de ancho."
      schema={vitablueBackofficeSchema}
      onNavigate={(route) => navigate(route.routeId)}
      activeModuleId="image-studio"
      suiteTitle="Image & Graphic Studio"
      slots={{
        toolRail: (
          <StudioToolRail
            items={studioTools}
            activeToolId={activeToolId}
            onSelect={(toolId) => setActiveToolId((current) => (current === toolId ? null : toolId))}
          />
        ),
        resourcePanel: activeToolId ? (
          <StudioResourcePanel
            title={studioTools.find((tool) => tool.id === activeToolId)?.label ?? 'Recursos'}
            onClose={() => setActiveToolId(null)}
            variant="dark"
            className="w-[min(24rem,32vw)] border-r border-slate-800 bg-slate-900/98 text-white shadow-2xl"
          >
            {assetSidebar}
          </StudioResourcePanel>
        ) : null,
      toolbar: <>
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
      </>,
      inspector:
        isInspectorOpen ? (
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
        ) : undefined
      ,
      stage: (
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
          onCreateVectorLayer={handleCreateVectorLayer}
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
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-slate-700 animate-slideUp">
            {toastMessage}
          </div>
        )}
      </div>
      )
      }}
    />
      </InlineEditorProvider>
      </InlineEditingProvider>
    </ShortcutManager>
  );
};

export default ImageStudio;
