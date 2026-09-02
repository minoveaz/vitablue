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

export interface CreativeProjectSaveInput extends Omit<CreateCreativeProjectInput, 'currentVersionNumber' | 'status'> {
  id?: string;
  status?: CreativeProject['status'];
  currentVersionNumber?: number;
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
  constructor(message = 'El proyecto fue modificado en otra sesión.', cause?: unknown) {
    super(message);
    this.name = 'CreativeProjectConflictError';
    if (cause !== undefined) (this as Error & { cause?: unknown }).cause = cause;
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
  name: string;
  description?: string | null;
  type: string;
  status: string;
  current_version_number: number;
  autosave_revision?: number | null;
  draft_document: Record<string, unknown>;
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
  version_number: number;
  document: Record<string, unknown>;
  change_summary?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_by?: string | null;
  updated_at: string;
};

type VariantRow = {
  id: string;
  project_id: string;
  organization_id: string;
  workspace_id: string;
  brand_id: string;
  project_version_id: string;
  key: string;
  channel: string;
  format: string;
  name: string;
  status: string;
  width?: number | null;
  height?: number | null;
  payload: Record<string, unknown>;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Supabase/PostgREST can serialize PostgreSQL timestamptz values with a
 * space separator, UTC offsets, and microseconds (for example
 * `2026-08-28T14:36:07.790123+00:00`). Keep the domain contract strict and
 * normalize only values that carry an explicit timezone and represent a real
 * instant. Canonical LoopDev timestamps are NOT NULL, so null is rejected
 * rather than replaced with an invented date.
 */
export const normalizeSupabaseTimestamp = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Supabase devolvió ${field} sin timestamp.`);
  }
  const withIsoSeparator = value.trim().includes('T')
    ? value.trim()
    : value.trim().replace(' ', 'T');
  const normalized = withIsoSeparator.replace(/\+00(?::?00)?$/, 'Z');
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized)) {
    throw new Error(`Supabase devolvió ${field} sin zona horaria explícita.`);
  }
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Supabase devolvió ${field} con un timestamp inválido.`);
  }
  return parsed.toISOString();
};

type CreativePersistenceErrorDetails = {
  code: string | null;
  status: string | null;
  message: string | null;
  details: string | null;
};

const SENSITIVE_ERROR_KEY = /(?:access[_-]?token|refresh[_-]?token|id[_-]?token|api[_-]?key|service[_-]?role|anon[_-]?key|authorization|password|passwd|secret|credential|token)/i;

const redactSensitiveText = (value: string): string => value
  .replace(/\bBearer\s+[^\s,;]+/gi, 'Bearer [REDACTED]')
  .replace(/([?&](?:access_token|refresh_token|id_token|token|api_key|key|password|secret)=)[^&#\s]+/gi, '$1[REDACTED]')
  .replace(/(\b(?:access[_-]?token|refresh[_-]?token|id[_-]?token|api[_-]?key|service[_-]?role|anon[_-]?key|authorization|password|passwd|secret|credential|token)\b\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,;}"']+)/gi, '$1[REDACTED]')
  .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[REDACTED_TOKEN]');

const toSafeString = (value: unknown): string | null => {
  if (typeof value === 'string' || typeof value === 'number') return redactSensitiveText(String(value));
  return null;
};

const stringifySafeDetails = (value: unknown): string | null => {
  const scalar = toSafeString(value);
  if (scalar !== null || value === null || value === undefined) return scalar;
  try {
    const serialized = JSON.stringify(value, (key, nested) => {
      if (key && SENSITIVE_ERROR_KEY.test(key)) return '[REDACTED]';
      if (typeof nested === 'bigint') return String(nested);
      return typeof nested === 'string' ? redactSensitiveText(nested) : nested;
    });
    return typeof serialized === 'string' ? redactSensitiveText(serialized) : null;
  } catch {
    return '[unserializable details]';
  }
};

export const getCreativePersistenceErrorDetails = (error: unknown): CreativePersistenceErrorDetails => {
  if (!error || typeof error !== 'object') return { code: null, status: null, message: null, details: null };
  const candidate = error as { code?: unknown; status?: unknown; message?: unknown; details?: unknown; cause?: unknown };
  const source = candidate.cause && typeof candidate.cause === 'object' ? candidate.cause as { code?: unknown; status?: unknown; message?: unknown; details?: unknown } : candidate;
  return {
    code: toSafeString(source.code),
    status: toSafeString(source.status),
    message: toSafeString(source.message),
    details: stringifySafeDetails(source.details),
  };
};

export const serializeCreativePersistenceError = (error: unknown): string =>
  JSON.stringify(getCreativePersistenceErrorDetails(error));

const projectFromRow = (row: ProjectRow): CreativeProject =>
  CreativeProjectSchema.parse({
    id: row.id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    brandId: row.brand_id,
    ownerUserId: row.created_by,
    name: row.name,
    description: row.description,
    type: row.type,
    status: row.status,
    currentVersionNumber: row.current_version_number,
    autosaveRevision: row.autosave_revision ?? 0,
    draftDocument: row.draft_document,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: normalizeSupabaseTimestamp(row.created_at, 'created_at'),
    updatedAt: normalizeSupabaseTimestamp(row.updated_at, 'updated_at'),
  });

const versionFromRow = (row: VersionRow): CreativeProjectVersion =>
  CreativeProjectVersionSchema.parse({
    id: row.id,
    projectId: row.project_id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    brandId: row.brand_id,
    versionNumber: row.version_number,
    document: row.document,
    changeSummary: row.change_summary,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: normalizeSupabaseTimestamp(row.created_at, 'created_at'),
    updatedAt: normalizeSupabaseTimestamp(row.updated_at, 'updated_at'),
  });

const variantFromRow = (row: VariantRow): CreativeProjectVariant =>
  CreativeProjectVariantSchema.parse({
    id: row.id,
    projectId: row.project_id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    brandId: row.brand_id,
    projectVersionId: row.project_version_id,
    key: row.key,
    channel: row.channel,
    format: row.format,
    name: row.name,
    status: row.status,
    width: row.width,
    height: row.height,
    payload: row.payload,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: normalizeSupabaseTimestamp(row.created_at, 'created_at'),
    updatedAt: normalizeSupabaseTimestamp(row.updated_at, 'updated_at'),
  });

type FilterableQuery = {
  eq: (column: string, value: unknown) => FilterableQuery;
};

const scopeFilters = (query: FilterableQuery, scope: CreativeScope): FilterableQuery =>
  query.eq('organization_id', scope.organizationId).eq('workspace_id', scope.workspaceId).eq('brand_id', scope.brandId);

const newUuid = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return '00000000-0000-4000-8000-' + Math.random().toString(16).slice(2, 14).padEnd(12, '0');
};

const isConflict = (error: unknown): boolean => {
  const candidate = error as { code?: string; message?: string };
  return candidate?.code === '40001' || candidate?.code === 'P0001' || candidate?.code === 'PGRST116'
    || candidate?.message?.toLowerCase().includes('modified by another client') === true;
};

const isNetworkFailure = (error: unknown): boolean => {
  const candidate = error as { name?: string; message?: string };
  return ['AbortError', 'FetchError', 'TypeError', 'NetworkError'].includes(candidate?.name ?? '')
    || candidate?.message?.toLowerCase().includes('network') === true
    || candidate?.message?.toLowerCase().includes('fetch') === true;
};

const stableComposition = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stableComposition);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== 'createdAt' && key !== 'updatedAt')
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableComposition(item)]),
  );
};

const isSameComposition = (left: Record<string, unknown>, right: Record<string, unknown>): boolean =>
  JSON.stringify(stableComposition(left)) === JSON.stringify(stableComposition(right));

/** Supabase adapter for LoopDev's table/RLS contract (there is no save RPC). */
export const createSupabaseCreativeProjectRepository = (client: SupabaseClient): CreativeProjectRepository => ({
  async list(scope) {
    const query = client.from('marketing_creative_projects').select('*').order('updated_at', { ascending: false });
    const { data, error } = await scopeFilters(query as unknown as FilterableQuery, scope) as unknown as { data: ProjectRow[] | null; error: Error | null };
    if (error) throw error;
    return (data ?? []).map(projectFromRow);
  },

  async get(id, scope) {
    const query = client.from('marketing_creative_projects').select('*').eq('id', id);
    const scoped = scopeFilters(query as unknown as FilterableQuery, scope);
    const { data, error } = await (scoped as unknown as { maybeSingle: () => Promise<{ data: ProjectRow | null; error: Error | null }> }).maybeSingle();
    if (error) throw error;
    return data ? projectFromRow(data) : null;
  },

  async save(input) {
    const parsed = CreateCreativeProjectInputSchema.parse({
      ...input,
      id: undefined,
      currentVersionNumber: 0,
    });
    const id = input.id ?? newUuid();
    let versionNumber = 1;
    const projectValues = {
      id,
      organization_id: parsed.organizationId,
      workspace_id: parsed.workspaceId,
      brand_id: parsed.brandId,
      name: parsed.name,
      description: parsed.description ?? null,
      type: parsed.type,
      status: parsed.status,
      current_version_number: 0,
      autosave_revision: 1,
      autosaved_at: new Date().toISOString(),
      draft_document: parsed.draftDocument,
      created_by: parsed.ownerUserId ?? null,
      updated_by: parsed.ownerUserId ?? null,
    };

    if (!input.id) {
      const { data: created, error: createError } = await client
        .from('marketing_creative_projects')
        .insert(projectValues)
        .select('*')
        .single();
      if (createError) throw createError;
      if (!created) throw new Error('Supabase no devolvió el proyecto creado.');
    } else {
      const current = await this.get(id, {
        organizationId: parsed.organizationId,
        workspaceId: parsed.workspaceId,
        brandId: parsed.brandId,
      });
      if (!current) throw new Error('Proyecto creativo no encontrado.');
      if (input.expectedUpdatedAt && current.updatedAt !== input.expectedUpdatedAt) {
        throw new CreativeProjectConflictError();
      }
      const contentChanged = current.name !== parsed.name
        || (current.description ?? null) !== (parsed.description ?? null)
        || current.type !== parsed.type
        || current.status !== parsed.status
        || !isSameComposition(current.draftDocument, parsed.draftDocument);
      if (!contentChanged) return current;
      versionNumber = current.currentVersionNumber + 1;
      const autosaveRevision = current.autosaveRevision + 1;
      const autosavedAt = new Date().toISOString();
      const { data: updated, error: updateError } = await client
        .from('marketing_creative_projects')
        .update({
          name: parsed.name,
          description: parsed.description ?? null,
          type: parsed.type,
          status: parsed.status,
          draft_document: parsed.draftDocument,
          current_version_number: current.currentVersionNumber + 1,
          autosave_revision: autosaveRevision,
          autosaved_at: autosavedAt,
          updated_by: parsed.ownerUserId ?? null,
          updated_at: autosavedAt,
        })
        .eq('id', id)
        .eq('organization_id', parsed.organizationId)
        .eq('workspace_id', parsed.workspaceId)
        .eq('brand_id', parsed.brandId)
        .eq('autosave_revision', current.autosaveRevision)
        .select('id')
        .single();
      if (updateError) {
        if (isConflict(updateError)) throw new CreativeProjectConflictError(undefined, updateError);
        throw updateError;
      }
      if (!updated) throw new CreativeProjectConflictError();
    }

    const { error: versionError } = await client.from('marketing_creative_project_versions').insert({
      id: newUuid(),
      project_id: id,
      organization_id: parsed.organizationId,
      workspace_id: parsed.workspaceId,
      brand_id: parsed.brandId,
      version_number: versionNumber,
      document: parsed.draftDocument,
      change_summary: input.changeSummary ?? null,
      created_by: parsed.ownerUserId ?? null,
      updated_by: parsed.ownerUserId ?? null,
    });
    if (versionError) {
      if (isConflict(versionError)) throw new CreativeProjectConflictError();
      throw versionError;
    }
    if (!input.id) {
      const { error: finalizeError } = await client
        .from('marketing_creative_projects')
        .update({
          current_version_number: 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('organization_id', parsed.organizationId)
        .eq('workspace_id', parsed.workspaceId)
        .eq('brand_id', parsed.brandId)
        .select('id')
        .single();
      if (finalizeError) throw finalizeError;
    }
    const saved = await this.get(id, {
      organizationId: parsed.organizationId,
      workspaceId: parsed.workspaceId,
      brandId: parsed.brandId,
    });
    if (!saved) throw new Error('Supabase no devolvió el proyecto guardado.');
    return saved;
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
    void id;
    void scope;
    throw new Error('LoopDev no admite DELETE de proyectos creativos; archiva el proyecto para retirarlo.');
  },

  async listVersions(projectId, scope) {
    const query = client.from('marketing_creative_project_versions').select('*')
      .eq('project_id', projectId).order('version_number', { ascending: false });
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
    const query = client.from('marketing_creative_variants').insert({
      id: parsed.id,
      project_id: parsed.projectId,
      organization_id: parsed.organizationId,
      workspace_id: parsed.workspaceId,
      brand_id: parsed.brandId,
      project_version_id: parsed.projectVersionId,
      key: parsed.key,
      channel: parsed.channel,
      format: parsed.format,
      name: parsed.name,
      status: parsed.status,
      width: parsed.width ?? null,
      height: parsed.height ?? null,
      payload: parsed.payload,
      created_by: parsed.createdBy ?? null,
      updated_by: parsed.updatedBy ?? null,
    });
    const scoped = scopeFilters(query as unknown as FilterableQuery, scope);
    const { data, error } = await (scoped as unknown as { select: (columns: string) => { single: () => Promise<{ data: VariantRow | null; error: Error | null }> } }).select('*').single();
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

const snapshotOf = (project: Pick<CreativeProject, 'name' | 'type' | 'draftDocument'>): string =>
  JSON.stringify({
    schemaVersion: 1,
    name: project.name,
    type: project.type,
    document: project.draftDocument,
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
    const parsed = CreateCreativeProjectInputSchema.parse({ ...input, currentVersionNumber: 0 });
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
      currentVersionNumber: contentChanged ? (current?.currentVersionNumber ?? 0) + 1 : current?.currentVersionNumber ?? 0,
      autosaveRevision: contentChanged ? (current?.autosaveRevision ?? 0) + 1 : current?.autosaveRevision ?? 0,
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
        versionNumber: next.currentVersionNumber,
        document: next.draftDocument,
        changeSummary: input.changeSummary,
        clientMutationId: input.clientMutationId,
        createdBy: next.createdBy,
        updatedBy: next.updatedBy,
        createdAt: now,
        updatedAt: now,
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
    return [...localVersions.values()].filter((version) => version.projectId === projectId).sort((a, b) => b.versionNumber - a.versionNumber);
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
 * A failed remote write is intentionally not retried here. LoopDev's canonical
 * version table has no client idempotency key, so a retry can create a version.
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
