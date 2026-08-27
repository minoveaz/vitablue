import React from 'react';
import { Layers } from 'lucide-react';

export const ImageStageMultiSelection: React.FC<{ selectedLayerIds: string[]; onGroupSelectedLayers?: () => void }> = ({ selectedLayerIds, onGroupSelectedLayers }) => (
  <>
        {/* MULTI-SELECTION FLOATING ACTION BAR */}
        {selectedLayerIds.length > 1 && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-teal-500/40 bg-[#001219]/95 px-4 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-xl animate-fadeIn">
            <div className="flex items-center gap-1.5 text-brand-cyan">
              <Layers className="size-4" />
              <span>{selectedLayerIds.length} elementos seleccionados</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <button
              type="button"
              onClick={() => onGroupSelectedLayers?.()}
              className="flex items-center gap-1.5 rounded-lg bg-teal-900/60 px-2.5 py-1 text-[11px] font-bold text-brand-cyan hover:bg-teal-800 hover:text-white transition-colors"
              title="Agrupar elementos seleccionados (Cmd+G)"
            >
              <span>Agrupar</span>
              <kbd className="rounded bg-teal-950 px-1 py-0.5 font-mono text-[9px]">⌘G</kbd>
            </button>
          </div>
        )}


  </>
);
