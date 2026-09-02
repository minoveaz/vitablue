import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ImageCropEditor } from './ImageCropEditor';
import { ImageStageLayers } from './ImageStageLayers';
import type { ImageProject } from '../../types/imageStudio';

const project = {
  id: 'crop-test',
  title: 'Crop test',
  preset: { width: 1080, height: 1080 },
  background: { type: 'solid', color: '#001219' },
  brandTokens: {},
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  layers: [
    {
      id: 'image-layer',
      type: 'image',
      title: 'Test image',
      props: { imageUrl: 'https://example.test/image.jpg' },
      position: { x: 50, y: 50 },
      zIndex: 1,
      scale: 1,
      width: 400,
      height: 300,
      clipShape: 'rounded-2xl',
    },
  ],
} as unknown as ImageProject;

const legacySourceProject = {
  ...project,
  layers: [{ ...project.layers[0], type: 'block', props: {}, src: 'https://example.test/legacy.jpg' }],
} as unknown as ImageProject;

const interactionHandlers = {
  handlePointerDown: () => undefined,
  handleContextMenu: () => undefined,
  handleResizeStart: () => undefined,
  handleRotateStart: () => undefined,
};

describe('ImageCropEditor', () => {
  it('renders all eight keyboard-accessible crop handles', () => {
    const markup = renderToStaticMarkup(
      <ImageCropEditor
        imageUrl="https://example.test/image.jpg"
        crop={{ x: 50, y: 50, zoom: 1 }}
        onChange={() => undefined}
      />,
    );

    expect(markup.match(/data-crop-handle=/g)).toHaveLength(8);
    expect(markup).toContain('aria-label="Editor de recorte de imagen"');
  });

  it('keeps the crop editor visible above clipped neighbouring layers', () => {
    const markup = renderToStaticMarkup(
      <ImageStageLayers
        project={project}
        selectedLayerId="image-layer"
        selectedLayerIds={['image-layer']}
        effectiveHandMode={false}
        isPanning={false}
        draggingLayerId={null}
        cropEditingLayerId="image-layer"
        cropDraft={{ x: 50, y: 50, zoom: 1 }}
        onCropChange={() => undefined}
        {...interactionHandlers}
      />,
    );

    expect(markup).toContain('data-image-crop-editor');
    expect(markup).toContain('z-index:2');
    // The editor's image viewport intentionally clips the source image, but
    // the layer itself must not clip handles outside the crop frame.
    expect(markup.match(/overflow-hidden/g)).toHaveLength(1);
  });

  it('also opens for legacy image layers that store their source on src', () => {
    const markup = renderToStaticMarkup(
      <ImageStageLayers
        project={legacySourceProject}
        selectedLayerId="image-layer"
        selectedLayerIds={['image-layer']}
        effectiveHandMode={false}
        isPanning={false}
        draggingLayerId={null}
        cropEditingLayerId="image-layer"
        cropDraft={{ x: 50, y: 50, zoom: 1 }}
        onCropChange={() => undefined}
        {...interactionHandlers}
      />,
    );

    expect(markup).toContain('data-image-crop-editor');
    expect(markup).toContain('legacy.jpg');
  });
});
