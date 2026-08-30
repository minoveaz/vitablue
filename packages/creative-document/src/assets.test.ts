import { describe, expect, it } from 'vitest';
import { collectCreativeAssetReferences, createCreativeAssetResolver, validateAssetReference } from './assets';
import { CREATIVE_DOCUMENT_SCHEMA_VERSION, type CreativeDocument } from './index';

const document: CreativeDocument = {
  schemaVersion: CREATIVE_DOCUMENT_SCHEMA_VERSION,
  id: 'asset-document',
  name: 'Assets',
  mode: 'image',
  canvas: { id: 'canvas', width: 100, height: 100 },
  assets: [{ assetId: 'photo', storagePath: 'creative/photo.png' }],
  scenes: [{
    id: 'scene',
    layers: [{
      id: 'layer',
      type: 'image',
      asset: { assetId: 'photo', storagePath: 'creative/photo.png' },
      transform: { position: { x: 0, y: 0 }, anchor: { x: 0, y: 0 }, rotation: 0, scale: { x: 1, y: 1 } },
      geometry: { x: 0, y: 0, width: 1, height: 1 },
    }],
  }],
};

describe('creative asset references', () => {
  it('resolves logical references only at runtime', async () => {
    const resolver = createCreativeAssetResolver(async (reference) => `https://cdn.test/${reference.storagePath}`);
    await expect(resolver.resolve(document.assets![0]!)).resolves.toEqual({
      reference: document.assets![0],
      url: 'https://cdn.test/creative/photo.png',
    });
    expect(() => validateAssetReference({ assetId: 'photo', storagePath: 'https://cdn.test/photo.png?token=secret' }))
      .toThrow(/Invalid creative asset reference/);
    expect(collectCreativeAssetReferences(document)).toHaveLength(1);
  });
});
