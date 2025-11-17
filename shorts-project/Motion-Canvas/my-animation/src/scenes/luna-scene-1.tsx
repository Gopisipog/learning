import {makeScene2D, Img, Txt, Audio} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition} from '@motion-canvas/core';

import scene1Image from '../../story/scene-01.png';
import voiceover1 from '../../story/voiceover-1.mp3';

export default makeScene2D(function* (view) {
  // Scene 1: Luna wakes up
  const image = createRef<Img>();
  const subtitle = createRef<Txt>();
  const title = createRef<Txt>();

  view.fill('#1a1a2e');

  view.add(
    <>
      {/* Scene Image */}
      <Img
        ref={image}
        src={scene1Image}
        width={'100%'}
        height={'100%'}
        opacity={0}
      />

      {/* Title */}
      <Txt
        ref={title}
        text={"Luna's Magical Night"}
        fontSize={80}
        fontWeight={700}
        fill={'#FFD700'}
        y={-300}
        opacity={0}
        shadowColor={'#000000'}
        shadowBlur={10}
      />

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text={'High in the tallest tree, Luna the owl wakes with glee!'}
        fontSize={50}
        fontWeight={600}
        fill={'#FFFFFF'}
        y={300}
        opacity={0}
        shadowColor={'#000000'}
        shadowBlur={8}
        textAlign={'center'}
        maxWidth={1600}
      />

      {/* Audio */}
      <Audio src={voiceover1} play={true} time={0} />
    </>
  );

  // Fade in image
  yield* fadeTransition(0.5);
  yield* image().opacity(1, 1);

  // Show title
  yield* title().opacity(1, 0.8);
  yield* waitFor(1.5);

  // Fade out title, show subtitle
  yield* all(
    title().opacity(0, 0.5),
    subtitle().opacity(1, 0.8)
  );

  // Keep subtitle visible
  yield* waitFor(2.5);

  // Fade out subtitle
  yield* subtitle().opacity(0, 0.5);

  yield* waitFor(0.3);
});

