import {makeScene2D, Img, Txt, Rect, Circle} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition, easeInOutCubic} from '@motion-canvas/core';

import scene3Image from '../../story/scene-03.png';

export default makeScene2D(function* (view) {
  // Scene 3: Luna meets Felix
  const background = createRef<Rect>();
  const image = createRef<Img>();
  const subtitle = createRef<Txt>();
  const mushroomGlow1 = createRef<Circle>();
  const mushroomGlow2 = createRef<Circle>();

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
        src={scene3Image}
        width={1920}
        height={1080}
        opacity={0}
        scale={1.1}
      />

      {/* Magical mushroom glow effects */}
      <Circle
        ref={mushroomGlow1}
        size={150}
        fill={'#00FF88'}
        opacity={0}
        y={200}
        x={-200}
        shadowBlur={40}
        shadowColor={'#00FF88'}
      />
      <Circle
        ref={mushroomGlow2}
        size={120}
        fill={'#00FFFF'}
        opacity={0}
        y={180}
        x={250}
        shadowBlur={35}
        shadowColor={'#00FFFF'}
      />

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text={'Felix the fox says come and see,\nthe magic mushroom jubilee!'}
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
    </>
  );

  // Fade in transition
  yield* fadeTransition(0.8);

  // Zoom in slightly
  yield* all(
    image().opacity(1, 1.2),
    image().scale(1.05, 7, easeInOutCubic)
  );

  // Magical mushroom glow pulsing
  yield* all(
    mushroomGlow1().opacity(0.3, 1.5).to(0.15, 1.5).to(0.3, 1.5),
    mushroomGlow2().opacity(0.25, 1.8).to(0.12, 1.8).to(0.25, 1.8)
  );

  // Show subtitle
  yield* subtitle().opacity(1, 0.8);

  // Keep subtitle visible
  yield* waitFor(3.5);

  // Fade out
  yield* all(
    subtitle().opacity(0, 0.8),
    image().opacity(0, 0.8),
    mushroomGlow1().opacity(0, 0.8),
    mushroomGlow2().opacity(0, 0.8)
  );

  yield* waitFor(0.3);
});

