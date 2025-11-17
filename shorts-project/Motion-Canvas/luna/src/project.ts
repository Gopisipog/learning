import {makeProject} from '@motion-canvas/core';

// Luna's Magical Night - Enhanced Story Animation
import scene1 from './scenes/scene1?scene';
import scene2 from './scenes/scene2?scene';
import scene3 from './scenes/scene3?scene';
import scene4 from './scenes/scene4?scene';
import scene5 from './scenes/scene5?scene';

// Voiceover narration files
import voiceover1 from '../story/voiceover-1.mp3';
import voiceover2 from '../story/voiceover-2.mp3';
import voiceover3 from '../story/voiceover-3.mp3';
import voiceover4 from '../story/voiceover-4.mp3';
import voiceover5 from '../story/voiceover-5.mp3';

export default makeProject({
  scenes: [
    scene1,
    scene2,
    scene3,
    scene4,
    scene5,
  ],
  name: "Luna's Magical Night - Enhanced Edition with Gleeful Narration 🌙✨",

  // Using first voiceover as demo - see README for combining all audio
  audio: voiceover1,
});
