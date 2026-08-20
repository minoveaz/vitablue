import React from 'react';
import {
  Palette,
  Sliders,
  Type,
  Maximize2,
  Ungroup,
  Sparkles,
  Sun,
  Crop,
  Shield,
  Smartphone,
  Circle,
  Square as SquareIcon,
  FlipHorizontal,
  FlipVertical,
  Paintbrush,
  Eye,
  BoxSelect,
  MessageSquare,
  UserCheck,
  Award,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { ModuleContextPanel } from '../../../components/backoffice-shell/ModuleContextPanel';
import { ImageLayer, CanvasBackground, ImageProject } from '../../types/imageStudio';

export interface ImageStudioInspectorProps {
  project: ImageProject;
  selectedLayer: ImageLayer | null;
  onUpdateLayerProps: (id: string, props: Record<string, unknown>) => void;
  onUpdateLayerScale?: (id: string, scale: number) => void;
  onUpdateLayerWidth?: (id: string, width?: number) => void;
  onUpdateLayerHeight?: (id: string, height?: number) => void;
  onUpdateLayerRotation?: (id: string, rotation: number) => void;
  onUpdateLayerPosition?: (id: string, position: { x: number; y: number }) => void;
  onUpdateLayerFilter?: (id: string, filter: ImageLayer['filter']) => void;
  onUpdateLayerAdjustments?: (id: string, adjustments: { brightness?: number; contrast?: number; blur?: number }) => void;
  onUpdateLayerClipShape?: (id: string, clipShape: ImageLayer['clipShape']) => void;
  onToggleFlipHorizontal?: (id: string) => void;
  onToggleFlipVertical?: (id: string) => void;
  onUpdateLayerOpacity?: (id: string, opacity: number) => void;
  onUpdateLayerShadowPreset?: (id: string, preset: ImageLayer['shadowPreset']) => void;
  onUpdateLayerBorder?: (id: string, border: { borderWidth?: number; borderColor?: string; borderRadius?: number }) => void;
  onCopyStyle?: (id: string) => void;
  onPasteStyle?: (id: string) => void;
  onFitToCanvas?: (id: string) => void;
  onUngroupLayer?: (id: string) => void;
  onUpdateBackground: (patch: Partial<CanvasBackground>) => void;
  onClose?: () => void;
}

export const ImageStudioInspector: React.FC<ImageStudioInspectorProps> = ({
  project,
  selectedLayer,
  onUpdateLayerProps,
  onUpdateLayerScale,
  onUpdateLayerWidth,
  onUpdateLayerHeight,
  onUpdateLayerRotation,
  onUpdateLayerPosition,
  onUpdateLayerFilter,
  onUpdateLayerAdjustments,
  onUpdateLayerClipShape,
  onToggleFlipHorizontal,
  onToggleFlipVertical,
  onUpdateLayerOpacity,
  onUpdateLayerShadowPreset,
  onUpdateLayerBorder,
  onCopyStyle,
  onPasteStyle,
  onFitToCanvas,
  onUngroupLayer,
  onUpdateBackground,
  onClose,
}) => {
  const avatarOptions = [
    { name: 'Sofía', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop' },
    { name: 'Elena', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop' },
    { name: 'Carlos', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' },
  ];

  // 1. ESTADO VACÍO: PROPIEDADES DEL LIENZO
  if (!selectedLayer) {
    return (
      <ModuleContextPanel
        label="Propiedades del Lienzo"
        width="standard"
        variant="dark"
        onClose={onClose}
      >
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Palette className="size-4 text-brand-cyan" />
              <span>{project.preset.name}</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              {project.preset.width} × {project.preset.height} px ({project.preset.aspectRatio})
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
                className="flex w-full items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-left hover:border-primary transition-all text-xs font-bold text-slate-200"
              >
                <div className="size-6 rounded-lg bg-[#005F73]" />
                <span>Ocean Mesh (Oficial)</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateBackground({ gradient: 'radial-gradient(circle at 50% 25%, rgba(238, 155, 0, 0.45) 0%, #001219 80%)' })}
                className="flex w-full items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-left hover:border-primary transition-all text-xs font-bold text-slate-200"
              >
                <div className="size-6 rounded-lg bg-[#EE9B00]" />
                <span>Amber Trust Mesh</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateBackground({ gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 18, 25, 0.95) 0%, #00080C 85%)' })}
                className="flex w-full items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-left hover:border-primary transition-all text-xs font-bold text-slate-200"
              >
                <div className="size-6 rounded-lg bg-[#001219]" />
                <span>Midnight Minimal</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-400 leading-relaxed">
            💡 <strong>Tip:</strong> Haz clic en cualquier elemento en el lienzo para editar sus textos, fotos y estilo visual.
          </div>
        </div>
      </ModuleContextPanel>
    );
  }

  const props = selectedLayer.props as Record<string, unknown>;
  const canUngroup = ['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard', 'CustomGroup'].includes(selectedLayer.blockType ?? '');
  const isTextType = selectedLayer.type === 'text' || selectedLayer.blockType === 'CustomText';

  return (
    <ModuleContextPanel
      label={`Bloque: ${selectedLayer.title}`}
      width="standard"
      variant="dark"
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* 1. HEADER LIMPIO + Z-INDEX */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 truncate">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/20 text-brand-cyan text-xs font-bold">
              {isTextType ? <Type className="size-3.5" /> : <Sliders className="size-3.5" />}
            </span>
            <strong className="text-xs text-slate-200 truncate">{selectedLayer.title}</strong>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              Z: {selectedLayer.zIndex}
            </span>
          </div>
        </div>

        {/* 2. BARRA DE GEOMETRÍA COMPACTA (FIGMA STYLE: 1 SOLA FILA) */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-2">
          <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[10px]">
            <div
              className="rounded bg-slate-900/90 py-1 px-1 border border-slate-800 text-slate-300 cursor-pointer hover:border-brand-cyan"
              title="Posición X en el lienzo"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: 50, y: selectedLayer.position.y })}
            >
              <span className="text-slate-500 mr-1">X</span>
              <span className="text-brand-cyan">{Math.round(selectedLayer.position.x)}%</span>
            </div>
            <div
              className="rounded bg-slate-900/90 py-1 px-1 border border-slate-800 text-slate-300 cursor-pointer hover:border-brand-cyan"
              title="Posición Y en el lienzo"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: selectedLayer.position.x, y: 50 })}
            >
              <span className="text-slate-500 mr-1">Y</span>
              <span className="text-brand-cyan">{Math.round(selectedLayer.position.y)}%</span>
            </div>
            <div
              className="rounded bg-slate-900/90 py-1 px-1 border border-slate-800 text-slate-300 truncate cursor-pointer hover:border-brand-cyan"
              title="Haz clic para alternar ancho predeterminado o auto"
              onClick={() => onUpdateLayerWidth?.(selectedLayer.id, selectedLayer.width ? undefined : 380)}
            >
              <span className="text-slate-500 mr-1">W</span>
              <span className="text-slate-200">{selectedLayer.width ? `${selectedLayer.width}px` : 'Auto'}</span>
            </div>
            <div
              className="rounded bg-slate-900/90 py-1 px-1 border border-slate-800 text-slate-300 truncate cursor-pointer hover:border-brand-cyan"
              title="Haz clic para alternar alto predeterminado o auto"
              onClick={() => onUpdateLayerHeight?.(selectedLayer.id, selectedLayer.height ? undefined : 240)}
            >
              <span className="text-slate-500 mr-1">H</span>
              <span className="text-slate-200">{selectedLayer.height ? `${selectedLayer.height}px` : 'Auto'}</span>
            </div>
            <div
              className="rounded bg-slate-900/90 py-1 px-1 border border-slate-800 text-slate-300 cursor-pointer hover:border-amber-400"
              title="Haz clic para rotar +90°"
              onClick={() => onUpdateLayerRotation?.(selectedLayer.id, ((selectedLayer.rotation ?? 0) + 90) % 360)}
            >
              <span className="text-slate-500 mr-1">∡</span>
              <span className="text-amber-400">{Math.round(selectedLayer.rotation ?? 0)}°</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1.5 pt-2 mt-2 border-t border-slate-900">
            <button
              type="button"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: 50, y: 50 })}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white transition-colors text-center"
              title="Centrar en el lienzo (50%, 50%)"
            >
              Centrar
            </button>
            <button
              type="button"
              onClick={() => onFitToCanvas?.(selectedLayer.id)}
              className="flex-1 py-1 px-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-[10px] font-bold text-brand-cyan transition-colors flex items-center justify-center gap-1"
              title="Auto-ajustar al tamaño del lienzo"
            >
              <Maximize2 className="size-3" />
              <span>Ajustar</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateLayerScale?.(selectedLayer.id, 1)}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white transition-colors text-center"
              title="Escala 100%"
            >
              {Math.round((selectedLayer.scale ?? 1) * 100)}%
            </button>
            {canUngroup && onUngroupLayer && (
              <button
                type="button"
                onClick={() => onUngroupLayer(selectedLayer.id)}
                className="flex-1 py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300 transition-colors flex items-center justify-center gap-1"
                title="Desagrupar en capas independientes"
              >
                <Ungroup className="size-3" />
                <span>Desagrupar</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. CONTENIDO ESPECÍFICO DEL ELEMENTO (EL PROTAGONISTA EN PRIMER PLANO) */}
        
        {/* A. TEXTO PERSONALIZADO (H1, H2, H3, P, BADGES) */}
        {isTextType && (
          <div className="space-y-3 rounded-2xl border border-brand-cyan/20 bg-slate-950 p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
                <Type className="size-3.5" />
                <span>Contenido y Tipografía</span>
              </span>
            </div>

            {/* CONTENIDO DEL TEXTO */}
            <div>
              <textarea
                value={String(props.text ?? selectedLayer.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { text: e.target.value })}
                rows={2}
                placeholder="Escribe el texto aquí..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-cyan focus:outline-none"
              />
            </div>

            {/* FUENTE Y PESO */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Fuente
                </label>
                <select
                  value={selectedLayer.fontFamily ?? 'Poppins, sans-serif'}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { fontFamily: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
                >
                  <option value="Poppins, sans-serif">Poppins (Display)</option>
                  <option value="Inter, sans-serif">Inter (Sans)</option>
                  <option value="Outfit, sans-serif">Outfit</option>
                  <option value="Montserrat, sans-serif">Montserrat</option>
                  <option value="system-ui, sans-serif">System UI</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Grosor
                </label>
                <select
                  value={selectedLayer.fontWeight ?? '700'}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { fontWeight: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
                >
                  <option value="400">Regular (400)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">ExtraBold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
            </div>

            {/* TAMAÑO Y ALINEACIÓN */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                  <span>Tamaño</span>
                  <span className="font-mono text-brand-cyan">{selectedLayer.fontSize ?? 24}px</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={64}
                  step={1}
                  value={selectedLayer.fontSize ?? 24}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { fontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-teal-400"
                />
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Alineación</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'left', icon: AlignLeft },
                    { id: 'center', icon: AlignCenter },
                    { id: 'right', icon: AlignRight },
                  ].map((al) => {
                    const Icon = al.icon;
                    return (
                      <button
                        key={al.id}
                        type="button"
                        onClick={() => onUpdateLayerProps(selectedLayer.id, { textAlign: al.id })}
                        className={`flex h-7 items-center justify-center rounded-lg border text-xs transition-colors ${
                          (String(props.textAlign ?? 'center')) === al.id
                            ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="size-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PALETA DE COLOR SEMÁNTICA */}
            <div className="pt-2 border-t border-slate-900">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Color de Letra
              </label>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Blanco', color: '#FFFFFF' },
                  { label: 'Mint', color: '#94D2BD' },
                  { label: 'Gold', color: '#EE9B00' },
                  { label: 'Teal', color: '#005F73' },
                  { label: 'Rose', color: '#F43F5E' },
                  { label: 'Slate', color: '#94A3B8' },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    title={c.label}
                    onClick={() => onUpdateLayerProps(selectedLayer.id, { fill: c.color })}
                    className={`size-6 rounded-full border transition-all ${
                      (selectedLayer.fill ?? '#FFFFFF') === c.color
                        ? 'border-brand-cyan ring-2 ring-brand-cyan/40 scale-110'
                        : 'border-slate-700 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* B. ASESOR / TARJETA ASESORA (MOTIONADVISORCARD O ADVISOR SUBLAYERS) */}
        {(selectedLayer.blockType === 'MotionAdvisorCard' || selectedLayer.blockType === 'AdvisorAvatarBadge') && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
              <UserCheck className="size-3.5" />
              <span>Datos del Asesor</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre</label>
                <input
                  type="text"
                  value={String(props.name ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cargo</label>
                <input
                  type="text"
                  value={String(props.role ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { role: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* AVATAR SELECTOR RÁPIDO */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Foto de Perfil</label>
              <div className="grid grid-cols-3 gap-1.5">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => onUpdateLayerProps(selectedLayer.id, { avatarUrl: opt.url, name: opt.name })}
                    className={`flex items-center gap-2 rounded-xl border p-1.5 transition-all text-left ${
                      props.avatarUrl === opt.url
                        ? 'border-brand-cyan bg-primary/20 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img src={opt.url} alt={opt.name} className="size-7 rounded-full object-cover shrink-0" />
                    <span className="text-[10px] font-bold truncate">{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {props.message !== undefined && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cita / Mensaje</label>
                <textarea
                  value={String(props.message ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { message: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none leading-relaxed"
                />
              </div>
            )}
          </div>
        )}

        {/* C. SELLO DE GARANTÍA (MOTIONTRUSTBADGE) */}
        {(selectedLayer.blockType === 'MotionTrustBadge' || selectedLayer.blockType === 'TrustBadgeTitle') && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-400 font-black">
              <Award className="size-3.5" />
              <span>Garantía y Confianza</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Título</label>
              <input
                type="text"
                value={String(props.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Subtítulo</label>
              <textarea
                value={String(props.subtitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { subtitle: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* D. COMPARATIVA (MOTIONCOMPARISONCARD) */}
        {(selectedLayer.blockType === 'MotionComparisonCard' || selectedLayer.blockType === 'ComparisonWrongBox' || selectedLayer.blockType === 'ComparisonCorrectBox') && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
              <Sliders className="size-3.5" />
              <span>Textos de Comparativa</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">Opción Incorrecta (❌)</label>
                <input
                  type="text"
                  value={String(props.wrongOptionTitle ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { wrongOptionTitle: e.target.value })}
                  className="w-full rounded-xl border border-rose-900/50 bg-rose-950/30 p-2 text-xs text-rose-200 focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Opción VitaBlue (✅)</label>
                <input
                  type="text"
                  value={String(props.correctOptionTitle ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { correctOptionTitle: e.target.value })}
                  className="w-full rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-2 text-xs text-emerald-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* E. PARRILLA DE ASEGURADORAS (MOTIONPROVIDERGRID) */}
        {(selectedLayer.blockType === 'MotionProviderGrid' || selectedLayer.blockType === 'ProviderGridHeader') && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
              <Layers className="size-3.5" />
              <span>Parrilla de Proveedores</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Título de Parrilla</label>
              <input
                type="text"
                value={String(props.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* F. BOTÓN CTA O HOOK ALERT */}
        {(selectedLayer.blockType === 'WhatsAppCtaButton' || selectedLayer.blockType === 'HookAlertBadge') && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
              <MessageSquare className="size-3.5" />
              <span>Texto del Elemento</span>
            </div>
            <div>
              <input
                type="text"
                value={String(props.whatsAppText ?? props.badge ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, props.whatsAppText !== undefined ? { whatsAppText: e.target.value } : { badge: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 4. ESTILO VISUAL & ACABADO (COMPACTO Y ELEGANTE) */}
        
        {/* A. OPACIDAD Y ACCIONES RÁPIDAS DE ESTILO */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Eye className="size-3.5 text-brand-cyan" />
              <span>Opacidad & Transformación</span>
            </span>
            <span className="font-mono text-brand-cyan text-[11px]">
              {Math.round((selectedLayer.opacity !== undefined ? selectedLayer.opacity : 1) * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={selectedLayer.opacity !== undefined ? selectedLayer.opacity : 1}
              onChange={(e) => onUpdateLayerOpacity?.(selectedLayer.id, parseFloat(e.target.value))}
              className="flex-1 accent-primary"
            />
            <button
              type="button"
              onClick={() => onUpdateLayerOpacity?.(selectedLayer.id, 1)}
              className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              100%
            </button>
          </div>

          {/* BRILLO */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900 text-[10px]">
            <span className="flex items-center gap-1 text-slate-400 font-bold uppercase shrink-0">
              <Sun className="size-3 text-amber-400" />
              <span>Brillo</span>
            </span>
            <input
              type="range"
              min={60}
              max={140}
              step={5}
              value={selectedLayer.brightness ?? 100}
              onChange={(e) => onUpdateLayerAdjustments?.(selectedLayer.id, { brightness: parseInt(e.target.value, 10) })}
              className="flex-1 accent-amber-400"
            />
            <span className="font-mono text-slate-300 min-w-[28px] text-right">{selectedLayer.brightness ?? 100}%</span>
          </div>

          {/* BOTONES RÁPIDOS: FLIP H, FLIP V, COPIAR/PEGAR ESTILO */}
          <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-900">
            <button
              type="button"
              onClick={() => onToggleFlipHorizontal?.(selectedLayer.id)}
              className={`flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                selectedLayer.flipHorizontal
                  ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title="Voltear horizontalmente"
            >
              <FlipHorizontal className="size-3" />
              <span>Flip H</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleFlipVertical?.(selectedLayer.id)}
              className={`flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                selectedLayer.flipVertical
                  ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title="Voltear verticalmente"
            >
              <FlipVertical className="size-3" />
              <span>Flip V</span>
            </button>

            <button
              type="button"
              onClick={() => onCopyStyle?.(selectedLayer.id)}
              className="flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border border-slate-800 bg-slate-900 text-slate-400 hover:text-brand-cyan transition-colors"
              title="Copiar Estilo (⌥⌘C)"
            >
              <Paintbrush className="size-3 text-brand-cyan" />
              <span>Copiar</span>
            </button>

            <button
              type="button"
              onClick={() => onPasteStyle?.(selectedLayer.id)}
              className="flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border border-slate-800 bg-slate-900 text-slate-400 hover:text-amber-300 transition-colors"
              title="Pegar Estilo (⌥⌘V)"
            >
              <Paintbrush className="size-3 text-amber-400" />
              <span>Pegar</span>
            </button>
          </div>
        </div>

        {/* B. SOMBRAS Y RESPLANDORES (SHADOW PRESETS) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Sparkles className="size-3.5 text-accent" />
              <span>Sombras & Glow</span>
            </span>
            <span className="font-mono text-brand-cyan text-[10px] capitalize">
              {selectedLayer.shadowPreset ?? 'Ninguna'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'none', label: 'Ninguna' },
              { id: 'soft', label: 'Suave' },
              { id: 'deep', label: 'Profunda' },
              { id: 'glow_teal', label: 'Glow Teal' },
              { id: 'glow_gold', label: 'Glow Gold' },
              { id: 'neon', label: 'Neón Cyber' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onUpdateLayerShadowPreset?.(selectedLayer.id, s.id as ImageLayer['shadowPreset'])}
                className={`rounded-lg py-1 text-[10px] font-bold border transition-all ${
                  (selectedLayer.shadowPreset ?? 'none') === s.id
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan shadow-xs'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* C. BORDES Y ESQUINAS (CORNER RADIUS & STROKE) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <BoxSelect className="size-3.5 text-brand-cyan" />
              <span>Bordes y Esquinas</span>
            </span>
          </div>

          {/* RADIO DE ESQUINA */}
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <span className="text-slate-400 font-bold uppercase shrink-0">Radio</span>
            <div className="grid grid-cols-5 gap-1 flex-1">
              {[0, 8, 16, 24, 9999].map((rad) => (
                <button
                  key={rad}
                  type="button"
                  onClick={() => onUpdateLayerBorder?.(selectedLayer.id, { borderRadius: rad })}
                  className={`rounded-md py-0.5 text-[9px] font-bold border transition-colors ${
                    (selectedLayer.borderRadius ?? 0) === rad
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {rad === 9999 ? 'Pill' : `${rad}`}
                </button>
              ))}
            </div>
          </div>

          {/* GROSOR DE BORDE */}
          <div className="flex items-center justify-between gap-1 text-[10px] pt-1 border-t border-slate-900">
            <span className="text-slate-400 font-bold uppercase shrink-0">Grosor</span>
            <div className="grid grid-cols-4 gap-1 flex-1">
              {[0, 1, 2, 4].map((bw) => (
                <button
                  key={bw}
                  type="button"
                  onClick={() => onUpdateLayerBorder?.(selectedLayer.id, { borderWidth: bw, borderColor: selectedLayer.borderColor ?? '#94D2BD' })}
                  className={`rounded-md py-0.5 text-[9px] font-bold border transition-colors ${
                    (selectedLayer.borderWidth ?? 0) === bw
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {bw === 0 ? '0px' : `${bw}px`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* D. MÁSCARA Y SILUETA (CLIPPING SHAPES) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Crop className="size-3.5 text-brand-cyan" />
              <span>Máscara y Silueta</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'none', label: 'Sin recorte', icon: SquareIcon },
              { id: 'circle', label: 'Círculo', icon: Circle },
              { id: 'squircle', label: 'Squircle', icon: SquareIcon },
              { id: 'pill', label: 'Píldora', icon: SquareIcon },
              { id: 'phone_mockup', label: 'Móvil', icon: Smartphone },
              { id: 'shield', label: 'Escudo', icon: Shield },
            ].map((shape) => {
              const Icon = shape.icon;
              const isSelected = (selectedLayer.clipShape ?? 'none') === shape.id;
              return (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => onUpdateLayerClipShape?.(selectedLayer.id, shape.id as ImageLayer['clipShape'])}
                  className={`flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border transition-all ${
                    isSelected
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan shadow-xs'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="size-3" />
                  <span>{shape.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* E. FILTROS VISUALES */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Sparkles className="size-3.5 text-accent" />
              <span>Filtros de Color</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'none', label: 'Normal' },
              { id: 'teal_tint', label: 'Teal Brand' },
              { id: 'gold_tint', label: 'Gold Trust' },
              { id: 'grayscale', label: 'B&W' },
              { id: 'sepia', label: 'Sepia' },
              { id: 'contrast', label: 'Contraste' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onUpdateLayerFilter?.(selectedLayer.id, f.id as ImageLayer['filter'])}
                className={`rounded-lg py-1 text-[10px] font-bold border transition-all ${
                  (selectedLayer.filter ?? 'none') === f.id
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan shadow-xs'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModuleContextPanel>
  );
};
