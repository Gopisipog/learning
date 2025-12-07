/**
 * Video to MP3 Conversion Service
 * Uses FFmpeg.wasm for browser-based video to audio extraction
 */

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

// FFmpeg instance (lazy loaded)
let ffmpeg = null
let ffmpegLoaded = false

// Max file size (2GB)
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024

/**
 * Read file with progress tracking
 */
const readFileWithProgress = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress({ stage: 'uploading', progress: percent })
      }
    }

    reader.onload = () => {
      resolve(new Uint8Array(reader.result))
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Initialize FFmpeg (loads WASM)
 */
const initFFmpeg = async (onProgress) => {
  if (ffmpegLoaded && ffmpeg) return ffmpeg

  ffmpeg = new FFmpeg()

  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg]', message)
  })

  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) {
      onProgress({ stage: 'converting', progress: Math.round(progress * 100) })
    }
  })

  // Load FFmpeg with CDN URLs
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })

  ffmpegLoaded = true
  return ffmpeg
}

/**
 * Convert video to MP3
 * @param {File} videoFile - The video file to convert
 * @param {Object} options - Conversion options
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Blob>} - MP3 audio blob
 */
export const convertVideoToMp3 = async (videoFile, options = {}, onProgress = null) => {
  if (!videoFile) {
    throw new Error('No video file provided')
  }

  if (videoFile.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 2GB limit.')
  }

  // Supported video formats
  if (!videoFile.type.startsWith('video/') &&
      !videoFile.name.match(/\.(mp4|mpeg|webm|mov|avi|mkv|flv|wmv|m4v)$/i)) {
    throw new Error('Please select a video file.')
  }

  try {
    // Load FFmpeg
    if (onProgress) onProgress({ stage: 'loading', progress: 0 })
    const ffmpegInstance = await initFFmpeg(onProgress)

    // Read file with progress
    if (onProgress) onProgress({ stage: 'uploading', progress: 0 })
    const fileData = await readFileWithProgress(videoFile, onProgress)

    const inputExt = videoFile.name.split('.').pop() || 'mp4'
    const inputName = `input.${inputExt}`
    const outputName = 'output.mp3'

    // Write input file to FFmpeg
    if (onProgress) onProgress({ stage: 'preparing', progress: 0 })
    await ffmpegInstance.writeFile(inputName, fileData)

    if (onProgress) onProgress({ stage: 'converting', progress: 0 })

    // Bitrate options
    const bitrate = options.bitrate || '192k'
    
    // Convert to MP3
    await ffmpegInstance.exec([
      '-i', inputName,
      '-vn',                    // No video
      '-acodec', 'libmp3lame',  // MP3 codec
      '-b:a', bitrate,          // Audio bitrate
      '-ar', '44100',           // Sample rate (CD quality)
      '-ac', '2',               // Stereo
      outputName
    ])

    // Read output
    const data = await ffmpegInstance.readFile(outputName)

    // Cleanup
    await ffmpegInstance.deleteFile(inputName)
    await ffmpegInstance.deleteFile(outputName)

    if (onProgress) onProgress({ stage: 'complete', progress: 100 })

    // Create blob
    return new Blob([data.buffer], { type: 'audio/mp3' })

  } catch (error) {
    console.error('Error converting video to MP3:', error)
    throw error
  }
}

/**
 * Download blob as file
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Get available bitrate options
 */
export const getBitrateOptions = () => [
  { value: '128k', label: '128 kbps (Good)' },
  { value: '192k', label: '192 kbps (Better)' },
  { value: '256k', label: '256 kbps (High Quality)' },
  { value: '320k', label: '320 kbps (Best)' },
]

