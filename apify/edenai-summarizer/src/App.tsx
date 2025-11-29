import { useState } from 'react';
import { summarizeText } from './api';
import { PROVIDERS, LANGUAGES, SENTENCE_OPTIONS, DEFAULT_TEXT } from './types';
import type { SummarizeResponse } from './types';
import './App.css';

function App() {
  const [apiToken, setApiToken] = useState(localStorage.getItem('edenai_token') || '');
  const [text, setText] = useState(DEFAULT_TEXT);
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['openai', 'microsoft']);
  const [outputSentences, setOutputSentences] = useState(3);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SummarizeResponse | null>(null);

  const toggleProvider = (providerId: string) => {
    setSelectedProviders(prev =>
      prev.includes(providerId)
        ? prev.filter(p => p !== providerId)
        : [...prev, providerId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiToken.trim()) {
      setError('Please enter your Eden AI API token');
      return;
    }
    if (!text.trim()) {
      setError('Please enter text to summarize');
      return;
    }
    if (selectedProviders.length === 0) {
      setError('Please select at least one AI provider');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      localStorage.setItem('edenai_token', apiToken);
      const response = await summarizeText(apiToken, {
        text,
        output_sentences: outputSentences,
        providers: selectedProviders.join(','),
        language,
      });
      setResults(response);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="app">
      <header className="header">
        <h1>🌿 Eden AI Summarizer</h1>
        <p>Compare AI Summaries from Multiple Providers</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Eden AI API Token *</label>
            <input
              type="password"
              value={apiToken}
              onChange={e => setApiToken(e.target.value)}
              placeholder="Enter your Eden AI Bearer token"
            />
            <small>
              Get your token from{' '}
              <a href="https://app.edenai.run/admin/account/settings" target="_blank" rel="noopener noreferrer">
                Eden AI Dashboard
              </a>
            </small>
          </div>

          <div className="form-group">
            <label>Text to Summarize * ({charCount.toLocaleString()} chars, {wordCount} words)</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your text here..."
              rows={8}
            />
          </div>

          <div className="form-group">
            <label>Select AI Providers *</label>
            <div className="provider-grid">
              {PROVIDERS.map(provider => (
                <button
                  key={provider.id}
                  type="button"
                  className={`provider-btn ${selectedProviders.includes(provider.id) ? 'selected' : ''}`}
                  onClick={() => toggleProvider(provider.id)}
                >
                  <span className="provider-icon">{provider.icon}</span>
                  <span>{provider.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Output Sentences</label>
              <select value={outputSentences} onChange={e => setOutputSentences(Number(e.target.value))}>
                {SENTENCE_OPTIONS.map(n => (
                  <option key={n} value={n}>{n} sentence{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)}>
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? '🔄 Summarizing...' : '✨ Compare Summaries'}
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
            <p>AI providers are generating summaries...</p>
          </div>
        )}

        {results && (
          <div className="results-section">
            <h2>📊 Summary Comparison</h2>
            <div className="results-grid">
              {Object.entries(results).map(([provider, data]) => {
                const providerInfo = PROVIDERS.find(p => p.id === provider);
                return (
                  <div key={provider} className={`result-card ${data.status === 'success' ? 'success' : 'error'}`}>
                    <div className="result-header">
                      <span className="provider-icon">{providerInfo?.icon || '🤖'}</span>
                      <span className="provider-name">{providerInfo?.name || provider}</span>
                      <span className={`status-badge ${data.status}`}>{data.status}</span>
                    </div>
                    {data.status === 'success' && data.result && (
                      <>
                        <div className="result-text">{data.result}</div>
                        <div className="result-footer">
                          {data.cost !== undefined && <span className="cost">💰 ${data.cost.toFixed(6)}</span>}
                          <button className="btn-copy" onClick={() => navigator.clipboard.writeText(data.result!)}>
                            📋 Copy
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

