export interface IngestResponse {
  pointId: string;
  collection: string;
}

export interface QueryMatch {
  id: string | number;
  score: number;
  payload?: Record<string, unknown>;
}

export interface QueryResponse {
  matches: QueryMatch[];
}
