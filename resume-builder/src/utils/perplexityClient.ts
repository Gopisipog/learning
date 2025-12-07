import type {
	ResumeData,
	ProjectItem,
	ExperienceItem,
	EducationItem,
} from '../context/ResumeContext'

// Using OpenAI Chat Completions API instead of Perplexity
const API_URL = 'https://api.openai.com/v1/chat/completions'

// Shape we might get back from individual Perplexity calls
export type AiProfileProjectsResponse = {
	summary: string
	projects: { name: string; description: string; link?: string }[]
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    // In modern browsers, crypto.randomUUID is available
    return crypto.randomUUID()
  }
  // Fallback that is good enough for client-side IDs
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function extractJsonFromContent(content: string): string {
	// Trim whitespace first
	let text = content.trim()

	// Perplexity reasoning models often wrap thoughts in <think>...</think>
	// and then append the actual JSON after that. Strip all such blocks first
	// so we only keep the final structured output.
	if (text.includes('<think>')) {
		const THINK_START = '<think>'
		const THINK_END = '</think>'
		let cleaned = ''
		let cursor = 0
		while (true) {
			const start = text.indexOf(THINK_START, cursor)
			if (start === -1) {
				cleaned += text.slice(cursor)
				break
			}
			// keep everything before <think>
			cleaned += text.slice(cursor, start)
			const end = text.indexOf(THINK_END, start + THINK_START.length)
			if (end === -1) {
				// No closing tag; drop the rest since it's reasoning only
				text = cleaned
				break
			}
			// Skip past </think>
			cursor = end + THINK_END.length
		}
		text = cleaned.trim()
	}

	// Common case: already pure JSON
	if (text.startsWith('{') || text.startsWith('[')) return text

	// Strip Markdown code fences like ```json ... ```
	text = text.replace(/```json/gi, '```').trim()
	if (text.startsWith('```') && text.endsWith('```')) {
		text = text.slice(3, -3).trim()
	}

	if (text.startsWith('{') || text.startsWith('[')) return text

	// Fallback: grab the first {...} block
	const firstBrace = text.indexOf('{')
	const lastBrace = text.lastIndexOf('}')
	if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
		return text.slice(firstBrace, lastBrace + 1)
	}

	const firstBracket = text.indexOf('[')
	const lastBracket = text.lastIndexOf(']')
	if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
		return text.slice(firstBracket, lastBracket + 1)
	}

	// Give back original text as a last resort (will likely still fail JSON.parse)
	return content.trim()
}

type OpenAIChatCompletion = {
	choices?: {
		message?: {
			// Newer OpenAI models may return string or array-of-parts content
			content?:
				| string
				| {
						type?: string
						text?: { value?: string; annotations?: unknown[] }
				  }[]
		}
	}[]
}

// Shared helper for calling Perplexity.
// maxTokens is set high so we are very unlikely to hit the model's limit;
// the prompts themselves keep the actual answers short and focused.
async function callPerplexityAndParse<T>(
	systemPrompt: string,
	userPrompt: string,
	maxTokens = 4096,
): Promise<T> {
		const apiKey = import.meta.env.VITE_OPENAI_API_KEY
		if (!apiKey) {
			throw new Error('VITE_OPENAI_API_KEY is not set. Add it to your .env.local file.')
		}

		const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
				model: 'gpt-4.1',
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userPrompt },
			],
			max_tokens: maxTokens,
			temperature: 0.6,
				// Ask OpenAI to return strict JSON
				response_format: { type: 'json_object' },
		}),
	})

	if (!response.ok) {
		const text = await response.text().catch(() => '')
		throw new Error(`Perplexity API error ${response.status}: ${text || response.statusText}`)
	}

		const json = (await response.json()) as OpenAIChatCompletion

		const message = json.choices?.[0]?.message
		let content: string | undefined
		if (typeof message?.content === 'string') {
			content = message.content
		} else if (Array.isArray(message?.content)) {
			content = message.content
				.map((part) => {
					if (typeof part === 'string') return part
					const p: any = part
					if (p?.text && typeof p.text.value === 'string') return p.text.value
					return ''
				})
				.join('')
		}

		if (!content || !content.trim()) {
		throw new Error('Perplexity API returned no content')
	}

	try {
		const jsonText = extractJsonFromContent(content)
		return JSON.parse(jsonText) as T
	} catch (err) {
		console.error('Failed to parse AI JSON content:', content)
		throw new Error('AI response was not valid JSON. Check the prompt or try again.')
	}
}

async function generateSummaryPart(data: ResumeData): Promise<string> {
	const systemPrompt = [
		'You are an expert resume writer using "Optimize Your Resume" and',
		'"Strategic Resumes: Writing for Results" style guidance.',
		'Write a targeted, achievement-focused, ATS-friendly profile summary only.',
		'- 3-6 lines, tightly focused on the target role.',
		'- Include current or desired job title and strong keywords from the role.',
		'- Emphasize strengths and quantified impact, not generic duties.',
		'IMPORTANT: Return ONLY valid JSON as specified, no Markdown, no <think> tags, no commentary.',
	].join('\n')

	const userPrompt = [
		'Here is the current resume data as JSON:',
		'```json',
		JSON.stringify(data, null, 2),
		'```',
		'',
		'Task:',
		'- Rewrite a targeted profile summary based on this data.',
		'',
		'Output format (JSON only):',
		'{',
		'  "summary": "string"',
		'}',
	].join('\n')

	const parsed = await callPerplexityAndParse<{ summary: string }>(systemPrompt, userPrompt)
	return parsed.summary
}

type AiSingleProjectResponse = {
	project: { name: string; description: string; link?: string } | null
}

async function generateSingleProjectPart(
	data: ResumeData,
	existingNames: string[],
): Promise<ProjectItem | null> {
	const systemPrompt = [
		'You are an expert resume writer using "Optimize Your Resume" and',
		'"Strategic Resumes: Writing for Results" style guidance.',
		'Write ONE targeted, achievement-focused, ATS-friendly project description.',
		'- Treat the project as proof of skills: state context, what you did, and clear results.',
		'- Use 2-3 strong accomplishment sentences, focused and concise.',
		'- Use action verbs and numbers (time saved, revenue, efficiency, adoption, etc.) where possible.',
		'IMPORTANT: Return ONLY valid JSON as specified, no Markdown, no <think> tags, no commentary.',
	].join('\n')

	const existingNamesLine =
		existingNames.length > 0
			? `Previously used project names (avoid repeating or renaming these): ${existingNames.join(', ')}`
			: 'No previous project names have been used yet.'

	const userPrompt = [
		'Here is the current resume data as JSON:',
		'```json',
		JSON.stringify(data, null, 2),
		'```',
		'',
		existingNamesLine,
		'',
		'Task:',
		'- Propose ONE strong project that is not already represented by the existing names.',
		'- If there is no additional strong project, respond with { "project": null }.',
		'',
		'Output format (JSON only):',
		'{',
		'  "project": {',
		'    "name": "string",',
		'    "description": "string",',
		'    "link": "string (optional)"',
		'  }',
		'}',
	].join('\n')

	const parsed = await callPerplexityAndParse<AiSingleProjectResponse>(systemPrompt, userPrompt)

	const raw = parsed.project
	if (!raw || !raw.name || !raw.description) return null

	// Extra safety: avoid duplicates if the model ignored the instruction
	if (existingNames.some((name) => name.toLowerCase() === raw.name.toLowerCase())) {
		return null
	}

	return {
		id: makeId(),
		name: raw.name,
		link: raw.link ?? '',
		description: raw.description,
	}
}

async function generateProjectsPart(data: ResumeData): Promise<ProjectItem[]> {
	const projects: ProjectItem[] = []
	const existingNames: string[] = []
	const maxProjects = 3

	for (let i = 0; i < maxProjects; i += 1) {
		const p = await generateSingleProjectPart(data, existingNames)
		if (!p) break
		projects.push(p)
		existingNames.push(p.name)
	}

	return projects
}

export async function generateProfileAndProjects(
	data: ResumeData,
): Promise<Pick<ResumeData, 'summary' | 'projects'>> {
	// Chunk the work into two Perplexity calls: one for summary, one for projects.
	const [summary, projects] = await Promise.all([
		generateSummaryPart(data),
		generateProjectsPart(data),
	])

	return {
		summary,
		projects,
	}
}

type PlainExperience = Omit<ExperienceItem, 'id'>
type PlainEducation = Omit<EducationItem, 'id'>
type PlainProject = Omit<ProjectItem, 'id'>

type RawResumeFromCvResponse = {
	basics: ResumeData['basics']
	summary: string
	skills: string
	experience: PlainExperience[]
	education: PlainEducation[]
	projects: PlainProject[]
}

// Same JSON shape we expect when asking the model to optimize an
// already-structured resume (fine-tuning wording, bullets, etc.).
type RawOptimizedResumeResponse = RawResumeFromCvResponse

// Convert a free-form CV/resume text into structured ResumeData
// using the same resume-writing expertise as the two guide books.
export async function generateResumeFromCv(cvText: string): Promise<ResumeData> {
	const systemPrompt = [
		'You are an expert resume writer who deeply understands the techniques in',
		'"Optimize Your Resume" and "Strategic Resumes: Writing for Results".',
		'Based ONLY on the CV text the user provides, build a targeted, ATS-friendly resume.',
		'- Focus on clear, quantified accomplishments and strong, concise wording.',
		'- Use reverse-chronological order for experience and education.',
		'- Turn duties into achievement bullets using numbers, scope and impact where possible.',
		'IMPORTANT: Return ONLY valid JSON as specified, no Markdown, no <think> tags, no commentary.',
	].join('\n')

	const userPrompt = [
		'Here is the full text of the candidate CV/resume. It may include headers, footers or formatting artifacts.',
		'Focus on the substance, not the visual layout.',
		'```',
		cvText,
		'```',
		'',
		'Task:',
		'- Infer the target role and strengths from this CV.',
		'- Build a clean, optimized resume following the JSON structure below.',
		'- Use achievement-focused bullet lines in experience, separated by newlines.',
		'- Keep content realistic; do NOT invent degrees, employers or skills that are not implied.',
		'',
		'Output format (JSON only):',
		'{',
		'  "basics": {',
		'    "fullName": "string",',
		'    "headline": "string",',
		'    "email": "string",',
		'    "phone": "string",',
		'    "location": "string",',
		'    "website": "string",',
		'    "linkedin": "string",',
		'    "github": "string"',
		'  },',
		'  "summary": "string",',
		'  "skills": "string",',
		'  "experience": [',
		'    {',
		'      "role": "string",',
		'      "company": "string",',
		'      "location": "string",',
		'      "startDate": "string",',
		'      "endDate": "string",',
		'      "current": true,',
		'      "details": "multi-line string; each line is one strong accomplishment bullet"',
		'    }',
		'  ],',
		'  "education": [',
		'    {',
		'      "school": "string",',
		'      "degree": "string",',
		'      "field": "string",',
		'      "startDate": "string",',
		'      "endDate": "string"',
		'    }',
		'  ],',
		'  "projects": [',
		'    {',
		'      "name": "string",',
		'      "link": "string",',
		'      "description": "string"',
		'    }',
		'  ]',
		'}',
	].join('\n')

	const raw = await callPerplexityAndParse<RawResumeFromCvResponse>(systemPrompt, userPrompt)

	const safeExperience: PlainExperience[] = Array.isArray(raw.experience) ? raw.experience : []
	const safeEducation: PlainEducation[] = Array.isArray(raw.education) ? raw.education : []
	const safeProjects: PlainProject[] = Array.isArray(raw.projects) ? raw.projects : []

	return {
		basics: {
			fullName: raw.basics?.fullName ?? '',
			headline: raw.basics?.headline ?? '',
			email: raw.basics?.email ?? '',
			phone: raw.basics?.phone ?? '',
			location: raw.basics?.location ?? '',
			website: raw.basics?.website ?? '',
			linkedin: raw.basics?.linkedin ?? '',
			github: raw.basics?.github ?? '',
		},
		summary: raw.summary ?? '',
		skills: raw.skills ?? '',
		experience: safeExperience.map((exp) => ({
			id: makeId(),
			role: exp.role ?? '',
			company: exp.company ?? '',
			location: exp.location ?? '',
			startDate: exp.startDate ?? '',
			endDate: exp.endDate ?? '',
			current: Boolean(exp.current),
			details: exp.details ?? '',
		})),
		education: safeEducation.map((ed) => ({
			id: makeId(),
			school: ed.school ?? '',
			degree: ed.degree ?? '',
			field: ed.field ?? '',
			startDate: ed.startDate ?? '',
			endDate: ed.endDate ?? '',
		})),
		projects: safeProjects.map((p) => ({
			id: makeId(),
			name: p.name ?? '',
			link: p.link ?? '',
			description: p.description ?? '',
		})),
	}
}

// Take the existing structured ResumeData and ask the model to
// fine-tune/improve it using the same resume-writing guidance as the books.
export async function optimizeResumeData(current: ResumeData): Promise<ResumeData> {
	const systemPrompt = [
		'You are an expert resume writer who deeply understands the techniques in',
		'"Optimize Your Resume" and "Strategic Resumes: Writing for Results".',
		'You are given an existing structured resume and must improve it without inventing new facts.',
		'- Keep the same person, employers, education and overall story.',
		'- Rewrite wording to be concise, ATS-friendly and achievement-focused.',
		'- Strengthen the headline, summary, skills keywords and accomplishment bullets.',
		'- Use reverse-chronological order for experience and education.',
		'IMPORTANT: Return ONLY valid JSON as specified, no Markdown, no <think> tags, no commentary.',
	].join('\n')

	const userPrompt = [
		'Here is the current structured resume data as JSON. Improve the wording and structure',
		'using the guidance from the two resume books, but do NOT fabricate new jobs or degrees.',
		'```json',
		JSON.stringify(current, null, 2),
		'```',
		'',
		'Output format (JSON only):',
		'{',
		'  "basics": {',
		'    "fullName": "string",',
		'    "headline": "string",',
		'    "email": "string",',
		'    "phone": "string",',
		'    "location": "string",',
		'    "website": "string",',
		'    "linkedin": "string",',
		'    "github": "string"',
		'  },',
		'  "summary": "string",',
		'  "skills": "string",',
		'  "experience": [',
		'    {',
		'      "role": "string",',
		'      "company": "string",',
		'      "location": "string",',
		'      "startDate": "string",',
		'      "endDate": "string",',
		'      "current": true,',
		'      "details": "multi-line string; each line is one strong accomplishment bullet"',
		'    }',
		'  ],',
		'  "education": [',
		'    {',
		'      "school": "string",',
		'      "degree": "string",',
		'      "field": "string",',
		'      "startDate": "string",',
		'      "endDate": "string"',
		'    }',
		'  ],',
		'  "projects": [',
		'    {',
		'      "name": "string",',
		'      "link": "string",',
		'      "description": "string"',
		'    }',
		'  ]',
		'}',
	].join('\n')

	const raw = await callPerplexityAndParse<RawOptimizedResumeResponse>(systemPrompt, userPrompt)

	const safeExperience: PlainExperience[] = Array.isArray(raw.experience) ? raw.experience : []
	const safeEducation: PlainEducation[] = Array.isArray(raw.education) ? raw.education : []
	const safeProjects: PlainProject[] = Array.isArray(raw.projects) ? raw.projects : []

	return {
		basics: {
			fullName: raw.basics?.fullName ?? current.basics.fullName ?? '',
			headline: raw.basics?.headline ?? current.basics.headline ?? '',
			email: raw.basics?.email ?? current.basics.email ?? '',
			phone: raw.basics?.phone ?? current.basics.phone ?? '',
			location: raw.basics?.location ?? current.basics.location ?? '',
			website: raw.basics?.website ?? current.basics.website ?? '',
			linkedin: raw.basics?.linkedin ?? current.basics.linkedin ?? '',
			github: raw.basics?.github ?? current.basics.github ?? '',
		},
		summary: raw.summary ?? current.summary ?? '',
		skills: raw.skills ?? current.skills ?? '',
		experience: safeExperience.map((exp, index) => ({
			id: current.experience[index]?.id ?? makeId(),
			role: exp.role ?? current.experience[index]?.role ?? '',
			company: exp.company ?? current.experience[index]?.company ?? '',
			location: exp.location ?? current.experience[index]?.location ?? '',
			startDate: exp.startDate ?? current.experience[index]?.startDate ?? '',
			endDate: exp.endDate ?? current.experience[index]?.endDate ?? '',
			current:
				typeof exp.current === 'boolean'
					? exp.current
					: Boolean(current.experience[index]?.current),
			details: exp.details ?? current.experience[index]?.details ?? '',
		})),
		education: safeEducation.map((ed, index) => ({
			id: current.education[index]?.id ?? makeId(),
			school: ed.school ?? current.education[index]?.school ?? '',
			degree: ed.degree ?? current.education[index]?.degree ?? '',
			field: ed.field ?? current.education[index]?.field ?? '',
			startDate: ed.startDate ?? current.education[index]?.startDate ?? '',
			endDate: ed.endDate ?? current.education[index]?.endDate ?? '',
		})),
		projects: safeProjects.map((p, index) => ({
			id: current.projects[index]?.id ?? makeId(),
			name: p.name ?? current.projects[index]?.name ?? '',
			link: p.link ?? current.projects[index]?.link ?? '',
			description: p.description ?? current.projects[index]?.description ?? '',
		})),
	}
}
