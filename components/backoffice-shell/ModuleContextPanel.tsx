import React from 'react';
import { X } from 'lucide-react';
import type { ModuleShellZoneWidth } from './contracts/shell';

export interface ModuleContextPanelProps {
  label?: string;
  width?: ModuleShellZoneWidth;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  onClose?: () => void;
  variant?: 'light' | 'dark';
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
  variant = 'light',
  children,
  className = '',
}) => {
  const isDark = variant === 'dark';

  return (
    <div
      className={`flex h-full min-h-0 flex-col border-l ${
        isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'
      } ${widthClasses[width]} ${className}`}
    >
      <div
        className={`flex shrink-0 items-center justify-between border-b px-4 py-3 ${
          isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
        }`}
      >
        <span
          className={`text-[11px] font-black uppercase tracking-wider ${
            isDark ? 'text-slate-200' : 'text-slate-700'
          }`}
        >
          {label}
        </span>
        <div className="flex items-center gap-2">
          {headerSlot}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`flex size-6 items-center justify-center rounded-md transition-colors ${
                isDark
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
              }`}
              aria-label="Cerrar panel de contexto"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      {footerSlot && (
        <div
          className={`shrink-0 border-t p-3 ${
            isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
          }`}
        >
          {footerSlot}
        </div>
      )}
    </div>
  );
};
