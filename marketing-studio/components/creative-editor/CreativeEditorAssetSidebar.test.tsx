import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { defaultVisaRejectionProject } from '../../../packages/video-studio/src/domain/defaultProject';
import { CreativeEditorAssetSidebar, type CreativeEditorResourceTab } from './CreativeEditorAssetSidebar';

const createProps = (activeTab: CreativeEditorResourceTab) => ({
  scenes: defaultVisaRejectionProject.scenes,
  activeSlideId: 'slide_1',
  activeTab,
  onActiveTabChange: vi.fn(),
  onSelectSlide: vi.fn(),
  onAddScene: vi.fn(),
  onDuplicateScene: vi.fn(),
  onRemoveScene: vi.fn(),
  onMoveScene: vi.fn(),
  onAddLayer: vi.fn(),
  onAddTextLayer: vi.fn(),
  onAddSubtitleLayer: vi.fn(),
  onAddComponentLayer: vi.fn(),
  onLoadPreset: vi.fn(),
  selectedLayerId: 'slide_1-hook',
  onSelectLayer: vi.fn(),
  onUpdateLayerPosition: vi.fn(),
});

describe('Video Studio shared creative resources', () => {
  it('renders only the selected core resource without a horizontal selector', () => {
    const html = renderToStaticMarkup(<CreativeEditorAssetSidebar {...createProps('text')} />);
    expect(html).toContain('data-resource-block="text"');
    expect(html).toContain('Texto');
    expect(html).not.toContain('role="tablist"');
    expect(html).not.toContain('data-resource-block="elements"');
  });

  it.each([
    ['text', 'creative-resource-panel-text'],
    ['elements', 'creative-resource-panel-elements'],
    ['media', 'creative-resource-panel-media'],
    ['layers', 'creative-resource-panel-layers'],
    ['brand', 'creative-resource-panel-brand'],
    ['backgrounds', 'creative-resource-panel-backgrounds'],
    ['layout', 'creative-resource-panel-layout'],
  ] as const)('renders the shared %s block without a duplicate legacy panel', (activeTab, panelId) => {
    const html = renderToStaticMarkup(<CreativeEditorAssetSidebar {...createProps(activeTab)} />);
    expect(html).toContain(`data-resource-block="${activeTab === 'brand' ? 'brand' : activeTab}"`);
    expect(html).toContain(`id="${panelId}"`);
    expect(html.match(/data-resource-block=/g)).toHaveLength(1);
  });

  it('keeps scene and audio extensions outside the registry blocks', () => {
    expect(renderToStaticMarkup(<CreativeEditorAssetSidebar {...createProps('storyboard')} />)).toContain('Storyboard');
    expect(renderToStaticMarkup(<CreativeEditorAssetSidebar {...createProps('audio')} />)).toContain('Audio de la escena');
  });

  it('keeps Video Studio media upload wired to image and video project layers', () => {
    const html = renderToStaticMarkup(<CreativeEditorAssetSidebar {...createProps('media')} />);
    expect(html).toContain('Subir una imagen');
    expect(html).toContain('video/*');
  });
});
