import { z } from 'zod';

const CreativeIdSchema = z.string().uuid();
const CreativeTimestampSchema = z.string().datetime();
const JsonObjectSchema = z.record(z.string(), z.unknown());

const containsInlinePayload = (
  value: unknown,
  path: (string | number)[] = [],
): (string | number)[] | null => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return /^(?:data:|blob:)/i.test(normalized)
      || /(?:^|[/?&])(?:signed|sign)(?:ed)?(?:[/=?&]|$)/i.test(normalized)
      || /[?&](?:token|signature|expires|x-amz-[^=]+)=/i.test(normalized)
      ? path
      : null;
  }
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      const result = containsInlinePayload(item, [...path, index]);
      if (result) return result;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      const result = containsInlinePayload(item, [...path, key]);
      if (result) return result;
    }
  }
  return null;
};

/**
 * Editable documents stay JSON-only. Binary data belongs in Supabase Storage
 * and is addressed by CreativeAsset.storagePath.
 */
const BinaryFreeJsonObjectSchema = JsonObjectSchema.superRefine((value, context) => {
  const path = containsInlinePayload(value);
  if (path) {
    context.addIssue({
      code: 'custom',
      path,
      message: 'Inline data/blob and signed URLs are not allowed in creative JSON.',
    });
  }
});
export const CreativeCompositionSchema = BinaryFreeJsonObjectSchema;
export type CreativeComposition = z.infer<typeof CreativeCompositionSchema>;

/** Values accepted by LoopDev's marketing_creative_projects.status check. */
export const CreativeProjectStatusSchema = z.enum(['draft', 'in_review', 'approved', 'archived']);
export type CreativeProjectStatus = z.infer<typeof CreativeProjectStatusSchema>;

/** Values accepted by LoopDev's marketing_creative_projects.type check. */
export const CreativeTypeSchema = z.enum(['social_post', 'story', 'advertisement', 'banner', 'other']);
export type CreativeType = z.infer<typeof CreativeTypeSchema>;

export const CreativePlatformSchema = z.enum([
  'instagram',
  'tiktok',
  'linkedin',
  'facebook',
  'x',
  'youtube',
  'email',
  'web',
  'document',
]);
export type CreativePlatform = z.infer<typeof CreativePlatformSchema>;

export const CreativeOwnershipScopeSchema = z.enum(['organization', 'workspace', 'brand']);
export type CreativeOwnershipScope = z.infer<typeof CreativeOwnershipScopeSchema>;

export const CreativeProjectOwnershipSchema = z.object({
  organizationId: CreativeIdSchema,
  workspaceId: CreativeIdSchema,
  brandId: CreativeIdSchema,
  ownerUserId: CreativeIdSchema.nullable().optional(),
});
export type CreativeProjectOwnership = z.infer<typeof CreativeProjectOwnershipSchema>;

/** Assets may be reusable at organization scope, so workspace and brand are optional. */
export const CreativeAssetOwnershipSchema = z.object({
  organizationId: CreativeIdSchema,
  workspaceId: CreativeIdSchema.nullable().optional(),
  brandId: CreativeIdSchema.nullable().optional(),
  ownerUserId: CreativeIdSchema.nullable().optional(),
});
export type CreativeAssetOwnership = z.infer<typeof CreativeAssetOwnershipSchema>;

const CreativeAuditSchema = z.object({
  createdBy: CreativeIdSchema.nullable().optional(),
  updatedBy: CreativeIdSchema.nullable().optional(),
  createdAt: CreativeTimestampSchema,
  updatedAt: CreativeTimestampSchema,
});

const CreativeProjectBaseSchema = z.object({
  id: CreativeIdSchema,
  name: z.string().trim().min(1).max(160),
  type: CreativeTypeSchema,
  status: CreativeProjectStatusSchema.default('draft'),
  description: z.string().nullable().optional(),
  currentVersionNumber: z.number().int().nonnegative().default(0),
  autosaveRevision: z.number().int().nonnegative().default(0),
  draftDocument: CreativeCompositionSchema.default({}),
});

export const CreativeProjectSchema = CreativeProjectBaseSchema
  .merge(CreativeProjectOwnershipSchema)
  .merge(CreativeAuditSchema);
export type CreativeProject = z.infer<typeof CreativeProjectSchema>;

export const CreateCreativeProjectInputSchema = CreativeProjectBaseSchema
  .omit({ id: true, currentVersionNumber: true, autosaveRevision: true })
  .merge(CreativeProjectOwnershipSchema)
  .extend({
    currentVersionNumber: z.number().int().nonnegative().default(0),
  });
export type CreateCreativeProjectInput = z.infer<typeof CreateCreativeProjectInputSchema>;

/**
 * Tenancy is immutable after creation. Updates carry an optimistic concurrency
 * token but never accept organization, workspace, or brand reassignment.
 */
export const UpdateCreativeProjectInputSchema = CreativeProjectBaseSchema
  .omit({ id: true, currentVersionNumber: true, autosaveRevision: true })
  .partial()
  .extend({ expectedUpdatedAt: CreativeTimestampSchema.optional() })
  .strict();
export type UpdateCreativeProjectInput = z.infer<typeof UpdateCreativeProjectInputSchema>;

export const CreativeProjectSnapshotSchema = z.object({
  schemaVersion: z.literal(1),
  name: z.string().trim().min(1).max(160),
  type: CreativeTypeSchema,
  document: CreativeCompositionSchema,
});
export type CreativeProjectSnapshot = z.infer<typeof CreativeProjectSnapshotSchema>;

export const CreativeProjectVersionSchema = z.object({
  id: CreativeIdSchema,
  projectId: CreativeIdSchema,
  organizationId: CreativeIdSchema,
  workspaceId: CreativeIdSchema,
  brandId: CreativeIdSchema,
  versionNumber: z.number().int().positive(),
  document: CreativeCompositionSchema,
  changeSummary: z.string().trim().max(500).nullable().optional(),
  createdBy: CreativeIdSchema.nullable().optional(),
  updatedBy: CreativeIdSchema.nullable().optional(),
  createdAt: CreativeTimestampSchema,
  updatedAt: CreativeTimestampSchema,
});
export type CreativeProjectVersion = z.infer<typeof CreativeProjectVersionSchema>;

export const CreativeVariantKindSchema = z.enum(['format', 'platform', 'color', 'copy', 'cta', 'image']);
export type CreativeVariantKind = z.infer<typeof CreativeVariantKindSchema>;

export const CreativeVariantStatusSchema = z.enum(['draft', 'approved', 'archived']);
export type CreativeVariantStatus = z.infer<typeof CreativeVariantStatusSchema>;

export const CreativeProjectVariantSchema = z.object({
  id: CreativeIdSchema,
  projectId: CreativeIdSchema,
  organizationId: CreativeIdSchema,
  workspaceId: CreativeIdSchema,
  brandId: CreativeIdSchema,
  projectVersionId: CreativeIdSchema,
  key: z.string().trim().min(1).max(160),
  channel: z.enum(['facebook', 'instagram', 'linkedin', 'tiktok', 'x', 'email', 'other']),
  format: z.enum(['square', 'portrait', 'landscape', 'story', 'custom']),
  name: z.string().trim().min(1).max(160),
  status: CreativeVariantStatusSchema.default('draft'),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  payload: BinaryFreeJsonObjectSchema.default({}),
  createdBy: CreativeIdSchema.nullable().optional(),
  updatedBy: CreativeIdSchema.nullable().optional(),
  createdAt: CreativeTimestampSchema,
  updatedAt: CreativeTimestampSchema,
});
export type CreativeProjectVariant = z.infer<typeof CreativeProjectVariantSchema>;
export const CreativeVariantSchema = CreativeProjectVariantSchema;
export type CreativeVariant = CreativeProjectVariant;

export const CreativeAssetTypeSchema = z.enum([
  'image',
  'video',
  'audio',
  'document',
  'font',
  'archive',
  'panorama',
  'thumbnail',
  'other',
]);
export type CreativeAssetType = z.infer<typeof CreativeAssetTypeSchema>;

export const CreativeAssetStorageClassSchema = z.enum(['source', 'font', 'export']);
export type CreativeAssetStorageClass = z.infer<typeof CreativeAssetStorageClassSchema>;

export const CreativeAssetOriginSchema = z.enum(['upload', 'import', 'generated', 'export']);
export type CreativeAssetOrigin = z.infer<typeof CreativeAssetOriginSchema>;

export const CreativeAssetStatusSchema = z.enum(['draft', 'ready', 'archived']);
export type CreativeAssetStatus = z.infer<typeof CreativeAssetStatusSchema>;

export const CreativeAssetSchema = z.object({
  id: CreativeIdSchema,
  organizationId: CreativeIdSchema,
  workspaceId: CreativeIdSchema.nullable().optional(),
  brandId: CreativeIdSchema.nullable().optional(),
  ownerUserId: CreativeIdSchema.nullable().optional(),
  projectId: CreativeIdSchema.nullable().optional(),
  versionId: CreativeIdSchema.nullable().optional(),
  variantId: CreativeIdSchema.nullable().optional(),
  name: z.string().trim().min(1).max(240),
  type: CreativeAssetTypeSchema,
  storageClass: CreativeAssetStorageClassSchema,
  origin: CreativeAssetOriginSchema,
  status: CreativeAssetStatusSchema.default('draft'),
  storagePath: z.string().trim().min(1).max(1024).refine(
    (path) =>
      !/^(?:data|blob|https?|file|javascript):/i.test(path) &&
      !path.startsWith('//') &&
      !/[?#]/.test(path) &&
      !/(?:^|[/?&])(?:signed|sign)(?:ed)?(?:[/=?&]|$)/i.test(path) &&
      !/[?&](?:token|signature|expires|x-amz-[^=]+)=/i.test(path),
    'Assets must be addressed by a logical Storage path, not an inline or signed URL.',
  ),
  mimeType: z.string().trim().min(3).max(120),
  sizeBytes: z.number().int().nonnegative(),
  checksum: z.string().trim().max(128).nullable().optional(),
  format: z.string().trim().regex(/^[a-z0-9.+-]+$/i).nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  durationMs: z.number().int().nonnegative().nullable().optional(),
  platform: CreativePlatformSchema.nullable().optional(),
  metadata: BinaryFreeJsonObjectSchema.default({}),
  createdBy: CreativeIdSchema.nullable().optional(),
  updatedBy: CreativeIdSchema.nullable().optional(),
  createdAt: CreativeTimestampSchema,
  updatedAt: CreativeTimestampSchema,
});
export type CreativeAsset = z.infer<typeof CreativeAssetSchema>;

export const CreativeAssetReferencePurposeSchema = z.enum([
  'source',
  'replacement',
  'thumbnail',
  'export',
]);
export type CreativeAssetReferencePurpose = z.infer<typeof CreativeAssetReferencePurposeSchema>;

export const CreativeAssetMaskSchema = z.enum([
  'none',
  'circle',
  'rounded',
  'squircle',
  'pill',
  'shield',
  'hexagon',
  'custom',
]);

export const CreativeCropSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  width: z.number().positive().max(1),
  height: z.number().positive().max(1),
  zoom: z.number().positive().max(20).default(1),
});

export const CreativeSubstitutionRulesSchema = z.object({
  mode: z.enum(['none', 'manual', 'same_type', 'tag']).default('none'),
  allowedTypes: CreativeAssetTypeSchema.array().max(9).default([]),
  requiredTags: z.string().trim().min(1).max(80).array().max(20).default([]),
});

export const CreativeAssetReferenceSchema = z.object({
  id: CreativeIdSchema,
  projectId: CreativeIdSchema,
  versionId: CreativeIdSchema.nullable().optional(),
  assetId: CreativeIdSchema,
  organizationId: CreativeIdSchema,
  workspaceId: CreativeIdSchema,
  brandId: CreativeIdSchema,
  layerId: z.string().trim().min(1).max(160),
  purpose: CreativeAssetReferencePurposeSchema,
  focalPoint: z.object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
  }).nullable().optional(),
  crop: CreativeCropSchema.nullable().optional(),
  mask: CreativeAssetMaskSchema.default('none'),
  substitution: CreativeSubstitutionRulesSchema.default({
    mode: 'none',
    allowedTypes: [],
    requiredTags: [],
  }),
  createdAt: CreativeTimestampSchema,
  updatedAt: CreativeTimestampSchema,
});
export type CreativeAssetReference = z.infer<typeof CreativeAssetReferenceSchema>;

export const CreativeAccessPermissionSchema = z.enum([
  'read',
  'edit',
  'approve',
  'publish',
  'manage',
]);
export type CreativeAccessPermission = z.infer<typeof CreativeAccessPermissionSchema>;

export const CreativeAccessRoleSchema = z.enum(['owner', 'admin', 'agent', 'editor', 'viewer']);
export type CreativeAccessRole = z.infer<typeof CreativeAccessRoleSchema>;

/**
 * `editor` is a VitaBlue compatibility role. Loopdev's canonical roles are
 * owner/admin/agent/viewer; `agent` intentionally remains read-only for
 * marketing, matching its remote permission catalog.
 */
export const CREATIVE_ACCESS_MATRIX = {
  owner: { read: true, edit: true, approve: true, publish: true, manage: true },
  admin: { read: true, edit: true, approve: true, publish: true, manage: true },
  agent: { read: true, edit: false, approve: false, publish: false, manage: false },
  editor: { read: true, edit: true, approve: false, publish: false, manage: false },
  viewer: { read: true, edit: false, approve: false, publish: false, manage: false },
} as const satisfies Record<CreativeAccessRole, Record<CreativeAccessPermission, boolean>>;

export const canAccessCreative = (
  role: CreativeAccessRole,
  permission: CreativeAccessPermission,
): boolean => CREATIVE_ACCESS_MATRIX[role][permission];

export interface CreativeScope {
  organizationId: string;
  workspaceId: string;
  brandId: string;
}

export const isCreativeScopeCompatible = (
  resource: CreativeProjectOwnership | CreativeAssetOwnership,
  target: CreativeScope,
): boolean =>
  resource.organizationId === target.organizationId &&
  (resource.workspaceId === undefined ||
    resource.workspaceId === null ||
    resource.workspaceId === target.workspaceId) &&
  (resource.brandId === undefined ||
    resource.brandId === null ||
    resource.brandId === target.brandId);
