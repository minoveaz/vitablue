import React from 'react';
import { PanelLeftClose } from 'lucide-react';
import type { ModuleShellZoneWidth } from './contracts/shell';

export interface ModuleContextSidebarProps {
  label?: string;
  width?: ModuleShellZoneWidth;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  onCollapse?: () => void;
  variant?: 'light' | 'dark';
  children: React.ReactNode;
  className?: string;
}

const widthClasses: Record<ModuleShellZoneWidth, string> = {
  narrow: 'w-48 lg:w-56',
  standard: 'w-56 lg:w-64',
  wide: 'w-64 lg:w-80',
  'extra-wide': 'w-80 lg:w-96',
};

export const ModuleContextSidebar: React.FC<ModuleContextSidebarProps> = ({
  label,
  width = 'standard',
  headerSlot,
  footerSlot,
  onCollapse,
  variant = 'light',
  children,
  className = '',
}) => {
  const isDark = variant === 'dark';

  return (
    <div
      role="complementary"
      aria-label={label ?? 'Panel contextual'}
      className={`flex h-full min-h-0 min-w-0 flex-col border-r ${
        isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 text-slate-800'
      } ${widthClasses[width]} ${className}`}
    >
      {(label || headerSlot || onCollapse) && (
        <div
          className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${
            isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
          }`}
        >
          {label && (
            <span
              className={`text-[11px] font-black uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {label}
            </span>
          )}
          <div className="flex items-center gap-2">
            {headerSlot}
            {onCollapse && (
              <button
                type="button"
                onClick={onCollapse}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
                  isDark
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                }`}
                title="Contraer panel contextual"
                aria-label="Contraer panel contextual"
              >
                <PanelLeftClose className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      {footerSlot && (
        <div
          className={`shrink-0 border-t p-3 ${
            isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
          }`}
        >
          {footerSlot}
        </div>
      )}
    </div>
  );
};
