import React from 'react';
import { useVideoConfig, AbsoluteFill, Sequence } from 'remotion';
import { AnimatedSlogan } from './components/AnimatedSlogan';
import { BackgroundImage } from './components/BackgroundImage';

const slogans = [
  'வேலன் வாழ்க',
  'முருகன் வாழ்க',
  'சக்தி வாழ்க',
  'தமிழ் வாழ்க',
  'ஆறு முகம் ஆறு சக்தி',
];

export const MuruganShorts: React.FC = () => {
  const { width, height, durationInFrames, fps } = useVideoConfig();
  const framesPerSlogan = Math.floor(durationInFrames / slogans.length);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background Image */}
      <BackgroundImage width={width} height={height} />

      {/* Animated Slogans */}
      {slogans.map((slogan, index) => (
        <Sequence
          key={index}
          from={index * framesPerSlogan}
          durationInFrames={framesPerSlogan}
        >
          <AnimatedSlogan
            text={slogan}
            index={index}
            totalSlogans={slogans.length}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

