/**
 * Video to Text Transcription Service
 * Uses AssemblyAI API for audio/video transcription
 * Supports large files natively - no chunking required
 * Reference: https://www.assemblyai.com/docs
 */

const ASSEMBLYAI_API_KEY = import.meta.env.VITE_ASSEMBLYAI_API_KEY || ''
const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2'

// Max file size (AssemblyAI supports large files)
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024 // 5GB max

/**
 * Check if AssemblyAI API key is configured
 */
export const isOpenAIConfigured = () => {
  return !!ASSEMBLYAI_API_KEY
}

/**
 * Upload file to AssemblyAI
 */
const uploadFile = async (file, onProgress) => {
  if (onProgress) onProgress({ stage: 'uploading', progress: 0 })

  const response = await fetch(`${ASSEMBLYAI_API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': ASSEMBLYAI_API_KEY,
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Upload failed with status ${response.status}`)
  }

  const result = await response.json()
  if (onProgress) onProgress({ stage: 'uploading', progress: 100 })
  return result.upload_url
}

/**
 * Submit transcription request to AssemblyAI
 */
const submitTranscription = async (audioUrl, options = {}) => {
  const requestBody = {
    audio_url: audioUrl,
    language_detection: !options.language,
    punctuate: true,
    format_text: true,
  }

  // Add language code if specified
  if (options.language) {
    requestBody.language_code = options.language
  }

  const response = await fetch(`${ASSEMBLYAI_API_URL}/transcript`, {
    method: 'POST',
    headers: {
      'Authorization': ASSEMBLYAI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Transcription request failed`)
  }

  return await response.json()
}

/**
 * Poll for transcription completion
 */
const pollTranscription = async (transcriptId, onProgress) => {
  const pollInterval = 3000 // 3 seconds
  let lastProgress = 0

  while (true) {
    const response = await fetch(`${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`, {
      headers: { 'Authorization': ASSEMBLYAI_API_KEY },
    })

    if (!response.ok) {
      throw new Error(`Failed to check transcription status`)
    }

    const result = await response.json()

    if (result.status === 'completed') {
      if (onProgress) onProgress({ stage: 'complete', progress: 100 })
      return result
    }

    if (result.status === 'error') {
      throw new Error(result.error || 'Transcription failed')
    }

    // Update progress based on status
    if (result.status === 'queued') {
      if (onProgress) onProgress({ stage: 'queued', progress: 10 })
    } else if (result.status === 'processing') {
      // Simulate progress during processing
      lastProgress = Math.min(lastProgress + 10, 90)
      if (onProgress) onProgress({ stage: 'transcribing', progress: lastProgress })
    }

    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }
}

/**
 * Convert AssemblyAI words to segments format
 */
const convertWordsToSegments = (words) => {
  if (!words || words.length === 0) return []

  // Group words into sentences (roughly 10 words per segment or by punctuation)
  const segments = []
  let currentSegment = { text: '', start: 0, end: 0, words: [] }

  for (const word of words) {
    if (currentSegment.words.length === 0) {
      currentSegment.start = word.start / 1000 // Convert ms to seconds
    }

    currentSegment.words.push(word)
    currentSegment.text += (currentSegment.text ? ' ' : '') + word.text
    currentSegment.end = word.end / 1000

    // Create new segment after ~10 words or sentence-ending punctuation
    if (currentSegment.words.length >= 10 || /[.!?]$/.test(word.text)) {
      segments.push({
        text: currentSegment.text,
        start: currentSegment.start,
        end: currentSegment.end,
      })
      currentSegment = { text: '', start: 0, end: 0, words: [] }
    }
  }

  // Add remaining words as final segment
  if (currentSegment.words.length > 0) {
    segments.push({
      text: currentSegment.text,
      start: currentSegment.start,
      end: currentSegment.end,
    })
  }

  return segments
}

/**
 * Main transcription function using AssemblyAI
 * @param {File} videoFile - The video/audio file to transcribe
 * @param {Object} options - Transcription options
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Transcription result
 */
export const transcribeVideo = async (videoFile, options = {}, onProgress = null) => {
  if (!ASSEMBLYAI_API_KEY) {
    throw new Error(
      'AssemblyAI API key is not configured. Set VITE_ASSEMBLYAI_API_KEY in your .env file.'
    )
  }

  if (!videoFile) {
    throw new Error('No video file provided')
  }

  // Check max file size (5GB)
  if (videoFile.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5GB limit.')
  }

  // Supported formats
  const supportedFormats = [
    'video/mp4', 'video/mpeg', 'video/webm', 'video/quicktime', 'video/x-msvideo',
    'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/ogg',
    'audio/flac', 'audio/webm', 'audio/aac'
  ]

  if (!supportedFormats.includes(videoFile.type) &&
      !videoFile.name.match(/\.(mp4|mp3|mpeg|mpga|m4a|wav|webm|mov|ogg|flac|avi|mkv|aac)$/i)) {
    throw new Error('Unsupported file format.')
  }

  try {
    // Step 1: Upload file to AssemblyAI
    if (onProgress) onProgress({ stage: 'uploading', progress: 0 })
    const uploadUrl = await uploadFile(videoFile, onProgress)

    // Step 2: Submit transcription request
    if (onProgress) onProgress({ stage: 'submitting', progress: 5 })
    const transcript = await submitTranscription(uploadUrl, options)

    // Step 3: Poll for completion
    if (onProgress) onProgress({ stage: 'queued', progress: 10 })
    const result = await pollTranscription(transcript.id, onProgress)

    // Convert words to segments for SRT export
    const segments = convertWordsToSegments(result.words)

    return {
      success: true,
      fileName: videoFile.name,
      fileSize: videoFile.size,
      fileType: videoFile.type,
      transcription: {
        text: result.text || '',
        language: result.language_code || options.language || 'auto',
        duration: result.audio_duration || null,
        segments: segments,
        confidence: result.confidence,
      },
      generatedAt: new Date().toISOString(),
    }

  } catch (error) {
    console.error('Error transcribing video:', error)
    throw error
  }
}

/**
 * Format duration in seconds to MM:SS format
 */
export const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return null
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Get supported language options for AssemblyAI
 * Reference: https://www.assemblyai.com/docs/concepts/supported-languages
 */
export const getSupportedLanguages = () => [
  { code: '', label: 'Auto-detect' },
  { code: 'en', label: 'English (Global)' },
  { code: 'en_us', label: 'English (US)' },
  { code: 'en_uk', label: 'English (UK)' },
  { code: 'en_au', label: 'English (Australia)' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'nl', label: 'Dutch' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ru', label: 'Russian' },
  { code: 'hi', label: 'Hindi' },
  { code: 'pl', label: 'Polish' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'tr', label: 'Turkish' },
]

/**
 * Export transcription as text file
 */
export const exportAsText = (data, filename = 'transcription') => {
  const text = data.transcription?.text || ''
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export transcription as SRT subtitle file
 */
export const exportAsSRT = (data, filename = 'transcription') => {
  const segments = data.transcription?.segments || []
  if (!segments.length) {
    throw new Error('No segments available for SRT export')
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 1000)
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`
  }

  const srtContent = segments.map((seg, index) => {
    return `${index + 1}\n${formatTime(seg.start)} --> ${formatTime(seg.end)}\n${seg.text.trim()}\n`
  }).join('\n')

  const blob = new Blob([srtContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.srt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

