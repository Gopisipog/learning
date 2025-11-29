import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { env } from './config';
import { embedText } from './openaiClient';
import { pineconeIndex } from './pineconeClient';
import type { IngestRequestBody, QueryRequestBody } from './types';

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const parseMetadata = (value?: string): Record<string, unknown> | undefined => {
  if (!value) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, unknown>;
    }
  } catch (error) {
    throw new Error('Metadata must be a valid JSON object.');
  }
  return undefined;
};

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', collection: env.defaultCollection });
});

app.post(
  '/api/ingest',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as IngestRequestBody & { metadata?: string };
      const metadataJson = parseMetadata(body.metadata);
      const collection = body.collection ?? env.defaultCollection;

      const rawText = (() => {
        if (body.text && body.text.trim().length > 0) {
          return body.text.trim();
        }
        if (req.file) {
          return req.file.buffer.toString('utf-8');
        }
        return '';
      })();

      if (!rawText) {
        res.status(400).json({ error: 'Provide text in the body or upload a UTF-8 file.' });
        return;
      }

      const vector = await embedText(rawText);

      const sanitizedMetadata = metadataJson
        ? Object.entries(metadataJson).reduce<Record<string, string | number | boolean>>(
            (acc, [key, value]) => {
              if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                acc[key] = value;
              } else if (value != null) {
                acc[key] = JSON.stringify(value);
              }
              return acc;
            },
            {}
          )
        : {};

      const payload = {
        ...sanitizedMetadata,
        collection,
        source: String(req.file?.originalname ?? sanitizedMetadata.source ?? 'uploaded-text'),
        size: rawText.length,
        ingestedAt: new Date().toISOString()
      } satisfies Record<string, string | number | boolean>;

      const pointId = uuid();

      const targetIndex = env.defaultNamespace
        ? pineconeIndex.namespace(env.defaultNamespace)
        : pineconeIndex;

      await targetIndex.upsert([
        {
          id: pointId,
          values: vector,
          metadata: payload
        }
      ]);

      res.status(201).json({ pointId, collection });
    } catch (error) {
      next(error);
    }
  }
);

app.post('/api/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as QueryRequestBody;
    if (!body.query || body.query.trim().length === 0) {
      res.status(400).json({ error: 'Query text is required.' });
      return;
    }

    const collection = body.collection ?? env.defaultCollection;
    const limit = Math.min(Math.max(body.limit ?? 5, 1), 20);

    const vector = await embedText(body.query);
    const targetIndex = env.defaultNamespace
      ? pineconeIndex.namespace(env.defaultNamespace)
      : pineconeIndex;

    const results = await targetIndex.query({
      vector,
      topK: limit,
      includeMetadata: true,
      filter: {
        collection: { $eq: collection }
      }
    });

    const matches = (results.matches || []).map((match) => ({
      id: match.id ?? '',
      score: match.score ?? 0,
      payload: match.metadata as Record<string, unknown> | undefined
    }));

    res.json({ matches });
  } catch (error) {
    next(error);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal server error.' });
});

app.listen(env.port, () => {
  console.log(`Qdrant API server running on http://localhost:${env.port}`);
});
