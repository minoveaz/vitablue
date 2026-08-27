import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  FolderHeart,
  Sparkles,
  LayoutTemplate,
  Type,
  Plus,
  Trash2,
  Copy,
  Layers,
  X,
  ExternalLink,
} from 'lucide-react';
import { ImageLayer, ImageProject } from '../../../types/imageStudio';
import {
  IMAGE_PROJECTS_UPDATED_EVENT,
  getUserSavedImageProjects,
  duplicateStoredImageProject,
  deleteStoredImageProject,
} from '../../../utils/imageProjectStorage';
import {
  getSavedCustomElements,
  deleteSavedCustomElement,
} from '../../../utils/savedElementsStorage';

export interface ImageStudioMyDesignsDrawerProps {
  onLoadProject: (project: ImageProject) => void;
  onInsertSavedLayer: (layer: ImageLayer) => void;
}

export const ImageStudioMyDesignsDrawer: React.FC<ImageStudioMyDesignsDrawerProps> = ({
  onLoadProject,
  onInsertSavedLayer,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'projects' | 'blocks' | 'texts'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshTick, setRefreshTick] = useState<number>(0);

  const triggerRefresh = () => setRefreshTick((prev) => prev + 1);

  // Escuchar cambios reactivos cross-project
  useEffect(() => {
    const handleStorageUpdate = () => triggerRefresh();
    window.addEventListener(IMAGE_PROJECTS_UPDATED_EVENT, handleStorageUpdate);
    window.addEventListener('vitablue_saved_elements_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener(IMAGE_PROJECTS_UPDATED_EVENT, handleStorageUpdate);
      window.removeEventListener('vitablue_saved_elements_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  // Proyectos guardados exclusivamente por el usuario
  const storedProjects = useMemo(() => {
    return getUserSavedImageProjects();
  }, [refreshTick]);

  // Elementos / bloques guardados exclusivamente por el usuario
  const savedElements = useMemo(() => {
    return getSavedCustomElements();
  }, [refreshTick]);

  // Filtrado de proyectos
  const filteredProjects = useMemo(() => {
    return storedProjects.filter((p) => {
      if (activeSubTab === 'blocks' || activeSubTab === 'texts') return false;
      return (
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.preset.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [storedProjects, activeSubTab, searchQuery]);

  // Filtrado de elementos
  const filteredElements = useMemo(() => {
    return savedElements.filter((elem) => {
      if (activeSubTab === 'projects') return false;
      if (activeSubTab === 'blocks' && elem.category !== 'card' && elem.category !== 'group' && elem.category !== 'shape') return false;
      if (activeSubTab === 'texts' && elem.category !== 'text') return false;

      return (
        searchQuery.trim() === '' ||
        elem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(elem.layer.props?.text ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [savedElements, activeSubTab, searchQuery]);

  const handleDuplicateProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateStoredImageProject(id);
    triggerRefresh();
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Seguro que deseas eliminar este proyecto de tus diseños?')) {
      deleteStoredImageProject(id);
      triggerRefresh();
    }
  };

  const handleDeleteElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedCustomElement(id);
    triggerRefresh();
  };

  const totalCount = storedProjects.length + savedElements.length;

  return (
    <div className="flex h-full flex-col text-white select-none">
      {/* 1. HEADER Y FILTROS RÁPIDOS */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-950 space-y-3 shrink-0">
        {/* BANNER INFORMATIVO */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-r from-primary/20 via-teal-950/40 to-slate-900 border border-primary/30">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/30 text-brand-cyan">
            <FolderHeart className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <strong className="block text-xs font-bold text-slate-100">Biblioteca Personal</strong>
            <span className="text-[10px] text-slate-400 font-mono">
              {totalCount} recursos disponibles para reutilizar
            </span>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en mis creaciones..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-8 pr-8 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-brand-cyan focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {/* SELECTOR DE SUB-PESTAÑAS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar scroll-smooth">
          {[
            { id: 'all', label: 'Todo', icon: Sparkles, count: totalCount },
            { id: 'projects', label: 'Proyectos', icon: LayoutTemplate, count: storedProjects.length },
            { id: 'blocks', label: 'Tarjetas & Grupos', icon: Layers, count: savedElements.filter(e => e.category !== 'text').length },
            { id: 'texts', label: 'Mis Textos', icon: Type, count: savedElements.filter(e => e.category === 'text').length },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/40 to-teal-900/60 text-brand-cyan border border-brand-cyan shadow-sm ring-1 ring-brand-cyan/30'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ZONA DE RESULTADOS */}
      <div className="flex-1 overflow-y-auto p-3.5 custom-scrollbar space-y-4 bg-[#050B14]/40">
        {/* SECCIÓN A: PROYECTOS COMPLETOS */}
        {filteredProjects.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <LayoutTemplate className="size-3.5 text-brand-cyan" />
                <span>Proyectos Completos ({filteredProjects.length})</span>
              </span>
            </div>

            <div className="space-y-2">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onLoadProject(proj)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3 hover:border-brand-cyan hover:bg-slate-900 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <strong className="block text-xs font-bold text-slate-100 group-hover:text-brand-cyan transition-colors truncate">
                        {proj.title}
                      </strong>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{proj.preset.aspectRatio}</span>
                        <span>·</span>
                        <span>{proj.preset.width}×{proj.preset.height} px</span>
                        <span>·</span>
                        <span>{proj.layers.length} capas</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleDuplicateProject(proj.id, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Duplicar proyecto"
                      >
                        <Copy className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteProject(proj.id, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Eliminar proyecto"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 px-2.5 py-0.5 text-[10px] font-black text-brand-cyan hover:bg-brand-cyan hover:text-slate-950 transition-all ml-1 shadow-xs"
                      >
                        <ExternalLink className="size-3" />
                        <span>Abrir</span>
                      </button>
                    </div>
                  </div>

                  {/* PREVIEW MINIATURA DEL FONDO */}
                  <div
                    className="w-full h-16 rounded-xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center shadow-inner"
                    style={{ background: proj.background.gradient ?? '#001219' }}
                  >
                    <span className="text-[10px] font-bold text-white/80 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
                      {proj.preset.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN B: ELEMENTOS Y BLOQUES GUARDADOS */}
        {filteredElements.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1 pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-400" />
                <span>Componentes Guardados ({filteredElements.length})</span>
              </span>
            </div>

            <div className="space-y-2">
              {filteredElements.map((elem) => (
                <div
                  key={elem.id}
                  onClick={() => onInsertSavedLayer(elem.layer)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3 hover:border-amber-400/80 hover:bg-slate-900 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                        {elem.title}
                      </span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono uppercase text-slate-400">
                        {elem.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteElement(elem.id, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Eliminar elemento guardado"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-black text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-all ml-1 shadow-xs"
                      >
                        <Plus className="size-3" />
                        <span>Insertar</span>
                      </button>
                    </div>
                  </div>

                  {/* PREVIEW DEL ELEMENTO */}
                  <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-2.5 text-center min-h-[42px] flex items-center justify-center">
                    <span className="text-xs text-slate-200 font-semibold truncate">
                      {String(elem.layer.props?.text ?? elem.layer.title ?? 'Componente')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {filteredProjects.length === 0 && filteredElements.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
            <FolderHeart className="size-10 text-slate-600 mb-2 stroke-[1.5]" />
            <strong className="text-xs font-bold text-slate-300">
              No tienes recursos guardados en esta sección
            </strong>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[260px] leading-relaxed">
              Selecciona cualquier elemento o tarjeta en el lienzo y pulsa <strong>"⭐ Guardar en Mis Diseños"</strong> para reutilizarlo aquí en 1 clic.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
