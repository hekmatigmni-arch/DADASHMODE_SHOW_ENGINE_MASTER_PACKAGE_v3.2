/**
 * DADASHMODE SHOW ENGINE - VOICE ARCHITECTURE TYPES
 * 
 * Strict Provider Abstraction & Tiered Hierarchy:
 * Tier 0: ApprovedWavProvider (Pre-rendered 48kHz 24-bit WAV cues)
 * Tier 1: OfflineNeuralTTSProvider (Bundled/local Persian female neural TTS)
 * Tier 2: OnlineTTSProvider (Online / Gemini Live when internet available)
 * Secondary Offline: OfflineFormantFallbackProvider (eSpeak-NG)
 * Debug Only: BrowserSpeechDebugProvider (Never used in production)
 */

export type VoiceTier = 0 | 1 | 2 | 'fallback' | 'debug';

export type VoiceGender = 'female' | 'male' | 'neutral';

export interface VoiceModelMetadata {
  id: string;
  name: string;
  engine: 'piper-neural' | 'vits-onnx' | 'formant-espeak' | 'gemini-live' | 'browser-debug';
  version: string;
  modelSizeBytes: number;
  modelSizeFormatted: string;
  language: 'fa-IR' | 'fa';
  gender: VoiceGender;
  installed: boolean;
  verified: boolean;
  offlineReady: boolean;
  modelPath?: string;
  configPath?: string;
  speakerId?: number;
  description: string;
}

export interface SynthesizeRequest {
  text: string;
  voiceId?: string;
  speed?: number;     // 0.8 - 1.5 (default 1.0)
  pitch?: number;     // 0.8 - 1.4 (default 1.0)
  emotion?: 'hype' | 'dramatic' | 'referee_strict' | 'calm' | 'sarcastic';
  profile?: 'VOICE' | 'SFX' | 'MUSIC' | 'FINAL_PROGRAM';
  cueId?: string;
}

export interface SynthesizedAudioResult {
  cueId?: string;
  providerId: string;
  tier: VoiceTier;
  isOffline: boolean;
  durationMs: number;
  sampleRate: number;      // e.g. 48000
  bitDepth: number;        // e.g. 24
  channels: number;        // 1 (mono) or 2 (stereo)
  format: 'WAV_PCM_S24LE' | 'WAV_PCM_S16LE';
  audioBuffer?: AudioBuffer;
  audioBlobUrl: string;
  masterWavBlob?: Blob;
  processedWavBlob?: Blob;
  checksumSha256: string;
  waveformPeaks?: number[];
  loudnessMetrics?: {
    integratedLufs: number;
    loudnessRangeLu: number;
    truePeakDbfs: number;
  };
}

export interface ApprovedCue {
  id: string;
  text: string;
  voiceId: string;
  durationMs: number;
  masterWavPath: string;
  processedWavPath: string;
  checksumSha256: string;
  approvedAt: string;
  approvedBy: string;
  loudness: {
    integratedLufs: number;
    loudnessRangeLu: number;
    truePeakDbfs: number;
  };
}

export interface VoiceProvider {
  id: string;
  name: string;
  tier: VoiceTier;
  isAvailable(): Promise<boolean>;
  isOfflineOnly(): boolean;
  synthesize(req: SynthesizeRequest): Promise<SynthesizedAudioResult>;
}
