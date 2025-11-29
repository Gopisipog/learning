import { useState } from 'react';
import type { GlobalJobsSearchFilters as GlobalJobsFiltersType } from '../types';
import {
  GLOBAL_WORKPLACE_TYPES,
  GLOBAL_COMMITMENT_TYPES,
  GLOBAL_SENIORITY_LEVELS,
  GLOBAL_BENEFITS,
  CURRENCIES,
  SORT_OPTIONS,
  DATE_RANGES,
  DEGREE_REQUIREMENTS,
  DEFAULT_ARCHITECT_TITLES,
  DEFAULT_LOCATIONS,
} from '../types';

interface GlobalJobsSearchFiltersProps {
  onSearch: (filters: GlobalJobsFiltersType) => void;
  isLoading: boolean;
}

export function GlobalJobsSearchFilters({ onSearch, isLoading }: GlobalJobsSearchFiltersProps) {
  const [apiToken, setApiToken] = useState(localStorage.getItem('apify_token') || '');
  const [query, setQuery] = useState(DEFAULT_ARCHITECT_TITLES.join(' OR '));
  const [jobTitleQuery, setJobTitleQuery] = useState('');
  const [jobDescriptionQuery, setJobDescriptionQuery] = useState('');
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS.join(', '));
  const [technologyKeywords, setTechnologyKeywords] = useState('');
  const [requirementsKeywords, setRequirementsKeywords] = useState('');
  const [workplaceTypes, setWorkplaceTypes] = useState<string[]>([]);
  const [commitmentTypes, setCommitmentTypes] = useState<string[]>(['Full Time']);
  const [seniorityLevel, setSeniorityLevel] = useState<string[]>(['Mid Level', 'Senior Level']);
  const [benefits, setBenefits] = useState<string[]>(['visa_sponsorship']);
  const [minSalary, setMinSalary] = useState<number | undefined>(undefined);
  const [maxSalary, setMaxSalary] = useState<number | undefined>(undefined);
  const [currency, setCurrency] = useState('USD');
  const [transparentSalaries, setTransparentSalaries] = useState(false);
  const [companyNames, setCompanyNames] = useState('');
  const [industries, setIndustries] = useState('');
  const [languageRequirements, setLanguageRequirements] = useState('');
  const [bachelorsDegreeReq, setBachelorsDegreeReq] = useState<string[]>([]);
  const [mastersDegreeReq, setMastersDegreeReq] = useState<string[]>([]);
  const [dateFetched, setDateFetched] = useState<number>(30);
  const [sortBy, setSortBy] = useState('date');
  const [maxResults, setMaxResults] = useState(200);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiToken.trim()) {
      alert('Please enter your Apify API token');
      return;
    }

    const filters: GlobalJobsFiltersType = {
      query,
      jobTitleQuery: jobTitleQuery || undefined,
      jobDescriptionQuery: jobDescriptionQuery || undefined,
      locations: locations.split(',').map(s => s.trim()).filter(Boolean),
      workplaceTypes: workplaceTypes.length > 0 ? workplaceTypes : undefined,
      commitmentTypes: commitmentTypes.length > 0 ? commitmentTypes : undefined,
      seniorityLevel: seniorityLevel.length > 0 ? seniorityLevel : undefined,
      benefitsAndPerks: benefits.length > 0 ? benefits : undefined,
      minSalary: minSalary || undefined,
      maxSalary: maxSalary || undefined,
      currency: currency || undefined,
      restrictJobsToTransparentSalaries: transparentSalaries || undefined,
      companyNames: companyNames ? companyNames.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      industries: industries ? industries.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      languageRequirements: languageRequirements ? languageRequirements.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      bachelorsDegreeRequirements: bachelorsDegreeReq.length > 0 ? bachelorsDegreeReq : undefined,
      mastersDegreeRequirements: mastersDegreeReq.length > 0 ? mastersDegreeReq : undefined,
      technologyKeywordsQuery: technologyKeywords || undefined,
      requirementsKeywordsQuery: requirementsKeywords || undefined,
      dateFetchedPastNDays: dateFetched,
      sortBy,
      maxResults,
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
        <label>Search Query</label>
        <textarea value={query} onChange={e => setQuery(e.target.value)} rows={2} placeholder="e.g., Software Architect OR Solutions Architect" />
      </div>

      <div className="filter-group">
        <label>Job Title Keywords</label>
        <input type="text" value={jobTitleQuery} onChange={e => setJobTitleQuery(e.target.value)} placeholder="Optional: specific job title" />
      </div>

      <div className="filter-group">
        <label>Job Description Keywords</label>
        <input type="text" value={jobDescriptionQuery} onChange={e => setJobDescriptionQuery(e.target.value)} placeholder="Keywords in job description" />
      </div>

      <div className="filter-group">
        <label>Locations (comma-separated)</label>
        <textarea value={locations} onChange={e => setLocations(e.target.value)} rows={2} />
      </div>

      <div className="filter-group">
        <label>Technology Keywords</label>
        <input type="text" value={technologyKeywords} onChange={e => setTechnologyKeywords(e.target.value)} placeholder="e.g., Python, AWS, Kubernetes" />
      </div>

      <div className="filter-group">
        <label>Requirements Keywords</label>
        <input type="text" value={requirementsKeywords} onChange={e => setRequirementsKeywords(e.target.value)} placeholder="Specific requirement keywords" />
      </div>

      <div className="filter-group">
        <label>Target Companies (comma-separated)</label>
        <input type="text" value={companyNames} onChange={e => setCompanyNames(e.target.value)} placeholder="e.g., Google, Microsoft, Amazon" />
      </div>

      <div className="filter-group">
        <label>Industries (comma-separated)</label>
        <input type="text" value={industries} onChange={e => setIndustries(e.target.value)} placeholder="e.g., Technology, Finance" />
      </div>

      <div className="filter-group">
        <label>Language Requirements (comma-separated)</label>
        <input type="text" value={languageRequirements} onChange={e => setLanguageRequirements(e.target.value)} placeholder="e.g., English, German" />
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Date Range</label>
          <select value={dateFetched} onChange={e => setDateFetched(Number(e.target.value))}>
            {DATE_RANGES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Max Results</label>
          <input type="number" value={maxResults} onChange={e => setMaxResults(Number(e.target.value))} min={10} max={10000} />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Min Salary</label>
          <input type="number" value={minSalary || ''} onChange={e => setMinSalary(e.target.value ? Number(e.target.value) : undefined)} placeholder="e.g., 100000" />
        </div>
        <div className="filter-group">
          <label>Max Salary</label>
          <input type="number" value={maxSalary || ''} onChange={e => setMaxSalary(e.target.value ? Number(e.target.value) : undefined)} placeholder="e.g., 250000" />
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Currency</label>
          <select value={currency} onChange={e => setCurrency(e.target.value)}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="filter-group checkbox-group">
        <label><input type="checkbox" checked={transparentSalaries} onChange={e => setTransparentSalaries(e.target.checked)} /> Transparent Salaries Only</label>
      </div>

      <div className="filter-group">
        <label>Workplace Type</label>
        <div className="chip-group">
          {GLOBAL_WORKPLACE_TYPES.map(type => (
            <button key={type} type="button" className={`chip ${workplaceTypes.includes(type) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(workplaceTypes, type, setWorkplaceTypes)}>{type}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Employment Type</label>
        <div className="chip-group">
          {GLOBAL_COMMITMENT_TYPES.map(type => (
            <button key={type} type="button" className={`chip ${commitmentTypes.includes(type) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(commitmentTypes, type, setCommitmentTypes)}>{type}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Seniority Level</label>
        <div className="chip-group">
          {GLOBAL_SENIORITY_LEVELS.map(level => (
            <button key={level} type="button" className={`chip ${seniorityLevel.includes(level) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(seniorityLevel, level, setSeniorityLevel)}>{level}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Bachelor's Degree Requirement</label>
        <div className="chip-group">
          {DEGREE_REQUIREMENTS.map(req => (
            <button key={req} type="button" className={`chip ${bachelorsDegreeReq.includes(req) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(bachelorsDegreeReq, req, setBachelorsDegreeReq)}>{req}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Master's Degree Requirement</label>
        <div className="chip-group">
          {DEGREE_REQUIREMENTS.map(req => (
            <button key={req} type="button" className={`chip ${mastersDegreeReq.includes(req) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(mastersDegreeReq, req, setMastersDegreeReq)}>{req}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Benefits & Perks</label>
        <div className="chip-group benefits-chips">
          {GLOBAL_BENEFITS.map(b => (
            <button key={b.value} type="button" className={`chip ${benefits.includes(b.value) ? 'active' : ''}`}
              onClick={() => toggleArrayItem(benefits, b.value, setBenefits)}>{b.label}</button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-search" disabled={isLoading}>
        {isLoading ? '🔄 Searching Global Jobs...' : '🌍 Search Global Jobs'}
      </button>
    </form>
  );
}

