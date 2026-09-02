import React from 'react';
import {
  AlignCenter, AlignHorizontalDistributeCenter, AlignLeft, AlignRight, AlignVerticalDistributeCenter,
  AlignVerticalJustifyCenter, ArrowDown, ArrowUp, Clipboard,
  Copy, Eye, EyeOff, FlipHorizontal, FlipVertical, FolderHeart, FolderPlus, Lock, Maximize2,
  Paintbrush, Trash2, Ungroup, Unlock,
} from 'lucide-react';
import {
  createContextMenuActionHandler,
  getContextMenuTargetLayerIds,
  type ImageStageActions,
  type ImageStageContextMenuState,
} from './ImageStage.types';

interface ImageStageContextMenuProps extends ImageStageActions {
  contextMenu: ImageStageContextMenuState | null;
  selectedLayerIds: string[];
  onClose: () => void;
}

export const ImageStageContextMenu: React.FC<ImageStageContextMenuProps> = ({ contextMenu, selectedLayerIds, onClose, ...actions }) => {
  const runAction = React.useMemo(() => createContextMenuActionHandler(onClose), [onClose]);
  React.useEffect(() => {
    runAction.reset();
  }, [contextMenu, runAction]);
  if (!contextMenu) return null;
  const { layer } = contextMenu;
  // A context menu click selects its target, but that state update is
  // asynchronous. Resolve the effective selection from the menu target so
  // actions never operate on the previously selected layer(s).
  const targetLayerIds = getContextMenuTargetLayerIds(layer.id, selectedLayerIds, contextMenu.targetLayerIds);
  const isMultiSelection = targetLayerIds.length > 1;
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
            left: Math.max(8, Math.min(contextMenu.x, window.innerWidth - 296 - 8)),
            top: contextMenu.y,
            transform: contextMenu.y > window.innerHeight * 0.55 ? 'translateY(-100%)' : undefined,
          }}
          className="fixed z-50 min-w-[240px] max-w-[280px] max-h-[calc(100vh-1rem)] overflow-y-auto rounded-2xl border border-slate-700/80 bg-slate-950/95 p-1.5 shadow-2xl backdrop-blur-xl animate-fadeIn text-xs text-slate-200 divide-y divide-slate-800/80 select-none"
          data-image-context-menu="true"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER / TITULAR */}
          <div className="px-3 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 truncate">
              {isMultiSelection
                ? `${targetLayerIds.length} Elementos Seleccionados`
                : layer.title}
            </span>
          </div>

          {/* SECCIÓN 1: ACCIONES DE PORTAPAPELES Y EDICIÓN (CANVA-STYLE) */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => runAction(() => {
                onCopySelectedLayers?.(targetLayerIds);})}
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
              onClick={() => runAction(() => {
                onPasteLayers?.();})}
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
              onClick={() => runAction(() => {
                onCopyLayerStyle?.(layer.id);})}
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
              onClick={() => runAction(() => {
                onPasteLayerStyle?.(layer.id, targetLayerIds);})}
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
              onClick={() => runAction(() => {
                if (isMultiSelection && onDuplicateSelectedLayers) {
                  onDuplicateSelectedLayers(targetLayerIds);
                } else {
                  onDuplicateLayer(layer.id);
                }})}
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
                onClick={() => runAction(() => {
                  targetLayerIds.forEach((id) => onSaveToMyDesigns(id));})}
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
              onClick={() => runAction(() => {
                if (onDeleteSelectedLayers) {
                  onDeleteSelectedLayers(targetLayerIds);
                } else {
                  onRemoveLayer(layer.id);
                }})}
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
          {(isMultiSelection || ['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard', 'CustomGroup'].includes(layer.blockType ?? '')) && (
            <div className="py-1">
              {isMultiSelection && onGroupSelectedLayers && (
                <button
                  type="button"
                  onClick={() => runAction(() => {
                    onGroupSelectedLayers(targetLayerIds);})}
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
                  onClick={() => runAction(() => {
                    targetLayerIds.forEach((id) => onUngroupLayer(id));})}
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
              onClick={() => runAction(() => {
                onMoveZIndex?.(layer.id, 'top', targetLayerIds);})}
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
              onClick={() => runAction(() => {
                onMoveZIndex?.(layer.id, 'up', targetLayerIds);})}
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
              onClick={() => runAction(() => {
                onMoveZIndex?.(layer.id, 'down', targetLayerIds);})}
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
              onClick={() => runAction(() => {
                onMoveZIndex?.(layer.id, 'bottom', targetLayerIds);})}
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
              onClick={() => runAction(() => {
                onToggleFlipHorizontal?.(layer.id, targetLayerIds);})}
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
              onClick={() => runAction(() => {
                onToggleFlipVertical?.(layer.id, targetLayerIds);})}
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
                onClick={() => runAction(() => {
                  if (onAlignSelectedLayers) {
                    onAlignSelectedLayers('left', targetLayerIds);
                  } else {
                    onUpdatePosition(layer.id, { x: 20, y: layer.position.y });
                  }})}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Alinear a la izquierda"
              >
                <AlignLeft className="size-3" />
                <span>Izq</span>
              </button>

              <button
                type="button"
                onClick={() => runAction(() => {
                  if (onAlignSelectedLayers) {
                    onAlignSelectedLayers('center', targetLayerIds);
                  } else {
                    onUpdatePosition(layer.id, { x: 50, y: layer.position.y });
                  }})}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Centrar horizontalmente"
              >
                <AlignCenter className="size-3" />
                <span>Centro</span>
              </button>

              <button
                type="button"
                onClick={() => runAction(() => {
                  if (onAlignSelectedLayers) {
                    onAlignSelectedLayers('right', targetLayerIds);
                  } else {
                    onUpdatePosition(layer.id, { x: 80, y: layer.position.y });
                  }})}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Alinear a la derecha"
              >
                <AlignRight className="size-3" />
                <span>Der</span>
              </button>

              <button
                type="button"
                onClick={() => runAction(() => {
                  if (onAlignSelectedLayers) {
                    onAlignSelectedLayers('middle', targetLayerIds);
                  } else {
                    onUpdatePosition(layer.id, { x: layer.position.x, y: 50 });
                  }})}
                className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Centrar verticalmente"
              >
                <AlignVerticalJustifyCenter className="size-3" />
                <span>Medio</span>
              </button>
            </div>
            {isMultiSelection && targetLayerIds.length >= 3 && actions.onDistributeSelectedLayers && (
              <>
                <div className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Distribuir elementos
                </div>
                <div className="grid grid-cols-2 gap-1 px-2 py-0.5">
                  <button
                    type="button"
                    onClick={() => runAction(() => {
                      actions.onDistributeSelectedLayers?.('horizontal', targetLayerIds);})}
                    className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                    title="Distribuir horizontalmente"
                  >
                    <AlignHorizontalDistributeCenter className="size-3" />
                    <span>Horizontal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => runAction(() => {
                      actions.onDistributeSelectedLayers?.('vertical', targetLayerIds);})}
                    className="flex items-center justify-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-[10px] hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                    title="Distribuir verticalmente"
                  >
                    <AlignVerticalDistributeCenter className="size-3" />
                    <span>Vertical</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* SECCIÓN 5: BLOQUEO, VISIBILIDAD Y AUTO-AJUSTE */}
          <div className="py-1">
            {onToggleLock && (
              <button
                type="button"
                onClick={() => runAction(() => {
                  onToggleLock(layer.id, targetLayerIds, !layer.locked);})}
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
                onClick={() => runAction(() => {
                  onToggleVisibility(layer.id, targetLayerIds, layer.visible === false);})}
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
                onClick={() => runAction(() => {
                  targetLayerIds.forEach((id) => onFitToCanvas(id));})}
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
