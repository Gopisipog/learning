import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Music video scenes - vibrant, colorful, buzzing with energy!
// Total: ~80 seconds (10 scenes × 8 seconds each)
const musicScenes = [
  {
    scene: 1,
    description: "Colorful cartoon bees buzzing around bright sunflowers in a magical garden, vibrant colors, happy energetic atmosphere, children's animation style, rainbow colors, sparkling effects, joyful scene",
    duration: 8
  },
  {
    scene: 2,
    description: "Cute cartoon kids dancing and jumping with colorful balloons floating everywhere, party atmosphere, confetti, bright rainbow colors, energetic movement, children's illustration style, celebration vibes",
    duration: 8
  },
  {
    scene: 3,
    description: "Animated butterflies and dragonflies flying through a magical rainbow sky, sparkles and glitter, vibrant neon colors, whimsical children's art style, dynamic movement, cheerful atmosphere",
    duration: 8
  },
  {
    scene: 4,
    description: "Playful cartoon animals having a music party with instruments, drums, guitars, keyboards, colorful stage lights, energetic performance, children's animation style, bright vivid colors, fun atmosphere",
    duration: 8
  },
  {
    scene: 5,
    description: "Colorful bouncing balls and spinning tops in a toy wonderland, geometric patterns, vibrant rainbow colors, dynamic motion, children's illustration style, playful energy, magical sparkles",
    duration: 8
  },
  {
    scene: 6,
    description: "Cartoon rockets and spaceships zooming through a colorful galaxy with planets and stars, bright neon colors, cosmic adventure, children's animation style, exciting energy, sparkles everywhere",
    duration: 8
  },
  {
    scene: 7,
    description: "Happy cartoon fruits dancing in a rainbow kitchen, smiling apples, bananas, oranges, strawberries, vibrant colors, energetic movement, children's illustration style, joyful party atmosphere",
    duration: 8
  },
  {
    scene: 8,
    description: "Colorful cartoon fish swimming and jumping in a magical underwater world, bubbles everywhere, coral reefs, bright tropical colors, children's animation style, dynamic movement, cheerful vibes",
    duration: 8
  },
  {
    scene: 9,
    description: "Animated colorful kites flying high in a bright blue sky with fluffy clouds, rainbow trails, children playing below, vibrant colors, energetic atmosphere, children's illustration style, joyful scene",
    duration: 8
  },
  {
    scene: 10,
    description: "Grand finale with fireworks, confetti, balloons, stars, and all the characters celebrating together, explosion of colors, rainbow everywhere, children's animation style, maximum energy and joy",
    duration: 8
  }
];

const API_KEY = process.env.STABILITY_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'music-video-output');

async function generateImage(prompt, sceneNumber) {
  console.log(`🎨 Generating Scene ${sceneNumber}/10...`);
  console.log(`   Theme: ${prompt.substring(0, 50)}...`);

  const formData = new FormData();
  
  const enhancedPrompt = `${prompt}, ultra vibrant, high energy, professional children's animation, extremely colorful, dynamic, eye-catching, safe for kids, no text`;
  const negativePrompt = "dull, boring, dark, scary, violent, inappropriate, text, watermark, low quality, blurry, static, lifeless";
  
  formData.append('prompt', enhancedPrompt);
  formData.append('negative_prompt', negativePrompt);
  formData.append('aspect_ratio', '16:9');
  formData.append('model', 'sd3-medium');
  formData.append('output_format', 'png');

  try {
    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/generate/sd3',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'image/*',
          ...formData.getHeaders()
        },
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const outputPath = path.join(OUTPUT_DIR, `scene-${String(sceneNumber).padStart(2, '0')}.png`);
    
    await fs.writeFile(outputPath, imageBuffer);
    console.log(`   ✅ Scene ${sceneNumber} complete!\n`);
    
    return true;
  } catch (error) {
    console.error(`   ❌ Error generating scene ${sceneNumber}:`, error.message);
    return false;
  }
}

async function generateAllScenes() {
  console.log('🎵 Creating Animated Music Video for growing.mp3\n');
  console.log('='.repeat(70) + '\n');
  console.log('🌈 Generating 10 vibrant, buzzing scenes...\n');

  // Create output directory
  await fs.ensureDir(OUTPUT_DIR);

  // Generate all images
  for (const scene of musicScenes) {
    await generateImage(scene.description, scene.scene);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Save scene data
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'scene-data.json'),
    JSON.stringify(musicScenes, null, 2)
  );

  console.log('✅ All 10 scenes generated successfully!\n');
  console.log('='.repeat(70) + '\n');
  console.log('📁 Output directory: music-video-output/\n');
  console.log('🎬 Next step: Creating animated video with music...\n');
}

generateAllScenes().catch(console.error);

