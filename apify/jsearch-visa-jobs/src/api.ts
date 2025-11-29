import axios from 'axios';
import type { SearchResponse } from './types';

const API_URL = 'https://jsearch.p.rapidapi.com/search';

export interface SearchParams {
  query: string;
  page: number;
  numPages: number;
  country: string;
  datePosted: string;
  employmentType?: string;
  remoteOnly?: string;
}

export async function searchJobs(
  apiKey: string,
  params: SearchParams
): Promise<SearchResponse> {
  const options = {
    method: 'GET',
    url: API_URL,
    params: {
      query: params.query,
      page: String(params.page),
      num_pages: String(params.numPages),
      country: params.country,
      date_posted: params.datePosted,
      ...(params.employmentType && { employment_types: params.employmentType }),
      ...(params.remoteOnly && { remote_jobs_only: params.remoteOnly }),
    },
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
    },
  };

  const response = await axios.request<SearchResponse>(options);
  return response.data;
}

