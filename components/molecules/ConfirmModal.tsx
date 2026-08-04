import React, { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import Button from '@/components/atoms/Button';

export type ConfirmModalVariant = 'confirm' | 'danger' | 'info';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  variant?: ConfirmModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  isBusy?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const variantIcon = {
  confirm: <CheckCircle2 className="h-6 w-6 text-brand-cyan" aria-hidden="true" />,
  danger: <AlertTriangle className="h-6 w-6 text-rose-600" aria-hidden="true" />,
  info: <Info className="h-6 w-6 text-primary" aria-hidden="true" />,
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  variant = 'confirm',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isBusy = false,
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    cancelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isBusy) onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isBusy, onCancel, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-primary-dark/60 p-4 backdrop-blur-sm sm:items-center" role="presentation">
      <button className="absolute inset-0 cursor-default" aria-label="Cerrar ventana" onClick={() => !isBusy && onCancel()} />
      <section
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby={description ? 'confirm-modal-description' : undefined}
      >
        <button
          ref={cancelRef}
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex items-start gap-3 pr-8">
          <div className="mt-0.5 shrink-0" aria-hidden="true">{variantIcon[variant]}</div>
          <div>
            <h2 id="confirm-modal-title" className="font-display text-lg font-bold text-text-main">{title}</h2>
            {description && <p id="confirm-modal-description" className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isBusy}>{cancelLabel}</Button>
          <Button type="button" variant={variant === 'danger' ? 'secondary' : 'primary'} onClick={onConfirm} disabled={isBusy} isLoading={isBusy}>{confirmLabel}</Button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmModal;
