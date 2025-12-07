const http = require('http');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load local env file (",env") if present so you don't have to export vars manually
function loadLocalEnv() {
	const envPath = path.join(__dirname, ',env');
	if (!fs.existsSync(envPath)) return;

	const content = fs.readFileSync(envPath, 'utf8');
	for (const line of content.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const [key, ...rest] = trimmed.split('=');
		if (!key) continue;
		if (process.env[key] == null) {
			process.env[key] = rest.join('=').trim();
		}
	}
}

loadLocalEnv();

const BRIGHT_DATA_API_TOKEN = process.env.BRIGHT_DATA_API_TOKEN;
const BRIGHT_DATA_DATASET_ID =
	process.env.BRIGHT_DATA_DATASET_ID || 'gd_lpfll7v5hcqtkxl6l';
const PORT = Number(process.env.SCRAPER_PORT || 4002);

if (!BRIGHT_DATA_API_TOKEN) {
	console.error('Missing BRIGHT_DATA_API_TOKEN environment variable');
	process.exit(1);
}

const DEFAULT_INPUT = [
	{
		url: 'https://www.linkedin.com/jobs/search?keywords=Software&location=Tel%20Aviv-Yafo&geoId=101570771&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0&f_TPR=r3600',
	},
	{ url: 'https://www.linkedin.com/jobs/semrush-jobs?f_C=2821922' },
	{ url: 'https://www.linkedin.com/jobs/reddit-inc.-jobs-worldwide?f_C=150573' },
];

async function scrapeLinkedInJobs(customInput) {
	const input =
		Array.isArray(customInput) && customInput.length > 0
			? customInput
			: DEFAULT_INPUT;

	const apiUrl = `https://api.brightdata.com/datasets/v3/scrape?dataset_id=${encodeURIComponent(
		BRIGHT_DATA_DATASET_ID,
	)}&notify=false&include_errors=true&type=discover_new&discover_by=url`;

	const response = await axios.post(
		apiUrl,
		{ input },
		{
			headers: {
				Authorization: `Bearer ${BRIGHT_DATA_API_TOKEN}`,
				'Content-Type': 'application/json',
			},
		},
	);

	return response.data;
}

function sendJson(res, statusCode, body) {
	const payload = JSON.stringify(body);
	res.writeHead(statusCode, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
	});
	res.end(payload);
}

function parseJsonBody(req) {
	return new Promise((resolve, reject) => {
		let data = '';
		req.on('data', (chunk) => {
			data += chunk;
			if (data.length > 1e6) {
				// Simple protection against very large bodies
				req.destroy();
				reject(new Error('Request body too large'));
			}
		});
		req.on('end', () => {
			if (!data) return resolve({});
			try {
				resolve(JSON.parse(data));
			} catch (err) {
				reject(err);
			}
		});
	});
}

const server = http.createServer(async (req, res) => {
	if (req.method === 'OPTIONS') {
		res.writeHead(204, {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
		});
		return res.end();
	}

	if (req.url === '/healthz' && req.method === 'GET') {
		return sendJson(res, 200, { ok: true });
	}

	if (req.url === '/api/url-scrape' && req.method === 'POST') {
		let body;
		try {
			body = await parseJsonBody(req);
		} catch (err) {
			return sendJson(res, 400, { error: 'Invalid JSON body' });
		}

		try {
			const data = await scrapeLinkedInJobs(body.input);
			return sendJson(res, 200, { data });
		} catch (err) {
			console.error(
				'Error scraping LinkedIn via Bright Data:',
				err.response?.data || err.message,
			);
			const status = err.response?.status || 500;
			const errorPayload = err.response?.data || {
				error: err.message || 'Bright Data request failed',
			};
			return sendJson(res, status, errorPayload);
		}
	}

	sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
	console.log(
		`LinkedIn axios scraper server listening on http://localhost:${PORT} (POST /api/url-scrape)`,
	);
});
