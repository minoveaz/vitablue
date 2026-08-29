import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { ImageProject } from '../../types/imageStudio';
import { CarouselPreviewSurface } from './CarouselPreviewSurface';

const project = {
  id: 'preview-test',
  title: 'Preview test',
  preset: {
    id: 'instagram-carousel-portrait',
    width: 5400,
    height: 1350,
    slideWidth: 1080,
    slideHeight: 1350,
    isCarousel: true,
    defaultSlideCount: 5,
    aspectRatio: '4:1',
  },
  carouselConfig: {
    enabled: true,
    slideCount: 5,
    slideWidth: 1080,
    slideHeight: 1350,
  },
  background: { type: 'solid', color: '#001219' },
  brandTokens: {},
  layers: [],
} as unknown as ImageProject;

describe('CarouselPreviewSurface', () => {
  it('renders panoramic cuts and safe-zone labels', () => {
    const markup = renderToStaticMarkup(
      <CarouselPreviewSurface
        project={project}
        mode="panorama"
        activeSlideIndex={2}
        onSlideChange={() => undefined}
      />,
    );

    expect(markup).toContain('Tira panorámica');
    expect(markup.match(/Corte [1-4]/g)).toHaveLength(4);
    expect(markup.match(/Zona segura/g)?.length).toBeGreaterThan(0);
  });

  it('renders the before/after empty state accessibly', () => {
    const markup = renderToStaticMarkup(
      <CarouselPreviewSurface
        project={project}
        mode="comparison"
        activeSlideIndex={0}
        onSlideChange={() => undefined}
      />,
    );

    expect(markup).toContain('Aplica una variante para activar la comparación');
    expect(markup).toContain('aria-label="Vista previa profesional del carrusel"');
  });
});
