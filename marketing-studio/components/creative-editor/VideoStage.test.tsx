import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { defaultVisaRejectionProject } from '../../../packages/video-studio/src/domain/defaultProject';
import { ReelVisaRejection } from '../../../packages/video-studio/src/compositions/ReelVisaRejection';
import { vitablueBrandAdapter } from '../../../packages/video-studio/src/adapters/vitablue';
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
});
