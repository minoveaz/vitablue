import { describe, it, expect } from 'vitest';
import { IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import { INITIAL_IMAGE_TEMPLATES } from '../utils/imageTemplates';

describe('ImageStudio Presets & Templates', () => {
  it('defines the 7 required social media image format presets', () => {
    expect(IMAGE_FORMAT_PRESETS.length).toBeGreaterThanOrEqual(7);
    const ids = IMAGE_FORMAT_PRESETS.map((p) => p.id);
    expect(ids).toContain('instagram-portrait'); // 4:5
    expect(ids).toContain('instagram-square');   // 1:1
    expect(ids).toContain('story-vertical');    // 9:16
    expect(ids).toContain('landscape-banner');  // 16:9
    expect(ids).toContain('facebook-cover');
    expect(ids).toContain('linkedin-post');
    expect(ids).toContain('twitter-header');
  });

  it('has valid pixel dimensions for key social formats', () => {
    const igPortrait = IMAGE_FORMAT_PRESETS.find((p) => p.id === 'instagram-portrait');
    expect(igPortrait).toBeDefined();
    expect(igPortrait?.width).toBe(1080);
    expect(igPortrait?.height).toBe(1350);
    expect(igPortrait?.aspectRatio).toBe('4:5');

    const story = IMAGE_FORMAT_PRESETS.find((p) => p.id === 'story-vertical');
    expect(story?.width).toBe(1080);
    expect(story?.height).toBe(1920);
  });

  it('provides pre-designed templates with valid layers and backgrounds', () => {
    expect(INITIAL_IMAGE_TEMPLATES.length).toBeGreaterThanOrEqual(4);
    INITIAL_IMAGE_TEMPLATES.forEach((template) => {
      expect(template.id).toBeTruthy();
      expect(template.title).toBeTruthy();
      expect(template.preset).toBeDefined();
      expect(template.layers.length).toBeGreaterThan(0);
      expect(template.background).toBeDefined();
    });
  });
});
