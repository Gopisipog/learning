import {makeScene2D, Img, Txt, Rect, Circle} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition, easeInOutCubic} from '@motion-canvas/core';

import scene5Image from '../../story/scene-05.png';

export default makeScene2D(function* (view) {
  // Scene 5: Luna goes home
  const background = createRef<Rect>();
  const image = createRef<Img>();
  const subtitle = createRef<Txt>();
  const endText = createRef<Txt>();
  const moonGlow = createRef<Circle>();

  view.fill('#0a0a1a');

  view.add(
    <>
      {/* Background */}
      <Rect
        ref={background}
        width={'100%'}
        height={'100%'}
        fill={'#0a0a1a'}
      />

      {/* Scene Image */}
      <Img
        ref={image}
        src={scene5Image}
        width={1920}
        height={1080}
        opacity={0}
        scale={1.05}
      />

      {/* Soft moonlight glow */}
      <Circle
        ref={moonGlow}
        size={300}
        fill={'#F0E68C'}
        opacity={0}
        x={-500}
        y={-300}
        shadowBlur={60}
        shadowColor={'#F0E68C'}
      />

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text={'Home again as dawn draws near,\nLuna dreams without a fear!'}
        fontSize={55}
        fontWeight={700}
        fill={'#FFFFFF'}
        y={350}
        opacity={0}
        shadowColor={'#000000'}
        shadowBlur={12}
        textAlign={'center'}
        lineHeight={80}
      />

      {/* The End Text */}
      <Txt
        ref={endText}
        text={'The End ✨🌙'}
        fontSize={110}
        fontWeight={800}
        fill={'#FFD700'}
        y={0}
        opacity={0}
        shadowColor={'#000000'}
        shadowBlur={20}
        shadowOffsetY={8}
      />
    </>
  );

  // Fade in transition
  yield* fadeTransition(0.8);

  // Gentle zoom
  yield* all(
    image().opacity(1, 1.2),
    image().scale(1, 7, easeInOutCubic),
    moonGlow().opacity(0.15, 2).to(0.1, 2).to(0.15, 2)
  );

  // Show subtitle
  yield* subtitle().opacity(1, 0.8);

  // Keep subtitle visible
  yield* waitFor(3.5);

  // Fade out subtitle
  yield* subtitle().opacity(0, 0.8);

  yield* waitFor(0.5);

  // Show "The End" with sparkle effect
  yield* all(
    endText().opacity(1, 1.5),
    endText().scale(1.15, 0.6).to(1, 0.4)
  );

  // Pulse effect on "The End"
  yield* endText().scale(1.05, 1).to(1, 1);

  yield* waitFor(2.5);

  // Final fade out
  yield* all(
    endText().opacity(0, 1.5),
    image().opacity(0, 1.5),
    moonGlow().opacity(0, 1.5),
    background().fill('#000000', 1.5)
  );

  yield* waitFor(0.5);
});

