export interface JobSearchConfig {
  location: string;
  keyword: string;
  country: string;
  time_range: string;
  job_type: string;
  experience_level: string;
  remote: string;
  company: string;
  profile_summary: string;
  desired_job_summary: string;
}

export interface LinkedInJob {
  // Core fields from Bright Data API
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
  job_posted_date?: string;
  job_posted_time?: string; // e.g. "1 year ago"
  job_num_applicants?: number;
  job_seniority_level?: string;
  job_employment_type?: string;
  job_function?: string;
  job_industries?: string;
  job_base_pay_range?: string | null;
  apply_link?: string | null;
  country_code?: string;
  title_id?: string;
  application_availability?: boolean;
  is_easy_apply?: boolean;
  salary_standards?: unknown;

  // Discovery input (search params used)
  discovery_input?: {
    experience_level?: string | null;
    job_type?: string | null;
    remote?: string | null;
    selective_search?: string | null;
    time_range?: string | null;
  };

  // Nested salary (raw from API)
  base_salary?: {
    min_amount?: number | null;
    max_amount?: number | null;
    currency?: string | null;
    payment_period?: string | null;
  };

  // Nested job poster (raw from API)
  job_poster?: {
    name?: string | null;
    title?: string | null;
    url?: string | null;
  };

  // Flattened salary fields (after parsing)
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  salary_period?: string;

  // Flattened job poster fields (after parsing)
  job_poster_name?: string;
  job_poster_title?: string;
  job_poster_url?: string;

  // Cleaned description
  job_description_plain?: string;

  // AI-generated fields
  ai_score?: number;
  ai_comment?: string;
}

export interface JobScore {
  job_posting_id: string;
  score: number;
  comment: string;
}

export const TIME_RANGE_OPTIONS = [
  { value: '', label: 'Any Time' },
  { value: 'Past 24 hours', label: 'Past 24 hours' },
  { value: 'Past week', label: 'Past Week' },
  { value: 'Past month', label: 'Past Month' },
];

export const JOB_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
];

export const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Any' },
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
];

export type WorkflowStep = 
  | 'idle' 
  | 'triggering' 
  | 'polling' 
  | 'fetching' 
  | 'scoring' 
  | 'done';

