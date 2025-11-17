import {makeScene2D, Img, Txt, Rect} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition, linear} from '@motion-canvas/core';

import scene1Image from '../../story/scene-01.png';

export default makeScene2D(function* (view) {
  // Scene 1: Luna wakes up
  const background = createRef<Rect>();
  const image = createRef<Img>();
  const titleMain = createRef<Txt>();
  const titleSub = createRef<Txt>();
  const subtitle = createRef<Txt>();

  view.fill('#0a0a1a');

  view.add(
    <>
      {/* Animated background */}
      <Rect
        ref={background}
        width={'100%'}
        height={'100%'}
        fill={'#0a0a1a'}
      />

      {/* Scene Image with Ken Burns effect */}
      <Img
        ref={image}
        src={scene1Image}
        width={1920}
        height={1080}
        opacity={0}
        scale={1.2}
      />

      {/* Main Title */}
      <Txt
        ref={titleMain}
        text={"Luna's Magical Night"}
        fontSize={100}
        fontWeight={800}
        fill={'#FFD700'}
        y={-50}
        opacity={0}
        shadowColor={'#000000'}
        shadowBlur={20}
        shadowOffsetY={5}
      />

      {/* Subtitle Title */}
      <Txt
        ref={titleSub}
        text={'A Bedtime Story Adventure'}
        fontSize={45}
        fontWeight={600}
        fill={'#87CEEB'}
        y={60}
        opacity={0}
        shadowColor={'#000000'}
        shadowBlur={10}
      />

      {/* Narration Subtitle */}
      <Txt
        ref={subtitle}
        text={'High in the tallest tree,\nLuna the owl wakes with glee!'}
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

  // Ken Burns effect - slow zoom in on image
  yield* all(
    image().opacity(1, 1.5),
    image().scale(1, 8, linear)
  );

  // Show main title with bounce effect
  yield* all(
    titleMain().opacity(1, 1),
    titleMain().scale(1.1, 0.5).to(1, 0.3)
  );

  yield* waitFor(0.5);

  // Show subtitle
  yield* titleSub().opacity(1, 0.8);

  yield* waitFor(1.5);

  // Fade out titles, show narration subtitle
  yield* all(
    titleMain().opacity(0, 0.6),
    titleSub().opacity(0, 0.6),
    subtitle().opacity(1, 0.8)
  );

  // Keep subtitle visible
  yield* waitFor(3);

  // Fade out
  yield* all(
    subtitle().opacity(0, 0.8),
    image().opacity(0, 0.8)
  );

  yield* waitFor(0.3);
});

