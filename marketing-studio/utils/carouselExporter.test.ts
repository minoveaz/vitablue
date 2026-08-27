import { describe, expect, it } from 'vitest';
import { IMAGE_FORMAT_PRESETS, ImageProject } from '../types/imageStudio';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';
import { getCarouselDownloadName, getCarouselExportPlan } from './carouselExporter';

const portrait = IMAGE_FORMAT_PRESETS.find((preset) => preset.id === 'instagram-carousel-portrait')!;

const project = (overrides: Partial<ImageProject> = {}): ImageProject => ({
  id: 'carousel-test',
  title: 'Guia VitaBlue 2026',
  preset: portrait,
  background: { type: 'solid', color: '#fff' },
  layers: [],
  brandTokens: defaultMotionBrandTokens,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('carousel exporter', () => {
  it('uses carousel config overrides for export dimensions and slide count', () => {
    const plan = getCarouselExportPlan(project({
      carouselConfig: {
        enabled: true,
        platform: 'instagram',
        slideCount: 3,
        slideWidth: 900,
        slideHeight: 1125,
        currentSlideIndex: 0,
        slides: [],
        showSlideDividers: true,
        showSlideNumbers: true,
        autoSnapToSlides: true,
      },
    }));

    expect(plan).toEqual({
      slideCount: 3,
      slideWidth: 900,
      slideHeight: 1125,
      panoramaWidth: 2700,
      panoramaHeight: 1125,
    });
  });

  it('rejects non-carousel projects', () => {
    expect(() => getCarouselExportPlan(project({
      preset: IMAGE_FORMAT_PRESETS.find((format) => format.id === 'instagram-portrait')!,
    }))).toThrow('not configured as a carousel');
  });

  it('builds stable download names for every export format', () => {
    const currentProject = project();

    expect(getCarouselDownloadName(currentProject, 'panorama', 'png')).toBe('guia_vitablue_2026_panorama.png');
    expect(getCarouselDownloadName(currentProject, 'linkedin_carousel', 'pdf')).toBe('guia_vitablue_2026_linkedin_carousel.pdf');
    expect(getCarouselDownloadName(currentProject, 'carousel_pack', 'zip')).toBe('guia_vitablue_2026_carousel_pack.zip');
  });
});
