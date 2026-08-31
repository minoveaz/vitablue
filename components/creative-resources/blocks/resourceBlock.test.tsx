import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import { BlocksResource } from './blocks/BlocksResource';
import { BrandKitResource } from './brand-kit/BrandKitResource';
import { BackgroundsResource } from './backgrounds/BackgroundsResource';
import { ElementsResource } from './elements/ElementsResource';
import { LayersResource } from './layers/LayersResource';
import { LayoutResource } from './layout/LayoutResource';
import { MediaResource } from './media/MediaResource';
import { PrepareVideoResource } from './prepare-video/PrepareVideoResource';
import { TemplatesResource } from './templates/TemplatesResource';
import { TextResource } from './text/TextResource';
import type { CreativeResourceComponentProps } from '../contracts/creativeResource';

const context: CreativeResourceComponentProps['context'] = {
  domain: 'image',
  documentId: 'test-document',
  capabilities: [],
  selection: { layerIds: [] },
  state: 'ready',
  actions: {},
};

const blocks = [
  ['text', <TextResource context={context} />],
  ['elements', <ElementsResource context={context} />],
  ['media', <MediaResource context={context} />],
  ['layers', <LayersResource context={context} />],
  ['backgrounds', <BackgroundsResource context={context} />],
  ['layout', <LayoutResource context={context} />],
  ['brand', <BrandKitResource context={context} />],
  ['blocks', <BlocksResource context={context} />],
  ['templates', <TemplatesResource context={context} />],
  ['prepare-video', <PrepareVideoResource context={context} />],
] as const;

for (const [id, block] of blocks) {
  it(`renders the ${id} block through the shared shell`, () => {
    const html = renderToStaticMarkup(block);
    expect(html).toContain('data-resource-block=');
    expect(html).toContain('data-resource-header');
  });
}

it('keeps insert callbacks typed at the block boundary', () => {
  const inserted: string[] = [];
  const item = { id: 'text-1', label: 'Titular' };
  const element = <TextResource context={context} items={[item]} onInsert={(value) => inserted.push(value.id)} />;
  expect(element.props.onInsert).toBeDefined();
  element.props.onInsert?.(item);
  expect(inserted).toEqual(['text-1']);
});
