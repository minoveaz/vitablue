import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImageLayer, ImageProject, CarouselGeometry, CanvasGuideSettings } from '../types/imageStudio';
import { calculateSnapping } from './useKonvaSnapping';
import type { ImageStageContextMenuState, ImageStageInteractionHandlers, ResizeCorner } from '../components/image-editor/ImageStage.types';
import {
  clientToCanvasPoint,
  getLayersInMarquee,
  type CanvasPoint,
  type MarqueeRectangle,
} from '../utils/imageStageGeometry';

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
type ActiveInteraction = 'idle' | 'pan' | 'marquee' | 'layer';

export const useImageStageInteractions = (options: UseImageStageInteractionsOptions) => {
  const {
    project, canvasRef, selectedLayerIds, editingLayerId, effectiveHandMode,
    startPan, onSelectLayer, onExitEditing,
  } = options;
  const [pendingLayerId, setPendingLayerId] = useState<string | null>(null);
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [resizingLayerId, setResizingLayerId] = useState<string | null>(null);
  const [rotatingLayerId, setRotatingLayerId] = useState<string | null>(null);
  const [marqueeBox, setMarqueeBox] = useState<MarqueeRectangle | null>(null);
  const [guides, setGuides] = useState<Array<{ points: [number, number, number, number]; color: string; orientation: 'vertical' | 'horizontal' }>>([]);
  const [contextMenu, setContextMenu] = useState<ImageStageContextMenuState | null>(null);

  // The event listeners below are deliberately mounted once. React state is
  // asynchronous, so installing listeners in an effect keyed to interaction
  // state loses the first move/up event after a pointerdown.
  const latestOptionsRef = useRef(options);
  const activeInteractionRef = useRef<ActiveInteraction>('idle');
  const activePointerIdRef = useRef<number | null>(null);
  const marqueeRef = useRef<MarqueeRectangle | null>(null);
  const marqueeInitialSelectionRef = useRef<string[]>([]);
  const marqueeAdditiveRef = useRef(false);
  const marqueePendingPointRef = useRef<CanvasPoint | null>(null);
  const marqueeRafRef = useRef<number | null>(null);
  const marqueeMovedRef = useRef(false);
  const pendingLayerIdRef = useRef<string | null>(pendingLayerId);
  const draggingLayerIdRef = useRef<string | null>(draggingLayerId);
  const resizingLayerIdRef = useRef<string | null>(resizingLayerId);
  const rotatingLayerIdRef = useRef<string | null>(rotatingLayerId);
  const selectedLayerIdsRef = useRef(selectedLayerIds);
  const dragStartRef = useRef<{ x: number; y: number; layers: Array<{ id: string; startX: number; startY: number }> }>({ x: 0, y: 0, layers: [] });
  const dragMovedRef = useRef(false);
  const pointerTargetRef = useRef<{ layerId: string; isText: boolean } | null>(null);
  const pointerCaptureRef = useRef<{ element: HTMLElement; pointerId: number } | null>(null);
  const resizeStartRef = useRef<{ startX: number; startY: number; startScale: number; startWidth: number; startHeight: number; corner: ResizeCorner }>({ startX: 0, startY: 0, startScale: 1, startWidth: 380, startHeight: 200, corner: 'se' });
  const rotateStartRef = useRef<{ centerX: number; centerY: number; startAngle: number; initialRotation: number }>({ centerX: 0, centerY: 0, startAngle: 0, initialRotation: 0 });
  const suppressCanvasClickRef = useRef(false);

  useEffect(() => {
    latestOptionsRef.current = options;
  }, [options]);
  useEffect(() => {
    pendingLayerIdRef.current = pendingLayerId;
    draggingLayerIdRef.current = draggingLayerId;
    resizingLayerIdRef.current = resizingLayerId;
    rotatingLayerIdRef.current = rotatingLayerId;
  }, [draggingLayerId, pendingLayerId, resizingLayerId, rotatingLayerId]);
  useEffect(() => {
    selectedLayerIdsRef.current = selectedLayerIds;
  }, [selectedLayerIds]);

  const capturePointer = useCallback((event: React.PointerEvent) => {
    const element = event.currentTarget as HTMLElement;
    try {
      element.setPointerCapture(event.pointerId);
      pointerCaptureRef.current = { element, pointerId: event.pointerId };
    } catch {
      // Pointer capture is unavailable in some embedded browser contexts.
    }
    activePointerIdRef.current = event.pointerId;
  }, []);

  const beginMarquee = useCallback((event: React.PointerEvent) => {
    const currentOptions = latestOptionsRef.current;
    if (event.button !== 0 || !currentOptions.canvasRef.current) return;
    const canvas = currentOptions.canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = clientToCanvasPoint(event.clientX, event.clientY, rect, currentOptions.project.preset.width, currentOptions.project.preset.height, currentOptions.zoom);
    const additive = event.shiftKey || event.metaKey || event.ctrlKey;
    marqueeRef.current = { startX: point.x, startY: point.y, currentX: point.x, currentY: point.y };
    marqueeInitialSelectionRef.current = [...selectedLayerIdsRef.current];
    marqueeAdditiveRef.current = additive;
    marqueeMovedRef.current = false;
    marqueePendingPointRef.current = point;
    suppressCanvasClickRef.current = false;
    activeInteractionRef.current = 'marquee';
    capturePointer(event);
    setMarqueeBox(marqueeRef.current);
    if (currentOptions.isCarousel) {
      currentOptions.onSetCurrentSlide?.(
        Math.min(currentOptions.carouselGeometry.slideCount - 1, Math.max(0, Math.floor(point.x / currentOptions.carouselGeometry.slideWidth))),
      );
    }
    // An unmodified empty click clears immediately; an additive marquee keeps
    // the existing selection and adds to it when the rectangle has moved.
    if (!additive) currentOptions.onDeselectAll();
  }, [capturePointer]);

  const handleContainerPointerDown = useCallback((event: React.PointerEvent) => {
    if (effectiveHandMode || event.button === 1) {
      event.preventDefault();
      suppressCanvasClickRef.current = false;
      capturePointer(event);
      activeInteractionRef.current = 'pan';
      startPan(event);
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('.canvas-layer-item') || target.closest('.interactive-handle') || target.closest('.artboard-bg')) return;
    beginMarquee(event);
  }, [beginMarquee, capturePointer, effectiveHandMode, startPan]);

  const handleCanvasPointerDown = useCallback((event: React.PointerEvent) => {
    if (effectiveHandMode || event.button === 1) {
      event.preventDefault();
      suppressCanvasClickRef.current = false;
      capturePointer(event);
      activeInteractionRef.current = 'pan';
      startPan(event);
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('.canvas-layer-item') || target.closest('.interactive-handle')) return;
    beginMarquee(event);
  }, [beginMarquee, capturePointer, effectiveHandMode, startPan]);

  const handlePointerDown = useCallback((event: React.PointerEvent, layer: ImageLayer) => {
    if (effectiveHandMode || event.button === 1) {
      event.preventDefault();
      pointerTargetRef.current = null;
      suppressCanvasClickRef.current = false;
      capturePointer(event);
      activeInteractionRef.current = 'pan';
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
    const isAlreadySelected = selectedLayerIdsRef.current.includes(layer.id);
    let currentSelectedIds = selectedLayerIdsRef.current;
    if (isShift) {
      onSelectLayer(layer.id, true);
      currentSelectedIds = isAlreadySelected ? currentSelectedIds.filter((id) => id !== layer.id) : [...currentSelectedIds, layer.id];
    } else if (!isAlreadySelected) {
      onSelectLayer(layer.id, false);
      currentSelectedIds = [layer.id];
    }
    if (layer.locked) return;

    pointerTargetRef.current = { layerId: layer.id, isText: isTextLayer && !isShift };
    dragMovedRef.current = false;
    suppressCanvasClickRef.current = false;
    capturePointer(event);
    activeInteractionRef.current = 'layer';
    pendingLayerIdRef.current = layer.id;
    setPendingLayerId(layer.id);
    const layersToDrag = latestOptionsRef.current.project.layers.filter((item) => currentSelectedIds.includes(item.id) && !item.locked);
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      layers: layersToDrag.length > 0
        ? layersToDrag.map((item) => ({ id: item.id, startX: item.position.x, startY: item.position.y }))
        : [{ id: layer.id, startX: layer.position.x, startY: layer.position.y }],
    };
  }, [capturePointer, editingLayerId, effectiveHandMode, onExitEditing, onSelectLayer, startPan]);

  const handleContextMenu = useCallback((event: React.MouseEvent, layer: ImageLayer) => {
    event.preventDefault();
    event.stopPropagation();
    const targetLayerIds = selectedLayerIdsRef.current.includes(layer.id)
      ? [...selectedLayerIdsRef.current]
      : [layer.id];
    if (!selectedLayerIdsRef.current.includes(layer.id)) onSelectLayer(layer.id, false);
    setContextMenu({
      x: Math.max(8, Math.min(window.innerWidth - 296 - 8, event.clientX)),
      y: Math.max(8, Math.min(window.innerHeight - 8, event.clientY)),
      layer,
      targetLayerIds,
    });
  }, [onSelectLayer]);

  const handleResizeStart = useCallback((event: React.PointerEvent, layer: ImageLayer, corner: ResizeCorner = 'se') => {
    event.stopPropagation();
    event.preventDefault();
    onSelectLayer(layer.id);
    setResizingLayerId(layer.id);
    resizingLayerIdRef.current = layer.id;
    activeInteractionRef.current = 'layer';
    capturePointer(event);
    dragMovedRef.current = true;
    const layerEl = (event.currentTarget as HTMLElement).closest('.canvas-layer-item') as HTMLElement | null;
    const currentScale = layer.scale ?? 1;
    resizeStartRef.current = { startX: event.clientX, startY: event.clientY, startScale: currentScale, startWidth: layer.width ?? (layerEl ? Math.round(layerEl.offsetWidth / currentScale) : 380), startHeight: layer.height ?? (layerEl ? Math.round(layerEl.offsetHeight / currentScale) : 200), corner };
  }, [capturePointer, onSelectLayer]);

  const handleRotateStart = useCallback((event: React.PointerEvent, layer: ImageLayer) => {
    event.stopPropagation();
    event.preventDefault();
    onSelectLayer(layer.id);
    setRotatingLayerId(layer.id);
    rotatingLayerIdRef.current = layer.id;
    activeInteractionRef.current = 'layer';
    capturePointer(event);
    dragMovedRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / project.preset.width || 1;
    const scaleY = rect.height / project.preset.height || 1;
    const centerX = rect.left + ((layer.position.x / 100) * project.preset.width) * scaleX;
    const centerY = rect.top + ((layer.position.y / 100) * project.preset.height) * scaleY;
    rotateStartRef.current = { centerX, centerY, startAngle: Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI), initialRotation: layer.rotation ?? 0 };
  }, [capturePointer, canvasRef, onSelectLayer, project.preset.height, project.preset.width]);

  useEffect(() => {
    const applyMarqueePoint = (point: CanvasPoint) => {
      const currentOptions = latestOptionsRef.current;
      const currentMarquee = marqueeRef.current;
      if (!currentMarquee) return;
      const nextMarquee = { ...currentMarquee, currentX: point.x, currentY: point.y };
      marqueeRef.current = nextMarquee;
      setMarqueeBox(nextMarquee);
      if (Math.hypot(point.x - nextMarquee.startX, point.y - nextMarquee.startY) <= DRAG_THRESHOLD_PX) return;
      marqueeMovedRef.current = true;
      const ids = getLayersInMarquee(
        currentOptions.project.layers,
        nextMarquee,
        currentOptions.project.preset.width,
        currentOptions.project.preset.height,
        marqueeInitialSelectionRef.current,
        marqueeAdditiveRef.current,
      );
      currentOptions.onSelectMultipleLayers?.(ids);
    };

    const queueMarqueePoint = (point: CanvasPoint) => {
      marqueePendingPointRef.current = point;
      if (marqueeRafRef.current !== null) return;
      const flush = () => {
        marqueeRafRef.current = null;
        const pendingPoint = marqueePendingPointRef.current;
        marqueePendingPointRef.current = null;
        if (pendingPoint) applyMarqueePoint(pendingPoint);
      };
      if (typeof window.requestAnimationFrame === 'function') {
        marqueeRafRef.current = window.requestAnimationFrame(flush);
      } else {
        marqueeRafRef.current = window.setTimeout(flush, 0);
      }
    };

    const flushMarquee = () => {
      if (marqueeRafRef.current !== null) {
        if (typeof window.cancelAnimationFrame === 'function') window.cancelAnimationFrame(marqueeRafRef.current);
        else window.clearTimeout(marqueeRafRef.current);
        marqueeRafRef.current = null;
      }
      const pendingPoint = marqueePendingPointRef.current;
      marqueePendingPointRef.current = null;
      if (pendingPoint) applyMarqueePoint(pendingPoint);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) return;
      const currentOptions = latestOptionsRef.current;
      const interaction = activeInteractionRef.current;
      if (interaction === 'pan') {
        currentOptions.setPanOffset({ x: currentOptions.panStartRef.current.panX + event.clientX - currentOptions.panStartRef.current.x, y: currentOptions.panStartRef.current.panY + event.clientY - currentOptions.panStartRef.current.y });
        suppressCanvasClickRef.current = true;
        return;
      }
      if (interaction === 'marquee' && currentOptions.canvasRef.current && marqueeRef.current) {
        const canvas = currentOptions.canvasRef.current;
        const point = clientToCanvasPoint(event.clientX, event.clientY, canvas.getBoundingClientRect(), currentOptions.project.preset.width, currentOptions.project.preset.height, currentOptions.zoom);
        queueMarqueePoint(point);
        suppressCanvasClickRef.current = true;
        return;
      }
      if (interaction !== 'layer') return;

      const activeResizeId = resizingLayerIdRef.current;
      if (activeResizeId) {
        const { startX, startY, startScale, startWidth, startHeight, corner } = resizeStartRef.current;
        if (corner === 'e' || corner === 'w') {
          const canvasScaleX = currentOptions.canvasRef.current ? currentOptions.canvasRef.current.getBoundingClientRect().width / currentOptions.project.preset.width : currentOptions.zoom;
          const deltaX = (corner === 'w' ? -(event.clientX - startX) : event.clientX - startX) / (canvasScaleX * startScale || 1);
          currentOptions.onUpdateWidth?.(activeResizeId, Math.round(Math.max(40, Math.min(2400, startWidth + deltaX * 2))));
        } else if (corner === 'n' || corner === 's') {
          const canvasScaleY = currentOptions.canvasRef.current ? currentOptions.canvasRef.current.getBoundingClientRect().height / currentOptions.project.preset.height : currentOptions.zoom;
          const deltaY = (corner === 'n' ? -(event.clientY - startY) : event.clientY - startY) / (canvasScaleY * startScale || 1);
          currentOptions.onUpdateHeight?.(activeResizeId, Math.round(Math.max(20, Math.min(2400, startHeight + deltaY * 2))));
        } else {
          let deltaX = event.clientX - startX;
          let deltaY = event.clientY - startY;
          if (corner === 'nw') { deltaX = -deltaX; deltaY = -deltaY; } else if (corner === 'ne') deltaY = -deltaY; else if (corner === 'sw') deltaX = -deltaX;
          currentOptions.onUpdateScale?.(activeResizeId, parseFloat(Math.max(0.2, Math.min(3.5, startScale + ((deltaX + deltaY) / 2) * 0.005)).toFixed(2)));
        }
        suppressCanvasClickRef.current = true;
        return;
      }
      if (rotatingLayerIdRef.current) {
        const { centerX, centerY, startAngle, initialRotation } = rotateStartRef.current;
        let nextRotation = (initialRotation + (Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI) - startAngle)) % 360;
        if (nextRotation < 0) nextRotation += 360;
        currentOptions.onUpdateRotation?.(rotatingLayerIdRef.current, Math.round(nextRotation));
        suppressCanvasClickRef.current = true;
        return;
      }

      const activeDragLayerId = draggingLayerIdRef.current ?? pendingLayerIdRef.current;
      if (!activeDragLayerId || !currentOptions.canvasRef.current) return;
      const dragDistance = Math.hypot(event.clientX - dragStartRef.current.x, event.clientY - dragStartRef.current.y);
      if (!dragMovedRef.current && dragDistance <= DRAG_THRESHOLD_PX) return;
      dragMovedRef.current = true;
      suppressCanvasClickRef.current = true;
      event.preventDefault();
      if (!draggingLayerIdRef.current) {
        draggingLayerIdRef.current = activeDragLayerId;
        setDraggingLayerId(activeDragLayerId);
      }
      const rect = currentOptions.canvasRef.current.getBoundingClientRect();
      const deltaX = ((event.clientX - dragStartRef.current.x) / (rect.width || 1)) * 100;
      const deltaY = ((event.clientY - dragStartRef.current.y) / (rect.height || 1)) * 100;
      if (dragStartRef.current.layers.length <= 1) {
        const primary = dragStartRef.current.layers[0] ?? { id: activeDragLayerId, startX: 50, startY: 50 };
        let nextX = primary.startX + deltaX;
        let nextY = primary.startY + deltaY;
        const activeLayer = currentOptions.project.layers.find((layer) => layer.id === primary.id);
        if (activeLayer && nextX >= -10 && nextX <= 110 && nextY >= -10 && nextY <= 110) {
          const snap = calculateSnapping(primary.id, (nextX / 100) * currentOptions.project.preset.width, (nextY / 100) * currentOptions.project.preset.height, (activeLayer.width ?? 380) * (activeLayer.scale ?? 1), (activeLayer.height ?? 200) * (activeLayer.scale ?? 1), currentOptions.project.preset.width, currentOptions.project.preset.height, currentOptions.project.layers, currentOptions.guideSettings.snapToGuides ? { enabled: true, verticalGuides: currentOptions.guideSnapLines.vertical, horizontalGuides: currentOptions.guideSnapLines.horizontal } : undefined);
          nextX = (snap.x / currentOptions.project.preset.width) * 100;
          nextY = (snap.y / currentOptions.project.preset.height) * 100;
          setGuides(snap.guides);
        } else setGuides([]);
        currentOptions.onUpdatePosition(primary.id, { x: Math.round(nextX * 10) / 10, y: Math.round(nextY * 10) / 10 });
      } else {
        setGuides([]);
        dragStartRef.current.layers.forEach((item) => currentOptions.onUpdatePosition(item.id, { x: Math.round((item.startX + deltaX) * 10) / 10, y: Math.round((item.startY + deltaY) * 10) / 10 }));
      }
    };

    const handlePointerEnd = (cancelled = false) => {
      flushMarquee();
      const currentOptions = latestOptionsRef.current;
      const completedLayerId = draggingLayerIdRef.current ?? pendingLayerIdRef.current;
      const completedLayer = completedLayerId ? currentOptions.project.layers.find((layer) => layer.id === completedLayerId) : undefined;
      const didMove = dragMovedRef.current || marqueeMovedRef.current;
      if (didMove && (completedLayerId || resizingLayerIdRef.current || rotatingLayerIdRef.current)) currentOptions.onCommitPositionChange?.();
      if (!cancelled && !didMove && completedLayer && pointerTargetRef.current?.layerId === completedLayer.id && pointerTargetRef.current.isText && !completedLayer.locked && currentOptions.editingLayerId !== completedLayer.id) currentOptions.onRequestEdit?.(completedLayer.id);

      const capture = pointerCaptureRef.current;
      if (capture) {
        try {
          if (capture.element.hasPointerCapture(capture.pointerId)) capture.element.releasePointerCapture(capture.pointerId);
        } catch {
          // The browser may have released capture before pointerup.
        }
      }
      pointerCaptureRef.current = null;
      activePointerIdRef.current = null;
      activeInteractionRef.current = 'idle';
      pointerTargetRef.current = null;
      marqueeRef.current = null;
      marqueePendingPointRef.current = null;
      marqueeInitialSelectionRef.current = [];
      marqueeMovedRef.current = false;
      suppressCanvasClickRef.current = suppressCanvasClickRef.current || didMove;
      currentOptions.setIsPanning(false);
      pendingLayerIdRef.current = null;
      draggingLayerIdRef.current = null;
      resizingLayerIdRef.current = null;
      rotatingLayerIdRef.current = null;
      setPendingLayerId(null);
      setDraggingLayerId(null);
      setResizingLayerId(null);
      setRotatingLayerId(null);
      setMarqueeBox(null);
      setGuides([]);
      dragMovedRef.current = false;
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) return;
      if (activeInteractionRef.current !== 'idle') handlePointerEnd();
    };
    const handlePointerCancel = (event: PointerEvent) => {
      if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) return;
      if (activeInteractionRef.current !== 'idle') handlePointerEnd(true);
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      if (marqueeRafRef.current !== null) {
        if (typeof window.cancelAnimationFrame === 'function') window.cancelAnimationFrame(marqueeRafRef.current);
        else window.clearTimeout(marqueeRafRef.current);
      }
    };
    // Stable lifecycle listeners intentionally read changing values from refs.
  }, []);

  useEffect(() => {
    const handlePointerDownOutside = (event: PointerEvent) => {
      if (!(event.target as HTMLElement).closest('[data-image-context-menu="true"]')) setContextMenu(null);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setContextMenu(null);
    };
    // Keep this listener in the bubbling phase. The menu stops propagation at
    // its boundary, so a menu action cannot be unmounted by this outside
    // handler before the button's click event is delivered.
    window.addEventListener('pointerdown', handlePointerDownOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDownOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const consumeCanvasClick = useCallback(() => {
    const suppressed = suppressCanvasClickRef.current;
    suppressCanvasClickRef.current = false;
    return suppressed;
  }, []);

  return {
    contextMenu,
    setContextMenu,
    marqueeBox,
    guides,
    pendingLayerId,
    draggingLayerId,
    consumeCanvasClick,
    handleContainerPointerDown,
    handleCanvasPointerDown,
    handlers: { handlePointerDown, handleContextMenu, handleResizeStart, handleRotateStart } satisfies ImageStageInteractionHandlers,
  };
};
