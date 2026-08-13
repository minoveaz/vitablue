import React from 'react';
import { Composition } from 'remotion';
import { ReelVisaRejection, defaultVisaRejectionProps } from './compositions/ReelVisaRejection';
import { vitablueBrandAdapter } from './adapters/vitablue';
import { defaultVisaRejectionProject } from './domain/defaultProject';
import { createRenderPlan } from './engine/renderService';

const defaultRenderPlan = createRenderPlan(defaultVisaRejectionProject);

const RemotionReelVisaRejection: React.FC<typeof defaultVisaRejectionProps> = (props) => (
  <ReelVisaRejection {...props} brandAdapter={vitablueBrandAdapter} />
);

const renderCompositions = [
  { id: 'ReelVisaRejection', width: 1080, height: 1920 },
  { id: 'ReelVisaRejectionSquare', width: 1080, height: 1080 },
  { id: 'ReelVisaRejectionLandscape', width: 1920, height: 1080 },
] as const;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="ReelVisaRejection"
        component={RemotionReelVisaRejection}
        durationInFrames={defaultRenderPlan.durationInFrames}
        fps={defaultRenderPlan.fps}
        width={defaultRenderPlan.width}
        height={defaultRenderPlan.height}
        defaultProps={{
          ...defaultVisaRejectionProps,
        }}
      />
      {renderCompositions.slice(1).map(({ id, width, height }) => (
        <Composition
          key={id}
          id={id}
          component={RemotionReelVisaRejection}
          durationInFrames={defaultRenderPlan.durationInFrames}
          fps={defaultRenderPlan.fps}
          width={width}
          height={height}
          defaultProps={{ ...defaultVisaRejectionProps }}
        />
      ))}
    </>
  );
};
