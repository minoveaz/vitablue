import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const readProjectFile = (relativePath: string) =>
  readFileSync(resolve(process.cwd(), relativePath), 'utf8');

describe('Video Studio Image Studio visual contract', () => {
  it('keeps the video toolbar on the shared density and focus-ring primitives', () => {
    const source = readProjectFile(
      'marketing-studio/components/creative-editor/CreativeEditorToolbar.tsx',
    );

    expect(source).toContain('data-visual-contract="image-studio-toolbar"');
    expect(source).toContain('min-h-11');
    expect(source).toContain('rounded-xl border border-slate-800 bg-slate-950');
    expect(source).toContain('bg-primary/30 text-brand-cyan');
    expect(source).toContain('focus-visible:ring-2 focus-visible:ring-brand-cyan/80');
    expect(source).toContain('onAspectRatioChange');
    expect(source).toContain('onToggleSafeZones');
    expect(source).toContain('onZoomLevelChange');
    expect(source).toContain('onExportMp4');
  });

  it('keeps both inspectors on the same shared panel contract', () => {
    const videoSource = readProjectFile(
      'marketing-studio/components/creative-editor/CreativeEditorInspector.tsx',
    );
    const imageSource = readProjectFile(
      'marketing-studio/components/image-editor/ImageStudioInspector.tsx',
    );
    const primitiveSource = readProjectFile(
      'components/backoffice-shell/primitives/StudioPrimitives.tsx',
    );

    for (const source of [imageSource, videoSource]) {
      expect(source).toContain('<StudioInspectorPanel');
      expect(source).toContain('as="div"');
      expect(source).toContain('width="standard"');
      expect(source).toContain('variant="dark"');
      expect(source).toContain('onClose={onClose}');
      expect(source).toContain('data-creative-studio-region="inspector-content"');
      expect(source).not.toContain('<ModuleContextPanel');
    }

    expect(primitiveSource).toContain("panelKind?: 'resource' | 'inspector'");
    expect(primitiveSource).toContain('data-visual-contract={`shared-studio-${panelKind}-panel`}');
    expect(primitiveSource).toContain('min-h-12 shrink-0 items-center justify-between gap-2 border-b px-4 py-2');
    expect(primitiveSource).toContain('min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar');
  });

  it('keeps the contextual inspector header, lock states and visible retry errors', () => {
    const source = readProjectFile(
      'marketing-studio/components/creative-editor/CreativeEditorInspector.tsx',
    );

    expect(source).toContain('inspectorIconButtonClass');
    expect(source).toContain('role="alert"');
    expect(source).toContain('No se pudo renderizar el vídeo');
    expect(source).toContain('onRetryRender');
    expect(source).toContain('selectedLayer.locked');
    expect(source).toContain('aria-label={`Color de texto ${c}`}');
    expect(source).toContain('min-h-11 min-w-11');
  });

  it('keeps the stage zoom toolbar aligned with the image stage toolbar', () => {
    const source = readProjectFile(
      'marketing-studio/components/creative-editor/VideoStage.tsx',
    );
    const primitiveSource = readProjectFile(
      'components/backoffice-shell/primitives/StudioPrimitives.tsx',
    );

    expect(source).toContain('data-visual-contract="image-studio-stage-toolbar"');
    expect(source).toContain('<StudioStageToolbar');
    expect(primitiveSource).toContain('bottom-5 left-1/2');
    expect(primitiveSource).toContain('rounded-2xl');
    expect(primitiveSource).toContain('bg-primary-dark/95');
    expect(source).toContain('onZoomLevelChange');
    expect(source).toContain('handleResetFit');
    expect(source).toContain("if (zoomLevel === 'fit')");
  });

  it('keeps the shared stage parent as a flex column so the renderer receives height', () => {
    const source = readProjectFile('components/backoffice-shell/SuiteCanvas.tsx');

    expect(source).toContain('min-w-0 flex flex-1 flex-col');
  });

  it('wires render errors and retry through the existing video shell slots', () => {
    const source = readProjectFile('marketing-studio/SocialGenerator.tsx');
    const resourcePanel = source.split('resourcePanel:')[1]?.split('toolbar:')[0] ?? '';

    expect(source).toContain('toolRail:');
    expect(source).toContain('resourcePanel:');
    expect(source).toContain('inspector: isInspectorOpen');
    expect(source).toContain('error={renderStatus === \'error\' ? renderStatusMessage : undefined}');
    expect(source).toContain('onRetryRender=');
    expect(source).not.toContain('<SuiteSidebar');
    expect(source).toContain('React.useCallback((instance: PlayerRef | null)');
    expect(source).toContain('}, [playerInstance]);');
    expect(resourcePanel).toContain('videoScenesPanel');
    expect(resourcePanel).toContain('<StudioResourcePanel');
  });

  it('shares Image Studio resource drawer chrome without nesting a second sidebar', () => {
    const imageSource = readProjectFile('marketing-studio/ImageStudio.tsx');
    const videoSource = readProjectFile('marketing-studio/SocialGenerator.tsx');
    const primitiveSource = readProjectFile(
      'components/backoffice-shell/primitives/StudioPrimitives.tsx',
    );
    const videoSidebarSource = readProjectFile(
      'marketing-studio/components/creative-editor/CreativeEditorAssetSidebar.tsx',
    );
    const imageSidebarSource = readProjectFile(
      'marketing-studio/components/image-editor/ImageStudioAssetSidebar.tsx',
    );

    expect(imageSource).toContain('<StudioResourcePanel');
    expect(videoSource).toContain('<StudioResourcePanel');
    expect(videoSource).not.toContain('<ModuleContextSidebar');
    expect(videoSidebarSource).toContain('data-visual-contract="shared-studio-resource-content"');
    expect(imageSidebarSource).toContain('data-visual-contract="shared-studio-resource-content"');
    expect(primitiveSource).toContain('panelKind="resource"');
    expect(primitiveSource).toContain('custom-scrollbar');
    expect(primitiveSource).toContain('min-h-12 shrink-0 items-center justify-between gap-2 border-b px-4 py-2');
    expect(primitiveSource).toContain('min-h-11 min-w-11');
  });

  it('keeps Video Studio scene, brand, layer and audio content in the shared drawer', () => {
    const source = readProjectFile(
      'marketing-studio/components/creative-editor/CreativeEditorAssetSidebar.tsx',
    );

    for (const label of ['Escenas', 'Brand Kit', 'Capas', 'Audio', 'Storyboard']) {
      expect(source).toContain(label);
    }
    for (const callback of [
      'onSelectSlide',
      'onAddScene',
      'onDuplicateScene',
      'onRemoveScene',
      'onMoveScene',
      'onAddLayer',
      'onAddComponentLayer',
    ]) {
      expect(source).toContain(callback);
    }
    expect(source).toContain('role="tablist"');
    expect(source).toContain('aria-selected={activeTab ===');
  });
});
