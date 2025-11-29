import { useState } from 'react';
import type { HiringCafeSearchFilters as HiringCafeFiltersType } from '../types';

interface HiringCafeSearchFiltersProps {
  onSearch: (filters: HiringCafeFiltersType) => void;
  isLoading: boolean;
}

const DEFAULT_SEARCH_URL = 'https://hiring.cafe/?searchState=%7B%22locations%22%3A%5B%7B%22id%22%3A%22FxY1yZQBoEtHp_8UEq7V%22%2C%22types%22%3A%5B%22country%22%5D%2C%22address_components%22%3A%5B%7B%22long_name%22%3A%22United+States%22%2C%22short_name%22%3A%22US%22%2C%22types%22%3A%5B%22country%22%5D%7D%5D%2C%22formatted_address%22%3A%22United+States%22%2C%22population%22%3A327167434%2C%22workplace_types%22%3A%5B%5D%2C%22options%22%3A%7B%22flexible_regions%22%3A%5B%22anywhere_in_continent%22%2C%22anywhere_in_world%22%5D%7D%7D%5D%2C%22searchQuery%22%3A%22software+architect%22%7D';

export function HiringCafeSearchFilters({ onSearch, isLoading }: HiringCafeSearchFiltersProps) {
  const [apiToken, setApiToken] = useState(localStorage.getItem('apify_token') || '');
  const [searchUrl, setSearchUrl] = useState(DEFAULT_SEARCH_URL);
  const [maxJobs, setMaxJobs] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiToken.trim()) {
      alert('Please enter your Apify API token');
      return;
    }

    if (!searchUrl.startsWith('https://hiring.cafe/')) {
      alert('Please enter a valid HiringCafe search URL');
      return;
    }

    const filters: HiringCafeFiltersType = {
      searchUrl,
      maxJobs,
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
        <label>HiringCafe Search URL *</label>
        <textarea
          value={searchUrl}
          onChange={e => setSearchUrl(e.target.value)}
          placeholder="Paste your search URL from hiring.cafe"
          rows={4}
          style={{ width: '100%', resize: 'vertical' }}
        />
        <small>
          Go to <a href="https://hiring.cafe" target="_blank" rel="noopener noreferrer">hiring.cafe</a>,
          search with your desired filters, then copy the URL from your browser and paste it here.
        </small>
      </div>

      <div className="filter-group">
        <label>Max Jobs</label>
        <input
          type="number"
          value={maxJobs}
          onChange={e => setMaxJobs(Number(e.target.value))}
          min={1}
          max={10000}
        />
        <small>Maximum number of jobs to scrape (1-10,000)</small>
      </div>

      <div className="info-box">
        <p>☕ <strong>HiringCafe Jobs</strong></p>
        <p>Search jobs from hiring.cafe - aggregates job listings from multiple sources.</p>
        <p><strong>How to use:</strong></p>
        <ol style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '0.85em' }}>
          <li>Visit <a href="https://hiring.cafe" target="_blank" rel="noopener noreferrer">hiring.cafe</a></li>
          <li>Search for jobs with your desired filters (title, location, etc.)</li>
          <li>Copy the full URL from your browser's address bar</li>
          <li>Paste it in the field above</li>
        </ol>
        <p><small>Note: Larger job counts take more time and compute resources.</small></p>
      </div>

      <button type="submit" className="btn btn-search" disabled={isLoading}>
        {isLoading ? '🔄 Searching HiringCafe...' : '☕ Search HiringCafe Jobs'}
      </button>
    </form>
  );
}

