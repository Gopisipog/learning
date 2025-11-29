
# Pinecone Upload Console

React + Express reference implementation for uploading documents, generating embeddings with OpenAI, and interacting with a Pinecone index. The client lets you ingest plain text or small files and run semantic searches against vectors stored in Pinecone.

## Prerequisites

- Node.js 18+
- OpenAI API key with access to `text-embedding-3-small`
- Pinecone account with an index sized for the OpenAI embedding dimension (e.g. 1536 for `text-embedding-3-small`)

## Project Structure

```
qdrant-app/
├── client/    # React UI (Vite)
└── server/    # Express API using @pinecone-database/pinecone
```

## Environment Variables

Create `qdrant-app/server/.env` with:

```
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX=documents
PINECONE_NAMESPACE=
PINECONE_ENVIRONMENT=gcp-starter
DEFAULT_COLLECTION=documents
EMBEDDING_MODEL=text-embedding-3-small
PORT=4000
```

## Getting Started

Install dependencies and start the API:

```powershell
cd qdrant-app\server
npm install
npm run dev
```

In another shell start the React client:

```powershell
cd qdrant-app\client
npm install
npm run dev
```

Visit http://localhost:5173 to ingest documents and run queries.

## Workflow

1. Select a collection and upload raw text or a UTF-8 text file (txt/md/json).
2. Optional metadata can be provided as JSON.
3. The server generates embeddings with OpenAI and upserts into Pinecone using `@pinecone-database/pinecone`.
4. Run semantic searches using OpenAI embeddings as the query vector; results render with metadata and similarity scores from Pinecone.
