import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const API_HOST = 'https://api.stability.ai';

// Story scenes for a kids animated story
const storyScenes = [
  {
    scene: 1,
    description: "A cheerful little bunny named Bella waking up in a cozy burrow, sunlight streaming through the entrance, children's book illustration style, bright colors, cute and friendly",
    narration: "Once upon a time, in a cozy burrow beneath a big oak tree, lived a cheerful little bunny named Bella."
  },
  {
    scene: 2,
    description: "Bella the bunny hopping through a colorful meadow full of flowers, butterflies flying around, happy expression, children's book illustration style, vibrant colors",
    narration: "One sunny morning, Bella hopped out to explore the beautiful meadow filled with colorful flowers."
  },
  {
    scene: 3,
    description: "Bella the bunny meeting a friendly squirrel named Sam on a tree branch, both smiling, acorns nearby, children's book illustration style, warm colors",
    narration: "Along the way, she met her friend Sam the squirrel, who was gathering acorns for winter."
  },
  {
    scene: 4,
    description: "Bella and Sam discovering a sparkling stream with fish jumping, magical atmosphere, rainbow in the background, children's book illustration style, dreamy colors",
    narration: "Together, they discovered a magical sparkling stream where fish danced in the sunlight."
  },
  {
    scene: 5,
    description: "Bella and Sam helping a baby bird back to its nest in a tree, mother bird watching gratefully, heartwarming scene, children's book illustration style, soft colors",
    narration: "They heard a tiny chirp and found a baby bird. Working together, they helped it back to its nest."
  },
  {
    scene: 6,
    description: "Bella the bunny back in her cozy burrow at sunset, looking happy and tired, warm orange glow, peaceful scene, children's book illustration style, gentle colors",
    narration: "As the sun set, Bella returned home, her heart full of joy from a day of friendship and adventure."
  }
];

async function generateImage(prompt, negativePrompt) {
  // Using Stable Diffusion 3 API endpoint
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('negative_prompt', negativePrompt);
  formData.append('aspect_ratio', '16:9');
  formData.append('model', 'sd3-medium');
  formData.append('output_format', 'png');

  const response = await fetch(
    `${API_HOST}/v2beta/stable-image/generate/sd3`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'image/*',
        ...formData.getHeaders()
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed (${response.status}): ${errorText}`);
  }

  // Response is the image binary data
  const imageBuffer = await response.arrayBuffer();
  return Buffer.from(imageBuffer);
}

async function generateStoryImages() {
  console.log('🎨 Starting Kids Animated Story Generation...\n');

  if (!STABILITY_API_KEY) {
    console.error('❌ Error: STABILITY_API_KEY not found in environment variables');
    console.log('Please create a .env file with your API key (see .env.example)');
    return;
  }

  // Create output directory
  const outputDir = path.join(__dirname, 'story-output');
  await fs.ensureDir(outputDir);

  console.log(`📁 Output directory: ${outputDir}\n`);

  // Generate images for each scene
  for (const scene of storyScenes) {
    console.log(`🖼️  Generating Scene ${scene.scene}...`);
    console.log(`📝 Narration: ${scene.narration}`);
    console.log(`🎨 Prompt: ${scene.description}\n`);

    try {
      const imageBuffer = await generateImage(
        scene.description,
        'scary, dark, violent, realistic, photographic, adult themes, horror'
      );

      const filename = `scene-${scene.scene.toString().padStart(2, '0')}.png`;
      const filepath = path.join(outputDir, filename);

      // Save the image buffer directly
      await fs.writeFile(filepath, imageBuffer);

      console.log(`✅ Scene ${scene.scene} saved: ${filename}\n`);

      // Add delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`❌ Error generating scene ${scene.scene}:`, error.message);
      console.error('Full error:', error);
    }
  }
  
  // Save story narration
  const narrationPath = path.join(outputDir, 'story-narration.txt');
  const narrationText = storyScenes
    .map(scene => `Scene ${scene.scene}:\n${scene.narration}\n`)
    .join('\n');
  
  await fs.writeFile(narrationPath, narrationText);
  console.log('📖 Story narration saved to story-narration.txt');
  
  console.log('\n✨ Story generation complete!');
  console.log(`📂 Check the ${outputDir} folder for all images and narration.`);
}

// Run the story generator
generateStoryImages().catch(console.error);

