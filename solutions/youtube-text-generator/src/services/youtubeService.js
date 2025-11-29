import axios from 'axios'
import { Supadata } from '@supadata/js'

// Supadata configuration (transcript + optional metadata)
const SUPADATA_BASE_URL = 'https://api.supadata.ai/v1'
const SUPADATA_API_KEY =
	  import.meta.env.VITE_SUPADATA_API_KEY || 'sd_5842eb81fc327c570fee411cc31fab88'

const getSupadataHeaders = () => {
	  if (!SUPADATA_API_KEY) {
	    throw new Error(
	      'Supadata API key is not configured. Set VITE_SUPADATA_API_KEY in your .env file.'
	    )
	  }

	  return {
	    'x-api-key': SUPADATA_API_KEY,
	  }
	}

// Lazily create a single Supadata client instance
let supadataClient = null

const getSupadataClient = () => {
	  if (!SUPADATA_API_KEY) {
	    throw new Error(
	      'Supadata API key is not configured. Set VITE_SUPADATA_API_KEY in your .env file.'
	    )
	  }

	  if (!supadataClient) {
	    supadataClient = new Supadata({ apiKey: SUPADATA_API_KEY })
	  }

	  return supadataClient
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Normalize various possible Supadata transcript response shapes
const normalizeSupadataTranscript = (result) => {
	  if (!result) return []

	  const normalizeSegmentsArray = (segments) => {
	    if (!Array.isArray(segments)) return []
	    return segments
	      .map((seg) => ({
	        text:
	          typeof seg === 'string'
	            ? seg
	            : seg.text || seg.text_original || '',
	      }))
	      .filter((chunk) => chunk.text && chunk.text.trim().length > 0)
	  }

	  // 1) Direct content field
	  if (Array.isArray(result.content)) {
	    const content = normalizeSegmentsArray(result.content)
	    if (content.length) return content
	  }

	  if (typeof result.content === 'string') {
	    const text = result.content.trim()
	    if (text) return [{ text }]
	  }

	  // 2) transcript / segments fields (alternate shapes)
	  if (Array.isArray(result.transcript)) {
	    const content = normalizeSegmentsArray(result.transcript)
	    if (content.length) return content
	  }

	  if (typeof result.transcript === 'string') {
	    const text = result.transcript.trim()
	    if (text) return [{ text }]
	  }

	  if (Array.isArray(result.segments)) {
	    const content = normalizeSegmentsArray(result.segments)
	    if (content.length) return content
	  }

	  // 3) Top-level array (e.g., [ { content: ... } ])
	  if (Array.isArray(result)) {
	    for (const item of result) {
	      const content = normalizeSupadataTranscript(item)
	      if (content.length) return content
	    }
	  }

	  // 4) Fallback: single text field
	  if (typeof result.text === 'string') {
	    const text = result.text.trim()
	    if (text) return [{ text }]
	  }

	  return []
}

const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return null
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Extract video ID from YouTube URL
 */
export const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

/**
	 * Validate YouTube URL
	 */
	export const isValidYouTubeUrl = (url) => {
	  return extractVideoId(url) !== null
}

// Internal: call Supadata transcript endpoint using the official SDK
const fetchTranscriptFromSupadata = async (videoUrl) => {
	  const supadata = getSupadataClient()

	  // First call: may return content directly or a jobId
	  const transcriptResult = await supadata.transcript({
	    url: videoUrl,
	    text: true,
	    mode: 'native', // 'native', 'auto', or 'generate'
	  })

	  // Try to normalize any content directly returned
	  const directContent = normalizeSupadataTranscript(transcriptResult)
	  if (directContent.length) {
	    return { content: directContent }
	  }

	  if (transcriptResult && 'jobId' in transcriptResult && transcriptResult.jobId) {
	    // Poll job status a few times
	    for (let attempt = 0; attempt < 5; attempt++) {
	      await sleep(2000)

	      const jobResult = await supadata.transcript.getJobStatus(
	        transcriptResult.jobId
	      )

	      const jobContent = normalizeSupadataTranscript(jobResult)
	      if (jobContent.length) {
	        return { content: jobContent }
	      }
	    }

	    throw new Error(
	      'Transcript is still being generated. Please try again in a few moments.'
	    )
	  }

	  throw new Error('Supadata transcript did not contain any text to display.')
	}

// Internal: fetch unified metadata for the video (optional; via Supadata)
const fetchMetadataFromSupadata = async (videoUrl) => {
  const response = await axios.get(`${SUPADATA_BASE_URL}/metadata`, {
    headers: getSupadataHeaders(),
    params: {
      url: videoUrl,
    },
  })

  return response.data
}

/**
	 * Generate text from YouTube video using Supadata (SDK) for transcript
	 */
	export const generateTextFromYouTube = async (videoUrl) => {
	  const videoId = extractVideoId(videoUrl)

	  if (!videoId) {
	    throw new Error('Invalid YouTube URL')
	  }

	  try {
	    // 1) Get transcript from Supadata JS SDK
	    const transcriptData = await fetchTranscriptFromSupadata(videoUrl)

	    // 2) Try to get metadata from Supadata HTTP API, but don't fail if it errors
	    let metadata = null
	    try {
	      metadata = await fetchMetadataFromSupadata(videoUrl)
	    } catch (metaError) {
	      console.warn(
	        'Metadata fetch from Supadata failed; continuing without it.',
	        metaError
	      )
	    }

	    const transcriptText = (transcriptData.content || [])
	      .map((chunk) => chunk.text)
	      .join(' ')
	      .replace(/\s+/g, ' ')
	      .trim()

	    const keyPoints = (transcriptData.content || [])
	      .slice(0, 5)
	      .map((chunk) => chunk.text.trim())
	      .filter(Boolean)

	    const tags = Array.isArray(metadata?.tags) ? metadata.tags : []

	    const durationSeconds = metadata?.media?.duration
	    const durationFormatted = formatDuration(durationSeconds)

	    const title = metadata?.title || `YouTube Video ${metadata?.id || videoId}`
	    const description = metadata?.description || ''
	    const channelName =
	      metadata?.author?.displayName ||
	      metadata?.author?.username ||
	      'Unknown channel'
	    const views = metadata?.stats?.views

	    const summaryParts = [
	      `This video titled "${title}" is from ${channelName}.`,
	    ]

	    if (typeof views === 'number') {
	      summaryParts.push(`It has approximately ${views.toLocaleString()} views.`)
	    }

	    if (durationFormatted) {
	      summaryParts.push(`The duration is about ${durationFormatted}.`)
	    }

	    const summary = summaryParts.join(' ')

	    return {
	      success: true,
	      videoId,
	      videoUrl,
	      metadata,
	      generatedText: {
	        title,
	        description,
	        transcript: transcriptText || 'Transcript could not be generated.',
	        summary,
	        keyPoints: keyPoints.length
	          ? keyPoints
	          : [
	              'Key points could not be extracted automatically from the transcript.',
	            ],
	        tags,
	        duration: durationFormatted,
	        generatedAt: new Date().toISOString(),
	      },
	    }
	  } catch (error) {
	    console.error('Error generating text with Supadata:', error)

	    const message =
	      error.response?.data?.message ||
	      error.response?.data?.error ||
	      error.message ||
	      'Failed to generate text from Supadata.'

	    throw new Error(message)
	  }
	}

/**
 * Mock function to simulate text generation (no Supadata API call)
 * Useful for local development without configuring an API key
 */
export const mockGenerateText = async (videoUrl) => {
  const videoId = extractVideoId(videoUrl)
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock generated text
  return {
    success: true,
    videoId,
    videoUrl,
    generatedText: {
      title: 'Sample Video Title',
      description: 'This is a sample description generated from the YouTube video.',
      transcript: `This is a mock transcript of the YouTube video with ID: ${videoId}.
      
In a real implementation, this would contain the actual transcript extracted from the video.

The transcript would include all spoken words, timestamps, and potentially speaker identification.

You can use YouTube's API or third-party services to extract actual transcripts.`,
      summary: `This is a summary of the video content. In production, this would be generated using AI/ML models that analyze the video transcript and generate a concise summary.`,
      keyPoints: [
        'Key point 1 from the video',
        'Key point 2 from the video',
        'Key point 3 from the video',
        'Key point 4 from the video'
      ],
      tags: ['technology', 'tutorial', 'education'],
      duration: '10:45',
      generatedAt: new Date().toISOString()
    }
  }
}

/**
 * Save generated text to Supabase database
 */
export const saveGeneratedText = async (supabase, data) => {
  try {
    const { data: savedData, error } = await supabase
      .from('youtube_texts')
      .insert([
        {
          video_id: data.videoId,
          video_url: data.videoUrl,
          generated_text: data.generatedText,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error

    return { success: true, data: savedData }
  } catch (error) {
    console.error('Error saving to Supabase:', error)
    throw error
  }
}

/**
	 * Get all saved texts from Supabase
	 */
	export const getSavedTexts = async (supabase) => {
	  try {
	    const { data, error } = await supabase
	      .from('youtube_texts')
	      .select('*')
	      .order('created_at', { ascending: false })
	
	    if (error) throw error
	
	    return { success: true, data }
	  } catch (error) {
	    console.error('Error fetching from Supabase:', error)
	    throw error
	  }
	}
	
	/**
	 * Export generated text as JSON
	 */
	export const exportAsJSON = (data, filename = 'youtube-text') => {
	  const jsonStr = JSON.stringify(data, null, 2)
	  const blob = new Blob([jsonStr], { type: 'application/json' })
	  const url = URL.createObjectURL(blob)
	  const link = document.createElement('a')
	  link.href = url
	  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`
	  document.body.appendChild(link)
	  link.click()
	  document.body.removeChild(link)
	  URL.revokeObjectURL(url)
	}

// Build a Markdown representation of the generated data
const buildMarkdownFromGeneratedData = (data) => {
	  if (!data || !data.generatedText) return '# YouTube Text Report\n\n_No data available._\n'

	  const { videoId, videoUrl } = data
	  const {
	    title,
	    description,
	    summary,
	    keyPoints = [],
	    transcript,
	    tags = [],
	    duration,
	    generatedAt,
	  } = data.generatedText

	  const lines = []

	  // Title
	  lines.push(`# ${title || 'YouTube Video Report'}`)
	  lines.push('')

	  // Basic metadata
	  if (videoUrl) lines.push(`- **Video URL:** ${videoUrl}`)
	  if (videoId) lines.push(`- **Video ID:** \
${videoId}`)
	  if (duration) lines.push(`- **Duration:** ${duration}`)
	  if (generatedAt) lines.push(`- **Generated at:** ${generatedAt}`)
	  if (tags.length)
	    lines.push(`- **Tags:** ${tags.join(', ')}`)

	  lines.push('')

	  // Description
	  if (description) {
	    lines.push('## Description')
	    lines.push('')
	    lines.push(description)
	    lines.push('')
	  }

	  // Summary
	  if (summary) {
	    lines.push('## Summary')
	    lines.push('')
	    lines.push(summary)
	    lines.push('')
	  }

	  // Key points
	  if (keyPoints.length) {
	    lines.push('## Key Points')
	    lines.push('')
	    for (const point of keyPoints) {
	      lines.push(`- ${point}`)
	    }
	    lines.push('')
	  }

	  // Transcript
	  if (transcript) {
	    lines.push('## Transcript')
	    lines.push('')
	    lines.push(transcript)
	    lines.push('')
	  }

	  return lines.join('\n')
}

// Export generated text as a Markdown (.md) file
export const exportAsMarkdown = (data, filename = 'youtube-text') => {
	  const markdown = buildMarkdownFromGeneratedData(data)
	  const blob = new Blob([markdown], { type: 'text/markdown' })
	  const url = URL.createObjectURL(blob)
	  const link = document.createElement('a')
	  link.href = url
	  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.md`
	  document.body.appendChild(link)
	  link.click()
	  document.body.removeChild(link)
	  URL.revokeObjectURL(url)
}
