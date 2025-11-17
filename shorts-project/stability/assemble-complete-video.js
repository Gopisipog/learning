import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Scene timing (5 seconds each = 25 seconds total)
const scenes = [
  { scene: 1, start: 0, duration: 5 },
  { scene: 2, start: 5, duration: 5 },
  { scene: 3, start: 10, duration: 5 },
  { scene: 4, start: 15, duration: 5 },
  { scene: 5, start: 20, duration: 5 }
];

async function createVideoFromImages() {
  console.log('🎬 Creating Complete Story Video\n');
  console.log('='.repeat(60) + '\n');

  const outputDir = path.join(__dirname, 'complete-story-output');
  const videoOutput = path.join(__dirname, 'lunas-magical-night.mp4');
  const musicInput = path.join(__dirname, 'background-music.mp3');

  // Check if all images exist
  console.log('📋 Checking resources:\n');
  
  let allImagesExist = true;
  for (let i = 1; i <= 5; i++) {
    const imagePath = path.join(outputDir, `scene-${String(i).padStart(2, '0')}.png`);
    const exists = await fs.pathExists(imagePath);
    console.log(`   Scene ${i}: ${exists ? '✅' : '❌'} scene-${String(i).padStart(2, '0')}.png`);
    if (!exists) allImagesExist = false;
  }

  const hasMusicFile = await fs.pathExists(musicInput);
  console.log(`   Music: ${hasMusicFile ? '✅' : '❌'} background-music.mp3`);

  let hasAllVoiceovers = true;
  for (let i = 1; i <= 5; i++) {
    const voiceFile = path.join(outputDir, `voiceover-${i}.mp3`);
    const exists = await fs.pathExists(voiceFile);
    console.log(`   Voiceover ${i}: ${exists ? '✅' : '❌'} voiceover-${i}.mp3`);
    if (!exists) hasAllVoiceovers = false;
  }

  console.log('\n');

  if (!allImagesExist) {
    console.error('❌ Error: Not all images found!');
    console.log('Please run: node create-complete-story.js first\n');
    return;
  }

  try {
    console.log('🎥 Step 1: Creating video from images with transitions...\n');

    // Build FFmpeg filter for crossfade transitions
    let filterComplex = '';

    // Scale and format each image
    for (let i = 0; i < 5; i++) {
      filterComplex += `[${i}:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=30,format=yuv420p[v${i}];`;
    }

    // Create crossfade transitions (0.5 second crossfades)
    // Chain them properly: v0 + v1 = vf0, vf0 + v2 = vf1, etc.
    filterComplex += `[v0][v1]xfade=transition=fade:duration=0.5:offset=4.5[vf0];`;
    filterComplex += `[vf0][v2]xfade=transition=fade:duration=0.5:offset=9.5[vf1];`;
    filterComplex += `[vf1][v3]xfade=transition=fade:duration=0.5:offset=14.5[vf2];`;
    filterComplex += `[vf2][v4]xfade=transition=fade:duration=0.5:offset=19.5[vf3]`;

    const imageInputs = scenes.map((s, i) =>
      `-loop 1 -t 5 -i "${path.join(outputDir, `scene-${String(s.scene).padStart(2, '0')}.png`)}"`
    ).join(' ');

    const tempVideoPath = path.join(__dirname, 'temp-video-no-audio.mp4');

    const videoCommand = `ffmpeg -y ${imageInputs} -filter_complex "${filterComplex}" -map "[vf3]" -c:v libx264 -pix_fmt yuv420p -r 30 "${tempVideoPath}"`;

    await execAsync(videoCommand, { maxBuffer: 1024 * 1024 * 10 });
    console.log('   ✅ Video created with transitions\n');

    console.log('🎵 Step 2: Adding background music and voiceovers...\n');

    if (hasAllVoiceovers && hasMusicFile) {
      // Build complex audio filter
      let inputs = `-i "${tempVideoPath}" -stream_loop -1 -i "${musicInput}"`;
      
      // Add all voiceover files
      for (let i = 1; i <= 5; i++) {
        const voiceFile = path.join(outputDir, `voiceover-${i}.mp3`);
        inputs += ` -i "${voiceFile}"`;
      }

      // Build audio filter
      let audioFilter = '[1:a]volume=0.15[music];';
      
      // Add delays to voiceovers
      for (let i = 0; i < 5; i++) {
        const delay = scenes[i].start * 1000; // Convert to milliseconds
        audioFilter += `[${i + 2}:a]adelay=${delay}|${delay},volume=1.5[v${i}];`;
      }

      // Mix all audio streams
      audioFilter += '[music][v0][v1][v2][v3][v4]amix=inputs=6:duration=first:dropout_transition=2[audio]';

      const finalCommand = `ffmpeg -y ${inputs} -filter_complex "${audioFilter}" -map 0:v -map "[audio]" -c:v copy -c:a aac -b:a 192k -shortest "${videoOutput}"`;

      await execAsync(finalCommand, { maxBuffer: 1024 * 1024 * 10 });

    } else if (hasMusicFile) {
      // Just add music
      const musicCommand = `ffmpeg -y -i "${tempVideoPath}" -stream_loop -1 -i "${musicInput}" -filter_complex "[1:a]volume=0.25,afade=t=out:st=23:d=2[music]" -map 0:v -map "[music]" -c:v copy -c:a aac -shortest "${videoOutput}"`;
      
      await execAsync(musicCommand, { maxBuffer: 1024 * 1024 * 10 });
    } else {
      // No audio, just copy the video
      await fs.copy(tempVideoPath, videoOutput);
    }

    // Clean up temp file
    await fs.remove(tempVideoPath);

    console.log('✅ Final video created successfully!\n');
    console.log('='.repeat(60) + '\n');
    console.log('🎉 Luna\'s Magical Night - Complete!\n');
    console.log(`📹 Output: lunas-magical-night.mp4\n`);
    console.log('📊 Video details:');
    console.log('   - Duration: 25 seconds (5 scenes × 5 seconds)');
    console.log('   - Resolution: 1920x1080 (Full HD)');
    console.log('   - Format: MP4 (H.264)');
    console.log('   - Audio: Background music + voiceover narration');
    console.log('   - Transitions: Smooth crossfades between scenes\n');
    console.log('🌟 Story: Luna\'s Magical Night');
    console.log('   Scene 1: High in the tallest tree, Luna the owl wakes with glee!');
    console.log('   Scene 2: Through the forest she takes flight, guided by the fireflies\' light!');
    console.log('   Scene 3: Felix the fox says come and see, the magic mushroom jubilee!');
    console.log('   Scene 4: Stars are falling from above, filling hearts with joy and love!');
    console.log('   Scene 5: Home again as dawn draws near, Luna dreams without a fear!\n');
    console.log('🚀 Ready to share!\n');

  } catch (error) {
    console.error('❌ Error creating video:', error.message);
    console.log('\n💡 Make sure FFmpeg is installed and all files exist.\n');
  }
}

createVideoFromImages().catch(console.error);

