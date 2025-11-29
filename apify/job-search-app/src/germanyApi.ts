import type { Job, GermanyJobsSearchFilters } from './types';

const ACTOR_ID = 'conduit~arbeitnow-scraper';
const APIFY_API_BASE = 'https://api.apify.com/v2';

export async function searchGermanyJobs(
  apiToken: string,
  filters: GermanyJobsSearchFilters
): Promise<Job[]> {
  // Build input for the actor
  const input: Record<string, unknown> = {
    searchQuery: filters.searchQuery || '',
    sort: filters.sort || 'relevance',
    maxResults: filters.maxResults || 100,
  };

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
    const errorData = await runResponse.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to start Germany jobs search: ${runResponse.status}`);
  }

  const runData = await runResponse.json();
  const runId = runData.data.id;
  const datasetId = runData.data.defaultDatasetId;

  // Poll for completion
  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const statusResponse = await fetch(
      `${APIFY_API_BASE}/actor-runs/${runId}?token=${apiToken}`
    );

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      status = statusData.data.status;
    }
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(`Germany jobs search failed with status: ${status}`);
  }

  // Fetch results from dataset
  const datasetResponse = await fetch(
    `${APIFY_API_BASE}/datasets/${datasetId}/items?token=${apiToken}`
  );

  if (!datasetResponse.ok) {
    throw new Error('Failed to fetch Germany job results');
  }

  const items = await datasetResponse.json();

  // Map to Job interface
  return items.map((item: Record<string, unknown>) => ({
    id: item.slug as string || item.url as string,
    title: item.title as string,
    company: item.company_name as string,
    location: item.location as string,
    url: item.url as string,
    description: item.description as string,
    employmentType: Array.isArray(item.job_types) ? (item.job_types as string[]).join(', ') : undefined,
    workArrangement: item.remote === true ? 'Remote' : undefined,
    postedDate: item.created_at as string,
    // Arbeitnow specific fields
    aiVisaSponsorship: item.visa_sponsorship as boolean,
    taxonomies: item.tags as string[],
  }));
}

