import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ExternalLink,
  Move,
  RotateCcw,
  Scissors,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { DocumentBoundingBoxes } from '../../types';
import type { FieldKey } from '../../fieldLabels';
import { BoundingBoxOverlay } from './BoundingBoxOverlay';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

export const DocumentViewer: React.FC<{
  file: File | null;
  previewUrl: string | null;
  isPdf: boolean;
  zoom: number;
  rotation: number;
  boundingBoxes?: DocumentBoundingBoxes | null;
  activeField?: FieldKey | null;
  onSelectField?: (fieldKey: FieldKey) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onRotate: () => void;
  onCrop?: () => void;
  onOpenInTab: () => void;
}> = ({
  file,
  previewUrl,
  isPdf,
  zoom,
  rotation,
  boundingBoxes,
  activeField,
  onSelectField,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onRotate,
  onCrop,
  onOpenInTab,
}) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const dragOrigin = useRef({ startX: 0, startY: 0, panX: 0, panY: 0 });

  // Reset pan when resetting zoom or changing file
  const handleFullReset = () => {
    setPan({ x: 0, y: 0 });
    onResetZoom();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragOrigin.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragOrigin.current.startX;
    const dy = e.clientY - dragOrigin.current.startY;
    setPan({
      x: dragOrigin.current.panX + dx,
      y: dragOrigin.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragOrigin.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragOrigin.current.startX;
    const dy = e.touches[0].clientY - dragOrigin.current.startY;
    setPan({
      x: dragOrigin.current.panX + dx,
      y: dragOrigin.current.panY + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const effectiveBoundingBoxes = boundingBoxes ?? null;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setViewportSize({ width, height });
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPdf || !previewUrl || !pdfCanvasRef.current || !viewportSize.width || !viewportSize.height) return;
    let cancelled = false;
    const render = async () => {
      const pdf = await pdfjsLib.getDocument({ url: previewUrl }).promise;
      const page = await pdf.getPage(1);
      const canvas = pdfCanvasRef.current;
      if (!canvas || cancelled) return;
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(
        Math.max(viewportSize.width - 32, 1) / base.width,
        Math.max(viewportSize.height - 32, 1) / base.height,
      );
      const viewport = page.getViewport({ scale: Math.max(scale, 0.1) });
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.ceil(viewport.width * dpr);
      canvas.height = Math.ceil(viewport.height * dpr);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      await page.render({ canvas, canvasContext: canvas.getContext('2d')!, viewport, transform: [dpr, 0, 0, dpr, 0, 0] }).promise;
    };
    void render();
    return () => {
      cancelled = true;
    };
  }, [isPdf, previewUrl, viewportSize]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100 select-none">
      {/* Toolbar Superior Unificado */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Alejar (Zoom -)"
            aria-label="Alejar"
            onClick={onZoomOut}
            className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            <ZoomOut className="size-3.5" />
          </button>

          <button
            type="button"
            title="Restablecer zoom y posición al 100%"
            onClick={handleFullReset}
            className="rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            title="Acercar (Zoom +)"
            aria-label="Acercar"
            onClick={onZoomIn}
            className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            <ZoomIn className="size-3.5" />
          </button>

          <div className="mx-1 h-3.5 w-px bg-slate-200" />

          <button
            type="button"
            title="Girar 90°"
            aria-label="Girar 90°"
            onClick={onRotate}
            className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            <RotateCcw className="size-3.5" />
            {rotation !== 0 && (
              <span className="ml-1 text-[10px] font-semibold text-primary">{rotation}°</span>
            )}
          </button>

          {(pan.x !== 0 || pan.y !== 0 || zoom !== 1 || rotation !== 0) && (
            <button
              type="button"
              title="Centrar y restablecer posición"
              onClick={handleFullReset}
              className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-200 transition-colors ml-1"
            >
              <Move className="size-3 text-primary" /> Centrar
            </button>
          )}

          {onCrop && !isPdf && (
            <button
              type="button"
              title="Recortar documento"
              aria-label="Recortar documento"
              onClick={onCrop}
              className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors ml-1"
            >
              <Scissors className="size-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenInTab}
          className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
          title="Abrir en pestaña nueva"
        >
          <ExternalLink className="size-3.5" /> Abrir pestaña
        </button>
      </div>

      {/* Canvas del Documento con Soporte de Arrastre (Mouse Drag / Pan) */}
      <div
        ref={viewportRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative flex min-h-0 flex-1 w-full items-center justify-center overflow-hidden bg-slate-100 p-4 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Badge indicador de arrastre */}
        <div className="pointer-events-none absolute bottom-2 right-3 z-20 flex items-center gap-1 rounded-md bg-white/80 backdrop-blur-xs px-2 py-0.5 text-[9px] font-medium text-slate-500 shadow-xs border border-slate-200/60">
          <Move className="size-2.5 text-primary" /> Arrastra para mover
        </div>

        {previewUrl ? (
          <div
            className={`flex items-center justify-center origin-center transition-transform ${
              isDragging ? 'transition-none' : 'duration-150'
            }`}
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) rotate(${rotation}deg) scale(${zoom})`,
              maxWidth: viewportSize.width ? `${viewportSize.width - 32}px` : '100%',
              maxHeight: viewportSize.height ? `${viewportSize.height - 32}px` : '100%',
            }}
          >
            {/* Si estamos arrastrando, evitamos interferencias del iframe con pointer-events */}
            {isDragging && <div className="absolute inset-0 z-30" />}

            <div className="relative inline-block max-h-full max-w-full">
              {isPdf ? (
                <canvas ref={pdfCanvasRef} aria-label={file?.name ?? 'Documento PDF'} className="block rounded-lg bg-white shadow-sm" />
              ) : (
                <img
                  src={previewUrl}
                  alt={file?.name ?? 'Documento'}
                  draggable={false}
                  className="block h-auto w-auto max-h-[calc(100vh-280px)] max-w-full object-contain rounded-lg shadow-sm pointer-events-none select-none"
                  style={{
                    maxHeight: viewportSize.height ? `${Math.max(viewportSize.height - 40, 200)}px` : '500px',
                    maxWidth: viewportSize.width ? `${Math.max(viewportSize.width - 40, 200)}px` : '100%',
                  }}
                />
              )}
              <BoundingBoxOverlay
                boundingBoxes={effectiveBoundingBoxes}
                activeField={activeField}
                onBoxClick={onSelectField}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center text-sm text-slate-400">
            Ningún documento seleccionado
          </div>
        )}
      </div>
    </div>
  );
};
