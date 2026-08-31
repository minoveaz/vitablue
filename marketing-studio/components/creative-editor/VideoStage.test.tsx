import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { defaultVisaRejectionProject } from '../../../packages/video-studio/src/domain/defaultProject';
import { ReelVisaRejection } from '../../../packages/video-studio/src/compositions/ReelVisaRejection';
import { vitablueBrandAdapter } from '../../../packages/video-studio/src/adapters/vitablue';
import { videoProjectToCreativeDocument } from '../../../packages/creative-document/src/adapters/videoProjectAdapter';
import { VideoStage } from './VideoStage';

const playerMock = vi.hoisted(() =>
  vi.fn(({ inputProps }: { inputProps: { slides: unknown[] } }) => (
    <div data-remotion-player="mounted" data-slide-count={inputProps.slides.length} />
  )),
);

vi.mock('@remotion/player', () => ({
  Player: playerMock,
}));

describe('VideoStage renderer regression', () => {
  it('mounts Remotion with the current storyboard instead of an empty stage', () => {
    const slides = defaultVisaRejectionProject.scenes;

    const markup = renderToStaticMarkup(
      <VideoStage
        slides={slides}
        playerRef={React.createRef()}
        aspectRatio="vertical"
      />,
    );

    expect(playerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        component: ReelVisaRejection,
        compositionWidth: 1080,
        compositionHeight: 1920,
        inputProps: {
          slides,
          brandAdapter: vitablueBrandAdapter,
          aspectRatio: 'vertical',
        },
      }),
      undefined,
    );
    expect(markup).toContain('data-remotion-player="mounted"');
    expect(markup).toContain('data-slide-count="4"');
  });

  it('uses canonical CreativeDocument scenes at the renderer boundary', () => {
    const slides = defaultVisaRejectionProject.scenes;
    const document = videoProjectToCreativeDocument(defaultVisaRejectionProject);

    renderToStaticMarkup(
      <VideoStage
        slides={[]}
        creativeDocument={document}
        playerRef={React.createRef()}
        aspectRatio="vertical"
      />,
    );

    expect(playerMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        inputProps: expect.objectContaining({
          slides: expect.arrayContaining([
            expect.objectContaining({ id: slides[0].id }),
          ]),
        }),
      }),
      undefined,
    );
  });

  it('restores runtime media URLs when canonical assets only store logical references', () => {
    const runtimeSource = 'https://cdn.example.test/clip.mp4';
    const project = {
      ...defaultVisaRejectionProject,
      scenes: [{
        ...defaultVisaRejectionProject.scenes[0],
        layers: [{
          id: 'clip',
          type: 'video' as const,
          asset: { assetId: 'clip-asset', src: runtimeSource },
          timing: { startFrame: 0, durationInFrames: 150 },
        }],
      }],
    };
    const document = videoProjectToCreativeDocument(project);

    renderToStaticMarkup(
      <VideoStage
        slides={project.scenes}
        creativeDocument={document}
        playerRef={React.createRef()}
        aspectRatio="vertical"
      />,
    );

    expect(playerMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        inputProps: expect.objectContaining({
          slides: [expect.objectContaining({
            layers: [expect.objectContaining({ asset: expect.objectContaining({ src: runtimeSource }) })],
          })],
        }),
      }),
      undefined,
    );
  });
});
