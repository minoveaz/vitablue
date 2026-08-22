import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BLOCK_CATALOGS } from '../data/blockCatalog';
import { ImageLayerBlockRenderer } from '../components/image-editor/blocks/BlockRenderer';
import { createMarketingBlockGroup, expandCustomGroup, isMarketingBlockType } from '../utils/imageEditorCore';

describe('Image Studio marketing blocks', () => {
  it('renders every catalog composition with defaults when layer props are empty', () => {
    const blocks = Object.values(BLOCK_CATALOGS).flat().filter((block, index, all) =>
      all.findIndex((candidate) => candidate.type === block.type) === index,
    );

    blocks.forEach((block) => {
      const markup = renderToStaticMarkup(
        React.createElement(ImageLayerBlockRenderer, {
          layer: {
            id: `test-${block.id}`,
            type: 'block',
            blockType: block.type,
            title: block.name,
            props: {},
            position: { x: 50, y: 50 },
            zIndex: 0,
            scale: 1,
            width: block.defaultSize?.width,
            height: block.defaultSize?.height,
          },
        }),
      );

      expect(markup, block.type).toContain('class=');
      expect(markup, block.type).not.toBe('');
      expect(markup, block.type).not.toContain('Vista previa no disponible');
    });

  });

  it('inserts catalog marketing blocks as resizable editable groups', () => {
      const blocks = Object.values(BLOCK_CATALOGS).flat().filter((block, index, all) =>
        all.findIndex((candidate) => candidate.type === block.type) === index,
      ).filter((block) => isMarketingBlockType(block.type));

      blocks.forEach((block) => {
        const group = createMarketingBlockGroup(block.type, block.defaultProps, `group-${block.id}`, {
          width: block.defaultSize?.width ?? 420,
          height: block.defaultSize?.height ?? 280,
          canvasWidth: 1080,
          canvasHeight: 1350,
        });
        const children = group.props.childrenLayers as Array<{ blockType?: string; props: Record<string, unknown> }>;

        expect(group.blockType, block.type).toBe('CustomGroup');
        expect(group.width, block.type).toBe(block.defaultSize?.width);
        expect(group.props.marketingBlockType, block.type).toBe(block.type);
        expect(children.length, block.type).toBeGreaterThan(1);
        expect(children.every((child) => child.blockType === 'MarketingBlockPart'), block.type).toBe(true);
        expect(expandCustomGroup({ ...group, width: (group.width ?? 1) * 0.75, scale: 1.2 }).length, block.type).toBe(children.length);

        const markup = renderToStaticMarkup(React.createElement(ImageLayerBlockRenderer, { layer: group }));
        expect(markup, block.type).toContain('class=');
        expect(markup, block.type).not.toContain('Vista previa no disponible');
    });
  });
});
