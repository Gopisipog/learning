import {makeProject} from '@motion-canvas/core';

// Luna's Magical Night - Story Scenes
import lunaScene1 from './scenes/luna-scene-1?scene';
import lunaScene2 from './scenes/luna-scene-2?scene';
import lunaScene3 from './scenes/luna-scene-3?scene';
import lunaScene4 from './scenes/luna-scene-4?scene';
import lunaScene5 from './scenes/luna-scene-5?scene';

export default makeProject({
  scenes: [
    lunaScene1,
    lunaScene2,
    lunaScene3,
    lunaScene4,
    lunaScene5,
  ],
  name: "Luna's Magical Night",
});
