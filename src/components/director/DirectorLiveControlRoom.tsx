import React, { useState } from 'react';
import { GameState, GameRound, PublicBroadcastState } from '../../types/game';
import { PhoneCompetitorOutput } from '../broadcast/PhoneCompetitorOutput';
import { RealVideoOverlayHud } from '../broadcast/RealVideoOverlayHud';
import { DEFAULT_SAFE_GUIDES } from '../../types/broadcastLayout';
import { showAudioEngine } from '../../utils/showAudioEngine';
import { voiceCueEngine } from '../../engine/voiceCueEngine';
import { CinematicAnimationPayload } from '../../types/showEngine';
import {
  Play,
  Square,
  Pause,
  RotateCcw,
  FastForward,
  Smartphone,
  Tv,
  Radio,
  Flame,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface DirectorLiveControlRoomProps {
  gameState: GameState;
  currentRound: GameRound;
  publicState: PublicBroadcastState;
  onStartTimer: (seconds: number) => void;
  onStopTimer: () => void;
  onTogglePause: () => void;
  onResetRound: () => void;
  onNextStageOrRound: () => void;
  onTriggerCinematic?: (payload: CinematicAnimationPayload) => void;
  onAddJournalLog?: (category: string, text: string) => void;
  className?: string;
}

export const DirectorLiveControlRoom: React.FC<DirectorLiveControlRoomProps> = ({
  gameState,
  currentRound,
  publicState,
  onStartTimer,
  onStopTimer,
  onTogglePause,
  onResetRound,
  onNextStageOrRound,
  onTriggerCinematic,
  onAddJournalLog,
  className = '',
}) => {
  // Live Output Preview Mode: Default to PHONE/CAMERA SCREEN as requested
  const [previewScreenMode, setPreviewScreenMode] = useState<'PHONE' | 'BROADCAST'>('PHONE');

  /**
   * BIG PRODUCTION ACTION: START ROUND
   * Triggers:
   * 1. timer
   * 2. score tracking
   * 3. animation
   * 4. SFX
   * 5. voice cue
   */
  const handleStartRound = async () => {
    // 1. Timer: Start deterministic countdown
    onStartTimer(currentRound.defaultTimerSeconds);

    // 2. Score tracking: Journal log
    if (onAddJournalLog) {
      onAddJournalLog('ROUND', `آغاز رسمی راند ${currentRound.number}: «${currentRound.persianTitle}»`);
    }

    // 3. Animation: Cinematic Round Start banner
    if (onTriggerCinematic) {
      onTriggerCinematic({
        type: 'ROUND_START',
        message: `${currentRound.persianTitle} (راند ${currentRound.number})`,
        timestamp: Date.now(),
        soundEffect: 'countdown_beep',
        transition: 'zoom_pulse',
      });
    }

    // 4. SFX: High-energy countdown beep
    showAudioEngine.playCountdownBeep(true);

    // 5. Voice cue: Execute prepared script for current round
    const cueId = `cue_round_${currentRound.number}_start`;
    await voiceCueEngine.playById(cueId);
  };

  /**
   * STOP ROUND: Stop timer, buzzer SFX, journal log, stop voice cue
   */
  const handleStopRound = async () => {
    onStopTimer();
    showAudioEngine.playBuzzer();
    if (onAddJournalLog) {
      onAddJournalLog('ROUND', `توقف راند ${currentRound.number} توسط کارگردان`);
    }
    if (onTriggerCinematic) {
      onTriggerCinematic({
        type: 'WARNING',
        message: 'پایان وقت و توقف مسابقه!',
        timestamp: Date.now(),
        soundEffect: 'buzzer',
        transition: 'flash_glitch',
      });
    }
    await voiceCueEngine.playById('cue_stop_round');
  };

  /**
   * PAUSE / RESUME
   */
  const handlePauseToggle = () => {
    onTogglePause();
    showAudioEngine.playCountdownBeep(false);
  };

  /**
   * RESET
   */
  const handleReset = () => {
    onResetRound();
    showAudioEngine.playCountdownBeep(false);
    if (onAddJournalLog) {
      onAddJournalLog('SYSTEM', `ریست تایمر و وضعیت راند ${currentRound.number}`);
    }
  };

  /**
   * NEXT STAGE / NEXT ROUND
   */
  const handleNextStage = () => {
    onNextStageOrRound();
    showAudioEngine.playRewardDing();
    if (onTriggerCinematic) {
      onTriggerCinematic({
        type: 'TRANSITION',
        message: 'مرحله بعدی چالش!',
        timestamp: Date.now(),
        soundEffect: 'reward_ding',
        transition: 'slide_up',
      });
    }
  };

  return (
    <div
      id="director-live-control-room"
      className={`w-full bg-neutral-950 border-2 border-amber-500/60 rounded-3xl p-3.5 sm:p-5 shadow-2xl flex flex-col gap-4 ${className}`}
      dir="rtl"
    >
      {/* Control Room Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black shadow-lg">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="font-['Vazirmatn'] font-black text-base text-yellow-300 flex items-center gap-2">
              <span>اتاق کنترل مسابقه داداش‌مد (SHOW ENGINE CONTROL ROOM)</span>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] font-mono font-bold animate-pulse">
                ● LIVE MONITOR
              </span>
            </div>
            <div className="text-xs text-neutral-400 font-['Vazirmatn']">
              پیش‌نمایش خروجی زنده صحنه و کلیدهای اصلی فرمان مسابقه
            </div>
          </div>
        </div>

        {/* Live Preview Screen Switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => setPreviewScreenMode('PHONE')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold ${
              previewScreenMode === 'PHONE'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>نمایشگر گوشی شرکت‌کننده</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewScreenMode('BROADCAST')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-bold ${
              previewScreenMode === 'BROADCAST'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>اورلی ۱۶:۹ برودکست</span>
          </button>
        </div>
      </div>

      {/* 1. LIVE OUTPUT PREVIEW (Exactly what is on the phone/camera screen) */}
      <div className="w-full bg-black border-2 border-neutral-800 rounded-2xl p-2.5 sm:p-3 relative overflow-hidden shadow-inner flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2 px-1 border-b border-neutral-800/80 pb-1.5">
          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE OUTPUT PREVIEW (خروجی مستقیم استیج)</span>
          </span>
          <span className="text-neutral-400">
            {previewScreenMode === 'PHONE' ? 'PORTRAIT PHONE MONITOR' : '16:9 BROADCAST OVERLAY'}
          </span>
        </div>

        {/* The Live Rendered Output */}
        <div className="w-full flex justify-center items-center py-1">
          {previewScreenMode === 'PHONE' ? (
            <div className="w-full max-w-sm border-4 border-neutral-800 rounded-3xl overflow-hidden shadow-2xl bg-black">
              <PhoneCompetitorOutput publicState={publicState} />
            </div>
          ) : (
            <div className="w-full aspect-video max-w-xl border-2 border-cyan-500/40 rounded-xl overflow-hidden relative bg-black/90 shadow-2xl">
              <RealVideoOverlayHud publicState={publicState} safeGuides={DEFAULT_SAFE_GUIDES} />
            </div>
          )}
        </div>
      </div>

      {/* 2. LARGE PRODUCTION BUTTONS (START, STOP, PAUSE, RESET, NEXT STAGE) */}
      <div className="w-full flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between text-xs font-['Vazirmatn'] font-bold text-neutral-300 px-1">
          <span className="flex items-center gap-1.5 text-yellow-400">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>کلیدهای اصلی تولید مسابقه (PRODUCTION SWITCHBOARD):</span>
          </span>
          <span className="font-mono text-[11px] text-neutral-400">
            راند جاری: {currentRound.number} | زمان: {gameState.timerSecondsRemaining}s
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* 1. START ROUND (Big Green/Gold action) */}
          <button
            type="button"
            id="btn-production-start-round"
            onClick={handleStartRound}
            className="sm:col-span-1 col-span-2 py-4 px-3 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-400 hover:from-emerald-400 hover:to-green-300 text-black font-black text-sm rounded-2xl shadow-[0_0_24px_rgba(16,185,129,0.5)] active:scale-95 transition-all flex flex-col items-center justify-center gap-1 border-2 border-emerald-300"
          >
            <div className="flex items-center gap-1.5 text-base">
              <Play className="w-5 h-5 fill-black" />
              <span>START ROUND</span>
            </div>
            <span className="text-[10px] font-mono font-bold tracking-tight opacity-90">
              تایمر + انیمیشن + صدا + SFX
            </span>
          </button>

          {/* 2. STOP ROUND (Big Red action) */}
          <button
            type="button"
            id="btn-production-stop-round"
            onClick={handleStopRound}
            className="py-4 px-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm rounded-2xl shadow-[0_0_18px_rgba(225,29,72,0.4)] active:scale-95 transition-all flex flex-col items-center justify-center gap-1 border-2 border-red-500/60"
          >
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 fill-white" />
              <span>STOP ROUND</span>
            </div>
            <span className="text-[10px] font-mono text-red-200">
              توقف فوری + بوق
            </span>
          </button>

          {/* 3. PAUSE / RESUME */}
          <button
            type="button"
            id="btn-production-pause"
            onClick={handlePauseToggle}
            className={`py-4 px-3 rounded-2xl font-black text-sm shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1 border-2 ${
              gameState.isPaused
                ? 'bg-amber-400 text-black border-amber-300 animate-pulse'
                : 'bg-neutral-800 hover:bg-neutral-700 text-amber-300 border-amber-500/40'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Pause className="w-4 h-4" />
              <span>{gameState.isPaused ? 'RESUME' : 'PAUSE'}</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">
              {gameState.isPaused ? 'ادامه زمان' : 'مکث تایمر'}
            </span>
          </button>

          {/* 4. RESET */}
          <button
            type="button"
            id="btn-production-reset"
            onClick={handleReset}
            className="py-4 px-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-2 border-neutral-700 rounded-2xl font-black text-sm shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
          >
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>RESET</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              بازنشانی تایمر
            </span>
          </button>

          {/* 5. NEXT STAGE */}
          <button
            type="button"
            id="btn-production-next-stage"
            onClick={handleNextStage}
            className="py-4 px-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-sm rounded-2xl shadow-[0_0_18px_rgba(6,182,212,0.4)] active:scale-95 transition-all flex flex-col items-center justify-center gap-1 border-2 border-cyan-400/60"
          >
            <div className="flex items-center gap-1.5">
              <FastForward className="w-4 h-4" />
              <span>NEXT STAGE</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-200">
              مرحله بعدی چالش
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
