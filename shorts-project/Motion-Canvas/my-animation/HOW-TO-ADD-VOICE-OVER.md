# 🎙️ How to Add Anime-Style Voice-Over to Your Animation

## Quick 3-Step Process

### Step 1: Generate Anime-Style Voice-Over Audio (5 minutes)

**🎌 Best Method for Anime Voice - ElevenLabs or Uberduck:**

#### Option A: ElevenLabs (Recommended - High Quality Anime Voices)

1. Open your browser and go to: **https://elevenlabs.io/**
2. Sign up for free (10,000 characters/month)
3. Click "Speech Synthesis"
4. Select an anime-style voice or create a custom voice
5. Copy this complete narration script:

```
Benny the Bunny's Adventure. A Magical Forest Story.

One sunny morning in the magical forest, meet Benny the Bunny! With his fluffy white fur and pink ears, Benny loved to hop and play.

Soon, Benny met Bella the Bird, perched high in a tree. Bella flapped her wings and chirped, Hello, Benny! Let's go on an adventure!

Together, they found the magic rainbow! Benny, Bella, and their butterfly friend jumped for joy. And they all lived happily ever after. The End!
```

6. Paste the narration script
7. Click **"Generate"**
8. Download and save as `full-narration.mp3`
9. Move the downloaded file to: `my-animation/audio/full-narration.mp3`

#### Option B: Uberduck AI (Anime Character Voices - FREE)

1. Go to: **https://uberduck.ai/**
2. Sign up for free account
3. Select "Text to Speech"
4. **Choose an anime character voice** (they have many anime voices!)
5. Paste the narration script
6. Generate and download as `full-narration.mp3`
7. Save to: `my-animation/audio/full-narration.mp3`

#### Option C: Voicevox (Japanese Anime-Style TTS - FREE)

1. Download from: **https://voicevox.hiroshiba.jp/**
2. Install the software (Windows/Mac/Linux)
3. Select an anime-style voice character
4. Input your text
5. Export as MP3
6. Save to: `my-animation/audio/full-narration.mp3`

#### Option D: TTSMaker with Anime-Style Settings

1. Go to: **https://ttsmaker.com/**
2. **Settings for anime-like voice:**
   - Language: English (US) or Japanese
   - Voice: Select a young female voice
   - Speed: Slightly faster (1.1x - 1.2x for energetic anime feel)
   - Pitch: Higher (+2 to +5 for cute anime voice)
3. Paste narration, generate, and download

---

### Step 2: Enable Audio in Your Project

1. Open the file: `src/project.ts`

2. **Uncomment these two lines** (remove the `//` at the start):

```typescript
// Change this:
// import narration from '../audio/full-narration.mp3';

// To this:
import narration from '../audio/full-narration.mp3';

// And change this:
// audio: narration,

// To this:
audio: narration,
```

3. Save the file

---

### Step 3: Adjust Audio Timing

1. The dev server should automatically reload
2. In the Motion Canvas editor, you'll see the audio waveform at the bottom
3. Hold **SHIFT** and drag the audio track left/right to sync with animation
4. Or use the **Video Settings** tab to adjust the offset

---

## 🎌 Best Anime Voice-Over Resources

### Recommended Anime Voice Generators:

1. **Uberduck AI** ⭐ (Best for Anime Characters)
   - Website: https://uberduck.ai/
   - Has actual anime character voices
   - Free tier available
   - Voices: Naruto, Goku, anime girl voices, etc.

2. **ElevenLabs** (High Quality Custom Voices)
   - Website: https://elevenlabs.io/
   - Can clone anime-style voices
   - Very natural sounding
   - Free: 10,000 characters/month

3. **Voicevox** (Japanese Anime TTS)
   - Website: https://voicevox.hiroshiba.jp/
   - Free desktop software
   - Multiple anime character voices
   - Japanese and English support

4. **Coqui TTS** (Open Source)
   - Website: https://github.com/coqui-ai/TTS
   - Free and open source
   - Anime-style voice models available

5. **15.ai** (Anime Character Voices)
   - Website: https://15.ai/
   - Free anime character voices
   - High quality

### Tips for Anime-Style Voice:
- Use higher pitch settings (+3 to +5)
- Slightly faster speed (1.1x - 1.3x)
- Add emotion/energy to the delivery
- Consider using Japanese accent for authentic anime feel

---

## Separate Audio Per Scene (Advanced)

If you want different audio for each scene, you can use the `Audio` component:

1. Generate 4 separate audio files (see `audio/README.md`)
2. Import them in each scene file
3. Use the `Audio` component (see Motion Canvas docs)

---

## Troubleshooting

**Audio not showing up?**
- Make sure the file is named exactly `full-narration.mp3`
- Make sure it's in the `audio` folder
- Check that you uncommented both lines in `project.ts`
- Restart the dev server: Stop (Ctrl+C) and run `npm start` again

**Audio out of sync?**
- Hold SHIFT and drag the audio track in the timeline
- Or adjust timing in Video Settings tab

---

## 🎵 Bonus: Add Background Music

1. Download royalty-free music from:
   - YouTube Audio Library
   - Pixabay: https://pixabay.com/music/
   - Free Music Archive

2. Look for "kids playful music" or "happy children music"

3. Save as `audio/background-music.mp3`

4. In `project.ts`, you can add it as a second audio track (check Motion Canvas docs for multiple audio tracks)

---

## Need Help?

Check the voice-over script in: `voice-over-script.md`
Check audio folder instructions: `audio/README.md`

