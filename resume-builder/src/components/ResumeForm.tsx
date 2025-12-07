import type { ChangeEvent } from 'react'
import { useResume } from '../context/ResumeContext'

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function ResumeForm() {
  const { data, updateSection } = useResume()

  const handleBasicsChange = (field: keyof typeof data.basics, value: string) => {
    updateSection('basics', { ...data.basics, [field]: value })
  }

  const handleTextChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    key: 'summary' | 'skills',
  ) => {
    updateSection(key, e.target.value)
  }

  const addExperience = () => {
    updateSection('experience', [
      ...data.experience,
      {
        id: uid(),
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        details: '',
      },
    ])
  }

  const updateExperience = (id: string, patch: Partial<(typeof data.experience)[number]>) => {
    updateSection(
      'experience',
      data.experience.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }

  const removeExperience = (id: string) => {
    updateSection(
      'experience',
      data.experience.filter((item) => item.id !== id),
    )
  }

  const addEducation = () => {
    updateSection('education', [
      ...data.education,
      { id: uid(), school: '', degree: '', field: '', startDate: '', endDate: '' },
    ])
  }

  const updateEducation = (id: string, patch: Partial<(typeof data.education)[number]>) => {
    updateSection(
      'education',
      data.education.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }

  const removeEducation = (id: string) => {
    updateSection(
      'education',
      data.education.filter((item) => item.id !== id),
    )
  }

  const addProject = () => {
    updateSection('projects', [
      ...data.projects,
      { id: uid(), name: '', link: '', description: '' },
    ])
  }

  const updateProject = (id: string, patch: Partial<(typeof data.projects)[number]>) => {
    updateSection(
      'projects',
      data.projects.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }

  const removeProject = (id: string) => {
    updateSection(
      'projects',
      data.projects.filter((item) => item.id !== id),
    )
  }

  return (
    <div className="form-pane">
      <h1>Strategic Resume Builder</h1>
      <p className="help-text">
        Focus on results: use strong action verbs, metrics, and keywords that match your target role.
      </p>

      <section>
        <h2>Header</h2>
        <div className="grid-2">
          <label>
            Full name
            <input
              value={data.basics.fullName}
              onChange={(e) => handleBasicsChange('fullName', e.target.value)}
            />
          </label>
          <label>
            Headline (target role / value)
            <input
              value={data.basics.headline}
              onChange={(e) => handleBasicsChange('headline', e.target.value)}
            />
          </label>
        </div>
        <div className="grid-3">
          <label>
            Email
            <input
              value={data.basics.email}
              onChange={(e) => handleBasicsChange('email', e.target.value)}
            />
          </label>
          <label>
            Phone
            <input
              value={data.basics.phone}
              onChange={(e) => handleBasicsChange('phone', e.target.value)}
            />
          </label>
          <label>
            Location
            <input
              value={data.basics.location}
              onChange={(e) => handleBasicsChange('location', e.target.value)}
            />
          </label>
        </div>
        <div className="grid-3">
          <label>
            Website
            <input
              value={data.basics.website}
              onChange={(e) => handleBasicsChange('website', e.target.value)}
            />
          </label>
          <label>
            LinkedIn
            <input
              value={data.basics.linkedin}
              onChange={(e) => handleBasicsChange('linkedin', e.target.value)}
            />
          </label>
          <label>
            GitHub
            <input
              value={data.basics.github}
              onChange={(e) => handleBasicsChange('github', e.target.value)}
            />
          </label>
        </div>
      </section>

      <section>
        <h2>Targeted Summary</h2>
        <p className="help-text">
          3-6 lines that connect your experience to the role; highlight niche strengths and outcomes.
        </p>
        <textarea
          rows={4}
          value={data.summary}
          onChange={(e) => handleTextChange(e, 'summary')}
        />
      </section>

      <section>
        <h2>Skills / Core Competencies</h2>
        <p className="help-text">Group skills by theme; include tools, domains, and soft skills.</p>
        <textarea
          rows={3}
          value={data.skills}
          onChange={(e) => handleTextChange(e, 'skills')}
        />
      </section>

      <section>
        <div className="section-header">
          <h2>Experience</h2>
          <button type="button" onClick={addExperience}>
            + Add role
          </button>
        </div>
        <p className="help-text">
          Use bullet points that start with strong verbs and end with concrete results (numbers, savings, growth).
        </p>
        {data.experience.map((item) => (
          <div key={item.id} className="card">
            <div className="card-header">
              <strong>Position</strong>
              <button type="button" onClick={() => removeExperience(item.id)}>
                Remove
              </button>
            </div>
            <div className="grid-2">
              <label>
                Role / Title
                <input
                  value={item.role}
                  onChange={(e) => updateExperience(item.id, { role: e.target.value })}
                />
              </label>
              <label>
                Company
                <input
                  value={item.company}
                  onChange={(e) => updateExperience(item.id, { company: e.target.value })}
                />
              </label>
            </div>
            <div className="grid-3">
              <label>
                Location
                <input
                  value={item.location}
                  onChange={(e) => updateExperience(item.id, { location: e.target.value })}
                />
              </label>
              <label>
                Start
                <input
                  value={item.startDate}
                  onChange={(e) => updateExperience(item.id, { startDate: e.target.value })}
                />
              </label>
              <label>
                End
                <input
                  value={item.endDate}
                  onChange={(e) => updateExperience(item.id, { endDate: e.target.value })}
                />
              </label>
            </div>
            <label>
              Achievements (one per line)
              <textarea
                rows={4}
                value={item.details}
                onChange={(e) => updateExperience(item.id, { details: e.target.value })}
              />
            </label>
          </div>
        ))}
      </section>

      <section>
        <div className="section-header">
          <h2>Education</h2>
          <button type="button" onClick={addEducation}>
            + Add education
          </button>
        </div>
        {data.education.map((item) => (
          <div key={item.id} className="card">
            <div className="grid-2">
              <label>
                School
                <input
                  value={item.school}
                  onChange={(e) => updateEducation(item.id, { school: e.target.value })}
                />
              </label>
              <label>
                Degree
                <input
                  value={item.degree}
                  onChange={(e) => updateEducation(item.id, { degree: e.target.value })}
                />
              </label>
            </div>
            <div className="grid-2">
              <label>
                Field
                <input
                  value={item.field}
                  onChange={(e) => updateEducation(item.id, { field: e.target.value })}
                />
              </label>
              <label>
                Dates
                <input
                  value={`${item.startDate} - ${item.endDate}`}
                  onChange={(e) => {
                    const [start, end] = e.target.value.split('-').map((p) => p.trim())
                    updateEducation(item.id, { startDate: start ?? '', endDate: end ?? '' })
                  }}
                />
              </label>
            </div>
            <button type="button" onClick={() => removeEducation(item.id)}>
              Remove education
            </button>
          </div>
        ))}
      </section>

      <section>
        <div className="section-header">
          <h2>Projects</h2>
          <button type="button" onClick={addProject}>
            + Add project
          </button>
        </div>
        {data.projects.map((p) => (
          <div key={p.id} className="card">
            <div className="grid-2">
              <label>
                Name
                <input
                  value={p.name}
                  onChange={(e) => updateProject(p.id, { name: e.target.value })}
                />
              </label>
              <label>
                Link
                <input
                  value={p.link}
                  onChange={(e) => updateProject(p.id, { link: e.target.value })}
                />
              </label>
            </div>
            <label>
              Description (what problem, what you did, impact)
              <textarea
                rows={3}
                value={p.description}
                onChange={(e) => updateProject(p.id, { description: e.target.value })}
              />
            </label>
            <button type="button" onClick={() => removeProject(p.id)}>
              Remove project
            </button>
          </div>
        ))}
      </section>
    </div>
  )
}

