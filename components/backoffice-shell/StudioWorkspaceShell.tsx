import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PlatformHeader } from './PlatformHeader';

export interface StudioToolItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export interface StudioWorkspaceShellProps {
  suiteTitle?: string;
  tools: StudioToolItem[];
  activeToolId: string | null;
  onSelectTool: (toolId: string | null) => void;
  drawerTitle?: string;
  drawerContent?: React.ReactNode;
  toolbar?: React.ReactNode;
  contextualToolbar?: React.ReactNode;
  aside?: React.ReactNode;
  asideVisible?: boolean;
  overlay?: React.ReactNode;
  children: React.ReactNode;
}

export const StudioWorkspaceShell: React.FC<StudioWorkspaceShellProps> = ({
  suiteTitle = 'Creative Studio',
  tools,
  activeToolId,
  onSelectTool,
  drawerTitle,
  drawerContent,
  toolbar,
  contextualToolbar,
  aside,
  asideVisible = true,
  overlay,
  children,
}) => {
  const isDrawerOpen = activeToolId !== null && Boolean(drawerContent);

  const handleToolClick = (toolId: string) => {
    if (activeToolId === toolId) {
      onSelectTool(null); // Toggle off if already open
    } else {
      onSelectTool(toolId);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-950 text-slate-800 antialiased select-none">
      {/* 1. PLATFORM HEADER (TOP BAR DE PLATAFORMA) */}
      <PlatformHeader
        suiteTitle={suiteTitle}
        rightSlot={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Studio Engine v2</span>
            </span>
          </div>
        }
      />

      {/* 2. BODY PRINCIPAL: RAIL + FLYOUT DRAWER + CANVAS + ASIDE */}
      <div className="flex min-h-0 flex-1 flex-row overflow-hidden relative">
        {/* A. CREATIVE TOOL RAIL (ESTILO CANVA) */}
        <aside
          className="w-16 min-w-16 shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col items-center py-2.5 gap-1.5 z-20"
          aria-label="Herramientas creativas"
        >
          {tools.map((tool) => {
            const isActive = activeToolId === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleToolClick(tool.id)}
                className={`group relative flex flex-col items-center justify-center size-12 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary/20 text-brand-cyan border border-brand-cyan/40 shadow-xs ring-1 ring-brand-cyan/20'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white border border-transparent'
                }`}
                title={tool.label}
              >
                <div className="size-4 shrink-0 flex items-center justify-center">
                  {tool.icon}
                </div>
                <span className="mt-1 text-[9px] font-bold tracking-tight truncate max-w-[56px] px-0.5">
                  {tool.label}
                </span>

                {tool.badge !== undefined && (
                  <span
                    className={`absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full text-[8px] font-black ${
                      isActive
                        ? 'bg-brand-cyan text-slate-950'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {tool.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* B. CREATIVE FLYOUT DRAWER (380px - 410px) */}
        {isDrawerOpen && (
          <aside
            className="w-[360px] sm:w-[390px] md:w-[410px] min-w-[340px] shrink-0 border-r border-slate-800 bg-slate-900/98 flex flex-col min-h-0 overflow-hidden shadow-2xl z-10 animate-fadeIn"
            aria-label="Panel lateral de herramientas"
          >
            {/* CABECERA DEL DRAWER */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950">
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                {drawerTitle ?? tools.find((t) => t.id === activeToolId)?.label ?? 'Herramientas'}
              </span>
              <button
                type="button"
                onClick={() => onSelectTool(null)}
                className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title="Cerrar panel"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* CONTENIDO DEL DRAWER CON SCROLL */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar">
              {drawerContent}
            </div>
          </aside>
        )}

        {/* BOTÓN COLAPSADOR FLOTANTE / TOGGLE DRAWER (❮ / ❯) */}
        <button
          type="button"
          onClick={() => onSelectTool(isDrawerOpen ? null : tools[0]?.id ?? null)}
          className="absolute top-1/2 -translate-y-1/2 z-30 flex size-6 items-center justify-center rounded-r-lg border border-l-0 border-slate-700/60 bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 shadow-md backdrop-blur-md transition-all"
          style={{ left: isDrawerOpen ? 'calc(4rem + 390px)' : '4rem' }}
          title={isDrawerOpen ? 'Ocultar panel lateral (❮)' : 'Mostrar panel lateral (❯)'}
        >
          {isDrawerOpen ? <ChevronLeft className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </button>

        {/* C. MAIN WORKSPACE / CANVAS VIEWPORT */}
        <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#050B14]">
          {toolbar && (
            <div className="shrink-0 border-b border-slate-800/90 bg-slate-900/90 px-4 py-1.5 text-white relative z-40 backdrop-blur-md">
              {toolbar}
            </div>
          )}
          {contextualToolbar && (
            contextualToolbar
          )}

          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            <section className="min-w-0 flex-1 h-full overflow-hidden flex flex-col" aria-label="Lienzo de diseño">
              {children}
            </section>

            {/* D. ASIDE (INSPECTOR DE PROPIEDADES A LA DERECHA) */}
            {aside && (
              <aside
                className={`shrink-0 border-l border-slate-800 bg-slate-900 overflow-hidden flex flex-col shadow-2xl z-20 transition-[width,opacity] duration-200 ease-out ${
                  asideVisible ? 'w-80 lg:w-96 opacity-100' : 'w-0 opacity-0 pointer-events-none border-l-0'
                }`}
                aria-label="Panel de inspección"
                aria-hidden={!asideVisible}
              >
                {aside}
              </aside>
            )}
          </div>
        </main>
      </div>

      {overlay}
    </div>
  );
};
