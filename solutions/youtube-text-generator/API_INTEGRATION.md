# 🔌 API Integration Guide

This guide shows how to integrate real APIs for YouTube transcript extraction and AI-powered text generation.

## 🎯 Overview

The app currently uses mock data. To make it production-ready, you need to integrate:

1. **YouTube Data API** - Get video metadata
2. **YouTube Transcript API** - Extract video transcripts
3. **OpenAI/GPT API** - Generate summaries and key points
4. **Supabase** - Store and manage data

## 📺 Option 1: YouTube Transcript API

### Installation

```bash
npm install youtube-transcript
```

### Implementation

Update `src/services/youtubeService.js`:

```javascript
import { YoutubeTranscript } from 'youtube-transcript'

export const getYouTubeTranscript = async (videoId) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    
    // Combine all transcript segments
    const fullTranscript = transcript
      .map(item => item.text)
      .join(' ')
    
    return {
      success: true,
      transcript: fullTranscript,
      segments: transcript // Array of {text, duration, offset}
    }
  } catch (error) {
    console.error('Error fetching transcript:', error)
    throw new Error('Could not fetch transcript. Video may not have captions.')
  }
}
```

## 🤖 Option 2: OpenAI Integration

### Installation

```bash
npm install openai
```

### Setup

Create `.env` file:

```env
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

### Implementation

Create `src/services/openaiService.js`:

```javascript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development!
})

export const generateSummary = async (transcript) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that summarizes video transcripts."
      },
      {
        role: "user",
        content: `Summarize this video transcript in 2-3 sentences:\n\n${transcript}`
      }
    ],
    max_tokens: 150
  })
  
  return response.choices[0].message.content
}

export const extractKeyPoints = async (transcript) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Extract 5 key points from the video transcript as a JSON array."
      },
      {
        role: "user",
        content: transcript
      }
    ],
    response_format: { type: "json_object" }
  })
  
  return JSON.parse(response.choices[0].message.content).keyPoints
}

export const generateTags = async (transcript) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Generate 5-7 relevant tags for this video content as a JSON array."
      },
      {
        role: "user",
        content: transcript
      }
    ],
    response_format: { type: "json_object" }
  })
  
  return JSON.parse(response.choices[0].message.content).tags
}
```

## 🎬 Option 3: YouTube Data API

### Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable YouTube Data API v3
4. Create API credentials (API Key)
5. Add to `.env`:

```env
VITE_YOUTUBE_API_KEY=your-youtube-api-key-here
```

### Implementation

Create `src/services/youtubeDataService.js`:

```javascript
import axios from 'axios'

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

export const getVideoMetadata = async (videoId) => {
  const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
    params: {
      part: 'snippet,contentDetails,statistics',
      id: videoId,
      key: YOUTUBE_API_KEY
    }
  })
  
  const video = response.data.items[0]
  
  return {
    title: video.snippet.title,
    description: video.snippet.description,
    channelTitle: video.snippet.channelTitle,
    publishedAt: video.snippet.publishedAt,
    duration: video.contentDetails.duration,
    viewCount: video.statistics.viewCount,
    likeCount: video.statistics.likeCount,
    thumbnail: video.snippet.thumbnails.high.url
  }
}
```

## 🔄 Complete Integration

Update `src/services/youtubeService.js` to combine all APIs:

```javascript
import { getYouTubeTranscript } from './youtubeTranscriptService'
import { getVideoMetadata } from './youtubeDataService'
import { generateSummary, extractKeyPoints, generateTags } from './openaiService'
import { supabase } from '../config/supabase'

export const generateTextFromYouTube = async (videoUrl) => {
  const videoId = extractVideoId(videoUrl)
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  try {
    // Step 1: Get video metadata
    const metadata = await getVideoMetadata(videoId)
    
    // Step 2: Get transcript
    const { transcript } = await getYouTubeTranscript(videoId)
    
    // Step 3: Generate AI content
    const [summary, keyPoints, tags] = await Promise.all([
      generateSummary(transcript),
      extractKeyPoints(transcript),
      generateTags(transcript)
    ])
    
    // Step 4: Combine all data
    const result = {
      videoId,
      videoUrl,
      generatedText: {
        title: metadata.title,
        description: metadata.description,
        transcript,
        summary,
        keyPoints,
        tags,
        duration: metadata.duration,
        generatedAt: new Date().toISOString(),
        metadata
      }
    }
    
    // Step 5: Save to Supabase (optional)
    await saveGeneratedText(supabase, result)
    
    return {
      success: true,
      ...result
    }
  } catch (error) {
    console.error('Error generating text:', error)
    throw error
  }
}
```

## ⚠️ Important: Security

**Never expose API keys in frontend code!**

### Recommended Architecture

```
Frontend (React)
    ↓
Backend API / Supabase Edge Function
    ↓
External APIs (YouTube, OpenAI)
```

### Create Backend Endpoint

Use Supabase Edge Function (see SUPABASE_SETUP.md) or create your own backend:

```javascript
// backend/api/generate-text.js
import express from 'express'
import { getYouTubeTranscript } from './services/youtube'
import { generateWithOpenAI } from './services/openai'

const router = express.Router()

router.post('/generate-text', async (req, res) => {
  try {
    const { videoId } = req.body
    
    // All API keys are safe on the backend
    const transcript = await getYouTubeTranscript(videoId)
    const summary = await generateWithOpenAI(transcript)
    
    res.json({ success: true, data: { transcript, summary } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
```

## 💰 Cost Considerations

### YouTube Data API
- **Free tier**: 10,000 units/day
- **Cost per video**: ~3 units
- **Limit**: ~3,300 videos/day

### OpenAI API
- **GPT-4**: ~$0.03 per 1K tokens
- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **Average cost per video**: $0.05 - $0.15

### Supabase
- **Free tier**: 500MB database, 2GB bandwidth
- **Pro**: $25/month for more resources

## 🚀 Deployment

1. **Environment Variables**: Set in your hosting platform
2. **Backend**: Deploy to Vercel, Railway, or Render
3. **Frontend**: Deploy to Vercel, Netlify, or Cloudflare Pages

## 📊 Rate Limiting

Implement rate limiting to avoid API quota issues:

```javascript
// Simple in-memory rate limiter
const rateLimiter = new Map()

export const checkRateLimit = (userId, limit = 10, window = 3600000) => {
  const now = Date.now()
  const userRequests = rateLimiter.get(userId) || []
  
  // Remove old requests
  const recentRequests = userRequests.filter(time => now - time < window)
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded. Try again later.')
  }
  
  recentRequests.push(now)
  rateLimiter.set(userId, recentRequests)
}
```

## 🧪 Testing

Test with these videos:
- Short video: `https://youtu.be/dQw4w9WgXcQ`
- Educational: `https://youtu.be/9bZkp7q19f0`
- Tech talk: `https://youtu.be/8pDqJVdNa44`

## 📚 Resources

- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

**Ready to integrate? Start with YouTube Transcript API for the easiest setup!**

