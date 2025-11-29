import { useState, useCallback } from "react";
import { summarize, getEstimatedChunks } from "./services/summarizer";
import "./App.css";

function App() {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("openai_api_key") || ""
  );
  const [inputText, setInputText] = useState("");
  const [detail, setDetail] = useState(0.1);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [summarizeRecursively, setSummarizeRecursively] = useState(false);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState("");

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem("openai_api_key", key);
  };

  const estimatedChunks = inputText
    ? getEstimatedChunks(inputText, detail)
    : 0;

  const handleSummarize = useCallback(async () => {
    if (!apiKey) {
      setError("Please enter your OpenAI API key");
      return;
    }
    if (!inputText) {
      setError("Please enter some text to summarize");
      return;
    }

    setIsLoading(true);
    setError("");
    setSummary("");
    setProgress({ current: 0, total: 0 });

    try {
      const result = await summarize(apiKey, {
        text: inputText,
        detail,
        additionalInstructions,
        summarizeRecursively,
        onProgress: (current, total) => setProgress({ current, total }),
      });
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, inputText, detail, additionalInstructions, summarizeRecursively]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📄 Document Summarizer</h1>
        <p className="subtitle">
          Summarize long documents with controllable detail level
        </p>
      </header>

      <div className="config-section">
        <div className="form-group">
          <label htmlFor="api-key">OpenAI API Key</label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="sk-..."
            className="api-key-input"
          />
        </div>
      </div>

      <div className="main-content">
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="input-text">
              Text to Summarize
              {inputText && (
                <span className="char-count">
                  (~{Math.ceil(inputText.length / 4)} tokens)
                </span>
              )}
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your long document here..."
              className="text-input"
              rows={12}
            />
          </div>

          <div className="controls">
            <div className="form-group slider-group">
              <label htmlFor="detail-slider">
                Detail Level: {(detail * 100).toFixed(0)}%
                {inputText && (
                  <span className="chunk-info">
                    ({estimatedChunks} chunk{estimatedChunks !== 1 ? "s" : ""})
                  </span>
                )}
              </label>
              <input
                id="detail-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={detail}
                onChange={(e) => setDetail(parseFloat(e.target.value))}
                className="detail-slider"
              />
              <div className="slider-labels">
                <span>Concise</span>
                <span>Detailed</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="instructions">
                Additional Instructions (optional)
              </label>
              <input
                id="instructions"
                type="text"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="e.g., Focus on key dates and numbers"
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={summarizeRecursively}
                  onChange={(e) => setSummarizeRecursively(e.target.checked)}
                />
                <span>Recursive summarization (more coherent, slower)</span>
              </label>
            </div>

            <button
              onClick={handleSummarize}
              disabled={isLoading || !apiKey || !inputText}
              className="summarize-btn"
            >
              {isLoading
                ? `Summarizing... (${progress.current}/${progress.total})`
                : "Summarize"}
            </button>

            {error && <div className="error-message">{error}</div>}
          </div>
        </div>

        <div className="output-section">
          <div className="form-group">
            <label>
              Summary
              {summary && (
                <span className="char-count">
                  (~{Math.ceil(summary.length / 4)} tokens)
                </span>
              )}
            </label>
            <div className="summary-output">
              {summary || (
                <span className="placeholder-text">
                  Your summary will appear here...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
