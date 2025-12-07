// Checkpoint management for resumable summarization

export interface Checkpoint {
  id: string;
  textHash: string;
  detail: number;
  summarizeRecursively: boolean;
  additionalInstructions: string;
  totalChunks: number;
  completedChunks: number;
  summaries: string[];
  chunks: string[];
  createdAt: number;
  updatedAt: number;
}

const CHECKPOINT_KEY = "summarizer_checkpoint";

// Simple hash function for text identification
export function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < Math.min(text.length, 10000); i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${hash}_${text.length}`;
}

export function saveCheckpoint(checkpoint: Checkpoint): void {
  try {
    localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(checkpoint));
  } catch (e) {
    console.error("Failed to save checkpoint:", e);
  }
}

export function loadCheckpoint(): Checkpoint | null {
  try {
    const data = localStorage.getItem(CHECKPOINT_KEY);
    if (data) {
      return JSON.parse(data) as Checkpoint;
    }
  } catch (e) {
    console.error("Failed to load checkpoint:", e);
  }
  return null;
}

export function clearCheckpoint(): void {
  localStorage.removeItem(CHECKPOINT_KEY);
}

export function createCheckpoint(
  text: string,
  chunks: string[],
  detail: number,
  summarizeRecursively: boolean,
  additionalInstructions: string
): Checkpoint {
  return {
    id: crypto.randomUUID(),
    textHash: hashText(text),
    detail,
    summarizeRecursively,
    additionalInstructions,
    totalChunks: chunks.length,
    completedChunks: 0,
    summaries: [],
    chunks,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function updateCheckpoint(
  checkpoint: Checkpoint,
  chunkIndex: number,
  summary: string
): Checkpoint {
  const updated = {
    ...checkpoint,
    completedChunks: chunkIndex + 1,
    summaries: [...checkpoint.summaries, summary],
    updatedAt: Date.now(),
  };
  saveCheckpoint(updated);
  return updated;
}

export function canResume(
  checkpoint: Checkpoint | null,
  text: string,
  detail: number,
  summarizeRecursively: boolean
): boolean {
  if (!checkpoint) return false;
  
  const textHash = hashText(text);
  return (
    checkpoint.textHash === textHash &&
    checkpoint.detail === detail &&
    checkpoint.summarizeRecursively === summarizeRecursively &&
    checkpoint.completedChunks < checkpoint.totalChunks
  );
}

// Download summaries as a text file
export function downloadSummaries(summaries: string[], filename: string = "summaries.txt"): void {
  const content = summaries.join("\n\n---\n\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

