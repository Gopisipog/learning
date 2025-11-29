import type { Job, LinkedInAISearchFilters } from './types';

const ACTOR_ID = 'james.logantech~ai-linkedin-job-matcher';
const APIFY_API_BASE = 'https://api.apify.com/v2';

export async function searchLinkedInAIJobs(
  apiToken: string,
  filters: LinkedInAISearchFilters
): Promise<Job[]> {
  // Build input for the actor
  const input = {
    query: filters.query,
    location: filters.location,
    resume: filters.resume,
    max_results: filters.maxResults || 100,
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
    throw new Error(errorData.error?.message || `Failed to start LinkedIn AI search: ${runResponse.status}`);
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
    throw new Error(`LinkedIn AI search failed with status: ${status}`);
  }

  // Fetch results from dataset
  const datasetResponse = await fetch(
    `${APIFY_API_BASE}/datasets/${datasetId}/items?token=${apiToken}`
  );

  if (!datasetResponse.ok) {
    throw new Error('Failed to fetch LinkedIn AI job results');
  }

  const items = await datasetResponse.json();

  // Map to Job interface using actual API response fields:
  // role, organisation, location, listDate, listingLink, description, score, rank
  return items.map((item: Record<string, unknown>) => {
    return {
      id: item.listingLink as string || String(Math.random()),
      title: item.role as string || 'Untitled Position',
      company: item.organisation as string || 'Unknown Company',
      location: item.location as string || '',
      url: item.listingLink as string || '',
      description: item.description as string || '',
      salary: '', // Not provided in response
      employmentType: '', // Not provided in response
      postedDate: item.listDate as string || '',
      // Store AI match score and rank
      aiMatchScore: item.score as number,
      aiRank: item.rank as number,
    };
  });
}

