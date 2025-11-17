import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function addMusicToVideo() {
  console.log('🎵 Adding Background Music to Video...\n');

  const videoInput = path.join(__dirname, 'bella-rhyme-short.mp4');
  const musicInput = path.join(__dirname, 'background-music.mp3'); // You need to provide this
  const videoOutput = path.join(__dirname, 'bella-rhyme-short-with-music.mp4');

  // Check if video exists
  if (!await fs.pathExists(videoInput)) {
    console.error('❌ Error: bella-rhyme-short.mp4 not found!');
    console.log('Please run: npm run video first\n');
    return;
  }

  // Check if music file exists
  if (!await fs.pathExists(musicInput)) {
    console.log('📝 To add background music:\n');
    console.log('1. Download royalty-free kids music from:');
    console.log('   - YouTube Audio Library: https://studio.youtube.com/');
    console.log('   - Pixabay: https://pixabay.com/music/');
    console.log('   - Free Music Archive: https://freemusicarchive.org/\n');
    console.log('2. Save the music file as "background-music.mp3" in this folder\n');
    console.log('3. Run this script again: node add-music.js\n');
    console.log('💡 Recommended search terms:');
    console.log('   - "happy kids music"');
    console.log('   - "cheerful children instrumental"');
    console.log('   - "upbeat nursery rhyme background"\n');
    return;
  }

  try {
    console.log('⏳ Adding music to video...\n');
    
    // FFmpeg command to add background music
    // - Loops music if shorter than video
    // - Reduces music volume to 30% so rhymes can be heard
    // - Fades out music at the end
    const ffmpegCommand = `ffmpeg -y -i "${videoInput}" -stream_loop -1 -i "${musicInput}" -filter_complex "[1:a]volume=0.3,afade=t=out:st=22:d=2[music];[music]apad" -map 0:v -map "[music]" -c:v copy -c:a aac -shortest "${videoOutput}"`;

    await execAsync(ffmpegCommand, { maxBuffer: 1024 * 1024 * 10 });
    
    console.log('✅ Video with music created successfully!\n');
    console.log(`📹 Output: ${videoOutput}\n`);
    console.log('🎉 Your video is now ready with background music!\n');
    console.log('💡 Next steps:');
    console.log('   - Preview the video');
    console.log('   - Add voiceover narration (optional)');
    console.log('   - Upload to YouTube Shorts, TikTok, or Instagram Reels!\n');

  } catch (error) {
    console.error('❌ Error adding music:', error.message);
    console.log('\n💡 Make sure FFmpeg is installed and accessible from command line\n');
  }
}

// Run the music adder
addMusicToVideo().catch(console.error);

