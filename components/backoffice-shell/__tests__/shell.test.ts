import { describe, it, expect } from 'vitest';
import {
  SUITE_SHELL_MODE_PRESETS,
  type SuiteCanvasMode,
} from '../contracts';

describe('LoopDev Shell Contracts and Presets', () => {
  const modes: SuiteCanvasMode[] = ['overview', 'data', 'workspace', 'split', 'board', 'full-bleed'];

  it('should define valid geometric presets for all SuiteCanvasMode variants', () => {
    for (const mode of modes) {
      const preset = SUITE_SHELL_MODE_PRESETS[mode];
      expect(preset).toBeDefined();
      expect(preset.canvasGeometry.mode).toBe(mode);
      expect(preset.canvasGeometry.columns).toBeGreaterThanOrEqual(8);
      expect(preset.canvasGeometry.mobileColumns).toBe(4);
      expect(['bounded', 'split', 'wide', 'full-bleed']).toContain(preset.canvasGeometry.geometry);
    }
  });

  it('should configure full-bleed mode for zero padding and full width/height', () => {
    const fullBleed = SUITE_SHELL_MODE_PRESETS['full-bleed'];
    expect(fullBleed.canvasGeometry.padding).toBe('none');
    expect(fullBleed.canvasGeometry.maxWidth).toBe('full');
    expect(fullBleed.canvasGeometry.geometry).toBe('full-bleed');
  });

  it('should configure split mode for dual pane workspaces like Document Intelligence', () => {
    const split = SUITE_SHELL_MODE_PRESETS.split;
    expect(split.canvasGeometry.geometry).toBe('split');
    expect(split.canvasGeometry.maxWidth).toBe('full');
    expect(split.canvasGeometry.padding).toBe('none');
  });

  it('should configure overview and data modes for bounded layout', () => {
    const overview = SUITE_SHELL_MODE_PRESETS.overview;
    expect(overview.canvasGeometry.geometry).toBe('bounded');
    expect(overview.canvasGeometry.maxWidth).toBe('bounded');

    const data = SUITE_SHELL_MODE_PRESETS.data;
    expect(data.canvasGeometry.geometry).toBe('bounded');
  });
});
