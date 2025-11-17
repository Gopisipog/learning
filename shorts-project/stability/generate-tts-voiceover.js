import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rhyme text for voiceover with timing
const rhymeScenes = [
  {
    scene: 1,
    text: "In a burrow snug and warm, Bella wakes up to the morn!",
    startTime: 0.5,
    duration: 3
  },
  {
    scene: 2,
    text: "Through the meadow, hop hop hop, Flowers bloom, they never stop!",
    startTime: 4.5,
    duration: 3
  },
  {
    scene: 3,
    text: "Sam the squirrel says Hello friend! Let's explore around the bend!",
    startTime: 8.5,
    duration: 3
  },
  {
    scene: 4,
    text: "By the stream so bright and clear, Fish are dancing, full of cheer!",
    startTime: 12.5,
    duration: 3
  },
  {
    scene: 5,
    text: "Baby bird needs help today, Friends together save the day!",
    startTime: 16.5,
    duration: 3
  },
  {
    scene: 6,
    text: "Home at last when day is done, Bella's heart is full of fun!",
    startTime: 20.5,
    duration: 3
  }
];

async function generateTTSWithElevenLabs(text, outputPath) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    return false;
  }

  try {
    // Using ElevenLabs API for high-quality TTS
    const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah - friendly female voice
    
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          }
        })
      }
    );

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      await fs.writeFile(outputPath, Buffer.from(audioBuffer));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('ElevenLabs error:', error.message);
    return false;
  }
}

async function generateTTSWithEdge(text, outputPath) {
  // Using Edge TTS (free, high quality)
  try {
    // Check if edge-tts is installed
    const checkCmd = 'edge-tts --version';
    await execAsync(checkCmd);
    
    // Generate TTS using Edge
    const voice = 'en-US-JennyNeural'; // Friendly female voice
    const cmd = `edge-tts --voice "${voice}" --text "${text.replace(/"/g, '\\"')}" --write-media "${outputPath}"`;
    
    await execAsync(cmd);
    return true;
  } catch (error) {
    return false;
  }
}

async function generateVoiceovers() {
  console.log('🎤 Generating voiceovers with text-to-speech...\n');
  
  const audioDir = path.join(__dirname, 'audio-files');
  await fs.ensureDir(audioDir);
  
  let method = 'none';
  
  // Try ElevenLabs first (best quality)
  if (process.env.ELEVENLABS_API_KEY) {
    console.log('Using ElevenLabs API for high-quality voiceover...\n');
    method = 'elevenlabs';
  } else {
    console.log('Checking for Edge TTS...\n');
    try {
      await execAsync('edge-tts --version');
      console.log('Using Edge TTS (Microsoft) for voiceover...\n');
      method = 'edge';
    } catch {
      console.log('⚠️  No TTS engine found.\n');
      method = 'manual';
    }
  }
  
  if (method === 'manual') {
    console.log('📝 Manual Recording Instructions:\n');
    console.log('Please record yourself reading these rhymes:\n');
    rhymeScenes.forEach(scene => {
      console.log(`Scene ${scene.scene}: "${scene.text}"`);
    });
    console.log('\nSave each as: audio-files/voiceover-{scene}.mp3\n');
    return null;
  }
  
  // Generate voiceovers
  for (const scene of rhymeScenes) {
    const audioFile = path.join(audioDir, `voiceover-${scene.scene}.mp3`);
    
    console.log(`🎙️  Scene ${scene.scene}: "${scene.text}"`);
    
    let success = false;
    
    if (method === 'elevenlabs') {
      success = await generateTTSWithElevenLabs(scene.text, audioFile);
    } else if (method === 'edge') {
      success = await generateTTSWithEdge(scene.text, audioFile);
    }
    
    if (success) {
      console.log(`   ✅ Generated: voiceover-${scene.scene}.mp3\n`);
    } else {
      console.log(`   ❌ Failed to generate\n`);
    }
  }
  
  return audioDir;
}

async function createFinalVideo() {
  console.log('🎬 Creating final video with music and voiceover...\n');
  
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
  
  console.log(`Music: ${hasMusicFile ? '✅' : '❌'}`);
  console.log(`Voiceovers: ${hasVoiceovers ? '✅' : '❌'}\n`);

  if (!hasMusicFile && !hasVoiceovers) {
    console.log('⚠️  No music or voiceovers found. Using original video.\n');
    return;
  }

  try {
    let filterComplex = '';
    let mapArgs = '-map 0:v';

    if (hasVoiceovers && hasMusicFile) {
      // Build filter to mix voiceovers with background music
      console.log('⏳ Mixing voiceovers with background music...\n');

      // Create concat file for voiceovers with delays
      let concatContent = 'ffconcat version 1.0\n';
      for (const scene of rhymeScenes) {
        const voiceFile = path.join(audioDir, `voiceover-${scene.scene}.mp3`);
        if (await fs.pathExists(voiceFile)) {
          concatContent += `file '${voiceFile}'\n`;
          concatContent += `duration ${scene.duration}\n`;
        }
      }

      const concatFile = path.join(audioDir, 'concat.txt');
      await fs.writeFile(concatFile, concatContent);

      // Mix background music (low volume) with voiceovers
      filterComplex = '[1:a]volume=0.2[music];[2:a]volume=1.0[voice];[music][voice]amix=inputs=2:duration=shortest[audio]';
      mapArgs = `-map 0:v -map "[audio]"`;

      const ffmpegCommand = `ffmpeg -y -i "${videoInput}" -stream_loop -1 -i "${musicInput}" -f concat -safe 0 -i "${concatFile}" -filter_complex "${filterComplex}" ${mapArgs} -c:v copy -c:a aac -shortest "${finalOutput}"`;

      await execAsync(ffmpegCommand, { maxBuffer: 1024 * 1024 * 10 });

    } else if (hasMusicFile) {
      // Only background music
      console.log('⏳ Adding background music...\n');
      const ffmpegCommand = `ffmpeg -y -i "${videoInput}" -stream_loop -1 -i "${musicInput}" -filter_complex "[1:a]volume=0.25,afade=t=out:st=22:d=2[music]" -map 0:v -map "[music]" -c:v copy -c:a aac -shortest "${finalOutput}"`;
      await execAsync(ffmpegCommand, { maxBuffer: 1024 * 1024 * 10 });
    }

    console.log('✅ Final video created successfully!\n');
    console.log(`📹 Output: bella-rhyme-final.mp4\n`);
    console.log('🎉 Your video is ready to upload!\n');

  } catch (error) {
    console.error('❌ Error creating final video:', error.message);
    console.log('\nTry using a video editor instead:');
    console.log('1. Import bella-rhyme-short.mp4');
    console.log('2. Add background-music.mp3 as background audio');
    console.log('3. Add voiceover recordings');
    console.log('4. Export as MP4\n');
  }
}

async function main() {
  console.log('🎬 Kids Rhyme Short - Music & Voiceover Generator\n');
  console.log('='.repeat(60) + '\n');

  // Step 1: Generate voiceovers
  await generateVoiceovers();

  // Step 2: Create final video
  await createFinalVideo();

  console.log('\n📋 Setup Instructions for Better Quality:\n');
  console.log('1. For FREE high-quality TTS (Recommended):');
  console.log('   Install Edge TTS: pip install edge-tts');
  console.log('   Then run this script again\n');

  console.log('2. For PREMIUM quality voiceover:');
  console.log('   Get ElevenLabs API key: https://elevenlabs.io/');
  console.log('   Add to .env: ELEVENLABS_API_KEY=your_key');
  console.log('   Then run this script again\n');

  console.log('3. For background music:');
  console.log('   Download from: https://pixabay.com/music/');
  console.log('   Save as: background-music.mp3\n');

  console.log('4. For BEST results (Your own voice):');
  console.log('   Record yourself reading the rhymes');
  console.log('   Save as: audio-files/voiceover-1.mp3, etc.\n');
}

main().catch(console.error);


