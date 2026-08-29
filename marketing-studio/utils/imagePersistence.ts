import type { ImageLayer, ImageProject } from '../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from './imageTemplates';
import { createDefaultLayoutMetadata } from '../../packages/video-studio/src/domain/layoutConstraints';
import { normalizeTiptapHtml } from './tiptapHtml';
import { normalizeEditableVectorGeometry } from './vectorGeometry';

/**
 * The Image Studio used to have three independent storage implementations:
 * localStorage for projects, localStorage for media, and a best-effort
 * IndexedDB adapter.  Keeping the database, migration, serialization and
 * in-memory render cache here makes the ordering guarantees explicit:
 *
 *   open database -> hydrate media -> hydrate projects/recovery -> publish ready
 *
 * The small storage modules in this directory are compatibility facades only.
 */

export interface UploadedImageMedia {
  id: string;
  title: string;
  fileName: string;
  mimeType: string;
  dataUrl: string;
  sizeBytes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ImageRecoverySnapshot {
  project: ImageProject;
  savedAt: string;
}

export type ImagePersistenceStorage = 'indexeddb' | 'localStorage' | 'memory';

export interface ImagePersistenceSnapshot {
  projects: ImageProject[];
  media: UploadedImageMedia[];
  recovery: ImageRecoverySnapshot | null;
  storage: ImagePersistenceStorage;
  ready: true;
  error?: Error;
}

export interface ImagePersistenceMutationDetail {
  entity: 'project' | 'media' | 'recovery';
  operation: 'save' | 'delete' | 'hydrate' | 'migrate';
  id?: string;
  storage: ImagePersistenceStorage;
}

export interface PersistResult<T> {
  value: T;
  durable: boolean;
  storage: ImagePersistenceStorage;
  error?: Error;
}

export interface SaveProjectOptions {
  /**
   * The editor already stamps every state change.  Public compatibility
   * callers historically received a fresh updatedAt, so touching remains the
   * default for them.
   */
  touchUpdatedAt?: boolean;
}

export const IMAGE_STUDIO_STORAGE_KEY = 'vitablue_image_studio_projects';
export const IMAGE_STUDIO_RECOVERY_KEY = 'vitablue_image_studio_recovery';
export const IMAGE_MEDIA_STORAGE_KEY = 'vitablue_image_studio_media';

export const IMAGE_PROJECTS_UPDATED_EVENT = 'vitablue_image_projects_updated';
export const IMAGE_MEDIA_UPDATED_EVENT = 'vitablue_image_media_updated';
export const IMAGE_RECOVERY_UPDATED_EVENT = 'vitablue_image_recovery_updated';
export const IMAGE_PERSISTENCE_UPDATED_EVENT = 'vitablue_image_persistence_updated';

export const IMAGE_MEDIA_REFERENCE_PREFIX = '__vitablue_image_media__:';

export const IMAGE_PERSISTENCE_DB_NAME = 'vitablue_image_studio_db';
/**
 * Version 4 adds the three canonical stores' indexes.  Previous versions of
 * the worktree already created the stores at versions 1-3, so upgrades must
 * be additive and never delete existing data.
 */
export const IMAGE_PERSISTENCE_DB_VERSION = 4;
export const IMAGE_PERSISTENCE_STORE_PROJECTS = 'projects';
export const IMAGE_PERSISTENCE_STORE_RECOVERY = 'recovery';
export const IMAGE_PERSISTENCE_STORE_MEDIA = 'media';
export const IMAGE_RECOVERY_ID = 'latest_recovery';
export const MAX_IMAGE_MEDIA_BYTES = 4 * 1024 * 1024;
export const MAX_IMAGE_MEDIA_ITEM_BYTES = 2.5 * 1024 * 1024;

const MAX_TRANSACTION_RETRIES = 2;
const RETRY_DELAY_MS = 25;
const MEDIA_LIBRARY_MAX_ITEMS = 100;
const LEGACY_MEDIA_BUDGET_CHARS = 4_000_000;
const TEXT_PROP_KEYS = new Set([
  'text',
  'title',
  'subtitle',
  'description',
  'badge',
  'ctaText',
  'whatsAppText',
  'buttonText',
  'verifiedLabel',
  'highlight',
  'name',
  'role',
  'message',
  'wrongOptionTitle',
  'wrongOptionDesc',
  'correctOptionTitle',
  'correctOptionDesc',
]);

const transientIndexedDbErrors = new Set([
  'AbortError',
  'InvalidStateError',
  'TransactionInactiveError',
  'UnknownError',
  'NotReadableError',
]);

const nowIso = () => new Date().toISOString();

const clone = <T>(value: T): T => {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value)) as T;
};

const asError = (value: unknown, fallback: string): Error => {
  if (value instanceof Error) return value;
  if (value && typeof value === 'object' && 'name' in value && typeof value.name === 'string') {
    const error = new Error(fallback);
    error.name = value.name;
    return error;
  }
  return new Error(typeof value === 'string' ? value : fallback);
};

export class ImagePersistenceError extends Error {
  readonly code:
    | 'unsupported'
    | 'blocked'
    | 'open'
    | 'transaction'
    | 'unavailable'
    | 'quota';

  constructor(
    code: ImagePersistenceError['code'],
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message);
    this.name = 'ImagePersistenceError';
    this.code = code;
    if (options?.cause !== undefined) {
      Object.defineProperty(this, 'cause', { configurable: true, value: options.cause });
    }
  }
}

const isIndexedDbSupported = (): boolean =>
  typeof indexedDB !== 'undefined' && typeof indexedDB.open === 'function';

const hasLocalStorage = (): boolean =>
  typeof localStorage !== 'undefined' &&
  typeof localStorage.getItem === 'function' &&
  typeof localStorage.setItem === 'function';

const dispatch = (name: string, detail: ImagePersistenceMutationDetail): void => {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  const event =
    typeof CustomEvent !== 'undefined'
      ? new CustomEvent<ImagePersistenceMutationDetail>(name, { detail })
      : new Event(name);
  window.dispatchEvent(event);
};

const dispatchMutation = (detail: ImagePersistenceMutationDetail): void => {
  dispatch(IMAGE_PERSISTENCE_UPDATED_EVENT, detail);
  if (detail.entity === 'project') dispatch(IMAGE_PROJECTS_UPDATED_EVENT, detail);
  if (detail.entity === 'media') dispatch(IMAGE_MEDIA_UPDATED_EVENT, detail);
  if (detail.entity === 'recovery') dispatch(IMAGE_RECOVERY_UPDATED_EVENT, detail);
};

const isTransientError = (error: unknown): boolean => {
  const candidate = error as { name?: unknown } | null;
  return (
    (typeof candidate?.name === 'string' && transientIndexedDbErrors.has(candidate.name)) ||
    (error instanceof ImagePersistenceError && error.code === 'open')
  );
};

const wait = (duration: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, duration);
  });

const isRequest = (value: unknown): value is IDBRequest<unknown> =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'result' in value &&
      'onsuccess' in value &&
      'onerror' in value,
  );

const ensureIndex = (
  store: IDBObjectStore,
  name: string,
  keyPath: string,
  options?: IDBIndexParameters,
): void => {
  if (!store.indexNames.contains(name)) {
    store.createIndex(name, keyPath, options);
  }
};

const ensureStoreSchema = (db: IDBDatabase, transaction: IDBTransaction): void => {
  const projects = db.objectStoreNames.contains(IMAGE_PERSISTENCE_STORE_PROJECTS)
    ? transaction.objectStore(IMAGE_PERSISTENCE_STORE_PROJECTS)
    : db.createObjectStore(IMAGE_PERSISTENCE_STORE_PROJECTS, { keyPath: 'id' });
  ensureIndex(projects, 'updatedAt', 'updatedAt');
  ensureIndex(projects, 'createdAt', 'createdAt');

  const recovery = db.objectStoreNames.contains(IMAGE_PERSISTENCE_STORE_RECOVERY)
    ? transaction.objectStore(IMAGE_PERSISTENCE_STORE_RECOVERY)
    : db.createObjectStore(IMAGE_PERSISTENCE_STORE_RECOVERY, { keyPath: 'id' });
  ensureIndex(recovery, 'savedAt', 'savedAt');

  const media = db.objectStoreNames.contains(IMAGE_PERSISTENCE_STORE_MEDIA)
    ? transaction.objectStore(IMAGE_PERSISTENCE_STORE_MEDIA)
    : db.createObjectStore(IMAGE_PERSISTENCE_STORE_MEDIA, { keyPath: 'id' });
  ensureIndex(media, 'createdAt', 'createdAt');
  ensureIndex(media, 'dataUrl', 'dataUrl', { unique: false });
};

let databasePromise: Promise<IDBDatabase> | null = null;
let activeDatabase: IDBDatabase | null = null;

const invalidateDatabase = (database?: IDBDatabase): void => {
  if (database && activeDatabase && database !== activeDatabase) return;
  const current = activeDatabase;
  activeDatabase = null;
  if (current) {
    try {
      current.close();
    } catch {
      // Closing an already closed connection is harmless.
    }
  }
  databasePromise = null;
};

export function openImageStudioDatabase(): Promise<IDBDatabase> {
  if (!isIndexedDbSupported()) {
    return Promise.reject(
      new ImagePersistenceError(
        'unsupported',
        'IndexedDB no está disponible en este entorno.',
      ),
    );
  }
  if (databasePromise) return databasePromise;

  let request: IDBOpenDBRequest;
  try {
    request = indexedDB.open(
      IMAGE_PERSISTENCE_DB_NAME,
      IMAGE_PERSISTENCE_DB_VERSION,
    );
  } catch (error) {
    return Promise.reject(
      new ImagePersistenceError('open', 'No se pudo abrir IndexedDB.', { cause: error }),
    );
  }

  const promise = new Promise<IDBDatabase>((resolve, reject) => {
    let settled = false;
    const fail = (error: unknown, code: ImagePersistenceError['code'], message: string) => {
      if (settled) return;
      settled = true;
      reject(error instanceof ImagePersistenceError ? error : new ImagePersistenceError(code, message, { cause: error }));
    };

    request.onupgradeneeded = (event) => {
      try {
        const upgradeRequest = event.target as IDBOpenDBRequest;
        ensureStoreSchema(upgradeRequest.result, upgradeRequest.transaction as IDBTransaction);
      } catch (error) {
        fail(error, 'open', 'No se pudo actualizar el esquema de IndexedDB.');
        try {
          request.transaction?.abort();
        } catch {
          // The browser will abort a failed upgrade if it is already inactive.
        }
      }
    };
    request.onblocked = () => {
      fail(
        new ImagePersistenceError(
          'blocked',
          'IndexedDB está bloqueado por otra pestaña. Cierra la pestaña anterior e inténtalo de nuevo.',
        ),
        'blocked',
        'IndexedDB está bloqueado.',
      );
    };
    request.onerror = () => {
      fail(request.error, 'open', 'No se pudo abrir IndexedDB.');
    };
    request.onsuccess = () => {
      const database = request.result;
      if (settled) {
        database.close();
        return;
      }
      activeDatabase = database;
      database.onversionchange = () => invalidateDatabase(database);
      database.onclose = () => {
        if (activeDatabase === database) invalidateDatabase(database);
      };
      settled = true;
      resolve(database);
    };
  });

  const wrappedPromise = promise.catch((error) => {
    if (databasePromise === wrappedPromise) databasePromise = null;
    throw error;
  });
  databasePromise = wrappedPromise;
  return databasePromise;
}

const runTransactionOnce = async <T>(
  storeNames: string[],
  mode: IDBTransactionMode,
  operation: (stores: Record<string, IDBObjectStore>) => T | Promise<T> | IDBRequest<unknown>,
): Promise<T> => {
  const database = await openImageStudioDatabase();
  return new Promise<T>((resolve, reject) => {
    let transaction: IDBTransaction;
    try {
      transaction = database.transaction(storeNames, mode);
    } catch (error) {
      reject(error);
      return;
    }

    let operationResult: T;
    let operationComplete = false;
    let transactionComplete = false;
    let rejected = false;

    const finish = () => {
      if (!rejected && operationComplete && transactionComplete) {
        resolve(operationResult);
      }
    };
    const fail = (error: unknown) => {
      if (rejected) return;
      rejected = true;
      reject(
        error instanceof Error
          ? error
          : new ImagePersistenceError('transaction', 'La transacción de IndexedDB falló.', { cause: error }),
      );
    };

    transaction.oncomplete = () => {
      transactionComplete = true;
      finish();
    };
    transaction.onerror = () => fail(transaction.error);
    transaction.onabort = () =>
      fail(
        transaction.error ??
          new ImagePersistenceError('transaction', 'La transacción de IndexedDB fue cancelada.'),
      );

    let result: T | Promise<T> | IDBRequest<unknown>;
    try {
      const stores = Object.fromEntries(
        storeNames.map((name) => [name, transaction.objectStore(name)]),
      ) as Record<string, IDBObjectStore>;
      result = operation(stores);
    } catch (error) {
      fail(error);
      try {
        transaction.abort();
      } catch {
        // The transaction may already be inactive.
      }
      return;
    }

    if (isRequest(result)) {
      result.onsuccess = () => {
        operationResult = result.result as T;
        operationComplete = true;
        finish();
      };
      result.onerror = () => fail(result.error);
      return;
    }

    Promise.resolve(result).then(
      (value) => {
        operationResult = value;
        operationComplete = true;
        finish();
      },
      (error) => {
        fail(error);
        try {
          transaction.abort();
        } catch {
          // The transaction may already be inactive.
        }
      },
    );
  });
};

export async function runImageStudioTransaction<T>(
  storeNames: string[],
  mode: IDBTransactionMode,
  operation: (stores: Record<string, IDBObjectStore>) => T | Promise<T> | IDBRequest<unknown>,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await runTransactionOnce(storeNames, mode, operation);
    } catch (error) {
      if (!isTransientError(error) || attempt >= MAX_TRANSACTION_RETRIES) {
        throw error;
      }
      attempt += 1;
      invalidateDatabase();
      await wait(RETRY_DELAY_MS * attempt);
    }
  }
}

export async function closeImageStudioDatabase(): Promise<void> {
  invalidateDatabase();
}

export async function deleteImageStudioDatabase(): Promise<void> {
  invalidateDatabase();
  if (!isIndexedDbSupported()) return;
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(IMAGE_PERSISTENCE_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () =>
      reject(
        new ImagePersistenceError(
          'blocked',
          'No se pudo borrar la base de datos porque otra pestaña la está usando.',
        ),
      );
  });
}

const dataImagePattern = /data:image\/[^'")\s]+/gi;
const mediaReferencePattern = /__vitablue_image_media__:[^'")\s]+/g;

const isDataImage = (value: string): boolean => /^data:image\//i.test(value);

const normalizeDataImageToken = (value: string): { token: string; suffix: string } => {
  const token = value.replace(/[),};]+$/g, '');
  return { token, suffix: value.slice(token.length) };
};

const replaceDataImagesInString = (
  value: string,
  resolver: (dataUrl: string) => string | undefined,
): string => {
  const full = normalizeDataImageToken(value);
  if (isDataImage(full.token)) {
    const replacement = resolver(full.token);
    return replacement ? replacement + full.suffix : value;
  }
  return value.replace(dataImagePattern, (match) => {
    const normalized = normalizeDataImageToken(match);
    const replacement = resolver(normalized.token);
    return replacement ? replacement + normalized.suffix : match;
  });
};

const replaceMediaReferencesInString = (
  value: string,
  resolver: (reference: string) => string | undefined,
): string => {
  const normalized = normalizeDataImageToken(value);
  const resolve = (match: string): string => {
    const token = normalizeDataImageToken(match).token;
    return resolver(token) ?? match;
  };
  if (normalized.token.startsWith(IMAGE_MEDIA_REFERENCE_PREFIX)) {
    const replacement = resolver(normalized.token);
    return replacement ? replacement + normalized.suffix : value;
  }
  return value.replace(mediaReferencePattern, resolve);
};

const mapDeep = (
  value: unknown,
  stringMapper: (value: string) => string,
): unknown => {
  if (typeof value === 'string') return stringMapper(value);
  if (Array.isArray(value)) return value.map((item) => mapDeep(item, stringMapper));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, mapDeep(entry, stringMapper)]),
    );
  }
  return value;
};

const migrateLayerText = (layer: ImageLayer): ImageLayer => {
  const props = { ...(layer.props ?? {}) };
  TEXT_PROP_KEYS.forEach((key) => {
    if (typeof props[key] === 'string' && props[key].trim()) {
      props[key] = normalizeTiptapHtml(props[key] as string);
    }
  });
  if (Array.isArray(props.childrenLayers)) {
    props.childrenLayers = props.childrenLayers.map((child) =>
      migrateLayerText(child as ImageLayer),
    );
  }
  const vectorGeometry = normalizeEditableVectorGeometry(
    layer.vectorGeometry ?? props.vectorGeometry,
  );
  if (vectorGeometry) props.vectorGeometry = vectorGeometry;
  else delete props.vectorGeometry;
  const { vectorGeometry: _storedVectorGeometry, ...layerWithoutVectorGeometry } = layer;
  return {
    ...layerWithoutVectorGeometry,
    props,
    ...(vectorGeometry ? { vectorGeometry } : {}),
  };
};

/**
 * Normalization intentionally does not resolve media references.  Resolution
 * requires the media map and is therefore only performed after media
 * hydration has completed.
 */
export const normalizeStoredProject = (project: ImageProject): ImageProject => ({
  ...clone(project),
  createdAt: project.createdAt || nowIso(),
  updatedAt: project.updatedAt || project.createdAt || nowIso(),
  layers: (project.layers ?? []).map(migrateLayerText),
  layout: {
    ...createDefaultLayoutMetadata(),
    ...(project.layout ?? {}),
  },
});

const hydrateProject = (
  project: ImageProject,
  mediaById: Map<string, UploadedImageMedia>,
): ImageProject => {
  const hydrated = mapDeep(clone(project), (value) =>
    replaceMediaReferencesInString(value, (reference) => {
      if (!reference.startsWith(IMAGE_MEDIA_REFERENCE_PREFIX)) return undefined;
      const mediaId = reference.slice(IMAGE_MEDIA_REFERENCE_PREFIX.length);
      return mediaById.get(mediaId)?.dataUrl;
    }),
  ) as ImageProject;
  return normalizeStoredProject(hydrated);
};

const mediaReferenceForUrl = (
  dataUrl: string,
  mediaByDataUrl: Map<string, UploadedImageMedia>,
): string | undefined => {
  const media = mediaByDataUrl.get(dataUrl);
  return media ? `${IMAGE_MEDIA_REFERENCE_PREFIX}${media.id}` : undefined;
};

export const serializeStoredProject = (
  project: ImageProject,
  mediaByDataUrl?: Map<string, UploadedImageMedia>,
): ImageProject =>
  mapDeep(clone(project), (value) =>
    replaceDataImagesInString(
      value,
      (candidate) =>
        mediaReferenceForUrl(
          candidate,
          mediaByDataUrl ??
            new Map([...state.media.values()].map((item) => [item.dataUrl, item])),
        ),
    ),
  ) as ImageProject;

const collectDataImages = (value: unknown, output: Set<string>): void => {
  if (typeof value === 'string') {
    const full = normalizeDataImageToken(value);
    if (isDataImage(full.token)) output.add(full.token);
    value.match(dataImagePattern)?.forEach((match) => {
      const normalized = normalizeDataImageToken(match);
      if (isDataImage(normalized.token)) output.add(normalized.token);
    });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectDataImages(item, output));
    return;
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach((entry) => collectDataImages(entry, output));
  }
};

const isMedia = (value: unknown): value is UploadedImageMedia => {
  if (!value || typeof value !== 'object') return false;
  const media = value as Partial<UploadedImageMedia>;
  return (
    typeof media.id === 'string' &&
    typeof media.title === 'string' &&
    typeof media.fileName === 'string' &&
    typeof media.mimeType === 'string' &&
    media.mimeType.startsWith('image/') &&
    typeof media.dataUrl === 'string' &&
    isDataImage(media.dataUrl) &&
    typeof media.sizeBytes === 'number' &&
    typeof media.createdAt === 'string' &&
    (media.updatedAt === undefined || typeof media.updatedAt === 'string')
  );
};

const dataUrlSize = (dataUrl: string): number => {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.ceil((base64.length * 3) / 4);
};

const mediaMimeType = (dataUrl: string): string =>
  dataUrl.match(/^data:([^;,]+)/i)?.[1] ?? 'image/png';

const stableMediaId = (dataUrl: string): string => {
  let hash = 2166136261;
  for (let index = 0; index < dataUrl.length; index += 1) {
    hash ^= dataUrl.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `media-inline-${(hash >>> 0).toString(36)}`;
};

const createMediaForDataUrl = (
  dataUrl: string,
  existing: Map<string, UploadedImageMedia>,
): UploadedImageMedia => {
  const known = existing.get(dataUrl);
  if (known) return known;
  const mimeType = mediaMimeType(dataUrl);
  return {
    id: stableMediaId(dataUrl),
    title: 'Imagen del proyecto',
    fileName: `imagen-${stableMediaId(dataUrl).slice(-8)}.${mimeType.split('/')[1] ?? 'png'}`,
    mimeType,
    dataUrl,
    sizeBytes: dataUrlSize(dataUrl),
    createdAt: nowIso(),
  };
};

const timestamp = (value: unknown, fallback = 0): number => {
  if (typeof value !== 'string') return fallback;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const chooseNewest = <T>(
  current: T | undefined,
  candidate: T,
  currentTimestamp: unknown,
  candidateTimestamp: unknown,
): T => {
  if (!current) return candidate;
  return timestamp(candidateTimestamp) > timestamp(currentTimestamp) ? candidate : current;
};

const parseLegacy = <T>(
  key: string,
  predicate: (value: unknown) => value is T,
): T[] => {
  if (!hasLocalStorage()) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(predicate);
  } catch {
    return [];
  }
};

const isProject = (value: unknown): value is ImageProject => {
  if (!value || typeof value !== 'object') return false;
  const project = value as Partial<ImageProject>;
  return (
    typeof project.id === 'string' &&
    typeof project.title === 'string' &&
    Boolean(project.preset) &&
    Boolean(project.background) &&
    Array.isArray(project.layers) &&
    (project.createdAt === undefined || typeof project.createdAt === 'string') &&
    (project.updatedAt === undefined || typeof project.updatedAt === 'string')
  );
};

const readLegacyProjects = (): ImageProject[] =>
  parseLegacy(IMAGE_STUDIO_STORAGE_KEY, isProject).map(normalizeStoredProject);

const readLegacyMedia = (): UploadedImageMedia[] => parseLegacy(IMAGE_MEDIA_STORAGE_KEY, isMedia);

const readLegacyRecovery = (): ImageRecoverySnapshot | null => {
  if (!hasLocalStorage()) return null;
  try {
    const raw = localStorage.getItem(IMAGE_STUDIO_RECOVERY_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      'project' in parsed &&
      'savedAt' in parsed &&
      isProject(parsed.project) &&
      typeof parsed.savedAt === 'string'
    ) {
      return {
        project: normalizeStoredProject(parsed.project),
        savedAt: parsed.savedAt,
      };
    }
  } catch {
    // A corrupt legacy snapshot should never prevent the editor from opening.
  }
  return null;
};

const writeLegacy = (key: string, value: unknown): { durable: boolean; error?: Error } => {
  if (!hasLocalStorage()) {
    return {
      durable: false,
      error: new ImagePersistenceError('unavailable', 'No hay un almacenamiento local disponible.'),
    };
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { durable: true };
  } catch (error) {
    const normalized = asError(error, 'No se pudo escribir en el almacenamiento local.');
    return {
      durable: false,
      error: new ImagePersistenceError(
        normalized.name === 'QuotaExceededError' ? 'quota' : 'unavailable',
        'No se pudo escribir en el almacenamiento local.',
        { cause: normalized },
      ),
    };
  }
};

const clearLegacyKey = (key: string): void => {
  if (!hasLocalStorage() || typeof localStorage.removeItem !== 'function') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // Keeping a migration backup is safer than failing the application.
  }
};

const readAllFromStore = async <T>(
  storeName: string,
  predicate: (value: unknown) => value is T,
): Promise<T[]> =>
  runImageStudioTransaction([storeName], 'readonly', (stores) => stores[storeName].getAll()).then(
    (values) => (Array.isArray(values) ? values.filter(predicate) : []),
  );

const readProjectRecords = (): Promise<ImageProject[]> =>
  readAllFromStore(IMAGE_PERSISTENCE_STORE_PROJECTS, isProject).then((projects) =>
    projects.map(normalizeStoredProject),
  );

const readMediaRecords = (): Promise<UploadedImageMedia[]> =>
  readAllFromStore(IMAGE_PERSISTENCE_STORE_MEDIA, isMedia);

const readRecoveryRecord = (): Promise<ImageRecoverySnapshot | null> =>
  runImageStudioTransaction(
    [IMAGE_PERSISTENCE_STORE_RECOVERY],
    'readonly',
    (stores) => stores[IMAGE_PERSISTENCE_STORE_RECOVERY].get(IMAGE_RECOVERY_ID),
  ).then((value) => {
    if (
      value &&
      typeof value === 'object' &&
      'project' in value &&
      'savedAt' in value &&
      isProject(value.project) &&
      typeof value.savedAt === 'string'
    ) {
      return {
        project: normalizeStoredProject(value.project),
        savedAt: value.savedAt,
      };
    }
    return null;
  });

const mergeMedia = (
  primary: UploadedImageMedia[],
  secondary: UploadedImageMedia[],
): Map<string, UploadedImageMedia> => {
  const merged = new Map<string, UploadedImageMedia>();
  primary.forEach((media) => merged.set(media.id, media));
  secondary.forEach((media) => {
    const current = merged.get(media.id);
    merged.set(
      media.id,
      chooseNewest(
        current,
        media,
        current?.updatedAt ?? current?.createdAt,
        media.updatedAt ?? media.createdAt,
      ),
    );
  });
  // IDs are the identity contract.  Keep records with duplicate data URLs so
  // a legacy project referencing either ID remains resolvable after migration.
  return merged;
};

const mergeProjects = (
  primary: ImageProject[],
  secondary: ImageProject[],
): Map<string, ImageProject> => {
  const merged = new Map<string, ImageProject>();
  primary.forEach((project) => merged.set(project.id, project));
  secondary.forEach((project) => {
    const current = merged.get(project.id);
    merged.set(
      project.id,
      chooseNewest(current, project, current?.updatedAt, project.updatedAt),
    );
  });
  return merged;
};

const createInitialProjects = (): Map<string, ImageProject> =>
  new Map(
    INITIAL_IMAGE_TEMPLATES.map((template) => {
      const normalized = normalizeStoredProject(template);
      return [normalized.id, normalized];
    }),
  );

interface RepositoryState {
  initialized: boolean;
  storage: ImagePersistenceStorage;
  error?: Error;
  projects: Map<string, ImageProject>;
  media: Map<string, UploadedImageMedia>;
  durableMediaIds: Set<string>;
  recovery: ImageRecoverySnapshot | null;
}

let state: RepositoryState = {
  initialized: false,
  storage: 'memory',
  projects: createInitialProjects(),
  media: new Map(),
  durableMediaIds: new Set(),
  recovery: null,
};
let initializationPromise: Promise<ImagePersistenceSnapshot> | null = null;
let legacyCacheLoaded = false;
let legacyStorageReference: Storage | null = null;
const pendingProjects = new Map<string, ImageProject>();
const pendingProjectDeletes = new Set<string>();
const pendingMedia = new Map<string, UploadedImageMedia>();
const pendingMediaDeletes = new Set<string>();
let pendingRecovery: ImageRecoverySnapshot | null | undefined;
const projectWriteQueue = { current: Promise.resolve() };
const mediaWriteQueue = { current: Promise.resolve() };
const recoveryWriteQueue = { current: Promise.resolve() };

const snapshot = (): ImagePersistenceSnapshot => ({
  projects: [...state.projects.values()].map(clone),
  media: [...state.media.values()].map(clone),
  recovery: state.recovery ? clone(state.recovery) : null,
  storage: state.storage,
  ready: true,
  ...(state.error ? { error: state.error } : {}),
});

const queue = <T>(
  tail: { current: Promise<void> },
  operation: () => Promise<T>,
): Promise<T> => {
  const next = tail.current.then(operation, operation);
  tail.current = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
};

const loadLegacyCacheSynchronously = (): void => {
  const storageReference = hasLocalStorage() ? localStorage : null;
  if (legacyCacheLoaded && storageReference === legacyStorageReference) return;
  legacyCacheLoaded = true;
  legacyStorageReference = storageReference;
  const legacyMedia = readLegacyMedia();
  state.media = mergeMedia([...state.media.values()], legacyMedia);
  state.durableMediaIds = new Set(legacyMedia.map((media) => media.id));

  const legacyProjects = readLegacyProjects();
  const systemTemplateIds = new Set(INITIAL_IMAGE_TEMPLATES.map((template) => template.id));
  const mergedProjects = createInitialProjects();
  // Cache entries that are not official templates may have been optimistically
  // created before initialization completed.
  [...state.projects.values()]
    .filter((project) => !systemTemplateIds.has(project.id))
    .forEach((project) => mergedProjects.set(project.id, project));
  // A legacy value always represents an intentional user edit, including an
  // edit to an official template.  It must not lose to this page-load's
  // freshly-created template timestamps.
  legacyProjects.forEach((project) => mergedProjects.set(project.id, project));
  const legacyRecovery = readLegacyRecovery();

  const allValues: unknown[] = [...mergedProjects.values()];
  if (legacyRecovery) allValues.push(legacyRecovery.project);
  const discovered = new Set<string>();
  allValues.forEach((value) => collectDataImages(value, discovered));
  discovered.forEach((dataUrl) => {
    const media = createMediaForDataUrl(dataUrl, new Map([...state.media.values()].map((item) => [item.dataUrl, item])));
    state.media.set(media.id, media);
  });

  const mediaById = state.media;
  state.projects = mergedProjects;
  for (const [id, project] of state.projects) {
    state.projects.set(id, hydrateProject(project, mediaById));
  }
  state.recovery = legacyRecovery
    ? { project: hydrateProject(legacyRecovery.project, mediaById), savedAt: legacyRecovery.savedAt }
    : null;
};

const applyPendingChanges = (
  projects: Map<string, ImageProject>,
  media: Map<string, UploadedImageMedia>,
): void => {
  pendingProjectDeletes.forEach((id) => projects.delete(id));
  pendingProjects.forEach((project, id) => projects.set(id, project));
  pendingMediaDeletes.forEach((id) => media.delete(id));
  pendingMedia.forEach((item, id) => media.set(id, item));
};

const ensureProjectMedia = (
  project: ImageProject,
  media: Map<string, UploadedImageMedia>,
): UploadedImageMedia[] => {
  const discovered = new Set<string>();
  collectDataImages(project, discovered);
  const byUrl = new Map([...media.values()].map((item) => [item.dataUrl, item]));
  const additions: UploadedImageMedia[] = [];
  discovered.forEach((dataUrl) => {
    const known = byUrl.get(dataUrl);
    if (!known) {
      const item = createMediaForDataUrl(dataUrl, byUrl);
      byUrl.set(dataUrl, item);
      media.set(item.id, item);
      additions.push(item);
    } else if (!state.durableMediaIds.has(known.id)) {
      // A synchronous compatibility upload may still be in flight.  Include
      // it in the project transaction so a reference can never commit before
      // its media record.
      additions.push(known);
    }
  });
  return additions;
};

const ensureRecoveryMedia = (
  recovery: ImageRecoverySnapshot,
  media: Map<string, UploadedImageMedia>,
): UploadedImageMedia[] => ensureProjectMedia(recovery.project, media);

const boundedMedia = (items: UploadedImageMedia[], pinnedId?: string): UploadedImageMedia[] => {
  const sorted = [...items].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
  while (sorted.length > MEDIA_LIBRARY_MAX_ITEMS) {
    const index = sorted.findIndex((item) => item.id !== pinnedId);
    if (index < 0) break;
    sorted.splice(index, 1);
  }
  while (sorted.length > 1) {
    const bytes = sorted.reduce((total, item) => total + item.sizeBytes, 0);
    if (bytes <= MAX_IMAGE_MEDIA_BYTES && JSON.stringify(sorted).length <= LEGACY_MEDIA_BUDGET_CHARS) {
      break;
    }
    const index = sorted.findIndex((item) => item.id !== pinnedId);
    if (index < 0) break;
    sorted.splice(index, 1);
  }
  return sorted;
};

const hydrateStateProjects = (): void => {
  const mediaById = state.media;
  for (const [id, project] of state.projects) {
    state.projects.set(id, hydrateProject(project, mediaById));
  }
  if (state.recovery) {
    state.recovery = {
      ...state.recovery,
      project: hydrateProject(state.recovery.project, mediaById),
    };
  }
};

const persistMigration = async (
  projects: Map<string, ImageProject>,
  media: Map<string, UploadedImageMedia>,
  recovery: ImageRecoverySnapshot | null,
): Promise<void> => {
  const mediaByDataUrl = new Map([...media.values()].map((item) => [item.dataUrl, item]));
  await runImageStudioTransaction(
    [
      IMAGE_PERSISTENCE_STORE_MEDIA,
      IMAGE_PERSISTENCE_STORE_PROJECTS,
      IMAGE_PERSISTENCE_STORE_RECOVERY,
    ],
    'readwrite',
    (stores) => {
      const mediaStore = stores[IMAGE_PERSISTENCE_STORE_MEDIA];
      const projectStore = stores[IMAGE_PERSISTENCE_STORE_PROJECTS];
      const recoveryStore = stores[IMAGE_PERSISTENCE_STORE_RECOVERY];
      media.forEach((item) => mediaStore.put(item));
      projects.forEach((project) =>
        projectStore.put(serializeStoredProject(project, mediaByDataUrl)),
      );
      if (recovery) {
        recoveryStore.put({
          id: IMAGE_RECOVERY_ID,
          project: serializeStoredProject(recovery.project, mediaByDataUrl),
          savedAt: recovery.savedAt,
        });
      }
    },
  );
};

const initializeInternal = async (): Promise<ImagePersistenceSnapshot> => {
  // Reading legacy values before opening IndexedDB guarantees that a failed
  // upgrade still leaves the user with all of their old work.
  loadLegacyCacheSynchronously();

  if (!isIndexedDbSupported()) {
    state.initialized = true;
    state.storage = hasLocalStorage() ? 'localStorage' : 'memory';
    state.error = new ImagePersistenceError(
      'unsupported',
      'IndexedDB no está disponible; se usará el almacenamiento local.',
    );
    hydrateStateProjects();
    return snapshot();
  }

  try {
    // This await is deliberate.  Project/recovery references are resolved
    // only after every media record has been put in the in-memory map.
    const indexedMedia = await readMediaRecords();
    const mergedMedia = mergeMedia(indexedMedia, [...state.media.values()]);
    const indexedProjects = await readProjectRecords();
    const indexedRecovery = await readRecoveryRecord();

    const systemTemplateIds = new Set(INITIAL_IMAGE_TEMPLATES.map((template) => template.id));
    const cachedUserProjects = [...state.projects.values()].filter(
      (project) => !systemTemplateIds.has(project.id),
    );
    const mergedProjects = mergeProjects(
      indexedProjects,
      [...readLegacyProjects(), ...cachedUserProjects],
    );
    // Initial templates are defaults, not a newer user edit.  They fill gaps
    // without replacing a project with the same id.
    INITIAL_IMAGE_TEMPLATES.forEach((template) => {
      if (!mergedProjects.has(template.id)) {
        mergedProjects.set(template.id, normalizeStoredProject(template));
      }
    });
    let mergedRecovery = indexedRecovery;
    if (state.recovery && (!mergedRecovery || timestamp(state.recovery.savedAt) > timestamp(mergedRecovery.savedAt))) {
      mergedRecovery = state.recovery;
    }

    applyPendingChanges(mergedProjects, mergedMedia);

    const valuesToScan: unknown[] = [...mergedProjects.values()];
    if (mergedRecovery) valuesToScan.push(mergedRecovery.project);
    const discovered = new Set<string>();
    valuesToScan.forEach((value) => collectDataImages(value, discovered));
    const byUrl = new Map([...mergedMedia.values()].map((item) => [item.dataUrl, item]));
    discovered.forEach((dataUrl) => {
      if (!byUrl.has(dataUrl)) {
        const media = createMediaForDataUrl(dataUrl, byUrl);
        byUrl.set(dataUrl, media);
        mergedMedia.set(media.id, media);
      }
    });

    state.media = mergedMedia;
    state.durableMediaIds = new Set(indexedMedia.map((item) => item.id));
    state.projects = mergedProjects;
    state.recovery = mergedRecovery;
    hydrateStateProjects();

    // The merged view is written in one transaction so media and references
    // cannot be migrated independently.
    await persistMigration(state.projects, state.media, state.recovery);
    state.durableMediaIds = new Set(state.media.keys());
    state.initialized = true;
    state.storage = 'indexeddb';
    state.error = undefined;
    clearLegacyKey(IMAGE_STUDIO_STORAGE_KEY);
    clearLegacyKey(IMAGE_STUDIO_RECOVERY_KEY);
    clearLegacyKey(IMAGE_MEDIA_STORAGE_KEY);
    dispatchMutation({ entity: 'media', operation: 'hydrate', storage: state.storage });
    dispatchMutation({ entity: 'project', operation: 'hydrate', storage: state.storage });
    return snapshot();
  } catch (error) {
    const normalized = asError(error, 'No se pudo inicializar el almacenamiento de Image Studio.');
    state.initialized = true;
    state.storage = hasLocalStorage() ? 'localStorage' : 'memory';
    state.error = normalized;
    // The cache already includes both legacy and any readable IDB records.
    hydrateStateProjects();
    return snapshot();
  }
};

export function initializeImagePersistence(): Promise<ImagePersistenceSnapshot> {
  if (initializationPromise) return initializationPromise;
  initializationPromise = initializeInternal().catch((error) => {
    // initializeInternal intentionally degrades to localStorage/memory.  This
    // final guard protects callers from an unexpected parser/runtime failure.
    const normalized = asError(error, 'No se pudo inicializar la persistencia.');
    state.initialized = true;
    state.storage = hasLocalStorage() ? 'localStorage' : 'memory';
    state.error = normalized;
    return snapshot();
  });
  return initializationPromise;
}

export function getImagePersistenceStatus(): {
  initialized: boolean;
  storage: ImagePersistenceStorage;
  error?: Error;
} {
  return {
    initialized: state.initialized,
    storage: state.storage,
    ...(state.error ? { error: state.error } : {}),
  };
}

export async function getStoredImageProjectsAsync(): Promise<ImageProject[]> {
  await initializeImagePersistence();
  return [...state.projects.values()].map(clone);
}

export function getStoredImageProjectsSync(): ImageProject[] {
  loadLegacyCacheSynchronously();
  return [...state.projects.values()].map(clone);
}

export async function getStoredImageMediaAsync(): Promise<UploadedImageMedia[]> {
  await initializeImagePersistence();
  return [...state.media.values()].map(clone);
}

export function getStoredImageMediaSync(): UploadedImageMedia[] {
  loadLegacyCacheSynchronously();
  return [...state.media.values()].map(clone);
}

export async function getRecoveryImageProjectAsync(): Promise<ImageRecoverySnapshot | null> {
  await initializeImagePersistence();
  return state.recovery ? clone(state.recovery) : null;
}

export function getRecoveryImageProjectSync(): ImageRecoverySnapshot | null {
  loadLegacyCacheSynchronously();
  return state.recovery ? clone(state.recovery) : null;
}

const fallbackProjectWrite = (project: ImageProject): PersistResult<ImageProject> => {
  const persistedMedia = boundedMedia([...state.media.values()]);
  const mediaByDataUrl = new Map(persistedMedia.map((item) => [item.dataUrl, item]));
  const mediaResult = writeLegacy(
    IMAGE_MEDIA_STORAGE_KEY,
    persistedMedia,
  );
  const projectResult = writeLegacy(
    IMAGE_STUDIO_STORAGE_KEY,
    [...state.projects.values()].map((item) => serializeStoredProject(item, mediaByDataUrl)),
  );
  const error = mediaResult.error ?? projectResult.error;
  return {
    value: clone(project),
    durable: mediaResult.durable && projectResult.durable,
    storage: mediaResult.durable && projectResult.durable ? 'localStorage' : 'memory',
    ...(error ? { error } : {}),
  };
};

const persistProjectToIndexedDb = async (
  project: ImageProject,
  mediaAdditions: UploadedImageMedia[],
): Promise<void> => {
  const mediaByDataUrl = new Map([...state.media.values()].map((item) => [item.dataUrl, item]));
  await runImageStudioTransaction(
    [IMAGE_PERSISTENCE_STORE_MEDIA, IMAGE_PERSISTENCE_STORE_PROJECTS],
    'readwrite',
    (stores) => {
      mediaAdditions.forEach((item) =>
        stores[IMAGE_PERSISTENCE_STORE_MEDIA].put(item),
      );
      stores[IMAGE_PERSISTENCE_STORE_PROJECTS].put(
        serializeStoredProject(project, mediaByDataUrl),
      );
    },
  );
};

export async function persistImageProject(
  project: ImageProject,
  options: SaveProjectOptions = {},
): Promise<PersistResult<ImageProject>> {
  loadLegacyCacheSynchronously();
  const touchUpdatedAt = options.touchUpdatedAt ?? false;
  const nextProject = normalizeStoredProject({
    ...project,
    updatedAt: touchUpdatedAt ? nowIso() : project.updatedAt || nowIso(),
  });
  state.projects.set(nextProject.id, nextProject);
  pendingProjects.set(nextProject.id, nextProject);
  pendingProjectDeletes.delete(nextProject.id);

  // Preserve the historical synchronous behaviour when IndexedDB is absent
  // (SSR, older browsers and the legacy API).  The canonical browser path
  // below still waits for the real IndexedDB transaction.
  if (!isIndexedDbSupported()) {
    ensureProjectMedia(nextProject, state.media);
    const fallback = fallbackProjectWrite(nextProject);
    if (fallback.durable) {
      pendingProjects.delete(nextProject.id);
      state.durableMediaIds = new Set(
        boundedMedia([...state.media.values()]).map((item) => item.id),
      );
      dispatchMutation({
        entity: 'project',
        operation: 'save',
        id: nextProject.id,
        storage: fallback.storage,
      });
    }
    return fallback;
  }

  return queue(projectWriteQueue, async () => {
    await initializeImagePersistence();
    const mediaAdditions = ensureProjectMedia(nextProject, state.media);
    try {
      if (state.storage === 'indexeddb') {
        await persistProjectToIndexedDb(nextProject, mediaAdditions);
        mediaAdditions.forEach((item) => {
          state.durableMediaIds.add(item.id);
          pendingMedia.delete(item.id);
        });
        state.projects.set(nextProject.id, hydrateProject(nextProject, state.media));
        if (pendingProjects.get(nextProject.id) === nextProject) {
          pendingProjects.delete(nextProject.id);
        }
        if (mediaAdditions.length > 0) {
          dispatchMutation({
            entity: 'media',
            operation: 'save',
            storage: state.storage,
          });
        }
        dispatchMutation({
          entity: 'project',
          operation: 'save',
          id: nextProject.id,
          storage: state.storage,
        });
        return {
          value: clone(state.projects.get(nextProject.id) as ImageProject),
          durable: true,
          storage: state.storage,
        };
      }
      const fallback = fallbackProjectWrite(nextProject);
      if (fallback.durable) {
        pendingProjects.delete(nextProject.id);
        state.durableMediaIds = new Set(
          boundedMedia([...state.media.values()]).map((item) => item.id),
        );
        dispatchMutation({
          entity: 'project',
          operation: 'save',
          id: nextProject.id,
          storage: fallback.storage,
        });
      }
      return fallback;
    } catch (error) {
      const normalized = asError(error, 'No se pudo guardar el proyecto en IndexedDB.');
      const fallback = fallbackProjectWrite(nextProject);
      if (fallback.durable) {
        pendingProjects.delete(nextProject.id);
        dispatchMutation({
          entity: 'project',
          operation: 'save',
          id: nextProject.id,
          storage: fallback.storage,
        });
        return fallback;
      }
      return {
        value: clone(nextProject),
        durable: false,
        storage: 'memory',
        error: normalized,
      };
    }
  });
}

const fallbackRecoveryWrite = (
  recovery: ImageRecoverySnapshot,
): PersistResult<ImageRecoverySnapshot> => {
  const persistedMedia = boundedMedia([...state.media.values()]);
  const mediaByDataUrl = new Map(persistedMedia.map((item) => [item.dataUrl, item]));
  const mediaResult = writeLegacy(
    IMAGE_MEDIA_STORAGE_KEY,
    persistedMedia,
  );
  const recoveryResult = writeLegacy(IMAGE_STUDIO_RECOVERY_KEY, {
    project: serializeStoredProject(recovery.project, mediaByDataUrl),
    savedAt: recovery.savedAt,
  });
  const error = mediaResult.error ?? recoveryResult.error;
  return {
    value: clone(recovery),
    durable: mediaResult.durable && recoveryResult.durable,
    storage: mediaResult.durable && recoveryResult.durable ? 'localStorage' : 'memory',
    ...(error ? { error } : {}),
  };
};

export async function persistImageRecovery(
  project: ImageProject,
): Promise<PersistResult<ImageRecoverySnapshot>> {
  loadLegacyCacheSynchronously();
  const nextRecovery: ImageRecoverySnapshot = {
    project: normalizeStoredProject(project),
    savedAt: nowIso(),
  };
  state.recovery = nextRecovery;
  pendingRecovery = nextRecovery;

  if (!isIndexedDbSupported()) {
    ensureRecoveryMedia(nextRecovery, state.media);
    const fallback = fallbackRecoveryWrite(nextRecovery);
    if (fallback.durable) {
      pendingRecovery = undefined;
      state.durableMediaIds = new Set(
        boundedMedia([...state.media.values()]).map((item) => item.id),
      );
      dispatchMutation({
        entity: 'recovery',
        operation: 'save',
        storage: fallback.storage,
      });
    }
    return fallback;
  }

  return queue(recoveryWriteQueue, async () => {
    await initializeImagePersistence();
    const mediaAdditions = ensureRecoveryMedia(nextRecovery, state.media);
    try {
      if (state.storage === 'indexeddb') {
        const mediaByDataUrl = new Map([...state.media.values()].map((item) => [item.dataUrl, item]));
        await runImageStudioTransaction(
          [IMAGE_PERSISTENCE_STORE_MEDIA, IMAGE_PERSISTENCE_STORE_RECOVERY],
          'readwrite',
          (stores) => {
            mediaAdditions.forEach((item) => stores[IMAGE_PERSISTENCE_STORE_MEDIA].put(item));
            stores[IMAGE_PERSISTENCE_STORE_RECOVERY].put({
              id: IMAGE_RECOVERY_ID,
              project: serializeStoredProject(nextRecovery.project, mediaByDataUrl),
              savedAt: nextRecovery.savedAt,
            });
          },
        );
        mediaAdditions.forEach((item) => {
          state.durableMediaIds.add(item.id);
          pendingMedia.delete(item.id);
        });
        if (pendingRecovery === nextRecovery) pendingRecovery = undefined;
        state.recovery = {
          ...nextRecovery,
          project: hydrateProject(nextRecovery.project, state.media),
        };
        if (mediaAdditions.length > 0) {
          dispatchMutation({ entity: 'media', operation: 'save', storage: state.storage });
        }
        dispatchMutation({ entity: 'recovery', operation: 'save', storage: state.storage });
        return {
          value: clone(state.recovery),
          durable: true,
          storage: state.storage,
        };
      }
      const fallback = fallbackRecoveryWrite(nextRecovery);
      if (fallback.durable) {
        pendingRecovery = undefined;
        state.durableMediaIds = new Set(
          boundedMedia([...state.media.values()]).map((item) => item.id),
        );
        dispatchMutation({ entity: 'recovery', operation: 'save', storage: fallback.storage });
      }
      return fallback;
    } catch (error) {
      const normalized = asError(error, 'No se pudo guardar la recuperación.');
      const fallback = fallbackRecoveryWrite(nextRecovery);
      if (fallback.durable) {
        pendingRecovery = undefined;
        state.durableMediaIds = new Set(
          boundedMedia([...state.media.values()]).map((item) => item.id),
        );
        dispatchMutation({ entity: 'recovery', operation: 'save', storage: fallback.storage });
        return fallback;
      }
      return {
        value: clone(nextRecovery),
        durable: false,
        storage: 'memory',
        error: normalized,
      };
    }
  });
}

export async function clearImageRecovery(): Promise<PersistResult<null>> {
  loadLegacyCacheSynchronously();
  const previousRecovery = state.recovery;
  const previousPendingRecovery = pendingRecovery;
  state.recovery = null;
  pendingRecovery = null;
  if (!isIndexedDbSupported()) {
    if (!hasLocalStorage()) {
      state.recovery = previousRecovery;
      pendingRecovery = previousPendingRecovery;
      return {
        value: null,
        durable: false,
        storage: 'memory',
        error: new ImagePersistenceError('unavailable', 'No hay almacenamiento disponible.'),
      };
    }
    try {
      if (typeof localStorage.removeItem === 'function') {
        localStorage.removeItem(IMAGE_STUDIO_RECOVERY_KEY);
      }
      dispatchMutation({ entity: 'recovery', operation: 'delete', storage: 'localStorage' });
      return { value: null, durable: true, storage: 'localStorage' };
    } catch (error) {
      state.recovery = previousRecovery;
      pendingRecovery = previousPendingRecovery;
      return {
        value: null,
        durable: false,
        storage: 'memory',
        error: asError(error, 'No se pudo borrar la recuperación.'),
      };
    }
  }
  return queue(recoveryWriteQueue, async () => {
    await initializeImagePersistence();
    try {
      if (state.storage === 'indexeddb') {
        await runImageStudioTransaction(
          [IMAGE_PERSISTENCE_STORE_RECOVERY],
          'readwrite',
          (stores) => stores[IMAGE_PERSISTENCE_STORE_RECOVERY].delete(IMAGE_RECOVERY_ID),
        );
        dispatchMutation({ entity: 'recovery', operation: 'delete', storage: state.storage });
        return { value: null, durable: true, storage: state.storage };
      }
      if (!hasLocalStorage()) {
        state.recovery = previousRecovery;
        pendingRecovery = previousPendingRecovery;
        return {
          value: null,
          durable: false,
          storage: 'memory',
          error: new ImagePersistenceError('unavailable', 'No hay almacenamiento disponible.'),
        };
      }
      clearLegacyKey(IMAGE_STUDIO_RECOVERY_KEY);
      dispatchMutation({ entity: 'recovery', operation: 'delete', storage: state.storage });
      return { value: null, durable: true, storage: state.storage };
    } catch (error) {
      const normalized = asError(error, 'No se pudo borrar la recuperación.');
      state.recovery = previousRecovery;
      pendingRecovery = previousPendingRecovery;
      return { value: null, durable: false, storage: 'memory', error: normalized };
    }
  });
}

export async function deleteImageProject(id: string): Promise<PersistResult<null>> {
  loadLegacyCacheSynchronously();
  const deletedProject = state.projects.get(id);
  const deletedRecovery =
    state.recovery?.project.id === id ? state.recovery : null;
  const previousPendingRecovery = pendingRecovery;
  const existed = state.projects.delete(id);
  pendingProjects.delete(id);
  pendingProjectDeletes.add(id);
  if (deletedRecovery) {
    state.recovery = null;
    pendingRecovery = null;
  }
  if (!isIndexedDbSupported()) {
    const fallback = writeLegacy(
      IMAGE_STUDIO_STORAGE_KEY,
      [...state.projects.values()].map((project) =>
        serializeStoredProject(
          project,
          new Map([...state.media.values()].map((item) => [item.dataUrl, item])),
        ),
      ),
    );
    if (fallback.durable) {
      pendingProjectDeletes.delete(id);
      if (existed) {
        dispatchMutation({
          entity: 'project',
          operation: 'delete',
          id,
          storage: 'localStorage',
        });
      }
      if (deletedRecovery && hasLocalStorage() && typeof localStorage.removeItem === 'function') {
        try {
          localStorage.removeItem(IMAGE_STUDIO_RECOVERY_KEY);
        } catch {
          // The project write already completed; recovery cleanup is best effort.
        }
      }
      if (deletedRecovery) {
        dispatchMutation({
          entity: 'recovery',
          operation: 'delete',
          storage: 'localStorage',
        });
      }
      return {
        value: null,
        durable: true,
        storage: 'localStorage',
      };
    }
    if (deletedProject) state.projects.set(id, deletedProject);
    if (deletedRecovery) {
      if (fallback.durable) {
        pendingRecovery = undefined;
        clearLegacyKey(IMAGE_STUDIO_RECOVERY_KEY);
        dispatchMutation({
          entity: 'recovery',
          operation: 'delete',
          storage: state.storage,
        });
      } else {
        state.recovery = deletedRecovery;
        pendingRecovery = previousPendingRecovery;
      }
    }
    pendingProjectDeletes.delete(id);
    return {
      value: null,
      durable: false,
      storage: 'memory',
      ...(fallback.error ? { error: fallback.error } : {}),
    };
  }
  return queue(projectWriteQueue, async () => {
    await initializeImagePersistence();
    try {
      if (state.storage === 'indexeddb') {
        await runImageStudioTransaction(
          deletedRecovery
            ? [IMAGE_PERSISTENCE_STORE_PROJECTS, IMAGE_PERSISTENCE_STORE_RECOVERY]
            : [IMAGE_PERSISTENCE_STORE_PROJECTS],
          'readwrite',
          (stores) => {
            stores[IMAGE_PERSISTENCE_STORE_PROJECTS].delete(id);
            if (deletedRecovery) {
              stores[IMAGE_PERSISTENCE_STORE_RECOVERY].delete(IMAGE_RECOVERY_ID);
            }
          },
        );
        pendingProjectDeletes.delete(id);
        if (existed) {
          dispatchMutation({ entity: 'project', operation: 'delete', id, storage: state.storage });
        }
        if (deletedRecovery) {
          pendingRecovery = undefined;
          dispatchMutation({ entity: 'recovery', operation: 'delete', storage: state.storage });
        }
        return { value: null, durable: true, storage: state.storage };
      }
      const fallback = writeLegacy(
        IMAGE_STUDIO_STORAGE_KEY,
        [...state.projects.values()].map((project) =>
          serializeStoredProject(
            project,
            new Map([...state.media.values()].map((item) => [item.dataUrl, item])),
          ),
        ),
      );
      if (fallback.durable) {
        pendingProjectDeletes.delete(id);
        if (existed) {
          dispatchMutation({ entity: 'project', operation: 'delete', id, storage: state.storage });
        }
      } else if (deletedProject) {
        state.projects.set(id, deletedProject);
        pendingProjectDeletes.delete(id);
      }
      if (deletedRecovery) {
        if (fallback.durable) {
          pendingRecovery = undefined;
          clearLegacyKey(IMAGE_STUDIO_RECOVERY_KEY);
          dispatchMutation({
            entity: 'recovery',
            operation: 'delete',
            storage: state.storage,
          });
        } else {
          state.recovery = deletedRecovery;
          pendingRecovery = previousPendingRecovery;
        }
      }
      return {
        value: null,
        durable: fallback.durable,
        storage: fallback.durable ? state.storage : 'memory',
        ...(fallback.error ? { error: fallback.error } : {}),
      };
    } catch (error) {
      const normalized = asError(error, 'No se pudo borrar el proyecto.');
      if (deletedProject) state.projects.set(id, deletedProject);
      if (deletedRecovery) {
        state.recovery = deletedRecovery;
        pendingRecovery = previousPendingRecovery;
      }
      pendingProjectDeletes.delete(id);
      return {
        value: null,
        durable: false,
        storage: 'memory',
        error: normalized,
      };
    }
  });
}

const containsMediaReference = (value: unknown, id: string): boolean => {
  let found = false;
  const reference = `${IMAGE_MEDIA_REFERENCE_PREFIX}${id}`;
  const visit = (entry: unknown): void => {
    if (found) return;
    if (typeof entry === 'string') {
      if (entry.includes(reference)) found = true;
      return;
    }
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }
    if (entry && typeof entry === 'object') Object.values(entry).forEach(visit);
  };
  visit(value);
  return found;
};

const containsDataImage = (value: unknown, dataUrl: string): boolean => {
  const images = new Set<string>();
  collectDataImages(value, images);
  return images.has(dataUrl);
};

const replaceMediaReference = (
  value: unknown,
  id: string,
  dataUrl: string,
): unknown =>
  mapDeep(value, (entry) =>
    replaceMediaReferencesInString(entry, (candidate) => {
      const reference = `${IMAGE_MEDIA_REFERENCE_PREFIX}${id}`;
      return candidate.includes(reference)
        ? candidate.replaceAll(reference, dataUrl)
        : undefined;
    }),
  );

export async function deleteImageMedia(id: string): Promise<PersistResult<null>> {
  loadLegacyCacheSynchronously();
  const media = state.media.get(id);
  if (!media) return { value: null, durable: true, storage: state.storage };
  const mediaWasDurable = state.durableMediaIds.has(id);
  const pendingMediaValue = pendingMedia.get(id);
  const previousRecovery = state.recovery;
  const previousPendingRecovery = pendingRecovery;
  const recoveryUsesMedia = Boolean(
    previousRecovery && containsDataImage(previousRecovery.project, media.dataUrl),
  );
  const updatedRecovery = recoveryUsesMedia && previousRecovery
    ? {
        ...previousRecovery,
        project: normalizeStoredProject(previousRecovery.project),
        savedAt: nowIso(),
      }
    : null;

  const previousProjects = new Map(
    [...state.projects.entries()]
      .filter(
        ([, project]) =>
          containsMediaReference(project, id) ||
          containsDataImage(project, media.dataUrl),
      )
      .map(([projectId, project]) => [projectId, clone(project)]),
  );
  state.media.delete(id);
  state.durableMediaIds.delete(id);
  pendingMedia.delete(id);
  pendingMediaDeletes.add(id);

  const affectedProjects = [...state.projects.values()]
    .filter(
      (project) =>
        containsMediaReference(project, id) ||
        containsDataImage(project, media.dataUrl),
    )
    .map((project) =>
      normalizeStoredProject({
        ...(replaceMediaReference(project, id, media.dataUrl) as ImageProject),
        updatedAt: nowIso(),
      }),
    );
  affectedProjects.forEach((project) => state.projects.set(project.id, project));
    if (updatedRecovery) {
      state.recovery = updatedRecovery;
      pendingRecovery = updatedRecovery;
    }

    if (!isIndexedDbSupported()) {
      const persistedMedia = boundedMedia([...state.media.values()]);
      const mediaResult = writeLegacy(IMAGE_MEDIA_STORAGE_KEY, persistedMedia);
      const projectResult = writeLegacy(
        IMAGE_STUDIO_STORAGE_KEY,
        [...state.projects.values()].map((project) =>
          serializeStoredProject(
            project,
            new Map(persistedMedia.map((item) => [item.dataUrl, item])),
          ),
        ),
      );
      const recoveryResult = updatedRecovery
        ? writeLegacy(IMAGE_STUDIO_RECOVERY_KEY, {
            project: serializeStoredProject(
              updatedRecovery.project,
              new Map(persistedMedia.map((item) => [item.dataUrl, item])),
            ),
            savedAt: updatedRecovery.savedAt,
          })
        : { durable: true };
      const durable = mediaResult.durable && projectResult.durable && recoveryResult.durable;
      if (durable) {
        pendingMediaDeletes.delete(id);
        state.durableMediaIds = new Set(persistedMedia.map((item) => item.id));
        affectedProjects.forEach((project) =>
          dispatchMutation({
            entity: 'project',
            operation: 'save',
            id: project.id,
            storage: 'localStorage',
          }),
        );
        if (updatedRecovery) {
          pendingRecovery = undefined;
          dispatchMutation({
            entity: 'recovery',
            operation: 'save',
            storage: 'localStorage',
          });
        }
        dispatchMutation({ entity: 'media', operation: 'delete', id, storage: 'localStorage' });
        return { value: null, durable: true, storage: 'localStorage' };
      }
      state.media.set(id, media);
      if (mediaWasDurable) state.durableMediaIds.add(id);
      if (pendingMediaValue) pendingMedia.set(id, pendingMediaValue);
      previousProjects.forEach((project, projectId) => state.projects.set(projectId, project));
      if (updatedRecovery) {
        state.recovery = previousRecovery;
        pendingRecovery = previousPendingRecovery;
      }
      pendingMediaDeletes.delete(id);
      return {
        value: null,
        durable: false,
        storage: 'memory',
        ...(mediaResult.error ?? projectResult.error ?? recoveryResult.error
          ? { error: mediaResult.error ?? projectResult.error ?? recoveryResult.error }
          : {}),
      };
    }

  return queue(mediaWriteQueue, async () => {
    await initializeImagePersistence();
    try {
      if (state.storage === 'indexeddb') {
        await runImageStudioTransaction(
          updatedRecovery
            ? [
                IMAGE_PERSISTENCE_STORE_MEDIA,
                IMAGE_PERSISTENCE_STORE_PROJECTS,
                IMAGE_PERSISTENCE_STORE_RECOVERY,
              ]
            : [IMAGE_PERSISTENCE_STORE_MEDIA, IMAGE_PERSISTENCE_STORE_PROJECTS],
          'readwrite',
          (stores) => {
            stores[IMAGE_PERSISTENCE_STORE_MEDIA].delete(id);
            affectedProjects.forEach((project) =>
              stores[IMAGE_PERSISTENCE_STORE_PROJECTS].put(
                serializeStoredProject(
                  project,
                  new Map([...state.media.values()].map((item) => [item.dataUrl, item])),
                ),
              ),
            );
            if (updatedRecovery) {
              stores[IMAGE_PERSISTENCE_STORE_RECOVERY].put({
                id: IMAGE_RECOVERY_ID,
                project: serializeStoredProject(
                  updatedRecovery.project,
                  new Map([...state.media.values()].map((item) => [item.dataUrl, item])),
                ),
                savedAt: updatedRecovery.savedAt,
              });
            }
          },
        );
        pendingMediaDeletes.delete(id);
        affectedProjects.forEach((project) =>
          dispatchMutation({
            entity: 'project',
            operation: 'save',
            id: project.id,
            storage: state.storage,
          }),
        );
        if (updatedRecovery) {
          pendingRecovery = undefined;
          dispatchMutation({
            entity: 'recovery',
            operation: 'save',
            storage: state.storage,
          });
        }
        dispatchMutation({ entity: 'media', operation: 'delete', id, storage: state.storage });
        return { value: null, durable: true, storage: state.storage };
      }
      const mediaResult = writeLegacy(
        IMAGE_MEDIA_STORAGE_KEY,
        boundedMedia([...state.media.values()]),
      );
      const projectResult = writeLegacy(
        IMAGE_STUDIO_STORAGE_KEY,
        [...state.projects.values()].map((project) =>
          serializeStoredProject(
            project,
            new Map([...state.media.values()].map((item) => [item.dataUrl, item])),
          ),
        ),
      );
      const recoveryResult: { durable: boolean; error?: Error } = updatedRecovery
        ? writeLegacy(IMAGE_STUDIO_RECOVERY_KEY, {
            project: serializeStoredProject(
              updatedRecovery.project,
              new Map([...state.media.values()].map((item) => [item.dataUrl, item])),
            ),
            savedAt: updatedRecovery.savedAt,
          })
        : { durable: true };
      const durable = mediaResult.durable && projectResult.durable && recoveryResult.durable;
      if (durable) {
        pendingMediaDeletes.delete(id);
        affectedProjects.forEach((project) =>
          dispatchMutation({
            entity: 'project',
            operation: 'save',
            id: project.id,
            storage: state.storage,
          }),
        );
        if (updatedRecovery) {
          pendingRecovery = undefined;
          dispatchMutation({
            entity: 'recovery',
            operation: 'save',
            storage: state.storage,
          });
        }
        dispatchMutation({ entity: 'media', operation: 'delete', id, storage: state.storage });
      } else {
        state.media.set(id, media);
        if (mediaWasDurable) state.durableMediaIds.add(id);
        if (pendingMediaValue) pendingMedia.set(id, pendingMediaValue);
        previousProjects.forEach((project, projectId) => state.projects.set(projectId, project));
        if (updatedRecovery) {
          state.recovery = previousRecovery;
          pendingRecovery = previousPendingRecovery;
        }
        pendingMediaDeletes.delete(id);
      }
      return {
        value: null,
        durable,
        storage: durable ? state.storage : 'memory',
        ...(mediaResult.error ?? projectResult.error ?? recoveryResult.error
          ? { error: mediaResult.error ?? projectResult.error ?? recoveryResult.error }
          : {}),
      };
    } catch (error) {
      state.media.set(id, media);
      if (mediaWasDurable) state.durableMediaIds.add(id);
      if (pendingMediaValue) pendingMedia.set(id, pendingMediaValue);
      previousProjects.forEach((project, projectId) => state.projects.set(projectId, project));
      if (updatedRecovery) {
        state.recovery = previousRecovery;
        pendingRecovery = previousPendingRecovery;
      }
      pendingMediaDeletes.delete(id);
      return {
        value: null,
        durable: false,
        storage: 'memory',
        error: asError(error, 'No se pudo borrar el medio.'),
      };
    }
  });
}

export async function saveImageMedia(
  media: UploadedImageMedia,
): Promise<PersistResult<UploadedImageMedia>> {
  loadLegacyCacheSynchronously();
  state.media.set(media.id, media);
  pendingMedia.set(media.id, media);
  pendingMediaDeletes.delete(media.id);
  return queue(mediaWriteQueue, async () => {
    await initializeImagePersistence();
    try {
      if (state.storage === 'indexeddb') {
        await runImageStudioTransaction(
          [IMAGE_PERSISTENCE_STORE_MEDIA],
          'readwrite',
          (stores) => stores[IMAGE_PERSISTENCE_STORE_MEDIA].put(media),
        );
        state.durableMediaIds.add(media.id);
        if (pendingMedia.get(media.id) === media) pendingMedia.delete(media.id);
        dispatchMutation({ entity: 'media', operation: 'save', id: media.id, storage: state.storage });
        return {
          value: clone(media),
          durable: true,
          storage: state.storage,
        };
      }
      const items = boundedMedia([...state.media.values()], media.id);
      state.media = new Map(items.map((item) => [item.id, item]));
      const fallback = writeLegacy(IMAGE_MEDIA_STORAGE_KEY, items);
      if (fallback.durable) {
        pendingMedia.delete(media.id);
        state.durableMediaIds = new Set(state.media.keys());
        dispatchMutation({ entity: 'media', operation: 'save', id: media.id, storage: state.storage });
      }
      return {
        value: clone(media),
        durable: fallback.durable,
        storage: fallback.durable ? state.storage : 'memory',
        ...(fallback.error ? { error: fallback.error } : {}),
      };
    } catch (error) {
      const normalized = asError(error, 'No se pudo guardar el medio.');
      const fallbackMedia = boundedMedia([...state.media.values()], media.id);
      const fallback = writeLegacy(
        IMAGE_MEDIA_STORAGE_KEY,
        fallbackMedia,
      );
      if (fallback.durable) {
        state.media = new Map(fallbackMedia.map((item) => [item.id, item]));
        pendingMedia.delete(media.id);
        state.durableMediaIds = new Set(fallbackMedia.map((item) => item.id));
        dispatchMutation({
          entity: 'media',
          operation: 'save',
          id: media.id,
          storage: 'localStorage',
        });
        return {
          value: clone(media),
          durable: true,
          storage: 'localStorage',
        };
      }
      return { value: clone(media), durable: false, storage: 'memory', error: normalized };
    }
  });
}

const uploadValidation = (
  dataUrl: string,
): { valid: true; sizeBytes: number } | { valid: false; error: string } => {
  if (!isDataImage(dataUrl)) {
    return { valid: false, error: 'El archivo no contiene una imagen válida.' };
  }
  const sizeBytes = dataUrlSize(dataUrl);
  if (sizeBytes > MAX_IMAGE_MEDIA_ITEM_BYTES) {
    return {
      valid: false,
      error: 'La imagen es demasiado grande para guardarla en tu biblioteca (máximo 2,5 MB).',
    };
  }
  return { valid: true, sizeBytes };
};

export async function saveUploadedImageMediaAsync(
  dataUrl: string,
  metadata: { title: string; fileName: string; mimeType: string },
): Promise<{ media: UploadedImageMedia | null; persisted: boolean; error?: string; warning?: string }> {
  const validation = uploadValidation(dataUrl);
  if (!validation.valid) return { media: null, persisted: false, error: validation.error };
  await initializeImagePersistence();
  const existing = [...state.media.values()].find((item) => item.dataUrl === dataUrl);
  if (existing) {
    if (!state.durableMediaIds.has(existing.id) && state.storage === 'indexeddb') {
      const persisted = await saveImageMedia(existing);
      return persisted.durable
        ? { media: persisted.value, persisted: true }
        : {
            media: persisted.value,
            persisted: false,
            warning: 'La imagen está disponible en este diseño, pero no se pudo conservar en Míos.',
          };
    }
    return {
      media: clone(existing),
      persisted: state.durableMediaIds.has(existing.id),
    };
  }
  const media: UploadedImageMedia = {
    id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: metadata.title.trim() || 'Imagen subida',
    fileName: metadata.fileName,
    mimeType: metadata.mimeType || mediaMimeType(dataUrl),
    dataUrl,
    sizeBytes: validation.sizeBytes,
    createdAt: nowIso(),
  };
  const result = await saveImageMedia(media);
  return result.durable
    ? { media: result.value, persisted: true }
    : {
        media: result.value,
        persisted: false,
        warning: 'La imagen está disponible en este diseño, pero no se pudo conservar en Míos.',
      };
}

/**
 * Synchronous compatibility helper.  It updates the render cache immediately
 * and starts the canonical async write; new UI code should await the async
 * variant so it can display the real transaction result.
 */
export function saveUploadedImageMediaSync(
  dataUrl: string,
  metadata: { title: string; fileName: string; mimeType: string },
): { media: UploadedImageMedia | null; persisted: boolean; error?: string; warning?: string } {
  const validation = uploadValidation(dataUrl);
  if (!validation.valid) return { media: null, persisted: false, error: validation.error };
  loadLegacyCacheSynchronously();
  const existing = [...state.media.values()].find((item) => item.dataUrl === dataUrl);
  if (existing) {
    return {
      media: existing,
      persisted: state.durableMediaIds.has(existing.id),
    };
  }
  const media: UploadedImageMedia = {
    id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: metadata.title.trim() || 'Imagen subida',
    fileName: metadata.fileName,
    mimeType: metadata.mimeType || mediaMimeType(dataUrl),
    dataUrl,
    sizeBytes: validation.sizeBytes,
    createdAt: nowIso(),
  };
  state.media.set(media.id, media);
  pendingMedia.set(media.id, media);

  if (!isIndexedDbSupported()) {
    const items = boundedMedia([...state.media.values()], media.id);
    state.media = new Map(items.map((item) => [item.id, item]));
    const fallback = writeLegacy(IMAGE_MEDIA_STORAGE_KEY, items);
    if (fallback.durable) {
      pendingMedia.delete(media.id);
      state.durableMediaIds = new Set(state.media.keys());
      dispatchMutation({
        entity: 'media',
        operation: 'save',
        id: media.id,
        storage: 'localStorage',
      });
      return {
        media,
        persisted: true,
      };
    }
    return {
      media,
      persisted: false,
      warning: 'La imagen está disponible en este diseño, pero no se pudo conservar en Míos.',
    };
  }

  void saveImageMedia(media).catch(() => undefined);
  return {
    media,
    persisted: false,
    warning: 'La imagen se está guardando en tu biblioteca.',
  };
}

export function getImageMediaReference(dataUrl: string): string | null {
  loadLegacyCacheSynchronously();
  const media = [...state.media.values()].find((item) => item.dataUrl === dataUrl);
  return media && isImageMediaPersisted(media.id)
    ? `${IMAGE_MEDIA_REFERENCE_PREFIX}${media.id}`
    : null;
}

export function resolveImageMediaReference(reference: string): string | null {
  if (!reference.startsWith(IMAGE_MEDIA_REFERENCE_PREFIX)) return null;
  loadLegacyCacheSynchronously();
  const id = reference.slice(IMAGE_MEDIA_REFERENCE_PREFIX.length);
  return state.media.get(id)?.dataUrl ?? null;
}

export async function resolveImageMediaReferenceAsync(
  reference: string,
): Promise<string | null> {
  await initializeImagePersistence();
  return resolveImageMediaReference(reference);
}

export function isImageMediaPersisted(id: string): boolean {
  loadLegacyCacheSynchronously();
  return state.durableMediaIds.has(id);
}

export async function retryImagePersistence(): Promise<ImagePersistenceSnapshot> {
  invalidateDatabase();
  initializationPromise = null;
  state.initialized = false;
  state.error = undefined;
  return initializeImagePersistence();
}

/**
 * Test/support hook for replacing an IndexedDB implementation between runs.
 * It is intentionally explicit so normal application code cannot accidentally
 * discard the in-memory render cache during a reconnect.
 */
export function resetImagePersistenceForTests(): void {
  invalidateDatabase();
  initializationPromise = null;
  legacyCacheLoaded = false;
  legacyStorageReference = null;
  pendingProjects.clear();
  pendingProjectDeletes.clear();
  pendingMedia.clear();
  pendingMediaDeletes.clear();
  pendingRecovery = undefined;
  projectWriteQueue.current = Promise.resolve();
  mediaWriteQueue.current = Promise.resolve();
  recoveryWriteQueue.current = Promise.resolve();
  state = {
    initialized: false,
    storage: 'memory',
    projects: createInitialProjects(),
    media: new Map(),
    durableMediaIds: new Set(),
    recovery: null,
  };
}

/**
 * Named repository surface for new callers.  The individual exports above
 * remain useful to compatibility facades, while this object makes it harder
 * for feature code to accidentally introduce another storage path.
 */
export const imagePersistence = {
  initialize: initializeImagePersistence,
  getProjects: getStoredImageProjectsAsync,
  getMedia: getStoredImageMediaAsync,
  getRecovery: getRecoveryImageProjectAsync,
  saveProject: persistImageProject,
  saveRecovery: persistImageRecovery,
  clearRecovery: clearImageRecovery,
  deleteProject: deleteImageProject,
  saveMedia: saveImageMedia,
  deleteMedia: deleteImageMedia,
  saveUploadedMedia: saveUploadedImageMediaAsync,
  resolveMediaReference: resolveImageMediaReference,
  resolveMediaReferenceAsync: resolveImageMediaReferenceAsync,
  getMediaReference: getImageMediaReference,
};
