import { useState } from 'react'
import './BidForm.css'

const BidForm = ({ job, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    hourlyRate: '',
    fixedPrice: '',
    estimatedDuration: '',
    durationType: 'hours',
    milestones: '',
    attachments: [],
    bidType: 'hourly'
  })

  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required'
    } else if (formData.coverLetter.length < 100) {
      newErrors.coverLetter = 'Cover letter should be at least 100 characters'
    }

    if (formData.bidType === 'hourly') {
      if (!formData.hourlyRate || formData.hourlyRate <= 0) {
        newErrors.hourlyRate = 'Valid hourly rate is required'
      }
    } else {
      if (!formData.fixedPrice || formData.fixedPrice <= 0) {
        newErrors.fixedPrice = 'Valid fixed price is required'
      }
    }

    if (!formData.estimatedDuration || formData.estimatedDuration <= 0) {
      newErrors.estimatedDuration = 'Estimated duration is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare bid data
      const bidData = {
        jobId: job.id,
        jobTitle: job.title,
        coverLetter: formData.coverLetter,
        rate: formData.bidType === 'hourly' ? formData.hourlyRate : formData.fixedPrice,
        bidType: formData.bidType,
        estimatedDuration: formData.estimatedDuration,
        durationType: formData.durationType,
        milestones: formData.milestones,
        submittedAt: new Date().toISOString()
      }

      // Call parent submit handler
      await onSubmit(bidData)

      // Close modal on success
      onClose()
    } catch (error) {
      setErrors({ submit: 'Failed to submit bid. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showPreview) {
    return (
      <div className="bid-modal-overlay" onClick={onClose}>
        <div className="bid-modal" onClick={(e) => e.stopPropagation()}>
          <div className="bid-modal-header">
            <h2>Preview Your Bid</h2>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>

          <div className="bid-preview">
            <div className="preview-section">
              <h3>Job: {job.title}</h3>
              <p className="job-budget">Budget: {job.budget}</p>
            </div>

            <div className="preview-section">
              <h4>Your Proposal</h4>
              <div className="preview-item">
                <strong>Bid Type:</strong> {formData.bidType === 'hourly' ? 'Hourly' : 'Fixed Price'}
              </div>
              <div className="preview-item">
                <strong>Rate:</strong> ${formData.bidType === 'hourly' ? formData.hourlyRate : formData.fixedPrice}
                {formData.bidType === 'hourly' && '/hour'}
              </div>
              <div className="preview-item">
                <strong>Estimated Duration:</strong> {formData.estimatedDuration} {formData.durationType}
              </div>
            </div>

            <div className="preview-section">
              <h4>Cover Letter</h4>
              <div className="preview-cover-letter">{formData.coverLetter}</div>
            </div>

            {formData.milestones && (
              <div className="preview-section">
                <h4>Milestones</h4>
                <div className="preview-milestones">{formData.milestones}</div>
              </div>
            )}
          </div>

          <div className="bid-modal-footer">
            <button 
              className="btn-secondary" 
              onClick={() => setShowPreview(false)}
            >
              Edit Bid
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bid to Upwork'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bid-modal-overlay" onClick={onClose}>
      <div className="bid-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bid-modal-header">
          <h2>Submit Bid</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="job-info">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <div className="job-meta">
            <span>Budget: {job.budget}</span>
            <span>Duration: {job.duration}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bid-form">
          {errors.submit && (
            <div className="error-banner">{errors.submit}</div>
          )}

          <div className="form-group">
            <label>Bid Type *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="bidType"
                  value="hourly"
                  checked={formData.bidType === 'hourly'}
                  onChange={handleChange}
                />
                Hourly Rate
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="bidType"
                  value="fixed"
                  checked={formData.bidType === 'fixed'}
                  onChange={handleChange}
                />
                Fixed Price
              </label>
            </div>
          </div>

          {formData.bidType === 'hourly' ? (
            <div className="form-group">
              <label htmlFor="hourlyRate">Hourly Rate (USD) *</label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="0"
                step="0.01"
                className={errors.hourlyRate ? 'error' : ''}
              />
              {errors.hourlyRate && <span className="error-text">{errors.hourlyRate}</span>}
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="fixedPrice">Fixed Price (USD) *</label>
              <input
                type="number"
                id="fixedPrice"
                name="fixedPrice"
                value={formData.fixedPrice}
                onChange={handleChange}
                placeholder="e.g., 5000"
                min="0"
                step="0.01"
                className={errors.fixedPrice ? 'error' : ''}
              />
              {errors.fixedPrice && <span className="error-text">{errors.fixedPrice}</span>}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedDuration">Estimated Duration *</label>
              <input
                type="number"
                id="estimatedDuration"
                name="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={handleChange}
                placeholder="e.g., 40"
                min="0"
                className={errors.estimatedDuration ? 'error' : ''}
              />
              {errors.estimatedDuration && <span className="error-text">{errors.estimatedDuration}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="durationType">Duration Type</label>
              <select
                id="durationType"
                name="durationType"
                value={formData.durationType}
                onChange={handleChange}
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">Cover Letter *</label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Introduce yourself and explain why you're the best fit for this project..."
              rows="8"
              className={errors.coverLetter ? 'error' : ''}
            />
            <div className="char-count">
              {formData.coverLetter.length} characters (minimum 100)
            </div>
            {errors.coverLetter && <span className="error-text">{errors.coverLetter}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="milestones">Milestones (Optional)</label>
            <textarea
              id="milestones"
              name="milestones"
              value={formData.milestones}
              onChange={handleChange}
              placeholder="Describe project milestones and deliverables..."
              rows="4"
            />
            <small>Break down the project into key milestones</small>
          </div>

          <div className="bid-modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={handlePreview}>
              Preview Bid
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BidForm

