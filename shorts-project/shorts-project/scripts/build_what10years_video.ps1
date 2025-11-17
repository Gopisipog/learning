# Build "What 10 Years Can Do" music video (1080x1920, ~3:04)
# - Uses 6 meaningful stock-style images (Wikimedia Commons) as a slideshow with slow zooms
# - Crossfades between segments
# - Uses local audio: assets/audio/_What 10 Years Can Do_ (1).mp3
# Output: output/what_10_years_can_do.mp4

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Paths
$root    = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$assetsI = Join-Path $root 'assets/images'
$assetsA = Join-Path $root 'assets/audio'
$tempDir = Join-Path $root 'temp'
$output  = Join-Path $root 'output'

$null = New-Item -ItemType Directory -Force -Path $assetsI, $assetsA, $tempDir, $output

# Audio
$audioName = '_What 10 Years Can Do_ (1).mp3'
$audioPath = Join-Path $assetsA $audioName

if (-not (Test-Path $audioPath)) {
  throw "Audio file not found: $audioPath"
}

Write-Host "Using audio: $audioPath"

# Image sources (meaningful stock-style photos from Wikimedia Commons:
#   growth, journey, time, sunrise, city, motion)
$images = @(
  @{ url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Young_plant_on_moss.JPG';                           name = 'young_plant_on_moss.jpg' },
  @{ url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Road_Sztabin_-_Krasnyb%C3%B3r_(Poland).JPG';        name = 'road_sztabin_krasnybor_poland.jpg' },
  @{ url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Wooden_hourglass_3.jpg';                            name = 'wooden_hourglass_3.jpg' },
  @{ url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Sunrise_over_Mountains.jpg';                        name = 'sunrise_over_mountains.jpg' },
  @{ url = 'https://commons.wikimedia.org/wiki/Special:FilePath/New_York_City_Skyline_at_night.jpg';               name = 'nyc_skyline_night.jpg' },
  @{ url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Artistic-asphalt-automobiles-799443.jpg';          name = 'artistic_asphalt_automobiles_799443.jpg' }
)

function Download-IfMissing($url, $dst) {
  if (-not (Test-Path $dst)) {
    Write-Host "Downloading: $url -> $dst"
    Invoke-WebRequest -Uri $url -OutFile $dst
  } else {
    Write-Host "Exists: $dst"
  }
}

# Download images if needed
for ($i=0; $i -lt $images.Count; $i++) {
  $dst = Join-Path $assetsI $images[$i].name
  Download-IfMissing $images[$i].url $dst
}

# Segment settings tuned so total video matches ~184.24s audio
$segDur = 31.54   # seconds per image
$xfadeD = 1.0     # crossfade duration between segments
$fps    = 30
$frames = [int][Math]::Ceiling($segDur * $fps)

Write-Host "Segment duration: $segDur s, crossfade: $xfadeD s, fps: $fps"

# Generate per-image video segments with slow zoom (Ken Burns)
$segments = @()
for ($i=0; $i -lt $images.Count; $i++) {
  $imgPath = Join-Path $assetsI $images[$i].name
  $segOut  = Join-Path $tempDir  ("what10_seg_$i.mp4")
  $segments += $segOut

  $vf = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
  $vf += "zoompan=z='min(zoom+0.0009,1.12)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=$($frames):s=1080x1920:fps=$($fps),format=yuv420p"

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

# Trim and fade audio to match the slideshow
$audioChain = "[${segCount}:a]atrim=0:$totalDur,afade=t=in:st=0:d=1.5,afade=t=out:st=$([Math]::Round($totalDur-3.0,2)):d=3.0,volume=1.0[$audioOut]"

$filterComplex = ($graphParts -join ';') + ';' + $audioChain

# Compose ffmpeg command with N video inputs + 1 audio input
$concatArgs = @('-y')
for ($i=0; $i -lt $segments.Count; $i++) { $concatArgs += @('-i', $segments[$i]) }
$concatArgs += @('-i', $audioPath)

$videoOut = Join-Path $output 'what_10_years_can_do.mp4'

$concatArgs += @(
  '-filter_complex', $filterComplex,
  '-map', "[$lastLabel]", '-map', "[$audioOut]",
  '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',
  '-c:a','aac','-b:a','192k','-shortest',
  $videoOut
)

Write-Host "ffmpeg " ($concatArgs -join ' ')
& ffmpeg @concatArgs

Write-Host "`nDone. Output: $videoOut (expected duration ~ $totalDur s)"
