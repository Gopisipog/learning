import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 5-Scene Story: "Luna's Magical Night"
const storyScenes = [
  {
    scene: 1,
    description: "A cute little owl named Luna sitting on a tree branch under a starry night sky, children's book illustration style, bright colors, magical atmosphere, twinkling stars, crescent moon",
    narration: "High in the tallest tree, Luna the owl wakes with glee!",
    duration: 5
  },
  {
    scene: 2,
    description: "Luna the owl flying through a magical forest with glowing fireflies all around, enchanted woodland, sparkling lights, mystical trees, children's book art style, vibrant colors",
    narration: "Through the forest she takes flight, guided by the fireflies' light!",
    duration: 5
  },
  {
    scene: 3,
    description: "Luna the owl meeting a friendly fox near a glowing mushroom circle, magical forest clearing, bioluminescent mushrooms, cute fox character, whimsical children's illustration, warm colors",
    narration: "Felix the fox says come and see, the magic mushroom jubilee!",
    duration: 5
  },
  {
    scene: 4,
    description: "Luna and Felix watching shooting stars together on a hilltop, beautiful night sky with meteor shower, silhouettes of owl and fox, magical atmosphere, children's book style, dreamy colors",
    narration: "Stars are falling from above, filling hearts with joy and love!",
    duration: 5
  },
  {
    scene: 5,
    description: "Luna the owl back in her cozy tree hollow nest, peaceful sleeping scene, soft moonlight, comfortable and warm, children's book illustration, gentle colors, sweet dreams atmosphere",
    narration: "Home again as dawn draws near, Luna dreams without a fear!",
    duration: 5
  }
];

const API_KEY = process.env.STABILITY_API_KEY;
const OUTPUT_DIR = path.join(__dirname, 'complete-story-output');

async function generateImage(prompt, sceneNumber) {
  console.log(`🎨 Generating Scene ${sceneNumber}...`);
  console.log(`   Prompt: ${prompt.substring(0, 60)}...`);

  const formData = new FormData();
  
  const enhancedPrompt = `${prompt}, high quality, detailed, professional children's book illustration, vibrant and appealing, safe for kids`;
  const negativePrompt = "ugly, blurry, low quality, distorted, scary, dark, violent, inappropriate, text, watermark";
  
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
    console.log(`   ✅ Saved: scene-${String(sceneNumber).padStart(2, '0')}.png\n`);
    
    return true;
  } catch (error) {
    console.error(`   ❌ Error generating scene ${sceneNumber}:`, error.message);
    return false;
  }
}

async function generateAllScenes() {
  console.log('🌙 Luna\'s Magical Night - Story Generator\n');
  console.log('='.repeat(60) + '\n');

  // Create output directory
  await fs.ensureDir(OUTPUT_DIR);

  // Generate all images
  for (const scene of storyScenes) {
    await generateImage(scene.description, scene.scene);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Save story narration
  const narrationText = storyScenes
    .map(scene => `Scene ${scene.scene}: ${scene.narration}`)
    .join('\n\n');
  
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'story-narration.txt'),
    `Luna's Magical Night\n\n${narrationText}`
  );

  // Save scene data as JSON
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'scene-data.json'),
    JSON.stringify(storyScenes, null, 2)
  );

  console.log('✅ All scenes generated successfully!\n');
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);
  console.log('📋 Story: Luna\'s Magical Night\n');
  storyScenes.forEach(scene => {
    console.log(`   Scene ${scene.scene}: "${scene.narration}"`);
  });
  console.log('\n🎬 Next step: Creating video with voiceover and music...\n');
}

generateAllScenes().catch(console.error);

