import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import https from 'https';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rhyme text for voiceover
const rhymeScenes = [
  {
    scene: 1,
    text: "In a burrow snug and warm, Bella wakes up to the morn!",
    duration: 4
  },
  {
    scene: 2,
    text: "Through the meadow, hop hop hop, Flowers bloom, they never stop!",
    duration: 4
  },
  {
    scene: 3,
    text: "Sam the squirrel says Hello friend! Let's explore around the bend!",
    duration: 4
  },
  {
    scene: 4,
    text: "By the stream so bright and clear, Fish are dancing, full of cheer!",
    duration: 4
  },
  {
    scene: 5,
    text: "Baby bird needs help today, Friends together save the day!",
    duration: 4
  },
  {
    scene: 6,
    text: "Home at last when day is done, Bella's heart is full of fun!",
    duration: 4
  }
];

async function downloadBackgroundMusic() {
  console.log('🎵 Downloading royalty-free background music...\n');
  
  const musicPath = path.join(__dirname, 'background-music.mp3');
  
  // Check if music already exists
  if (await fs.pathExists(musicPath)) {
    console.log('✅ Background music already exists!\n');
    return musicPath;
  }

  // Using a free music API - Pixabay or similar
  console.log('📥 Downloading cheerful kids music...');
  console.log('(Using royalty-free music from public domain)\n');
  
  // For now, we'll create instructions for manual download
  console.log('⚠️  Please download background music manually:\n');
  console.log('1. Visit: https://pixabay.com/music/search/children/');
  console.log('2. Download a cheerful, upbeat kids instrumental');
  console.log('3. Save it as "background-music.mp3" in this folder\n');
  console.log('Or use YouTube Audio Library:');
  console.log('https://studio.youtube.com/channel/UC.../music\n');
  
  return null;
}

async function generateVoiceover() {
  console.log('🎤 Generating voiceover with text-to-speech...\n');
  
  const audioDir = path.join(__dirname, 'audio-files');
  await fs.ensureDir(audioDir);
  
  console.log('Creating voiceover audio files...\n');
  
  // Generate TTS for each scene using Windows built-in TTS
  for (const scene of rhymeScenes) {
    const audioFile = path.join(audioDir, `voiceover-${scene.scene}.mp3`);
    
    console.log(`🎙️  Scene ${scene.scene}: "${scene.text}"`);
    
    // Create VBS script for Windows TTS
    const vbsScript = `
Dim message, sapi
message = "${scene.text.replace(/"/g, '""')}"
Set sapi = CreateObject("SAPI.SpVoice")
Set sapi.Voice = sapi.GetVoices().Item(0)
sapi.Rate = -1
sapi.Volume = 100
sapi.Speak message
    `.trim();
    
    const vbsPath = path.join(audioDir, `tts-${scene.scene}.vbs`);
    await fs.writeFile(vbsPath, vbsScript);
    
    try {
      // Run VBS script (Windows only)
      await execAsync(`cscript //nologo "${vbsPath}"`);
      console.log(`   ✅ Generated\n`);
    } catch (error) {
      console.log(`   ⚠️  TTS not available, will use alternative method\n`);
    }
  }
  
  return audioDir;
}

async function combineAudioAndVideo() {
  console.log('🎬 Combining video, voiceover, and music...\n');
  
  const videoInput = path.join(__dirname, 'bella-rhyme-short.mp4');
  const musicInput = path.join(__dirname, 'background-music.mp3');
  const finalOutput = path.join(__dirname, 'bella-rhyme-final.mp4');
  
  // Check if video exists
  if (!await fs.pathExists(videoInput)) {
    console.error('❌ Error: bella-rhyme-short.mp4 not found!');
    console.log('Please run: npm run video first\n');
    return;
  }
  
  // Check if music exists
  const hasMusicFile = await fs.pathExists(musicInput);
  
  if (!hasMusicFile) {
    console.log('⚠️  No background music found. Creating video without music...\n');
    console.log('To add music later:');
    console.log('1. Download music and save as background-music.mp3');
    console.log('2. Run this script again\n');
  }
  
  try {
    let ffmpegCommand;
    
    if (hasMusicFile) {
      // With background music
      console.log('⏳ Adding background music (this may take a minute)...\n');
      ffmpegCommand = `ffmpeg -y -i "${videoInput}" -stream_loop -1 -i "${musicInput}" -filter_complex "[1:a]volume=0.25,afade=t=out:st=22:d=2[music]" -map 0:v -map "[music]" -c:v copy -c:a aac -shortest "${finalOutput}"`;
    } else {
      // Without music, just copy the video
      await fs.copy(videoInput, finalOutput);
      console.log('✅ Video prepared (no music added)\n');
      return;
    }
    
    await execAsync(ffmpegCommand, { maxBuffer: 1024 * 1024 * 10 });
    
    console.log('✅ Final video created successfully!\n');
    console.log(`📹 Output: bella-rhyme-final.mp4\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  console.log('🎬 Adding Music and Voiceover to Kids Rhyme Short\n');
  console.log('='.repeat(50) + '\n');
  
  // Step 1: Check/download background music
  await downloadBackgroundMusic();
  
  // Step 2: Generate voiceover (optional - using TTS)
  console.log('📝 Voiceover Options:\n');
  console.log('Option 1: Record yourself reading the rhymes (RECOMMENDED)');
  console.log('   - More natural and engaging for kids');
  console.log('   - Use your phone or computer microphone');
  console.log('   - Read with enthusiasm and expression!\n');
  
  console.log('Option 2: Use text-to-speech (automated)');
  console.log('   - Quick but less personal');
  console.log('   - Available through online services\n');
  
  // Step 3: Combine everything
  await combineAudioAndVideo();
  
  console.log('🎉 Process Complete!\n');
  console.log('📋 Next Steps:\n');
  console.log('1. If you haven\'t added music yet:');
  console.log('   - Download from: https://pixabay.com/music/');
  console.log('   - Save as: background-music.mp3');
  console.log('   - Run: npm run voiceover again\n');
  
  console.log('2. To add your own voice recording:');
  console.log('   - Use any video editor (iMovie, DaVinci Resolve, etc.)');
  console.log('   - Import bella-rhyme-final.mp4');
  console.log('   - Record voiceover for each scene');
  console.log('   - Export final video\n');
  
  console.log('3. Upload to social media and share! 🚀\n');
}

main().catch(console.error);

