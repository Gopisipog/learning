import {Circle, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Scene 1: Title Screen
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();

  view.add(
    <Rect width={'100%'} height={'100%'} fill={'#87CEEB'} />
  );

  view.add(
    <Txt
      ref={title}
      text={"Benny the Bunny's Adventure"}
      fontSize={80}
      fontWeight={700}
      fill={'#FF69B4'}
      y={-100}
      opacity={0}
    />
  );

  view.add(
    <Txt
      ref={subtitle}
      text={'A Magical Forest Story'}
      fontSize={50}
      fill={'#FFD700'}
      y={50}
      opacity={0}
    />
  );

  // Animate title
  yield* all(
    title().opacity(1, 1),
    title().scale(1.2, 1).to(1, 0.5)
  );

  yield* subtitle().opacity(1, 1);
  yield* waitFor(2);

  // Fade out title
  yield* all(
    title().opacity(0, 0.5),
    subtitle().opacity(0, 0.5)
  );

  yield* waitFor(0.5);
});
