# Bid Submission Feature Guide

This guide explains how to use the bid submission feature and integrate it with the real Upwork API.

## Features

✅ **Submit Bids** - Submit proposals directly from the job listing  
✅ **Bid Preview** - Review your bid before submission  
✅ **Form Validation** - Ensures all required fields are filled  
✅ **Local Storage** - Saves bids locally for demo purposes  
✅ **Export Bids** - Download all submitted bids as JSON  
✅ **Visual Feedback** - See which jobs you've already bid on  

## How to Use

### 1. Browse Jobs
- Click "Fetch Jobs" to load job listings
- Filter by skills (.NET, React, Angular)

### 2. Submit a Bid
1. Click the **"Submit Bid"** button on any job card
2. Fill out the bid form:
   - **Bid Type**: Choose Hourly or Fixed Price
   - **Rate**: Enter your hourly rate or fixed price
   - **Duration**: Estimate how long the project will take
   - **Cover Letter**: Write a compelling proposal (minimum 100 characters)
   - **Milestones** (optional): Break down the project into phases

3. Click **"Preview Bid"** to review your submission
4. Click **"Submit Bid to Upwork"** to finalize

### 3. Track Your Bids
- Jobs you've bid on will show a green checkmark
- View the summary banner showing total bids submitted
- Click **"Download Bids"** to export all your bids as JSON

## Current Implementation (Demo Mode)

The app currently runs in **demo mode** with the following behavior:

- ✅ Bids are saved to browser's local storage
- ✅ You can preview and validate bids
- ✅ Export bids as JSON
- ⚠️ Bids are NOT sent to Upwork (requires API integration)

## Production Integration

To connect to the real Upwork API, follow these steps:

### Step 1: Backend Setup

The bid submission requires a backend server to handle OAuth authentication.

#### Option A: Use the Sample Backend

1. Create a backend directory:
```bash
mkdir backend
cd backend
npm init -y
npm install express cors axios xml2js dotenv
```

2. Copy the sample server:
```bash
cp ../sample-backend-server.js server.js
```

3. Create `.env` file:
```env
PORT=5000
UPWORK_CLIENT_ID=your_client_id
UPWORK_CLIENT_SECRET=your_client_secret
```

4. Start the server:
```bash
node server.js
```

#### Option B: Integrate with Upwork API

Update `sample-backend-server.js` to use the real Upwork API:

```javascript
const upwork = require('upwork-api');

// Initialize Upwork client
const config = new upwork.Config({
  consumerKey: process.env.UPWORK_CLIENT_ID,
  consumerSecret: process.env.UPWORK_CLIENT_SECRET,
  accessToken: userAccessToken,
  accessSecret: userAccessSecret
});

const client = new upwork.Client(config);

// Submit bid endpoint
app.post('/api/bids/submit', async (req, res) => {
  const { jobId, coverLetter, rate, bidType } = req.body;
  
  try {
    const result = await client.offers.makeOffer({
      job_id: jobId,
      cover_letter: coverLetter,
      amount: rate,
      charge_rate: bidType === 'hourly' ? rate : null,
      // Add other required fields
    });
    
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Step 2: Frontend Configuration

Update the API URL in your frontend:

1. Create `.env` file in the root:
```env
VITE_API_URL=http://localhost:5000/api
```

2. The app will automatically use this URL for API calls

### Step 3: Enable Real Submissions

Update `src/components/JobsListing.jsx`:

```javascript
import { submitBidToUpwork } from '../services/upworkApi'

const handleBidSubmit = async (bidData) => {
  try {
    // Use real API instead of local storage
    const result = await submitBidToUpwork(bidData)
    
    setSubmittedBids(prev => [...prev, result.data])
    alert(`✅ Bid submitted to Upwork!\nBid ID: ${result.bidId}`)
  } catch (error) {
    alert('❌ Failed to submit bid. Please try again.')
    throw error
  }
}
```

## Bid Data Structure

When a bid is submitted, it contains:

```json
{
  "id": "bid-1234567890",
  "jobId": "job-123",
  "jobTitle": "React Developer - Project 1",
  "coverLetter": "Your cover letter text...",
  "rate": "50",
  "bidType": "hourly",
  "estimatedDuration": "40",
  "durationType": "hours",
  "milestones": "Optional milestone description",
  "submittedAt": "2025-11-22T10:30:00.000Z"
}
```

## API Endpoints

### Submit Bid
```
POST /api/bids/submit
Content-Type: application/json

{
  "jobId": "string",
  "jobTitle": "string",
  "coverLetter": "string",
  "rate": "number",
  "bidType": "hourly" | "fixed",
  "estimatedDuration": "number",
  "durationType": "hours" | "days" | "weeks" | "months",
  "milestones": "string"
}
```

### Get Bids
```
GET /api/bids
```

## Best Practices

1. **Cover Letter**: Write personalized, compelling proposals
2. **Rate**: Research market rates for your skills
3. **Timeline**: Be realistic with estimates
4. **Milestones**: Break complex projects into phases
5. **Preview**: Always review before submitting

## Troubleshooting

**Bid not saving?**
- Check browser console for errors
- Ensure local storage is enabled

**Can't submit bid?**
- Verify all required fields are filled
- Cover letter must be at least 100 characters

**Backend not connecting?**
- Ensure backend server is running on port 5000
- Check CORS settings
- Verify API URL in `.env` file

## Security Notes

⚠️ **Important**: Never expose API credentials in frontend code!

- Store credentials in backend `.env` file
- Use environment variables
- Implement proper authentication
- Validate all inputs on backend
- Use HTTPS in production

## Next Steps

1. ✅ Test the bid form with demo data
2. 📖 Read Upwork API documentation
3. 🔑 Get Upwork API credentials
4. 🔧 Set up backend server
5. 🚀 Deploy to production

## Resources

- [Upwork API Documentation](https://developers.upwork.com/)
- [OAuth 2.0 Guide](https://developers.upwork.com/authentication-and-authorization)
- [Upwork API Reference](https://developers.upwork.com/api-reference)

