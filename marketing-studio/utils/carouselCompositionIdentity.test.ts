import { describe, expect, it } from 'vitest';
import type { ImageProject } from '../types/imageStudio';
import { normalizeStoredProject, serializeStoredProject } from './imagePersistence';
import {
  DEFAULT_BRAND_VISUAL_COMPOSITION_CONFIG,
  constrainCarouselCompositionToBrand,
  filterCarouselBackgroundPalettes,
  filterCarouselBackgroundPresets,
  filterCarouselCompositionAccents,
  normalizeBrandVisualCompositionConfig,
  saveBrandCarouselComposition,
} from './carouselCompositionIdentity';
import { generateCarouselCompositionProposals } from './carouselCompositionAssistant';

describe('brand carousel composition identity', () => {
  it('provides stable defaults for an unconfigured brand', () => {
    const config = normalizeBrandVisualCompositionConfig();
    expect(config).toEqual(DEFAULT_BRAND_VISUAL_COMPOSITION_CONFIG);
    expect(config.allowedPalettes).toContain('midnight');
    expect(config.allowedPresets).toContain('cta-final');
  });

  it('normalizes unsafe values and filters editor options', () => {
    const config = normalizeBrandVisualCompositionConfig({
      allowedPalettes: ['ocean', 'ocean', 'unsafe'] as unknown as ('ocean' | 'white')[],
      allowedPresets: ['cta-final', 'unsafe'] as unknown as ('cta-final' | 'composicion-editorial')[],
      enabledAccents: ['gold-glow', 'unsafe'] as unknown as ('gold-glow' | 'soft-shadow')[],
      preferredCurveFamilies: ['diagonal'],
      intensityCap: 4,
      scaleCap: 0.1,
    });
    expect(filterCarouselBackgroundPalettes(config)).toEqual(['ocean']);
    expect(filterCarouselBackgroundPresets(config).map((item) => item.id)).toEqual(['cta-final']);
    expect(filterCarouselCompositionAccents(config)).toEqual(['gold-glow']);
    expect(config.intensityCap).toBe(1);
    expect(config.scaleCap).toBe(0.25);
  });

  it('constrains composition palette, preset, intensity, and scale', () => {
    const config = normalizeBrandVisualCompositionConfig({
      allowedPalettes: ['ocean'],
      allowedPresets: ['cta-final'],
      intensityCap: 0.5,
      scaleCap: 1.25,
    });
    const composition = constrainCarouselCompositionToBrand({
      colorVariant: 'midnight',
      presetId: 'diagonal-dinamica',
      intensity: 0.9,
      scale: 2,
    }, config);
    expect(composition.colorVariant).toBe('ocean');
    expect(composition.presetId).toBeUndefined();
    expect(composition.intensity).toBe(0.5);
    expect(composition.scale).toBe(1.25);
  });

  it('persists reusable compositions and keeps legacy projects unchanged', () => {
    const config = saveBrandCarouselComposition(
      { allowedPalettes: ['white'], allowedPresets: ['composicion-editorial'] },
      { name: 'Editorial', composition: { colorVariant: 'midnight', intensity: 2 } },
    );
    expect(config.savedCompositions[0]?.composition.colorVariant).toBe('white');
    expect(config.savedCompositions[0]?.composition.intensity).toBe(1);

    const legacy = {
      id: 'legacy-project',
      title: 'Legacy',
      preset: { id: 'post', width: 1080, height: 1080 },
      background: { type: 'solid', color: '#fff' },
      layers: [],
      brandTokens: {},
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    } as unknown as ImageProject;
    const normalized = normalizeStoredProject(legacy);
    expect(normalized.brandCompositionConfig).toBeUndefined();
    expect(serializeStoredProject({ ...legacy, brandCompositionConfig: config }).brandCompositionConfig)
      .toEqual(config);
  });

  it('limits assistant proposals to the brand library and caps its output', () => {
    const proposals = generateCarouselCompositionProposals({
      slideCount: 5,
      visualStyle: 'conversion',
      dominantZone: 'bottom',
      continuity: 'seamless',
      colorPalette: 'midnight',
      intensity: 1,
      scale: 2,
      selectedAccents: ['gold-glow', 'focal-point'],
      brandCompositionConfig: normalizeBrandVisualCompositionConfig({
        allowedPresets: ['cta-final'],
        allowedPalettes: ['ocean'],
        intensityCap: 0.4,
        scaleCap: 0.8,
        enabledAccents: ['gold-glow'],
      }),
    });
    expect(proposals).toHaveLength(1);
    expect(proposals[0]?.presetId).toBe('cta-final');
    expect(proposals[0]?.composition.colorVariant).toBe('ocean');
    expect(proposals[0]?.composition.intensity).toBe(0.4);
    expect(proposals[0]?.composition.scale).toBe(0.8);
    expect(proposals[0]?.accents).toEqual(['gold-glow']);
  });
});
