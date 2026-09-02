import type { ImageLayer, ImageProject } from '../types/imageStudio';

export type ImageProjectAutosaveSave = (
  project: ImageProject,
  expectedUpdatedAt: string | undefined,
  clientMutationId: string,
) => Promise<ImageProject>;

export interface ImageProjectAutosaveSavedMeta {
  hasPendingChanges: boolean;
}

export interface ImageProjectAutosaveQueue {
  /** Queue the project when it contains unsaved editable changes. */
  enqueue(project: ImageProject): boolean;
  /** Retry the last failed snapshot, if one exists. */
  retry(): boolean;
  flush(): Promise<void>;
  dispose(): void;
}

export interface CreateImageProjectAutosaveQueueOptions {
  initialServerProject: ImageProject;
  save: ImageProjectAutosaveSave;
  reload?: (projectId: string) => Promise<ImageProject | null>;
  getCurrentProject: () => ImageProject;
  onSaved: (
    savedProject: ImageProject,
    savedSnapshot: ImageProject,
    meta: ImageProjectAutosaveSavedMeta,
  ) => void;
  onConflictMerge: (mergedProject: ImageProject, remoteProject: ImageProject) => void;
  onError: (error: unknown) => void;
  onCancelled?: () => void;
  debounceMs?: number;
}

const metadataKeys = new Set(['createdAt', 'updatedAt', 'autosaveRevision', 'currentVersionNumber']);

const serialize = (value: unknown): string => JSON.stringify(value);

const editableValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(editableValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !metadataKeys.has(key))
      .map(([key, nested]) => [key, editableValue(nested)]),
  );
};

const editableProject = (project: ImageProject): Record<string, unknown> =>
  editableValue(project) as Record<string, unknown>;

export const sameImageProjectContent = (left: ImageProject, right: ImageProject): boolean =>
  serialize(editableProject(left)) === serialize(editableProject(right));

const sameValue = (left: unknown, right: unknown): boolean => serialize(left) === serialize(right);

const mergeLayers = (
  base: ImageLayer[],
  remote: ImageLayer[],
  local: ImageLayer[],
): ImageLayer[] => {
  const baseById = new Map(base.map((layer) => [layer.id, layer]));
  const remoteById = new Map(remote.map((layer) => [layer.id, layer]));
  const localById = new Map(local.map((layer) => [layer.id, layer]));
  const merged: ImageLayer[] = [];

  // Local ordering/deletions remain authoritative while unchanged layers pick
  // up remote edits. Remote-only layers are appended instead of being lost.
  for (const layer of local) {
    const baseLayer = baseById.get(layer.id);
    const remoteLayer = remoteById.get(layer.id);
    if (!baseLayer) {
      merged.push(layer);
    } else if (!remoteLayer) {
      if (!sameValue(layer, baseLayer)) merged.push(layer);
    } else {
      merged.push(sameValue(layer, baseLayer) ? remoteLayer : layer);
    }
  }
  for (const layer of remote) {
    if (!localById.has(layer.id) && !baseById.has(layer.id)) merged.push(layer);
  }
  return merged;
};

/** Three-way merge that keeps local edits while incorporating non-conflicting remote edits. */
export const mergeImageProjects = (
  base: ImageProject,
  remote: ImageProject,
  local: ImageProject,
): ImageProject => {
  const merged: ImageProject = { ...remote };
  const keys = new Set([...Object.keys(base), ...Object.keys(remote), ...Object.keys(local)]);
  for (const key of keys) {
    if (metadataKeys.has(key) || key === 'layers') continue;
    const baseValue = base[key as keyof ImageProject];
    const localValue = local[key as keyof ImageProject];
    if (!sameValue(localValue, baseValue)) {
      (merged as unknown as Record<string, unknown>)[key] = localValue;
    }
  }
  merged.layers = mergeLayers(base.layers, remote.layers, local.layers);
  merged.createdAt = remote.createdAt;
  merged.updatedAt = remote.updatedAt;
  if (remote.autosaveRevision !== undefined) merged.autosaveRevision = remote.autosaveRevision;
  if (remote.currentVersionNumber !== undefined) merged.currentVersionNumber = remote.currentVersionNumber;
  return merged;
};

const newMutationId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `autosave-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

/**
 * Debounced, single-writer autosave queue. A pending snapshot is replaced by
 * newer edits; conflicts reload the server and retry a three-way merge.
 */
export const createImageProjectAutosaveQueue = (
  options: CreateImageProjectAutosaveQueueOptions,
): ImageProjectAutosaveQueue => {
  const debounceMs = options.debounceMs ?? 500;
  let serverProject = options.initialServerProject;
  let pending: ImageProject | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let active = false;
  let disposed = false;
  let drainPromise: Promise<void> | null = null;
  let conflictSourceProject: ImageProject | null = null;
  let inFlight: ImageProject | null = null;
  let failedSnapshot: ImageProject | null = null;

  const drain = async (): Promise<void> => {
    if (disposed || active) return;
    active = true;
    try {
      while (!disposed && pending) {
        const snapshot = pending;
        pending = null;
        inFlight = snapshot;
        let saved: ImageProject;
        try {
          let lastError: unknown;
          const mutationId = newMutationId();
          for (let attempt = 0; attempt < 3; attempt += 1) {
            try {
              saved = await options.save(snapshot, serverProject.updatedAt, mutationId);
              if (disposed) return;
              break;
            } catch (error) {
              lastError = error;
              if (disposed) return;
              if (error instanceof Error && error.name === 'CreativeProjectConflictError') throw error;
              if (attempt === 2) throw error;
              await new Promise<void>((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
              if (disposed) return;
            }
          }
          if (!saved!) throw lastError;
        } catch (error) {
          const isConflict = error instanceof Error && error.name === 'CreativeProjectConflictError';
          if (!isConflict || !options.reload) {
            conflictSourceProject = null;
            failedSnapshot = snapshot;
            options.onError(error);
            break;
          }
          try {
            const remote = await options.reload(snapshot.id);
            if (disposed) return;
            if (!remote) {
              conflictSourceProject = null;
              failedSnapshot = snapshot;
              options.onError(new Error('No se encontró el proyecto para resolver el conflicto.'));
              break;
            }
            const latestLocal = pending ?? options.getCurrentProject();
            const merged = mergeImageProjects(serverProject, remote, latestLocal);
            serverProject = remote;
            options.onConflictMerge(merged, remote);
            conflictSourceProject = latestLocal;
            pending = merged;
            continue;
          } catch (reloadError) {
            if (disposed) return;
            conflictSourceProject = null;
            failedSnapshot = snapshot;
            options.onError(reloadError);
            break;
          }
        }
        if (disposed) return;
        serverProject = saved!;
        failedSnapshot = null;
        const latestLocal = pending ?? options.getCurrentProject();
        const localChangesWereAlreadyMerged = conflictSourceProject
          ? sameImageProjectContent(latestLocal, conflictSourceProject)
          : false;
        if (
          pending === null &&
          !sameImageProjectContent(latestLocal, snapshot) &&
          !localChangesWereAlreadyMerged
        ) {
          pending = latestLocal;
        }
        conflictSourceProject = null;
        options.onSaved(saved!, snapshot, { hasPendingChanges: pending !== null });
        inFlight = null;
      }
    } finally {
      active = false;
      inFlight = null;
      drainPromise = null;
    }
  };

  const startDrain = (): Promise<void> => {
    if (!drainPromise) drainPromise = drain();
    return drainPromise;
  };

  return {
    enqueue(project) {
      if (disposed) return false;
      // State is also updated with the server acknowledgement. Its metadata
      // (and any nested persistence metadata) must not become a new write.
      if (pending && sameImageProjectContent(project, pending)) return false;
      // A state update caused by an acknowledgement can arrive while the
      // request is in flight. Do not enqueue that same editable snapshot.
      if (inFlight && sameImageProjectContent(project, inFlight)) return false;
      if (pending === null && sameImageProjectContent(project, serverProject)) return false;
      failedSnapshot = null;
      pending = project;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        void startDrain();
      }, debounceMs);
      return true;
    },
    retry() {
      if (disposed || active || !failedSnapshot) return false;
      const retrySnapshot = options.getCurrentProject();
      failedSnapshot = null;
      if (sameImageProjectContent(retrySnapshot, serverProject)) return false;
      pending = retrySnapshot;
      if (timer) clearTimeout(timer);
      timer = null;
      void startDrain();
      return true;
    },
    flush() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      return startDrain();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      pending = null;
      failedSnapshot = null;
      inFlight = null;
      if (timer) clearTimeout(timer);
      timer = null;
      options.onCancelled?.();
    },
  };
};
