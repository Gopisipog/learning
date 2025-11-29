import type { JobSearchConfig, LinkedInJob, JobScore } from './types';

const BRIGHTDATA_API = '/api/brightdata/datasets/v3';
const OPENAI_API = '/api/openai/v1';
const DATASET_ID = 'gd_lpfll7v5hcqtkxl6l'; // LinkedIn Jobs dataset

// Strip HTML tags from formatted description
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&[a-z]+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Parse and flatten Bright Data job response
function parseJobData(item: Record<string, unknown>): LinkedInJob {
  const job: LinkedInJob = { ...item } as LinkedInJob;

  // Flatten job_poster (handle null values)
  if (item.job_poster && typeof item.job_poster === 'object') {
    const poster = item.job_poster as Record<string, string | null>;
    job.job_poster_name = poster.name || '';
    job.job_poster_title = poster.title || '';
    job.job_poster_url = poster.url || '';
  }

  // Flatten base_salary (handle null values)
  if (item.base_salary && typeof item.base_salary === 'object') {
    const salary = item.base_salary as Record<string, unknown>;
    if (salary.min_amount !== null && salary.min_amount !== undefined) {
      job.salary_min = salary.min_amount as number;
    }
    if (salary.max_amount !== null && salary.max_amount !== undefined) {
      job.salary_max = salary.max_amount as number;
    }
    if (salary.currency) {
      job.salary_currency = salary.currency as string;
    }
    if (salary.payment_period) {
      job.salary_period = salary.payment_period as string;
    }
  }

  // Clean job description HTML
  if (item.job_description_formatted) {
    job.job_description_plain = stripHtml(item.job_description_formatted as string);
  }

  // Ensure job_num_applicants is a number
  if (typeof item.job_num_applicants === 'string') {
    job.job_num_applicants = parseInt(item.job_num_applicants, 10) || undefined;
  }

  return job;
}

// Step 1: Trigger Bright Data LinkedIn Jobs Scraper
export async function triggerJobSearch(
  brightDataKey: string,
  config: JobSearchConfig,
  jobsLimit: number
): Promise<string> {
  const params = new URLSearchParams({
    dataset_id: DATASET_ID,
    include_errors: 'true',
    type: 'discover_new',
    discover_by: 'keyword',
    limit_per_input: jobsLimit.toString(),
  });

  const response = await fetch(`${BRIGHTDATA_API}/trigger?${params.toString()}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${brightDataKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([{
      location: config.location,
      keyword: config.keyword || '',
      country: config.country || '',
      time_range: config.time_range || '',
      job_type: config.job_type || '',
      experience_level: config.experience_level || '',
      remote: config.remote || '',
      company: config.company || '',
    }]),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Trigger failed: ${error}`);
  }

  const data = await response.json();
  if (!data.snapshot_id) throw new Error('No snapshot_id returned');
  return data.snapshot_id;
}

// Check if an item is a valid job (not an error entry)
function isValidJob(item: Record<string, unknown>): boolean {
  // Skip entries with crawler errors
  if (item.error || item.error_code) return false;
  // Must have at least a job title or job_posting_id
  if (!item.job_title && !item.job_posting_id) return false;
  return true;
}

// Step 2: Poll for snapshot completion
export async function pollSnapshot(
  brightDataKey: string,
  snapshotId: string,
  onProgress: (status: string, errorCount?: number) => void
): Promise<LinkedInJob[]> {
  const url = `${BRIGHTDATA_API}/snapshot/${snapshotId}?format=json`;

  while (true) {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${brightDataKey}` },
    });

    if (response.status === 200) {
      onProgress('ready');
      const rawData = await response.json();

      // Filter out error entries and count them
      const errorEntries = rawData.filter((item: Record<string, unknown>) => !isValidJob(item));
      const validJobs = rawData.filter((item: Record<string, unknown>) => isValidJob(item));

      if (errorEntries.length > 0) {
        console.warn(`${errorEntries.length} job entries had crawler errors:`, errorEntries);
        onProgress('ready', errorEntries.length);
      }

      // Parse and flatten each valid job
      return validJobs.map((job: Record<string, unknown>) => parseJobData(job));
    } else if (response.status === 202) {
      onProgress('polling');
      await new Promise(r => setTimeout(r, 10000)); // Wait 10s
    } else {
      throw new Error(`Polling failed: ${response.status}`);
    }
  }
}

// Step 3: Score jobs using OpenAI
export async function scoreJobsBatch(
  openAIKey: string,
  jobs: LinkedInJob[],
  profileSummary: string,
  desiredJobSummary: string
): Promise<JobScore[]> {
  const jobsForScoring = jobs.map(j => ({
    job_posting_id: j.job_posting_id,
    job_title: j.job_title,
    company_name: j.company_name,
    job_location: j.job_location,
    job_summary: j.job_summary,
    job_seniority_level: j.job_seniority_level,
    job_employment_type: j.job_employment_type,
  }));

  const prompt = `You are an expert recruiter. Given the following candidate profile:
${profileSummary}

Desired job description:
${desiredJobSummary}

Score each job posting accurately from 0 to 100 on how well it matches the profile and desired job.
For each job, add a short comment (max 50 words) explaining the score and match quality.
Return ONLY a valid JSON array of objects with keys 'job_posting_id', 'score', and 'comment'.

Jobs:
${JSON.stringify(jobsForScoring)}`;

  const response = await fetch(`${OPENAI_API}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful job scoring assistant. Always respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI scoring failed: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '[]';
  
  // Parse JSON from response (handle markdown code blocks)
  let jsonStr = content;
  if (content.includes('```json')) {
    jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (content.includes('```')) {
    jsonStr = content.replace(/```\n?/g, '');
  }
  
  return JSON.parse(jsonStr.trim());
}

// Step 4: Merge scores into jobs and sort
export function mergeScoresIntoJobs(jobs: LinkedInJob[], scores: JobScore[]): LinkedInJob[] {
  const scoreMap = new Map(scores.map(s => [s.job_posting_id, s]));
  
  const enrichedJobs = jobs.map(job => {
    const score = scoreMap.get(job.job_posting_id || '');
    return {
      ...job,
      ai_score: score?.score ?? 0,
      ai_comment: score?.comment ?? 'Not scored',
    };
  });

  return enrichedJobs.sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0));
}

// Export to CSV with all parsed fields
export function exportToCSV(jobs: LinkedInJob[]): string {
  const headers = [
    'ai_score', 'ai_comment', 'job_title', 'company_name', 'job_location',
    'salary_min', 'salary_max', 'salary_currency', 'salary_period',
    'job_employment_type', 'job_seniority_level', 'job_num_applicants',
    'job_poster_name', 'job_poster_title', 'job_posted_date',
    'job_function', 'job_industries', 'apply_link', 'url', 'job_description_plain'
  ];

  const rows = jobs.map(job => headers.map(h => {
    const val = job[h as keyof LinkedInJob];
    if (val === undefined || val === null) return '';
    if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
    return String(val);
  }));

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// Format salary for display
export function formatSalary(job: LinkedInJob): string | null {
  if (!job.salary_min && !job.salary_max) return null;
  const currency = job.salary_currency || 'USD';
  const period = job.salary_period || 'yearly';
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;

  if (job.salary_min && job.salary_max) {
    return `${symbol}${job.salary_min.toLocaleString()} - ${symbol}${job.salary_max.toLocaleString()} / ${period}`;
  }
  if (job.salary_min) return `${symbol}${job.salary_min.toLocaleString()}+ / ${period}`;
  if (job.salary_max) return `Up to ${symbol}${job.salary_max.toLocaleString()} / ${period}`;
  return null;
}

