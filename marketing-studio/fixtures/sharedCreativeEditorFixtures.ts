import type { ImageProject } from '../types/imageStudio';
import { IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';
import type { VideoProject } from '../../packages/video-studio/src/domain/videoProject';
import { VIDEO_SCHEMA_VERSION } from '../../packages/video-studio/src/domain/videoProject';

/**
 * Stable, non-user fixture data for Phase 0 compatibility tests.
 *
 * Asset references intentionally use existing public paths. Do not replace
 * these with data URLs, credentials, or production customer data.
 */
export const sharedCreativeImageFixture: ImageProject = {
  id: 'fixture-shared-creative-image',
  title: 'Shared creative compatibility fixture',
  preset: IMAGE_FORMAT_PRESETS.find((preset) => preset.id === 'story-vertical')!,
  background: {
    type: 'solid',
    color: '#001219',
  },
  brandTokens: { ...defaultMotionBrandTokens },
  layers: [
    {
      id: 'fixture-copy',
      type: 'text',
      title: 'Fixture headline',
      props: { text: 'Seguro médico para tu visado' },
      position: { x: 50, y: 22 },
      zIndex: 20,
      scale: 1,
      width: 860,
      height: 120,
      fill: '#ffffff',
      fontSize: 34,
      visible: true,
      locked: false,
    },
    {
      id: 'fixture-photo',
      type: 'image',
      title: 'Fixture photo',
      props: {},
      position: { x: 50, y: 52 },
      zIndex: 10,
      scale: 0.85,
      width: 720,
      height: 480,
      src: '/images/ads/2_cuadrada_doctora_estudiante.jpg',
      visible: true,
      locked: false,
    },
    {
      id: 'fixture-hidden-badge',
      type: 'badge',
      blockType: 'TrustBadgeTitle',
      title: 'Fixture hidden badge',
      props: { label: 'No se renderiza' },
      position: { x: 50, y: 10 },
      zIndex: 30,
      scale: 1,
      width: 300,
      height: 44,
      visible: false,
      locked: false,
    },
    {
      id: 'fixture-locked-shape',
      type: 'shape',
      title: 'Fixture locked shape',
      props: {},
      position: { x: 50, y: 78 },
      zIndex: 40,
      scale: 1,
      width: 900,
      height: 160,
      fill: '#005F73',
      visible: true,
      locked: true,
    },
  ],
  createdAt: '2026-08-30T00:00:00.000Z',
  updatedAt: '2026-08-30T01:00:00.000Z',
};

export const sharedCreativeVideoFixture: VideoProject = {
  schemaVersion: VIDEO_SCHEMA_VERSION,
  id: 'fixture-shared-creative-video',
  name: 'Shared creative compatibility fixture',
  fps: 30,
  format: 'vertical',
  width: 1080,
  height: 1920,
  scenes: [
    {
      id: 'fixture-scene',
      templateId: 'text_hook',
      durationInFrames: 150,
      content: { text: 'Seguro médico para tu visado' },
      layers: [
        {
          id: 'fixture-copy',
          type: 'text',
          name: 'Fixture headline',
          text: 'Seguro médico para tu visado',
          position: { x: 50, y: 22 },
          fontSize: 34,
          color: '#ffffff',
          timing: { startFrame: 0, durationInFrames: 150 },
          visible: true,
          locked: false,
          zIndex: 20,
        },
        {
          id: 'fixture-photo',
          type: 'image',
          name: 'Fixture photo',
          asset: {
            assetId: 'fixture-photo',
            src: '/images/ads/2_cuadrada_doctora_estudiante.jpg',
            alt: 'Fixture photo',
          },
          position: { x: 50, y: 52 },
          width: 720,
          height: 480,
          timing: { startFrame: 0, durationInFrames: 150 },
          visible: true,
          locked: false,
          zIndex: 10,
        },
        {
          id: 'fixture-hidden-badge',
          type: 'component',
          name: 'Fixture hidden badge',
          componentId: 'TrustBadgeTitle',
          props: { label: 'No se renderiza' },
          position: { x: 50, y: 10 },
          timing: { startFrame: 0, durationInFrames: 150 },
          visible: false,
          locked: false,
          zIndex: 30,
        },
        {
          id: 'fixture-locked-shape',
          type: 'shape',
          name: 'Fixture locked shape',
          shape: 'rectangle',
          color: '#005F73',
          position: { x: 50, y: 78 },
          width: 900,
          height: 160,
          timing: { startFrame: 0, durationInFrames: 150 },
          visible: true,
          locked: true,
          zIndex: 40,
        },
      ],
    },
  ],
};
