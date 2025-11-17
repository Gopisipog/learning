import {makeScene2D, Img, Txt, Audio} from '@motion-canvas/2d';
import {createRef, all, waitFor, fadeTransition} from '@motion-canvas/core';

import scene4Image from '../../story/scene-04.png';
import voiceover4 from '../../story/voiceover-4.mp3';

export default makeScene2D(function* (view) {
  // Scene 4: Watching shooting stars
  const image = createRef<Img>();
  const subtitle = createRef<Txt>();

  view.fill('#1a1a2e');

  view.add(
    <>
      {/* Scene Image */}
      <Img
        ref={image}
        src={scene4Image}
        width={'100%'}
        height={'100%'}
        opacity={0}
        scale={1}
      />

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text={'Stars are falling from above, filling hearts with joy and love!'}
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
      <Audio src={voiceover4} play={true} time={0} />
    </>
  );

  // Fade in with transition
  yield* fadeTransition(0.5);
  
  // Slow zoom effect
  yield* all(
    image().opacity(1, 1),
    image().scale(1.05, 5)
  );

  // Show subtitle
  yield* subtitle().opacity(1, 0.8);

  // Keep subtitle visible
  yield* waitFor(3);

  // Fade out subtitle
  yield* subtitle().opacity(0, 0.5);

  yield* waitFor(0.3);
});

