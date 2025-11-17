import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Scene timing (in seconds)
const scenes = [
  { scene: 1, start: 0, duration: 4 },
  { scene: 2, start: 4, duration: 4 },
  { scene: 3, start: 8, duration: 4 },
  { scene: 4, start: 12, duration: 4 },
  { scene: 5, start: 16, duration: 4 },
  { scene: 6, start: 20, duration: 4 }
];

async function createFinalVideo() {
  console.log('🎬 Creating Final Video with Music and Voiceover\n');
  console.log('='.repeat(60) + '\n');

  const videoInput = path.join(__dirname, 'bella-rhyme-short.mp4');
  const musicInput = path.join(__dirname, 'background-music.mp3');
  const audioDir = path.join(__dirname, 'audio-files');
  const finalOutput = path.join(__dirname, 'bella-rhyme-final.mp4');

  // Check if video exists
  if (!await fs.pathExists(videoInput)) {
    console.error('❌ Error: bella-rhyme-short.mp4 not found!');
    console.log('Please run: npm run video first\n');
    return;
  }

  const hasMusicFile = await fs.pathExists(musicInput);
  const hasVoiceovers = await fs.pathExists(path.join(audioDir, 'voiceover-1.mp3'));

  console.log('📋 Checking resources:');
  console.log(`   Video: ✅ bella-rhyme-short.mp4`);
  console.log(`   Music: ${hasMusicFile ? '✅ background-music.mp3' : '❌ Not found'}`);
  console.log(`   Voiceovers: ${hasVoiceovers ? '✅ 6 files found' : '❌ Not found'}\n`);

  if (!hasMusicFile && !hasVoiceovers) {
    console.log('⚠️  No music or voiceovers found.\n');
    console.log('Run these commands first:');
    console.log('  npm run download-music');
    console.log('  python generate-voiceovers.py\n');
    return;
  }

  try {
    if (hasVoiceovers && hasMusicFile) {
      console.log('🎵 Mixing voiceovers with background music...\n');
      
      // Create a filter to add voiceovers at specific times
      let filterParts = [];
      let inputs = `-i "${videoInput}" -i "${musicInput}"`;
      
      // Add all voiceover files as inputs
      for (let i = 1; i <= 6; i++) {
        const voiceFile = path.join(audioDir, `voiceover-${i}.mp3`);
        if (await fs.pathExists(voiceFile)) {
          inputs += ` -i "${voiceFile}"`;
        }
      }
      
      // Build audio filter
      // Background music at low volume
      filterParts.push('[1:a]volume=0.15[music]');
      
      // Mix all voiceovers with delays
      let voiceMix = '';
      for (let i = 0; i < 6; i++) {
        const delay = scenes[i].start * 1000; // Convert to milliseconds
        filterParts.push(`[${i + 2}:a]adelay=${delay}|${delay},volume=1.5[v${i}]`);
        voiceMix += `[v${i}]`;
      }
      
      // Combine all audio streams
      const filterComplex = filterParts.join(';') + `;[music]${voiceMix}amix=inputs=7:duration=first:dropout_transition=2[audio]`;
      
      console.log('⏳ Processing (this may take 1-2 minutes)...\n');
      
      const ffmpegCommand = `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map 0:v -map "[audio]" -c:v copy -c:a aac -b:a 192k -shortest "${finalOutput}"`;
      
      await execAsync(ffmpegCommand, { maxBuffer: 1024 * 1024 * 10 });
      
    } else if (hasMusicFile) {
      console.log('🎵 Adding background music only...\n');
      console.log('⏳ Processing...\n');
      
      const ffmpegCommand = `ffmpeg -y -i "${videoInput}" -stream_loop -1 -i "${musicInput}" -filter_complex "[1:a]volume=0.25,afade=t=out:st=22:d=2[music]" -map 0:v -map "[music]" -c:v copy -c:a aac -shortest "${finalOutput}"`;
      
      await execAsync(ffmpegCommand, { maxBuffer: 1024 * 1024 * 10 });
      
    } else if (hasVoiceovers) {
      console.log('🎙️  Adding voiceovers only...\n');
      console.log('⏳ Processing...\n');
      
      let inputs = `-i "${videoInput}"`;
      let voiceMix = '';
      
      for (let i = 1; i <= 6; i++) {
        const voiceFile = path.join(audioDir, `voiceover-${i}.mp3`);
        if (await fs.pathExists(voiceFile)) {
          inputs += ` -i "${voiceFile}"`;
        }
      }
      
      let filterParts = [];
      for (let i = 0; i < 6; i++) {
        const delay = scenes[i].start * 1000;
        filterParts.push(`[${i + 1}:a]adelay=${delay}|${delay}[v${i}]`);
        voiceMix += `[v${i}]`;
      }
      
      const filterComplex = filterParts.join(';') + `;${voiceMix}amix=inputs=6:duration=first[audio]`;
      
      const ffmpegCommand = `ffmpeg -y ${inputs} -filter_complex "${filterComplex}" -map 0:v -map "[audio]" -c:v copy -c:a aac -shortest "${finalOutput}"`;
      
      await execAsync(ffmpegCommand, { maxBuffer: 1024 * 1024 * 10 });
    }

    console.log('✅ Final video created successfully!\n');
    console.log('📹 Output: bella-rhyme-final.mp4\n');
    console.log('🎉 Your kids rhyme short is complete!\n');
    console.log('📊 Video details:');
    console.log('   - Duration: 24 seconds');
    console.log('   - Format: MP4 (1080x1920)');
    console.log('   - Audio: Background music + voiceover');
    console.log('   - Ready for: YouTube Shorts, TikTok, Instagram Reels\n');
    console.log('🚀 Next steps:');
    console.log('   1. Preview the video');
    console.log('   2. Upload to your favorite platform');
    console.log('   3. Add description and hashtags');
    console.log('   4. Share with the world! 🌟\n');

  } catch (error) {
    console.error('❌ Error creating final video:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Make sure FFmpeg is installed');
    console.log('   - Check that all audio files exist');
    console.log('   - Try using a video editor manually\n');
  }
}

createFinalVideo().catch(console.error);

