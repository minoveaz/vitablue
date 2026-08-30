import { describe, expect, it } from 'vitest';
import {
  CreativeDocumentSchema,
  creativeDocumentToImageProject,
  creativeDocumentToVideoProject,
  imageProjectToCreativeDocument,
  videoProjectToCreativeDocument,
} from '../index';
import type { ImageProject } from '../../../../marketing-studio/types/imageStudio';
import type { VideoProject } from '../../../video-studio/src/domain/videoProject';

const imageProject = (): ImageProject => ({
  id: 'image-round-trip',
  title: 'Image round trip',
  preset: {
    id: 'test',
    name: 'Test',
    category: 'custom',
    width: 1000,
    height: 500,
    aspectRatio: '2:1',
    description: 'test',
    iconName: 'Square',
    recommendedFor: 'test',
  },
  background: { type: 'solid', color: '#ffffff' },
  brandTokens: {
    brandName: 'Test',
    primaryColor: '#005F73',
    accentColor: '#EE9B00',
    mintColor: '#94D2BD',
    surfaceBg: '#001219',
    cardBg: '#001219',
    textColor: '#ffffff',
    mutedTextColor: '#94a3b8',
  },
  layers: [
    {
      id: 'image',
      type: 'image',
      title: 'Photo',
      props: { imageUrl: 'assets/photo.png' },
      position: { x: 250, y: 50 },
      zIndex: 3,
      scale: 0.75,
      width: 200,
      height: 100,
      rotation: 12,
      crop: { x: 50, y: 40, zoom: 1.2, bounds: { left: 10, top: 20, right: 90, bottom: 95 } },
      visible: false,
      locked: true,
      src: 'assets/photo.png',
      filter: 'grayscale',
      constraints: { horizontal: 'center', preserveAspectRatio: true },
    },
    {
      id: 'text',
      type: 'text',
      title: 'Headline',
      props: { text: 'Hello' },
      position: { x: 50, y: 50 },
      zIndex: 4,
      scale: 1,
      width: 300,
      height: 80,
      fontSize: 32,
      fontWeight: '700',
      fill: '#001219',
      align: 'center',
    },
    {
      id: 'shape',
      type: 'shape',
      title: 'Shape',
      props: { shape: 'circle' },
      position: { x: 80, y: 80 },
      zIndex: 1,
      scale: 1,
      width: 50,
      height: 50,
      fill: '#EE9B00',
    },
    {
      id: 'component',
      type: 'block',
      blockType: 'TrustBadgeTitle',
      title: 'Badge',
      props: { label: 'Trusted', imageUrl: 'assets/badge.png' },
      position: { x: 20, y: 20 },
      zIndex: 2,
      scale: 1,
      width: 100,
      height: 40,
    },
  ],
  createdAt: '2026-08-30T00:00:00.000Z',
  updatedAt: '2026-08-30T00:00:00.000Z',
});

const videoProject = (): VideoProject => ({
  schemaVersion: 'video-schema-v1',
  id: 'video-round-trip',
  name: 'Video round trip',
  fps: 24,
  format: 'landscape',
  width: 1200,
  height: 800,
  metadata: { campaign: 'test' },
  scenes: [
    {
      id: 'scene-1',
      templateId: 'text_hook',
      durationInFrames: 48,
      content: { copy: 'Hello' },
      layers: [
        {
          id: 'video',
          type: 'video',
          asset: { assetId: 'video-1', src: 'assets/video.mp4' },
          position: { x: 50, y: 50 },
          width: 600,
          height: 400,
          timing: { startFrame: 3, durationInFrames: 30 },
          visible: true,
          locked: false,
          zIndex: 2,
        },
        {
          id: 'copy',
          type: 'text',
          text: 'Hello',
          position: 'bottom',
          fontSize: 42,
          color: '#ffffff',
          timing: { startFrame: 7, durationInFrames: 20 },
          zIndex: 3,
        },
        {
          id: 'shape',
          type: 'shape',
          shape: 'circle',
          position: { x: 10, y: 20 },
          width: 100,
          height: 100,
          color: '#EE9B00',
          opacity: 0.5,
          timing: { startFrame: 0, durationInFrames: 48 },
          zIndex: 1,
        },
      ],
    },
  ],
});

describe('ImageProject adapter', () => {
  it('round-trips geometry, transforms, appearance, state, crop and component props', () => {
    const document = imageProjectToCreativeDocument(imageProject());
    expect(CreativeDocumentSchema.parse(document)).toEqual(document);
    expect(document.scenes[0]?.layers.map((layer) => layer.type)).toEqual(['image', 'text', 'shape', 'component']);
    expect(document.scenes[0]?.layers[0]?.geometry).toMatchObject({ x: 0.15, y: 0.4, width: 0.2, height: 0.2 });
    expect(document.scenes[0]?.layers[0]?.transform.scale).toEqual({ x: 0.75, y: 0.75 });
    expect(document.scenes[0]?.layers[0]?.extensions?.legacy?.crop).toBeTruthy();
    expect(document.scenes[0]?.layers[0]?.extensions?.legacy).toMatchObject({
      filter: 'grayscale',
      constraints: { horizontal: 'center', preserveAspectRatio: true },
    });
    const roundTrip = creativeDocumentToImageProject(document);
    expect(roundTrip.layers[0]).toMatchObject({
      position: { x: 25, y: 50 },
      width: 200,
      height: 100,
      rotation: 12,
      scale: 0.75,
      crop: expect.objectContaining({ bounds: expect.objectContaining({ left: 10, top: 20 }) }),
      filter: 'grayscale',
      constraints: { horizontal: 'center', preserveAspectRatio: true },
    });
    expect(roundTrip.layers[3]?.props).toMatchObject({ label: 'Trusted', imageUrl: 'assets/badge.png' });
  });

  it('maps the Image Studio CustomGroup contract without flattening children', () => {
    const project = imageProject();
    project.layers.push({
      id: 'group',
      type: 'block',
      blockType: 'CustomGroup',
      title: 'Group',
      props: {
        children: [{
          id: 'child',
          type: 'text',
          title: 'Child',
          props: { text: 'Child' },
          position: { x: 50, y: 50 },
          zIndex: 1,
          scale: 1,
          width: 100,
          height: 40,
        }],
      },
      position: { x: 50, y: 50 },
      zIndex: 9,
      scale: 1,
      width: 400,
      height: 200,
    });
    const document = imageProjectToCreativeDocument(project);
    expect(document.scenes[0]?.layers.at(-1)).toMatchObject({ type: 'group', children: [{ id: 'child', type: 'text' }] });
    expect(creativeDocumentToImageProject(document).layers.at(-1)).toMatchObject({
      type: 'block',
      blockType: 'CustomGroup',
      props: { children: [{ id: 'child', type: 'text' }] },
    });
  });

  it('keeps unsafe component URLs out of core props and rejects unsafe assets', () => {
    const project = imageProject();
    project.layers[3]!.props.imageUrl = 'data:image/png;base64,AAAA';
    const document = imageProjectToCreativeDocument(project);
    expect(document.scenes[0]?.layers[3]).toMatchObject({ type: 'component', props: { label: 'Trusted' } });
    expect(document.scenes[0]?.layers[3]?.extensions?.legacy?.source).toBeTruthy();
    project.layers[0]!.src = 'https://cdn.example.test/photo.png?token=signed';
    expect(() => imageProjectToCreativeDocument(project)).toThrow(/not allowed/);
  });
});

describe('VideoProject adapter', () => {
  it('round-trips scenes, timing, assets, shape state and metadata with deterministic frame rounding', () => {
    const document = videoProjectToCreativeDocument(videoProject());
    expect(CreativeDocumentSchema.parse(document)).toEqual(document);
    expect(document.scenes[0]?.timing).toEqual({ startMs: 0, durationMs: 2000 });
    expect(document.scenes[0]?.layers[0]?.timing).toEqual({ startMs: 125, durationMs: 1250 });
    const roundTrip = creativeDocumentToVideoProject(document);
    expect(roundTrip.fps).toBe(24);
    expect(roundTrip.scenes[0]?.layers[0]).toMatchObject({
      type: 'video',
      timing: { startFrame: 3, durationInFrames: 30 },
      asset: { assetId: 'video-1', src: 'assets/video.mp4' },
    });
    expect(roundTrip.scenes[0]?.layers[1]).toMatchObject({
      type: 'text',
      timing: { startFrame: 7, durationInFrames: 20 },
    });
  });

  it('rejects inline and signed Video AssetRef sources explicitly', () => {
    const project = videoProject();
    project.scenes[0]!.layers[0] = {
      ...project.scenes[0]!.layers[0]!,
      type: 'video',
      asset: { src: 'blob:https://example.test/id' },
    };
    expect(() => videoProjectToCreativeDocument(project)).toThrow(/not allowed/);
  });
});
