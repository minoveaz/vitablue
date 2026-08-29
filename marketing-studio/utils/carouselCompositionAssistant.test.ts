import { describe, expect, it } from 'vitest';
import type { ImageProject } from '../types/imageStudio';
import { CAROUSEL_BACKGROUND_PRESETS, isCarouselBackgroundLayer } from './carouselBackgroundComposition';
import {
  applyCarouselCompositionProposal,
  generateCarouselCompositionProposals,
  selectCarouselCompositionProposal,
  type CarouselCompositionAssistantInput,
} from './carouselCompositionAssistant';

const input: CarouselCompositionAssistantInput = {
  slideCount: 5,
  visualStyle: 'conversion',
  dominantZone: 'bottom',
  continuity: 'seamless',
  colorPalette: 'midnight',
  intensity: 0.72,
  scale: 1.1,
  selectedAccents: ['gold-glow', 'focal-point'],
};

describe('carousel composition assistant', () => {
  it('returns ranked proposals that reuse approved presets and preferences', () => {
    const proposals = generateCarouselCompositionProposals(input);

    expect(proposals).toHaveLength(3);
    expect(proposals[0]?.presetId).toBe('cta-final');
    expect(proposals.every((proposal) => CAROUSEL_BACKGROUND_PRESETS.some((preset) => preset.id === proposal.presetId))).toBe(true);
    expect(proposals.every((proposal) => proposal.composition.colorVariant === 'midnight')).toBe(true);
    expect(proposals.every((proposal) => proposal.composition.intensity === 0.72)).toBe(true);
    expect(proposals.every((proposal) => proposal.composition.scale === 1.1)).toBe(true);
    expect(proposals.every((proposal) => proposal.composition.shadow === 'glow-gold')).toBe(true);
    expect(proposals[0]?.composition.focalPoint).toEqual({ x: 0.65, y: 0.76 });
  });

  it('is deterministic for the same brief and has a safe fallback selection', () => {
    const first = generateCarouselCompositionProposals(input);
    const second = generateCarouselCompositionProposals(input);

    expect(first).toEqual(second);
    expect(selectCarouselCompositionProposal(first, 'missing')?.id).toBe(first[0]?.id);
    expect(selectCarouselCompositionProposal(first, first[1]?.id)?.presetId).toBe(first[1]?.presetId);
  });

  it('applies only structural layers and preserves custom layers', () => {
    const project = {
      id: 'assistant-project',
      preset: {
        id: 'instagram-carousel-portrait',
        width: 5400,
        height: 1350,
        aspectRatio: '4:5',
        isCarousel: true,
        defaultSlideCount: 5,
        slideWidth: 1080,
        slideHeight: 1350,
      },
      background: { type: 'solid', color: '#001219' },
      brandTokens: {},
      layers: [{
        id: 'editable-layer',
        type: 'text',
        title: 'No borrar',
        props: { text: 'Contenido personalizado' },
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
    } as unknown as ImageProject;
    const proposal = generateCarouselCompositionProposals({ ...input, currentComposition: project.carouselBackground })[0]!;
    const next = applyCarouselCompositionProposal(project, proposal);

    expect(next.layers.find((layer) => layer.id === 'editable-layer')?.props.text).toBe('Contenido personalizado');
    expect(next.layers.filter(isCarouselBackgroundLayer).length).toBeGreaterThan(0);
    expect(next.carouselBackground?.presetId).toBe(proposal.presetId);
  });
});
