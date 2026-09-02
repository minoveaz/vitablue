import type { SupabaseClient, User } from '@supabase/supabase-js';
import {
  CreateCreativeProjectInputSchema,
  CreativeAssetSchema,
  type CreativeAsset,
  type CreativeProject,
  type CreativeScope,
} from '../contracts/creativePersistence';
import type { ImageProject } from '../types/imageStudio';
import {
  createSupabaseCreativeProjectRepository,
  CreativeProjectConflictError,
  getCreativePersistenceErrorDetails,
  normalizeSupabaseTimestamp,
  type CreativeProjectRepository,
} from './creativeProjectRepository';
import { supabase } from './supabaseClient';

export const CREATIVE_BUCKET = 'marketing-creative';
// Kept as aliases for callers that distinguish the asset purpose. LoopDev
// uses one private bucket and scopes objects by the path's kind segment.
export const CREATIVE_SOURCE_BUCKET = CREATIVE_BUCKET;
export const CREATIVE_EXPORT_BUCKET = CREATIVE_BUCKET;
export const CREATIVE_FONT_BUCKET = CREATIVE_BUCKET;
/** Persist this opaque reference in compositions; signed URLs are runtime-only. */
export const CREATIVE_ASSET_REFERENCE_PREFIX = 'creative-asset:';

export class CreativeStudioScopeError extends Error {
  constructor(message = 'No se encontró una organización, workspace y marca disponibles para tu sesión.') {
    super(message);
    this.name = 'CreativeStudioScopeError';
  }
}

const isUuid = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export const isCreativeProjectId = (value: unknown): value is string => isUuid(value);

export const getCreativeProjectSaveId = (
  projectId: string | undefined,
  createNew = false,
): string | undefined => (createNew || !isUuid(projectId) ? undefined : projectId);

type MembershipRow = { organization_id: string; status?: string | null };
type WorkspaceRow = { id: string; organization_id: string; status?: string | null };
type WorkspaceBrandRow = { workspace_id: string; organization_id: string; brand_id: string };
type BrandRow = { id: string; organization_id: string };

const readRows = async <T>(query: PromiseLike<{ data: T[] | null; error: unknown | null }>): Promise<T[]> => {
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

const safeErrorCode = (error: unknown): string | null => {
  if (!error || typeof error !== 'object') return null;
  const candidate = error as { code?: unknown; status?: unknown; name?: unknown };
  for (const value of [candidate.code, candidate.status, candidate.name]) {
    if (typeof value === 'string' || typeof value === 'number') return String(value);
  }
  return null;
};

/**
 * LoopDev's local Supabase auth does not put tenancy in JWT claims. Resolve a
 * usable marketing scope through RLS-visible membership, workspace and brand
 * rows instead. The permission decision remains in LoopDev's RLS policies and
 * `has_organization_permission`, not in this client-side selection.
 */
const scopeFromMembership = async (client: SupabaseClient, user: User): Promise<CreativeScope> => {
  const memberships = await readRows<MembershipRow>(
    client.from('organization_memberships')
      .select('organization_id,status')
      .eq('user_id', user.id)
      .eq('status', 'active'),
  );
  const organizationIds = memberships
    .map((membership) => membership.organization_id)
    .filter(isUuid)
    .sort();
  if (!organizationIds.length) {
    throw new CreativeStudioScopeError('Tu usuario no tiene una membresía activa en LoopDev.');
  }

  const workspaces = await readRows<WorkspaceRow>(
    client.from('workspaces')
      .select('id,organization_id,status')
      .in('organization_id', organizationIds)
      .eq('suite_key', 'marketing')
      .eq('status', 'active'),
  );
  const usableWorkspaces = workspaces
    .filter((workspace) => isUuid(workspace.id) && organizationIds.includes(workspace.organization_id))
    .sort((left, right) => left.organization_id.localeCompare(right.organization_id) || left.id.localeCompare(right.id));
  if (!usableWorkspaces.length) {
    throw new CreativeStudioScopeError('Tu organización no tiene un workspace de Marketing activo.');
  }

  const workspaceIds = usableWorkspaces.map((workspace) => workspace.id);
  const [workspaceBrands, brands] = await Promise.all([
    readRows<WorkspaceBrandRow>(
      client.from('workspace_brands')
        .select('workspace_id,organization_id,brand_id')
        .in('workspace_id', workspaceIds),
    ),
    readRows<BrandRow>(
      client.from('brands')
        .select('id,organization_id')
        .in('organization_id', organizationIds),
    ),
  ]);
  const validBrands = brands
    .filter((brand) => isUuid(brand.id) && organizationIds.includes(brand.organization_id))
    .sort((left, right) => left.organization_id.localeCompare(right.organization_id) || left.id.localeCompare(right.id));

  for (const workspace of usableWorkspaces) {
    const workspaceLinks = workspaceBrands
      .filter((link) => link.workspace_id === workspace.id && link.organization_id === workspace.organization_id);
    const linkedBrandIds = workspaceLinks
      .filter((link) => isUuid(link.brand_id))
      .map((link) => link.brand_id)
      .sort();
    const brandId = workspaceLinks.length > 0
      ? linkedBrandIds.find((id) => validBrands.some((brand) => brand.id === id && brand.organization_id === workspace.organization_id))
      : validBrands.find((brand) => brand.organization_id === workspace.organization_id)?.id;
    if (brandId) {
      return { organizationId: workspace.organization_id, workspaceId: workspace.id, brandId };
    }
  }

  throw new CreativeStudioScopeError('Tu workspace de Marketing no tiene una marca disponible.');
};

export const getCreativeScope = async (client: SupabaseClient = supabase): Promise<{ scope: CreativeScope; user: User }> => {
  const { data: userData, error: userError } = await client.auth.getUser();
  const user = userData?.user;
  if (userError || !user) {
    throw new CreativeStudioScopeError('No se pudo validar tu sesión.');
  }
  try {
    return { scope: await scopeFromMembership(client, user), user };
  } catch (error) {
    if (error instanceof CreativeStudioScopeError) throw error;
    const code = safeErrorCode(error);
    throw new CreativeStudioScopeError(
      import.meta.env.DEV && code
        ? `No se pudo resolver el scope de LoopDev (${code}).`
        : 'No se pudo resolver el scope de LoopDev.',
    );
  }
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const signedAssetReferences = new Map<string, string>();

const mapKnownSignedUrls = <T>(value: T): T => {
  if (typeof value === 'string') {
    let mapped = value as string;
    signedAssetReferences.forEach((reference, signedUrl) => {
      mapped = mapped.split(signedUrl).join(reference);
    });
    return mapped as unknown as T;
  }
  if (Array.isArray(value)) return value.map((item) => mapKnownSignedUrls(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapKnownSignedUrls(item)])) as T;
  }
  return value;
};

const mapValues = async (
  value: unknown,
  map: (candidate: string) => Promise<string | undefined> | string | undefined,
): Promise<unknown> => {
  if (typeof value === 'string') return (await map(value)) ?? value;
  if (Array.isArray(value)) return Promise.all(value.map((item) => mapValues(item, map)));
  if (value && typeof value === 'object') {
    const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await mapValues(item, map)] as const));
    return Object.fromEntries(entries);
  }
  return value;
};

const containsInline = (value: unknown): boolean => {
  if (typeof value === 'string') return /^(?:data:|blob:)/i.test(value);
  if (Array.isArray(value)) return value.some(containsInline);
  if (value && typeof value === 'object') return Object.values(value).some(containsInline);
  return false;
};

const imageStudioComposition = (project: ImageProject): Record<string, unknown> => {
  const copy = mapKnownSignedUrls(clone(project)) as unknown as Record<string, unknown>;
  if (containsInline(copy)) {
    throw new Error('Sube las imágenes al Storage privado antes de guardar el proyecto.');
  }
  // Audit timestamps belong to the project row, not the editable document.
  delete copy.createdAt;
  delete copy.updatedAt;
  delete copy.currentVersionNumber;
  delete copy.autosaveRevision;
  return { schemaVersion: 1, imageStudio: copy };
};

const replaceInlinePayloads = async (value: unknown, projectId: string, client: SupabaseClient): Promise<unknown> => {
  if (typeof value === 'string') {
    if (!/^(?:data:|blob:)/i.test(value)) return value;
    const blob = await (await fetch(value)).blob();
    const asset = await uploadCreativeAsset({
      file: blob,
      name: `migrated-${projectId}.bin`,
      mimeType: blob.type || 'application/octet-stream',
      projectId,
    }, client);
    return asset.signedUrl;
  }
  if (Array.isArray(value)) return Promise.all(value.map((item) => replaceInlinePayloads(item, projectId, client)));
  if (value && typeof value === 'object') {
    const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => [key, await replaceInlinePayloads(item, projectId, client)] as const));
    return Object.fromEntries(entries);
  }
  return value;
};

const imageProjectFromCreative = (project: CreativeProject): ImageProject => {
  const composition = project.draftDocument as Record<string, unknown> & { imageStudio?: ImageProject };
  const creativeStatus = project.status === 'approved' ? 'ready' : project.status === 'in_review' ? 'draft' : project.status;
  if (composition.imageStudio) {
    return {
      ...clone(composition.imageStudio),
      id: project.id,
      title: project.name,
      creativeStatus,
      currentVersionNumber: project.currentVersionNumber,
      autosaveRevision: project.autosaveRevision,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

  }
  return {
    id: project.id,
    title: project.name,
    creativeStatus,
    currentVersionNumber: project.currentVersionNumber,
    autosaveRevision: project.autosaveRevision,
    preset: (composition.preset ?? {}) as ImageProject['preset'],
    background: (composition.background ?? { type: 'solid', color: '#001219' }) as ImageProject['background'],
    layers: (composition.layers ?? []) as ImageProject['layers'],
    brandTokens: (composition.brandTokens ?? {}) as ImageProject['brandTokens'],
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

const resolveAssetReferences = async (
  project: ImageProject,
  client: SupabaseClient,
): Promise<ImageProject> => {
  const references = new Set<string>();
  const collect = (value: unknown): void => {
    if (typeof value === 'string' && value.startsWith(CREATIVE_ASSET_REFERENCE_PREFIX)) {
      references.add(value.slice(CREATIVE_ASSET_REFERENCE_PREFIX.length));
    } else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  collect(project);
  if (!references.size) return project;
  const { data, error } = await client.from('marketing_creative_assets')
    .select('id,storage_path')
    .in('id', [...references]);
  if (error) throw error;
  const rows = (data ?? []) as Array<{ id: string; storage_path: string }>;
  const urls = new Map<string, string>();
  await Promise.all(rows.map(async (row) => {
    const { data: signed, error: signedError } = await client.storage.from(CREATIVE_BUCKET).createSignedUrl(row.storage_path, 3600);
    if (!signedError && signed?.signedUrl) {
      urls.set(`${CREATIVE_ASSET_REFERENCE_PREFIX}${row.id}`, signed.signedUrl);
      signedAssetReferences.set(signed.signedUrl, `${CREATIVE_ASSET_REFERENCE_PREFIX}${row.id}`);
    }
  }));
  return await mapValues(project, (candidate) => {
    if (urls.has(candidate)) return urls.get(candidate);
    let mapped = candidate;
    urls.forEach((signedUrl, reference) => {
      mapped = mapped.split(reference).join(signedUrl);
    });
    return mapped === candidate ? undefined : mapped;
  }) as ImageProject;
};

/** LoopDev stores the canonical creative type/status vocabulary. */
const canonicalProjectType = (_project: ImageProject): 'social_post' => 'social_post';
const canonicalProjectStatus = (status: ImageProject['creativeStatus']): 'draft' | 'approved' | 'archived' =>
  status === 'ready' ? 'approved' : status ?? 'draft';

const repositoryFor = (client: SupabaseClient): CreativeProjectRepository =>
  createSupabaseCreativeProjectRepository(client);

export const listCreativeProjects = async (client: SupabaseClient = supabase): Promise<ImageProject[]> => {
  const { scope } = await getCreativeScope(client);
  const rows = await repositoryFor(client).list(scope);
  return Promise.all(rows.map((row) => resolveAssetReferences(imageProjectFromCreative(row), client)));
};

export const getCreativeProject = async (id: string, client: SupabaseClient = supabase): Promise<ImageProject | null> => {
  const { scope } = await getCreativeScope(client);
  const row = await repositoryFor(client).get(id, scope);
  return row ? resolveAssetReferences(imageProjectFromCreative(row), client) : null;
};

export const saveCreativeProject = async (
  project: ImageProject,
  options: {
    expectedUpdatedAt?: string;
    changeSummary?: string | null;
    clientMutationId?: string;
    createNew?: boolean;
  } = {},
  client: SupabaseClient = supabase,
): Promise<ImageProject> => {
  const { scope, user } = await getCreativeScope(client);
  const persistedId = getCreativeProjectSaveId(project.id, options.createNew);
  const input = CreateCreativeProjectInputSchema.parse({
    id: persistedId,
    ...scope,
    ownerUserId: user.id,
    name: project.title,
    type: canonicalProjectType(project),
    status: canonicalProjectStatus(project.creativeStatus),
    draftDocument: imageStudioComposition(project),
    expectedUpdatedAt: options.expectedUpdatedAt,
    changeSummary: options.changeSummary,
    clientMutationId: options.clientMutationId,
  });
  const row = await repositoryFor(client).save({
    ...input,
    id: persistedId,
    expectedUpdatedAt: options.expectedUpdatedAt,
    changeSummary: options.changeSummary,
    clientMutationId: options.clientMutationId,
  });
  return resolveAssetReferences(imageProjectFromCreative(row), client);
};

export const migrateLegacyCreativeProject = async (
  project: ImageProject,
  client: SupabaseClient = supabase,
): Promise<ImageProject> => {
  const projectId = crypto.randomUUID();
  const migrated = await replaceInlinePayloads(clone(project), projectId, client) as ImageProject;
  return saveCreativeProject({ ...migrated, id: projectId }, { createNew: true }, client);
};

export const archiveCreativeProject = async (
  id: string,
  expectedUpdatedAt?: string,
  client: SupabaseClient = supabase,
): Promise<void> => {
  const { scope, user } = await getCreativeScope(client);
  let current: Awaited<ReturnType<CreativeProjectRepository['get']>>;
  try {
    current = await repositoryFor(client).get(id, scope);
  } catch (error) {
    const details = getCreativePersistenceErrorDetails(error);
    const suffix = import.meta.env.DEV && details.code ? ` [${details.code}]` : '';
    const safeError = new Error(`No se pudo archivar la creatividad.${suffix}`);
    (safeError as Error & { cause?: unknown }).cause = error;
    throw safeError;
  }
  if (!current) throw new Error('No se pudo archivar la creatividad.');
  if (expectedUpdatedAt && current.updatedAt !== expectedUpdatedAt) {
    throw new CreativeProjectConflictError();
  }
  const updatedAt = new Date().toISOString();
  let query = client.from('marketing_creative_projects')
    .update({
      status: 'archived',
      updated_by: user.id,
      updated_at: updatedAt,
    })
    .eq('id', id)
    .eq('organization_id', scope.organizationId)
    .eq('workspace_id', scope.workspaceId)
    .eq('brand_id', scope.brandId);
  query = query.eq('autosave_revision', current.autosaveRevision);

  const { data, error } = await (query as unknown as {
    select: (columns: string) => {
      maybeSingle: () => Promise<{ data: { id: string } | null; error: unknown | null }>;
    };
  }).select('id').maybeSingle();
  if (error) {
    const details = getCreativePersistenceErrorDetails(error);
    if (details.code === 'PGRST116' || details.code === '40001') {
      throw new CreativeProjectConflictError(undefined, error);
    }
    const suffix = import.meta.env.DEV && details.code ? ` [${details.code}]` : '';
    const safeError = new Error(`No se pudo archivar la creatividad.${suffix}`);
    (safeError as Error & { cause?: unknown }).cause = error;
    throw safeError;
  }
  if (!data) {
    if (expectedUpdatedAt) throw new CreativeProjectConflictError();
    throw new Error('No se pudo archivar la creatividad.');
  }
};

/** @deprecated Use archiveCreativeProject; LoopDev does not permit project DELETE. */
export const deleteCreativeProject = async (id: string, client: SupabaseClient = supabase): Promise<void> =>
  archiveCreativeProject(id, undefined, client);

export const listCreativeProjectVersions = async (
  id: string,
  client: SupabaseClient = supabase,
) => {
  const { scope } = await getCreativeScope(client);
  return repositoryFor(client).listVersions(id, scope);
};

export const restoreCreativeProjectVersion = async (
  id: string,
  version: number,
  client: SupabaseClient = supabase,
): Promise<ImageProject> => {
  const current = await getCreativeProject(id, client);
  if (!current) throw new Error('Proyecto creativo no encontrado.');
  const versions = await listCreativeProjectVersions(id, client);
  const selected = versions.find((item) => item.versionNumber === version);
  if (!selected) throw new Error('Versión creativa no encontrada.');
  const composition = selected.document as { imageStudio?: ImageProject };
  if (!composition.imageStudio) throw new Error('La versión no contiene una composición compatible.');
  return saveCreativeProject({
    ...clone(composition.imageStudio),
    id: current.id,
    title: current.title,
    createdAt: current.createdAt,
    updatedAt: current.updatedAt,
  }, { expectedUpdatedAt: current.updatedAt, changeSummary: `Restaurada versión ${version}` }, client);
};

/** A portable project package contains JSON only; binary assets stay in Storage. */
export const exportCreativeProject = (project: ImageProject): string =>
  JSON.stringify({ schemaVersion: 1, project: imageStudioComposition(project) });

export const importCreativeProject = (serialized: string, projectId: string = crypto.randomUUID()): ImageProject => {
  const parsed = JSON.parse(serialized) as { schemaVersion?: number; project?: { imageStudio?: ImageProject } };
  const imported = parsed.project?.imageStudio;
  if (parsed.schemaVersion !== 1 || !imported) throw new Error('El archivo de proyecto no es válido.');
  return { ...clone(imported), id: projectId, updatedAt: new Date().toISOString() };
};

export interface CreativeAssetUpload {
  file: Blob;
  name: string;
  mimeType: string;
  projectId?: string;
  storageClass?: 'source' | 'font' | 'export';
  kind?: 'source' | 'export' | 'thumbnail';
  type?: CreativeAsset['type'];
}

export type RuntimeCreativeAsset = CreativeAsset & {
  signedUrl: string;
  assetRef: string;
};

const extensionFor = (name: string, mimeType: string): string => {
  const extension = name.split('.').pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : (mimeType.split('/')[1] ?? 'bin');
};

const sha256 = async (file: Blob): Promise<string> => {
  if (!globalThis.crypto?.subtle) throw new Error('Este navegador no admite hashes de assets.');
  const digest = await globalThis.crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const uploadCreativeAsset = async (
  input: CreativeAssetUpload,
  client: SupabaseClient = supabase,
): Promise<RuntimeCreativeAsset> => {
  const { scope, user } = await getCreativeScope(client);
  const storageClass = input.storageClass ?? 'source';
  const id = crypto.randomUUID();
  const contentHash = await sha256(input.file);
  const kind = input.kind ?? (storageClass === 'export' ? 'export' : 'source');
  const path = `org/${scope.organizationId}/workspace/${scope.workspaceId}/${kind}/${contentHash}-${id}.${extensionFor(input.name, input.mimeType)}`;
  const { error: uploadError } = await client.storage.from(CREATIVE_BUCKET).upload(path, input.file, {
    contentType: input.mimeType,
    upsert: false,
  });
  if (uploadError) throw uploadError;
  const { data: signed, error: signedError } = await client.storage.from(CREATIVE_BUCKET).createSignedUrl(path, 3600);
  if (signedError || !signed?.signedUrl) throw signedError ?? new Error('No se pudo crear la URL privada del asset.');
  const now = new Date().toISOString();
  const parsed = CreativeAssetSchema.parse({
    id,
    ...scope,
    ownerUserId: user.id,
    projectId: input.projectId ?? null,
    name: input.name,
    type: input.type ?? (input.mimeType.startsWith('image/') ? 'image' : 'other'),
    storageClass,
    origin: storageClass === 'export' ? 'export' : 'upload',
    status: 'ready',
    storagePath: path,
    mimeType: input.mimeType,
    sizeBytes: input.file.size,
    format: extensionFor(input.name, input.mimeType),
    metadata: { bucket: CREATIVE_BUCKET },
    createdAt: now,
    updatedAt: now,
  });
  // Remove the object when its metadata row cannot be created.
  const { error: metadataError } = await client.from('marketing_creative_assets').insert({
    id: parsed.id,
    organization_id: scope.organizationId,
    workspace_id: scope.workspaceId,
    brand_id: scope.brandId,
    project_id: input.projectId ?? null,
    kind,
    status: 'active',
    storage_path: parsed.storagePath,
    mime_type: parsed.mimeType,
    size_bytes: parsed.sizeBytes,
    content_hash: contentHash,
    compressed: kind === 'thumbnail',
    width: null,
    height: null,
    expires_at: kind === 'export' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
    created_by: user.id,
    updated_by: user.id,
  });
  if (metadataError) {
    await client.storage.from(CREATIVE_BUCKET).remove([path]);
    throw metadataError;
  }
  const assetRef = `${CREATIVE_ASSET_REFERENCE_PREFIX}${parsed.id}`;
  signedAssetReferences.set(signed.signedUrl, assetRef);
  return { ...parsed, signedUrl: signed.signedUrl, assetRef };
};

export const uploadCreativeImage = async (
  file: File,
  projectId?: string,
  client: SupabaseClient = supabase,
): Promise<RuntimeCreativeAsset> =>
  uploadCreativeAsset({ file, projectId, name: file.name, mimeType: file.type }, client);

export const uploadCreativeExport = async (
  projectId: string,
  blob: Blob,
  format: string,
  client: SupabaseClient = supabase,
): Promise<RuntimeCreativeAsset> =>
  uploadCreativeAsset({
    file: blob,
    projectId,
    name: `export-${new Date().toISOString().replace(/[:.]/g, '-')}.${format}`,
    mimeType: blob.type || 'application/octet-stream',
    storageClass: 'export',
    type: format === 'pdf' ? 'document' : format === 'zip' ? 'archive' : 'image',
  }, client);

export const uploadCreativeThumbnail = async (
  projectId: string,
  blob: Blob,
  client: SupabaseClient = supabase,
): Promise<RuntimeCreativeAsset> =>
  uploadCreativeAsset({
    file: blob,
    projectId,
    name: `thumbnail-${projectId}.png`,
    mimeType: 'image/png',
    storageClass: 'source',
    kind: 'thumbnail',
    type: 'thumbnail',
  }, client);

export const createCreativeThumbnailBlob = async (blob: Blob, maxDimension = 512): Promise<Blob> => {
  if (typeof createImageBitmap !== 'function' || typeof document === 'undefined') return blob;
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob((thumbnail) => thumbnail ? resolve(thumbnail) : reject(new Error('No se pudo generar la miniatura.')), 'image/png');
  });
};

export const listCreativeAssets = async (client: SupabaseClient = supabase): Promise<RuntimeCreativeAsset[]> => {
  const { scope } = await getCreativeScope(client);
  const { data, error } = await client.from('marketing_creative_assets').select('*')
    .eq('organization_id', scope.organizationId).order('updated_at', { ascending: false });
  if (error) throw error;
  return Promise.all(((data ?? []) as Record<string, unknown>[]).map(async (row) => {
    const kind = row.kind as 'source' | 'export' | 'thumbnail';
    const storageClass = kind === 'export' ? 'export' : 'source';
    const asset = CreativeAssetSchema.parse({
      id: row.id, organizationId: row.organization_id, workspaceId: row.workspace_id, brandId: row.brand_id,
      projectId: row.project_id, versionId: null, variantId: null,
      name: row.storage_path, type: kind === 'thumbnail' ? 'thumbnail' : row.mime_type?.toString().startsWith('image/') ? 'image' : 'other',
      storageClass, origin: kind === 'export' ? 'export' : 'upload', status: row.status === 'active' ? 'ready' : 'archived',
      storagePath: row.storage_path, mimeType: row.mime_type, sizeBytes: row.size_bytes, checksum: row.checksum,
      format: row.storage_path?.toString().split('.').pop(), width: row.width, height: row.height,
      metadata: { kind: row.kind, contentHash: row.content_hash, compressed: row.compressed },
      createdBy: row.created_by, updatedBy: row.updated_by,
      createdAt: normalizeSupabaseTimestamp(row.created_at, 'created_at'),
      updatedAt: normalizeSupabaseTimestamp(row.updated_at, 'updated_at'),
    });
    const { data: signed } = await client.storage.from(CREATIVE_BUCKET).createSignedUrl(asset.storagePath, 3600);
    const signedUrl = signed?.signedUrl ?? '';
    const assetRef = `${CREATIVE_ASSET_REFERENCE_PREFIX}${asset.id}`;
    if (signedUrl) signedAssetReferences.set(signedUrl, assetRef);
    return { ...asset, signedUrl, assetRef };
  }));
};

export const removeCreativeAsset = async (asset: CreativeAsset, client: SupabaseClient = supabase): Promise<void> => {
  const { scope, user } = await getCreativeScope(client);
  const { error } = await client.from('marketing_creative_assets').update({
    status: 'orphaned',
    orphaned_at: new Date().toISOString(),
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  }).eq('id', asset.id).eq('organization_id', scope.organizationId);
  if (error) throw error;
};
