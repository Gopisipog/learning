import { useState, useCallback, useEffect, useRef } from "react";
import { summarize, getEstimatedChunks, createChunks } from "./services/summarizer";
import type { Checkpoint } from "./services/checkpoint";
import {
  loadCheckpoint,
  saveCheckpoint,
  clearCheckpoint,
  createCheckpoint,
  updateCheckpoint,
  canResume,
  downloadSummaries,
} from "./services/checkpoint";
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
  const [checkpoint, setCheckpoint] = useState<Checkpoint | null>(null);
  const [partialSummaries, setPartialSummaries] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load checkpoint on mount
  useEffect(() => {
    const saved = loadCheckpoint();
    if (saved) {
      setCheckpoint(saved);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    setApiKey(key);
    localStorage.setItem("openai_api_key", key);
  };

  const estimatedChunks = inputText
    ? getEstimatedChunks(inputText, detail)
    : 0;

  const hasResumableCheckpoint =
    checkpoint && inputText && canResume(checkpoint, inputText, detail, summarizeRecursively);

  const handleSummarize = useCallback(
    async (resumeFromCheckpoint = false) => {
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

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      let startChunk = 0;
      let existingSummaries: string[] = [];
      let currentCheckpoint: Checkpoint | null = null;

      if (resumeFromCheckpoint && checkpoint) {
        startChunk = checkpoint.completedChunks;
        existingSummaries = checkpoint.summaries;
        currentCheckpoint = checkpoint;
        setPartialSummaries(existingSummaries);
        setSummary(existingSummaries.join("\n\n"));
      } else {
        setSummary("");
        setPartialSummaries([]);
        // Create new checkpoint
        const chunks = createChunks(inputText, detail);
        currentCheckpoint = createCheckpoint(
          inputText,
          chunks,
          detail,
          summarizeRecursively,
          additionalInstructions
        );
        saveCheckpoint(currentCheckpoint);
        setCheckpoint(currentCheckpoint);
      }

      setProgress({ current: startChunk, total: currentCheckpoint?.totalChunks || 0 });

      try {
        const result = await summarize(apiKey, {
          text: inputText,
          detail,
          additionalInstructions,
          summarizeRecursively,
          startFromChunk: startChunk,
          existingSummaries,
          abortSignal: abortControllerRef.current.signal,
          onProgress: (current, total) => setProgress({ current, total }),
          onChunkComplete: (chunkIndex, chunkSummary, allSummaries) => {
            // Update checkpoint after each chunk
            if (currentCheckpoint) {
              currentCheckpoint = updateCheckpoint(currentCheckpoint, chunkIndex, chunkSummary);
              setCheckpoint(currentCheckpoint);
            }
            setPartialSummaries([...allSummaries]);
            setSummary(allSummaries.join("\n\n"));
          },
        });
        setSummary(result);
        // Clear checkpoint on success
        clearCheckpoint();
        setCheckpoint(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        if (message !== "Summarization cancelled") {
          setError(message + " - Progress saved. You can resume from checkpoint.");
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [apiKey, inputText, detail, additionalInstructions, summarizeRecursively, checkpoint]
  );

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const handleClearCheckpoint = useCallback(() => {
    clearCheckpoint();
    setCheckpoint(null);
    setPartialSummaries([]);
  }, []);

  const handleDownload = useCallback(() => {
    const summariesToDownload = partialSummaries.length > 0 ? partialSummaries : summary.split("\n\n");
    if (summariesToDownload.length > 0 && summariesToDownload[0]) {
      downloadSummaries(summariesToDownload, `summary_${Date.now()}.txt`);
    }
  }, [partialSummaries, summary]);

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

            <div className="button-row">
              {!isLoading ? (
                <>
                  <button
                    onClick={() => handleSummarize(false)}
                    disabled={!apiKey || !inputText}
                    className="summarize-btn"
                  >
                    {hasResumableCheckpoint ? "Start Fresh" : "Summarize"}
                  </button>
                  {hasResumableCheckpoint && (
                    <button
                      onClick={() => handleSummarize(true)}
                      disabled={!apiKey || !inputText}
                      className="summarize-btn resume-btn"
                    >
                      Resume ({checkpoint?.completedChunks}/{checkpoint?.totalChunks})
                    </button>
                  )}
                </>
              ) : (
                <button onClick={handleCancel} className="summarize-btn cancel-btn">
                  Cancel ({progress.current}/{progress.total})
                </button>
              )}
            </div>

            {hasResumableCheckpoint && !isLoading && (
              <div className="checkpoint-info">
                <span>
                  📌 Checkpoint available: {checkpoint?.completedChunks} of{" "}
                  {checkpoint?.totalChunks} chunks completed
                </span>
                <button onClick={handleClearCheckpoint} className="clear-checkpoint-btn">
                  Clear
                </button>
              </div>
            )}

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
              {(summary || partialSummaries.length > 0) && (
                <button onClick={handleDownload} className="download-btn">
                  ⬇ Download
                </button>
              )}
            </label>
            <div className="summary-output">
              {summary || (
                <span className="placeholder-text">
                  Your summary will appear here...
                </span>
              )}
            </div>
            {partialSummaries.length > 0 && (
              <div className="chunk-progress">
                {partialSummaries.length} chunk summaries completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
