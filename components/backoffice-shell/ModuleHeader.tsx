import React from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export type ModuleHeaderState = 'saved' | 'saving' | 'unsaved' | 'error';

export interface ModuleHeaderBreadcrumb {
  label: string;
  href?: string;
}

export interface ModuleHeaderProps {
  title: string;
  eyebrow?: string;
  breadcrumbs?: Array<string | ModuleHeaderBreadcrumb>;
  state?: ModuleHeaderState;
  stateLabel?: string;
  rightSlot?: React.ReactNode;
  actionsSlot?: React.ReactNode;
  showState?: boolean;
  className?: string;
}

export const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  title,
  eyebrow,
  breadcrumbs = [],
  state = 'saved',
  stateLabel,
  rightSlot,
  actionsSlot,
  showState = true,
  className = '',
}) => {
  const actions = rightSlot ?? actionsSlot;

  const renderStateBadge = () => {
    switch (state) {
      case 'saving':
        return (
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-[10px] font-bold text-amber-700">
            <Loader2 className="size-3 animate-spin" aria-hidden="true" />
            <span>{stateLabel ?? 'Guardando cambios...'}</span>
          </div>
        );
      case 'unsaved':
        return (
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600">
            <span className="size-2 rounded-full bg-amber-500" />
            <span>{stateLabel ?? 'Cambios sin guardar'}</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold text-red-600">
            <AlertCircle className="size-3" aria-hidden="true" />
            <span>{stateLabel ?? 'Error al guardar'}</span>
          </div>
        );
      case 'saved':
      default:
        return (
          <div className="flex items-center gap-1.5 rounded-lg border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1.5 text-[10px] font-bold text-primary">
            <Check className="size-3" aria-hidden="true" />
            <span>{stateLabel ?? 'Guardado'}</span>
          </div>
        );
    }
  };

  return (
    <header className={`flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3 md:px-8 ${className}`} aria-label="Module header">
      <div className="min-w-0 flex-1">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Migas de pan" className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              const isObject = typeof crumb === 'object' && crumb !== null;
              const label = isObject ? crumb.label : crumb;
              const href = isObject ? crumb.href : undefined;

              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="opacity-40">/</span>}
                  {href && !isLast ? (
                    <Link to={href} className="transition-colors hover:text-primary">
                      {label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'font-bold text-slate-700' : ''}>{label}</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}
        <div className="flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          <span className="text-[10px] font-black uppercase tracking-wider text-primary">
            {eyebrow ?? 'Módulo'}
          </span>
        </div>
        <h1 className="mt-0.5 text-h2 font-black text-slate-800">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {showState && renderStateBadge()}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};
