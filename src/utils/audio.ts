/**
 * Audio processing for Gemini Live API & Game Show Sound Effects
 */

// Converts float32 audio buffer from microphone to 16-bit PCM Linear little-endian
export function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return output.buffer;
}

// Converts ArrayBuffer to Base64 string safely
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Converts Base64 16-bit PCM string into Float32Array for AudioContext playback
export function base64ToFloat32PCM(base64: string): Float32Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const dataView = new DataView(bytes.buffer);
  const samples = new Float32Array(len / 2);
  for (let i = 0; i < samples.length; i++) {
    const int16 = dataView.getInt16(i * 2, true);
    samples[i] = int16 / 32768.0;
  }
  return samples;
}

/**
 * 24kHz Gapless Audio Player for Gemini Live model output
 */
export class LiveAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime: number = 0;
  private isPlaying: boolean = false;
  private activeSources: Set<AudioBufferSourceNode> = new Set();

  constructor() {
    // Lazy initialized on user action
  }

  public resume() {
    this.ensureContext();
  }

  private ensureContext() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass({ sampleRate: 24000 });
      this.nextStartTime = this.audioCtx.currentTime;
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public playPcmChunk(base64Chunk: string) {
    try {
      const ctx = this.ensureContext();
      const float32Samples = base64ToFloat32PCM(base64Chunk);
      if (float32Samples.length === 0) return;

      const buffer = ctx.createBuffer(1, float32Samples.length, 24000);
      buffer.getChannelData(0).set(float32Samples);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      // Gapless scheduling
      const now = ctx.currentTime;
      if (this.nextStartTime < now) {
        this.nextStartTime = now + 0.03; // small jitter cushion
      }

      source.start(this.nextStartTime);
      this.nextStartTime += buffer.duration;
      this.isPlaying = true;
      this.activeSources.add(source);

      source.onended = () => {
        this.activeSources.delete(source);
        if (this.audioCtx && this.audioCtx.currentTime >= this.nextStartTime - 0.05) {
          this.isPlaying = false;
        }
      };
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  public stopAndClear() {
    // Immediately stop and disconnect all queued and playing audio buffers
    for (const source of this.activeSources) {
      try {
        source.stop(0);
        source.disconnect();
      } catch {
        // already stopped or invalid state
      }
    }
    this.activeSources.clear();

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.nextStartTime = this.audioCtx.currentTime;
    }
    this.isPlaying = false;
  }

  public close() {
    this.stopAndClear();
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
}

/**
 * Web Audio Synthesized Sound Effects for Game Show
 */
export class GameSoundEffects {
  private ctx: AudioContext | null = null;

  private getContext() {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // High-pitched referee whistle
  public playWhistle() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(2800, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Ignore audio synthesis errors on locked autoplay
    }
  }

  // Foul buzzer (low saw buzz)
  public playBuzzer() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.setValueAtTime(130, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Ignore
    }
  }

  // VAR / Review emergency siren
  public playReviewSiren() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.2);
      osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {
      // Ignore
    }
  }

  // Short tick for countdown seconds
  public playTick() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore
    }
  }

  // Fanfare for winner declaration
  public playFanfare() {
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
      });
    } catch {
      // Ignore
    }
  }
}

import { showAudioEngine } from './showAudioEngine';

export const liveAudioPlayer = {
  resume: () => showAudioEngine.resume(),
  playPcmChunk: (chunk: string) => showAudioEngine.playPcmChunk(chunk),
  stopAndClear: () => showAudioEngine.stopAndClear(),
  close: () => showAudioEngine.stopAndClear(),
  isSpeaking: () => showAudioEngine.isRefereeSpeaking(),
};

export const soundEffects = {
  playWhistle: () => showAudioEngine.playWhistle(),
  playBuzzer: () => showAudioEngine.playBuzzer(),
  playReviewSiren: () => showAudioEngine.playReviewSiren(),
  playTick: () => showAudioEngine.playTick(),
  playCountdownBeep: (isHigh?: boolean) => showAudioEngine.playCountdownBeep(isHigh),
  playRewardDing: () => showAudioEngine.playRewardDing(),
  playPenaltySound: () => showAudioEngine.playPenaltySound(),
  playCardFlipWhoosh: () => showAudioEngine.playCardFlipWhoosh(),
  playEnvelopeTear: () => showAudioEngine.playEnvelopeTear(),
  playFanfare: () => showAudioEngine.playFanfare(),
};

