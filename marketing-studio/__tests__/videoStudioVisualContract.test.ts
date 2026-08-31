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
    const sharedSource = readProjectFile(
      'components/backoffice-shell/primitives/StudioToolbar.tsx',
    );

    expect(source).toContain('<StudioToolbar');
    expect(sharedSource).toContain('data-visual-contract="image-studio-toolbar"');
    expect(sharedSource).toContain('min-h-11');
    expect(sharedSource).toContain('rounded-xl border border-slate-800 bg-slate-950');
    expect(sharedSource).toContain('bg-primary/30 text-brand-cyan');
    expect(sharedSource).toContain('focus-visible:ring-2 focus-visible:ring-brand-cyan/80');
    expect(source).toContain('onAspectRatioChange');
    expect(source).toContain('onToggleSafeZones');
    expect(source).toContain('onZoomLevelChange');
    expect(source).toContain('onExportMp4');
  });

  it('renders both studio toolbars through one shared contract', () => {
    const imageSource = readProjectFile(
      'marketing-studio/components/image-editor/ImageEditorToolbar.tsx',
    );
    const videoSource = readProjectFile(
      'marketing-studio/components/creative-editor/CreativeEditorToolbar.tsx',
    );
    const sharedSource = readProjectFile(
      'components/backoffice-shell/primitives/StudioToolbar.tsx',
    );

    expect(imageSource).toContain('<StudioToolbar');
    expect(videoSource).toContain('<StudioToolbar');
    expect(imageSource).not.toContain('role="toolbar"');
    expect(videoSource).not.toContain('role="toolbar"');
    expect(imageSource).not.toContain('data-visual-contract="image-studio-toolbar"');
    expect(videoSource).not.toContain('data-visual-contract="image-studio-toolbar"');
    for (const control of [
      'LiveStatus',
      'onToggleSafeZones',
      'onToggleInspector',
      'exportOptions',
      'focus-visible:ring-2 focus-visible:ring-brand-cyan/80',
    ]) {
      expect(sharedSource).toContain(control);
    }
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
    const sharedInspectorSource = readProjectFile(
      'components/creative-resources/inspector/StudioInspector.tsx',
    );

    for (const source of [imageSource, videoSource]) {
      expect(source).toContain('<StudioInspector');
      expect(source).toContain('onClose={onClose}');
    }
    expect(sharedInspectorSource).toContain('<StudioInspectorPanel');
    expect(sharedInspectorSource).toContain('data-creative-studio-region="inspector-content"');
    expect(sharedInspectorSource).toContain('as={as}');
    expect(sharedInspectorSource).toContain('width={width}');
    expect(sharedInspectorSource).toContain('variant={variant}');

    expect(primitiveSource).toContain("panelKind?: 'resource' | 'inspector'");
    expect(primitiveSource).toContain('data-visual-contract={`shared-studio-${panelKind}-panel`}');
    expect(primitiveSource).toContain('min-h-12 shrink-0 items-center justify-between gap-2 border-b px-4 py-2');
    expect(primitiveSource).toContain('min-h-0 flex-1 overflow-y-auto p-4 custom-scrollbar');
  });

  it('keeps the contextual inspector header, lock states and visible retry errors', () => {
    const source = readProjectFile('components/creative-resources/inspector/StudioInspector.tsx');
    const styles = readProjectFile('components/creative-resources/inspector/studioInspectorStyles.ts');

    expect(styles).toContain('studioInspectorIconButtonClass');
    expect(source).toContain('role="alert"');
    expect(source).toContain('No se pudo renderizar el vídeo');
    expect(source).toContain('onRetry');
    expect(source).toContain('layer.locked');
    expect(source).toContain('aria-label={layer.visible === false ?');
    expect(source).toContain('Transformación y posición');
    expect(styles).toContain('min-h-11 min-w-11');
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

  it('keeps stage tool and zoom controls owned by one shared contract', () => {
    const imageSource = readProjectFile(
      'marketing-studio/components/image-editor/ImageStageToolbar.tsx',
    );
    const videoSource = readProjectFile(
      'marketing-studio/components/creative-editor/VideoStage.tsx',
    );
    const sharedSource = readProjectFile(
      'components/backoffice-shell/primitives/StudioStageToolbarControls.tsx',
    );

    expect(imageSource).toContain('<StudioStageToolbarControls');
    expect(videoSource).toContain('<StudioStageToolbarControls');
    expect(sharedSource).toContain('aria-label="Herramienta selección"');
    expect(sharedSource).toContain('aria-label="Nivel de zoom del lienzo"');
    expect(sharedSource).toContain('aria-label="Ajustar al lienzo"');
    expect(imageSource).not.toContain('aria-label="Reducir zoom"');
    expect(videoSource).not.toContain('aria-label="Reducir zoom"');
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
    const registryCatalog = readProjectFile(
      'components/creative-resources/registry/creativeResourceCatalog.ts',
    );

    for (const label of ['Escenas', 'Audio', 'Storyboard']) {
      expect(source).toContain(label);
    }
    expect(registryCatalog).toContain("label: 'Kit de Marca'");
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
    expect(source).not.toContain('ResourceTabs');
    expect(readProjectFile('marketing-studio/SocialGenerator.tsx')).toContain('createCreativeResourceToolRail');
    expect(readProjectFile('components/backoffice-shell/primitives/StudioPrimitives.tsx')).toContain('data-creative-resource-section={item.section}');
  });
});
