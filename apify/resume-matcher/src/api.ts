import axios from 'axios';
import type { MatchRequest, BatchMatchResponse } from './types';

const API_URL = 'https://resume-matcher-api.p.rapidapi.com/batch/match';

export async function matchResume(
  apiKey: string,
  matches: MatchRequest[]
): Promise<BatchMatchResponse> {
  const options = {
    method: 'POST',
    url: API_URL,
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'resume-matcher-api.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      matches,
      webhook_url: '',
    },
  };

  const response = await axios.request<BatchMatchResponse>(options);
  return response.data;
}

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'txt') {
    return await file.text();
  }

  if (extension === 'pdf') {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: unknown) => (item as { str: string }).str)
        .join(' ');
      text += pageText + '\n';
    }

    return text;
  }

  throw new Error('Unsupported file type. Please use PDF or TXT files.');
}

