/**
 * TIER 1: BUNDLED LOCAL PERSIAN FEMALE NEURAL TTS PROVIDER
 * 
 * Executes local neural inference on the host CPU via Piper ONNX / VITS engine.
 * Fully autonomous: does not require network access.
 * Synthesizes to 48kHz 24-bit PCM WAV broadcast master.
 */

import { VoiceProvider, SynthesizeRequest, SynthesizedAudioResult, VoiceModelMetadata } from '../types';
import { loudnessEngine } from '../../audio/loudnessEngine';

export const PERSIAN_FEMALE_NEURAL_METADATA: VoiceModelMetadata = {
  id: 'persian-female-neural-v1',
  name: 'Gyro — Persian Piper (gender not verified)',
  engine: 'piper-neural',
  version: '1.4.0',
  modelSizeBytes: 64120000,
  modelSizeFormatted: '61.1 MB',
  language: 'fa-IR',
  gender: 'neutral',
  installed: false,
  verified: false,
  offlineReady: false,
  modelPath: 'models/piper/fa_IR-gyro-medium.onnx',
  configPath: 'models/piper/fa_IR-gyro-medium.onnx.json',
  speakerId: 0,
  description: 'Requires local model and Piper runtime; voice gender and performance require audition.',
};

export class OfflineNeuralTTSProvider implements VoiceProvider {
  public id = 'offline-neural';
  public name = 'Local Persian Female Neural Engine';
  public tier = 1 as const;

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch('/api/voice/models/installed');
      if (res.ok) {
        const data = await res.json();
        return !!data.hasNeuralModel;
      }
      return false;
    } catch {
      return false;
    }
  }

  public isOfflineOnly(): boolean {
    return true;
  }

  public async synthesize(req: SynthesizeRequest): Promise<SynthesizedAudioResult> {
    const text = req.text.trim();
    if (!text) throw new Error('Text is required for neural synthesis');

    // Call local server backend running local offline Piper/ffmpeg
    const res = await fetch('/api/voice/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        engine: 'neural',
        speed: req.speed || 1.0,
        pitch: req.pitch || 1.0,
        emotion: req.emotion || 'hype',
        voiceId: PERSIAN_FEMALE_NEURAL_METADATA.id,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Offline Neural TTS failed (${res.status}): ${errText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx({ sampleRate: 48000 });
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    // Compute master metrics
    const analysis = loudnessEngine.analyzeBuffer(audioBuffer);
    const masterBlob = loudnessEngine.bufferTo24BitWav(audioBuffer);
    const blobUrl = URL.createObjectURL(masterBlob);

    // Generate SHA-256 checksum
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const checksum = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return {
      cueId: req.cueId,
      providerId: this.id,
      tier: this.tier,
      isOffline: true,
      durationMs: Math.round(audioBuffer.duration * 1000),
      sampleRate: 48000,
      bitDepth: 24,
      channels: audioBuffer.numberOfChannels,
      format: 'WAV_PCM_S24LE',
      audioBuffer,
      audioBlobUrl: blobUrl,
      masterWavBlob: masterBlob,
      checksumSha256: checksum,
      waveformPeaks: analysis.waveformPeaks,
      loudnessMetrics: {
        integratedLufs: analysis.integratedLufs,
        loudnessRangeLu: analysis.loudnessRangeLu,
        truePeakDbfs: analysis.truePeakDbfs,
      },
    };
  }
}
