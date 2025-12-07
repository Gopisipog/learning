import {
	AlignmentType,
	Document,
	HeadingLevel,
	Packer,
	Paragraph,
	TextRun,
} from 'docx'
import type { ResumeData } from '../context/ResumeContext'

function paragraph(
	text: string,
	opts?: { bold?: boolean; italics?: boolean; breakBefore?: boolean; indentLevel?: number },
) {
	return new Paragraph({
		spacing: {
			before: opts?.breakBefore ? 120 : 40,
			after: 40,
		},
		indent: opts?.indentLevel
			? { left: 720 * opts.indentLevel } // 0.5" per level roughly
			: undefined,
		children: [
			new TextRun({
				text,
				bold: opts?.bold,
				italics: opts?.italics,
			}),
		],
	})
}

export async function exportResumeToDocx(data: ResumeData, fileName = 'resume.docx') {
	const children: Paragraph[] = []

	// Header
	children.push(
		new Paragraph({
			text: data.basics.fullName || 'Your Name',
			heading: HeadingLevel.TITLE,
			alignment: AlignmentType.CENTER,
			spacing: { after: 80 },
		}),
	)

	const headline = data.basics.headline?.trim()
	if (headline) {
		children.push(
			new Paragraph({
				children: [
					new TextRun({ text: headline, bold: true }),
				],
				alignment: AlignmentType.CENTER,
				spacing: { after: 80 },
			}),
		)
	}

	const contactParts = [data.basics.email, data.basics.phone, data.basics.location]
		.filter(Boolean)
		.join('  |  ')
	if (contactParts)
		children.push(
			new Paragraph({
				children: [new TextRun({ text: contactParts })],
				alignment: AlignmentType.CENTER,
				spacing: { after: 40 },
			}),
		)

	const links = [data.basics.website, data.basics.linkedin, data.basics.github]
		.filter(Boolean)
		.join('  |  ')
	if (links)
		children.push(
			new Paragraph({
				children: [new TextRun({ text: links })],
				alignment: AlignmentType.CENTER,
				spacing: { after: 200 },
			}),
		)

	// Summary
	if (data.summary.trim()) {
		children.push(
			new Paragraph({
				text: 'Summary',
				heading: HeadingLevel.HEADING_2,
				spacing: { before: 160, after: 80 },
			}),
		)
		children.push(paragraph(data.summary))
	}

	// Skills
	if (data.skills.trim()) {
		children.push(
			new Paragraph({
				text: 'Skills',
				heading: HeadingLevel.HEADING_2,
				spacing: { before: 160, after: 80 },
			}),
		)
		children.push(paragraph(data.skills))
	}

	// Experience
	if (data.experience.length) {
		children.push(
			new Paragraph({
				text: 'Experience',
				heading: HeadingLevel.HEADING_2,
				spacing: { before: 160, after: 80 },
			}),
		)
		data.experience.forEach((item) => {
			const header = [item.role, item.company].filter(Boolean).join(' - ')
			if (header)
				children.push(
					paragraph(header, {
						bold: true,
						breakBefore: true,
					}),
				)

			const meta = [
				item.location,
				`${item.startDate} - ${item.current ? 'Present' : item.endDate || ''}`.trim(),
			]
				.filter(Boolean)
				.join(' | ')
			if (meta) children.push(paragraph(meta))

			const lines = item.details
				.split('\n')
				.map((l) => l.trim())
				.filter(Boolean)
			lines.forEach((line) => {
				children.push(
					new Paragraph({
						bullet: { level: 0 },
						spacing: { before: 40, after: 40 },
						children: [new TextRun({ text: line })],
					}),
				)
			})
		})
	}

	// Education
	if (data.education.length) {
		children.push(
			new Paragraph({
				text: 'Education',
				heading: HeadingLevel.HEADING_2,
				spacing: { before: 160, after: 80 },
			}),
		)
		data.education.forEach((item) => {
			const header = [item.degree, item.field, item.school]
				.filter(Boolean)
				.join(', ')
			if (header)
				children.push(
					paragraph(header, {
						bold: true,
						breakBefore: true,
					}),
				)

			const dates = [item.startDate, item.endDate].filter(Boolean).join(' - ')
			if (dates) children.push(paragraph(dates))
		})
	}

	// Projects
	if (data.projects.length) {
		children.push(
			new Paragraph({
				text: 'Projects',
				heading: HeadingLevel.HEADING_2,
				spacing: { before: 160, after: 80 },
			}),
		)
		data.projects.forEach((p) => {
			children.push(
				paragraph(p.name, {
					bold: true,
					breakBefore: true,
				}),
			)
			if (p.link) children.push(paragraph(p.link))
			if (p.description)
				children.push(
					new Paragraph({
						bullet: { level: 0 },
						spacing: { before: 40, after: 40 },
						children: [new TextRun({ text: p.description })],
					}),
				)
		})
	}

	const doc = new Document({
		sections: [
			{
				children,
			},
		],
	})

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
