import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImageLayer, ImageProject, CarouselGeometry } from '../types/imageStudio';
import { calculateSnapping } from './useKonvaSnapping';
import type { ImageStageContextMenuState, ImageStageInteractionHandlers, ResizeCorner } from '../components/image-editor/ImageStage.types';
import type { CanvasGuideSettings } from '../types/imageStudio';

interface UseImageStageInteractionsOptions {
  project: ImageProject;
  zoom: number;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  selectedLayerIds: string[];
  editingLayerId?: string | null;
  effectiveHandMode: boolean;
  isPanning: boolean;
  setIsPanning: (value: boolean) => void;
  setPanOffset: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  panStartRef: React.MutableRefObject<{ x: number; y: number; panX: number; panY: number }>;
  startPan: (event: React.PointerEvent) => void;
  guideSettings: CanvasGuideSettings;
  guideSnapLines: { vertical: number[]; horizontal: number[] };
  isCarousel: boolean;
  carouselGeometry: CarouselGeometry;
  onSelectLayer: (id: string, isShift?: boolean) => void;
  onExitEditing?: () => void;
  onRequestEdit?: (id: string) => void;
  onSelectMultipleLayers?: (ids: string[]) => void;
  onDeselectAll: () => void;
  onSetCurrentSlide?: (slide: number) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateScale: (id: string, scale: number) => void;
  onUpdateWidth?: (id: string, width?: number) => void;
  onUpdateHeight?: (id: string, height?: number) => void;
  onUpdateRotation?: (id: string, rotation: number) => void;
  onCommitPositionChange?: () => void;
}

const DRAG_THRESHOLD_PX = 5;

export const useImageStageInteractions = (options: UseImageStageInteractionsOptions) => {
  const {
    project, zoom, canvasRef, selectedLayerIds, editingLayerId, effectiveHandMode, isPanning,
    setIsPanning, setPanOffset, panStartRef, startPan, guideSettings, guideSnapLines,
    isCarousel, carouselGeometry, onSelectLayer, onExitEditing, onRequestEdit, onSelectMultipleLayers,
    onDeselectAll, onSetCurrentSlide, onUpdatePosition, onUpdateScale, onUpdateWidth, onUpdateHeight,
    onUpdateRotation, onCommitPositionChange,
  } = options;
  const [pendingLayerId, setPendingLayerId] = useState<string | null>(null);
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [resizingLayerId, setResizingLayerId] = useState<string | null>(null);
  const [rotatingLayerId, setRotatingLayerId] = useState<string | null>(null);
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
  const [marqueeBox, setMarqueeBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const [guides, setGuides] = useState<Array<{ points: [number, number, number, number]; color: string; orientation: 'vertical' | 'horizontal' }>>([]);
  const [contextMenu, setContextMenu] = useState<ImageStageContextMenuState | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; layers: Array<{ id: string; startX: number; startY: number }> }>({ x: 0, y: 0, layers: [] });
  const dragMovedRef = useRef(false);
  const pointerTargetRef = useRef<{ layerId: string; isText: boolean } | null>(null);
  const pointerCaptureRef = useRef<{ element: HTMLElement; pointerId: number } | null>(null);
  const resizeStartRef = useRef<{ startX: number; startY: number; startScale: number; startWidth: number; startHeight: number; corner: ResizeCorner }>({ startX: 0, startY: 0, startScale: 1, startWidth: 380, startHeight: 200, corner: 'se' });
  const rotateStartRef = useRef<{ centerX: number; centerY: number; startAngle: number; initialRotation: number }>({ centerX: 0, centerY: 0, startAngle: 0, initialRotation: 0 });

  useEffect(() => {
    const handlePointerDownOutside = (event: PointerEvent) => {
      if (!(event.target as HTMLElement).closest('[data-image-context-menu="true"]')) setContextMenu(null);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setContextMenu(null);
    };
    window.addEventListener('pointerdown', handlePointerDownOutside, true);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDownOutside, true);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleContainerPointerDown = useCallback((event: React.PointerEvent) => {
    if (effectiveHandMode || event.button === 1) {
      startPan(event);
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('.canvas-layer-item') || target.closest('.interactive-handle') || target.closest('.artboard-bg')) return;
    if (!event.shiftKey && !event.metaKey && !event.ctrlKey) onDeselectAll();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = (event.clientX - rect.left) / zoom;
    const startY = (event.clientY - rect.top) / zoom;
    if (isCarousel) onSetCurrentSlide?.(Math.min(carouselGeometry.slideCount - 1, Math.max(0, Math.floor(startX / carouselGeometry.slideWidth))));
    setIsMarqueeSelecting(true);
    setMarqueeBox({ startX, startY, currentX: startX, currentY: startY });
  }, [canvasRef, carouselGeometry, effectiveHandMode, isCarousel, onDeselectAll, onSetCurrentSlide, startPan, zoom]);

  const handleCanvasPointerDown = useCallback((event: React.PointerEvent) => {
    if (effectiveHandMode || event.button === 1) {
      startPan(event);
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('.canvas-layer-item') || target.closest('.interactive-handle')) return;
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = (event.clientX - rect.left) / zoom;
    const startY = (event.clientY - rect.top) / zoom;
    setMarqueeBox({ startX, startY, currentX: startX, currentY: startY });
    setIsMarqueeSelecting(true);
  }, [canvasRef, effectiveHandMode, startPan, zoom]);

  const handlePointerDown = useCallback((event: React.PointerEvent, layer: ImageLayer) => {
    if (effectiveHandMode || event.button === 1) {
      event.preventDefault();
      pointerTargetRef.current = null;
      startPan(event);
      return;
    }
    if (event.button !== 0) return;
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const isTextLayer = layer.type === 'text' || layer.blockType === 'CustomText' || Boolean(target.closest('[data-inline-edit-trigger]'));
    if (editingLayerId === layer.id && isTextLayer) return;
    if (editingLayerId && editingLayerId !== layer.id) onExitEditing?.();
    const isShift = event.shiftKey || event.metaKey || event.ctrlKey;
    const isAlreadySelected = selectedLayerIds.includes(layer.id);
    let currentSelectedIds = selectedLayerIds;
    if (isShift) {
      onSelectLayer(layer.id, true);
      currentSelectedIds = isAlreadySelected ? selectedLayerIds.filter((id) => id !== layer.id) : [...selectedLayerIds, layer.id];
    } else if (!isAlreadySelected) {
      onSelectLayer(layer.id, false);
      currentSelectedIds = [layer.id];
    }
    if (layer.locked) return;
    pointerTargetRef.current = { layerId: layer.id, isText: isTextLayer };
    dragMovedRef.current = false;
    const layerElement = event.currentTarget as HTMLElement;
    try {
      layerElement.setPointerCapture(event.pointerId);
      pointerCaptureRef.current = { element: layerElement, pointerId: event.pointerId };
    } catch {
      // Pointer capture is unavailable in some embedded browser contexts.
    }
    setPendingLayerId(layer.id);
    const layersToDrag = project.layers.filter((item) => currentSelectedIds.includes(item.id) && !item.locked);
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      layers: layersToDrag.length > 0 ? layersToDrag.map((item) => ({ id: item.id, startX: item.position.x, startY: item.position.y })) : [{ id: layer.id, startX: layer.position.x, startY: layer.position.y }],
    };
  }, [editingLayerId, effectiveHandMode, onExitEditing, onSelectLayer, project.layers, selectedLayerIds, startPan]);

  const handleContextMenu = useCallback((event: React.MouseEvent, layer: ImageLayer) => {
    event.preventDefault();
    event.stopPropagation();
    if (!selectedLayerIds.includes(layer.id)) onSelectLayer(layer.id, false);
    setContextMenu({ x: Math.min(window.innerWidth - 270, event.clientX), y: Math.min(window.innerHeight - 440, event.clientY), layer });
  }, [onSelectLayer, selectedLayerIds]);

  const handleResizeStart = useCallback((event: React.PointerEvent, layer: ImageLayer, corner: ResizeCorner = 'se') => {
    event.stopPropagation();
    event.preventDefault();
    onSelectLayer(layer.id);
    setResizingLayerId(layer.id);
    dragMovedRef.current = true;
    const layerEl = (event.currentTarget as HTMLElement).closest('.canvas-layer-item') as HTMLElement | null;
    const currentScale = layer.scale ?? 1;
    resizeStartRef.current = { startX: event.clientX, startY: event.clientY, startScale: currentScale, startWidth: layer.width ?? (layerEl ? Math.round(layerEl.offsetWidth / currentScale) : 380), startHeight: layer.height ?? (layerEl ? Math.round(layerEl.offsetHeight / currentScale) : 200), corner };
  }, [onSelectLayer]);

  const handleRotateStart = useCallback((event: React.PointerEvent, layer: ImageLayer) => {
    event.stopPropagation();
    event.preventDefault();
    onSelectLayer(layer.id);
    setRotatingLayerId(layer.id);
    dragMovedRef.current = true;
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + (layer.position.x / 100) * rect.width;
    const centerY = rect.top + (layer.position.y / 100) * rect.height;
    rotateStartRef.current = { centerX, centerY, startAngle: Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI), initialRotation: layer.rotation ?? 0 };
  }, [canvasRef, onSelectLayer]);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (isPanning) {
        setPanOffset({ x: panStartRef.current.panX + event.clientX - panStartRef.current.x, y: panStartRef.current.panY + event.clientY - panStartRef.current.y });
        return;
      }
      if (isMarqueeSelecting && canvasRef.current && marqueeBox) {
        const rect = canvasRef.current.getBoundingClientRect();
        const currentX = (event.clientX - rect.left) / zoom;
        const currentY = (event.clientY - rect.top) / zoom;
        setMarqueeBox((previous) => previous ? { ...previous, currentX, currentY } : null);
        const minX = Math.min(marqueeBox.startX, currentX), maxX = Math.max(marqueeBox.startX, currentX);
        const minY = Math.min(marqueeBox.startY, currentY), maxY = Math.max(marqueeBox.startY, currentY);
        const intersectedIds = project.layers.filter((layer) => layer.visible !== false).filter((layer) => {
          const centerX = (layer.position.x / 100) * project.preset.width, centerY = (layer.position.y / 100) * project.preset.height;
          const width = layer.width ?? 380, height = layer.height ?? 200;
          return !(centerX - width / 2 > maxX || centerX + width / 2 < minX || centerY - height / 2 > maxY || centerY + height / 2 < minY);
        }).map((layer) => layer.id);
        onSelectMultipleLayers?.(intersectedIds);
        return;
      }
      if (rotatingLayerId) {
        const { centerX, centerY, startAngle, initialRotation } = rotateStartRef.current;
        let nextRotation = (initialRotation + (Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI) - startAngle)) % 360;
        if (nextRotation < 0) nextRotation += 360;
        onUpdateRotation?.(rotatingLayerId, Math.round(nextRotation));
        return;
      }
      if (resizingLayerId) {
        const { startX, startY, startScale, startWidth, startHeight, corner } = resizeStartRef.current;
        if (corner === 'e' || corner === 'w') {
          const deltaX = corner === 'w' ? -(event.clientX - startX) / (zoom * startScale) : (event.clientX - startX) / (zoom * startScale);
          onUpdateWidth?.(resizingLayerId, Math.round(Math.max(40, Math.min(2400, startWidth + deltaX * 2))));
          return;
        }
        if (corner === 'n' || corner === 's') {
          const deltaY = corner === 'n' ? -(event.clientY - startY) / (zoom * startScale) : (event.clientY - startY) / (zoom * startScale);
          onUpdateHeight?.(resizingLayerId, Math.round(Math.max(20, Math.min(2400, startHeight + deltaY * 2))));
          return;
        }
        let deltaX = event.clientX - startX, deltaY = event.clientY - startY;
        if (corner === 'nw') { deltaX = -deltaX; deltaY = -deltaY; } else if (corner === 'ne') deltaY = -deltaY; else if (corner === 'sw') deltaX = -deltaX;
        onUpdateScale?.(resizingLayerId, parseFloat(Math.max(0.2, Math.min(3.5, startScale + ((deltaX + deltaY) / 2) * 0.005)).toFixed(2)));
        return;
      }
      const activeDragLayerId = draggingLayerId ?? pendingLayerId;
      if (!activeDragLayerId || !canvasRef.current) return;
      const dragDistance = Math.hypot(event.clientX - dragStartRef.current.x, event.clientY - dragStartRef.current.y);
      if (!dragMovedRef.current && dragDistance <= DRAG_THRESHOLD_PX) return;
      dragMovedRef.current = true;
      event.preventDefault();
      if (!draggingLayerId) setDraggingLayerId(activeDragLayerId);
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = ((event.clientX - dragStartRef.current.x) / rect.width) * 100, deltaY = ((event.clientY - dragStartRef.current.y) / rect.height) * 100;
      if (dragStartRef.current.layers.length <= 1) {
        const primary = dragStartRef.current.layers[0] ?? { id: activeDragLayerId, startX: 50, startY: 50 };
        let nextX = primary.startX + deltaX, nextY = primary.startY + deltaY;
        const activeLayer = project.layers.find((layer) => layer.id === primary.id);
        if (activeLayer && nextX >= -10 && nextX <= 110 && nextY >= -10 && nextY <= 110) {
          const snap = calculateSnapping(primary.id, (nextX / 100) * project.preset.width, (nextY / 100) * project.preset.height, (activeLayer.width ?? 380) * (activeLayer.scale ?? 1), (activeLayer.height ?? 200) * (activeLayer.scale ?? 1), project.preset.width, project.preset.height, project.layers, guideSettings.snapToGuides ? { enabled: true, verticalGuides: guideSnapLines.vertical, horizontalGuides: guideSnapLines.horizontal } : undefined);
          nextX = (snap.x / project.preset.width) * 100; nextY = (snap.y / project.preset.height) * 100; setGuides(snap.guides);
        } else setGuides([]);
        onUpdatePosition(primary.id, { x: Math.round(nextX * 10) / 10, y: Math.round(nextY * 10) / 10 });
      } else {
        setGuides([]);
        dragStartRef.current.layers.forEach((item) => onUpdatePosition(item.id, { x: Math.round((item.startX + deltaX) * 10) / 10, y: Math.round((item.startY + deltaY) * 10) / 10 }));
      }
    };
    const handlePointerEnd = (cancelled = false) => {
      const completedLayerId = draggingLayerId ?? pendingLayerId;
      const completedLayer = completedLayerId ? project.layers.find((layer) => layer.id === completedLayerId) : undefined;
      const didMove = dragMovedRef.current;
      if (didMove && (completedLayerId || resizingLayerId || rotatingLayerId)) onCommitPositionChange?.();
      if (!cancelled && !didMove && completedLayer && pointerTargetRef.current?.layerId === completedLayer.id && pointerTargetRef.current.isText && !completedLayer.locked && editingLayerId !== completedLayer.id) onRequestEdit?.(completedLayer.id);
      const capture = pointerCaptureRef.current;
      if (capture) {
        try { if (capture.element.hasPointerCapture(capture.pointerId)) capture.element.releasePointerCapture(capture.pointerId); } catch { /* already released */ }
        pointerCaptureRef.current = null;
      }
      pointerTargetRef.current = null;
      setIsPanning(false); setPendingLayerId(null); setDraggingLayerId(null); setResizingLayerId(null); setRotatingLayerId(null); setIsMarqueeSelecting(false); setMarqueeBox(null); setGuides([]); dragMovedRef.current = false;
    };
    const handlePointerUp = () => handlePointerEnd();
    const handlePointerCancel = () => handlePointerEnd(true);
    if (isPanning || pendingLayerId || draggingLayerId || resizingLayerId || rotatingLayerId || isMarqueeSelecting) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerCancel);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [canvasRef, draggingLayerId, editingLayerId, guideSettings.snapToGuides, guideSnapLines.horizontal, guideSnapLines.vertical, isMarqueeSelecting, isPanning, marqueeBox, onCommitPositionChange, onRequestEdit, onSelectMultipleLayers, onUpdateHeight, onUpdatePosition, onUpdateRotation, onUpdateScale, onUpdateWidth, panStartRef, pendingLayerId, project, resizingLayerId, rotatingLayerId, setIsPanning, setPanOffset, zoom]);

  return {
    contextMenu,
    setContextMenu,
    marqueeBox,
    guides,
    pendingLayerId,
    draggingLayerId,
    handleContainerPointerDown,
    handleCanvasPointerDown,
    handlers: { handlePointerDown, handleContextMenu, handleResizeStart, handleRotateStart } satisfies ImageStageInteractionHandlers,
  };
};
