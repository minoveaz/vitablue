import React from 'react';
import { X } from 'lucide-react';
import type { ModuleShellZoneWidth } from './contracts/shell';

export interface ModuleContextPanelProps {
  label?: string;
  width?: ModuleShellZoneWidth;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

const widthClasses: Record<ModuleShellZoneWidth, string> = {
  narrow: 'w-64 lg:w-72',
  standard: 'w-72 lg:w-80',
  wide: 'w-80 lg:w-96',
  'extra-wide': 'w-96 lg:w-full lg:max-w-md',
};

export const ModuleContextPanel: React.FC<ModuleContextPanelProps> = ({
  label = 'Propiedades',
  width = 'standard',
  headerSlot,
  footerSlot,
  onClose,
  children,
  className = '',
}) => {
  return (
    <div className={`flex h-full min-h-0 flex-col border-l border-slate-200 bg-white ${widthClasses[width]} ${className}`}>
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 bg-slate-50">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">{label}</span>
        <div className="flex items-center gap-2">
          {headerSlot}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex size-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              aria-label="Cerrar panel de contexto"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      {footerSlot && (
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 p-3">{footerSlot}</div>
      )}
    </div>
  );
};
