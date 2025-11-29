import type { JobSearchInput, LinkedInJob } from './types';

const API_BASE = 'https://api.apify.com/v2';
const ACTOR_ID = 'bebity~linkedin-jobs-scraper';

interface RunResponse {
  data: {
    id: string;
    status: string;
    defaultDatasetId: string;
  };
}

interface DatasetResponse {
  items: LinkedInJob[];
}

export async function searchLinkedInJobs(
  apiToken: string,
  input: JobSearchInput
): Promise<LinkedInJob[]> {
  // Build the input object, filtering out empty values
  const actorInput: Record<string, unknown> = {
    title: input.title,
    location: input.location,
    rows: input.rows,
    proxy: input.proxy,
  };

  if (input.companyName && input.companyName.length > 0) {
    actorInput.companyName = input.companyName;
  }
  if (input.publishedAt) actorInput.publishedAt = input.publishedAt;
  if (input.workType) actorInput.workType = input.workType;
  if (input.contractType) actorInput.contractType = input.contractType;
  if (input.experienceLevel) actorInput.experienceLevel = input.experienceLevel;

  console.log('Running LinkedIn Jobs Scraper with input:', actorInput);

  // Start the actor run
  const runResponse = await fetch(
    `${API_BASE}/acts/${ACTOR_ID}/runs?token=${apiToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actorInput),
    }
  );

  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    throw new Error(`Failed to start actor: ${errorText}`);
  }

  const runData: RunResponse = await runResponse.json();
  const runId = runData.data.id;
  console.log('Actor run started:', runId);

  // Poll for completion
  let status = runData.data.status;
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(resolve => setTimeout(resolve, 3000));

    const statusResponse = await fetch(
      `${API_BASE}/actor-runs/${runId}?token=${apiToken}`
    );
    const statusData: RunResponse = await statusResponse.json();
    status = statusData.data.status;
    console.log('Run status:', status);
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(`Actor run failed with status: ${status}`);
  }

  // Fetch results from dataset
  const datasetId = runData.data.defaultDatasetId;
  const datasetResponse = await fetch(
    `${API_BASE}/datasets/${datasetId}/items?token=${apiToken}`
  );

  if (!datasetResponse.ok) {
    throw new Error('Failed to fetch dataset');
  }

  const items: LinkedInJob[] = await datasetResponse.json();
  console.log(`Found ${items.length} jobs`);
  return items;
}

