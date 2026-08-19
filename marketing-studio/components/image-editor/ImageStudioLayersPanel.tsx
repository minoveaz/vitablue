import React, { useState } from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  User,
  MessageSquare,
  Shield,
  Building2,
  Image as ImageIcon,
  CheckCircle2,
  Quote,
  Type,
  Edit2,
  Check,
} from 'lucide-react';
import { ImageLayer, ImageProject } from '../../types/imageStudio';

export interface ImageStudioLayersPanelProps {
  project: ImageProject;
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onMoveZIndex: (id: string, direction: 'up' | 'down') => void;
  onRenameLayer: (id: string, title: string) => void;
  onDuplicateLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
}

export const ImageStudioLayersPanel: React.FC<ImageStudioLayersPanelProps> = ({
  project,
  selectedLayerId,
  onSelectLayer,
  onToggleLock,
  onToggleVisibility,
  onMoveZIndex,
  onRenameLayer,
  onDuplicateLayer,
  onRemoveLayer,
}) => {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  // Sort layers by zIndex descending (topmost on top of the list)
  const sortedLayers = [...project.layers].sort((a, b) => b.zIndex - a.zIndex);

  const getLayerIcon = (layer: ImageLayer) => {
    switch (layer.blockType) {
      case 'AdvisorAvatarBadge':
        return <User className="size-3.5 text-amber-400" />;
      case 'WhatsAppCtaButton':
        return <MessageSquare className="size-3.5 text-emerald-400" />;
      case 'AdvisorQuoteBox':
        return <Quote className="size-3.5 text-cyan-400" />;
      case 'HookAlertBadge':
        return <CheckCircle2 className="size-3.5 text-teal-400" />;
      case 'GlassCardSurface':
        return <ImageIcon className="size-3.5 text-slate-400" />;
      case 'TrustShieldIcon':
      case 'MotionTrustBadge':
      case 'TrustBadgeTitle':
      case 'TrustBadgeSubtitle':
        return <Shield className="size-3.5 text-amber-400" />;
      case 'ProviderBadge':
      case 'ProviderGridHeader':
      case 'MotionProviderGrid':
        return <Building2 className="size-3.5 text-teal-400" />;
      default:
        return <Type className="size-3.5 text-slate-300" />;
    }
  };

  const startEditing = (layer: ImageLayer, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLayerId(layer.id);
    setEditingTitle(layer.title);
  };

  const handleSaveTitle = (layerId: string) => {
    if (editingTitle.trim()) {
      onRenameLayer(layerId, editingTitle.trim());
    }
    setEditingLayerId(null);
  };

  return (
    <div className="flex flex-col space-y-2 select-none text-xs">
      <div className="flex items-center justify-between px-1 pb-2 border-b border-slate-800/80">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <Layers className="size-3.5 text-brand-cyan" />
          <span>Árbol de Capas ({project.layers.length})</span>
        </span>
        <span className="text-[10px] font-mono text-slate-500">
          Orden: Frente ➔ Fondo
        </span>
      </div>

      {sortedLayers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center text-slate-500 text-xs">
          No hay capas en este lienzo. Añade un bloque desde la biblioteca.
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
          {sortedLayers.map((layer, index) => {
            const isSelected = layer.id === selectedLayerId;
            const isEditing = editingLayerId === layer.id;
            const isLocked = Boolean(layer.locked);
            const isVisible = layer.visible !== false;

            return (
              <div
                key={layer.id}
                onClick={() => onSelectLayer(layer.id)}
                className={`group relative flex items-center justify-between gap-2 rounded-xl border p-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-cyan bg-slate-900/90 shadow-md ring-1 ring-brand-cyan/40 text-white'
                    : 'border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40'
                } ${!isVisible ? 'opacity-40' : ''}`}
              >
                {/* IZQUIERDA: ICONO + TÍTULO */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-slate-800/80">
                    {getLayerIcon(layer)}
                  </span>

                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle(layer.id);
                          if (e.key === 'Escape') setEditingLayerId(null);
                        }}
                        autoFocus
                        className="w-full rounded bg-slate-800 px-1.5 py-0.5 text-xs text-white border border-primary focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveTitle(layer.id)}
                        className="rounded p-1 text-brand-cyan hover:bg-slate-800"
                        title="Guardar nombre"
                      >
                        <Check className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span
                        onDoubleClick={(e) => startEditing(layer, e)}
                        className="truncate text-xs font-semibold text-slate-200"
                        title={layer.title}
                      >
                        {layer.title}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => startEditing(layer, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition-opacity"
                        title="Renombrar capa"
                      >
                        <Edit2 className="size-2.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* DERECHA: CONTROLES DE PROFUNDIDAD Y ESTADO */}
                <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* REORDER UP / DOWN */}
                  <button
                    type="button"
                    onClick={() => onMoveZIndex(layer.id, 'up')}
                    disabled={index === 0}
                    className="flex size-5 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-20 transition-colors"
                    title="Traer capa hacia el frente"
                  >
                    <ArrowUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveZIndex(layer.id, 'down')}
                    disabled={index === sortedLayers.length - 1}
                    className="flex size-5 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-20 transition-colors"
                    title="Enviar capa hacia el fondo"
                  >
                    <ArrowDown className="size-3" />
                  </button>

                  <div className="h-3 w-px bg-slate-800 mx-0.5" />

                  {/* LOCK TOGGLE */}
                  <button
                    type="button"
                    onClick={() => onToggleLock(layer.id)}
                    className={`flex size-6 items-center justify-center rounded transition-colors ${
                      isLocked
                        ? 'text-amber-400 bg-amber-400/10'
                        : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                    }`}
                    title={isLocked ? 'Capa bloqueada (Clic para desbloquear)' : 'Bloquear capa'}
                  >
                    {isLocked ? <Lock className="size-3" /> : <Unlock className="size-3" />}
                  </button>

                  {/* VISIBILITY TOGGLE */}
                  <button
                    type="button"
                    onClick={() => onToggleVisibility(layer.id)}
                    className={`flex size-6 items-center justify-center rounded transition-colors ${
                      !isVisible
                        ? 'text-slate-600 bg-slate-800/40'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                    title={isVisible ? 'Ocultar capa' : 'Mostrar capa'}
                  >
                    {isVisible ? <Eye className="size-3" /> : <EyeOff className="size-3" />}
                  </button>

                  {/* DUPLICATE BUTTON */}
                  <button
                    type="button"
                    onClick={() => onDuplicateLayer(layer.id)}
                    className="flex size-6 items-center justify-center rounded text-slate-500 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                    title="Duplicar capa (Cmd+D)"
                  >
                    <Copy className="size-3" />
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    type="button"
                    onClick={() => onRemoveLayer(layer.id)}
                    className="flex size-6 items-center justify-center rounded text-slate-500 hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
                    title="Eliminar capa"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
