/**
 * Sample Backend Server for Upwork API Integration
 * 
 * This is a simple Express server that can be used to integrate with Upwork API.
 * 
 * Setup:
 * 1. Create a new directory: mkdir backend && cd backend
 * 2. Copy this file to backend/server.js
 * 3. Install dependencies: npm install express cors dotenv axios xml2js
 * 4. Create .env file with your Upwork credentials
 * 5. Run: node server.js
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Simple RSS-based job fetching (no OAuth required)
 * This uses Upwork's public RSS feeds
 */
app.post('/api/jobs/rss', async (req, res) => {
  try {
    const { skills } = req.body;
    
    if (!skills || skills.length === 0) {
      return res.status(400).json({ error: 'Skills are required' });
    }

    // Build search query
    const query = skills.join(' OR ');
    const rssUrl = `https://www.upwork.com/ab/feed/jobs/rss?q=${encodeURIComponent(query)}&sort=recency`;

    // Fetch RSS feed
    const response = await axios.get(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Parse XML to JSON
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);

    // Extract job items
    const items = result.rss?.channel?.[0]?.item || [];
    
    // Transform to our format
    const jobs = items.map((item, index) => {
      const description = item.description?.[0] || '';
      const title = item.title?.[0] || 'Untitled Job';
      
      return {
        id: `job-${Date.now()}-${index}`,
        title: title,
        description: description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        budget: extractBudget(description),
        duration: extractDuration(description),
        skill: skills.find(s => title.toLowerCase().includes(s.toLowerCase())) || skills[0],
        posted: item.pubDate?.[0] || new Date().toISOString(),
        link: item.link?.[0] || '',
        client: {
          rating: 'N/A',
          jobsPosted: 0,
          hireRate: 0
        }
      };
    });

    res.json({ jobs, count: jobs.length });

  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch jobs from Upwork',
      details: error.message 
    });
  }
});

/**
 * OAuth-based job fetching (requires Upwork API credentials)
 * Uncomment and configure if you have Upwork API access
 */
/*
app.post('/api/jobs/oauth', async (req, res) => {
  try {
    const { skills } = req.body;
    
    // Initialize Upwork API client
    const upworkClient = initializeUpworkClient();
    
    const query = skills.join(' OR ');
    const params = {
      q: query,
      sort: 'recency',
      paging: '0;50'
    };
    
    const jobs = await upworkClient.jobs.search(params);
    res.json(jobs);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/

// Helper function to extract budget from description
function extractBudget(description) {
  const budgetMatch = description.match(/\$[\d,]+(?:\.\d{2})?/);
  return budgetMatch ? budgetMatch[0] : 'Not specified';
}

// Helper function to extract duration from description
function extractDuration(description) {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('long-term') || lowerDesc.includes('ongoing')) {
    return 'Long-term';
  } else if (lowerDesc.includes('short-term') || lowerDesc.includes('quick')) {
    return 'Short-term';
  } else if (lowerDesc.includes('medium')) {
    return 'Medium-term';
  }
  return 'Not specified';
}

/**
 * Submit a bid to Upwork
 * This is a mock implementation - in production, integrate with Upwork API
 */
app.post('/api/bids/submit', async (req, res) => {
  try {
    const bidData = req.body;

    // Validate bid data
    if (!bidData.jobId || !bidData.coverLetter || !bidData.rate) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['jobId', 'coverLetter', 'rate']
      });
    }

    // In production, submit to Upwork API using OAuth credentials
    // const upworkClient = initializeUpworkClient();
    // const result = await upworkClient.submitBid({
    //   job_id: bidData.jobId,
    //   cover_letter: bidData.coverLetter,
    //   amount: bidData.rate,
    //   ...
    // });

    // Mock successful response
    const response = {
      success: true,
      bidId: `bid-${Date.now()}`,
      jobId: bidData.jobId,
      jobTitle: bidData.jobTitle,
      submittedAt: new Date().toISOString(),
      message: 'Bid submitted successfully to Upwork',
      data: bidData
    };

    console.log('✅ Bid submitted:', response);
    res.json(response);

  } catch (error) {
    console.error('Error submitting bid:', error.message);
    res.status(500).json({
      error: 'Failed to submit bid',
      details: error.message
    });
  }
});

/**
 * Get all submitted bids
 */
app.get('/api/bids', (req, res) => {
  // In production, fetch from database or Upwork API
  res.json({
    bids: [],
    message: 'This endpoint would return bids from your database'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Jobs API: http://localhost:${PORT}/api/jobs/rss`);
  console.log(`📤 Bids API: http://localhost:${PORT}/api/bids/submit`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;

