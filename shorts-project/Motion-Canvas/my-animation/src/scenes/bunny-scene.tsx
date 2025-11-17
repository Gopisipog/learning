import {Circle, Rect, Txt, makeScene2D, Polygon} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeInOutCubic} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Scene 2: Benny the Bunny appears
  const background = createRef<Rect>();
  const ground = createRef<Rect>();
  const sun = createRef<Circle>();
  
  // Bunny parts
  const bunnyBody = createRef<Circle>();
  const bunnyHead = createRef<Circle>();
  const leftEar = createRef<Rect>();
  const rightEar = createRef<Rect>();
  const leftEye = createRef<Circle>();
  const rightEye = createRef<Circle>();
  const nose = createRef<Circle>();
  const bunnyText = createRef<Txt>();

  view.add(
    <>
      {/* Sky background */}
      <Rect
        ref={background}
        width={'100%'}
        height={'100%'}
        fill={'#87CEEB'}
      />
      
      {/* Sun */}
      <Circle
        ref={sun}
        size={120}
        fill={'#FFD700'}
        x={-600}
        y={-300}
        opacity={0}
      />
      
      {/* Ground */}
      <Rect
        ref={ground}
        width={'100%'}
        height={300}
        fill={'#90EE90'}
        y={250}
      />
      
      {/* Bunny Body */}
      <Circle
        ref={bunnyBody}
        size={200}
        fill={'#FFFFFF'}
        x={-800}
        y={100}
      />
      
      {/* Bunny Head */}
      <Circle
        ref={bunnyHead}
        size={150}
        fill={'#FFFFFF'}
        x={-800}
        y={-20}
      />
      
      {/* Left Ear */}
      <Rect
        ref={leftEar}
        width={40}
        height={120}
        fill={'#FFFFFF'}
        stroke={'#FFB6C1'}
        lineWidth={8}
        radius={20}
        x={-840}
        y={-100}
        rotation={-20}
      />
      
      {/* Right Ear */}
      <Rect
        ref={rightEar}
        width={40}
        height={120}
        fill={'#FFFFFF'}
        stroke={'#FFB6C1'}
        lineWidth={8}
        radius={20}
        x={-760}
        y={-100}
        rotation={20}
      />
      
      {/* Left Eye */}
      <Circle
        ref={leftEye}
        size={20}
        fill={'#000000'}
        x={-820}
        y={-30}
      />
      
      {/* Right Eye */}
      <Circle
        ref={rightEye}
        size={20}
        fill={'#000000'}
        x={-780}
        y={-30}
      />
      
      {/* Nose */}
      <Circle
        ref={nose}
        size={15}
        fill={'#FFB6C1'}
        x={-800}
        y={0}
      />
      
      {/* Text */}
      <Txt
        ref={bunnyText}
        text={'Meet Benny the Bunny!'}
        fontSize={60}
        fontWeight={600}
        fill={'#FF1493'}
        y={-250}
        opacity={0}
      />
    </>
  );

  // Animate sun rising
  yield* sun().opacity(1, 1);

  // Bunny hops into scene
  yield* all(
    bunnyBody().x(0, 2, easeInOutCubic),
    bunnyHead().x(0, 2, easeInOutCubic),
    leftEar().x(-40, 2, easeInOutCubic),
    rightEar().x(40, 2, easeInOutCubic),
    leftEye().x(-20, 2, easeInOutCubic),
    rightEye().x(20, 2, easeInOutCubic),
    nose().x(0, 2, easeInOutCubic)
  );

  // Show text
  yield* bunnyText().opacity(1, 1);
  
  // Bunny ear wiggle
  yield* all(
    leftEar().rotation(-30, 0.3).to(-20, 0.3),
    rightEar().rotation(30, 0.3).to(20, 0.3)
  );
  
  yield* waitFor(2);

  // Fade out
  yield* all(
    bunnyText().opacity(0, 0.5),
    view.opacity(0, 1)
  );
});

