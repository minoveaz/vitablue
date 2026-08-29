import { describe, expect, it } from 'vitest';
import { IMAGE_FORMAT_PRESETS, type ImageProject } from '../types/imageStudio';
import {
  CAROUSEL_BACKGROUND_PRESETS,
  applyCarouselBackgroundPreset,
  applyCarouselBackgroundPresetToComposition,
  getCarouselBackgroundPreset,
  isCarouselBackgroundLayer,
  resolveCarouselBackgroundComposition,
} from './carouselBackgroundComposition';
import { normalizeStoredProject, serializeStoredProject } from './imagePersistence';

const preset = IMAGE_FORMAT_PRESETS.find((item) => item.id === 'instagram-carousel-portrait')!;
const project = {
  id: 'preset-regression',
  title: 'Preset regression',
  preset,
  background: { type: 'solid', color: '#001219' },
  brandTokens: {},
  layers: [{
    id: 'editable-title',
    type: 'text',
    title: 'Título editable',
    props: { text: 'No borrar' },
    position: { x: 50, y: 25 },
    zIndex: 10,
    scale: 1,
  }],
  carouselConfig: {
    enabled: true,
    platform: 'instagram',
    slideCount: 5,
    slideWidth: 1080,
    slideHeight: 1350,
    currentSlideIndex: 0,
    slides: [],
    showSlideDividers: true,
    showSlideNumbers: true,
    autoSnapToSlides: true,
  },
  createdAt: '2026-08-29T00:00:00.000Z',
  updatedAt: '2026-08-29T00:00:00.000Z',
} as unknown as ImageProject;

describe('carousel composition presets', () => {
  it('defines seven labeled presets with valid preview trajectories', () => {
    expect(CAROUSEL_BACKGROUND_PRESETS).toHaveLength(7);
    expect(CAROUSEL_BACKGROUND_PRESETS.map((item) => item.id)).toEqual([
      'caida-inicial',
      'montana-central',
      'onda-ascendente',
      'semicirculo-entre-slides',
      'diagonal-dinamica',
      'composicion-editorial',
      'cta-final',
    ]);
    for (const item of CAROUSEL_BACKGROUND_PRESETS) {
      expect(item.label).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.previewPoints.length).toBeGreaterThanOrEqual(2);
      expect(item.previewPoints.every((point) => point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1)).toBe(true);
      expect(getCarouselBackgroundPreset(item.id)).toBe(item);
    }
  });

  it('applies scale and intensity options without retaining an old custom vector path', () => {
    const current = resolveCarouselBackgroundComposition({
      vectorGeometry: { kind: 'path', path: 'M0 0 L100 100', closed: true },
      safeZone: { top: 120 },
      secondaryColor: '#123456',
    });
    const next = applyCarouselBackgroundPresetToComposition(current, 'diagonal-dinamica', {
      scale: 1.55,
      intensity: 0.42,
    });
    expect(next.presetId).toBe('diagonal-dinamica');
    expect(next.scale).toBe(1.55);
    expect(next.intensity).toBe(0.42);
    expect(next.vectorGeometry).toBeUndefined();
    expect(next.safeZone?.top).toBe(120);
    expect(next.secondaryColor).toBe('#123456');
  });

  it('regenerates structural layers while preserving editable content', () => {
    const next = applyCarouselBackgroundPreset(project, 'semicirculo-entre-slides');
    expect(next.carouselBackground?.presetId).toBe('semicirculo-entre-slides');
    expect(next.layers.find((layer) => layer.id === 'editable-title')?.props.text).toBe('No borrar');
    expect(next.layers.filter(isCarouselBackgroundLayer).some((layer) => layer.id.includes('between-slides-semicircle'))).toBe(true);
  });

  it('generates a usable structural composition for every preset', () => {
    for (const item of CAROUSEL_BACKGROUND_PRESETS) {
      const next = applyCarouselBackgroundPreset(project, item.id, {
        colorVariant: 'midnight',
        scale: 0.75,
        intensity: 0.65,
      });
      expect(next.carouselBackground?.presetId).toBe(item.id);
      expect(next.carouselBackground?.colorVariant).toBe('midnight');
      expect(next.layers.filter(isCarouselBackgroundLayer).length).toBeGreaterThan(0);
    }
  });

  it('normalizes unsafe preset ids and keeps selected presets JSON-safe', () => {
    const unsafe = {
      ...project,
      carouselBackground: { presetId: 'not-a-preset', colorVariant: 'ocean', intensity: 2 },
    } as unknown as ImageProject;
    const normalized = normalizeStoredProject(unsafe);
    expect(normalized.carouselBackground?.presetId).toBeUndefined();
    const serialized = serializeStoredProject({
      ...project,
      carouselBackground: applyCarouselBackgroundPresetToComposition(undefined, 'cta-final'),
    });
    expect(serialized.carouselBackground?.presetId).toBe('cta-final');
    expect(JSON.parse(JSON.stringify(serialized)).carouselBackground.presetId).toBe('cta-final');
  });
});
