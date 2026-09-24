/**
 * SECONDARY OFFLINE FALLBACK: FORMANT / ESPEAK-NG PROVIDER
 * 
 * Uses local espeak-ng engine with Persian female formant filter (fa+f3).
 * Runs completely offline on the host system without internet access.
 * Synthesizes to 48kHz 24-bit PCM WAV.
 */

import { VoiceProvider, SynthesizeRequest, SynthesizedAudioResult } from '../types';
import { loudnessEngine } from '../../audio/loudnessEngine';

export class OfflineFormantFallbackProvider implements VoiceProvider {
  public id = 'offline-formant';
  public name = 'Local Formant Engine (eSpeak-NG)';
  public tier = 'fallback' as const;

  public async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch('/api/voice/models/installed');
      return res.ok && Boolean((await res.json()).hasFormantModel);
    } catch {
      return false;
    }
  }

  public isOfflineOnly(): boolean {
    return true;
  }

  public async synthesize(req: SynthesizeRequest): Promise<SynthesizedAudioResult> {
    const text = req.text.trim();
    if (!text) throw new Error('Text is required for formant synthesis');

    const res = await fetch('/api/voice/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        engine: 'formant',
        speed: req.speed || 1.0,
        pitch: req.pitch || 1.0,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Offline Formant TTS failed (${res.status}): ${errText}`);
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
