import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Palette,
  Image as ImageIcon,
  UserCheck,
  ShieldCheck,
  SplitSquareVertical,
  Grid,
} from 'lucide-react';
import { ModuleContextSidebar } from '../../../components/backoffice-shell/ModuleContextSidebar';
import { ImageBlockType, ImageProject } from '../../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../../utils/imageTemplates';

export interface ImageStudioAssetSidebarProps {
  onLoadTemplate: (template: ImageProject) => void;
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
  onUpdateBackground: (gradient: string, color: string) => void;
  onCollapse?: () => void;
}

export const ImageStudioAssetSidebar: React.FC<ImageStudioAssetSidebarProps> = ({
  onLoadTemplate,
  onAddBlock,
  onUpdateBackground,
  onCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'blocks' | 'brand' | 'media'>('templates');

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
    <ModuleContextSidebar
      label="Biblioteca Creativa"
      width="standard"
      variant="dark"
      onCollapse={onCollapse}
    >
      {/* PESTAÑAS PRINCIPALES */}
      <div className="grid grid-cols-4 rounded-xl bg-slate-950 p-1 mb-4 border border-slate-800 text-center">
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold transition-all ${
            activeTab === 'templates' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Plantillas prediseñadas"
        >
          <FileText className="size-3.5" />
          <span>Plantillas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('blocks')}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold transition-all ${
            activeTab === 'blocks' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Bloques visuales de MotionKit"
        >
          <Sparkles className="size-3.5" />
          <span>Bloques</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('brand')}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold transition-all ${
            activeTab === 'brand' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Brand Kit y colores oficiales"
        >
          <Palette className="size-3.5" />
          <span>Brand</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold transition-all ${
            activeTab === 'media' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Fotografías oficiales de asesores"
        >
          <ImageIcon className="size-3.5" />
          <span>Medios</span>
        </button>
      </div>

      {/* CONTENIDO DE LA PESTAÑA */}
      <div className="space-y-3">
        {/* 1. PLANTILLAS */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block px-1">
              Plantillas de Campaña ({INITIAL_IMAGE_TEMPLATES.length})
            </span>
            <div className="space-y-2.5">
              {INITIAL_IMAGE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => onLoadTemplate(tmpl)}
                  className="flex flex-col w-full rounded-2xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-primary hover:bg-slate-900 transition-all group"
                >
                  <div
                    className="w-full h-24 rounded-xl border border-slate-700/40 flex items-center justify-center relative overflow-hidden shadow-inner mb-2"
                    style={{ background: tmpl.background.gradient ?? '#001219' }}
                  >
                    <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
                      {tmpl.preset.aspectRatio} · {tmpl.layers[0]?.title}
                    </span>
                  </div>
                  <strong className="block text-xs font-bold text-slate-100 group-hover:text-brand-cyan transition-colors">
                    {tmpl.title}
                  </strong>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {tmpl.preset.width} × {tmpl.preset.height} px
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. BLOQUES VISUALES */}
        {activeTab === 'blocks' && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block px-1">
              Componentes de MotionKit
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onAddBlock('MotionAdvisorCard')}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-primary hover:bg-slate-900 transition-all group"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-brand-cyan">
                  <UserCheck className="size-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-slate-200 group-hover:text-brand-cyan">
                    Tarjeta de Asesora
                  </strong>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                    Foto real, live pulse y botón WhatsApp directo.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('MotionTrustBadge')}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-accent hover:bg-slate-900 transition-all group"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-slate-200 group-hover:text-accent">
                    Sello de Garantía Consular
                  </strong>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                    Certificación de visado 100% sin copagos.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('MotionComparisonCard')}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-teal-500 hover:bg-slate-900 transition-all group"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
                  <SplitSquareVertical className="size-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-slate-200 group-hover:text-teal-400">
                    Comparativa ❌ vs ✅
                  </strong>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                    Seguro de Viaje vs Visado de Extranjería.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('MotionProviderGrid')}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-sky-500 hover:bg-slate-900 transition-all group"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400">
                  <Grid className="size-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold text-slate-200 group-hover:text-sky-400">
                    Parrilla de Aseguradoras
                  </strong>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                    Sanitas, Adeslas, Asisa y DKV.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 3. BRAND KIT */}
        {activeTab === 'brand' && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block px-1">
              Gradientes Oficiales
            </span>
            <div className="grid grid-cols-2 gap-2">
              {brandColors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onUpdateBackground(c.gradient, c.value)}
                  className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-950 p-2.5 hover:border-primary hover:bg-slate-900 transition-all text-center group"
                >
                  <div
                    className="size-8 rounded-full border border-white/20 shadow-xs mb-1.5"
                    style={{ background: c.gradient }}
                  />
                  <span className="text-[10px] font-bold text-slate-300 group-hover:text-brand-cyan">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. MEDIOS & FOTOS */}
        {activeTab === 'media' && (
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block px-1">
              Asesoras Homologadas
            </span>
            <div className="space-y-2">
              {advisorPhotos.map((advisor) => (
                <div
                  key={advisor.name}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-2.5 hover:bg-slate-900 transition-all"
                >
                  <img
                    src={advisor.url}
                    alt={advisor.name}
                    className="size-11 rounded-full object-cover border-2 border-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <strong className="block text-xs font-bold text-slate-200">{advisor.name}</strong>
                    <span className="text-[10px] text-slate-400">{advisor.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModuleContextSidebar>
  );
};
