import OpenAI from "openai";

// Delay helper for rate limiting
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry with exponential backoff for rate limit errors
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error as Error;
      const errorMessage = (error as Error).message || "";

      // Check if it's a rate limit error
      if (errorMessage.includes("Rate limit") || errorMessage.includes("429")) {
        const waitTime = baseDelay * Math.pow(2, attempt);
        console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
        await delay(waitTime);
      } else {
        throw error; // Not a rate limit error, don't retry
      }
    }
  }
  throw lastError;
}

function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Combine chunks without exceeding max tokens
function combineChunksWithNoMinimum(
  chunks: string[],
  maxTokens: number,
  chunkDelimiter: string = "\n\n",
  header: string | null = null,
  addEllipsisForOverflow: boolean = false
): { combined: string[]; droppedCount: number } {
  let droppedCount = 0;
  const output: string[] = [];
  let candidate: string[] = header ? [header] : [];

  for (const chunk of chunks) {
    const chunkWithHeader = header ? [header, chunk] : [chunk];
    if (countTokens(chunkWithHeader.join(chunkDelimiter)) > maxTokens) {
      if (
        addEllipsisForOverflow &&
        countTokens([...candidate, "..."].join(chunkDelimiter)) <= maxTokens
      ) {
        candidate.push("...");
        droppedCount++;
      }
      continue;
    }

    const extended = [...candidate, chunk];
    if (countTokens(extended.join(chunkDelimiter)) > maxTokens) {
      output.push(candidate.join(chunkDelimiter));
      candidate = header ? [header, chunk] : [chunk];
    } else {
      candidate = extended;
    }
  }

  if (candidate.length > (header ? 1 : 0)) {
    output.push(candidate.join(chunkDelimiter));
  }

  return { combined: output, droppedCount };
}

// Chunk text on a delimiter with max token limit
function chunkOnDelimiter(
  inputString: string,
  maxTokens: number,
  delimiter: string
): string[] {
  const chunks = inputString.split(delimiter);
  const { combined, droppedCount } = combineChunksWithNoMinimum(
    chunks,
    maxTokens,
    delimiter,
    null,
    true
  );
  if (droppedCount > 0) {
    console.warn(`${droppedCount} chunks were dropped due to overflow`);
  }
  return combined.map((chunk) => `${chunk}${delimiter}`);
}

export interface SummarizeOptions {
  text: string;
  detail: number; // 0 to 1
  model?: string;
  additionalInstructions?: string;
  minimumChunkSize?: number;
  chunkDelimiter?: string;
  summarizeRecursively?: boolean;
  onProgress?: (current: number, total: number, summary?: string) => void;
  onChunkComplete?: (chunkIndex: number, summary: string, allSummaries: string[]) => void;
  startFromChunk?: number;
  existingSummaries?: string[];
  abortSignal?: AbortSignal;
}

// Maximum tokens to send in a single request (leaving room for response)
const MAX_CONTEXT_TOKENS = 100000;
const MAX_RECURSIVE_CONTEXT = 10000; // Limit accumulated summaries

// Export chunk creation for checkpoint usage
export function createChunks(
  text: string,
  detail: number,
  minimumChunkSize: number = 500,
  chunkDelimiter: string = ".\n"
): string[] {
  const clampedDetail = Math.max(0, Math.min(1, detail));
  const safeChunkSize = Math.min(minimumChunkSize, MAX_CONTEXT_TOKENS);
  const maxChunks = Math.ceil(countTokens(text) / safeChunkSize);
  const minChunks = 1;
  const numChunks = Math.max(
    minChunks,
    Math.round(minChunks + clampedDetail * (maxChunks - minChunks))
  );
  const documentLength = countTokens(text);
  const targetChunkSize = Math.ceil(documentLength / numChunks);
  const chunkSize = Math.min(targetChunkSize, MAX_CONTEXT_TOKENS);
  return chunkOnDelimiter(text, chunkSize, chunkDelimiter);
}

export async function summarize(
  apiKey: string,
  options: SummarizeOptions
): Promise<string> {
  const {
    text,
    detail = 0,
    model = "gpt-4o-mini",
    additionalInstructions = "",
    minimumChunkSize = 500,
    chunkDelimiter = ".\n",
    summarizeRecursively = false,
    onProgress,
    onChunkComplete,
    startFromChunk = 0,
    existingSummaries = [],
    abortSignal,
  } = options;

  // Split into chunks
  const textChunks = createChunks(text, detail, minimumChunkSize, chunkDelimiter);

  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const systemPrompt =
    "Rewrite this text in summarized form." +
    (additionalInstructions ? ` ${additionalInstructions}` : "");

  // Summarize chunks with rate limiting
  const summaries: string[] = [...existingSummaries];
  let accumulatedSummaries: string[] = [...existingSummaries];
  const delayBetweenCalls = 500; // 500ms delay between API calls

  for (let i = startFromChunk; i < textChunks.length; i++) {
    // Check for abort signal
    if (abortSignal?.aborted) {
      throw new Error("Summarization cancelled");
    }

    const chunk = textChunks[i];
    onProgress?.(i + 1, textChunks.length);

    let contentToSummarize = chunk;

    // Truncate chunk if it's too large
    if (countTokens(chunk) > MAX_CONTEXT_TOKENS) {
      const truncatedLength = MAX_CONTEXT_TOKENS * 4; // Approximate chars
      contentToSummarize = chunk.slice(0, truncatedLength) + "\n\n[Content truncated due to length...]";
    }

    if (summarizeRecursively && accumulatedSummaries.length > 0) {
      // Limit accumulated context to avoid exceeding token limits
      let accumulatedText = accumulatedSummaries.join("\n\n");
      if (countTokens(accumulatedText) > MAX_RECURSIVE_CONTEXT) {
        // Keep only the most recent summaries that fit
        const recentSummaries: string[] = [];
        let tokenCount = 0;
        for (let j = accumulatedSummaries.length - 1; j >= 0; j--) {
          const summaryTokens = countTokens(accumulatedSummaries[j]);
          if (tokenCount + summaryTokens > MAX_RECURSIVE_CONTEXT) break;
          recentSummaries.unshift(accumulatedSummaries[j]);
          tokenCount += summaryTokens;
        }
        accumulatedText = recentSummaries.join("\n\n");
      }
      contentToSummarize = `Previous summaries:\n\n${accumulatedText}\n\nNew content to summarize:\n\n${contentToSummarize}`;
    }

    // Use retry with backoff for rate limit handling
    const response = await retryWithBackoff(async () => {
      if (abortSignal?.aborted) {
        throw new Error("Summarization cancelled");
      }
      return await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: contentToSummarize },
        ],
        temperature: 0,
      });
    });

    const summary = response.choices[0]?.message?.content || "";
    summaries.push(summary);
    accumulatedSummaries.push(summary);

    // Notify about completed chunk for checkpointing
    onChunkComplete?.(i, summary, summaries);

    // Add delay between calls to avoid rate limiting
    if (i < textChunks.length - 1) {
      await delay(delayBetweenCalls);
    }
  }

  return summaries.join("\n\n");
}

export function getEstimatedChunks(
  text: string,
  detail: number,
  minimumChunkSize: number = 500
): number {
  const clampedDetail = Math.max(0, Math.min(1, detail));
  const maxChunks = Math.ceil(countTokens(text) / minimumChunkSize);
  const minChunks = 1;
  return Math.round(minChunks + clampedDetail * (maxChunks - minChunks));
}

