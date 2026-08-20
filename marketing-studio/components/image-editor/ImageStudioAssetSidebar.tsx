import React from 'react';
import {
  UserCheck,
  ShieldCheck,
  SplitSquareVertical,
  Grid,
  UploadCloud,
  Shield,
  CheckCircle2,
  PenTool,
  Star,
  Download,
  Film,
  Sparkles,
} from 'lucide-react';
import { ImageBlockType, ImageProject } from '../../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../../utils/imageTemplates';
import { ImageStudioLayersPanel } from './ImageStudioLayersPanel';
import { ImageStudioTextDrawer } from './drawers/ImageStudioTextDrawer';
import { TextPresetItem } from '../../data/textPresets';

export interface ImageStudioAssetDrawerContentProps {
  activeTab: string | null;
  project: ImageProject;
  selectedLayerId: string | null;
  selectedLayerIds?: string[];
  onSelectLayer: (id: string, isShift?: boolean) => void;
  onLoadTemplate: (template: ImageProject) => void;
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
  onAddTextLayer?: (preset: TextPresetItem) => void;
  onUpdateBackground: (gradient: string, color: string) => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleAllLock?: (locked: boolean) => void;
  onToggleAllVisibility?: (visible: boolean) => void;
  onMoveZIndex: (id: string, direction: 'up' | 'down') => void;
  onReorderLayers?: (layerIds: string[]) => void;
  onRenameLayer: (id: string, title: string) => void;
  onDuplicateLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onDeleteSelectedLayers?: () => void;
}

export const ImageStudioAssetDrawerContent: React.FC<ImageStudioAssetDrawerContentProps> = ({
  activeTab,
  project,
  selectedLayerId,
  selectedLayerIds = [],
  onSelectLayer,
  onLoadTemplate,
  onAddBlock,
  onAddTextLayer,
  onUpdateBackground,
  onToggleLock,
  onToggleVisibility,
  onToggleAllLock,
  onToggleAllVisibility,
  onMoveZIndex,
  onReorderLayers,
  onRenameLayer,
  onDuplicateLayer,
  onRemoveLayer,
  onDeleteSelectedLayers,
}) => {
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
    <div className="space-y-4 select-none">
      {/* 0. TEXTO & TIPOGRAFÍAS EN SPLIT 2-ZONAS */}
      {activeTab === 'text' && onAddTextLayer && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioTextDrawer onAddTextLayer={onAddTextLayer} />
        </div>
      )}

      {/* 1. PLANTILLAS EN GRID DE 2 COLUMNAS (AMPLIO Y VISUAL) */}
      {activeTab === 'templates' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Plantillas Disponibles ({INITIAL_IMAGE_TEMPLATES.length})
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {INITIAL_IMAGE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onLoadTemplate(tmpl)}
                className="flex flex-col w-full rounded-2xl border border-slate-800 bg-slate-950 p-2.5 text-left hover:border-primary hover:bg-slate-900 transition-all group shadow-sm hover:shadow-md"
              >
                <div
                  className="w-full h-24 rounded-xl border border-slate-700/40 flex items-center justify-center relative overflow-hidden shadow-inner mb-2"
                  style={{ background: tmpl.background.gradient ?? '#001219' }}
                >
                  <span className="text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs border border-white/10">
                    {tmpl.preset.aspectRatio}
                  </span>
                </div>
                <strong className="block text-xs font-bold text-slate-100 group-hover:text-brand-cyan transition-colors truncate">
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

      {/* 2. BLOQUES VISUALES DE MOTIONKIT */}
      {activeTab === 'blocks' && (
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
            Componentes Visuales de Marca
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
              <div className="flex-1 min-w-0">
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
              <div className="flex-1 min-w-0">
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
              <div className="flex-1 min-w-0">
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
              <div className="flex-1 min-w-0">
                <strong className="block text-xs font-bold text-slate-200 group-hover:text-sky-400">
                  Parrilla de Aseguradoras
                </strong>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                  Sanitas, Adeslas, Asisa y DKV autorizadas.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 3. ÁRBOL DE CAPAS (LAYERS TREE) */}
      {activeTab === 'layers' && (
        <ImageStudioLayersPanel
          project={project}
          selectedLayerId={selectedLayerId}
          selectedLayerIds={selectedLayerIds}
          onSelectLayer={onSelectLayer}
          onToggleLock={onToggleLock}
          onToggleVisibility={onToggleVisibility}
          onToggleAllLock={onToggleAllLock}
          onToggleAllVisibility={onToggleAllVisibility}
          onMoveZIndex={onMoveZIndex}
          onReorderLayers={onReorderLayers}
          onRenameLayer={onRenameLayer}
          onDuplicateLayer={onDuplicateLayer}
          onRemoveLayer={onRemoveLayer}
          onDeleteSelectedLayers={onDeleteSelectedLayers}
        />
      )}

      {/* 4. BRAND KIT / FONDOS OFICIALES */}
      {activeTab === 'brand' && (
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
            Gradientes y Mallas Oficiales
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {brandColors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => onUpdateBackground(c.gradient, c.value)}
                className="flex flex-col items-center rounded-2xl border border-slate-800 bg-slate-950 p-3 hover:border-primary hover:bg-slate-900 transition-all text-center group"
              >
                <div
                  className="size-10 rounded-xl border border-white/20 shadow-sm mb-2"
                  style={{ background: c.gradient }}
                />
                <span className="text-xs font-bold text-slate-200 group-hover:text-brand-cyan">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. MEDIOS & ASESORAS */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-4 text-center hover:border-primary transition-colors cursor-pointer">
            <UploadCloud className="size-6 text-brand-cyan mx-auto mb-1.5" />
            <strong className="block text-xs font-bold text-slate-200">Subir imágenes</strong>
            <p className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WebP hasta 10MB</p>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Asesoras Oficiales de VitaBlue
            </span>
            <div className="space-y-2">
              {advisorPhotos.map((advisor) => (
                <div
                  key={advisor.name}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-3 hover:bg-slate-900 transition-all"
                >
                  <img
                    src={advisor.url}
                    alt={advisor.name}
                    className="size-12 rounded-full object-cover border-2 border-primary shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <strong className="block text-xs font-bold text-slate-200">{advisor.name}</strong>
                    <span className="text-[11px] text-slate-400">{advisor.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. ELEMENTOS Y FORMAS */}
      {activeTab === 'elements' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Formas Geométricas
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onAddBlock('GlassCardSurface', { width: 340, height: 200, variant: 'teal' })}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-primary transition-all text-slate-300 hover:text-brand-cyan"
              >
                <div className="size-8 rounded-lg border border-slate-600 bg-slate-800/60 mb-1" />
                <span className="text-[10px] font-bold">Tarjeta Glass</span>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('GlassCardSurface', { width: 340, height: 200, variant: 'amber' })}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-accent transition-all text-slate-300 hover:text-amber-300"
              >
                <div className="size-8 rounded-lg border border-amber-500/50 bg-amber-500/10 mb-1" />
                <span className="text-[10px] font-bold">Tarjeta Oro</span>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('TrustShieldIcon')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-accent transition-all text-slate-300 hover:text-amber-300"
              >
                <Shield className="size-8 text-amber-400 mb-1" />
                <span className="text-[10px] font-bold">Escudo Visado</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Insignias y Badges Oficiales
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onAddBlock('TrustHighlightPill', { highlight: 'GARANTÍA CONSULAR' })}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-accent hover:bg-slate-900 transition-all text-left"
              >
                <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-300">
                  GARANTÍA CONSULAR
                </span>
                <span className="text-[10px] text-slate-500 font-bold">+ Añadir</span>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('TrustVerifiedPill', { verifiedLabel: 'VERIFICADO PARA EXTRANJERÍA' })}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-emerald-500 hover:bg-slate-900 transition-all text-left"
              >
                <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  <span>VERIFICADO PARA EXTRANJERÍA</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold">+ Añadir</span>
              </button>

              <button
                type="button"
                onClick={() => onAddBlock('HookAlertBadge', { badge: 'ASESORA ASIGNADA · EN DIRECTO' })}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-teal-500 hover:bg-slate-900 transition-all text-left"
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-950/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-cyan">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ASESORA ASIGNADA · EN DIRECTO</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold">+ Añadir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. DIBUJO Y TRAZOS */}
      {activeTab === 'draw' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center">
            <PenTool className="size-8 text-brand-cyan mx-auto mb-2" />
            <strong className="block text-xs font-bold text-slate-200">Herramientas de Dibujo y Trazos</strong>
            <p className="text-[11px] text-slate-400 mt-1">
              Añade flechas, anotaciones y resaltados vectoriales directos sobre el arte.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onAddBlock('CustomText', { text: '👉 ¡Haz clic aquí!', tag: 'p', fill: '#EE9B00' })}
              className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-amber-400 hover:bg-slate-900 transition-all text-left"
            >
              <span className="text-base mb-1 block">👉</span>
              <strong className="block text-xs font-bold text-slate-200">Flecha Llamada</strong>
              <span className="text-[10px] text-slate-500">Anotación directa</span>
            </button>
            <button
              type="button"
              onClick={() => onAddBlock('CustomText', { text: '⭐ ⭐ ⭐ ⭐ ⭐ 4.9/5', tag: 'p', fill: '#EE9B00' })}
              className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:border-amber-400 hover:bg-slate-900 transition-all text-left"
            >
              <div className="flex gap-0.5 text-amber-400 mb-1">
                <Star className="size-3 fill-amber-400" />
                <Star className="size-3 fill-amber-400" />
                <Star className="size-3 fill-amber-400" />
                <Star className="size-3 fill-amber-400" />
                <Star className="size-3 fill-amber-400" />
              </div>
              <strong className="block text-xs font-bold text-slate-200">Estrellas Reviews</strong>
              <span className="text-[10px] text-slate-500">Social proof</span>
            </button>
          </div>
        </div>
      )}

      {/* 8. EXPORTACIÓN Y PUENTE CON VIDEO STUDIO */}
      {activeTab === 'export' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="size-4 text-brand-cyan" />
              <strong className="text-xs font-bold text-slate-200">Exportación de Imagen en Alta Definición</strong>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Genera archivos listos para campañas publicitarias en Meta, Google Display o redes sociales.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 px-3 py-2 text-xs font-bold text-brand-cyan transition-colors"
              >
                <span>Descargar PNG (Transparente / Alta Calidad)</span>
                <Download className="size-3.5" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-2 text-xs font-bold text-slate-200 transition-colors"
              >
                <span>Descargar JPG (Optimizado para Web)</span>
                <Download className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Film className="size-4 text-teal-400" />
              <strong className="text-xs font-bold text-teal-200">Puente Remotion Video Studio</strong>
            </div>
            <p className="text-[11px] text-teal-300/80 leading-relaxed mb-3">
              Convierte este arte gráfico en una escena animada para el generador de vídeos de marketing.
            </p>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-2 text-xs font-black transition-transform active:scale-95 shadow-md"
            >
              <Sparkles className="size-3.5" />
              <span>Convertir a Escena de Vídeo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Backwards-compatible wrapper
export const ImageStudioAssetSidebar = ImageStudioAssetDrawerContent;
