import type { Job, HiringCafeSearchFilters } from './types';

const ACTOR_ID = 'genz-coder~hiringcafe-jobs-scraper-upto-10k';
const APIFY_API_BASE = 'https://api.apify.com/v2';

export async function searchHiringCafeJobs(
  apiToken: string,
  filters: HiringCafeSearchFilters
): Promise<Job[]> {
  // Validate search URL
  if (!filters.searchUrl || !filters.searchUrl.startsWith('https://hiring.cafe/')) {
    throw new Error('Please provide a valid HiringCafe search URL starting with https://hiring.cafe/');
  }

  // Build input for the actor
  const input = {
    searchUrl: filters.searchUrl,
    maxJobs: filters.maxJobs || 50,
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
    throw new Error(errorData.error?.message || `Failed to start HiringCafe search: ${runResponse.status}`);
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
    throw new Error(`HiringCafe search failed with status: ${status}`);
  }

  // Fetch results from dataset
  const datasetResponse = await fetch(
    `${APIFY_API_BASE}/datasets/${datasetId}/items?token=${apiToken}`
  );

  if (!datasetResponse.ok) {
    throw new Error('Failed to fetch HiringCafe job results');
  }

  const items = await datasetResponse.json();

  // Map to Job interface
  return items.map((item: Record<string, unknown>) => ({
    id: item.id as string || item.url as string,
    title: item.title as string,
    company: item.company as string || item.companyName as string,
    location: item.location as string,
    url: item.url as string || item.applyUrl as string,
    description: item.description as string,
    salary: item.salary as string,
    employmentType: item.employmentType as string,
    workArrangement: item.workArrangement as string || item.remote as string,
    experienceLevel: item.experienceLevel as string,
    postedDate: item.postedDate as string || item.datePosted as string,
  }));
}

