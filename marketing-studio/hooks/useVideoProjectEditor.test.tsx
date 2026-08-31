import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { Keyframe } from '../../packages/creative-document/src/types';
import { defaultVisaRejectionProject } from '../../packages/video-studio/src/domain/defaultProject';
import { useVideoProjectEditor } from './useVideoProjectEditor';

type Editor = ReturnType<typeof useVideoProjectEditor>;

/**
 * A DOM-free harness keeps these checks focused on the hook boundary. The
 * returned canonical documents make command results directly inspectable
 * without coupling the tests to a browser renderer.
 */
const mountEditor = (canonicalRuntime?: boolean): Editor => {
  let editor: Editor | undefined;
  const Harness: React.FC = () => {
    editor = useVideoProjectEditor(defaultVisaRejectionProject, {
      canonicalRuntime,
    });
    return <output data-scenes={editor.scenes.length} />;
  };

  renderToStaticMarkup(<Harness />);
  if (!editor) throw new Error('The video editor harness did not mount.');
  return editor;
};

describe('useVideoProjectEditor canonical runtime harness', () => {
  it('exposes scenes and layers from the canonical document by default', () => {
    const editor = mountEditor();

    expect(editor.canonicalRuntime).toBe(true);
    expect(editor.canonicalDocument?.mode).toBe('video');
    expect(editor.canonicalDocument?.scenes.map((scene) => scene.id)).toEqual(
      defaultVisaRejectionProject.scenes.map((scene) => scene.id),
    );
    expect(editor.canonicalDocument?.scenes[0]?.layers[0]?.id).toBe('slide_1-hook');
  });

  it('routes layer commands and scene timing through canonical state', () => {
    const editor = mountEditor(true);
    const sceneId = defaultVisaRejectionProject.scenes[0].id;
    const layerId = defaultVisaRejectionProject.scenes[0].layers[0].id;

    const renamed = editor.updateCreativeLayer(sceneId, layerId, { name: 'Hook editado' });
    expect(renamed.scenes[0].layers[0].name).toBe('Hook editado');

    const timed = editor.updateSceneTiming(sceneId, { startMs: 0, durationMs: 5000 });
    expect(timed?.scenes[0]?.timing?.durationMs).toBe(5000);

    const layerTimed = editor.updateLayerTiming(sceneId, layerId, { startFrame: 15, durationInFrames: 90 });
    expect(layerTimed?.scenes[0]?.layers[0]?.timing).toEqual({ startMs: 500, durationMs: 3000 });

    const transitioned = editor.updateSceneTransition(sceneId, { type: 'fade', durationMs: 250 });
    expect(transitioned?.scenes[0]?.extensions?.temporal?.transition).toEqual({
      type: 'fade',
      durationMs: 250,
    });
  });

  it('keeps keyframes in temporal extensions and exposes the legacy rollback path', () => {
    const keyframes: Keyframe[] = [
      { timeMs: 0, value: 0 },
      { timeMs: 500, value: 1, easing: 'ease-out' },
    ];
    const editor = mountEditor(true);
    const sceneId = defaultVisaRejectionProject.scenes[0].id;
    const layerId = defaultVisaRejectionProject.scenes[0].layers[0].id;

    const updated = editor.updateLayerKeyframes(sceneId, layerId, 'opacity', keyframes);
    expect(updated?.scenes[0]?.layers[0]?.extensions?.temporal?.keyframes?.opacity).toEqual(keyframes);

    const legacyEditor = mountEditor(false);
    expect(legacyEditor.canonicalRuntime).toBe(false);
    expect(legacyEditor.scenes).toHaveLength(defaultVisaRejectionProject.scenes.length);
  });
});
