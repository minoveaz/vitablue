import React, { useRef, useState, useEffect } from 'react';
import {
  ImageProject,
  ImageLayer,
} from '../../types/imageStudio';
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
} from 'lucide-react';

interface ImageStageProps {
  project: ImageProject;
  selectedLayerId: string | null;
  isCanvasSelected: boolean;
  zoom: number;
  showSafeZones: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onSelectLayer: (id: string) => void;
  onSelectCanvas: () => void;
  onDeselectAll: () => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateScale: (id: string, scale: number) => void;
  onDuplicateLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onSetZoom: (zoom: number) => void;
}

export const ImageStage: React.FC<ImageStageProps> = ({
  project,
  selectedLayerId,
  isCanvasSelected,
  zoom,
  showSafeZones,
  canvasRef,
  onSelectLayer,
  onSelectCanvas,
  onDeselectAll,
  onUpdatePosition,
  onUpdateScale,
  onDuplicateLayer,
  onRemoveLayer,
  onSetZoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [resizingLayerId, setResizingLayerId] = useState<string | null>(null);

  const dragStartRef = useRef<{ x: number; y: number; layerX: number; layerY: number }>({
    x: 0,
    y: 0,
    layerX: 50,
    layerY: 50,
  });

  const resizeStartRef = useRef<{ startX: number; startY: number; startScale: number }>({
    startX: 0,
    startY: 0,
    startScale: 1,
  });

  // 1. GESTOS DE TRACKPAD (PINCH TO ZOOM & TWO-FINGER PAN)
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const handleWheel = (e: WheelEvent) => {
      // Gesto de pellizco (Pinch-to-zoom en Trackpad de macOS/Windows genera e.ctrlKey o e.metaKey)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
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

  const handleMouseDown = (e: React.MouseEvent, layer: ImageLayer) => {
    e.stopPropagation();
    onSelectLayer(layer.id);
    setDraggingLayerId(layer.id);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      layerX: layer.position.x,
      layerY: layer.position.y,
    };
  };

  const handleResizeStart = (e: React.MouseEvent, layer: ImageLayer) => {
    e.stopPropagation();
    onSelectLayer(layer.id);
    setResizingLayerId(layer.id);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startScale: layer.scale ?? 1,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingLayerId) {
        const deltaX = e.clientX - resizeStartRef.current.startX;
        const deltaY = e.clientY - resizeStartRef.current.startY;
        const delta = (deltaX + deltaY) / 2;
        const nextScale = Math.max(0.35, Math.min(2.2, resizeStartRef.current.startScale + delta * 0.006));
        onUpdateScale(resizingLayerId, parseFloat(nextScale.toFixed(2)));
        return;
      }

      if (!draggingLayerId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;

      const nextX = Math.max(5, Math.min(95, dragStartRef.current.layerX + deltaX));
      const nextY = Math.max(5, Math.min(95, dragStartRef.current.layerY + deltaY));

      onUpdatePosition(draggingLayerId, { x: Math.round(nextX), y: Math.round(nextY) });
    };

    const handleMouseUp = () => {
      setDraggingLayerId(null);
      setResizingLayerId(null);
    };

    if (draggingLayerId || resizingLayerId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingLayerId, resizingLayerId, onUpdatePosition, onUpdateScale, canvasRef]);

  const handleResetFit = () => {
    onSetZoom(0.55);
    setPanOffset({ x: 0, y: 0 });
  };

  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId);

  // Compute aspect ratio dimensions
  const aspectWidth = project.preset.width;
  const aspectHeight = project.preset.height;
  const baseWidth = 540;
  const computedHeight = (baseWidth * aspectHeight) / aspectWidth;

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
          />
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
        {/* BADGE DE LIENZO ACTIVO */}
        {isCanvasSelected && (
          <div className="absolute -top-6 left-0 flex items-center gap-1.5 text-[10px] font-mono font-bold text-brand-cyan tracking-wide animate-fadeIn">
            <span className="inline-block size-1.5 rounded-full bg-brand-cyan animate-pulse" />
            <span>Lienzo ({project.preset.name} · {project.preset.aspectRatio})</span>
          </div>
        )}

        <div
          ref={canvasRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelectCanvas();
          }}
          className={`relative overflow-hidden rounded-none transition-all cursor-default ${
            isCanvasSelected
              ? 'ring-2 ring-brand-cyan ring-offset-2 ring-offset-slate-950 shadow-[0_0_50px_rgba(148,210,189,0.25),0_0_0_1px_rgba(148,210,189,0.8)]'
              : 'border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.85)]'
          }`}
          style={{
            width: `${baseWidth}px`,
            height: `${computedHeight}px`,
            background: project.background.gradient ?? project.background.color ?? '#001219',
          }}
        >
          {/* SAFE ZONES OVERLAY */}
          {showSafeZones && (
            <div className="pointer-events-none absolute inset-0 z-50 border-2 border-dashed border-amber-400/60 p-8">
              <div className="flex justify-between text-[10px] font-mono font-bold text-amber-400">
                <span>Safe Margin Top</span>
                <span>Instagram / TikTok Area</span>
              </div>
              <div className="absolute bottom-4 left-8 text-[10px] font-mono font-bold text-amber-400">
                Safe Margin Bottom
              </div>
            </div>
          )}

          {/* RENDER LAYERS */}
          {project.layers.map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            const blockProps = layer.props as Record<string, unknown>;

            const getBlockWidth = (blockType?: string) => {
              switch (blockType) {
                case 'MotionAdvisorCard':
                  return '380px';
                case 'MotionTrustBadge':
                  return '420px';
                case 'MotionComparisonCard':
                case 'MotionProviderGrid':
                  return '460px';
                default:
                  return '420px';
              }
            };

            return (
              <div
                key={layer.id}
                onMouseDown={(e) => handleMouseDown(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer(layer.id);
                }}
                className={`absolute cursor-move transition-shadow select-none shrink-0 ${
                  isSelected
                    ? 'ring-2 ring-brand-cyan ring-offset-2 ring-offset-transparent shadow-2xl'
                    : 'hover:ring-1 hover:ring-white/40'
                }`}
                style={{
                  left: `${layer.position.x}%`,
                  top: `${layer.position.y}%`,
                  transform: `translate(-50%, -50%) scale(${layer.scale ?? 1})`,
                  zIndex: layer.zIndex,
                  width: getBlockWidth(layer.blockType),
                  minWidth: getBlockWidth(layer.blockType),
                  maxWidth: 'none',
                  flexShrink: 0,
                }}
              >
                {/* RENDER BLOCK TYPES */}
                {layer.blockType === 'MotionAdvisorCard' && (
                  <MotionAdvisorCard
                    name={String(blockProps.name ?? 'Sofía')}
                    role={String(blockProps.role ?? 'Asesora')}
                    badge={String(blockProps.badge ?? 'EN DIRECTO')}
                    message={String(blockProps.message ?? '')}
                    avatarUrl={blockProps.avatarUrl ? String(blockProps.avatarUrl) : undefined}
                    whatsAppText={String(blockProps.whatsAppText ?? 'WhatsApp')}
                    tokens={project.brandTokens}
                  />
                )}

                {layer.blockType === 'MotionTrustBadge' && (
                  <MotionTrustBadge
                    title={String(blockProps.title ?? '')}
                    subtitle={String(blockProps.subtitle ?? '')}
                    highlight={String(blockProps.highlight ?? '')}
                    verifiedLabel={String(blockProps.verifiedLabel ?? '')}
                    tokens={project.brandTokens}
                  />
                )}

                {layer.blockType === 'MotionProviderGrid' && (
                  <MotionProviderGrid
                    title={String(blockProps.title ?? '')}
                    subtitle={String(blockProps.subtitle ?? '')}
                    tokens={project.brandTokens}
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
                  />
                )}

                {/* BOUNDING BOX CORNER HANDLES CON ARRASTRE DE REDIMENSIÓN */}
                {isSelected && (
                  <>
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer)}
                      className="absolute -top-2 -left-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                      title="Arrastrar para redimensionar"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer)}
                      className="absolute -top-2 -right-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                      title="Arrastrar para redimensionar"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer)}
                      className="absolute -bottom-2 -left-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                      title="Arrastrar para redimensionar"
                    />
                    <div
                      onMouseDown={(e) => handleResizeStart(e, layer)}
                      className="absolute -bottom-2 -right-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                      title="Arrastrar para redimensionar"
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
