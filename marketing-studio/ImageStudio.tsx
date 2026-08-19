import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Image as ImageIcon } from 'lucide-react';
import { useImageProjectEditor } from './hooks/useImageProjectEditor';
import { ImageEditorTopBar } from './components/image-editor/ImageEditorTopBar';
import { ImageEditorRail, ImageRailTab } from './components/image-editor/ImageEditorRail';
import { ImageEditorDrawer } from './components/image-editor/ImageEditorDrawer';
import { ImageStage } from './components/image-editor/ImageStage';
import { ImageContextInspector } from './components/image-editor/ImageContextInspector';

export const ImageStudio: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeRailTab, setActiveRailTab] = useState<ImageRailTab>('templates');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const editor = useImageProjectEditor();

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

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 font-sans text-slate-900 select-none">
      {/* 1. TOP BAR WITH PRESETS & EXPORT */}
      <ImageEditorTopBar
        project={editor.project}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        isExporting={editor.isExporting}
        onUndo={editor.undo}
        onRedo={editor.redo}
        onUpdateTitle={editor.updateTitle}
        onSetPreset={editor.setPreset}
        onExport={handleExport}
        onSaveToDam={handleSaveToDam}
      />

      {/* 2. SUB-BAR SWITCHER (VIDEO STUDIO VS IMAGE STUDIO) */}
      <div className="flex h-10 w-full items-center justify-between border-b border-slate-200 bg-slate-50 px-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate('/backoffice/marketing-studio/generador-contenido')}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
          >
            <Video className="size-3.5" />
            <span>Video Studio (Reels & MP4)</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-xs font-bold text-primary shadow-xs ring-1 ring-slate-200"
          >
            <ImageIcon className="size-3.5 text-primary" />
            <span>Image & Graphic Studio (Canva)</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Resolución: {editor.project.preset.width} × {editor.project.preset.height} px ({editor.project.preset.aspectRatio})
        </span>
      </div>

      {/* 3. MAIN WORKSPACE WITH 3 COLUMNS */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* LEFT ICON RAIL */}
        <ImageEditorRail
          activeTab={activeRailTab}
          onSelectTab={setActiveRailTab}
        />

        {/* LEFT EXPANDABLE DRAWER */}
        <ImageEditorDrawer
          activeTab={activeRailTab}
          onLoadTemplate={editor.loadTemplate}
          onAddBlock={editor.addBlockLayer}
          onUpdateBackground={(gradient, color) => editor.updateBackground({ gradient, color })}
        />

        {/* CENTER STAGE / CANVAS */}
        <ImageStage
          project={editor.project}
          selectedLayerId={editor.selectedLayerId}
          zoom={editor.zoom}
          showSafeZones={editor.showSafeZones}
          canvasRef={canvasRef}
          onSelectLayer={editor.selectLayer}
          onUpdatePosition={editor.updateLayerPosition}
          onUpdateScale={editor.updateLayerScale}
          onDuplicateLayer={editor.duplicateLayer}
          onRemoveLayer={editor.removeLayer}
          onSetZoom={editor.setZoom}
          onToggleSafeZones={() => editor.setShowSafeZones(!editor.showSafeZones)}
        />

        {/* RIGHT PROPS INSPECTOR */}
        <ImageContextInspector
          project={editor.project}
          selectedLayer={editor.selectedLayer}
          onUpdateLayerProps={editor.updateLayerProps}
          onUpdateLayerPosition={editor.updateLayerPosition}
          onUpdateLayerScale={editor.updateLayerScale}
          onUpdateBackground={editor.updateBackground}
        />
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-slate-700 animate-slideUp">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ImageStudio;
