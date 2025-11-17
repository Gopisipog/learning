# Murugan Shorts - YouTube Shorts Animation

A React + Remotion project that creates animated YouTube Shorts with Murugan-themed background and Tamil slogans with professional animations.

## Features

✨ **Animated Slogans**
- 5 Tamil slogans with smooth animations
- Scale, rotation, and slide-up effects
- Golden glow text effects with pulsing animation
- Smooth fade in/out transitions

🎨 **Professional Design**
- Murugan-themed purple gradient background
- Decorative golden elements
- YouTube Shorts format (1080x1920)
- 10-second video (300 frames at 30fps)

## Project Structure

```
murugan-shorts/
├── src/
│   ├── index.tsx                 # Remotion composition setup
│   ├── MuruganShorts.tsx         # Main component
│   └── components/
│       ├── AnimatedSlogan.tsx    # Slogan animation component
│       └── BackgroundImage.tsx   # Background component
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

```bash
cd murugan-shorts
npm install
```

## Usage

### Preview the animation
```bash
npm start
```
This opens the Remotion preview at http://localhost:3000

### Render the video
```bash
npm run render
```
This generates the final MP4 video in the `out/` directory

## Customization

### Change Slogans
Edit `src/MuruganShorts.tsx` and modify the `slogans` array:

```typescript
const slogans = [
  'வேலன் வாழ்க',
  'முருகன் வாழ்க',
  'சக்தி வாழ்க',
  'தமிழ் வாழ்க',
  'ஆறு முகம் ஆறு சக்தி',
];
```

### Adjust Animation Timing
In `src/components/AnimatedSlogan.tsx`, modify:
- `enterDuration`: How long the slogan takes to appear
- `displayDuration`: How long the slogan stays visible
- `exitDuration`: How long the slogan takes to disappear

### Change Colors
In `src/components/BackgroundImage.tsx`, modify the gradient colors:
```typescript
background: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #1a0033 100%)'
```

## Video Specifications

- **Format**: YouTube Shorts (1080x1920)
- **Duration**: 10 seconds
- **Frame Rate**: 30 fps
- **Total Frames**: 300
- **Output**: MP4 video

## Technologies Used

- **React 19**: UI framework
- **Remotion 4**: Video rendering library
- **TypeScript**: Type-safe development
- **CSS Animations**: Pulsing glow effects

## Output

The rendered video will be saved as `out/video.mp4` and is ready to upload to YouTube Shorts!

## Tips

1. **For better quality**: Increase the fps or resolution in `src/index.tsx`
2. **For longer videos**: Increase `durationInFrames` and add more slogans
3. **For custom background**: Replace the gradient with an image using `Img` component from Remotion
4. **For audio**: Use Remotion's `Audio` component to add background music

## License

ISC

