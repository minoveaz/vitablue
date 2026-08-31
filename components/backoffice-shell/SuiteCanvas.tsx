import React from 'react';
import type { SuiteCanvasMode } from './contracts/shell';
import {
  SUITE_CANVAS_GEOMETRY_CLASSES,
  SUITE_CANVAS_PADDING_CLASSES,
  SUITE_SHELL_MODE_PRESETS,
  type SuiteCanvasGeometryPreset,
} from './contracts/presets';

export interface SuiteCanvasProps {
  mode?: SuiteCanvasMode;
  geometryPreset?: SuiteCanvasGeometryPreset;
  scrollResetKey?: string;
  header?: React.ReactNode;
  toolbar?: React.ReactNode;
  localNav?: React.ReactNode;
  tabs?: React.ReactNode;
  contextAside?: React.ReactNode;
  aside?: React.ReactNode;
  asidePresentation?: 'inline' | 'drawer' | 'overlay';
  footer?: React.ReactNode;
  /** Keeps editor-only surfaces explicit and non-interactive on phones. */
  mobileSafeMode?: boolean;
  mobileSafeModeTitle?: string;
  mobileSafeModeDescription?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const SuiteCanvas: React.FC<SuiteCanvasProps> = ({
  mode = 'overview',
  geometryPreset,
  scrollResetKey,
  header,
  toolbar,
  localNav,
  tabs,
  contextAside,
  aside,
  asidePresentation = 'inline',
  footer,
  mobileSafeMode = false,
  mobileSafeModeTitle = 'Editor disponible en tablet y escritorio',
  mobileSafeModeDescription = 'Para editar esta creatividad, abre VitaBlue en una pantalla de al menos 768 px de ancho.',
  children,
  className = '',
  contentClassName = '',
}) => {
  const mobileSafeModeTitleId = React.useId();
  const activePreset = geometryPreset ?? SUITE_SHELL_MODE_PRESETS[mode].canvasGeometry;
  const geometryClass = SUITE_CANVAS_GEOMETRY_CLASSES[activePreset.geometry];
  const paddingClass = SUITE_CANVAS_PADDING_CLASSES[activePreset.padding];
  const isFullBleed =
    activePreset.geometry === 'full-bleed' ||
    activePreset.geometry === 'split' ||
    mode === 'workspace';

  return (
    <div
      key={scrollResetKey}
      className={`flex min-h-0 flex-1 flex-col ${isFullBleed ? 'h-full overflow-hidden' : 'overflow-y-auto hover-scrollbar'} ${className}`}
      data-canvas-mode={mode}
      data-visual-contract="creative-studio-canvas"
      role="region"
      aria-label="Suite canvas"
    >
      {mobileSafeMode && (
        <section
          className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 bg-slate-950 px-6 py-10 text-center md:hidden"
          aria-labelledby={mobileSafeModeTitleId}
        >
          <h1 id={mobileSafeModeTitleId} className="max-w-sm text-lg font-bold text-white">
            {mobileSafeModeTitle}
          </h1>
          <p className="max-w-sm text-sm leading-6 text-slate-300">{mobileSafeModeDescription}</p>
        </section>
      )}
      <div className={`${mobileSafeMode ? 'hidden md:flex' : 'flex'} min-h-0 flex-1 flex-col ${isFullBleed ? 'h-full overflow-hidden' : 'overflow-y-auto hover-scrollbar'}`}>
      {header && <div className="shrink-0">{header}</div>}
      {toolbar && (
        <div className={`shrink-0 border-b ${isFullBleed ? 'border-slate-800 bg-slate-900 px-4 py-1.5 text-white' : 'border-slate-200 bg-slate-50 px-5 py-2.5'}`}>
          {toolbar}
        </div>
      )}
      {localNav && <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-2">{localNav}</div>}
      {tabs && <div className="shrink-0 border-b border-slate-200 bg-white px-5">{tabs}</div>}

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {contextAside && (
          <aside
            className={`min-w-0 shrink-0 border-r overflow-y-auto hover-scrollbar ${
              isFullBleed ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
            }`}
            aria-label="Contexto izquierdo"
          >
            {contextAside}
          </aside>
        )}

        <main
          className={`min-w-0 flex flex-1 flex-col ${isFullBleed ? 'h-full overflow-hidden' : 'overflow-y-auto hover-scrollbar'} ${geometryClass} ${paddingClass} ${contentClassName}`}
          aria-label="Área de trabajo del editor"
        >
          {children}
        </main>

        {aside && (
          <aside
            className={`min-w-0 shrink-0 border-l overflow-hidden flex flex-col ${
              isFullBleed ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
            } ${
              asidePresentation === 'overlay'
                ? 'absolute inset-y-0 right-0 z-30 shadow-2xl w-[clamp(16rem,28vw,20rem)] lg:w-[clamp(18rem,24vw,24rem)]'
                : 'w-[min(20rem,28vw)]'
            }`}
            aria-label="Panel de inspección"
          >
            {aside}
          </aside>
        )}
      </div>

      {footer && (
        <footer
          className={`shrink-0 ${isFullBleed ? 'border-t-0' : 'border-t'} ${
            isFullBleed
              ? 'border-slate-800 bg-slate-900 p-0'
              : 'border-slate-200 bg-white px-5 py-3'
          }`}
        >
          {footer}
        </footer>
      )}
      </div>
    </div>
  );
};
