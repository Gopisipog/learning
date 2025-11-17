import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function createFullStory() {
  console.log('🌙 Creating Complete Story: Luna\'s Magical Night\n');
  console.log('='.repeat(70) + '\n');
  console.log('This will create a complete 25-second story video with:\n');
  console.log('   ✨ 5 AI-generated scenes');
  console.log('   🎙️  Professional voiceover narration');
  console.log('   🎵 Background music');
  console.log('   🎬 Smooth transitions');
  console.log('   📹 Full HD MP4 output\n');
  console.log('='.repeat(70) + '\n');

  try {
    // Step 1: Generate AI images
    console.log('📍 STEP 1/4: Generating AI images for 5 scenes...\n');
    await execAsync('node create-complete-story.js', { 
      maxBuffer: 1024 * 1024 * 10,
      cwd: process.cwd()
    });
    console.log('\n✅ Step 1 complete!\n');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Generate voiceovers
    console.log('📍 STEP 2/4: Generating AI voiceovers...\n');
    await execAsync('python generate-complete-voiceovers.py', { 
      maxBuffer: 1024 * 1024 * 10,
      cwd: process.cwd()
    });
    console.log('\n✅ Step 2 complete!\n');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Assemble video
    console.log('📍 STEP 3/4: Creating video with transitions...\n');
    console.log('⏳ This may take 1-2 minutes...\n');
    await execAsync('node assemble-complete-video.js', { 
      maxBuffer: 1024 * 1024 * 10,
      cwd: process.cwd()
    });
    console.log('\n✅ Step 3 complete!\n');

    // Step 4: Done!
    console.log('📍 STEP 4/4: Finalizing...\n');
    console.log('='.repeat(70) + '\n');
    console.log('🎉 SUCCESS! Your complete story is ready!\n');
    console.log('📹 Output file: lunas-magical-night.mp4\n');
    console.log('📁 All assets saved in: complete-story-output/\n');
    console.log('='.repeat(70) + '\n');
    console.log('🌟 Luna\'s Magical Night - A 25-second magical adventure!\n');
    console.log('Ready to upload to:');
    console.log('   • YouTube');
    console.log('   • Social Media');
    console.log('   • Your website');
    console.log('   • Share with friends!\n');
    console.log('🚀 Opening video...\n');

    // Open the video
    await execAsync('start lunas-magical-night.mp4', { cwd: process.cwd() });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure your Stability API key is set in .env');
    console.log('   2. Ensure Python and edge-tts are installed');
    console.log('   3. Check that FFmpeg is installed');
    console.log('   4. Verify background-music.mp3 exists\n');
    console.log('You can run steps individually:');
    console.log('   node create-complete-story.js');
    console.log('   python generate-complete-voiceovers.py');
    console.log('   node assemble-complete-video.js\n');
  }
}

createFullStory().catch(console.error);

