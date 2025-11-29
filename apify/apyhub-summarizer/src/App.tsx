import { useState, useRef } from 'react';
import { summarizeDocument } from './api';
import './App.css';

const SUPPORTED_FORMATS = ['.docx', '.doc', '.pdf', '.txt', '.rtf', '.odt'];

function App() {
  const [apiToken, setApiToken] = useState(localStorage.getItem('apyhub_token') || '');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiToken.trim()) {
      setError('Please enter your ApyHub API token');
      return;
    }

    if (!file) {
      setError('Please select a document to summarize');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      localStorage.setItem('apyhub_token', apiToken);
      const result = await summarizeDocument(apiToken, file);
      setSummary(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while summarizing the document');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📄 ApyHub Document Summarizer</h1>
        <p>AI-Powered Document Summarization - Upload any document</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ApyHub API Token *</label>
            <input
              type="password"
              value={apiToken}
              onChange={e => setApiToken(e.target.value)}
              placeholder="Enter your ApyHub API token"
            />
            <small>
              Get your token from{' '}
              <a href="https://apyhub.com/dashboard" target="_blank" rel="noopener noreferrer">
                ApyHub Dashboard
              </a>
            </small>
          </div>

          <div className="form-group">
            <label>Upload Document *</label>
            <div
              className="file-drop-zone"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {file ? (
                <div className="file-info">
                  <span className="file-icon">📎</span>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({formatFileSize(file.size)})</span>
                </div>
              ) : (
                <div className="drop-message">
                  <span className="upload-icon">📤</span>
                  <p>Click to select or drag & drop a document</p>
                  <small>Supported: {SUPPORTED_FORMATS.join(', ')}</small>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={SUPPORTED_FORMATS.join(',')}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading || !file}>
            {isLoading ? '🔄 Summarizing...' : '✨ Summarize Document'}
          </button>
        </form>

        {error && (
          <div className="error-box">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>AI is generating your summary...</p>
            <small>This may take 15-30 seconds</small>
          </div>
        )}

        {summary && (
          <div className="result-box">
            <h2>📋 Summary</h2>
            <div className="result-meta">
              <span>📎 File: {file?.name}</span>
            </div>
            <div className="summary-content">{summary}</div>
            <button className="btn-copy" onClick={() => navigator.clipboard.writeText(summary)}>
              📋 Copy Summary
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

