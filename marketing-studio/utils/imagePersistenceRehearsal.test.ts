import { describe, expect, it } from 'vitest';
import {
  imagePersistenceCanonicalDocument,
  imagePersistenceLegacyEnvelope,
  imagePersistenceLegacyProject,
} from '../fixtures/imagePersistenceRehearsalFixtures';
import { getImageStudioDocumentFormat, imageStudioComposition } from './creativeStudioRemote';
import { rehearseImageStudioPersistence } from './imagePersistenceRehearsal';

const samples = [
  ['legacy ImageProject', imagePersistenceLegacyProject],
  ['legacy persisted envelope', imagePersistenceLegacyEnvelope],
  ['canonical CreativeDocument', imagePersistenceCanonicalDocument],
] as const;

describe('Image Studio operational persistence rehearsal', () => {
  it('keeps canonical v1 as the default and makes rollback explicit', () => {
    expect(getImageStudioDocumentFormat()).toBe('creative-document');
    expect(getImageStudioDocumentFormat(true)).toBe('creative-document');
    expect(getImageStudioDocumentFormat(false)).toBe('legacy');
    expect(imageStudioComposition(imagePersistenceLegacyProject)).toMatchObject({
      schemaVersion: 1,
      mode: 'image',
    });
    expect(imageStudioComposition(imagePersistenceLegacyProject, 'legacy')).toHaveProperty('imageStudio');
  });

  it.each(samples)('loads, saves, reopens and round-trips %s', (_name, sample) => {
    const rehearsal = rehearseImageStudioPersistence(sample);
    const loaded = rehearsal.loaded.project;
    const canonical = rehearsal.loaded.document;

    expect(canonical.mode).toBe('image');
    expect(rehearsal.saved.canonical).toMatchObject({ schemaVersion: 1, mode: 'image' });
    expect(rehearsal.saved.canonical).not.toHaveProperty('imageStudio');
    expect(rehearsal.saved.legacy).toHaveProperty('imageStudio');
    expect(JSON.stringify(rehearsal.saved.canonical)).not.toContain('storage.example.test');

    const photo = canonical.scenes[0]?.layers.find((layer) => layer.id === 'photo');
    expect(photo).toMatchObject({
      type: 'image',
      transform: {
        rotation: -3,
        scale: { x: 0.85, y: 0.85 },
      },
      constraints: expect.objectContaining({ horizontal: 'center' }),
      crop: { x: 0.08, y: 0.12, width: 0.84, height: 0.82 },
      asset: {
        assetId: '10000000-0000-4000-8000-000000000101',
        storagePath: 'creative-asset:10000000-0000-4000-8000-000000000101',
      },
    });
    expect(canonical.assets).toEqual([expect.objectContaining({
      assetId: '10000000-0000-4000-8000-000000000101',
      storagePath: 'creative-asset:10000000-0000-4000-8000-000000000101',
    })]);

    const group = canonical.scenes[0]?.layers.find((layer) => layer.id === 'proof-group');
    expect(group).toMatchObject({
      type: 'group',
      children: [{ id: 'proof-badge' }, { id: 'proof-shape' }],
      constraints: expect.objectContaining({ horizontal: 'end', vertical: 'end' }),
    });
    expect(loaded.carouselConfig).toMatchObject({
      slideCount: 3,
      slideWidth: 1080,
      slideHeight: 1350,
      currentSlideIndex: 1,
    });
    expect(loaded.carouselBackground).toMatchObject({
      id: 'carousel-background-rehearsal',
      continuity: 'seamless',
      focalPoint: { x: 0.75, y: 0.5 },
    });
    expect(loaded.layers.find((layer) => layer.id === 'proof-group')?.props.exportMetadata)
      .toMatchObject({ panoramaWidth: 3240, panoramaHeight: 1350 });

    expect(rehearsal.reopened.canonical.layers.map((layer) => layer.id))
      .toEqual(loaded.layers.map((layer) => layer.id));
    expect(rehearsal.reopened.legacy.layers.map((layer) => layer.id))
      .toEqual(loaded.layers.map((layer) => layer.id));
    expect(rehearsal.reopened.canonical.layers.find((layer) => layer.id === 'photo'))
      .toMatchObject({ crop: expect.objectContaining({ bounds: expect.objectContaining({ left: 8, right: 92 }) }) });
    expect(rehearsal.reopened.legacy.layers.find((layer) => layer.id === 'proof-group')?.props.exportMetadata)
      .toMatchObject({ formats: ['png', 'pdf', 'panorama'] });
  });
});
