import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Free music sources (public domain / royalty-free)
const musicSources = [
  {
    name: 'Happy Kids Music',
    url: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
    description: 'Cheerful ukulele music perfect for kids content'
  },
  {
    name: 'Playful Melody',
    url: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
    description: 'Upbeat and sunny instrumental'
  }
];

async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(outputPath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        downloadFile(response.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;
      
      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        const percent = ((downloadedSize / totalSize) * 100).toFixed(1);
        process.stdout.write(`\r   Downloading: ${percent}%`);
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('\n');
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath);
      reject(err);
    });
  });
}

async function downloadBackgroundMusic() {
  console.log('🎵 Downloading Free Background Music\n');
  console.log('='.repeat(50) + '\n');
  
  const musicPath = path.join(__dirname, 'background-music.mp3');
  
  // Check if music already exists
  if (await fs.pathExists(musicPath)) {
    console.log('✅ Background music already exists!\n');
    console.log(`📁 Location: ${musicPath}\n`);
    return true;
  }
  
  console.log('📥 Downloading cheerful kids music...\n');
  console.log('Source: Bensound (royalty-free music)');
  console.log('License: Free with attribution\n');
  
  try {
    const source = musicSources[0];
    console.log(`🎼 ${source.name}`);
    console.log(`   ${source.description}\n`);
    
    await downloadFile(source.url, musicPath);
    
    console.log('✅ Background music downloaded successfully!\n');
    console.log(`📁 Saved to: ${musicPath}\n`);
    console.log('📝 Attribution required:');
    console.log('   "Music: Ukulele by Bensound.com"');
    console.log('   License: https://www.bensound.com/licensing\n');
    
    return true;
  } catch (error) {
    console.error('❌ Error downloading music:', error.message);
    console.log('\n💡 Alternative: Download manually\n');
    console.log('Free music sources:');
    console.log('1. Pixabay Music: https://pixabay.com/music/');
    console.log('2. YouTube Audio Library: https://studio.youtube.com/');
    console.log('3. Free Music Archive: https://freemusicarchive.org/\n');
    console.log('Search for: "happy kids instrumental" or "cheerful children music"\n');
    console.log('Save the file as: background-music.mp3\n');
    
    return false;
  }
}

async function main() {
  const success = await downloadBackgroundMusic();
  
  if (success) {
    console.log('🎉 Ready to create your video with music!\n');
    console.log('Next steps:');
    console.log('1. Run: npm run voiceover');
    console.log('2. Your final video will include background music!\n');
  }
}

main().catch(console.error);

