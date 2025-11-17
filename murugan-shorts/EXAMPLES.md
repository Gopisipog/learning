# Murugan Shorts - Examples & Variations

## 🎬 Example Variations

### Example 1: Faster Animation

**File**: `src/components/AnimatedSlogan.tsx`

```typescript
// Make animations faster
const enterDuration = fps * 0.3;      // 0.3 seconds
const displayDuration = fps * 1.5;    // 1.5 seconds
const exitDuration = fps * 0.3;       // 0.3 seconds
```

**Result**: Snappier, more energetic feel

---

### Example 2: Slower, More Dramatic

**File**: `src/components/AnimatedSlogan.tsx`

```typescript
// Make animations slower and more dramatic
const enterDuration = fps * 1;        // 1 second
const displayDuration = fps * 3;      // 3 seconds
const exitDuration = fps * 1;         // 1 second
```

**Result**: More time to read, dramatic effect

---

### Example 3: Different Color Scheme

**File**: `src/components/BackgroundImage.tsx`

```typescript
// Change to orange/red theme
background: 'linear-gradient(135deg, #330000 0%, #660000 50%, #330000 100%)'
```

**File**: `src/components/AnimatedSlogan.tsx`

```typescript
// Change text color to orange
color: '#FF6B35'
textShadow: '0 0 20px rgba(255, 107, 53, 0.8), 0 0 40px rgba(255, 50, 0, 0.6)'
```

---

### Example 4: Blue Theme

**File**: `src/components/BackgroundImage.tsx`

```typescript
// Blue gradient
background: 'linear-gradient(135deg, #001a4d 0%, #003d99 50%, #001a4d 100%)'
```

**File**: `src/components/AnimatedSlogan.tsx`

```typescript
// Cyan text
color: '#00D9FF'
textShadow: '0 0 20px rgba(0, 217, 255, 0.8), 0 0 40px rgba(0, 150, 255, 0.6)'
```

---

### Example 5: Extended Video (20 seconds)

**File**: `src/index.tsx`

```typescript
<Composition
  id="MuruganShorts"
  component={MuruganShorts}
  durationInFrames={600}  // 20 seconds at 30fps
  fps={30}
  width={1080}
  height={1920}
/>
```

**File**: `src/MuruganShorts.tsx`

```typescript
const slogans = [
  'வேலன் வாழ்க',
  'முருகன் வாழ்க',
  'சக்தி வாழ்க',
  'தமிழ் வாழ்க',
  'ஆறு முகம் ஆறு சக்தி',
  'வெற்றி வாழ்க',
  'சிவ சக்தி வாழ்க',
  'தமிழ் மொழி வாழ்க',
];
```

---

### Example 6: High Quality (60fps)

**File**: `src/index.tsx`

```typescript
<Composition
  id="MuruganShorts"
  component={MuruganShorts}
  durationInFrames={300}
  fps={60}  // Smoother animation
  width={1080}
  height={1920}
/>
```

---

### Example 7: Different Animation Style (Bounce)

**File**: `src/components/AnimatedSlogan.tsx`

```typescript
// Replace scale interpolation with bounce effect
const scale = interpolate(
  frame,
  [0, enterDuration * 0.5, enterDuration, displayDuration, displayDuration + exitDuration],
  [0.3, 1.2, 1, 1, 0.3],
  {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.bounce),
  }
);
```

---

### Example 8: Horizontal Slide Animation

**File**: `src/components/AnimatedSlogan.tsx`

```typescript
// Replace translateY with translateX for horizontal slide
const translateX = interpolate(
  frame,
  [0, enterDuration, displayDuration, displayDuration + exitDuration],
  [-200, 0, 0, 200],
  {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }
);

// Update transform
transform: `scale(${scale}) rotate(${rotation}deg) translateX(${translateX}px)`
```

---

### Example 9: Rotating Text

**File**: `src/components/AnimatedSlogan.tsx`

```typescript
// Full rotation animation
const rotation = interpolate(
  frame,
  [0, enterDuration, displayDuration, displayDuration + exitDuration],
  [-360, 0, 0, 360],
  {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  }
);
```

---

### Example 10: Gradient Text

**File**: `src/components/AnimatedSlogan.tsx`

```typescript
// Add gradient text effect
style={{
  fontSize: 72,
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #FFD700, #FF6B35, #FFD700)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  // ... rest of styles
}}
```

---

## 🎨 Color Palettes

### Murugan Purple (Default)
```
Primary: #1a0033
Secondary: #330066
Accent: #FFD700 (Gold)
```

### Saffron (Indian Flag)
```
Primary: #FF9933
Secondary: #FFFFFF
Accent: #138808 (Green)
```

### Sunset
```
Primary: #FF6B35
Secondary: #F7931E
Accent: #FDB833
```

### Ocean
```
Primary: #0066CC
Secondary: #0099FF
Accent: #00D9FF
```

---

## 📝 Slogan Collections

### Devotional Slogans
```typescript
const slogans = [
  'வேலன் வாழ்க',
  'முருகன் வாழ்க',
  'சக்தி வாழ்க',
  'தமிழ் வாழ்க',
  'ஆறு முகம் ஆறு சக்தி',
];
```

### Motivational Slogans
```typescript
const slogans = [
  'வெற்றி வாழ்க',
  'தைரியம் வாழ்க',
  'உழைப்பு வாழ்க',
  'நம்பிக்கை வாழ்க',
  'கனவு வாழ்க',
];
```

### Tamil Pride
```typescript
const slogans = [
  'தமிழ் வாழ்க',
  'தமிழ் மொழி வாழ்க',
  'தமிழ் நாடு வாழ்க',
  'தமிழ் பண்பாடு வாழ்க',
  'தமிழ் ஐதீகம் வாழ்க',
];
```

---

## 🚀 Quick Commands

```bash
# Preview with changes
npm start

# Render video
npm run render

# Build TypeScript
npm run build

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 💾 File Structure for Variations

```
murugan-shorts/
├── src/
│   ├── index.tsx
│   ├── MuruganShorts.tsx
│   ├── MuruganShorts-Extended.tsx    # 20 second version
│   ├── MuruganShorts-FastPaced.tsx   # Fast animation
│   └── components/
│       ├── AnimatedSlogan.tsx
│       ├── AnimatedSlogan-Bounce.tsx # Bounce effect
│       ├── AnimatedSlogan-Slide.tsx  # Horizontal slide
│       └── BackgroundImage.tsx
```

---

Experiment and have fun creating! 🎬✨

