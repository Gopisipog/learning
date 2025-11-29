import axios from 'axios';
import type { IngestResponse, QueryResponse } from './types';

export interface IngestPayload {
  collection: string;
  text?: string;
  file?: File;
  metadata?: Record<string, string>;
}

export const ingestDocument = async (payload: IngestPayload): Promise<IngestResponse> => {
  const form = new FormData();
  form.append('collection', payload.collection);
  if (payload.file) {
    form.append('file', payload.file);
  }
  if (payload.text) {
    form.append('text', payload.text);
  }
  if (payload.metadata) {
    form.append('metadata', JSON.stringify(payload.metadata));
  }

  const { data } = await axios.post<IngestResponse>('/api/ingest', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return data;
};

export const queryDocument = async (collection: string, query: string, limit: number): Promise<QueryResponse> => {
  const { data } = await axios.post<QueryResponse>('/api/query', {
    collection,
    query,
    limit
  });

  return data;
};
