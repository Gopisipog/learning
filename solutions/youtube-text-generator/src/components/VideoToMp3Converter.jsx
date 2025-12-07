import { useState, useRef } from 'react'
import {
  convertVideoToMp3,
  downloadBlob,
  getBitrateOptions,
} from '../services/videoToMp3Service'
import './VideoToMp3Converter.css'

const VideoToMp3Converter = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState({ stage: '', progress: 0 })
  const [mp3Blob, setMp3Blob] = useState(null)
  const [bitrate, setBitrate] = useState('192k')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setMp3Blob(null)
      setError('')
    }
  }

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setMp3Blob(null)
      setError('')
    }
  }

  const handleProgress = (progressInfo) => {
    setProgress(progressInfo)
  }

  const getProgressMessage = () => {
    switch (progress.stage) {
      case 'loading':
        return 'Loading video processor...'
      case 'uploading':
        return 'Reading video file...'
      case 'preparing':
        return 'Preparing for conversion...'
      case 'converting':
        return 'Converting to MP3...'
      case 'complete':
        return 'Conversion complete!'
      default:
        return 'Processing...'
    }
  }

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Please select a video file')
      return
    }

    setError('')
    setLoading(true)
    setProgress({ stage: 'starting', progress: 0 })
    setMp3Blob(null)

    try {
      const blob = await convertVideoToMp3(
        selectedFile,
        { bitrate },
        handleProgress
      )
      setMp3Blob(blob)
    } catch (err) {
      setError(err.message || 'Failed to convert. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (mp3Blob && selectedFile) {
      const mp3Filename = selectedFile.name.replace(/\.[^/.]+$/, '') + '.mp3'
      downloadBlob(mp3Blob, mp3Filename)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setMp3Blob(null)
    setError('')
    setProgress({ stage: '', progress: 0 })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  return (
    <div className="video-to-mp3">
      <div className="converter-header">
        <h1>🎵 Video to MP3 Converter</h1>
        <p>Convert any video file to MP3 audio - works entirely in your browser</p>
      </div>

      <div className="upload-section">
        <div
          className={`drop-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,.mp4,.mpeg,.webm,.mov,.avi,.mkv,.flv,.wmv,.m4v"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
          {selectedFile ? (
            <div className="file-info">
              <span className="file-icon">🎬</span>
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">{formatFileSize(selectedFile.size)}</span>
            </div>
          ) : (
            <div className="drop-message">
              <span className="upload-icon">📤</span>
              <p>Drag & drop a video file here, or click to browse</p>
              <p className="file-hint">Supports MP4, WEBM, MOV, AVI, MKV, FLV (up to 2GB)</p>
            </div>
          )}
        </div>

        <div className="options-row">
          <div className="bitrate-select">
            <label htmlFor="bitrate">Quality:</label>
            <select
              id="bitrate"
              value={bitrate}
              onChange={(e) => setBitrate(e.target.value)}
              disabled={loading}
            >
              {getBitrateOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="action-buttons">
            <button
              className="convert-btn"
              onClick={handleConvert}
              disabled={!selectedFile || loading}
            >
              {loading ? '⏳ Converting...' : '🎵 Convert to MP3'}
            </button>
            {selectedFile && (
              <button className="clear-btn" onClick={handleClear} disabled={loading}>
                🗑️ Clear
              </button>
            )}
          </div>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}
      </div>

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="progress-message">{getProgressMessage()}</p>

          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <p className="progress-percentage">{progress.progress}%</p>

          <p className="progress-hint">
            Processing locally in your browser - your file never leaves your device
          </p>
        </div>
      )}

      {mp3Blob && !loading && (
        <div className="result-section">
          <div className="result-header">
            <h2>✅ Conversion Complete!</h2>
          </div>
          <div className="result-info">
            <p><strong>Original:</strong> {selectedFile?.name}</p>
            <p><strong>MP3 Size:</strong> {formatFileSize(mp3Blob.size)}</p>
            <p><strong>Quality:</strong> {getBitrateOptions().find(o => o.value === bitrate)?.label}</p>
          </div>
          <button className="download-btn" onClick={handleDownload}>
            📥 Download MP3
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoToMp3Converter

