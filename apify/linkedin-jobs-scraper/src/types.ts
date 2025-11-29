export interface JobSearchInput {
  title: string;
  location: string;
  companyName?: string[];
  companyId?: string[];
  publishedAt?: string;
  rows: number;
  workType?: string;
  contractType?: string;
  experienceLevel?: string;
  proxy: {
    useApifyProxy: boolean;
    apifyProxyGroups: string[];
  };
}

export interface LinkedInJob {
  title?: string;
  company?: string;
  companyUrl?: string;
  location?: string;
  salary?: string;
  postedAt?: string;
  postedDate?: string;
  applyUrl?: string;
  jobUrl?: string;
  link?: string;
  url?: string;
  description?: string;
  employmentType?: string;
  workType?: string;
  experienceLevel?: string;
  applicantsCount?: string | number;
}

export const PUBLISHED_AT_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: 'r86400', label: 'Past 24 hours' },
  { value: 'r604800', label: 'Past week' },
  { value: 'r2592000', label: 'Past month' },
];

export const WORK_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: 'On-site' },
  { value: '2', label: 'Remote' },
  { value: '3', label: 'Hybrid' },
];

export const CONTRACT_TYPE_OPTIONS = [
  { value: '', label: 'Any' },
  { value: 'F', label: 'Full-time' },
  { value: 'P', label: 'Part-time' },
  { value: 'C', label: 'Contract' },
  { value: 'T', label: 'Temporary' },
  { value: 'I', label: 'Internship' },
  { value: 'V', label: 'Volunteer' },
];

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '1', label: 'Internship' },
  { value: '2', label: 'Entry level' },
  { value: '3', label: 'Associate' },
  { value: '4', label: 'Mid-Senior level' },
  { value: '5', label: 'Director' },
];

export const ROWS_OPTIONS = [10, 25, 50, 100, 200, 500, 1000];

