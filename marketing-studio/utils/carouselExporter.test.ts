import { describe, expect, it } from 'vitest';
import { IMAGE_FORMAT_PRESETS, ImageProject } from '../types/imageStudio';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';
import {
  createCarouselPdf,
  createCarouselZip,
  getCarouselDownloadName,
  getCarouselExportSafeClassName,
  getCarouselExportPlan,
  getCarouselSliceRect,
  isCarouselExportExcluded,
} from './carouselExporter';
import { getCarouselPresetForAspectRatio } from './carouselCreativeVariants';
import { validateCarouselGeometry } from './imageDesignSystem';

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

  it.each(['1:1', '4:5', '9:16', '16:9'] as const)(
    'keeps %s geometry integer-aligned and gapless',
    (aspectRatio) => {
      const ratioProject = project({
        preset: getCarouselPresetForAspectRatio(project(), aspectRatio),
      });
      const plan = getCarouselExportPlan(ratioProject);
      expect(validateCarouselGeometry(plan, aspectRatio).valid).toBe(true);
      for (let index = 0; index < plan.slideCount - 1; index += 1) {
        const left = getCarouselSliceRect(plan, index);
        const right = getCarouselSliceRect(plan, index + 1);
        expect(left.sourceX + left.width).toBe(right.sourceX);
      }
    },
  );

  it.each([
    ['1:1', 1080, 1080],
    ['4:5', 1080, 1350],
    ['9:16', 1080, 1920],
    ['16:9', 1080, 608],
  ] as const)('uses the native %s slide raster', (aspectRatio, width, height) => {
    const plan = getCarouselExportPlan({
      ...project(),
      preset: getCarouselPresetForAspectRatio(project(), aspectRatio),
    });
    expect(plan.slideWidth).toBe(width);
    expect(plan.slideHeight).toBe(height);
    expect(plan.panoramaWidth).toBe(width * plan.slideCount);
  });

  it('rejects fractional or overlapping panorama geometry', () => {
    expect(validateCarouselGeometry({
      slideCount: 3,
      slideWidth: 900.5,
      slideHeight: 1125,
      panoramaWidth: 2701.5,
      panoramaHeight: 1125,
    }).valid).toBe(false);
    expect(() => getCarouselSliceRect({
      slideCount: 3,
      slideWidth: 900.5,
      slideHeight: 1125,
      panoramaWidth: 2701.5,
      panoramaHeight: 1125,
    }, 0)).toThrow('positive integer, gapless geometry');
  });

  it('rejects out-of-range slice indices instead of producing partial cuts', () => {
    const plan = {
      slideCount: 3,
      slideWidth: 1080,
      slideHeight: 1350,
      panoramaWidth: 3240,
      panoramaHeight: 1350,
    };
    expect(() => getCarouselSliceRect(plan, -1)).toThrow('out of bounds');
    expect(() => getCarouselSliceRect(plan, 3)).toThrow('out of bounds');
    expect(getCarouselSliceRect(plan, 2)).toEqual({
      index: 2,
      sourceX: 2160,
      sourceY: 0,
      width: 1080,
      height: 1350,
    });
  });

  it('excludes overlays and descendants from export captures', () => {
    const overlay = { dataset: { editorOverlay: 'true' }, parentNode: null } as unknown as Node;
    const child = { parentNode: overlay } as unknown as Node;
    const content = { dataset: { exportExclude: 'false' }, parentNode: null } as unknown as Node;
    expect(isCarouselExportExcluded(overlay)).toBe(true);
    expect(isCarouselExportExcluded(child)).toBe(true);
    expect(isCarouselExportExcluded(content)).toBe(false);
    expect(getCarouselExportSafeClassName(
      'canvas-layer-item ring-2 ring-brand-cyan ring-offset-2 shadow-2xl cursor-move',
    )).toBe('canvas-layer-item cursor-move');
  });

  it('creates PNG slide ZIP and multi-page PDF artifacts', async () => {
    const zip = await createCarouselZip([
      { name: 'slide_01.png', data: new Uint8Array([137, 80, 78, 71]) },
      { name: 'slide_02.png', data: new Uint8Array([137, 80, 78, 71]) },
    ]);
    expect(zip.type).toBe('application/zip');
    const zipBytes = new Uint8Array(await zip.arrayBuffer());
    expect(zipBytes.slice(0, 4)).toEqual(new Uint8Array([0x50, 0x4b, 0x03, 0x04]));

    const jpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/';
    const pdf = createCarouselPdf([jpeg, jpeg], 810, 1012.5);
    expect(pdf.type).toBe('application/pdf');
    const pdfText = new TextDecoder().decode(await pdf.arrayBuffer());
    expect(pdfText).toContain('%PDF-1.4');
    expect(pdfText).toContain('/Count 2');
    expect(pdfText).toContain('startxref');
  });
});
