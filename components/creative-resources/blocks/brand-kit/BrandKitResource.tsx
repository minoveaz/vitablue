import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Check,
  Download,
  Layers,
  Loader2,
} from 'lucide-react';
import Logo from '../../../atoms/Logo';
import { ImageBlockType } from '../../../../marketing-studio/types/imageStudio';
import type { ResourceBlockProps } from '../ResourceBlockProps';
import {
  HIGHLIGHT_PRESETS,
  HighlightVectorIcon,
  downloadHighlightCoverPng,
} from '../../../../marketing-studio/components/image-editor/blocks/HighlightCoverBlocks';

export type BrandKitResourceProps = ResourceBlockProps;
interface LogoVariantPreset {
  id: string;
  title: string;
  category: 'isotype' | 'horizontal' | 'vertical';
  variant: 'default' | 'white' | 'dark' | 'colored-on-dark';
  showText: boolean;
  showTagline: boolean;
  orientation: 'horizontal' | 'vertical';
  previewBg: string;
  width: number;
  height: number;
  badge: string;
}

const LOGO_PRESETS: LogoVariantPreset[] = [
  // 🔷 1. ISOTIPOS (SÍMBOLO CRUZ 3D FACETADA)
  {
    id: 'isotype-color-dark',
    title: 'Isotipo Color (Fondos Oscuros)',
    category: 'isotype',
    variant: 'colored-on-dark',
    showText: false,
    showTagline: false,
    orientation: 'horizontal',
    previewBg: 'bg-[#001219]',
    width: 90,
    height: 90,
    badge: 'Oficial Oscuro',
  },
  {
    id: 'isotype-color-light',
    title: 'Isotipo Color (Fondos Claros)',
    category: 'isotype',
    variant: 'default',
    showText: false,
    showTagline: false,
    orientation: 'horizontal',
    previewBg: 'bg-white',
    width: 90,
    height: 90,
    badge: 'Oficial Claro',
  },
  {
    id: 'isotype-white',
    title: 'Isotipo Blanco Puro (Negative)',
    category: 'isotype',
    variant: 'white',
    showText: false,
    showTagline: false,
    orientation: 'horizontal',
    previewBg: 'bg-[#005F73]',
    width: 90,
    height: 90,
    badge: 'Monocromo',
  },
  {
    id: 'isotype-dark',
    title: 'Isotipo Midnight (Positivo)',
    category: 'isotype',
    variant: 'dark',
    showText: false,
    showTagline: false,
    orientation: 'horizontal',
    previewBg: 'bg-slate-100',
    width: 90,
    height: 90,
    badge: 'Monocromo',
  },

  // 🏷️ 2. LOGOTIPOS HORIZONTALES (ISOTIPO + TIPOGRAFÍA)
  {
    id: 'logo-full-dark',
    title: 'Logotipo Full Color (Fondos Oscuros)',
    category: 'horizontal',
    variant: 'colored-on-dark',
    showText: true,
    showTagline: false,
    orientation: 'horizontal',
    previewBg: 'bg-[#001219]',
    width: 220,
    height: 52,
    badge: 'Principal',
  },
  {
    id: 'logo-full-light',
    title: 'Logotipo Full Color (Fondos Claros)',
    category: 'horizontal',
    variant: 'default',
    showText: true,
    showTagline: false,
    orientation: 'horizontal',
    previewBg: 'bg-white',
    width: 220,
    height: 52,
    badge: 'Principal Claro',
  },
  {
    id: 'logo-negative-white',
    title: 'Logotipo Blanco Puro (Negativo)',
    category: 'horizontal',
    variant: 'white',
    showText: true,
    showTagline: false,
    orientation: 'horizontal',
    previewBg: 'bg-[#005F73]',
    width: 220,
    height: 52,
    badge: 'Blanco',
  },
  {
    id: 'logo-with-tagline',
    title: 'Logotipo con Tagline Oficial',
    category: 'horizontal',
    variant: 'colored-on-dark',
    showText: true,
    showTagline: true,
    orientation: 'horizontal',
    previewBg: 'bg-[#001219]',
    width: 260,
    height: 64,
    badge: 'Con Eslogan',
  },

  // 📐 3. LOGOTIPOS VERTICALES (APILADOS)
  {
    id: 'logo-stacked-color',
    title: 'Logotipo Apilado Color (Vertical)',
    category: 'vertical',
    variant: 'colored-on-dark',
    showText: true,
    showTagline: false,
    orientation: 'vertical',
    previewBg: 'bg-[#001219]',
    width: 150,
    height: 120,
    badge: 'Vertical',
  },
  {
    id: 'logo-stacked-white',
    title: 'Logotipo Apilado Blanco (Vertical)',
    category: 'vertical',
    variant: 'white',
    showText: true,
    showTagline: false,
    orientation: 'vertical',
    previewBg: 'bg-[#005F73]',
    width: 150,
    height: 120,
    badge: 'Vertical Blanco',
  },
];

const BRAND_COLORS = [
  { name: 'Ocean Teal', hex: '#005F73', usage: 'Color Primario', token: 'primary' },
  { name: 'Midnight Dark', hex: '#001219', usage: 'Fondo Principal', token: 'primary-dark' },
  { name: 'Amber Gold', hex: '#EE9B00', usage: 'Acento & CTAs', token: 'accent' },
  { name: 'Mint Green', hex: '#94D2BD', usage: 'Insignias & Alertas', token: 'brand-cyan' },
  { name: 'Light Cyan', hex: '#006B78', usage: 'Trazos & Facetas', token: 'cyan-light' },
  { name: 'Clean White', hex: '#FFFFFF', usage: 'Tipografía & Luz', token: 'on-brand' },
];

const BRAND_BACKGROUNDS = [
  {
    name: 'Ocean Teal Radial',
    gradient: 'radial-gradient(circle at 50% 18%, rgba(0, 95, 115, 0.8) 0%, #001219 85%)',
    color: '#001219',
    desc: 'Luminoso y oficial',
  },
  {
    name: 'Midnight Deep Dark',
    gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 18, 25, 0.95) 0%, #00080C 85%)',
    color: '#00080C',
    desc: 'Fondo oscuro puro',
  },
  {
    name: 'Amber Gold Warm',
    gradient: 'radial-gradient(circle at 50% 25%, rgba(238, 155, 0, 0.45) 0%, #001219 80%)',
    color: '#001219',
    desc: 'Garantía & Conversión',
  },
  {
    name: 'Mint Health Aura',
    gradient: 'radial-gradient(circle at 50% 25%, rgba(148, 210, 189, 0.45) 0%, #001219 80%)',
    color: '#001219',
    desc: 'Salud y visados',
  },
];

export const BrandKitResource: React.FC<BrandKitResourceProps> = ({ context }) => {
  const canInsert = Boolean(context.actions.insert);
  const canUpdateBackground = Boolean(context.actions.update) && (
    context.domain === 'image' || context.capabilities.includes('background-update')
  );
  const onAddBlock = (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) =>
    context.actions.insert?.({ kind: 'brand', value: { blockType, defaultProps } } as never);
  const onUpdateBackground = canUpdateBackground
    ? (gradient: string, color: string) => context.actions.update?.({ kind: 'background', value: { gradient, color } } as never)
    : undefined;
  const [logoTab, setLogoTab] = useState<'all' | 'identity' | 'tokens' | 'backgrounds' | 'components' | 'rules'>('all');
  const [identityFilter, setIdentityFilter] = useState<'all' | 'logos' | 'isotypes' | 'stacked'>('all');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);
  const brandComponents = [
    { name: 'CTA principal', description: 'Botón de conversión con acento oficial', blockType: 'Button' as ImageBlockType },
    { name: 'Badge de confianza', description: 'Sello para garantías y beneficios', blockType: 'Badge' as ImageBlockType },
    { name: 'Tarjeta de producto', description: 'Contenedor para oferta y métricas', blockType: 'Card' as ImageBlockType },
  ];
  const brandRules = [
    { title: 'Área de seguridad', detail: 'Mantén una separación mínima equivalente al ancho del isotipo.' },
    { title: 'Contraste', detail: 'Usa variantes claras sobre fondos oscuros y variantes oscuras sobre fondos claros.' },
    { title: 'Color y forma', detail: 'No deformes, gires ni recolores los activos oficiales.' },
    { title: 'Tipografía', detail: 'Usa Poppins para titulares e Inter para lectura y controles.' },
  ];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleInsertLogo = (preset: LogoVariantPreset) => {
    onAddBlock('BrandLogo', {
      variant: preset.variant,
      showText: preset.showText,
      showTagline: preset.showTagline,
      orientation: preset.orientation,
      width: preset.width,
      height: preset.height,
    });
  };

  const handleInsertHighlight = (preset: typeof HIGHLIGHT_PRESETS[0]) => {
    onAddBlock('InstagramHighlightBadge', {
      iconKey: preset.id,
      label: preset.label,
      showLabel: true,
      ringColor: preset.defaultRingColor,
      glowColor: preset.defaultGlowColor,
      strokeColor: '#FFFFFF',
      accentColor: preset.defaultAccentColor,
      isFullCover: false,
    });
  };

  const handleDownloadHighlight = async (iconKey: typeof HIGHLIGHT_PRESETS[0]['id']) => {
    try {
      setDownloadingId(iconKey);
      await downloadHighlightCoverPng(iconKey, `vitablue-destacado-${iconKey}-1080p.png`);
      setDownloadSuccessId(iconKey);
      setTimeout(() => setDownloadSuccessId(null), 2500);
    } catch (e) {
      console.error('Error al descargar portada de destacado:', e);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAllHighlights = async () => {
    try {
      setDownloadingId('all');
      for (const item of HIGHLIGHT_PRESETS) {
        await downloadHighlightCoverPng(item.id, `vitablue-destacado-${item.id}-1080p.png`);
        // Pequeño retardo entre descargas para el navegador
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      setDownloadSuccessId('all');
      setTimeout(() => setDownloadSuccessId(null), 3000);
    } catch (e) {
      console.error('Error al descargar pack de destacados:', e);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredLogos = LOGO_PRESETS.filter((preset) =>
    identityFilter === 'all' ||
    (identityFilter === 'logos' && preset.category === 'horizontal') ||
    (identityFilter === 'isotypes' && preset.category === 'isotype') ||
    (identityFilter === 'stacked' && preset.category === 'vertical')
  );

  return (
    <div className="flex flex-col h-full bg-[#001219] text-slate-100 font-sans select-none overflow-hidden" data-core-resource-content="brand" data-resource-block="brand">
      {/* 1. CABECERA DEL BRAND KIT */}
      <div data-resource-header className="p-3.5 border-b border-slate-800/80 bg-[#070e17] shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-teal-500/20 text-brand-cyan">
              <Palette className="size-4" />
            </div>
            <div>
              <h3 className="font-display text-xs font-bold text-white tracking-wide">
                Kit de Marca Oficial VitaBlue
              </h3>
              <p className="text-[10px] text-slate-400">
                Logos, destacados, colores y gradientes oficiales
              </p>
              {context.domain === 'video' && (
                <p className="mt-1 text-[10px] leading-4 text-amber-200">
                  Video Studio permite insertar activos, pero no persiste cambios del kit.
                </p>
              )}
            </div>
          </div>
          <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-md border border-brand-cyan/20">
            {LOGO_PRESETS.length + HIGHLIGHT_PRESETS.length} activos
          </span>
        </div>

        {/* NAVEGACIÓN DE CATEGORÍAS */}
        <nav aria-label="Categorías del kit de marca" className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'Todos', count: LOGO_PRESETS.length + HIGHLIGHT_PRESETS.length + BRAND_COLORS.length + BRAND_BACKGROUNDS.length + 2 },
            { id: 'identity', label: 'Identidad', count: LOGO_PRESETS.length + HIGHLIGHT_PRESETS.length },
            { id: 'tokens', label: 'Tokens de marca', count: BRAND_COLORS.length + 2 },
            { id: 'backgrounds', label: 'Fondos y mallas', count: BRAND_BACKGROUNDS.length },
            { id: 'components', label: 'Componentes', count: 0 },
            { id: 'rules', label: 'Reglas de uso', count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLogoTab(tab.id as any)}
              className={`flex min-h-10 items-center justify-between rounded-lg border px-2.5 text-left text-[10px] font-semibold transition-colors ${
                logoTab === tab.id
                  ? 'border-brand-cyan/60 bg-primary/50 text-brand-cyan'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[9px] text-slate-500">{tab.count}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 2. CONTENIDO PRINCIPAL SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-3.5 custom-scrollbar space-y-6">
        {/* SECCIÓN 0: DESTACADOS DE INSTAGRAM (STORY HIGHLIGHTS OFICIALES) */}
        {(logoTab === 'all' || logoTab === 'identity') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-400" />
                <span>Portadas de Destacados Instagram ({HIGHLIGHT_PRESETS.length})</span>
              </span>

              {/* BOTÓN DESCARGAR PACK COMPLETO */}
              <button
                type="button"
                onClick={handleDownloadAllHighlights}
                disabled={downloadingId === 'all'}
                className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 px-2 py-0.5 rounded-md transition-all shadow-xs active:scale-95 disabled:opacity-50"
                title="Descargar las 5 portadas en formato PNG de alta definición"
              >
                {downloadingId === 'all' ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    <span>Descargando...</span>
                  </>
                ) : downloadSuccessId === 'all' ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-300">¡Pack Descargado!</span>
                  </>
                ) : (
                  <>
                    <Download className="size-3" />
                    <span>Descargar Todo (5 PNGs)</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'logos', label: 'Logotipos' },
                { id: 'isotypes', label: 'Isotipos' },
                { id: 'stacked', label: 'Apilados' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setIdentityFilter(filter.id as typeof identityFilter)}
                  className={`rounded-md border px-2 py-1 text-[9px] font-semibold ${
                    identityFilter === filter.id
                      ? 'border-brand-cyan/50 bg-brand-cyan/10 text-brand-cyan'
                      : 'border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HIGHLIGHT_PRESETS.map((item) => {
                const isDownloading = downloadingId === item.id;
                const isSuccess = downloadSuccessId === item.id;

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0d1624] p-3 hover:border-amber-500/60 hover:shadow-xl transition-all"
                  >
                    {/* PREVIEW DISCO CIRCULAR CON GLOW NEÓN */}
                    <div
                      className="w-full h-28 rounded-xl border border-slate-800/80 flex items-center justify-center p-3 mb-2.5 relative overflow-hidden bg-gradient-to-b from-[#001219] to-[#00080C] shadow-inner"
                    >
                      <div
                        className="size-20 rounded-full flex items-center justify-center relative shadow-lg group-hover:scale-105 transition-transform"
                        style={{
                          background: 'radial-gradient(circle at 50% 35%, rgba(0, 95, 115, 0.85) 0%, #001219 85%)',
                          border: `3px solid ${item.defaultRingColor}`,
                          boxShadow: `0 0 20px ${item.defaultGlowColor}`,
                        }}
                      >
                        <div className="size-11 flex items-center justify-center">
                          <HighlightVectorIcon
                            iconKey={item.id}
                            strokeColor="#FFFFFF"
                            accentColor={item.defaultAccentColor}
                          />
                        </div>
                      </div>
                    </div>

                    {/* TÍTULO Y DESCRIPCIÓN */}
                    <div className="mb-2.5">
                      <strong className="block text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.label}
                      </strong>
                      <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.sublabel}
                      </span>
                    </div>

                    {/* ACCIONES: INSERTAR SELLO O DESCARGAR PNG DIRECTO */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/80">
                      <button
                        type="button"
                        disabled={!canInsert}
                        onClick={() => handleInsertHighlight(item)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-primary/20 hover:bg-primary/40 text-brand-cyan text-[10px] font-bold border border-brand-cyan/30 transition-colors"
                        title="Insertar este sello en el lienzo actual"
                      >
                        <Layers className="size-3" />
                        <span>+ Sello</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadHighlight(item.id)}
                        disabled={isDownloading}
                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all active:scale-95 ${
                          isSuccess
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                        }`}
                        title="Descargar archivo PNG a resolución nativa 1080x1080 px para Instagram"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="size-3 animate-spin text-amber-400" />
                            <span>Descargando...</span>
                          </>
                        ) : isSuccess ? (
                          <>
                            <Check className="size-3 text-emerald-400" />
                            <span>¡Descargado!</span>
                          </>
                        ) : (
                          <>
                            <Download className="size-3" />
                            <span>Descargar PNG</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {(logoTab === 'all' || logoTab === 'identity') && <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-cyan flex items-center gap-1">
              <Sparkles className="size-3" />
              <span>Logos e Isotipos ({filteredLogos.length})</span>
            </span>
            <span className="text-[10px] text-slate-500">Clic para insertar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredLogos.map((preset) => (
              <div
                key={preset.id}
                onClick={() => canInsert && handleInsertLogo(preset)}
                aria-disabled={!canInsert}
                className={`group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0d1624] p-3 transition-all text-center ${canInsert ? 'cursor-pointer hover:border-brand-cyan hover:shadow-lg' : 'cursor-not-allowed opacity-60'}`}
              >
                {/* PREVIEW CAJA DE LOGO */}
                <div
                  className={`w-full ${preset.category === 'vertical' ? 'h-28' : 'h-20'} rounded-xl border border-slate-800/80 flex items-center justify-center p-2 mb-2 relative overflow-hidden transition-transform group-hover:scale-[1.02] ${preset.previewBg}`}
                >
                  <Logo
                    variant={preset.variant}
                    showText={preset.showText}
                    showTagline={preset.showTagline}
                    orientation={preset.orientation}
                    iconSize={preset.category === 'isotype' ? 44 : 32}
                    disableTransition={true}
                  />

                  <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-black/60 text-slate-300 border border-white/10 backdrop-blur-xs">
                    {preset.badge}
                  </span>
                </div>

                <strong className="block text-[11px] font-bold text-slate-200 group-hover:text-brand-cyan transition-colors truncate">
                  {preset.title}
                </strong>
                <span className="text-[9px] font-bold text-brand-cyan mt-1">+ Insertar al lienzo</span>
              </div>
            ))}
          </div>
        </div>}

        {/* SECCIÓN B: PALETA DE COLORES OFICIALES */}
        {(logoTab === 'all' || logoTab === 'tokens') && <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 block px-1">
            Paleta de Colores Oficiales (Tokens)
          </span>

          <div className="grid grid-cols-2 gap-2">
            {BRAND_COLORS.map((c) => {
              const isCopied = copiedHex === c.hex;
              return (
                <div
                  key={c.name}
                  onClick={() => handleCopyHex(c.hex)}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-800 bg-[#0d1624] hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer group"
                >
                  <div
                    className="size-7 rounded-lg border border-white/20 shadow-xs shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <strong className="block text-[11px] font-bold text-slate-200 group-hover:text-white truncate">
                      {c.name}
                    </strong>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      {isCopied ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <Check className="size-2.5" /> Copiado
                        </span>
                      ) : (
                        <span>{c.hex}</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>}

        {/* SECCIÓN C: GRADIENTES Y MESH BACKGROUNDS */}
        {(logoTab === 'all' || logoTab === 'backgrounds') && <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
              Fondos & Mallas de Marca
            </span>
            <span className="text-[10px] text-slate-500">Clic para aplicar</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {BRAND_BACKGROUNDS.map((bg) => (
              <button
                key={bg.name}
                type="button"
                disabled={!onUpdateBackground}
                onClick={() => onUpdateBackground?.(bg.gradient, bg.color)}
                className="flex flex-col items-center rounded-2xl border border-slate-800 bg-[#0d1624] p-2.5 hover:border-brand-cyan hover:bg-slate-900 transition-all text-center group disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div
                  className="w-full h-14 rounded-xl border border-white/20 shadow-inner mb-2 group-hover:scale-105 transition-transform"
                  style={{ background: bg.gradient }}
                />
                <strong className="block text-[11px] font-bold text-slate-200 group-hover:text-brand-cyan truncate w-full">
                  {bg.name}
                </strong>
                <span className="text-[9px] text-slate-400 truncate">{bg.desc}</span>
              </button>
            ))}
          </div>
        </div>}

        {/* SECCIÓN D: TIPOGRAFÍAS DE MARCA */}
        {(logoTab === 'all' || logoTab === 'tokens') && <div className="space-y-2 pt-4 border-t border-slate-800/80">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 block px-1">
            Tipografías Oficiales
          </span>

          <div className="space-y-2">
            <div className="p-3 rounded-xl border border-slate-800 bg-[#0d1624]">
              <span className="text-[10px] font-mono text-brand-cyan uppercase font-bold">Display / Titulares</span>
              <h4 className="text-base font-bold text-white font-display mt-0.5">Poppins Bold (700 / 800)</h4>
              <p className="text-[10px] text-slate-400">Titulares de alto impacto, banners y números clave</p>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-[#0d1624]">
              <span className="text-[10px] font-mono text-brand-cyan uppercase font-bold">Sans / Lectura</span>
              <h4 className="text-base font-semibold text-white font-sans mt-0.5">Inter Regular / Medium</h4>
              <p className="text-[10px] text-slate-400">Párrafos, descripciones, sellos y botones CTA</p>
            </div>
          </div>
        </div>}

        {logoTab === 'components' && (
         <div className="space-y-3">
           <div className="px-1">
             <span className="text-[11px] font-black uppercase tracking-wider text-brand-cyan">Componentes de marca</span>
             <p className="mt-1 text-[10px] text-slate-500">Configuraciones oficiales listas para insertar, no una segunda biblioteca de elementos.</p>
           </div>
           <div className="grid gap-2.5">
             {brandComponents.map((component) => (
               <div key={component.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0d1624] p-3">
                 <div>
                   <strong className="block text-xs font-bold text-slate-200">{component.name}</strong>
                   <span className="text-[10px] text-slate-400">{component.description}</span>
                 </div>
                 <button type="button" disabled={!canInsert} onClick={() => onAddBlock(component.blockType)} className="shrink-0 rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 px-2 py-1 text-[10px] font-bold text-brand-cyan hover:bg-brand-cyan/20 disabled:cursor-not-allowed disabled:opacity-50">
                   Insertar
                 </button>
               </div>
             ))}
           </div>
         </div>
        )}
        {logoTab === 'rules' && (
         <div className="space-y-3">
           <div className="px-1">
             <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">Reglas de uso</span>
             <p className="mt-1 text-[10px] text-slate-500">Criterios prácticos para mantener consistencia visual.</p>
           </div>
           <div className="grid gap-2">
             {brandRules.map((rule) => (
               <div key={rule.title} className="rounded-xl border border-slate-800 bg-[#0d1624] p-3">
                 <strong className="block text-[11px] font-bold text-slate-200">{rule.title}</strong>
                 <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{rule.detail}</p>
               </div>
             ))}
           </div>
           <button type="button" onClick={() => setLogoTab('identity')} className="w-full rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] font-bold text-amber-300 hover:bg-amber-500/20">
             Revisar activos de identidad
           </button>
         </div>
        )}
      </div>
    </div>
  );
};
