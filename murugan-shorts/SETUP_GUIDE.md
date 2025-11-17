# Murugan Shorts - Complete Setup Guide

## 🎬 Project Overview

This is a professional YouTube Shorts animation project built with React and Remotion. It creates a 10-second video with animated Tamil slogans on a Murugan-themed background.

## 📋 What's Included

### Components

1. **MuruganShorts.tsx** - Main composition
   - Orchestrates all animations
   - Manages slogan sequencing
   - Handles timing and layout

2. **AnimatedSlogan.tsx** - Slogan animation
   - Scale animation (0.5x → 1x → 0.5x)
   - Rotation effect (-10° → 0°)
   - Slide-up animation (100px → 0px → -100px)
   - Golden glow with pulsing effect
   - Smooth fade in/out

3. **BackgroundImage.tsx** - Background design
   - Purple gradient (Murugan-themed)
   - Decorative golden elements
   - Radial gradients for depth
   - Professional styling

## 🚀 Quick Start

### 1. Navigate to project
```bash
cd murugan-shorts
```

### 2. Preview the animation
```bash
npm start
```
- Opens http://localhost:3000
- Shows live preview with controls
- Real-time editing support

### 3. Render the final video
```bash
npm run render
```
- Generates `out/video.mp4`
- Ready for YouTube upload
- High quality output

## 🎨 Customization Guide

### Add More Slogans

Edit `src/MuruganShorts.tsx`:

```typescript
const slogans = [
  'வேலன் வாழ்க',
  'முருகன் வாழ்க',
  'சக்தி வாழ்க',
  'தமிழ் வாழ்க',
  'ஆறு முகம் ஆறு சக்தி',
  'நீ சேவல் நீ சேவல',  // Add new slogan
];
```

### Adjust Animation Speed

In `src/components/AnimatedSlogan.tsx`:

```typescript
const enterDuration = fps * 0.5;      // Change 0.5 to 1 for slower
const displayDuration = fps * 2;      // Change 2 to 3 for longer display
const exitDuration = fps * 0.5;       // Change 0.5 to 1 for slower exit
```

### Change Colors

In `src/components/BackgroundImage.tsx`:

```typescript
// Change gradient colors
background: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #1a0033 100%)'

// Change text color in AnimatedSlogan.tsx
color: '#FFD700'  // Change to any hex color
```

### Modify Video Duration

In `src/index.tsx`:

```typescript
<Composition
  durationInFrames={300}  // Change to 600 for 20 seconds at 30fps
  fps={30}               // Change to 60 for smoother animation
  width={1080}           // YouTube Shorts width
  height={1920}          // YouTube Shorts height
/>
```

## 📊 Animation Details

### Slogan Animation Timeline

Each slogan follows this timeline:

```
0s ─────────────────────────────────────────────────────── 3.3s
│   Enter (0.5s)  │  Display (2s)  │  Exit (0.5s)  │
│   Scale: 0.5→1  │  Scale: 1      │  Scale: 1→0.5 │
│   Opacity: 0→1  │  Opacity: 1    │  Opacity: 1→0 │
│   Rotate: -10°  │  Rotate: 0°    │  Rotate: 0°   │
│   Y: 100px→0px  │  Y: 0px        │  Y: 0px→-100px│
```

### Text Effects

- **Glow**: `drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))`
- **Pulse**: Animated brightness variation
- **Shadow**: Multiple layers for depth
- **Letter Spacing**: 2px for elegance

## 🎯 Video Specifications

| Property | Value |
|----------|-------|
| Format | YouTube Shorts |
| Width | 1080px |
| Height | 1920px |
| Duration | 10 seconds |
| Frame Rate | 30 fps |
| Total Frames | 300 |
| Output | MP4 |

## 🔧 Advanced Customization

### Add Background Image

Replace gradient in `BackgroundImage.tsx`:

```typescript
import { Img } from 'remotion';

<Img
  src="path/to/murugan-image.jpg"
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }}
/>
```

### Add Audio

In `MuruganShorts.tsx`:

```typescript
import { Audio } from 'remotion';

<Audio src="path/to/audio.mp3" />
```

### Add Transitions

Modify `AnimatedSlogan.tsx` easing:

```typescript
easing: Easing.inOut(Easing.cubic)  // Different easing functions
```

## 📦 Dependencies

- **remotion**: ^4.0.373 - Video rendering
- **react**: ^19.2.0 - UI framework
- **react-dom**: ^19.2.0 - DOM rendering
- **typescript**: ^5.0.0 - Type safety

## 🐛 Troubleshooting

### Preview not loading
```bash
npm start
# If still not working, clear cache:
rm -rf node_modules package-lock.json
npm install
npm start
```

### Render fails
```bash
# Ensure ffmpeg is installed
ffmpeg -version

# If not installed:
# Windows: winget install ffmpeg
# Mac: brew install ffmpeg
# Linux: sudo apt-get install ffmpeg
```

### TypeScript errors
```bash
npm run build
# Check for type errors and fix them
```

## 📤 Upload to YouTube

1. Render the video: `npm run render`
2. Go to YouTube Studio
3. Click "Create" → "Upload video"
4. Select `out/video.mp4`
5. Add title, description, tags
6. Set as "Shorts"
7. Publish!

## 💡 Tips & Tricks

1. **Test locally first**: Use `npm start` to preview
2. **Adjust timing**: Make slogans display longer for readability
3. **Add music**: Use royalty-free Tamil music
4. **Multiple videos**: Duplicate and change slogans
5. **Batch rendering**: Create multiple compositions

## 📚 Resources

- [Remotion Documentation](https://www.remotion.dev/)
- [React Documentation](https://react.dev/)
- [YouTube Shorts Guidelines](https://support.google.com/youtube/answer/7127767)

## 🎓 Learning Path

1. Understand Remotion basics
2. Modify slogans and colors
3. Adjust animation timing
4. Add custom background
5. Integrate audio
6. Create variations

Enjoy creating! 🎬✨

