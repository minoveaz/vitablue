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
  GripVertical,
} from 'lucide-react';
import { ImageLayer, ImageProject } from '../../types/imageStudio';

export interface ImageStudioLayersPanelProps {
  project: ImageProject;
  selectedLayerId: string | null;
  selectedLayerIds?: string[];
  onSelectLayer: (id: string, isShift?: boolean) => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleAllLock?: (locked: boolean) => void;
  onToggleAllVisibility?: (visible: boolean) => void;
  onMoveZIndex: (id: string, direction: 'up' | 'down') => void;
  onReorderLayers?: (layerIds: string[]) => void;
  onRenameLayer: (id: string, title: string) => void;
  onDuplicateLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onDeleteSelectedLayers?: () => void;
}

export const ImageStudioLayersPanel: React.FC<ImageStudioLayersPanelProps> = ({
  project,
  selectedLayerId,
  selectedLayerIds = [],
  onSelectLayer,
  onToggleLock,
  onToggleVisibility,
  onToggleAllLock,
  onToggleAllVisibility,
  onMoveZIndex,
  onReorderLayers,
  onRenameLayer,
  onDuplicateLayer,
  onRemoveLayer,
  onDeleteSelectedLayers,
}) => {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Ordenar capas de mayor zIndex a menor (arriba = al frente)
  const sortedLayers = [...project.layers].sort((a, b) => b.zIndex - a.zIndex);

  const allLocked = project.layers.length > 0 && project.layers.every((l) => Boolean(l.locked));
  const allVisible = project.layers.length > 0 && project.layers.every((l) => l.visible !== false);

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

  const getLayerSnippet = (layer: ImageLayer): string | null => {
    const p = layer.props as Record<string, unknown>;
    if (layer.blockType === 'WhatsAppCtaButton') return String(p.whatsAppText ?? 'WhatsApp');
    if (layer.blockType === 'AdvisorQuoteBox') return String(p.message ?? '').slice(0, 30);
    if (layer.blockType === 'TrustBadgeTitle') return String(p.title ?? '');
    if (layer.blockType === 'AdvisorAvatarBadge') return String(p.name ?? 'Sofía');
    if (layer.blockType === 'ProviderBadge') return String(p.name ?? 'Aseguradora');
    return null;
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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLayerId(id);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDraggedLayerId(null);

    const sourceId = e.dataTransfer.getData('text/plain');
    if (!sourceId || !onReorderLayers) return;

    const currentOrder = sortedLayers.map((l) => l.id);
    const sourceIndex = currentOrder.indexOf(sourceId);
    if (sourceIndex === -1 || sourceIndex === dropIndex) return;

    const newOrder = [...currentOrder];
    const [removed] = newOrder.splice(sourceIndex, 1);
    newOrder.splice(dropIndex, 0, removed);

    onReorderLayers(newOrder);
  };

  return (
    <div className="flex flex-col space-y-2.5 select-none text-xs">
      {/* CABECERA CON ESTADÍSTICAS Y ACCIONES EN LOTE */}
      <div className="flex flex-col gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center justify-between px-1">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">
            <Layers className="size-3.5 text-brand-cyan" />
            <span>Árbol de Capas ({project.layers.length})</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Frente ➔ Fondo
          </span>
        </div>

        {/* BARRA DE ACCIONES GLOBALES RÁPIDAS */}
        <div className="flex items-center justify-between gap-1.5 bg-slate-900/80 border border-slate-800 rounded-xl p-1 text-[11px]">
          <div className="flex items-center gap-1">
            {onToggleAllVisibility && (
              <button
                type="button"
                onClick={() => onToggleAllVisibility(!allVisible)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={allVisible ? 'Ocultar todas las capas' : 'Mostrar todas las capas'}
              >
                {allVisible ? <Eye className="size-3 text-brand-cyan" /> : <EyeOff className="size-3" />}
                <span>{allVisible ? 'Ocultar' : 'Mostrar'}</span>
              </button>
            )}

            {onToggleAllLock && (
              <button
                type="button"
                onClick={() => onToggleAllLock(!allLocked)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={allLocked ? 'Desbloquear todas las capas' : 'Bloquear todas las capas'}
              >
                {allLocked ? <Lock className="size-3 text-amber-400" /> : <Unlock className="size-3" />}
                <span>{allLocked ? 'Desbloquear' : 'Bloquear'}</span>
              </button>
            )}
          </div>

          {selectedLayerIds.length > 1 && onDeleteSelectedLayers && (
            <button
              type="button"
              onClick={onDeleteSelectedLayers}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-rose-400 bg-rose-950/50 hover:bg-rose-900/60 transition-colors font-bold"
              title="Eliminar capas seleccionadas"
            >
              <Trash2 className="size-3" />
              <span>({selectedLayerIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* LISTA ORDENADA DE CAPAS (CON DRAG & DROP NATIVO) */}
      {sortedLayers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center text-slate-500 text-xs">
          No hay capas en este lienzo. Añade un bloque desde la biblioteca.
        </div>
      ) : (
        <div className="space-y-1 max-h-[calc(100vh-340px)] overflow-y-auto pr-1 custom-scrollbar">
          {sortedLayers.map((layer, index) => {
            const isSelected = selectedLayerId === layer.id || selectedLayerIds.includes(layer.id);
            const isEditing = editingLayerId === layer.id;
            const isLocked = Boolean(layer.locked);
            const isVisible = layer.visible !== false;
            const isDragged = draggedLayerId === layer.id;
            const isDropTarget = dragOverIndex === index;
            const snippet = getLayerSnippet(layer);

            return (
              <div
                key={layer.id}
                draggable={!isEditing}
                onDragStart={(e) => handleDragStart(e, layer.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer(layer.id, e.shiftKey || e.metaKey || e.ctrlKey);
                }}
                className={`group relative flex items-center justify-between gap-1.5 rounded-xl border p-2 transition-all cursor-pointer ${
                  isDropTarget ? 'border-brand-cyan bg-brand-cyan/10 ring-2 ring-brand-cyan' : ''
                } ${
                  isDragged ? 'opacity-30 border-dashed border-slate-600' : ''
                } ${
                  isSelected
                    ? 'border-brand-cyan bg-slate-900/95 shadow-md ring-1 ring-brand-cyan/40 text-white'
                    : 'border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/40'
                } ${!isVisible ? 'opacity-40' : ''}`}
              >
                {/* MANEJADOR GRIP + ÍNDICE DE ORDEN */}
                <div
                  className="flex items-center gap-1 cursor-grab active:cursor-grabbing text-slate-600 group-hover:text-slate-400 transition-colors"
                  title="Arrastra para reordenar la profundidad (z-index)"
                >
                  <GripVertical className="size-3.5" />
                  <span className="font-mono text-[9px] text-slate-600 min-w-[12px]">
                    #{index + 1}
                  </span>
                </div>

                {/* IZQUIERDA: ICONO + TÍTULO + PREVIEW SNIPPET */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-slate-800/90 border border-slate-700/50">
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
                        className="w-full rounded-lg bg-slate-800 px-2 py-0.5 text-xs text-white border border-brand-cyan focus:outline-none"
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
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 min-w-0">
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
                      {snippet && (
                        <span className="truncate text-[10px] text-slate-500 font-medium">
                          "{snippet}"
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* DERECHA: CONTROLES RÁPIDOS */}
                <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* REORDER UP / DOWN BUTTONS */}
                  <button
                    type="button"
                    onClick={() => onMoveZIndex(layer.id, 'up')}
                    disabled={index === 0}
                    className="flex size-5 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-20 transition-colors"
                    title="Traer al frente"
                  >
                    <ArrowUp className="size-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveZIndex(layer.id, 'down')}
                    disabled={index === sortedLayers.length - 1}
                    className="flex size-5 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-20 transition-colors"
                    title="Enviar al fondo"
                  >
                    <ArrowDown className="size-3" />
                  </button>

                  <div className="h-3 w-px bg-slate-800 mx-0.5" />

                  {/* LOCK TOGGLE */}
                  <button
                    type="button"
                    onClick={() => onToggleLock(layer.id)}
                    className={`flex size-6 items-center justify-center rounded-lg transition-colors ${
                      isLocked
                        ? 'text-amber-400 bg-amber-400/10 border border-amber-500/30'
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
                    className={`flex size-6 items-center justify-center rounded-lg transition-colors ${
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
                    className="flex size-6 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                    title="Duplicar capa"
                  >
                    <Copy className="size-3" />
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    type="button"
                    onClick={() => onRemoveLayer(layer.id)}
                    className="flex size-6 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
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
