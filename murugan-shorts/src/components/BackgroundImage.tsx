import React from 'react';
import { AbsoluteFill } from 'remotion';

interface BackgroundImageProps {
  width: number;
  height: number;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  width,
  height,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #1a0033 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Murugan-themed gradient background with decorative elements */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 100, 0, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'rgba(255, 215, 0, 0.05)',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 100, 0, 0.05)',
          boxShadow: '0 0 40px rgba(255, 100, 0, 0.2)',
        }}
      />

      {/* Center focus area */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          borderRadius: '20px',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          boxShadow: 'inset 0 0 40px rgba(255, 215, 0, 0.1)',
        }}
      />
    </AbsoluteFill>
  );
};

