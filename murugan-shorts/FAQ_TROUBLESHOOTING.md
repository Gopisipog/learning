# ❓ FAQ & Troubleshooting

## 🤔 Frequently Asked Questions

### Q1: How do I change the slogans?

**A:** Edit `src/MuruganShorts.tsx`:

```typescript
const slogans = [
  'Your slogan 1',
  'Your slogan 2',
  'Your slogan 3',
];
```

Then run `npm start` to preview changes.

---

### Q2: How long does rendering take?

**A:** Depends on your system:
- **Fast PC**: 2-5 minutes
- **Average PC**: 5-10 minutes
- **Slow PC**: 10-20 minutes

Rendering uses all CPU cores, so close other apps for faster rendering.

---

### Q3: Can I add background music?

**A:** Yes! Add to `src/MuruganShorts.tsx`:

```typescript
import { Audio } from 'remotion';

export const MuruganShorts: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src="path/to/your/audio.mp3" />
      {/* Rest of component */}
    </AbsoluteFill>
  );
};
```

---

### Q4: How do I upload to YouTube?

**A:** 
1. Render: `npm run render`
2. Go to YouTube Studio
3. Click "Create" → "Upload video"
4. Select `out/video.mp4`
5. Add title, description, tags
6. Set as "Shorts"
7. Publish!

---

### Q5: Can I make the video longer?

**A:** Yes! In `src/index.tsx`:

```typescript
<Composition
  durationInFrames={600}  // 20 seconds at 30fps
  fps={30}
/>
```

And add more slogans in `src/MuruganShorts.tsx`.

---

### Q6: How do I change colors?

**A:** Edit `src/components/BackgroundImage.tsx` and `src/components/AnimatedSlogan.tsx`:

```typescript
// Background gradient
background: 'linear-gradient(135deg, #color1 0%, #color2 50%, #color1 100%)'

// Text color
color: '#FFD700'
```

---

### Q7: Can I use a custom background image?

**A:** Yes! In `src/components/BackgroundImage.tsx`:

```typescript
import { Img } from 'remotion';

<Img
  src="path/to/image.jpg"
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }}
/>
```

---

### Q8: How do I make animations faster/slower?

**A:** Edit `src/components/AnimatedSlogan.tsx`:

```typescript
const enterDuration = fps * 0.5;      // Change 0.5
const displayDuration = fps * 2;      // Change 2
const exitDuration = fps * 0.5;       // Change 0.5
```

---

### Q9: What's the best video quality?

**A:** For YouTube Shorts:
- Resolution: 1080x1920 (already set)
- FPS: 30 (good balance) or 60 (smoother)
- Bitrate: Auto (Remotion handles it)

---

### Q10: Can I create multiple videos?

**A:** Yes! Create multiple compositions in `src/index.tsx`:

```typescript
<Composition
  id="MuruganShorts1"
  component={MuruganShorts}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1920}
/>
<Composition
  id="MuruganShorts2"
  component={MuruganShorts}
  durationInFrames={300}
  fps={30}
  width={1080}
  height={1920}
/>
```

---

## 🐛 Troubleshooting

### Issue: Preview not loading

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

---

### Issue: "Cannot find module 'remotion'"

**Solution:**
```bash
npm install remotion react react-dom
npm install --save-dev @types/react @types/react-dom typescript
```

---

### Issue: TypeScript errors

**Solution:**
```bash
# Check for errors
npm run build

# Fix common issues
# 1. Check file paths
# 2. Ensure all imports are correct
# 3. Check component props
```

---

### Issue: Render fails with "ffmpeg not found"

**Solution:**

**Windows:**
```bash
winget install ffmpeg
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

---

### Issue: Video output is too large

**Solution:** Remotion automatically optimizes, but you can:
1. Reduce fps: `fps={24}` instead of 30
2. Reduce resolution (not recommended for Shorts)
3. Use video compression tools

---

### Issue: Animations look choppy

**Solution:**
1. Increase fps: `fps={60}` instead of 30
2. Check system resources
3. Close other applications
4. Reduce other visual effects

---

### Issue: Text is blurry

**Solution:**
1. Increase font size
2. Use higher resolution (already 1080x1920)
3. Ensure font is installed
4. Use system fonts (Arial, Helvetica, etc.)

---

### Issue: Colors look different in preview vs render

**Solution:**
1. This is normal (preview uses browser rendering)
2. Render output is more accurate
3. Adjust colors based on render output
4. Use standard hex colors

---

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

---

### Issue: Out of memory during render

**Solution:**
1. Close other applications
2. Reduce video duration
3. Reduce fps
4. Restart computer
5. Render in smaller chunks

---

## 🔍 Debug Tips

### Enable verbose logging
```bash
DEBUG=remotion:* npm start
```

### Check component rendering
Add console.log in components:
```typescript
console.log('Frame:', frame);
console.log('Opacity:', opacity);
```

### Test individual components
Create test files to isolate issues.

---

## 📞 Getting Help

1. **Check documentation**: README.md, SETUP_GUIDE.md
2. **Review examples**: EXAMPLES.md
3. **Check architecture**: ARCHITECTURE.md
4. **Remotion docs**: https://www.remotion.dev/
5. **React docs**: https://react.dev/

---

## ✅ Verification Checklist

Before rendering:
- [ ] Slogans are correct
- [ ] Colors look good in preview
- [ ] Animations are smooth
- [ ] Duration is correct
- [ ] No TypeScript errors
- [ ] FFmpeg is installed

Before uploading:
- [ ] Video renders successfully
- [ ] Output file exists: `out/video.mp4`
- [ ] Video plays correctly
- [ ] Duration is 10 seconds
- [ ] Resolution is 1080x1920

---

**Still stuck? Check the documentation files or Remotion's official docs!** 📚

