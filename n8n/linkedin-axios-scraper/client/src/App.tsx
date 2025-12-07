import React, { useState } from 'react';

interface DiscoveryInput {
  experience_level: string | null;
  job_type: string | null;
  remote: string | null;
  selective_search: string | null;
  time_range: string | null;
}

interface JobPoster {
  name: string | null;
  title: string | null;
  url: string | null;
}

interface BaseSalary {
  currency: string | null;
  max_amount: number | null;
  min_amount: number | null;
  payment_period: string | null;
}

// Shape matches Bright Data LinkedIn job objects (your example),
// with all fields optional so we can handle partial responses safely.
interface Job {
  url?: string;
  job_posting_id?: string;
  job_title?: string;
  company_name?: string;
  company_id?: string;
  job_location?: string;
  job_summary?: string;
  job_seniority_level?: string;
  job_function?: string;
  job_employment_type?: string;
  job_industries?: string;
  job_base_pay_range?: unknown;
  company_url?: string;
  job_posted_time?: string;
  job_num_applicants?: number;
  discovery_input?: DiscoveryInput;
  apply_link?: string;
  country_code?: string;
  title_id?: string;
  company_logo?: string;
  job_posted_date?: string;
  job_poster?: JobPoster;
  application_availability?: boolean;
  job_description_formatted?: string;
  base_salary?: BaseSalary;
  salary_standards?: unknown;
  is_easy_apply?: boolean;
  // allow any extra fields Bright Data may add in the future
  [key: string]: any;
}

async function fetchScrape(inputUrls: string[]): Promise<Job[]> {
  const body = inputUrls.length
    ? { input: inputUrls.map((url) => ({ url })) }
    : {};

  const response = await fetch('/api/url-scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}`);
  }

  const data = payload.data;

  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  if (data && typeof data === 'object') return [data];
  return [];
}

const App: React.FC = () => {
  const [urlsText, setUrlsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setJobs([]);

    const urls = urlsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    try {
      const results = await fetchScrape(urls);
      setJobs(results);
    } catch (err: any) {
      setError(err?.message || 'Unexpected error while calling scraper');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <div className="card">
        <h1>LinkedIn Axios Scraper UI</h1>
        <p>
          This React app calls the Node scraper in <code>n8n/linkedin-axios-scraper</code> via
          <code> POST /api/url-scrape</code> (proxied by Vite) and displays the Bright Data output.
        </p>
        <p className="hint">
          Leave the box empty to use the default three URLs from the server, or paste one LinkedIn
          jobs URL per line to override.
        </p>

        <label>
          LinkedIn job URLs (one per line)
          <textarea
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            placeholder="https://www.linkedin.com/jobs/search?keywords=Software&location=Tel%20Aviv-Yafo...
https://www.linkedin.com/jobs/semrush-jobs?f_C=2821922"
          />
        </label>

        <button type="button" onClick={handleRun} disabled={loading}>
          {loading ? 'Running scrape…' : 'Run scrape'}
        </button>

        {error && <p className="error">Error: {error}</p>}

        {!error && !loading && jobs.length === 0 && (
          <p className="hint">No results yet. Click &quot;Run scrape&quot; to fetch jobs.</p>
        )}

        {!loading && jobs.length > 0 && (
          <>
            <ul className="job-list">
              {jobs.slice(0, 20).map((job, index) => (
                <li key={job.url || job.job_title || index} className="job-item">
                  <h3>{job.job_title || 'Untitled role'}</h3>
                  <p className="job-meta">
                    <span>{job.company_name || 'Unknown company'}</span>
                    {job.job_location && <span> · {job.job_location}</span>}
                    {job.job_posted_time && <span> · {job.job_posted_time}</span>}
                  </p>
                  {job.url && (
                    <p>
                      <a href={job.url} target="_blank" rel="noreferrer">
                        Open job on LinkedIn
                      </a>
                    </p>
                  )}
                </li>
              ))}
            </ul>

            <details style={{ marginTop: '1rem' }}>
              <summary>View raw JSON result</summary>
              <pre style={{ marginTop: '0.5rem', maxHeight: '320px', overflow: 'auto' }}>
                {JSON.stringify(jobs, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

