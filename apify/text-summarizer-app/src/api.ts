import type { SummarizerInput, SummaryResult } from './types';

const ACTOR_ID = 'easyapi~ai-text-summarizer';
const APIFY_API_BASE = 'https://api.apify.com/v2';

export async function summarizeText(
  apiToken: string,
  input: SummarizerInput
): Promise<SummaryResult> {
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
    throw new Error(errorData.error?.message || `Failed to start summarizer: ${runResponse.status}`);
  }

  const runData = await runResponse.json();
  const runId = runData.data.id;
  const datasetId = runData.data.defaultDatasetId;

  // Poll for completion
  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const statusResponse = await fetch(
      `${APIFY_API_BASE}/actor-runs/${runId}?token=${apiToken}`
    );

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      status = statusData.data.status;
    }
  }

  if (status !== 'SUCCEEDED') {
    throw new Error(`Summarization failed with status: ${status}`);
  }

  // Fetch results from dataset
  const datasetResponse = await fetch(
    `${APIFY_API_BASE}/datasets/${datasetId}/items?token=${apiToken}`
  );

  if (!datasetResponse.ok) {
    throw new Error('Failed to fetch summary results');
  }

  const items = await datasetResponse.json();
  
  // Log response for debugging
  console.log('Summarizer response:', items);

  if (items.length === 0) {
    throw new Error('No summary was generated');
  }

  // Return the first result
  const item = items[0];
  return {
    summary: item.summary || item.text || item.result || item.output || JSON.stringify(item),
    originalText: input.text,
    model: input.model,
    language: input.language,
    length: input.length,
    characterCount: input.text.length,
    wordCount: input.text.split(/\s+/).length,
  };
}

