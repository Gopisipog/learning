import { useState } from 'react';
import type { LinkedInSearchFilters as LinkedInSearchFiltersType } from '../types';
import {
  EMPLOYMENT_TYPES,
  WORK_ARRANGEMENTS,
  EXPERIENCE_LEVELS,
  SENIORITY_LEVELS,
  DEFAULT_ARCHITECT_TITLES,
  DEFAULT_LOCATIONS,
  INDIA_EXCLUSIONS,
} from '../types';

interface LinkedInSearchFiltersProps {
  onSearch: (filters: LinkedInSearchFiltersType) => void;
  isLoading: boolean;
}

export function LinkedInSearchFilters({ onSearch, isLoading }: LinkedInSearchFiltersProps) {
  const [apiToken, setApiToken] = useState(localStorage.getItem('apify_token') || '');
  const [titleSearch, setTitleSearch] = useState(DEFAULT_ARCHITECT_TITLES.join(', '));
  const [locationSearch, setLocationSearch] = useState(DEFAULT_LOCATIONS.join(', '));
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('7d');
  const [limit, setLimit] = useState(100);
  const [includeAi, setIncludeAi] = useState(true);
  const [removeAgency, setRemoveAgency] = useState(true);
  const [directApply, setDirectApply] = useState(false);
  const [remote, setRemote] = useState(false);
  const [seniorityFilter, setSeniorityFilter] = useState<string[]>(['Mid-Senior level', 'Director']);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>(['FULL_TIME']);
  const [workArrangements, setWorkArrangements] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [hasSalary, setHasSalary] = useState(false);
  const [excludeIndia, setExcludeIndia] = useState(true);
  const [visaSponsorshipOnly, setVisaSponsorshipOnly] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiToken.trim()) {
      alert('Please enter your Apify API token');
      return;
    }

    const filters: LinkedInSearchFiltersType = {
      titleSearch: titleSearch.split(',').map(s => s.trim()).filter(Boolean),
      locationSearch: locationSearch.split(',').map(s => s.trim()).filter(Boolean),
      locationExclusionSearch: excludeIndia ? INDIA_EXCLUSIONS : [],
      timeRange,
      limit,
      includeAi,
      removeAgency,
      directApply: directApply || undefined,
      remote: remote || undefined,
      seniorityFilter: seniorityFilter.length > 0 ? seniorityFilter : undefined,
      EmploymentTypeFilter: employmentTypes.length > 0 ? employmentTypes : undefined,
      aiWorkArrangementFilter: workArrangements.length > 0 ? workArrangements : undefined,
      aiExperienceLevelFilter: experienceLevels.length > 0 ? experienceLevels : undefined,
      aiHasSalary: hasSalary ? true : undefined,
      aiVisaSponsorshipFilter: visaSponsorshipOnly ? true : undefined,
    };

    localStorage.setItem('apify_token', apiToken);
    onSearch(filters);
  };

  const toggleArrayItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    if (arr.includes(item)) {
      setter(arr.filter(i => i !== item));
    } else {
      setter([...arr, item]);
    }
  };

  return (
    <form className="search-filters" onSubmit={handleSubmit}>
      <div className="filter-group">
        <label>Apify API Token *</label>
        <input type="password" value={apiToken} onChange={e => setApiToken(e.target.value)} placeholder="Enter your Apify API token" required />
      </div>

      <div className="filter-group">
        <label>Job Titles (comma-separated)</label>
        <textarea value={titleSearch} onChange={e => setTitleSearch(e.target.value)} rows={3} />
      </div>

      <div className="filter-group">
        <label>Locations (comma-separated)</label>
        <textarea value={locationSearch} onChange={e => setLocationSearch(e.target.value)} rows={2} />
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Time Range</label>
          <select value={timeRange} onChange={e => setTimeRange(e.target.value as '1h'|'24h'|'7d')}>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Max Results</label>
          <input type="number" value={limit} onChange={e => setLimit(Number(e.target.value))} min={10} max={5000} />
        </div>
      </div>

      <div className="filter-group checkbox-group">
        <label><input type="checkbox" checked={excludeIndia} onChange={e => setExcludeIndia(e.target.checked)} /> Exclude India</label>
        <label><input type="checkbox" checked={removeAgency} onChange={e => setRemoveAgency(e.target.checked)} /> Remove Agencies</label>
        <label><input type="checkbox" checked={directApply} onChange={e => setDirectApply(e.target.checked)} /> Easy Apply Only</label>
        <label><input type="checkbox" checked={remote} onChange={e => setRemote(e.target.checked)} /> Remote Only</label>
        <label><input type="checkbox" checked={hasSalary} onChange={e => setHasSalary(e.target.checked)} /> Has Salary</label>
        <label><input type="checkbox" checked={visaSponsorshipOnly} onChange={e => setVisaSponsorshipOnly(e.target.checked)} /> 🛂 Visa Sponsor</label>
      </div>

      <div className="filter-group">
        <label>Seniority Level</label>
        <div className="chip-group">
          {SENIORITY_LEVELS.map(level => (
            <button key={level} type="button" className={`chip ${seniorityFilter.includes(level) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(seniorityFilter, level, setSeniorityFilter)}>{level}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Employment Type</label>
        <div className="chip-group">
          {EMPLOYMENT_TYPES.map(type => (
            <button key={type} type="button" className={`chip ${employmentTypes.includes(type) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(employmentTypes, type, setEmploymentTypes)}>{type.replace('_', ' ')}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Work Arrangement (AI)</label>
        <div className="chip-group">
          {WORK_ARRANGEMENTS.map(arr => (
            <button key={arr} type="button" className={`chip ${workArrangements.includes(arr) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(workArrangements, arr, setWorkArrangements)}>{arr}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Experience Level (AI)</label>
        <div className="chip-group">
          {EXPERIENCE_LEVELS.map(level => (
            <button key={level} type="button" className={`chip ${experienceLevels.includes(level) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(experienceLevels, level, setExperienceLevels)}>{level} years</button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-search" disabled={isLoading}>
        {isLoading ? '🔄 Searching LinkedIn...' : '🔍 Search LinkedIn Jobs'}
      </button>
    </form>
  );
}

