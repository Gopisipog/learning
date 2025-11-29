# Upwork Jobs Listing App

A React application for fetching and displaying job listings for .NET, React, and Angular positions from Upwork API.

## Features

- 🔍 **Search Jobs** - Filter by skills (.NET, React, Angular)
- 📊 **Job Listings** - Display jobs in a clean, organized grid
- 💾 **Download Jobs** - Export job listings as JSON file
- 📝 **Submit Bids** - Create and submit proposals directly from the app
- 👁️ **Bid Preview** - Review your bid before submission
- ✅ **Form Validation** - Ensures all required fields are complete
- 📤 **Export Bids** - Download all submitted bids as JSON
- 💚 **Track Bids** - Visual indicators for jobs you've already bid on
- 🎨 **Modern UI** - Responsive design with beautiful gradients
- ⚡ **Fast Development** - Built with React and Vite

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

### Browse Jobs
1. **Select Skills**: Click on the skill buttons (.NET, React, Angular) to filter jobs
2. **Fetch Jobs**: Click the "Fetch Jobs" button to retrieve job listings
3. **Download Jobs**: Click the "Download Jobs" button to save the jobs data as JSON

### Submit Bids
1. **Click "Submit Bid"** on any job card
2. **Fill out the form**:
   - Choose bid type (Hourly or Fixed Price)
   - Enter your rate
   - Estimate project duration
   - Write a compelling cover letter (minimum 100 characters)
   - Add milestones (optional)
3. **Preview your bid** to review all details
4. **Submit** to save the bid (locally in demo mode)

### Track Your Bids
- Jobs you've bid on show a green checkmark
- View the summary banner showing total bids
- Click "Download Bids" to export all your bids as JSON

For detailed bid submission instructions, see [BID_SUBMISSION_GUIDE.md](./BID_SUBMISSION_GUIDE.md)

## Upwork API Integration

**Note**: This app currently uses mock data for demonstration purposes. To integrate with the real Upwork API:

1. **Get Upwork API Credentials**:
   - Register your application at [Upwork Developer Portal](https://www.upwork.com/developer)
   - Obtain OAuth 2.0 credentials (Client ID and Client Secret)

2. **Set up a Backend Proxy**:
   - Create a backend server (Node.js/Express, Python/Flask, etc.)
   - Implement OAuth 2.0 authentication flow
   - Create an endpoint to fetch jobs from Upwork API
   - Example endpoint: `POST /api/upwork/jobs`

3. **Update the Frontend**:
   - Replace the mock data in `src/components/JobsListing.jsx`
   - Update the `fetchJobs` function to call your backend API
   - Handle authentication tokens securely

### Example API Integration

```javascript
const fetchJobs = async () => {
  setLoading(true)
  setError(null)

  try {
    const response = await fetch('YOUR_BACKEND_URL/api/upwork/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify({ 
        skills: selectedSkills,
        limit: 50 
      })
    })

    const data = await response.json()
    setJobs(data.jobs)
  } catch (err) {
    setError('Failed to fetch jobs. Please try again.')
  } finally {
    setLoading(false)
  }
}
```

## Project Structure

```
upwork-jobs-app/
├── src/
│   ├── components/
│   │   ├── JobsListing.jsx      # Main jobs listing component
│   │   ├── JobsListing.css      # Styles for jobs listing
│   │   ├── BidForm.jsx          # Bid submission form
│   │   └── BidForm.css          # Bid form styles
│   ├── services/
│   │   └── upworkApi.js         # API service layer
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # App styles
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
├── README.md                   # This file
├── QUICKSTART.md              # Quick start guide
├── UPWORK_API_GUIDE.md        # API integration guide
├── BID_SUBMISSION_GUIDE.md    # Bid submission guide
└── sample-backend-server.js   # Sample backend server
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## License

MIT

