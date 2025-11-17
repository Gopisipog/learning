# 🎌 Anime-Style Voice-Over Guide

## 🌟 Quick Start - Best Anime Voice Options

### Option 1: Uberduck AI (Easiest - Actual Anime Voices!) ⭐ RECOMMENDED

**Why:** Has real anime character voices and anime-style voices

**Steps:**
1. Go to: **https://uberduck.ai/**
2. Click "Sign Up" (free account)
3. Go to "Text to Speech"
4. **Select Voice:** Browse for anime characters or anime-style voices
   - Search for: "anime girl", "anime boy", or specific characters
   - Popular: Anime female voices, energetic young voices
5. Paste your narration script (see below)
6. Click "Synthesize"
7. Download the audio file
8. Save as: `my-animation/audio/full-narration.mp3`

---

### Option 2: ElevenLabs (High Quality Custom Anime Voice)

**Why:** Best quality, can create custom anime-style voices

**Steps:**
1. Go to: **https://elevenlabs.io/**
2. Sign up (free 10,000 characters/month)
3. Click "Speech Synthesis"
4. **Voice Selection:**
   - Try "Bella" or "Rachel" with higher pitch
   - Or use "Voice Lab" to create custom anime voice
   - Adjust settings: Higher pitch, energetic tone
5. Paste narration script
6. Click "Generate"
7. Download and save to: `my-animation/audio/full-narration.mp3`

---

### Option 3: Voicevox (Free Japanese Anime TTS Software)

**Why:** Professional anime-style voices, completely free

**Steps:**
1. Download from: **https://voicevox.hiroshiba.jp/**
2. Install the software (Windows/Mac/Linux)
3. Launch Voicevox
4. Select an anime character voice (multiple available)
5. Type or paste your script
6. Adjust pitch and speed for desired effect
7. Export as WAV or MP3
8. Save to: `my-animation/audio/full-narration.mp3`

---

### Option 4: 15.ai (Anime Character Voices)

**Why:** Free, high-quality anime character voices

**Steps:**
1. Go to: **https://15.ai/**
2. Select an anime character voice
3. Enter your text
4. Generate and download
5. Save to: `my-animation/audio/full-narration.mp3`

---

## 📝 Narration Script for Anime Voice

```
Benny the Bunny's Adventure! A Magical Forest Story!

One sunny morning in the magical forest, meet Benny the Bunny! With his fluffy white fur and pink ears, Benny loved to hop and play!

Soon, Benny met Bella the Bird, perched high in a tree! Bella flapped her wings and chirped, "Hello, Benny! Let's go on an adventure!"

Together, they found the magic rainbow! Benny, Bella, and their butterfly friend jumped for joy! And they all lived happily ever after! The End!
```

**Anime Voice Tips:**
- Add exclamation marks for energy!
- Use enthusiastic, upbeat tone
- Slightly faster pace
- Higher pitch for cute anime feel

---

## 🎨 Anime Voice Settings Guide

### For TTSMaker (if using):
- **Language:** English (US)
- **Voice:** Young female voice
- **Speed:** 1.2x (faster, more energetic)
- **Pitch:** +4 to +6 (higher, cuter)
- **Volume:** Normal

### For ElevenLabs:
- **Stability:** 50-60% (more expressive)
- **Clarity:** 70-80%
- **Style Exaggeration:** 30-40% (more animated)

### For Uberduck:
- Just select an anime character voice
- Default settings usually work great!

---

## 🎭 Character Voice Suggestions

### For Benny (Bunny):
- Cute, energetic anime girl voice
- Higher pitch, playful tone

### For Narrator:
- Warm, friendly anime narrator voice
- Medium-high pitch, clear and expressive

### Alternative: Multiple Voices
You can create separate audio files for different characters:
- `benny-voice.mp3` - Bunny's dialogue
- `bella-voice.mp3` - Bird's dialogue  
- `narrator-voice.mp3` - Narration

---

## 🚀 After Generating Your Anime Voice:

1. Save the audio file as: `full-narration.mp3`
2. Place it in: `my-animation/audio/` folder
3. Open `src/project.ts`
4. Uncomment these lines:
   ```typescript
   import narration from '../audio/full-narration.mp3';
   ```
   and
   ```typescript
   audio: narration,
   ```
5. Save and the animation will reload with anime voice-over! 🎉

---

## 🎵 Bonus: Anime Background Music

Free anime-style music sources:
- **YouTube Audio Library** - Search "anime music"
- **Pixabay Music** - https://pixabay.com/music/ (search "anime" or "Japanese")
- **Free Music Archive** - Anime/J-Pop category
- **Incompetech** - https://incompetech.com/ (Kevin MacLeod's music)

Save as: `audio/background-music.mp3`

---

## Need Help?

- Check main guide: `HOW-TO-ADD-VOICE-OVER.md`
- Check audio folder: `audio/README.md`
- Voice script: `voice-over-script.md`

