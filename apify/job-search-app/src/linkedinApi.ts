import type { LinkedInSearchFilters, Job } from './types';

const API_BASE_URL = 'https://api.apify.com/v2';
const ACTOR_ID = 'fantastic-jobs~advanced-linkedin-job-search-api';

export async function searchLinkedInJobs(
  apiToken: string,
  filters: LinkedInSearchFilters
): Promise<Job[]> {
  const url = `${API_BASE_URL}/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${apiToken}`;

  const requestBody: Record<string, unknown> = {
    timeRange: filters.timeRange,
    limit: filters.limit,
    includeAi: filters.includeAi,
    descriptionType: 'text',
  };

  if (filters.titleSearch.length > 0) {
    requestBody.titleSearch = filters.titleSearch;
  }

  if (filters.titleExclusionSearch && filters.titleExclusionSearch.length > 0) {
    requestBody.titleExclusionSearch = filters.titleExclusionSearch;
  }

  if (filters.locationSearch.length > 0) {
    requestBody.locationSearch = filters.locationSearch;
  }

  if (filters.locationExclusionSearch.length > 0) {
    requestBody.locationExclusionSearch = filters.locationExclusionSearch;
  }

  if (filters.organizationSearch && filters.organizationSearch.length > 0) {
    requestBody.organizationSearch = filters.organizationSearch;
  }

  if (filters.descriptionSearch && filters.descriptionSearch.length > 0) {
    requestBody.descriptionSearch = filters.descriptionSearch;
  }

  if (filters.removeAgency !== undefined) {
    requestBody.removeAgency = filters.removeAgency;
  }

  if (filters.remote !== undefined) {
    requestBody.remote = filters.remote;
  }

  if (filters.directApply !== undefined) {
    requestBody.directApply = filters.directApply;
  }

  if (filters.externalApplyUrl !== undefined) {
    requestBody.externalApplyUrl = filters.externalApplyUrl;
  }

  if (filters.seniorityFilter && filters.seniorityFilter.length > 0) {
    requestBody.seniorityFilter = filters.seniorityFilter;
  }

  if (filters.EmploymentTypeFilter && filters.EmploymentTypeFilter.length > 0) {
    requestBody.EmploymentTypeFilter = filters.EmploymentTypeFilter;
  }

  if (filters.industryFilter && filters.industryFilter.length > 0) {
    requestBody.industryFilter = filters.industryFilter;
  }

  if (filters.organizationEmployeesLte !== undefined) {
    requestBody.organizationEmployeesLte = filters.organizationEmployeesLte;
  }

  if (filters.organizationEmployeesGte !== undefined) {
    requestBody.organizationEmployeesGte = filters.organizationEmployeesGte;
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

  if (filters.aiTaxonomiesFilter && filters.aiTaxonomiesFilter.length > 0) {
    requestBody.aiTaxonomiesFilter = filters.aiTaxonomiesFilter;
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

