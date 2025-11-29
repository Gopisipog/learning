export interface SearchInput {
  title: string;
  location: string;
  country: string;
  publishedAt: string;
  contractType: string;
  experienceLevel: string;
  workType: string;
  companyName: string;
  rows: number;
}

export interface JobResult {
  id?: string;
  title?: string;
  companyName?: string;
  companyUrl?: string;
  location?: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  contractType?: string;
  workType?: string;
  experienceLevel?: string;
  postedAt?: string;
  postedTime?: string;
  applicationsCount?: string;
  description?: string;
  descriptionPlain?: string;
  applyUrl?: string;
  jobUrl?: string;
  companyLogo?: string;
  jobPoster?: { name?: string; title?: string; url?: string };
  benefits?: string[];
  skills?: string[];
}

export const TIME_RANGE_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: 'r86400', label: 'Past 24 hours' },
  { value: 'r604800', label: 'Past week' },
  { value: 'r2592000', label: 'Past month' },
];

export const JOB_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'F', label: 'Full-time' },
  { value: 'P', label: 'Part-time' },
  { value: 'C', label: 'Contract' },
  { value: 'T', label: 'Temporary' },
  { value: 'I', label: 'Internship' },
  { value: 'V', label: 'Volunteer' },
];

export const EXPERIENCE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: 'Internship' },
  { value: '2', label: 'Entry level' },
  { value: '3', label: 'Associate' },
  { value: '4', label: 'Mid-Senior level' },
  { value: '5', label: 'Director' },
];

export const WORK_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: 'On-site' },
  { value: '2', label: 'Remote' },
  { value: '3', label: 'Hybrid' },
];

export const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'FR', label: 'France' },
  { value: 'IN', label: 'India' },
  { value: 'NL', label: 'Netherlands' },
];

