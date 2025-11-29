import type { SearchFilters, Job } from './types';

const API_BASE_URL = 'https://api.apify.com/v2';
const ACTOR_ID = 'fantastic-jobs~career-site-job-listing-api';

export async function searchJobs(
  apiToken: string,
  filters: SearchFilters
): Promise<Job[]> {
  const url = `${API_BASE_URL}/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${apiToken}`;

  const requestBody: Record<string, unknown> = {
    timeRange: filters.timeRange,
    limit: filters.limit,
    includeAi: filters.includeAi,
  };

  if (filters.titleSearch.length > 0) {
    requestBody.titleSearch = filters.titleSearch;
  }

  if (filters.locationSearch.length > 0) {
    requestBody.locationSearch = filters.locationSearch;
  }

  if (filters.locationExclusionSearch.length > 0) {
    requestBody.locationExclusionSearch = filters.locationExclusionSearch;
  }

  if (filters.aiEmploymentTypeFilter && filters.aiEmploymentTypeFilter.length > 0) {
    requestBody.aiEmploymentTypeFilter = filters.aiEmploymentTypeFilter;
  }

  if (filters.aiWorkArrangementFilter && filters.aiWorkArrangementFilter.length > 0) {
    requestBody.aiWorkArrangementFilter = filters.aiWorkArrangementFilter;
  }

  if (filters.aiExperienceLevelFilter && filters.aiExperienceLevelFilter.length > 0) {
    requestBody.aiExperienceLevelFilter = filters.aiExperienceLevelFilter;
  }

  if (filters.aiHasSalary !== undefined) {
    requestBody.aiHasSalary = filters.aiHasSalary;
  }

  if (filters.aiVisaSponsorshipFilter !== undefined) {
    requestBody.aiVisaSponsorshipFilter = filters.aiVisaSponsorshipFilter;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data as Job[];
}

