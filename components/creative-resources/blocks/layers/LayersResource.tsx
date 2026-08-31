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
import type { ResourceBlockProps } from '../ResourceBlockProps';

interface LayerLike {
  id: string;
  title: string;
  name?: string;
  type?: string;
  blockType?: string;
  props?: Record<string, unknown>;
  zIndex: number;
  visible?: boolean;
  locked?: boolean;
}

type LayersResourceProps = ResourceBlockProps;

export const LayersResource: React.FC<LayersResourceProps> = ({ context }) => {
  const raw = context.data as unknown;
  const rawLayers = Array.isArray(raw)
    ? ((raw.find((scene) => scene && typeof scene === 'object' && (scene as { id?: string }).id === context.selection.sceneId) as { layers?: unknown[] } | undefined)?.layers ?? [])
    : (raw && typeof raw === 'object' && Array.isArray((raw as { layers?: unknown[] }).layers) ? (raw as { layers: unknown[] }).layers : []);
  const project = { layers: rawLayers.map((value, index): LayerLike => {
    const layer = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
    const props = (layer.props && typeof layer.props === 'object' ? layer.props : {}) as Record<string, unknown>;
    const text = typeof layer.text === 'string' ? layer.text : undefined;
    return {
      id: String(layer.id ?? `layer-${index}`),
      title: String(layer.title ?? layer.name ?? layer.type ?? `Capa ${index + 1}`),
      name: typeof layer.name === 'string' ? layer.name : undefined,
      type: typeof layer.type === 'string' ? layer.type : undefined,
      blockType: typeof layer.blockType === 'string' ? layer.blockType : undefined,
      props: Object.keys(props).length ? props : text ? { text } : {},
      zIndex: Number(layer.zIndex ?? rawLayers.length - index),
      visible: layer.visible !== false,
      locked: Boolean(layer.locked),
    };
  }) };
  const selectedLayerIds = [...context.selection.layerIds];
  const selectedLayerId = selectedLayerIds[0] ?? null;
  const onSelectLayer = (id: string, options?: { additive?: boolean }) => context.actions.select?.(id, options);
  const onToggleLock = (id: string) => context.actions.toggleLock?.(id);
  const onToggleVisibility = (id: string) => context.actions.toggleVisibility?.(id);
  const onToggleAllLock = context.actions.toggleLock ? (locked: boolean) => project.layers.forEach((layer) => { if (Boolean(layer.locked) !== locked) context.actions.toggleLock?.(layer.id); }) : undefined;
  const onToggleAllVisibility = context.actions.toggleVisibility ? (visible: boolean) => project.layers.forEach((layer) => { if ((layer.visible !== false) !== visible) context.actions.toggleVisibility?.(layer.id); }) : undefined;
  const onMoveZIndex = context.actions.move
    ? (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => context.actions.move?.(id, direction)
    : undefined;
  const onReorderLayers = context.actions.reorder ? (ids: string[]) => context.actions.reorder?.(ids) : undefined;
  const onRenameLayer = context.actions.rename ? (id: string, title: string) => context.actions.rename?.(id, title) : undefined;
  const onDuplicateLayer = context.actions.duplicate ? (id: string) => context.actions.duplicate?.(id) : undefined;
  const onRemoveLayer = context.actions.remove ? (id: string) => context.actions.remove?.(id) : undefined;
  const onDeleteSelectedLayers = context.actions.remove ? () => selectedLayerIds.forEach((id) => context.actions.remove?.(id)) : undefined;

  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [activePanel, setActivePanel] = useState<'organize' | 'layers'>('layers');
  const [layerFilter, setLayerFilter] = useState<'all' | 'overlapping'>('all');

  // Ordenar capas de mayor zIndex a menor (arriba = al frente)
  const sortedLayers = [...project.layers].sort((a, b) => b.zIndex - a.zIndex);

  const allLocked = project.layers.length > 0 && project.layers.every((l) => Boolean(l.locked));
  const allVisible = project.layers.length > 0 && project.layers.every((l) => l.visible !== false);
  const visibleLayers = layerFilter === 'overlapping' && selectedLayerIds.length > 1
    ? sortedLayers.filter((layer) => selectedLayerIds.includes(layer.id))
    : sortedLayers;

  const getLayerIcon = (layer: LayerLike) => {
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

  const getLayerSnippet = (layer: LayerLike): string | null => {
    const p = layer.props as Record<string, unknown>;
    if (layer.blockType === 'WhatsAppCtaButton') return String(p.whatsAppText ?? 'WhatsApp');
    if (layer.blockType === 'AdvisorQuoteBox') return String(p.message ?? '').slice(0, 30);
    if (layer.blockType === 'TrustBadgeTitle') return String(p.title ?? '');
    if (layer.blockType === 'AdvisorAvatarBadge') return String(p.name ?? 'Sofía');
    if (layer.blockType === 'ProviderBadge') return String(p.name ?? 'Aseguradora');
    return null;
  };

  const startEditing = (layer: LayerLike, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLayerId(layer.id);
    setEditingTitle(layer.title);
  };

  const handleSaveTitle = (layerId: string) => {
    if (editingTitle.trim()) {
      onRenameLayer?.(layerId, editingTitle.trim());
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

  if (context.state === 'disabled') return <div role="status" className="p-4 text-xs text-slate-400">Capas no disponibles en este estudio.</div>;
  if (context.state === 'loading') return <div role="status" className="p-4 text-xs text-slate-400">Cargando capas…</div>;
  if (context.state === 'error') return <div role="alert" className="p-4 text-xs text-rose-200">{context.error ?? 'No se pudieron cargar las capas.'}</div>;

  return (
    <div className="flex flex-col space-y-2.5 select-none text-xs" data-core-resource-content="layers" data-resource-block="layers">
    <div data-resource-header className="grid grid-cols-2 gap-1 border-b border-slate-800/80 pb-2">
      {([
        ['organize', 'Organizar'],
        ['layers', 'Capas'],
      ] as const).map(([id, label]) => (
        <button
          key={id}
          type="button"
          aria-pressed={activePanel === id}
          onClick={() => setActivePanel(id)}
          className={`min-h-9 rounded-lg border px-3 text-xs font-semibold transition-colors ${
            activePanel === id
              ? 'border-brand-cyan/60 bg-primary/40 text-brand-cyan'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
          }`}
        >
          {label}
        </button>
      ))}
    </div>

    {activePanel === 'organize' && (
      <div className="space-y-2 border-b border-slate-800/80 pb-2">
        <div className="grid grid-cols-2 gap-2">
          {([
            ['up', 'Adelante'],
            ['down', 'Atrás'],
          ] as const).map(([direction, label]) => (
            <button
              key={direction}
              type="button"
              disabled={!selectedLayerId || !onMoveZIndex}
              onClick={() => selectedLayerId && onMoveZIndex?.(selectedLayerId, direction)}
              className="min-h-9 rounded-lg border border-slate-700 bg-slate-900 px-2 text-xs text-slate-300 transition-colors hover:border-brand-cyan/60 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500">
          Selecciona una capa para cambiar su orden en el lienzo.
        </p>
      </div>
    )}

    {activePanel === 'layers' && (
      <>
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

      <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-900/70 p-1">
        {([
          ['all', 'Todas'],
          ['overlapping', 'Superpuestas'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={layerFilter === id}
            onClick={() => setLayerFilter(id)}
            className={`min-h-8 rounded-md px-2 text-[11px] font-semibold ${
              layerFilter === id ? 'bg-slate-100 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* LISTA ORDENADA DE CAPAS (CON DRAG & DROP NATIVO) */}
      {visibleLayers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center text-slate-500 text-xs">
          No hay capas en este lienzo. Añade un bloque desde la biblioteca.
        </div>
      ) : (
        <div className="space-y-1 max-h-[calc(100vh-340px)] overflow-y-auto pr-1 custom-scrollbar">
          {visibleLayers.map((layer, index) => {
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
                  onSelectLayer(layer.id, { additive: e.shiftKey || e.metaKey || e.ctrlKey });
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
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* ACCIONES SECUNDARIAS EN HOVER / SELECCIONADO */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={!onMoveZIndex || index === 0}
                      onClick={() => onMoveZIndex?.(layer.id, 'up')}
                      className="flex size-5 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-20 transition-colors"
                      title="Traer al frente"
                    >
                      <ArrowUp className="size-3" />
                    </button>
                    <button
                      type="button"
                      disabled={!onMoveZIndex || index === sortedLayers.length - 1}
                      onClick={() => onMoveZIndex?.(layer.id, 'down')}
                      className="flex size-5 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-20 transition-colors"
                      title="Enviar al fondo"
                    >
                      <ArrowDown className="size-3" />
                    </button>
                    <button
                      type="button"
                      disabled={!onDuplicateLayer}
                      onClick={() => onDuplicateLayer?.(layer.id)}
                      className="flex size-5 items-center justify-center rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      title="Duplicar capa"
                    >
                      <Copy className="size-3" />
                    </button>
                    <button
                      type="button"
                      disabled={!onRemoveLayer}
                      onClick={() => onRemoveLayer?.(layer.id)}
                      className="flex size-5 items-center justify-center rounded text-white hover:bg-rose-950/60 hover:text-rose-300 transition-colors"
                      title="Eliminar capa"
                    >
                      <Trash2 className="size-3" />
                    </button>
                    <div className="h-3 w-px bg-slate-800 mx-0.5" />
                  </div>

                  {/* LOCK TOGGLE (SIEMPRE VISIBLE SI BLOQUEADA O HOVER) */}
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

                  {/* VISIBILITY TOGGLE (SIEMPRE VISIBLE) */}
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
                </div>
              </div>
            );
          })}
        </div>
      )}
      </>
      )}
    </div>
  );
};
