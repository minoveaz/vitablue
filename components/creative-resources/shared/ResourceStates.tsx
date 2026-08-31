import React from 'react';
import { AlertTriangle, LoaderCircle, PackageOpen } from 'lucide-react';

export const ResourceLoadingState: React.FC<{ label?: string }> = ({ label = 'Cargando recursos…' }) => (
  <div role="status" aria-live="polite" className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-400">
    <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-brand-cyan" />
    {label}
  </div>
);

export const ResourceErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = 'No se pudieron cargar estos recursos.',
  onRetry,
}) => (
  <div role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-200">
    <div className="flex items-start gap-2">
      <AlertTriangle aria-hidden="true" className="size-4 shrink-0 text-rose-300" />
      <span>{message}</span>
    </div>
    {onRetry && (
      <button type="button" onClick={onRetry} className="mt-3 min-h-11 rounded-lg border border-rose-400/40 px-3 text-[10px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
        Reintentar
      </button>
    )}
  </div>
);

export const ResourceEmptyState: React.FC<{ title?: string; description?: string }> = ({
  title = 'No hay recursos',
  description = 'Cuando haya recursos disponibles aparecerán aquí.',
}) => (
  <div role="status" className="rounded-xl border border-dashed border-slate-700 p-6 text-center">
    <PackageOpen aria-hidden="true" className="mx-auto mb-2 size-5 text-slate-500" />
    <p className="text-xs font-semibold text-slate-300">{title}</p>
    <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{description}</p>
  </div>
);

