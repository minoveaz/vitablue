import React from 'react';
import type { BackofficeShellProps } from './types';

const BackofficeShell: React.FC<BackofficeShellProps> = ({
  children,
  navigation,
  header,
  context,
  overlay,
  mode = 'standard',
  contextOpen = false,
}) => (
  <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
    <div className="flex min-h-0 flex-1 flex-row">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-900 text-white lg:flex lg:flex-col" aria-label="Navegación de suite">
        {navigation}
      </aside>
      <main className={`flex min-w-0 flex-1 flex-col ${mode === 'full-bleed' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <header className="shrink-0 border-b border-slate-200 bg-white">
          {header}
        </header>
        <div className="relative flex min-h-0 flex-1">
          <section className="min-w-0 flex-1">{children}</section>
          {contextOpen && context && (
            <aside className="absolute inset-y-0 right-0 z-20 w-full max-w-sm overflow-y-auto border-l border-slate-200 bg-white shadow-xl lg:static lg:w-80" aria-label="Contexto del módulo">
              {context}
            </aside>
          )}
        </div>
      </main>
    </div>
    {overlay}
  </div>
);

export default BackofficeShell;
