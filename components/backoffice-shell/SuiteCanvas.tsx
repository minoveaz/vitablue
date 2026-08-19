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
  children,
  className = '',
  contentClassName = '',
}) => {
  const activePreset = geometryPreset ?? SUITE_SHELL_MODE_PRESETS[mode].canvasGeometry;
  const geometryClass = SUITE_CANVAS_GEOMETRY_CLASSES[activePreset.geometry];
  const paddingClass = SUITE_CANVAS_PADDING_CLASSES[activePreset.padding];
  const isFullBleed = activePreset.geometry === 'full-bleed' || activePreset.geometry === 'split';

  return (
    <div
      key={scrollResetKey}
      className={`flex min-h-0 flex-1 flex-col ${isFullBleed ? 'h-full overflow-hidden' : 'overflow-y-auto'} ${className}`}
      data-canvas-mode={mode}
      aria-label="Suite canvas"
    >
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
            className={`shrink-0 border-r overflow-y-auto ${
              isFullBleed ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
            }`}
            aria-label="Contexto izquierdo"
          >
            {contextAside}
          </aside>
        )}

        <main
          className={`min-w-0 flex-1 ${isFullBleed ? 'h-full overflow-hidden' : 'overflow-y-auto'} ${geometryClass} ${paddingClass} ${contentClassName}`}
        >
          {children}
        </main>

        {aside && (
          <aside
            className={`shrink-0 border-l overflow-y-auto ${
              isFullBleed ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
            } ${
              asidePresentation === 'overlay'
                ? 'absolute inset-y-0 right-0 z-30 shadow-2xl w-80 lg:w-96'
                : 'w-72 lg:w-80'
            }`}
            aria-label="Panel de inspección"
          >
            {aside}
          </aside>
        )}
      </div>

      {footer && <footer className="shrink-0 border-t border-slate-200 bg-white px-5 py-3">{footer}</footer>}
    </div>
  );
};
