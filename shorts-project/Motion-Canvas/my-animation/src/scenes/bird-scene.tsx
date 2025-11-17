import {Circle, Rect, Txt, makeScene2D, Line} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeInOutCubic, loop} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Scene 3: Benny meets Bella the Bird
  const background = createRef<Rect>();
  const ground = createRef<Rect>();
  
  // Bird parts
  const birdBody = createRef<Circle>();
  const birdHead = createRef<Circle>();
  const birdBeak = createRef<Rect>();
  const birdEye = createRef<Circle>();
  const wing = createRef<Circle>();
  
  // Tree
  const treeTrunk = createRef<Rect>();
  const treeLeaves = createRef<Circle>();
  
  const sceneText = createRef<Txt>();

  view.add(
    <>
      {/* Sky background */}
      <Rect
        ref={background}
        width={'100%'}
        height={'100%'}
        fill={'#87CEEB'}
      />
      
      {/* Ground */}
      <Rect
        ref={ground}
        width={'100%'}
        height={300}
        fill={'#90EE90'}
        y={250}
      />
      
      {/* Tree Trunk */}
      <Rect
        ref={treeTrunk}
        width={80}
        height={250}
        fill={'#8B4513'}
        x={400}
        y={100}
      />
      
      {/* Tree Leaves */}
      <Circle
        ref={treeLeaves}
        size={200}
        fill={'#228B22'}
        x={400}
        y={-50}
      />
      
      {/* Bird Body */}
      <Circle
        ref={birdBody}
        size={80}
        fill={'#FF6347'}
        x={400}
        y={-100}
        opacity={0}
      />
      
      {/* Bird Head */}
      <Circle
        ref={birdHead}
        size={50}
        fill={'#FF6347'}
        x={420}
        y={-130}
        opacity={0}
      />
      
      {/* Bird Beak */}
      <Rect
        ref={birdBeak}
        width={30}
        height={15}
        fill={'#FFA500'}
        x={445}
        y={-130}
        opacity={0}
      />
      
      {/* Bird Eye */}
      <Circle
        ref={birdEye}
        size={12}
        fill={'#000000'}
        x={425}
        y={-135}
        opacity={0}
      />
      
      {/* Wing */}
      <Circle
        ref={wing}
        size={40}
        fill={'#FF4500'}
        x={380}
        y={-110}
        opacity={0}
      />
      
      {/* Text */}
      <Txt
        ref={sceneText}
        text={'Bella the Bird joins the adventure!'}
        fontSize={55}
        fontWeight={600}
        fill={'#FF4500'}
        y={-280}
        opacity={0}
      />
    </>
  );

  yield* waitFor(0.5);

  // Bird flies in
  yield* all(
    birdBody().opacity(1, 0.5),
    birdHead().opacity(1, 0.5),
    birdBeak().opacity(1, 0.5),
    birdEye().opacity(1, 0.5),
    wing().opacity(1, 0.5)
  );

  // Wing flapping animation
  yield* wing().scale(1.3, 0.2).to(1, 0.2);
  yield* wing().scale(1.3, 0.2).to(1, 0.2);
  yield* wing().scale(1.3, 0.2).to(1, 0.2);

  // Show text
  yield* sceneText().opacity(1, 1);
  
  yield* waitFor(2);

  // Fade out
  yield* all(
    sceneText().opacity(0, 0.5),
    view.opacity(0, 1)
  );
});

