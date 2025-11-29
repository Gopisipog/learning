export interface Job {
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  url?: string;
  description?: string;
  salary?: string;
  employmentType?: string;
  workArrangement?: string;
  experienceLevel?: string;
  postedDate?: string;
  ats?: string;
  domain?: string;
  taxonomies?: string[];
  // AI-enriched fields
  aiVisaSponsorship?: boolean;
  aiCompanyName?: string;
  aiLocation?: string;
  aiSalary?: string;
  aiEmploymentType?: string;
  aiWorkArrangement?: string;
  aiExperienceLevel?: string;
  aiTaxonomies?: string[];
  // LinkedIn AI Matcher fields
  aiMatchScore?: number;
  aiRank?: number;
  // LinkedIn data
  liCompanyName?: string;
  liCompanyUrl?: string;
  liIndustry?: string;
  liOrganizationEmployees?: number;
  // LinkedIn specific fields
  organizationName?: string;
  organizationSlug?: string;
  organizationEmployees?: number;
  organizationIndustry?: string;
  organizationDescription?: string;
  seniority?: string;
  directApply?: boolean;
  externalApplyUrl?: string;
  atsDuplicate?: boolean | null;
}

export interface SearchFilters {
  titleSearch: string[];
  locationSearch: string[];
  locationExclusionSearch: string[];
  timeRange: '1h' | '24h' | '7d' | '6m';
  limit: number;
  includeAi: boolean;
  aiEmploymentTypeFilter?: string[];
  aiWorkArrangementFilter?: string[];
  aiExperienceLevelFilter?: string[];
  aiHasSalary?: boolean;
  aiVisaSponsorshipFilter?: boolean;
}

// LinkedIn Advanced Job Search filters
export interface LinkedInSearchFilters {
  titleSearch: string[];
  titleExclusionSearch?: string[];
  locationSearch: string[];
  locationExclusionSearch: string[];
  organizationSearch?: string[];
  organizationExclusionSearch?: string[];
  descriptionSearch?: string[];
  timeRange: '1h' | '24h' | '7d';
  limit: number;
  includeAi: boolean;
  removeAgency?: boolean;
  remote?: boolean;
  directApply?: boolean;
  externalApplyUrl?: boolean;
  seniorityFilter?: string[];
  EmploymentTypeFilter?: string[];
  industryFilter?: string[];
  organizationEmployeesLte?: number;
  organizationEmployeesGte?: number;
  aiWorkArrangementFilter?: string[];
  aiExperienceLevelFilter?: string[];
  aiHasSalary?: boolean;
  aiVisaSponsorshipFilter?: boolean;
  aiTaxonomiesFilter?: string[];
}

// Global Jobs Scraper filters
export interface GlobalJobsSearchFilters {
  query: string;
  jobTitleQuery?: string;
  jobDescriptionQuery?: string;
  locations: string[];
  workplaceTypes?: string[];
  commitmentTypes?: string[];
  seniorityLevel?: string[];
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  restrictJobsToTransparentSalaries?: boolean;
  bachelorsDegreeFieldsOfStudy?: string[];
  mastersDegreeFieldsOfStudy?: string[];
  bachelorsDegreeRequirements?: string[];
  mastersDegreeRequirements?: string[];
  companyNames?: string[];
  industries?: string[];
  benefitsAndPerks?: string[];
  languageRequirements?: string[];
  technologyKeywordsQuery?: string;
  requirementsKeywordsQuery?: string;
  dateFetchedPastNDays?: number;
  sortBy?: string;
  maxResults?: number;
}

export const EMPLOYMENT_TYPES = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACTOR',
  'TEMPORARY',
  'INTERN',
  'VOLUNTEER',
  'PER_DIEM',
  'OTHER',
] as const;

export const WORK_ARRANGEMENTS = [
  'On-site',
  'Hybrid',
  'Remote OK',
  'Remote Solely',
] as const;

export const EXPERIENCE_LEVELS = ['0-2', '2-5', '5-10', '10+'] as const;

export const SENIORITY_LEVELS = [
  'Associate',
  'Director',
  'Executive',
  'Mid-Senior level',
  'Entry level',
  'Not Applicable',
  'Internship',
] as const;

// Global Jobs Scraper constants
export const GLOBAL_WORKPLACE_TYPES = ['Remote', 'Hybrid', 'Onsite'] as const;

export const GLOBAL_COMMITMENT_TYPES = [
  'Full Time',
  'Part Time',
  'Contract',
  'Temporary',
  'Seasonal',
  'Volunteer',
] as const;

export const GLOBAL_SENIORITY_LEVELS = [
  'No Prior Experience Required',
  'Mid Level',
  'Senior Level',
] as const;

export const GLOBAL_BENEFITS = [
  { value: 'visa_sponsorship', label: '🛂 Visa Sponsorship' },
  { value: 'relocation_assistance', label: '🚚 Relocation Assistance' },
  { value: 'remote_work', label: '🏠 Remote Work' },
  { value: 'four_day_work_week', label: '📅 4-Day Work Week' },
  { value: 'generous_paid_time_off', label: '🌴 Generous PTO' },
  { value: 'health_insurance', label: '🏥 Health Insurance' },
  { value: 'dental_insurance', label: '🦷 Dental Insurance' },
  { value: 'vision_insurance', label: '👁️ Vision Insurance' },
  { value: 'retirement_plan', label: '💰 Retirement Plan' },
] as const;

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK', 'ILS', 'SGD', 'HKD', 'NZD'] as const;

export const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'date', label: 'Date Posted' },
  { value: 'compensation_desc', label: 'Salary (High to Low)' },
  { value: 'compensation_asc', label: 'Salary (Low to High)' },
] as const;

export const DATE_RANGES = [
  { value: 2, label: 'Last 2 Days' },
  { value: 4, label: 'Last 4 Days' },
  { value: 8, label: 'Last Week' },
  { value: 30, label: 'Last Month' },
  { value: 90, label: 'Last 3 Months' },
] as const;

export const DEGREE_REQUIREMENTS = ['Required', 'Preferred', 'Not Required'] as const;

export const TIME_RANGES = [
  { value: '1h', label: 'Last Hour' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '6m', label: 'Last 6 Months (Backfill)' },
] as const;

export const DEFAULT_ARCHITECT_TITLES = [
  'Software Architect',
  'Solutions Architect',
  'Enterprise Architect',
  'Technical Architect',
  'Cloud Architect',
  'System Architect',
  'Data Architect',
  'Security Architect',
];

export const DEFAULT_LOCATIONS = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'Netherlands',
  'Singapore',
  'Ireland',
  'Remote',
];

export const INDIA_EXCLUSIONS = [
  'India',
  'Bangalore',
  'Bengaluru',
  'Hyderabad',
  'Mumbai',
  'Pune',
  'Chennai',
  'Delhi',
  'Gurgaon',
  'Noida',
  'Kolkata',
];

// Germany Jobs (Arbeitnow) Types
export interface GermanyJobsSearchFilters {
  searchQuery: string;
  sort: 'relevance' | 'newest';
  maxResults: number;
}

export const GERMANY_SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest First' },
] as const;

// HiringCafe Jobs Types
export interface HiringCafeSearchFilters {
  searchUrl: string;
  maxJobs: number;
}

// LinkedIn AI Job Matcher Types
export interface LinkedInAISearchFilters {
  query: string;
  location: string;
  resume: string;
  maxResults: number;
}
