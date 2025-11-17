#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate voiceovers for Luna's Magical Night story using Edge TTS
"""

import asyncio
import edge_tts
import os
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Story narration for each scene
narrations = [
    "High in the tallest tree, Luna the owl wakes with glee!",
    "Through the forest she takes flight, guided by the fireflies' light!",
    "Felix the fox says come and see, the magic mushroom jubilee!",
    "Stars are falling from above, filling hearts with joy and love!",
    "Home again as dawn draws near, Luna dreams without a fear!"
]

# Voice options (friendly, child-appropriate voices)
VOICE = "en-US-JennyNeural"  # Friendly female voice
# Alternative voices:
# "en-US-AriaNeural" - Warm female voice
# "en-GB-SoniaNeural" - British female voice
# "en-US-GuyNeural" - Friendly male voice

async def generate_voiceover(text, output_file, scene_num):
    """Generate a single voiceover file"""
    print(f"🎙️  Scene {scene_num}: \"{text}\"")
    
    # Create TTS with slightly slower rate and higher pitch for kids
    communicate = edge_tts.Communicate(text, VOICE, rate="-5%", pitch="+5Hz")
    
    # Save to file
    await communicate.save(output_file)
    
    print(f"   ✅ Generated: {os.path.basename(output_file)}\n")

async def main():
    print("🎤 Generating Voiceovers for Luna's Magical Night\n")
    print("=" * 60 + "\n")
    
    # Create audio directory
    audio_dir = "complete-story-output"
    os.makedirs(audio_dir, exist_ok=True)
    
    print(f"Voice: {VOICE}")
    print(f"Output directory: {audio_dir}\n")
    
    # Generate all voiceovers
    for i, narration in enumerate(narrations, 1):
        output_file = os.path.join(audio_dir, f"voiceover-{i}.mp3")
        await generate_voiceover(narration, output_file, i)
    
    print("✅ All voiceovers generated successfully!\n")
    print("📁 Files saved in:", audio_dir)
    print("\n🎬 Next step: Creating final video with music and voiceover\n")

if __name__ == "__main__":
    asyncio.run(main())

