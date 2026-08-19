import {
  Palette,
  Sliders,
  Scaling,
  Maximize2,
  Ungroup,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  ArrowUpDown,
  RotateCw,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
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
            💡 <strong>Tip:</strong> Haz clic en cualquier elemento en el lienzo central para editar sus textos, fotos y posición.
          </div>
        </div>
      </ModuleContextPanel>
    );
  }

  const props = selectedLayer.props as Record<string, unknown>;

  const handleNudgePosition = (deltaX: number, deltaY: number) => {
    if (!onUpdateLayerPosition) return;
    const currentX = selectedLayer.position.x;
    const currentY = selectedLayer.position.y;
    const newX = Math.max(5, Math.min(95, currentX + deltaX));
    const newY = Math.max(5, Math.min(95, currentY + deltaY));
    onUpdateLayerPosition(selectedLayer.id, { x: Math.round(newX), y: Math.round(newY) });
  };

  return (
    <ModuleContextPanel
      label={`Bloque: ${selectedLayer.title}`}
      width="standard"
      variant="dark"
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* HEADER DE CAPA */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary/20 text-brand-cyan text-xs font-bold uppercase">
              <Sliders className="size-3.5" />
            </span>
            <strong className="text-xs text-slate-200">{selectedLayer.title}</strong>
          </div>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            Z-Index: {selectedLayer.zIndex}
          </span>
        </div>

        {/* BARRA DE ACCIONES RÁPIDAS (CANVA-STYLE) */}
        <div className="grid grid-cols-4 gap-1 rounded-2xl border border-slate-800 bg-slate-950/80 p-1.5">
          <button
            type="button"
            onClick={() => onCopyStyle?.(selectedLayer.id)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl p-1.5 text-[10px] font-bold text-slate-300 hover:bg-slate-900 hover:text-brand-cyan transition-colors"
            title="Copiar Estilo Visual (⌥⌘C)"
          >
            <Paintbrush className="size-3.5 text-brand-cyan" />
            <span>Copiar</span>
          </button>

          <button
            type="button"
            onClick={() => onPasteStyle?.(selectedLayer.id)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl p-1.5 text-[10px] font-bold text-slate-300 hover:bg-slate-900 hover:text-brand-cyan transition-colors"
            title="Pegar Estilo Visual (⌥⌘V)"
          >
            <Paintbrush className="size-3.5 text-amber-400" />
            <span>Pegar</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleFlipHorizontal?.(selectedLayer.id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl p-1.5 text-[10px] font-bold transition-colors ${
              selectedLayer.flipHorizontal
                ? 'bg-primary/30 text-brand-cyan border border-brand-cyan/40'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Voltear Horizontalmente"
          >
            <FlipHorizontal className="size-3.5" />
            <span>Flip H</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleFlipVertical?.(selectedLayer.id)}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl p-1.5 text-[10px] font-bold transition-colors ${
              selectedLayer.flipVertical
                ? 'bg-primary/30 text-brand-cyan border border-brand-cyan/40'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Voltear Verticalmente"
          >
            <FlipVertical className="size-3.5" />
            <span>Flip V</span>
          </button>
        </div>

        {/* 1. CONTROL DE POSICIÓN Y ALINEACIÓN */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Move className="size-3.5 text-brand-cyan" />
              <span>Posición y Ubicación</span>
            </span>
            <span className="font-mono text-brand-cyan text-[11px]">
              X: {selectedLayer.position.x}% · Y: {selectedLayer.position.y}%
            </span>
          </div>

          {/* CONTROLES DE DESPLAZAMIENTO (NUDGE) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleNudgePosition(-4, 0)}
                className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Mover a la izquierda"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleNudgePosition(0, -4)}
                className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Mover arriba"
              >
                <ArrowUp className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleNudgePosition(0, 4)}
                className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Mover abajo"
              >
                <ArrowDown className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleNudgePosition(4, 0)}
                className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Mover a la derecha"
              >
                <ArrowRight className="size-3.5" />
              </button>
            </div>

            {/* BOTONES DE CENTRADO Y ALINEACIÓN RÁPIDA */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: 50, y: selectedLayer.position.y })}
                className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-300 hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Centrar horizontalmente"
              >
                <AlignHorizontalJustifyCenter className="size-3" />
                <span>Centrar X</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: selectedLayer.position.x, y: 50 })}
                className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-300 hover:border-brand-cyan hover:text-brand-cyan transition-colors"
                title="Centrar verticalmente"
              >
                <AlignVerticalJustifyCenter className="size-3" />
                <span>Centrar Y</span>
              </button>
            </div>
          </div>

          {/* ACCIONES DE ALINEACIÓN DE 1-CLIC */}
          <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-1 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: 20, y: selectedLayer.position.y })}
              className="flex-1 rounded-md bg-slate-900 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-center"
              title="Alinear a la izquierda"
            >
              Izq
            </button>
            <button
              type="button"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: 50, y: selectedLayer.position.y })}
              className="flex-1 rounded-md bg-slate-900 py-1 text-brand-cyan hover:text-white hover:bg-slate-800 transition-colors text-center"
              title="Alinear al centro"
            >
              Centro
            </button>
            <button
              type="button"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: 80, y: selectedLayer.position.y })}
              className="flex-1 rounded-md bg-slate-900 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-center"
              title="Alinear a la derecha"
            >
              Der
            </button>
            <div className="w-px h-3 bg-slate-800" />
            <button
              type="button"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: selectedLayer.position.x, y: 20 })}
              className="flex-1 rounded-md bg-slate-900 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-center"
              title="Alinear arriba"
            >
              Arriba
            </button>
            <button
              type="button"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: selectedLayer.position.x, y: 80 })}
              className="flex-1 rounded-md bg-slate-900 py-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-center"
              title="Alinear abajo"
            >
              Abajo
            </button>
          </div>
        </div>

        {/* 2. CONTROL DE ANCHO / ANCHURA (WIDTH) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <ArrowLeftRight className="size-3.5 text-brand-cyan" />
              <span>Ancho / Anchura (Width)</span>
            </span>
            <span className="font-mono text-brand-cyan">
              {selectedLayer.width ? `${selectedLayer.width}px` : 'Auto'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={120}
              max={950}
              step={10}
              value={selectedLayer.width ?? 380}
              onChange={(e) => onUpdateLayerWidth?.(selectedLayer.id, parseInt(e.target.value, 10))}
              className="flex-1 accent-primary"
            />
            <button
              type="button"
              onClick={() => onUpdateLayerWidth?.(selectedLayer.id, undefined)}
              className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              title="Restablecer a Ancho Automático"
            >
              Auto
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1 pt-1">
            {[260, 360, 440, 560, 750].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => onUpdateLayerWidth?.(selectedLayer.id, w)}
                className={`rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                  selectedLayer.width === w
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>
        </div>

        {/* 3. CONTROL DE ALTO / ALTURA (HEIGHT) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <ArrowUpDown className="size-3.5 text-brand-cyan" />
              <span>Alto / Altura (Height)</span>
            </span>
            <span className="font-mono text-brand-cyan">
              {selectedLayer.height ? `${selectedLayer.height}px` : 'Auto'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={60}
              max={950}
              step={10}
              value={selectedLayer.height ?? 380}
              onChange={(e) => onUpdateLayerHeight?.(selectedLayer.id, parseInt(e.target.value, 10))}
              className="flex-1 accent-primary"
            />
            <button
              type="button"
              onClick={() => onUpdateLayerHeight?.(selectedLayer.id, undefined)}
              className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              title="Restablecer a Alto Automático"
            >
              Auto
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1 pt-1">
            {[140, 240, 380, 480, 620].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => onUpdateLayerHeight?.(selectedLayer.id, h)}
                className={`rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                  selectedLayer.height === h
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {h}px
              </button>
            ))}
          </div>
        </div>

        {/* 4. CONTROL DE TAMAÑO Y ESCALA */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Scaling className="size-3.5 text-brand-cyan" />
              <span>Tamaño / Escala General</span>
            </span>
            <span className="font-mono text-brand-cyan">
              {Math.round((selectedLayer.scale ?? 1) * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.35}
              max={2.0}
              step={0.05}
              value={selectedLayer.scale ?? 1}
              onChange={(e) => onUpdateLayerScale?.(selectedLayer.id, parseFloat(e.target.value))}
              className="flex-1 accent-primary"
            />
            <button
              type="button"
              onClick={() => onUpdateLayerScale?.(selectedLayer.id, 1)}
              className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              title="Restablecer al 100%"
            >
              100%
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 pt-1">
            {[0.75, 0.9, 1.0, 1.25].map((presetScale) => (
              <button
                key={presetScale}
                type="button"
                onClick={() => onUpdateLayerScale?.(selectedLayer.id, presetScale)}
                className={`rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                  Math.abs((selectedLayer.scale ?? 1) - presetScale) < 0.03
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {Math.round(presetScale * 100)}%
              </button>
            ))}
          </div>

          {/* ACCIÓN AUTO-AJUSTAR AL LIENZO */}
          <div className="pt-2 border-t border-slate-900 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onFitToCanvas?.(selectedLayer.id)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
            >
              <Maximize2 className="size-3.5" />
              <span>Auto-Ajustar al Lienzo</span>
            </button>

            {['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard'].includes(selectedLayer.blockType ?? '') && (
              <button
                type="button"
                onClick={() => onUngroupLayer?.(selectedLayer.id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-400 hover:text-amber-300 transition-all shadow-xs"
                title="Separar este bloque en elementos y capas independientes para moverlos libremente"
              >
                <Ungroup className="size-3.5 text-amber-400" />
                <span>Desagrupar en Elementos Libres</span>
              </button>
            )}
          </div>
        </div>

        {/* 5. CONTROL DE ROTACIÓN ANGULAR */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <RotateCw className="size-3.5 text-brand-cyan" />
              <span>Rotación Angular</span>
            </span>
            <span className="font-mono text-brand-cyan">
              {Math.round(selectedLayer.rotation ?? 0)}°
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={Math.round(selectedLayer.rotation ?? 0)}
              onChange={(e) => onUpdateLayerRotation?.(selectedLayer.id, parseInt(e.target.value, 10))}
              className="flex-1 accent-primary"
            />
            <button
              type="button"
              onClick={() => onUpdateLayerRotation?.(selectedLayer.id, 0)}
              className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              title="Restablecer a 0°"
            >
              0°
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 pt-1">
            {[0, 90, 180, 270].map((angle) => (
              <button
                key={angle}
                type="button"
                onClick={() => onUpdateLayerRotation?.(selectedLayer.id, angle)}
                className={`rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                  Math.round(selectedLayer.rotation ?? 0) === angle
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {angle}°
              </button>
            ))}
          </div>
        </div>

        {/* 5. FILTROS VISUALES Y EFECTOS DE COLOR */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Sparkles className="size-3.5 text-accent" />
              <span>Filtros y Estilo de Color</span>
            </span>
            <span className="font-mono text-brand-cyan capitalize text-[11px]">
              {selectedLayer.filter ?? 'Normal'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'none', label: 'Normal' },
              { id: 'grayscale', label: 'B&W Minimal' },
              { id: 'sepia', label: 'Sepia Cálido' },
              { id: 'teal_tint', label: 'Teal Brand' },
              { id: 'gold_tint', label: 'Gold Trust' },
              { id: 'contrast', label: 'Alto Contraste' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onUpdateLayerFilter?.(selectedLayer.id, f.id as ImageLayer['filter'])}
                className={`rounded-lg py-1.5 text-[10px] font-bold border transition-all ${
                  (selectedLayer.filter ?? 'none') === f.id
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan shadow-xs'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* AJUSTES DE BRILLO Y CONTRASTE */}
          <div className="pt-2 border-t border-slate-900 space-y-2 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1"><Sun className="size-3 text-amber-400" /> Brillo</span>
              <span className="font-mono text-slate-200">{selectedLayer.brightness ?? 100}%</span>
            </div>
            <input
              type="range"
              min={60}
              max={140}
              step={5}
              value={selectedLayer.brightness ?? 100}
              onChange={(e) => onUpdateLayerAdjustments?.(selectedLayer.id, { brightness: parseInt(e.target.value, 10) })}
              className="w-full accent-amber-400"
            />
          </div>
        </div>

        {/* 6. MÁSCARA Y FORMA DE RECORTE (CLIPPING SHAPES) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Crop className="size-3.5 text-brand-cyan" />
              <span>Máscara y Silueta</span>
            </span>
            <span className="font-mono text-brand-cyan capitalize text-[11px]">
              {selectedLayer.clipShape ?? 'Original'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'none', label: 'Sin recorte', icon: SquareIcon },
              { id: 'circle', label: 'Círculo', icon: Circle },
              { id: 'squircle', label: 'Squircle Apple', icon: SquareIcon },
              { id: 'pill', label: 'Píldora', icon: SquareIcon },
              { id: 'phone_mockup', label: 'Marco Móvil', icon: Smartphone },
              { id: 'shield', label: 'Escudo', icon: Shield },
            ].map((shape) => {
              const Icon = shape.icon;
              const isSelected = (selectedLayer.clipShape ?? 'none') === shape.id;
              return (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => onUpdateLayerClipShape?.(selectedLayer.id, shape.id as ImageLayer['clipShape'])}
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-bold border transition-all ${
                    isSelected
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan shadow-xs'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{shape.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. OPACIDAD Y TRANSPARENCIA */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Eye className="size-3.5 text-brand-cyan" />
              <span>Opacidad / Transparencia</span>
            </span>
            <span className="font-mono text-brand-cyan">
              {Math.round((selectedLayer.opacity !== undefined ? selectedLayer.opacity : 1) * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.05}
              max={1.0}
              step={0.05}
              value={selectedLayer.opacity !== undefined ? selectedLayer.opacity : 1}
              onChange={(e) => onUpdateLayerOpacity?.(selectedLayer.id, parseFloat(e.target.value))}
              className="flex-1 accent-primary"
            />
            <button
              type="button"
              onClick={() => onUpdateLayerOpacity?.(selectedLayer.id, 1)}
              className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              title="Restablecer al 100%"
            >
              100%
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 pt-1">
            {[0.25, 0.5, 0.75, 1.0].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onUpdateLayerOpacity?.(selectedLayer.id, val)}
                className={`rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                  Math.abs((selectedLayer.opacity !== undefined ? selectedLayer.opacity : 1) - val) < 0.04
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {Math.round(val * 100)}%
              </button>
            ))}
          </div>
        </div>

        {/* 8. SOMBRAS Y RESPLANDORES (SHADOW PRESETS) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Sparkles className="size-3.5 text-accent" />
              <span>Sombras y Resplandores</span>
            </span>
            <span className="font-mono text-brand-cyan text-[11px] capitalize">
              {selectedLayer.shadowPreset ?? 'Ninguna'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
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
                className={`rounded-lg py-1.5 text-[10px] font-bold border transition-all ${
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

        {/* 9. BORDES Y ESQUINAS (STROKE & CORNER RADIUS) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <BoxSelect className="size-3.5 text-brand-cyan" />
              <span>Bordes y Redondeo</span>
            </span>
          </div>

          {/* RADIO DE ESQUINA */}
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Radio de Esquinas</span>
              <span className="font-mono text-slate-200">{selectedLayer.borderRadius ?? 0}px</span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[0, 8, 16, 24, 9999].map((rad) => (
                <button
                  key={rad}
                  type="button"
                  onClick={() => onUpdateLayerBorder?.(selectedLayer.id, { borderRadius: rad })}
                  className={`rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                    (selectedLayer.borderRadius ?? 0) === rad
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {rad === 9999 ? 'Pill' : `${rad}px`}
                </button>
              ))}
            </div>
          </div>

          {/* GROSOR DE BORDE */}
          <div className="pt-2 border-t border-slate-900 space-y-1 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Grosor de Borde</span>
              <span className="font-mono text-slate-200">{selectedLayer.borderWidth ?? 0}px</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[0, 1, 2, 4].map((bw) => (
                <button
                  key={bw}
                  type="button"
                  onClick={() => onUpdateLayerBorder?.(selectedLayer.id, { borderWidth: bw, borderColor: selectedLayer.borderColor ?? '#94D2BD' })}
                  className={`rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                    (selectedLayer.borderWidth ?? 0) === bw
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {bw === 0 ? 'Sin borde' : `${bw}px`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. EDITORES ESPECÍFICOS SEGÚN TIPO DE BLOQUE */}

        {/* A. SUBCAPA: HOOK ALERT BADGE */}
        {selectedLayer.blockType === 'HookAlertBadge' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Texto del Badge</label>
              <input
                type="text"
                value={String(props.badge ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { badge: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* B. SUBCAPA: ADVISOR AVATAR BADGE */}
        {selectedLayer.blockType === 'AdvisorAvatarBadge' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre</label>
              <input
                type="text"
                value={String(props.name ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { name: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cargo / Especialidad</label>
              <input
                type="text"
                value={String(props.role ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { role: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Foto de Asesor/a</label>
              <div className="grid grid-cols-3 gap-2">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => onUpdateLayerProps(selectedLayer.id, { avatarUrl: opt.url, name: opt.name })}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 text-center transition-all ${
                      props.avatarUrl === opt.url
                        ? 'border-brand-cyan bg-primary/20 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img src={opt.url} alt={opt.name} className="size-10 rounded-full object-cover shadow-sm" />
                    <span className="text-[10px] font-bold">{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* C. SUBCAPA: ADVISOR QUOTE BOX */}
        {selectedLayer.blockType === 'AdvisorQuoteBox' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cita / Mensaje</label>
              <textarea
                value={String(props.message ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { message: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* D. SUBCAPA: WHATSAPP CTA BUTTON */}
        {selectedLayer.blockType === 'WhatsAppCtaButton' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Texto del Botón CTA</label>
              <input
                type="text"
                value={String(props.whatsAppText ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { whatsAppText: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* E. SUBCAPA: PROVIDER GRID HEADER */}
        {selectedLayer.blockType === 'ProviderGridHeader' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título de Parrilla</label>
              <input
                type="text"
                value={String(props.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subtítulo</label>
              <input
                type="text"
                value={String(props.subtitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { subtitle: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* F. SUBCAPA: PROVIDER BADGE */}
        {selectedLayer.blockType === 'ProviderBadge' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre de Aseguradora</label>
              <input
                type="text"
                value={String(props.name ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { name: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Etiqueta de Cobertura</label>
              <input
                type="text"
                value={String(props.badge ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { badge: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* G. SUBCAPA: TRUST BADGE TITLE & SUBTITLE */}
        {selectedLayer.blockType === 'TrustBadgeTitle' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título de Garantía</label>
              <input
                type="text"
                value={String(props.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {selectedLayer.blockType === 'TrustBadgeSubtitle' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subtítulo de Garantía</label>
              <textarea
                value={String(props.subtitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { subtitle: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* H. SUBCAPA: COMPARISON BOXES */}
        {selectedLayer.blockType === 'ComparisonWrongBox' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-1">Título (No Válido)</label>
              <input
                type="text"
                value={String(props.wrongOptionTitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { wrongOptionTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Descripción</label>
              <textarea
                value={String(props.wrongOptionDesc ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { wrongOptionDesc: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {selectedLayer.blockType === 'ComparisonCorrectBox' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Título (Válido)</label>
              <input
                type="text"
                value={String(props.correctOptionTitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { correctOptionTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Descripción</label>
              <textarea
                value={String(props.correctOptionDesc ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { correctOptionDesc: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* E. MOTIONADVISORCARD (COMPLETO) */}
        {selectedLayer.blockType === 'MotionAdvisorCard' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre</label>
              <input
                type="text"
                value={String(props.name ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { name: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cargo / Especialidad</label>
              <input
                type="text"
                value={String(props.role ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { role: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>

            {/* AVATAR SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Foto Asesora</label>
              <div className="flex items-center gap-2 mb-2">
                {avatarOptions.map((av) => (
                  <button
                    key={av.name}
                    type="button"
                    onClick={() => onUpdateLayerProps(selectedLayer.id, { avatarUrl: av.url, name: av.name })}
                    className={`size-10 rounded-full overflow-hidden border-2 transition-transform ${
                      props.avatarUrl === av.url ? 'border-brand-cyan ring-2 ring-brand-cyan/30 scale-105' : 'border-slate-700 opacity-60 hover:opacity-100'
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
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-[11px] text-slate-300 focus:border-primary focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Badge de Estado</label>
              <input
                type="text"
                value={String(props.badge ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { badge: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cita / Mensaje</label>
              <textarea
                value={String(props.message ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { message: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Texto Botón WhatsApp</label>
              <input
                type="text"
                value={String(props.whatsAppText ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { whatsAppText: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 2. MOTIONTRUSTBADGE */}
        {selectedLayer.blockType === 'MotionTrustBadge' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título</label>
              <input
                type="text"
                value={String(props.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subtítulo</label>
              <textarea
                value={String(props.subtitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { subtitle: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Highlight</label>
              <input
                type="text"
                value={String(props.highlight ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { highlight: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 3. MOTIONCOMPARISONCARD */}
        {selectedLayer.blockType === 'MotionComparisonCard' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título</label>
              <input
                type="text"
                value={String(props.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-1">Opción Incorrecta</label>
              <input
                type="text"
                value={String(props.wrongOptionTitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { wrongOptionTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Opción Correcta</label>
              <input
                type="text"
                value={String(props.correctOptionTitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { correctOptionTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 4. MOTIONPROVIDERGRID */}
        {selectedLayer.blockType === 'MotionProviderGrid' && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Título Principal</label>
              <input
                type="text"
                value={String(props.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Subtítulo</label>
              <input
                type="text"
                value={String(props.subtitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { subtitle: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 5. CAPAS DE TEXTO PERSONALIZADO (H1, H2, H3, P, BADGES) */}
        {(selectedLayer.type === 'text' || selectedLayer.blockType === 'CustomText') && (
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/90 p-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
                <Palette className="size-3.5" />
                <span>Propiedades de Tipografía</span>
              </span>
            </div>

            {/* CONTENIDO DEL TEXTO */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Contenido del Texto
              </label>
              <textarea
                value={String(props.text ?? selectedLayer.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { text: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-cyan focus:outline-none"
              />
            </div>

            {/* FAMILIA TIPOGRÁFICA Y PESO */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Fuente
                </label>
                <select
                  value={selectedLayer.fontFamily ?? 'Poppins, sans-serif'}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { fontFamily: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
                >
                  <option value="Poppins, sans-serif">Poppins (Display)</option>
                  <option value="Inter, sans-serif">Inter (Sans)</option>
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
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
                >
                  <option value="400">Regular (400)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">ExtraBold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
            </div>

            {/* TAMAÑO DE FUENTE */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>Tamaño de Letra</span>
                <span className="font-mono text-brand-cyan">{selectedLayer.fontSize ?? 24}px</span>
              </div>
              <input
                type="range"
                min={11}
                max={64}
                step={1}
                value={selectedLayer.fontSize ?? 24}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { fontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-teal-400"
              />
            </div>

            {/* PALETA DE COLORES RÁPIDOS */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Color del Texto
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
      </div>
    </ModuleContextPanel>
  );
};
