import { useCallback, useEffect, useRef, useState } from 'react';
import type { ImagePreviewMode, ImageProject, CarouselGeometry } from '../types/imageStudio';

interface UseImageStageViewportOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  project: ImageProject;
  zoom: number;
  previewMode: ImagePreviewMode;
  isCarousel: boolean;
  carouselGeometry: CarouselGeometry;
  onSetZoom: (zoom: number) => void;
  onNudgeSelectedLayers?: (dx: number, dy: number) => void;
  activeSlideIndex: number;
}

export const useImageStageViewport = ({
  containerRef,
  project,
  zoom,
  previewMode,
  isCarousel,
  carouselGeometry,
  onSetZoom,
  onNudgeSelectedLayers,
  activeSlideIndex,
}: UseImageStageViewportOptions) => {
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [toolMode, setToolMode] = useState<'select' | 'hand'>('select');
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const effectiveHandMode = toolMode === 'hand' || isSpacePressed;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) return;
      if (event.code === 'Space' && !isSpacePressed) setIsSpacePressed(true);
      if (event.key.toLowerCase() === 'v') setToolMode('select');
      if (event.key.toLowerCase() === 'h') setToolMode('hand');
      if (event.key === 'ArrowLeft') {
        onNudgeSelectedLayers?.(event.shiftKey ? -2 : -0.2, 0);
        event.preventDefault();
      } else if (event.key === 'ArrowRight') {
        onNudgeSelectedLayers?.(event.shiftKey ? 2 : 0.2, 0);
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        onNudgeSelectedLayers?.(0, event.shiftKey ? -2 : -0.2);
        event.preventDefault();
      } else if (event.key === 'ArrowDown') {
        onNudgeSelectedLayers?.(0, event.shiftKey ? 2 : 0.2);
        event.preventDefault();
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') setIsSpacePressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed, onNudgeSelectedLayers]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        const factor = Math.exp(-event.deltaY * 0.008);
        onSetZoom(parseFloat(Math.max(0.15, Math.min(3, zoom * factor)).toFixed(2)));
      } else {
        setPanOffset((previous) => ({ x: previous.x - event.deltaX, y: previous.y - event.deltaY }));
      }
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [onSetZoom, zoom]);

  useEffect(() => {
    if (!isCarousel || previewMode !== 'focus') return;
    const relativeSlideCenter =
      (activeSlideIndex + 0.5) * carouselGeometry.slideWidth - carouselGeometry.panoramaWidth / 2;
    setPanOffset({ x: -relativeSlideCenter * zoom, y: 0 });
  }, [activeSlideIndex, carouselGeometry.panoramaWidth, carouselGeometry.slideWidth, isCarousel, previewMode, zoom]);

  const startPan = useCallback((event: React.PointerEvent) => {
    event.preventDefault();
    setIsPanning(true);
    panStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
    };
  }, [panOffset]);

  const handleResetFit = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
    if (!containerRef.current) {
      onSetZoom(0.55);
      return;
    }
    const availableW = Math.max(200, containerRef.current.clientWidth - 80);
    const availableH = Math.max(200, containerRef.current.clientHeight - 130);
    const canvasW = previewMode === 'focus' && isCarousel ? carouselGeometry.slideWidth : project.preset.width || 1080;
    const canvasH = carouselGeometry.slideHeight || project.preset.height || 1350;
    const fitZoom = Math.min(availableW / canvasW, availableH / canvasH);
    onSetZoom(parseFloat(Math.max(0.15, Math.min(1.5, fitZoom)).toFixed(2)));
  }, [carouselGeometry.slideHeight, carouselGeometry.slideWidth, isCarousel, onSetZoom, previewMode, project.preset.height, project.preset.width]);

  const lastPresetIdRef = useRef('');
  useEffect(() => {
    if (project.preset.id !== lastPresetIdRef.current) {
      lastPresetIdRef.current = project.preset.id;
      const timer = window.setTimeout(handleResetFit, 50);
      return () => window.clearTimeout(timer);
    }
  }, [handleResetFit, project.preset.height, project.preset.id, project.preset.width]);

  useEffect(() => {
    if (previewMode === 'overview' || previewMode === 'focus' || !isCarousel) {
      const timer = window.setTimeout(handleResetFit, 0);
      return () => window.clearTimeout(timer);
    }
  }, [handleResetFit, isCarousel, previewMode]);

  return {
    toolMode,
    setToolMode,
    effectiveHandMode,
    isPanning,
    setIsPanning,
    panOffset,
    setPanOffset,
    panStartRef,
    startPan,
    handleResetFit,
  };
};
