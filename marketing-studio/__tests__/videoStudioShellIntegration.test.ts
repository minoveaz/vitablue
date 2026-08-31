import { describe, expect, it } from 'vitest';
import {
  CREATIVE_STUDIO_DOMAIN_CAPABILITIES,
  type CreativeStudioVideoStudioExtension,
} from '../../components/backoffice-shell/contracts';
import { mapCreativeStudioShellSlots } from '../../components/backoffice-shell/CreativeStudioShellAdapter.utils';
import { getResizedSceneDuration } from '../utils/videoTimeline';
import {
  getVideoStudioEditorState,
  getVideoStudioStatusMessage,
} from '../utils/videoStudioState';
import { privateRoutes } from '../../config/routes';
import { vitablueBackofficeSchema } from '../../components/layouts/BackofficeShell';

describe('Video Studio shared shell integration', () => {
  it('keeps scenes, timeline, transport, audio and Remotion in the video extension', () => {
    expect(CREATIVE_STUDIO_DOMAIN_CAPABILITIES.video).toEqual([
      'scenes',
      'timeline',
      'transport',
      'audio',
      'remotion',
    ]);
  });

  it('maps video domain slots without creating a second shell', () => {
    const extension: CreativeStudioVideoStudioExtension = {
      domain: 'video',
      capabilities: ['scenes', 'timeline', 'transport', 'audio', 'remotion'],
      slots: {
        scenes: 'video-scenes',
        timeline: 'video-timeline',
        transport: 'video-transport',
      },
    };

    const mapped = mapCreativeStudioShellSlots<CreativeStudioVideoStudioExtension>({
      domain: 'video',
      state: { status: 'saved' },
      extensions: extension,
      slots: {
        toolbar: 'video-toolbar',
        stage: 'video-stage',
      },
    });

    expect(mapped.toolbar).toBe('video-toolbar');
    expect(mapped.stage).toBe('video-stage');
    expect(mapped.contextAside).toBe('video-scenes');
    expect(mapped.footer).toMatchObject({
      props: {
        'aria-label': 'Área de trabajo inferior',
        children: ['video-transport', 'video-timeline'],
      },
    });
  });

  it('keeps the video rail and contextual resources in one left context zone', () => {
    const extension: CreativeStudioVideoStudioExtension = {
      domain: 'video',
      slots: { scenes: 'legacy-scenes' },
    };

    const mapped = mapCreativeStudioShellSlots<CreativeStudioVideoStudioExtension>({
      domain: 'video',
      state: { status: 'saved' },
      extensions: extension,
      slots: {
        toolRail: 'video-tool-rail',
        resourcePanel: 'video-resource-panel',
        inspector: 'video-inspector',
        stage: 'video-stage',
      },
    });

    expect(mapped.contextAside).toMatchObject({
      props: {
        'aria-label': 'Herramientas y recursos del editor',
        children: ['video-tool-rail', 'video-resource-panel'],
      },
    });
    expect(mapped.contextAside).not.toMatchObject({
      props: { children: expect.arrayContaining(['legacy-scenes']) },
    });
    expect(mapped.aside).toBe('video-inspector');
  });

  it('keeps scene resizing bounded to a valid positive frame duration', () => {
    expect(getResizedSceneDuration(150, 20, 3, 30)).toBe(210);
    expect(getResizedSceneDuration(30, -100, 3, 1)).toBe(1);
  });

  it('normalizes render lifecycle states and preserves a visible retry message', () => {
    expect(getVideoStudioEditorState(false, null, 'pending')).toBe('saving');
    expect(getVideoStudioEditorState(false, null, 'rendering')).toBe('rendering');
    expect(getVideoStudioEditorState(false, null, 'failed')).toBe('error');
    expect(getVideoStudioEditorState(true, null, 'rendering')).toBe('offline');
    expect(getVideoStudioStatusMessage(null, 'Worker failed', 'failed')).toBe('Worker failed');
    expect(getVideoStudioStatusMessage(null, undefined, 'cancelled')).toBe('El render fue cancelado.');
  });

  it('keeps the existing private route and enabled backoffice navigation entry', () => {
    const route = privateRoutes.find(
      (candidate) => candidate.path === '/backoffice/marketing-studio/generador-contenido',
    );
    const damRoute = privateRoutes.find(
      (candidate) => candidate.path === '/backoffice/marketing-studio/dam/video/new',
    );
    const navigationItem = vitablueBackofficeSchema.groups
      .flatMap((group) => group.items)
      .find((item) => item.kind === 'module' && item.moduleId === 'content');

    expect(route).toMatchObject({
      kind: 'private',
      indexable: false,
      prerender: false,
      sitemap: false,
    });
    expect(damRoute).toMatchObject({
      kind: 'private',
      indexable: false,
      prerender: false,
      sitemap: false,
    });
    expect(navigationItem?.kind === 'module' ? navigationItem.route.routeId : undefined).toBe(route?.path);
  });
});
