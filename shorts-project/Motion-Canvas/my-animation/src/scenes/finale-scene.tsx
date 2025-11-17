import {Circle, Rect, Txt, makeScene2D, Polygon} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeInOutCubic} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Scene 4: Happy Ending - Friends Together
  const background = createRef<Rect>();
  const ground = createRef<Rect>();
  const sun = createRef<Circle>();
  
  // Rainbow
  const rainbow1 = createRef<Rect>();
  const rainbow2 = createRef<Rect>();
  const rainbow3 = createRef<Rect>();
  
  // Bunny (simplified)
  const bunny = createRef<Circle>();
  const bunnyEar1 = createRef<Rect>();
  const bunnyEar2 = createRef<Rect>();
  
  // Bird (simplified)
  const bird = createRef<Circle>();
  
  // Butterfly
  const butterfly = createRef<Circle>();
  
  const finaleText = createRef<Txt>();
  const endText = createRef<Txt>();

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
        size={150}
        fill={'#FFD700'}
        x={-600}
        y={-300}
      />
      
      {/* Rainbow arcs */}
      <Rect
        ref={rainbow1}
        width={800}
        height={400}
        stroke={'#FF0000'}
        lineWidth={20}
        radius={400}
        y={-200}
        opacity={0}
      />
      <Rect
        ref={rainbow2}
        width={750}
        height={375}
        stroke={'#FFA500'}
        lineWidth={20}
        radius={375}
        y={-200}
        opacity={0}
      />
      <Rect
        ref={rainbow3}
        width={700}
        height={350}
        stroke={'#FFFF00'}
        lineWidth={20}
        radius={350}
        y={-200}
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
      
      {/* Bunny */}
      <Circle
        ref={bunny}
        size={120}
        fill={'#FFFFFF'}
        x={-200}
        y={100}
        opacity={0}
      />
      <Rect
        ref={bunnyEar1}
        width={25}
        height={80}
        fill={'#FFFFFF'}
        stroke={'#FFB6C1'}
        lineWidth={5}
        radius={15}
        x={-220}
        y={40}
        rotation={-20}
        opacity={0}
      />
      <Rect
        ref={bunnyEar2}
        width={25}
        height={80}
        fill={'#FFFFFF'}
        stroke={'#FFB6C1'}
        lineWidth={5}
        radius={15}
        x={-180}
        y={40}
        rotation={20}
        opacity={0}
      />
      
      {/* Bird */}
      <Circle
        ref={bird}
        size={70}
        fill={'#FF6347'}
        x={0}
        y={80}
        opacity={0}
      />
      
      {/* Butterfly */}
      <Circle
        ref={butterfly}
        size={50}
        fill={'#FF69B4'}
        x={200}
        y={50}
        opacity={0}
      />
      
      {/* Text */}
      <Txt
        ref={finaleText}
        text={'Together, they found the magic rainbow!'}
        fontSize={55}
        fontWeight={600}
        fill={'#FF1493'}
        y={-280}
        opacity={0}
      />
      
      <Txt
        ref={endText}
        text={'The End ❤️'}
        fontSize={70}
        fontWeight={700}
        fill={'#FF69B4'}
        y={0}
        opacity={0}
      />
    </>
  );

  // Rainbow appears
  yield* all(
    rainbow1().opacity(0.7, 1.5),
    rainbow2().opacity(0.7, 1.5),
    rainbow3().opacity(0.7, 1.5)
  );

  // Show text
  yield* finaleText().opacity(1, 1);
  
  yield* waitFor(1);

  // Friends appear
  yield* all(
    bunny().opacity(1, 0.8),
    bunnyEar1().opacity(1, 0.8),
    bunnyEar2().opacity(1, 0.8),
    bird().opacity(1, 0.8),
    butterfly().opacity(1, 0.8)
  );

  // Happy jump
  yield* all(
    bunny().y(50, 0.5).to(100, 0.5),
    bunnyEar1().y(-10, 0.5).to(40, 0.5),
    bunnyEar2().y(-10, 0.5).to(40, 0.5),
    bird().y(30, 0.5).to(80, 0.5),
    butterfly().y(0, 0.5).to(50, 0.5)
  );

  yield* waitFor(1);

  // Fade to end
  yield* finaleText().opacity(0, 0.5);
  yield* endText().opacity(1, 1.5);
  yield* endText().scale(1.2, 0.5).to(1, 0.5);
  
  yield* waitFor(2);
  
  yield* view.opacity(0, 1);
});

