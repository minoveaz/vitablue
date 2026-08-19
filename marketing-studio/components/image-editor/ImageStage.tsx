import React, { useRef, useState, useEffect } from 'react';
import {
  ImageProject,
  ImageLayer,
} from '../../types/imageStudio';
import { calculateSnapping } from '../../hooks/useKonvaSnapping';
import {
  MotionAdvisorCard,
  MotionTrustBadge,
  MotionProviderGrid,
  MotionComparisonCard,
} from '../../../packages/video-studio/src/motion-kit';
import { ImageQuickToolbar } from './ImageQuickToolbar';
import {
  Minus,
  Plus,
  Maximize2,
  MessageSquare,
  Ungroup,
  Copy,
  Trash2,
  Building2,
  Shield,
  Check,
  X,
  ShieldCheck,
  Layers,
} from 'lucide-react';

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
  onDuplicateLayer,
  onRemoveLayer,
  onUpdateLayerProps,
  onSetZoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; layer: ImageLayer } | null>(null);

  const dragStartRef = useRef<{ x: number; y: number; layerX: number; layerY: number }>({
    x: 0,
    y: 0,
    layerX: 50,
    layerY: 50,
  });

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
        const activeTargetId = hoveredLayerId ?? selectedLayerId;
        const targetLayer = project.layers.find((l) => l.id === activeTargetId);

        // Si el cursor está sobre un componente o hay un componente activo: reescala el componente
        if (targetLayer && hoveredLayerId) {
          const factor = Math.exp(-e.deltaY * 0.006);
          const currentScale = targetLayer.scale ?? 1;
          const nextScale = Math.max(0.35, Math.min(2.5, currentScale * factor));
          onUpdateScale(targetLayer.id, parseFloat(nextScale.toFixed(2)));
        } else {
          // Si el cursor está en el fondo del lienzo o fuera: zoom general del lienzo
          const factor = Math.exp(-e.deltaY * 0.008);
          const nextZoom = Math.max(0.15, Math.min(3.0, zoom * factor));
          onSetZoom(parseFloat(nextZoom.toFixed(2)));
        }
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
  }, [zoom, hoveredLayerId, selectedLayerId, project.layers, onSetZoom, onUpdateScale]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.canvas-layer-item') || target.closest('.interactive-handle')) {
      return;
    }

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

  const handleMouseDown = (e: React.MouseEvent, layer: ImageLayer) => {
    e.stopPropagation();
    const isShift = e.shiftKey || e.metaKey || e.ctrlKey;
    onSelectLayer(layer.id, isShift);
    if (layer.locked) return;
    setDraggingLayerId(layer.id);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      layerX: layer.position.x,
      layerY: layer.position.y,
    };
  };

  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingPropKey, setEditingPropKey] = useState<string>('title');
  const [editingValue, setEditingValue] = useState<string>('');

  const handleLayerDoubleClick = (e: React.MouseEvent, layer: ImageLayer) => {
    e.stopPropagation();
    let propKey = 'title';
    let currentVal = '';
    const p = layer.props as Record<string, unknown>;

    if (layer.type === 'text' || layer.blockType === 'CustomText') {
      propKey = 'text';
      currentVal = String(p.text ?? layer.title);
    } else if (layer.blockType === 'TrustBadgeSubtitle') {
      propKey = 'subtitle';
      currentVal = String(p.subtitle ?? '');
    } else if (layer.blockType === 'HookAlertBadge') {
      propKey = 'badge';
      currentVal = String(p.badge ?? '');
    } else if (layer.blockType === 'AdvisorQuoteBox') {
      propKey = 'message';
      currentVal = String(p.message ?? '');
    } else if (layer.blockType === 'WhatsAppCtaButton') {
      propKey = 'whatsAppText';
      currentVal = String(p.whatsAppText ?? '');
    } else if (layer.blockType === 'MotionAdvisorCard') {
      propKey = 'message';
      currentVal = String(p.message ?? '');
    } else {
      propKey = 'title';
      currentVal = String(p.title ?? layer.title);
    }

    setEditingLayerId(layer.id);
    setEditingPropKey(propKey);
    setEditingValue(currentVal);
  };

  const commitInlineEdit = () => {
    if (editingLayerId && onUpdateLayerProps) {
      onUpdateLayerProps(editingLayerId, { [editingPropKey]: editingValue });
    }
    setEditingLayerId(null);
  };

  const handleContextMenu = (e: React.MouseEvent, layer: ImageLayer) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectLayer(layer.id);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
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
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startScale: layer.scale ?? 1,
      startWidth: layer.width ?? 380,
      startHeight: layer.height ?? 200,
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
      // 1. Marquee Drag Selection
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

        if (intersectedIds.length > 0) {
          onSelectMultipleLayers?.(intersectedIds);
        }
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
          let deltaX = (e.clientX - startX) / zoom;
          if (corner === 'w') deltaX = -deltaX;
          const nextWidth = Math.max(120, Math.min(1080, startWidth + deltaX * 2));
          onUpdateWidth?.(resizingLayerId, Math.round(nextWidth));
          return;
        }

        if (corner === 'n' || corner === 's') {
          let deltaY = (e.clientY - startY) / zoom;
          if (corner === 'n') deltaY = -deltaY;
          const nextHeight = Math.max(60, Math.min(1200, startHeight + deltaY * 2));
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
        const nextScale = Math.max(0.35, Math.min(2.5, startScale + delta * 0.006));
        onUpdateScale(resizingLayerId, parseFloat(nextScale.toFixed(2)));
        return;
      }

      if (!draggingLayerId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;

      let nextX = Math.max(5, Math.min(95, dragStartRef.current.layerX + deltaX));
      let nextY = Math.max(5, Math.min(95, dragStartRef.current.layerY + deltaY));

      // Snapping magnético
      const activeLayer = project.layers.find((l) => l.id === draggingLayerId);
      if (activeLayer) {
        const pixelX = (nextX / 100) * project.preset.width;
        const pixelY = (nextY / 100) * project.preset.height;
        const snap = calculateSnapping(
          draggingLayerId,
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

      onUpdatePosition(draggingLayerId, { x: Math.round(nextX * 10) / 10, y: Math.round(nextY * 10) / 10 });
    };

    const handleMouseUp = () => {
      if (draggingLayerId || resizingLayerId || rotatingLayerId) {
        onCommitPositionChange?.();
      }
      setDraggingLayerId(null);
      setResizingLayerId(null);
      setRotatingLayerId(null);
      setIsMarqueeSelecting(false);
      setMarqueeBox(null);
      setGuides([]);
    };

    if (draggingLayerId || resizingLayerId || rotatingLayerId || isMarqueeSelecting) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingLayerId, resizingLayerId, rotatingLayerId, isMarqueeSelecting, marqueeBox, zoom, project.layers, project.preset.width, project.preset.height, onSelectMultipleLayers, onUpdatePosition, onUpdateScale, onUpdateWidth, onUpdateHeight, onUpdateRotation, onCommitPositionChange, canvasRef]);

  const handleResetFit = () => {
    onSetZoom(0.55);
    setPanOffset({ x: 0, y: 0 });
  };

  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId);

  return (
    <div
      ref={containerRef}
      onClick={onDeselectAll}
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#050B14] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] p-8 select-none cursor-grab active:cursor-grabbing"
    >
      {/* FLOATING QUICK TOOLBAR (ABOVE CANVAS) */}
      {selectedLayer && (
        <div className="absolute top-4 z-40" onClick={(e) => e.stopPropagation()}>
          <ImageQuickToolbar
            layer={selectedLayer}
            onDuplicate={onDuplicateLayer}
            onRemove={onRemoveLayer}
            onScaleChange={onUpdateScale}
            onCenter={(id) => onUpdatePosition(id, { x: 50, y: 50 })}
            onUngroup={onUngroupLayer}
            onFitToCanvas={onFitToCanvas}
          />
        </div>
      )}

      {/* RIGHT-CLICK CONTEXT MENU */}
      {contextMenu && (
        <div
          style={{ left: contextMenu.x, top: contextMenu.y }}
          className="fixed z-50 min-w-[220px] rounded-2xl border border-slate-700 bg-slate-950/95 p-1.5 shadow-2xl backdrop-blur-xl animate-fadeIn text-xs text-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            {contextMenu.layer.title}
          </div>

          {['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard'].includes(contextMenu.layer.blockType ?? '') && onUngroupLayer && (
            <button
              type="button"
              onClick={() => {
                onUngroupLayer(contextMenu.layer.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Ungroup className="size-4 text-amber-400" />
              <span>Desagrupar en Elementos Libres</span>
            </button>
          )}

          {onFitToCanvas && (
            <button
              type="button"
              onClick={() => {
                onFitToCanvas(contextMenu.layer.id);
                setContextMenu(null);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Maximize2 className="size-4 text-primary" />
              <span>Auto-Ajustar al Lienzo</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onDuplicateLayer(contextMenu.layer.id);
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Copy className="size-4 text-slate-400" />
            <span>Duplicar Capa</span>
          </button>

          <div className="my-1 border-t border-slate-800" />

          <button
            type="button"
            onClick={() => {
              onRemoveLayer(contextMenu.layer.id);
              setContextMenu(null);
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 transition-colors"
          >
            <Trash2 className="size-4 text-rose-400" />
            <span>Eliminar Capa</span>
          </button>
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

            const getBlockWidth = (blockType?: string, customWidth?: number) => {
              if (customWidth) return `${customWidth}px`;
              switch (blockType) {
                case 'MotionAdvisorCard':
                  return '380px';
                case 'GlassCardSurface':
                  return blockProps.width ? `${blockProps.width}px` : '440px';
                case 'MotionTrustBadge':
                  return '420px';
                case 'MotionComparisonCard':
                case 'MotionProviderGrid':
                  return '440px';
                case 'HookAlertBadge':
                  return 'auto';
                case 'AdvisorAvatarBadge':
                  return '340px';
                case 'AdvisorQuoteBox':
                  return '340px';
                case 'WhatsAppCtaButton':
                  return '340px';
                case 'ProviderGridHeader':
                  return '380px';
                case 'ProviderBadge':
                  return '185px';
                case 'TrustShieldIcon':
                  return 'auto';
                case 'TrustBadgeTitle':
                  return '380px';
                case 'TrustBadgeSubtitle':
                  return '380px';
                case 'ComparisonHeader':
                  return '380px';
                case 'ComparisonWrongBox':
                case 'ComparisonCorrectBox':
                  return '380px';
                default:
                  return '420px';
              }
            };

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
                onDoubleClick={(e) => handleLayerDoubleClick(e, layer)}
                onContextMenu={(e) => handleContextMenu(e, layer)}
                onMouseEnter={() => setHoveredLayerId(layer.id)}
                onMouseLeave={() => setHoveredLayerId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer(layer.id, e.shiftKey || e.metaKey || e.ctrlKey);
                }}
                className={`canvas-layer-item absolute transition-shadow select-none shrink-0 ${getClipClass(
                  layer.clipShape
                )} ${
                  isLocked ? 'cursor-default' : 'cursor-move'
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
                  transform: `translate(-50%, -50%) rotate(${layer.rotation ?? 0}deg) scale(${layer.scale ?? 1})`,
                  zIndex: layer.zIndex,
                  width: getBlockWidth(layer.blockType, layer.width),
                  minWidth: getBlockWidth(layer.blockType, layer.width) === 'auto' ? 'auto' : getBlockWidth(layer.blockType, layer.width),
                  maxWidth: 'none',
                  height: layer.height ? `${layer.height}px` : 'auto',
                  minHeight: layer.height ? `${layer.height}px` : 'auto',
                  flexShrink: 0,
                  filter: getFilterStyle(layer.filter, layer.brightness, layer.contrast, layer.blur),
                }}
              >
                {/* INLINE DIRECT TEXT EDITOR OVERLAY */}
                {editingLayerId === layer.id && (
                  <div
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#001219]/95 p-3 rounded-2xl border-2 border-brand-cyan shadow-2xl backdrop-blur-md animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="w-full text-left text-[10px] font-bold text-brand-cyan mb-1 flex items-center justify-between">
                      <span>Editando {editingPropKey}...</span>
                      <span className="text-slate-400 font-mono text-[9px]">[Enter] guardar · [Esc] salir</span>
                    </div>
                    <textarea
                      autoFocus
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          commitInlineEdit();
                        } else if (e.key === 'Escape') {
                          setEditingLayerId(null);
                        }
                      }}
                      onBlur={commitInlineEdit}
                      className="w-full h-full resize-none rounded-xl bg-slate-900/90 p-2.5 font-display text-sm font-bold text-white outline-none ring-1 ring-teal-500/50 shadow-inner"
                      rows={3}
                    />
                  </div>
                )}
                {/* RENDER BLOCK TYPES */}
                {layer.blockType === 'GlassCardSurface' && (
                  <div
                    className="w-full rounded-3xl border border-teal-500/30 bg-[#001219]/90 shadow-2xl backdrop-blur-xl pointer-events-none"
                    style={{
                      width: '100%',
                      height: layer.height ? `${layer.height}px` : `${blockProps.height ?? 380}px`,
                      boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 95, 115, 0.2)',
                    }}
                  />
                )}

                {layer.blockType === 'MotionAdvisorCard' && (
                  <MotionAdvisorCard
                    name={String(blockProps.name ?? 'Sofía')}
                    role={String(blockProps.role ?? 'Asesora')}
                    badge={String(blockProps.badge ?? 'EN DIRECTO')}
                    message={String(blockProps.message ?? '')}
                    avatarUrl={blockProps.avatarUrl ? String(blockProps.avatarUrl) : undefined}
                    whatsAppText={String(blockProps.whatsAppText ?? 'WhatsApp')}
                    tokens={project.brandTokens}
                    className="!max-w-none !w-full !h-full"
                    style={{ maxWidth: 'none', width: '100%', height: '100%' }}
                  />
                )}

                {layer.blockType === 'HookAlertBadge' && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-950/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#94D2BD] shadow-lg backdrop-blur-md">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    <span>{String(blockProps.badge ?? 'ASESORA ASIGNADA · EN DIRECTO')}</span>
                  </div>
                )}

                {layer.blockType === 'AdvisorAvatarBadge' && (
                  <div className="flex flex-col items-center text-center w-full">
                    <div className="relative mb-2">
                      <div className="flex size-20 items-center justify-center rounded-full border-2 border-amber-500 bg-[#005F73] text-2xl font-black text-white shadow-xl ring-4 ring-amber-500/25 overflow-hidden">
                        {blockProps.avatarUrl ? (
                          <img src={String(blockProps.avatarUrl)} alt={String(blockProps.name ?? 'Asesor')} className="size-full object-cover" />
                        ) : (
                          <span>{String(blockProps.name ?? 'A').charAt(0)}</span>
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-[#001219] translate-x-1 translate-y-0.5">
                        <ShieldCheck className="size-3.5" />
                      </div>
                    </div>
                    <div className="mt-1.5 space-y-0.5">
                      <h3 className="font-display text-xl font-black text-white tracking-tight leading-tight">
                        {String(blockProps.name ?? 'Sofía')}
                      </h3>
                      <p className="text-xs font-bold text-[#94D2BD]">
                        {String(blockProps.role ?? 'Asesora Especialista en Visados')}
                      </p>
                    </div>
                  </div>
                )}

                {layer.blockType === 'AdvisorQuoteBox' && (
                  <div className="w-full rounded-2xl border border-teal-500/20 bg-slate-950/70 p-4 text-center shadow-inner backdrop-blur-md">
                    <p className="text-xs font-medium italic text-slate-200 leading-relaxed">
                      "{String(blockProps.message ?? '')}"
                    </p>
                  </div>
                )}

                {layer.blockType === 'WhatsAppCtaButton' && (
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageSquare className="size-4 fill-white" />
                    <span>{String(blockProps.whatsAppText ?? 'Pregúntanos por WhatsApp')}</span>
                  </button>
                )}

                {/* SUBCAPAS DE GRID DE ASEGURADORAS */}
                {layer.blockType === 'ProviderGridHeader' && (
                  <div className="flex flex-col items-center text-center w-full">
                    <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-teal-900/40 text-teal-400">
                      <Building2 className="size-5" />
                    </div>
                    <h3 className="font-display text-base font-black text-white tracking-tight">
                      {String(blockProps.title ?? 'COMPAÑÍAS LÍDERES AUTORIZADAS')}
                    </h3>
                    <p className="mt-1 text-xs text-[#94D2BD]">
                      {String(blockProps.subtitle ?? 'Aceptadas oficialmente por Extranjería y Consulados')}
                    </p>
                  </div>
                )}

                {layer.blockType === 'ProviderBadge' && (
                  <div className={`flex w-full flex-col items-center justify-center rounded-2xl border p-3.5 transition-all ${
                    blockProps.color === '#EE9B00' || blockProps.highlight
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-md'
                      : 'border-white/10 bg-white/5 text-white'
                  }`}>
                    <strong className="font-display text-sm font-black tracking-wider uppercase">
                      {String(blockProps.name ?? 'ASEGURADORA')}
                    </strong>
                    {Boolean(blockProps.badge) && (
                      <span className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold ${
                        blockProps.color === '#EE9B00' || Boolean(blockProps.highlight)
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                          : 'bg-white/10 text-teal-300'
                      }`}>
                        <Check className="size-2.5" />
                        <span>{String(blockProps.badge)}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* SUBCAPAS DE TRUST BADGE */}
                {layer.blockType === 'TrustShieldIcon' && (
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-inner">
                    <Shield className="size-7" />
                  </div>
                )}

                {layer.blockType === 'TrustBadgeTitle' && (
                  <h3 className="font-display text-lg font-black text-white tracking-tight leading-snug text-center w-full">
                    {String(blockProps.title ?? 'PÓLIZA 100% VÁLIDA PARA VISADO')}
                  </h3>
                )}

                {layer.blockType === 'TrustBadgeSubtitle' && (
                  <p className="text-xs font-semibold text-[#94D2BD] leading-relaxed text-center w-full">
                    {String(blockProps.subtitle ?? 'Sin Copagos · Cobertura Completa · Repatriación Incluida')}
                  </p>
                )}

                {/* SUBCAPAS DE COMPARISON CARD */}
                {layer.blockType === 'ComparisonHeader' && (
                  <h3 className="font-display text-sm font-black text-white tracking-tight uppercase text-center w-full">
                    {String(blockProps.title ?? '¿SEGURO DE VIAJE O SEGURO DE VISADO?')}
                  </h3>
                )}

                {layer.blockType === 'ComparisonWrongBox' && (
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-3.5 text-left w-full">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
                      <span className="flex size-4 items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-black">
                        <X className="size-3" />
                      </span>
                      <span>{String(blockProps.wrongOptionTitle ?? 'Seguro de Viaje Común')}</span>
                    </div>
                    <p className="text-[11px] text-rose-200/80 leading-relaxed pl-6">
                      {String(blockProps.wrongOptionDesc ?? '')}
                    </p>
                  </div>
                )}

                {layer.blockType === 'ComparisonCorrectBox' && (
                  <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-3.5 shadow-md text-left w-full">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px] font-black">
                        <Check className="size-3" />
                      </span>
                      <span>{String(blockProps.correctOptionTitle ?? 'Seguro VitaBlue Extranjería')}</span>
                    </div>
                    <p className="text-[11px] text-emerald-100 font-medium leading-relaxed pl-6">
                      {String(blockProps.correctOptionDesc ?? '')}
                    </p>
                  </div>
                )}

                {/* BLOQUES MOTION KIT ORIGINALES (AGRUPADOS) */}
                {layer.blockType === 'MotionTrustBadge' && (
                  <MotionTrustBadge
                    title={String(blockProps.title ?? 'PÓLIZA 100% VÁLIDA PARA VISADO')}
                    subtitle={String(blockProps.subtitle ?? 'Sin Copagos · Cobertura Completa')}
                    highlight={String(blockProps.highlight ?? 'GARANTÍA CONSULAR')}
                    verifiedLabel={String(blockProps.verifiedLabel ?? 'VERIFICADO')}
                    tokens={project.brandTokens}
                    className="!max-w-none !w-full !h-full"
                    style={{ maxWidth: 'none', width: '100%', height: '100%' }}
                  />
                )}

                {layer.blockType === 'MotionProviderGrid' && (
                  <MotionProviderGrid
                    title={String(blockProps.title ?? 'Aseguradoras Líderes')}
                    subtitle={blockProps.subtitle ? String(blockProps.subtitle) : undefined}
                    tokens={project.brandTokens}
                    className="!max-w-none !w-full !h-full"
                    style={{ maxWidth: 'none', width: '100%', height: '100%' }}
                  />
                )}

                {layer.blockType === 'MotionComparisonCard' && (
                  <MotionComparisonCard
                    title={String(blockProps.title ?? '')}
                    wrongOptionTitle={String(blockProps.wrongOptionTitle ?? '')}
                    wrongOptionDesc={String(blockProps.wrongOptionDesc ?? '')}
                    correctOptionTitle={String(blockProps.correctOptionTitle ?? '')}
                    correctOptionDesc={String(blockProps.correctOptionDesc ?? '')}
                    tokens={project.brandTokens}
                    className="!max-w-none !w-full !h-full"
                    style={{ maxWidth: 'none', width: '100%', height: '100%' }}
                  />
                )}

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
                      className="absolute top-1/2 -left-2 -translate-y-1/2 h-5 w-2 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-ew-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para cambiar el ancho (Width)"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 'e')}
                      className="absolute top-1/2 -right-2 -translate-y-1/2 h-5 w-2 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-ew-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para cambiar el ancho (Width)"
                    />

                    {/* SUPERIOR E INFERIOR: AJUSTE DE ALTURA (HEIGHT) */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 'n')}
                      className="absolute -top-2 left-1/2 -translate-x-1/2 h-2 w-5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-ns-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para cambiar el alto (Height)"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer, 's')}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-2 w-5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-ns-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para cambiar el alto (Height)"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM CONTROLS BAR: ZOOM & SAFE ZONES */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 backdrop-blur-md z-40 text-white text-xs">
        <button
          type="button"
          onClick={() => onSetZoom(Math.max(0.25, zoom - 0.1))}
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
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
          className="w-16 accent-primary"
        />

        <button
          type="button"
          onClick={() => onSetZoom(Math.min(1.5, zoom + 0.1))}
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Aumentar zoom"
        >
          <Plus className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={handleResetFit}
          className="flex items-center gap-1 rounded bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-200 hover:bg-slate-700 transition-colors"
          title="Centrar y ajustar al lienzo"
        >
          <Maximize2 className="size-3 text-brand-cyan" />
          <span>Ajustar</span>
        </button>
      </div>
    </div>
  );
};
