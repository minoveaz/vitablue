import { describe, expect, it } from 'vitest';
import { TEMPLATE_CATALOG } from './templateCatalog';
import { MARKETING_TEMPLATE_PROJECT_BY_ID } from '../utils/imageTemplates';
import { getCarouselGeometry } from '../utils/imageDesignSystem';
import { validateCarouselLayoutLayers } from '../utils/carouselLayoutComposer';
import { isCarouselBackgroundLayer } from '../utils/carouselBackgroundComposition';

describe('template catalog integrity', () => {
  it('resolves every catalog project to an editable image project', () => {
    TEMPLATE_CATALOG.forEach((item) => {
      expect(MARKETING_TEMPLATE_PROJECT_BY_ID.has(item.projectId)).toBe(true);
    });
  });

  it('keeps catalog identifiers and project identifiers unique', () => {
    expect(new Set(TEMPLATE_CATALOG.map((item) => item.id)).size).toBe(TEMPLATE_CATALOG.length);
    expect(new Set(TEMPLATE_CATALOG.map((item) => item.projectId)).size).toBe(TEMPLATE_CATALOG.length);
  });

  it('exposes the three five-slide VitaBlue reference treatments as real projects', () => {
    const references = TEMPLATE_CATALOG.filter((item) => item.layoutId === 'educational-five-step');

    expect(references.map((item) => item.colorVariant)).toEqual(['white', 'midnight', 'ocean']);
    expect(references.every((item) => item.slideCount === 5 && item.aspectRatio === '4:1')).toBe(true);
    references.forEach((item) => {
      const project = MARKETING_TEMPLATE_PROJECT_BY_ID.get(item.projectId);
      const expectedBackground = { white: '#FFFFFF', midnight: '#001219', ocean: '#005F73' }[item.colorVariant!];
      expect(project?.carouselConfig).toMatchObject({
        enabled: true,
        slideCount: 5,
        layoutId: 'educational-five-step',
      });
      expect(project?.background.color).toBe(expectedBackground);
      expect(project?.layers.length).toBeGreaterThan(20);
      expect(project?.layers.every((layer) => layer.props.slideIndex !== undefined)).toBe(true);
      expect(new Set(project?.layers.map((layer) => layer.props.slideIndex)).size).toBe(5);
      expect(project?.layers.some((layer) => layer.blockType === 'WebIllustration')).toBe(true);
      expect(project?.layers.some((layer) => layer.blockType === 'GeometricShape')).toBe(true);
      expect(project?.layers.some((layer) => layer.blockType === 'BrandLogo')).toBe(true);
      expect(project?.layers.some((layer) => layer.clipShape === 'phone_mockup')).toBe(true);
      const geometry = getCarouselGeometry(project!.preset, project!.carouselConfig?.slideCount, true);
      expect(validateCarouselLayoutLayers(project!.layers, geometry.panoramaWidth, geometry.panoramaHeight)).toEqual([]);
      const contentLayers = project?.layers.filter((layer) => !isCarouselBackgroundLayer(layer)) ?? [];
      expect(contentLayers.every((layer) => {
        const slideIndex = Number(layer.props.slideIndex);
        const centerX = (layer.position.x / 100) * geometry.panoramaWidth - slideIndex * geometry.slideWidth;
        const width = (layer.width ?? 0) * (layer.scale ?? 1);
        return centerX - width / 2 >= 0 && centerX + width / 2 <= geometry.slideWidth;
      })).toBe(true);
      expect(project?.layers.some((layer) => ['InsuranceProductHero', 'InsuranceCoverageGrid', 'InsurancePlanComparison', 'InsuranceTrustBar', 'InsuranceAdvisorCta'].includes(layer.blockType ?? ''))).toBe(false);
    });
  });
});
