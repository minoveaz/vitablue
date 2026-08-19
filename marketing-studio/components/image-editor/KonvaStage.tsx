import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Transformer, Line, Group } from 'react-konva';
import Konva from 'konva';
import { ImageProject, ImageLayer } from '../../types/imageStudio';
import { KonvaTextNode } from './konva/KonvaTextNode';
import { KonvaShapeNode } from './konva/KonvaShapeNode';
import { KonvaImageNode } from './konva/KonvaImageNode';
import { KonvaMotionCardNode } from './konva/KonvaMotionCardNode';
import { calculateSnapping, SnapGuideLine } from '../../hooks/useKonvaSnapping';
import {
  Minus,
  Plus,
  Maximize2,
} from 'lucide-react';

export interface KonvaStageProps {
  project: ImageProject;
  selectedLayerId: string | null;
  isCanvasSelected: boolean;
  zoom: number;
  showSafeZones: boolean;
  stageRef: React.RefObject<Konva.Stage | null>;
  onSelectLayer: (id: string | null) => void;
  onSelectCanvas: () => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateScale?: (id: string, scale: number) => void;
  onUpdateWidth?: (id: string, width?: number) => void;
  onUpdateHeight?: (id: string, height?: number) => void;
  onUpdateRotation?: (id: string, rotation: number) => void;
  onCommitChange: () => void;
  onSetZoom: (zoom: number) => void;
}

export const KonvaStage: React.FC<KonvaStageProps> = ({
  project,
  selectedLayerId,
  zoom,
  showSafeZones,
  stageRef,
  onSelectLayer,
  onSelectCanvas,
  onUpdatePosition,
  onUpdateWidth,
  onUpdateHeight,
  onUpdateRotation,
  onCommitChange,
  onSetZoom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [guides, setGuides] = useState<SnapGuideLine[]>([]);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasWidth = project.preset.width;
  const canvasHeight = project.preset.height;

  // Spacebar pan listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressed && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSpacePressed]);

  // Attach transformer to selected layer node
  useEffect(() => {
    if (!stageRef.current || !transformerRef.current) return;
    if (!selectedLayerId) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }

    const stage = stageRef.current;
    const selectedNode = stage.findOne(`#${selectedLayerId}`);
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedLayerId, project.layers, stageRef]);

  // Drag handlers with magnetic snapping
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>, layer: ImageLayer) => {
    const node = e.target;
    const targetX = node.x();
    const targetY = node.y();
    const layerW = layer.width ?? 380;
    const layerH = layer.height ?? 200;

    const snap = calculateSnapping(
      layer.id,
      targetX,
      targetY,
      layerW,
      layerH,
      canvasWidth,
      canvasHeight,
      project.layers
    );

    node.x(snap.x);
    node.y(snap.y);
    setGuides(snap.guides);

    // Convert pixel coordinates to percentage for state
    const percentX = (snap.x / canvasWidth) * 100;
    const percentY = (snap.y / canvasHeight) * 100;
    onUpdatePosition(layer.id, {
      x: Math.round(percentX * 10) / 10,
      y: Math.round(percentY * 10) / 10,
    });
  };

  const handleDragEnd = () => {
    setGuides([]);
    onCommitChange();
  };

  // Transform end handler (Resize + Rotation)
  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>, layer: ImageLayer) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = Math.round(node.rotation());

    // Reset node scale and apply to width/height
    node.scaleX(1);
    node.scaleY(1);

    const currentW = layer.width ?? 380;
    const currentH = layer.height ?? 200;
    const nextW = Math.max(40, Math.round(currentW * scaleX));
    const nextH = Math.max(30, Math.round(currentH * scaleY));

    if (onUpdateWidth) onUpdateWidth(layer.id, nextW);
    if (onUpdateHeight) onUpdateHeight(layer.id, nextH);
    if (onUpdateRotation) onUpdateRotation(layer.id, rotation);

    onCommitChange();
  };

  // Panning handlers
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (isSpacePressed || e.button === 1) {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handleContainerMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      className={`relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#001219] bg-[radial-gradient(#005F73_1px,transparent_1px)] [background-size:24px_24px] p-8 select-none ${
        isSpacePressed ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* ZOOM & PAN CONTROLS OVERLAY */}
      <div className="absolute bottom-6 left-6 z-40 flex items-center gap-1.5 rounded-2xl border border-teal-500/30 bg-[#001219]/95 p-1.5 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => onSetZoom(Math.max(0.15, zoom - 0.1))}
          className="flex size-8 items-center justify-center rounded-xl bg-teal-950/60 text-slate-300 hover:bg-teal-900/60 hover:text-white transition-colors"
          title="Alejar (Zoom Out)"
        >
          <Minus className="size-4" />
        </button>
        <span className="min-w-[54px] text-center font-mono text-xs font-bold text-brand-cyan">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={() => onSetZoom(Math.min(3, zoom + 0.1))}
          className="flex size-8 items-center justify-center rounded-xl bg-teal-950/60 text-slate-300 hover:bg-teal-900/60 hover:text-white transition-colors"
          title="Acercar (Zoom In)"
        >
          <Plus className="size-4" />
        </button>
        <div className="mx-1 h-4 w-px bg-slate-800" />
        <button
          type="button"
          onClick={() => {
            onSetZoom(0.65);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="flex items-center gap-1 rounded-xl bg-teal-950/60 px-2.5 py-1.5 text-xs font-bold text-slate-300 hover:bg-teal-900/60 hover:text-white transition-colors"
          title="Ajustar Lienzo a Pantalla"
        >
          <Maximize2 className="size-3.5 text-brand-cyan" />
          <span>Ajustar</span>
        </button>
      </div>

      {/* CANVAS STAGE (KONVA) */}
      <div
        className="relative transition-transform duration-75 ease-out shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
        style={{
          transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={(e) => {
            if (e.target === e.target.getStage()) {
              onSelectCanvas();
            }
          }}
        >
          {/* 1. LAYER DE FONDO */}
          <Layer>
            <Rect
              x={0}
              y={0}
              width={canvasWidth}
              height={canvasHeight}
              fill={project.background.color ?? '#001219'}
              shadowColor="rgba(0,0,0,0.9)"
              shadowBlur={40}
            />
          </Layer>

          {/* 2. LAYER DE ELEMENTOS VECTORIALES */}
          <Layer>
            {project.layers.map((layer) => {
              if (layer.visible === false) return null;
              const isSelected = layer.id === selectedLayerId;

              // Convert percentage position to pixels on artboard
              const posX = (layer.position.x / 100) * canvasWidth;
              const posY = (layer.position.y / 100) * canvasHeight;

              if (layer.type === 'text' || layer.blockType === 'CustomText') {
                return (
                  <Group
                    key={layer.id}
                    x={posX}
                    y={posY}
                    rotation={layer.rotation ?? 0}
                    onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => handleDragMove(e, layer)}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={(e: Konva.KonvaEventObject<Event>) => handleTransformEnd(e, layer)}
                  >
                    <KonvaTextNode
                      layer={layer}
                      isSelected={isSelected}
                      onSelect={() => onSelectLayer(layer.id)}
                    />
                  </Group>
                );
              }

              if (layer.type === 'shape') {
                return (
                  <Group
                    key={layer.id}
                    x={posX}
                    y={posY}
                    rotation={layer.rotation ?? 0}
                    onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => handleDragMove(e, layer)}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={(e: Konva.KonvaEventObject<Event>) => handleTransformEnd(e, layer)}
                  >
                    <KonvaShapeNode
                      layer={layer}
                      isSelected={isSelected}
                      onSelect={() => onSelectLayer(layer.id)}
                    />
                  </Group>
                );
              }

              if (layer.type === 'block') {
                return (
                  <Group
                    key={layer.id}
                    x={posX}
                    y={posY}
                    rotation={layer.rotation ?? 0}
                    onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => handleDragMove(e, layer)}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={(e: Konva.KonvaEventObject<Event>) => handleTransformEnd(e, layer)}
                  >
                    <KonvaMotionCardNode
                      layer={layer}
                      isSelected={isSelected}
                      onSelect={() => onSelectLayer(layer.id)}
                    />
                  </Group>
                );
              }

              return (
                <Group
                  key={layer.id}
                  x={posX}
                  y={posY}
                  rotation={layer.rotation ?? 0}
                  onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => handleDragMove(e, layer)}
                  onDragEnd={handleDragEnd}
                  onTransformEnd={(e: Konva.KonvaEventObject<Event>) => handleTransformEnd(e, layer)}
                >
                  <KonvaImageNode
                    layer={layer}
                    isSelected={isSelected}
                    onSelect={() => onSelectLayer(layer.id)}
                  />
                </Group>
              );
            })}
          </Layer>

          {/* 3. LAYER DE GUÍAS DE SNAPPING */}
          <Layer>
            {guides.map((g, i) => (
              <Line
                key={i}
                points={g.points}
                stroke={g.color}
                strokeWidth={1.5}
                dash={[6, 4]}
              />
            ))}
          </Layer>

          {/* 4. LAYER TRANSFORMER (BOUNDING BOX 8 PUNTOS + ROTACIÓN) */}
          <Layer>
            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              enabledAnchors={[
                'top-left',
                'top-center',
                'top-right',
                'middle-right',
                'bottom-right',
                'bottom-center',
                'bottom-left',
                'middle-left',
              ]}
              anchorSize={10}
              anchorCornerRadius={5}
              anchorFill="#FFFFFF"
              anchorStroke="#005F73"
              anchorStrokeWidth={2}
              borderStroke="#94D2BD"
              borderStrokeWidth={1.5}
              borderDash={[4, 4]}
              boundBoxFunc={(oldBox, newBox) => {
                // Minimum size constraint
                if (newBox.width < 30 || newBox.height < 30) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>

        {/* SAFE ZONES OVERLAY */}
        {showSafeZones && (
          <div className="pointer-events-none absolute inset-0 z-30 border-2 border-dashed border-amber-400/60 p-8">
            <div className="flex justify-between text-[10px] font-mono font-bold text-amber-400">
              <span>Safe Margin Top</span>
              <span>Instagram / TikTok Area</span>
            </div>
            <div className="absolute bottom-4 left-8 text-[10px] font-mono font-bold text-amber-400">
              Safe Margin Bottom
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
