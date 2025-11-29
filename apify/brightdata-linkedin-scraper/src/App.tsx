import { useState } from 'react';
import { triggerSnapshot, checkProgress, getSnapshotData, exportToCSV, downloadCSV } from './api';
import { TIME_RANGE_OPTIONS, JOB_TYPE_OPTIONS, EXPERIENCE_OPTIONS, REMOTE_OPTIONS, COUNTRY_OPTIONS } from './types';
import type { JobResult } from './types';
import './App.css';

type WorkflowStep = 'idle' | 'triggering' | 'polling' | 'fetching' | 'cleaning' | 'done';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('brightdata_key') || '');
  const [location, setLocation] = useState('');
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('US');
  const [timeRange, setTimeRange] = useState('Past 24 hours');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [remote, setRemote] = useState('');
  const [company, setCompany] = useState('');
  
  const [step, setStep] = useState<WorkflowStep>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobResult[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) { setError('Please enter your Bright Data API key'); return; }
    if (!keyword.trim()) { setError('Please enter a keyword'); return; }
    if (!location.trim()) { setError('Please enter a location'); return; }

    localStorage.setItem('brightdata_key', apiKey);
    setError(null); setJobs([]); setProgress(0);

    try {
      // Step 1: Trigger snapshot
      setStep('triggering');
      const snapshotId = await triggerSnapshot(apiKey, {
        location, keyword, country, time_range: timeRange,
        job_type: jobType, experience_level: experienceLevel, remote, company
      });

      // Step 2: Poll for completion (1-3 mins)
      setStep('polling');
      let status = 'running';
      while (status === 'running') {
        await new Promise(r => setTimeout(r, 10000)); // Wait 10 seconds
        const progressData = await checkProgress(apiKey, snapshotId);
        status = progressData.status;
        if (progressData.progress) setProgress(progressData.progress);
        if (status === 'failed') throw new Error('Snapshot failed');
      }

      // Step 3: Fetch data
      setStep('fetching');
      const rawJobs = await getSnapshotData(apiKey, snapshotId);

      // Step 4: Data is already cleaned in getSnapshotData
      setStep('cleaning');
      await new Promise(r => setTimeout(r, 500)); // Brief pause for UX

      setJobs(rawJobs);
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('idle');
    }
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(jobs);
    downloadCSV(csv, `linkedin-jobs-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleCopyForSheets = () => {
    const csv = exportToCSV(jobs);
    navigator.clipboard.writeText(csv);
    alert('CSV copied! Paste into Google Sheets → Data → Split text to columns');
  };

  const stepLabels: Record<WorkflowStep, string> = {
    idle: '', triggering: '1️⃣ Triggering Bright Data snapshot...',
    polling: `2️⃣ Waiting for data (${progress}%)... This takes 1-3 minutes`,
    fetching: '3️⃣ Fetching job data...', cleaning: '4️⃣ Cleaning & flattening data...',
    done: '✅ Complete!'
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🔗 LinkedIn Jobs → Google Sheets</h1>
        <p>Scrape live job posts via Bright Data, clean & export to Sheets</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bright Data API Key *</label>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} 
              placeholder="Bearer token from Bright Data" />
            <small>Get from <a href="https://brightdata.com/cp/datasets" target="_blank">Bright Data Console</a></small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Keyword / Job Title *</label>
              <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} 
                placeholder="e.g. CMO, Data Analyst, AI Engineer" />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} 
                placeholder="e.g. New York, Berlin, London" />
            </div>
          </div>

          <div className="form-row filters">
            <div className="form-group"><label>Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Time Range</label>
              <select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                {TIME_RANGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Job Type</label>
              <select value={jobType} onChange={e => setJobType(e.target.value)}>
                {JOB_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Experience</label>
              <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)}>
                {EXPERIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group"><label>Remote / On-site</label>
              <select value={remote} onChange={e => setRemote(e.target.value)}>
                {REMOTE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Company (optional)</label>
              <input type="text" value={company} onChange={e => setCompany(e.target.value)} 
                placeholder="e.g. Google, Spotify" />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={step !== 'idle' && step !== 'done'}>
            {step !== 'idle' && step !== 'done' ? '⏳ Processing...' : '🚀 Start Scraping'}
          </button>
        </form>

        {step !== 'idle' && <div className="workflow-status"><div className="step-indicator">{stepLabels[step]}</div>
          {step === 'polling' && <div className="progress-bar"><div className="progress-fill" style={{width: `${progress}%`}}/></div>}
        </div>}
        
        {error && <div className="error-box"><h3>❌ Error</h3><p>{error}</p></div>}

        {jobs.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>📋 {jobs.length} Jobs Found</h2>
              <div className="export-buttons">
                <button onClick={handleExportCSV} className="btn-export">📥 Download CSV</button>
                <button onClick={handleCopyForSheets} className="btn-export sheets">📊 Copy for Google Sheets</button>
              </div>
            </div>
            <p className="sheets-tip">💡 Paste into <a href="https://docs.google.com/spreadsheets/d/1_jbr5zBllTy_pGbogfGSvyv1_0a77I8tU-Ai7BjTAw4/copy" target="_blank">this template</a></p>
            <div className="jobs-grid">
              {jobs.map((job, i) => (
                <div key={job.job_posting_id || i} className="job-card">
                  <div className="job-header">
                    {job.company_logo && <img src={job.company_logo} alt="" className="company-logo" />}
                    <div><h3>{job.job_title}</h3><p className="company">{job.company_name}</p></div>
                  </div>
                  <p className="location">📍 {job.job_location}</p>
                  {(job.salary_min || job.job_base_pay_range) && (
                    <p className="salary">💰 {job.job_base_pay_range || `${job.salary_currency} ${job.salary_min}-${job.salary_max}`}</p>
                  )}
                  <div className="badges">
                    {job.job_employment_type && <span className="badge">{job.job_employment_type}</span>}
                    {job.job_seniority_level && <span className="badge exp">{job.job_seniority_level}</span>}
                  </div>
                  <p className="posted">🕐 {job.job_posted_time || job.job_posted_date}</p>
                  {job.job_num_applicants && <p className="applicants">👥 {job.job_num_applicants}</p>}
                  {job.job_poster_name && (
                    <div className="poster">
                      <span>Posted by: <a href={job.job_poster_url} target="_blank">{job.job_poster_name}</a></span>
                      {job.job_poster_title && <span className="poster-title">{job.job_poster_title}</span>}
                    </div>
                  )}
                  <a href={job.apply_link || job.url} target="_blank" className="btn-apply">Apply Now →</a>
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

