import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackofficeShell from '../components/layouts/BackofficeShell';
import { StudioWorkspaceShell, StudioToolItem } from '../components/backoffice-shell';
import { useImageProjectEditor } from './hooks/useImageProjectEditor';
import { ImageEditorToolbar } from './components/image-editor/ImageEditorToolbar';
import { ImageStudioAssetSidebar } from './components/image-editor/ImageStudioAssetSidebar';
import { ImageStudioInspector } from './components/image-editor/ImageStudioInspector';
import { ImageStage } from './components/image-editor/ImageStage';
import { ImageStudioHub } from './components/image-editor/ImageStudioHub';
import { getStoredImageProjects } from './utils/imageProjectStorage';
import {
  LayoutTemplate,
  Type,
  Shapes,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Layers,
  Wand2,
  Film,
  FolderHeart,
} from 'lucide-react';

export const ImageStudio: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const assetId = searchParams.get('assetId');

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [activeToolId, setActiveToolId] = useState<string | null>('text');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load project by assetId from localStorage if present
  const initialProject = React.useMemo(() => {
    if (!assetId) return undefined;
    const stored = getStoredImageProjects();
    return stored.find((p) => p.id === assetId);
  }, [assetId]);

  const editor = useImageProjectEditor(initialProject);

  const [isCanvasSelected, setIsCanvasSelected] = useState(false);

  // Abrir automáticamente el inspector al seleccionar una capa
  useEffect(() => {
    if (editor.selectedLayerId) {
      setIsInspectorOpen(true);
    }
  }, [editor.selectedLayerId]);

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
  }, [editor]);

  const handleSelectLayer = (id: string, isShift?: boolean) => {
    if (isShift) {
      editor.toggleLayerSelection(id);
    } else {
      editor.selectLayer(id);
    }
    setIsCanvasSelected(false);
  };

  const handleSelectCanvas = () => {
    editor.selectLayer('');
    setIsCanvasSelected(true);
    setIsInspectorOpen(true);
  };

  const handleDeselectAll = () => {
    editor.selectLayer('');
    setIsCanvasSelected(false);
  };

  const handleLoadTemplate = (template: typeof editor.project) => {
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  const studioTools: StudioToolItem[] = [
    // 🌟 Posición 1: Biblioteca Personal Unificada
    { id: 'my-designs', label: 'Mis Diseños', icon: <FolderHeart className="size-4" /> },

    // 🟢 Zona 1: Creación Atómica y Frecuente (2 - 5)
    { id: 'text', label: 'Texto', icon: <Type className="size-4" /> },
    { id: 'elements', label: 'Elementos', icon: <Shapes className="size-4" /> },
    { id: 'media', label: 'Medios', icon: <ImageIcon className="size-4" /> },
    { id: 'layers', label: 'Capas', icon: <Layers className="size-4" />, badge: editor.project.layers.length },

    // 🔵 Zona 2: Identidad y Marca (6)
    { id: 'brand', label: 'Kit de Marca', icon: <Palette className="size-4" /> },

    // 🟣 Zona 3: Aceleración y Composición Rápida (7 - 8)
    { id: 'blocks', label: 'Bloques', icon: <Sparkles className="size-4" /> },
    { id: 'templates', label: 'Plantillas', icon: <LayoutTemplate className="size-4" /> },

    // 🟡 Zona 4: Inteligencia y Multimedia (9 - 10)
    { id: 'ai-copy', label: 'Copys con IA', icon: <Wand2 className="size-4" /> },
    { id: 'video-bridge', label: 'Audio & Vídeo', icon: <Film className="size-4" /> },
  ];

  // VISTA 2: EDITOR DE LIENZO DE ASSET INDIVIDUAL (STUDIO WORKSPACE SHELL ESTILO CANVA)
  return (
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
          selectedLayerIds={editor.selectedLayerIds}
          onSelectLayer={handleSelectLayer}
          onLoadTemplate={handleLoadTemplate}
          onAddBlock={handleAddBlock}
          onAddTextLayer={editor.addTextLayer}
          onInsertSavedLayer={editor.insertSavedLayer}
          onUpdateBackground={(gradient, color) => editor.updateBackground({ gradient, color })}
          onToggleLock={editor.toggleLayerLock}
          onToggleVisibility={editor.toggleLayerVisibility}
          onToggleAllLock={editor.toggleAllLayersLock}
          onToggleAllVisibility={editor.toggleAllLayersVisibility}
          onMoveZIndex={editor.moveLayerZIndex}
          onReorderLayers={editor.reorderLayers}
          onRenameLayer={editor.renameLayer}
          onDuplicateLayer={editor.duplicateLayer}
          onRemoveLayer={editor.removeLayer}
          onDeleteSelectedLayers={editor.deleteSelectedLayers}
        />
      }
      toolbar={
        <ImageEditorToolbar
          project={editor.project}
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          isExporting={editor.isExporting}
          showSafeZones={editor.showSafeZones}
          isInspectorOpen={isInspectorOpen}
          lastSavedAt={editor.lastSavedAt}
          onBackToHub={() => setSearchParams({})}
          onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
          onToggleSafeZones={() => editor.setShowSafeZones(!editor.showSafeZones)}
          onUndo={editor.undo}
          onRedo={editor.redo}
          onUpdateTitle={editor.updateTitle}
          onSetPreset={editor.setPreset}
          onCopyToClipboard={handleCopyToClipboard}
          onExport={handleExport}
          onSaveToDam={handleSaveToDam}
        />
      }
      aside={
        isInspectorOpen ? (
          <ImageStudioInspector
            project={editor.project}
            selectedLayer={editor.project.layers.find((l) => l.id === editor.selectedLayerId) ?? null}
            onUpdateLayerProps={editor.updateLayerProps}
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
          canvasRef={canvasRef}
          onSelectLayer={handleSelectLayer}
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
          onSelectCanvas={handleSelectCanvas}
          onDeselectAll={handleDeselectAll}
          onUpdatePosition={editor.updateLayerPosition}
          onUpdateScale={editor.updateLayerScale}
          onUpdateWidth={editor.updateLayerWidth}
          onUpdateHeight={editor.updateLayerHeight}
          onUpdateRotation={editor.updateLayerRotation}
          onUpdateLayerProps={editor.updateLayerProps}
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
    </StudioWorkspaceShell>
  );
};

export default ImageStudio;
