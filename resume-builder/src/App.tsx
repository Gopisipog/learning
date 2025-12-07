import { useRef, useState } from 'react'
import './App.css'
import { ResumeProvider, useResume, type ResumeData } from './context/ResumeContext'
import { ResumeForm } from './components/ResumeForm'
import { ResumePreview } from './components/ResumePreview'
import { PerplexityResponseViewer } from './components/PerplexityResponseViewer'
import { exportElementToPdf } from './utils/exportPdf'
import { exportResumeToDocx } from './utils/exportDocx'
import {
	generateProfileAndProjects,
	generateResumeFromCv,
	optimizeResumeData,
} from './utils/perplexityClient'

function makeId() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const SENIOR_DEV_PROJECT_PRESETS = [
	{
		name: 'Global E-commerce Microservices Platform',
		link: '',
		description:
			'End-to-end ownership of a microservices-based e-commerce platform handling 10K+ concurrent users across web and mobile. ' +
			'Designed domain-driven services for catalog, checkout, promotions, and inventory, and built fault-tolerant order, payment, and inventory flows in Node.js and PostgreSQL using idempotent operations and distributed transactions to prevent double charges and stock mismatches. ' +
			'Implemented a React storefront with SSR and code-splitting that reduced initial load times and improved conversion, and introduced Kafka-based integrations, CI/CD pipelines, and observability that cut deployment risk and MTTR.',
	},
	{
		name: 'Customer 360 Insights & Analytics Platform',
		link: '',
		description:
			'Led the design and delivery of a centralized Customer 360 data platform aggregating events from web, mobile, CRM, and billing into a single analytics warehouse. ' +
			'Architected ingestion pipelines in a modern data stack, implemented slowly changing dimensions, and delivered curated marts and APIs used by marketing, product, and support. ' +
			'Built self-serve dashboards and experimentation tooling that enabled teams to run A/B tests, track cohorts, and make data-driven decisions that increased engagement and reduced churn.',
	},
	{
		name: 'Subscription Billing & Payments System',
		link: '',
		description:
			'Oversaw development of a subscription billing engine and payments system supporting recurring plans, usage-based pricing, and discounts across multiple gateways. ' +
			'Implemented a pricing and invoicing service that computes charges at scale, built asynchronous workflows for renewals and dunning to keep core APIs fast, and added detailed invoice generation and emailing. ' +
			'Introduced automated test coverage and observability around payment success rates, latency, and error budgets, increasing successful payments and reducing billing-related support tickets.',
	},
] as const

function AiResumePage({ data }: { data: ResumeData }) {
  const { basics, summary, skills, experience, education, projects } = data
  const summaryLines = summary
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  return (
    <div className="ai-resume-page">
      <header className="ai-resume-header">
        <h1>{basics.fullName}</h1>
        {basics.headline && <div className="meta">{basics.headline}</div>}
        <div className="contact">
          {[basics.email, basics.phone, basics.location, basics.website, basics.linkedin, basics.github]
            .filter(Boolean)
            .map((v, idx) => (
              <span key={idx}>{v}</span>
            ))}
        </div>
      </header>

      {summaryLines.length > 0 && (
        <section className="section">
          <h2>Summary</h2>
          {summaryLines.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </section>
      )}

      {skills && (
        <section className="section">
          <h2>Skills</h2>
          <p>{skills}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="section">
          <h2>Experience</h2>
          {experience.map((exp) => {
            const detailLines = exp.details
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean)
            return (
              <div key={exp.id} className="ai-resume-item">
                <h3>
                  {exp.role}  {exp.company}
                </h3>
                <div className="meta">
                  {exp.location && `${exp.location} | `}
                  {exp.startDate}
                  {exp.current
                    ? '  Present'
                    : exp.endDate
                    ? `  ${exp.endDate}`
                    : ''}
                </div>
                {detailLines.map((line, idx2) => (
                  <p key={idx2} className="bullet">
                    3 {line}
                  </p>
                ))}
              </div>
            )
          })}
        </section>
      )}

      {education.length > 0 && (
        <section className="section">
          <h2>Education</h2>
          {education.map((ed) => (
            <div key={ed.id} className="ai-resume-item">
              <h3>
                {ed.degree}  {ed.school}
              </h3>
              <div className="meta">
                {ed.field && `${ed.field} | `}
                {ed.startDate}  {ed.endDate}
              </div>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="section">
          <h2>Projects (AI-enhanced)</h2>
          {projects.map((p) => (
            <div key={p.id} className="ai-resume-item">
              <h3>{p.name}</h3>
              {p.link && (
                <div className="meta">
                  <a href={p.link} target="_blank" rel="noreferrer">
                    {p.link}
                  </a>
                </div>
              )}
              <p>{p.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}

function ResumeAppBody() {
  const { data, setData } = useResume()
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
	const [optimizeLoading, setOptimizeLoading] = useState(false)
	const [lastAiResult, setLastAiResult] = useState<Pick<ResumeData, 'summary' | 'projects'> | null>(
		null,
	)
	const [viewMode, setViewMode] = useState<'builder' | 'aiResume'>('builder')
	const [cvInputOpen, setCvInputOpen] = useState(false)
	const [cvText, setCvText] = useState('')
	const [cvLoading, setCvLoading] = useState(false)
	const [aiResumePopupOpen, setAiResumePopupOpen] = useState(false)

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleUploadJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        setData(parsed)
      } catch (e) {
        alert('Could not parse JSON file. Please check the format.')
        console.error(e)
      }
    }
    reader.readAsText(file)
  }

  const handleExportPdf = async () => {
    if (!previewRef.current) return
    await exportElementToPdf(previewRef.current, 'resume.pdf')
  }

  const handleExportDocx = async () => {
    await exportResumeToDocx(data, 'resume.docx')
  }

	const handleLoadSeniorProjects = () => {
		const existingNames = new Set(
			data.projects.map((p) => p.name.toLowerCase().trim()).filter(Boolean),
		)
		const toAdd = SENIOR_DEV_PROJECT_PRESETS.filter(
			(p) => !existingNames.has(p.name.toLowerCase().trim()),
		).map((p) => ({
			id: makeId(),
			name: p.name,
			link: p.link,
			description: p.description,
		}))

		if (!toAdd.length) {
			alert('Senior developer project preset is already loaded into your projects.')
			return
		}

		setData({
			...data,
			projects: [...data.projects, ...toAdd],
		})
	}

	const handleAiSummaryAndProjects = async () => {
		try {
			setAiLoading(true)
			const result = await generateProfileAndProjects(data)
			setLastAiResult(result)
			setData({
				...data,
				summary: result.summary,
				projects: result.projects,
			})
		} catch (e) {
			console.error(e)
			const message =
				e instanceof Error ? e.message : 'Something went wrong while calling AI.'
			alert(message)
		} finally {
			setAiLoading(false)
		}
	}

	const handleOptimizeResume = async () => {
		try {
			setOptimizeLoading(true)
			const optimized = await optimizeResumeData(data)
			setData(optimized)
			setLastAiResult({ summary: optimized.summary, projects: optimized.projects })
		} catch (e) {
			console.error(e)
			const message =
				e instanceof Error ? e.message : 'Something went wrong while fine-tuning the resume.'
			alert(message)
		} finally {
			setOptimizeLoading(false)
		}
	}
	const handleOpenAiResumePopup = () => {
		setAiResumePopupOpen(true)
	}

	const handleCloseAiResumePopup = () => {
		setAiResumePopupOpen(false)
	}

	const handleOpenCvInput = () => {
		setCvInputOpen(true)
	}

	const handleCancelCvInput = () => {
		if (!cvLoading) {
			setCvInputOpen(false)
		}
	}

	const handleGenerateFromCv = async () => {
		if (!cvText.trim()) {
			alert('Please paste your CV text first.')
			return
		}

		try {
			setCvLoading(true)
			const result = await generateResumeFromCv(cvText)
			setData(result)
			setLastAiResult({ summary: result.summary, projects: result.projects })
			setViewMode('aiResume')
			setCvInputOpen(false)
		} catch (e) {
			console.error(e)
			const message =
				e instanceof Error
					? e.message
					: 'Something went wrong while loading your CV with AI.'
			alert(message)
		} finally {
			setCvLoading(false)
		}
	}

	/* const handleOpenAiResumeWindow = () => {
		// Open a separate window showing a clean AI-based resume view
		const win = window.open('', '_blank', 'noopener,noreferrer')
		if (!win) {
			alert('Please allow pop-ups to view the AI resume in a separate window.')
			return
		}

		const { basics, summary, skills, experience, education, projects } = data
		const summaryLines = summary
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean)

		const experienceHtml = experience
			.map(
				(exp) => `
			<section>
			  <h3>${exp.role}  ${exp.company}</h3>
			  <div class="meta">${exp.location || ''} | ${exp.startDate || ''}$
			    ${exp.current ? '  Present' : exp.endDate || ''}
			  </div>
			  ${exp.details
					.split('\n')
					.map((line) => line.trim())
					.filter(Boolean)
					.map((line) => `<p class="bullet">3 ${line}</p>`)
					.join('')}
			</section>
		`,
			)
			.join('')

		const educationHtml = education
			.map(
				(ed) => `
			<section>
			  <h3>${ed.degree}  ${ed.school}</h3>
			  <div class="meta">${ed.field || ''} | ${ed.startDate || ''}  ${
					ed.endDate || ''
				}</div>
			</section>
		`,
			)
			.join('')

		const projectsHtml = projects
			.map(
				(p) => `
			<section>
			  <h3>${p.name}</h3>
			  ${p.link ? `<div class="meta"><a href="${p.link}" target="_blank">${p.link}</a></div>` : ''}
			  <p>${p.description}</p>
			</section>
		`,
			)
			.join('')

		const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>AI-Based Resume</title>
    <style>
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 2rem; color: #111; }
      h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
      h2 { font-size: 1.2rem; margin-top: 1.75rem; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; }
      h3 { font-size: 1rem; margin-bottom: 0.1rem; }
      .meta { font-size: 0.85rem; color: #555; margin-bottom: 0.25rem; }
      .section { margin-top: 1.5rem; }
      .bullet { margin: 0.1rem 0; }
      .contact { font-size: 0.9rem; color: #333; }
      .contact span + span::before { content: ' | '; }
      a { color: #0b6bcb; text-decoration: none; }
      a:hover { text-decoration: underline; }
      pre { white-space: pre-wrap; font-family: inherit; }
    </style>
  </head>
  <body>
    <header>
      <h1>${basics.fullName || ''}</h1>
      <div class="meta">${basics.headline || ''}</div>
      <div class="contact">
        ${[basics.email, basics.phone, basics.location, basics.website, basics.linkedin, basics.github]
				.filter(Boolean)
				.map((v) => `<span>${v}</span>`)
				.join('')}
      </div>
    </header>

    ${summaryLines.length
			? `<section class="section"><h2>Summary</h2>${summaryLines
					.map((line) => `<p>${line}</p>`)
					.join('')}</section>`
			: ''}

    ${skills
			? `<section class="section"><h2>Skills</h2><p>${skills}</p></section>`
			: ''}

    ${experience.length
			? `<section class="section"><h2>Experience</h2>${experienceHtml}</section>`
			: ''}

    ${education.length
			? `<section class="section"><h2>Education</h2>${educationHtml}</section>`
			: ''}

    ${projects.length
			? `<section class="section"><h2>Projects (AI-enhanced)</h2>${projectsHtml}</section>`
			: ''}
  </body>
</html>`

		win.document.open()
		win.document.write(html)
		win.document.close()
	} */

	return (
		<div className="app-root">
			<div className="toolbar">
				<span>Data</span>
				<button type="button" onClick={handleDownloadJson}>
					Download JSON
				</button>
				<label className="file-input">
					Load JSON
					<input type="file" accept="application/json" onChange={handleUploadJson} />
				</label>
				<button type="button" onClick={handleOpenCvInput}>
					Load CV (AI)
				</button>
					<button type="button" onClick={handleLoadSeniorProjects}>
						Load Senior Dev Projects
					</button>
				<span>Export</span>
				<button type="button" onClick={handleExportPdf}>
					Export PDF
				</button>
				<button type="button" onClick={handleExportDocx}>
					Export DOCX
				</button>
					<span>AI Assist</span>
					<button
						type="button"
						onClick={handleAiSummaryAndProjects}
						disabled={aiLoading || optimizeLoading}
					>
						{aiLoading ? 'AI drafting…' : 'AI Summary + Projects'}
					</button>
					<button
						type="button"
						onClick={handleOptimizeResume}
						disabled={optimizeLoading || aiLoading}
					>
						{optimizeLoading ? 'Fine-tuning…' : 'AI Fine-tune Resume'}
					</button>
					<button type="button" onClick={handleOpenAiResumePopup}>
						Pop AI Resume
					</button>
				<span>View</span>
				<button
						type="button"
						onClick={() => setViewMode('builder')}
						disabled={viewMode === 'builder'}
				>
					Editor
				</button>
				<button
						type="button"
						onClick={() => setViewMode('aiResume')}
						disabled={viewMode === 'aiResume'}
				>
					AI Resume
				</button>
			</div>

				{viewMode === 'builder' ? (
					<>
						<div className="layout">
							<ResumeForm />
							<ResumePreview previewRef={previewRef} />
						</div>
					{cvInputOpen && (
						<div className="cv-input-panel">
							<h2>Load CV with OpenAI</h2>
							<p>
								Paste your existing CV or resume text. The AI will convert it into a structured
								resume using the same resume-writing expertise as the guides in this project.
							</p>
							<textarea
								rows={12}
								value={cvText}
								onChange={(e) => setCvText(e.target.value)}
								placeholder="Paste your CV here..."
							/>
							<div className="cv-input-actions">
								<button
									type="button"
									onClick={handleGenerateFromCv}
									disabled={cvLoading}
								>
									{cvLoading ? 'Loading CV with AI…' : 'Generate Resume from CV'}
								</button>
								<button
									type="button"
									onClick={handleCancelCvInput}
									disabled={cvLoading}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
					{lastAiResult && (
						<div className="ai-output-panel">
							<h2>AI Generated Content</h2>
							<section>
								<h3>Summary</h3>
								<pre>{lastAiResult.summary}</pre>
							</section>
							<section>
								<h3>Projects</h3>
								<ul>
									{lastAiResult.projects.map((p) => (
										<li key={p.id}>
											<strong>{p.name}</strong>
											<p>{p.description}</p>
											{p.link && (
												<a href={p.link} target="_blank" rel="noreferrer">
													{p.link}
												</a>
											)}
										</li>
									))}
								</ul>
							</section>
						</div>
					)}
						<PerplexityResponseViewer />
					</>
				) : (
					<AiResumePage data={data} />
				)}

				{aiResumePopupOpen && (
					<div className="ai-resume-modal-backdrop" onClick={handleCloseAiResumePopup}>
						<div
							className="ai-resume-modal"
							onClick={(e) => {
								e.stopPropagation()
							}}
						>
							<div className="ai-resume-modal-header">
								<h2>AI Resume</h2>
								<button
									type="button"
									className="ai-resume-modal-close"
									onClick={handleCloseAiResumePopup}
								>
									Close
								</button>
							</div>
							<div className="ai-resume-modal-body">
								<AiResumePage data={data} />
							</div>
						</div>
					</div>
				)}
		</div>
	)
}

function App() {
  return (
    <ResumeProvider>
      <ResumeAppBody />
    </ResumeProvider>
  )
}

export default App
