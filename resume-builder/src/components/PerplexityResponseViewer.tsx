import { useState } from 'react'

// Lightweight viewer for full Perplexity chat completion JSON
// Lets you paste the raw API response, inspect usage/cost, and read the content.

type PerplexityUsage = {
  total_tokens?: number
  reasoning_tokens?: number
  cost?: {
    total_cost?: number
  }
}

type PerplexityChoice = {
  message?: {
    content?: string
  }
}

type PerplexityResponse = {
  model?: string
  usage?: PerplexityUsage
  choices?: PerplexityChoice[]
}

export function PerplexityResponseViewer() {
  const [raw, setRaw] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [parsed, setParsed] = useState<PerplexityResponse | null>(null)

  const handleParse = () => {
    if (!raw.trim()) {
      setParsed(null)
      setError(null)
      return
    }

    try {
      const obj = JSON.parse(raw) as PerplexityResponse
      setParsed(obj)
      setError(null)
    } catch (e) {
      console.error('Failed to parse Perplexity JSON', e)
      setParsed(null)
      setError('Could not parse JSON. Please make sure you pasted the full Perplexity response object.')
    }
  }

  const content = parsed?.choices?.[0]?.message?.content ?? ''

  return (
    <section className="ai-response-viewer">
      <h2>AI Response Viewer (Perplexity)</h2>
      <p className="help-text">
        Paste the full Perplexity API JSON response here (the object containing id, model, usage, choices, etc.)
        to inspect usage, cost, and the generated content.
      </p>
      <textarea
        rows={6}
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Paste Perplexity response JSON here"
      />
      <div className="ai-response-actions">
        <button type="button" onClick={handleParse}>
          Parse Response
        </button>
        {error && <span className="error-text">{error}</span>}
      </div>
      {parsed && (
        <div className="ai-response-details">
          <div className="ai-response-meta">
            <p>
              <strong>Model:</strong> {parsed.model ?? 'n/a'}
            </p>
            <p>
              <strong>Total tokens:</strong> {parsed.usage?.total_tokens ?? 'n/a'}
            </p>
            {parsed.usage?.reasoning_tokens !== undefined && (
              <p>
                <strong>Reasoning tokens:</strong> {parsed.usage.reasoning_tokens}
              </p>
            )}
            {parsed.usage?.cost?.total_cost !== undefined && (
              <p>
                <strong>Estimated cost:</strong> ${parsed.usage.cost.total_cost}
              </p>
            )}
          </div>
          {content && (
            <div className="ai-response-content-block">
              <h3>choices[0].message.content</h3>
              <pre className="ai-response-content">{content}</pre>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

