import { useState } from 'react';
import { triggerJobSearch, pollSnapshot, scoreJobsBatch, mergeScoresIntoJobs, exportToCSV, formatSalary } from './api';
import { TIME_RANGE_OPTIONS, JOB_TYPE_OPTIONS, EXPERIENCE_OPTIONS, REMOTE_OPTIONS, COUNTRY_OPTIONS } from './types';
import type { LinkedInJob, WorkflowStep } from './types';
import './App.css';

function App() {
  // API Keys
  const [brightDataKey, setBrightDataKey] = useState(localStorage.getItem('brightdata_key') || '');
  const [openAIKey, setOpenAIKey] = useState(localStorage.getItem('openai_key') || '');
  
  // Search Config
  const [location, setLocation] = useState('');
  const [keyword, setKeyword] = useState('');
  const [country, setCountry] = useState('US');
  const [timeRange, setTimeRange] = useState('Past week');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [remote, setRemote] = useState('');
  const [company, setCompany] = useState('');
  const [jobsLimit, setJobsLimit] = useState(20);
  
  // Profile for AI Scoring
  const [profileSummary, setProfileSummary] = useState('');
  const [desiredJobSummary, setDesiredJobSummary] = useState('');
  
  // State
  const [step, setStep] = useState<WorkflowStep>('idle');
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<LinkedInJob[]>([]);
  const [scoringProgress, setScoringProgress] = useState({ current: 0, total: 0 });
  const [selectedJob, setSelectedJob] = useState<LinkedInJob | null>(null);
  const [crawlerErrors, setCrawlerErrors] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brightDataKey.trim()) { setError('Please enter your Bright Data API key'); return; }
    if (!openAIKey.trim()) { setError('Please enter your OpenAI API key'); return; }
    if (!keyword.trim() || !location.trim()) { setError('Please enter keyword and location'); return; }
    if (!profileSummary.trim() || !desiredJobSummary.trim()) { setError('Please fill in your profile and desired job'); return; }

    localStorage.setItem('brightdata_key', brightDataKey);
    localStorage.setItem('openai_key', openAIKey);
    setError(null); setJobs([]); setStep('triggering'); setCrawlerErrors(0);

    try {
      // Step 1: Trigger Bright Data
      setStatusText('Triggering LinkedIn Jobs Scraper...');
      const snapshotId = await triggerJobSearch(brightDataKey, {
        location, keyword, country, time_range: timeRange, job_type: jobType,
        experience_level: experienceLevel, remote, company,
        profile_summary: profileSummary, desired_job_summary: desiredJobSummary,
      }, jobsLimit);
      setStatusText(`Snapshot triggered: ${snapshotId}`);

      // Step 2: Poll for results
      setStep('polling');
      const rawJobs = await pollSnapshot(brightDataKey, snapshotId, (status, errorCount) => {
        if (status === 'ready') {
          setStatusText('Data ready!');
          if (errorCount) setCrawlerErrors(errorCount);
        } else {
          setStatusText('Waiting for data... (1-3 mins)');
        }
      });
      setStatusText(`${rawJobs.length} jobs found!${crawlerErrors > 0 ? ` (${crawlerErrors} had errors)` : ''}`);

      // Step 3: Score jobs with OpenAI
      setStep('scoring');
      const batchSize = 5;
      const allScores: { job_posting_id: string; score: number; comment: string }[] = [];
      setScoringProgress({ current: 0, total: rawJobs.length });

      for (let i = 0; i < rawJobs.length; i += batchSize) {
        const batch = rawJobs.slice(i, i + batchSize);
        setStatusText(`Scoring batch ${Math.floor(i / batchSize) + 1}...`);
        const scores = await scoreJobsBatch(openAIKey, batch, profileSummary, desiredJobSummary);
        allScores.push(...scores);
        setScoringProgress({ current: Math.min(i + batchSize, rawJobs.length), total: rawJobs.length });
        await new Promise(r => setTimeout(r, 1000)); // Rate limit
      }

      // Step 4: Merge and sort
      const enrichedJobs = mergeScoresIntoJobs(rawJobs, allScores);
      setJobs(enrichedJobs);
      setStep('done');
      setStatusText(`✅ Complete! ${enrichedJobs.length} jobs scored and ranked.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('idle');
    }
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(jobs);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `linkedin-jobs-scored-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getScoreColor = (score?: number) => {
    if (!score) return '#999';
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎯 LinkedIn Job Hunting AI Assistant</h1>
        <p>Scrape LinkedIn jobs with Bright Data • Score with OpenAI • Find your perfect match</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSearch}>
          <div className="section">
            <h2>🔑 API Keys</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Bright Data API Key</label>
                <input type="password" value={brightDataKey} onChange={e => setBrightDataKey(e.target.value)} 
                  placeholder="Bearer token from Bright Data" />
              </div>
              <div className="form-group">
                <label>OpenAI API Key</label>
                <input type="password" value={openAIKey} onChange={e => setOpenAIKey(e.target.value)} 
                  placeholder="sk-..." />
              </div>
            </div>
          </div>

          <div className="section">
            <h2>🔍 Job Search</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Keyword / Job Title *</label>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. Product Manager" />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. New York" />
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
              <div className="form-group"><label>Remote</label>
                <select value={remote} onChange={e => setRemote(e.target.value)}>
                  {REMOTE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Company (optional)</label>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" />
              </div>
              <div className="form-group"><label>Max Jobs</label>
                <input type="number" value={jobsLimit} onChange={e => setJobsLimit(Number(e.target.value))} min={5} max={50} />
              </div>
            </div>
          </div>

          <div className="section profile-section">
            <h2>👤 Your Profile (for AI Scoring)</h2>
            <div className="form-group">
              <label>Profile Summary *</label>
              <textarea value={profileSummary} onChange={e => setProfileSummary(e.target.value)} rows={3}
                placeholder="e.g. Experienced product manager with 7 years in tech startups, specializing in agile methodologies and cross-functional team leadership." />
            </div>
            <div className="form-group">
              <label>Desired Job Description *</label>
              <textarea value={desiredJobSummary} onChange={e => setDesiredJobSummary(e.target.value)} rows={3}
                placeholder="e.g. Looking for a full-time product manager role focusing on SaaS products and customer-centric development." />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={step !== 'idle' && step !== 'done'}>
            {step !== 'idle' && step !== 'done' ? '⏳ Processing...' : '🚀 Search & Score Jobs'}
          </button>
        </form>

        {step !== 'idle' && (
          <div className="workflow-status">
            <div className="step-indicator">{statusText}</div>
            {step === 'scoring' && scoringProgress.total > 0 && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(scoringProgress.current / scoringProgress.total) * 100}%` }} />
              </div>
            )}
          </div>
        )}

        {error && <div className="error-box">❌ {error}</div>}

        {jobs.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2>🏆 Top Job Matches ({jobs.length} scored)</h2>
              {crawlerErrors > 0 && (
                <span className="error-notice">⚠️ {crawlerErrors} jobs couldn't be scraped</span>
              )}
              <button onClick={handleExportCSV} className="btn-export">📥 Export CSV</button>
            </div>

            <div className="jobs-list">
              {jobs.map((job, i) => {
                const salary = formatSalary(job);
                return (
                  <div key={job.job_posting_id || i} className="job-card" onClick={() => setSelectedJob(job)}>
                    <div className="job-rank">#{i + 1}</div>
                    <div className="score-circle" style={{ background: getScoreColor(job.ai_score) }}>
                      {job.ai_score}
                    </div>
                    <div className="job-info">
                      <h3>{job.job_title}</h3>
                      <div className="company-row">
                        {job.company_logo && <img src={job.company_logo} alt="" className="company-logo" />}
                        <a href={job.company_url} target="_blank" className="company">{job.company_name}</a>
                      </div>
                      <p className="location">📍 {job.job_location}</p>

                      {salary && <p className="salary">💰 {salary}</p>}

                      <div className="badges">
                        {job.job_employment_type && <span className="badge">{job.job_employment_type}</span>}
                        {job.job_seniority_level && <span className="badge exp">{job.job_seniority_level}</span>}
                        {job.is_easy_apply && <span className="badge easy-apply">⚡ Easy Apply</span>}
                        {job.job_num_applicants !== undefined && <span className="badge applicants">👥 {job.job_num_applicants} applicants</span>}
                      </div>

                      {job.job_function && <p className="job-meta">🔧 {job.job_function}</p>}
                      {job.job_industries && <p className="job-meta">🏭 {job.job_industries}</p>}

                      {job.job_poster_name && (
                        <p className="job-poster">
                          👤 Posted by: <a href={job.job_poster_url} target="_blank">{job.job_poster_name}</a>
                          {job.job_poster_title && <span> • {job.job_poster_title}</span>}
                        </p>
                      )}

                      <p className="ai-comment">💡 {job.ai_comment}</p>

                      <div className="job-actions">
                        <a href={job.apply_link || job.url} target="_blank" className="btn-apply" onClick={e => e.stopPropagation()}>
                          {job.is_easy_apply ? '⚡ Easy Apply' : 'Apply →'}
                        </a>
                        <button className="btn-details" onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}>View Details</button>
                        <span className="posted">📅 {job.job_posted_time || job.job_posted_date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Job Detail Modal */}
        {selectedJob && (
          <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedJob(null)}>×</button>

              <div className="modal-header">
                <div className="score-circle large" style={{ background: getScoreColor(selectedJob.ai_score) }}>
                  {selectedJob.ai_score}
                </div>
                <div>
                  <h2>{selectedJob.job_title}</h2>
                  <p className="company">{selectedJob.company_name}</p>
                </div>
              </div>

              <div className="modal-meta">
                <span>📍 {selectedJob.job_location}</span>
                {formatSalary(selectedJob) && <span>💰 {formatSalary(selectedJob)}</span>}
                {selectedJob.job_employment_type && <span>📋 {selectedJob.job_employment_type}</span>}
                {selectedJob.job_seniority_level && <span>📊 {selectedJob.job_seniority_level}</span>}
                {selectedJob.job_num_applicants !== undefined && <span>👥 {selectedJob.job_num_applicants} applicants</span>}
                {selectedJob.is_easy_apply && <span>⚡ Easy Apply</span>}
                {selectedJob.job_posted_time && <span>🕐 {selectedJob.job_posted_time}</span>}
              </div>

              <div className="ai-analysis">
                <h3>🤖 AI Analysis</h3>
                <p>{selectedJob.ai_comment}</p>
              </div>

              {selectedJob.job_poster_name && (
                <div className="poster-info">
                  <h3>👤 Posted By</h3>
                  <p><a href={selectedJob.job_poster_url} target="_blank">{selectedJob.job_poster_name}</a></p>
                  {selectedJob.job_poster_title && <p className="poster-title">{selectedJob.job_poster_title}</p>}
                </div>
              )}

              <div className="job-summary-section">
                <h3>📋 Summary</h3>
                <p>{selectedJob.job_summary || 'No summary available'}</p>
              </div>

              <div className="job-description">
                <h3>📝 Full Job Description</h3>
                <div className="description-text">
                  {selectedJob.job_description_plain || 'No description available'}
                </div>
              </div>

              <div className="job-details-extra">
                {selectedJob.job_function && <p><strong>🔧 Function:</strong> {selectedJob.job_function}</p>}
                {selectedJob.job_industries && <p><strong>🏭 Industries:</strong> {selectedJob.job_industries}</p>}
                {selectedJob.country_code && <p><strong>🌍 Country:</strong> {selectedJob.country_code}</p>}
                {selectedJob.company_id && <p><strong>🏢 Company ID:</strong> {selectedJob.company_id}</p>}
              </div>

              <div className="modal-actions">
                <a href={selectedJob.apply_link || selectedJob.url} target="_blank" className="btn-apply large">Apply Now →</a>
                <a href={selectedJob.url} target="_blank" className="btn-linkedin">View on LinkedIn</a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

