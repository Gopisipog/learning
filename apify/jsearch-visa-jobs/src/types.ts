export interface Job {
  job_id: string;
  job_title: string;
  employer_name: string;
  employer_logo?: string;
  employer_website?: string;
  job_employment_type: string;
  job_apply_link: string;
  job_description: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_posted_at_datetime_utc: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_is_remote: boolean;
  job_required_experience?: {
    no_experience_required: boolean;
    required_experience_in_months?: number;
    experience_mentioned: boolean;
  };
  job_required_skills?: string[];
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
}

export interface SearchResponse {
  status: string;
  request_id: string;
  data: Job[];
}

export const DATE_POSTED_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '3days', label: 'Past 3 days' },
  { value: 'week', label: 'Past week' },
  { value: 'month', label: 'Past month' },
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'FULLTIME', label: 'Full-time' },
  { value: 'PARTTIME', label: 'Part-time' },
  { value: 'CONTRACTOR', label: 'Contract' },
  { value: 'INTERN', label: 'Internship' },
];

export const REMOTE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'true', label: 'Remote only' },
  { value: 'false', label: 'On-site only' },
];

export const COUNTRY_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' },
];

