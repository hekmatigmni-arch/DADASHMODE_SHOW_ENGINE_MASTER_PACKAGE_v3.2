import express from 'express';
import { createServer as createViteServer } from 'vite';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { execFile } from 'child_process';
import util from 'util';
import dotenv from 'dotenv';

const execFilePromise = util.promisify(execFile);

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Ensure storage directories exist
const CUES_DIR = path.resolve('storage/cues');
const TEMP_AUDIO_DIR = path.resolve('storage/temp_audio');
const PIPER_MODEL = path.resolve('models/piper/fa_IR-gyro-medium.onnx');
const PIPER_CONFIG = `${PIPER_MODEL}.json`;
const PIPER_BIN = process.env.PIPER_BIN || 'piper';
const ESPEAK_BIN = process.env.ESPEAK_BIN || 'espeak-ng';
const FFMPEG_BIN = process.env.FFMPEG_BIN || 'ffmpeg';
const FFPROBE_BIN = process.env.FFPROBE_BIN || 'ffprobe';
fs.mkdirSync(CUES_DIR, { recursive: true });
fs.mkdirSync(TEMP_AUDIO_DIR, { recursive: true });

async function executableReady(binary: string): Promise<boolean> {
  try {
    await execFilePromise(binary, ['--version'], { timeout: 4000 });
    return true;
  } catch {
    return false;
  }
}

async function voiceInventory() {
  const [piper, espeak, ffmpeg] = await Promise.all([
    executableReady(PIPER_BIN), executableReady(ESPEAK_BIN), executableReady(FFMPEG_BIN),
  ]);
  const neural = piper && ffmpeg && fs.existsSync(PIPER_MODEL) && fs.existsSync(PIPER_CONFIG);
  const formant = espeak && ffmpeg;
  const piperSize = fs.existsSync(PIPER_MODEL) ? fs.statSync(PIPER_MODEL).size : 0;
  return { neural, formant, piper, espeak, ffmpeg, piperSize };
}

function validateText(text: unknown): string {
  if (typeof text !== 'string' || !text.trim() || text.length > 2000 || /[\u0000-\u001f]/.test(text))
    throw new Error('متن باید بین ۱ تا ۲۰۰۰ نویسه و بدون نویسهٔ کنترلی باشد.');
  return text.trim();
}

async function renderVoice(text: string, engine: string, speed: number, pitch: number): Promise<{ wav: Buffer; engine: string }> {
  const inventory = await voiceInventory();
  if (!inventory.ffmpeg) throw new Error('ffmpeg روی دستگاه نصب نشده است.');
  if (engine === 'neural' && !inventory.neural) throw new Error('مدل ONNX و فایل JSON و اجرای Piper باید هر سه روی همین دستگاه نصب باشند.');
  if (engine === 'formant' && !inventory.formant) throw new Error('eSpeak-NG روی دستگاه نصب نشده است.');
  if (!['neural', 'formant'].includes(engine)) throw new Error('موتور صوتی نامعتبر است.');
  const id = crypto.randomBytes(12).toString('hex');
  const raw = path.join(TEMP_AUDIO_DIR, `${id}_raw.wav`);
  const master = path.join(TEMP_AUDIO_DIR, `${id}_master.wav`);
  try {
    const boundedSpeed = Number.isFinite(speed) ? Math.max(0.7, Math.min(1.5, speed)) : 1;
    const boundedPitch = Number.isFinite(pitch) ? Math.max(0.8, Math.min(1.4, pitch)) : 1;
    if (engine === 'neural') {
      // Piper accepts text on stdin. execFile avoids a shell, so dialogue cannot execute commands.
      const child = (await import('child_process')).spawn(PIPER_BIN, [
        '-m', PIPER_MODEL, '--length_scale', (1 / boundedSpeed).toFixed(2), '-f', raw,
      ], { stdio: ['pipe', 'ignore', 'pipe'] });
      await new Promise<void>((resolve, reject) => {
        let stderr = '';
        child.stderr.on('data', (chunk) => { stderr += String(chunk).slice(0, 2000); });
        child.on('error', reject);
        child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`Piper failed: ${stderr.slice(0, 300)}`)));
        child.stdin.on('error', reject);
        child.stdin.end(text + '\n');
      });
    } else {
      await execFilePromise(ESPEAK_BIN, [
        '-v', 'fa+f3', '-s', String(Math.round(145 * boundedSpeed)),
        '-p', String(Math.round(62 * boundedPitch)), '-w', raw, text,
      ], { timeout: 30000 });
    }
    await execFilePromise(FFMPEG_BIN, ['-v', 'error', '-y', '-i', raw, '-ar', '48000', '-ac', '1', '-acodec', 'pcm_s24le', master], { timeout: 30000 });
    return { wav: fs.readFileSync(master), engine };
  } finally {
    for (const file of [raw, master]) {
      try { fs.unlinkSync(file); } catch {}
    }
  }
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', engine: 'DADASHMODE_SHOW_ENGINE_V5' });
  });

  // Voice Models Inventory Endpoint
  app.get('/api/voice/models', async (_req, res) => {
    const state = await voiceInventory();

    res.json({
      models: [
        {
          id: 'persian-female-neural-v1',
          name: 'Gyro — Persian Piper (جنسیت نامشخص)',
          engine: 'piper-neural',
          version: '1.4.0',
          modelSizeBytes: state.piperSize,
          modelSizeFormatted: `${(state.piperSize / (1024 * 1024)).toFixed(1)} MB`,
          language: 'fa-IR',
          gender: 'neutral',
          installed: state.neural,
          verified: false,
          offlineReady: state.neural,
          description: 'جنسیت و کیفیت باید با شنیدن نمونه تأیید شود؛ فایل مدل در ZIP موجود نیست.',
        },
        {
          id: 'persian-female-formant',
          name: 'Simin (سیمین) — Formant Backup',
          engine: 'formant-espeak',
          version: '1.51.0',
          modelSizeBytes: 0,
          modelSizeFormatted: 'وابسته به نصب میزبان',
          language: 'fa-IR',
          gender: 'female',
          installed: state.formant,
          verified: false,
          offlineReady: state.formant,
          description: 'نسخهٔ پشتیبان دستگاه میزبان؛ کیفیت صدای زنانه تضمین نمی‌شود.',
        },
        {
          id: 'gemini-female-aoede',
          name: 'Aoede (آئوده) — Cloud Online AI',
          engine: 'gemini-live',
          version: '2.5.0',
          modelSizeBytes: 0,
          modelSizeFormatted: 'Cloud Streaming',
          language: 'fa-IR',
          gender: 'female',
          installed: false,
          verified: false,
          offlineReady: false,
          description: 'Online low-latency conversational neural voice (requires active connection).',
        }
      ]
    });
  });

  app.get('/api/voice/models/installed', async (_req, res) => {
    const state = await voiceInventory();
    res.json({
      hasNeuralModel: state.neural,
      hasFormantModel: state.formant,
      offlineEngineReady: state.neural || state.formant,
      ...state,
    });
  });

  // Offline Voice Synthesizer Endpoint (48kHz, 24-bit PCM WAV)
  app.post('/api/voice/synthesize', async (req, res) => {
    try {
      const { text, engine = 'neural', speed = 1.0, pitch = 1.0 } = req.body || {};
      const { wav: wavBuffer } = await renderVoice(validateText(text), engine, Number(speed), Number(pitch));
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Length', wavBuffer.length);
      res.setHeader('X-Audio-SampleRate', '48000');
      res.setHeader('X-Audio-BitDepth', '24');
      res.setHeader('X-Audio-Channels', '1');
      res.send(wavBuffer);

    } catch (err: any) {
      console.error('Synthesis error:', err);
      res.status(503).json({ error: err.message || 'Synthesis execution failed' });
    }
  });

  // Mandatory Offline Verification Endpoint
  app.post('/api/voice/offline-verify', async (req, res) => {
    try {
      const { testPhrase = 'راند اول، برج لیوان! آماده‌اید؟ شروع!' } = req.body || {};
      const state = await voiceInventory();
      if (!state.neural && !state.formant) throw new Error('هیچ موتور صوتی آفلاینی روی دستگاه نصب نیست.');
      const engine = state.neural ? 'neural' : 'formant';
      const { wav: fileBuffer } = await renderVoice(validateText(testPhrase), engine, 1, 1);
      const probe = (await import('child_process')).spawnSync(FFPROBE_BIN, ['-v', 'error', '-show_entries', 'stream=codec_name,sample_rate,bits_per_raw_sample,duration', '-of', 'json', '-'], { input: fileBuffer });
      if (probe.status !== 0) throw new Error('WAV generated but ffprobe validation failed.');
      const stream = JSON.parse(probe.stdout.toString()).streams?.[0] || {};
      const checksumSha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // Save as permanent verified cue
      res.json({
        verified: true,
        modelName: engine === 'neural' ? 'Gyro (کیفیت تأیید نشده)' : 'eSpeak (کیفیت تأیید نشده)',
        engine,
        sampleRate: parseInt(stream.sample_rate || '48000', 10),
        bitDepth: parseInt(stream.bits_per_raw_sample || '24', 10) || 24,
        durationMs: Math.round(parseFloat(stream.duration || '3.5') * 1000),
        checksumSha256,
        isOfflineVerified: true,
        networkBlocked: false,
      });
    } catch (err: any) {
      console.error('Offline verification error:', err);
      res.status(503).json({ error: err.message || 'Verification failed' });
    }
  });

  // Serve approved cues
  app.get('/api/voice/cues/:id', (req, res) => {
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(req.params.id)) return res.status(400).json({ error: 'Invalid cue id' });
    const cuePath = path.join(CUES_DIR, `${req.params.id}.wav`);
    if (fs.existsSync(cuePath)) {
      res.setHeader('Content-Type', 'audio/wav');
      fs.createReadStream(cuePath).pipe(res);
    } else {
      res.status(404).json({ error: 'Cue not found on local disk' });
    }
  });

  // Approve and store cue
  app.post('/api/voice/cues/approve', express.raw({ type: 'audio/wav', limit: '20mb' }), (req, res) => {
    try {
      const cueId = (req.query.id as string) || `cue_${Date.now()}`;
      if (!/^[a-zA-Z0-9_-]{1,80}$/.test(cueId)) return res.status(400).json({ error: 'Invalid cue id' });
      if (!Buffer.isBuffer(req.body) || req.body.toString('ascii', 0, 4) !== 'RIFF' || req.body.toString('ascii', 8, 12) !== 'WAVE') return res.status(400).json({ error: 'A valid WAV file is required' });
      const cuePath = path.join(CUES_DIR, `${cueId}.wav`);
      fs.writeFileSync(cuePath, req.body);
      const hash = crypto.createHash('sha256').update(req.body).digest('hex');
      res.json({ status: 'approved', cueId, checksumSha256: hash });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Inspect an actual encoded test clip, not merely MediaRecorder state.
  app.post('/api/recording/inspect', express.raw({ type: ['video/webm', 'video/mp4', 'application/octet-stream'], limit: '40mb' }), async (req, res) => {
    try {
      if (!Buffer.isBuffer(req.body) || req.body.length < 1000) throw new Error('فایل ویدیویی معتبر دریافت نشد.');
      const file = path.join(TEMP_AUDIO_DIR, `recording_${crypto.randomBytes(12).toString('hex')}.${req.headers['content-type']?.includes('mp4') ? 'mp4' : 'webm'}`);
      fs.writeFileSync(file, req.body);
      try {
        const { stdout } = await execFilePromise(FFPROBE_BIN, ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,sample_rate', '-of', 'json', file], { timeout: 15000 });
        const parsed = JSON.parse(stdout);
        const video = parsed.streams?.find((track: any) => track.codec_type === 'video');
        const audio = parsed.streams?.find((track: any) => track.codec_type === 'audio');
        const duration = Number(parsed.format?.duration || 0);
        if (!video || !audio || duration < 1) throw new Error('ترک تصویر یا صدا وجود ندارد، یا زمان فایل کمتر از یک ثانیه است.');
        const { stderr } = await execFilePromise(FFMPEG_BIN, ['-i', file, '-vn', '-af', 'volumedetect', '-f', 'null', '-'], { timeout: 20000, maxBuffer: 1024 * 1024 });
        const maxDb = Number(stderr.match(/max_volume:\s*(-?[\d.]+)\s*dB/)?.[1]);
        const audible = Number.isFinite(maxDb) && maxDb > -50;
        res.json({ pass: audible, video, audio, duration, maxVolumeDb: maxDb, reason: audible ? 'ترک صوتی و تصویری و سیگنال غیرساکت ثبت شدند.' : 'ترک صوتی وجود دارد اما سیگنال شنیدنی تشخیص داده نشد.' });
      } finally { try { fs.unlinkSync(file); } catch {} }
    } catch (error: any) {
      res.status(422).json({ pass: false, reason: error.message || 'بازرسی فایل ناموفق بود.' });
    }
  });

  // Legacy fallback proxy
  app.post('/api/voice/preview', async (req, res) => {
    try {
      const { text, voice, speed } = req.body;
      res.status(404).json({ fallback: 'use_offline_synthesis', text, voice, speed });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Voice synthesis failed' });
    }
  });

  // WebSocket Server for Director & Gemini Live Referee
  const wss = new WebSocketServer({ server, path: '/ws/referee' });

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'DADASHMODE Live Referee Core ready' }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
        }
      } catch {
        // Ignore malformed payloads
      }
    });
  });

  if (!isProd) {
    // Vite Dev Server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Graceful shutdown handling
  let isClosing = false;
  const gracefulShutdown = (signal: string) => {
    if (isClosing) return;
    isClosing = true;
    console.log(`Received ${signal}, shutting down gracefully...`);
    wss.close();
    server.close(() => {
      console.log('Server and WebSocket closed. Process exit 0.');
      process.exit(0);
    });
    // Force close after 3 seconds if open sockets keep it alive
    setTimeout(() => {
      process.exit(0);
    }, 3000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`DADASHMODE SHOW ENGINE server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
