import { FC, useState } from 'react';
import { GameRound, ValidationState, PlayerId, Round2State, DistanceChoice, Round3State, Round4State, Round4Stage, Round5State, Round5Choice, Round6State } from '../types/game';
import { Play, Square, Pause, AlertCircle, Timer, CheckCircle2, XCircle, ShieldAlert, Sparkles, Lock, Target, Video, RotateCcw, Gift, Utensils, HelpCircle, ShieldCheck, Flame, Zap, Flag, Layers, Puzzle, Trophy, ArrowRight, Check, Key, Unlock } from 'lucide-react';

interface TimerDisplayProps {
  secondsRemaining: number;
  initialSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  currentRound: GameRound;
  isUnderReview: boolean;
  validation?: ValidationState;
  round2?: Round2State;
  round3?: Round3State;
  round4?: Round4State;
  round5?: Round5State;
  round6?: Round6State;
  onStartTimer: (sec?: number) => void;
  onStopTimer: () => void;
  onTogglePause: () => void;
  onStartValidation?: (player: PlayerId, seconds?: number) => void;
  onCancelValidation?: (reason?: string) => void;
  onCallFoul?: (player: PlayerId, reason?: string) => void;
  onLockChoice?: (player: PlayerId, distance: string) => void;
  onRecordBasket?: (player: PlayerId, result: 'hit' | 'miss') => void;
  onRequestReview?: (reason: string) => void;
  onResetRound2?: (player?: PlayerId) => void;
  onLockMysteryBite?: (player: PlayerId, boxNumber: number) => void;
  onRevealMysteryBite?: (boxNumber?: number) => void;
  onResetRound3?: () => void;
  onAdvanceRound4Stage?: (player: PlayerId, stage?: Round4Stage | string) => void;
  onResetRound4?: (player?: PlayerId) => void;
  onLockRound5Choice?: (player: PlayerId, mode: Round5Choice) => void;
  onRecordRound5Result?: (player: PlayerId, outcome: 'success' | 'failure') => void;
  onResetRound5?: (player?: PlayerId) => void;
  onAdvanceFinalStage?: (stage: number) => void;
  onIssueCode?: (stage: number, code: string) => void;
  onUnlockCase?: (code: string) => void;
}

export const TimerDisplay: FC<TimerDisplayProps> = ({
  secondsRemaining,
  initialSeconds,
  isRunning,
  isPaused,
  currentRound,
  isUnderReview,
  validation,
  round2,
  round3,
  round5,
  onStartTimer,
  onStopTimer,
  onTogglePause,
  onStartValidation,
  onCancelValidation,
  onCallFoul,
  onLockChoice,
  onRecordBasket,
  onRequestReview,
  onResetRound2,
  onLockMysteryBite,
  onRevealMysteryBite,
  onResetRound3,
  round4,
  onAdvanceRound4Stage,
  onResetRound4,
  onLockRound5Choice,
  onRecordRound5Result,
  onResetRound5,
  round6,
  onAdvanceFinalStage,
  onIssueCode,
  onUnlockCase,
}) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = initialSeconds > 0
    ? Math.max(0, Math.min(100, (secondsRemaining / initialSeconds) * 100))
    : 0;

  const isLowTime = secondsRemaining <= 5 && secondsRemaining > 0;
  const isExpired = secondsRemaining === 0;
  const isRound1 = currentRound.id === 'round_1_cup_tower' || currentRound.number === 1;
  const isRound2 = currentRound.id === 'round_2_choose_distance' || currentRound.number === 2;
  const isRound3 = currentRound.id.includes('round_3') || currentRound.number === 3;
  const isRound4 = currentRound.id.includes('round_4') || currentRound.number === 4;
  const isRound5 = currentRound.id.includes('round_5') || currentRound.number === 5;
  const isRound6 = currentRound.id.includes('round_6') || currentRound.number === 6;

  const [caseInputCode, setCaseInputCode] = useState('');

  const [tempDistance, setTempDistance] = useState<{ ELIAS: DistanceChoice; EMAD: DistanceChoice }>({
    ELIAS: 'YELLOW',
    EMAD: 'YELLOW',
  });

  const [tempRound5Choice, setTempRound5Choice] = useState<{ ELIAS: Round5Choice; EMAD: Round5Choice }>({
    ELIAS: 'SAFE',
    EMAD: 'SAFE',
  });

  const [selectedRound3Player, setSelectedRound3Player] = useState<PlayerId>('ELIAS');

  return (
    <section id="timer-round-section" className="w-full flex flex-col gap-2">
      {/* Current Round Name Banner */}
      <div className="w-full bg-neutral-900 border-2 border-neutral-700 rounded-xl p-2.5 shadow-md flex items-center justify-between">
        <div className="flex-1">
          <div className="text-[11px] font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span>{currentRound.title}</span>
          </div>
          <h2 className="text-sm sm:text-base font-black text-white font-['Vazirmatn'] mt-0.5 truncate">
            {currentRound.persianTitle}
          </h2>
        </div>
        <div className="bg-yellow-400 text-black font-black text-xs px-2.5 py-1 rounded-lg shrink-0 ml-2">
          راند {currentRound.number} از ۶
        </div>
      </div>

      {/* 2-Second Validation Active Banner (If running or just succeeded) */}
      {validation?.isValidating && (
        <div
          id="validation-timer-card"
          className="w-full bg-amber-950 border-3 border-amber-400 rounded-2xl p-3.5 shadow-[0_0_30px_rgba(251,191,36,0.6)] flex flex-col items-center justify-center animate-pulse"
        >
          <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase tracking-wider">
            <Timer className="w-4 h-4 animate-spin text-amber-300" />
            <span>بررسی ۲ ثانیه پایداری برج لیوان (2s VALIDATION)</span>
          </div>

          <div className="flex items-center gap-3 my-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                validation.player === 'ELIAS' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {validation.player === 'ELIAS' ? '🔴 الیاس (ELIAS)' : '🟢 عماد (EMAD)'}
            </span>
            <span className="font-mono text-4xl sm:text-5xl font-black text-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,1)]">
              {validation.secondsRemaining}s
            </span>
          </div>

          <p className="text-xs text-amber-200 font-bold font-['Vazirmatn'] mb-2">
            برج باید ۲ ثانیه کامل بدون حرکت بایستد تا ۱۰+ ثانیه جایزه واریز شود!
          </p>

          <div className="flex items-center gap-2 w-full">
            <button
              type="button"
              onClick={() => onCancelValidation?.('برج سقوط کرد')}
              className="flex-1 py-2 bg-red-800 hover:bg-red-700 text-white font-bold text-xs rounded-xl border border-red-500 flex items-center justify-center gap-1 transition"
            >
              <XCircle className="w-4 h-4" />
              سقوط برج / ناموفق
            </button>
            <button
              type="button"
              onClick={() => validation.player && onCallFoul?.(validation.player, 'استفاده از دست دوم')}
              className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/80 flex items-center justify-center gap-1 transition"
            >
              <ShieldAlert className="w-4 h-4" />
              خطای دست دوم
            </button>
          </div>
        </div>
      )}

      {/* Large Current Countdown Timer Display */}
      <div
        id="main-timer-card"
        className={`relative w-full rounded-2xl p-4 flex flex-col items-center justify-center border-3 transition-all ${
          isUnderReview
            ? 'bg-neutral-950 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.4)]'
            : isLowTime
            ? 'bg-red-950 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.7)] animate-pulse'
            : isExpired
            ? 'bg-neutral-950 border-neutral-700'
            : 'bg-black border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.5)]'
        }`}
      >
        {/* State Label */}
        <div className="w-full flex items-center justify-between text-xs font-bold mb-1">
          <span className="text-neutral-400 uppercase tracking-wider">
            {isUnderReview
              ? '🔒 VAR FREEZE'
              : isPaused
              ? '⏸ PAUSED'
              : isRunning
              ? '⚡ COUNTDOWN ACTIVE'
              : '⏹ STANDBY'}
          </span>
          <span className="text-yellow-400 font-mono text-xs">
            {progressPercent.toFixed(0)}% باقی‌مانده
          </span>
        </div>

        {/* The Huge Daylight-Readable Timer Numbers */}
        <div className="my-1 flex items-baseline justify-center">
          <span
            className={`font-mono text-6xl sm:text-8xl font-black tracking-tight drop-shadow-[0_4px_15px_rgba(0,0,0,1)] ${
              isUnderReview
                ? 'text-yellow-300'
                : isLowTime
                ? 'text-red-400'
                : isExpired
                ? 'text-neutral-500'
                : 'text-amber-400'
            }`}
          >
            {formattedTime}
          </span>
        </div>

        {/* Timer Progress Bar */}
        <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden my-2 border border-neutral-700">
          <div
            className={`h-full transition-all duration-300 ${
              isLowTime ? 'bg-red-500' : 'bg-yellow-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick inline timer controls */}
        <div className="w-full flex items-center justify-center gap-2 mt-1">
          {!isRunning ? (
            <button
              id="btn-timer-start-inline"
              type="button"
              disabled={isUnderReview}
              onClick={() => onStartTimer(currentRound.defaultTimerSeconds)}
              className="flex-1 py-2 bg-yellow-400 hover:bg-yellow-300 active:scale-95 disabled:opacity-40 text-black font-black text-xs sm:text-sm rounded-lg shadow uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
            >
              <Play className="w-4 h-4 fill-black" />
              شروع تایمر ({currentRound.defaultTimerSeconds}s)
            </button>
          ) : (
            <>
              <button
                id="btn-timer-pause-inline"
                type="button"
                onClick={onTogglePause}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-black text-xs rounded-lg border border-neutral-600 flex items-center justify-center gap-1 transition"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'ادامه' : 'مکث'}
              </button>
              <button
                id="btn-timer-stop-inline"
                type="button"
                onClick={onStopTimer}
                className="flex-1 py-2 bg-red-800 hover:bg-red-700 active:scale-95 text-white font-black text-xs rounded-lg border border-red-500 flex items-center justify-center gap-1 transition"
              >
                <Square className="w-4 h-4 fill-white" />
                توقف
              </button>
            </>
          )}

          {/* Quick preset timers */}
          <button
            id="btn-preset-30"
            type="button"
            disabled={isUnderReview}
            onClick={() => onStartTimer(30)}
            className="px-2 py-2 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-yellow-400 font-black text-xs rounded-lg border border-neutral-700"
            title="Start 30s timer"
          >
            30s
          </button>
          <button
            id="btn-preset-15"
            type="button"
            disabled={isUnderReview}
            onClick={() => onStartTimer(15)}
            className="px-2 py-2 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-yellow-400 font-black text-xs rounded-lg border border-neutral-700"
            title="Start 15s timer"
          >
            15s
          </button>
        </div>
      </div>

      {/* Dedicated ROUND 1 Cup Tower Action Engine Controls */}
      {isRound1 && (
        <div
          id="round1-cup-tower-controls"
          className="w-full bg-neutral-900 border-2 border-yellow-400/80 rounded-xl p-3 shadow-lg flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-yellow-400 uppercase">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>موتور راند ۱: بررسی پایداری برج ۲ ثانیه‌ای (+۱۰ ثانیه)</span>
            </div>
            <span className="text-[11px] font-mono bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded">
              +10 SEC
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-validate-tower-elias"
              type="button"
              disabled={isUnderReview || validation?.isValidating}
              onClick={() => onStartValidation?.('ELIAS', 2)}
              className="py-2.5 px-2 bg-red-950/80 hover:bg-red-900 active:scale-95 disabled:opacity-50 border-2 border-red-500 rounded-xl text-white font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow transition"
            >
              <span className="flex items-center gap-1 font-black text-red-400">
                <Timer className="w-3.5 h-3.5" />
                بررسی ۲ ثانیه الیاس
              </span>
              <span className="text-[10px] text-neutral-300 font-normal">سرپا ماندن برج (قرمز)</span>
            </button>

            <button
              id="btn-validate-tower-emad"
              type="button"
              disabled={isUnderReview || validation?.isValidating}
              onClick={() => onStartValidation?.('EMAD', 2)}
              className="py-2.5 px-2 bg-emerald-950/80 hover:bg-emerald-900 active:scale-95 disabled:opacity-50 border-2 border-emerald-500 rounded-xl text-white font-bold text-xs flex flex-col items-center justify-center gap-0.5 shadow transition"
            >
              <span className="flex items-center gap-1 font-black text-emerald-400">
                <Timer className="w-3.5 h-3.5" />
                بررسی ۲ ثانیه عماد
              </span>
              <span className="text-[10px] text-neutral-300 font-normal">سرپا ماندن برج (سبز)</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-bold">ثبت خطای دست دوم:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onCallFoul?.('ELIAS', 'استفاده از دست دوم')}
                className="px-2 py-1 bg-red-900/60 hover:bg-red-800 text-red-200 text-[11px] font-bold rounded-lg border border-red-600 active:scale-95 transition"
              >
                خطا الیاس
              </button>
              <button
                type="button"
                onClick={() => onCallFoul?.('EMAD', 'استفاده از دست دوم')}
                className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-bold rounded-lg border border-emerald-600 active:scale-95 transition"
              >
                خطا عماد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated ROUND 2 Choose Your Distance Engine Controls */}
      {isRound2 && (
        <div
          id="round2-distance-controls"
          className="w-full bg-neutral-900 border-2 border-amber-400/90 rounded-xl p-3 shadow-lg flex flex-col gap-3 font-['Vazirmatn']"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-1">
                  <span>موتور راند ۲: فاصله را انتخاب کن</span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-bold">
                  انتخاب فاصله قبل از پرتاب اول • غیرقابل تغییر پس از قفل • ۳ پرتاب
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.5 rounded">
                G:+5s
              </span>
              <span className="text-[10px] font-mono bg-yellow-950 text-yellow-300 border border-yellow-500/50 px-1.5 py-0.5 rounded">
                Y:+10s
              </span>
              <span className="text-[10px] font-mono bg-red-950 text-red-300 border border-red-500/50 px-1.5 py-0.5 rounded">
                R:+20s
              </span>
            </div>
          </div>

          {/* Two Player Panels (Elias and Emad) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(['ELIAS', 'EMAD'] as PlayerId[]).map(player => {
              const isElias = player === 'ELIAS';
              const pData = round2?.[player] || { choice: null, isLocked: false, attempts: [], maxAttempts: 3 };
              const currentChoice = pData.choice || tempDistance[player];
              const attemptsCount = pData.attempts?.length || 0;
              const hitsCount = pData.attempts?.filter(a => a === 'hit').length || 0;
              const isDone = attemptsCount >= 3;

              return (
                <div
                  key={player}
                  className={`rounded-xl p-2.5 border-2 flex flex-col gap-2 ${
                    isElias
                      ? 'bg-red-950/40 border-red-600/70 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                      : 'bg-emerald-950/40 border-emerald-600/70 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  }`}
                >
                  {/* Player header */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black flex items-center gap-1 ${isElias ? 'text-red-400' : 'text-emerald-400'}`}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isElias ? '#ef4444' : '#10b981' }} />
                      {isElias ? 'الیاس (ELIAS - قرمز)' : 'عماد (EMAD - سبز)'}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-neutral-700 text-neutral-300">
                      {attemptsCount}/3 پرتاب
                    </span>
                  </div>

                  {/* Distance Selection / Lock Status */}
                  {!pData.isLocked ? (
                    <div className="flex flex-col gap-1.5 bg-black/50 p-2 rounded-lg border border-neutral-800">
                      <span className="text-[11px] text-neutral-300 font-bold">۱. انتخاب فاصله پرتاب:</span>
                      <div className="grid grid-cols-3 gap-1">
                        {(['GREEN', 'YELLOW', 'RED'] as DistanceChoice[]).map(d => {
                          const isSelected = currentChoice === d;
                          const labels: Record<DistanceChoice, string> = {
                            GREEN: 'سبز (+۵)',
                            YELLOW: 'زرد (+۱۰)',
                            RED: 'قرمز (+۲۰)',
                          };
                          const colors: Record<DistanceChoice, string> = {
                            GREEN: isSelected ? 'bg-emerald-600 text-white font-black border-emerald-400 ring-2 ring-emerald-400' : 'bg-neutral-900 text-emerald-400 border-emerald-900',
                            YELLOW: isSelected ? 'bg-yellow-500 text-black font-black border-yellow-300 ring-2 ring-yellow-400' : 'bg-neutral-900 text-yellow-400 border-yellow-900',
                            RED: isSelected ? 'bg-red-600 text-white font-black border-red-400 ring-2 ring-red-400' : 'bg-neutral-900 text-red-400 border-red-900',
                          };
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setTempDistance(prev => ({ ...prev, [player]: d }))}
                              className={`py-1.5 text-[10px] sm:text-xs rounded-md border font-bold transition active:scale-95 ${colors[d]}`}
                            >
                              {labels[d]}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        disabled={isUnderReview}
                        onClick={() => onLockChoice?.(player, currentChoice)}
                        className={`w-full py-1.5 mt-0.5 rounded-md font-black text-xs flex items-center justify-center gap-1 shadow active:scale-95 transition ${
                          isElias
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        قفل کردن انتخاب ({currentChoice})
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="bg-black/70 border border-amber-400/50 rounded-lg p-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-black text-amber-300">
                            فاصله: {pData.choice === 'GREEN' ? 'سبز (+۵ث)' : pData.choice === 'YELLOW' ? 'زرد (+۱۰ث)' : 'قرمز (+۲۰ث)'}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 bg-neutral-900 px-1 rounded">قفل شده</span>
                      </div>
                    </div>
                  )}

                  {/* 3 Attempts Result Visualizer */}
                  <div className="flex flex-col gap-1 bg-black/40 p-2 rounded-lg border border-neutral-800">
                    <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400">
                      <span>پرتاب‌های بازیکن (۳ پرتاب):</span>
                      <span className="text-amber-400 font-mono">{hitsCount} گل</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 my-0.5">
                      {[0, 1, 2].map(idx => {
                        const attempt = pData.attempts?.[idx];
                        if (attempt === 'hit') {
                          return (
                            <div key={idx} className="bg-emerald-950 border border-emerald-500 rounded p-1 text-center">
                              <span className="text-[10px] text-emerald-400 font-black block">پرتاب {idx + 1}</span>
                              <span className="text-xs font-black text-emerald-300">🏀 گل شد</span>
                            </div>
                          );
                        }
                        if (attempt === 'miss') {
                          return (
                            <div key={idx} className="bg-neutral-900 border border-red-900/60 rounded p-1 text-center">
                              <span className="text-[10px] text-neutral-500 font-bold block">پرتاب {idx + 1}</span>
                              <span className="text-xs font-bold text-red-400">❌ خراب</span>
                            </div>
                          );
                        }
                        return (
                          <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded p-1 text-center opacity-60">
                            <span className="text-[10px] text-neutral-600 block">پرتاب {idx + 1}</span>
                            <span className="text-[11px] text-neutral-500 font-mono">---</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Attempt Action Buttons (Only available if locked and not finished) */}
                    {pData.isLocked && !isDone && (
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        <button
                          type="button"
                          disabled={isUnderReview}
                          onClick={() => onRecordBasket?.(player, 'hit')}
                          className="py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 text-white font-black text-xs rounded-md shadow flex items-center justify-center gap-1 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          گل شد (+{pData.choice === 'GREEN' ? 5 : pData.choice === 'YELLOW' ? 10 : 20}s)
                        </button>
                        <button
                          type="button"
                          disabled={isUnderReview}
                          onClick={() => onRecordBasket?.(player, 'miss')}
                          className="py-1.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 disabled:opacity-40 text-neutral-200 font-bold text-xs rounded-md border border-neutral-700 flex items-center justify-center gap-1 transition"
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          خراب شد (Miss)
                        </button>
                      </div>
                    )}

                    {isDone && (
                      <div className="w-full text-center py-1 bg-amber-950/40 border border-amber-500/40 rounded text-[11px] text-amber-300 font-bold">
                        پایان ۳ پرتاب {isElias ? 'الیاس' : 'عماد'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* VAR Review Button for ambiguous baskets */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800">
            <span className="text-[11px] text-neutral-400 font-bold">
              نتیجه پرتاب یا سبد واضح نیست؟
            </span>
            <button
              type="button"
              onClick={() => onRequestReview?.('نتیجه سبد / پرتاب از نظر تصویری واضح نیست (VAR Review)')}
              className="px-2.5 py-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-500 text-purple-300 text-xs font-black rounded-lg flex items-center gap-1 shadow active:scale-95 transition"
            >
              <Video className="w-3.5 h-3.5" />
              درخواست بازبینی VAR سبد (request_review)
            </button>
          </div>
        </div>
      )}

      {/* Dedicated ROUND 3 Mystery Bite Engine Controls */}
      {isRound3 && round3 && (
        <div
          id="round3-mystery-bite-controls"
          className="w-full bg-neutral-900 border-2 border-amber-500/80 rounded-xl p-3 shadow-lg flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>موتور راند ۳: لقمه مرموز (جعبه‌های ۱ تا ۶)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700 px-2 py-0.5 rounded flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-yellow-400" />
                توزیع پنهان از داور
              </span>
              {onResetRound3 && (
                <button
                  type="button"
                  onClick={onResetRound3}
                  className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition"
                  title="بر زدن مجدد جعبه‌ها"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Outcome rules breakdown */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-black">
            <div className="bg-green-950/60 border border-green-700/60 text-green-300 py-1 px-2 rounded-lg">
              ۲ جعبه: <span className="text-green-400 font-mono font-extrabold">+15 SEC</span>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/60 text-purple-300 py-1 px-2 rounded-lg">
              ۱ جعبه: <span className="text-purple-400 font-mono font-extrabold">STEAL 5s</span>
            </div>
            <div className="bg-neutral-800/80 border border-neutral-700 text-neutral-400 py-1 px-2 rounded-lg">
              ۳ جعبه: <span className="text-neutral-300 font-mono font-extrabold">BLANK (پوچ)</span>
            </div>
          </div>

          {/* Player Selector for next choice */}
          <div className="flex items-center justify-between bg-neutral-950/80 p-2 rounded-lg border border-neutral-800">
            <span className="text-xs font-bold text-neutral-300">
              نوبت انتخاب بازیکن:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedRound3Player('ELIAS')}
                className={`px-3 py-1 text-xs font-black rounded-md transition ${
                  selectedRound3Player === 'ELIAS'
                    ? 'bg-red-600 text-white shadow ring-2 ring-red-400'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                🔴 الیاس (قرمز)
              </button>
              <button
                type="button"
                onClick={() => setSelectedRound3Player('EMAD')}
                className={`px-3 py-1 text-xs font-black rounded-md transition ${
                  selectedRound3Player === 'EMAD'
                    ? 'bg-green-600 text-white shadow ring-2 ring-green-400'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                🟢 عماد (سبز)
              </button>
            </div>
          </div>

          {/* 6 Mystery Boxes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {round3.boxes.map((box) => {
              const isLocked = box.isLocked;
              const isRevealed = box.isRevealed;
              const chosenBy = box.chosenBy;
              const isChosenByElias = chosenBy === 'ELIAS';

              return (
                <div
                  key={box.boxNumber}
                  id={`mystery-box-${box.boxNumber}`}
                  className={`relative p-2.5 rounded-xl border flex flex-col justify-between min-h-[120px] transition-all duration-200 ${
                    isRevealed
                      ? box.outcome === 'PLUS_15'
                        ? 'bg-green-950/80 border-green-500 shadow-md shadow-green-950'
                        : box.outcome === 'STEAL_5'
                        ? 'bg-purple-950/80 border-purple-500 shadow-md shadow-purple-950'
                        : 'bg-neutral-900 border-neutral-700 text-neutral-400'
                      : isLocked
                      ? isChosenByElias
                        ? 'bg-red-950/70 border-red-500 animate-pulse'
                        : 'bg-green-950/70 border-green-500 animate-pulse'
                      : 'bg-neutral-950 border-amber-500/40 hover:border-amber-400 hover:bg-neutral-800/40'
                  }`}
                >
                  {/* Top: Box number & Lock status */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                      جعبه #{box.boxNumber}
                    </span>
                    {isLocked && !isRevealed && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                        isChosenByElias ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-green-500/20 text-green-400 border border-green-500/40'
                      }`}>
                        <Lock className="w-2.5 h-2.5" />
                        {isChosenByElias ? 'الیاس' : 'عماد'}
                      </span>
                    )}
                    {isRevealed && (
                      <span className="text-[10px] font-bold text-neutral-400">
                        افشا شده
                      </span>
                    )}
                  </div>

                  {/* Center: Content / Status */}
                  <div className="my-2 flex flex-col items-center justify-center text-center">
                    {isRevealed ? (
                      <div>
                        {box.outcome === 'PLUS_15' && (
                          <div className="text-green-400">
                            <span className="text-xl font-black font-mono block leading-none">+15s</span>
                            <span className="text-[11px] font-bold">۱۵+ ثانیه طلایی!</span>
                          </div>
                        )}
                        {box.outcome === 'STEAL_5' && (
                          <div className="text-purple-300">
                            <span className="text-lg font-black font-mono block leading-none">STEAL 5s</span>
                            <span className="text-[11px] font-bold">دزدی ۵ ثانیه!</span>
                          </div>
                        )}
                        {box.outcome === 'BLANK' && (
                          <div className="text-neutral-400">
                            <span className="text-lg font-black font-mono block leading-none">BLANK</span>
                            <span className="text-[11px] font-bold">پوچ!</span>
                          </div>
                        )}
                      </div>
                    ) : isLocked ? (
                      <div className="text-center">
                        <Utensils className="w-5 h-5 mx-auto text-amber-300 mb-0.5 animate-bounce" />
                        <span className="text-[11px] font-bold text-amber-200 block">
                          در حال خوردن لقمه...
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <HelpCircle className="w-6 h-6 mx-auto text-amber-500/60 mb-0.5" />
                        <span className="text-[11px] text-neutral-400">
                          محتوای پنهان
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Action buttons */}
                  <div>
                    {!isLocked && !isRevealed && (
                      <button
                        type="button"
                        id={`btn-lock-box-${box.boxNumber}`}
                        onClick={() => onLockMysteryBite?.(selectedRound3Player, box.boxNumber)}
                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-lg shadow active:scale-95 transition flex items-center justify-center gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        انتخاب و قفل
                      </button>
                    )}

                    {isLocked && !isRevealed && (
                      <button
                        type="button"
                        id={`btn-reveal-box-${box.boxNumber}`}
                        onClick={() => onRevealMysteryBite?.(box.boxNumber)}
                        className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs rounded-lg shadow-md active:scale-95 transition flex items-center justify-center gap-1 animate-pulse"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        خورد! افشای نتیجه
                      </button>
                    )}

                    {isRevealed && (
                      <div className="text-[10px] text-center text-neutral-400 font-bold py-0.5">
                        {chosenBy === 'ELIAS' ? '🔴 برای الیاس' : '🟢 برای عماد'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Last Revealed Dramatic Announcement Card */}
          {round3.lastRevealed && (
            <div
              id="round3-last-reveal-banner"
              className="bg-neutral-950 border-2 border-amber-400/90 rounded-xl p-2.5 shadow-md flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 animate-spin" />
                <div>
                  <div className="text-xs font-black text-amber-400">
                    اعلام رسمی نتیجه لقمه مرموز (جعبه #{round3.lastRevealed.boxNumber}):
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5 font-['Vazirmatn']">
                    {round3.lastRevealed.persianAnnouncement}
                  </div>
                </div>
              </div>
              <div className="shrink-0 font-mono font-black text-sm px-2 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                {round3.lastRevealed.outcome === 'PLUS_15' ? '+15 SEC' : round3.lastRevealed.outcome === 'STEAL_5' ? 'STEAL 5s' : '0 SEC'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dedicated ROUND 4 Obstacle Relay (TARGET -> CUP STACK -> CODE PUZZLE -> FINISH) */}
      {isRound4 && (
        <div
          id="round4-obstacle-relay-controls"
          className="w-full bg-neutral-900 border-2 border-cyan-500/80 rounded-xl p-3 shadow-lg flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-cyan-400 uppercase tracking-wide">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>موتور راند ۴: رله موانع سه‌گانه (TARGET ➔ CUP STACK ➔ CODE PUZZLE ➔ FINISH)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">
                جایزه: ۳۰+ ثانیه (+30 SEC)
              </span>
              {onResetRound4 && (
                <button
                  id="reset-round4-btn"
                  onClick={() => onResetRound4()}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 transition"
                  title="ریست راند ۴"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>ریست</span>
                </button>
              )}
            </div>
          </div>

          {/* Sequential Stage Map banner */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 flex items-center justify-between gap-1 overflow-x-auto text-xs">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold shrink-0">
              <Target className="w-4 h-4 text-red-400" />
              <span>۱. TARGET (سیبل)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0 rtl:rotate-180" />
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold shrink-0">
              <Layers className="w-4 h-4 text-yellow-400" />
              <span>۲. CUP STACK (برج لیوان)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0 rtl:rotate-180" />
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold shrink-0">
              <Puzzle className="w-4 h-4 text-purple-400" />
              <span>۳. CODE PUZZLE (پازل کد)</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0 rtl:rotate-180" />
            <div className="flex items-center gap-1.5 text-amber-400 font-black shrink-0">
              <Flag className="w-4 h-4 text-emerald-400" />
              <span>۴. FINISH (+30 SEC)</span>
            </div>
          </div>

          {/* Winner Banner if someone finished */}
          {round4?.winner && (
            <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-yellow-400 rounded-lg p-2.5 flex items-center justify-between gap-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
                <div>
                  <div className="text-xs font-black text-yellow-300">برنده رسمی راند ۴:</div>
                  <div className="text-sm font-black text-white">
                    {round4.winner === 'ELIAS' ? '🔴 الیاس' : '🟢 عماد'} تمام مراحل را رد کرد و برنده ۳۰+ ثانیه شد!
                  </div>
                </div>
              </div>
              <div className="text-sm font-black bg-yellow-400 text-black px-3 py-1 rounded-md shadow">
                +30 SEC
              </div>
            </div>
          )}

          {/* Both Players Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(['ELIAS', 'EMAD'] as PlayerId[]).map(player => {
              const pState = round4?.[player] || {
                currentStage: 'TARGET' as Round4Stage,
                completedStages: [],
                isFinished: false,
              };
              const isElias = player === 'ELIAS';
              const isWinner = round4?.winner === player;
              const curStage = pState.currentStage;
              const isFinished = pState.isFinished;

              const stages: { key: Round4Stage; label: string; icon: any }[] = [
                { key: 'TARGET', label: 'سیبل هدف', icon: Target },
                { key: 'CUP_STACK', label: 'برج لیوان', icon: Layers },
                { key: 'CODE_PUZZLE', label: 'پازل کد', icon: Puzzle },
                { key: 'FINISH', label: 'خط پایان', icon: Flag },
              ];

              return (
                <div
                  key={player}
                  className={`rounded-xl p-3 border-2 transition-all flex flex-col gap-2.5 ${
                    isWinner
                      ? 'bg-amber-950/40 border-yellow-400 shadow-yellow-500/20 shadow-md'
                      : isElias
                      ? 'bg-red-950/30 border-red-800/80'
                      : 'bg-emerald-950/30 border-emerald-800/80'
                  }`}
                >
                  {/* Player header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${isElias ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      <span className="font-black text-sm text-white">
                        {isElias ? 'الیاس (ELIAS)' : 'عماد (EMAD)'}
                      </span>
                    </div>
                    {isWinner && (
                      <span className="text-[11px] font-black text-yellow-300 bg-yellow-500/30 border border-yellow-400 px-2 py-0.5 rounded-full">
                        🏆 برنده ۳۰+ ثانیه
                      </span>
                    )}
                    {isFinished && !isWinner && (
                      <span className="text-[11px] font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                        به خط پایان رسید
                      </span>
                    )}
                  </div>

                  {/* Stage Progress Stepper */}
                  <div className="grid grid-cols-4 gap-1">
                    {stages.map((st) => {
                      const isComplete = pState.completedStages.includes(st.key) || (isFinished && st.key === 'FINISH');
                      const isCurrent = !isFinished && curStage === st.key;
                      const Icon = st.icon;

                      return (
                        <div
                          key={st.key}
                          className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all ${
                            isComplete
                              ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300'
                              : isCurrent
                              ? 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/50 shadow'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mb-1 ${isComplete ? 'text-emerald-400' : isCurrent ? 'text-cyan-400 animate-pulse' : 'text-neutral-600'}`} />
                          <span className="text-[10px] font-bold leading-tight line-clamp-1">{st.label}</span>
                          {isComplete && <Check className="w-3 h-3 text-emerald-400 mt-0.5" />}
                          {isCurrent && <span className="text-[9px] font-black text-cyan-400 mt-0.5">در حال انجام</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Controls for this Player */}
                  <div className="mt-1 flex flex-col gap-1.5">
                    {!isFinished ? (
                      <>
                        {curStage === 'TARGET' && (
                          <button
                            id={`r4-${player}-hit-target`}
                            onClick={() => onAdvanceRound4Stage?.(player, 'CUP_STACK')}
                            className={`w-full py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 ${
                              isElias
                                ? 'bg-red-600 hover:bg-red-500 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            <Target className="w-4 h-4" />
                            <span>🎯 اصابت به سیبل! برو به مرحله ۲ (برج لیوان)</span>
                          </button>
                        )}

                        {curStage === 'CUP_STACK' && (
                          <button
                            id={`r4-${player}-cup-stack-done`}
                            onClick={() => onAdvanceRound4Stage?.(player, 'CODE_PUZZLE')}
                            className="w-full py-2 px-3 rounded-lg font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center gap-1.5 shadow transition active:scale-95"
                          >
                            <Layers className="w-4 h-4" />
                            <span>🏆 برج لیوان کامل شد! برو به مرحله ۳ (پازل کد)</span>
                          </button>
                        )}

                        {curStage === 'CODE_PUZZLE' && (
                          <div className="flex flex-col gap-1.5 bg-neutral-950 p-2 rounded-lg border border-purple-800/60">
                            <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold">
                              <span className="flex items-center gap-1">
                                <Puzzle className="w-3.5 h-3.5 text-purple-400" />
                                معما / کد قفل مرحله ۳:
                              </span>
                              <span className="font-mono bg-purple-950 border border-purple-500/40 px-1.5 py-0.5 rounded text-purple-200">
                                {isElias ? 'رمز: 7 4 2 9' : 'رمز: 3 8 1 5'}
                              </span>
                            </div>
                            <button
                              id={`r4-${player}-solve-puzzle`}
                              onClick={() => onAdvanceRound4Stage?.(player, 'FINISH')}
                              className="w-full py-2 px-3 rounded-lg font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1.5 shadow transition active:scale-95"
                            >
                              <Puzzle className="w-4 h-4" />
                              <span>🧩 پازل کد حل شد! دویدن به سمت خط پایان</span>
                            </button>
                          </div>
                        )}

                        {curStage === 'FINISH' && (
                          <button
                            id={`r4-${player}-press-finish`}
                            onClick={() => onAdvanceRound4Stage?.(player, 'FINISH')}
                            className="w-full py-2.5 px-3 rounded-lg font-black text-sm bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black flex items-center justify-center gap-2 shadow-lg animate-pulse transition active:scale-95"
                          >
                            <Flag className="w-5 h-5" />
                            <span>🏁 زدن زنگ / عبور از خط پایان (+30 ثانیه)!</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-2 text-xs font-bold text-emerald-400 bg-emerald-950/50 rounded-lg border border-emerald-800/60">
                        {isWinner ? '🏆 برنده مسابقه و دریافت‌کننده ۳۰+ ثانیه طلایی!' : '🏁 تمام مراحل به پایان رسید.'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dedicated ROUND 5 Safe or Risk Engine Controls */}
      {isRound5 && round5 && (
        <div
          id="round5-safe-risk-controls"
          className="w-full bg-neutral-900 border-2 border-emerald-500/80 rounded-xl p-3 shadow-lg flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>موتور راند ۵: امن یا ریسک (SAFE vs RISK)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700 px-2 py-0.5 rounded flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-yellow-400" />
                Once selected: lock_choice()
              </span>
              {onResetRound5 && (
                <button
                  type="button"
                  onClick={() => onResetRound5()}
                  className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition"
                  title="بازنشانی انتخاب‌های راند ۵"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Rules Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-black">
            <div className="bg-emerald-950/70 border-2 border-emerald-600/70 text-emerald-300 py-1.5 px-2 rounded-xl flex flex-col items-center">
              <span className="flex items-center gap-1 text-emerald-400 font-extrabold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                حالت امن (SAFE)
              </span>
              <div className="text-[10px] font-mono text-emerald-200 mt-0.5">
                موفقیت: <strong className="text-emerald-300">+8 SEC</strong> • شکست: <strong className="text-neutral-400">0</strong>
              </div>
            </div>
            <div className="bg-red-950/70 border-2 border-red-600/70 text-red-300 py-1.5 px-2 rounded-xl flex flex-col items-center">
              <span className="flex items-center gap-1 text-red-400 font-extrabold text-xs">
                <Flame className="w-3.5 h-3.5" />
                حالت ریسک (RISK)
              </span>
              <div className="text-[10px] font-mono text-red-200 mt-0.5">
                موفقیت: <strong className="text-yellow-400">+25 SEC</strong> • شکست: <strong className="text-red-400">-10 SEC</strong>
              </div>
            </div>
          </div>

          {/* Player Cards: ELIAS and EMAD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(['ELIAS', 'EMAD'] as PlayerId[]).map(player => {
              const isElias = player === 'ELIAS';
              const pData = round5[player];
              const isLocked = pData.isLocked;
              const choice = pData.choice;
              const currentTemp = tempRound5Choice[player];
              const result = pData.result;
              const delta = pData.scoreDelta;

              return (
                <div
                  key={player}
                  id={`round5-card-${player.toLowerCase()}`}
                  className={`rounded-xl p-2.5 border-2 flex flex-col justify-between transition ${
                    isElias
                      ? 'bg-neutral-950 border-red-600/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                      : 'bg-neutral-950 border-emerald-600/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  }`}
                >
                  {/* Top: Player Name & Locked Badge */}
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${isElias ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      <span className="text-xs font-black text-white">
                        {isElias ? '🔴 الیاس (ELIAS)' : '🟢 عماد (EMAD)'}
                      </span>
                    </div>

                    {isLocked ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/50 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        انتخاب قفل شد
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-bold">
                        در انتظار انتخاب
                      </span>
                    )}
                  </div>

                  {/* Body: Mode Selection or Locked View */}
                  {!isLocked ? (
                    <div className="flex flex-col gap-2">
                      <div className="text-[11px] font-bold text-neutral-300 text-center">
                        انتخاب حالت قبل از شروع چالش:
                      </div>

                      {/* SAFE / RISK Selector Buttons */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setTempRound5Choice(prev => ({ ...prev, [player]: 'SAFE' }))}
                          className={`py-2 px-1.5 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                            currentTemp === 'SAFE'
                              ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50 shadow'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <span className="text-xs font-black flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            SAFE (امن)
                          </span>
                          <span className="text-[9.5px] font-mono text-emerald-400 font-bold mt-0.5">
                            +8s / 0
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTempRound5Choice(prev => ({ ...prev, [player]: 'RISK' }))}
                          className={`py-2 px-1.5 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                            currentTemp === 'RISK'
                              ? 'bg-red-950 border-red-400 text-red-200 ring-2 ring-red-500/50 shadow'
                              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <span className="text-xs font-black flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-red-400" />
                            RISK (ریسک)
                          </span>
                          <span className="text-[9.5px] font-mono text-yellow-400 font-bold mt-0.5">
                            +25s / -10s
                          </span>
                        </button>
                      </div>

                      {/* Lock Choice Button */}
                      <button
                        type="button"
                        id={`btn-lock-round5-${player.toLowerCase()}`}
                        onClick={() => onLockRound5Choice?.(player, currentTemp)}
                        className="w-full py-2 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black font-black text-xs rounded-lg shadow-md active:scale-95 transition flex items-center justify-center gap-1.5 mt-1"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        قفل کردن انتخاب (lock_choice)
                      </button>
                    </div>
                  ) : (
                    /* Locked State */
                    <div className="flex flex-col gap-2">
                      {/* Announcement Banner: Gemini says «انتخاب قفل شد.» */}
                      <div className="bg-neutral-900 border border-yellow-500/50 rounded-lg p-2 text-center">
                        <div className="text-[11px] font-black text-yellow-400 flex items-center justify-center gap-1">
                          <Lock className="w-3 h-3" />
                          «انتخاب قفل شد.»
                        </div>
                        <div className="text-xs font-black text-white mt-1 font-mono">
                          {choice === 'SAFE' ? (
                            <span className="text-emerald-400 flex items-center justify-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              حالت امن (SAFE): موفقیت ۸+ | شکست ۰
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center justify-center gap-1">
                              <Flame className="w-3.5 h-3.5" />
                              حالت ریسک (RISK): موفقیت ۲۵+ | شکست ۱۰-
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Result Recording (if not yet recorded) */}
                      {!result ? (
                        <div className="flex flex-col gap-1.5 mt-1">
                          <div className="text-[10.5px] text-center text-neutral-400 font-bold">
                            ثبت نتیجه چالش برای {isElias ? 'الیاس' : 'عماد'}:
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              id={`btn-round5-success-${player.toLowerCase()}`}
                              onClick={() => onRecordRound5Result?.(player, 'success')}
                              className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg shadow active:scale-95 transition flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              موفق شد ({choice === 'SAFE' ? '+8s' : '+25s'})
                            </button>
                            <button
                              type="button"
                              id={`btn-round5-failure-${player.toLowerCase()}`}
                              onClick={() => onRecordRound5Result?.(player, 'failure')}
                              className="py-2 bg-red-700 hover:bg-red-600 text-white font-black text-xs rounded-lg shadow active:scale-95 transition flex items-center justify-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              شکست ({choice === 'SAFE' ? '0s' : '-10s'})
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Result summary badge */
                        <div className={`p-2 rounded-lg border text-center font-bold text-xs ${
                          result === 'success'
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                            : 'bg-red-950/80 border-red-500 text-red-300'
                        }`}>
                          <div className="font-black flex items-center justify-center gap-1">
                            {result === 'success' ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>چالش با موفقیت انجام شد!</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span>چالش ناموفق بود!</span>
                              </>
                            )}
                          </div>
                          <div className="text-[11px] font-mono mt-0.5">
                            تغییر بانک زمان: <strong className="text-yellow-400">{delta !== null && delta > 0 ? `+${delta}` : delta} ثانیه</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 8. ROUND 6: THE FINAL SEQUENCE & GOLDEN CASE */}
      {isRound6 && round6 && (
        <div
          id="round6-control-panel"
          className="w-full bg-neutral-900 border-2 border-yellow-500/80 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400 animate-pulse" />
              <div className="font-['Vazirmatn'] font-black text-sm text-yellow-300">
                توالی فینال داداش‌مد و باز کردن کیف طلایی (THE FINAL SEQUENCE)
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300 border border-yellow-500/50">
              مرحله {round6.currentStage} از ۴
            </span>
          </div>

          {/* Sequence Stages Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { num: 1, name: 'نقاشی با چشم بسته', en: 'BLIND DRAWING', code: round6.codes.code1, isRev: round6.revealedCodes.code1 },
              { num: 2, name: 'ساخت از حافظه', en: 'MEMORY BUILD', code: round6.codes.code2, isRev: round6.revealedCodes.code2 },
              { num: 3, name: 'چالش منطق نهایی', en: 'FINAL LOGIC', code: round6.codes.code3, isRev: round6.revealedCodes.code3 },
              { num: 4, name: 'کیف طلایی', en: 'GOLDEN CASE', code: 'KEY', isRev: round6.isCaseUnlocked },
            ].map(st => {
              const isCurrent = round6.currentStage === st.num;
              const isPassed = round6.currentStage > st.num || round6.isCaseUnlocked;

              return (
                <div
                  key={st.num}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'bg-yellow-950/60 border-yellow-400 text-yellow-100 shadow-md ring-1 ring-yellow-400/50'
                      : isPassed
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-black/50 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold font-mono">
                    <span>مرحله {st.num}</span>
                    {st.isRev ? (
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 rounded text-[9px] font-black">
                        {st.num === 4 && round6.isCaseUnlocked ? 'باز شد' : `رمز: ${st.code}`}
                      </span>
                    ) : (
                      <Lock className="w-3 h-3 text-neutral-500" />
                    )}
                  </div>
                  <div className="font-['Vazirmatn'] font-black text-xs mt-1 text-white">
                    {st.name}
                  </div>
                  <div className="text-[9px] font-mono text-neutral-400">
                    {st.en}
                  </div>
                  {isCurrent && !round6.isCaseUnlocked && (
                    <button
                      type="button"
                      onClick={() => onAdvanceFinalStage?.(st.num + 1)}
                      className="mt-2 py-1 px-2 bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-bold rounded flex items-center justify-center gap-1 active:scale-95 transition"
                    >
                      <span>تکمیل و رفتن به بعد</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3-Digit Golden Case Box */}
          <div className="p-3 bg-neutral-950 border border-yellow-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-black font-black shadow-lg">
                {round6.isCaseUnlocked ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <div>
                <div className="font-['Vazirmatn'] font-black text-sm text-yellow-400">
                  {round6.isCaseUnlocked ? '🎉 کیف طلایی باز شد! کیت قهرمانی داداش‌مد اهدا گردید' : 'ورود رمز ۳ رقمی کیف طلایی (GOLDEN CASE)'}
                </div>
                <div className="text-xs text-neutral-300 font-mono">
                  {round6.isCaseUnlocked
                    ? `برنده نهایی: ${round6.winner || 'تعیین‌شده با بیشترین زمان'}`
                    : `رمزهای کشف‌شده: [${round6.revealedCodes.code1 ? round6.codes.code1 : '؟'}] - [${round6.revealedCodes.code2 ? round6.codes.code2 : '؟'}] - [${round6.revealedCodes.code3 ? round6.codes.code3 : '؟'}]`}
                </div>
              </div>
            </div>

            {!round6.isCaseUnlocked ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  maxLength={3}
                  value={caseInputCode}
                  onChange={e => setCaseInputCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="رمز (مثال ۴۷۲)"
                  className="w-28 px-3 py-1.5 bg-neutral-900 border border-yellow-500/60 rounded-lg text-center font-mono font-black text-lg text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="button"
                  id="btn-unlock-case"
                  onClick={() => onUnlockCase?.(caseInputCode || `${round6.codes.code1}${round6.codes.code2}${round6.codes.code3}`)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-black font-black text-xs rounded-lg shadow-md active:scale-95 transition flex items-center gap-1.5"
                >
                  <Unlock className="w-4 h-4" />
                  باز کردن کیف (Unlock)
                </button>
              </div>
            ) : (
              <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold rounded-lg font-mono">
                🏆 CASE OPENED
              </span>
            )}
          </div>
        </div>
      )}

      {/* Current Rule Display Box (Requirement 6) */}
      <div
        id="current-rule-box"
        className="w-full bg-neutral-950 border-2 border-yellow-500/70 rounded-xl p-3 shadow-md"
      >
        <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-xs uppercase mb-1">
          <AlertCircle className="w-4 h-4" />
          <span>قانون رسمی این راند (CURRENT RULE):</span>
        </div>
        <p className="text-white text-sm sm:text-base font-bold font-['Vazirmatn'] leading-snug">
          {currentRound.persianRule}
        </p>
        <p className="text-neutral-400 text-xs mt-1 font-mono">
          {currentRound.rule}
        </p>
      </div>
    </section>
  );
};
