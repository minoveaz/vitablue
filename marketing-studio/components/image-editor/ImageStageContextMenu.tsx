import React from 'react';
import {
  AlignCenter, AlignLeft, AlignRight, AlignVerticalJustifyCenter, ArrowDown, ArrowUp, Clipboard,
  Copy, Eye, EyeOff, FlipHorizontal, FlipVertical, FolderHeart, FolderPlus, Lock, Maximize2,
  Paintbrush, Trash2, Ungroup, Unlock,
} from 'lucide-react';
import type { ImageStageActions, ImageStageContextMenuState } from './ImageStage.types';

interface ImageStageContextMenuProps extends ImageStageActions {
  contextMenu: ImageStageContextMenuState | null;
  selectedLayerIds: string[];
  onClose: () => void;
}

export const ImageStageContextMenu: React.FC<ImageStageContextMenuProps> = ({ contextMenu, selectedLayerIds, onClose, ...actions }) => {
  if (!contextMenu) return null;
  const { layer } = contextMenu;
  const {
    onCopySelectedLayers, onPasteLayers, onCopyLayerStyle, onPasteLayerStyle, onDuplicateSelectedLayers, onSaveToMyDesigns,
    onDeleteSelectedLayers, onRemoveLayer, onGroupSelectedLayers, onUngroupLayer, onMoveZIndex, onToggleFlipHorizontal,
    onToggleFlipVertical, onAlignSelectedLayers, onUpdatePosition, onToggleLock, onToggleVisibility, onFitToCanvas, onDuplicateLayer,
  } = actions;
  return (
    <>
      {/* RIGHT-CLICK CONTEXT MENU (ESTILO CANVA) */}
      {contextMenu && (
        <div
          style={{
            left: Math.min(contextMenu.x, Math.max(8, window.innerWidth - 296)),
            top: contextMenu.y,
            transform: contextMenu.y > window.innerHeight * 0.55 ? 'translateY(-100%)' : undefined,
          }}
          className="fixed z-50 min-w-[240px] max-w-[280px] max-h-[calc(100vh-1rem)] overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-950/95 p-1.5 shadow-2xl backdrop-blur-xl animate-fadeIn text-xs text-slate-200 divide-y divide-slate-800/80 select-none"
          data-image-context-menu="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER / TITULAR */}
          <div className="px-3 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">
              {selectedLayerIds.length > 1
                ? `${selectedLayerIds.length} Elementos Seleccionados`
                : layer.title}
            </span>
          </div>

          {/* SECCIÓN 1: ACCIONES DE PORTAPAPELES Y EDICIÓN (CANVA-STYLE) */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                onCopySelectedLayers?.();
                onClose();
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
                onClose();
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
                onCopyLayerStyle?.(layer.id);
                onClose();
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
                onPasteLayerStyle?.(layer.id);
                onClose();
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
                  onDuplicateLayer(layer.id);
                }
                onClose();
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
                  onSaveToMyDesigns(layer.id);
                  onClose();
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
                  onRemoveLayer(layer.id);
                }
                onClose();
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
          {(selectedLayerIds.length >= 2 || ['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard', 'CustomGroup'].includes(layer.blockType ?? '')) && (
            <div className="py-1">
              {selectedLayerIds.length >= 2 && onGroupSelectedLayers && (
                <button
                  type="button"
                  onClick={() => {
                    onGroupSelectedLayers();
                    onClose();
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

              {onUngroupLayer && ['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard', 'CustomGroup'].includes(layer.blockType ?? '') && (
                <button
                  type="button"
                  onClick={() => {
                    onUngroupLayer(layer.id);
                    onClose();
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
                onMoveZIndex?.(layer.id, 'top');
                onClose();
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
                onMoveZIndex?.(layer.id, 'up');
                onClose();
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
                onMoveZIndex?.(layer.id, 'down');
                onClose();
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
                onMoveZIndex?.(layer.id, 'bottom');
                onClose();
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
                onToggleFlipHorizontal?.(layer.id);
                onClose();
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
                onToggleFlipVertical?.(layer.id);
                onClose();
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
                    onUpdatePosition(layer.id, { x: 20, y: layer.position.y });
                  }
                  onClose();
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
                    onUpdatePosition(layer.id, { x: 50, y: layer.position.y });
                  }
                  onClose();
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
                    onUpdatePosition(layer.id, { x: 80, y: layer.position.y });
                  }
                  onClose();
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
                    onUpdatePosition(layer.id, { x: layer.position.x, y: 50 });
                  }
                  onClose();
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
                  onToggleLock(layer.id);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  {layer.locked ? (
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
                  onToggleVisibility(layer.id);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-1.5 text-left hover:bg-slate-800/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  {layer.visible === false ? (
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
                  onFitToCanvas(layer.id);
                  onClose();
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

    </>
  );
};
