import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
]

function App() {
  const [file, setFile] = useState(null)
  const [language, setLanguage] = useState('en')
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)
  const [transcript, setTranscript] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)
  const pollingRef = useRef(null)

  // Poll for job status
  useEffect(() => {
    if (!jobId) return

    const poll = async () => {
      try {
        const res = await axios.get(`/api/status/${jobId}`)
        setStatus(res.data)

        if (res.data.status === 'completed') {
          setTranscript(res.data.transcript)
          clearInterval(pollingRef.current)
        } else if (res.data.status === 'failed') {
          setError(res.data.message)
          clearInterval(pollingRef.current)
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }

    pollingRef.current = setInterval(poll, 2000)
    poll() // Initial call

    return () => clearInterval(pollingRef.current)
  }, [jobId])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setTranscript(null)
      setError('')
      setStatus(null)
      setJobId(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
      setTranscript(null)
      setError('')
      setStatus(null)
      setJobId(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a video file')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError('')
    setTranscript(null)
    setStatus(null)

    const formData = new FormData()
    formData.append('video', file)
    formData.append('language', language)

    try {
      const res = await axios.post('/api/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          setUploadProgress(percent)
        }
      })
      setJobId(res.data.jobId)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const downloadTranscript = async (format) => {
    if (!jobId) return
    window.open(`/api/transcript/${jobId}?format=${format}`, '_blank')
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const isProcessing = uploading || (status && status.status === 'processing')

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 Video Transcript API</h1>
        <p>Transcribe long videos up to 2GB using OpenAI Whisper</p>
      </header>

      <form onSubmit={handleSubmit} className="upload-form">
        <div
          className={`drop-zone ${file ? 'has-file' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            hidden
          />
          {file ? (
            <div className="file-info">
              <span className="file-icon">🎥</span>
              <span className="file-name">{file.name}</span>
              <span className="file-size">{formatFileSize(file.size)}</span>
            </div>
          ) : (
            <div className="drop-message">
              <span className="upload-icon">📤</span>
              <p>Drag & drop a video file here, or click to browse</p>
              <p className="hint">Supports MP4, WEBM, MOV, AVI (up to 2GB)</p>
            </div>
          )}
        </div>

        <div className="options-row">
          <div className="language-select">
            <label>Language:</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={isProcessing}>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-btn" disabled={!file || isProcessing}>
            {uploading ? '📤 Uploading...' : isProcessing ? '⏳ Processing...' : '🎯 Start Transcription'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
      </form>

      {/* Upload Progress */}
      {uploading && (
        <div className="progress-section">
          <h3>Uploading File...</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="progress-text">{uploadProgress}%</p>
        </div>
      )}

      {/* Processing Status */}
      {status && status.status === 'processing' && (
        <div className="progress-section">
          <h3>{status.message}</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${status.progress}%` }} />
          </div>
          <p className="progress-text">{status.progress}%</p>
          {status.totalChunks && (
            <p className="chunk-info">Chunk {status.currentChunk} of {status.totalChunks}</p>
          )}
        </div>
      )}

      {/* Transcript Result */}
      {transcript && (
        <div className="result-section">
          <div className="result-header">
            <h2>✅ Transcription Complete</h2>
            <div className="download-buttons">
              <button onClick={() => downloadTranscript('txt')}>📄 Download TXT</button>
              <button onClick={() => downloadTranscript('srt')}>📝 Download SRT</button>
              <button onClick={() => downloadTranscript('json')}>📦 Download JSON</button>
            </div>
          </div>
          <div className="transcript-box">
            <h3>Transcript</h3>
            <p className="transcript-text">{transcript.text}</p>
          </div>
          {transcript.segments && transcript.segments.length > 0 && (
            <div className="segments-box">
              <h3>Timestamped Segments ({transcript.segments.length})</h3>
              <div className="segments-list">
                {transcript.segments.slice(0, 50).map((seg, i) => (
                  <div key={i} className="segment">
                    <span className="timestamp">
                      {Math.floor(seg.start / 60)}:{String(Math.floor(seg.start % 60)).padStart(2, '0')}
                    </span>
                    <span className="text">{seg.text}</span>
                  </div>
                ))}
                {transcript.segments.length > 50 && (
                  <p className="more-segments">...and {transcript.segments.length - 50} more segments</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
