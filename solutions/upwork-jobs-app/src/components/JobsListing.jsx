import { useState, useEffect } from 'react'
import BidForm from './BidForm'
import { saveBidLocally, getLocalBids, exportBidsAsJSON } from '../services/upworkApi'
import './JobsListing.css'

const JobsListing = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSkills, setSelectedSkills] = useState(['.NET', 'React', 'Angular'])
  const [selectedJob, setSelectedJob] = useState(null)
  const [showBidModal, setShowBidModal] = useState(false)
  const [submittedBids, setSubmittedBids] = useState([])

  const skills = ['.NET', 'React', 'Angular']

  // Fetch jobs from Upwork API
  const fetchJobs = async () => {
    setLoading(true)
    setError(null)

    try {
      // Note: This is a mock implementation. In production, you'll need:
      // 1. Upwork API credentials (OAuth 2.0)
      // 2. A backend proxy to handle API calls securely
      // 3. Proper authentication flow
      
      // For demonstration, we'll create mock data
      // In production, replace this with actual API call:
      // const response = await fetch('YOUR_BACKEND_API/upwork/jobs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ skills: selectedSkills })
      // })
      
      const mockJobs = generateMockJobs(selectedSkills)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setJobs(mockJobs)
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.')
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  // Generate mock jobs for demonstration
  const generateMockJobs = (skills) => {
    const mockData = []
    skills.forEach((skill, index) => {
      for (let i = 1; i <= 5; i++) {
        mockData.push({
          id: `${skill}-${i}`,
          title: `${skill} Developer - Project ${i}`,
          description: `Looking for an experienced ${skill} developer to work on an exciting project. Must have 3+ years of experience.`,
          budget: `$${(Math.random() * 5000 + 1000).toFixed(2)}`,
          duration: ['Short-term', 'Medium-term', 'Long-term'][Math.floor(Math.random() * 3)],
          skill: skill,
          posted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          client: {
            rating: (Math.random() * 2 + 3).toFixed(1),
            jobsPosted: Math.floor(Math.random() * 50 + 1),
            hireRate: Math.floor(Math.random() * 50 + 50)
          }
        })
      }
    })
    return mockData
  }

  // Download jobs as JSON
  const downloadJSON = () => {
    const dataStr = JSON.stringify(jobs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `upwork-jobs-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Toggle skill selection
  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  // Handle bid button click
  const handleBidClick = (job) => {
    setSelectedJob(job)
    setShowBidModal(true)
  }

  // Handle bid submission
  const handleBidSubmit = async (bidData) => {
    try {
      // Save bid locally (for demo)
      const savedBid = saveBidLocally(bidData)

      // Update state
      setSubmittedBids(prev => [...prev, savedBid])

      // In production, send bid to backend API
      // const response = await submitBidToUpwork(bidData)

      // Show success message
      alert(`✅ Bid submitted successfully!\n\nJob: ${bidData.jobTitle}\nRate: $${bidData.rate}${bidData.bidType === 'hourly' ? '/hour' : ''}\n\nYour bid has been saved locally. In production, this would be sent to Upwork API.`)

      console.log('Bid submitted:', savedBid)
    } catch (error) {
      console.error('Error submitting bid:', error)
      throw error
    }
  }

  // Check if job has been bid on
  const hasSubmittedBid = (jobId) => {
    return submittedBids.some(bid => bid.jobId === jobId)
  }

  // Download submitted bids as JSON
  const downloadBidsJSON = () => {
    exportBidsAsJSON(submittedBids)
  }

  useEffect(() => {
    if (selectedSkills.length > 0) {
      fetchJobs()
    }
    // Load previously submitted bids from local storage
    const localBids = getLocalBids()
    setSubmittedBids(localBids)
  }, [])

  return (
    <div className="jobs-listing">
      <div className="controls">
        <div className="skill-filters">
          <h3>Filter by Skills:</h3>
          <div className="skill-buttons">
            {skills.map(skill => (
              <button
                key={skill}
                className={`skill-btn ${selectedSkills.includes(skill) ? 'active' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
        
        <div className="action-buttons">
          <button 
            className="fetch-btn" 
            onClick={fetchJobs}
            disabled={loading || selectedSkills.length === 0}
          >
            {loading ? 'Loading...' : 'Fetch Jobs'}
          </button>
          
          <button
            className="download-btn"
            onClick={downloadJSON}
            disabled={jobs.length === 0}
          >
            📥 Download Jobs ({jobs.length})
          </button>

          <button
            className="download-bids-btn"
            onClick={downloadBidsJSON}
            disabled={submittedBids.length === 0}
          >
            📤 Download Bids ({submittedBids.length})
          </button>
        </div>
      </div>

      {submittedBids.length > 0 && (
        <div className="bids-summary">
          <h3>📋 Your Submitted Bids</h3>
          <p>You have submitted {submittedBids.length} bid{submittedBids.length !== 1 ? 's' : ''}. Click the download button to export them.</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Fetching jobs...</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="jobs-grid">
          {jobs.map(job => {
            const hasBid = hasSubmittedBid(job.id)
            return (
              <div key={job.id} className={`job-card ${hasBid ? 'bid-submitted' : ''}`}>
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className={`skill-badge ${job.skill.toLowerCase()}`}>{job.skill}</span>
                </div>
                <p className="job-description">{job.description}</p>
                <div className="job-details">
                  <div className="detail-item">
                    <strong>Budget:</strong> {job.budget}
                  </div>
                  <div className="detail-item">
                    <strong>Duration:</strong> {job.duration}
                  </div>
                </div>
                <div className="job-actions">
                  <button
                    className={`bid-btn ${hasBid ? 'bid-submitted-btn' : ''}`}
                    onClick={() => handleBidClick(job)}
                    disabled={hasBid}
                  >
                    {hasBid ? '✓ Bid Submitted' : 'Submit Bid'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showBidModal && selectedJob && (
        <BidForm
          job={selectedJob}
          onClose={() => {
            setShowBidModal(false)
            setSelectedJob(null)
          }}
          onSubmit={handleBidSubmit}
        />
      )}
    </div>
  )
}

export default JobsListing

