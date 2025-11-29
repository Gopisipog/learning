import type { Job, GlobalJobsSearchFilters } from './types';

const ACTOR_ID = 'practicaltools~global-jobs-scraper-2';
const APIFY_API_BASE = 'https://api.apify.com/v2';

export async function searchGlobalJobs(
  apiToken: string,
  filters: GlobalJobsSearchFilters
): Promise<Job[]> {
  // Build input for the actor
  const input: Record<string, unknown> = {
    query: filters.query || 'web developer',
    proxyConfiguration: {
      useApifyProxy: true,
      apifyProxyGroups: ['RESIDENTIAL'],
      apifyProxyCountry: 'US',
    },
  };

  if (filters.jobTitleQuery) input.jobTitleQuery = filters.jobTitleQuery;
  if (filters.jobDescriptionQuery) input.jobDescriptionQuery = filters.jobDescriptionQuery;
  if (filters.locations && filters.locations.length > 0) input.locations = filters.locations;
  if (filters.workplaceTypes && filters.workplaceTypes.length > 0) input.workplaceTypes = filters.workplaceTypes;
  if (filters.commitmentTypes && filters.commitmentTypes.length > 0) input.commitmentTypes = filters.commitmentTypes;
  if (filters.seniorityLevel && filters.seniorityLevel.length > 0) input.seniorityLevel = filters.seniorityLevel;
  if (filters.minSalary) input.minSalary = filters.minSalary;
  if (filters.maxSalary) input.maxSalary = filters.maxSalary;
  if (filters.currency) input.currency = filters.currency;
  if (filters.restrictJobsToTransparentSalaries) input.restrictJobsToTransparentSalaries = true;
  if (filters.bachelorsDegreeFieldsOfStudy && filters.bachelorsDegreeFieldsOfStudy.length > 0) input.bachelorsDegreeFieldsOfStudy = filters.bachelorsDegreeFieldsOfStudy;
  if (filters.mastersDegreeFieldsOfStudy && filters.mastersDegreeFieldsOfStudy.length > 0) input.mastersDegreeFieldsOfStudy = filters.mastersDegreeFieldsOfStudy;
  if (filters.bachelorsDegreeRequirements && filters.bachelorsDegreeRequirements.length > 0) input.bachelorsDegreeRequirements = filters.bachelorsDegreeRequirements;
  if (filters.mastersDegreeRequirements && filters.mastersDegreeRequirements.length > 0) input.mastersDegreeRequirements = filters.mastersDegreeRequirements;
  if (filters.companyNames && filters.companyNames.length > 0) input.companyNames = filters.companyNames;
  if (filters.industries && filters.industries.length > 0) input.industries = filters.industries;
  if (filters.benefitsAndPerks && filters.benefitsAndPerks.length > 0) input.benefitsAndPerks = filters.benefitsAndPerks;
  if (filters.languageRequirements && filters.languageRequirements.length > 0) input.languageRequirements = filters.languageRequirements;
  if (filters.technologyKeywordsQuery) input.technologyKeywordsQuery = filters.technologyKeywordsQuery;
  if (filters.requirementsKeywordsQuery) input.requirementsKeywordsQuery = filters.requirementsKeywordsQuery;
  if (filters.dateFetchedPastNDays) input.dateFetchedPastNDays = filters.dateFetchedPastNDays;
  if (filters.sortBy && filters.sortBy !== 'default') input.sortBy = filters.sortBy;
  if (filters.maxResults) input.maxResults = filters.maxResults;

  // Start the actor run
  const runResponse = await fetch(
    `${APIFY_API_BASE}/acts/${ACTOR_ID}/runs?token=${apiToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );

  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    throw new Error(`Failed to start Global Jobs Scraper: ${errorText}`);
  }

  const runData = await runResponse.json();
  const runId = runData.data.id;

  // Poll for completion
  let status = 'RUNNING';
  let attempts = 0;
  const maxAttempts = 120; // 10 minutes max

  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

    const statusResponse = await fetch(
      `${APIFY_API_BASE}/actor-runs/${runId}?token=${apiToken}`
    );

    if (!statusResponse.ok) {
      throw new Error('Failed to check run status');
    }

    const statusData = await statusResponse.json();
    status = statusData.data.status;
    attempts++;

    if (attempts >= maxAttempts) {
      throw new Error('Search timed out after 10 minutes');
    }
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(`Search failed with status: ${status}`);
  }

  // Fetch results from dataset
  const datasetId = runData.data.defaultDatasetId;
  const datasetResponse = await fetch(
    `${APIFY_API_BASE}/datasets/${datasetId}/items?token=${apiToken}`
  );

  if (!datasetResponse.ok) {
    throw new Error('Failed to fetch results');
  }

  const items = await datasetResponse.json();

  // Transform results to match Job interface
  return items.map((item: Record<string, unknown>) => mapGlobalJobToJob(item));
}

function mapGlobalJobToJob(item: Record<string, unknown>): Job {
  const benefits = item.benefits as string[] | undefined;
  const hasVisaSponsorship = benefits?.some(
    (b: string) => b.toLowerCase().includes('visa') || b.toLowerCase().includes('sponsorship')
  );

  return {
    id: (item.id as string) || (item.url as string) || String(Math.random()),
    title: (item.title as string) || (item.jobTitle as string) || 'Unknown Title',
    company: (item.company as string) || (item.companyName as string) || 'Unknown Company',
    location: (item.location as string) || (item.locations as string[])?.join(', ') || 'Not specified',
    url: (item.url as string) || (item.applyUrl as string) || '',
    salary: (item.salary as string) || (item.compensation as string) || undefined,
    employmentType: (item.employmentType as string) || (item.commitmentType as string) || undefined,
    workArrangement: (item.workplaceType as string) || undefined,
    experienceLevel: (item.seniorityLevel as string) || undefined,
    postedDate: (item.postedDate as string) || (item.dateFetched as string) || undefined,
    description: (item.description as string) || (item.jobDescription as string) || undefined,
    aiVisaSponsorship: hasVisaSponsorship,
    // Store raw benefits for display
    taxonomies: benefits,
  };
}

