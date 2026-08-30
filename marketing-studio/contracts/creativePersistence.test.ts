import { describe, expect, it } from 'vitest';
import {
  canAccessCreative,
  CreativeAssetReferenceSchema,
  CreativeAssetSchema,
  CreativeProjectSchema,
  CreativeProjectVersionSchema,
  CreativeProjectVariantSchema,
  CreateCreativeProjectInputSchema,
  isCreativeScopeCompatible,
  UpdateCreativeProjectInputSchema,
} from './creativePersistence';

const organizationId = '10000000-0000-4000-8000-000000000001';
const workspaceId = '10000000-0000-4000-8000-000000000002';
const brandId = '10000000-0000-4000-8000-000000000003';
const userId = '10000000-0000-4000-8000-000000000004';
const projectId = '10000000-0000-4000-8000-000000000005';
const versionId = '10000000-0000-4000-8000-000000000006';
const assetId = '10000000-0000-4000-8000-000000000007';
const now = '2026-08-27T20:00:00.000Z';

const projectInput = {
  organizationId,
  workspaceId,
  brandId,
  ownerUserId: userId,
  name: 'Campaña de viaje',
  type: 'social_post' as const,
  draftDocument: {
    schemaVersion: 1,
    presetId: 'instagram-carousel-portrait',
    layers: [{ id: 'title', type: 'text', props: { text: 'Viaja protegido' } }],
  },
};

describe('Creative Studio persistence contracts', () => {
  it('parses a tenant-scoped project and keeps its default version/status', () => {
    const result = CreateCreativeProjectInputSchema.safeParse(projectInput);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.status).toBe('draft');
    expect(result.data.currentVersionNumber).toBe(0);
    expect(result.data).not.toHaveProperty('autosaveRevision');
    expect(CreativeProjectSchema.safeParse({
      id: projectId,
      ...result.data,
      createdAt: now,
      updatedAt: now,
    }).success).toBe(true);
  });

  it('rejects inline data URLs in editable compositions', () => {
    const result = CreateCreativeProjectInputSchema.safeParse({
      ...projectInput,
      draftDocument: { layers: [{ props: { src: 'data:image/png;base64,AAAA' } }] },
    });

    expect(result.success).toBe(false);
  });

  it('does not allow project updates to change tenancy', () => {
    const result = UpdateCreativeProjectInputSchema.safeParse({
      name: 'Nuevo nombre',
      organizationId,
    });

    expect(result.success).toBe(false);
  });

  it('does not allow clients to set the server-owned autosave revision', () => {
    expect(UpdateCreativeProjectInputSchema.safeParse({
      autosaveRevision: 12,
    }).success).toBe(false);
  });

  it('validates immutable versions, variants, assets, and layer references', () => {
    expect(CreativeProjectVersionSchema.safeParse({
      id: versionId,
      projectId,
      organizationId,
      workspaceId,
      brandId,
      versionNumber: 1,
      document: projectInput.draftDocument,
      createdAt: now,
      updatedAt: now,
    }).success).toBe(true);

    expect(CreativeProjectVariantSchema.safeParse({
      id: versionId,
      projectId,
      organizationId,
      workspaceId,
      brandId,
      projectVersionId: versionId,
      key: 'instagram-portrait',
      channel: 'instagram',
      format: 'portrait',
      name: 'Instagram 4:5',
      aspectRatio: '4:5',
      width: 1080,
      height: 1350,
      createdAt: now,
      updatedAt: now,
    }).success).toBe(true);

    expect(CreativeAssetSchema.safeParse({
      id: assetId,
      organizationId,
      name: 'Exportación PNG',
      type: 'image',
      storageClass: 'export',
      origin: 'export',
      storagePath: 'creative-exports/2026/project-5.png',
      mimeType: 'image/png',
      sizeBytes: 2048,
      projectId,
      versionId,
      createdAt: now,
      updatedAt: now,
    }).success).toBe(true);
    expect(CreativeAssetSchema.safeParse({
      id: assetId,
      organizationId,
      name: 'URL firmada',
      type: 'image',
      storageClass: 'source',
      origin: 'import',
      storagePath: 'https://cdn.example.test/image.png?signature=secret',
      mimeType: 'image/png',
      sizeBytes: 1,
      createdAt: now,
      updatedAt: now,
    }).success).toBe(false);

    expect(CreativeAssetReferenceSchema.safeParse({
      id: versionId,
      projectId,
      versionId,
      assetId,
      organizationId,
      workspaceId,
      brandId,
      layerId: 'hero-image',
      purpose: 'source',
      focalPoint: { x: 0.5, y: 0.4 },
      crop: { x: 0, y: 0, width: 1, height: 1, zoom: 1 },
      substitution: { mode: 'same_type', allowedTypes: ['image'] },
      createdAt: now,
      updatedAt: now,
    }).success).toBe(true);
  });

  it('applies Loopdev marketing permissions and prevents cross-tenant access', () => {
    expect(canAccessCreative('owner', 'manage')).toBe(true);
    expect(canAccessCreative('admin', 'publish')).toBe(true);
    expect(canAccessCreative('agent', 'edit')).toBe(false);
    expect(canAccessCreative('editor', 'edit')).toBe(true);
    expect(canAccessCreative('viewer', 'read')).toBe(true);
    expect(canAccessCreative('viewer', 'edit')).toBe(false);

    expect(isCreativeScopeCompatible(
      { organizationId, workspaceId, brandId },
      { organizationId, workspaceId, brandId },
    )).toBe(true);
    expect(isCreativeScopeCompatible(
      { organizationId, workspaceId: null, brandId: null },
      { organizationId, workspaceId, brandId },
    )).toBe(true);
    expect(isCreativeScopeCompatible(
      { organizationId: '10000000-0000-4000-8000-000000000099', workspaceId, brandId },
      { organizationId, workspaceId, brandId },
    )).toBe(false);
  });
});
