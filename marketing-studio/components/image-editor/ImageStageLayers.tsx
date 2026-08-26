import React from 'react';
import type { ImageLayer, ImageProject } from '../../types/imageStudio';
import { ImageLayerBlockRenderer, getBlockDefaultWidth } from './blocks';
import type { ImageStageInteractionHandlers } from './ImageStage.types';

interface ImageStageLayersProps extends ImageStageInteractionHandlers {
  project: ImageProject;
  selectedLayerId: string | null;
  selectedLayerIds: string[];
  effectiveHandMode: boolean;
  isPanning: boolean;
  draggingLayerId: string | null;
  onUpdateLayerProps?: (id: string, patch: Record<string, unknown>) => void;
}

export const ImageStageLayers: React.FC<ImageStageLayersProps> = ({ project, selectedLayerId, selectedLayerIds, effectiveHandMode, isPanning, draggingLayerId, onUpdateLayerProps, handlePointerDown, handleContextMenu, handleResizeStart, handleRotateStart }) => (
  <>
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
                onPointerDown={(e) => handlePointerDown(e, layer)}
                onContextMenu={(e) => handleContextMenu(e, layer)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`canvas-layer-item absolute transition-shadow shrink-0 [&_*]:cursor-inherit ${getClipClass(
                  layer.clipShape
                )} ${
                  effectiveHandMode
                    ? isPanning
                      ? 'cursor-grabbing select-none'
                      : 'cursor-grab select-none'
                    : isLocked
                    ? 'cursor-default select-none'
                    : draggingLayerId === layer.id
                    ? 'cursor-grabbing select-none'
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
                  height: layer.height
                    ? `${layer.height}px`
                    : layer.blockType === 'GeometricShape'
                    ? '200px'
                    : 'auto',
                  minHeight: layer.height
                    ? `${layer.height}px`
                    : layer.blockType === 'GeometricShape'
                    ? '20px'
                    : 'auto',
                  flexShrink: 0,
                  opacity: layer.opacity !== undefined ? layer.opacity : 1,
                  boxShadow: getShadowStyle(layer.shadowPreset, layer),
                  borderWidth: layer.blockType === 'GeometricShape' ? undefined : (layer.borderWidth ? `${layer.borderWidth}px` : undefined),
                  borderColor: layer.blockType === 'GeometricShape' ? undefined : (layer.borderColor || undefined),
                  borderStyle: layer.blockType === 'GeometricShape' ? undefined : (layer.borderWidth ? 'solid' : undefined),
                  borderRadius: layer.blockType === 'GeometricShape' ? undefined : (layer.borderRadius ? `${layer.borderRadius}px` : undefined),
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
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold text-primary-dark shadow-md backdrop-blur-xs">
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
                      onPointerDown={(e) => handleRotateStart(e, layer)}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 size-4 rounded-full bg-white border-2 border-primary shadow-xl cursor-grab active:cursor-grabbing hover:scale-125 transition-transform flex items-center justify-center z-30"
                      title="Arrastrar para rotar libremente"
                    >
                      <div className="size-1.5 rounded-full bg-primary" />
                    </div>

                    {/* ESQUINAS: ESCALA PROPORCIONAL */}
                    <div
                      onPointerDown={(e) => handleResizeStart(e, layer, 'nw')}
                      className="absolute -top-2 -left-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para redimensionar proporcionalmente"
                    />
                    <div
                      onPointerDown={(e) => handleResizeStart(e, layer, 'ne')}
                      className="absolute -top-2 -right-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para redimensionar proporcionalmente"
                    />
                    <div
                      onPointerDown={(e) => handleResizeStart(e, layer, 'sw')}
                      className="absolute -bottom-2 -left-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nesw-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para redimensionar proporcionalmente"
                    />
                    <div
                      onPointerDown={(e) => handleResizeStart(e, layer, 'se')}
                      className="absolute -bottom-2 -right-2 size-3.5 rounded-full bg-brand-cyan border-2 border-slate-950 shadow-md cursor-nwse-resize hover:scale-125 transition-transform z-20"
                      title="Arrastrar para redimensionar proporcionalmente"
                    />

                    {/* LATERALES: AJUSTE DE ANCHURA (WIDTH) */}
                    <div
                      onPointerDown={(e) => handleResizeStart(e, layer, 'w')}
                      className="absolute top-1/2 -left-2 -translate-y-1/2 h-5 w-2 rounded-full bg-white border border-slate-800 shadow-md cursor-ew-resize hover:scale-125 transition-transform z-20"
                      title="Ajustar ancho izquierdo"
                    />
                    <div
                      onPointerDown={(e) => handleResizeStart(e, layer, 'e')}
                      className="absolute top-1/2 -right-2 -translate-y-1/2 h-5 w-2 rounded-full bg-white border border-slate-800 shadow-md cursor-ew-resize hover:scale-125 transition-transform z-20"
                      title="Ajustar ancho derecho"
                    />

                    {/* SUPERIOR/INFERIOR: AJUSTE DE ALTURA (HEIGHT) */}
                    <div
                      onPointerDown={(e) => handleResizeStart(e, layer, 'n')}
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-white border border-slate-800 shadow-md cursor-ns-resize hover:scale-125 transition-transform z-20"
                      title="Ajustar altura superior"
                    />
                    <div
                      onPointerDown={(e) => handleResizeStart(e, layer, 's')}
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-2 rounded-full bg-white border border-slate-800 shadow-md cursor-ns-resize hover:scale-125 transition-transform z-20"
                      title="Ajustar altura inferior"
                    />
                  </>
                )}
              </div>
            );
          })}

  </>
);
