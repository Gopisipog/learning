import { type FormEvent, useState } from 'react'
import './App.css'

type Job = {
	id: string
	title: string
	company: string
	location?: string
	summary?: string
	employmentType?: string
	salary?: string
	applyUrl?: string
	postedAt?: string
	score?: number
}

function App() {
	const [jobTitle, setJobTitle] = useState('Data Engineer')
	const [location, setLocation] = useState('India')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [jobs, setJobs] = useState<Job[]>([])

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const response = await fetch('/api/jobs', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ jobTitle, location }),
			})
			const data = await response.json().catch(() => ({}))
			if (!response.ok) {
				throw new Error(data.error || `Request failed with status ${response.status}`)
			}
			setJobs(data.jobs ?? [])
		} catch (err: any) {
			setError(err?.message || 'Unexpected error while searching for jobs')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="app">
			<h1>LinkedIn jobs that match my resume</h1>
			<p className="subtitle">
				The backend reads your resume from disk and uses Bright Data&apos;s LinkedIn dataset, then ranks
				jobs by how well they match your CV.
			</p>

			<form className="job-form" onSubmit={handleSubmit}>
				<label>
					Job title
					<input
						type="text"
						value={jobTitle}
						onChange={(e) => setJobTitle(e.target.value)}
						placeholder="e.g. Data Engineer, Machine Learning Engineer"
						required
					/>
				</label>
				<label>
					Location
					<input
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						placeholder="e.g. India, Remote, Chennai"
					/>
				</label>
				<button type="submit" disabled={loading}>
					{loading ? 'Searching…' : 'Find matching LinkedIn jobs'}
				</button>
			</form>

			{error && <p className="error">Error: {error}</p>}
			{!error && !loading && jobs.length === 0 && (
				<p className="hint">Fill in the form and click the button to search for jobs.</p>
			)}
			{loading && <p>Searching Bright Data for matching LinkedIn jobs…</p>}

			{!loading && jobs.length > 0 && (
				<ul className="job-list">
					{jobs.map((job) => (
						<li key={job.id || job.applyUrl || job.title} className="card">
							<h2>{job.title}</h2>
							<p className="job-meta">
								<span>{job.company}</span>
								{job.location && <span> · {job.location}</span>}
								{job.employmentType && <span> · {job.employmentType}</span>}
							</p>
							{job.salary && <p className="job-salary">Salary: {job.salary}</p>}
							{job.summary && <p className="job-summary">{job.summary}</p>}
							<p className="job-footer">
								{job.postedAt && <span>Posted: {job.postedAt}</span>}
								{typeof job.score === 'number' && <span> · Match score: {job.score}</span>}
							</p>
							{job.applyUrl && (
								<p>
									<a href={job.applyUrl} target="_blank" rel="noreferrer">
										View / apply on LinkedIn
									</a>
								</p>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default App
