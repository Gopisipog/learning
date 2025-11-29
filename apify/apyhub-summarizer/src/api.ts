import axios from 'axios';

const API_URL = 'https://api.apyhub.com/ai/summarize-documents/file';

export interface SummaryResponse {
  data?: {
    summary?: string;
  };
  summary?: string;
}

export async function summarizeDocument(
  apiToken: string,
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  console.log('Uploading file:', file.name, 'Size:', file.size);

  const response = await axios.post<SummaryResponse>(API_URL, formData, {
    headers: {
      'apy-token': apiToken,
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('API Response:', response.data);

  // Extract summary from response
  const summary = response.data?.data?.summary || response.data?.summary;

  if (summary) {
    return summary;
  }

  // If response has a different structure, return stringified data
  if (response.data) {
    return JSON.stringify(response.data, null, 2);
  }

  throw new Error('No summary in response');
}

