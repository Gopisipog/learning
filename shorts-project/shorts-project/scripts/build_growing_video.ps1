# Build music video for growing.mp3 using procedural graphics
# Vertical shorts format: 1080x1920, 30fps

$ErrorActionPreference = 'Stop'

# Paths
$audioPath = "assets\audio\growing.mp3"
$outputPath = "output\growing_music_video.mp4"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path "output" | Out-Null

# Video settings
$width = 1080
$height = 1920
$fps = 30
$audioDuration = 78.84  # seconds (from ffprobe)

Write-Host "Creating music video for growing.mp3 (duration: $audioDuration seconds)..."
Write-Host "Using procedural graphics with audio visualization..."

# Create a visually dynamic music video with:
# 1. Animated gradient background
# 2. Audio waveform visualization
# 3. Spectrum analyzer
# 4. Animated particles/shapes
# 5. Text overlays

# Build filter complex - simplified approach with audio visualization
$fontPath = "C\\:/Windows/Fonts/arial.ttf"
$fontPathBold = "C\\:/Windows/Fonts/arialbd.ttf"

# Create a dark gradient background
$part1 = "color=c=0x1a1a3e:s=$width`x$height`:r=$fps`:d=$audioDuration,format=rgb24[bg]"

# Audio waveform visualization
$part2 = "[0:a]showwaves=s=$width`x500:mode=p2p:rate=$fps`:colors=0x00ff88|0x00ddff:scale=sqrt,format=rgba[waves]"

# Spectrum analyzer
$part3 = "[0:a]showfreqs=s=$width`x700:mode=bar:ascale=log:fscale=log:colors=0xff00ff|0x00ffff,format=rgba[spectrum]"

# Overlay spectrum on background
$part4 = "[bg][spectrum]overlay=0:600:format=auto[tmp1]"

# Overlay waveform
$part5 = "[tmp1][waves]overlay=0:400:format=auto,format=yuv420p[vid]"

# Add title text
$part6 = "[vid]drawtext=fontfile=$fontPathBold`:text=GROWING:fontsize=96:fontcolor=white:x=(w-text_w)/2:y=100:shadowcolor=black:shadowx=3:shadowy=3[txt1]"

# Add subtitle text
$part7 = "[txt1]drawtext=fontfile=$fontPath`:text='Music Video':fontsize=42:fontcolor=white@0.9:x=(w-text_w)/2:y=1750:shadowcolor=black@0.7:shadowx=2:shadowy=2[vout]"

# Combine all parts
$filterComplex = "$part1;$part2;$part3;$part4;$part5;$part6;$part7"

# Build ffmpeg command
$ffmpegArgs = @(
    '-y',
    '-i', $audioPath,
    '-filter_complex', $filterComplex,
    '-map', '[vout]',
    '-map', '0:a',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '20',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-t', "$audioDuration",
    '-movflags', '+faststart',
    $outputPath
)

Write-Host "`nRunning FFmpeg with audio visualization..."
& ffmpeg @ffmpegArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDone! Music video created: $outputPath"
    $fileInfo = Get-Item $outputPath
    Write-Host "File size: $([Math]::Round($fileInfo.Length / 1MB, 2)) MB"
    Write-Host "Duration: $audioDuration seconds"
} else {
    Write-Host "`nFFmpeg failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}

