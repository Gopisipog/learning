import OpenAI from 'openai';
import { env } from './config';

export const openai = new OpenAI({ apiKey: env.openAiKey });

export const embedText = async (text: string): Promise<number[]> => {
  const response = await openai.embeddings.create({
    input: text,
    model: env.embeddingModel
  });

  const vector = response.data?.[0]?.embedding;
  if (!vector) {
    throw new Error('OpenAI returned an empty embedding response.');
  }
  return vector;
};
