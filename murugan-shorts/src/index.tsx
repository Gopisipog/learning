import React from 'react';
import { Composition } from 'remotion';
import { MuruganShorts } from './MuruganShorts';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MuruganShorts"
        component={MuruganShorts}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};

