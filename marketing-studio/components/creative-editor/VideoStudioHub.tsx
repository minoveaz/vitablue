import React, { useCallback, useEffect, useState } from 'react';
import { Archive, Copy, Film, Plus, RotateCcw, Search, X } from 'lucide-react';
import type { VideoProject } from '../../../packages/video-studio/src/domain/videoProject';
import { defaultVisaRejectionProject } from '../../../packages/video-studio/src/domain/defaultProject';
import {
  archiveCreativeProject,
  listVideoProjects,
  saveVideoProject,
  type PersistedVideoProject,
} from '../../utils/creativeStudioRemote';
import { StudioHubProjectCard, studioHubIconButtonClass } from '../shared/StudioHubPrimitives';
import ConfirmModal from '@/components/molecules/ConfirmModal';

export interface VideoStudioHubProps {
  onOpenProject: (projectId: string) => void;
}

const cloneProject = (project: VideoProject): VideoProject =>
  JSON.parse(JSON.stringify(project)) as VideoProject;

const VideoThumbnailPreview: React.FC<{ project: PersistedVideoProject }> = ({ project }) => {
  const visualLayer = project.scenes
    .flatMap((scene) => scene.layers)
    .find((layer) => (layer.type === 'video' || layer.type === 'image') && layer.asset.src);
  const visualSource = visualLayer?.type === 'video' || visualLayer?.type === 'image'
    ? visualLayer.asset.src
    : undefined;

  return (
    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-primary-dark shadow-inner">
      {visualSource && visualLayer?.type === 'video' ? (
        <video className="absolute inset-0 size-full object-cover opacity-80" src={visualSource} muted playsInline preload="metadata" aria-label={`Vista previa de ${project.name}`} />
      ) : visualSource ? (
        <img className="absolute inset-0 size-full object-cover opacity-80" src={visualSource} alt={`Vista previa de ${project.name}`} />
      ) : null}
      <div className="absolute inset-0 bg-primary/20 opacity-70" aria-hidden="true" />
      <div className="relative flex size-20 items-center justify-center rounded-2xl border border-brand-cyan/30 bg-primary/30 text-brand-cyan shadow-lg">
        <Film className="size-10" aria-hidden="true" />
      </div>
      <span className="absolute bottom-3 left-3 rounded-full bg-primary-dark/80 px-2.5 py-1 text-caption font-bold text-brand-cyan">
        {project.scenes.length} {project.scenes.length === 1 ? 'escena' : 'escenas'}
      </span>
    </div>
  );
};

export const VideoStudioHub: React.FC<VideoStudioHubProps> = ({ onOpenProject }) => {
  const [projects, setProjects] = useState<PersistedVideoProject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<'all' | VideoProject['format']>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'draft' | 'ready' | 'archived'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingArchive, setPendingArchive] = useState<PersistedVideoProject | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setProjects(await listVideoProjects());
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron cargar tus vídeos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createProject = async (source: VideoProject = defaultVisaRejectionProject) => {
    try {
      const project = await saveVideoProject({
        ...cloneProject(source),
        id: crypto.randomUUID(),
        name: 'Nuevo vídeo',
      }, { createNew: true });
      onOpenProject(project.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo crear el vídeo.');
    }
  };

  const duplicateProject = async (project: PersistedVideoProject) => {
    try {
      await saveVideoProject({
        ...cloneProject(project),
        id: crypto.randomUUID(),
        name: `${project.name} (Copia)`,
      }, { createNew: true });
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo duplicar el vídeo.');
    }
  };

  const archiveProject = async (project: PersistedVideoProject) => {
    try {
      await archiveCreativeProject(project.id, project.updatedAt);
      await refresh();
      setPendingArchive(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo archivar el vídeo.');
    }
  };

  const reactivateProject = async (project: PersistedVideoProject) => {
    try {
      await saveVideoProject(cloneProject(project), {
        expectedUpdatedAt: project.updatedAt,
        changeSummary: 'Reactivado',
      });
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo reactivar el vídeo.');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesSearch = [
      project.name,
      project.format,
      `${project.width}x${project.height}`,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesFormat = selectedFormatFilter === 'all' || project.format === selectedFormatFilter;
    const status = project.creativeStatus ?? 'draft';
    const matchesStatus = selectedStatusFilter === 'all'
      ? status !== 'archived'
      : status === selectedStatusFilter;
    return matchesSearch && matchesFormat && matchesStatus;
  });

  return (
    <div className="animate-fadeIn space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">
            Workspace de creatividades
          </p>
          <h2 className="mt-1 font-display text-3xl font-black text-slate-900">Vídeos y piezas activas</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">
            Crea, edita y organiza Reels y piezas de vídeo para tus campañas con los tokens oficiales de VitaBlue.
          </p>
        </div>
        <button type="button" onClick={() => void createProject()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-caption font-black text-white shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80">
          <Plus className="size-4" aria-hidden="true" /> Nuevo vídeo
        </button>
      </header>

      {error && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-caption font-semibold text-rose-700">
          <span>{error}</span>
          <button type="button" onClick={() => void refresh()} className="min-h-11 rounded-lg bg-white px-3 py-2 text-caption font-black text-rose-700">Reintentar</button>
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <label className="relative block w-full max-w-md flex-1">
          <span className="sr-only">Buscar vídeos</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Buscar por título, formato o resolución..."
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-caption font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Limpiar búsqueda">
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </label>
        <select value={selectedStatusFilter} onChange={(event) => setSelectedStatusFilter(event.target.value as typeof selectedStatusFilter)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-caption font-bold text-slate-600">
          <option value="all">Todos los estados</option>
          <option value="draft">Borradores</option>
          <option value="ready">Listos</option>
          <option value="archived">Archivados</option>
        </select>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-caption">
          {([
            ['all', 'Todos los formatos'],
            ['vertical', 'Vertical'],
            ['square', 'Cuadrado'],
            ['landscape', 'Horizontal'],
          ] as const).map(([id, label]) => (
            <button key={id} type="button" onClick={() => setSelectedFormatFilter(id)} className={`whitespace-nowrap rounded-xl px-3 py-1.5 font-bold transition-all ${selectedFormatFilter === id ? 'bg-primary text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-56 items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-caption font-semibold text-slate-500 shadow-sm">
          Cargando tus vídeos…
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
          <Film className="mb-4 size-12 text-slate-300" aria-hidden="true" />
          <h3 className="text-h3 text-slate-900">No se encontraron vídeos</h3>
          <p className="mt-2 max-w-sm text-body-reg text-slate-500">
            {searchQuery ? 'No hay vídeos que coincidan con los filtros de búsqueda aplicados.' : 'Aún no tienes vídeos creados. Empieza con una pieza nueva.'}
          </p>
          <button type="button" onClick={() => void createProject()} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-caption font-black text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80">
            <Plus className="size-3.5" aria-hidden="true" /> Crear mi primer vídeo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <StudioHubProjectCard
              key={project.id}
              title={project.name}
              formatLabel={project.format === 'vertical' ? 'Vídeo vertical' : project.format === 'square' ? 'Vídeo cuadrado' : 'Vídeo horizontal'}
              dimensionsLabel={`#${project.format} · ${project.width}×${project.height}`}
              detail={`${project.scenes.length} ${project.scenes.length === 1 ? 'escena' : 'escenas'} · ${project.audio?.length ?? 0} ${project.audio?.length === 1 ? 'pista' : 'pistas'} de audio`}
              updatedAtLabel={new Date(project.updatedAt || project.createdAt).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              preview={<VideoThumbnailPreview project={project} />}
              archived={project.creativeStatus === 'archived'}
              onOpen={() => onOpenProject(project.id)}
              actions={(
                <>
                  <button type="button" onClick={() => void duplicateProject(project)} title="Duplicar vídeo" aria-label="Duplicar vídeo" className={studioHubIconButtonClass}>
                    <Copy className="size-3.5" aria-hidden="true" />
                  </button>
                  {project.creativeStatus !== 'archived' ? (
                    <button type="button" onClick={() => setPendingArchive(project)} title="Archivar vídeo" aria-label="Archivar vídeo" className={`${studioHubIconButtonClass} border-amber-100 text-amber-600 hover:bg-amber-50`}>
                      <Archive className="size-3.5" aria-hidden="true" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => void reactivateProject(project)} title="Reactivar vídeo" aria-label="Reactivar vídeo" className={studioHubIconButtonClass}>
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                    </button>
                  )}
                </>
              )}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(pendingArchive)}
        variant="danger"
        title="Archivar vídeo"
        description={pendingArchive ? `¿Archivar el vídeo "${pendingArchive.name}"? Podrás reactivarlo después desde el filtro de archivados.` : undefined}
        confirmLabel="Archivar vídeo"
        onCancel={() => setPendingArchive(null)}
        onConfirm={() => {
          if (pendingArchive) void archiveProject(pendingArchive);
        }}
      />
    </div>
  );
};
