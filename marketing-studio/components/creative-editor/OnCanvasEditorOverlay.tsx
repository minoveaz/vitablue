import React, { useState, useRef } from 'react';
import type { Scene, Layer, TextLayer, SubtitleLayer } from '../../../packages/video-studio/src/domain/videoProject';
import { resolveLayerPosition } from '../../../packages/video-studio/src/domain/videoProject';
import { FloatingLayerToolbar } from './FloatingLayerToolbar';
import { InlineTextEditor } from './InlineTextEditor';

export interface OnCanvasEditorOverlayProps {
  scene: Scene | undefined;
  selectedLayerId: string | undefined;
  onSelectLayer: (layerId: string | undefined) => void;
  onUpdateLayer: (sceneId: string, layerId: string, changes: Partial<Layer>) => void;
  onUpdateLayerPosition: (sceneId: string, layerId: string, pos: { x: number; y: number }) => void;
  onDuplicateLayer: (sceneId: string, layerId: string) => void;
  onDeleteLayer: (sceneId: string, layerId: string) => void;
  onReorderLayer: (sceneId: string, layerId: string, direction: 'up' | 'down') => void;
}

export const OnCanvasEditorOverlay: React.FC<OnCanvasEditorOverlayProps> = ({
  scene,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onUpdateLayerPosition,
  onDuplicateLayer,
  onDeleteLayer,
  onReorderLayer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [snapGuideX, setSnapGuideX] = useState<number | null>(null);
  const [snapGuideY, setSnapGuideY] = useState<number | null>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);

  if (!scene) return null;

  const handlePointerDown = (e: React.PointerEvent, layer: Layer) => {
    e.stopPropagation();
    if (layer.locked) return;
    onSelectLayer(layer.id);

    const container = containerRef.current;
    if (!container) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingLayerId(layer.id);

    const pos = resolveLayerPosition('position' in layer ? layer.position : undefined);
    setDragPos(pos);
  };

  const handlePointerMove = (e: React.PointerEvent, layer: Layer) => {
    if (draggingLayerId !== layer.id || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let rawX = ((e.clientX - rect.left) / rect.width) * 100;
    let rawY = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamping dentro del canvas (5% a 95%)
    rawX = Math.max(5, Math.min(95, rawX));
    rawY = Math.max(5, Math.min(95, rawY));

    // Magnetic Snapping Guides (Centro horizontal 50% y vertical 50%)
    let snappedX = rawX;
    let snappedY = rawY;

    if (Math.abs(rawX - 50) < 3) {
      snappedX = 50;
      setSnapGuideX(50);
    } else {
      setSnapGuideX(null);
    }

    if (Math.abs(rawY - 50) < 3) {
      snappedY = 50;
      setSnapGuideY(50);
    } else {
      setSnapGuideY(null);
    }

    const newPos = { x: Math.round(snappedX), y: Math.round(snappedY) };
    setDragPos(newPos);
    onUpdateLayerPosition(scene.id, layer.id, newPos);
  };

  const handlePointerUp = (e: React.PointerEvent, layer: Layer) => {
    if (draggingLayerId === layer.id) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignorar si el puntero ya no está capturado
      }
      setDraggingLayerId(null);
      setSnapGuideX(null);
      setSnapGuideY(null);
    }
  };

  const editingLayer = scene.layers.find((l) => l.id === editingLayerId);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-30"
    >
      {/* GUÍAS MAGNÉTICAS INTELIGENTES (SMART GUIDES) */}
      {snapGuideX !== null && (
        <div
          className="absolute inset-y-0 w-0.5 border-l-2 border-dashed border-rose-500 z-40 pointer-events-none"
          style={{ left: `${snapGuideX}%` }}
        />
      )}
      {snapGuideY !== null && (
        <div
          className="absolute inset-x-0 h-0.5 border-t-2 border-dashed border-rose-500 z-40 pointer-events-none"
          style={{ top: `${snapGuideY}%` }}
        />
      )}

      {/* RENDERIZADO DE CAPAS INTERACTIVAS (EXCLUYE AUDIO) */}
      {scene.layers
        .filter((l) => l.visible !== false && l.type !== 'audio')
        .map((layer) => {
          const isSelected = selectedLayerId === layer.id;
          const pos = draggingLayerId === layer.id && dragPos ? dragPos : resolveLayerPosition('position' in layer ? layer.position : undefined);

          return (
            <div
              key={layer.id}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onPointerDown={(e) => handlePointerDown(e, layer)}
              onPointerMove={(e) => handlePointerMove(e, layer)}
              onPointerUp={(e) => handlePointerUp(e, layer)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (layer.type === 'text' || layer.type === 'subtitle') {
                  setEditingLayerId(layer.id);
                }
              }}
              role="group"
              tabIndex={0}
              aria-label={`Seleccionar capa ${'title' in layer ? layer.title : layer.type}`}
              aria-current={isSelected ? 'true' : undefined}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectLayer(layer.id);
                } else if (event.key.startsWith('Arrow') && !layer.locked) {
                  event.preventDefault();
                  const delta = event.shiftKey ? 5 : 1;
                  const current = resolveLayerPosition('position' in layer ? layer.position : undefined);
                  const next = {
                    x: Math.max(0, Math.min(100, current.x + (event.key === 'ArrowLeft' ? -delta : event.key === 'ArrowRight' ? delta : 0))),
                    y: Math.max(0, Math.min(100, current.y + (event.key === 'ArrowUp' ? -delta : event.key === 'ArrowDown' ? delta : 0))),
                  };
                  onUpdateLayerPosition(scene.id, layer.id, next);
                }
              }}
              className={`absolute pointer-events-auto cursor-move transition-shadow duration-75 p-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
                isSelected
                  ? 'border-2 border-primary ring-4 ring-primary/20 shadow-2xl bg-primary/5'
                  : 'hover:border hover:border-dashed hover:border-brand-cyan/60'
              }`}
            >
              {/* CORNER RESIZE HANDLES (TIRADORES DE ESQUINA) */}
              {isSelected && (
                <>
                  <div className="absolute -top-1.5 -left-1.5 size-3 rounded-xs border-2 border-primary bg-white shadow-xs" />
                  <div className="absolute -top-1.5 -right-1.5 size-3 rounded-xs border-2 border-primary bg-white shadow-xs" />
                  <div className="absolute -bottom-1.5 -left-1.5 size-3 rounded-xs border-2 border-primary bg-white shadow-xs" />
                  <div className="absolute -bottom-1.5 -right-1.5 size-3 rounded-xs border-2 border-primary bg-white shadow-xs" />

                  {/* BARRA FLOTANTE DE ACCIONES */}
                  <FloatingLayerToolbar
                    layer={layer}
                    onUpdateLayer={(changes) => onUpdateLayer(scene.id, layer.id, changes)}
                    onDuplicateLayer={() => onDuplicateLayer(scene.id, layer.id)}
                    onDeleteLayer={() => onDeleteLayer(scene.id, layer.id)}
                    onReorderLayer={(dir) => onReorderLayer(scene.id, layer.id, dir)}
                  />
                </>
              )}

              {/* ÁREA DE CONTENIDO FANTASMA (DETECCIÓN DE HITBOX) */}
              <div className="min-w-[120px] min-h-[36px] flex items-center justify-center pointer-events-none">
                {layer.type === 'text' && (
                  <span className="text-transparent font-bold text-xs select-none">
                    {(layer as TextLayer).text}
                  </span>
                )}
                {layer.type === 'subtitle' && (
                  <span className="text-transparent font-black text-xs select-none">
                    {(layer as SubtitleLayer).text}
                  </span>
                )}
                {layer.type === 'component' && (
                  <div className="w-48 h-16 rounded-lg border border-transparent" />
                )}
                {layer.type === 'shape' && (
                  <div className="w-32 h-10 rounded-lg border border-transparent" />
                )}
              </div>
            </div>
          );
        })}

      {/* EDITOR INLINE ACTIVADO POR DOBLE CLIC */}
      {editingLayer && (editingLayer.type === 'text' || editingLayer.type === 'subtitle') && (
        <div className="pointer-events-auto">
          <InlineTextEditor
            layer={editingLayer as TextLayer | SubtitleLayer}
            onSave={(newText) => {
              onUpdateLayer(scene.id, editingLayer.id, { text: newText });
              setEditingLayerId(null);
            }}
            onCancel={() => setEditingLayerId(null)}
          />
        </div>
      )}
    </div>
  );
};
