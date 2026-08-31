import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

export const studioHubIconButtonClass =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

export interface StudioHubProjectCardProps {
  title: string;
  formatLabel: string;
  dimensionsLabel: string;
  detail: string;
  updatedAtLabel: string;
  preview: React.ReactNode;
  archived?: boolean;
  onOpen: () => void;
  actions?: React.ReactNode;
}

/**
 * Shared project-card chrome for both creative studios. The preview is supplied
 * by each studio so its content remains type-specific without drifting layout.
 */
export const StudioHubProjectCard: React.FC<StudioHubProjectCardProps> = ({
  title,
  formatLabel,
  dimensionsLabel,
  detail,
  updatedAtLabel,
  preview,
  archived = false,
  onOpen,
  actions,
}) => (
  <article className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
    <button
      type="button"
      onClick={onOpen}
      className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      {preview}
      <div className="mt-4 flex items-start justify-between gap-3">
        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-caption font-black uppercase text-slate-700">
          {formatLabel}
        </span>
        <span className="text-caption font-semibold text-slate-400">
          {dimensionsLabel}
        </span>
      </div>
      <div className="mt-3 flex items-start gap-2">
        <h3 className="min-w-0 flex-1 line-clamp-2 text-h3 text-slate-900 transition-colors group-hover:text-primary" title={title}>
          {title}
        </h3>
        {archived && (
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-caption text-slate-500">
            Archivado
          </span>
        )}
      </div>
      <p className="mt-1 line-clamp-1 text-body-reg text-slate-500">{detail}</p>
    </button>

    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
      <span className="inline-flex items-center gap-1 text-caption font-bold text-slate-400">
        <Calendar className="size-3" aria-hidden="true" />
        {updatedAtLabel}
      </span>
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-caption font-black text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
        >
          Abrir Editor <ArrowRight className="size-3" aria-hidden="true" />
        </button>
        {actions}
      </div>
    </div>
  </article>
);
