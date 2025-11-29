import axios from 'axios';
import type { SummarizeInput, SummarizeResponse } from './types';

const API_URL = 'https://api.edenai.run/v2/text/summarize';

export async function summarizeText(
  apiToken: string,
  input: SummarizeInput
): Promise<SummarizeResponse> {
  const response = await axios.post<SummarizeResponse>(
    API_URL,
    {
      text: input.text,
      output_sentences: input.output_sentences,
      providers: input.providers,
      language: input.language,
    },
    {
      headers: {
        authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('Eden AI Response:', response.data);
  return response.data;
}

