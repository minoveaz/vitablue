import { describe, expect, it } from 'vitest';
import { getCarouselLayout } from '../data/carouselLayoutCatalog';
import { instantiateCarouselLayout } from './carouselLayoutComposer';
import { changeCarouselLayout, duplicateCarouselSlide, reorderCarouselSlides } from './carouselSlideOperations';
import { appendImageProjectHistory } from './imageEditorHistory';

describe('carousel slide operations', () => {
  it('reorders slide metadata and layer ownership', () => {
    const project = instantiateCarouselLayout(getCarouselLayout('educational-flow')!, 3);
    const reordered = reorderCarouselSlides(project, 0, 2);
    expect(reordered.carouselConfig?.slides[2].role).toBe('hook');
    expect(reordered.layers.filter((layer) => layer.props?.slideIndex === 2).length).toBeGreaterThan(0);
  });

  it('duplicates a slide and updates the panorama', () => {
    const project = instantiateCarouselLayout(getCarouselLayout('educational-flow')!, 3);
    const duplicated = duplicateCarouselSlide(project, 1);
    expect(duplicated.carouselConfig?.slideCount).toBe(4);
    expect(duplicated.layers.filter((layer) => layer.props?.slideIndex === 2).length).toBeGreaterThan(0);
  });

  it('changes layouts while preserving compatible slot content', () => {
    const project = instantiateCarouselLayout(getCarouselLayout('educational-flow')!, 3);
    const title = project.layers.find((layer) => layer.props?.slotId === 'hook-title');
    const next = changeCarouselLayout(project, getCarouselLayout('conversion-ladder')!);

    expect(next.carouselConfig?.layoutId).toBe('conversion-ladder');
    expect(next.carouselConfig?.slides[0].role).toBe('hook');
    expect(next.layers.find((layer) => layer.id === title?.id)?.props.text).toBe(title?.props.text);
    expect(next.layers.find((layer) => layer.id === title?.id)?.props.slotId).toBe('conversion-title');
  });

  it('keeps multi-slide operations as immutable, index-safe snapshots', () => {
    const project = instantiateCarouselLayout(getCarouselLayout('educational-flow')!, 3);
    const reordered = reorderCarouselSlides({ ...project, currentSlide: 0 }, 0, 2);
    const duplicated = duplicateCarouselSlide(reordered, 2);

    expect(reordered).not.toBe(project);
    expect(reordered.currentSlide).toBe(2);
    expect(duplicated.carouselConfig?.currentSlideIndex).toBe(2);
    expect(new Set(duplicated.layers.map((layer) => layer.id)).size).toBe(duplicated.layers.length);
  });

  it('records carousel metadata so one undo restores a multi-slide operation', () => {
    const project = instantiateCarouselLayout(getCarouselLayout('educational-flow')!, 3);
    const duplicated = duplicateCarouselSlide(project, 1);
    const history = appendImageProjectHistory([project], 0, duplicated);
    const restored = history.history[history.index - 1];

    expect(history.history).toHaveLength(2);
    expect(restored.carouselConfig?.slideCount).toBe(3);
    expect(duplicated.carouselConfig?.slideCount).toBe(4);
  });
});
