/**
 * SHOW AUDIO ENGINE
 * 
 * Web Audio API synthesizer for broadcast sound effects:
 * - Reward Ding (Harmonic chime)
 * - Buzzer Hit (Low buzz)
 * - Countdown Beep (Tick)
 * - Victory Fanfare (Celebration)
 * - Penalty / Warning (Siren)
 * - Whoosh Transition (White noise sweep)
 */

class ShowAudioEngine {
  private ctx: AudioContext | null = null;
  private recorderDestination: MediaStreamAudioDestinationNode | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public resume() {
    return this.getContext().resume();
  }

  public getRecordingAudioTrack(): MediaStreamTrack | null {
    const ctx = this.getContext();
    if (!this.recorderDestination) this.recorderDestination = ctx.createMediaStreamDestination();
    return this.recorderDestination.stream.getAudioTracks()[0] || null;
  }

  private connectOutput(node: AudioNode) {
    const ctx = this.getContext();
    node.connect(ctx.destination);
    if (!this.recorderDestination) this.recorderDestination = ctx.createMediaStreamDestination();
    node.connect(this.recorderDestination);
  }

  public async playVoiceWav(wav: ArrayBuffer): Promise<void> {
    const ctx = this.getContext();
    await ctx.resume();
    const buffer = await ctx.decodeAudioData(wav.slice(0));
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.85;
    source.connect(gain);
    this.connectOutput(gain);
    await new Promise<void>((resolve, reject) => {
      source.onended = () => resolve();
      try { source.start(); } catch (error) { reject(error); }
    });
    source.disconnect();
    gain.disconnect();
  }

  public playRewardDing() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      this.connectOutput(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Ignore
    }
  }

  public playBuzzerHit() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      this.connectOutput(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Ignore
    }
  }

  public playCountdownBeep(isFinal: boolean = false) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = isFinal ? 880 : 440;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.4 : 0.15));
      osc.connect(gain);
      this.connectOutput(gain);
      osc.start();
      osc.stop(ctx.currentTime + (isFinal ? 0.4 : 0.15));
    } catch {
      // Ignore
    }
  }

  public playVictoryFanfare() {
    try {
      const ctx = this.getContext();
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4);
        osc.connect(gain);
        this.connectOutput(gain);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
      });
    } catch {
      // Ignore
    }
  }

  public playPenaltySound() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      this.connectOutput(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Ignore
    }
  }

  public playWhooshTransition() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      osc.connect(gain);
      this.connectOutput(gain);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch {
      // Ignore
    }
  }

  // Compatibility aliases
  public playRewardSound = () => this.playRewardDing();
  public playRoundStartSound = () => this.playWhooshTransition();
}

export const showAudioEngine = new ShowAudioEngine();
