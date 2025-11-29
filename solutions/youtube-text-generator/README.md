# 🎥 YouTube Text Generator

A React application that generates text content from YouTube videos using Supabase API.

## 🌟 Features

- **YouTube URL Input** - Paste any YouTube video URL
- **Text Generation** - Extract transcripts, summaries, and key points
- **AI-Powered Analysis** - Generate summaries and key insights
- **Export to JSON** - Download generated content as JSON
- **Beautiful UI** - Modern gradient design with smooth animations
- **Responsive Design** - Works on all devices
- **Real-time Validation** - Validates YouTube URLs before processing
- **Loading States** - Visual feedback during processing
- **Error Handling** - Clear error messages

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Supabase account (for production use)

### Installation

1. **Navigate to the project**:
```bash
cd youtube-text-generator
```

2. **Install dependencies** (already done):
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open in browser**:
```
http://localhost:5173
```

## 📖 How to Use

### 1. Enter YouTube URL
- Paste a YouTube video URL in the input field
- Supported formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/embed/VIDEO_ID`
  - Or just the video ID

### 2. Generate Text
- Click the **"✨ Generate Text"** button
- Wait for the processing (2-3 seconds in demo mode)
- View the generated content

### 3. Review Results
The app generates:
- **Video Title** - Extracted video title
- **Description** - Video description
- **Summary** - AI-generated summary
- **Key Points** - Bullet points of main topics
- **Transcript** - Full video transcript
- **Tags** - Relevant tags for the content

### 4. Export Data
- Click **"📥 Export JSON"** to download the generated content
- File is saved as `youtube-text-{VIDEO_ID}-{DATE}.json`

## 🔧 Configuration

### Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and API key

2. **Update Configuration**:
   Edit `src/config/supabase.js`:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co'
   const SUPABASE_KEY = 'your-api-key-here'
   ```

3. **Create Database Table** (optional):
   ```sql
   CREATE TABLE youtube_texts (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     video_id TEXT NOT NULL,
     video_url TEXT NOT NULL,
     generated_text JSONB NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

## 📁 Project Structure

```
youtube-text-generator/
├── src/
│   ├── components/
│   │   ├── YouTubeTextGenerator.jsx   # Main component
│   │   └── YouTubeTextGenerator.css   # Component styles
│   ├── services/
│   │   └── youtubeService.js          # YouTube API logic
│   ├── config/
│   │   └── supabase.js                # Supabase configuration
│   ├── App.jsx                        # App container
│   ├── App.css                        # Global styles
│   └── main.js                        # Entry point
├── public/                            # Static assets
├── index.html                         # HTML template
├── vite.config.js                     # Vite configuration
├── package.json                       # Dependencies
└── README.md                          # This file
```

## 🎨 Features in Detail

### URL Validation
- Automatically validates YouTube URLs
- Extracts video ID from various URL formats
- Shows error messages for invalid URLs

### Text Generation
Currently uses **mock data** for demonstration. To integrate with real APIs:

1. **YouTube Transcript API**:
   ```javascript
   // Install: npm install youtube-transcript
   import { YoutubeTranscript } from 'youtube-transcript'
   
   const transcript = await YoutubeTranscript.fetchTranscript(videoId)
   ```

2. **OpenAI for Summaries**:
   ```javascript
   // Install: npm install openai
   import OpenAI from 'openai'
   
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
   const summary = await openai.chat.completions.create({
     model: "gpt-4",
     messages: [{ role: "user", content: `Summarize: ${transcript}` }]
   })
   ```

3. **Supabase Edge Functions**:
   Create a Supabase Edge Function to handle the processing:
   ```typescript
   // supabase/functions/generate-text/index.ts
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
   
   serve(async (req) => {
     const { videoId } = await req.json()
     // Process video and return generated text
     return new Response(JSON.stringify({ success: true, data }))
   })
   ```

## 🔌 API Integration

### Current Implementation (Demo Mode)
- Uses `mockGenerateText()` function
- Simulates 2-second API delay
- Returns sample data

### Production Implementation
Update `src/services/youtubeService.js`:

```javascript
export const generateTextFromYouTube = async (videoUrl) => {
  const videoId = extractVideoId(videoUrl)
  
  // Call your Supabase Edge Function
  const response = await supabase.functions.invoke('generate-text', {
    body: { videoId, videoUrl }
  })
  
  return response.data
}
```

## 📦 Dependencies

- **React 19** - UI library
- **Vite 7** - Build tool
- **@supabase/supabase-js** - Supabase client
- **axios** - HTTP client
- **@vitejs/plugin-react** - React plugin for Vite

## 🎯 Use Cases

- **Content Creation** - Generate blog posts from videos
- **Study Notes** - Extract key points for learning
- **SEO** - Generate meta descriptions and tags
- **Accessibility** - Create transcripts for videos
- **Research** - Quickly summarize educational content
- **Documentation** - Convert tutorial videos to text

## 🚧 Roadmap

- [ ] Real YouTube API integration
- [ ] OpenAI/GPT integration for summaries
- [ ] Batch processing multiple videos
- [ ] Save to Supabase database
- [ ] User authentication
- [ ] History of generated texts
- [ ] Custom prompt templates
- [ ] Multi-language support
- [ ] Video timestamp extraction
- [ ] Speaker identification

## 🔒 Security Notes

⚠️ **Important**:
- Never expose API keys in frontend code
- Use environment variables for sensitive data
- Implement rate limiting
- Validate all inputs on backend
- Use HTTPS in production

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Vite, and Supabase**

