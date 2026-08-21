import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Check,
} from 'lucide-react';
import Logo from '../../../../components/atoms/Logo';
import { ImageBlockType } from '../../../types/imageStudio';

export interface ImageStudioBrandKitDrawerProps {
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
  onUpdateBackground: (gradient: string, color: string) => void;
}

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

export const ImageStudioBrandKitDrawer: React.FC<ImageStudioBrandKitDrawerProps> = ({
  onAddBlock,
  onUpdateBackground,
}) => {
  const [logoTab, setLogoTab] = useState<'all' | 'isotype' | 'horizontal' | 'vertical'>('all');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

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

  const filteredLogos = LOGO_PRESETS.filter(
    (p) => logoTab === 'all' || p.category === logoTab
  );

  return (
    <div className="flex flex-col h-full bg-[#001219] text-slate-100 font-sans select-none overflow-hidden">
      {/* 1. CABECERA DEL BRAND KIT */}
      <div className="p-3.5 border-b border-slate-800/80 bg-[#070e17] shrink-0 space-y-3">
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
                Logos, isotipos, colores y gradientes de marca
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-md border border-brand-cyan/20">
            {LOGO_PRESETS.length} variantes
          </span>
        </div>

        {/* CHIPS DE NAVEGACIÓN */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'horizontal', label: '🏷️ Logotipos' },
            { id: 'isotype', label: '🔷 Isotipos' },
            { id: 'vertical', label: '📐 Apilados' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLogoTab(tab.id as any)}
              className={`rounded-xl px-2.5 py-1 text-xs font-bold whitespace-nowrap transition-all ${
                logoTab === tab.id
                  ? 'bg-primary text-brand-cyan border border-brand-cyan/50 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL SCROLLABLE */}
      <div className="flex-1 overflow-y-auto p-3.5 custom-scrollbar space-y-6">
        {/* SECCIÓN A: LOGOS E ISOTIPOS OFICIALES */}
        <div className="space-y-3">
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
                onClick={() => handleInsertLogo(preset)}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0d1624] p-3 hover:border-brand-cyan hover:shadow-lg transition-all cursor-pointer text-center"
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
        </div>

        {/* SECCIÓN B: PALETA DE COLORES OFICIALES */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
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
        </div>

        {/* SECCIÓN C: GRADIENTES Y MESH BACKGROUNDS */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
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
                onClick={() => onUpdateBackground(bg.gradient, bg.color)}
                className="flex flex-col items-center rounded-2xl border border-slate-800 bg-[#0d1624] p-2.5 hover:border-brand-cyan hover:bg-slate-900 transition-all text-center group"
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
        </div>

        {/* SECCIÓN D: TIPOGRAFÍAS DE MARCA */}
        <div className="space-y-2 pt-4 border-t border-slate-800/80">
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
        </div>
      </div>
    </div>
  );
};
