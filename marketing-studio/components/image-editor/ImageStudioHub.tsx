import React, { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Image as ImageIcon,
  Copy,
  Archive,
  Sparkles,
  X,
  LayoutTemplate,
  Square,
  ArrowRight,
} from 'lucide-react';
import { ImageProject, IMAGE_FORMAT_PRESETS } from '../../types/imageStudio';
import { MARKETING_TEMPLATE_PROJECT_BY_ID } from '../../utils/imageTemplates';
import { TEMPLATE_CATALOG } from '../../data/templateCatalog';
import {
  createBlankImageProjectDraft,
  getUserSavedImageProjectsAsync,
} from '../../utils/imageProjectStorage';
import {
  archiveCreativeProject,
  listCreativeProjects,
  saveCreativeProject,
  migrateLegacyCreativeProject,
} from '../../utils/creativeStudioRemote';
import { ImageLayerBlockRenderer } from './blocks/BlockRenderer';
import ConfirmModal from '@/components/molecules/ConfirmModal';
import { StudioHubProjectCard, studioHubIconButtonClass } from '../shared/StudioHubPrimitives';

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
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'draft' | 'ready' | 'archived'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalTab, setCreateModalTab] = useState<'blank' | 'template'>('blank');
  const [modalCategoryTab, setModalCategoryTab] = useState<string>('all');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('instagram-portrait');
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [pendingDelete, setPendingDelete] = useState<ImageProject | null>(null);
  const [hubError, setHubError] = useState<string | null>(null);
  const [legacyProjects, setLegacyProjects] = useState<ImageProject[]>([]);
  const [selectedLegacyIds, setSelectedLegacyIds] = useState<string[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);

  const refreshProjects = useCallback(async () => {
    const hydratedProjects = await listCreativeProjects();
    setProjects(hydratedProjects);
    setIsHydrating(false);
    setHubError(null);
  }, []);

  useEffect(() => {
    let active = true;
    void refreshProjects().catch((error) => {
      if (active) {
        setHubError(error instanceof Error
          ? import.meta.env.DEV
            ? `${error.message} [${error.name}]`
            : error.message
          : 'No se pudo conectar con LoopDev.');
        setIsHydrating(false);
      }
    });
    return () => {
      active = false;
    };
  }, [refreshProjects]);

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const target = projects.find((project) => project.id === id);
      if (!target) return;
      await saveCreativeProject({
        ...target,
        id: crypto.randomUUID(),
        title: `${target.title} (Copia)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { createNew: true });
      await refreshProjects();
    } catch (error) {
      setHubError(error instanceof Error ? error.message : 'No se pudo duplicar la creatividad.');
    }
  };

  const handleDelete = (project: ImageProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDelete(project);
  };

  const performArchiveProject = async (project: ImageProject) => {
    try {
      await archiveCreativeProject(project.id, project.updatedAt);
      await refreshProjects();
      setPendingDelete(null);
    } catch (error) {
      setHubError(error instanceof Error ? error.message : 'No se pudo archivar la creatividad.');
    }
  };

  const handleReactivate = async (project: ImageProject, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await saveCreativeProject(
        { ...project, creativeStatus: 'draft' },
        { expectedUpdatedAt: project.updatedAt, changeSummary: 'Reactivado' },
      );
      await refreshProjects();
    } catch (error) {
      setHubError(error instanceof Error ? error.message : 'No se pudo reactivar el diseño.');
    }
  };

  const handleCreateBlank = async () => {
    try {
      const project = await saveCreativeProject(
        createBlankImageProjectDraft(
          selectedPresetId,
          newProjectTitle.trim() || undefined,
        ),
        { createNew: true },
      );
      await refreshProjects();
      setIsCreateModalOpen(false);
      onOpenProject(project.id);
    } catch (error) {
      setHubError(error instanceof Error ? error.message : 'No se pudo crear la creatividad.');
    }
  };

  const handleCreateFromTemplate = async (template: ImageProject) => {
    try {
      const newProj = await saveCreativeProject({
        ...template,
        id: crypto.randomUUID(),
        title: newProjectTitle.trim() || `${template.title} (Nuevo)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { createNew: true });
      await refreshProjects();
      setIsCreateModalOpen(false);
      onOpenProject(newProj.id);
    } catch (error) {
      setHubError(error instanceof Error ? error.message : 'No se pudo crear la creatividad.');
    }
  };

  const inspectLegacyProjects = async () => {
    const localProjects = await getUserSavedImageProjectsAsync();
    const candidates = localProjects.filter(
      (project) => !projects.some((remote) => remote.id === project.id),
    );
    setLegacyProjects(candidates);
    setSelectedLegacyIds(candidates.map((project) => project.id));
  };

  const migrateSelectedProjects = async () => {
    const selected = legacyProjects.filter((project) => selectedLegacyIds.includes(project.id));
    if (!selected.length) return;
    setIsMigrating(true);
    try {
      for (const project of selected) {
        await migrateLegacyCreativeProject(project);
      }
      await refreshProjects();
      setLegacyProjects([]);
      setSelectedLegacyIds([]);
    } catch (error) {
      setHubError(error instanceof Error ? error.message : 'No se pudieron migrar los diseños seleccionados.');
    } finally {
      setIsMigrating(false);
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

    const projectStatus = proj.creativeStatus ?? 'draft';
    const matchesStatus = selectedStatusFilter === 'all'
      ? projectStatus !== 'archived'
      : projectStatus === selectedStatusFilter;
    return matchesSearch && matchesFormat && matchesStatus;
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

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void inspectLegacyProjects()} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600 hover:border-primary hover:text-primary">
            Importar diseños del navegador
          </button>
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
        </div>
      </header>

      {hubError && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          <span>{hubError}</span>
          <button type="button" onClick={() => void refreshProjects()} className="rounded-lg bg-white px-3 py-1.5 font-black text-rose-700">Reintentar</button>
        </div>
      )}

      {legacyProjects.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Diseños locales encontrados</h3>
              <p className="text-xs text-slate-600">Selecciona los que quieres copiar al Storage remoto. No se borrará el original.</p>
            </div>
            <button type="button" disabled={isMigrating} onClick={() => void migrateSelectedProjects()} className="rounded-xl bg-accent px-3 py-2 text-xs font-black text-primary-dark disabled:opacity-50">
              {isMigrating ? 'Migrando…' : 'Migrar seleccionados'}
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {legacyProjects.map((project) => (
              <label key={project.id} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                <input type="checkbox" checked={selectedLegacyIds.includes(project.id)} onChange={(event) => setSelectedLegacyIds((ids) => event.target.checked ? [...ids, project.id] : ids.filter((id) => id !== project.id))} />
                <span className="truncate">{project.title}</span>
              </label>
            ))}
          </div>
        </section>
      )}

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
        <select value={selectedStatusFilter} onChange={(event) => setSelectedStatusFilter(event.target.value as typeof selectedStatusFilter)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-600">
          <option value="all">Todos los estados</option>
          <option value="draft">Borradores</option>
          <option value="ready">Listos</option>
          <option value="archived">Archivados</option>
        </select>

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
              <StudioHubProjectCard
                key={project.id}
                title={project.title}
                formatLabel={project.preset.name}
                dimensionsLabel={`#${project.preset.aspectRatio} · ${project.preset.width}×${project.preset.height}`}
                detail={`${project.layers.length} ${project.layers.length === 1 ? 'capa activa' : 'capas activas'} · ${project.background.gradient ? 'Fondo Gradiente' : 'Fondo Sólido'}`}
                updatedAtLabel={updatedAtFormatted}
                preview={<CanvasThumbnailPreview project={project} />}
                archived={project.creativeStatus === 'archived'}
                onOpen={() => onOpenProject(project.id)}
                actions={(
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleDuplicate(project.id, e)}
                      title="Duplicar diseño"
                      aria-label="Duplicar diseño"
                      className={studioHubIconButtonClass}
                    >
                      <Copy className="size-3.5" aria-hidden="true" />
                    </button>
                    {project.creativeStatus !== 'archived' ? (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(project, e)}
                        title="Archivar diseño"
                        aria-label="Archivar diseño"
                        className={`${studioHubIconButtonClass} border-amber-100 text-amber-600 hover:bg-amber-50`}
                      >
                        <Archive className="size-3.5" aria-hidden="true" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => void handleReactivate(project, e)}
                        title="Reactivar diseño"
                        aria-label="Reactivar diseño"
                        className={studioHubIconButtonClass}
                      >
                        ↩
                      </button>
                    )}
                  </>
                )}
              />
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

      {/* MODAL DE CONFIRMACIÓN PARA ARCHIVAR DISEÑO */}
      <ConfirmModal
        open={Boolean(pendingDelete)}
        variant="danger"
        title="Archivar diseño"
        description={
          pendingDelete
            ? `¿Archivar el diseño "${pendingDelete.title}"? Podrás reactivarlo después desde el filtro de archivados.`
            : undefined
        }
        confirmLabel="Archivar diseño"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) performArchiveProject(pendingDelete);
        }}
      />
    </div>
  );
};
