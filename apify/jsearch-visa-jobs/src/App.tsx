import { useState } from 'react';
import { searchJobs } from './api';
import { DATE_POSTED_OPTIONS, EMPLOYMENT_TYPE_OPTIONS, REMOTE_OPTIONS, COUNTRY_OPTIONS } from './types';
import type { Job } from './types';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('rapidapi_key') || '');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('us');
  const [datePosted, setDatePosted] = useState('all');
  const [employmentType, setEmploymentType] = useState('');
  const [remoteOnly, setRemoteOnly] = useState('');
  const [numPages, setNumPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) { setError('Please enter your RapidAPI key'); return; }
    if (!jobTitle.trim()) { setError('Please enter a job title'); return; }

    setIsLoading(true);
    setError(null);
    setJobs([]);

    try {
      localStorage.setItem('rapidapi_key', apiKey);
      const query = `${jobTitle} visa sponsorship${location ? ` in ${location}` : ''}`;
      
      const result = await searchJobs(apiKey, {
        query,
        page: 1,
        numPages,
        country,
        datePosted,
        employmentType: employmentType || undefined,
        remoteOnly: remoteOnly || undefined,
      });
      setJobs(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatSalary = (job: Job) => {
    if (!job.job_min_salary && !job.job_max_salary) return null;
    const currency = job.job_salary_currency || 'USD';
    const period = job.job_salary_period || 'year';
    const min = job.job_min_salary ? `${currency} ${job.job_min_salary.toLocaleString()}` : '';
    const max = job.job_max_salary ? `${currency} ${job.job_max_salary.toLocaleString()}` : '';
    return `${min}${min && max ? ' - ' : ''}${max} / ${period}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🌍 Visa Sponsorship Jobs</h1>
        <p>Find jobs offering visa sponsorship using JSearch API</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>RapidAPI Key *</label>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
              placeholder="Enter your RapidAPI key" />
            <small>Get your key from <a href="https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch" target="_blank">RapidAPI</a></small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Job Title *</label>
              <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineer, Data Scientist" />
            </div>
            <div className="form-group">
              <label>Location (optional)</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Chicago, New York" />
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
              <label>Posted</label>
              <select value={datePosted} onChange={e => setDatePosted(e.target.value)}>
                {DATE_POSTED_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Job Type</label>
              <select value={employmentType} onChange={e => setEmploymentType(e.target.value)}>
                {EMPLOYMENT_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Remote</label>
              <select value={remoteOnly} onChange={e => setRemoteOnly(e.target.value)}>
                {REMOTE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Pages</label>
              <select value={numPages} onChange={e => setNumPages(Number(e.target.value))}>
                {[1,2,3,5,10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? '🔄 Searching...' : '🔍 Search Visa Sponsorship Jobs'}
          </button>
        </form>

        {error && <div className="error-box"><h3>❌ Error</h3><p>{error}</p></div>}
        {isLoading && <div className="loading-box"><div className="spinner"></div><p>Searching for jobs...</p></div>}

        {jobs.length > 0 && (
          <div className="results-section">
            <h2>📋 Found {jobs.length} Jobs</h2>
            <div className="jobs-grid">
              {jobs.map((job) => (
                <div key={job.job_id} className="job-card">
                  <div className="job-header">
                    {job.employer_logo && <img src={job.employer_logo} alt="" className="company-logo" />}
                    <div>
                      <h3 className="job-title">{job.job_title}</h3>
                      <p className="job-company">{job.employer_name}</p>
                    </div>
                  </div>
                  <p className="job-location">📍 {job.job_city}, {job.job_state}, {job.job_country}</p>
                  {formatSalary(job) && <p className="job-salary">💰 {formatSalary(job)}</p>}
                  <div className="badges">
                    <span className="badge">{job.job_employment_type}</span>
                    {job.job_is_remote && <span className="badge remote">🏠 Remote</span>}
                  </div>
                  <p className="job-date">🕐 Posted {formatDate(job.job_posted_at_datetime_utc)}</p>
                  <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer" className="btn-apply">Apply Now →</a>
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

