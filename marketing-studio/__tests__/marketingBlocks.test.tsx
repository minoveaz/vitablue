import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BLOCK_CATALOGS } from '../data/blockCatalog';
import { ImageLayerBlockRenderer } from '../components/image-editor/blocks/BlockRenderer';

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
});
