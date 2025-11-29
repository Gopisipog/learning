// Supabase is optional and not required for Supadata integration.
// This file is kept only if you later want to store generated results in Supabase.

import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase URL and anon/public key if you choose to use Supabase.
export const SUPABASE_URL = 'https://your-project.supabase.co'
export const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Example placeholder for a custom backend endpoint (not used by Supadata integration).
export const YOUTUBE_API_ENDPOINT = '/api/youtube-text-generator'

