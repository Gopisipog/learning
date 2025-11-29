import { useCallback, useMemo, useState } from 'react';
import { ingestDocument, queryDocument } from './api';
import type { QueryMatch } from './types';

const defaultCollection = 'documents';

const containerStyle: React.CSSProperties = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '2rem 1.5rem',
  fontFamily: 'Inter, system-ui, sans-serif',
  color: '#0f172a'
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 20px 45px -24px rgba(15, 23, 42, 0.45)',
  padding: '1.8rem',
  marginBottom: '1.5rem',
  border: '1px solid rgba(148, 163, 184, 0.2)'
};

const headingStyle: React.CSSProperties = {
  marginBottom: '0.75rem',
  fontSize: '1.35rem',
  fontWeight: 650
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.45rem',
  fontWeight: 600,
  fontSize: '0.9rem'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #94a3b8',
  fontSize: '0.95rem',
  marginBottom: '0.8rem',
  outline: 'none'
};

const textAreaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: '160px',
  resize: 'vertical'
};

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  border: 'none',
  padding: '0.75rem 1.4rem',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.95rem'
};

const mutedStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: '0.85rem',
  marginBottom: '1rem'
};

const resultCardStyle: React.CSSProperties = {
  borderRadius: '8px',
  border: '1px solid rgba(148, 163, 184, 0.4)',
  padding: '1rem',
  marginBottom: '0.75rem',
  backgroundColor: '#f8fafc'
};

const errorStyle: React.CSSProperties = {
  color: '#b91c1c',
  backgroundColor: '#fee2e2',
  border: '1px solid #fecaca',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  marginBottom: '1rem'
};

const successStyle: React.CSSProperties = {
  color: '#065f46',
  backgroundColor: '#d1fae5',
  border: '1px solid #a7f3d0',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  marginTop: '1rem'
};

const App = () => {
  const [collection, setCollection] = useState(defaultCollection);
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File | undefined>();
  const [metadata, setMetadata] = useState('{}');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(5);
  const [matches, setMatches] = useState<QueryMatch[]>([]);
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingIngest, setLoadingIngest] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState(false);

  const parsedMetadata = useMemo(() => {
    try {
      return metadata ? JSON.parse(metadata) : undefined;
    } catch {
      return undefined;
    }
  }, [metadata]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = event.target.files?.[0];
    setFile(uploaded ?? undefined);
  };

  const handleIngest = useCallback(async () => {
    setError(null);
    setIngestStatus(null);

    if (!textInput && !file) {
      setError('Add document text or select a file before ingesting.');
      return;
    }

    if (!parsedMetadata && metadata.trim().length > 0) {
      setError('Metadata must be valid JSON if provided.');
      return;
    }

    try {
      setLoadingIngest(true);
      const response = await ingestDocument({
        file,
        text: textInput,
        metadata: parsedMetadata,
        collection
      });
      setIngestStatus(`Point ${response.pointId} stored in ${response.collection}.`);
    } catch (ingestError) {
      if (ingestError instanceof Error) {
        setError(ingestError.message);
      } else {
        setError('Failed to ingest document.');
      }
    } finally {
      setLoadingIngest(false);
    }
  }, [collection, file, metadata, parsedMetadata, textInput]);

  const handleQuery = useCallback(async () => {
    setError(null);
    setMatches([]);

    if (!query.trim()) {
      setError('Enter a semantic query first.');
      return;
    }

    try {
      setLoadingQuery(true);
      const response = await queryDocument(collection, query, limit);
      setMatches(response.matches ?? []);
    } catch (queryError) {
      if (queryError instanceof Error) {
        setError(queryError.message);
      } else {
        setError('Failed to query collection.');
      }
    } finally {
      setLoadingQuery(false);
    }
  }, [collection, limit, query]);

  return (
    <div style={containerStyle}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Qdrant Document Console</h1>
        <p style={{ ...mutedStyle, marginBottom: 0 }}>
          Upload raw text or a file, store embeddings in Qdrant, and explore the vector search results from the browser.
        </p>
      </header>

      {error ? <div style={errorStyle}>{error}</div> : null}

      <section style={cardStyle}>
        <h2 style={headingStyle}>1. Ingest Document</h2>
        <p style={mutedStyle}>Provide the collection name and either paste text or upload a UTF-8 file. Metadata is optional JSON.</p>
        <label style={labelStyle} htmlFor="collection">Collection</label>
        <input
          id="collection"
          style={inputStyle}
          value={collection}
          onChange={(event) => setCollection(event.target.value)}
          placeholder="documents"
        />

        <label style={labelStyle} htmlFor="text">Raw Text (optional)</label>
        <textarea
          id="text"
          style={textAreaStyle}
          placeholder="Paste text or leave blank if uploading a file..."
          value={textInput}
          onChange={(event) => setTextInput(event.target.value)}
        />

        <label style={labelStyle} htmlFor="file">Upload File (optional)</label>
        <input id="file" type="file" accept=".txt,.md,.json" onChange={handleFileChange} style={{ marginBottom: '1rem' }} />

        <label style={labelStyle} htmlFor="metadata">Metadata JSON (optional)</label>
        <textarea
          id="metadata"
          style={{ ...textAreaStyle, minHeight: '100px' }}
          placeholder='{"source": "MyFile.pdf", "topic": "research"}'
          value={metadata}
          onChange={(event) => setMetadata(event.target.value)}
        />

        <button type="button" onClick={handleIngest} style={buttonStyle} disabled={loadingIngest}>
          {loadingIngest ? 'Ingesting…' : 'Ingest Document'}
        </button>

        {ingestStatus ? <div style={successStyle}>{ingestStatus}</div> : null}
      </section>

      <section style={cardStyle}>
        <h2 style={headingStyle}>2. Semantic Search</h2>
        <p style={mutedStyle}>Enter a natural-language query to retrieve the most relevant stored vectors.</p>

        <label style={labelStyle} htmlFor="query">Query</label>
        <textarea
          id="query"
          style={textAreaStyle}
          placeholder="Summaries about product launch timeline"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <label style={labelStyle} htmlFor="limit">Result Limit</label>
        <input
          id="limit"
          type="number"
          min={1}
          max={20}
          style={inputStyle}
          value={limit}
          onChange={(event) => setLimit(Number(event.target.value) || 1)}
        />

        <button type="button" onClick={handleQuery} style={buttonStyle} disabled={loadingQuery}>
          {loadingQuery ? 'Searching…' : 'Run Search'}
        </button>

        {matches.length > 0 ? (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Top Matches</h3>
            {matches.map((match) => (
              <div key={match.id} style={resultCardStyle}>
                <div style={{ fontWeight: 600 }}>Score: {match.score.toFixed(4)}</div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>ID: {String(match.id)}</div>
                {match.payload ? (
                  <pre style={{ marginTop: '0.6rem', whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace', fontSize: '0.85rem' }}>
                    {JSON.stringify(match.payload, null, 2)}
                  </pre>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default App;
