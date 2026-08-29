import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  ELEMENT_CATALOG_CATEGORIES,
  ELEMENT_CATALOG_RESOURCES,
  ELEMENT_PRIMARY_TOOLS,
  filterElementCatalog,
  getElementCatalogTool,
  normalizeElementPreset,
} from '../data/elementCatalog';
import { ELEMENT_SHAPE_SECTIONS } from '../data/elementShapes';
import { UNIVERSAL_ICON_CATALOG } from '../data/elementIcons';
import { hasValidElementPreviewMetadata } from '../data/elementPreviewValidation';
import { ELEMENT_PRESETS } from '../data/elementsPresets';
import {
  ELEMENT_CATALOG_CATEGORY_IDS,
  ElementCatalogResource,
  UNIVERSAL_ICON_IDS,
} from '../types/elementCatalog';
import {
  ElementResourcePreview,
} from '../components/image-editor/blocks/ElementResourcePreview';
import { ImageLayerBlockRenderer } from '../components/image-editor/blocks/BlockRenderer';
import { GeometricShapeGraphic } from '../components/image-editor/blocks/ShapeBlocks';

describe('Image Studio element catalog', () => {
  it('defines the complete P0 universal taxonomy without charts/data', () => {
    expect(ELEMENT_CATALOG_CATEGORIES.map((category) => category.id)).toEqual(
      ELEMENT_CATALOG_CATEGORY_IDS,
    );
    expect(ELEMENT_CATALOG_CATEGORY_IDS).toContain('forms_lines');
    expect(ELEMENT_CATALOG_CATEGORY_IDS).toContain('saved_elements');
    expect(ELEMENT_CATALOG_CATEGORY_IDS).not.toContain('charts_data');
  });

  it('normalizes legacy presets into complete, sector-agnostic metadata', () => {
    const universalShape = normalizeElementPreset(
      ELEMENT_PRESETS.find((preset) => preset.category === 'shapes')!,
    );
    const organizationIllustration = normalizeElementPreset(
      ELEMENT_PRESETS.find((preset) => preset.category === 'illustrations')!,
    );

    expect(universalShape).toMatchObject({
      category: 'forms_lines',
      scope: 'system',
      sourcePackage: 'universal',
      version: 1,
      approvalStatus: 'approved',
      locked: false,
    });
    expect(universalShape.organizationId).toBeUndefined();
    expect(universalShape.supportedFormats).toEqual(['image', 'video']);
    expect(universalShape.license.label).toBeTruthy();

    expect(organizationIllustration).toMatchObject({
      category: 'illustrations',
      scope: 'organization',
      organizationId: 'vitablue',
      sourcePackage: 'organization',
    });
  });

  it('combines primary navigation with independent scope, compatibility, state, and search filters', () => {
    const approved = normalizeElementPreset(
      ELEMENT_PRESETS.find((preset) => preset.category === 'illustrations')!,
    );
    const locked: ElementCatalogResource = {
      ...approved,
      id: 'workspace-locked-frame',
      title: 'Marco de campaña',
      category: 'frames_masks',
      scope: 'workspace',
      kind: 'frame',
      locked: true,
      supportedFormats: ['image'],
      tags: ['campaña'],
      preview: { renderer: 'fallback', label: 'Marco de campaña' },
    };
    const resources = [approved, locked];

    expect(filterElementCatalog(resources, { category: 'frames_masks' })).toEqual([locked]);
    expect(filterElementCatalog(resources, { scope: 'organization', format: 'video' })).toEqual([approved]);
    expect(filterElementCatalog(resources, { state: 'locked' })).toEqual([locked]);
    expect(filterElementCatalog(resources, { query: 'campaña' })).toEqual([locked]);
    expect(filterElementCatalog(resources, { scope: 'user' })).toEqual([]);
  });

  it('ships real universal frame and mask resources with renderable canvas graphics', () => {
    const frameResources = ELEMENT_CATALOG_RESOURCES.filter((resource) => resource.kind === 'frame');
    const maskResources = ELEMENT_CATALOG_RESOURCES.filter((resource) => resource.kind === 'mask');

    expect(frameResources.length).toBeGreaterThanOrEqual(6);
    expect(maskResources.length).toBeGreaterThanOrEqual(6);
    expect(frameResources.every((resource) => resource.category === 'frames_masks')).toBe(true);
    expect(maskResources.every((resource) => resource.category === 'frames_masks')).toBe(true);

    [...frameResources, ...maskResources].forEach((resource) => {
      expect(resource.scope).toBe('system');
      expect(resource.preview.renderer).toBe('graphic');
      if (resource.preview.renderer !== 'graphic') return;
      const canvasMarkup = renderToStaticMarkup(
        React.createElement(GeometricShapeGraphic, resource.preview),
      );
      expect(canvasMarkup).not.toContain('data-preview-fallback');
      expect(canvasMarkup).toContain('<svg');
    });
  });

  it('provides an expanded sector-agnostic universal icon and symbol library', () => {
    expect(UNIVERSAL_ICON_CATALOG).toHaveLength(UNIVERSAL_ICON_IDS.length);
    expect(UNIVERSAL_ICON_CATALOG.length).toBeGreaterThanOrEqual(50);
    expect(new Set(UNIVERSAL_ICON_CATALOG.map((item) => item.iconId)).size)
      .toBe(UNIVERSAL_ICON_IDS.length);

    const iconResources = ELEMENT_CATALOG_RESOURCES.filter((resource) => resource.kind === 'icon');
    expect(iconResources).toHaveLength(UNIVERSAL_ICON_IDS.length);
    expect(iconResources.every((resource) => (
      resource.scope === 'system'
      && resource.sourcePackage === 'universal'
      && resource.organizationId === undefined
      && resource.brandId === undefined
    ))).toBe(true);
  });

  it('covers curves, arcs, connectors, parametric geometry, blobs, brackets, and separators', () => {
    const shapeTypes = new Set(
      ELEMENT_SHAPE_SECTIONS.flatMap((section) => section.items.map((item) => item.shapeType)),
    );

    [
      'curve',
      'arc',
      'connector-elbow',
      'connector-curved',
      'polygon-parametric',
      'star-parametric',
      'blob-1',
      'blob-2',
      'blob-3',
      'bracket-square-pair',
      'bracket-curly-pair',
      'separator-wave',
      'separator-curve',
      'separator-zigzag',
      'separator-dots',
      'separator-diamond',
    ].forEach((shapeType) => expect(shapeTypes).toContain(shapeType));
    expect(shapeTypes).toContain('ring');
    ['blob-4', 'blob-5', 'blob-6', 'carousel-wave']
      .forEach((shapeType) => expect(shapeTypes).toContain(shapeType));
  });

  it('separates editing roles and exposes rapid drawing controls', () => {
    const find = (id: string) => ELEMENT_CATALOG_RESOURCES.find((resource) => resource.id === `system-${id}`);
    expect(find('draw-polyline')).toMatchObject({ editorRole: 'rapid-draw', kind: 'line' });
    expect(find('connector-elbow')).toMatchObject({
      editorRole: 'connector',
      kind: 'connector',
      editableFields: expect.arrayContaining(['startAnchor', 'endAnchor', 'headStyle', 'tailStyle']),
    });

    expect(find('shape-arrow-right')).toMatchObject({
      editorRole: 'arrow',
      kind: 'arrow',
      editableFields: expect.arrayContaining(['strokeWidth', 'curvature', 'lineJoin']),
    });

  });

  it('organizes creation resources into the simplified primary tools', () => {
    expect(ELEMENT_PRIMARY_TOOLS.map((tool) => tool.label)).toEqual([
      'Forma',
      'Línea',
      'Flecha',
      'Conector',
    ]);

    const resource = (id: string) => ELEMENT_CATALOG_RESOURCES.find((item) => item.id === `system-${id}`)!;
    expect(['shape-square', 'shape-circle', 'shape-blob-soft', 'shape-star-5', 'brace-pair', 'frame-rounded']
      .map((id) => getElementCatalogTool(resource(id)))).toEqual([
        'forma',
        'forma',
        'forma',
        'forma',
        'forma',
        'forma',
      ]);
    expect(getElementCatalogTool(resource('line-solid'))).toBe('linea');
    expect(getElementCatalogTool(resource('shape-arrow-right'))).toBe('flecha');
    expect(getElementCatalogTool(resource('connector-curved'))).toBe('conector');
    expect(getElementCatalogTool(resource('shape-carousel-wave'))).toBe('decorativas');
    expect(getElementCatalogTool(resource('draw-polyline'))).toBe('rapid-draw');
  });

  it('registers advanced reusable shape resources with editable geometry metadata', () => {
    const advanced = ELEMENT_CATALOG_RESOURCES.filter((resource) => (
      resource.id.includes('line-ring')
      || resource.id.includes('carousel-wave')
      || resource.id.includes('separator-curve')
    ));
    expect(advanced.length).toBe(3);
    advanced.forEach((resource) => {
      expect(resource.kind).toMatch(/shape|line/);
      expect(resource.preview.renderer).toBe('graphic');
      expect(resource.editableFields).toContain('vectorGeometry');
    });
  });

  it('gives every static catalog resource valid preview metadata and a renderable shared preview', () => {
    expect(ELEMENT_CATALOG_RESOURCES.length).toBeGreaterThan(100);
    expect(new Set(ELEMENT_CATALOG_RESOURCES.map((resource) => resource.id)).size)
      .toBe(ELEMENT_CATALOG_RESOURCES.length);

    ELEMENT_CATALOG_RESOURCES.forEach((resource) => {
      expect(resource.preview).toBeDefined();
      expect(hasValidElementPreviewMetadata(resource.preview), resource.id).toBe(true);
      const markup = renderToStaticMarkup(
        React.createElement(ElementResourcePreview, { resource }),
      );
      expect(markup.length, resource.id).toBeGreaterThan(20);
      expect(markup, resource.id).not.toContain('data-preview-fallback');

      if (resource.preview.renderer === 'graphic') {
        const canvasMarkup = renderToStaticMarkup(
          React.createElement(ImageLayerBlockRenderer, {
            layer: {
              id: `canvas-${resource.id}`,
              type: 'block',
              blockType: 'GeometricShape',
              title: resource.title,
              props: {
                shapeType: resource.preview.shapeType,
                sides: resource.preview.sides,
                points: resource.preview.points,
                innerRadius: resource.preview.innerRadius,
              },
              position: { x: 50, y: 50 },
              zIndex: 0,
              scale: 1,
              fill: resource.preview.fill,
              borderColor: resource.preview.stroke,
              borderWidth: resource.preview.strokeWidth,
              borderRadius: resource.preview.borderRadius,
            },
          }),
        );
        expect(canvasMarkup, resource.id).not.toContain('data-preview-fallback');
      }
    });
  });

  it('keeps organization resources scoped and falls back gracefully for unknown previews', () => {
    const systemResources = ELEMENT_CATALOG_RESOURCES.filter(
      (resource) => resource.scope === 'system',
    );
    const organizationResources = ELEMENT_CATALOG_RESOURCES.filter(
      (resource) => resource.scope === 'organization',
    );
    expect(systemResources.every((resource) => (
      resource.organizationId === undefined
      && resource.brandId === undefined
      && resource.sourcePackage === 'universal'
    ))).toBe(true);
    expect(organizationResources.length).toBeGreaterThan(0);
    expect(organizationResources.every((resource) => (
      resource.organizationId === 'vitablue'
      && resource.brandId === 'vitablue'
      && resource.sourcePackage === 'organization'
    ))).toBe(true);

    const fallbackMarkup = renderToStaticMarkup(
      React.createElement(ElementResourcePreview, {
        resource: {
          title: 'Recurso desconocido',
          preview: {
            renderer: 'graphic',
            shapeType: 'icon-not-registered' as never,
          },
        },
      }),
    );
    expect(fallbackMarkup).toContain('data-preview-fallback');
    expect(fallbackMarkup).toContain('Vista previa no disponible');
  });
});
