import React, { useEffect, useRef, useState } from 'react';
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
import type { EditableVectorPoint } from '../../types/vectorGeometry';
import { clientToCanvasPoint } from '../../utils/imageStageGeometry';

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
  onCreateVectorLayer?: (points: EditableVectorPoint[], mode: 'line' | 'curve' | 'polyline') => void;
  cropEditingLayerId?: string | null;
  cropDraft?: ImageCrop;
  onCropChange?: (crop: ImageCrop) => void;
}

export const ImageStage: React.FC<ImageStageProps> = ({
  project, selectedLayerId, selectedLayerIds = [], isCanvasSelected, zoom, showSafeZones, previewMode, canvasRef,
  onSelectLayer, editingLayerId, onExitEditing, onRequestEdit, onSelectMultipleLayers, onGroupSelectedLayers,
  onDeleteSelectedLayers, onDuplicateSelectedLayers, onCopySelectedLayers, onPasteLayers, onCopyLayerStyle,
  onPasteLayerStyle, onToggleFlipHorizontal, onToggleFlipVertical, onToggleLock,
  onToggleVisibility, onMoveZIndex, onAlignSelectedLayers, onDistributeSelectedLayers, onSelectCanvas, onDeselectAll, onUpdatePosition,
  onUpdateScale, onUpdateWidth, onUpdateHeight, onUpdateRotation, onCommitPositionChange, onFitToCanvas,
  onUngroupLayer, onSaveToMyDesigns, onDuplicateLayer, onRemoveLayer, onUpdateLayerProps, onSetZoom, onSetCurrentSlide, onCreateVectorLayer,
  cropEditingLayerId, cropDraft, onCropChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMouseDownPosRef = useRef({ x: 0, y: 0 });
  const [rapidDrawMode, setRapidDrawMode] = useState<'line' | 'curve' | 'polyline' | null>(null);
  const [rapidDrawPoints, setRapidDrawPoints] = useState<EditableVectorPoint[]>([]);
  const rapidDrawPointsRef = useRef<EditableVectorPoint[]>([]);
  const rapidDrawPointerRef = useRef<number | null>(null);
  const guideSettings = project.guideSettings ?? createDefaultGuideSettings(project.preset);
  const guideProfile = getPlatformGuideProfile(project.preset, guideSettings.profileId);
  const guideSnapLines = getGuideSnapLines(project.preset, guideSettings);
  const isCarousel = isCarouselProject(project.preset, project.carouselConfig?.enabled);
  const carouselGeometry = getCarouselGeometry(project.preset, project.carouselConfig?.slideCount ?? project.preset.defaultSlideCount, project.carouselConfig?.enabled);
  const activeSlideIndex = Math.min(carouselGeometry.slideCount - 1, Math.max(0, project.currentSlide ?? project.carouselConfig?.currentSlideIndex ?? 0));
  const showGuideOverlay = previewMode === 'guides' || showSafeZones;
  const viewport = useImageStageViewport({ containerRef, project, zoom, previewMode, isCarousel, carouselGeometry, onSetZoom, activeSlideIndex });
  const interactions = useImageStageInteractions({
    project, zoom, canvasRef, selectedLayerIds, editingLayerId, effectiveHandMode: viewport.effectiveHandMode,
    isPanning: viewport.isPanning, setIsPanning: viewport.setIsPanning,
    setPanOffset: viewport.setPanOffset, panStartRef: viewport.panStartRef, startPan: viewport.startPan,
    guideSettings, guideSnapLines, isCarousel, carouselGeometry, onSelectLayer, onExitEditing, onRequestEdit,
    onSelectMultipleLayers, onDeselectAll, onSetCurrentSlide, onUpdatePosition, onUpdateScale, onUpdateWidth,
    onUpdateHeight, onUpdateRotation, onCommitPositionChange,
  });
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (rapidDrawPointerRef.current !== event.pointerId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const point = clientToCanvasPoint(event.clientX, event.clientY, rect, project.preset.width, project.preset.height);
      const nextPoint = {
        x: Math.max(0, Math.min(1, point.x / project.preset.width)),
        y: Math.max(0, Math.min(1, point.y / project.preset.height)),
      };
      const previous = rapidDrawPointsRef.current[rapidDrawPointsRef.current.length - 1];
      if (previous && Math.hypot(nextPoint.x - previous.x, nextPoint.y - previous.y) < 0.006) return;
      const next = [...rapidDrawPointsRef.current, nextPoint];
      rapidDrawPointsRef.current = next;
      setRapidDrawPoints(next);
    };
    const handlePointerEnd = (event: PointerEvent) => {
      if (rapidDrawPointerRef.current !== event.pointerId) return;
      const points = rapidDrawPointsRef.current;
      if (points.length >= 2 && rapidDrawMode) onCreateVectorLayer?.(points, rapidDrawMode);
      rapidDrawPointerRef.current = null;
      rapidDrawPointsRef.current = [];
      setRapidDrawPoints([]);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, [canvasRef, onCreateVectorLayer, project.preset.height, project.preset.width, rapidDrawMode]);

  const handleCanvasPointerDown = (event: React.PointerEvent) => {
    canvasMouseDownPosRef.current = { x: event.clientX, y: event.clientY };
    if (rapidDrawMode && event.button === 0 && event.target === event.currentTarget) {
      event.preventDefault();
      event.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const point = clientToCanvasPoint(event.clientX, event.clientY, rect, project.preset.width, project.preset.height);
        const initialPoint = {
          x: Math.max(0, Math.min(1, point.x / project.preset.width)),
          y: Math.max(0, Math.min(1, point.y / project.preset.height)),
        };
        rapidDrawPointerRef.current = event.pointerId;
        rapidDrawPointsRef.current = [initialPoint];
        setRapidDrawPoints([initialPoint]);
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture is unavailable in some embedded contexts.
        }
      }
      return;
    }
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
      role="region"
      aria-label="Lienzo de diseño"
      tabIndex={0}
      className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-transparent p-3 sm:p-5 lg:p-8 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
        viewport.effectiveHandMode ? (viewport.isPanning ? 'cursor-grabbing' : 'cursor-grab') : interactions.draggingLayerId ? 'cursor-grabbing' : interactions.pendingLayerId ? 'cursor-move' : 'cursor-default'
      }`}
    >
      <ImageStageContextMenu contextMenu={interactions.contextMenu} selectedLayerIds={selectedLayerIds} onClose={() => interactions.setContextMenu(null)} {...actions} />
      <div className="relative transition-transform duration-75 ease-out cursor-default" style={{ transform: `translate3d(${viewport.panOffset.x}px, ${viewport.panOffset.y}px, 0) scale(${zoom})`, transformOrigin: 'center center' }}>
        <ImageStageMultiSelection selectedLayerIds={selectedLayerIds} onGroupSelectedLayers={onGroupSelectedLayers} />
        <div onClick={(event) => { event.stopPropagation(); onSelectCanvas(); }} style={{ transform: `scale(${1 / Math.max(zoom, 0.25)}) translateY(-100%)`, transformOrigin: 'bottom left' }} className={`absolute -top-3 left-0 z-30 flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer select-none shadow-lg ${isCanvasSelected ? 'bg-primary text-white font-bold ring-2 ring-brand-cyan/60 border border-brand-cyan/40 shadow-xl' : 'bg-slate-900/95 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold border border-slate-700/80 backdrop-blur-md'}`} title="Hacer clic para seleccionar y configurar el formato del lienzo">
          <span className="flex items-center gap-2"><span className="text-sm">{project.preset.aspectRatio === '9:16' ? '📱' : project.preset.aspectRatio === '4:5' ? '📸' : project.preset.aspectRatio === '1:1' ? '🟦' : '🖥️'}</span><span className="text-xs font-bold text-slate-100">{project.preset.name}</span><span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${isCanvasSelected ? 'bg-brand-cyan/25 text-brand-cyan font-black' : 'bg-slate-800 text-slate-400 font-bold'}`}>{project.preset.width} × {project.preset.height} px ({project.preset.aspectRatio})</span></span>
        </div>
        <div ref={canvasRef} role="region" aria-label={`${project.title} — lienzo`} tabIndex={0} onPointerDown={handleCanvasPointerDown} onClick={(event) => { if (interactions.consumeCanvasClick()) return; const distance = Math.hypot(event.clientX - canvasMouseDownPosRef.current.x, event.clientY - canvasMouseDownPosRef.current.y); if (distance > 5) return; event.stopPropagation(); onSelectCanvas(); }} className={`artboard-bg relative overflow-visible transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${isCanvasSelected ? 'ring-2 ring-primary ring-offset-4 ring-offset-primary-dark' : 'shadow-2xl'}`} style={{ width: `${project.preset.width}px`, height: `${project.preset.height}px`, background: project.background.gradient ?? project.background.color ?? 'var(--color-secondary)' }}>
          {interactions.marqueeBox && <div data-export-exclude="true" className="pointer-events-none absolute z-50 rounded-xs border-2 border-dashed border-brand-cyan bg-brand-cyan/20 shadow-[0_0_20px_rgba(148,210,189,0.35)] backdrop-blur-xs transition-none" style={{ left: `${Math.min(interactions.marqueeBox.startX, interactions.marqueeBox.currentX)}px`, top: `${Math.min(interactions.marqueeBox.startY, interactions.marqueeBox.currentY)}px`, width: `${Math.abs(interactions.marqueeBox.currentX - interactions.marqueeBox.startX)}px`, height: `${Math.abs(interactions.marqueeBox.currentY - interactions.marqueeBox.startY)}px` }} />}
          {rapidDrawPoints.length >= 2 && (
           <svg data-export-exclude="true" className="pointer-events-none absolute inset-0 z-[45] h-full w-full text-brand-cyan" viewBox="0 0 1 1" preserveAspectRatio="none">
             <polyline
               points={rapidDrawPoints.map((point) => `${point.x},${point.y}`).join(' ')}
               fill="none"
               stroke="currentColor"
               strokeWidth="0.006"
               strokeLinecap="round"
               strokeLinejoin="round"
             />
           </svg>
          )}
          <ImageStageGuides project={project} previewMode={previewMode} zoom={zoom} showGuideOverlay={showGuideOverlay} isCarousel={isCarousel} activeSlideIndex={activeSlideIndex} carouselGeometry={carouselGeometry} guideSettings={guideSettings} guideProfile={guideProfile} />
          {interactions.guides.map((guide, index) => <div data-export-exclude="true" key={index} className="pointer-events-none absolute z-40" style={{ backgroundColor: guide.color, left: guide.orientation === 'vertical' ? `${guide.points[0]}px` : 0, top: guide.orientation === 'horizontal' ? `${guide.points[1]}px` : 0, width: guide.orientation === 'horizontal' ? '100%' : '1.5px', height: guide.orientation === 'vertical' ? '100%' : '1.5px', boxShadow: `0 0 8px ${guide.color}` }} />)}
          <ImageStageLayers project={project} selectedLayerId={selectedLayerId} selectedLayerIds={selectedLayerIds} onSelectLayer={onSelectLayer} effectiveHandMode={viewport.effectiveHandMode} isPanning={viewport.isPanning} draggingLayerId={interactions.draggingLayerId} onUpdateLayerProps={onUpdateLayerProps} cropEditingLayerId={cropEditingLayerId} cropDraft={cropDraft} onCropChange={onCropChange} {...interactions.handlers} />
        </div>
      </div>
      <ImageStageToolbar zoom={zoom} onSetZoom={onSetZoom} setToolMode={viewport.setToolMode} rapidDrawMode={rapidDrawMode} onSetRapidDrawMode={setRapidDrawMode} effectiveHandMode={viewport.effectiveHandMode} handleResetFit={viewport.handleResetFit} isCarousel={isCarousel} activeSlideIndex={activeSlideIndex} carouselGeometry={carouselGeometry} onSetCurrentSlide={onSetCurrentSlide} />
    </div>
  );
};
