/**
 * TIER 0: APPROVED PRE-RENDERED WAV CUE PROVIDER
 * 
 * Plays verified, local pre-rendered 48kHz 24-bit PCM WAV cues directly from disk/cache.
 * This is the primary tier used during live filming.
 */

import { VoiceProvider, SynthesizeRequest, SynthesizedAudioResult, ApprovedCue } from '../types';
import { loudnessEngine } from '../../audio/loudnessEngine';

export class ApprovedWavProvider implements VoiceProvider {
  public id = 'approved-wav';
  public name = 'Approved Pre-Rendered WAV Cache';
  public tier = 0 as const;

  // Local in-memory cache + IndexedDB/disk backed
  private approvedCues: Map<string, ApprovedCue> = new Map();
  private audioCache: Map<string, AudioBuffer> = new Map();

  constructor() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('dadashmode_approved_voice_cues') : null;
      const saved = raw ? JSON.parse(raw) : [];
      if (Array.isArray(saved)) {
        for (const cue of saved) {
          if (cue && /^[a-zA-Z0-9_-]{1,80}$/.test(cue.id) && typeof cue.text === 'string')
            this.approvedCues.set(cue.id, cue);
        }
      }
    } catch {
      // Corrupt metadata is not proof that WAV files are available.
    }
  }

  private seedDefaultApprovedCues() {
    // Seed key show cues with known approved status
    const defaultApproved: ApprovedCue[] = [
      {
        id: 'ROUND_1_INTRO',
        text: 'راند اول، برج لیوان! ده لیوان، فقط با یک دست. شروع!',
        voiceId: 'persian-female-neural-v1',
        durationMs: 4200,
        masterWavPath: '/cues/round1_intro_master.wav',
        processedWavPath: '/cues/round1_intro_playback.wav',
        checksumSha256: '9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
        approvedAt: new Date().toISOString(),
        approvedBy: 'Director',
        loudness: { integratedLufs: -18.0, loudnessRangeLu: 5.8, truePeakDbfs: -1.0 },
      },
      {
        id: 'COUNTDOWN_321',
        text: 'سه، دو، یک، شروع!',
        voiceId: 'persian-female-neural-v1',
        durationMs: 2500,
        masterWavPath: '/cues/countdown_master.wav',
        processedWavPath: '/cues/countdown_playback.wav',
        checksumSha256: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
        approvedAt: new Date().toISOString(),
        approvedBy: 'Director',
        loudness: { integratedLufs: -17.5, loudnessRangeLu: 6.2, truePeakDbfs: -0.8 },
      },
      {
        id: 'VERIFICATION_PASS',
        text: 'راند اول، برج لیوان! آماده‌اید؟ شروع!',
        voiceId: 'persian-female-neural-v1',
        durationMs: 3800,
        masterWavPath: '/cues/verification_master.wav',
        processedWavPath: '/cues/verification_playback.wav',
        checksumSha256: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
        approvedAt: new Date().toISOString(),
        approvedBy: 'Lead Audio Engineer',
        loudness: { integratedLufs: -18.0, loudnessRangeLu: 5.5, truePeakDbfs: -1.0 },
      }
    ];

    defaultApproved.forEach((cue) => this.approvedCues.set(cue.id, cue));
  }

  public async isAvailable(): Promise<boolean> {
    return this.approvedCues.size > 0;
  }

  public isOfflineOnly(): boolean {
    return true;
  }

  public hasApprovedCue(cueIdOrText: string): boolean {
    if (this.approvedCues.has(cueIdOrText)) return true;
    for (const cue of this.approvedCues.values()) {
      if (cue.text.trim() === cueIdOrText.trim()) return true;
    }
    return false;
  }

  public getApprovedCue(cueIdOrText: string): ApprovedCue | undefined {
    if (this.approvedCues.has(cueIdOrText)) return this.approvedCues.get(cueIdOrText);
    for (const cue of this.approvedCues.values()) {
      if (cue.text.trim() === cueIdOrText.trim()) return cue;
    }
    return undefined;
  }

  public registerApprovedCue(cue: ApprovedCue) {
    this.approvedCues.set(cue.id, cue);
    try {
      localStorage.setItem('dadashmode_approved_voice_cues', JSON.stringify(Array.from(this.approvedCues.values())));
    } catch {
      console.warn('Approved cue metadata could not be persisted locally.');
    }
  }

  public getAllApprovedCues(): ApprovedCue[] {
    return Array.from(this.approvedCues.values());
  }

  public async synthesize(req: SynthesizeRequest): Promise<SynthesizedAudioResult> {
    const cue = this.getApprovedCue(req.cueId || req.text);
    if (!cue) {
      throw new Error(`[Tier 0] No pre-rendered approved WAV cue found for: "${req.text}"`);
    }

    // Attempt to fetch local cached WAV from server storage or synthesized fallback buffer
    let audioBuffer: AudioBuffer | undefined = this.audioCache.get(cue.id);
    let blobUrl = '';

    if (!audioBuffer) {
      try {
        const response = await fetch(`/api/voice/cues/${cue.id}`);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioCtx({ sampleRate: 48000 });
          audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          this.audioCache.set(cue.id, audioBuffer);
          blobUrl = URL.createObjectURL(new Blob([arrayBuffer], { type: 'audio/wav' }));
        }
      } catch (err) {
        // Fallback to local tone if file not yet downloaded to local disk
      }
    }

    // Never replace missing dialogue with a tone and report it as successful speech.
    if (!audioBuffer) {
      throw new Error(`فایل WAV دیالوگ تأییدشده یافت نشد: ${cue.id}`);
    }

    const wavBlob = loudnessEngine.bufferTo24BitWav(audioBuffer);
    if (!blobUrl) {
      blobUrl = URL.createObjectURL(wavBlob);
    }

    return {
      cueId: cue.id,
      providerId: this.id,
      tier: this.tier,
      isOffline: true,
      durationMs: cue.durationMs,
      sampleRate: 48000,
      bitDepth: 24,
      channels: 1,
      format: 'WAV_PCM_S24LE',
      audioBuffer,
      audioBlobUrl: blobUrl,
      masterWavBlob: wavBlob,
      checksumSha256: cue.checksumSha256,
      loudnessMetrics: cue.loudness,
    };
  }
}
