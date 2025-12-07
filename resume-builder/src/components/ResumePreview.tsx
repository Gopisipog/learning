import type { RefObject } from 'react'
import { useResume } from '../context/ResumeContext'

export function ResumePreview({ previewRef }: { previewRef: RefObject<HTMLDivElement | null> }) {
  const { data } = useResume()

  const summaryLines = data.summary
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const skillsLine = data.skills.trim()

  return (
    <div className="preview-pane">
      <div className="preview-page" ref={previewRef}>
        <header className="preview-header">
          <h1>{data.basics.fullName || 'Your Name'}</h1>
          <p className="headline">{data.basics.headline || 'Target Role / Value Proposition'}</p>
          <p className="meta-row">
            {[data.basics.email, data.basics.phone, data.basics.location]
              .filter(Boolean)
              .join('  |  ')}
          </p>
          <p className="meta-row">
            {[data.basics.website, data.basics.linkedin, data.basics.github]
              .filter(Boolean)
              .join('  |  ')}
          </p>
        </header>

        {summaryLines.length > 0 && (
          <section className="preview-section">
            <h2>SUMMARY</h2>
            {summaryLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </section>
        )}

        {skillsLine && (
          <section className="preview-section">
            <h2>SKILLS & CORE STRENGTHS</h2>
            <p>{skillsLine}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="preview-section">
            <h2>EXPERIENCE</h2>
            {data.experience.map((item) => {
              const dates = `${item.startDate}${
                item.startDate && (item.endDate || item.current) ? ' - ' : ''
              }${item.current ? 'Present' : item.endDate}`
              const bullets = item.details
                .split('\n')
                .map((l) => l.trim())
                .filter(Boolean)

              return (
                <div key={item.id} className="preview-block">
                  <div className="preview-row">
                    <div>
                      <div className="employer-role">
                        <span className="role">{item.role}</span>
                        {item.role && item.company && <span> | </span>}
                        <span className="company">{item.company}</span>
                      </div>
                      <div className="sub-row">
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <div className="dates">{dates}</div>
                  </div>
                  {bullets.length > 0 && (
                    <ul>
                      {bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </section>
        )}

        {data.education.length > 0 && (
          <section className="preview-section">
            <h2>EDUCATION</h2>
            {data.education.map((item) => (
              <div key={item.id} className="preview-block">
                <div className="preview-row">
                  <div>
                    <div className="employer-role">
                      <span className="role">{item.degree}</span>
                      {item.degree && item.field && <span>, </span>}
                      <span className="company">{item.field}</span>
                    </div>
                    <div className="sub-row">
                      <span>{item.school}</span>
                    </div>
                  </div>
                  <div className="dates">
                    {[item.startDate, item.endDate].filter(Boolean).join(' - ')}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="preview-section">
            <h2>PROJECTS</h2>
            {data.projects.map((p) => (
              <div key={p.id} className="preview-block">
                <div className="employer-role">
                  <span className="role">{p.name}</span>
                  {p.link && (
                    <span className="company">
                      {' '}
                      |
                      {' '}
                      {p.link}
                    </span>
                  )}
                </div>
                {p.description && <p>{p.description}</p>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
