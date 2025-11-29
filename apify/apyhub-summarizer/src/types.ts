export interface SummarizerInput {
  content: string;
  voice_tone: string;
  max_length: string;
  language: string;
}

export interface SummaryResponse {
  status_url: string;
  job_id?: string;
}

export interface SummaryResult {
  status: string;
  data?: {
    summary?: string;
  };
  summary?: string;
}

export const VOICE_TONES = [
  'Professional',
  'Formal',
  'Casual',
  'Friendly',
  'Funny',
  'Adventurous',
  'Serious',
  'Informative',
  'Persuasive',
  'Neutral',
];

export const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Russian',
  'Hindi',
];

export const MAX_LENGTH_OPTIONS = [
  '100',
  '250',
  '500',
  '1000',
  '2000',
  '3000',
  '5000',
  '7500',
  '10000',
];

export const DEFAULT_CONTENT = `Red Bulls Max Verstappen says this weekends Las Vegas Grand Prix is 99% show and 1% sporting event. 

The triple world champion said he is not looking forward to the razzmatazz around the race, the first time Formula 1 cars have raced down the citys famous Strip. 

Other leading drivers were more equivocal about the hype.

Aston Martins Fernando Alonso said: With the investment that has been made and the place we are racing, it deserves a little bit [of] different treatment and extra show. 

The weekend was kick-started on Wednesday evening with a lavish opening ceremony.

It featured performances from several music stars, including Kylie Minogue and Journey, and culminated in the drivers being introduced to a sparsely populated crowd in light rain by being lifted into view on hydraulic platforms under a sound-and-light show. 

Lewis Hamilton said: Its amazing to be here. It is exciting - such an incredible place, so many lights, a great energy, a great buzz. 

This is one of the most iconic cities there is. It is a big show, for sure. It is never going to be like Silverstone [in terms of history and purity]. But maybe over time the people in the community here will grow to love the sport.`;

