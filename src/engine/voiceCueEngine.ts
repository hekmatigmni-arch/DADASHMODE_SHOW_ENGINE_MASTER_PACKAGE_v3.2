/**
 * VOICE CUE ENGINE
 * 
 * Supports Persian female voice options: Kore, Aoede, Leda, Browser Native
 * Parameters: emotion, speed, energy, pause, style, soundEffectTrigger
 * Offline audio synthesis fallback guarantees that the show continues without internet.
 */

import { VoiceEmotion, VoiceStyle } from '../types/showEngine';
import { showAudioEngine } from '../utils/showAudioEngine';
import { getOfflineVoiceCue } from './mediaLibrary';

export interface VoiceItem {
  id: string;
  label: string;
  persianText: string;
  voiceName: string;
  emotion: VoiceEmotion;
  speed: number;
  pauseMs: number;
  energy: number;
  style: VoiceStyle;
  soundEffectTrigger?: string;
  isSystemDefault?: boolean;
}

export const FEMALE_VOICE_OPTIONS = [
  { id: 'Kore', label: 'Kore (Neural Persian Female)', persianLabel: 'کُوره (صدای رسمی و شفاف داور)' },
  { id: 'Aoede', label: 'Aoede (Dynamic Dramatic)', persianLabel: 'آئوده (دراماتیک و پرانرژی)' },
  { id: 'Leda', label: 'Leda (Calm Authority)', persianLabel: 'لِدا (آرام و قاطع)' },
  { id: 'Browser_Native', label: 'Browser Speech (Offline Fallback)', persianLabel: 'موتور بومی مرورگر (کاملاً آفلاین)' },
];

export const DEFAULT_VOICE_CUES: VoiceItem[] = [
  {
    id: 'cue_round1_start',
    label: 'شروع راند ۱ — برج لیوان',
    persianText: 'راند اول، برج لیوان! ده لیوان، فقط با یک دست. آماده‌اید؟ شروع!',
    voiceName: 'Kore',
    emotion: 'hype',
    speed: 1.1,
    pauseMs: 400,
    energy: 9,
    style: 'referee',
    soundEffectTrigger: 'countdown_beep',
    isSystemDefault: true,
  },
  {
    id: 'cue_elias_win',
    label: 'اعلام برد الیاس',
    persianText: 'برنده این راند، الیاس! امتیاز اضافه شد.',
    voiceName: 'Kore',
    emotion: 'hype',
    speed: 1.05,
    pauseMs: 300,
    energy: 9,
    style: 'referee',
    soundEffectTrigger: 'reward_ding',
    isSystemDefault: true,
  },
  {
    id: 'cue_emad_win',
    label: 'اعلام برد عماد',
    persianText: 'برنده این راند، عماد! امتیاز به بانک زمان عماد واریز شد.',
    voiceName: 'Kore',
    emotion: 'hype',
    speed: 1.05,
    pauseMs: 300,
    energy: 9,
    style: 'referee',
    soundEffectTrigger: 'reward_ding',
    isSystemDefault: true,
  },
  {
    id: 'cue_var_review',
    label: 'اعلام بازبینی صحنه VAR',
    persianText: 'نتیجه واضح نیست. بازبینی صحنه توسط داور!',
    voiceName: 'Kore',
    emotion: 'referee_strict',
    speed: 1.0,
    pauseMs: 500,
    energy: 8,
    style: 'referee',
    soundEffectTrigger: 'penalty_sound',
    isSystemDefault: true,
  },
  {
    id: 'cue_time_risk_lock',
    label: 'قفل خرید قدرت زمان',
    persianText: 'خرید قفل شد.',
    voiceName: 'Kore',
    emotion: 'referee_strict',
    speed: 1.0,
    pauseMs: 200,
    energy: 7,
    style: 'referee',
    isSystemDefault: true,
  },
  {
    id: 'cue_final_countdown',
    label: 'شمارش ۵ ثانیه آخر',
    persianText: 'پنج، چهار، سه، دو، یک، پایان!',
    voiceName: 'Kore',
    emotion: 'dramatic',
    speed: 1.15,
    pauseMs: 300,
    energy: 10,
    style: 'announcer',
    isSystemDefault: true,
  },
];

class RealVoiceCueEngine {
  private items: VoiceItem[] = [];
  private isSpeaking: boolean = false;
  private listeners: Set<(speaking: boolean, text?: string) => void> = new Set();

  constructor() {
    this.loadPersistedItems();
  }

  private loadPersistedItems() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem('dadash_voice_items');
        if (raw) {
          this.items = JSON.parse(raw);
          return;
        }
      }
    } catch {
      // Ignore
    }
    this.items = [...DEFAULT_VOICE_CUES];
  }

  public getItems(): VoiceItem[] {
    return this.items;
  }

  public saveItem(item: VoiceItem) {
    const idx = this.items.findIndex((i) => i.id === item.id);
    if (idx >= 0) {
      this.items[idx] = item;
    } else {
      this.items.push(item);
    }
    this.persistItems();
  }

  public deleteItem(id: string) {
    this.items = this.items.filter((i) => i.id !== id);
    this.persistItems();
  }

  private persistItems() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('dadash_voice_items', JSON.stringify(this.items));
      }
    } catch {
      // Ignore
    }
  }

  public subscribeSpeaking(listener: (speaking: boolean, text?: string) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setSpeakingState(speaking: boolean, text?: string) {
    this.isSpeaking = speaking;
    this.listeners.forEach((fn) => fn(speaking, text));
  }

  public async previewItem(item: VoiceItem): Promise<boolean> {
    return this.speakText(item.persianText, item.speed, item.voiceName);
  }

  public async playDuringShow(item: VoiceItem): Promise<boolean> {
    if (item.soundEffectTrigger) {
      if (item.soundEffectTrigger.includes('ding') || item.soundEffectTrigger.includes('reward')) {
        showAudioEngine.playRewardDing();
      } else if (item.soundEffectTrigger.includes('beep') || item.soundEffectTrigger.includes('countdown')) {
        showAudioEngine.playCountdownBeep(true);
      } else if (item.soundEffectTrigger.includes('penalty')) {
        showAudioEngine.playPenaltySound();
      }
    }

    const success = await this.speakText(item.persianText, item.speed, item.voiceName);
    if (item.pauseMs > 0) {
      await new Promise((r) => setTimeout(r, item.pauseMs));
    }
    return success;
  }

  public async playCue(id: string): Promise<boolean> {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      return this.playDuringShow(item);
    }
    return false;
  }

  public async playCustomVoice(
    persianText: string,
    voiceName: string = 'Kore',
    emotion: VoiceEmotion = 'hype'
  ): Promise<boolean> {
    const tempItem: VoiceItem = {
      id: `custom_${Date.now()}`,
      label: 'اعلان فوری داور',
      persianText,
      voiceName,
      emotion,
      speed: 1.05,
      pauseMs: 250,
      energy: 9,
      style: 'referee',
      soundEffectTrigger: 'reward_ding',
    };
    return this.playDuringShow(tempItem);
  }

  private async speakText(text: string, speed: number = 1.0, _voiceName: string = 'Kore'): Promise<boolean> {
    this.setSpeakingState(true, text);

    // A local server on this device is required. Never silently substitute browser speech:
    // it cannot be reliably routed into the recorded soundtrack.
    try {
        const approved = await getOfflineVoiceCue(text).catch(() => undefined);
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
          body: JSON.stringify({ text, engine, speed }),
        });
        if (!response.ok) throw new Error(await response.text());
        await showAudioEngine.playVoiceWav(await response.arrayBuffer());
        return true;
    } catch (error) {
      console.error('[VOICE] Local neural narration unavailable, cue not spoken:', error);
      return false;
    } finally {
      this.setSpeakingState(false);
    }
  }
}

export const voiceCueEngine = new RealVoiceCueEngine();
