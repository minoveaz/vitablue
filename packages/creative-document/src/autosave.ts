import { validateCreativeDocument } from './schema';
import type { CreativeDocument } from './types';
import {
  CreativeDocumentConflictError,
  type CreativeDocumentRecord,
  type CreativeDocumentRepository,
} from './repository';

export interface CreativeDocumentRecoveryStore {
  load(documentId: string): Promise<CreativeDocumentRecord | null>;
  save(documentId: string, record: CreativeDocumentRecord): Promise<void>;
  clear(documentId: string): Promise<void>;
}

export interface CreativeDocumentAutosaveOptions {
  documentId: string;
  repository: CreativeDocumentRepository;
  recovery?: CreativeDocumentRecoveryStore;
  initialRecord?: CreativeDocumentRecord | null;
  getDocument: () => CreativeDocument;
  onSaved?: (record: CreativeDocumentRecord) => void;
  onRecovered?: (record: CreativeDocumentRecord) => void;
  onError?: (error: unknown) => void;
  debounceMs?: number;
  now?: () => string;
}

export interface CreativeDocumentAutosave {
  enqueue(document?: CreativeDocument): boolean;
  flush(): Promise<void>;
  recover(): Promise<CreativeDocumentRecord | null>;
  retry(): boolean;
  cancel(): void;
  dispose(): void;
}

export class CreativeDocumentAutosaveError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'CreativeDocumentAutosaveError';
    if (cause !== undefined) Object.defineProperty(this, 'cause', { configurable: true, value: cause });
  }
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const createCreativeDocumentAutosave = (
  options: CreativeDocumentAutosaveOptions,
): CreativeDocumentAutosave => {
  const debounceMs = options.debounceMs ?? 500;
  const now = options.now ?? (() => new Date().toISOString());
  let serverRecord = options.initialRecord ?? null;
  let pending: CreativeDocument | null = null;
  let failed: CreativeDocument | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let drainPromise: Promise<void> | null = null;
  let disposed = false;
  let cancelled = false;

  const notifyError = (error: unknown): void => {
    options.onError?.(error);
  };

  const drain = async (): Promise<void> => {
    if (disposed || cancelled || !pending) return;
    const snapshot = pending;
    pending = null;
    let record: CreativeDocumentRecord;
    try {
      record = await options.repository.save(snapshot, {
        expectedVersion: serverRecord?.version,
      });
    } catch (error) {
      if (disposed || cancelled) throw error;
      failed = snapshot;
      try {
        const recoveryRecord: CreativeDocumentRecord = {
          document: validateCreativeDocument(snapshot),
          version: (serverRecord?.version ?? 0) + 1,
          updatedAt: now(),
        };
        await options.recovery?.save(options.documentId, recoveryRecord);
      } catch (recoveryError) {
        const combined = new CreativeDocumentAutosaveError(
          'Autosave failed and its recovery snapshot could not be stored.',
          recoveryError,
        );
        notifyError(combined);
        throw combined;
      }
      throw error;
    }
    if (disposed || cancelled) return;
    serverRecord = record;
    failed = null;
    await options.recovery?.clear(options.documentId);
    options.onSaved?.(clone(record));
    if (pending) await drain();
  };

  const startDrain = (): Promise<void> => {
    if (!drainPromise) {
      drainPromise = drain().finally(() => {
        drainPromise = null;
      });
    }
    return drainPromise;
  };

  return {
    enqueue(document = options.getDocument()) {
      if (disposed || cancelled) return false;
      validateCreativeDocument(document);
      pending = clone(document);
      failed = null;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        void startDrain().catch((error: unknown) => notifyError(error));
      }, debounceMs);
      return true;
    },
    flush() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      return startDrain().catch((error: unknown) => {
        notifyError(error);
        throw error;
      });
    },
    async recover() {
      const recovered = await options.recovery?.load(options.documentId) ?? null;
      if (!recovered) return null;
      let validated: CreativeDocumentRecord;
      try {
        const document = validateCreativeDocument(recovered.document);
        if (document.id !== options.documentId) {
          throw new Error(`Recovery document id "${document.id}" does not match "${options.documentId}".`);
        }
        validated = { ...recovered, document };
      } catch (error) {
        throw new CreativeDocumentAutosaveError('Stored CreativeDocument recovery is invalid.', error);
      }
      options.onRecovered?.(clone(validated));
      return clone(validated);
    },
    retry() {
      if (disposed || cancelled || !failed) return false;
      pending = failed;
      failed = null;
      void startDrain().catch((error: unknown) => notifyError(error));
      return true;
    },
    cancel() {
      cancelled = true;
      pending = null;
      failed = null;
      if (timer) clearTimeout(timer);
      timer = null;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      pending = null;
      failed = null;
      if (timer) clearTimeout(timer);
      timer = null;
    },
  };
};

export const isCreativeDocumentConflict = (error: unknown): error is CreativeDocumentConflictError =>
  error instanceof CreativeDocumentConflictError;

export const createMemoryCreativeDocumentRecovery = (): CreativeDocumentRecoveryStore => {
  const snapshots = new Map<string, CreativeDocumentRecord>();
  return {
    async load(id) {
      const record = snapshots.get(id);
      return record ? clone(record) : null;
    },
    async save(id, record) {
      snapshots.set(id, clone(record));
    },
    async clear(id) {
      snapshots.delete(id);
    },
  };
};

export interface RecoveryStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const createLocalStorageCreativeDocumentRecovery = (
  storage: RecoveryStorageLike | undefined,
  key = 'vitablue_creative_document_recovery',
): CreativeDocumentRecoveryStore => ({
  async load(documentId) {
    if (!storage) return null;
    const raw = storage.getItem(`${key}:${documentId}`);
    if (!raw) return null;
    try {
      return clone(JSON.parse(raw) as CreativeDocumentRecord);
    } catch (error) {
      throw new CreativeDocumentAutosaveError('Stored CreativeDocument recovery is corrupt.', error);
    }
  },
  async save(documentId, record) {
    if (!storage) throw new CreativeDocumentAutosaveError('localStorage is not available for recovery.');
    try {
      storage.setItem(`${key}:${documentId}`, JSON.stringify(record));
    } catch (error) {
      throw new CreativeDocumentAutosaveError('Could not write CreativeDocument recovery.', error);
    }
  },
  async clear(documentId) {
    storage?.removeItem(`${key}:${documentId}`);
  },
});
