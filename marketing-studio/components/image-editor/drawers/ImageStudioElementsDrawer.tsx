import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Shapes,
  ShieldCheck,
  MousePointerClick,
  Layers,
  FolderHeart,
  Plus,
  X,
  CheckCircle2,
  Shield,
  MessageCircle,
} from 'lucide-react';
import {
  ELEMENT_PRESETS,
  ELEMENT_PRESET_CATEGORIES,
} from '../../../data/elementsPresets';
import { ImageBlockType, ImageLayer } from '../../../types/imageStudio';
import { getSavedCustomElements, SavedCustomElement } from '../../../utils/savedElementsStorage';

export interface ImageStudioElementsDrawerProps {
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
  onInsertSavedLayer?: (layer: ImageLayer) => void;
}

export const ImageStudioElementsDrawer: React.FC<ImageStudioElementsDrawerProps> = ({
  onAddBlock,
  onInsertSavedLayer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshTick, setRefreshTick] = useState<number>(0);

  useEffect(() => {
    const handleStorageUpdate = () => setRefreshTick((prev) => prev + 1);
    window.addEventListener('vitablue_saved_elements_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('vitablue_saved_elements_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const savedElements = useMemo<SavedCustomElement[]>(() => {
    return getSavedCustomElements().filter((e) => e.category === 'shape' || e.category === 'card' || e.category === 'group');
  }, [refreshTick]);

  const categories = useMemo(() => {
    const base = [...ELEMENT_PRESET_CATEGORIES];
    if (savedElements.length > 0) {
      base.push({ id: 'saved', name: `⭐ Mis Elementos (${savedElements.length})`, iconName: 'FolderHeart' });
    }
    return base;
  }, [savedElements]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shapes':
        return <Shapes className="size-3.5 shrink-0" />;
      case 'ShieldCheck':
        return <ShieldCheck className="size-3.5 shrink-0" />;
      case 'MousePointerClick':
        return <MousePointerClick className="size-3.5 shrink-0" />;
      case 'Layers':
        return <Layers className="size-3.5 shrink-0" />;
      case 'FolderHeart':
        return <FolderHeart className="size-3.5 shrink-0 text-amber-400" />;
      default:
        return <Sparkles className="size-3.5 shrink-0" />;
    }
  };

  const filteredPresets = useMemo(() => {
    return ELEMENT_PRESETS.filter((preset) => {
      const matchesCategory =
        selectedCategory === 'all' || preset.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        preset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (preset.badge && preset.badge.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const filteredSavedElements = useMemo(() => {
    return savedElements.filter((item) => {
      return (
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [savedElements, searchQuery]);

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100 select-none">
      {/* 1. BUSCADOR SUPERIOR */}
      <div className="p-3 border-b border-slate-800 shrink-0 bg-slate-950/60">
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar elementos (WhatsApp, sello, escudo, glass...)"
            className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8.5 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-brand-cyan focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-slate-400 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. CHIPS DE CATEGORÍAS */}
      <div className="flex items-center gap-1.5 p-2.5 border-b border-slate-800 bg-slate-950 overflow-x-auto no-scrollbar shrink-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-primary/30 text-brand-cyan border border-brand-cyan/50 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {getCategoryIcon(cat.iconName)}
              <span className="truncate">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. LISTADO DE ELEMENTOS */}
      <div className="flex-1 overflow-y-auto p-3.5 custom-scrollbar space-y-3">
        {/* SECCIÓN MIS ELEMENTOS GUARDADOS (SI ESTÁ SELECCIONADA O TIENE CONTENIDO) */}
        {selectedCategory === 'saved' ? (
          <div className="space-y-2.5">
            {filteredSavedElements.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <FolderHeart className="size-8 mx-auto text-slate-600" />
                <p className="text-xs font-bold text-slate-400">No hay elementos guardados coincidentes</p>
                <p className="text-[11px] text-slate-500">
                  Selecciona cualquier elemento en el lienzo y pulsa "⭐ Guardar en Mis Diseños".
                </p>
              </div>
            ) : (
              filteredSavedElements.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onInsertSavedLayer?.(item.layer)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:border-amber-400 hover:bg-amber-500/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                      <FolderHeart className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 truncate block">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ⭐ Elemento Personalizado
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300/80 group-hover:text-amber-300 shrink-0">
                    <Plus className="size-3.5" />
                    <span>Añadir</span>
                  </span>
                </button>
              ))
            )}
          </div>
        ) : (
          /* PRESETS DE ELEMENTOS */
          <div className="space-y-2.5">
            {filteredPresets.map((item) => (
              <div
                key={item.id}
                onClick={() => onAddBlock(item.blockType, item.defaultProps)}
                className="group relative flex flex-col justify-between p-3 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-brand-cyan hover:bg-slate-900 transition-all cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* ICONO IDENTIFICADOR */}
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-brand-cyan group-hover:border-brand-cyan">
                      {item.category === 'trust_stamps' ? (
                        <ShieldCheck className="size-4" />
                      ) : item.category === 'ctas' ? (
                        <MessageCircle className="size-4 text-amber-400" />
                      ) : item.category === 'surfaces' ? (
                        <Layers className="size-4" />
                      ) : (
                        <Shield className="size-4 text-brand-cyan" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <strong className="block text-xs font-bold text-slate-100 group-hover:text-brand-cyan transition-colors truncate">
                        {item.title}
                      </strong>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span className="rounded-md bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* PREVISUALIZACIÓN VISUAL REAL DEL ELEMENTO */}
                <div className="my-1.5 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800/80 p-2.5 overflow-hidden">
                  {item.blockType === 'WhatsAppCtaButton' && (
                    <div className="flex items-center gap-1.5 rounded-xl bg-[#005F73] border border-[#EE9B00] px-3 py-1.5 text-[11px] font-bold text-white shadow-xs">
                      <span>💬</span>
                      <span className="truncate">{String(item.defaultProps.ctaText)}</span>
                    </div>
                  )}

                  {item.blockType === 'TrustVerifiedPill' && (
                    <div className="flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      <span>{String(item.defaultProps.verifiedLabel)}</span>
                    </div>
                  )}

                  {item.blockType === 'TrustHighlightPill' && (
                    <div className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-[10px] font-black tracking-wider text-amber-300">
                      {String(item.defaultProps.highlight)}
                    </div>
                  )}

                  {item.blockType === 'HookAlertBadge' && (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-950/90 px-3 py-0.5 text-[10px] font-black uppercase text-brand-cyan">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{String(item.defaultProps.badge)}</span>
                    </div>
                  )}

                  {item.blockType === 'TrustShieldIcon' && (
                    <Shield className="size-7 text-amber-400" />
                  )}

                  {item.blockType === 'GlassCardSurface' && (
                    <div className={`h-8 w-full max-w-[200px] rounded-xl border ${
                      item.defaultProps.variant === 'amber'
                        ? 'border-amber-500/40 bg-amber-500/10'
                        : 'border-teal-500/40 bg-teal-950/40'
                    }`} />
                  )}

                  {item.blockType === 'TrustBadgeSubtitle' && (
                    <span className="text-[11px] font-bold text-amber-300">
                      {String(item.defaultProps.text)}
                    </span>
                  )}
                </div>

                {/* BOTÓN INFERIOR DE ACCIÓN */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-brand-cyan transition-colors">
                    <Plus className="size-3.5" />
                    <span>Añadir al Lienzo</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
