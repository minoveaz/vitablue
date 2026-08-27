import React, { useRef } from 'react';
import type { ImageCrop, ImageProject, ImagePreviewMode } from '../../types/imageStudio';
import { createDefaultGuideSettings, getCarouselGeometry, getGuideSnapLines, getPlatformGuideProfile, isCarouselProject } from '../../utils/imageDesignSystem';
import { useImageStageViewport } from '../../hooks/useImageStageViewport';
import { useImageStageInteractions } from '../../hooks/useImageStageInteractions';
import { ImageStageContextMenu } from './ImageStageContextMenu';
import { ImageStageGuides } from './ImageStageGuides';
import { ImageStageLayers } from './ImageStageLayers';
import { ImageStageMultiSelection } from './ImageStageMultiSelection';
import { ImageStageToolbar } from './ImageStageToolbar';
import type { ImageStageActions } from './ImageStage.types';

export interface ImageStageProps extends ImageStageActions {
  project: ImageProject;
  selectedLayerId: string | null;
  selectedLayerIds?: string[];
  isCanvasSelected: boolean;
  zoom: number;
  showSafeZones: boolean;
  previewMode: ImagePreviewMode;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onSelectLayer: (id: string, isShift?: boolean) => void;
  editingLayerId?: string | null;
  onExitEditing?: () => void;
  onRequestEdit?: (id: string) => void;
  onSelectMultipleLayers?: (ids: string[]) => void;
  onUpdateScale: (id: string, scale: number) => void;
  onUpdateWidth?: (id: string, width?: number) => void;
  onUpdateHeight?: (id: string, height?: number) => void;
  onUpdateRotation?: (id: string, rotation: number) => void;
  onCommitPositionChange?: () => void;
  onSelectCanvas: () => void;
  onDeselectAll: () => void;
  onSetZoom: (zoom: number) => void;
  onSetCurrentSlide?: (slide: number) => void;
  onUpdateLayerProps?: (id: string, patch: Record<string, unknown>) => void;
  cropEditingLayerId?: string | null;
  cropDraft?: ImageCrop;
  onCropChange?: (crop: ImageCrop) => void;
}

export const ImageStage: React.FC<ImageStageProps> = ({
  project, selectedLayerId, selectedLayerIds = [], isCanvasSelected, zoom, showSafeZones, previewMode, canvasRef,
  onSelectLayer, editingLayerId, onExitEditing, onRequestEdit, onSelectMultipleLayers, onGroupSelectedLayers,
  onDeleteSelectedLayers, onDuplicateSelectedLayers, onCopySelectedLayers, onPasteLayers, onCopyLayerStyle,
  onPasteLayerStyle, onToggleFlipHorizontal, onToggleFlipVertical, onNudgeSelectedLayers, onToggleLock,
  onToggleVisibility, onMoveZIndex, onAlignSelectedLayers, onDistributeSelectedLayers, onSelectCanvas, onDeselectAll, onUpdatePosition,
  onUpdateScale, onUpdateWidth, onUpdateHeight, onUpdateRotation, onCommitPositionChange, onFitToCanvas,
  onUngroupLayer, onSaveToMyDesigns, onDuplicateLayer, onRemoveLayer, onUpdateLayerProps, onSetZoom, onSetCurrentSlide,
  cropEditingLayerId, cropDraft, onCropChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMouseDownPosRef = useRef({ x: 0, y: 0 });
  const guideSettings = project.guideSettings ?? createDefaultGuideSettings(project.preset);
  const guideProfile = getPlatformGuideProfile(project.preset, guideSettings.profileId);
  const guideSnapLines = getGuideSnapLines(project.preset, guideSettings);
  const isCarousel = isCarouselProject(project.preset, project.carouselConfig?.enabled);
  const carouselGeometry = getCarouselGeometry(project.preset, project.carouselConfig?.slideCount ?? project.preset.defaultSlideCount, project.carouselConfig?.enabled);
  const activeSlideIndex = Math.min(carouselGeometry.slideCount - 1, Math.max(0, project.currentSlide ?? project.carouselConfig?.currentSlideIndex ?? 0));
  const showGuideOverlay = previewMode === 'guides' || showSafeZones;
  const viewport = useImageStageViewport({ containerRef, project, zoom, previewMode, isCarousel, carouselGeometry, onSetZoom, onNudgeSelectedLayers, activeSlideIndex });
  const interactions = useImageStageInteractions({
    project, zoom, canvasRef, selectedLayerIds, editingLayerId, effectiveHandMode: viewport.effectiveHandMode,
    isPanning: viewport.isPanning, setIsPanning: viewport.setIsPanning,
    setPanOffset: viewport.setPanOffset, panStartRef: viewport.panStartRef, startPan: viewport.startPan,
    guideSettings, guideSnapLines, isCarousel, carouselGeometry, onSelectLayer, onExitEditing, onRequestEdit,
    onSelectMultipleLayers, onDeselectAll, onSetCurrentSlide, onUpdatePosition, onUpdateScale, onUpdateWidth,
    onUpdateHeight, onUpdateRotation, onCommitPositionChange,
  });
  const handleCanvasPointerDown = (event: React.PointerEvent) => {
    canvasMouseDownPosRef.current = { x: event.clientX, y: event.clientY };
    interactions.handleCanvasPointerDown(event);
  };
  const actions: ImageStageActions = {
    onGroupSelectedLayers, onDeleteSelectedLayers, onDuplicateSelectedLayers, onCopySelectedLayers, onPasteLayers,
    onCopyLayerStyle, onPasteLayerStyle, onToggleFlipHorizontal, onToggleFlipVertical, onToggleLock, onToggleVisibility,
    onMoveZIndex, onAlignSelectedLayers, onDistributeSelectedLayers, onUpdatePosition, onFitToCanvas, onUngroupLayer, onSaveToMyDesigns,
    onDuplicateLayer, onRemoveLayer,
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={interactions.handleContainerPointerDown}
      className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#050B14] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-3 sm:p-5 lg:p-8 select-none ${
        viewport.effectiveHandMode ? (viewport.isPanning ? 'cursor-grabbing' : 'cursor-grab') : interactions.draggingLayerId ? 'cursor-grabbing' : interactions.pendingLayerId ? 'cursor-move' : 'cursor-default'
      }`}
    >
      <ImageStageContextMenu contextMenu={interactions.contextMenu} selectedLayerIds={selectedLayerIds} onClose={() => interactions.setContextMenu(null)} {...actions} />
      <div className="relative transition-transform duration-75 ease-out cursor-default" style={{ transform: `translate3d(${viewport.panOffset.x}px, ${viewport.panOffset.y}px, 0) scale(${zoom})`, transformOrigin: 'center center' }}>
        <ImageStageMultiSelection selectedLayerIds={selectedLayerIds} onGroupSelectedLayers={onGroupSelectedLayers} />
        <div onClick={(event) => { event.stopPropagation(); onSelectCanvas(); }} style={{ transform: `scale(${1 / Math.max(zoom, 0.25)}) translateY(-100%)`, transformOrigin: 'bottom left' }} className={`absolute -top-3 left-0 z-30 flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none shadow-lg ${isCanvasSelected ? 'bg-primary text-white font-bold ring-2 ring-brand-cyan/60 border border-brand-cyan/40 shadow-xl' : 'bg-slate-900/95 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold border border-slate-700/80 backdrop-blur-md'}`} title="Hacer clic para seleccionar y configurar el formato del lienzo">
          <span className="flex items-center gap-2"><span className="text-sm">{project.preset.aspectRatio === '9:16' ? '📱' : project.preset.aspectRatio === '4:5' ? '📸' : project.preset.aspectRatio === '1:1' ? '🟦' : '🖥️'}</span><span className="text-xs font-bold text-slate-100">{project.preset.name}</span><span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${isCanvasSelected ? 'bg-brand-cyan/25 text-brand-cyan font-black' : 'bg-slate-800 text-slate-400 font-bold'}`}>{project.preset.width} × {project.preset.height} px ({project.preset.aspectRatio})</span></span>
        </div>
        <div ref={canvasRef} onPointerDown={handleCanvasPointerDown} onClick={(event) => { if (interactions.consumeCanvasClick()) return; const distance = Math.hypot(event.clientX - canvasMouseDownPosRef.current.x, event.clientY - canvasMouseDownPosRef.current.y); if (distance > 5) return; event.stopPropagation(); onSelectCanvas(); }} className={`artboard-bg relative overflow-visible transition-all ${isCanvasSelected ? 'ring-2 ring-primary ring-offset-4 ring-offset-[#001219]' : 'shadow-[0_20px_50px_rgba(0,0,0,0.6)]'}`} style={{ width: `${project.preset.width}px`, height: `${project.preset.height}px`, background: project.background.gradient ?? project.background.color ?? '#001219' }}>
          {interactions.marqueeBox && <div className="pointer-events-none absolute z-50 rounded-xs border-2 border-dashed border-brand-cyan bg-brand-cyan/20 shadow-[0_0_20px_rgba(148,210,189,0.35)] backdrop-blur-xs transition-none" style={{ left: `${Math.min(interactions.marqueeBox.startX, interactions.marqueeBox.currentX)}px`, top: `${Math.min(interactions.marqueeBox.startY, interactions.marqueeBox.currentY)}px`, width: `${Math.abs(interactions.marqueeBox.currentX - interactions.marqueeBox.startX)}px`, height: `${Math.abs(interactions.marqueeBox.currentY - interactions.marqueeBox.startY)}px` }} />}
          <ImageStageGuides project={project} previewMode={previewMode} zoom={zoom} showGuideOverlay={showGuideOverlay} isCarousel={isCarousel} activeSlideIndex={activeSlideIndex} carouselGeometry={carouselGeometry} guideSettings={guideSettings} guideProfile={guideProfile} />
          {interactions.guides.map((guide, index) => <div key={index} className="pointer-events-none absolute z-40" style={{ backgroundColor: guide.color, left: guide.orientation === 'vertical' ? `${guide.points[0]}px` : 0, top: guide.orientation === 'horizontal' ? `${guide.points[1]}px` : 0, width: guide.orientation === 'horizontal' ? '100%' : '1.5px', height: guide.orientation === 'vertical' ? '100%' : '1.5px', boxShadow: `0 0 8px ${guide.color}` }} />)}
          <ImageStageLayers project={project} selectedLayerId={selectedLayerId} selectedLayerIds={selectedLayerIds} effectiveHandMode={viewport.effectiveHandMode} isPanning={viewport.isPanning} draggingLayerId={interactions.draggingLayerId} onUpdateLayerProps={onUpdateLayerProps} cropEditingLayerId={cropEditingLayerId} cropDraft={cropDraft} onCropChange={onCropChange} {...interactions.handlers} />
        </div>
      </div>
      <ImageStageToolbar zoom={zoom} onSetZoom={onSetZoom} setToolMode={viewport.setToolMode} effectiveHandMode={viewport.effectiveHandMode} handleResetFit={viewport.handleResetFit} isCarousel={isCarousel} activeSlideIndex={activeSlideIndex} carouselGeometry={carouselGeometry} onSetCurrentSlide={onSetCurrentSlide} />
    </div>
  );
};
