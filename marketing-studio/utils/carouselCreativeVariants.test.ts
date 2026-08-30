import { describe, expect, it } from 'vitest';
import { getCarouselLayout } from '../data/carouselLayoutCatalog';
import { instantiateCarouselLayout } from './carouselLayoutComposer';
import {
  applyCarouselCreativeVariant,
  getCarouselPresetForAspectRatio,
} from './carouselCreativeVariants';
import { VITABLUE_REFERENCE_CAROUSEL_TEMPLATES } from './imageTemplates';
import { isCarouselBackgroundLayer } from './carouselBackgroundComposition';

describe('carousel creative variants', () => {
  const project = instantiateCarouselLayout(getCarouselLayout('educational-flow')!, 5);

  it('creates semantic presets for every supported aspect ratio', () => {
    expect(getCarouselPresetForAspectRatio(project, '1:1')).toMatchObject({
      aspectRatio: '1:1 (Multi)',
      slideWidth: 1080,
      slideHeight: 1080,
      width: 5400,
    });
    expect(getCarouselPresetForAspectRatio(project, '9:16').slideHeight).toBe(1920);
    expect(getCarouselPresetForAspectRatio(project, '16:9').slideHeight).toBe(608);
  });

  it('applies color and image variants without mutating the source project', () => {
    const color = applyCarouselCreativeVariant(project, {
      id: 'color-gold',
      kind: 'color',
      label: 'Ámbar',
      description: 'test',
      styleVariant: 'gold',
    });
    expect(color).not.toBe(project);
    expect(color.layers.every((layer) => layer.styleVariant === 'gold')).toBe(true);
    expect(color.background.color).toBe('#FFF3D6');
    expect(color.background.gradient).toBeUndefined();

    const image = applyCarouselCreativeVariant(project, {
      id: 'image-mono',
      kind: 'image',
      label: 'Monocromo',
      description: 'test',
      imageTreatment: 'grayscale',
    });
    expect(image.layers.filter((layer) => layer.type === 'image').every((layer) => layer.filter === 'grayscale')).toBe(true);
  });

  it('updates CTA copy and preserves slide count', () => {
    const next = applyCarouselCreativeVariant(project, {
      id: 'cta-advice',
      kind: 'cta',
      label: 'Pedir asesoría',
      description: 'test',
      ctaText: 'Pedir asesoría gratuita',
    });
    expect(next.carouselConfig?.slideCount).toBe(project.carouselConfig?.slideCount);
    const cta = next.layers.find((layer) => layer.props.tag === 'cta');
    expect(cta?.props.ctaText).toContain('Pedir asesoría');
  });

  it('routes approved carousel color variants through the background engine', () => {
    const next = applyCarouselCreativeVariant(VITABLUE_REFERENCE_CAROUSEL_TEMPLATES[0], {
      id: 'color-ocean',
      kind: 'color',
      label: 'Océano',
      description: 'test',
      styleVariant: 'ocean',
    });

    expect(next.carouselBackground?.colorVariant).toBe('ocean');
    expect(next.background.color).toBe('#005F73');
    expect(next.layers.filter(isCarouselBackgroundLayer)).toHaveLength(7);
    expect(next.layers.filter(isCarouselBackgroundLayer).every((layer) => layer.locked)).toBe(true);
  });
});
