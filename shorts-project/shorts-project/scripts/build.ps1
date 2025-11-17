# Build Murugan Shorts video (1080x1920, ~24s)
# - Downloads 6 images (Wikimedia Commons) and 1 music track (Mixkit)
# - Creates short zoomed segments with text overlays
# - Crossfades between segments, mixes background music
# Output: output/murugan_shorts.mp4

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Paths
$root     = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$assetsI  = Join-Path $root 'assets/images'
$assetsA  = Join-Path $root 'assets/audio'
$tempDir  = Join-Path $root 'temp'
$output   = Join-Path $root 'output'

# Music mode: 'catchy' (synth tones) or 'ambient' (downloaded track)
$musicMode = 'devotional'

# Ensure folders
$null = New-Item -ItemType Directory -Force -Path $assetsI, $assetsA, $tempDir, $output

# Asset sources (URL => local filename)
$images = @(
  @{ url = 'https://upload.wikimedia.org/wikipedia/commons/8/84/Batu_Caves%2C_Lord_Murugan_Statue._2019-12-01_10-49-53.jpg'; name = 'batu_caves_2019.jpg' },
  @{ url = 'https://upload.wikimedia.org/wikipedia/commons/7/73/Lord_Muruga_Batu_Caves.jpg';                                             name = 'lord_muruga_batu_caves.jpg' },
  @{ url = 'https://upload.wikimedia.org/wikipedia/commons/4/44/YELGIRI_HILL-_LORD_MURUGAN_TEMPLE_STATUE-TAMILNADU-INDIA.JPG';              name = 'yelagiri_murugan.jpg' },
  @{ url = 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Murugan_statue_srisailam.jpg';                                             name = 'srisailam_murugan.jpg' },
  @{ url = 'https://upload.wikimedia.org/wikipedia/commons/3/38/Vadapalani_murugan_temple.jpg';                                           name = 'vadapalani_murugan.jpg' },
  @{ url = 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Ettampadai_Murugan.JPG';                                                   name = 'ettampadai_murugan.jpg' }
)
$music = @{ url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Thiruppugazh_-_Umbartharu_-_Hamsadhwani.wav'; name = 'thiruppugazh_umbartharu_hamsadhwani.wav' }

# Phrases for overlays (English; can be adjusted)
$phrases = @(
  'Om Muruga',
  'Vetri Vel! Veera Vel!',
  'Om Saravana Bhava',
  'Blessings of Lord Murugan',
  'May the Vel guide you',
  'Skanda Shasti blessings'
)

function Download-IfMissing($url, $dst) {
  if (-not (Test-Path $dst)) {
    Write-Host "Downloading: $url -> $dst"
    Invoke-WebRequest -Uri $url -OutFile $dst
  } else {
    Write-Host "Exists: $dst"
  }
}

# Download assets
for ($i=0; $i -lt $images.Count; $i++) {
  $dst = Join-Path $assetsI $images[$i].name
  Download-IfMissing $images[$i].url $dst
}
$musicPath = Join-Path $assetsA $music.name
if ($musicMode -in @('ambient','devotional')) {
  Download-IfMissing $music.url $musicPath
} else {
  Write-Host "Using generated catchy tone (no download)."
}

# Segment settings
$segDur  = 4.5   # seconds per segment
$xfadeD  = 0.7   # crossfade duration between segments
$fps     = 30
$frames  = [int][Math]::Ceiling($segDur * $fps)

# Generate segments with zoom + text
$segments = @()
for ($i=0; $i -lt $images.Count; $i++) {
  $imgPath = Join-Path $assetsI $images[$i].name
  $segOut  = Join-Path $tempDir  ("seg_$i.mp4")
  $segments += $segOut

  $phrase  = $phrases[$i]
  # Fit image to cover 1080x1920 (scale up preserving AR, then crop), then slow zoom and overlay text
  $vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
  $vf += "zoompan=z='min(zoom+0.0009,1.12)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=$($frames):s=1080x1920:fps=$($fps),"
  $vf += "drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='$phrase':fontcolor=white:fontsize=54:box=1:boxcolor=black@0.4:boxborderw=12:x=(w-text_w)/2:y=h-220"

  # Build and run ffmpeg
  $args = @(
    '-y','-loop','1','-t',"$segDur",'-i',"$imgPath",
    '-vf', $vf,
    '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-r',"$fps",
    '-frames:v',"$frames",
    '-an', $segOut
  )
  Write-Host "ffmpeg " ($args -join ' ')
  & ffmpeg @args
}

# Build filter graph for xfade chain
$offsetStep = $segDur - $xfadeD
$graphParts = @()
$lastLabel = ''

# First pair
$graphParts += "[0:v][1:v]xfade=transition=fade:duration=$($xfadeD):offset=$([Math]::Round($offsetStep,2))[v01]"
$lastLabel = 'v01'

for ($k=2; $k -lt $segments.Count; $k++) {
  $offset = [Math]::Round($offsetStep * $k, 2)
  $next = "v0$k"
  $graphParts += "[$lastLabel][$($k):v]xfade=transition=fade:duration=$($xfadeD):offset=$($offset)[$next]"
  $lastLabel = $next
}

$segCount = $segments.Count
$totalDur = [Math]::Round(($segCount * $segDur) - (($segCount - 1) * $xfadeD), 2)
$audioOut = 'aud'
if ($musicMode -in @('ambient','devotional')) {
  $audioChain = "[${segCount}:a]atrim=0:$totalDur,afade=t=in:st=0:d=0.8,afade=t=out:st=$([Math]::Round($totalDur-1.2,2)):d=1.2,volume=0.9[$audioOut]"
} else {
  $fadeOutStart = [Math]::Round($totalDur - 1.2, 2)
  $audioChain = "sine=frequency=440:sample_rate=44100:duration=$($totalDur)[a0];sine=frequency=660:sample_rate=44100:duration=$($totalDur)[a1];[a0][a1]amix=inputs=2,volume=0.85,afade=t=in:st=0:d=0.5,afade=t=out:st=$($fadeOutStart):d=1.2,aformat=sample_fmts=fltp:channel_layouts=stereo[$audioOut]"
}

$filterComplex = ($graphParts -join ';') + ';' + $audioChain

# Compose command with N video inputs + 1 audio input
$concatArgs = @('-y')
for ($i=0; $i -lt $segments.Count; $i++) { $concatArgs += @('-i', $segments[$i]) }
if ($musicMode -in @('ambient','devotional')) { $concatArgs += @('-i', $musicPath) }
$concatArgs += @('-filter_complex', $filterComplex)
$concatArgs += @('-map', "[$lastLabel]", '-map', "[$audioOut]")
$concatArgs += @('-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-shortest', (Join-Path $output 'murugan_shorts.mp4'))

Write-Host "ffmpeg " ($concatArgs -join ' ')
& ffmpeg @concatArgs

Write-Host "\nDone. Output: $output\murugan_shorts.mp4 (duration ~ $totalDur s)"

