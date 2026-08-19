import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Type,
  Flame,
  BadgePercent,
  MessageSquare,
  ShieldCheck,
  Plus,
  X,
} from 'lucide-react';
import {
  TEXT_PRESETS,
  TEXT_PRESET_CATEGORIES,
  TextPresetItem,
} from '../../../data/textPresets';

export interface ImageStudioTextDrawerProps {
  onAddTextLayer: (preset: TextPresetItem) => void;
}

export const ImageStudioTextDrawer: React.FC<ImageStudioTextDrawerProps> = ({
  onAddTextLayer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Type':
        return <Type className="size-3.5" />;
      case 'Flame':
        return <Flame className="size-3.5" />;
      case 'BadgePercent':
        return <BadgePercent className="size-3.5" />;
      case 'MessageSquare':
        return <MessageSquare className="size-3.5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="size-3.5" />;
      default:
        return <Sparkles className="size-3.5" />;
    }
  };

  const filteredPresets = useMemo(() => {
    return TEXT_PRESETS.filter((preset) => {
      const matchesCategory =
        selectedCategory === 'all' || preset.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        preset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.previewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.defaultText.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex h-full flex-col text-white">
      {/* 1. BUSCADOR SUPERIOR */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/80 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar títulos, ganchos, precios..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-8.5 pr-7 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 text-slate-500 hover:text-slate-300"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. ESTRUCTURA SPLIT DE 2 ZONAS (SUBCATEGORÍAS + PREVIEWS) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* COLUMNA IZQUIERDA: LISTA VERTICAL DE SUBCATEGORÍAS */}
        <div className="w-28 sm:w-32 border-r border-slate-800/80 bg-slate-950/60 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-1 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 py-1">
            Categorías
          </span>
          {TEXT_PRESET_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex w-full items-center justify-between gap-1.5 rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary/20 text-brand-cyan border border-primary/40 shadow-xs'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={isActive ? 'text-brand-cyan' : 'text-slate-500'}>
                    {getCategoryIcon(cat.icon)}
                  </span>
                  <span className="truncate text-[11px]">{cat.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* COLUMNA DERECHA: PREVISUALIZACIÓN INTERACTIVA DE ELEMENTOS */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar bg-[#050B14]/40">
          {filteredPresets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center p-4">
              <Search className="size-8 text-slate-600 mb-2 stroke-[1.5]" />
              <p className="text-xs font-semibold text-slate-400">
                No se encontraron estilos de texto
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Intenta con otra palabra clave o categoría
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => onAddTextLayer(preset)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5 hover:border-brand-cyan/50 hover:bg-slate-900 hover:shadow-lg transition-all cursor-pointer select-none"
                >
                  {/* METADATOS SUPERIORES */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      {preset.title}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 flex items-center gap-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 px-2 py-0.5 text-[10px] font-black text-brand-cyan transition-opacity shadow-xs">
                      <Plus className="size-2.5" />
                      <span>Insertar</span>
                    </span>
                  </div>

                  {/* PREVISUALIZACIÓN REAL DE LA TIPOGRAFÍA */}
                  <div className="py-1">
                    <div
                      style={{
                        fontFamily: preset.fontFamily,
                        fontSize: `${Math.min(22, preset.fontSize)}px`,
                        fontWeight: preset.fontWeight,
                        color: preset.fill,
                        textAlign: preset.align,
                        letterSpacing: `${preset.letterSpacing ?? 0}px`,
                        lineHeight: preset.lineHeight ?? 1.2,
                        textTransform: preset.textTransform ?? 'none',
                      }}
                      className="break-words"
                    >
                      {preset.previewText}
                    </div>
                  </div>

                  {/* SUBTEXTO / DESCRIPCIÓN TÉCNICA */}
                  {preset.subText && (
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">
                      {preset.subText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
