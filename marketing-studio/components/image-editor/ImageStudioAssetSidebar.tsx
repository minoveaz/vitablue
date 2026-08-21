import React from 'react';
import {
  UserCheck,
  ShieldCheck,
  SplitSquareVertical,
  Grid,
  Download,
  Film,
  Sparkles,
} from 'lucide-react';
import { ImageBlockType, ImageProject } from '../../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../../utils/imageTemplates';
import { ImageStudioLayersPanel } from './ImageStudioLayersPanel';
import { ImageStudioTextDrawer } from './drawers/ImageStudioTextDrawer';
import { ImageStudioMyDesignsDrawer } from './drawers/ImageStudioMyDesignsDrawer';
import { ImageStudioElementsDrawer } from './drawers/ImageStudioElementsDrawer';
import { ImageStudioMediaDrawer } from './drawers/ImageStudioMediaDrawer';
import { TextPresetItem } from '../../data/textPresets';
import { ImageLayer } from '../../types/imageStudio';

export interface ImageStudioAssetDrawerContentProps {
  activeTab: string | null;
  project: ImageProject;
  selectedLayerId: string | null;
  selectedLayerIds?: string[];
  onSelectLayer: (id: string, isShift?: boolean) => void;
  onLoadTemplate: (template: ImageProject) => void;
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
  onAddTextLayer?: (preset: TextPresetItem) => void;
  onAddImageLayer?: (imageUrl: string, options?: { title?: string; clipShape?: any }) => void;
  onInsertSavedLayer?: (layer: ImageLayer) => void;
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
  onAddImageLayer,
  onInsertSavedLayer,
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

  return (
    <div className="space-y-4 select-none">
      {/* 0. MIS DISEÑOS & BIBLIOTECA PERSONAL (POSICIÓN 1) */}
      {activeTab === 'my-designs' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioMyDesignsDrawer
            onLoadProject={onLoadTemplate}
            onInsertSavedLayer={(layer) => {
              if (onInsertSavedLayer) {
                onInsertSavedLayer(layer);
              } else {
                onAddBlock(layer.blockType as ImageBlockType, layer.props as Record<string, unknown>);
              }
            }}
          />
        </div>
      )}

      {/* 1. TEXTO & TIPOGRAFÍAS */}
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

      {/* 5. MEDIOS, FOTOS DE STOCK & ASESORAS */}
      {activeTab === 'media' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioMediaDrawer
            onInsertImageLayer={(url, options) => {
              if (onAddImageLayer) {
                onAddImageLayer(url, options);
              } else {
                onAddBlock('ImageMedia' as any, { imageUrl: url, ...options });
              }
            }}
            onSetBackgroundImage={(url) => {
              onUpdateBackground(
                `linear-gradient(rgba(0, 18, 25, 0.75), rgba(0, 18, 25, 0.85)), url('${url}') center/cover no-repeat`,
                '#001219'
              );
            }}
          />
        </div>
      )}

      {/* 6. ELEMENTOS Y FORMAS (DRAWER MODULAR PROFESIONAL) */}
      {activeTab === 'elements' && (
        <div className="-m-4 h-[calc(100vh-140px)]">
          <ImageStudioElementsDrawer
            onAddBlock={onAddBlock}
            onInsertSavedLayer={onInsertSavedLayer}
          />
        </div>
      )}

      {/* 8. COPYS CON IA & HOOKS DE CONVERSIÓN */}
      {activeTab === 'ai-copy' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="size-4 text-amber-400" />
              <strong className="text-xs font-bold text-amber-200">Asistente IA de Copywriting</strong>
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              Titulares de alto impacto optimizados para conversión de seguros de visado y extranjería.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Ganchos (Hooks) de Entrada
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onAddTextLayer?.({
                  id: 'hook-1',
                  title: 'Hook Visado',
                  category: 'hooks',
                  previewText: '¿Te mudas a España? 🇪🇸 Evita denegaciones de visado.',
                  defaultText: '¿Te mudas a España? 🇪🇸 Evita denegaciones de visado.',
                  tag: 'h2',
                  fontSize: 22,
                  fontWeight: '800',
                  color: '#FFFFFF',
                  fill: '#FFFFFF',
                  align: 'center',
                  fontFamily: 'Poppins, sans-serif',
                } as unknown as TextPresetItem)}
                className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-amber-400 hover:bg-slate-900 transition-all text-left group"
              >
                <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 block">
                  "¿Te mudas a España? 🇪🇸 Evita denegaciones..."
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Gancho Estudiantes & Nómadas</span>
              </button>

              <button
                type="button"
                onClick={() => onAddTextLayer?.({
                  id: 'hook-2',
                  title: 'Hook Sin Copagos',
                  category: 'hooks',
                  previewText: 'Póliza 100% válida para Extranjería: Sin Copagos ni Carencias.',
                  defaultText: 'Póliza 100% válida para Extranjería: Sin Copagos ni Carencias.',
                  tag: 'h2',
                  fontSize: 20,
                  fontWeight: '800',
                  color: '#94D2BD',
                  fill: '#94D2BD',
                  align: 'center',
                  fontFamily: 'Poppins, sans-serif',
                } as unknown as TextPresetItem)}
                className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-teal-400 hover:bg-slate-900 transition-all text-left group"
              >
                <span className="text-[11px] font-bold text-slate-200 group-hover:text-brand-cyan block">
                  "Póliza 100% válida: Sin Copagos ni Carencias"
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Derribar Objeción Legal</span>
              </button>

              <button
                type="button"
                onClick={() => onAddTextLayer?.({
                  id: 'hook-3',
                  title: 'Hook WhatsApp Directo',
                  category: 'ctas',
                  previewText: '👉 Chatea con una asesora y recibe tu certificado hoy mismo.',
                  defaultText: '👉 Chatea con una asesora y recibe tu certificado hoy mismo.',
                  tag: 'p',
                  fontSize: 14,
                  fontWeight: '600',
                  color: '#EE9B00',
                  fill: '#EE9B00',
                  align: 'center',
                  fontFamily: 'Inter, sans-serif',
                } as unknown as TextPresetItem)}
                className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-amber-400 hover:bg-slate-900 transition-all text-left group"
              >
                <span className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 block">
                  "👉 Chatea con una asesora y recibe tu certificado hoy"
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Llamada a la Acción (CTA)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. AUDIO & VIDEO (REMOTION BRIDGE) */}
      {activeTab === 'video-bridge' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Film className="size-4 text-teal-400" />
              <strong className="text-xs font-bold text-teal-200">Puente Remotion Video Studio</strong>
            </div>
            <p className="text-[11px] text-teal-300/80 leading-relaxed mb-3">
              Convierte este arte gráfico estático en una escena de vídeo animada con voz en off y música para reels / stories.
            </p>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-2.5 text-xs font-black transition-transform active:scale-95 shadow-md"
            >
              <Sparkles className="size-3.5" />
              <span>Convertir a Escena de Vídeo</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Download className="size-4 text-brand-cyan" />
              <strong className="text-xs font-bold text-slate-200">Exportación de Imagen en Alta Definición</strong>
            </div>
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
        </div>
      )}
    </div>
  );
};

// Backwards-compatible wrapper
export const ImageStudioAssetSidebar = ImageStudioAssetDrawerContent;
