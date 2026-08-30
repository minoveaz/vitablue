import { describe, expect, it } from 'vitest';
import { validateImageProject } from './imageProjectValidation';
import { createVideoProjectFromImage } from './imageVideoBridge';
import {
  sharedCreativeImageFixture,
  sharedCreativeVideoFixture,
} from '../fixtures/sharedCreativeEditorFixtures';
import { validateVideoProject } from '../../packages/video-studio/src/domain/storyboard';

describe('legacy Image Studio ↔ Video Studio compatibility', () => {
  it('keeps representative fixtures valid without inline asset data', () => {
    expect(validateImageProject(sharedCreativeImageFixture)).toEqual([]);
    expect(validateVideoProject(sharedCreativeVideoFixture)).toEqual([]);

    const serialized = JSON.stringify({
      image: sharedCreativeImageFixture,
      video: sharedCreativeVideoFixture,
    });
    expect(serialized).not.toContain('data:');
  });

  it('converts image layers without changing shared geometry or layer order', () => {
    const converted = createVideoProjectFromImage(sharedCreativeImageFixture);
    const sourceLayers = sharedCreativeImageFixture.layers;
    const convertedLayers = converted.scenes[0].layers;

    expect(convertedLayers.map((layer) => layer.id)).toEqual(sourceLayers.map((layer) => layer.id));
    expect(convertedLayers.map((layer) => layer.zIndex)).toEqual(sourceLayers.map((layer) => layer.zIndex));

    sourceLayers.forEach((source, index) => {
      const target = convertedLayers[index];
      expect(target).toMatchObject({
        position: source.position,
        visible: source.visible,
        locked: source.locked,
        zIndex: source.zIndex,
      });
    });

    expect(convertedLayers[1]).toMatchObject({
      id: 'fixture-photo',
      width: 720,
      height: 480,
    });
    expect(convertedLayers[3]).toMatchObject({
      id: 'fixture-locked-shape',
      width: 900,
      height: 160,
    });
  });

  it('preserves text content and image asset references during handoff', () => {
    const converted = createVideoProjectFromImage(sharedCreativeImageFixture);
    const [text, image] = converted.scenes[0].layers;

    expect(text).toMatchObject({
      id: 'fixture-copy',
      type: 'text',
      text: 'Seguro médico para tu visado',
      fontSize: 34,
      color: '#ffffff',
    });
    expect(image).toMatchObject({
      id: 'fixture-photo',
      type: 'image',
      asset: {
        src: '/images/ads/2_cuadrada_doctora_estudiante.jpg',
        alt: 'Fixture photo',
      },
    });
  });

  it('keeps hidden and locked states independent', () => {
    const converted = createVideoProjectFromImage(sharedCreativeImageFixture);
    const hidden = converted.scenes[0].layers.find((layer) => layer.id === 'fixture-hidden-badge');
    const locked = converted.scenes[0].layers.find((layer) => layer.id === 'fixture-locked-shape');

    expect(hidden).toMatchObject({ visible: false, locked: false });
    expect(locked).toMatchObject({ visible: true, locked: true });
  });

  it('assigns deterministic video timing while leaving the image project untouched', () => {
    const before = JSON.stringify(sharedCreativeImageFixture);
    const converted = createVideoProjectFromImage(sharedCreativeImageFixture);

    expect(converted.scenes[0].durationInFrames).toBe(150);
    expect(converted.scenes[0].layers).toHaveLength(sharedCreativeImageFixture.layers.length);
    expect(converted.scenes[0].layers.every((layer) => (
      layer.timing?.startFrame === 0 && layer.timing.durationInFrames === 150
    ))).toBe(true);
    expect(JSON.stringify(sharedCreativeImageFixture)).toBe(before);
  });
});
