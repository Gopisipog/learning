#!/usr/bin/env python3
"""
Generate voiceovers for kids rhyme short using Edge TTS
"""

import asyncio
import edge_tts
import os

# Rhyme text for each scene
rhymes = [
    "In a burrow snug and warm, Bella wakes up to the morn!",
    "Through the meadow, hop hop hop, Flowers bloom, they never stop!",
    "Sam the squirrel says Hello friend! Let's explore around the bend!",
    "By the stream so bright and clear, Fish are dancing, full of cheer!",
    "Baby bird needs help today, Friends together save the day!",
    "Home at last when day is done, Bella's heart is full of fun!"
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
    
    # Create TTS
    communicate = edge_tts.Communicate(text, VOICE, rate="-5%", pitch="+5Hz")
    
    # Save to file
    await communicate.save(output_file)
    
    print(f"   ✅ Generated: {os.path.basename(output_file)}\n")

async def main():
    print("🎤 Generating Voiceovers with Edge TTS\n")
    print("=" * 60 + "\n")
    
    # Create audio directory
    audio_dir = "audio-files"
    os.makedirs(audio_dir, exist_ok=True)
    
    print(f"Voice: {VOICE}")
    print(f"Output directory: {audio_dir}\n")
    
    # Generate all voiceovers
    for i, rhyme in enumerate(rhymes, 1):
        output_file = os.path.join(audio_dir, f"voiceover-{i}.mp3")
        await generate_voiceover(rhyme, output_file, i)
    
    print("✅ All voiceovers generated successfully!\n")
    print("📁 Files saved in:", audio_dir)
    print("\n🎬 Next step: Run 'npm run voiceover' to create final video\n")

if __name__ == "__main__":
    asyncio.run(main())

