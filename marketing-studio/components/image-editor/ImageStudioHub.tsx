import React, { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Image as ImageIcon,
  Copy,
  Trash2,
  Sparkles,
  Calendar,
  X,
  LayoutTemplate,
  Square,
  ArrowRight,
} from 'lucide-react';
import { ImageProject, IMAGE_FORMAT_PRESETS } from '../../types/imageStudio';
import { MARKETING_TEMPLATE_PROJECT_BY_ID } from '../../utils/imageTemplates';
import { TEMPLATE_CATALOG } from '../../data/templateCatalog';
import {
  IMAGE_PROJECTS_UPDATED_EVENT,
  createBlankImageProjectAsync,
  createImageProjectFromTemplateAsync,
  deleteStoredImageProjectAsync,
  duplicateStoredImageProjectAsync,
  getStoredImageProjectsAsync,
  initializeImagePersistence,
} from '../../utils/imageProjectStorage';
import { ImageLayerBlockRenderer } from './blocks/BlockRenderer';
import ConfirmModal from '@/components/molecules/ConfirmModal';

export interface ImageStudioHubProps {
  onOpenProject: (projectId: string) => void;
}

/**
 * Previsualizador visual interactivo a escala del lienzo real con todas sus capas.
 */
const CanvasThumbnailPreview: React.FC<{ project: ImageProject }> = ({ project }) => {
  const pw = project.preset.width || 1080;
  const ph = project.preset.height || 1080;

  // Calculamos la escala para ajustar la altura a ~175px
  const targetH = 175;
  const scale = Math.min(0.25, targetH / ph);

  return (
    <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200/80 shadow-inner select-none pointer-events-none">
      {/* Trama sutil de fondo */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #94D2BD 1px, transparent 1px)',
          backgroundSize: '10px 10px',
        }}
      />

      {/* Lienzo Real Renderizado a Escala */}
      <div
        className="relative shadow-2xl overflow-hidden shrink-0 transition-transform"
        style={{
          width: `${pw}px`,
          height: `${ph}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          background: project.background.gradient ?? project.background.color ?? '#001219',
        }}
      >
        {project.layers.map((layer) => {
          const scaleX = layer.scale ? (layer.flipHorizontal ? -layer.scale : layer.scale) : layer.flipHorizontal ? -1 : 1;
          const scaleY = layer.scale ? (layer.flipVertical ? -layer.scale : layer.scale) : layer.flipVertical ? -1 : 1;

          return (
            <div
              key={layer.id}
              className="absolute"
              style={{
                left: `${layer.position.x}%`,
                top: `${layer.position.y}%`,
                transform: `translate(-50%, -50%) rotate(${layer.rotation ?? 0}deg) scale(${scaleX}, ${scaleY})`,
                zIndex: layer.zIndex,
                width: layer.width ? `${layer.width}px` : layer.blockType === 'GeometricShape' ? '200px' : 'auto',
                height: layer.height ? `${layer.height}px` : layer.blockType === 'GeometricShape' ? '200px' : 'auto',
                opacity: layer.opacity !== undefined ? layer.opacity : 1,
              }}
            >
              <ImageLayerBlockRenderer layer={layer} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ImageStudioHub: React.FC<ImageStudioHubProps> = ({ onOpenProject }) => {
  const [projects, setProjects] = useState<ImageProject[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalTab, setCreateModalTab] = useState<'blank' | 'template'>('blank');
  const [modalCategoryTab, setModalCategoryTab] = useState<string>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('instagram-portrait');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [pendingDelete, setPendingDelete] = useState<ImageProject | null>(null);

  const refreshProjects = useCallback(async () => {
    const hydratedProjects = await getStoredImageProjectsAsync();
    setProjects(hydratedProjects);
    setIsHydrating(false);
  }, []);

  useEffect(() => {
    let active = true;
    void initializeImagePersistence()
      .then(() => {
        if (active) return refreshProjects();
        return undefined;
      })
      .catch(() => {
        if (active) setIsHydrating(false);
      });
    const handleUpdate = () => {
      if (active) void refreshProjects();
    };
    window.addEventListener(IMAGE_PROJECTS_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      active = false;
      window.removeEventListener(IMAGE_PROJECTS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshProjects]);

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const dup = await duplicateStoredImageProjectAsync(id);
      if (dup) {
        await refreshProjects();
      }
    } catch {
      // The editor remains usable if a browser storage transaction fails.
    }
  };

  const handleDelete = (project: ImageProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDelete(project);
  };

  const performDeleteProject = async (project: ImageProject) => {
    try {
      await deleteStoredImageProjectAsync(project.id);
      await refreshProjects();
      setPendingDelete(null);
    } catch {
      // Keep the confirmation open so the user can retry.
    }
  };

  const handleCreateBlank = async () => {
    try {
      const project = await createBlankImageProjectAsync(
        selectedPresetId,
        newProjectTitle.trim() || undefined,
      );
      await refreshProjects();
      setIsCreateModalOpen(false);
      onOpenProject(project.id);
    } catch {
      // Keep the modal open when a durable write cannot be completed.
    }
  };

  const handleCreateFromTemplate = async (template: ImageProject) => {
    try {
      const newProj = await createImageProjectFromTemplateAsync(template);
      await refreshProjects();
      setIsCreateModalOpen(false);
      onOpenProject(newProj.id);
    } catch {
      // Keep the modal open when a durable write cannot be completed.
    }
  };

  // Filtrado de proyectos
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. HEADER SECTION (MATCHING CAMPAIGN ORCHESTRATOR) */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">
            Workspace de creatividades
          </p>
          <h2 className="mt-1 font-display text-3xl font-black text-slate-900">
            Diseños y creatividades activas
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
            Crea, edita y organiza piezas gráficas de alto rendimiento para Instagram, TikTok, LinkedIn y X con los tokens oficiales de VitaBlue.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewProjectTitle('');
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-primary-dark shadow-sm"
        >
          <Plus size={15} /> Nuevo diseño
        </button>
      </header>

      {/* 2. BARRA DE BÚSQUEDA Y FILTROS POR FORMATO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, formato o resolución..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* PILLS DE FORMATO */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'Todos los formatos' },
            { id: 'carousel', label: '🎠 Carruseles (Multi)' },
            { id: '4:5', label: '4:5 (Post)' },
            { id: '1:1', label: '1:1 (Cuadrado)' },
            { id: '9:16', label: '9:16 (Story/Reel)' },
            { id: '16:9', label: '16:9 (Banner)' },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setSelectedFormatFilter(filter.id)}
              className={`rounded-xl px-3 py-1.5 font-bold whitespace-nowrap transition-all ${
                selectedFormatFilter === filter.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. LISTADO DE DISEÑOS EN GRID (ESTILO CAMPAÑAS ACTIVAS) */}
      {isHydrating ? (
        <div className="flex min-h-56 items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-500 shadow-sm">
          Cargando tus diseños…
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
          <ImageIcon className="mb-4 h-12 w-12 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-900">No se encontraron diseños</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {searchQuery
              ? 'No hay creatividades que coincidan con los filtros de búsqueda aplicados.'
              : 'Aún no tienes diseños creados. Comienza con un lienzo en blanco o una plantilla.'}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black text-white hover:bg-primary-dark transition-colors"
          >
            <Plus size={14} />
            <span>Crear mi primer diseño</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const updatedAtFormatted = new Date(project.updatedAt || project.createdAt).toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <article
                key={project.id}
                onClick={() => onOpenProject(project.id)}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md cursor-pointer"
              >
                <div>
                  {/* PREVIEW VISUAL REAL DEL LIENZO */}
                  <CanvasThumbnailPreview project={project} />

                  {/* CABECERA DE METADATOS */}
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase text-slate-700">
                      {project.preset.name}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      #{project.preset.aspectRatio} · {project.preset.width}×{project.preset.height}
                    </span>
                  </div>

                  {/* TÍTULO PRINCIPAL */}
                  <h3
                    className="mt-3 line-clamp-2 font-display text-lg font-black text-slate-900 group-hover:text-primary transition-colors"
                    title={project.title}
                  >
                    {project.title}
                  </h3>

                  {/* DETALLES DE CAPAS */}
                  <p className="mt-1 line-clamp-1 text-xs font-medium leading-relaxed text-slate-500">
                    {project.layers.length} {project.layers.length === 1 ? 'capa activa' : 'capas activas'} · {project.background.gradient ? 'Fondo Gradiente' : 'Fondo Sólido'}
                  </p>
                </div>

                {/* PIE DE TARJETA CON FECHA Y ACCIONES */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <Calendar size={12} /> {updatedAtFormatted}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProject(project.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-[11px] font-black text-white transition-colors hover:bg-primary-dark"
                    >
                      Abrir Editor <ArrowRight size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDuplicate(project.id, e)}
                      title="Duplicar diseño"
                      className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-100"
                    >
                      <Copy size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(project, e)}
                      title="Eliminar diseño"
                      className="rounded-xl border border-rose-100 p-2 text-rose-500 transition-colors hover:bg-rose-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 4. MODAL DE CREACIÓN DE NUEVO DISEÑO (CLEAN WHITE THEME) */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl h-[680px] rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl flex flex-col justify-between overflow-hidden animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div>
                <h2 className="font-display text-xl font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <span>Crear Nuevo Diseño</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona el formato de lienzo o parte desde una plantilla oficial prediseñada.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* MODAL TABS */}
            <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 my-3 border border-slate-200 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setCreateModalTab('blank')}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 transition-all ${
                  createModalTab === 'blank'
                    ? 'bg-white text-primary shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
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
                    ? 'bg-white text-primary shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutTemplate className="size-4" />
                <span>2. Desde Plantilla Oficial</span>
              </button>
            </div>

            {/* TAB 1: BLANK CANVAS */}
            {createModalTab === 'blank' && (
              <div className="flex-1 flex flex-col min-h-0 justify-between">
                <div className="space-y-3 shrink-0 mb-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                      Título del Diseño (Opcional)
                    </label>
                    <input
                      type="text"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="Ej: Anuncio Visado Sanitas 4:5"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Categoría / Red Social
                      </label>
                      <span className="text-[11px] font-mono text-primary font-bold">
                        {IMAGE_FORMAT_PRESETS.length} formatos disponibles
                      </span>
                    </div>

                    {/* CATEGORY SELECTOR PILLS */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                      {[
                        { id: 'all', label: 'Todos' },
                        { id: 'carousel', label: '🎠 Carruseles' },
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
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                              isActive
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* PRESETS GRID */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {IMAGE_FORMAT_PRESETS.filter(
                    (p) => modalCategoryTab === 'all' || p.category === modalCategoryTab
                  ).map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    const ratio = preset.width / preset.height;
                    const maxH = 65;
                    const maxW = 95;
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
                        className={`flex flex-col justify-between p-3 rounded-2xl border text-left transition-all group ${
                          isSelected
                            ? 'border-primary bg-primary/5 text-slate-900 shadow-sm ring-2 ring-primary'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-xs font-bold text-slate-900 truncate pr-1 group-hover:text-primary transition-colors">
                              {preset.name}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                              isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {preset.aspectRatio}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                            {preset.description}
                          </p>
                        </div>

                        {/* SILUETA DE LIENZO */}
                        <div className="my-1 flex h-20 w-full items-center justify-center rounded-xl bg-slate-100 border border-slate-200/80 p-2 relative overflow-hidden">
                          <div
                            className={`rounded-md border flex flex-col items-center justify-center relative transition-all shadow-xs ${
                              isSelected
                                ? 'bg-primary border-primary text-white'
                                : 'bg-white border-slate-300 text-slate-400 group-hover:border-slate-400'
                            }`}
                            style={{ width: `${Math.round(w)}px`, height: `${Math.round(h)}px` }}
                          >
                            <span className="text-[9px] font-mono font-bold leading-none">
                              {preset.aspectRatio}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                          <span>{preset.width} × {preset.height} px</span>
                          <span className={isSelected ? 'text-primary font-bold' : ''}>
                            {isSelected ? '✓ Seleccionado' : 'Elegir'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* MODAL FOOTER */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-2 shrink-0">
                  <div className="text-xs text-slate-500">
                    Formato: <strong className="text-slate-900">{IMAGE_FORMAT_PRESETS.find((p) => p.id === selectedPresetId)?.name}</strong> ({IMAGE_FORMAT_PRESETS.find((p) => p.id === selectedPresetId)?.aspectRatio})
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateBlank}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black text-white hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <span>Abrir Lienzo en Blanco</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: FROM OFFICIAL TEMPLATE */}
            {createModalTab === 'template' && (
              <div className="flex-1 flex flex-col min-h-0 justify-between">
                <div className="flex-1 min-h-0 overflow-y-auto pr-1.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {TEMPLATE_CATALOG.map((catalogItem) => {
                    const tmpl = MARKETING_TEMPLATE_PROJECT_BY_ID.get(catalogItem.projectId);
                    if (!tmpl) return null;
                    return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleCreateFromTemplate(tmpl)}
                      className="group flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                    >
                      <CanvasThumbnailPreview project={tmpl} />

                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase text-primary">
                            {catalogItem.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {tmpl.preset.aspectRatio}
                          </span>
                        </div>
                        <h4 className="font-display text-sm font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                          {tmpl.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {tmpl.layers.length} capas listas para personalizar
                          {catalogItem.colorVariant ? ` · Fondo ${catalogItem.colorVariant}` : ''}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="mt-3 w-full rounded-xl bg-slate-100 py-2 text-xs font-black text-slate-700 group-hover:bg-primary group-hover:text-white transition-colors text-center flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="size-3.5" />
                        <span>Usar esta plantilla</span>
                      </button>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR DISEÑO */}
      <ConfirmModal
        open={Boolean(pendingDelete)}
        variant="danger"
        title="Eliminar diseño"
        description={
          pendingDelete
            ? `¿Seguro que deseas eliminar el diseño "${pendingDelete.title}"? Esta acción no se puede deshacer.`
            : undefined
        }
        confirmLabel="Eliminar diseño"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) performDeleteProject(pendingDelete);
        }}
      />
    </div>
  );
};
