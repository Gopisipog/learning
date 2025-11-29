# 🔧 Supabase Setup Guide

This guide explains how to integrate the YouTube Text Generator with Supabase API.

## 📋 Prerequisites

- Supabase account (free tier available)
- Your Supabase API key: `sd_438d268f090a968d1774fe48e67cb122`

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create an account
4. Click "New Project"
5. Fill in project details:
   - **Name**: youtube-text-generator
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait for project to be provisioned (~2 minutes)

## 🔑 Step 2: Get Your API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Find your credentials:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Your API key
   - **service_role key**: (keep this secret!)

## 📝 Step 3: Update Configuration

Edit `src/config/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase URL
const SUPABASE_URL = 'https://your-project-id.supabase.co'

// Your API key
const SUPABASE_KEY = 'sd_438d268f090a968d1774fe48e67cb122'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
```

## 🗄️ Step 4: Create Database Table (Optional)

If you want to save generated texts to Supabase:

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Paste this SQL:

```sql
-- Create table for storing generated texts
CREATE TABLE youtube_texts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  video_id TEXT NOT NULL,
  video_url TEXT NOT NULL,
  generated_text JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_video_id ON youtube_texts(video_id);
CREATE INDEX idx_created_at ON youtube_texts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE youtube_texts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust for production)
CREATE POLICY "Allow all operations" ON youtube_texts
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click "Run" to execute

## ⚡ Step 5: Create Supabase Edge Function

Supabase Edge Functions allow you to run server-side code.

### Create the Function

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Initialize Supabase in your project:
```bash
supabase init
```

4. Create a new Edge Function:
```bash
supabase functions new generate-text
```

5. Edit `supabase/functions/generate-text/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { videoId, videoUrl } = await req.json()

    // Validate input
    if (!videoId || !videoUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing videoId or videoUrl' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // TODO: Implement actual YouTube API integration
    // For now, return mock data
    const generatedText = {
      title: `Video ${videoId}`,
      description: 'Generated description',
      transcript: 'Generated transcript...',
      summary: 'Generated summary...',
      keyPoints: ['Point 1', 'Point 2', 'Point 3'],
      tags: ['tag1', 'tag2'],
      duration: '10:00',
      generatedAt: new Date().toISOString()
    }

    // Save to database (optional)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase.from('youtube_texts').insert({
      video_id: videoId,
      video_url: videoUrl,
      generated_text: generatedText
    })

    return new Response(
      JSON.stringify({ success: true, data: generatedText }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

6. Deploy the function:
```bash
supabase functions deploy generate-text
```

## 🔌 Step 6: Update Frontend to Use Edge Function

Edit `src/services/youtubeService.js`:

```javascript
import { supabase } from '../config/supabase'

export const generateTextFromYouTube = async (videoUrl) => {
  const videoId = extractVideoId(videoUrl)
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  // Call Supabase Edge Function
  const { data, error } = await supabase.functions.invoke('generate-text', {
    body: { videoId, videoUrl }
  })

  if (error) throw error

  return {
    success: true,
    videoId,
    videoUrl,
    generatedText: data.data
  }
}
```

## 🔐 Step 7: Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Update `src/config/supabase.js`:

```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## ✅ Step 8: Test the Integration

1. Restart your dev server:
```bash
npm run dev
```

2. Open http://localhost:5173
3. Enter a YouTube URL
4. Click "Generate Text"
5. Check Supabase dashboard → Table Editor → youtube_texts

## 📊 Monitoring

View your Edge Function logs:
```bash
supabase functions logs generate-text
```

## 🔒 Security Best Practices

1. **Never expose service_role key** in frontend
2. **Use Row Level Security (RLS)** on tables
3. **Implement rate limiting** in Edge Functions
4. **Validate all inputs** on server side
5. **Use environment variables** for secrets

## 🆘 Troubleshooting

**Function not deploying?**
- Check Supabase CLI is installed: `supabase --version`
- Make sure you're logged in: `supabase login`
- Check function syntax for errors

**Database connection failed?**
- Verify SUPABASE_URL is correct
- Check API key is valid
- Ensure RLS policies allow access

**CORS errors?**
- Edge Functions automatically handle CORS
- Check browser console for specific errors

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)

---

**Your Supabase API Key**: `sd_438d268f090a968d1774fe48e67cb122`

