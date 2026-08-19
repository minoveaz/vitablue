import React, { useState } from 'react';
import {
  Plus,
  Search,
  Image as ImageIcon,
  Copy,
  Trash2,
  Sparkles,
  Layers,
  Calendar,
  Filter,
  X,
  LayoutTemplate,
  Monitor,
  Smartphone,
  Square,
  ArrowRight,
} from 'lucide-react';
import { ImageProject, IMAGE_FORMAT_PRESETS } from '../../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../../utils/imageTemplates';
import {
  getStoredImageProjects,
  saveStoredImageProject,
  deleteStoredImageProject,
  duplicateStoredImageProject,
  createBlankImageProject,
} from '../../utils/imageProjectStorage';

export interface ImageStudioHubProps {
  onOpenProject: (projectId: string) => void;
}

export const ImageStudioHub: React.FC<ImageStudioHubProps> = ({ onOpenProject }) => {
  const [projects, setProjects] = useState<ImageProject[]>(() => getStoredImageProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalTab, setCreateModalTab] = useState<'blank' | 'template'>('blank');
  const [modalCategoryTab, setModalCategoryTab] = useState<string>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('instagram-portrait');
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const refreshProjects = () => {
    setProjects(getStoredImageProjects());
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = duplicateStoredImageProject(id);
    if (dup) {
      refreshProjects();
    }
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que deseas eliminar el diseño "${title}"?`)) {
      deleteStoredImageProject(id);
      refreshProjects();
    }
  };

  const handleCreateBlank = () => {
    const project = createBlankImageProject(selectedPresetId, newProjectTitle.trim() || undefined);
    refreshProjects();
    setIsCreateModalOpen(false);
    onOpenProject(project.id);
  };

  const handleCreateFromTemplate = (template: ImageProject) => {
    const newProj: ImageProject = {
      ...template,
      id: `project-${Date.now()}`,
      title: `${template.title} (Nuevo)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveStoredImageProject(newProj);
    refreshProjects();
    setIsCreateModalOpen(false);
    onOpenProject(newProj.id);
  };

  // Filtering
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.preset.aspectRatio.includes(searchQuery);

    const matchesFormat =
      selectedFormatFilter === 'all' ||
      proj.preset.id === selectedFormatFilter ||
      proj.preset.aspectRatio === selectedFormatFilter;

    return matchesSearch && matchesFormat;
  });

  const getFormatIcon = (aspectRatio: string) => {
    switch (aspectRatio) {
      case '9:16':
        return <Smartphone className="size-3.5" />;
      case '1:1':
        return <Square className="size-3.5" />;
      case '16:9':
        return <Monitor className="size-3.5" />;
      default:
        return <ImageIcon className="size-3.5" />;
    }
  };

  return (
    <div className="h-full w-full bg-[#001219] text-slate-100 p-6 md:p-10 font-sans overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 px-3 py-1 text-xs font-bold text-brand-cyan">
                <Sparkles className="size-3.5" />
                <span>Creative Studio · Image Engine</span>
              </span>
              <span className="text-xs font-mono text-slate-500">
                {projects.length} {projects.length === 1 ? 'diseño' : 'diseños guardados'}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-black tracking-tight text-white">
              Hub de Creatividades Sociales
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Crea, edita y organiza piezas gráficas de alto rendimiento para Instagram, TikTok, LinkedIn y X con los tokens oficiales de VitaBlue.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setNewProjectTitle('');
              setIsCreateModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>Crear Nuevo Diseño</span>
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, formato o resolución..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* FORMAT FILTER PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <Filter className="size-3.5 text-slate-500 mr-1 shrink-0" />
            {[
              { id: 'all', label: 'Todos los formatos' },
              { id: '4:5', label: '4:5 (Post)' },
              { id: '1:1', label: '1:1 (Cuadrado)' },
              { id: '9:16', label: '9:16 (Story/Reel)' },
              { id: '16:9', label: '16:9 (Banner)' },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFormatFilter(filter.id)}
                className={`rounded-xl px-3 py-1.5 font-medium whitespace-nowrap transition-all ${
                  selectedFormatFilter === filter.id
                    ? 'bg-primary/30 text-brand-cyan border border-brand-cyan/40 shadow-xs'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECTS GRID */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-500 mb-4">
              <ImageIcon className="size-6" />
            </div>
            <h3 className="font-display text-base font-bold text-white mb-1">
              No se encontraron diseños
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              {searchQuery
                ? 'No hay creatividades que coincidan con los filtros de búsqueda aplicados.'
                : 'Aún no tienes diseños creados. Comienza con un lienzo en blanco o una plantilla.'}
            </p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-500/20 border border-teal-500/40 px-4 py-2 text-xs font-bold text-brand-cyan hover:bg-teal-500/30 transition-all"
            >
              <Plus className="size-4" />
              <span>Crear mi primer diseño</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => {
              const updatedAtFormatted = new Date(project.updatedAt || project.createdAt).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={project.id}
                  onClick={() => onOpenProject(project.id)}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-800/80 bg-slate-950/80 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-brand-cyan/50 hover:shadow-[0_15px_35px_-10px_rgba(0,95,115,0.3)] cursor-pointer"
                >
                  {/* PREVIEW CONTAINER */}
                  <div
                    className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-800/80 flex items-center justify-center p-3 transition-transform group-hover:scale-[1.01]"
                    style={{
                      background: project.background.gradient ?? project.background.color ?? '#001219',
                    }}
                  >
                    {/* FORMAT BADGE */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-lg bg-slate-950/80 px-2 py-1 text-[10px] font-bold text-slate-200 backdrop-blur-md border border-slate-800">
                      {getFormatIcon(project.preset.aspectRatio)}
                      <span>{project.preset.aspectRatio}</span>
                    </div>

                    {/* RESOLUTION BADGE */}
                    <div className="absolute top-2.5 right-2.5 rounded-lg bg-slate-950/80 px-2 py-1 text-[9px] font-mono text-slate-400 backdrop-blur-md border border-slate-800">
                      {project.preset.width} × {project.preset.height}
                    </div>

                    {/* MINIATURE CENTER PIECE */}
                    <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-950/60 border border-teal-500/30 backdrop-blur-xs max-w-[85%] shadow-lg">
                      <span className="font-display text-[11px] font-bold text-white line-clamp-2 leading-tight">
                        {project.title}
                      </span>
                      <span className="text-[9px] font-semibold text-brand-cyan mt-1">
                        {project.layers.length} {project.layers.length === 1 ? 'capa' : 'capas activas'}
                      </span>
                    </div>
                  </div>

                  {/* INFO & ACTIONS */}
                  <div className="mt-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-brand-cyan transition-colors truncate" title={project.title}>
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Layers className="size-3 text-slate-500" />
                          <span>{project.preset.name}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3 text-slate-500" />
                          <span>{updatedAtFormatted}</span>
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM BUTTONS */}
                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProject(project.id);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-primary/20 hover:bg-primary/40 border border-teal-500/30 px-3 py-1.5 text-xs font-bold text-brand-cyan transition-all"
                      >
                        <span>Abrir Editor</span>
                        <ArrowRight className="size-3" />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleDuplicate(project.id, e)}
                          className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
                          title="Duplicar diseño"
                        >
                          <Copy className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(project.id, project.title, e)}
                          className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
                          title="Eliminar diseño"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE NEW DESIGN MODAL (TAMAÑO GRANDE Y ALTURA FIJA ESTABLE) */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl h-[700px] rounded-3xl border border-slate-800 bg-[#001219] p-6 shadow-2xl flex flex-col justify-between overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div>
                <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="size-4 text-brand-cyan" />
                  <span>Crear Nuevo Diseño</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona el formato de lienzo o parte desde una plantilla oficial prediseñada.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* MODAL TABS */}
            <div className="grid grid-cols-2 rounded-2xl bg-slate-950 p-1 my-3 border border-slate-800 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setCreateModalTab('blank')}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 transition-all ${
                  createModalTab === 'blank'
                    ? 'bg-slate-800 text-brand-cyan shadow-sm ring-1 ring-brand-cyan/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Square className="size-4" />
                <span>1. Lienzo en Blanco</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateModalTab('template')}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 transition-all ${
                  createModalTab === 'template'
                    ? 'bg-slate-800 text-brand-cyan shadow-sm ring-1 ring-brand-cyan/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutTemplate className="size-4" />
                <span>2. Desde Plantilla Oficial</span>
              </button>
            </div>

            {/* TAB 1: BLANK CANVAS (ALTURA INTERNA FLEXIBLE Y FIJA) */}
            {createModalTab === 'blank' && (
              <div className="flex-1 flex flex-col min-h-0 justify-between">
                <div className="space-y-3 shrink-0 mb-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                      Título del Diseño (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="Ej: Anuncio Visado Sanitas 4:5"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Categoría / Red Social
                      </label>
                      <span className="text-[11px] font-mono text-brand-cyan">
                        {IMAGE_FORMAT_PRESETS.length} formatos disponibles
                      </span>
                    </div>

                    {/* CATEGORY SELECTOR PILLS */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
                      {[
                        { id: 'all', label: 'Todos' },
                        { id: 'instagram', label: '📸 Instagram' },
                        { id: 'tiktok', label: '🎵 TikTok' },
                        { id: 'linkedin', label: '💼 LinkedIn' },
                        { id: 'facebook', label: '👥 Facebook' },
                        { id: 'twitter', label: '🐦 X (Twitter)' },
                        { id: 'youtube', label: '🎬 YouTube' },
                        { id: 'web_marketing', label: '🌐 Web & Displays' },
                      ].map((cat) => {
                        const isActive = modalCategoryTab === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setModalCategoryTab(cat.id)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                              isActive
                                ? 'bg-primary/30 text-brand-cyan border border-brand-cyan/50 shadow-xs'
                                : 'bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800'
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* PRESETS GRID FOR SELECTED CATEGORY (CON SILUETA DE PREVISUALIZACIÓN VISUAL) */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {IMAGE_FORMAT_PRESETS.filter(
                    (p) => modalCategoryTab === 'all' || p.category === modalCategoryTab
                  ).map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    
                    // Cálculo de proporción para la silueta dentro de la caja de 100px
                    const ratio = preset.width / preset.height;
                    const maxH = 80;
                    const maxW = 120;
                    let w = maxH * ratio;
                    let h = maxH;
                    if (w > maxW) {
                      w = maxW;
                      h = maxW / ratio;
                    }

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedPresetId(preset.id)}
                        className={`flex flex-col justify-between p-3.5 rounded-2xl border text-left transition-all group ${
                          isSelected
                            ? 'border-brand-cyan bg-primary/20 text-white shadow-lg ring-1 ring-brand-cyan'
                            : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        {/* HEADER DE TARJETA */}
                        <div>
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-xs font-bold text-slate-100 truncate pr-1 group-hover:text-brand-cyan transition-colors">
                              {preset.name}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 transition-colors ${
                              isSelected ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-slate-900 text-slate-400'
                            }`}>
                              {preset.aspectRatio}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                            {preset.description}
                          </p>
                        </div>

                        {/* PREVISUALIZACIÓN VISUAL DE PROPORCIONES DE LIENZO */}
                        <div className="my-1.5 flex h-24 w-full items-center justify-center rounded-xl bg-slate-950/90 border border-slate-800/80 p-2 relative overflow-hidden group-hover:border-teal-500/30 transition-colors">
                          {/* Patrón de cuadrícula de fondo */}
                          <div
                            className="absolute inset-0 opacity-15"
                            style={{
                              backgroundImage: 'radial-gradient(circle, #94D2BD 1px, transparent 1px)',
                              backgroundSize: '8px 8px',
                            }}
                          />

                          {/* Silueta de proporción real */}
                          <div
                            className={`rounded-md border flex flex-col items-center justify-center relative transition-all shadow-md ${
                              isSelected
                                ? 'border-brand-cyan bg-gradient-to-br from-teal-900/70 to-primary/40 text-brand-cyan shadow-teal-950/50 ring-1 ring-brand-cyan/30'
                                : 'border-slate-700/80 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-400'
                            }`}
                            style={{
                              width: `${Math.round(w)}px`,
                              height: `${Math.round(h)}px`,
                            }}
                          >
                            <span className="text-[10px] font-mono font-black drop-shadow-xs">
                              {preset.aspectRatio}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400 mt-0.5">
                              {preset.width}×{preset.height}
                            </span>
                          </div>
                        </div>

                        {/* FOOTER DE TARJETA CON MEDIDAS Y USO */}
                        <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-900">
                          <span className="text-slate-400 font-semibold">{preset.width} × {preset.height} px</span>
                          <span className="text-amber-400/90 font-sans truncate max-w-[110px]" title={preset.recommendedFor}>
                            {preset.recommendedFor}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* MODAL FOOTER */}
                <div className="pt-3 mt-3 flex justify-end items-center gap-3 border-t border-slate-800/80 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateBlank}
                    className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Crear Lienzo</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: FROM TEMPLATE (ALTURA EXACTA SIN SALTOS) */}
            {createModalTab === 'template' && (
              <div className="flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {INITIAL_IMAGE_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleCreateFromTemplate(tmpl)}
                      className="group flex flex-col justify-between p-3.5 rounded-2xl border border-slate-800 bg-slate-950 text-left hover:border-brand-cyan hover:bg-slate-900/60 transition-all"
                    >
                      <div
                        className="w-full h-32 rounded-xl mb-3 flex items-center justify-center p-3 text-center border border-slate-800"
                        style={{
                          background: tmpl.background.gradient ?? tmpl.background.color ?? '#001219',
                        }}
                      >
                        <span className="text-xs font-bold text-white drop-shadow-md">
                          {tmpl.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-200">{tmpl.preset.name}</span>
                        <span className="font-mono text-brand-cyan font-bold">{tmpl.preset.aspectRatio}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* MODAL FOOTER */}
                <div className="pt-3 mt-3 flex justify-end items-center gap-3 border-t border-slate-800/80 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-900 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
