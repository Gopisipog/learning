/**
 * Upwork API Service
 * 
 * This module handles all API calls to Upwork.
 * In production, these calls should go through a backend server.
 */

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Fetch jobs from Upwork
 * @param {Array} skills - Array of skills to search for
 * @returns {Promise} - Promise resolving to jobs data
 */
export const fetchUpworkJobs = async (skills) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/rss`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ skills })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.jobs
  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw error
  }
}

/**
 * Submit a bid to Upwork
 * @param {Object} bidData - Bid information
 * @returns {Promise} - Promise resolving to submission result
 */
export const submitBidToUpwork = async (bidData) => {
  try {
    // In production, this would call your backend API
    // which would then use Upwork's API to submit the bid
    
    const response = await fetch(`${API_BASE_URL}/bids/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers in production
        // 'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(bidData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error submitting bid:', error)
    throw error
  }
}

/**
 * Get submitted bids
 * @returns {Promise} - Promise resolving to array of submitted bids
 */
export const getSubmittedBids = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.bids
  } catch (error) {
    console.error('Error fetching bids:', error)
    throw error
  }
}

/**
 * Mock implementation for development
 * Remove this in production
 */
export const mockSubmitBid = async (bidData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate successful submission
  return {
    success: true,
    bidId: `bid-${Date.now()}`,
    message: 'Bid submitted successfully',
    data: bidData
  }
}

/**
 * Save bid to local storage (for demo purposes)
 */
export const saveBidLocally = (bidData) => {
  try {
    const existingBids = JSON.parse(localStorage.getItem('upwork_bids') || '[]')
    const newBid = {
      ...bidData,
      id: `bid-${Date.now()}`,
      submittedAt: new Date().toISOString()
    }
    existingBids.push(newBid)
    localStorage.setItem('upwork_bids', JSON.stringify(existingBids))
    return newBid
  } catch (error) {
    console.error('Error saving bid locally:', error)
    throw error
  }
}

/**
 * Get bids from local storage
 */
export const getLocalBids = () => {
  try {
    return JSON.parse(localStorage.getItem('upwork_bids') || '[]')
  } catch (error) {
    console.error('Error getting local bids:', error)
    return []
  }
}

/**
 * Export all bids as JSON
 */
export const exportBidsAsJSON = (bids) => {
  const dataStr = JSON.stringify(bids, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `upwork-bids-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

