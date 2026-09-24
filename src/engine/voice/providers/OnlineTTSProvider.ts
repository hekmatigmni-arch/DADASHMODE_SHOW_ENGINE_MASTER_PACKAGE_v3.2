/**
 * TIER 2: ONLINE TTS PROVIDER (GEMINI LIVE / CLOUD TTS)
 * 
 * Only active when internet is connected.
 * If internet disappears, the voice system seamlessly falls back to Tier 0 / Tier 1.
 */

import { VoiceProvider, SynthesizeRequest, SynthesizedAudioResult } from '../types';
import { loudnessEngine } from '../../audio/loudnessEngine';

export class OnlineTTSProvider implements VoiceProvider {
  public id = 'online-gemini';
  public name = 'Online Gemini Live Voice Layer';
  public tier = 2 as const;

  public async isAvailable(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false;
    }
    try {
      const res = await fetch('/api/health', { method: 'GET', cache: 'no-cache' });
      return res.ok;
    } catch {
      return false;
    }
  }

  public isOfflineOnly(): boolean {
    return false;
  }

  public async synthesize(req: SynthesizeRequest): Promise<SynthesizedAudioResult> {
    const isOnline = await this.isAvailable();
    if (!isOnline) {
      throw new Error('[Tier 2] Network unavailable: Cannot reach online TTS provider.');
    }

    const res = await fetch('/api/voice/online-synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: req.text,
        voice: 'Aoede',
        language: 'fa-IR',
      }),
    });

    if (!res.ok) {
      throw new Error(`Online TTS failed with status ${res.status}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx({ sampleRate: 48000 });
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const analysis = loudnessEngine.analyzeBuffer(audioBuffer);
    const masterBlob = loudnessEngine.bufferTo24BitWav(audioBuffer);
    const blobUrl = URL.createObjectURL(masterBlob);

    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const checksum = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return {
      cueId: req.cueId,
      providerId: this.id,
      tier: this.tier,
      isOffline: false,
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
