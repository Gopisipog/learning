import { useState } from 'react'
import {
	  generateTextFromYouTube,
	  mockGenerateText,
	  isValidYouTubeUrl,
	  exportAsJSON,
	  exportAsMarkdown,
	} from '../services/youtubeService'
import './YouTubeTextGenerator.css'

const YouTubeTextGenerator = () => {
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedData, setGeneratedData] = useState(null)
  const [history, setHistory] = useState([])

	  const handleGenerate = async () => {
    // Validate URL
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    if (!isValidYouTubeUrl(videoUrl)) {
      setError('Please enter a valid YouTube URL')
      return
    }

    setError('')
    setLoading(true)

	    try {
	      // Prefer real Supadata integration; fall back to mock if API key is missing
	      let result
	      try {
	        result = await generateTextFromYouTube(videoUrl)
	      } catch (innerErr) {
	        if (
	          innerErr.message &&
	          innerErr.message.includes('Supadata API key is not configured')
	        ) {
	          result = await mockGenerateText(videoUrl)
	        } else {
	          throw innerErr
	        }
	      }

	      setGeneratedData(result)
	      setHistory((prev) => [result, ...prev])
	    } catch (err) {
      setError(err.message || 'Failed to generate text. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setVideoUrl('')
    setGeneratedData(null)
    setError('')
  }

	  const handleExport = () => {
	    if (generatedData) {
	      exportAsJSON(generatedData, `youtube-text-${generatedData.videoId}`)
	    }
	  }

	  const handleExportMarkdown = () => {
	    if (generatedData) {
	      exportAsMarkdown(
	        generatedData,
	        `youtube-text-${generatedData.videoId}`
	      )
	    }
	  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate()
    }
  }

  return (
    <div className="youtube-generator">
      <div className="generator-header">
        <h1>🎥 YouTube Text Generator</h1>
        <p>Extract transcripts, summaries, and key points from YouTube videos</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <input
            type="text"
            className={`url-input ${error ? 'error' : ''}`}
            placeholder="Enter YouTube URL (e.g., https://youtube.com/watch?v=...)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button 
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading || !videoUrl.trim()}
          >
            {loading ? '⏳ Generating...' : '✨ Generate Text'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="example-urls">
          <p>Example URLs:</p>
          <button 
            className="example-btn"
            onClick={() => setVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
          >
            Use Example 1
          </button>
          <button 
            className="example-btn"
            onClick={() => setVideoUrl('https://youtu.be/dQw4w9WgXcQ')}
          >
            Use Example 2
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing video and generating text...</p>
        </div>
      )}

      {generatedData && !loading && (
        <div className="results-section">
	          <div className="results-header">
	            <h2>📄 Generated Text</h2>
	            <div className="action-buttons">
	              <button className="export-btn" onClick={handleExport}>
	                📥 Export JSON
	              </button>
	              <button className="export-btn" onClick={handleExportMarkdown}>
	                📥 Export Markdown
	              </button>
	              <button className="clear-btn" onClick={handleClear}>
	                🗑️ Clear
	              </button>
	            </div>
	          </div>

          <div className="result-card">
            <div className="result-item">
              <h3>🎬 Video Title</h3>
              <p>{generatedData.generatedText.title}</p>
            </div>

            <div className="result-item">
              <h3>📝 Description</h3>
              <p>{generatedData.generatedText.description}</p>
            </div>

            <div className="result-item">
              <h3>📋 Summary</h3>
              <p>{generatedData.generatedText.summary}</p>
            </div>

            <div className="result-item">
              <h3>🔑 Key Points</h3>
              <ul>
                {generatedData.generatedText.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="result-item">
              <h3>📜 Transcript</h3>
              <pre className="transcript">{generatedData.generatedText.transcript}</pre>
            </div>

            <div className="result-item">
              <h3>🏷️ Tags</h3>
              <div className="tags">
                {generatedData.generatedText.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default YouTubeTextGenerator

