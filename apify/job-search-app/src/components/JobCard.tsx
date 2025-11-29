import type { Job } from '../types';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  // Use AI-enriched data when available, fallback to raw data
  const companyName = job.aiCompanyName || job.organizationName || job.liCompanyName || job.company || 'Unknown Company';
  const location = job.aiLocation || job.location || 'Location not specified';
  const salary = job.aiSalary || job.salary;
  const employmentType = job.aiEmploymentType || job.employmentType;
  const workArrangement = job.aiWorkArrangement || job.workArrangement;
  const experienceLevel = job.aiExperienceLevel || job.experienceLevel;
  const taxonomies = job.aiTaxonomies || job.taxonomies;
  const hasVisaSponsorship = job.aiVisaSponsorship;
  const industry = job.organizationIndustry || job.liIndustry;
  const employees = job.organizationEmployees || job.liOrganizationEmployees;
  const companySlug = job.organizationSlug;
  const companyUrl = job.liCompanyUrl || (companySlug ? `https://www.linkedin.com/company/${companySlug}/` : null);

  return (
    <div className="job-card">
      <div className="job-header">
        <h3 className="job-title">{job.title || 'Untitled Position'}</h3>
        <div className="job-badges">
          {job.aiMatchScore !== undefined && (
            <span className="badge ai-score" style={{
              backgroundColor: job.aiMatchScore >= 80 ? '#22c55e' : job.aiMatchScore >= 60 ? '#eab308' : '#ef4444',
              color: 'white'
            }}>
              🤖 {job.aiMatchScore}% Match
            </span>
          )}
          {job.aiRank !== undefined && (
            <span className="badge ai-rank" style={{ backgroundColor: '#6366f1', color: 'white' }}>
              #{job.aiRank}
            </span>
          )}
          {hasVisaSponsorship && (
            <span className="badge visa-sponsor">✅ Visa Sponsor</span>
          )}
          {workArrangement && (
            <span className={`badge ${workArrangement.toLowerCase().replace(/\s+/g, '-')}`}>
              {workArrangement}
            </span>
          )}
        </div>
      </div>

      <div className="job-company">
        <span className="icon">🏢</span>
        <strong>{companyName}</strong>
        {companyUrl && (
          <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="company-link">
            ↗
          </a>
        )}
      </div>

      <div className="job-location">
        <span className="icon">📍</span>
        <strong>{location}</strong>
      </div>

      {salary && (
        <div className="job-salary">
          <span className="icon">💰</span>
          <strong>{salary}</strong>
        </div>
      )}

      <div className="job-meta">
        {employmentType && (
          <div className="job-type">
            <span className="icon">📋</span>
            {employmentType.replace(/_/g, ' ')}
          </div>
        )}

        {experienceLevel && (
          <div className="job-experience">
            <span className="icon">⭐</span>
            {experienceLevel} years
          </div>
        )}

        {industry && (
          <div className="job-industry">
            <span className="icon">🏭</span>
            {industry}
          </div>
        )}

        {employees && (
          <div className="job-company-size">
            <span className="icon">👥</span>
            {employees.toLocaleString()} employees
          </div>
        )}

        {job.seniority && (
          <div className="job-seniority">
            <span className="icon">📊</span>
            {job.seniority}
          </div>
        )}

        {job.directApply && (
          <div className="job-easy-apply">
            <span className="icon">⚡</span>
            Easy Apply
          </div>
        )}
      </div>

      {taxonomies && taxonomies.length > 0 && (
        <div className="job-tags">
          {taxonomies.slice(0, 5).map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {job.description && (
        <p className="job-description">
          {job.description.slice(0, 200)}
          {job.description.length > 200 ? '...' : ''}
        </p>
      )}

      <div className="job-actions">
        {job.url && (
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            View Job →
          </a>
        )}
      </div>
    </div>
  );
}

