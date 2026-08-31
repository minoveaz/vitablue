import { describe, expect, it } from 'vitest';
import { createImageCreativeResourceContext } from './imageCreativeResourceAdapter';
import { createVideoCreativeResourceContext } from './videoCreativeResourceAdapter';

describe('creative resource adapters', () => {
  it('maps image selection and actions without importing editor hooks', () => {
    const project = { id: 'image-1' } as Parameters<typeof createImageCreativeResourceContext>[0]['project'];
    const select = () => undefined;
    const context = createImageCreativeResourceContext({ project, selectedLayerIds: ['layer-1'], actions: { select } });
    expect(context.domain).toBe('image');
    expect(context.selection.layerIds).toEqual(['layer-1']);
    expect(context.actions.select).toBe(select);
  });

  it('maps video scene and layer selection without losing the document target', () => {
    const context = createVideoCreativeResourceContext({
      documentId: 'video-1',
      activeSceneId: 'scene-1',
      selectedLayerIds: ['layer-1'],
    });
    expect(context.domain).toBe('video');
    expect(context.documentId).toBe('video-1');
    expect(context.selection.sceneId).toBe('scene-1');
    expect(context.selection.layerIds).toEqual(['layer-1']);
  });

  it('passes media behavior through both studio adapters', () => {
    const media = { insert: () => undefined };
    const image = createImageCreativeResourceContext({
      project: { id: 'image-1' } as Parameters<typeof createImageCreativeResourceContext>[0]['project'],
      media,
    });
    const video = createVideoCreativeResourceContext({
      documentId: 'video-1',
      media,
    });
    expect(image.extensions?.media).toBe(media);
    expect(video.extensions?.media).toBe(media);
  });
});
