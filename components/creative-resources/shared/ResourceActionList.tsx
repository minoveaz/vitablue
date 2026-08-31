import React from 'react';
import type { ResourceActionItem } from '../contracts/creativeResource';
import { ResourceEmptyState } from './ResourceStates';

export const ResourceActionList: React.FC<{ items: readonly ResourceActionItem[] }> = ({ items }) => {
  if (items.length === 0) return <ResourceEmptyState />;
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          onClick={item.onSelect}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {item.icon && <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-brand-cyan">{item.icon}</span>}
          <span className="min-w-0">
            <strong className="block truncate text-xs font-bold text-slate-100">{item.label}</strong>
            {item.description && <span className="mt-0.5 block text-[10px] leading-relaxed text-slate-400">{item.description}</span>}
          </span>
        </button>
      ))}
    </div>
  );
};

