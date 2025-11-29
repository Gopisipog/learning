export interface SummarizeInput {
  text: string;
  output_sentences: number;
  providers: string;
  language: string;
}

export interface ProviderResult {
  status: string;
  result?: string;
  cost?: number;
}

export interface SummarizeResponse {
  [provider: string]: ProviderResult;
}

export const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', icon: '🤖' },
  { id: 'microsoft', name: 'Microsoft', icon: '🪟' },
  { id: 'connexun', name: 'Connexun', icon: '🔗' },
  { id: 'emvista', name: 'Emvista', icon: '👁️' },
  { id: 'cohere', name: 'Cohere', icon: '🌊' },
  { id: 'alephalpha', name: 'Aleph Alpha', icon: '🔤' },
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

export const SENTENCE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const DEFAULT_TEXT = `Barack Hussein Obama is an American politician who served as the 44th president of the United States from 2009 to 2017. A member of the Democratic Party, Obama was the first African-American president of the United States. He previously served as a U.S. senator from Illinois from 2005 to 2008 and as an Illinois state senator from 1997 to 2004, and previously worked as a civil rights lawyer before entering politics.

Obama was born in Honolulu, Hawaii. After graduating from Columbia University in 1983, he worked as a community organizer in Chicago. In 1988, he enrolled in Harvard Law School, where he was the first African-American president of the Harvard Law Review. After graduating, he became a civil rights attorney and an academic, teaching constitutional law at the University of Chicago Law School from 1992 to 2004.`;

