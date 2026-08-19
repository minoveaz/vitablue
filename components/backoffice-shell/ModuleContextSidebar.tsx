import React from 'react';
import { PanelLeftClose } from 'lucide-react';
import type { ModuleShellZoneWidth } from './contracts/shell';

export interface ModuleContextSidebarProps {
  label?: string;
  width?: ModuleShellZoneWidth;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  onCollapse?: () => void;
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
  children,
  className = '',
}) => {
  return (
    <div className={`flex h-full min-h-0 flex-col border-r border-slate-200 bg-slate-50 ${widthClasses[width]} ${className}`}>
      {(label || headerSlot || onCollapse) && (
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 bg-white">
          {label && <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">{label}</span>}
          <div className="flex items-center gap-2">
            {headerSlot}
            {onCollapse && (
              <button
                type="button"
                onClick={onCollapse}
                className="flex size-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
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
        <div className="shrink-0 border-t border-slate-200 bg-white p-3">{footerSlot}</div>
      )}
    </div>
  );
};
