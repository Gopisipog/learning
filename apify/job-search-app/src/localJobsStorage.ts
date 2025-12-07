import type { Job } from './types';

export type SearchSource = 'career-sites' | 'linkedin' | 'global-jobs' | 'germany-jobs' | 'hiringcafe' | 'linkedin-ai';

interface SavedJobData {
  source: SearchSource;
  jobs: Job[];
  savedAt: string;
  searchInfo?: string;
}

const STORAGE_KEY_PREFIX = 'job_search_data_';

// Save jobs to localStorage
export function saveJobsToLocal(source: SearchSource, jobs: Job[], searchInfo?: string): void {
  const data: SavedJobData = {
    source,
    jobs,
    savedAt: new Date().toISOString(),
    searchInfo,
  };
  localStorage.setItem(STORAGE_KEY_PREFIX + source, JSON.stringify(data));
}

// Load jobs from localStorage
export function loadJobsFromLocal(source: SearchSource): Job[] | null {
  const stored = localStorage.getItem(STORAGE_KEY_PREFIX + source);
  if (!stored) return null;
  
  try {
    const data: SavedJobData = JSON.parse(stored);
    return data.jobs;
  } catch {
    return null;
  }
}

// Get saved data info (when it was saved, etc.)
export function getSavedDataInfo(source: SearchSource): { savedAt: string; count: number; searchInfo?: string } | null {
  const stored = localStorage.getItem(STORAGE_KEY_PREFIX + source);
  if (!stored) return null;
  
  try {
    const data: SavedJobData = JSON.parse(stored);
    return {
      savedAt: data.savedAt,
      count: data.jobs.length,
      searchInfo: data.searchInfo,
    };
  } catch {
    return null;
  }
}

// Check if local data exists for a source
export function hasLocalData(source: SearchSource): boolean {
  return localStorage.getItem(STORAGE_KEY_PREFIX + source) !== null;
}

// Clear local data for a source
export function clearLocalData(source: SearchSource): void {
  localStorage.removeItem(STORAGE_KEY_PREFIX + source);
}

// Export jobs to a downloadable JSON file
export function exportJobsToFile(source: SearchSource, jobs: Job[]): void {
  const data: SavedJobData = {
    source,
    jobs,
    savedAt: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jobs-${source}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import jobs from a JSON file
export function importJobsFromFile(file: File): Promise<{ source: SearchSource; jobs: Job[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: SavedJobData = JSON.parse(content);
        if (!data.jobs || !Array.isArray(data.jobs)) {
          throw new Error('Invalid file format: missing jobs array');
        }
        resolve({ source: data.source || 'linkedin', jobs: data.jobs });
      } catch (err) {
        reject(new Error('Failed to parse JSON file: ' + (err as Error).message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

