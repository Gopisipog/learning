import type { SearchInput, JobResult } from './types';

const APIFY_API_URL = 'https://api.apify.com/v2';
const ACTOR_ID = 'bebity~linkedin-jobs-scraper';

export async function scrapeLinkedInJobs(
  apiToken: string,
  input: SearchInput
): Promise<JobResult[]> {
  // Start the actor run
  const runResponse = await fetch(
    `${APIFY_API_URL}/acts/${ACTOR_ID}/runs?token=${apiToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: input.title,
        location: input.location,
        rows: input.rows,
        publishedAt: input.publishedAt || undefined,
        contractType: input.contractType || undefined,
        experienceLevel: input.experienceLevel || undefined,
        workType: input.workType || undefined,
        companyName: input.companyName ? input.companyName.split(',').map(s => s.trim()) : undefined,
        proxy: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] },
      }),
    }
  );

  if (!runResponse.ok) {
    const error = await runResponse.json();
    throw new Error(error.error?.message || 'Failed to start scraper');
  }

  const runData = await runResponse.json();
  const runId = runData.data.id;
  const datasetId = runData.data.defaultDatasetId;

  // Poll for completion
  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const statusResponse = await fetch(`${APIFY_API_URL}/actor-runs/${runId}?token=${apiToken}`);
    const statusData = await statusResponse.json();
    status = statusData.data.status;
    if (status === 'FAILED' || status === 'ABORTED') {
      throw new Error(`Scraper ${status.toLowerCase()}`);
    }
  }

  // Fetch results from dataset
  const datasetResponse = await fetch(`${APIFY_API_URL}/datasets/${datasetId}/items?token=${apiToken}`);
  const items = await datasetResponse.json();

  return items.map(cleanJobData);
}

function cleanJobData(item: Record<string, unknown>): JobResult {
  const description = (item.description as string) || '';
  return {
    id: item.id as string,
    title: item.title as string,
    companyName: item.companyName as string,
    companyUrl: item.companyUrl as string,
    companyLogo: item.companyLogo as string,
    location: item.location as string,
    salary: item.salary as string,
    salaryMin: (item.salaryInfo as Record<string, unknown>)?.min as number,
    salaryMax: (item.salaryInfo as Record<string, unknown>)?.max as number,
    salaryCurrency: (item.salaryInfo as Record<string, unknown>)?.currency as string,
    salaryPeriod: (item.salaryInfo as Record<string, unknown>)?.period as string,
    contractType: item.contractType as string,
    workType: item.workType as string,
    experienceLevel: item.experienceLevel as string,
    postedAt: item.postedAt as string,
    postedTime: item.postedTime as string,
    applicationsCount: item.applicationsCount as string,
    description,
    descriptionPlain: stripHtml(description),
    applyUrl: item.applyUrl as string,
    jobUrl: item.jobUrl as string,
    jobPoster: item.jobPoster as JobResult['jobPoster'],
    benefits: item.benefits as string[],
    skills: item.skills as string[],
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function exportToCSV(jobs: JobResult[]): string {
  const headers = ['Job Title', 'Company', 'Location', 'Salary', 'Job Type', 'Work Type', 'Experience', 'Posted', 'Apply Link', 'Description'];
  const rows = jobs.map(job => [
    job.title || '', job.companyName || '', job.location || '',
    job.salary || (job.salaryMin ? `${job.salaryCurrency || 'USD'} ${job.salaryMin}-${job.salaryMax}` : ''),
    job.contractType || '', job.workType || '', job.experienceLevel || '',
    job.postedTime || job.postedAt || '', job.applyUrl || job.jobUrl || '',
    (job.descriptionPlain || '').substring(0, 500),
  ]);
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  return [headers.map(escape).join(','), ...rows.map(r => r.map(escape).join(','))].join('\n');
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

