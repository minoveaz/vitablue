import React from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Eye,
  EyeOff,
  Lock,
  Trash2,
  Unlock,
} from 'lucide-react';
import { StudioInspectorPanel } from '../../backoffice-shell/primitives';
import {
  studioInspectorControlClass as controlClass,
  studioInspectorIconButtonClass as iconButtonClass,
} from './studioInspectorStyles';

export type StudioInspectorControl =
  | {
      kind: 'text' | 'textarea' | 'number' | 'range' | 'select' | 'color';
      label: string;
      value: string | number;
      onChange: (value: string | number) => void;
      options?: readonly { value: string; label: string }[];
      min?: number;
      max?: number;
      step?: number;
      rows?: number;
      help?: string;
    }
  | {
      kind: 'button';
      label: string;
      onClick: () => void;
      tone?: 'default' | 'danger' | 'accent';
    }
  | {
      kind: 'info';
      label: string;
      value: React.ReactNode;
    };

export interface StudioInspectorSection {
  id: string;
  title: string;
  controls: readonly StudioInspectorControl[];
}

export interface StudioInspectorLayer {
  id: string;
  title: string;
  type: string;
  visible?: boolean;
  locked?: boolean;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  supportsTransform?: boolean;
  onUpdate: (patch: Record<string, unknown>) => void;
  onToggleVisibility?: () => void;
  onToggleLock?: () => void;
  onRemove?: () => void;
}

export interface StudioInspectorProps {
  title?: string;
  as?: 'aside' | 'div';
  width?: 'narrow' | 'standard' | 'wide' | 'extra-wide';
  variant?: 'dark' | 'light';
  onClose?: () => void;
  error?: string;
  onRetry?: () => void;
  layer?: StudioInspectorLayer;
  sections?: readonly StudioInspectorSection[];
  warnings?: readonly string[];
  emptyStateMessage?: string;
  emptyState?: React.ReactNode;
  children?: React.ReactNode;
}

const InspectorNotice: React.FC<{
  error?: string;
  onRetry?: () => void;
  warnings?: readonly string[];
}> = ({ error, onRetry, warnings = [] }) => (
  <>
    {error && (
      <div role="alert" className="flex items-start gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-[11px] leading-relaxed text-rose-200">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-rose-300">No se pudo renderizar el vídeo</p>
          <p>{error}</p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="mt-2 min-h-11 rounded-lg border border-rose-400/40 px-2 py-1 text-[10px] font-bold text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
              Reintentar
            </button>
          )}
        </div>
      </div>
    )}
    {warnings.length > 0 && (
      <div role="alert" className="space-y-1.5 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300">
        <p className="font-bold text-amber-400">Advertencias de escena:</p>
        {warnings.map((warning) => <p key={warning} className="text-[11px] leading-relaxed text-amber-200">• {warning}</p>)}
      </div>
    )}
  </>
);

const renderControl = (control: StudioInspectorControl) => {
  if (control.kind === 'info') {
    return <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-xs text-slate-300">{control.value}</div>;
  }
  if (control.kind === 'button') {
    const tone = control.tone === 'danger'
      ? 'border-rose-500/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
      : control.tone === 'accent'
        ? 'border-primary/40 bg-primary/20 text-brand-cyan hover:bg-primary/30'
        : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white';
    return <button type="button" onClick={control.onClick} className={`min-h-11 w-full rounded-xl border px-2.5 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${tone}`}>{control.label}</button>;
  }
  const common = {
    className: controlClass,
    value: control.value,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = control.kind === 'number' || control.kind === 'range' ? Number(event.target.value) : event.target.value;
      control.onChange(value);
    },
  };
  return control.kind === 'textarea' ? (
    <textarea {...common} rows={control.rows ?? 3} />
  ) : control.kind === 'select' ? (
    <select {...common}>{control.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
  ) : (
    <input
      {...common}
      type={control.kind === 'color' ? 'color' : control.kind === 'range' ? 'range' : control.kind === 'number' ? 'number' : 'text'}
      min={control.min}
      max={control.max}
      step={control.step}
    />
  );
};

const Section: React.FC<{ section: StudioInspectorSection }> = ({ section }) => (
  <section className="space-y-3 border-t border-slate-800 pt-3" aria-labelledby={`inspector-section-${section.id}`}>
    <h3 id={`inspector-section-${section.id}`} className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">{section.title}</h3>
    {section.controls.map((control, index) => (
      <div key={`${section.id}-${index}`} className="space-y-1">
        {control.kind !== 'button' && control.kind !== 'info' && <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{control.label}</label>}
        {renderControl(control)}
        {'help' in control && control.help && <p className="text-[9px] leading-relaxed text-slate-500">{control.help}</p>}
      </div>
    ))}
  </section>
);

const CommonLayerControls: React.FC<{ layer: StudioInspectorLayer }> = ({ layer }) => {
  const position = layer.position ?? { x: 50, y: 50 };
  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/20 text-xs font-bold uppercase text-brand-cyan">{layer.type[0]}</span>
          <strong className="truncate text-xs capitalize text-slate-200">{layer.title}</strong>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {layer.onToggleVisibility && <button type="button" onClick={layer.onToggleVisibility} aria-pressed={layer.visible !== false} aria-label={layer.visible === false ? 'Mostrar capa' : 'Ocultar capa'} className={iconButtonClass}>{layer.visible === false ? <EyeOff className="size-4 text-amber-400" /> : <Eye className="size-4" />}</button>}
          {layer.onToggleLock && <button type="button" onClick={layer.onToggleLock} aria-pressed={Boolean(layer.locked)} aria-label={layer.locked ? 'Desbloquear capa' : 'Bloquear capa'} className={iconButtonClass}>{layer.locked ? <Lock className="size-4 text-brand-cyan" /> : <Unlock className="size-4" />}</button>}
          {layer.onRemove && <button type="button" onClick={layer.onRemove} aria-label="Eliminar capa" className={`${iconButtonClass} hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-rose-300`}><Trash2 className="size-4" /></button>}
        </div>
      </div>
      {layer.locked && <div role="status" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] leading-relaxed text-amber-200">Capa protegida. Desbloquéala para cambiar sus propiedades.</div>}
      <fieldset disabled={Boolean(layer.locked)} className="min-w-0 space-y-4 disabled:cursor-not-allowed disabled:opacity-60">
        {layer.supportsTransform !== false && <section className="space-y-3" aria-labelledby="inspector-transform">
          <h3 id="inspector-transform" className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">Transformación y posición</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['x', 'y'] as const).map((axis) => (
              <label key={axis} className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Eje {axis.toUpperCase()}: {Math.round(position[axis])}%
                <input type="range" min={0} max={100} value={position[axis]} onChange={(event) => layer.onUpdate({ position: { ...position, [axis]: Number(event.target.value) } })} className="mt-1 w-full accent-primary" />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              ['Arriba', { x: 50, y: 15 }],
              ['Centro', { x: 50, y: 50 }],
              ['Abajo', { x: 50, y: 80 }],
            ].map(([label, value]) => <button key={String(label)} type="button" onClick={() => layer.onUpdate({ position: value })} className="min-h-11 flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] font-bold text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80">{String(label)}</button>)}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {layer.width !== undefined && <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ancho<input type="number" min={1} value={layer.width} onChange={(event) => layer.onUpdate({ width: Number(event.target.value) })} className={`${controlClass} mt-1`} /></label>}
            {layer.height !== undefined && <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Alto<input type="number" min={1} value={layer.height} onChange={(event) => layer.onUpdate({ height: Number(event.target.value) })} className={`${controlClass} mt-1`} /></label>}
          </div>
          {layer.rotation !== undefined && <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rotación: {Math.round(layer.rotation)}°<input type="range" min={-180} max={180} value={layer.rotation} onChange={(event) => layer.onUpdate({ rotation: Number(event.target.value) })} className="mt-1 w-full accent-primary" /></label>}
          {layer.opacity !== undefined && <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Opacidad: {Math.round(layer.opacity * 100)}%<input type="range" min={0} max={1} step={0.05} value={layer.opacity} onChange={(event) => layer.onUpdate({ opacity: Number(event.target.value) })} className="mt-1 w-full accent-primary" /></label>}
          {layer.type !== 'audio' && (
            <div className="flex flex-wrap gap-1.5">
              {[['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]].map(([align, Icon]) => <button key={String(align)} type="button" aria-label={`Alinear ${align}`} onClick={() => layer.onUpdate({ align })} className={`${iconButtonClass} flex-1`}><Icon className="size-4" /></button>)}
            </div>
          )}
        </section>}
      </fieldset>
    </>
  );
};

export const StudioInspector: React.FC<StudioInspectorProps> = ({
  title,
  as = 'div',
  width = 'standard',
  variant = 'dark',
  onClose,
  error,
  onRetry,
  layer,
  sections = [],
  warnings,
  emptyStateMessage,
  emptyState,
  children,
}) => (
  <StudioInspectorPanel as={as} title={title} width={width} variant={variant} onClose={onClose}>
    <div className={children ? '' : 'space-y-4'} data-creative-studio-region="inspector-content">
      <InspectorNotice error={error} onRetry={onRetry} warnings={warnings} />
      {layer ? <CommonLayerControls layer={layer} /> : emptyStateMessage ? <p className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 text-xs leading-relaxed text-slate-400">{emptyStateMessage}</p> : emptyState}
      {sections.length > 0 && <fieldset disabled={Boolean(layer?.locked)} className="min-w-0 space-y-4 disabled:cursor-not-allowed disabled:opacity-60">{sections.map((section) => <Section key={section.id} section={section} />)}</fieldset>}
      {children}
    </div>
  </StudioInspectorPanel>
);
