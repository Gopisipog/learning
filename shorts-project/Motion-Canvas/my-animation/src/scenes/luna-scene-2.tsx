import {makeScene2D, Img, Txt, Audio} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition} from '@motion-canvas/core';

import scene2Image from '../../story/scene-02.png';
import voiceover2 from '../../story/voiceover-2.mp3';

export default makeScene2D(function* (view) {
  // Scene 2: Luna flies through forest
  const image = createRef<Img>();
  const subtitle = createRef<Txt>();

  view.fill('#1a1a2e');

  view.add(
    <>
      {/* Scene Image */}
      <Img
        ref={image}
        src={scene2Image}
        width={'100%'}
        height={'100%'}
        opacity={0}
        scale={1}
      />

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text={'Through the forest she takes flight, guided by the fireflies\' light!'}
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
      <Audio src={voiceover2} play={true} time={0} />
    </>
  );

  // Fade in with transition
  yield* fadeTransition(0.5);
  
  // Zoom in effect on image
  yield* all(
    image().opacity(1, 1),
    image().scale(1.1, 5)
  );

  // Show subtitle
  yield* subtitle().opacity(1, 0.8);

  // Keep subtitle visible
  yield* waitFor(3);

  // Fade out subtitle
  yield* subtitle().opacity(0, 0.5);

  yield* waitFor(0.3);
});

