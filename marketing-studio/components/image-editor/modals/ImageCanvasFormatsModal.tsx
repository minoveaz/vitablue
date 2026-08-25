import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Smartphone,
  Square,
  Tv,
  Mail,
  FileText,
  Table,
  Monitor,
  Check,
  Sparkles,
  Sliders,
  ChevronRight,
} from 'lucide-react';
import { ImageFormatPreset, IMAGE_FORMAT_PRESETS } from '../../../types/imageStudio';

export interface ImageCanvasFormatsModalProps {
  isOpen: boolean;
  currentPreset: ImageFormatPreset;
  onSelectPreset: (preset: ImageFormatPreset) => void;
  onClose: () => void;
}

export const ImageCanvasFormatsModal: React.FC<ImageCanvasFormatsModalProps> = ({
  isOpen,
  currentPreset,
  onSelectPreset,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Inputs para tamaño personalizado
  const [customWidth, setCustomWidth] = useState<number>(1080);
  const [customHeight, setCustomHeight] = useState<number>(1350);

  const categories = [
    { id: 'all', name: '✨ Todos', count: IMAGE_FORMAT_PRESETS.length },
    { id: 'carousel', name: '🎠 Carruseles Multi-Slide', count: 5 },
    { id: 'social', name: '📱 Redes & Ads', count: 6 },
    { id: 'email_marketing', name: '✉️ Email Marketing', count: 4 },
    { id: 'documents', name: '📄 Docs Word & PDF', count: 3 },
    { id: 'sheets', name: '📊 Sheets & Excel', count: 2 },
    { id: 'web_marketing', name: '🖥️ Web & Blog', count: 3 },
    { id: 'custom', name: '📐 Personalizado', count: 0 },
  ];

  const getFormatIcon = (iconName: string) => {
    switch (iconName) {
      case 'Instagram':
      case 'Smartphone':
        return <Smartphone className="size-4" />;
      case 'Square':
        return <Square className="size-4" />;
      case 'Tv':
      case 'Youtube':
        return <Tv className="size-4" />;
      case 'Mail':
        return <Mail className="size-4" />;
      case 'FileText':
        return <FileText className="size-4" />;
      case 'Table':
        return <Table className="size-4" />;
      case 'Monitor':
        return <Monitor className="size-4" />;
      default:
        return <Sparkles className="size-4" />;
    }
  };

  const filteredPresets = useMemo(() => {
    return IMAGE_FORMAT_PRESETS.filter((p) => {
      let matchesCategory = true;
      if (activeCategory === 'social') {
        matchesCategory = ['instagram', 'tiktok', 'linkedin', 'facebook', 'twitter', 'youtube'].includes(p.category);
      } else if (activeCategory !== 'all') {
        matchesCategory = p.category === activeCategory;
      }

      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.recommendedFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${p.width}x${p.height}`.includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const w = Math.max(200, Math.min(customWidth, 4000));
    const h = Math.max(200, Math.min(customHeight, 4000));
    const custom: ImageFormatPreset = {
      id: `custom-${w}x${h}`,
      name: `Personalizado (${w} × ${h} px)`,
      category: 'custom',
      width: w,
      height: h,
      aspectRatio: `${(w / h).toFixed(2)}:1`,
      description: 'Lienzo de dimensiones personalizadas',
      iconName: 'Sliders',
      recommendedFor: 'Proyectos y especificaciones a medida',
    };
    onSelectPreset(custom);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[85vh] rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/20 border border-primary/40 text-brand-cyan shadow-inner">
              <Sliders className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Catálogo de Formatos & Dimensiones de Lienzo</span>
              </h2>
              <p className="text-xs text-slate-400">
                Selecciona el formato óptimo para Redes Sociales, Email, Documentos Word/PDF o Hojas de Cálculo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Cerrar modal (Esc)"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 2. FILTROS Y BUSCADOR */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 space-y-3 shrink-0">
          {/* BUSCADOR */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar formato (ej: Instagram 4:5, Newsletter, Portada Word A4, YouTube, Dashboard...)"
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-brand-cyan focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 transition-colors shadow-inner"
            />
          </div>

          {/* CHIPS DE CATEGORÍAS */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/40 to-teal-900/60 text-brand-cyan border border-brand-cyan shadow-sm ring-1 ring-brand-cyan/30'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.count > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. CONTENIDO: CUADRÍCULA DE FORMATOS */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {activeCategory === 'custom' ? (
            /* SECCIÓN PERSONALIZADA */
            <form onSubmit={handleApplyCustom} className="max-w-md mx-auto py-8 space-y-5">
              <div className="text-center space-y-1 mb-6">
                <div className="size-12 rounded-2xl bg-primary/20 border border-primary/30 text-brand-cyan flex items-center justify-center mx-auto mb-2">
                  <Sliders className="size-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-100">Dimensiones a Medida</h3>
                <p className="text-xs text-slate-400">Define el ancho y alto exacto en píxeles para tu lienzo</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Ancho (px)
                  </label>
                  <input
                    type="number"
                    min={200}
                    max={4000}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-sm font-mono text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Alto (px)
                  </label>
                  <input
                    type="number"
                    min={200}
                    max={4000}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-sm font-mono text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-accent to-amber-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all shadow-lg"
              >
                Aplicar Dimensiones ({customWidth} × {customHeight} px)
              </button>
            </form>
          ) : (
            /* LISTADO DE TARJETAS DE FORMATO */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredPresets.map((preset) => {
                const isCurrent = Boolean(
                  currentPreset &&
                    currentPreset.id === preset.id
                );
                const ratioValue = preset.width / preset.height;
                const isVertical = ratioValue < 0.9;
                const isHorizontal = ratioValue > 1.2;

                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-brand-cyan bg-primary/20 shadow-lg ring-1 ring-brand-cyan/40'
                        : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* HEADER TARJETA */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${
                            isCurrent
                              ? 'bg-primary border-brand-cyan/40 text-brand-cyan'
                              : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-slate-200'
                          }`}>
                            {getFormatIcon(preset.iconName)}
                          </div>
                          <span className="text-xs font-bold text-slate-100 group-hover:text-brand-cyan transition-colors truncate">
                            {preset.name}
                          </span>
                        </div>

                        <span className="rounded-lg bg-slate-950 border border-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                          {preset.aspectRatio}
                        </span>
                      </div>

                      {/* PREVIEW GEOMÉTRICA PROPORCIONAL DEL ASPECT RATIO */}
                      <div className="my-2.5 flex h-20 w-full items-center justify-center rounded-xl bg-slate-950/80 border border-slate-800/80 p-2">
                        <div
                          className={`rounded-md border-2 transition-all flex items-center justify-center text-[10px] font-mono font-bold ${
                            isCurrent
                              ? 'border-brand-cyan bg-brand-cyan/15 text-brand-cyan'
                              : 'border-slate-700 bg-slate-900 text-slate-500 group-hover:border-slate-500 group-hover:text-slate-300'
                          }`}
                          style={{
                            width: isVertical ? '34px' : isHorizontal ? '68px' : '46px',
                            height: isVertical ? '54px' : isHorizontal ? '34px' : '46px',
                          }}
                        >
                          {preset.aspectRatio}
                        </div>
                      </div>

                      {/* DESCRIPCIÓN Y USO */}
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-2">
                        {preset.description}
                      </p>
                    </div>

                    {/* PIE DE TARJETA CON DIMENSIONES Y BOTÓN APLICAR */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-1">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {preset.width} × {preset.height} px
                      </span>

                      {isCurrent ? (
                        <span className="flex items-center gap-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 px-2.5 py-0.5 text-[10px] font-bold text-brand-cyan">
                          <Check className="size-3" />
                          <span>Activo</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-brand-cyan transition-colors">
                          <span>Elegir</span>
                          <ChevronRight className="size-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. FOOTER INFORMATIVO */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400">
          <span>
            💡 Al cambiar de formato, todos tus elementos y capas se adaptan manteniendo sus proporciones.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
