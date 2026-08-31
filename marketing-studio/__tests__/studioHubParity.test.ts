import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Image and Video Studio project hub parity', () => {
  it('uses one shared project-card visual contract', () => {
    const primitive = read('marketing-studio/components/shared/StudioHubPrimitives.tsx');
    const image = read('marketing-studio/components/image-editor/ImageStudioHub.tsx');
    const video = read('marketing-studio/components/creative-editor/VideoStudioHub.tsx');

    expect(image).toContain('<StudioHubProjectCard');
    expect(video).toContain('<StudioHubProjectCard');
    for (const className of ['rounded-3xl', 'border-slate-200', 'Abrir Editor']) {
      expect(primitive).toContain(className);
    }
    for (const source of [image, video]) {
      expect(source).toContain('grid-cols-1');
      expect(source).toContain('xl:grid-cols-3');
    }
  });

  it('keeps hub filtering and archive states in the shared visual shape', () => {
    const image = read('marketing-studio/components/image-editor/ImageStudioHub.tsx');
    const video = read('marketing-studio/components/creative-editor/VideoStudioHub.tsx');

    for (const source of [image, video]) {
      expect(source).toContain('selectedStatusFilter');
      expect(source).toContain('Cargando tus');
      expect(source).toContain('No se encontraron');
      expect(source).toContain('creativeStatus === \'archived\'');
      expect(source).toContain('<ConfirmModal');
    }
  });
});
