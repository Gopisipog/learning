import { useState } from 'react';
import { SearchFilters } from './components/SearchFilters';
import { LinkedInSearchFilters } from './components/LinkedInSearchFilters';
import { GlobalJobsSearchFilters } from './components/GlobalJobsSearchFilters';
import { GermanyJobsSearchFilters } from './components/GermanyJobsSearchFilters';
import { HiringCafeSearchFilters } from './components/HiringCafeSearchFilters';
import { LinkedInAISearchFilters } from './components/LinkedInAISearchFilters';
import { JobCard } from './components/JobCard';
import { searchJobs } from './api';
import { searchLinkedInJobs } from './linkedinApi';
import { searchGlobalJobs } from './globalJobsApi';
import { searchGermanyJobs } from './germanyApi';
import { searchHiringCafeJobs } from './hiringCafeApi';
import { searchLinkedInAIJobs } from './linkedinAIApi';
import type { Job, SearchFilters as SearchFiltersType, LinkedInSearchFilters as LinkedInFiltersType, GlobalJobsSearchFilters as GlobalFiltersType, GermanyJobsSearchFilters as GermanyFiltersType, HiringCafeSearchFilters as HiringCafeFiltersType, LinkedInAISearchFilters as LinkedInAIFiltersType } from './types';
import './App.css';

type SearchSource = 'career-sites' | 'linkedin' | 'global-jobs' | 'germany-jobs' | 'hiringcafe' | 'linkedin-ai';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<SearchSource>('linkedin');

  const handleCareerSiteSearch = async (filters: SearchFiltersType) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const apiToken = localStorage.getItem('apify_token') || '';
      const results = await searchJobs(apiToken, filters);
      setJobs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSearch = async (filters: LinkedInFiltersType) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const apiToken = localStorage.getItem('apify_token') || '';
      const results = await searchLinkedInJobs(apiToken, filters);
      setJobs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalJobsSearch = async (filters: GlobalFiltersType) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const apiToken = localStorage.getItem('apify_token') || '';
      const results = await searchGlobalJobs(apiToken, filters);
      setJobs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGermanyJobsSearch = async (filters: GermanyFiltersType) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const apiToken = localStorage.getItem('apify_token') || '';
      const results = await searchGermanyJobs(apiToken, filters);
      setJobs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHiringCafeSearch = async (filters: HiringCafeFiltersType) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const apiToken = localStorage.getItem('apify_token') || '';
      const results = await searchHiringCafeJobs(apiToken, filters);
      setJobs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInAISearch = async (filters: LinkedInAIFiltersType) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const apiToken = localStorage.getItem('apify_token') || '';
      const results = await searchLinkedInAIJobs(apiToken, filters);
      setJobs(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: SearchSource) => {
    setActiveTab(tab);
    setJobs([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏗️ Architect Job Search</h1>
        <p>Find Software Architect, Solutions Architect & more roles outside India</p>
        <div className="source-tabs">
          <button
            className={`tab ${activeTab === 'linkedin' ? 'active' : ''}`}
            onClick={() => handleTabChange('linkedin')}
          >
            💼 LinkedIn Jobs
          </button>
          <button
            className={`tab ${activeTab === 'global-jobs' ? 'active' : ''}`}
            onClick={() => handleTabChange('global-jobs')}
          >
            🌍 Global Jobs
          </button>
          <button
            className={`tab ${activeTab === 'germany-jobs' ? 'active' : ''}`}
            onClick={() => handleTabChange('germany-jobs')}
          >
            🇩🇪 Germany Jobs
          </button>
          <button
            className={`tab ${activeTab === 'hiringcafe' ? 'active' : ''}`}
            onClick={() => handleTabChange('hiringcafe')}
          >
            ☕ HiringCafe
          </button>
          <button
            className={`tab ${activeTab === 'linkedin-ai' ? 'active' : ''}`}
            onClick={() => handleTabChange('linkedin-ai')}
          >
            🤖 LinkedIn AI
          </button>
          <button
            className={`tab ${activeTab === 'career-sites' ? 'active' : ''}`}
            onClick={() => handleTabChange('career-sites')}
          >
            🏢 Career Sites (ATS)
          </button>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          {activeTab === 'linkedin' && (
            <LinkedInSearchFilters onSearch={handleLinkedInSearch} isLoading={isLoading} />
          )}
          {activeTab === 'global-jobs' && (
            <GlobalJobsSearchFilters onSearch={handleGlobalJobsSearch} isLoading={isLoading} />
          )}
          {activeTab === 'germany-jobs' && (
            <GermanyJobsSearchFilters onSearch={handleGermanyJobsSearch} isLoading={isLoading} />
          )}
          {activeTab === 'hiringcafe' && (
            <HiringCafeSearchFilters onSearch={handleHiringCafeSearch} isLoading={isLoading} />
          )}
          {activeTab === 'linkedin-ai' && (
            <LinkedInAISearchFilters onSearch={handleLinkedInAISearch} isLoading={isLoading} />
          )}
          {activeTab === 'career-sites' && (
            <SearchFilters onSearch={handleCareerSiteSearch} isLoading={isLoading} />
          )}
        </aside>

        <section className="results">
          {isLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Searching {activeTab === 'linkedin' ? 'LinkedIn' : activeTab === 'global-jobs' ? 'Global Jobs' : activeTab === 'germany-jobs' ? 'Germany Jobs' : activeTab === 'hiringcafe' ? 'HiringCafe' : activeTab === 'linkedin-ai' ? 'LinkedIn AI' : 'Career Sites'} for positions...</p>
              <p className="loading-note">This may take up to 2-5 minutes</p>
            </div>
          )}

          {error && (
            <div className="error">
              <h3>❌ Error</h3>
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && hasSearched && jobs.length === 0 && (
            <div className="no-results">
              <h3>No jobs found</h3>
              <p>Try adjusting your search filters</p>
            </div>
          )}

          {!isLoading && !error && jobs.length > 0 && (
            <>
              <div className="results-header">
                <h2>Found {jobs.length} Jobs from {activeTab === 'linkedin' ? 'LinkedIn' : activeTab === 'global-jobs' ? 'Global Jobs' : activeTab === 'germany-jobs' ? 'Germany (Arbeitnow)' : activeTab === 'hiringcafe' ? 'HiringCafe' : activeTab === 'linkedin-ai' ? 'LinkedIn AI Matcher' : 'Career Sites'}</h2>
              </div>
              <div className="job-grid">
                {jobs.map((job, index) => (
                  <JobCard key={job.id || index} job={job} />
                ))}
              </div>
            </>
          )}

          {!hasSearched && !isLoading && (
            <div className="welcome">
              <h2>👋 Welcome!</h2>
              <p>
                {activeTab === 'linkedin' && 'Search LinkedIn for architect positions with advanced filters including seniority level, company size, and more.'}
                {activeTab === 'global-jobs' && 'Search global job boards with advanced filters including visa sponsorship, benefits, salary ranges, and technology stack.'}
                {activeTab === 'germany-jobs' && 'Search arbeitnow.com for jobs in Germany with visa sponsorship information.'}
                {activeTab === 'hiringcafe' && 'Search hiring.cafe for jobs aggregated from multiple sources with location-based filtering.'}
                {activeTab === 'linkedin-ai' && 'AI-powered job matching! Paste your resume and let AI find the best matching LinkedIn jobs for you.'}
                {activeTab === 'career-sites' && 'Search company career sites (ATS) for architect positions with AI-enriched filters.'}
              </p>
              <p>Get your API token from <a href="https://console.apify.com/account/integrations" target="_blank" rel="noopener noreferrer">Apify Console</a></p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
