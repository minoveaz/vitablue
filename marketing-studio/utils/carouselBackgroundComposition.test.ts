import { describe, expect, it } from 'vitest';
import { IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import {
  CAROUSEL_BACKGROUND_COLOR_VARIANTS,
  type CarouselBackgroundComposition,
} from '../types/carouselBackgroundComposition';
import {
  CAROUSEL_BACKGROUND_PALETTES,
  createCarouselBackgroundBezierPath,
  createCarouselBackgroundComposition,
  generateCarouselBackgroundLayers,
  isCarouselBackgroundLayer,
  regenerateCarouselBackground,
  resolveCarouselBackgroundComposition,
} from './carouselBackgroundComposition';
import { getCarouselGeometry, getCarouselGeometryForAspectRatio, validateCarouselGeometry } from './imageDesignSystem';
import { CAROUSEL_ASPECT_RATIOS } from '../types/imageStudio';
import { VITABLUE_REFERENCE_CAROUSEL_TEMPLATES } from './imageTemplates';

const geometry = getCarouselGeometry(
  IMAGE_FORMAT_PRESETS.find((preset) => preset.id === 'instagram-carousel-portrait')!,
  5,
  true,
);

describe('carousel background composition contracts', () => {
  it('defines White as a warm editorial surface with a restrained gold accent', () => {
    expect(CAROUSEL_BACKGROUND_PALETTES.white).toMatchObject({
      background: '#FFFAF5',
      primary: '#005F73',
      secondary: '#005F73',
      contrast: '#001219',
      muted: '#EE9B00',
    });
    expect(createCarouselBackgroundComposition('white')).toMatchObject({
      intensity: 0.88,
      height: 0.38,
      verticalPosition: 0.72,
    });
  });

  it('exposes the three approved color variants and normalizes unsafe values', () => {
    expect(CAROUSEL_BACKGROUND_COLOR_VARIANTS).toEqual([
      'white',
      'midnight',
      'ocean',
      'amber-gold',
      'white-editorial',
    ]);
    const composition = resolveCarouselBackgroundComposition({
      colorVariant: 'invalid' as CarouselBackgroundComposition['colorVariant'],
      intensity: 8,
      height: -1,
      scale: 20,
    });
    expect(composition.colorVariant).toBe('white');
    expect(composition.intensity).toBe(1);
    expect(composition.height).toBeGreaterThan(0);
    expect(composition.scale).toBe(3);
  });

  it('persists and clamps custom trajectory points while keeping legacy trajectories unchanged', () => {
    const legacy = resolveCarouselBackgroundComposition({ trajectory: { type: 'sine' } });
    expect(legacy.trajectory.points).toBeUndefined();

    const composition = resolveCarouselBackgroundComposition({
      trajectory: {
        points: [
          { x: 1.4, y: -1 },
          { x: 0.5, y: 0.42 },
          { x: 0.5, y: 0.9 },
          { x: 0, y: 1.2 },
        ],
      },
    });
    expect(composition.trajectory.points).toEqual([
      { x: 0, y: 1 },
      { x: 0.5, y: 0.42 },
      { x: 1, y: 0 },
    ]);
    expect(createCarouselBackgroundBezierPath(composition.trajectory.points!)).toContain('C');
  });

  it('normalizes a reusable composition geometry and carries it into generated layers', () => {
    const geometryOverride = {
      kind: 'bezier' as const,
      points: [{ x: -1, y: 0.2 }, { x: 0.5, y: 0.8 }, { x: 2, y: 0.4 }],
      closed: true,
    };
    const composition = resolveCarouselBackgroundComposition({
      vectorGeometry: geometryOverride,
    });
    expect(composition.vectorGeometry).toEqual({
      version: 1,
      kind: 'bezier',
      points: [{ x: 0, y: 0.2 }, { x: 0.5, y: 0.8 }, { x: 1, y: 0.4 }],
      closed: true,
    });
    const panorama = generateCarouselBackgroundLayers({
      projectId: 'reusable',
      geometry,
      composition,
    }).find((layer) => layer.id.includes('panorama-wave'));
    expect(panorama?.props.vectorGeometry).toEqual(composition.vectorGeometry);
  });

  it('uses the edited Bézier profile for White without changing other palette defaults', () => {
    const points = [
      { x: 0, y: 0.15 },
      { x: 0.5, y: 0.85 },
      { x: 1, y: 0.25 },
    ];
    const edited = generateCarouselBackgroundLayers({
      projectId: 'edited',
      geometry,
      composition: createCarouselBackgroundComposition('white', { trajectory: { points } }),
    });
    const legacyMidnight = generateCarouselBackgroundLayers({
      projectId: 'legacy',
      geometry,
      composition: createCarouselBackgroundComposition('midnight'),
    });
    expect(edited.find((layer) => layer.id.includes('panorama-wave'))?.props.wavePath).toContain('15');
    expect(legacyMidnight.find((layer) => layer.id.includes('panorama-wave'))?.props.wavePath).toBe(
      'M0 72 C10 68 16 78 24 78 C34 78 38 62 46 54 C54 46 60 48 68 58 C76 68 82 74 90 70 C95 68 98 64 100 62 L100 100 L0 100Z',
    );
    expect(edited.find((layer) => layer.id.includes('panorama-wave'))?.props.vectorGeometry).toMatchObject({
      version: 1,
      kind: 'path',
      closed: true,
    });
  });

  it('creates bounded lower layers for every slide without crossing safe insets', () => {
    const composition = createCarouselBackgroundComposition('ocean', {
      id: 'test-composition',
      safeZone: { top: 120, right: 80, bottom: 180, left: 80 },
    });
    const layers = generateCarouselBackgroundLayers({
      projectId: 'project',
      geometry,
      composition,
    });

    expect(layers).toHaveLength(geometry.slideCount + 2);
    expect(layers.every((layer) => layer.locked && layer.zIndex <= 1)).toBe(true);
    for (const layer of layers) {
      if (composition.colorVariant === 'ocean' && layer.props.layerRole === 'wave') continue;
      if (typeof layer.props.slideIndex !== 'number' || layer.props.wavePath || (layer.width ?? 0) > geometry.slideWidth) {
        expect(layer.props.wavePath).toBeTruthy();
        continue;
      }
      const slideIndex = layer.props.slideIndex as number;
      const left = (layer.position.x / 100) * geometry.panoramaWidth - (layer.width ?? 0) / 2;
      const right = (layer.position.x / 100) * geometry.panoramaWidth + (layer.width ?? 0) / 2;
      const top = (layer.position.y / 100) * geometry.panoramaHeight - (layer.height ?? 0) / 2;
      const bottom = (layer.position.y / 100) * geometry.panoramaHeight + (layer.height ?? 0) / 2;
      if (layer.props.layerRole === 'wave') {
        expect(left).toBeGreaterThanOrEqual(slideIndex * geometry.slideWidth - 0.101);
        expect(right).toBeLessThanOrEqual((slideIndex + 1) * geometry.slideWidth + 0.101);
      } else {
        expect(left).toBeGreaterThanOrEqual(slideIndex * geometry.slideWidth + 80 - 0.001);
        expect(right).toBeLessThanOrEqual((slideIndex + 1) * geometry.slideWidth - 80 + 0.001);
      }
      expect(top).toBeGreaterThanOrEqual(120 - 0.001);
      expect(bottom).toBeLessThanOrEqual(geometry.slideHeight - 180 + 0.001);
      expect(isCarouselBackgroundLayer(layer)).toBe(true);
    }
  });

  it('keeps trajectory endpoints continuous at each slide boundary', () => {
    const layers = generateCarouselBackgroundLayers({
      projectId: 'project',
      geometry,
      composition: createCarouselBackgroundComposition('white', {
        trajectory: { type: 'sine', amplitude: 0.1, frequency: 1, phase: 0 },
      }),
    });

    const waves = layers.filter(
      (layer) =>
        layer.props.layerRole === 'wave' &&
        !layer.id.includes('-top-wave') &&
        !layer.id.includes('-cover-wave-cutout') &&
        !layer.id.includes('-panorama-wave') &&
        !layer.id.includes('-top-semicircle'),
    );
    for (let index = 1; index < waves.length; index += 1) {
      const previous = waves[index - 1].props.trajectory as { endY: number };
      const current = waves[index].props.trajectory as { startY: number };
      expect(current.startY).toBeCloseTo(previous.endY, 10);
    }
  });

  it.each(CAROUSEL_ASPECT_RATIOS)('generates bounded continuous layers for %s', (aspectRatio) => {
    const ratioGeometry = getCarouselGeometryForAspectRatio(aspectRatio, 5);
    expect(validateCarouselGeometry(ratioGeometry, aspectRatio).valid).toBe(true);
    const layers = generateCarouselBackgroundLayers({
      projectId: `project-${aspectRatio}`,
      geometry: ratioGeometry,
    });
    const waves = layers.filter(
      (layer) =>
        layer.props.layerRole === 'wave' &&
        !layer.id.includes('-top-wave') &&
        !layer.id.includes('-cover-wave-cutout') &&
        !layer.id.includes('-panorama-wave') &&
        !layer.id.includes('-top-semicircle'),
    );
    expect(layers.filter((layer) => layer.id.includes('-panorama-wave'))).toHaveLength(1);
    expect(layers.filter((layer) => layer.id.includes('-top-semicircle'))).toHaveLength(2);
    for (let index = 0; index < waves.length; index += 1) {
      const wave = waves[index];
      const slideIndex = wave.props.slideIndex as number;
      const centerX = (wave.position.x / 100) * ratioGeometry.panoramaWidth;
      const width = wave.width ?? 0;
      expect(centerX - width / 2).toBeGreaterThanOrEqual(slideIndex * ratioGeometry.slideWidth - 0.11);
      expect(centerX + width / 2).toBeLessThanOrEqual((slideIndex + 1) * ratioGeometry.slideWidth + 0.11);
      if (index > 0) {
        const previous = waves[index - 1].props.trajectory as { endY?: number };
        const current = wave.props.trajectory as { startY?: number };
        expect(current.startY).toBeCloseTo(previous.endY ?? 0, 10);
      }
    }
  });

  it('regenerates only generated layers and preserves editable content', () => {
    const content = {
      id: 'editable-title',
      type: 'text' as const,
      title: 'Título editable',
      props: { text: 'No borrar' },
      position: { x: 50, y: 25 },
      zIndex: 10,
      scale: 1,
    };
    const project = {
      id: 'project',
      title: 'Legacy',
      preset: IMAGE_FORMAT_PRESETS.find((preset) => preset.id === 'instagram-carousel-portrait')!,
      background: { type: 'solid' as const, color: '#FFFFFF' },
      brandTokens: {} as never,
      layers: [content],
      carouselConfig: {
        enabled: true,
        platform: 'instagram' as const,
        slideCount: 5,
        slideWidth: geometry.slideWidth,
        slideHeight: geometry.slideHeight,
        currentSlideIndex: 0,
        slides: [],
        showSlideDividers: true,
        showSlideNumbers: true,
        autoSnapToSlides: true,
      },
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    const first = regenerateCarouselBackground(project);
    const composed = regenerateCarouselBackground(first, { colorVariant: 'midnight', shape: 'blob' });
    const second = regenerateCarouselBackground(composed, { intensity: 0.4 });
    expect(second.layers.find((layer) => layer.id === content.id)).toEqual(content);
    expect(second.layers.filter(isCarouselBackgroundLayer)).toHaveLength(7);
    expect(second.carouselBackground?.colorVariant).toBe('midnight');
    expect(second.carouselBackground?.shape).toBe('blob');
    expect(second.carouselBackground?.intensity).toBe(0.4);
  });

  it('integrates generated backgrounds into all reference color templates', () => {
    expect(VITABLUE_REFERENCE_CAROUSEL_TEMPLATES).toHaveLength(3);
    for (const template of VITABLUE_REFERENCE_CAROUSEL_TEMPLATES) {
      expect(template.carouselBackground?.colorVariant).toBe(
        template.id.slice(-('white'.length)) === 'white'
          ? 'white'
          : template.id.slice(-('ocean'.length)) === 'ocean'
            ? 'ocean'
            : 'midnight',
      );
      expect(template.layers.filter(isCarouselBackgroundLayer)).toHaveLength(
        template.carouselBackground?.colorVariant === 'white'
          ? 3
          : template.carouselBackground?.colorVariant === 'midnight'
            ? 7
            : template.carouselBackground?.colorVariant === 'ocean'
              ? 7
              : 10,
      );
    }
  });
});
