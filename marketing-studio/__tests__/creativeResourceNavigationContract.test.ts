import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { describe, expect, it } from 'vitest';
import {
  CORE_CREATIVE_RESOURCE_IDS,
  createCreativeResourceToolRail,
  CreativeResourceRegistry,
} from '../../components/creative-resources';
import { StudioToolRail } from '../../components/backoffice-shell';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('creative resource navigation parity', () => {
  it('keeps one ordered, available core contract for both studios', () => {
    expect(CORE_CREATIVE_RESOURCE_IDS).toEqual([
      'text',
      'elements',
      'media',
      'layers',
      'backgrounds',
      'layout',
      'brand',
    ]);
    expect(createCreativeResourceToolRail({ domain: 'video' }).map((item) => item.label)).toEqual([
      'Texto',
      'Elementos',
      'Medios',
      'Capas',
      'Fondos',
      'Diseño',
      'Kit de Marca',
    ]);
    for (const id of CORE_CREATIVE_RESOURCE_IDS) {
      expect(CreativeResourceRegistry.resolve(id, 'image')).toBeDefined();
      expect(CreativeResourceRegistry.resolve(id, 'video')).toBeDefined();
    }
  });

  it('uses the shared vertical rail owner and keeps Video extensions separate', () => {
    const image = read('marketing-studio/components/image-editor/ImageStudioAssetSidebar.tsx');
    const video = read('marketing-studio/components/creative-editor/CreativeEditorAssetSidebar.tsx');
    const imageStudio = read('marketing-studio/ImageStudio.tsx');
    const videoStudio = read('marketing-studio/SocialGenerator.tsx');
    const rail = read('components/backoffice-shell/primitives/StudioPrimitives.tsx');

    expect(image).not.toContain('ResourceTabs');
    expect(video).not.toContain('ResourceTabs');
    for (const source of [imageStudio, videoStudio]) {
      expect(source).toContain('createCreativeResourceToolRail');
      expect(source).toContain('<StudioToolRail');
    }
    expect(videoStudio).toContain("section: 'extensions'");
    expect(videoStudio).toContain("sectionLabel: 'Extensiones de Video Studio'");
    expect(rail).toContain("orientation = 'vertical'");
    expect(rail).toContain('data-creative-resource-section={item.section}');
    expect(rail).toContain('role="separator"');
  });

  it('renders the ordered core and extension groups as one vertical rail', () => {
    const items = [
      ...createCreativeResourceToolRail({ domain: 'video', layerCount: 3 }),
      {
        id: 'scenes',
        label: 'Escenas',
        section: 'extensions' as const,
        sectionLabel: 'Extensiones de Video Studio',
      },
      { id: 'audio', label: 'Audio', section: 'extensions' as const },
    ];
    const html = renderToStaticMarkup(
      React.createElement(StudioToolRail, { items, activeToolId: 'text', onSelect: () => undefined }),
    );

    expect(items.map((item) => item.id)).toEqual([
      ...CORE_CREATIVE_RESOURCE_IDS,
      'scenes',
      'audio',
    ]);
    expect(html).toContain('flex-col');
    expect(html).toContain('data-creative-resource-section="core"');
    expect(html).toContain('data-creative-resource-section="extensions"');
    expect(html).toContain('Extensiones de Video Studio');
    expect(html).not.toContain('role="tablist"');
  });
});
