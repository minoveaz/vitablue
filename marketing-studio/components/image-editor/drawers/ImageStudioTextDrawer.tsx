import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Type,
  Flame,
  BadgePercent,
  MessageSquare,
  ShieldCheck,
  Layers,
  CheckSquare,
  FolderHeart,
  Plus,
  X,
} from 'lucide-react';
import {
  TEXT_PRESETS,
  TEXT_PRESET_CATEGORIES,
  TextPresetItem,
} from '../../../data/textPresets';
import { getSavedCustomElements } from '../../../utils/savedElementsStorage';

export interface ImageStudioTextDrawerProps {
  onAddTextLayer: (preset: TextPresetItem) => void;
}

export const ImageStudioTextDrawer: React.FC<ImageStudioTextDrawerProps> = ({
  onAddTextLayer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScope, setSelectedScope] = useState<'system' | 'organization' | 'user'>('system');
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

  const savedTextPresets = useMemo<TextPresetItem[]>(() => {
    const saved = getSavedCustomElements().filter((e) => e.category === 'text');
    return saved.map((s) => ({
      id: s.id,
      category: 'basics',
      title: s.title,
      previewText: String(s.layer.props?.text ?? s.layer.title),
      subText: '⭐ Guardado en tu kit de diseños',
      defaultText: String(s.layer.props?.text ?? s.layer.title),
      tag: (s.layer.props?.tag as TextPresetItem['tag']) ?? 'h2',
      fontSize: s.layer.fontSize ?? 36,
      fontWeight: (s.layer.fontWeight as TextPresetItem['fontWeight']) ?? '700',
      fontFamily: s.layer.fontFamily ?? 'Poppins, sans-serif',
      fill: s.layer.fill ?? '#FFFFFF',
      align: s.layer.align ?? 'center',
      letterSpacing: s.layer.letterSpacing,
      lineHeight: s.layer.lineHeight,
      textEffect: s.layer.textEffect,
      boxColor: s.layer.boxColor,
    }));
  }, [refreshTick]);

  const scopedPresets = useMemo(() => {
    if (selectedScope === 'user') return savedTextPresets;
    return TEXT_PRESETS.filter((preset) => (preset.scope ?? 'organization') === selectedScope);
  }, [selectedScope, savedTextPresets]);

  const categoryCounts = useMemo(() => {
    return new Map([
      ['all', scopedPresets.length],
      ...TEXT_PRESET_CATEGORIES
        .filter((category) => category.id !== 'all')
        .map((category) => [
          category.id,
          scopedPresets.filter((preset) => preset.category === category.id).length,
        ] as const),
    ]);
  }, [scopedPresets]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Type':
        return <Type className="size-3.5 shrink-0" />;
      case 'Layers':
        return <Layers className="size-3.5 shrink-0" />;
      case 'CheckSquare':
        return <CheckSquare className="size-3.5 shrink-0" />;
      case 'Flame':
        return <Flame className="size-3.5 shrink-0" />;
      case 'BadgePercent':
        return <BadgePercent className="size-3.5 shrink-0" />;
      case 'MessageSquare':
        return <MessageSquare className="size-3.5 shrink-0" />;
      case 'ShieldCheck':
        return <ShieldCheck className="size-3.5 shrink-0" />;
      case 'FolderHeart':
        return <FolderHeart className="size-3.5 shrink-0" />;
      default:
        return <Sparkles className="size-3.5 shrink-0" />;
    }
  };

  const filteredPresets = useMemo(() => {
    if (selectedScope === 'user' || selectedCategory === 'saved') {
      return scopedPresets.filter((preset) => {
        return (
          searchQuery.trim() === '' ||
          preset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          preset.previewText.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return scopedPresets.filter((preset) => {
      const matchesCategory =
        selectedCategory === 'all' || preset.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        preset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.previewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.defaultText.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, selectedScope, searchQuery, scopedPresets]);

  const handleAddQuickText = (tag: 'h1' | 'h2' | 'p' | 'badge') => {
    const sizeMap = {
      h1: 56,
      h2: 42,
      p: 24,
      badge: 18,
    };

    const weightMap: Record<string, '400' | '500' | '600' | '700' | '800'> = {
      h1: '800',
      h2: '700',
      p: '400',
      badge: '700',
    };

    const fontMap = {
      h1: 'Poppins, sans-serif',
      h2: 'Poppins, sans-serif',
      p: 'Inter, sans-serif',
      badge: 'Inter, sans-serif',
    };

    const colorMap = {
      h1: '#FFFFFF',
      h2: '#94D2BD',
      p: '#E2E8F0',
      badge: '#EE9B00',
    };

    const labelMap = {
      h1: 'Añadir un título',
      h2: 'Añadir un subtítulo',
      p: 'Añadir texto de cuerpo',
      badge: 'ETIQUETA',
    };

    onAddTextLayer({
      id: `custom-text-${Date.now()}`,
      title: tag === 'h1' ? 'Título Principal' : tag === 'h2' ? 'Subtítulo' : tag === 'badge' ? 'Píldora' : 'Párrafo',
      category: 'basics',
      previewText: labelMap[tag],
      defaultText: labelMap[tag],
      tag: tag,
      fontSize: sizeMap[tag],
      fontWeight: weightMap[tag],
      fontFamily: fontMap[tag],
      fill: colorMap[tag],
      align: 'center',
    });
  };

  return (
    <div className="flex h-full flex-col text-white select-none">
      {/* 1. SECCIÓN SUPERIOR DE ACCIONES RÁPIDAS (CANVA STYLE) */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-950 space-y-3 shrink-0">
        {/* BOTÓN PRINCIPAL: + AÑADIR CUADRO DE TEXTO */}
        <button
          type="button"
          onClick={() => handleAddQuickText('h2')}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-teal-700 to-primary hover:brightness-110 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-primary/25 transition-all active:scale-[0.98]"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>Añadir un cuadro de texto</span>
        </button>

        {/* FILA DE JERARQUÍAS RÁPIDAS (H1, H2, CUERPO P) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleAddQuickText('h1')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-brand-cyan hover:bg-slate-900 transition-all text-center group"
          >
            <span className="text-xs font-black text-slate-100 group-hover:text-brand-cyan truncate font-display">
              Título
            </span>
            <span className="text-[10px] text-slate-400 font-mono">H1 · 56px</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddQuickText('h2')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-brand-cyan hover:bg-slate-900 transition-all text-center group"
          >
            <span className="text-xs font-bold text-brand-cyan truncate font-display">
              Subtítulo
            </span>
            <span className="text-[10px] text-slate-400 font-mono">H2 · 42px</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddQuickText('p')}
            className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:border-brand-cyan hover:bg-slate-900 transition-all text-center group"
          >
            <span className="text-xs font-normal text-slate-300 group-hover:text-white truncate">
              Cuerpo
            </span>
            <span className="text-[10px] text-slate-400 font-mono">P · 24px</span>
          </button>
        </div>

        {/* BUSCADOR DE RECURSOS Y GANCHOS */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ganchos, precios, estilos..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-8 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-brand-cyan focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 transition-colors"
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

        <nav aria-label="Bibliotecas de texto" className="grid grid-cols-3 gap-1.5">
          {([
            ['system', 'Universal'],
            ['organization', 'Empresa'],
            ['user', 'Míos'],
          ] as const).map(([scope, label]) => (
            <button
              key={scope}
              type="button"
              aria-pressed={selectedScope === scope}
              onClick={() => {
                setSelectedScope(scope);
                setSelectedCategory(scope === 'user' ? 'saved' : 'all');
              }}
              className={`min-h-9 rounded-lg border px-2 text-[11px] font-semibold transition-colors ${
                selectedScope === scope
                  ? 'border-brand-cyan/60 bg-primary/50 text-brand-cyan'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* 2. ZONA DE RESULTADOS EN ANCHO COMPLETO (1 SOLA COLUMNA CON MÁXIMO AIRE) */}
      <div className="flex-1 overflow-y-auto p-3.5 custom-scrollbar space-y-3 bg-[#050B14]/40">
        {selectedScope !== 'user' && (
          <nav aria-label="Categorías de texto" className="grid grid-cols-2 gap-2">
            {TEXT_PRESET_CATEGORIES.filter((cat) => (categoryCounts.get(cat.id) ?? 0) > 0).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                aria-current={selectedCategory === cat.id ? 'page' : undefined}
                className={`flex min-h-14 flex-col justify-between rounded-lg border p-2.5 text-left ${
                  selectedCategory === cat.id
                    ? 'border-brand-cyan/50 bg-primary/40 text-brand-cyan'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="flex items-center justify-between">
                  {getCategoryIcon(cat.icon)}
                  <span className="text-[9px] text-slate-500">{categoryCounts.get(cat.id) ?? 0}</span>
                </span>
                <span className="truncate text-[10px] font-semibold">{cat.name}</span>
              </button>
            ))}
          </nav>
        )}

        {filteredPresets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center p-4">
            <Search className="size-8 text-slate-600 mb-2 stroke-[1.5]" />
            <p className="text-xs font-semibold text-slate-300">
              No se encontraron estilos de texto
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Intenta con otra palabra clave o selecciona "Todos"
            </p>
          </div>
        ) : (
          filteredPresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onAddTextLayer(preset)}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/70 p-3.5 hover:border-brand-cyan/60 hover:bg-slate-900 hover:shadow-lg transition-all cursor-pointer select-none"
            >
              {/* CABECERA DE LA TARJETA */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-brand-cyan transition-colors truncate">
                    {preset.title}
                  </span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono uppercase text-slate-400">
                    {preset.tag}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTextLayer(preset);
                  }}
                  className="flex items-center gap-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 px-2.5 py-0.5 text-[10px] font-black text-brand-cyan hover:bg-brand-cyan hover:text-slate-950 transition-all shadow-xs shrink-0"
                >
                  <Plus className="size-3" />
                  <span>Insertar</span>
                </button>
              </div>

              {/* CONTENEDOR DE PREVISUALIZACIÓN TIPOGRÁFICA REAL */}
              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3.5 flex items-center justify-center min-h-[56px] text-center overflow-hidden">
                <div
                  style={{
                    fontFamily: preset.fontFamily,
                    fontSize: `${Math.min(18, preset.fontSize)}px`,
                    fontWeight: preset.fontWeight,
                    color: preset.fill,
                    textAlign: preset.align,
                    letterSpacing: `${preset.letterSpacing ?? 0}px`,
                    lineHeight: preset.lineHeight ?? 1.25,
                    textTransform: preset.textTransform ?? 'none',
                    backgroundColor: preset.textEffect === 'box' ? (preset.boxColor ?? '#EE9B00') : undefined,
                    padding: preset.textEffect === 'box' ? '4px 10px' : undefined,
                    borderRadius: preset.textEffect === 'box' ? '8px' : undefined,
                    textShadow: preset.textEffect === 'glow' ? '0 0 14px rgba(148, 210, 189, 0.9)' : undefined,
                  }}
                  className="break-words whitespace-pre-line w-full"
                >
                  {preset.previewText}
                </div>
              </div>

              {/* SUBTEXTO / METADATOS TÉCNICOS */}
              {preset.subText && (
                <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span>{preset.subText}</span>
                  <span className="text-[10px] text-slate-500 font-sans">{preset.fontFamily.split(',')[0]}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
