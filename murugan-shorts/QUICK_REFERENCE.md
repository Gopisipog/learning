# ⚡ Murugan Shorts - Quick Reference

## 🚀 One-Minute Start

```bash
cd murugan-shorts
npm start
# Opens http://localhost:3000
```

## 📝 Common Tasks

### Change Slogans
**File**: `src/MuruganShorts.tsx`
```typescript
const slogans = [
  'Your slogan 1',
  'Your slogan 2',
];
```

### Change Text Color
**File**: `src/components/AnimatedSlogan.tsx`
```typescript
color: '#FFD700'  // Change to any hex color
```

### Change Background Color
**File**: `src/components/BackgroundImage.tsx`
```typescript
background: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #1a0033 100%)'
```

### Make Animations Faster
**File**: `src/components/AnimatedSlogan.tsx`
```typescript
const enterDuration = fps * 0.3;      // Was 0.5
const displayDuration = fps * 1.5;    // Was 2
const exitDuration = fps * 0.3;       // Was 0.5
```

### Make Video Longer
**File**: `src/index.tsx`
```typescript
durationInFrames={600}  // 20 seconds at 30fps (was 300)
```

### Add More Slogans
**File**: `src/MuruganShorts.tsx`
```typescript
const slogans = [
  'வேலன் வாழ்க',
  'முருகன் வாழ்க',
  'சக்தி வாழ்க',
  'தமிழ் வாழ்க',
  'ஆறு முகம் ஆறு சக்தி',
  'Your new slogan',  // Add here
];
```

---

## 🎬 Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Preview animation |
| `npm run render` | Create video |
| `npm run build` | Check TypeScript |
| `npm install` | Install dependencies |

---

## 🎨 Color Codes

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | #FFD700 | Text (default) |
| Purple | #1a0033 | Background |
| Purple | #330066 | Background |
| Orange | #FF6B35 | Alternative text |
| Cyan | #00D9FF | Alternative text |

---

## 📊 Animation Timing

```
Each Slogan: 3.3 seconds
├─ Enter: 0.5s (scale 0.5→1, rotate -10°→0°)
├─ Display: 2s (static)
└─ Exit: 0.5s (scale 1→0.5, fade out)
```

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `src/index.tsx` | Remotion setup |
| `src/MuruganShorts.tsx` | Main component |
| `src/components/AnimatedSlogan.tsx` | Animations |
| `src/components/BackgroundImage.tsx` | Background |

---

## 🔧 Configuration

### Video Settings
**File**: `src/index.tsx`
```typescript
<Composition
  durationInFrames={300}  // Total frames
  fps={30}                // Frame rate
  width={1080}            // Width
  height={1920}           // Height
/>
```

### Animation Settings
**File**: `src/components/AnimatedSlogan.tsx`
```typescript
const enterDuration = fps * 0.5;      // Enter time
const displayDuration = fps * 2;      // Display time
const exitDuration = fps * 0.5;       // Exit time
```

---

## 🎯 Slogan Collections

### Default (Devotional)
```
வேலன் வாழ்க
முருகன் வாழ்க
சக்தி வாழ்க
தமிழ் வாழ்க
ஆறு முகம் ஆறு சக்தி
```

### Motivational
```
வெற்றி வாழ்க
தைரியம் வாழ்க
உழைப்பு வாழ்க
நம்பிக்கை வாழ்க
கனவு வாழ்க
```

### Tamil Pride
```
தமிழ் வாழ்க
தமிழ் மொழி வாழ்க
தமிழ் நாடு வாழ்க
தமிழ் பண்பாடு வாழ்க
தமிழ் ஐதீகம் வாழ்க
```

---

## 🐛 Quick Fixes

### Preview not loading
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### FFmpeg not found
```bash
# Windows
winget install ffmpeg

# Mac
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg
```

### Port 3000 in use
```bash
PORT=3001 npm start
```

---

## 📱 YouTube Upload

1. Render: `npm run render`
2. Go to YouTube Studio
3. Upload `out/video.mp4`
4. Set as "Shorts"
5. Publish!

---

## 📚 Documentation Map

| Document | When to Read |
|----------|--------------|
| README.md | First time |
| SETUP_GUIDE.md | Want to customize |
| EXAMPLES.md | Want variations |
| ARCHITECTURE.md | Want to understand code |
| FAQ_TROUBLESHOOTING.md | Have a problem |
| INDEX.md | Need navigation |

---

## ✅ Pre-Render Checklist

- [ ] Slogans are correct
- [ ] Colors look good
- [ ] Animations are smooth
- [ ] No TypeScript errors
- [ ] FFmpeg installed

---

## 🎬 Video Specs

- **Format**: YouTube Shorts
- **Resolution**: 1080x1920
- **Duration**: 10 seconds
- **FPS**: 30
- **Output**: out/video.mp4

---

## 💡 Pro Tips

1. **Preview first**: Always use `npm start` before rendering
2. **Test changes**: Make small changes and preview
3. **Use examples**: Check EXAMPLES.md for ideas
4. **Read docs**: Check relevant doc for help
5. **Close apps**: Close other apps before rendering

---

## 🔗 Quick Links

- [Remotion Docs](https://www.remotion.dev/)
- [React Docs](https://react.dev/)
- [YouTube Shorts](https://www.youtube.com/shorts)

---

**Need more help? Check INDEX.md for full documentation!** 📚

