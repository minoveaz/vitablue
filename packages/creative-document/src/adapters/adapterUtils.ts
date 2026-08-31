import type { AssetRef, Geometry, JsonObject, JsonValue } from '../types';

export class CreativeDocumentAdapterError extends Error {
  readonly code: 'asset-reference' | 'invalid-legacy-data';

  constructor(message: string, code: CreativeDocumentAdapterError['code'] = 'invalid-legacy-data') {
    super(message);
    this.name = 'CreativeDocumentAdapterError';
    this.code = code;
  }
}

export type LegacyRecord = Record<string, unknown>;

export const isRecord = (value: unknown): value is LegacyRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const jsonValue = (value: unknown): JsonValue => {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : String(value);
  if (Array.isArray(value)) return value.map(jsonValue);
  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, item]) => (item === undefined ? [] : [[key, jsonValue(item)]])),
    );
  }
  if (value === undefined) return '[undefined]';
  return `[unsupported ${typeof value}] ${String(value)}`;
};

export const toJsonObject = (value: LegacyRecord): JsonObject =>
  Object.fromEntries(
    Object.entries(value).flatMap(([key, item]) => (item === undefined ? [] : [[key, jsonValue(item)]])),
  );

/** Component props must not smuggle renderer-hostile asset URLs into the core. */
export const toSafeJsonObject = (value: LegacyRecord): JsonObject => {
  const clean = (item: unknown): JsonValue | undefined => {
    if (item === undefined) return undefined;
    if (typeof item === 'string') return isUnsafeAssetReference(item) ? undefined : item;
    if (Array.isArray(item)) return item.flatMap((entry) => {
      const next = clean(entry);
      return next === undefined ? [] : [next];
    });
    if (isRecord(item)) {
      return Object.fromEntries(
        Object.entries(item).flatMap(([key, entry]) => {
          const next = clean(entry);
          return next === undefined ? [] : [[key, next]];
        }),
      );
    }
    return jsonValue(item);
  };
  return clean(value) as JsonObject;
};

export const fromJsonObject = (value: JsonObject | undefined): LegacyRecord =>
  value ? Object.fromEntries(Object.entries(value)) : {};

export const finitePositive = (value: number | undefined, fallback: number): number =>
  value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;

export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

/** Legacy editors store the layer position as its centre. */
export const legacyCoordinateToPixels = (value: number, canvasExtent: number): number =>
  Math.abs(value) <= 100 ? (value / 100) * canvasExtent : value;

export const pixelsToLegacyPercent = (value: number, canvasExtent: number): number =>
  Math.round((value / canvasExtent) * 1000000) / 10000;

export const geometryFromLegacyCenter = (
  position: { x: number; y: number },
  width: number,
  height: number,
  canvas: { width: number; height: number },
): { geometry: Geometry; position: { x: number; y: number } } => {
  const centerX = clamp(legacyCoordinateToPixels(position.x, canvas.width), 0, canvas.width);
  const centerY = clamp(legacyCoordinateToPixels(position.y, canvas.height), 0, canvas.height);
  const widthNorm = clamp(width / canvas.width, 1 / canvas.width, 1);
  const heightNorm = clamp(height / canvas.height, 1 / canvas.height, 1);
  return {
    geometry: {
      x: clamp(centerX / canvas.width - widthNorm / 2, 0, 1 - widthNorm),
      y: clamp(centerY / canvas.height - heightNorm / 2, 0, 1 - heightNorm),
      width: widthNorm,
      height: heightNorm,
    },
    position: { x: centerX / canvas.width, y: centerY / canvas.height },
  };
};

export const legacyCenterFromGeometry = (
  geometry: Geometry,
  transformPosition: { x: number; y: number },
  canvas: { width: number; height: number },
): { position: { x: number; y: number }; width: number; height: number } => ({
  position: {
    x: pixelsToLegacyPercent(transformPosition.x * canvas.width, canvas.width),
    y: pixelsToLegacyPercent(transformPosition.y * canvas.height, canvas.height),
  },
  width: Math.max(1, Math.round(geometry.width * canvas.width)),
  height: Math.max(1, Math.round(geometry.height * canvas.height)),
});

export const isUnsafeAssetReference = (reference: string): boolean =>
  (!reference.startsWith('creative-asset:') && /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) ||
  /[?#]/.test(reference) ||
  /(?:\/sign(?:ed)?\/|[?&]token=|[?&]signature=)/i.test(reference);

/** Stable reference used when a runtime only has an asset id, not its path. */
export const creativeAssetReference = (assetId: string): string => `creative-asset:${assetId}`;

export const resolveAssetRef = (
  references: Array<{ field: string; value: string | undefined }>,
  fallbackId: string,
): AssetRef => {
  const present = references.filter((reference): reference is { field: string; value: string } =>
    typeof reference.value === 'string' && reference.value.trim().length > 0,
  );
  const safe = present.filter(({ value }) => !isUnsafeAssetReference(value.trim()));
  const rejected = present.find(({ value }) => isUnsafeAssetReference(value.trim()));
  const unsafePath = present.find(({ field, value }) =>
    (field === 'storagePath' || field === 'src' || field.endsWith('.imageUrl')) &&
    isUnsafeAssetReference(value.trim()));
  // A runtime URL may accompany a stable asset id, but an unsafe path without
  // that identity must never silently fall back to a second legacy field.
  if (unsafePath && !present.some(({ field }) => field === 'assetId')) {
    throw new CreativeDocumentAdapterError(
      `Cannot persist ${unsafePath.field} "${unsafePath.value}": inline, remote, or signed asset references are not allowed.`,
      'asset-reference',
    );
  }
  if (!safe.length && rejected) {
    throw new CreativeDocumentAdapterError(
      `Cannot persist ${rejected.field} "${rejected.value}": inline, remote, or signed asset references are not allowed.`,
      'asset-reference',
    );
  }
  const source = safe.find(({ field }) => field === 'storagePath')
    ?? safe.find(({ field }) => field === 'src')
    ?? safe.find(({ field }) => field === 'assetId');
  if (!source) {
    throw new CreativeDocumentAdapterError(
      `Cannot persist asset for "${fallbackId}": no logical storage path or stable asset id was provided.`,
      'asset-reference',
    );
  }
  const assetId = present.find(({ field }) => field === 'assetId')?.value.trim() ?? `legacy-${fallbackId}`;
  return {
    assetId,
    storagePath: source.field === 'assetId' ? creativeAssetReference(assetId) : source.value.trim(),
  };
};

export const withLegacySource = (source: LegacyRecord, extras: LegacyRecord = {}): { legacy: JsonObject } => ({
  legacy: {
    ...toJsonObject(extras),
    // Legacy source is retained for round-tripping, but must not reintroduce
    // signed/blob URLs into the canonical JSON boundary.
    source: toSafeJsonObject(source),
  },
});

export const legacySource = (extensions: { legacy?: JsonObject } | undefined): LegacyRecord => {
  const source = extensions?.legacy?.source;
  return isRecord(source) ? source : {};
};
