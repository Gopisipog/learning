import {makeScene2D, Img, Txt, Rect, Circle} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition, easeInOutCubic, loop} from '@motion-canvas/core';

import scene2Image from '../../story/scene-02.png';

export default makeScene2D(function* (view) {
  // Scene 2: Luna flies through forest
  const background = createRef<Rect>();
  const image = createRef<Img>();
  const subtitle = createRef<Txt>();
  const glow1 = createRef<Circle>();
  const glow2 = createRef<Circle>();
  const glow3 = createRef<Circle>();

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
        src={scene2Image}
        width={1920}
        height={1080}
        opacity={0}
        scale={1.15}
        x={-50}
      />

      {/* Firefly glow effects */}
      <Circle
        ref={glow1}
        size={30}
        fill={'#FFD700'}
        opacity={0}
        x={-300}
        y={-200}
        shadowBlur={15}
        shadowColor={'#FFD700'}
      />
      <Circle
        ref={glow2}
        size={25}
        fill={'#FFD700'}
        opacity={0}
        x={400}
        y={100}
        shadowBlur={12}
        shadowColor={'#FFD700'}
      />
      <Circle
        ref={glow3}
        size={20}
        fill={'#FFD700'}
        opacity={0}
        x={-100}
        y={250}
        shadowBlur={10}
        shadowColor={'#FFD700'}
      />

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text={'Through the forest she takes flight,\nguided by the fireflies\' light!'}
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

  // Pan and zoom effect
  yield* all(
    image().opacity(1, 1.2),
    image().scale(1, 7, easeInOutCubic),
    image().x(50, 7, easeInOutCubic)
  );

  // Animate firefly glows
  yield* all(
    glow1().opacity(0.6, 1).to(0.3, 1).to(0.6, 1),
    glow2().opacity(0.5, 1.2).to(0.2, 1.2).to(0.5, 1.2),
    glow3().opacity(0.7, 0.8).to(0.4, 0.8).to(0.7, 0.8)
  );

  // Show subtitle
  yield* subtitle().opacity(1, 0.8);

  // Keep subtitle visible with pulsing fireflies
  yield* waitFor(3);

  // Fade out
  yield* all(
    subtitle().opacity(0, 0.8),
    image().opacity(0, 0.8),
    glow1().opacity(0, 0.8),
    glow2().opacity(0, 0.8),
    glow3().opacity(0, 0.8)
  );

  yield* waitFor(0.3);
});

