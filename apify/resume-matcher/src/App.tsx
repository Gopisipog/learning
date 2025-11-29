import { useState, useRef } from 'react';
import { matchResume, extractTextFromFile } from './api';
import { TOP_K_SKILLS_OPTIONS, EXPECTED_YEARS_OPTIONS } from './types';
import type { MatchResult } from './types';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('rapidapi_resume_key') || '');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [topKSkills, setTopKSkills] = useState(10);
  const [expectedYears, setExpectedYears] = useState(0);
  const [useSemanticScoring, setUseSemanticScoring] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      try {
        const text = await extractTextFromFile(file);
        setResumeText(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) { setError('Please enter your RapidAPI key'); return; }
    if (!resumeText.trim()) { setError('Please upload or paste your resume'); return; }
    if (!jobDescription.trim()) { setError('Please enter a job description'); return; }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      localStorage.setItem('rapidapi_resume_key', apiKey);
      const response = await matchResume(apiKey, [{
        resume_text: resumeText,
        jd_text: jobDescription,
        top_k_skills: topKSkills,
        expected_years: expectedYears,
        use_semantic_scoring: useSemanticScoring,
      }]);
      if (response.results && response.results.length > 0) {
        setResult(response.results[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📄 Resume Matcher</h1>
        <p>Match your resume against job descriptions using AI</p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>RapidAPI Key *</label>
            <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter your RapidAPI key" />
            <small>Get your key from <a href="https://rapidapi.com/dayaborar1/api/resume-matcher-api" target="_blank">RapidAPI</a></small>
          </div>

          <div className="form-group">
            <label>Resume *</label>
            <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
              <input type="file" ref={fileInputRef} accept=".pdf,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
              <p>{resumeFile ? `📎 ${resumeFile.name}` : '📤 Click to upload PDF or TXT'}</p>
            </div>
            <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={6}
              placeholder="Or paste your resume text here..." />
            <small>{resumeText.length} characters</small>
          </div>

          <div className="form-group">
            <label>Job Description *</label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={6}
              placeholder="Paste the job description here..." />
            <small>{jobDescription.length} characters</small>
          </div>

          <div className="form-row settings">
            <div className="form-group">
              <label>Top Skills to Match</label>
              <select value={topKSkills} onChange={e => setTopKSkills(Number(e.target.value))}>
                {TOP_K_SKILLS_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Expected Years Exp.</label>
              <select value={expectedYears} onChange={e => setExpectedYears(Number(e.target.value))}>
                {EXPECTED_YEARS_OPTIONS.map(n => <option key={n} value={n}>{n}+ years</option>)}
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" checked={useSemanticScoring} onChange={e => setUseSemanticScoring(e.target.checked)} />
                Use Semantic Scoring
              </label>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? '🔄 Matching...' : '🎯 Match Resume'}
          </button>
        </form>

        {error && <div className="error-box"><h3>❌ Error</h3><p>{error}</p></div>}
        {isLoading && <div className="loading-box"><div className="spinner"></div><p>Analyzing resume...</p></div>}

        {result && (
          <div className="result-section">
            <h2>📊 Match Results</h2>
            <div className="score-card main-score" style={{ borderColor: getScoreColor(result.overall_score * 100) }}>
              <div className="score-circle" style={{ background: getScoreColor(result.overall_score * 100) }}>
                <span>{Math.round(result.overall_score * 100)}%</span>
              </div>
              <h3>Overall Match Score</h3>
            </div>
            
            <div className="scores-grid">
              {result.skill_match_score !== undefined && (
                <div className="score-card"><span className="score-value">{Math.round(result.skill_match_score * 100)}%</span><span className="score-label">Skills Match</span></div>
              )}
              {result.experience_match_score !== undefined && (
                <div className="score-card"><span className="score-value">{Math.round(result.experience_match_score * 100)}%</span><span className="score-label">Experience Match</span></div>
              )}
              {result.semantic_score !== undefined && (
                <div className="score-card"><span className="score-value">{Math.round(result.semantic_score * 100)}%</span><span className="score-label">Semantic Score</span></div>
              )}
            </div>

            {result.matched_skills && result.matched_skills.length > 0 && (
              <div className="skills-section">
                <h4>✅ Matched Skills</h4>
                <div className="skills-list">{result.matched_skills.map((skill, i) => <span key={i} className="skill matched">{skill}</span>)}</div>
              </div>
            )}
            {result.missing_skills && result.missing_skills.length > 0 && (
              <div className="skills-section">
                <h4>❌ Missing Skills</h4>
                <div className="skills-list">{result.missing_skills.map((skill, i) => <span key={i} className="skill missing">{skill}</span>)}</div>
              </div>
            )}
            {result.recommendation && <div className="recommendation"><h4>💡 Recommendation</h4><p>{result.recommendation}</p></div>}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

