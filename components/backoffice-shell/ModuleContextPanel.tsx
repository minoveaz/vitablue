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

export const ModuleContextPanel: React.FC<ModuleContextPanelProps> = ({
  label = 'Propiedades',
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
      className={`flex h-full w-full min-h-0 flex-col ${
        isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
      } ${className}`}
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
              className={`flex size-7 items-center justify-center rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
              }`}
              aria-label="Cerrar panel de contexto"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">{children}</div>
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
