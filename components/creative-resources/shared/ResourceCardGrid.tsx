import React from 'react';
import { LockKeyhole, Plus } from 'lucide-react';
import type { ResourceActionItem } from '../contracts/creativeResource';
import type { CoreResourceItem } from './resourceData';
import { ResourceEmptyState } from './ResourceStates';

export const ResourceCardGrid: React.FC<{
  items: readonly CoreResourceItem[];
  onInsert?: (item: CoreResourceItem) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  columns?: 1 | 2;
}> = ({ items, onInsert, emptyTitle, emptyDescription, columns = 2 }) => {
  if (items.length === 0) {
    return <ResourceEmptyState title={emptyTitle ?? 'No se encontraron recursos'} description={emptyDescription ?? 'Prueba otra búsqueda o categoría.'} />;
  }
  return (
    <div className={`grid gap-2.5 ${columns === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {items.map((item) => {
        const disabled = item.disabled || item.locked || !onInsert;
        return (
          <article key={item.id} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/70 transition-colors hover:border-brand-cyan/60">
            <div className="flex min-h-20 items-center justify-center overflow-hidden border-b border-slate-800/80 bg-slate-950/80 p-3 text-center">
              {item.src ? <img src={item.src} alt="" className="size-full max-h-28 object-cover" loading="lazy" /> : (
                <span className="line-clamp-3 text-sm font-semibold text-slate-200" aria-label={item.preview ?? item.label}>{item.preview ?? item.label}</span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3">
              <div className="min-w-0">
                <h3 className="truncate text-xs font-semibold text-slate-100" title={item.label}>{item.label}</h3>
                {item.description && <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-slate-400">{item.description}</p>}
              </div>
              {(item.metadata?.length || item.kind) && (
                <div className="flex flex-wrap gap-1">
                  {item.kind && <span className="rounded-md bg-primary/30 px-1.5 py-0.5 text-[9px] text-brand-cyan">{item.kind}</span>}
                  {item.metadata?.map((value) => <span key={value} className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-300">{value}</span>)}
                </div>
              )}
              <button type="button" onClick={() => onInsert?.(item)} disabled={disabled} title={disabled ? item.disabledReason ?? 'No disponible en este estudio' : 'Insertar'} className="mt-auto flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-50">
                {disabled ? <LockKeyhole className="size-3.5" /> : <Plus className="size-3.5" />}
                {disabled ? 'No disponible' : 'Insertar'}
              </button>
              {disabled && item.disabledReason && <p className="text-[9px] leading-relaxed text-amber-200/80">{item.disabledReason}</p>}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export const toResourceActionItems = (items: readonly CoreResourceItem[], onInsert?: (item: CoreResourceItem) => void): ResourceActionItem[] =>
  items.map((item) => ({ id: item.id, label: item.label, description: item.description, disabled: item.disabled || item.locked || !onInsert, onSelect: onInsert ? () => onInsert(item) : undefined }));
