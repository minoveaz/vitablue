import React, { useEffect, useRef } from 'react';
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

  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className="fixed z-50 min-w-[200px] overflow-hidden rounded-xl border border-slate-700 bg-slate-900/95 p-1.5 text-xs text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
    >
      {/* MENÚ PARA ESCENA DE TIMELINE */}
      {target.type === 'scene' && (
        <div className="space-y-0.5">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            Escena {target.sceneId}
          </div>
          <button
            type="button"
            onClick={() => { onDuplicateScene?.(target.sceneId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-800 transition-colors"
          >
            <Copy className="size-3.5 text-brand-cyan" />
            <span>Duplicar escena</span>
          </button>
          <button
            type="button"
            onClick={() => { onSplitScene?.(target.sceneId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-800 transition-colors"
          >
            <Scissors className="size-3.5 text-accent" />
            <span>Dividir en cabezal (Split)</span>
            <kbd className="ml-auto text-[9px] text-slate-400 bg-slate-800 px-1 py-0.5 rounded">⌘B</kbd>
          </button>

          <div className="my-1 border-t border-slate-800" />
          <div className="px-2.5 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">Duración rápida</div>
          <div className="grid grid-cols-3 gap-1 px-1.5 pb-1">
            {[3, 5, 7].map((secs) => (
              <button
                key={secs}
                type="button"
                onClick={() => { onSetSceneDuration?.(target.sceneId, secs); onClose(); }}
                className="flex items-center justify-center rounded-md bg-slate-800/80 py-1 text-[11px] font-bold hover:bg-primary hover:text-white transition-colors"
              >
                {secs}s
              </button>
            ))}
          </div>

          <div className="my-1 border-t border-slate-800" />
          <button
            type="button"
            onClick={() => { onDeleteScene?.(target.sceneId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="size-3.5" />
            <span>Eliminar escena</span>
          </button>
        </div>
      )}

      {/* MENÚ PARA CAPA DE TIMELINE */}
      {target.type === 'layer' && (
        <div className="space-y-0.5">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            Capa {target.layerId}
          </div>
          <button
            type="button"
            onClick={() => { onDuplicateLayer?.(target.sceneId, target.layerId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-800 transition-colors"
          >
            <Copy className="size-3.5 text-brand-cyan" />
            <span>Duplicar capa</span>
          </button>
          <button
            type="button"
            onClick={() => { onToggleLayerVisibility?.(target.sceneId, target.layerId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-800 transition-colors"
          >
            <Eye className="size-3.5 text-slate-300" />
            <span>Mostrar / Ocultar</span>
          </button>
          <button
            type="button"
            onClick={() => { onToggleLayerLock?.(target.sceneId, target.layerId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-800 transition-colors"
          >
            <Lock className="size-3.5 text-amber-400" />
            <span>Bloquear / Desbloquear</span>
          </button>

          <div className="my-1 border-t border-slate-800" />
          <button
            type="button"
            onClick={() => { onDeleteLayer?.(target.sceneId, target.layerId); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="size-3.5" />
            <span>Eliminar capa</span>
          </button>
        </div>
      )}

      {/* MENÚ PARA CLIC DERECHO EN CANVAS */}
      {target.type === 'canvas' && (
        <div className="space-y-0.5">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            Añadir al vídeo
          </div>
          <button
            type="button"
            onClick={() => { onAddText?.(target.coords); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-800 transition-colors"
          >
            <Type className="size-3.5 text-brand-cyan" />
            <span>Insertar texto aquí</span>
          </button>
          <button
            type="button"
            onClick={() => { onAddSubtitle?.(target.coords); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-800 transition-colors"
          >
            <MessageSquare className="size-3.5 text-accent" />
            <span>Insertar subtítulo</span>
          </button>
          <button
            type="button"
            onClick={() => { onAddComponent?.('AdvisorCard', target.coords); onClose(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-slate-800 transition-colors"
          >
            <ShieldCheck className="size-3.5 text-emerald-400" />
            <span>Insertar Tarjeta Asesor VitaBlue</span>
          </button>
        </div>
      )}
    </div>
  );
};
