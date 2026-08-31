import { describe, expect, it } from 'vitest';
import {
  CREATIVE_DOCUMENT_SCHEMA_VERSION,
  migrateCreativeDocument,
  safeMigrateCreativeDocument,
  validateCreativeDocumentVersion,
  type CreativeDocument,
} from './index';

const document = (): CreativeDocument => ({
  schemaVersion: CREATIVE_DOCUMENT_SCHEMA_VERSION,
  id: 'migration-document',
  name: 'Migration document',
  mode: 'image',
  canvas: { id: 'canvas', width: 100, height: 100 },
  scenes: [],
});

describe('CreativeDocument migrations', () => {
  it('validates canonical v1 without changing it', () => {
    const result = migrateCreativeDocument(document());
    expect(result).toMatchObject({ migrated: false, source: 'creative-document', sourceVersion: 1 });
    expect(result.document).toEqual(document());
    expect(validateCreativeDocumentVersion(document())).toEqual(document());
  });

  it('migrates a legacy ImageProject envelope and preserves the source', () => {
    const legacy = {
      id: 'legacy-image',
      title: 'Legacy',
      preset: { width: 100, height: 100 },
      background: { type: 'solid', color: '#fff' },
      layers: [],
      customFeature: { enabled: true },
    };
    const result = migrateCreativeDocument({ schemaVersion: 1, imageStudio: legacy });
    expect(result.migrated).toBe(true);
    expect(result.document.mode).toBe('image');
    expect(result.document.extensions?.legacy?.source).toMatchObject({ customFeature: { enabled: true } });
  });

  it('rejects unknown versions and reports failures safely', () => {
    expect(() => migrateCreativeDocument({ schemaVersion: 99, mode: 'image', canvas: {}, scenes: [] }))
      .toThrow(/Unsupported/);
    expect(safeMigrateCreativeDocument({ nope: true })).toMatchObject({
      success: false,
      error: { code: 'unknown-format' },
    });
  });
});
