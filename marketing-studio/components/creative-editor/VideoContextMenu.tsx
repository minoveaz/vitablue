import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Copy, Scissors, Trash2, Eye, Lock, Type, MessageSquare, ShieldCheck } from 'lucide-react';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export type ContextMenuTarget =
  | { type: 'scene'; sceneId: string }
  | { type: 'layer'; sceneId: string; layerId: string }
  | { type: 'canvas'; coords: { x: number; y: number } };

export interface VideoContextMenuProps {
  position: ContextMenuPosition | null;
  target: ContextMenuTarget | null;
  onClose: () => void;
  onDuplicateScene?: (sceneId: string) => void;
  onSplitScene?: (sceneId: string) => void;
  onDeleteScene?: (sceneId: string) => void;
  onSetSceneDuration?: (sceneId: string, seconds: number) => void;
  onDuplicateLayer?: (sceneId: string, layerId: string) => void;
  onToggleLayerVisibility?: (sceneId: string, layerId: string) => void;
  onToggleLayerLock?: (sceneId: string, layerId: string) => void;
  onDeleteLayer?: (sceneId: string, layerId: string) => void;
  onAddText?: (coords?: { x: number; y: number }) => void;
  onAddSubtitle?: (coords?: { x: number; y: number }) => void;
  onAddComponent?: (componentId: string, coords?: { x: number; y: number }) => void;
}

export const VideoContextMenu: React.FC<VideoContextMenuProps> = ({
  position,
  target,
  onClose,
  onDuplicateScene,
  onSplitScene,
  onDeleteScene,
  onSetSceneDuration,
  onDuplicateLayer,
  onToggleLayerVisibility,
  onToggleLayerLock,
  onDeleteLayer,
  onAddText,
  onAddSubtitle,
  onAddComponent,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState<{ x: number; y: number } | null>(null);

  // AUTO-AJUSTE INTELIGENTE DE LÍMITES DE VENTANA (VIEWPORT CLAMPING & FLIPPING)
  useLayoutEffect(() => {
    if (!position || !menuRef.current) {
      setAdjustedPos(null);
      return;
    }

    const { offsetWidth, offsetHeight } = menuRef.current;
    const padding = 12;

    let x = position.x;
    let y = position.y;

    // Si desborda por la derecha, mover a la izquierda
    if (x + offsetWidth > window.innerWidth - padding) {
      x = Math.max(padding, window.innerWidth - offsetWidth - padding);
    }

    // Si desborda por abajo, desplegar hacia arriba
    if (y + offsetHeight > window.innerHeight - padding) {
      y = Math.max(padding, y - offsetHeight);
    }

    setAdjustedPos({ x, y });
  }, [position, target]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!position || !target) return null;

  const currentX = adjustedPos ? adjustedPos.x : Math.min(position.x, window.innerWidth - 220);
  const currentY = adjustedPos ? adjustedPos.y : Math.min(position.y, window.innerHeight - 250);

  return (
    <div
      ref={menuRef}
      style={{
        top: currentY,
        left: currentX,
        visibility: adjustedPos ? 'visible' : 'hidden',
      }}
      className="fixed z-50 min-w-[210px] overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/95 p-1.5 text-xs text-white shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 ring-1 ring-white/10 select-none"
    >
      {/* MENÚ PARA ESCENA DE TIMELINE */}
      {target.type === 'scene' && (
        <div className="space-y-0.5">
          <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
            <span>Escena {target.sceneId}</span>
          </div>

          <button
            type="button"
            onClick={() => { onDuplicateScene?.(target.sceneId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Copy className="size-3.5 text-brand-cyan" />
            <span className="font-medium">Duplicar escena</span>
          </button>

          <button
            type="button"
            onClick={() => { onSplitScene?.(target.sceneId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Scissors className="size-3.5 text-accent" />
            <span className="font-medium">Dividir en cabezal (Split)</span>
            <kbd className="ml-auto text-[9px] text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded font-mono">⌘B</kbd>
          </button>

          <div className="my-1 border-t border-slate-800/80" />
          <div className="px-2.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Duración rápida</div>
          <div className="grid grid-cols-3 gap-1 px-1 pb-1">
            {[3, 5, 7].map((secs) => (
              <button
                key={secs}
                type="button"
                onClick={() => { onSetSceneDuration?.(target.sceneId, secs); onClose(); }}
                className="flex items-center justify-center rounded-lg bg-slate-800/90 py-1.5 text-[11px] font-bold text-slate-300 hover:bg-primary hover:text-white transition-all shadow-xs"
              >
                {secs}s
              </button>
            ))}
          </div>

          <div className="my-1 border-t border-slate-800/80" />
          <button
            type="button"
            onClick={() => { onDeleteScene?.(target.sceneId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <Trash2 className="size-3.5" />
            <span className="font-medium">Eliminar escena</span>
          </button>
        </div>
      )}

      {/* MENÚ PARA CAPA DE TIMELINE */}
      {target.type === 'layer' && (
        <div className="space-y-0.5">
          <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
            <span>Capa {target.layerId}</span>
          </div>

          <button
            type="button"
            onClick={() => { onDuplicateLayer?.(target.sceneId, target.layerId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Copy className="size-3.5 text-brand-cyan" />
            <span className="font-medium">Duplicar capa</span>
          </button>

          <button
            type="button"
            onClick={() => { onToggleLayerVisibility?.(target.sceneId, target.layerId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Eye className="size-3.5 text-slate-300" />
            <span className="font-medium">Mostrar / Ocultar</span>
          </button>

          <button
            type="button"
            onClick={() => { onToggleLayerLock?.(target.sceneId, target.layerId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Lock className="size-3.5 text-amber-400" />
            <span className="font-medium">Bloquear / Desbloquear</span>
          </button>

          <div className="my-1 border-t border-slate-800/80" />
          <button
            type="button"
            onClick={() => { onDeleteLayer?.(target.sceneId, target.layerId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <Trash2 className="size-3.5" />
            <span className="font-medium">Eliminar capa</span>
          </button>
        </div>
      )}

      {/* MENÚ PARA CLIC DERECHO EN CANVAS */}
      {target.type === 'canvas' && (
        <div className="space-y-0.5">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
            <span>Añadir al vídeo</span>
          </div>

          <button
            type="button"
            onClick={() => { onAddText?.(target.coords); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Type className="size-3.5 text-brand-cyan" />
            <span className="font-medium">Insertar texto aquí</span>
          </button>

          <button
            type="button"
            onClick={() => { onAddSubtitle?.(target.coords); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <MessageSquare className="size-3.5 text-accent" />
            <span className="font-medium">Insertar subtítulo</span>
          </button>

          <button
            type="button"
            onClick={() => { onAddComponent?.('AdvisorCard', target.coords); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span className="font-medium">Insertar Tarjeta Asesor VitaBlue</span>
          </button>
        </div>
      )}
    </div>
  );
};
