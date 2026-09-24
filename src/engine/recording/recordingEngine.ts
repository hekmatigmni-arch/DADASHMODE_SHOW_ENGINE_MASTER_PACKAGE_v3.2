/**
 * DADASHMODE BROADCAST RECORDING ARCHITECTURE
 * 
 * Strict Production Standard:
 * - Probes MediaRecorder.isTypeSupported() at runtime.
 * - Builds an accurate capability matrix.
 * - Never claims unsupported codecs (ProRes, 4K60) in the browser.
 * - Separates:
 *   1. Preview Recording (Browser WebM / MP4)
 *   2. Production Export (High-bitrate isolated stream)
 *   3. Master Render (Local FFmpeg 48kHz 24-bit PCM WAV + Master Video)
 */

export interface RecordingCapability {
  mimeType: string;
  container: 'webm' | 'mp4' | 'mkv' | 'unknown';
  videoCodec: string;
  audioCodec: string;
  isSupported: boolean;
  recommendedFor: 'preview' | 'production' | 'none';
  bitrateKbps: number;
}

export interface RecordingSession {
  id: string;
  target: 'FULL_PROGRAM' | 'TRANSPARENT_OVERLAY' | 'VERTICAL_SHORTS';
  mode: 'PREVIEW' | 'PRODUCTION' | 'MASTER_RENDER';
  actualMimeType: string;
  actualVideoCodec: string;
  actualAudioCodec: string;
  startTime: number;
  durationSeconds: number;
  fileSizeBytes: number;
  blobUrl?: string;
  status: 'IDLE' | 'RECORDING' | 'PAUSED' | 'FINALIZING' | 'COMPLETED' | 'ERROR';
}

export class RecordingEngine {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private currentSession: RecordingSession | null = null;

  /**
   * Evaluates available container and codec combinations at runtime.
   */
  public probeCapabilities(): RecordingCapability[] {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
      return [];
    }

    const testCandidates = [
      { mime: 'video/webm;codecs=vp9,opus', container: 'webm' as const, video: 'VP9', audio: 'Opus', bitrate: 12000, rec: 'production' as const },
      { mime: 'video/webm;codecs=vp8,opus', container: 'webm' as const, video: 'VP8', audio: 'Opus', bitrate: 8000, rec: 'preview' as const },
      { mime: 'video/webm;codecs=h264,opus', container: 'webm' as const, video: 'H.264', audio: 'Opus', bitrate: 10000, rec: 'production' as const },
      { mime: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', container: 'mp4' as const, video: 'H.264 Main', audio: 'AAC-LC', bitrate: 10000, rec: 'production' as const },
      { mime: 'video/mp4;codecs=avc1', container: 'mp4' as const, video: 'H.264 Baseline', audio: 'AAC', bitrate: 8000, rec: 'production' as const },
      { mime: 'video/webm', container: 'webm' as const, video: 'Default', audio: 'Default', bitrate: 6000, rec: 'preview' as const },
      { mime: 'video/mp4', container: 'mp4' as const, video: 'Default', audio: 'Default', bitrate: 6000, rec: 'preview' as const },
      // Check Apple ProRes (Expected: false on standard browsers)
      { mime: 'video/quicktime;codecs=apch', container: 'unknown' as const, video: 'Apple ProRes 422 HQ', audio: 'PCM', bitrate: 45000, rec: 'none' as const },
    ];

    return testCandidates.map((c) => {
      const supported = MediaRecorder.isTypeSupported(c.mime);
      return {
        mimeType: c.mime,
        container: c.container,
        videoCodec: c.video,
        audioCodec: c.audio,
        isSupported: supported,
        recommendedFor: supported ? c.rec : 'none',
        bitrateKbps: c.bitrate,
      };
    });
  }

  /**
   * Returns the best supported MIME type for the requested mode.
   */
  public getBestSupportedMime(mode: 'PREVIEW' | 'PRODUCTION' | 'MASTER_RENDER'): RecordingCapability {
    const caps = this.probeCapabilities().filter((c) => c.isSupported);
    if (caps.length === 0) {
      return {
        mimeType: 'unsupported',
        container: 'unknown',
        videoCodec: 'none',
        audioCodec: 'none',
        isSupported: false,
        recommendedFor: 'none',
        bitrateKbps: 0,
      };
    }

    if (mode === 'PRODUCTION') {
      const prod = caps.find((c) => c.recommendedFor === 'production') || caps[0];
      return prod;
    }

    return caps[0];
  }

  /**
   * Starts a recording session from a canvas stream and audio destination.
   */
  public startRecording(
    stream: MediaStream,
    target: 'FULL_PROGRAM' | 'TRANSPARENT_OVERLAY' | 'VERTICAL_SHORTS',
    mode: 'PREVIEW' | 'PRODUCTION' | 'MASTER_RENDER'
  ): RecordingSession {
    const capability = this.getBestSupportedMime(mode);
    if (!capability.isSupported) {
      throw new Error('No supported MediaRecorder format detected on this client platform.');
    }

    this.recordedChunks = [];
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: capability.mimeType,
      videoBitsPerSecond: capability.bitrateKbps * 1000,
    });

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    const session: RecordingSession = {
      id: `rec_${Date.now()}`,
      target,
      mode,
      actualMimeType: capability.mimeType,
      actualVideoCodec: capability.videoCodec,
      actualAudioCodec: capability.audioCodec,
      startTime: Date.now(),
      durationSeconds: 0,
      fileSizeBytes: 0,
      status: 'RECORDING',
    };

    this.currentSession = session;
    this.mediaRecorder.start(1000); // 1-second timeslice
    return session;
  }

  public stopRecording(): Promise<RecordingSession> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.currentSession) {
        return reject(new Error('No active recording session.'));
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: this.currentSession!.actualMimeType });
        const blobUrl = URL.createObjectURL(blob);
        const duration = Math.max(1, Math.round((Date.now() - this.currentSession!.startTime) / 1000));

        this.currentSession = {
          ...this.currentSession!,
          durationSeconds: duration,
          fileSizeBytes: blob.size,
          blobUrl,
          status: 'COMPLETED',
        };

        resolve(this.currentSession!);
      };

      this.mediaRecorder.stop();
    });
  }

  public getCurrentSession(): RecordingSession | null {
    return this.currentSession;
  }
}

export const recordingEngine = new RecordingEngine();
