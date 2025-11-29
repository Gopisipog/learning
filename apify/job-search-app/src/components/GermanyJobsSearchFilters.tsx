import { useState } from 'react';
import type { GermanyJobsSearchFilters as GermanyJobsFiltersType } from '../types';
import { GERMANY_SORT_OPTIONS, DEFAULT_ARCHITECT_TITLES } from '../types';

interface GermanyJobsSearchFiltersProps {
  onSearch: (filters: GermanyJobsFiltersType) => void;
  isLoading: boolean;
}

export function GermanyJobsSearchFilters({ onSearch, isLoading }: GermanyJobsSearchFiltersProps) {
  const [apiToken, setApiToken] = useState(localStorage.getItem('apify_token') || '');
  const [searchQuery, setSearchQuery] = useState(DEFAULT_ARCHITECT_TITLES[0]);
  const [sort, setSort] = useState<'relevance' | 'newest'>('newest');
  const [maxResults, setMaxResults] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiToken.trim()) {
      alert('Please enter your Apify API token');
      return;
    }

    const filters: GermanyJobsFiltersType = {
      searchQuery,
      sort,
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
        <label>Search Query</label>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="e.g., software engineer, product manager, devops"
        />
        <small>Search for jobs in Germany (arbeitnow.com)</small>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sort} onChange={e => setSort(e.target.value as 'relevance' | 'newest')}>
            {GERMANY_SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Max Results</label>
          <input
            type="number"
            value={maxResults}
            onChange={e => setMaxResults(Number(e.target.value))}
            min={1}
            max={10000}
          />
        </div>
      </div>

      <div className="info-box">
        <p>🇩🇪 <strong>Germany Jobs (Arbeitnow)</strong></p>
        <p>Search jobs from arbeitnow.com - a job board focused on jobs in Germany with visa sponsorship information.</p>
      </div>

      <button type="submit" className="btn btn-search" disabled={isLoading}>
        {isLoading ? '🔄 Searching Germany Jobs...' : '🇩🇪 Search Germany Jobs'}
      </button>
    </form>
  );
}

