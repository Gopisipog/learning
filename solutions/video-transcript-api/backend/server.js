import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import ffmpeg from 'fluent-ffmpeg';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Create directories for uploads and chunks
const uploadsDir = path.join(__dirname, 'uploads');
const chunksDir = path.join(__dirname, 'chunks');
fs.mkdirSync(uploadsDir, { recursive: true });
fs.mkdirSync(chunksDir, { recursive: true });

// Configure multer for large file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: (process.env.MAX_FILE_SIZE_MB || 2048) * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());

// Store job status
const jobStatus = new Map();

// Helper: Get audio duration
const getAudioDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration);
    });
  });
};

// Helper: Extract audio from video
const extractAudio = (videoPath, audioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('64k')
      .audioChannels(1)
      .audioFrequency(16000)
      .output(audioPath)
      .on('end', () => resolve(audioPath))
      .on('error', reject)
      .run();
  });
};

// Helper: Split audio into chunks
const splitAudio = (audioPath, chunkDir, chunkDurationMinutes) => {
  return new Promise(async (resolve, reject) => {
    const duration = await getAudioDuration(audioPath);
    const chunkDurationSec = chunkDurationMinutes * 60;
    const numChunks = Math.ceil(duration / chunkDurationSec);
    const chunks = [];

    for (let i = 0; i < numChunks; i++) {
      const startTime = i * chunkDurationSec;
      const chunkPath = path.join(chunkDir, `chunk_${i}.mp3`);
      chunks.push({ path: chunkPath, startTime });
    }

    // Process chunks sequentially
    const processChunk = async (index) => {
      if (index >= chunks.length) {
        resolve(chunks);
        return;
      }
      const { path: chunkPath, startTime } = chunks[index];
      await new Promise((res, rej) => {
        ffmpeg(audioPath)
          .setStartTime(startTime)
          .setDuration(chunkDurationSec)
          .output(chunkPath)
          .on('end', res)
          .on('error', rej)
          .run();
      });
      await processChunk(index + 1);
    };

    try {
      await processChunk(0);
    } catch (err) {
      reject(err);
    }
  });
};

// Helper: Transcribe single chunk
const transcribeChunk = async (chunkPath, language = 'en') => {
  const file = fs.createReadStream(chunkPath);
  const response = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language,
    response_format: 'verbose_json',
    timestamp_granularities: ['segment']
  });
  return response;
};

// Cleanup function
const cleanup = (...paths) => {
  paths.forEach(p => {
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        fs.rmSync(p, { recursive: true, force: true });
      } else {
        fs.unlinkSync(p);
      }
    }
  });
};

// GET: Check job status
app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const status = jobStatus.get(jobId);
  if (!status) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(status);
});

// POST: Start transcription
app.post('/api/transcribe', upload.single('video'), async (req, res) => {
  const jobId = Date.now().toString();
  const language = req.body.language || 'en';
  const chunkDurationMinutes = parseInt(process.env.CHUNK_DURATION_MINUTES) || 10;

  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  const videoPath = req.file.path;
  const audioPath = path.join(uploadsDir, `${jobId}_audio.mp3`);
  const jobChunkDir = path.join(chunksDir, jobId);
  fs.mkdirSync(jobChunkDir, { recursive: true });

  // Initialize job status
  jobStatus.set(jobId, {
    status: 'processing',
    stage: 'uploaded',
    progress: 0,
    message: 'File uploaded, starting processing...',
    transcript: null
  });

  // Return job ID immediately
  res.json({ jobId, message: 'Transcription started' });

  // Process asynchronously
  try {
    // Stage 1: Extract audio
    jobStatus.set(jobId, {
      ...jobStatus.get(jobId),
      stage: 'extracting',
      progress: 10,
      message: 'Extracting audio from video...'
    });
    await extractAudio(videoPath, audioPath);

    // Stage 2: Split into chunks
    jobStatus.set(jobId, {
      ...jobStatus.get(jobId),
      stage: 'splitting',
      progress: 20,
      message: 'Splitting audio into chunks...'
    });
    const chunks = await splitAudio(audioPath, jobChunkDir, chunkDurationMinutes);

    // Stage 3: Transcribe each chunk
    const transcripts = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const progress = 20 + Math.round((i / chunks.length) * 70);
      jobStatus.set(jobId, {
        ...jobStatus.get(jobId),
        stage: 'transcribing',
        progress,
        message: `Transcribing chunk ${i + 1} of ${chunks.length}...`,
        currentChunk: i + 1,
        totalChunks: chunks.length
      });

      const result = await transcribeChunk(chunk.path, language);

      // Adjust timestamps based on chunk start time
      const adjustedSegments = (result.segments || []).map(seg => ({
        ...seg,
        start: seg.start + chunk.startTime,
        end: seg.end + chunk.startTime
      }));

      transcripts.push({
        chunkIndex: i,
        text: result.text,
        segments: adjustedSegments,
        startTime: chunk.startTime
      });
    }

    // Stage 4: Merge transcripts
    jobStatus.set(jobId, {
      ...jobStatus.get(jobId),
      stage: 'merging',
      progress: 95,
      message: 'Merging transcripts...'
    });

    const fullText = transcripts.map(t => t.text).join(' ');
    const allSegments = transcripts.flatMap(t => t.segments);

    // Complete
    jobStatus.set(jobId, {
      status: 'completed',
      stage: 'complete',
      progress: 100,
      message: 'Transcription complete!',
      transcript: {
        text: fullText,
        segments: allSegments,
        duration: chunks[chunks.length - 1]?.startTime + (chunkDurationMinutes * 60) || 0,
        language
      }
    });

    // Cleanup
    cleanup(videoPath, audioPath, jobChunkDir);

  } catch (error) {
    console.error('Transcription error:', error);
    jobStatus.set(jobId, {
      status: 'failed',
      stage: 'error',
      progress: 0,
      message: error.message || 'Transcription failed',
      transcript: null
    });
    cleanup(videoPath, audioPath, jobChunkDir);
  }
});

// GET: Download transcript
app.get('/api/transcript/:jobId', (req, res) => {
  const { jobId } = req.params;
  const { format } = req.query;
  const status = jobStatus.get(jobId);

  if (!status || status.status !== 'completed') {
    return res.status(404).json({ error: 'Transcript not ready' });
  }

  const { transcript } = status;

  if (format === 'srt') {
    const srt = transcript.segments.map((seg, i) => {
      const startTime = formatSRTTime(seg.start);
      const endTime = formatSRTTime(seg.end);
      return `${i + 1}\n${startTime} --> ${endTime}\n${seg.text}\n`;
    }).join('\n');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="transcript_${jobId}.srt"`);
    return res.send(srt);
  }

  if (format === 'txt') {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="transcript_${jobId}.txt"`);
    return res.send(transcript.text);
  }

  res.json(transcript);
});

// Helper: Format time for SRT
function formatSRTTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
}

app.listen(PORT, () => {
  console.log(`🚀 Video Transcript API running on http://localhost:${PORT}`);
});

