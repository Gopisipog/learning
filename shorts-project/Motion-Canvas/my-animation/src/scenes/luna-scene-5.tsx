import {makeScene2D, Img, Txt, Audio} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition} from '@motion-canvas/core';

import scene5Image from '../../story/scene-05.png';
import voiceover5 from '../../story/voiceover-5.mp3';

export default makeScene2D(function* (view) {
  // Scene 5: Luna goes home
  const image = createRef<Img>();
  const subtitle = createRef<Txt>();
  const endText = createRef<Txt>();

  view.fill('#1a1a2e');

  view.add(
    <>
      {/* Scene Image */}
      <Img
        ref={image}
        src={scene5Image}
        width={'100%'}
        height={'100%'}
        opacity={0}
      />

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text={'Home again as dawn draws near, Luna dreams without a fear!'}
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

      {/* The End Text */}
      <Txt
        ref={endText}
        text={'The End ✨'}
        fontSize={90}
        fontWeight={700}
        fill={'#FFD700'}
        y={0}
        opacity={0}
        shadowColor={'#000000'}
        shadowBlur={10}
      />

      {/* Audio */}
      <Audio src={voiceover5} play={true} time={0} />
    </>
  );

  // Fade in with transition
  yield* fadeTransition(0.5);
  yield* image().opacity(1, 1);

  // Show subtitle
  yield* subtitle().opacity(1, 0.8);

  // Keep subtitle visible
  yield* waitFor(3.5);

  // Fade out subtitle
  yield* subtitle().opacity(0, 0.5);

  yield* waitFor(0.5);

  // Show "The End"
  yield* endText().opacity(1, 1.5);
  yield* endText().scale(1.2, 0.5).to(1, 0.5);

  yield* waitFor(2);

  // Fade out everything
  yield* all(
    endText().opacity(0, 1),
    image().opacity(0, 1)
  );

  yield* waitFor(0.5);
});

