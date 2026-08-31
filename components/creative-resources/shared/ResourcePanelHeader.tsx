import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ResourcePanelHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export const ResourcePanelHeader: React.FC<ResourcePanelHeaderProps> = ({
  title,
  description,
  icon: Icon,
  action,
}) => (
  <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3" data-resource-header>
    <div className="flex min-w-0 items-start gap-2">
      {Icon && <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-cyan" />}
      <div className="min-w-0">
        <h2 className="truncate text-xs font-bold text-slate-100">{title}</h2>
        {description && <p className="mt-1 text-[10px] leading-relaxed text-slate-400">{description}</p>}
      </div>
    </div>
    {action}
  </header>
);

