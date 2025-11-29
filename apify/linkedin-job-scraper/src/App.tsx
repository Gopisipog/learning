import { useState } from 'react';
import { scrapeLinkedInJobs, exportToCSV, downloadCSV } from './api';
import { TIME_RANGE_OPTIONS, JOB_TYPE_OPTIONS, EXPERIENCE_OPTIONS, WORK_TYPE_OPTIONS, COUNTRY_OPTIONS } from './types';
import type { JobResult } from './types';
import './App.css';

function App() {
  const [apiToken, setApiToken] = useState(localStorage.getItem('apify_token') || '');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('US');
  const [publishedAt, setPublishedAt] = useState('r604800');
  const [contractType, setContractType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [workType, setWorkType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rows, setRows] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobResult[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiToken.trim()) { setError('Please enter your Apify API token'); return; }
    if (!title.trim()) { setError('Please enter a job title/keyword'); return; }

    setIsLoading(true); setError(null); setJobs([]); setStatus('Starting scraper...');
    localStorage.setItem('apify_token', apiToken);

    try {
      setStatus('Scraping LinkedIn jobs... This may take 1-3 minutes');
      const results = await scrapeLinkedInJobs(apiToken, {
        title, location: location || country, country, publishedAt, contractType, experienceLevel, workType, companyName, rows
      });
      setJobs(results);
      setStatus(`Found ${results.length} jobs!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('');
    } finally { setIsLoading(false); }
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(jobs);
    downloadCSV(csv, `linkedin-jobs-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleCopyToSheets = () => {
    const csv = exportToCSV(jobs);
    navigator.clipboard.writeText(csv);
    alert('CSV copied! Open Google Sheets → Paste (Ctrl+V) → Data → Split text to columns');
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🔗 LinkedIn Job Scraper</h1>
        <p>Scrape live job posts from LinkedIn → Export to Google Sheets</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Apify API Token *</label>
            <input type="password" value={apiToken} onChange={e => setApiToken(e.target.value)} placeholder="Enter your Apify API token" />
            <small>Get your token from <a href="https://console.apify.com/account/integrations" target="_blank">Apify Console</a></small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Keyword / Job Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. CMO, Data Analyst, Software Engineer" />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. New York, Berlin, London" />
            </div>
          </div>

          <div className="form-row filters">
            <div className="form-group">
              <label>Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Time Range</label>
              <select value={publishedAt} onChange={e => setPublishedAt(e.target.value)}>
                {TIME_RANGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select value={contractType} onChange={e => setContractType(e.target.value)}>
                {JOB_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Experience</label>
              <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)}>
                {EXPERIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Remote / On-site</label>
              <select value={workType} onChange={e => setWorkType(e.target.value)}>
                {WORK_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Company (optional)</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Google, Microsoft (comma-separated)" />
            </div>
            <div className="form-group">
              <label>Max Results</label>
              <select value={rows} onChange={e => setRows(Number(e.target.value))}>
                {[25, 50, 100, 200, 500, 1000].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? '⏳ Scraping...' : '🚀 Start Scraping'}
          </button>
        </form>

        {status && <div className="status-box"><p>{status}</p></div>}
        {error && <div className="error-box"><h3>❌ Error</h3><p>{error}</p></div>}
        {isLoading && <div className="loading-box"><div className="spinner"></div><p>Scraping LinkedIn... This usually takes 1-3 minutes</p></div>}

        {jobs.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>📋 {jobs.length} Jobs Found</h2>
              <div className="export-buttons">
                <button onClick={handleExportCSV} className="btn-export">📥 Download CSV</button>
                <button onClick={handleCopyToSheets} className="btn-export sheets">📊 Copy for Sheets</button>
              </div>
            </div>
            <div className="jobs-grid">
              {jobs.map((job, i) => (
                <div key={job.id || i} className="job-card">
                  <div className="job-header">
                    {job.companyLogo && <img src={job.companyLogo} alt="" className="company-logo" />}
                    <div>
                      <h3 className="job-title">{job.title}</h3>
                      <p className="job-company">{job.companyName}</p>
                    </div>
                  </div>
                  <p className="job-location">📍 {job.location}</p>
                  {job.salary && <p className="job-salary">💰 {job.salary}</p>}
                  <div className="badges">
                    {job.contractType && <span className="badge">{job.contractType}</span>}
                    {job.workType && <span className="badge remote">{job.workType}</span>}
                    {job.experienceLevel && <span className="badge exp">{job.experienceLevel}</span>}
                  </div>
                  <p className="job-date">🕐 {job.postedTime || job.postedAt}</p>
                  {job.applicationsCount && <p className="job-apps">👥 {job.applicationsCount}</p>}
                  <a href={job.applyUrl || job.jobUrl} target="_blank" rel="noopener noreferrer" className="btn-apply">Apply →</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

