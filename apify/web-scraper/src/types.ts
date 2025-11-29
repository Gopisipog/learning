export interface ScrapeRequest {
  url: string;
  country: string;
  method: 'GET' | 'POST';
  headers: string;
  payload: string;
  screenshot: boolean;
  fullScreenshot: boolean;
}

export interface ScrapeResponse {
  html?: string;
  text?: string;
  screenshot?: string;
  status?: number;
  headers?: Record<string, string>;
  error?: string;
}

export const COUNTRY_OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' },
  { value: 'jp', label: 'Japan' },
  { value: 'br', label: 'Brazil' },
];

