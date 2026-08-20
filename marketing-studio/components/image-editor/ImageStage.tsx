import React, { useRef, useState, useEffect } from 'react';
import {
  ImageProject,
  ImageLayer,
} from '../../types/imageStudio';
import { calculateSnapping } from '../../hooks/useKonvaSnapping';
import { ImageQuickToolbar } from './ImageQuickToolbar';
import {
  Minus,
  Plus,
  Maximize2,
  Layers,
  Ungroup,
  FolderPlus,
  Copy,
  Trash2,
  MousePointer,
  Hand,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  FlipHorizontal,
  FlipVertical,
  Paintbrush,
  Clipboard,
  FolderHeart,
} from 'lucide-react';
import { ImageLayerBlockRenderer, getBlockDefaultWidth } from './blocks';

interface ImageStageProps {
  project: ImageProject;
  selectedLayerId: string | null;
  selectedLayerIds?: string[];
  isCanvasSelected: boolean;
  zoom: number;
  showSafeZones: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onSelectLayer: (id: string, isShift?: boolean) => void;
  onSelectMultipleLayers?: (ids: string[]) => void;
  onGroupSelectedLayers?: () => void;
  onDeleteSelectedLayers?: () => void;
  onDuplicateSelectedLayers?: () => void;
  onCopySelectedLayers?: () => void;
  onPasteLayers?: () => void;
  onCopyLayerStyle?: (id?: string) => void;
  onPasteLayerStyle?: (id?: string) => void;
  onToggleFlipHorizontal?: (id: string) => void;
  onToggleFlipVertical?: (id: string) => void;
  onNudgeSelectedLayers?: (dx: number, dy: number) => void;
  onToggleLock?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onMoveZIndex?: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  onAlignSelectedLayers?: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onSelectCanvas: () => void;
  onDeselectAll: () => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateScale: (id: string, scale: number) => void;
  onUpdateWidth?: (id: string, width?: number) => void;
  onUpdateHeight?: (id: string, height?: number) => void;
  onUpdateRotation?: (id: string, rotation: number) => void;
  onCommitPositionChange?: () => void;
  onFitToCanvas?: (id: string) => void;
  onUngroupLayer?: (id: string) => void;
  onSaveToMyDesigns?: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onUpdateLayerProps?: (id: string, patch: Record<string, unknown>) => void;
  onSetZoom: (zoom: number) => void;
}

export const ImageStage: React.FC<ImageStageProps> = ({
  project,
  selectedLayerId,
  selectedLayerIds = [],
  isCanvasSelected,
  zoom,
  showSafeZones,
  canvasRef,
  onSelectLayer,
  onSelectMultipleLayers,
  onGroupSelectedLayers,
  onDeleteSelectedLayers,
  onDuplicateSelectedLayers,
  onCopySelectedLayers,
  onPasteLayers,
  onCopyLayerStyle,
  onPasteLayerStyle,
  onToggleFlipHorizontal,
  onToggleFlipVertical,
  onNudgeSelectedLayers,
  onToggleLock,
  onToggleVisibility,
  onMoveZIndex,
  onAlignSelectedLayers,
  onSelectCanvas,
  onDeselectAll,
  onUpdatePosition,
  onUpdateScale,
  onUpdateWidth,
  onUpdateHeight,
  onUpdateRotation,
  onCommitPositionChange,
  onFitToCanvas,
  onUngroupLayer,
  onSaveToMyDesigns,
  onDuplicateLayer,
  onRemoveLayer,
  onUpdateLayerProps,
  onSetZoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [toolMode, setToolMode] = useState<'select' | 'hand'>('select');
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [resizingLayerId, setResizingLayerId] = useState<string | null>(null);
  const [rotatingLayerId, setRotatingLayerId] = useState<string | null>(null);
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
  const [marqueeBox, setMarqueeBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [guides, setGuides] = useState<Array<{ points: [number, number, number, number]; color: string; orientation: 'vertical' | 'horizontal' }>>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; layer: ImageLayer } | null>(null);

  const effectiveHandMode = toolMode === 'hand' || isSpacePressed;

  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  const dragStartRef = useRef<{
    x: number;
    y: number;
    layers: Array<{ id: string; startX: number; startY: number }>;
  }>({
    x: 0,
    y: 0,
    layers: [],
  });

  const canvasMouseDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Atajos de teclado para herramientas (V = Selección, H = Mano, Espacio = Mano temporal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }

      if (e.code === 'Space' && !isSpacePressed) {
        setIsSpacePressed(true);
      }
      if (e.key.toLowerCase() === 'v') {
        setToolMode('select');
      }
      if (e.key.toLowerCase() === 'h') {
        setToolMode('hand');
      }
      if (e.key === 'ArrowLeft') {
        onNudgeSelectedLayers?.(e.shiftKey ? -2.0 : -0.2, 0);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        onNudgeSelectedLayers?.(e.shiftKey ? 2.0 : 0.2, 0);
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        onNudgeSelectedLayers?.(0, e.shiftKey ? -2.0 : -0.2);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        onNudgeSelectedLayers?.(0, e.shiftKey ? 2.0 : 0.2);
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed]);

  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    startScale: number;
    startWidth: number;
    startHeight: number;
    corner: 'nw' | 'ne' | 'se' | 'sw' | 'e' | 'w' | 'n' | 's';
  }>({
    startX: 0,
    startY: 0,
    startScale: 1,
    startWidth: 380,
    startHeight: 200,
    corner: 'se',
  });

  const rotateStartRef = useRef<{
    centerX: number;
    centerY: number;
    startAngle: number;
    initialRotation: number;
  }>({
    centerX: 0,
    centerY: 0,
    startAngle: 0,
    initialRotation: 0,
  });

  // Cerrar menú contextual al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // 1. GESTOS DE TRACKPAD (PINCH TO ZOOM & COMPONENT SCALE & TWO-FINGER PAN)
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const handleWheel = (e: WheelEvent) => {
      // Gesto de pellizco (Pinch-to-zoom en Trackpad de macOS/Windows genera e.ctrlKey o e.metaKey)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        // Zoom general del lienzo (estándar universal Canva / Figma)
        const factor = Math.exp(-e.deltaY * 0.008);
        const nextZoom = Math.max(0.15, Math.min(3.0, zoom * factor));
        onSetZoom(parseFloat(nextZoom.toFixed(2)));
      } else {
        // Desplazamiento panorámico (Pan) con dos dedos
        e.preventDefault();
        setPanOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };

    containerEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      containerEl.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, onSetZoom]);

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (effectiveHandMode || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
      return;
    }

    const target = e.target as HTMLElement;
    if (
      target.closest('.canvas-layer-item') ||
      target.closest('.interactive-handle') ||
      target.closest('.artboard-bg')
    ) {
      return;
    }

    // Iniciar Marquee Selection desde el espacio exterior
    if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
      onDeselectAll();
    }

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / zoom;
    const startY = (e.clientY - rect.top) / zoom;

    setIsMarqueeSelecting(true);
    setMarqueeBox({
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (effectiveHandMode || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
      return;
    }

    const target = e.target as HTMLElement;
    if (target.closest('.canvas-layer-item') || target.closest('.interactive-handle')) {
      return;
    }

    canvasMouseDownPosRef.current = { x: e.clientX, y: e.clientY };

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / zoom;
    const startY = (e.clientY - rect.top) / zoom;

    setIsMarqueeSelecting(true);
    setMarqueeBox({
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    });
  };

  const handleMouseDown = (e: React.MouseEvent, layer: ImageLayer) => {
    if (effectiveHandMode || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
      return;
    }

    e.stopPropagation();
    const isShift = e.shiftKey || e.metaKey || e.ctrlKey;
    const isAlreadySelected = selectedLayerIds.includes(layer.id);
    let currentSelectedIds = selectedLayerIds;

    if (isShift) {
      onSelectLayer(layer.id, true);
      currentSelectedIds = selectedLayerIds.includes(layer.id)
        ? selectedLayerIds.filter((id) => id !== layer.id)
        : [...selectedLayerIds, layer.id];
    } else if (!isAlreadySelected) {
      onSelectLayer(layer.id, false);
      currentSelectedIds = [layer.id];
    }

    if (layer.locked) return;
    setDraggingLayerId(layer.id);

    const layersToDrag = project.layers.filter(
      (l) => currentSelectedIds.includes(l.id) && !l.locked
    );

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      layers:
        layersToDrag.length > 0
          ? layersToDrag.map((l) => ({ id: l.id, startX: l.position.x, startY: l.position.y }))
          : [{ id: layer.id, startX: layer.position.x, startY: layer.position.y }],
    };
  };

  const handleContextMenu = (e: React.MouseEvent, layer: ImageLayer) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedLayerIds.includes(layer.id)) {
      onSelectLayer(layer.id, false);
    }
    setContextMenu({
      x: Math.min(window.innerWidth - 270, e.clientX),
      y: Math.min(window.innerHeight - 440, e.clientY),
      layer,
    });
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    layer: ImageLayer,
    corner: 'nw' | 'ne' | 'se' | 'sw' | 'e' | 'w' | 'n' | 's' = 'se'
  ) => {
    e.stopPropagation();
    onSelectLayer(layer.id);
    setResizingLayerId(layer.id);

    const layerEl = (e.currentTarget as HTMLElement).closest('.canvas-layer-item') as HTMLElement | null;
    const currentScale = layer.scale ?? 1;
    const realWidth = layerEl ? Math.round(layerEl.offsetWidth / currentScale) : 380;
    const realHeight = layerEl ? Math.round(layerEl.offsetHeight / currentScale) : 200;

    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startScale: currentScale,
      startWidth: layer.width ?? realWidth,
      startHeight: layer.height ?? realHeight,
      corner,
    };
  };

  const handleRotateStart = (e: React.MouseEvent, layer: ImageLayer) => {
    e.stopPropagation();
    onSelectLayer(layer.id);
    setRotatingLayerId(layer.id);
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.left + (layer.position.x / 100) * rect.width;
    const centerY = rect.top + (layer.position.y / 100) * rect.height;
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    rotateStartRef.current = {
      centerX,
      centerY,
      startAngle,
      initialRotation: layer.rotation ?? 0,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 0. Pan panorámico con ratón
      if (isPanning) {
        const deltaX = e.clientX - panStartRef.current.x;
        const deltaY = e.clientY - panStartRef.current.y;
        setPanOffset({
          x: panStartRef.current.panX + deltaX,
          y: panStartRef.current.panY + deltaY,
        });
        return;
      }

      // 1. Marquee Drag Selection (Caja elástica de multiselección en tiempo real)
      if (isMarqueeSelecting && canvasRef.current && marqueeBox) {
        const rect = canvasRef.current.getBoundingClientRect();
        const currentX = (e.clientX - rect.left) / zoom;
        const currentY = (e.clientY - rect.top) / zoom;

        setMarqueeBox((prev) => (prev ? { ...prev, currentX, currentY } : null));

        const minX = Math.min(marqueeBox.startX, currentX);
        const maxX = Math.max(marqueeBox.startX, currentX);
        const minY = Math.min(marqueeBox.startY, currentY);
        const maxY = Math.max(marqueeBox.startY, currentY);

        const canvasW = project.preset.width;
        const canvasH = project.preset.height;

        const intersectedIds = project.layers
          .filter((l) => l.visible !== false)
          .filter((l) => {
            const centerX = (l.position.x / 100) * canvasW;
            const centerY = (l.position.y / 100) * canvasH;
            const w = l.width ?? 380;
            const h = l.height ?? 200;
            const left = centerX - w / 2;
            const right = centerX + w / 2;
            const top = centerY - h / 2;
            const bottom = centerY + h / 2;

            return !(left > maxX || right < minX || top > maxY || bottom < minY);
          })
          .map((l) => l.id);

        onSelectMultipleLayers?.(intersectedIds);
        return;
      }

      if (rotatingLayerId) {
        const { centerX, centerY, startAngle, initialRotation } = rotateStartRef.current;
        const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        let nextRotation = (initialRotation + (currentAngle - startAngle)) % 360;
        if (nextRotation < 0) nextRotation += 360;
        onUpdateRotation?.(rotatingLayerId, Math.round(nextRotation));
        return;
      }

      if (resizingLayerId) {
        const { startX, startY, startScale, startWidth, startHeight, corner } = resizeStartRef.current;
        if (corner === 'e' || corner === 'w') {
          const rawDeltaX = (e.clientX - startX) / (zoom * startScale);
          const deltaX = corner === 'w' ? -rawDeltaX : rawDeltaX;
          const nextWidth = Math.max(40, Math.min(2400, startWidth + deltaX * 2));
          onUpdateWidth?.(resizingLayerId, Math.round(nextWidth));
          return;
        }

        if (corner === 'n' || corner === 's') {
          const rawDeltaY = (e.clientY - startY) / (zoom * startScale);
          const deltaY = corner === 'n' ? -rawDeltaY : rawDeltaY;
          const nextHeight = Math.max(20, Math.min(2400, startHeight + deltaY * 2));
          onUpdateHeight?.(resizingLayerId, Math.round(nextHeight));
          return;
        }

        let deltaX = e.clientX - startX;
        let deltaY = e.clientY - startY;

        if (corner === 'nw') {
          deltaX = -deltaX;
          deltaY = -deltaY;
        } else if (corner === 'ne') {
          deltaY = -deltaY;
        } else if (corner === 'sw') {
          deltaX = -deltaX;
        }

        const delta = (deltaX + deltaY) / 2;
        const nextScale = Math.max(0.2, Math.min(3.5, startScale + delta * 0.005));
        onUpdateScale(resizingLayerId, parseFloat(nextScale.toFixed(2)));
        return;
      }

      if (!draggingLayerId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;

      // Si arrastramos una sola capa, calculamos snapping
      if (dragStartRef.current.layers.length <= 1) {
        const primary = dragStartRef.current.layers[0] ?? { id: draggingLayerId, startX: 50, startY: 50 };
        let nextX = Math.max(5, Math.min(95, primary.startX + deltaX));
        let nextY = Math.max(5, Math.min(95, primary.startY + deltaY));

        const activeLayer = project.layers.find((l) => l.id === primary.id);
        if (activeLayer) {
          const pixelX = (nextX / 100) * project.preset.width;
          const pixelY = (nextY / 100) * project.preset.height;
          const snap = calculateSnapping(
            primary.id,
            pixelX,
            pixelY,
            activeLayer.width ?? 380,
            activeLayer.height ?? 200,
            project.preset.width,
            project.preset.height,
            project.layers
          );
          nextX = (snap.x / project.preset.width) * 100;
          nextY = (snap.y / project.preset.height) * 100;
          setGuides(snap.guides);
        }

        onUpdatePosition(primary.id, { x: Math.round(nextX * 10) / 10, y: Math.round(nextY * 10) / 10 });
      } else {
        // Arrastrar múltiples capas en bloque
        setGuides([]);
        dragStartRef.current.layers.forEach((item) => {
          const nextX = Math.max(2, Math.min(98, item.startX + deltaX));
          const nextY = Math.max(2, Math.min(98, item.startY + deltaY));
          onUpdatePosition(item.id, { x: Math.round(nextX * 10) / 10, y: Math.round(nextY * 10) / 10 });
        });
      }
    };

    const handleMouseUp = () => {
      if (draggingLayerId || resizingLayerId || rotatingLayerId) {
        onCommitPositionChange?.();
      }
      setIsPanning(false);
      setDraggingLayerId(null);
      setResizingLayerId(null);
      setRotatingLayerId(null);
      setIsMarqueeSelecting(false);
      setMarqueeBox(null);
      setGuides([]);
    };

    if (isPanning || draggingLayerId || resizingLayerId || rotatingLayerId || isMarqueeSelecting) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, draggingLayerId, resizingLayerId, rotatingLayerId, isMarqueeSelecting, marqueeBox, zoom, project.layers, project.preset.width, project.preset.height, onSelectMultipleLayers, onUpdatePosition, onUpdateScale, onUpdateWidth, onUpdateHeight, onUpdateRotation, onCommitPositionChange, canvasRef]);

  const handleResetFit = () => {
    setPanOffset({ x: 0, y: 0 });
    if (!containerRef.current) {
      onSetZoom(0.55);
      return;
    }

    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;

    // Margen visual de seguridad para respiración y barras flotantes
    const availableW = Math.max(200, containerW - 80);
    const availableH = Math.max(200, containerH - 130);

    const canvasW = project.preset.width || 1080;
    const canvasH = project.preset.height || 1350;

    const scaleX = availableW / canvasW;
    const scaleY = availableH / canvasH;

    const fitZoom = Math.min(scaleX, scaleY);
    const clampedZoom = Math.max(0.15, Math.min(1.5, fitZoom));

    onSetZoom(parseFloat(clampedZoom.toFixed(2)));
  };

  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleContainerMouseDown}
      className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#050B14] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-8 select-none ${
        effectiveHandMode
          ? isPanning
            ? 'cursor-grabbing'
            : 'cursor-grab'
          : 'cursor-default'
      }`}
    >
      {/* FLOATING QUICK TOOLBAR (ABOVE CANVAS) */}
      {selectedLayer && (
        <div className="absolute top-4 z-40" onClick={(e) => e.stopPropagation()}>
          <ImageQuickToolbar
            layer={selectedLayer}
            selectedCount={selectedLayerIds.length > 0 ? selectedLayerIds.length : 1}
            onDuplicate={onDuplicateLayer}
            onDuplicateSelected={onDuplicateSelectedLayers}
            onRemove={onRemoveLayer}
            onDeleteSelected={onDeleteSelectedLayers}
            onGroup={onGroupSelectedLayers}
            onScaleChange={onUpdateScale}
            onCenter={(id) => onUpdatePosition(id, { x: 50, y: 50 })}
            onUngroup={onUngroupLayer}
            onFitToCanvas={onFitToCanvas}
            onToggleLock={onToggleLock}
            onToggleFlipHorizontal={onToggleFlipHorizontal}
          />
        </div>
      )}

      {/* RIGHT-CLICK CONTEXT MENU (ESTILO CANVA) */}
      {contextMenu && (
        <div
          style={{ left: contextMenu.x, top: contextMenu.y }}
          className="fixed z-50 min-w-[240px] max-w-[280px] rounded-2xl border border-slate-700/80 bg-slate-950/95 p-1.5 shadow-2xl backdrop-blur-xl animate-fadeIn text-xs text-slate-200 divide-y divide-slate-800/80 select-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER / TITULAR */}
          <div className="px-3 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">
              {selectedLayerIds.length > 1
                ? `${selectedLayerIds.length} Elementos Seleccionados`
                : contextMenu.layer.title}
            </span>
          </div>

          {/* SECCIÓN 1: ACCIONES DE PORTAPAPELES Y EDICIÓN (CANVA-STYLE) */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                onCopySelectedLayers?.();
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Copy className="size-3.5 text-slate-400" />
                <span>Copiar</span>
              </div>
              <kbd className="text-[10px] text-slate-500 font-mono">⌘C</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onPasteLayers?.();
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clipboard className="size-3.5 text-slate-400" />
                <span>Pegar</span>
              </div>
              <kbd className="text-[10px] text-slate-500 font-mono">⌘V</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onCopyLayerStyle?.(contextMenu.layer.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Paintbrush className="size-3.5 text-brand-cyan" />
                <span>Copiar estilo</span>
              </div>
              <kbd className="text-[10px] text-brand-cyan/80 font-mono">⌥⌘C</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onPasteLayerStyle?.(contextMenu.layer.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Paintbrush className="size-3.5 text-brand-cyan" />
                <span>Pegar estilo</span>
              </div>
              <kbd className="text-[10px] text-brand-cyan/80 font-mono">⌥⌘V</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                if (selectedLayerIds.length > 1 && onDuplicateSelectedLayers) {
                  onDuplicateSelectedLayers();
                } else {
                  onDuplicateLayer(contextMenu.layer.id);
                }
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Copy className="size-3.5 text-slate-400" />
                <span>Duplicar</span>
              </div>
              <kbd className="text-[10px] text-slate-500 font-mono">⌘D</kbd>
            </button>

            {onSaveToMyDesigns && (
              <button
                type="button"
                onClick={() => {
                  onSaveToMyDesigns(contextMenu.layer.id);
                  setContextMenu(null);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-amber-300 hover:bg-amber-950/40 hover:text-amber-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FolderHeart className="size-3.5 text-amber-400" />
                  <span>Guardar en Mis Diseños</span>
                </div>
                <span className="text-[10px] text-amber-400/70 font-mono">⭐ Guardar</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (selectedLayerIds.length > 1 && onDeleteSelectedLayers) {
                  onDeleteSelectedLayers();
                } else {
                  onRemoveLayer(contextMenu.layer.id);
                }
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="size-3.5 text-rose-400" />
                <span>Eliminar</span>
              </div>
              <kbd className="text-[10px] text-rose-400/60 font-mono">DELETE</kbd>
            </button>
          </div>

          {/* SECCIÓN 2: AGRUPACIÓN / DESAGRUPACIÓN */}
          {(selectedLayerIds.length >= 2 || ['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard', 'CustomGroup'].includes(contextMenu.layer.blockType ?? '')) && (
            <div className="py-1">
              {selectedLayerIds.length >= 2 && onGroupSelectedLayers && (
                <button
                  type="button"
                  onClick={() => {
                    onGroupSelectedLayers();
                    setContextMenu(null);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left font-bold text-brand-cyan hover:bg-brand-cyan/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FolderPlus className="size-3.5 text-brand-cyan" />
                    <span>Agrupar elementos</span>
                  </div>
                  <kbd className="text-[10px] text-brand-cyan/80 font-mono">⌘G</kbd>
                </button>
              )}

              {onUngroupLayer && ['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard', 'CustomGroup'].includes(contextMenu.layer.blockType ?? '') && (
                <button
                  type="button"
                  onClick={() => {
                    onUngroupLayer(contextMenu.layer.id);
                    setContextMenu(null);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Ungroup className="size-3.5 text-amber-400" />
                    <span>Desagrupar en Elementos Libres</span>
                  </div>
                  <kbd className="text-[10px] text-amber-400/80 font-mono">⇧⌘G</kbd>
                </button>
              )}
            </div>
          )}

          {/* SECCIÓN 3: CAPA / ORDEN Z */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                onMoveZIndex?.(contextMenu.layer.id, 'top');
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowUp className="size-3.5 text-brand-cyan" />
                <span>Traer al frente (Z-Max)</span>
              </div>
              <kbd className="text-[10px] text-brand-cyan/80 font-mono">⇧]</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onMoveZIndex?.(contextMenu.layer.id, 'up');
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowUp className="size-3.5 text-slate-400" />
                <span>Subir un nivel</span>
              </div>
              <kbd className="text-[10px] text-slate-500 font-mono">]</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onMoveZIndex?.(contextMenu.layer.id, 'down');
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowDown className="size-3.5 text-slate-400" />
                <span>Bajar un nivel</span>
              </div>
              <kbd className="text-[10px] text-slate-500 font-mono">[</kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                onMoveZIndex?.(contextMenu.layer.id, 'bottom');
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowDown className="size-3.5 text-slate-500" />
                <span>Enviar al fondo (Z-Min)</span>
              </div>
              <kbd className="text-[10px] text-slate-500 font-mono">⇧[</kbd>
            </button>
          </div>

          {/* SECCIÓN 4: VOLTEAR / FLIP (HORIZONTAL / VERTICAL) */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                onToggleFlipHorizontal?.(contextMenu.layer.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <FlipHorizontal className="size-3.5 text-slate-400" />
                <span>Voltear horizontal (Flip H)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">⇄</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleFlipVertical?.(contextMenu.layer.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <FlipVertical className="size-3.5 text-slate-400" />
                <span>Voltear vertical (Flip V)</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">⇅</span>
            </button>
          </div>

          {/* SECCIÓN 5: ALINEACIÓN AL LIENZO */}
          <div className="py-1">
            <div className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
              Alinear al Lienzo
            </div>
            <div className="grid grid-cols-4 gap-1 px-2 py-0.5">
              <button
                type="button"
                onClick={() => {
                  if (selectedLayerIds.length > 1 && onAlignSelectedLayers) {
                    onAlignSelectedLayers('left');
                  } else {
                    onUpdatePosition(contextMenu.layer.id, { x: 20, y: contextMenu.layer.position.y });
                  }
                  setContextMenu(null);
                }}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Alinear a la izquierda"
              >
                <AlignLeft className="size-3" />
                <span>Izq</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedLayerIds.length > 1 && onAlignSelectedLayers) {
                    onAlignSelectedLayers('center');
                  } else {
                    onUpdatePosition(contextMenu.layer.id, { x: 50, y: contextMenu.layer.position.y });
                  }
                  setContextMenu(null);
                }}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Centrar horizontalmente"
              >
                <AlignCenter className="size-3" />
                <span>Centro</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedLayerIds.length > 1 && onAlignSelectedLayers) {
                    onAlignSelectedLayers('right');
                  } else {
                    onUpdatePosition(contextMenu.layer.id, { x: 80, y: contextMenu.layer.position.y });
                  }
                  setContextMenu(null);
                }}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Alinear a la derecha"
              >
                <AlignRight className="size-3" />
                <span>Der</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedLayerIds.length > 1 && onAlignSelectedLayers) {
                    onAlignSelectedLayers('middle');
                  } else {
                    onUpdatePosition(contextMenu.layer.id, { x: contextMenu.layer.position.x, y: 50 });
                  }
                  setContextMenu(null);
                }}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Centrar verticalmente"
              >
                <AlignVerticalJustifyCenter className="size-3" />
                <span>Medio</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN 5: BLOQUEO, VISIBILIDAD Y AUTO-AJUSTE */}
          <div className="py-1">
            {onToggleLock && (
              <button
                type="button"
                onClick={() => {
                  onToggleLock(contextMenu.layer.id);
                  setContextMenu(null);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  {contextMenu.layer.locked ? (
                    <>
                      <Unlock className="size-3.5 text-amber-400" />
                      <span>Desbloquear capa</span>
                    </>
                  ) : (
                    <>
                      <Lock className="size-3.5 text-slate-400" />
                      <span>Bloquear capa</span>
                    </>
                  )}
                </div>
                <kbd className="text-[10px] text-slate-500 font-mono">⌥⇧L</kbd>
              </button>
            )}

            {onToggleVisibility && (
              <button
                type="button"
                onClick={() => {
                  onToggleVisibility(contextMenu.layer.id);
                  setContextMenu(null);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  {contextMenu.layer.visible === false ? (
                    <>
                      <Eye className="size-3.5 text-brand-cyan" />
                      <span>Mostrar capa</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3.5 text-slate-400" />
                      <span>Ocultar capa</span>
                    </>
                  )}
                </div>
              </button>
            )}

            {onFitToCanvas && (
              <button
                type="button"
                onClick={() => {
                  onFitToCanvas(contextMenu.layer.id);
                  setContextMenu(null);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <Maximize2 className="size-3.5 text-primary" />
                <span>Auto-Ajustar al Lienzo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* THE CANVAS CONTAINER */}
      <div
        className="relative transition-transform duration-75 ease-out cursor-default"
        style={{
          transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* MULTI-SELECTION FLOATING ACTION BAR */}
        {selectedLayerIds.length > 1 && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-teal-500/40 bg-[#001219]/95 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-fadeIn">
            <div className="flex items-center gap-1.5 text-brand-cyan">
              <Layers className="size-4" />
              <span>{selectedLayerIds.length} elementos seleccionados</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <button
              type="button"
              onClick={() => onGroupSelectedLayers?.()}
              className="flex items-center gap-1.5 rounded-lg bg-teal-900/60 px-2.5 py-1 text-[11px] font-bold text-brand-cyan hover:bg-teal-800 hover:text-white transition-colors"
              title="Agrupar elementos seleccionados (Cmd+G)"
            >
              <span>Agrupar</span>
              <kbd className="rounded bg-teal-950 px-1 py-0.5 font-mono text-[9px]">⌘G</kbd>
            </button>
          </div>
        )}

        {/* ARTBOARD (STAGE) */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onClick={(e) => {
            const dist = Math.hypot(
              e.clientX - canvasMouseDownPosRef.current.x,
              e.clientY - canvasMouseDownPosRef.current.y
            );
            if (dist > 5) {
              return;
            }
            e.stopPropagation();
            onSelectCanvas();
          }}
          className={`artboard-bg relative overflow-hidden transition-all ${
            isCanvasSelected
              ? 'ring-2 ring-primary ring-offset-4 ring-offset-[#001219]'
              : 'shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
          }`}
          style={{
            width: `${project.preset.width}px`,
            height: `${project.preset.height}px`,
            background: project.background.gradient ?? project.background.color ?? '#001219',
          }}
        >
          {/* MARQUEE SELECTION RECTANGLE */}
          {marqueeBox && (
            <div
              className="pointer-events-none absolute z-50 rounded-xs border-2 border-dashed border-brand-cyan bg-brand-cyan/20 shadow-[0_0_20px_rgba(148,210,189,0.35)] backdrop-blur-xs transition-none"
              style={{
                left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
                top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
                width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
                height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`,
              }}
            />
          )}

          {/* SAFE ZONES OVERLAY (STORIES / REELS / 4:5 ADS) */}
          {showSafeZones && (
            <div className="pointer-events-none absolute inset-0 z-50 border-2 border-dashed border-amber-400/60 p-8">
              <div className="flex justify-between text-[10px] font-mono font-bold text-amber-400">
                <span>Safe Margin Top</span>
                <span>Instagram / TikTok Area</span>
              </div>
            </div>
          )}

          {/* GUÍAS DE SNAPPING MAGNÉTICO EN TIEMPO REAL */}
          {guides.map((g, i) => (
            <div
              key={i}
              className="pointer-events-none absolute z-40"
              style={{
                backgroundColor: g.color,
                left: g.orientation === 'vertical' ? `${g.points[0]}px` : 0,
                top: g.orientation === 'horizontal' ? `${g.points[1]}px` : 0,
                width: g.orientation === 'horizontal' ? '100%' : '1.5px',
                height: g.orientation === 'vertical' ? '100%' : '1.5px',
                boxShadow: `0 0 8px ${g.color}`,
              }}
            />
          ))}

          {/* RENDER LAYERS */}
          {project.layers.map((layer) => {
            if (layer.visible === false) return null;

            const isSelected = selectedLayerIds.includes(layer.id) || layer.id === selectedLayerId;
            const isLocked = Boolean(layer.locked);
            const blockProps = layer.props as Record<string, unknown>;

            const getBlockWidth = (blockType?: string, customWidth?: number) =>
              getBlockDefaultWidth(blockType, customWidth, blockProps);

            const getFilterStyle = (filter?: ImageLayer['filter'], brightness = 100, contrast = 100, blur = 0) => {
              const parts: string[] = [];
              if (brightness !== 100) parts.push(`brightness(${brightness}%)`);
              if (contrast !== 100) parts.push(`contrast(${contrast}%)`);
              if (blur > 0) parts.push(`blur(${blur}px)`);

              if (filter === 'grayscale') parts.push('grayscale(100%)');
              else if (filter === 'sepia') parts.push('sepia(80%)');
              else if (filter === 'contrast') parts.push('contrast(160%) saturate(120%)');
              else if (filter === 'teal_tint') parts.push('hue-rotate(150deg) saturate(130%)');
              else if (filter === 'gold_tint') parts.push('sepia(50%) hue-rotate(330deg) saturate(160%)');

              return parts.length > 0 ? parts.join(' ') : undefined;
            };

            const getShadowStyle = (preset?: ImageLayer['shadowPreset'], l?: ImageLayer) => {
              if (preset === 'soft') return '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)';
              if (preset === 'deep') return '0 25px 50px -12px rgba(0, 0, 0, 0.7)';
              if (preset === 'glow_teal') return '0 0 25px rgba(148, 210, 189, 0.6), 0 0 10px rgba(0, 95, 115, 0.8)';
              if (preset === 'glow_gold') return '0 0 25px rgba(238, 155, 0, 0.6), 0 0 10px rgba(202, 103, 2, 0.8)';
              if (preset === 'neon') return '0 0 5px #00FFFF, 0 0 20px #005F73, 0 0 40px #001219';
              if (l?.shadowBlur || l?.shadowColor) {
                return `${l.shadowOffsetX ?? 0}px ${l.shadowOffsetY ?? 4}px ${l.shadowBlur ?? 10}px ${l.shadowColor ?? 'rgba(0,0,0,0.4)'}`;
              }
              return undefined;
            };

            const scaleX = (layer.scale ?? 1) * (layer.flipHorizontal ? -1 : 1);
            const scaleY = (layer.scale ?? 1) * (layer.flipVertical ? -1 : 1);

            const getClipClass = (shape?: ImageLayer['clipShape']) => {
              switch (shape) {
                case 'circle':
                  return 'rounded-full overflow-hidden';
                case 'squircle':
                  return 'rounded-[2.5rem] overflow-hidden';
                case 'pill':
                  return 'rounded-full px-6 overflow-hidden';
                case 'phone_mockup':
                  return 'rounded-[3rem] border-4 border-slate-700 shadow-2xl overflow-hidden';
                case 'shield':
                  return 'rounded-b-[3rem] rounded-t-2xl overflow-hidden';
                default:
                  return '';
              }
            };

            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleMouseDown(e, layer)}
                onContextMenu={(e) => handleContextMenu(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`canvas-layer-item absolute transition-shadow select-none shrink-0 [&_*]:cursor-inherit ${getClipClass(
                  layer.clipShape
                )} ${
                  effectiveHandMode
                    ? isPanning
                      ? 'cursor-grabbing'
                      : 'cursor-grab'
                    : isLocked
                    ? 'cursor-default'
                    : 'cursor-move'
                } ${
                  isSelected
                    ? isLocked
                      ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent shadow-2xl'
                      : 'ring-2 ring-brand-cyan ring-offset-2 ring-offset-transparent shadow-2xl'
                    : 'hover:ring-1 hover:ring-white/40'
                }`}
                style={{
                  left: `${layer.position.x}%`,
                  top: `${layer.position.y}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation ?? 0}deg) scale(${scaleX}, ${scaleY})`,
                  zIndex: layer.zIndex,
                  width: getBlockWidth(layer.blockType, layer.width),
                  minWidth: getBlockWidth(layer.blockType, layer.width) === 'auto' ? 'auto' : getBlockWidth(layer.blockType, layer.width),
                  maxWidth: 'none',
                  height: layer.height ? `${layer.height}px` : 'auto',
                  minHeight: layer.height ? `${layer.height}px` : 'auto',
                  flexShrink: 0,
                  opacity: layer.opacity !== undefined ? layer.opacity : 1,
                  boxShadow: getShadowStyle(layer.shadowPreset, layer),
                  borderWidth: layer.borderWidth ? `${layer.borderWidth}px` : undefined,
                  borderColor: layer.borderColor || undefined,
                  borderStyle: layer.borderWidth ? 'solid' : undefined,
                  borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : undefined,
                  filter: getFilterStyle(layer.filter, layer.brightness, layer.contrast, layer.blur),
                }}
              >
                {/* RENDER BLOCK VIA MODULAR RENDERER */}
                <ImageLayerBlockRenderer
                  layer={layer}
                  brandTokens={project.brandTokens}
                  onUpdateLayerProps={onUpdateLayerProps}
                />

                {/* LOCK BADGE IF SELECTED AND LOCKED */}
                {isSelected && isLocked && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold text-slate-950 shadow-md backdrop-blur-xs">
                    <span>🔒</span>
                    <span>Capa Bloqueada</span>
                  </div>
                )}

                {/* BOUNDING BOX CORNER & LATERAL HANDLES CON ARRASTRE DE REDIMENSIÓN */}
                {isSelected && !isLocked && (
                  <>
                    {/* MANEJADOR SUPERIOR DE ROTACIÓN ANGULAR */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-brand-cyan pointer-events-none" />
                    <div
                      onMouseDown={(e) => handleRotateStart(e, layer)}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 size-4 rounded-full bg-white border-2 border-primary shadow-xl cursor-grab active:cursor-grabbing hover:scale-125 transition-transform flex items-center justify-center z-30"
                      title="Arrastrar para rotar libremente"
                    >
                      <div className="size-1.5 rounded-full bg-primary" />
                    </div>

                    {/* ESQUINAS: ESCALA PROPORCIONAL */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 'nw')}
                      className="absolute -top-2 -left-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para redimensionar proporcionalmente"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 'ne')}
                      className="absolute -top-2 -right-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para redimensionar proporcionalmente"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 'sw')}
                      className="absolute -bottom-2 -left-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para redimensionar proporcionalmente"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 'se')}
                      className="absolute -bottom-2 -right-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para redimensionar proporcionalmente"
                    />

                    {/* LATERALES: AJUSTE DE ANCHURA (WIDTH) */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 'w')}
                      className="absolute top-1/2 -left-2 -translate-y-1/2 h-5 w-2 rounded-full bg-white border border-slate-800 shadow-md cursor-ew-resize hover:scale-125 transition-transform z-20"
                      title="Ajustar ancho izquierdo"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 'e')}
                      className="absolute top-1/2 -right-2 -translate-y-1/2 h-5 w-2 rounded-full bg-white border border-slate-800 shadow-md cursor-ew-resize hover:scale-125 transition-transform z-20"
                      title="Ajustar ancho derecho"
                    />

                    {/* SUPERIOR/INFERIOR: AJUSTE DE ALTURA (HEIGHT) */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 'n')}
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-white border border-slate-800 shadow-md cursor-ns-resize hover:scale-125 transition-transform z-20"
                      title="Ajustar altura superior"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 's')}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-white border border-slate-800 shadow-md cursor-ns-resize hover:scale-125 transition-transform z-20"
                      title="Ajustar altura inferior"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR: TOOL SWITCH & ZOOM & SAFE ZONES (CENTERED) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 rounded-2xl border border-slate-800/90 bg-[#001219]/90 p-1.5 shadow-2xl backdrop-blur-xl z-40 text-white text-xs animate-fadeIn">
        {/* SELECTOR DE MODO DE HERRAMIENTA (SELECCIÓN / MANO) */}
        <div className="flex items-center rounded-xl bg-slate-950/80 p-0.5 border border-slate-800/80">
          <button
            type="button"
            onClick={() => setToolMode('select')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              !effectiveHandMode
                ? 'bg-primary/25 text-brand-cyan shadow-xs border border-brand-cyan/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
            title="Herramienta Selección (V)"
          >
            <MousePointer className="size-3.5" />
            <span className="hidden sm:inline">Selección</span>
            <kbd className="text-[9px] font-mono opacity-60">V</kbd>
          </button>

          <button
            type="button"
            onClick={() => setToolMode('hand')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              effectiveHandMode
                ? 'bg-primary/25 text-brand-cyan shadow-xs border border-brand-cyan/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
            title="Herramienta Mano / Pan (H o mantener barra Espaciadora)"
          >
            <Hand className="size-3.5" />
            <span className="hidden sm:inline">Mano</span>
            <kbd className="text-[9px] font-mono opacity-60">H</kbd>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* CONTROLES DE ZOOM */}
        <div className="flex items-center gap-1 px-0.5 sm:px-1">
          <button
            type="button"
            onClick={() => onSetZoom(Math.max(0.25, zoom - 0.1))}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reducir zoom"
          >
            <Minus className="size-3.5" />
          </button>

          <input
            type="range"
            min={0.25}
            max={1.5}
            step={0.05}
            value={zoom}
            onChange={(e) => onSetZoom(parseFloat(e.target.value))}
            className="w-16 sm:w-20 accent-primary cursor-pointer"
          />

          <button
            type="button"
            onClick={() => onSetZoom(Math.min(1.5, zoom + 0.1))}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Aumentar zoom"
          >
            <Plus className="size-3.5" />
          </button>

          <span className="font-mono text-[11px] text-brand-cyan min-w-[36px] text-center font-bold">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <button
          type="button"
          onClick={handleResetFit}
          className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:text-white transition-colors shadow-xs"
          title="Centrar y ajustar al lienzo"
        >
          <Maximize2 className="size-3 text-brand-cyan" />
          <span>Ajustar</span>
        </button>
      </div>
    </div>
  );
};
