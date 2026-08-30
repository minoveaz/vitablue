import { describe, expect, it } from 'vitest';
import {
  CREATIVE_STUDIO_DOMAIN_CAPABILITIES,
  CREATIVE_STUDIO_EDITOR_STATES,
  CREATIVE_STUDIO_DEFAULT_INTERACTION_OWNERSHIP,
  CREATIVE_STUDIO_SHELL_REGIONS,
  CREATIVE_STUDIO_SHELL_REQUIREMENTS,
} from '../contracts';
import type {
  CreativeStudioImageStudioExtension,
  CreativeStudioShell,
  CreativeStudioVideoStudioExtension,
} from '../contracts';

const imageShellContract = {
  domain: 'image',
  state: { status: 'saved' },
  slots: { stage: 'image-stage' },
  extensions: {
    domain: 'image',
    capabilities: ['slide-strip', 'preview'],
    slots: { slideStrip: 'image-slides' },
  },
} satisfies CreativeStudioShell<CreativeStudioImageStudioExtension>;

const videoShellContract = {
  domain: 'video',
  state: { status: 'rendering' },
  slots: { stage: 'video-stage', bottomWorkspace: 'timeline' },
  extensions: {
    domain: 'video',
    capabilities: ['scenes', 'timeline', 'transport', 'audio', 'remotion'],
    slots: { timeline: 'video-timeline', transport: 'video-transport' },
  },
} satisfies CreativeStudioShell<CreativeStudioVideoStudioExtension>;

describe('Creative Studio Shell contract', () => {
  it('supports typed image and video extension slots without coupling their payloads', () => {
    expect(imageShellContract.extensions?.domain).toBe('image');
    expect(videoShellContract.extensions?.domain).toBe('video');
  });

  it('keeps the common regions explicit and renderer-neutral', () => {
    expect(CREATIVE_STUDIO_SHELL_REGIONS).toEqual([
      'platformHeader',
      'suiteNavigation',
      'moduleHeader',
      'toolRail',
      'resourcePanel',
      'toolbar',
      'stage',
      'inspector',
      'layersPanel',
      'bottomWorkspace',
      'overlays',
    ]);
  });

  it('exposes only the shared editor lifecycle states', () => {
    expect(CREATIVE_STUDIO_EDITOR_STATES).toEqual([
      'saved',
      'saving',
      'error',
      'offline',
      'rendering',
    ]);
  });

  it('keeps domain capabilities outside the common shell', () => {
    expect(CREATIVE_STUDIO_DOMAIN_CAPABILITIES.image).toEqual([
      'slide-strip',
      'preview',
      'crop',
      'export',
    ]);
    expect(CREATIVE_STUDIO_DOMAIN_CAPABILITIES.video).toEqual([
      'scenes',
      'timeline',
      'transport',
      'audio',
      'remotion',
    ]);
  });

  it('states mobile-first and accessibility requirements without implementing them yet', () => {
    expect(CREATIVE_STUDIO_SHELL_REQUIREMENTS).toMatchObject({
      mobileFirst: true,
      minTouchTargetPx: 44,
      labelledRegions: true,
      visibleFocus: true,
      keyboardNavigation: true,
      statusLiveRegion: 'polite',
    });
  });

  it('keeps interaction ownership with existing consumers during migration', () => {
    expect(CREATIVE_STUDIO_DEFAULT_INTERACTION_OWNERSHIP).toEqual({
      panelVisibility: 'consumer',
      focus: 'consumer',
      shortcuts: 'consumer',
    });
  });
});
