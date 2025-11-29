import { Pinecone } from '@pinecone-database/pinecone';
import { env } from './config';

const pinecone = new Pinecone({ apiKey: env.pineconeApiKey });

// Pinecone SDK currently reads environment/project from process.env.
// Ensure the runtime has it set so API calls route correctly.
if (!process.env.PINECONE_ENVIRONMENT) {
	process.env.PINECONE_ENVIRONMENT = env.pineconeEnvironment;
}

export const pineconeIndex = pinecone.index(env.pineconeIndex);
