# Murugan Shorts Generator

This script automatically generates 25 devotional shorts about Lord Murugan using the Creatomate API.

## Features

- Creates 25 unique video shorts with Tamil content about Lord Murugan
- Each short has 4 text sections and 4 background images
- Includes Tamil proverbs with English translations
- Uses devotional music from YouTube
- Automatically saves all results to a JSON file

## Setup

1. Install Node.js (if not already installed)
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the script:
```bash
npm start
```

Or directly with Node:
```bash
node generate-shorts.js
```

## What the Script Does

1. Sends 25 API requests to Creatomate
2. Each request creates a video short with:
   - Background music (YouTube link)
   - 4 background images (from various sources)
   - 4 text overlays (Tamil devotional content)
3. Waits 2 seconds between requests to avoid rate limiting
4. Saves all responses to a timestamped JSON file

## Output

- Console logs showing progress for each short
- A JSON file named `results-YYYY-MM-DDTHH-MM-SS.json` with all API responses
- Summary showing successful and failed renders

## Content Structure

Each short contains:
- **Music**: Devotional Murugan songs from YouTube
- **Background 1-4**: Images from Zedge, Freepik, Unsplash, and Pexels
- **Text 1-4**: Tamil devotional content including:
  - Murugan's attributes and titles
  - Devotional messages
  - Tamil proverbs with English translations
  - Closing devotional phrases

## API Details

- **API**: Creatomate Video Rendering API
- **Template ID**: 2e8f41dd-8125-4046-b326-8e5df550830a
- **Rate Limiting**: 2 second delay between requests

## Notes

- The script processes all 25 shorts sequentially
- Total execution time: approximately 50-60 seconds
- Make sure you have a stable internet connection
- Check the results JSON file for render IDs and status

