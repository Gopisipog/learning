import {makeScene2D, Img, Txt, Rect, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition, easeInOutCubic, Vector2} from '@motion-canvas/core';

import scene4Image from '../../story/scene-04.png';

export default makeScene2D(function* (view) {
  // Scene 4: Watching shooting stars
  const background = createRef<Rect>();
  const image = createRef<Img>();
  const subtitle = createRef<Txt>();
  const star1 = createRef<Line>();
  const star2 = createRef<Line>();
  const star3 = createRef<Line>();

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
        src={scene4Image}
        width={1920}
        height={1080}
        opacity={0}
        scale={1}
      />

      {/* Shooting star trails */}
      <Line
        ref={star1}
        stroke={'#FFFFFF'}
        lineWidth={3}
        opacity={0}
        points={[
          new Vector2(-800, -400),
          new Vector2(-600, -200),
        ]}
        lineCap={'round'}
        shadowBlur={2}
        shadowColor={'#FFFFFF'}
      />
      <Line
        ref={star2}
        stroke={'#FFD700'}
        lineWidth={2.5}
        opacity={0}
        points={[
          new Vector2(600, -350),
          new Vector2(800, -150),
        ]}
        lineCap={'round'}
        shadowBlur={2}
        shadowColor={'#FFD700'}
      />
      <Line
        ref={star3}
        stroke={'#87CEEB'}
        lineWidth={2}
        opacity={0}
        points={[
          new Vector2(-200, -450),
          new Vector2(100, -250),
        ]}
        lineCap={'round'}
        shadowBlur={2}
        shadowColor={'#87CEEB'}
      />

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text={'Stars are falling from above,\nfilling hearts with joy and love!'}
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

  // Slow zoom
  yield* all(
    image().opacity(1, 1.2),
    image().scale(1.08, 7, easeInOutCubic)
  );

  // Shooting stars animation
  yield* all(
    star1().opacity(0.8, 0.3).to(0, 0.5),
    star1().position(new Vector2(200, 200), 0.8, easeInOutCubic)
  );

  yield* all(
    star2().opacity(0.7, 0.3).to(0, 0.5),
    star2().position(new Vector2(-200, 200), 0.8, easeInOutCubic)
  );

  yield* all(
    star3().opacity(0.6, 0.3).to(0, 0.5),
    star3().position(new Vector2(0, 250), 0.8, easeInOutCubic)
  );

  // Show subtitle
  yield* subtitle().opacity(1, 0.8);

  // Keep subtitle visible
  yield* waitFor(3);

  // Fade out
  yield* all(
    subtitle().opacity(0, 0.8),
    image().opacity(0, 0.8)
  );

  yield* waitFor(0.3);
});

