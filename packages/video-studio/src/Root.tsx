import React from 'react';
import { Composition } from 'remotion';
import { ReelVisaRejection, defaultVisaRejectionProps } from './compositions/ReelVisaRejection';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="ReelVisaRejection"
        component={ReelVisaRejection as React.ComponentType<any>}
        durationInFrames={1800} // 60 seconds at 30 fps
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultVisaRejectionProps}
      />
    </>
  );
};
