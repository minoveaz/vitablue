import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { sharedCreativeImageFixture } from '../fixtures/sharedCreativeEditorFixtures';
import { useImageProjectEditor } from './useImageProjectEditor';
import { creativeDocumentToImageProject } from '../../packages/creative-document/src/adapters/imageProjectAdapter';
import type { CarouselConfig, ImageProject } from '../types/imageStudio';

type Editor = ReturnType<typeof useImageProjectEditor>;

const mountEditor = (
  canonicalRuntime?: boolean,
  project = sharedCreativeImageFixture,
): Editor => {
  let editor: Editor | undefined;
  const Harness: React.FC = () => {
    editor = useImageProjectEditor(project, { canonicalRuntime });
    return <output data-layers={editor.project.layers.length} />;
  };

  renderToStaticMarkup(<Harness />);
  if (!editor) throw new Error('The image editor harness did not mount.');
  return editor;
};

describe('useImageProjectEditor canonical runtime', () => {
  it('uses CreativeDocument as the default source while exposing an ImageProject facade', () => {
    const editor = mountEditor();

    expect(editor.canonicalRuntime).toBe(true);
    expect(editor.creativeDocument?.mode).toBe('image');
    expect(editor.creativeDocument?.scenes[0]?.layers.map((layer) => layer.id)).toEqual(
      sharedCreativeImageFixture.layers.map((layer) => layer.id),
    );
    expect(editor.project.layers[1]?.src).toBe(sharedCreativeImageFixture.layers[1]?.src);
  });

  it('routes core layer operations through the canonical document', () => {
    const editor = mountEditor();
    const sceneId = editor.creativeDocument!.scenes[0]!.id;

    const moved = editor.moveCreativeLayer(sceneId, 'fixture-copy', { dx: 0.1, dy: 0 });
    expect(moved.scenes[0]?.layers.find((layer) => layer.id === 'fixture-copy')?.transform.position.x)
      .toBeGreaterThan(0.5);

    const updated = editor.updateCreativeLayer(sceneId, 'fixture-copy', { name: 'Título canónico' });
    expect(updated.scenes[0]?.layers.find((layer) => layer.id === 'fixture-copy')?.name)
      .toBe('Título canónico');

    const duplicated = editor.duplicateCreativeLayer(sceneId, 'fixture-copy', { id: 'fixture-copy-2' });
    expect(duplicated.scenes[0]?.layers.map((layer) => layer.id)).toContain('fixture-copy-2');

    const facade = creativeDocumentToImageProject(duplicated);
    expect(facade.layers.map((layer) => layer.id)).toContain('fixture-copy-2');
  });

  it('preserves image-only carousel extensions and supports explicit legacy rollback', () => {
    const carousel: ImageProject = {
      ...sharedCreativeImageFixture,
      preset: { ...sharedCreativeImageFixture.preset, isCarousel: true, defaultSlideCount: 3 },
      carouselPages: 3,
      carouselConfig: {
        enabled: true,
        platform: 'instagram',
        slideCount: 3,
        slideWidth: sharedCreativeImageFixture.preset.width,
        slideHeight: sharedCreativeImageFixture.preset.height,
        currentSlideIndex: 1,
        slides: [
          { index: 0, title: 'Hook', role: 'hook' },
          { index: 1, title: 'Contenido', role: 'content' },
          { index: 2, title: 'CTA', role: 'cta' },
        ],
        showSlideDividers: true,
        showSlideNumbers: true,
        autoSnapToSlides: true,
      } satisfies CarouselConfig,
    };
    const editor = mountEditor(true, carousel);
    const sceneId = editor.creativeDocument!.scenes[0]!.id;
    const updated = editor.updateCreativeLayer(sceneId, 'fixture-copy', { name: 'Carrusel' });
    const source = updated.extensions?.legacy?.source as Record<string, unknown>;

    expect(source.carouselPages).toBe(3);
    expect((source.carouselConfig as Record<string, unknown>).slideCount).toBe(3);

    const rollbackEditor = mountEditor(false, carousel);
    expect(rollbackEditor.canonicalRuntime).toBe(false);
    expect(rollbackEditor.creativeDocument?.mode).toBe('image');
    expect(rollbackEditor.project.carouselConfig?.slideCount).toBe(3);
  });
});
