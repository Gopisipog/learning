import { useState } from 'react';
import type { LinkedInAISearchFilters as LinkedInAIFiltersType } from '../types';
import { DEFAULT_ARCHITECT_TITLES, DEFAULT_LOCATIONS } from '../types';

interface LinkedInAISearchFiltersProps {
  onSearch: (filters: LinkedInAIFiltersType) => void;
  isLoading: boolean;
}

const DEFAULT_RESUME = `Software Architect with 10+ years of experience in designing and implementing scalable enterprise solutions. 
Skilled in cloud architecture (AWS, Azure, GCP), microservices, and distributed systems.
Expert in Java, Python, TypeScript, React, Node.js, and Kubernetes.
Strong background in system design, technical leadership, and mentoring engineering teams.`;

export function LinkedInAISearchFilters({ onSearch, isLoading }: LinkedInAISearchFiltersProps) {
  const [apiToken, setApiToken] = useState(localStorage.getItem('apify_token') || '');
  const [query, setQuery] = useState(DEFAULT_ARCHITECT_TITLES[0]);
  const [location, setLocation] = useState(DEFAULT_LOCATIONS[0]);
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [maxResults, setMaxResults] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiToken.trim()) {
      alert('Please enter your Apify API token');
      return;
    }

    if (!resume.trim()) {
      alert('Please enter your resume');
      return;
    }

    const filters: LinkedInAIFiltersType = {
      query,
      location,
      resume,
      maxResults,
    };

    localStorage.setItem('apify_token', apiToken);
    onSearch(filters);
  };

  return (
    <form className="search-filters" onSubmit={handleSubmit}>
      <div className="filter-group">
        <label>Apify API Token *</label>
        <input
          type="password"
          value={apiToken}
          onChange={e => setApiToken(e.target.value)}
          placeholder="Enter your Apify API token"
          required
        />
      </div>

      <div className="filter-group">
        <label>Job Search Term *</label>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g., Software Engineer, Product Manager"
        />
        <small>Enter the job title you're looking for</small>
      </div>

      <div className="filter-group">
        <label>Location *</label>
        <select value={location} onChange={e => setLocation(e.target.value)}>
          {DEFAULT_LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <small>Select a country or region</small>
      </div>

      <div className="filter-group">
        <label>Your Resume *</label>
        <textarea
          value={resume}
          onChange={e => setResume(e.target.value)}
          placeholder="Paste your resume here..."
          rows={6}
          style={{ width: '100%', resize: 'vertical' }}
          required
        />
        <small>The AI will match jobs based on your resume content</small>
      </div>

      <div className="filter-group">
        <label>Max Results</label>
        <input
          type="number"
          value={maxResults}
          onChange={e => setMaxResults(Number(e.target.value))}
          min={1}
          max={1000}
        />
        <small>Number of jobs to search through</small>
      </div>

      <div className="info-box">
        <p>🤖 <strong>LinkedIn AI Job Matcher</strong></p>
        <p>AI-powered job matching that analyzes your resume and finds the best matching jobs on LinkedIn.</p>
        <p><strong>How it works:</strong></p>
        <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '0.85em' }}>
          <li>Searches LinkedIn for jobs matching your query</li>
          <li>Uses AI to analyze job descriptions against your resume</li>
          <li>Returns jobs ranked by match quality</li>
        </ul>
      </div>

      <button type="submit" className="btn btn-search" disabled={isLoading}>
        {isLoading ? '🔄 AI Matching Jobs...' : '🤖 Find AI-Matched Jobs'}
      </button>
    </form>
  );
}

