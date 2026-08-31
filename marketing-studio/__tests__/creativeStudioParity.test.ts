import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CREATIVE_STUDIO_PARITY_MATRIX } from '../../components/backoffice-shell/contracts/creativeStudioParity';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('Creative Studio shared parity matrix', () => {
  const image = read('marketing-studio/ImageStudio.tsx');
  const video = read('marketing-studio/SocialGenerator.tsx');
  const adapter = read('components/backoffice-shell/CreativeStudioShellAdapter.tsx');
  const primitives = read('components/backoffice-shell/primitives/StudioPrimitives.tsx');

  it('keeps every common surface owned by the same shell contract', () => {
    expect(CREATIVE_STUDIO_PARITY_MATRIX).toHaveLength(14);
    for (const surface of CREATIVE_STUDIO_PARITY_MATRIX) {
      expect(surface.owner.length).toBeGreaterThan(0);
      expect(surface.image.length).toBeGreaterThan(0);
      expect(surface.video.length).toBeGreaterThan(0);
    }

    for (const source of [image, video]) {
      for (const slot of ['toolRail:', 'resourcePanel:', 'toolbar:', 'inspector:', 'stage:']) {
        expect(source).toContain(slot);
      }
      expect(source).toContain('<CreativeStudioShellAdapter');
      expect(source).toContain('<StudioToolRail');
      expect(source).toContain('<StudioResourcePanel');
      expect(source).toContain('scope="consumer"');
      expect(source).not.toContain('<SuiteSidebar');
    }
  });

  it('keeps shared chrome and stage controls centralized', () => {
    expect(adapter).toContain('<SuiteShell');
    expect(adapter).toContain('<SuiteCanvas');
    expect(adapter).toContain('<LiveStatus');
    expect(primitives).toContain('data-visual-contract="creative-studio-canvas-chrome"');
    expect(primitives).toContain('data-visual-contract="creative-studio-bottom-workspace"');
    expect(primitives).toContain('data-visual-contract={visualContract}');
    expect(read('marketing-studio/components/image-editor/ImageStageToolbar.tsx')).toContain('<StudioStageToolbar');
    expect(read('marketing-studio/components/creative-editor/VideoStage.tsx')).toContain('<StudioStageToolbar');
    expect(primitives).toContain('CanvasGrid');
    expect(adapter).toContain('grid={props.canvasGrid}');
    expect(read('components/backoffice-shell/primitives/CanvasGrid.config.ts')).toContain('CANVAS_GRID_PATTERNS');
  });

  it('does not render suite navigation in a creative workspace configured as hidden', () => {
    const shell = read('components/backoffice-shell/SuiteShell.tsx');
    expect(shell).toContain("effectiveNavMode !== 'hidden'");
    expect(shell).toContain('data-creative-studio-shell="suite"');
  });
});
