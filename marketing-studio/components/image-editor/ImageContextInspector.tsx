import React from 'react';
import {
  Sliders,
  Palette,
} from 'lucide-react';
import { ImageLayer, CanvasBackground, ImageProject } from '../../types/imageStudio';

interface ImageContextInspectorProps {
  project: ImageProject;
  selectedLayer: ImageLayer | null;
  onUpdateLayerProps: (id: string, props: Record<string, unknown>) => void;
  onUpdateLayerPosition?: (id: string, pos: { x: number; y: number }) => void;
  onUpdateLayerScale?: (id: string, scale: number) => void;
  onUpdateBackground: (patch: Partial<CanvasBackground>) => void;
}

export const ImageContextInspector: React.FC<ImageContextInspectorProps> = ({
  project,
  selectedLayer,
  onUpdateLayerProps,
  onUpdateBackground,
}) => {
  const avatarOptions = [
    { name: 'Sofía', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop' },
    { name: 'Elena', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop' },
    { name: 'Carlos', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' },
  ];

  if (!selectedLayer) {
    return (
      <aside className="flex h-full w-72 sm:w-80 flex-col border-l border-slate-200 bg-white p-5 shadow-xs select-none shrink-0 z-20 overflow-y-auto space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="size-4 text-primary" />
            <span>Propiedades del Lienzo</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
            {project.preset.name} · {project.preset.width} × {project.preset.height} px
          </span>
        </div>

        <div className="space-y-3">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Fondo del Lienzo
          </label>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onUpdateBackground({ gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 95, 115, 0.75) 0%, #001219 80%)' })}
              className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 p-2 text-left hover:border-primary transition-all text-xs font-bold text-slate-800"
            >
              <div className="size-6 rounded-lg bg-[#005F73]" />
              <span>Ocean Mesh (Oficial)</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateBackground({ gradient: 'radial-gradient(circle at 50% 25%, rgba(238, 155, 0, 0.45) 0%, #001219 80%)' })}
              className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 p-2 text-left hover:border-primary transition-all text-xs font-bold text-slate-800"
            >
              <div className="size-6 rounded-lg bg-[#EE9B00]" />
              <span>Amber Trust Mesh</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateBackground({ gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 18, 25, 0.95) 0%, #00080C 85%)' })}
              className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 p-2 text-left hover:border-primary transition-all text-xs font-bold text-slate-800"
            >
              <div className="size-6 rounded-lg bg-[#001219]" />
              <span>Midnight Minimal</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-500 leading-relaxed">
          💡 <strong>Tip:</strong> Haz clic en cualquier elemento del lienzo para editar sus textos, fotos y posición.
        </div>
      </aside>
    );
  }

  const props = selectedLayer.props as Record<string, unknown>;

  return (
    <aside className="flex h-full w-72 sm:w-80 flex-col border-l border-slate-200 bg-white p-5 shadow-xs select-none shrink-0 z-20 overflow-y-auto space-y-4">
      {/* HEADER */}
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Sliders className="size-4 text-primary" />
          <span>{selectedLayer.title}</span>
        </span>
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
          Z-Index: {selectedLayer.zIndex}
        </span>
      </div>

      {/* FORM FOR MOTIONSADVISORCARD */}
      {selectedLayer.blockType === 'MotionAdvisorCard' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre</label>
            <input
              type="text"
              value={String(props.name ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cargo / Especialidad</label>
            <input
              type="text"
              value={String(props.role ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { role: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>

          {/* AVATAR SELECTOR */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Foto Asesor</label>
            <div className="flex items-center gap-2 mb-2">
              {avatarOptions.map((av) => (
                <button
                  key={av.name}
                  type="button"
                  onClick={() => onUpdateLayerProps(selectedLayer.id, { avatarUrl: av.url, name: av.name })}
                  className={`size-10 rounded-full overflow-hidden border-2 transition-transform ${
                    props.avatarUrl === av.url ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                  title={av.name}
                >
                  <img src={av.url} alt={av.name} className="size-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="text"
              value={String(props.avatarUrl ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { avatarUrl: e.target.value })}
              placeholder="URL de foto..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-700 focus:bg-white focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Badge de Estado</label>
            <input
              type="text"
              value={String(props.badge ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { badge: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cita / Mensaje</label>
            <textarea
              value={String(props.message ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { message: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Texto Botón WhatsApp</label>
            <input
              type="text"
              value={String(props.whatsAppText ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { whatsAppText: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* FORM FOR MOTIONTRUSTBADGE */}
      {selectedLayer.blockType === 'MotionTrustBadge' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título</label>
            <input
              type="text"
              value={String(props.title ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subtítulo</label>
            <textarea
              value={String(props.subtitle ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { subtitle: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Highlight</label>
            <input
              type="text"
              value={String(props.highlight ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { highlight: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* FORM FOR MOTIONCOMPARISONCARD */}
      {selectedLayer.blockType === 'MotionComparisonCard' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título</label>
            <input
              type="text"
              value={String(props.title ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-600 mb-1">Opción Incorrecta</label>
            <input
              type="text"
              value={String(props.wrongOptionTitle ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { wrongOptionTitle: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Opción Correcta</label>
            <input
              type="text"
              value={String(props.correctOptionTitle ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { correctOptionTitle: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* FORM FOR MOTIONPROVIDERGRID */}
      {selectedLayer.blockType === 'MotionProviderGrid' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título Principal</label>
            <input
              type="text"
              value={String(props.title ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subtítulo</label>
            <input
              type="text"
              value={String(props.subtitle ?? '')}
              onChange={(e) => onUpdateLayerProps(selectedLayer.id, { subtitle: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )}
    </aside>
  );
};
