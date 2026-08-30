import { describe, expect, it, vi } from 'vitest';
import {
  CREATIVE_DOCUMENT_SCHEMA_VERSION,
  createCreativeDocumentAutosave,
  createCreativeDocumentRepository,
  createMemoryCreativeDocumentRecovery,
  createMemoryCreativeDocumentStorage,
  type CreativeDocument,
} from './index';

const document: CreativeDocument = {
  schemaVersion: CREATIVE_DOCUMENT_SCHEMA_VERSION,
  id: 'autosave-document',
  name: 'Draft',
  mode: 'image',
  canvas: { id: 'canvas', width: 100, height: 100 },
  scenes: [],
};

describe('CreativeDocument autosave', () => {
  it('saves deterministically and recovers failed writes', async () => {
    const storage = createMemoryCreativeDocumentStorage();
    const repository = createCreativeDocumentRepository(storage);
    const recovery = createMemoryCreativeDocumentRecovery();
    const onError = vi.fn();
    const autosave = createCreativeDocumentAutosave({
      documentId: document.id,
      repository,
      recovery,
      getDocument: () => document,
      onError,
      debounceMs: 0,
      now: () => '2026-08-30T00:00:00.000Z',
    });
    autosave.enqueue({ ...document, name: 'Saved' });
    await autosave.flush();
    expect((await repository.load(document.id))?.document.name).toBe('Saved');
    expect(onError).not.toHaveBeenCalled();

    const failing = createCreativeDocumentAutosave({
      documentId: 'failed',
      repository: {
        load: async () => null,
        list: async () => [],
        save: async () => { throw new Error('offline'); },
      },
      recovery,
      getDocument: () => ({ ...document, id: 'failed' }),
      onError,
      debounceMs: 0,
    });
    failing.enqueue({ ...document, id: 'failed' });
    await expect(failing.flush()).rejects.toThrow('offline');
    await expect(failing.recover()).resolves.toMatchObject({ document: { id: 'failed' } });
    expect(onError).toHaveBeenCalled();
  });

  it('cancels pending deterministic work', async () => {
    const repository = createCreativeDocumentRepository(createMemoryCreativeDocumentStorage());
    const autosave = createCreativeDocumentAutosave({
      documentId: document.id,
      repository,
      getDocument: () => document,
      debounceMs: 10,
    });
    expect(autosave.enqueue()).toBe(true);
    autosave.cancel();
    expect(autosave.enqueue()).toBe(false);
    await autosave.flush();
    expect(await repository.load(document.id)).toBeNull();
  });
});
