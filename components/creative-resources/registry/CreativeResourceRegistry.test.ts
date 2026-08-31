import { describe, expect, it } from 'vitest';
import { CreativeResourceRegistry } from './CreativeResourceRegistry';

describe('CreativeResourceRegistry', () => {
  it('returns the ten blocks in stable order', () => {
    expect(CreativeResourceRegistry.list().map((entry) => entry.id)).toEqual([
      'text', 'elements', 'media', 'layers', 'backgrounds', 'layout', 'brand', 'blocks', 'templates', 'prepare-video',
    ]);
  });

  it('filters availability by domain', () => {
    expect(CreativeResourceRegistry.list('video').map((entry) => entry.id)).not.toContain('prepare-video');
    expect(CreativeResourceRegistry.list('video').map((entry) => entry.id)).not.toContain('blocks');
    expect(CreativeResourceRegistry.list('video').map((entry) => entry.id)).not.toContain('templates');
    expect(CreativeResourceRegistry.resolve('prepare-video', 'video')).toBeUndefined();
    expect(CreativeResourceRegistry.resolve('blocks', 'video')).toBeUndefined();
    expect(CreativeResourceRegistry.resolve('brand', 'video')).toBeDefined();
  });
});
