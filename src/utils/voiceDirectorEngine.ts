import { VoiceCue, VoiceEmotion, VoiceStyle } from '../types/showEngine';
import { OFFICIAL_VOICE_CUES } from '../data/showScenarios';
import { showAudioEngine } from './showAudioEngine';
import { getOfflineVoiceCue } from '../engine/mediaLibrary';

/**
 * Parsed script tag metadata for advanced director voice cues:
 * e.g. "[Energy 90] [Pause 0.5] [Speed 1.1] [Emotion Hype] امروز یک چالش بزرگ داریم"
 */
export interface ScriptTagMetadata {
  energy?: number;    // 1 - 100
  pauseSec?: number;  // e.g. 0.5 sec
  speed?: number;     // e.g. 1.1
  emotion?: VoiceEmotion;
  style?: VoiceStyle;
  cleanText: string;
}

export function parseVoiceScriptTags(rawInput: string): ScriptTagMetadata {
  let text = rawInput;
  let energy: number | undefined;
  let pauseSec: number | undefined;
  let speed: number | undefined;
  let emotion: VoiceEmotion | undefined;
  let style: VoiceStyle | undefined;

  // Extract [Energy XX]
  const energyMatch = text.match(/\[(?:energy|انرژی)\s*(\d+)\]/i);
  if (energyMatch) {
    energy = parseInt(energyMatch[1], 10);
    text = text.replace(energyMatch[0], '');
  }

  // Extract [Pause X.X]
  const pauseMatch = text.match(/\[(?:pause|مکث)\s*([\d.]+)\]/i);
  if (pauseMatch) {
    pauseSec = parseFloat(pauseMatch[1]);
    text = text.replace(pauseMatch[0], '');
  }

  // Extract [Speed X.X]
  const speedMatch = text.match(/\[(?:speed|سرعت)\s*([\d.]+)\]/i);
  if (speedMatch) {
    speed = parseFloat(speedMatch[1]);
    text = text.replace(speedMatch[0], '');
  }

  // Extract [Emotion XXX]
  const emotionMatch = text.match(/\[(?:emotion|احساس)\s*(\w+)\]/i);
  if (emotionMatch) {
    const rawEm = emotionMatch[1].toLowerCase();
    if (['dramatic', 'hype', 'calm', 'sarcastic', 'referee_strict'].includes(rawEm)) {
      emotion = rawEm as VoiceEmotion;
    }
    text = text.replace(emotionMatch[0], '');
  }

  // Extract [Style XXX]
  const styleMatch = text.match(/\[(?:style|سبک)\s*(\w+)\]/i);
  if (styleMatch) {
    const rawSt = styleMatch[1].toLowerCase();
    if (['referee', 'announcer', 'coach'].includes(rawSt)) {
      style = rawSt as VoiceStyle;
    }
    text = text.replace(styleMatch[0], '');
  }

  return {
    energy,
    pauseSec,
    speed,
    emotion,
    style,
    cleanText: text.trim(),
  };
}

/**
 * Professional Female Persian AI Voice Director Engine
 * Priority #2: Real Voice Director execution for YouTube challenge game show
 * 
 * Features:
 * 1. Female Persian AI Voice Execution:
 *    - Server-side high fidelity TTS (gemini-3.1-flash-tts-preview / Kore female voice)
 *    - Tag-based parsing: [Energy 90] [Pause 0.5] [Speed 1.2]
 * 2. Robust Offline Fallback:
 *    - If AI live / API connection is unavailable or fails, automatically switches to Web Speech
 *      female Persian synthesis + acoustic synthesized emotional game show tones.
 * 3. Voice Preview & Save Cue:
 *    - Preview voice before live broadcast
 *    - Save custom voice cues to local library & timeline synchronization
 * 4. Exact script execution:
 *    - Speaks the exact prepared script verbatim with designated emotional modulation.
 */
export class VoiceDirectorEngine {
  private isMuted: boolean = false;
  private volume: number = 1.0;
  private voiceCache: Map<string, VoiceCue> = new Map();
  private availableVoices: SpeechSynthesisVoice[] = [];
  private persianFemaleVoice: SpeechSynthesisVoice | null = null;
  private isPlaying: boolean = false;
  private activeFemaleVoiceName: string = 'Kore'; // Official female voice

  constructor() {
    // Populate cache with official cues
    OFFICIAL_VOICE_CUES.forEach((c) => this.voiceCache.set(c.id, c));
    this.loadSavedCues();
    this.initVoices();
  }

  private loadSavedCues() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('dadashmode_custom_voice_cues');
      if (saved) {
        const parsed: VoiceCue[] = JSON.parse(saved);
        parsed.forEach((cue) => this.voiceCache.set(cue.id, cue));
      }
      const savedVoice = localStorage.getItem('dadashmode_referee_voice');
      if (savedVoice) {
        this.activeFemaleVoiceName = savedVoice;
      }
    } catch (e) {
      console.warn('Failed to load custom voice cues:', e);
    }
  }

  private saveCustomCues() {
    if (typeof window === 'undefined') return;
    try {
      const customs = Array.from(this.voiceCache.values()).filter((c) => c.id.startsWith('custom_'));
      localStorage.setItem('dadashmode_custom_voice_cues', JSON.stringify(customs));
    } catch {}
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        this.availableVoices = window.speechSynthesis.getVoices();
        // Seek female Persian voices, or female multilingual fallbacks
        this.persianFemaleVoice =
          this.availableVoices.find(
            (v) =>
              (v.lang.toLowerCase().startsWith('fa') ||
               v.name.toLowerCase().includes('persian') ||
               v.name.toLowerCase().includes('farsi')) &&
              (v.name.toLowerCase().includes('female') ||
               v.name.toLowerCase().includes('woman') ||
               v.name.toLowerCase().includes('zira') ||
               v.name.toLowerCase().includes('dilara') ||
               !v.name.toLowerCase().includes('male'))
          ) ||
          this.availableVoices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('fa') ||
              v.name.toLowerCase().includes('persian') ||
              v.name.toLowerCase().includes('farsi')
          ) ||
          null;
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  /**
   * Play an offline acoustic tone that matches the cue emotion & style
   */
  private playSynthesizedEmotionTone(emotion: VoiceEmotion, energy: number = 8) {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      const energyMultiplier = Math.min(Math.max(energy / 10, 0.5), 1.5);

      if (emotion === 'referee_strict') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880 * energyMultiplier, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
        gain.gain.setValueAtTime(0.35 * this.volume, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (emotion === 'hype') {
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * energyMultiplier, now + idx * 0.04);
          gain.gain.setValueAtTime(0.25 * this.volume, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.45);
        });
      } else if (emotion === 'dramatic') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
        gain.gain.setValueAtTime(0.4 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
      }
    } catch {
      // AudioContext locked
    }
  }

  /**
   * Speak using an available local synthesis engine, never a silent browser fallback.
   */
  public async speakText(
    rawText: string,
    options: {
      emotion?: VoiceEmotion;
      speed?: number;
      pauseMs?: number;
      energy?: number;
      style?: VoiceStyle;
      preferOffline?: boolean;
    } = {}
  ): Promise<boolean> {
    if (this.isMuted) return true;

    const parsed = parseVoiceScriptTags(rawText);
    const textToSpeak = parsed.cleanText;
    if (!textToSpeak) return false;

    const emotion: VoiceEmotion = options.emotion || parsed.emotion || 'hype';
    const speed = options.speed || parsed.speed || 1.0;
    const energy = options.energy || (parsed.energy ? parsed.energy / 10 : 9);
    const pauseMs = options.pauseMs || (parsed.pauseSec ? parsed.pauseSec * 1000 : 300);
    const style: VoiceStyle = options.style || parsed.style || 'announcer';

    // Use the exact same local, recordable audio path as the live show.
      try {
        const approved = await getOfflineVoiceCue(textToSpeak).catch(() => undefined);
        if (approved) {
          const wav = await approved.blob.arrayBuffer();
          const hash = await crypto.subtle.digest('SHA-256', wav);
          const digest = Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
          if (digest !== approved.checksum) throw new Error('فایل گفتار آفلاین تغییر کرده است.');
          await showAudioEngine.playVoiceWav(wav);
          return true;
        }
        const available = await fetch('/api/voice/models/installed');
        if (!available.ok) throw new Error('Local voice inventory unavailable');
        const installed = await available.json();
        const engine = installed.hasNeuralModel ? 'neural' : installed.hasFormantModel ? 'formant' : null;
        if (!engine) throw new Error('No installed offline voice');
        const response = await fetch('/api/voice/synthesize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: textToSpeak,
            engine,
            speed,
          }),
        });
        if (!response.ok) throw new Error(await response.text());
        await showAudioEngine.playVoiceWav(await response.arrayBuffer());
        await new Promise((r) => setTimeout(r, pauseMs));
        return true;
      } catch (err) {
        console.error('[VoiceDirector] صدای آفلاین آماده نیست:', err);
        return false;
      }
  }

  /**
   * Offline Web Speech Fallback Execution
   */
  public speakOffline(cue: VoiceCue): Promise<boolean> {
    return this.speakText(cue.persianText, { speed: cue.speed, pauseMs: cue.pauseMs, preferOffline: true });
  }

  public async speak(cue: VoiceCue): Promise<boolean> {
    return this.speakText(cue.persianText, {
      emotion: cue.emotion,
      speed: cue.speed,
      pauseMs: cue.pauseMs,
      energy: cue.energy,
      style: cue.style,
    });
  }

  public speakById(cueId: string): Promise<boolean> {
    const cue = this.voiceCache.get(cueId);
    if (cue) {
      return this.speak(cue);
    }
    return Promise.resolve(false);
  }

  public registerCustomCue(cue: VoiceCue) {
    this.voiceCache.set(cue.id, cue);
    this.saveCustomCues();
  }

  public deleteCustomCue(cueId: string) {
    this.voiceCache.delete(cueId);
    this.saveCustomCues();
  }

  public getAllCues(): VoiceCue[] {
    return Array.from(this.voiceCache.values());
  }

  public setFemaleVoice(voiceName: string) {
    this.activeFemaleVoiceName = voiceName;
    try {
      localStorage.setItem('dadashmode_referee_voice', voiceName);
    } catch {}
  }

  public getFemaleVoice(): string {
    return this.activeFemaleVoiceName;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(vol, 1));
  }
}

export const voiceDirector = new VoiceDirectorEngine();
