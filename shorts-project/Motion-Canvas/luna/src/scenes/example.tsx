import {Circle, makeScene2D, Txt} from '@motion-canvas/2d';
import {createRef, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Simple test animation
  view.fill('#1a1a2e');

  const circle = createRef<Circle>();
  const text = createRef<Txt>();

  view.add(
    <>
      <Circle ref={circle} size={320} fill={'lightseagreen'} />
      <Txt
        ref={text}
        text={'Motion Canvas is Working! ✅'}
        fontSize={60}
        fill={'white'}
        y={-300}
      />
    </>
  );

  yield* circle().scale(2, 2).to(1, 2);
  yield* waitFor(1);
});
