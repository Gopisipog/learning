# Kids Animated Story Generator 🎨📚

Generate beautiful animated story sequences for kids using Stability AI's image generation API, then turn them into engaging rhyme shorts!

## Features

- 🐰 Pre-written kids story about Bella the Bunny
- 🎨 Generates 6 sequential story scenes with AI
- 🎬 Creates complete video shorts with rhymes
- 📱 Optimized for YouTube Shorts, TikTok, Instagram Reels
- 🎵 Easy background music integration
- 🌐 Interactive web slideshow
- 🖼️ Creates images in 16:9 aspect ratio (perfect for videos)
- 📖 Saves story narration and rhymes
- 🎭 Child-friendly, colorful illustration style

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Stability AI API Key** - Get one from [Stability AI Platform](https://platform.stability.ai/)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   - Copy `.env.example` to `.env`
   - Add your Stability AI API key:
   ```
   STABILITY_API_KEY=sk-your-actual-api-key-here
   ```

## Usage

### Step 1: Generate Story Images

```bash
npm run generate
```

This will:
1. Create a `story-output` folder
2. Generate 6 AI images (scene-01.png through scene-06.png)
3. Save story narration to `story-narration.txt`

### Step 2: Create Video Short

```bash
npm run video
```

This will:
1. Create a 24-second vertical video (1080x1920)
2. Add smooth crossfade transitions
3. Include rhyming text for each scene
4. Generate subtitle file (SRT format)
5. Output: `bella-rhyme-short.mp4`

### Step 3: Add Background Music (Optional)

```bash
npm run music
```

Follow the instructions to add royalty-free background music.

### Step 4: View Interactive Slideshow

Open `rhyme-slideshow.html` in your browser for an interactive presentation with:
- Auto-play feature
- Manual controls
- Animated rhyme text
- Beautiful transitions

## Story Overview

**"Bella's Adventure"** - A heartwarming tale about:
- Scene 1: Bella waking up in her cozy burrow
- Scene 2: Exploring a colorful meadow
- Scene 3: Meeting Sam the squirrel
- Scene 4: Discovering a magical stream
- Scene 5: Helping a baby bird
- Scene 6: Returning home at sunset

## Customization

Edit `story-generator.js` to create your own story:

```javascript
const storyScenes = [
  {
    scene: 1,
    description: "Your custom scene description...",
    narration: "Your story text..."
  },
  // Add more scenes...
];
```

## Output

All generated content is saved in the `story-output` folder:
- `scene-01.png` to `scene-06.png` - Story images
- `story-narration.txt` - Complete story text

## Creating Animation

You can use the generated images to create an animated video using tools like:
- **FFmpeg** - Command-line video creation
- **Adobe Premiere** - Professional video editing
- **iMovie** - Mac video editing
- **DaVinci Resolve** - Free professional editing

Example FFmpeg command to create a video:
```bash
ffmpeg -framerate 1/3 -i story-output/scene-%02d.png -c:v libx264 -pix_fmt yuv420p story.mp4
```

## API Costs

Each image generation uses Stability AI credits. Check [Stability AI Pricing](https://platform.stability.ai/pricing) for current rates.

## Troubleshooting

**Error: API request failed**
- Check your API key is correct
- Ensure you have credits in your Stability AI account

**Error: STABILITY_API_KEY not found**
- Make sure you created a `.env` file
- Verify the API key is properly set

## License

ISC

