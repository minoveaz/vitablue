import React, { useEffect } from 'react';

export type ContextualToolbarContext =
  | { kind: 'text'; layerId: string }
  | { kind: 'image'; layerId: string; slideIndex?: number }
  | { kind: 'shape'; layerId: string };

export interface ContextualToolbarProps {
  context: ContextualToolbarContext | null;
  children: React.ReactNode;
  onDismiss?: () => void;
}

export const ContextualToolbar: React.FC<ContextualToolbarProps> = ({ context, children, onDismiss }) => {
  useEffect(() => {
    if (!context || !onDismiss) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [context, onDismiss]);

  if (!context) return null;

  return (
    <div
      data-contextual-toolbar
      data-contextual-toolbar-kind={context.kind}
      data-contextual-toolbar-layer-id={context.layerId}
      className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-slate-900/95 px-3 py-2 text-white shadow-lg backdrop-blur-md"
      role="toolbar"
      aria-label={`Herramientas contextuales de ${context.kind === 'text' ? 'texto' : context.kind === 'image' ? 'imagen' : 'forma'}`}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-center gap-2">
        <div className="min-w-0 flex-1">{children}</div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            aria-label="Cerrar barra contextual"
            title="Cerrar barra contextual"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
