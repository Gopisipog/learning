import OpenAI from "openai";

// Simple tokenizer approximation (GPT-4 uses ~4 chars per token on average)
function tokenize(text: string): number[] {
  // Approximate tokenization by splitting into ~4 char chunks
  const tokens: number[] = [];
  for (let i = 0; i < text.length; i += 4) {
    tokens.push(i);
  }
  return tokens;
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
  onProgress?: (current: number, total: number) => void;
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
  } = options;

  // Clamp detail to [0, 1]
  const clampedDetail = Math.max(0, Math.min(1, detail));

  // Interpolate chunk count based on detail level
  const maxChunks = Math.ceil(countTokens(text) / minimumChunkSize);
  const minChunks = 1;
  const numChunks = Math.round(
    minChunks + clampedDetail * (maxChunks - minChunks)
  );

  // Calculate chunk size
  const documentLength = countTokens(text);
  const chunkSize = Math.ceil(documentLength / numChunks);

  // Split into chunks
  const textChunks = chunkOnDelimiter(text, chunkSize, chunkDelimiter);

  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const systemPrompt =
    "Rewrite this text in summarized form." +
    (additionalInstructions ? ` ${additionalInstructions}` : "");

  // Summarize chunks
  const summaries: string[] = [];
  let accumulatedSummaries: string[] = [];

  for (let i = 0; i < textChunks.length; i++) {
    const chunk = textChunks[i];
    onProgress?.(i + 1, textChunks.length);

    let contentToSummarize = chunk;
    if (summarizeRecursively && accumulatedSummaries.length > 0) {
      const accumulatedText = accumulatedSummaries.join("\n\n");
      contentToSummarize = `Previous summaries:\n\n${accumulatedText}\n\nNew content to summarize:\n\n${chunk}`;
    }

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: contentToSummarize },
      ],
      temperature: 0,
    });

    const summary = response.choices[0]?.message?.content || "";
    summaries.push(summary);
    accumulatedSummaries.push(summary);
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

