import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { TextResource } from './text/TextResource';
import { ElementsResource } from './elements/ElementsResource';
import { MediaResource } from './media/MediaResource';
import { LayersResource } from './layers/LayersResource';
import { BackgroundsResource } from './backgrounds/BackgroundsResource';
import { LayoutResource } from './layout/LayoutResource';
import { BrandKitResource } from './brand-kit/BrandKitResource';
import type { CreativeResourceActions, CreativeResourceContext } from '../contracts/creativeResource';

const context = (domain: 'image' | 'video', overrides: Partial<CreativeResourceContext<unknown, CreativeResourceActions<any, any>>> = {}): CreativeResourceContext<unknown, CreativeResourceActions<any, any>> => ({
  domain,
  documentId: `${domain}-test`,
  capabilities: ['search', 'filter'],
  selection: { layerIds: [], sceneId: 'scene-1' },
  state: 'ready',
  actions: {},
  ...overrides,
});

const blocks = [
  ['text', TextResource],
  ['elements', ElementsResource],
  ['media', MediaResource],
  ['layers', LayersResource],
  ['backgrounds', BackgroundsResource],
  ['layout', LayoutResource],
  ['brand', BrandKitResource],
] as const;

describe('core resource internal parity', () => {
  it.each(blocks)('renders the same core structure for %s in Image and Video', (_id, Block) => {
    const image = renderToStaticMarkup(<Block context={context('image')} />);
    const video = renderToStaticMarkup(<Block context={context('video')} />);
    expect(image).toContain('data-core-resource-content=');
    expect(video).toContain('data-core-resource-content=');
    expect(image.match(/data-resource-header/g)?.length).toBe(1);
    expect(video.match(/data-resource-header/g)?.length).toBe(1);
    if (_id === 'text' || _id === 'elements' || _id === 'media') {
      expect(image).toContain('Buscar');
      expect(video).toContain('Buscar');
    }
  });

  it('uses adapters for insert callbacks rather than changing card structure', () => {
    const insert = vi.fn();
    const videoContext = context('video', { actions: { insert } });
    const imageInsert = vi.fn();
    const imageContext = context('image', { actions: { insert: imageInsert } });
    const html = renderToStaticMarkup(<TextResource context={videoContext} />);
    renderToStaticMarkup(<TextResource context={imageContext} />);
    expect(html).toContain('Insertar');
    expect(insert).not.toHaveBeenCalled();
    videoContext.actions.insert?.({ kind: 'text', value: 'Hook' });
    imageContext.actions.insert?.({ kind: 'text', value: 'Titular' });
    expect(insert).toHaveBeenCalledWith({ kind: 'text', value: 'Hook' });
    expect(imageInsert).toHaveBeenCalledWith({ kind: 'text', value: 'Titular' });
  });

  it('keeps the Image Studio text drawer contract in both domains', () => {
    const image = renderToStaticMarkup(<TextResource context={context('image')} />);
    const video = renderToStaticMarkup(<TextResource context={context('video')} />);

    for (const html of [image, video]) {
      expect(html).toContain('Añadir un cuadro de texto');
      expect(html).toContain('Buscar ganchos, precios, estilos...');
      expect(html).toContain('Bibliotecas de texto');
      expect(html).toContain('Universal');
      expect(html).toContain('Empresa');
      expect(html).toContain('Míos');
      expect(html).toContain('Insertar');
      expect(html).toContain('Poppins');
    }
    expect(image.match(/data-resource-header/g)?.length).toBe(1);
    expect(video.match(/data-resource-header/g)?.length).toBe(1);
    expect(renderToStaticMarkup(<TextResource context={context('video', { data: { items: [] } })} />))
      .toContain('No se encontraron estilos de texto');
  });

  it('keeps the complete media studio contract in the shared block', () => {
    const html = renderToStaticMarkup(<MediaResource context={context('image', {
      extensions: { media: { insert: () => undefined, setBackground: () => undefined } },
    })} />);
    expect(html).toContain('Subir una imagen');
    expect(html).toContain('Subir tu propia foto o logo');
    expect(html).toContain('Bibliotecas de medios');
    expect(html).toContain('Forma al insertar:');
    expect(html).toContain('Categorías de medios');
    expect(html).toContain('+ Añadir Capa');
    expect(html).toContain('Poner de fondo');
  });

  it('shows explicit disabled states only when the domain cannot apply backgrounds or layout', () => {
    const backgrounds = renderToStaticMarkup(<BackgroundsResource context={context('video')} />);
    const layout = renderToStaticMarkup(<LayoutResource context={context('video')} />);
    const imageActions = { update: vi.fn() };
    const imageBackgrounds = renderToStaticMarkup(<BackgroundsResource context={context('image', {
      capabilities: ['background-update'],
      actions: imageActions,
      data: {
        preset: {
          id: 'carousel',
          width: 1080,
          height: 1350,
          aspectRatio: '4:5',
          category: 'carousel',
          name: 'Carrusel',
          description: '',
          iconName: 'Layers',
          recommendedFor: '',
          isCarousel: true,
          defaultSlideCount: 3,
        },
      },
    })} />);
    expect(backgrounds).toContain('no permite aplicar fondos');
    expect(layout).toContain('no expone controles de diseño');
    expect(imageBackgrounds).toContain('Aplicar');
    expect(imageBackgrounds).not.toContain('no permite aplicar fondos');
  });

  it('retains the incumbent interaction surfaces for all five extracted blocks', () => {
    const elements = renderToStaticMarkup(<ElementsResource context={context('image')} />);
    const layers = renderToStaticMarkup(<LayersResource context={context('image')} />);
    const backgrounds = renderToStaticMarkup(<BackgroundsResource context={context('image', {
      capabilities: ['background-update'],
      actions: { update: vi.fn() },
      data: {
        preset: {
          id: 'carousel',
          width: 1080,
          height: 1350,
          aspectRatio: '4:5',
          category: 'carousel',
          name: 'Carrusel',
          description: '',
          iconName: 'Layers',
          recommendedFor: '',
          isCarousel: true,
          defaultSlideCount: 3,
        },
      },
    })} />);
    const layout = renderToStaticMarkup(<LayoutResource context={context('image')} />);
    const brand = renderToStaticMarkup(<BrandKitResource context={context('image')} />);

    expect(elements).toContain('Bibliotecas de elementos');
    expect(elements).toContain('Dibujo rápido');
    expect(layers).toContain('Árbol de Capas');
    expect(layers).toContain('Superpuestas');
    expect(backgrounds).toContain('Asistente de composición');
    expect(backgrounds).toContain('Aplicar seleccionada');
    expect(layout).toContain('Safe zone de plataforma');
    expect(brand).toContain('Kit de Marca Oficial VitaBlue');
    expect(brand).toContain('Reglas de uso');
  });
});
