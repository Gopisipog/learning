export type SummaryModel =
  | 'Summary'
  | 'AI Notes Summary'
  | 'Industry Report Summary'
  | 'Financial Report Summary'
  | 'Business Report Summary'
  | 'Legal Document Summary'
  | 'Essay Resource Summary'
  | 'Meeting Notes Summary';

export type OutputLanguage =
  | 'Same as Input'
  | 'English'
  | '简体中文'
  | '繁體中文'
  | '日本語'
  | 'Español'
  | 'Français'
  | 'Deutsch'
  | 'العربية'
  | 'Português'
  | 'Русский'
  | 'Italiano'
  | '한국어';

export type SummaryLength = 'Short' | 'Medium' | 'Long';

export interface SummarizerInput {
  text: string;
  model: SummaryModel;
  language: OutputLanguage;
  length: SummaryLength;
}

export interface SummaryResult {
  summary?: string;
  originalText?: string;
  model?: string;
  language?: string;
  length?: string;
  characterCount?: number;
  wordCount?: number;
}

export const SUMMARY_MODELS: SummaryModel[] = [
  'Summary',
  'AI Notes Summary',
  'Industry Report Summary',
  'Financial Report Summary',
  'Business Report Summary',
  'Legal Document Summary',
  'Essay Resource Summary',
  'Meeting Notes Summary',
];

export const OUTPUT_LANGUAGES: OutputLanguage[] = [
  'Same as Input',
  'English',
  '简体中文',
  '繁體中文',
  '日本語',
  'Español',
  'Français',
  'Deutsch',
  'العربية',
  'Português',
  'Русский',
  'Italiano',
  '한국어',
];

export const SUMMARY_LENGTHS: SummaryLength[] = ['Short', 'Medium', 'Long'];

export const DEFAULT_TEXT = `AI content detectors are indispensable across multiple domains due to a multitude of reasons. Firstly, in academic settings, they aid in upholding academic integrity by identifying instances of plagiarism and ensuring that students submit original work. Secondly, in journalism and media, these detectors verify the authenticity of content, thereby curbing the dissemination of misinformation. Additionally, businesses utilize AI text detectors to ensure compliance with regulations and safeguard against data breaches and intellectual property theft. Lastly, platforms relying on user-generated content benefit from these detectors by implementing quality control measures to filter out AI-generated spam or subpar submissions. Overall, the integration of AI text detectors helps uphold higher standards of authenticity, integrity, and quality across diverse fields.`;

