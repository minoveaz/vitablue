import React, { useState } from 'react';
import {
  Search,
  UserCheck,
  ShieldCheck,
  Grid,
  SplitSquareVertical,
  Plus,
} from 'lucide-react';
import { ImageRailTab } from './ImageEditorRail';
import { ImageBlockType, ImageProject } from '../../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../../utils/imageTemplates';

interface ImageEditorDrawerProps {
  activeTab: ImageRailTab;
  onLoadTemplate: (template: ImageProject) => void;
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
  onUpdateBackground: (gradient: string, color: string) => void;
}

export const ImageEditorDrawer: React.FC<ImageEditorDrawerProps> = ({
  activeTab,
  onLoadTemplate,
  onAddBlock,
  onUpdateBackground,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const brandColors = [
    { name: 'Ocean Teal', value: '#005F73', gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 95, 115, 0.75) 0%, #001219 80%)' },
    { name: 'Midnight Dark', value: '#001219', gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 18, 25, 0.95) 0%, #00080C 85%)' },
    { name: 'Amber Gold', value: '#EE9B00', gradient: 'radial-gradient(circle at 50% 25%, rgba(238, 155, 0, 0.45) 0%, #001219 80%)' },
    { name: 'Mint Green', value: '#94D2BD', gradient: 'radial-gradient(circle at 50% 25%, rgba(148, 210, 189, 0.45) 0%, #001219 80%)' },
  ];

  const advisorPhotos = [
    { name: 'Sofía', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop', role: 'Visados' },
    { name: 'Elena', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop', role: 'Salud y Repatriación' },
    { name: 'Carlos', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop', role: 'Extranjería' },
  ];

  return (
    <div className="flex h-full w-72 sm:w-80 flex-col border-r border-slate-200 bg-white shadow-xs select-none shrink-0 z-20 overflow-y-auto">
      {/* SEARCH BAR (TOP OF DRAWER) */}
      <div className="p-3.5 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Buscar en ${activeTab}...`}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="p-3.5 space-y-4">
        {/* TAB 1: PLANTILLAS */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Plantillas Prediseñadas ({INITIAL_IMAGE_TEMPLATES.length})
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {INITIAL_IMAGE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => onLoadTemplate(tmpl)}
                  className="flex flex-col items-start rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left hover:border-primary hover:bg-primary/5 hover:shadow-xs transition-all group"
                >
                  <div
                    className="w-full h-24 rounded-xl border border-slate-300/40 flex items-center justify-center shadow-inner relative overflow-hidden"
                    style={{ background: tmpl.background.gradient ?? '#001219' }}
                  >
                    <span className="text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {tmpl.preset.aspectRatio} · {tmpl.layers[0]?.title}
                    </span>
                  </div>
                  <strong className="block text-xs font-bold text-slate-900 mt-2 group-hover:text-primary transition-colors">
                    {tmpl.title}
                  </strong>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {tmpl.preset.width} × {tmpl.preset.height} px
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BLOQUES VISUALES (MOTIONKIT) */}
        {activeTab === 'blocks' && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Bloques Listos para Usar
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onAddBlock('MotionAdvisorCard')}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left hover:border-primary hover:bg-primary/5 shadow-xs transition-all group"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserCheck className="size-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-slate-900 group-hover:text-primary">
                    Tarjeta de Asesora
                  </strong>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    Foto, badge en directo y botón WhatsApp gigante.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('MotionTrustBadge')}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left hover:border-amber-500 hover:bg-amber-50/40 shadow-xs transition-all group"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-slate-900 group-hover:text-amber-600">
                    Sello de Garantía Consular
                  </strong>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    Certificación 100% visado, sin copagos.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('MotionComparisonCard')}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left hover:border-teal-500 hover:bg-teal-50/40 shadow-xs transition-all group"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
                  <SplitSquareVertical className="size-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-slate-900 group-hover:text-teal-600">
                    Comparativa ❌ vs ✅
                  </strong>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    Contraste entre seguro de viaje vs visado real.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('MotionProviderGrid')}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left hover:border-sky-500 hover:bg-sky-50/40 shadow-xs transition-all group"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                  <Grid className="size-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-slate-900 group-hover:text-sky-600">
                    Parrilla de Aseguradoras
                  </strong>
                  <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                    Sanitas, Adeslas, Asisa y DKV.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TEXTO */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Elementos de Texto
            </span>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onAddBlock('MotionAdvisorCard', { name: 'Nuevo Titular', role: 'Subtítulo destacado' })}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white hover:border-slate-300 transition-all"
              >
                <div>
                  <strong className="block text-base font-black text-slate-900">Añadir Titular H1</strong>
                  <span className="text-[10px] text-slate-500">Poppins Bold 32px</span>
                </div>
                <Plus className="size-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('MotionTrustBadge', { title: 'Párrafo Informativo', subtitle: 'Descripción detallada de requisitos...' })}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white hover:border-slate-300 transition-all"
              >
                <div>
                  <strong className="block text-xs font-bold text-slate-800">Añadir Párrafo / Cita</strong>
                  <span className="text-[10px] text-slate-500">Inter Regular 16px</span>
                </div>
                <Plus className="size-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: BRAND KIT */}
        {activeTab === 'brand' && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1 mb-2">
                Fondos de Marca
              </span>
              <div className="grid grid-cols-2 gap-2">
                {brandColors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => onUpdateBackground(c.gradient, c.value)}
                    className="flex flex-col items-center rounded-xl border border-slate-200 p-2.5 hover:border-primary hover:shadow-xs transition-all text-center group"
                  >
                    <div
                      className="size-10 rounded-full border border-white/40 shadow-xs mb-1.5"
                      style={{ background: c.gradient }}
                    />
                    <span className="text-[11px] font-bold text-slate-800 group-hover:text-primary">{c.name}</span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase">{c.value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MEDIOS & FOTOS */}
        {activeTab === 'media' && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Retratos de Asesoras Oficiales
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {advisorPhotos.map((advisor) => (
                <div
                  key={advisor.name}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2.5 hover:bg-white hover:border-slate-300 transition-all"
                >
                  <img
                    src={advisor.url}
                    alt={advisor.name}
                    className="size-12 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <strong className="block text-xs font-bold text-slate-900">{advisor.name}</strong>
                    <span className="text-[10px] text-slate-500">{advisor.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
