import {makeScene2D, Img, Txt, Audio} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition} from '@motion-canvas/core';

import scene3Image from '../../story/scene-03.png';
import voiceover3 from '../../story/voiceover-3.mp3';

export default makeScene2D(function* (view) {
  // Scene 3: Luna meets Felix
  const image = createRef<Img>();
  const subtitle = createRef<Txt>();

  view.fill('#1a1a2e');

  view.add(
    <>
      {/* Scene Image */}
      <Img
        ref={image}
        src={scene3Image}
        width={'100%'}
        height={'100%'}
        opacity={0}
      />

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text={'Felix the fox says come and see, the magic mushroom jubilee!'}
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
      <Audio src={voiceover3} play={true} time={0} />
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

  yield* waitFor(0.3);
});

