export interface SearchInput {
  location: string;
  keyword: string;
  country: string;
  time_range: string;
  job_type: string;
  experience_level: string;
  remote: string;
  company: string;
}

export interface JobResult {
  url?: string;
  job_posting_id?: string;
  job_title?: string;
  company_name?: string;
  company_id?: string;
  company_url?: string;
  company_logo?: string;
  job_location?: string;
  job_summary?: string;
  job_description_formatted?: string;
  job_description_plain?: string;
  job_posted_date?: string;
  job_posted_time?: string;
  job_num_applicants?: string;
  job_seniority_level?: string;
  job_employment_type?: string;
  job_function?: string;
  job_industries?: string;
  job_base_pay_range?: string;
  apply_link?: string;
  application_availability?: string;
  country_code?: string;
  // Flattened from job_poster
  job_poster_name?: string;
  job_poster_title?: string;
  job_poster_url?: string;
  // Flattened from base_salary
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_period?: string;
}

export const TIME_RANGE_OPTIONS = [
  { value: '', label: 'Any Time' },
  { value: 'Past 24 hours', label: 'Past 24 hours' },
  { value: 'Past Week', label: 'Past Week' },
  { value: 'Past Month', label: 'Past Month' },
];

export const JOB_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Temporary', label: 'Temporary' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Volunteer', label: 'Volunteer' },
];

export const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Entry level', label: 'Entry level' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Mid-Senior level', label: 'Mid-Senior level' },
  { value: 'Director', label: 'Director' },
  { value: 'Executive', label: 'Executive' },
];

export const REMOTE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'Remote', label: 'Remote' },
  { value: 'On-site', label: 'On-site' },
  { value: 'Hybrid', label: 'Hybrid' },
];

export const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'IL', label: 'Israel' },
];

