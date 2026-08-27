import type { SupabaseClient } from '@supabase/supabase-js';
import {
  CreateCreativeProjectInputSchema,
  CreativeProjectSchema,
  CreativeProjectVariantSchema,
  CreativeProjectVersionSchema,
  CreativeScope,
  type CreateCreativeProjectInput,
  type CreativeProject,
  type CreativeProjectVariant,
  type CreativeProjectVersion,
  type UpdateCreativeProjectInput,
} from '../contracts/creativePersistence';

export interface CreativeProjectSaveInput extends Omit<CreateCreativeProjectInput, 'currentVersion' | 'status' | 'metadata'> {
  id?: string;
  status?: CreativeProject['status'];
  metadata?: CreativeProject['metadata'];
  expectedUpdatedAt?: string;
  changeSummary?: string | null;
  clientMutationId?: string;
}

export interface CreativeProjectRepository {
  list(scope: CreativeScope): Promise<CreativeProject[]>;
  get(id: string, scope: CreativeScope): Promise<CreativeProject | null>;
  save(input: CreativeProjectSaveInput): Promise<CreativeProject>;
  update(id: string, input: UpdateCreativeProjectInput, scope: CreativeScope): Promise<CreativeProject>;
  remove(id: string, scope: CreativeScope): Promise<void>;
  listVersions(projectId: string, scope: CreativeScope): Promise<CreativeProjectVersion[]>;
  listVariants(projectId: string, scope: CreativeScope): Promise<CreativeProjectVariant[]>;
  saveVariant(variant: CreativeProjectVariant, scope: CreativeScope): Promise<CreativeProjectVariant>;
  removeVariant(id: string, projectId: string, scope: CreativeScope): Promise<void>;
}

export class CreativeProjectConflictError extends Error {
  constructor(message = 'El proyecto fue modificado en otra sesión.') {
    super(message);
    this.name = 'CreativeProjectConflictError';
  }
}

export class CreativeProjectOfflineError extends Error {
  constructor(message = 'Supabase no está disponible; el cambio quedó guardado localmente.') {
    super(message);
    this.name = 'CreativeProjectOfflineError';
  }
}

type ProjectRow = {
  id: string;
  organization_id: string;
  workspace_id: string;
  brand_id: string;
  owner_user_id?: string | null;
  campaign_id?: string | null;
  name: string;
  creative_type: string;
  status: string;
  current_version: number;
  composition: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
};

type VersionRow = {
  id: string;
  project_id: string;
  organization_id: string;
  workspace_id: string;
  brand_id: string;
  version: number;
  snapshot: Record<string, unknown>;
  change_summary?: string | null;
  client_mutation_id?: string | null;
  created_by?: string | null;
  created_at: string;
};

type VariantRow = {
  id: string;
  project_id: string;
  organization_id: string;
  workspace_id: string;
  brand_id: string;
  source_version: number;
  kind: string;
  name: string;
  status: string;
  platform?: string | null;
  aspect_ratio?: string | null;
  width?: number | null;
  height?: number | null;
  overrides: Record<string, unknown>;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
};

const projectFromRow = (row: ProjectRow): CreativeProject =>
  CreativeProjectSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    brandId: row.brand_id,
    ownerUserId: row.owner_user_id,
    campaignId: row.campaign_id,
    name: row.name,
    creativeType: row.creative_type,
    status: row.status,
    currentVersion: row.current_version,
    composition: row.composition,
    metadata: row.metadata,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

const versionFromRow = (row: VersionRow): CreativeProjectVersion =>
  CreativeProjectVersionSchema.parse({
    id: row.id,
    projectId: row.project_id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    brandId: row.brand_id,
    version: row.version,
    snapshot: row.snapshot,
    changeSummary: row.change_summary,
    createdBy: row.created_by,
    createdAt: row.created_at,
  });

const variantFromRow = (row: VariantRow): CreativeProjectVariant =>
  CreativeProjectVariantSchema.parse({
    id: row.id,
    projectId: row.project_id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    brandId: row.brand_id,
    sourceVersion: row.source_version,
    kind: row.kind,
    name: row.name,
    status: row.status,
    platform: row.platform,
    aspectRatio: row.aspect_ratio,
    width: row.width,
    height: row.height,
    overrides: row.overrides,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });

type FilterableQuery = {
  eq: (column: string, value: string) => FilterableQuery;
};

const scopeFilters = (query: FilterableQuery, scope: CreativeScope): FilterableQuery =>
  query.eq('organization_id', scope.organizationId).eq('workspace_id', scope.workspaceId).eq('brand_id', scope.brandId);

const newUuid = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return '00000000-0000-4000-8000-' + Math.random().toString(16).slice(2, 14).padEnd(12, '0');
};

const isConflict = (error: unknown): boolean => {
  const candidate = error as { code?: string; message?: string };
  return candidate?.code === '40001' || candidate?.code === 'P0001'
    || candidate?.message?.toLowerCase().includes('modified by another client') === true;
};

const isNetworkFailure = (error: unknown): boolean => {
  const candidate = error as { name?: string; message?: string };
  return ['AbortError', 'FetchError', 'TypeError', 'NetworkError'].includes(candidate?.name ?? '')
    || candidate?.message?.toLowerCase().includes('network') === true
    || candidate?.message?.toLowerCase().includes('fetch') === true;
};

/**
 * Supabase adapter. The browser must only use the publishable client; RLS and
 * `save_marketing_creative_project` perform the authorization and atomic save.
 */
export const createSupabaseCreativeProjectRepository = (client: SupabaseClient): CreativeProjectRepository => ({
  async list(scope) {
    const query = client.from('marketing_creative_projects').select('*').order('updated_at', { ascending: false });
    const { data, error } = await scopeFilters(query as unknown as FilterableQuery, scope) as unknown as { data: ProjectRow[] | null; error: Error | null };
    if (error) throw error;
    return (data ?? []).map(projectFromRow);
  },

  async get(id, scope) {
    const query = client.from('marketing_creative_projects').select('*').eq('id', id).maybeSingle();
    const { data, error } = await scopeFilters(query as unknown as FilterableQuery, scope) as unknown as { data: ProjectRow | null; error: Error | null };
    if (error) throw error;
    return data ? projectFromRow(data) : null;
  },

  async save(input) {
    const parsed = CreateCreativeProjectInputSchema.parse({
      ...input,
      id: undefined,
      currentVersion: 1,
    });
    const id = input.id ?? newUuid();
    const { data, error } = await client.rpc('save_marketing_creative_project', {
      p_project_id: id,
      p_organization_id: parsed.organizationId,
      p_workspace_id: parsed.workspaceId,
      p_brand_id: parsed.brandId,
      p_owner_user_id: parsed.ownerUserId ?? null,
      p_campaign_id: parsed.campaignId ?? null,
      p_name: parsed.name,
      p_creative_type: parsed.creativeType,
      p_status: parsed.status,
      p_composition: parsed.composition,
      p_metadata: parsed.metadata,
      p_expected_updated_at: input.expectedUpdatedAt ?? null,
      p_change_summary: input.changeSummary ?? null,
      p_client_mutation_id: input.clientMutationId ?? null,
    });
    if (error) {
      if (isConflict(error)) throw new CreativeProjectConflictError();
      throw error;
    }
    if (!data || typeof data !== 'object') throw new Error('Supabase no devolvió el proyecto guardado.');
    return projectFromRow(data as ProjectRow);
  },

  async update(id, input, scope) {
    const current = await this.get(id, scope);
    if (!current) throw new Error('Proyecto creativo no encontrado.');
    return this.save({
      ...current,
      ...input,
      id,
      organizationId: current.organizationId,
      workspaceId: current.workspaceId,
      brandId: current.brandId,
      expectedUpdatedAt: input.expectedUpdatedAt ?? current.updatedAt,
    });
  },

  async remove(id, scope) {
    const query = client.from('marketing_creative_projects').delete().eq('id', id);
    const { error } = await scopeFilters(query as unknown as FilterableQuery, scope) as unknown as { error: Error | null };
    if (error) throw error;
  },

  async listVersions(projectId, scope) {
    const query = client.from('marketing_creative_project_versions').select('*')
      .eq('project_id', projectId).order('version', { ascending: false });
    const { data, error } = await scopeFilters(query as unknown as FilterableQuery, scope) as unknown as { data: VersionRow[] | null; error: Error | null };
    if (error) throw error;
    return (data ?? []).map(versionFromRow);
  },

  async listVariants(projectId, scope) {
    const query = client.from('marketing_creative_variants').select('*')
      .eq('project_id', projectId).order('updated_at', { ascending: false });
    const { data, error } = await scopeFilters(query as unknown as FilterableQuery, scope) as unknown as { data: VariantRow[] | null; error: Error | null };
    if (error) throw error;
    return (data ?? []).map(variantFromRow);
  },

  async saveVariant(variant, scope) {
    const parsed = CreativeProjectVariantSchema.parse(variant);
    const query = client.from('marketing_creative_variants').upsert({
      id: parsed.id,
      project_id: parsed.projectId,
      organization_id: parsed.organizationId,
      workspace_id: parsed.workspaceId,
      brand_id: parsed.brandId,
      source_version: parsed.sourceVersion,
      kind: parsed.kind,
      name: parsed.name,
      status: parsed.status,
      platform: parsed.platform ?? null,
      aspect_ratio: parsed.aspectRatio ?? null,
      width: parsed.width ?? null,
      height: parsed.height ?? null,
      overrides: parsed.overrides,
      updated_at: parsed.updatedAt,
    }).select('*').single();
    const { data, error } = await scopeFilters(query as unknown as FilterableQuery, scope) as unknown as { data: VariantRow | null; error: Error | null };
    if (error) throw error;
    if (!data) throw new Error('Supabase no devolvió la variante guardada.');
    return variantFromRow(data);
  },

  async removeVariant(id, projectId, scope) {
    const query = client.from('marketing_creative_variants').delete().eq('id', id).eq('project_id', projectId);
    const { error } = await scopeFilters(query as unknown as FilterableQuery, scope) as unknown as { error: Error | null };
    if (error) throw error;
  },
});

interface LocalRecord extends CreativeProject {
  clientMutationId?: string;
}

const CREATIVE_DB_NAME = 'vitablue_creative_studio_db';
const CREATIVE_DB_VERSION = 1;
const CREATIVE_PROJECT_STORE = 'projects';
const CREATIVE_VERSION_STORE = 'versions';
const CREATIVE_VARIANT_STORE = 'variants';
const CREATIVE_LOCAL_STORAGE_KEY = 'vitablue.creative.projects';

const localProjects = new Map<string, LocalRecord>();
const localVersions = new Map<string, CreativeProjectVersion & { clientMutationId?: string }>();
const localVariants = new Map<string, CreativeProjectVariant>();
let localDbPromise: Promise<IDBDatabase> | null = null;
let localDbHydrated = false;

const openLocalDb = (): Promise<IDBDatabase> => {
  if (localDbPromise) return localDbPromise;
  if (typeof indexedDB === 'undefined') return Promise.reject(new CreativeProjectOfflineError());
  localDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(CREATIVE_DB_NAME, CREATIVE_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CREATIVE_PROJECT_STORE)) db.createObjectStore(CREATIVE_PROJECT_STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(CREATIVE_VERSION_STORE)) db.createObjectStore(CREATIVE_VERSION_STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(CREATIVE_VARIANT_STORE)) db.createObjectStore(CREATIVE_VARIANT_STORE, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('No se pudo abrir IndexedDB.'));
  });
  return localDbPromise;
};

const idbWrite = async (storeName: string, value: object): Promise<void> => {
  const db = await openLocalDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

const idbReadAll = async <T>(storeName: string): Promise<T[]> => {
  const db = await openLocalDb();
  return new Promise<T[]>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
};

const idbDelete = async (storeName: string, id: string): Promise<void> => {
  const db = await openLocalDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

const loadLocalStorageProjects = (): void => {
  if (typeof localStorage === 'undefined' || localProjects.size > 0) return;
  try {
    const value = JSON.parse(localStorage.getItem(CREATIVE_LOCAL_STORAGE_KEY) ?? '[]') as
      | LocalRecord[]
      | { projects?: LocalRecord[]; versions?: (CreativeProjectVersion & { clientMutationId?: string })[]; variants?: CreativeProjectVariant[] };
    if (Array.isArray(value)) {
      value.forEach((project) => localProjects.set(project.id, project));
    } else {
      value.projects?.forEach((project) => localProjects.set(project.id, project));
      value.versions?.forEach((version) => localVersions.set(version.id, version));
      value.variants?.forEach((variant) => localVariants.set(variant.id, variant));
    }
  } catch {
    // A corrupt offline cache must not prevent a new local draft.
  }
};

const persistLocalCache = (): void => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(CREATIVE_LOCAL_STORAGE_KEY, JSON.stringify({
      projects: [...localProjects.values()],
      versions: [...localVersions.values()],
      variants: [...localVariants.values()],
    }));
  } catch {
    // IndexedDB remains the durable offline store when localStorage is full.
  }
};

const hydrateLocalStore = async (): Promise<void> => {
  if (localDbHydrated) return;
  loadLocalStorageProjects();
  try {
    const [projects, versions, variants] = await Promise.all([
      idbReadAll<LocalRecord>(CREATIVE_PROJECT_STORE),
      idbReadAll<CreativeProjectVersion & { clientMutationId?: string }>(CREATIVE_VERSION_STORE),
      idbReadAll<CreativeProjectVariant>(CREATIVE_VARIANT_STORE),
    ]);
    projects.forEach((project) => localProjects.set(project.id, project));
    versions.forEach((version) => localVersions.set(version.id, version));
    variants.forEach((variant) => localVariants.set(variant.id, variant));
  } catch {
    // IndexedDB is unavailable in SSR/private browsing; localStorage/memory remain valid.
  }
  localDbHydrated = true;
};

const persistLocalProject = async (project: LocalRecord): Promise<void> => {
  localProjects.set(project.id, project);
  persistLocalCache();
  try {
    await idbWrite(CREATIVE_PROJECT_STORE, project);
  } catch {
    persistLocalCache();
  }
};

const snapshotOf = (project: Pick<CreativeProject, 'name' | 'creativeType' | 'composition' | 'metadata'>): string =>
  JSON.stringify({
    schemaVersion: 1,
    name: project.name,
    creativeType: project.creativeType,
    composition: project.composition,
    metadata: project.metadata,
  });

const nextTimestamp = (previous: string | undefined): string => {
  const now = Date.now();
  const previousTime = previous ? Date.parse(previous) : Number.NaN;
  return new Date(Number.isFinite(previousTime) && previousTime >= now ? previousTime + 1 : now).toISOString();
};

export const createIndexedDbCreativeProjectRepository = (): CreativeProjectRepository => ({
  async list(scope) {
    await hydrateLocalStore();
    return [...localProjects.values()]
      .filter((project) => project.organizationId === scope.organizationId && project.workspaceId === scope.workspaceId && project.brandId === scope.brandId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  async get(id, scope) {
    await hydrateLocalStore();
    const project = localProjects.get(id);
    return project && project.organizationId === scope.organizationId && project.workspaceId === scope.workspaceId && project.brandId === scope.brandId
      ? project : null;
  },
  async save(input) {
    await hydrateLocalStore();
    const parsed = CreateCreativeProjectInputSchema.parse({ ...input, currentVersion: 1 });
    const id = input.id ?? newUuid();
    const current = localProjects.get(id);
    const duplicate = input.clientMutationId && [...localVersions.values()].find((version) => version.clientMutationId === input.clientMutationId);
    if (duplicate && current) return current;
    if (current && input.expectedUpdatedAt && current.updatedAt !== input.expectedUpdatedAt) throw new CreativeProjectConflictError();
    const contentChanged = !current || snapshotOf(current) !== snapshotOf(parsed);
    const now = nextTimestamp(current?.updatedAt);
    const next: LocalRecord = {
      ...parsed,
      id,
      currentVersion: contentChanged ? (current?.currentVersion ?? 0) + 1 : current.currentVersion,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
      createdBy: current?.createdBy,
      updatedBy: current?.updatedBy,
    };
    await persistLocalProject(next);
    if (contentChanged) {
      const version: CreativeProjectVersion & { clientMutationId?: string } = {
        id: newUuid(),
        projectId: id,
        organizationId: next.organizationId,
        workspaceId: next.workspaceId,
        brandId: next.brandId,
        version: next.currentVersion,
        snapshot: JSON.parse(snapshotOf(next)) as CreativeProjectVersion['snapshot'],
        changeSummary: input.changeSummary,
        clientMutationId: input.clientMutationId,
        createdAt: now,
      };
      localVersions.set(version.id, version);
      try { await idbWrite(CREATIVE_VERSION_STORE, version); } catch { /* local memory is still available */ }
      persistLocalCache();
    }
    return next;
  },
  async update(id, input, scope) {
    const current = await this.get(id, scope);
    if (!current) throw new Error('Proyecto creativo no encontrado.');
    return this.save({ ...current, ...input, id, expectedUpdatedAt: input.expectedUpdatedAt ?? current.updatedAt });
  },
  async remove(id, scope) {
    await hydrateLocalStore();
    const current = await this.get(id, scope);
    if (!current) return;
    localProjects.delete(id);
    const versions = [...localVersions.values()].filter((version) => version.projectId === id);
    const variants = [...localVariants.values()].filter((variant) => variant.projectId === id);
    versions.forEach((version) => localVersions.delete(version.id));
    variants.forEach((variant) => localVariants.delete(variant.id));
    persistLocalCache();
    try {
      await idbDelete(CREATIVE_PROJECT_STORE, id);
      await Promise.all([
        ...versions.map((version) => idbDelete(CREATIVE_VERSION_STORE, version.id)),
        ...variants.map((variant) => idbDelete(CREATIVE_VARIANT_STORE, variant.id)),
      ]);
    } catch {
      // Memory/localStorage deletion is still applied when IndexedDB is unavailable.
    }
  },
  async listVersions(projectId, scope) {
    await hydrateLocalStore();
    const project = await this.get(projectId, scope);
    if (!project) return [];
    return [...localVersions.values()].filter((version) => version.projectId === projectId).sort((a, b) => b.version - a.version);
  },
  async listVariants(projectId, scope) {
    await hydrateLocalStore();
    const project = await this.get(projectId, scope);
    if (!project) return [];
    return [...localVariants.values()].filter((variant) => variant.projectId === projectId);
  },
  async saveVariant(variant, scope) {
    await hydrateLocalStore();
    const project = await this.get(variant.projectId, scope);
    if (!project) throw new Error('Proyecto creativo no encontrado.');
    const parsed = CreativeProjectVariantSchema.parse(variant);
    localVariants.set(parsed.id, parsed);
    try { await idbWrite(CREATIVE_VARIANT_STORE, parsed); } catch { /* local memory is still available */ }
    persistLocalCache();
    return parsed;
  },
  async removeVariant(id, projectId, scope) {
    await hydrateLocalStore();
    const project = await this.get(projectId, scope);
    if (!project) return;
    localVariants.delete(id);
    persistLocalCache();
  },
});

/**
 * Remote-first repository with an offline IndexedDB/localStorage queue.
 * A failed remote write is intentionally not retried here: callers can retry
 * with the same clientMutationId, preventing duplicate versions.
 */
export const createResilientCreativeProjectRepository = (
  remote: CreativeProjectRepository,
  offline = createIndexedDbCreativeProjectRepository(),
): CreativeProjectRepository => ({
  async list(scope) {
    try { return await remote.list(scope); } catch (error) {
      if (!isNetworkFailure(error)) throw error;
      return offline.list(scope);
    }
  },
  async get(id, scope) {
    try { return await remote.get(id, scope); } catch (error) {
      if (!isNetworkFailure(error)) throw error;
      return offline.get(id, scope);
    }
  },
  async save(input) {
    try { return await remote.save(input); } catch (error) {
      if (error instanceof CreativeProjectConflictError || !isNetworkFailure(error)) throw error;
      return offline.save(input);
    }
  },
  async update(id, input, scope) {
    try { return await remote.update(id, input, scope); } catch (error) {
      if (error instanceof CreativeProjectConflictError || !isNetworkFailure(error)) throw error;
      return offline.update(id, input, scope);
    }
  },
  async remove(id, scope) {
    try { return await remote.remove(id, scope); } catch (error) {
      if (!isNetworkFailure(error)) throw error;
      return offline.remove(id, scope);
    }
  },
  async listVersions(id, scope) {
    try { return await remote.listVersions(id, scope); } catch (error) {
      if (!isNetworkFailure(error)) throw error;
      return offline.listVersions(id, scope);
    }
  },
  async listVariants(id, scope) {
    try { return await remote.listVariants(id, scope); } catch (error) {
      if (!isNetworkFailure(error)) throw error;
      return offline.listVariants(id, scope);
    }
  },
  async saveVariant(variant, scope) {
    try { return await remote.saveVariant(variant, scope); } catch (error) {
      if (!isNetworkFailure(error)) throw error;
      return offline.saveVariant(variant, scope);
    }
  },
  async removeVariant(id, projectId, scope) {
    try { return await remote.removeVariant(id, projectId, scope); } catch (error) {
      if (!isNetworkFailure(error)) throw error;
      return offline.removeVariant(id, projectId, scope);
    }
  },
});
