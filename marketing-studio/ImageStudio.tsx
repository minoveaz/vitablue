import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BackofficeShell from '../components/layouts/BackofficeShell';
import { useImageProjectEditor } from './hooks/useImageProjectEditor';
import { ImageEditorToolbar } from './components/image-editor/ImageEditorToolbar';
import { ImageStudioAssetSidebar } from './components/image-editor/ImageStudioAssetSidebar';
import { ImageStudioInspector } from './components/image-editor/ImageStudioInspector';
import { ImageStage } from './components/image-editor/ImageStage';
import { ImageStudioHub } from './components/image-editor/ImageStudioHub';
import { getStoredImageProjects } from './utils/imageProjectStorage';
import { FolderOpen } from 'lucide-react';

export const ImageStudio: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const assetId = searchParams.get('assetId');

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isContextSidebarOpen, setIsContextSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load project by assetId from localStorage if present
  const initialProject = React.useMemo(() => {
    if (!assetId) return undefined;
    const stored = getStoredImageProjects();
    return stored.find((p) => p.id === assetId);
  }, [assetId]);

  const editor = useImageProjectEditor(initialProject);

  // ATAJOS DE TECLADO GLOBALES (Cmd+Z, Ctrl+Z, Redo, Delete, Duplicar)
  useEffect(() => {
    if (!assetId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }

      // Cmd+Z / Ctrl+Z (Deshacer / Undo)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        editor.undo();
        return;
      }

      // Cmd+Shift+Z / Ctrl+Y (Rehacer / Redo)
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && e.shiftKey) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        editor.redo();
        return;
      }

      // Cmd+D (Duplicar capa)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        if (editor.selectedLayerId) {
          e.preventDefault();
          editor.duplicateLayer(editor.selectedLayerId);
        }
        return;
      }

      // Delete o Backspace (Eliminar capa)
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (editor.selectedLayerId) {
          e.preventDefault();
          editor.removeLayer(editor.selectedLayerId);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor, assetId]);

  const handleSaveToDam = () => {
    setToastMessage('✅ Activo guardado con éxito en la Biblioteca DAM');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = async (format: 'png' | 'jpeg' | 'svg') => {
    if (canvasRef.current) {
      await editor.exportImage(canvasRef.current, format);
      setToastMessage(`🎉 Imagen ${format.toUpperCase()} descargada en alta resolución`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const [isCanvasSelected, setIsCanvasSelected] = useState<boolean>(true);

  const handleSelectLayer = (id: string) => {
    editor.selectLayer(id);
    setIsCanvasSelected(false);
    setIsInspectorOpen(true);
  };

  const handleSelectCanvas = () => {
    editor.selectLayer(null);
    setIsCanvasSelected(true);
    setIsInspectorOpen(true);
  };

  const handleDeselectAll = () => {
    editor.selectLayer(null);
    setIsCanvasSelected(false);
    setIsInspectorOpen(false);
  };

  const handleAddBlock = (blockType: Parameters<typeof editor.addBlockLayer>[0], defaultProps?: Record<string, unknown>) => {
    editor.addBlockLayer(blockType, defaultProps);
    setIsCanvasSelected(false);
    setIsInspectorOpen(true);
  };

  const handleLoadTemplate = (template: Parameters<typeof editor.loadTemplate>[0]) => {
    editor.loadTemplate(template);
    setIsCanvasSelected(false);
    setIsInspectorOpen(true);
  };

  // IF NO ASSET ID IS PRESENT, RENDER THE PROJECTS OVERVIEW HUB
  if (!assetId) {
    return (
      <BackofficeShell
        title="Image & Graphic Studio"
        eyebrow="Creative Studio"
        breadcrumbs={['Marketing Studio', 'Image Studio']}
        mode="full-bleed"
        hideModuleHeader={true}
      >
        <ImageStudioHub onOpenProject={(id) => setSearchParams({ assetId: id })} />
      </BackofficeShell>
    );
  }

  // IF ASSET ID IS PRESENT, RENDER THE FULL CANVAS EDITOR
  return (
    <BackofficeShell
      title="Image & Graphic Studio"
      eyebrow="Creative Studio"
      breadcrumbs={['Marketing Studio', 'Image Studio', editor.project.title]}
      mode="full-bleed"
      hideModuleHeader={true}
      asidePresentation="overlay"
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
          onExport={handleExport}
          onSaveToDam={handleSaveToDam}
        />
      }
      contextAside={
        isContextSidebarOpen ? (
          <ImageStudioAssetSidebar
            project={editor.project}
            selectedLayerId={editor.selectedLayerId}
            onSelectLayer={editor.selectLayer}
            onLoadTemplate={handleLoadTemplate}
            onAddBlock={handleAddBlock}
            onUpdateBackground={(gradient, color) => editor.updateBackground({ gradient, color })}
            onToggleLock={editor.toggleLayerLock}
            onToggleVisibility={editor.toggleLayerVisibility}
            onMoveZIndex={editor.moveLayerZIndex}
            onRenameLayer={editor.renameLayer}
            onDuplicateLayer={editor.duplicateLayer}
            onRemoveLayer={editor.removeLayer}
            onCollapse={() => setIsContextSidebarOpen(false)}
          />
        ) : undefined
      }
      aside={
        isInspectorOpen ? (
          <ImageStudioInspector
            project={editor.project}
            selectedLayer={editor.selectedLayer}
            onUpdateLayerProps={editor.updateLayerProps}
            onUpdateLayerScale={editor.updateLayerScale}
            onUpdateLayerWidth={editor.updateLayerWidth}
            onUpdateLayerPosition={editor.updateLayerPosition}
            onFitToCanvas={editor.fitLayerToCanvas}
            onUngroupLayer={editor.ungroupLayer}
            onUpdateBackground={editor.updateBackground}
            onClose={() => setIsInspectorOpen(false)}
          />
        ) : undefined
      }
      contextualSidebarAction={(isRail?: boolean) =>
        !isContextSidebarOpen ? (
          <button
            type="button"
            onClick={() => setIsContextSidebarOpen(true)}
            className="flex w-full items-center gap-2.5 rounded-lg border border-primary/40 bg-primary/10 p-2 text-left text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
            title="Abrir biblioteca de assets"
          >
            <FolderOpen className="size-4 shrink-0" />
            {!isRail && <span>Biblioteca</span>}
          </button>
        ) : null
      }
    >
      <div className="flex h-full w-full flex-col overflow-hidden relative">
        {/* CENTER CANVAS STAGE */}
        <ImageStage
          project={editor.project}
          selectedLayerId={editor.selectedLayerId}
          isCanvasSelected={isCanvasSelected}
          zoom={editor.zoom}
          showSafeZones={editor.showSafeZones}
          canvasRef={canvasRef}
          onSelectLayer={handleSelectLayer}
          onSelectCanvas={handleSelectCanvas}
          onDeselectAll={handleDeselectAll}
          onUpdatePosition={editor.updateLayerPosition}
          onUpdateScale={editor.updateLayerScale}
          onUpdateWidth={editor.updateLayerWidth}
          onCommitPositionChange={editor.commitPositionChange}
          onFitToCanvas={editor.fitLayerToCanvas}
          onUngroupLayer={editor.ungroupLayer}
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
    </BackofficeShell>
  );
};

export default ImageStudio;
