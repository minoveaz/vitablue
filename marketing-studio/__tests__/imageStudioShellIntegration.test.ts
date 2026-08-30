import { describe, expect, it } from 'vitest';
import {
  CREATIVE_STUDIO_DOMAIN_CAPABILITIES,
  type CreativeStudioImageStudioExtension,
} from '../../components/backoffice-shell/contracts';
import { mapCreativeStudioShellSlots } from '../../components/backoffice-shell/CreativeStudioShellAdapter.utils';

describe('Image Studio shared shell integration', () => {
  it('keeps image-specific capabilities at the extension boundary', () => {
    expect(CREATIVE_STUDIO_DOMAIN_CAPABILITIES.image).toEqual([
      'slide-strip',
      'preview',
      'crop',
      'export',
    ]);
  });

  it('maps the carousel strip to the bottom workspace and preview to overlays', () => {
    const extension: CreativeStudioImageStudioExtension = {
      domain: 'image',
      capabilities: ['slide-strip', 'preview', 'crop', 'export'],
      slots: {
        slideStrip: ({ domain }) => `${domain}-slide-strip`,
        preview: ({ domain }) => `${domain}-preview`,
      },
    };

    const mapped = mapCreativeStudioShellSlots<CreativeStudioImageStudioExtension>({
      domain: 'image',
      state: { status: 'saved' },
      extensions: extension,
      slots: {
        toolbar: 'image-toolbar',
        stage: 'image-stage',
      },
    });

    expect(mapped.toolbar).toBe('image-toolbar');
    expect(mapped.stage).toBe('image-stage');
    expect(mapped.footer).toBe('image-slide-strip');
    expect(mapped.overlays).toBe('image-preview');
  });
});
