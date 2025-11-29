# Upwork API Integration Guide

This guide will help you integrate the real Upwork API into your React application.

## Prerequisites

1. **Upwork Account**: You need an Upwork account
2. **API Access**: Register your application at [Upwork Developer Portal](https://www.upwork.com/developer)

## Step 1: Register Your Application

1. Go to https://www.upwork.com/developer
2. Click "Register a New Application"
3. Fill in the application details:
   - Application Name: "Jobs Listing App"
   - Callback URL: `http://localhost:3001/callback` (for development)
4. Save your **Client ID** and **Client Secret**

## Step 2: Set Up Backend Server

You'll need a backend server to handle OAuth authentication and API calls securely.

### Option A: Node.js/Express Backend

Create a new folder `backend` and install dependencies:

```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv upwork-api
```

Create `.env` file:
```env
UPWORK_CLIENT_ID=your_client_id
UPWORK_CLIENT_SECRET=your_client_secret
UPWORK_REDIRECT_URI=http://localhost:3001/callback
PORT=5000
```

Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const UpworkApi = require('upwork-api');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  consumerKey: process.env.UPWORK_CLIENT_ID,
  consumerSecret: process.env.UPWORK_CLIENT_SECRET,
  accessToken: null,
  accessSecret: null,
  debug: true
};

// OAuth authentication endpoint
app.get('/auth/upwork', (req, res) => {
  const api = new UpworkApi(config);
  api.getAuthorizationUrl('http://localhost:3001/callback', (error, url) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json({ authUrl: url });
  });
});

// Callback endpoint
app.get('/auth/callback', (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;
  const api = new UpworkApi(config);
  
  api.getAccessToken(oauth_token, oauth_verifier, (error, accessToken, accessSecret) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    // Store tokens securely (use database in production)
    config.accessToken = accessToken;
    config.accessSecret = accessSecret;
    
    res.redirect('http://localhost:3001?auth=success');
  });
});

// Fetch jobs endpoint
app.post('/api/jobs', async (req, res) => {
  const { skills } = req.body;
  
  if (!config.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const api = new UpworkApi(config);
  const jobs = new api.routers.Jobs.Search(api);
  
  const query = skills.join(' OR ');
  const params = {
    q: query,
    sort: 'recency',
    paging: '0;50'
  };
  
  jobs.find(params, (error, data) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

### Option B: Python/Flask Backend

```bash
pip install flask flask-cors python-upwork
```

Create `app.py`:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import upwork
import os

app = Flask(__name__)
CORS(app)

config = upwork.Config({
    'consumer_key': os.getenv('UPWORK_CLIENT_ID'),
    'consumer_secret': os.getenv('UPWORK_CLIENT_SECRET'),
})

@app.route('/api/jobs', methods=['POST'])
def get_jobs():
    data = request.json
    skills = data.get('skills', [])
    
    client = upwork.Client(config)
    
    query = ' OR '.join(skills)
    params = {
        'q': query,
        'sort': 'recency',
        'paging': '0;50'
    }
    
    jobs = client.provider.search_jobs(params)
    return jsonify(jobs)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

## Step 3: Update Frontend

Update `src/components/JobsListing.jsx`:

```javascript
const fetchJobs = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        skills: selectedSkills 
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const data = await response.json();
    
    // Transform Upwork API response to match our format
    const transformedJobs = data.jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.snippet,
      budget: job.budget ? `$${job.budget}` : 'Not specified',
      duration: job.duration || 'Not specified',
      skill: selectedSkills.find(s => job.skills.toLowerCase().includes(s.toLowerCase())),
      posted: job.date_created,
      client: {
        rating: job.client?.feedback || 'N/A',
        jobsPosted: job.client?.jobs_posted || 0,
        hireRate: job.client?.hire_rate || 0
      }
    }));

    setJobs(transformedJobs);
  } catch (err) {
    setError('Failed to fetch jobs. Please try again.');
    console.error('Error fetching jobs:', err);
  } finally {
    setLoading(false);
  }
};
```

## Step 4: Run the Application

1. Start the backend server:
```bash
cd backend
node server.js  # or python app.py
```

2. Start the React app (already running):
```bash
npm run dev
```

3. Open http://localhost:3001 in your browser

## Important Notes

- **Rate Limits**: Upwork API has rate limits. Check their documentation.
- **Authentication**: Store tokens securely (use database, not in-memory)
- **Error Handling**: Implement proper error handling for API failures
- **Production**: Use environment variables and secure token storage
- **CORS**: Configure CORS properly for production

## Upwork API Documentation

- Main Docs: https://developers.upwork.com/
- API Reference: https://developers.upwork.com/api-reference
- OAuth Guide: https://developers.upwork.com/authentication-and-authorization

## Alternative: Use Upwork RSS Feeds

For simpler implementation without OAuth, you can use Upwork's RSS feeds:

```javascript
const fetchJobsFromRSS = async () => {
  const rssUrl = `https://www.upwork.com/ab/feed/jobs/rss?q=${selectedSkills.join('+OR+')}`;
  
  // Use a CORS proxy or backend to fetch RSS
  const response = await fetch(`http://localhost:5000/api/rss?url=${encodeURIComponent(rssUrl)}`);
  const xml = await response.text();
  
  // Parse XML and convert to JSON
  // Use a library like 'xml2js' or 'fast-xml-parser'
};
```

This approach is simpler but provides less data than the full API.

