# 🎙️ Adding Gleeful Narration to Luna's Story

## 🌟 Current Status

✅ All 5 voiceover files are ready in the `story/` folder:
- `voiceover-1.mp3` - "High in the tallest tree, Luna the owl wakes with glee!"
- `voiceover-2.mp3` - "Through the forest she takes flight, guided by the fireflies' light!"
- `voiceover-3.mp3` - "Felix the fox says come and see, the magic mushroom jubilee!"
- `voiceover-4.mp3` - "Stars are falling from above, filling hearts with joy and love!"
- `voiceover-5.mp3` - "Home again as dawn draws near, Luna dreams without a fear!"

## 🎵 Option 1: Combine All Audio Files (Recommended)

To have continuous narration throughout all 5 scenes, combine the audio files into one:

### Method A: Using Online Tool (Easiest)

1. **Go to:** https://audio-joiner.com/
2. **Upload all 5 voiceover files** in order (voiceover-1 through voiceover-5)
3. **Adjust gaps** between files (add 6-8 seconds silence between each to match scene timing)
4. **Click "Join"** and download
5. **Save as:** `story/full-narration.mp3`
6. **Update `src/project.ts`:**
   ```typescript
   import fullNarration from '../story/full-narration.mp3';
   
   export default makeProject({
     // ...
     audio: fullNarration,
   });
   ```

### Method B: Using FFmpeg (Advanced)

If you have FFmpeg installed:

```powershell
# Navigate to story folder
cd story

# Create a file list
echo file 'voiceover-1.mp3' > filelist.txt
echo file 'voiceover-2.mp3' >> filelist.txt
echo file 'voiceover-3.mp3' >> filelist.txt
echo file 'voiceover-4.mp3' >> filelist.txt
echo file 'voiceover-5.mp3' >> filelist.txt

# Combine all files
ffmpeg -f concat -safe 0 -i filelist.txt -c copy full-narration.mp3
```

### Method C: Using Audacity (Free Software)

1. **Download Audacity:** https://www.audacityteam.org/
2. **Open Audacity**
3. **File → Import → Audio** - Select all 5 voiceover files
4. **Arrange tracks** in order (drag to reorder)
5. **Add silence** between tracks: Generate → Silence (6-8 seconds)
6. **File → Export → Export as MP3**
7. **Save as:** `story/full-narration.mp3`

## 🎵 Option 2: Use Individual Audio Per Scene (Current Setup)

Currently, only `voiceover-1.mp3` is playing as a demo. Motion Canvas doesn't support per-scene audio natively in the project config, but you can:

1. **Manually time the audio** - The full narration will play from the start, and you time your scenes to match
2. **Use video editing** - Export the animation without audio, then add voiceovers in a video editor

## 🎬 After Adding Audio

1. **Restart the dev server:**
   ```powershell
   # Press Ctrl+C to stop
   npm start
   ```

2. **In Motion Canvas editor:**
   - You'll see the audio waveform at the bottom
   - Hold **SHIFT** and drag the audio track to adjust timing
   - Use the timeline to sync scenes with narration

3. **Adjust scene durations** in each scene file to match voiceover length:
   ```typescript
   yield* waitFor(8);  // Change duration to match audio
   ```

## 🎨 Tips for Perfect Sync

### Scene Timing Guide:
- **Scene 1:** ~8 seconds (voiceover-1 length)
- **Scene 2:** ~8 seconds (voiceover-2 length)
- **Scene 3:** ~8 seconds (voiceover-3 length)
- **Scene 4:** ~8 seconds (voiceover-4 length)
- **Scene 5:** ~10 seconds (voiceover-5 length + ending)

### To Check Audio Length:
1. Right-click on any voiceover file
2. Properties → Details → Length
3. Adjust `waitFor()` values in scene files to match

## 🌟 Bonus: Add Background Music

Want magical background music behind the narration?

1. **Get royalty-free music:**
   - YouTube Audio Library: https://studio.youtube.com/
   - Pixabay Music: https://pixabay.com/music/
   - Search: "magical lullaby", "gentle kids music", "peaceful night music"

2. **Mix audio files:**
   - Use Audacity to combine narration + background music
   - Lower background music volume to -15dB to -20dB
   - Export as `story/full-audio-with-music.mp3`

3. **Update project.ts** to use the mixed audio

## 🚀 Quick Start (Simplest Option)

**Just want to hear the narration now?**

The project is already set up with `voiceover-1.mp3` playing! 

1. **Restart the server** (if not already running):
   ```powershell
   npm start
   ```

2. **Open browser:** http://localhost:9000

3. **Click Play (▶️)** - You'll hear the first narration!

4. **To add all narrations:** Follow Option 1 above to combine all audio files

---

**Need help?** Check the main README.md for more details!

