import { useState } from 'react';
import { scrapeUrl, extractTextFromHtml, extractLinksFromHtml, extractImagesFromHtml, extractMetaFromHtml } from './api';
import { COUNTRY_OPTIONS } from './types';
import './App.css';

type ViewMode = 'html' | 'text' | 'links' | 'images' | 'meta' | 'screenshot';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('rapidapi_key') || 'ae0399ddc3mshd5a00f532a39118p19ed45jsnf40621af9b79');
  const [url, setUrl] = useState('');
  const [country, setCountry] = useState('us');
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [headers, setHeaders] = useState('{}');
  const [payload, setPayload] = useState('{}');
  const [screenshot, setScreenshot] = useState(false);
  const [fullScreenshot, setFullScreenshot] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('html');
  const [screenshotData, setScreenshotData] = useState<string | null>(null);

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) { setError('Please enter a URL'); return; }
    
    localStorage.setItem('rapidapi_key', apiKey);
    setLoading(true); setError(null); setResult(null); setScreenshotData(null);

    try {
      const response = await scrapeUrl(apiKey, {
        url, country, method, headers, payload, screenshot, fullScreenshot
      });
      
      if (typeof response === 'string') {
        setResult(response);
      } else if (response.html) {
        setResult(response.html);
      } else if (response.screenshot) {
        setScreenshotData(response.screenshot);
      } else {
        setResult(JSON.stringify(response, null, 2));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scraping failed');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (screenshotData) {
      return <img src={`data:image/png;base64,${screenshotData}`} alt="Screenshot" className="screenshot" />;
    }
    if (!result) return null;

    switch (viewMode) {
      case 'html':
        return <pre className="code-block">{result}</pre>;
      case 'text':
        return <div className="text-content">{extractTextFromHtml(result)}</div>;
      case 'links': {
        const links = extractLinksFromHtml(result, url);
        return (
          <div className="links-list">
            <p className="count">Found {links.length} links</p>
            {links.map((link, i) => (
              <div key={i} className="link-item">
                <a href={link.href} target="_blank">{link.text || link.href}</a>
                <span className="link-url">{link.href}</span>
              </div>
            ))}
          </div>
        );
      }
      case 'images': {
        const images = extractImagesFromHtml(result, url);
        return (
          <div className="images-grid">
            <p className="count">Found {images.length} images</p>
            {images.map((img, i) => (
              <div key={i} className="image-item">
                <img src={img.src} alt={img.alt} onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                <span>{img.alt || 'No alt text'}</span>
              </div>
            ))}
          </div>
        );
      }
      case 'meta': {
        const meta = extractMetaFromHtml(result);
        return (
          <div className="meta-list">
            {Object.entries(meta).map(([key, value]) => (
              <div key={key} className="meta-item">
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        );
      }
      default:
        return <pre className="code-block">{result}</pre>;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🕸️ Web Scraper</h1>
        <p>Scrape any webpage with browser rendering</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleScrape}>
          <div className="form-group">
            <label>URL to Scrape *</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} 
              placeholder="https://example.com" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Method</label>
              <select value={method} onChange={e => setMethod(e.target.value as 'GET' | 'POST')}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
          </div>

          <div className="form-row checkboxes">
            <label><input type="checkbox" checked={screenshot} onChange={e => setScreenshot(e.target.checked)} /> Take Screenshot</label>
            <label><input type="checkbox" checked={fullScreenshot} onChange={e => setFullScreenshot(e.target.checked)} /> Full Page Screenshot</label>
          </div>

          {method === 'POST' && (
            <div className="form-group">
              <label>POST Payload (JSON)</label>
              <textarea value={payload} onChange={e => setPayload(e.target.value)} rows={3} placeholder='{"key": "value"}' />
            </div>
          )}

          <details className="advanced">
            <summary>Advanced Options</summary>
            <div className="form-group">
              <label>Custom Headers (JSON)</label>
              <textarea value={headers} onChange={e => setHeaders(e.target.value)} rows={3} placeholder='{"User-Agent": "..."}' />
            </div>
            <div className="form-group">
              <label>RapidAPI Key</label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} />
            </div>
          </details>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⏳ Scraping...' : '🚀 Scrape URL'}
          </button>
        </form>

        {error && <div className="error-box">❌ {error}</div>}

        {(result || screenshotData) && (
          <div className="results-section">
            <div className="view-tabs">
              <button className={viewMode === 'html' ? 'active' : ''} onClick={() => setViewMode('html')}>HTML</button>
              <button className={viewMode === 'text' ? 'active' : ''} onClick={() => setViewMode('text')}>Text</button>
              <button className={viewMode === 'links' ? 'active' : ''} onClick={() => setViewMode('links')}>Links</button>
              <button className={viewMode === 'images' ? 'active' : ''} onClick={() => setViewMode('images')}>Images</button>
              <button className={viewMode === 'meta' ? 'active' : ''} onClick={() => setViewMode('meta')}>Meta</button>
            </div>
            <div className="results-content">
              {renderContent()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

