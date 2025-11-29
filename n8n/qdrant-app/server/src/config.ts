import { config as loadEnv } from 'dotenv';

loadEnv();

const required = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
};

export const env = {
  openAiKey: required(process.env.OPENAI_API_KEY, 'OPENAI_API_KEY'),
  pineconeApiKey: required(process.env.PINECONE_API_KEY, 'PINECONE_API_KEY'),
  pineconeIndex: required(process.env.PINECONE_INDEX, 'PINECONE_INDEX'),
  pineconeEnvironment: required(process.env.PINECONE_ENVIRONMENT, 'PINECONE_ENVIRONMENT'),
  defaultNamespace: process.env.PINECONE_NAMESPACE?.trim() || undefined,
  defaultCollection: process.env.DEFAULT_COLLECTION?.trim() || 'documents',
  embeddingModel: process.env.EMBEDDING_MODEL?.trim() || 'text-embedding-3-small',
  port: Number(process.env.PORT ?? 4000)
};
