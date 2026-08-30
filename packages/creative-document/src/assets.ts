import { AssetRefSchema, CreativeDocumentValidationError } from './schema';
import type { AssetRef, CreativeDocument } from './types';

export interface ResolvedCreativeAsset {
  reference: AssetRef;
  url: string;
  expiresAt?: string;
}

export interface CreativeAssetResolver {
  resolve(reference: AssetRef): Promise<ResolvedCreativeAsset | null>;
}

export interface CreativeAssetRepository {
  load(assetId: string): Promise<AssetRef | null>;
  save(reference: AssetRef): Promise<AssetRef>;
  list(): Promise<AssetRef[]>;
}

export class CreativeAssetResolutionError extends Error {
  readonly code = 'invalid-reference' as const;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'CreativeAssetResolutionError';
    if (cause !== undefined) Object.defineProperty(this, 'cause', { configurable: true, value: cause });
  }
}

export const validateAssetReference = (reference: unknown): AssetRef => {
  const parsed = AssetRefSchema.safeParse(reference);
  if (!parsed.success) {
    throw new CreativeAssetResolutionError(
      `Invalid creative asset reference: ${parsed.error.issues.map((issue) => issue.message).join('; ')}`,
      new CreativeDocumentValidationError(parsed.error),
    );
  }
  return parsed.data;
};

export const createCreativeAssetResolver = (
  resolveUrl: (reference: AssetRef) => Promise<string | null>,
): CreativeAssetResolver => ({
  async resolve(reference) {
    const validated = validateAssetReference(reference);
    const url = await resolveUrl(validated);
    return url ? { reference: validated, url } : null;
  },
});

const collectLayerAssets = (document: CreativeDocument): AssetRef[] => {
  const assets: AssetRef[] = [...(document.assets ?? [])];
  const visit = (layer: CreativeDocument['scenes'][number]['layers'][number]): void => {
    if (layer.type === 'image' || layer.type === 'video' || layer.type === 'audio') assets.push(layer.asset);
    if (layer.type === 'group') layer.children.forEach(visit);
  };
  document.scenes.forEach((scene) => scene.layers.forEach(visit));
  return assets;
};

export const collectCreativeAssetReferences = (document: CreativeDocument): AssetRef[] => {
  const unique = new Map<string, AssetRef>();
  for (const asset of collectLayerAssets(document)) {
    const validated = validateAssetReference(asset);
    unique.set(validated.assetId, validated);
  }
  return [...unique.values()];
};

export const createMemoryCreativeAssetRepository = (): CreativeAssetRepository => {
  const references = new Map<string, AssetRef>();
  const clone = (reference: AssetRef): AssetRef => ({ ...reference });
  return {
    async load(assetId) {
      const reference = references.get(assetId);
      return reference ? clone(reference) : null;
    },
    async save(reference) {
      const validated = validateAssetReference(reference);
      references.set(validated.assetId, clone(validated));
      return clone(validated);
    },
    async list() {
      return [...references.values()].map(clone);
    },
  };
};
