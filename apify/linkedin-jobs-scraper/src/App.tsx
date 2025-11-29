import { useState } from 'react';
import { searchLinkedInJobs } from './api';
import {
  PUBLISHED_AT_OPTIONS, WORK_TYPE_OPTIONS, CONTRACT_TYPE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS, ROWS_OPTIONS
} from './types';
import type { LinkedInJob } from './types';
import './App.css';

function App() {
  const [apiToken, setApiToken] = useState(localStorage.getItem('apify_token') || '');
  const [title, setTitle] = useState('Software Engineer');
  const [location, setLocation] = useState('United States');
  const [companyNames, setCompanyNames] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [workType, setWorkType] = useState('');
  const [contractType, setContractType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [rows, setRows] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<LinkedInJob[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiToken.trim()) {
      setError('Please enter your Apify API token');
      return;
    }

    setIsLoading(true);
    setError(null);
    setJobs([]);

    try {
      localStorage.setItem('apify_token', apiToken);
      const companies = companyNames.split(',').map(c => c.trim()).filter(c => c);

      const results = await searchLinkedInJobs(apiToken, {
        title,
        location,
        companyName: companies.length > 0 ? companies : undefined,
        publishedAt: publishedAt || undefined,
        workType: workType || undefined,
        contractType: contractType || undefined,
        experienceLevel: experienceLevel || undefined,
        rows,
        proxy: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] },
      });
      setJobs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getJobUrl = (job: LinkedInJob) => job.jobUrl || job.applyUrl || job.link || job.url || '#';

  return (
    <div className="app">
      <header className="header">
        <h1>💼 LinkedIn Jobs Scraper</h1>
        <p>Search LinkedIn jobs using Apify</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Apify API Token *</label>
            <input type="password" value={apiToken} onChange={e => setApiToken(e.target.value)}
              placeholder="Enter your Apify API token" />
            <small>Get your token from <a href="https://console.apify.com/account/integrations" target="_blank">Apify Console</a></small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Software Engineer" />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. United States" />
            </div>
          </div>

          <div className="form-group">
            <label>Company Names (comma-separated)</label>
            <input type="text" value={companyNames} onChange={e => setCompanyNames(e.target.value)} placeholder="e.g. Google, Microsoft, Amazon" />
          </div>

          <div className="form-row filters">
            <div className="form-group">
              <label>Posted</label>
              <select value={publishedAt} onChange={e => setPublishedAt(e.target.value)}>
                {PUBLISHED_AT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Work Type</label>
              <select value={workType} onChange={e => setWorkType(e.target.value)}>
                {WORK_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select value={contractType} onChange={e => setContractType(e.target.value)}>
                {CONTRACT_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Experience</label>
              <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)}>
                {EXPERIENCE_LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Max Results</label>
              <select value={rows} onChange={e => setRows(Number(e.target.value))}>
                {ROWS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? '🔄 Searching...' : '🔍 Search Jobs'}
          </button>
        </form>

        {error && <div className="error-box"><h3>❌ Error</h3><p>{error}</p></div>}

        {isLoading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Scraping LinkedIn jobs...</p>
            <small>This may take 1-3 minutes depending on the number of results</small>
          </div>
        )}

        {jobs.length > 0 && (
          <div className="results-section">
            <h2>📋 Found {jobs.length} Jobs</h2>
            <div className="jobs-grid">
              {jobs.map((job, idx) => (
                <div key={idx} className="job-card">
                  <h3 className="job-title">{job.title || 'Untitled Position'}</h3>
                  <p className="job-company">{job.company || 'Unknown Company'}</p>
                  <p className="job-location">📍 {job.location || 'N/A'}</p>
                  {job.salary && <p className="job-salary">💰 {job.salary}</p>}
                  {job.employmentType && <span className="badge">{job.employmentType}</span>}
                  {job.workType && <span className="badge">{job.workType}</span>}
                  {(job.postedAt || job.postedDate) && <p className="job-date">🕐 {job.postedAt || job.postedDate}</p>}
                  <a href={getJobUrl(job)} target="_blank" rel="noopener noreferrer" className="btn-apply">View Job →</a>
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

