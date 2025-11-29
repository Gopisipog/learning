import { Pinecone } from '@pinecone-database/pinecone';
import { env } from './config';

const pinecone = new Pinecone({ apiKey: env.pineconeApiKey });

export const pineconeIndex = pinecone.index(env.pineconeIndex);
