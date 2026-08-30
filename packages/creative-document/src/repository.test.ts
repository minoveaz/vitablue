import { describe, expect, it } from 'vitest';
import {
  CREATIVE_DOCUMENT_SCHEMA_VERSION,
  CreativeDocumentConflictError,
  createCreativeDocumentRepository,
  createLocalStorageCreativeDocumentStorage,
  createMemoryCreativeDocumentStorage,
  type CreativeDocument,
} from './index';

const document = (id = 'document-1'): CreativeDocument => ({
  schemaVersion: CREATIVE_DOCUMENT_SCHEMA_VERSION,
  id,
  name: 'Document',
  mode: 'image',
  canvas: { id: 'canvas', width: 100, height: 100 },
  scenes: [],
});

describe('CreativeDocumentRepository', () => {
  it('round-trips, lists and versions documents', async () => {
    const repository = createCreativeDocumentRepository(createMemoryCreativeDocumentStorage(), () => '2026-08-30T00:00:00.000Z');
    const saved = await repository.save(document());
    expect(saved.version).toBe(1);
    expect(await repository.load(document().id)).toEqual(saved);
    expect(await repository.list()).toEqual([{
      id: document().id, name: 'Document', mode: 'image', version: 1, updatedAt: saved.updatedAt,
    }]);
    const next = await repository.save({ ...document(), name: 'Changed' }, { expectedVersion: 1 });
    expect(next.version).toBe(2);
    await expect(repository.save(document(), { expectedVersion: 1 })).rejects.toBeInstanceOf(CreativeDocumentConflictError);
  });

  it('uses an injected localStorage adapter without requiring a DOM', async () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
    };
    const adapter = createLocalStorageCreativeDocumentStorage(storage);
    const repository = createCreativeDocumentRepository(adapter);
    await repository.save(document('local-document'));
    expect((await repository.load('local-document'))?.document.id).toBe('local-document');
  });

  it('rejects invalid documents before storage', async () => {
    const repository = createCreativeDocumentRepository(createMemoryCreativeDocumentStorage());
    await expect(repository.save({ ...document(), schemaVersion: 99 } as unknown as CreativeDocument))
      .rejects.toMatchObject({ code: 'invalid-document' });
  });
});
