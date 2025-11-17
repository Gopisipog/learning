import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 10 scenes × 8 seconds = 80 seconds (matches audio duration)
const scenes = [
  { scene: 1, start: 0, duration: 8, transition: 'wipeleft' },
  { scene: 2, start: 8, duration: 8, transition: 'wiperight' },
  { scene: 3, start: 16, duration: 8, transition: 'wipeup' },
  { scene: 4, start: 24, duration: 8, transition: 'wipedown' },
  { scene: 5, start: 32, duration: 8, transition: 'slideleft' },
  { scene: 6, start: 40, duration: 8, transition: 'slideright' },
  { scene: 7, start: 48, duration: 8, transition: 'slideup' },
  { scene: 8, start: 56, duration: 8, transition: 'slidedown' },
  { scene: 9, start: 64, duration: 8, transition: 'circlecrop' },
  { scene: 10, start: 72, duration: 8, transition: 'fade' }
];

async function createMusicVideo() {
  console.log('🎬 Creating Animated Music Video\n');
  console.log('='.repeat(70) + '\n');

  const outputDir = path.join(__dirname, 'music-video-output');
  const videoOutput = path.join(__dirname, 'growing-music-video.mp4');
  const audioInput = path.join(__dirname, 'growing.mp3');

  // Check if all images exist
  console.log('📋 Checking resources:\n');
  
  let allImagesExist = true;
  for (let i = 1; i <= 10; i++) {
    const imagePath = path.join(outputDir, `scene-${String(i).padStart(2, '0')}.png`);
    const exists = await fs.pathExists(imagePath);
    console.log(`   Scene ${i}: ${exists ? '✅' : '❌'} scene-${String(i).padStart(2, '0')}.png`);
    if (!exists) allImagesExist = false;
  }

  const hasAudioFile = await fs.pathExists(audioInput);
  console.log(`   Audio: ${hasAudioFile ? '✅' : '❌'} growing.mp3\n`);

  if (!allImagesExist) {
    console.error('❌ Error: Not all images found!');
    console.log('Please run: node create-music-video.js first\n');
    return;
  }

  if (!hasAudioFile) {
    console.error('❌ Error: growing.mp3 not found!\n');
    return;
  }

  try {
    console.log('🎥 Creating video with dynamic transitions and animations...\n');
    console.log('⏳ This may take 2-3 minutes...\n');

    // Build FFmpeg filter with zoom/pan effects for each scene + transitions
    let filterComplex = '';
    
    // Add zoom/pan animation to each image for dynamic effect
    for (let i = 0; i < 10; i++) {
      // Alternate between zoom in and zoom out for energy
      const zoomEffect = i % 2 === 0 
        ? 'scale=2*iw:-1,zoompan=z=\'min(zoom+0.0015,1.5)\':d=240:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s=1920x1080'
        : 'scale=2*iw:-1,zoompan=z=\'if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))\':d=240:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s=1920x1080';
      
      filterComplex += `[${i}:v]${zoomEffect},fps=30,format=yuv420p[v${i}];`;
    }

    // Create dynamic transitions between scenes
    for (let i = 0; i < 9; i++) {
      const offset = (i * 8) + 7.5; // Start transition 0.5s before end
      const transition = scenes[i].transition;
      
      if (i === 0) {
        filterComplex += `[v${i}][v${i+1}]xfade=transition=${transition}:duration=0.5:offset=${offset}[vf${i}];`;
      } else {
        filterComplex += `[vf${i-1}][v${i+1}]xfade=transition=${transition}:duration=0.5:offset=${offset}[vf${i}];`;
      }
    }

    const imageInputs = scenes.map((s, i) => 
      `-loop 1 -t 8 -i "${path.join(outputDir, `scene-${String(s.scene).padStart(2, '0')}.png`)}"`
    ).join(' ');

    const finalCommand = `ffmpeg -y ${imageInputs} -i "${audioInput}" -filter_complex "${filterComplex}" -map "[vf8]" -map 10:a -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -shortest "${videoOutput}"`;

    await execAsync(finalCommand, { maxBuffer: 1024 * 1024 * 20 });

    console.log('✅ Music video created successfully!\n');
    console.log('='.repeat(70) + '\n');
    console.log('🎉 Growing - Animated Music Video Complete!\n');
    console.log(`📹 Output: growing-music-video.mp4\n`);
    console.log('📊 Video details:');
    console.log('   - Duration: ~80 seconds (matches audio)');
    console.log('   - Resolution: 1920x1080 (Full HD)');
    console.log('   - Format: MP4 (H.264)');
    console.log('   - Audio: Original growing.mp3');
    console.log('   - Effects: Dynamic zoom/pan animations');
    console.log('   - Transitions: 9 different transition styles');
    console.log('   - Scenes: 10 vibrant, colorful scenes\n');
    console.log('🌈 Features:');
    console.log('   ✨ Buzzing bees and butterflies');
    console.log('   🎈 Dancing kids with balloons');
    console.log('   🎵 Animals playing instruments');
    console.log('   🚀 Colorful space adventure');
    console.log('   🐠 Underwater magic');
    console.log('   🎆 Fireworks finale\n');
    console.log('🚀 Ready to share!\n');

  } catch (error) {
    console.error('❌ Error creating video:', error.message);
    console.log('\n💡 Make sure FFmpeg is installed and all files exist.\n');
  }
}

createMusicVideo().catch(console.error);

