import React, { useState } from 'react';
import { Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/atoms/Logo';
import type { BackofficeShellProps } from './types';

const BackofficeShell: React.FC<BackofficeShellProps> = ({
  children,
  navigation,
  header,
  context,
  overlay,
  mode = 'standard',
  contextOpen = false,
  navigationMode = 'expanded',
  onNavigationModeChange,
}) => {
  const [internalNavigationMode, setInternalNavigationMode] = useState(navigationMode);
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
  const activeNavigationMode = onNavigationModeChange ? navigationMode : internalNavigationMode;
  const isNavigationHidden = activeNavigationMode === 'hidden';
  const isNavigationRail = activeNavigationMode === 'rail';
  const nextNavigationMode = isNavigationRail ? 'expanded' : 'rail';
  const handleNavigationModeChange = (nextMode: 'expanded' | 'rail') => {
    setInternalNavigationMode(nextMode);
    onNavigationModeChange?.(nextMode);
  };

  return (
  <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800">
    <header className="flex min-h-14 shrink-0 items-center gap-2 border-b border-slate-800 bg-slate-950 px-3 text-white md:gap-3 md:px-5" aria-label="Platform header">
      <button
        type="button"
        className="flex size-9 shrink-0 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden"
        aria-label="Abrir navegación del backoffice"
        aria-expanded={isMobileNavigationOpen}
        onClick={() => setIsMobileNavigationOpen(true)}
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link to="/backoffice" className="flex items-center gap-3" aria-label="Ir al inicio del backoffice">
          <Logo iconSize={28} showText={false} showTagline={false} variant="colored-on-dark" />
        </Link>
      </div>
      <div className="hidden min-w-0 flex-1 items-center justify-center md:flex" aria-label="Contexto de plataforma">
        <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">VitaBlue OS</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1 md:gap-2">
        <span className="hidden text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:inline">Platform shell</span>
      </div>
    </header>
    <div className="flex min-h-0 flex-1 flex-row">
      {isMobileNavigationOpen && !isNavigationHidden && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          aria-label="Cerrar navegación del backoffice"
          onClick={() => setIsMobileNavigationOpen(false)}
        />
      )}
      <aside className={`${isNavigationHidden ? 'hidden' : isMobileNavigationOpen ? 'fixed inset-y-0 left-0 z-40 flex w-[min(84vw,20rem)] min-w-0 flex-col' : 'hidden'} ${!isMobileNavigationOpen && !isNavigationHidden ? (isNavigationRail ? 'w-16 min-w-16' : 'w-64 min-w-64') : ''} shrink-0 overflow-hidden border-r-0 border-slate-200 bg-slate-900 text-white lg:static lg:flex lg:flex-col lg:border-r`} aria-label="Suite sidebar">
        <div className="border-b border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className={isNavigationRail ? 'sr-only' : ''}>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Suite</span>
              <p className="mt-1 text-sm font-bold text-white">Marketing Studio</p>
            </div>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
              aria-label="Cerrar navegación del backoffice"
              onClick={() => setIsMobileNavigationOpen(false)}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className={`${isNavigationRail ? '[&_a]:justify-center [&_a]:px-0 [&_a>span]:hidden' : ''} min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto`}>{navigation}</div>
        {!isNavigationHidden && (
          <button
            type="button"
            className="flex min-h-11 shrink-0 items-center justify-center gap-2 border-t border-slate-800 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label={isMobileNavigationOpen ? 'Cerrar navegación del backoffice' : isNavigationRail ? 'Expandir navegación de suite' : 'Contraer navegación de suite'}
            onClick={() => isMobileNavigationOpen ? setIsMobileNavigationOpen(false) : handleNavigationModeChange(nextNavigationMode)}
          >
            {isMobileNavigationOpen ? <X className="size-4" aria-hidden="true" /> : isNavigationRail ? <PanelLeftOpen className="size-4" aria-hidden="true" /> : <PanelLeftClose className="size-4" aria-hidden="true" />}
            <span className={isNavigationRail ? 'sr-only' : ''}>{isMobileNavigationOpen ? 'Cerrar menú' : isNavigationRail ? 'Expandir' : 'Contraer sidebar'}</span>
          </button>
        )}
      </aside>
      <main className={`flex min-w-0 flex-1 flex-col overflow-x-hidden ${mode === 'full-bleed' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div className="border-b border-slate-200 bg-white" aria-label="Module header">
          {header}
        </div>
        <div className="relative flex min-h-0 flex-1">
          <section className="min-w-0 flex-1" aria-label="Suite canvas">{children}</section>
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
};

export default BackofficeShell;
