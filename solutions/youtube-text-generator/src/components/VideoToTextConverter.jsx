import { useState, useRef } from 'react'
import {
  transcribeVideo,
  isOpenAIConfigured,
  getSupportedLanguages,
  formatDuration,
  exportAsText,
  exportAsSRT,
} from '../services/videoTranscriptionService'
import './VideoToTextConverter.css'

const VideoToTextConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [transcriptionData, setTranscriptionData] = useState(null)
  const [language, setLanguage] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState({ stage: '', progress: 0, currentChunk: 0, totalChunks: 0 })
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file)
      setError('')
      setTranscriptionData(null)
      setProgress({ stage: '', progress: 0, currentChunk: 0, totalChunks: 0 })
    }
  }

  const handleInputChange = (e) => {
    const file = e.target.files?.[0]
    handleFileSelect(file)
  }

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
    const file = e.dataTransfer.files?.[0]
    handleFileSelect(file)
  }

  const handleProgress = (progressInfo) => {
    setProgress(progressInfo)
  }

  const getProgressMessage = () => {
    switch (progress.stage) {
      case 'uploading':
        return 'Uploading file to AssemblyAI...'
      case 'submitting':
        return 'Submitting transcription request...'
      case 'queued':
        return 'Queued for processing...'
      case 'transcribing':
        return 'Transcribing audio with AI...'
      case 'complete':
        return 'Complete!'
      default:
        return 'Processing...'
    }
  }

  const handleTranscribe = async () => {
    if (!selectedFile) {
      setError('Please select a video or audio file')
      return
    }

    if (!isOpenAIConfigured()) {
      setError('OpenAI API key is not configured. Please set VITE_OPENAI_API_KEY in your .env file.')
      return
    }

    setError('')
    setLoading(true)
    setProgress({ stage: 'starting', progress: 0, currentChunk: 0, totalChunks: 0 })

    try {
      const result = await transcribeVideo(
        selectedFile,
        { language: language || undefined },
        handleProgress
      )
      setTranscriptionData(result)
    } catch (err) {
      setError(err.message || 'Failed to transcribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setTranscriptionData(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleExportText = () => {
    if (transcriptionData) {
      exportAsText(transcriptionData, selectedFile?.name?.replace(/\.[^/.]+$/, '') || 'transcription')
    }
  }

  const handleExportSRT = () => {
    if (transcriptionData?.transcription?.segments?.length) {
      exportAsSRT(transcriptionData, selectedFile?.name?.replace(/\.[^/.]+$/, '') || 'transcription')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="video-converter">
      <div className="converter-header">
        <h1>🎬 Video to Text Converter</h1>
        <p>Upload a video or audio file to transcribe using OpenAI Whisper</p>
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
            accept="video/*,audio/*,.mp4,.mp3,.mpeg,.mpga,.m4a,.wav,.webm,.mov,.ogg,.flac"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
          {selectedFile ? (
            <div className="file-info">
              <span className="file-icon">📁</span>
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">{formatFileSize(selectedFile.size)}</span>
            </div>
          ) : (
            <div className="drop-message">
              <span className="upload-icon">📤</span>
              <p>Drag & drop a video/audio file here, or click to browse</p>
              <p className="file-hint">Supports MP4, MP3, WAV, WEBM, M4A, MOV, OGG, FLAC (up to 5GB)</p>
            </div>
          )}
        </div>

        <div className="options-row">
          <div className="language-select">
            <label htmlFor="language">Language:</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={loading}
            >
              {getSupportedLanguages().map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="action-buttons">
            <button
              className="transcribe-btn"
              onClick={handleTranscribe}
              disabled={loading || !selectedFile}
            >
              {loading ? '⏳ Transcribing...' : '🎙️ Transcribe'}
            </button>
            <button className="clear-btn" onClick={handleClear} disabled={loading}>
              🗑️ Clear
            </button>
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
            Powered by AssemblyAI - supports files up to 5GB
          </p>
        </div>
      )}

      {transcriptionData && !loading && (
        <div className="results-section">
          <div className="results-header">
            <h2>📄 Transcription Result</h2>
            <div className="export-buttons">
              <button className="export-btn" onClick={handleExportText}>
                📥 Export Text
              </button>
              {transcriptionData.transcription?.segments?.length > 0 && (
                <button className="export-btn" onClick={handleExportSRT}>
                  📥 Export SRT
                </button>
              )}
            </div>
          </div>

          <div className="result-card">
            <div className="result-meta">
              <span>📁 {transcriptionData.fileName}</span>
              {transcriptionData.transcription?.language && (
                <span>🌐 Language: {transcriptionData.transcription.language}</span>
              )}
              {transcriptionData.transcription?.duration && (
                <span>⏱️ Duration: {formatDuration(transcriptionData.transcription.duration)}</span>
              )}
            </div>

            <div className="result-item">
              <h3>📜 Transcript</h3>
              <pre className="transcript">{transcriptionData.transcription?.text || 'No transcription available'}</pre>
            </div>

            {transcriptionData.transcription?.segments?.length > 0 && (
              <div className="result-item">
                <h3>⏰ Timestamped Segments</h3>
                <div className="segments-list">
                  {transcriptionData.transcription.segments.slice(0, 20).map((seg, index) => (
                    <div key={index} className="segment">
                      <span className="segment-time">
                        [{formatDuration(seg.start)} - {formatDuration(seg.end)}]
                      </span>
                      <span className="segment-text">{seg.text}</span>
                    </div>
                  ))}
                  {transcriptionData.transcription.segments.length > 20 && (
                    <p className="more-segments">
                      ... and {transcriptionData.transcription.segments.length - 20} more segments
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoToTextConverter

