import type { SupabaseClient, User } from '@supabase/supabase-js';
import {
  CreateCreativeProjectInputSchema,
  CreativeAssetSchema,
  type CreativeAsset,
  type CreativeProject,
  type CreativeScope,
} from '../contracts/creativePersistence';
import type { ImageProject } from '../types/imageStudio';
import { createSupabaseCreativeProjectRepository, type CreativeProjectRepository } from './creativeProjectRepository';
import { supabase } from './supabaseClient';

export const CREATIVE_SOURCE_BUCKET = 'marketing-creative-sources';
export const CREATIVE_EXPORT_BUCKET = 'marketing-creative-exports';
export const CREATIVE_FONT_BUCKET = 'marketing-creative-fonts';
/** Persist this opaque reference in compositions; signed URLs are runtime-only. */
export const CREATIVE_ASSET_REFERENCE_PREFIX = 'creative-asset:';

export class CreativeStudioScopeError extends Error {
  constructor(message = 'Tu sesión no contiene un scope de organización, workspace y marca.') {
    super(message);
    this.name = 'CreativeStudioScopeError';
  }
}

const isUuid = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const claim = (user: User, key: string): unknown =>
  user.app_metadata?.[key];

const claimsScope = (claims: Record<string, unknown>): CreativeScope => {
  const metadata = claims.app_metadata && typeof claims.app_metadata === 'object'
    ? claims.app_metadata as Record<string, unknown>
    : {};
  const scope = {
    organizationId: claims.organization_id ?? metadata.organization_id,
    workspaceId: claims.workspace_id ?? metadata.workspace_id,
    brandId: claims.brand_id ?? metadata.brand_id,
  };
  if (!isUuid(scope.organizationId) || !isUuid(scope.workspaceId) || !isUuid(scope.brandId)) {
    throw new CreativeStudioScopeError();
  }
  return scope as CreativeScope;
};

const decodeAccessTokenClaims = (accessToken: string): Record<string, unknown> => {
  const payload = accessToken.split('.')[1];
  if (!payload) throw new Error('JWT sin payload');
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/').padEnd(
    Math.ceil(payload.length / 4) * 4,
    '=',
  );
  const bytes = Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
};

export const scopeFromUser = (user: User | null): CreativeScope => {
  if (!user) throw new CreativeStudioScopeError('Inicia sesión para usar Creative Studio.');
  const scope = {
    organizationId: claim(user, 'organization_id'),
    workspaceId: claim(user, 'workspace_id'),
    brandId: claim(user, 'brand_id'),
  };
  if (!isUuid(scope.organizationId) || !isUuid(scope.workspaceId) || !isUuid(scope.brandId)) {
    throw new CreativeStudioScopeError();
  }
  return scope as CreativeScope;
};

export const getCreativeScope = async (client: SupabaseClient = supabase): Promise<{ scope: CreativeScope; user: User }> => {
  const [{ data: sessionData, error: sessionError }, { data: userData, error: userError }] = await Promise.all([
    client.auth.getSession(),
    client.auth.getUser(),
  ]);
  const { session } = sessionData;
  const { user } = userData;
  if (sessionError || userError || !session?.access_token || !user) {
    throw new CreativeStudioScopeError('No se pudo validar tu sesión.');
  }
  try {
    return { scope: claimsScope(decodeAccessTokenClaims(session.access_token)), user };
  } catch {
    throw new CreativeStudioScopeError('No se pudo leer el scope del token de acceso.');
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
  const composition = project.composition as Record<string, unknown> & { imageStudio?: ImageProject };
  if (composition.imageStudio) {
    return {
      ...clone(composition.imageStudio),
      id: project.id,
      title: project.name,
      creativeStatus: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

  }
  return {
    id: project.id,
    title: project.name,
    creativeStatus: project.status,
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
    const [bucket, ...parts] = row.storage_path.split('/');
    const { data: signed, error: signedError } = await client.storage.from(bucket).createSignedUrl(parts.join('/'), 3600);
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

const projectType = (project: ImageProject): 'image' | 'carousel' =>
  project.carouselConfig?.enabled || (project.carouselPages ?? 0) > 1 ? 'carousel' : 'image';

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
  options: { expectedUpdatedAt?: string; changeSummary?: string | null; clientMutationId?: string } = {},
  client: SupabaseClient = supabase,
): Promise<ImageProject> => {
  const { scope, user } = await getCreativeScope(client);
  const input = CreateCreativeProjectInputSchema.parse({
    id: isUuid(project.id) ? project.id : undefined,
    ...scope,
    ownerUserId: user.id,
    name: project.title,
    creativeType: projectType(project),
    status: project.creativeStatus ?? 'draft',
    composition: imageStudioComposition(project),
    metadata: { presetId: project.preset.id, aspectRatio: project.preset.aspectRatio },
    expectedUpdatedAt: options.expectedUpdatedAt,
    changeSummary: options.changeSummary,
    clientMutationId: options.clientMutationId,
  });
  const row = await repositoryFor(client).save({
    ...input,
    id: isUuid(project.id) ? project.id : undefined,
    expectedUpdatedAt: options.expectedUpdatedAt,
    changeSummary: options.changeSummary,
    clientMutationId: options.clientMutationId,
  });
  return imageProjectFromCreative(row);
};

export const migrateLegacyCreativeProject = async (
  project: ImageProject,
  client: SupabaseClient = supabase,
): Promise<ImageProject> => {
  const projectId = crypto.randomUUID();
  const migrated = await replaceInlinePayloads(clone(project), projectId, client) as ImageProject;
  return saveCreativeProject({ ...migrated, id: projectId }, {}, client);
};

export const deleteCreativeProject = async (id: string, client: SupabaseClient = supabase): Promise<void> => {
  const { scope } = await getCreativeScope(client);
  await repositoryFor(client).remove(id, scope);
};

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
  const selected = versions.find((item) => item.version === version);
  if (!selected) throw new Error('Versión creativa no encontrada.');
  const composition = selected.snapshot.composition as { imageStudio?: ImageProject };
  if (!composition.imageStudio) throw new Error('La versión no contiene una composición compatible.');
  return saveCreativeProject({
    ...clone(composition.imageStudio),
    id: current.id,
    title: selected.snapshot.name,
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

export const uploadCreativeAsset = async (
  input: CreativeAssetUpload,
  client: SupabaseClient = supabase,
): Promise<RuntimeCreativeAsset> => {
  const { scope, user } = await getCreativeScope(client);
  const storageClass = input.storageClass ?? 'source';
  const bucket = storageClass === 'export' ? CREATIVE_EXPORT_BUCKET : storageClass === 'font' ? CREATIVE_FONT_BUCKET : CREATIVE_SOURCE_BUCKET;
  const id = crypto.randomUUID();
  const path = `${scope.organizationId}/${scope.workspaceId}/${scope.brandId}/${input.projectId ?? 'unassigned'}/${id}.${extensionFor(input.name, input.mimeType)}`;
  const { error: uploadError } = await client.storage.from(bucket).upload(path, input.file, {
    contentType: input.mimeType,
    upsert: false,
  });
  if (uploadError) throw uploadError;
  const { data: signed, error: signedError } = await client.storage.from(bucket).createSignedUrl(path, 3600);
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
    storagePath: `${bucket}/${path}`,
    mimeType: input.mimeType,
    sizeBytes: input.file.size,
    format: extensionFor(input.name, input.mimeType),
    metadata: { bucket },
    createdAt: now,
    updatedAt: now,
  });
  // Keep the metadata row and Storage object atomic from the client's perspective.
  const { error: metadataError } = await client.from('marketing_creative_assets').insert({
    id: parsed.id,
    organization_id: scope.organizationId,
    workspace_id: scope.workspaceId,
    brand_id: scope.brandId,
    owner_user_id: user.id,
    project_id: input.projectId ?? null,
    name: parsed.name,
    type: parsed.type,
    storage_class: parsed.storageClass,
    origin: parsed.origin,
    status: parsed.status,
    storage_path: parsed.storagePath,
    mime_type: parsed.mimeType,
    size_bytes: parsed.sizeBytes,
    format: parsed.format,
    metadata: parsed.metadata,
  });
  if (metadataError) {
    await client.storage.from(bucket).remove([path]);
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
    const asset = CreativeAssetSchema.parse({
      id: row.id, organizationId: row.organization_id, workspaceId: row.workspace_id, brandId: row.brand_id,
      ownerUserId: row.owner_user_id, projectId: row.project_id, versionId: row.version_id, variantId: row.variant_id,
      name: row.name, type: row.type, storageClass: row.storage_class, origin: row.origin, status: row.status,
      storagePath: row.storage_path, mimeType: row.mime_type, sizeBytes: row.size_bytes, checksum: row.checksum,
      format: row.format, width: row.width, height: row.height, durationMs: row.duration_ms, platform: row.platform,
      metadata: row.metadata, createdBy: row.created_by, updatedBy: row.updated_by, createdAt: row.created_at, updatedAt: row.updated_at,
    });
    const [bucket, ...parts] = asset.storagePath.split('/');
    const { data: signed } = await client.storage.from(bucket).createSignedUrl(parts.join('/'), 3600);
    const signedUrl = signed?.signedUrl ?? '';
    const assetRef = `${CREATIVE_ASSET_REFERENCE_PREFIX}${asset.id}`;
    if (signedUrl) signedAssetReferences.set(signedUrl, assetRef);
    return { ...asset, signedUrl, assetRef };
  }));
};

export const removeCreativeAsset = async (asset: CreativeAsset, client: SupabaseClient = supabase): Promise<void> => {
  const [bucket, ...parts] = asset.storagePath.split('/');
  const { scope } = await getCreativeScope(client);
  const { error } = await client.from('marketing_creative_assets').delete().eq('id', asset.id).eq('organization_id', scope.organizationId);
  if (error) throw error;
  await client.storage.from(bucket).remove([parts.join('/')]);
};
