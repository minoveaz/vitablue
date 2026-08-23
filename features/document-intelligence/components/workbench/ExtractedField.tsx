import React from 'react';
import { Clipboard, X } from 'lucide-react';
import type { FieldKey } from '../../fieldLabels';

export const ExtractedField: React.FC<{
  label: string;
  fieldKey: FieldKey;
  value: string | null | undefined;
  rawVal: string | null | undefined;
  issue?: string;
  isMonospace?: boolean;
  isCritical?: boolean;
  placeholder?: string;
  isHighlighted?: boolean;
  onHighlight?: (key: FieldKey | null) => void;
  onChange: (key: FieldKey, value: string | null) => void;
  onCopy: (value: string | null | undefined, label: string) => void;
  onRestore: (key: FieldKey) => void;
  className?: string;
}> = ({
  label,
  fieldKey,
  value,
  rawVal,
  issue,
  isMonospace,
  isCritical,
  placeholder,
  isHighlighted,
  onHighlight,
  onChange,
  onCopy,
  onRestore,
  className = '',
}) => {
  const isModified = value !== rawVal;
  const hasIssue = Boolean(issue);

  return (
    <div
      className={`min-w-0 flex flex-col transition-all duration-150 ${className}`}
      onMouseEnter={() => onHighlight?.(fieldKey)}
      onMouseLeave={() => onHighlight?.(null)}
    >
      <div className="flex items-center justify-between pb-1">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
            isHighlighted ? 'text-cyan-600 font-black' : 'text-slate-500'
          }`}
        >
          {label}
        </span>
        {hasIssue ? (
          <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold">
            <X className="size-3" /> Formato no válido
          </span>
        ) : null}
      </div>

      <div className="group relative flex min-w-0 items-center">
        <input
          id={`field-input-${fieldKey}`}
          value={value ?? ''}
          placeholder={
            placeholder ??
            (['birthDate', 'issueDate', 'expiryDate'].includes(fieldKey)
              ? 'DD/MM/AAAA'
              : undefined)
          }
          onFocus={() => onHighlight?.(fieldKey)}
          onBlur={() => onHighlight?.(null)}
          onChange={(event) => onChange(fieldKey, event.target.value || null)}
          className={`w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-all pr-8 ${
            isCritical
              ? 'font-mono font-bold text-slate-900 bg-slate-50/50 text-[15px]'
              : isMonospace
                ? 'font-mono text-xs tracking-wider'
                : 'text-slate-800'
          } ${
            hasIssue
              ? 'border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : isHighlighted
                ? 'border-cyan-400 bg-cyan-50/30 ring-2 ring-cyan-200 shadow-xs'
                : isModified
                  ? 'border-sky-400 bg-sky-50/20 focus:border-sky-500 focus:ring-2 focus:ring-sky-200'
                  : 'border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
          }`}
        />

        <button
          type="button"
          aria-label={`Copiar ${label}`}
          title={`Copiar ${label}`}
          onClick={() => onCopy(value, label)}
          className="absolute right-1.5 flex size-7 items-center justify-center rounded text-slate-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-slate-100 hover:text-primary transition-all"
        >
          <Clipboard className="size-3.5" />
        </button>
      </div>

      {isModified && (
        <div className="mt-1 flex items-center justify-between rounded bg-sky-50 px-2 py-0.5 text-[10px] text-slate-600">
          <span className="truncate">
            ↺ Modificado (Original:{' '}
            <span className="font-semibold text-slate-800">{rawVal ?? 'vacío'}</span>)
          </span>
          <button
            type="button"
            onClick={() => onRestore(fieldKey)}
            className="ml-2 shrink-0 font-bold text-primary hover:text-primary-dark underline"
          >
            Restaurar
          </button>
        </div>
      )}
    </div>
  );
};
