import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ResourceTab {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  disabled?: boolean;
  panelId?: string;
}

export interface ResourceTabsProps {
  tabs: readonly ResourceTab[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}

export const ResourceTabs: React.FC<ResourceTabsProps> = ({
  tabs,
  value,
  onChange,
  ariaLabel = 'Secciones de recursos creativos',
}) => (
  <div role="tablist" aria-label={ariaLabel} className="flex flex-wrap gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
    {tabs.map(({ id, label, icon: Icon, badge, disabled, panelId }) => (
      <button
        key={id}
        type="button"
        role="tab"
        aria-selected={value === id}
        aria-controls={panelId ?? `creative-resource-panel-${id}`}
        disabled={disabled}
        onClick={() => onChange(id)}
        className={`flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
          value === id
            ? 'border-brand-cyan/50 bg-primary/25 text-brand-cyan'
            : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
        } disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {Icon && <Icon aria-hidden="true" className="size-3.5 shrink-0" />}
        <span className="truncate">{label}</span>
        {badge !== undefined && (
          <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-black leading-none text-primary-dark">
            {badge}
          </span>
        )}
      </button>
    ))}
  </div>
);
