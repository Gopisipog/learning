import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function createGrowingMusicVideo() {
  console.log('🎵 Creating Animated Music Video for growing.mp3\n');
  console.log('='.repeat(70) + '\n');
  console.log('This will create a vibrant 80-second music video with:\n');
  console.log('   🌈 10 colorful, buzzing scenes');
  console.log('   ✨ Dynamic zoom and pan animations');
  console.log('   🎬 9 different transition effects');
  console.log('   🎵 Your growing.mp3 audio');
  console.log('   📹 Full HD 1920x1080 output\n');
  console.log('='.repeat(70) + '\n');

  try {
    // Step 1: Generate AI images
    console.log('📍 STEP 1/2: Generating 10 vibrant AI scenes...\n');
    console.log('⏳ This will take about 3-4 minutes...\n');
    
    await execAsync('node create-music-video.js', { 
      maxBuffer: 1024 * 1024 * 10,
      cwd: process.cwd()
    });
    console.log('\n✅ Step 1 complete!\n');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Assemble video
    console.log('📍 STEP 2/2: Creating animated video with music...\n');
    console.log('⏳ This may take 2-3 minutes...\n');
    
    await execAsync('node assemble-music-video.js', { 
      maxBuffer: 1024 * 1024 * 20,
      cwd: process.cwd()
    });
    console.log('\n✅ Step 2 complete!\n');

    // Done!
    console.log('='.repeat(70) + '\n');
    console.log('🎉 SUCCESS! Your animated music video is ready!\n');
    console.log('📹 Output file: growing-music-video.mp4\n');
    console.log('📁 All scenes saved in: music-video-output/\n');
    console.log('='.repeat(70) + '\n');
    console.log('🌟 Your Music Video Features:\n');
    console.log('   🐝 Buzzing bees in sunflower garden');
    console.log('   🎈 Kids dancing with colorful balloons');
    console.log('   🦋 Magical butterflies and rainbows');
    console.log('   🎸 Animals rocking out with instruments');
    console.log('   🎨 Bouncing balls in toy wonderland');
    console.log('   🚀 Rockets zooming through space');
    console.log('   🍎 Dancing fruits party');
    console.log('   🐠 Underwater fish adventure');
    console.log('   🪁 Colorful kites flying high');
    console.log('   🎆 Grand fireworks finale\n');
    console.log('Ready to upload to:');
    console.log('   • YouTube');
    console.log('   • Social Media');
    console.log('   • Your website\n');
    console.log('🚀 Opening video...\n');

    // Open the video
    await execAsync('start growing-music-video.mp4', { cwd: process.cwd() });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure your Stability API key is set in .env');
    console.log('   2. Ensure growing.mp3 exists in the current directory');
    console.log('   3. Check that FFmpeg is installed\n');
    console.log('You can run steps individually:');
    console.log('   node create-music-video.js');
    console.log('   node assemble-music-video.js\n');
  }
}

createGrowingMusicVideo().catch(console.error);

