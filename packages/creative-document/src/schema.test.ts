import { describe, expect, it } from 'vitest';
import {
  CREATIVE_DOCUMENT_SCHEMA_VERSION,
  CreativeDocumentSchema,
  GroupLayerSchema,
  safeValidateCreativeDocument,
  validateCreativeDocument,
  type CreativeDocument,
} from './index';

const transform = {
  position: { x: 0.5, y: 0.5 },
  anchor: { x: 0.5, y: 0.5 },
  rotation: 0,
  scale: { x: 1, y: 1 },
} as const;

const geometry = { x: 0.1, y: 0.1, width: 0.8, height: 0.8 } as const;

const asset = {
  assetId: 'asset-logo',
  storagePath: 'creative/assets/asset-logo.png',
} as const;

const textLayer = {
  id: 'headline',
  type: 'text' as const,
  text: 'Seguro para viajar',
  transform,
  geometry,
};

const imageDocument = (overrides: Partial<CreativeDocument> = {}): CreativeDocument => ({
  schemaVersion: CREATIVE_DOCUMENT_SCHEMA_VERSION,
  id: 'document-1',
  name: 'Static creative',
  mode: 'image',
  canvas: { id: 'canvas-1', width: 1080, height: 1080 },
  scenes: [{ id: 'scene-1', layers: [textLayer] }],
  ...overrides,
});

describe('CreativeDocumentSchema', () => {
  it('validates a static image document without timing', () => {
    const result = safeValidateCreativeDocument(imageDocument());

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.scenes[0].timing).toBeUndefined();
  });

  it('requires timing for every scene and layer in video mode', () => {
    const result = safeValidateCreativeDocument(
      imageDocument({
        mode: 'video',
        scenes: [{ id: 'scene-1', layers: [textLayer] }],
      }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues.some((issue) => issue.path.join('.') === 'scenes.0.timing')).toBe(true);
      expect(result.issues.some((issue) => issue.path.join('.') === 'scenes.0.layers.0.timing')).toBe(
        true,
      );
    }
  });

  it('accepts a video document when scene and layer timing are present', () => {
    const result = safeValidateCreativeDocument(
      imageDocument({
        mode: 'video',
        scenes: [
          {
            id: 'scene-1',
            timing: { startMs: 0, durationMs: 3000 },
            layers: [{ ...textLayer, timing: { startMs: 0, durationMs: 3000 } }],
          },
        ],
      }),
    );

    expect(result.success).toBe(true);
  });

  it('rejects normalized coordinates and dimensions outside 0..1', () => {
    const result = CreativeDocumentSchema.safeParse(
      imageDocument({
        scenes: [
          {
            id: 'scene-1',
            layers: [{ ...textLayer, geometry: { ...geometry, width: 1.1 } }],
          },
        ],
      }),
    );

    expect(result.success).toBe(false);
  });

  it('validates groups and recursively validates their children', () => {
    const group = {
      id: 'group-1',
      type: 'group' as const,
      transform,
      geometry,
      children: [{ ...textLayer, id: 'nested-headline' }],
    };

    expect(GroupLayerSchema.safeParse(group).success).toBe(true);
    expect(
      CreativeDocumentSchema.safeParse(
        imageDocument({ scenes: [{ id: 'scene-1', layers: [group] }] }),
      ).success,
    ).toBe(true);
  });

  it('rejects inline, remote, and signed asset references', () => {
    for (const storagePath of [
      'data:image/png;base64,AAAA',
      'blob:https://example.test/id',
      'https://cdn.example.test/image.png?signature=secret',
    ]) {
      const result = CreativeDocumentSchema.safeParse(
        imageDocument({
          assets: [{ ...asset, storagePath }],
          scenes: [
            {
              id: 'scene-1',
              layers: [{ ...textLayer, type: 'image', asset }],
            },
          ],
        }),
      );

      expect(result.success).toBe(false);
    }
  });

  it('rejects signed URLs hidden in legacy/component JSON', () => {
    const result = CreativeDocumentSchema.safeParse(
      imageDocument({
        extensions: { legacy: { previewUrl: 'https://cdn.example.test/signed/photo.png?token=secret' } },
      }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects inline payloads anywhere in the document tree', () => {
    const result = CreativeDocumentSchema.safeParse(
      imageDocument({ scenes: [{ id: 'scene-1', layers: [{ ...textLayer, text: 'data:text/plain,inline' }] }] }),
    );
    expect(result.success).toBe(false);
  });

  it('preserves legacy extensions without making them part of the core model', () => {
    const document = imageDocument({
      extensions: {
        legacy: { imageProject: { scale: 1.25 } },
        imageStudio: { carouselSlide: 2 },
      },
    });

    const parsed = validateCreativeDocument(document);
    expect(parsed.extensions?.legacy).toEqual({ imageProject: { scale: 1.25 } });
    expect(parsed.extensions?.imageStudio).toEqual({ carouselSlide: 2 });
  });
});
