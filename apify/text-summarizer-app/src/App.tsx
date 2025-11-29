import { useState } from 'react';
import { summarizeText } from './api';
import type { SummarizerInput, SummaryResult, SummaryModel, OutputLanguage, SummaryLength } from './types';
import { SUMMARY_MODELS, OUTPUT_LANGUAGES, SUMMARY_LENGTHS, DEFAULT_TEXT } from './types';
import './App.css';

function App() {
  const [apiToken, setApiToken] = useState(localStorage.getItem('apify_token') || '');
  const [text, setText] = useState(DEFAULT_TEXT);
  const [model, setModel] = useState<SummaryModel>('Summary');
  const [language, setLanguage] = useState<OutputLanguage>('Same as Input');
  const [length, setLength] = useState<SummaryLength>('Medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiToken.trim()) {
      setError('Please enter your Apify API token');
      return;
    }

    if (!text.trim()) {
      setError('Please enter text to summarize');
      return;
    }

    if (text.length > 200000) {
      setError('Text exceeds maximum length of 200,000 characters');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      localStorage.setItem('apify_token', apiToken);
      const input: SummarizerInput = { text, model, language, length };
      const summary = await summarizeText(apiToken, input);
      setResult(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="app">
      <header className="header">
        <h1>📝 AI Text Summarizer</h1>
        <p>Powered by Apify - Summarize any text with AI</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Apify API Token *</label>
            <input
              type="password"
              value={apiToken}
              onChange={e => setApiToken(e.target.value)}
              placeholder="Enter your Apify API token"
            />
            <small>
              Get your token from{' '}
              <a href="https://console.apify.com/account/integrations" target="_blank" rel="noopener noreferrer">
                Apify Console
              </a>
            </small>
          </div>

          <div className="form-group">
            <label>Text to Summarize * ({characterCount.toLocaleString()} / 200,000 chars, {wordCount} words)</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your text here..."
              rows={10}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Summary Type</label>
              <select value={model} onChange={e => setModel(e.target.value as SummaryModel)}>
                {SUMMARY_MODELS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Output Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value as OutputLanguage)}>
                {OUTPUT_LANGUAGES.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Summary Length</label>
              <select value={length} onChange={e => setLength(e.target.value as SummaryLength)}>
                {SUMMARY_LENGTHS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? '🔄 Summarizing...' : '✨ Summarize Text'}
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
            <p>AI is analyzing and summarizing your text...</p>
            <small>This may take 30-60 seconds</small>
          </div>
        )}

        {result && (
          <div className="result-box">
            <h2>📋 Summary</h2>
            <div className="result-meta">
              <span>📊 Type: {result.model}</span>
              <span>🌐 Language: {result.language}</span>
              <span>📏 Length: {result.length}</span>
            </div>
            <div className="summary-content">
              {result.summary}
            </div>
            <button className="btn-copy" onClick={() => navigator.clipboard.writeText(result.summary || '')}>
              📋 Copy Summary
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
