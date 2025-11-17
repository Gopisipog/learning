import React from 'react';
import { useVideoConfig, useCurrentFrame, interpolate, Easing, AbsoluteFill } from 'remotion';

interface AnimatedSloganProps {
  text: string;
  index: number;
  totalSlogans: number;
}

export const AnimatedSlogan: React.FC<AnimatedSloganProps> = ({
  text,
  index,
  totalSlogans,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // Animation timings
  const enterDuration = fps * 0.5; // 0.5 seconds
  const displayDuration = fps * 2; // 2 seconds
  const exitDuration = fps * 0.5; // 0.5 seconds

  // Calculate opacity
  const opacity = interpolate(
    frame,
    [0, enterDuration, displayDuration, displayDuration + exitDuration],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Calculate scale
  const scale = interpolate(
    frame,
    [0, enterDuration, displayDuration, displayDuration + exitDuration],
    [0.5, 1, 1, 0.5],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  // Calculate rotation
  const rotation = interpolate(
    frame,
    [0, enterDuration],
    [-10, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  // Calculate Y position (slide up effect)
  const translateY = interpolate(
    frame,
    [0, enterDuration, displayDuration, displayDuration + exitDuration],
    [100, 0, 0, -100],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 'bold',
          color: '#FFD700',
          textAlign: 'center',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 100, 0, 0.6)',
          transform: `scale(${scale}) rotate(${rotation}deg) translateY(${translateY}px)`,
          fontFamily: 'Arial, sans-serif',
          letterSpacing: 2,
          padding: '20px',
          maxWidth: '90%',
          animation: `pulse 2s ease-in-out infinite`,
        }}
      >
        {text}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1));
          }
        }
      `}</style>
    </AbsoluteFill>
  );
};

