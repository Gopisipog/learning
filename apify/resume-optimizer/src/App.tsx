import { useState, useEffect } from 'react';
import { optimizeResume } from './api';
import { OptimizeResponse, WritingStyle, TemplateStyle } from './types';
import './App.css';

const STORAGE_KEY = 'resume_optimizer_saved';

interface SavedResume {
  id: string;
  name: string;
  savedAt: string;
  data: OptimizeResponse;
}

const SAMPLE_RESUME = `My name is Sally Adamson. My email address is sally4359@gmail.com and my phone number is 555-986-9855. I live in Miami, Florida.

I have worked as an Executive Assistant at ACME Inc. since August 2017 until now. During this time, I helped manage the CEOs daily schedule and travel arrangements. I also assisted c-suite executives with itineraries, flights and hotel accommodations. I use Microsoft Outlook Tasks and Bamboo HR to onboard new employees into the company and kept track of office expenses using Microsoft Excel. I also use MS PowerPoint to create presentations for the company and am an expert in using MS Word.

Before ACME, I worked as a Secretary at Dover Corporation from December 2015 until July 2017. At Dover, I managed the office supplies inventory for the company by using a Microsoft Access database and was also in charge of answering the main corporate phone line. I also ordered catering and daily meals for the company staff.

I hold a Associates degree in Liberal Arts from Wiggly Community College and graduated in 2014. I am also fully fluent in English and Spanish.

I have also volunteered to organize activities for kids at my local YMCA on weekends.

Finally, I have an Microsoft Office Specialist Certification and have obtained multiple awards for excellence including Employee of the Month in 2017 and Employee of the Year in 2022.`;

function App() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [writingStyle, setWritingStyle] = useState<WritingStyle>('Professional');
  const [templateStyle, setTemplateStyle] = useState<TemplateStyle>('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'formatted' | 'json'>('formatted');
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  // Load saved resumes from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSavedResumes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved resumes:', e);
      }
    }
  }, []);

  const handleOptimize = async () => {
    if (!resumeText.trim()) {
      setError('Please enter your resume text');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await optimizeResume({
        ResumeText: resumeText,
        WritingStyle: writingStyle,
        FormattingOptions: { TemplateStyle: templateStyle },
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize resume');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToLocal = () => {
    if (!result) return;
    const name = result.CandidateName || `Resume_${new Date().toLocaleDateString()}`;
    const newSaved: SavedResume = {
      id: Date.now().toString(),
      name,
      savedAt: new Date().toISOString(),
      data: result,
    };
    const updated = [newSaved, ...savedResumes];
    setSavedResumes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    alert(`✅ Saved "${name}" to local storage!`);
  };

  const handleLoadSaved = (saved: SavedResume) => {
    setResult(saved.data);
    setShowSaved(false);
  };

  const handleDeleteSaved = (id: string) => {
    const updated = savedResumes.filter(s => s.id !== id);
    setSavedResumes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(savedResumes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved_resumes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const updated = [...imported, ...savedResumes];
          setSavedResumes(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          alert(`✅ Imported ${imported.length} resume(s)!`);
        } else if (imported.OptimizedResumeAsJson) {
          // Single resume response
          const newSaved: SavedResume = {
            id: Date.now().toString(),
            name: imported.CandidateName || 'Imported Resume',
            savedAt: new Date().toISOString(),
            data: imported,
          };
          const updated = [newSaved, ...savedResumes];
          setSavedResumes(updated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          alert('✅ Imported 1 resume!');
        }
      } catch (err) {
        alert('❌ Failed to import: Invalid JSON format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadDocx = () => {
    if (!result?.OptimizedResumeAsBase64String) return;

    const byteCharacters = atob(result.OptimizedResumeAsBase64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.CandidateName || 'Resume'}_Optimized.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resume = result?.OptimizedResumeAsJson;

  return (
    <div className="app">
      <header>
        <h1>📄 Resume Optimizer Pro</h1>
        <p>AI-powered resume optimization for better job opportunities</p>
      </header>

      {/* Saved Resumes Panel */}
      {showSaved && (
        <div className="saved-panel-overlay" onClick={() => setShowSaved(false)}>
          <div className="saved-panel" onClick={e => e.stopPropagation()}>
            <div className="saved-panel-header">
              <h2>💾 Saved Resumes ({savedResumes.length})</h2>
              <button onClick={() => setShowSaved(false)} className="btn-close">✕</button>
            </div>
            <div className="saved-actions">
              <button onClick={handleExportAll} disabled={savedResumes.length === 0} className="btn-small">
                📤 Export All
              </button>
              <label className="btn-small btn-import">
                📥 Import JSON
                <input type="file" accept=".json" onChange={handleImport} hidden />
              </label>
            </div>
            {savedResumes.length === 0 ? (
              <p className="no-saved">No saved resumes yet. Optimize a resume and click "Save to Local".</p>
            ) : (
              <div className="saved-list">
                {savedResumes.map(saved => (
                  <div key={saved.id} className="saved-item">
                    <div className="saved-info" onClick={() => handleLoadSaved(saved)}>
                      <span className="saved-name">{saved.name}</span>
                      <span className="saved-date">{new Date(saved.savedAt).toLocaleString()}</span>
                    </div>
                    <button onClick={() => handleDeleteSaved(saved.id)} className="btn-delete">🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="input-section">
          <div className="section-header">
            <h2>✏️ Your Resume</h2>
            <button onClick={() => setShowSaved(true)} className="btn-saved">
              💾 Saved ({savedResumes.length})
            </button>
          </div>

          <div className="options-row">
            <div className="option-group">
              <label>Writing Style</label>
              <select value={writingStyle} onChange={e => setWritingStyle(e.target.value as WritingStyle)}>
                <option value="Professional">Professional</option>
                <option value="Casual">Casual</option>
                <option value="Academic">Academic</option>
                <option value="Creative">Creative</option>
              </select>
            </div>
            <div className="option-group">
              <label>Template Style</label>
              <select value={templateStyle} onChange={e => setTemplateStyle(e.target.value as TemplateStyle)}>
                <option value="1">Template 1 - Classic</option>
                <option value="2">Template 2 - Modern</option>
                <option value="3">Template 3 - Minimal</option>
                <option value="4">Template 4 - Creative</option>
                <option value="5">Template 5 - Executive</option>
              </select>
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={15}
          />

          <div className="actions">
            <button onClick={handleOptimize} disabled={loading} className="btn-primary">
              {loading ? '⏳ Optimizing...' : '🚀 Optimize Resume'}
            </button>
            <span className="char-count">{resumeText.length} characters</span>
          </div>

          {error && <div className="error">❌ {error}</div>}
        </div>

        {result && resume && (
          <div className="result-section">
            <div className="result-header">
              <h2>✨ Optimized Resume</h2>
              <div className="header-actions">
                <button onClick={handleSaveToLocal} className="btn-save">
                  💾 Save to Local
                </button>
                <button onClick={handleDownloadDocx} className="btn-download" disabled={!result.OptimizedResumeAsBase64String}>
                  📥 Download DOCX
                </button>
              </div>
            </div>

            {result.OptimizationBoost !== undefined && (
              <div className="boost-badge">
                <span className="boost-label">Optimization Boost</span>
                <span className="boost-value">+{result.OptimizationBoost}%</span>
              </div>
            )}

            <div className="tabs">
              <button className={`tab ${activeTab === 'formatted' ? 'active' : ''}`} onClick={() => setActiveTab('formatted')}>
                📋 Formatted View
              </button>
              <button className={`tab ${activeTab === 'json' ? 'active' : ''}`} onClick={() => setActiveTab('json')}>
                🔧 Raw JSON
              </button>
            </div>

            {activeTab === 'formatted' && (
              <div className="resume-formatted">
                {/* Contact Section */}
                <div className="resume-section contact-section">
                  <h1 className="candidate-name">{resume.ContactInformation.CandidateName}</h1>
                  <div className="contact-info">
                    {resume.ContactInformation.Email && <span>📧 {resume.ContactInformation.Email}</span>}
                    {resume.ContactInformation.Telephone && <span>📱 {resume.ContactInformation.Telephone}</span>}
                    {resume.ContactInformation.City && <span>📍 {resume.ContactInformation.City}</span>}
                  </div>
                  {resume.ContactInformation.WebSites?.length > 0 && (
                    <div className="websites">
                      {resume.ContactInformation.WebSites.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">🔗 {url.replace(/https?:\/\/(www\.)?/, '')}</a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Professional Summary */}
                {resume.ProfessionalSummary && (
                  <div className="resume-section">
                    <h2>Professional Summary</h2>
                    <p className="summary-text">{resume.ProfessionalSummary}</p>
                  </div>
                )}

                {/* Skills */}
                {resume.TechnicalSkills?.length > 0 && (
                  <div className="resume-section">
                    <h2>Technical Skills</h2>
                    <div className="skills-grid">
                      {resume.TechnicalSkills.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {resume.ProfessionalSkills?.length > 0 && (
                  <div className="resume-section">
                    <h2>Professional Skills</h2>
                    <div className="skills-grid">
                      {resume.ProfessionalSkills.map((skill, i) => (
                        <span key={i} className="skill-tag professional">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {resume.WorkHistoryPositions?.length > 0 && (
                  <div className="resume-section">
                    <h2>Work Experience</h2>
                    {resume.WorkHistoryPositions.map((pos, i) => (
                      <div key={i} className="work-position">
                        <div className="position-header">
                          <div>
                            <h3>{pos.JobTitle}</h3>
                            <span className="employer">{pos.EmployerName}</span>
                          </div>
                          <div className="position-meta">
                            <span className="dates">{pos.StartDate} - {pos.EndDate}</span>
                            {pos.Location && <span className="location">📍 {pos.Location}</span>}
                          </div>
                        </div>
                        {pos.Accomplishments?.length > 0 && (
                          <ul className="accomplishments">
                            {pos.Accomplishments.map((acc, j) => (
                              <li key={j}>{acc}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {resume.EducationDetails?.length > 0 && (
                  <div className="resume-section">
                    <h2>Education</h2>
                    {resume.EducationDetails.map((edu, i) => (
                      <div key={i} className="education-item">
                        <h3>{edu.DegreeName} in {edu.AreaOfStudy}</h3>
                        <span className="school">{edu.SchoolName}</span>
                        <span className="grad-date">Graduated: {edu.GraduationDate}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'json' && (
              <div className="json-view">
                <pre>{JSON.stringify(resume, null, 2)}</pre>
              </div>
            )}

            {result.error && <div className="error">❌ {result.error}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

