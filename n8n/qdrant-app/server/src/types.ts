export interface IngestRequestBody {
  collection?: string;
  text?: string;
  metadata?: Record<string, unknown>;
}

export interface QueryRequestBody {
  collection?: string;
  query: string;
  limit?: number;
}
