/**
 * BROWSER SPEECH SYNTHESIS PROVIDER (DEBUG ONLY)
 * 
 * CRITICAL ARCHITECTURAL CONSTRAINT:
 * This provider is STRICTLY FOR LOCAL DEV TESTING & DEBUGGING.
 * It is NEVER allowed to run in production filming or offline broadcast modes.
 */

import { VoiceProvider, SynthesizeRequest, SynthesizedAudioResult } from '../types';

export class BrowserSpeechDebugProvider implements VoiceProvider {
  public id = 'browser-speech-debug';
  public name = 'Browser SpeechSynthesis (DEBUG ONLY - NEVER PRODUCTION)';
  public tier = 'debug' as const;

  public async isAvailable(): Promise<boolean> {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isOfflineOnly(): boolean {
    return false;
  }

  public async synthesize(req: SynthesizeRequest): Promise<SynthesizedAudioResult> {
    console.warn('[VOICE ENGINE] Using BrowserSpeechDebugProvider: STRICTLY FOR DEBUG ONLY.');
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      throw new Error('SpeechSynthesis not supported in this environment');
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(req.text);
    utterance.lang = 'fa-IR';
    utterance.rate = req.speed || 1.0;
    utterance.pitch = req.pitch || 1.0;

    window.speechSynthesis.speak(utterance);

    // Return dummy 48kHz debug buffer representation
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx({ sampleRate: 48000 });
    const buffer = ctx.createBuffer(1, 48000 * 2, 48000);

    return {
      cueId: req.cueId,
      providerId: this.id,
      tier: this.tier,
      isOffline: false,
      durationMs: 2000,
      sampleRate: 48000,
      bitDepth: 16,
      channels: 1,
      format: 'WAV_PCM_S16LE',
      audioBuffer: buffer,
      audioBlobUrl: '',
      checksumSha256: 'debug-browser-speech-no-checksum',
    };
  }
}
