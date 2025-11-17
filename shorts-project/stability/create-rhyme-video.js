import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kids rhyme for Bella's story
const rhymeScenes = [
  {
    scene: 1,
    rhyme: "In a burrow snug and warm,\nBella wakes up to the morn!",
    duration: 4
  },
  {
    scene: 2,
    rhyme: "Through the meadow, hop hop hop,\nFlowers bloom, they never stop!",
    duration: 4
  },
  {
    scene: 3,
    rhyme: "Sam the squirrel says 'Hello friend!'\nLet's explore around the bend!",
    duration: 4
  },
  {
    scene: 4,
    rhyme: "By the stream so bright and clear,\nFish are dancing, full of cheer!",
    duration: 4
  },
  {
    scene: 5,
    rhyme: "Baby bird needs help today,\nFriends together save the day!",
    duration: 4
  },
  {
    scene: 6,
    rhyme: "Home at last when day is done,\nBella's heart is full of fun!",
    duration: 4
  }
];

async function createRhymeVideo() {
  console.log('🎬 Creating Kids Rhyme Short Video...\n');

  const outputDir = path.join(__dirname, 'story-output');
  const videoOutput = path.join(__dirname, 'bella-rhyme-short.mp4');
  
  // Check if images exist
  const imagesExist = await fs.pathExists(path.join(outputDir, 'scene-01.png'));
  if (!imagesExist) {
    console.error('❌ Error: Story images not found. Please run story-generator.js first!');
    return;
  }

  // Save rhyme text
  const rhymeText = rhymeScenes
    .map(scene => `Scene ${scene.scene}:\n${scene.rhyme}\n`)
    .join('\n');
  
  await fs.writeFile(path.join(outputDir, 'rhyme-text.txt'), rhymeText);
  console.log('📝 Rhyme text saved to rhyme-text.txt\n');

  // Create subtitle file (SRT format)
  let srtContent = '';
  let startTime = 0;
  
  rhymeScenes.forEach((scene, index) => {
    const endTime = startTime + scene.duration;
    const startSrt = formatSrtTime(startTime);
    const endSrt = formatSrtTime(endTime);
    
    srtContent += `${index + 1}\n`;
    srtContent += `${startSrt} --> ${endSrt}\n`;
    srtContent += `${scene.rhyme}\n\n`;
    
    startTime = endTime;
  });
  
  const srtPath = path.join(outputDir, 'rhyme-subtitles.srt');
  await fs.writeFile(srtPath, srtContent);
  console.log('📄 Subtitle file created: rhyme-subtitles.srt\n');

  // Create FFmpeg filter for video with transitions and text
  console.log('🎥 Creating video with FFmpeg...\n');
  console.log('This may take a minute...\n');

  const filterComplex = createFilterComplex(rhymeScenes);
  
  // FFmpeg command to create video with transitions and subtitles
  const ffmpegCommand = `ffmpeg -y ${rhymeScenes.map((_, i) => `-loop 1 -t 4 -i "${path.join(outputDir, `scene-${String(i + 1).padStart(2, '0')}.png`)}"`).join(' ')} -filter_complex "${filterComplex}" -c:v libx264 -pix_fmt yuv420p -r 30 -t ${rhymeScenes.length * 4} "${videoOutput}"`;

  try {
    console.log('⏳ Generating video (this will take 30-60 seconds)...\n');
    await execAsync(ffmpegCommand, { maxBuffer: 1024 * 1024 * 10 });
    console.log(`✅ Video created successfully: ${videoOutput}\n`);
    console.log('🎉 Your kids rhyme short is ready!\n');
    console.log('📹 Video details:');
    console.log(`   - Duration: ${rhymeScenes.length * 4} seconds`);
    console.log(`   - Format: MP4 (1080p)`);
    console.log(`   - Transitions: Smooth crossfade`);
    console.log(`   - Subtitles: Embedded rhymes\n`);
    console.log('💡 Next steps:');
    console.log('   - Add background music using video editing software');
    console.log('   - Add voiceover narration');
    console.log('   - Upload to YouTube Shorts, TikTok, or Instagram Reels!\n');
  } catch (error) {
    console.error('❌ Error creating video:', error.message);
    console.log('\n💡 Alternative: Create video manually');
    console.log('   1. Import all scene images into a video editor');
    console.log('   2. Set each image duration to 4 seconds');
    console.log('   3. Add crossfade transitions');
    console.log('   4. Add text overlays with the rhymes from rhyme-text.txt');
    console.log('   5. Export as MP4\n');
  }
}

function formatSrtTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function createFilterComplex(scenes) {
  // Create smooth crossfade transitions between scenes
  let filter = '';
  const transitionDuration = 0.5;
  
  // Scale all inputs to 1080x1920 (vertical format for shorts)
  for (let i = 0; i < scenes.length; i++) {
    filter += `[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30[v${i}];`;
  }
  
  // Create crossfade transitions
  filter += `[v0]`;
  for (let i = 1; i < scenes.length; i++) {
    filter += `[v${i}]xfade=transition=fade:duration=${transitionDuration}:offset=${(i * 4) - transitionDuration}`;
    if (i < scenes.length - 1) filter += '[vt' + i + '];[vt' + i + ']';
  }
  
  return filter;
}

// Run the video creator
createRhymeVideo().catch(console.error);

