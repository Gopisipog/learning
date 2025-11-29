import type { SearchInput, JobResult } from './types';

// Use proxy in development to avoid CORS issues
const BRIGHT_DATA_API = '/api/brightdata/datasets/v3';
const DATASET_ID = 'gd_lpfll7v5hcqtkxl6l'; // LinkedIn Jobs dataset

export interface SnapshotResponse {
  snapshot_id: string;
}

export interface ProgressResponse {
  status: 'running' | 'ready' | 'failed';
  progress?: number;
}

// Step 1: Trigger snapshot via Bright Data Dataset API
export async function triggerSnapshot(apiKey: string, input: SearchInput): Promise<string> {
  const url = new URL(`${BRIGHT_DATA_API}/trigger`);
  url.searchParams.set('dataset_id', DATASET_ID);
  url.searchParams.set('format', 'json');
  url.searchParams.set('uncompressed_webhook', 'true');
  url.searchParams.set('type', 'discover_new');
  url.searchParams.set('discover_by', 'keyword');

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{
      location: input.location,
      keyword: input.keyword,
      country: input.country,
      time_range: input.time_range || '',
      job_type: input.job_type || '',
      experience_level: input.experience_level || '',
      remote: input.remote || '',
      company: input.company || '',
    }]),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to trigger snapshot' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  const data: SnapshotResponse = await response.json();
  return data.snapshot_id;
}

// Step 2: Poll for snapshot progress
export async function checkProgress(apiKey: string, snapshotId: string): Promise<ProgressResponse> {
  const response = await fetch(`${BRIGHT_DATA_API}/progress/${snapshotId}`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });

  if (!response.ok) throw new Error('Failed to check progress');
  return response.json();
}

// Step 3: Get snapshot data when ready
export async function getSnapshotData(apiKey: string, snapshotId: string): Promise<JobResult[]> {
  const url = new URL(`${BRIGHT_DATA_API}/snapshot/${snapshotId}`);
  url.searchParams.set('format', 'json');

  const response = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  });

  if (!response.ok) throw new Error('Failed to get snapshot data');
  const items = await response.json();
  return items.map(cleanJobData);
}

// Step 4: Clean up data (flatten nested fields, strip HTML)
function cleanJobData(item: Record<string, unknown>): JobResult {
  const result: JobResult = { ...item } as JobResult;
  
  // Flatten job_poster
  if (item.job_poster && typeof item.job_poster === 'object') {
    const poster = item.job_poster as Record<string, string>;
    result.job_poster_name = poster.name || '';
    result.job_poster_title = poster.title || '';
    result.job_poster_url = poster.url || '';
  }

  // Flatten base_salary
  if (item.base_salary && typeof item.base_salary === 'object') {
    const salary = item.base_salary as Record<string, unknown>;
    result.salary_min = salary.min_amount as number;
    result.salary_max = salary.max_amount as number;
    result.salary_currency = salary.currency as string;
    result.salary_period = salary.payment_period as string;
  }

  // Clean job description HTML
  if (item.job_description_formatted) {
    result.job_description_plain = stripHtml(item.job_description_formatted as string);
  }

  return result;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Export to CSV for Google Sheets
export function exportToCSV(jobs: JobResult[]): string {
  const headers = ['job_title', 'company_name', 'job_location', 'job_description_plain', 'job_poster_name', 
    'job_poster_title', 'job_poster_url', 'salary_min', 'salary_max', 'salary_currency', 'salary_period',
    'job_posted_date', 'job_num_applicants', 'apply_link', 'job_seniority_level', 'job_employment_type', 'url'];
  
  const rows = jobs.map(job => headers.map(h => {
    const val = job[h as keyof JobResult];
    return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : (val ?? '');
  }));
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

