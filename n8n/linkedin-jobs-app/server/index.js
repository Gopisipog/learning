import express from 'express';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import mammoth from 'mammoth';

dotenv.config();

const PORT = Number(process.env.PORT || 4001);
const BRIGHT_API_TOKEN = process.env.BRIGHT_DATA_API_TOKEN;
const LINKEDIN_DATASET_ID =
  process.env.BRIGHT_DATA_LINKEDIN_DATASET_ID || 'gd_l4dx9j9sscpvs7no2';
const RESUME_DOC_PATH =
  process.env.RESUME_DOC_PATH ||
  'C:/Users/gopic/Documents/augment-projects/coding/n8n/GopinathMuthukrishnanCV (1).docx';

if (!BRIGHT_API_TOKEN) {
  throw new Error('Missing BRIGHT_DATA_API_TOKEN in .env');
}

const app = express();
app.use(express.json());

let cachedResumeText;
let cachedResumeKeywords;

async function getResumeText() {
  if (cachedResumeText) return cachedResumeText;
  try {
    const buffer = await fs.readFile(RESUME_DOC_PATH);
    const result = await mammoth.extractRawText({ buffer });
    cachedResumeText = result.value || '';
  } catch (err) {
    console.error('Failed to read or parse resume:', err);
    cachedResumeText = '';
  }
  return cachedResumeText;
}

function extractKeywords(text, max = 40) {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && w.length <= 20);
  const counts = new Map();
  for (const w of tokens) {
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word);
}

async function getResumeKeywords() {
  if (cachedResumeKeywords) return cachedResumeKeywords;
  const text = await getResumeText();
  cachedResumeKeywords = extractKeywords(text);
  return cachedResumeKeywords;
}

async function triggerLinkedInSnapshot(jobTitle, location) {
	// This dataset expects URL-based inputs (PDP-style), as seen in the
	// downloaded snapshot where each record has an `input.url` field.
	// Build a LinkedIn jobs search URL from the provided title/location
	// and send it as the `url` field in the Bright Data trigger body.
	const apiUrl = new URL('https://api.brightdata.com/datasets/v3/trigger');
	apiUrl.searchParams.set('dataset_id', LINKEDIN_DATASET_ID);
	apiUrl.searchParams.set('include_errors', 'true');
	apiUrl.searchParams.set('limit_multiple_results', '50');

	const searchUrl = new URL('https://www.linkedin.com/jobs/search');
	if (jobTitle) {
		searchUrl.searchParams.set('keywords', jobTitle);
	}
	if (location) {
		searchUrl.searchParams.set('location', location);
	}

	const body = [
		{
			url: searchUrl.toString(),
		},
	];

	const res = await fetch(apiUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${BRIGHT_API_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	const json = await res.json().catch(() => ({}));
	if (!res.ok) {
		throw new Error(
			`Bright Data trigger failed (${res.status}): ${json.error || json.message || 'unknown error'}`,
		);
	}
	if (!json.snapshot_id) {
		throw new Error('Bright Data trigger did not return snapshot_id');
	}
	return json.snapshot_id;
}

async function waitForSnapshotReady(snapshotId, maxAttempts = 20, delayMs = 15000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const res = await fetch(
      `https://api.brightdata.com/datasets/v3/progress/${snapshotId}`,
      {
        headers: { Authorization: `Bearer ${BRIGHT_API_TOKEN}` },
      },
    );
    const data = await res.json().catch(() => ({}));
    const status = data.status;
    if (status === 'ready') return;
    if (status === 'failed') {
      throw new Error('Bright Data snapshot failed');
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error('Timed out waiting for Bright Data snapshot to be ready');
}

async function fetchSnapshotData(snapshotId) {
  const res = await fetch(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}?format=json`,
    {
      headers: { Authorization: `Bearer ${BRIGHT_API_TOKEN}` },
    },
  );
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(
      `Bright Data snapshot fetch failed (${res.status}): ${data.error || 'unknown error'}`,
    );
  }
  return Array.isArray(data) ? data : [];
}

function scoreJob(job, keywords) {
  const text = (
    (job.job_title || '') +
    ' ' +
    (job.company_name || '') +
    ' ' +
    (job.job_location || job.location || '') +
    ' ' +
    (job.job_summary || job.description_text || '')
  ).toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (text.includes(kw)) score += 1;
  }
  return score;
}

function rankJobs(jobs, keywords) {
  return jobs
    .map((job) => ({ job, score: scoreJob(job, keywords) }))
    .sort((a, b) => b.score - a.score)
    .map(({ job, score }) => ({ job, score }));
}

app.get('/api/healthz', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/jobs', async (req, res) => {
	  try {
	    const { jobTitle, location } = req.body || {};
	    if (!jobTitle && !location) {
	      return res.status(400).json({ error: 'jobTitle or location is required' });
	    }
	    const keywords = await getResumeKeywords();
	    const snapshotId = await triggerLinkedInSnapshot(jobTitle, location);
	    await waitForSnapshotReady(snapshotId);
	    const rawJobs = await fetchSnapshotData(snapshotId);
	    const ranked = rankJobs(rawJobs, keywords);

	    const jobs = ranked.slice(0, 50).map(({ job, score }) => ({
	      id: job.job_posting_id || job.jobid || job.id,
	      title: job.job_title,
	      company: job.company_name,
	      location: job.job_location || job.location,
	      summary: job.job_summary || job.description_text,
	      employmentType: job.job_employment_type,
	      salary: job.job_base_pay_range || job.salary_formatted,
	      applyUrl: job.apply_link || job.url,
	      postedAt: job.job_posted_date || job.date_posted,
	      score,
	    }));

	    return res.json({ count: jobs.length, snapshotId, jobs });
	  } catch (err) {
    console.error('Error in /api/jobs:', err);
    return res
      .status(500)
      .json({ error: err?.message || 'Unexpected error while fetching jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`LinkedIn jobs server listening on http://localhost:${PORT}`);
});

