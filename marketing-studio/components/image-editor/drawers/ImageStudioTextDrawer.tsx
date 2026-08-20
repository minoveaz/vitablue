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

  const [customInputText, setCustomInputText] = useState<string>('');
  const [customTag, setCustomTag] = useState<'h1' | 'h2' | 'h3' | 'p' | 'badge'>('h2');
  const [customColor, setCustomColor] = useState<string>('#FFFFFF');
  const [isCustomCreatorOpen, setIsCustomCreatorOpen] = useState<boolean>(false);

  const handleAddCustomText = (tag: 'h1' | 'h2' | 'h3' | 'p' | 'badge' = customTag, text?: string, color: string = customColor) => {
    const textToAdd = text ?? (customInputText.trim() || (tag === 'h1' ? 'Añadir un título' : tag === 'h2' ? 'Añadir un subtítulo' : tag === 'badge' ? 'ETIQUETA' : 'Añadir texto de cuerpo'));
    
    const sizeMap = {
      h1: 36,
      h2: 24,
      h3: 18,
      p: 15,
      badge: 12,
    };

    const weightMap: Record<string, '400' | '500' | '600' | '700' | '800'> = {
      h1: '800',
      h2: '700',
      h3: '600',
      p: '400',
      badge: '700',
    };

    const fontMap = {
      h1: 'Poppins, sans-serif',
      h2: 'Poppins, sans-serif',
      h3: 'Poppins, sans-serif',
      p: 'Inter, sans-serif',
      badge: 'Inter, sans-serif',
    };

    onAddTextLayer({
      id: `custom-text-${Date.now()}`,
      title: tag === 'h1' ? 'Título Principal' : tag === 'h2' ? 'Subtítulo' : tag === 'badge' ? 'Píldora' : 'Párrafo',
      category: 'basics',
      previewText: textToAdd,
      defaultText: textToAdd,
      tag: tag,
      fontSize: sizeMap[tag],
      fontWeight: weightMap[tag],
      fontFamily: fontMap[tag],
      fill: color,
      align: 'center',
    });

    if (customInputText) {
      setCustomInputText('');
    }
  };

  return (
    <div className="flex h-full flex-col text-white">
      {/* 1. SECCIÓN PRINCIPAL: BOTONES CANVA-STYLE DE TEXTO LIBRE Y JERARQUÍAS */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950 space-y-2.5 shrink-0">
        {/* BOTÓN MAESTRO: AÑADIR CUADRO DE TEXTO */}
        <button
          type="button"
          onClick={() => handleAddCustomText('h2', 'Escribe tu texto')}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-teal-700 to-primary hover:brightness-110 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-primary/25 transition-all active:scale-[0.98]"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>Añadir un cuadro de texto</span>
        </button>

        {/* ACCIONES RÁPIDAS DE JERARQUÍA (H1, H2, PÁRRAFO, BADGE) */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={() => handleAddCustomText('h1', 'Añadir un título', '#FFFFFF')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-brand-cyan hover:bg-slate-900 transition-all text-center group"
          >
            <span className="text-xs font-black text-slate-100 group-hover:text-brand-cyan truncate font-display">
              Título
            </span>
            <span className="text-[9px] text-slate-500 font-mono">H1 · 36px</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddCustomText('h2', 'Añadir un subtítulo', '#94D2BD')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-brand-cyan hover:bg-slate-900 transition-all text-center group"
          >
            <span className="text-xs font-bold text-brand-cyan truncate font-display">
              Subtítulo
            </span>
            <span className="text-[9px] text-slate-500 font-mono">H2 · 24px</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddCustomText('p', 'Añadir texto de cuerpo', '#E2E8F0')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-brand-cyan hover:bg-slate-900 transition-all text-center group"
          >
            <span className="text-xs font-normal text-slate-300 group-hover:text-white truncate">
              Cuerpo
            </span>
            <span className="text-[9px] text-slate-500 font-mono">P · 15px</span>
          </button>
        </div>

        {/* TOGGLE CREADOR A MEDIDA */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsCustomCreatorOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3 text-amber-400" />
              <span>Personalizar texto antes de insertar</span>
            </span>
            <span className="text-slate-500 font-mono text-[10px]">{isCustomCreatorOpen ? '▲' : '▼'}</span>
          </button>

          {isCustomCreatorOpen && (
            <div className="mt-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900/90 space-y-2">
              <input
                type="text"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="Escribe tu texto aquí..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {(['h1', 'h2', 'p', 'badge'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setCustomTag(t)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                        customTag === t ? 'bg-primary text-brand-cyan border border-brand-cyan/40' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  {['#FFFFFF', '#EE9B00', '#94D2BD', '#005F73'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCustomColor(c)}
                      className={`size-4 rounded-full border ${customColor === c ? 'ring-2 ring-brand-cyan border-white' : 'border-slate-700'}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddCustomText()}
                className="w-full py-1.5 rounded-lg bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 font-black text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
              >
                <Plus className="size-3.5 stroke-[3]" />
                <span>Insertar Texto Personalizado</span>
              </button>
            </div>
          )}
        </div>

        {/* BUSCADOR DE PRESETS */}
        <div className="relative flex items-center pt-1">
          <Search className="absolute left-3 size-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ganchos, precios, estilos..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-8 pr-8 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-brand-cyan focus:bg-slate-900 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. ESTRUCTURA SPLIT DE 2 ZONAS (SUBCATEGORÍAS + PREVIEWS) */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* COLUMNA IZQUIERDA: LISTA VERTICAL DE SUBCATEGORÍAS */}
        <div className="w-28 sm:w-32 border-r border-slate-800/80 bg-slate-950/60 p-2 overflow-y-auto custom-scrollbar flex flex-col gap-1 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-2 py-1">
            Plantillas
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
