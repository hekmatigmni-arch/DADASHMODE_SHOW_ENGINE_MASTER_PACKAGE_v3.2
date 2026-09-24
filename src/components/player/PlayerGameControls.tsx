import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerId, GameState } from '../../types/game';
import { calculateReactionMatch, ReactionChallengeResult } from '../../engine/gameEngineCore';
import { showAudioEngine } from '../../utils/showAudioEngine';
import { voiceCueEngine } from '../../engine/voiceCueEngine';
import { Zap, RotateCcw, Volume2, ShieldAlert, Award, Timer, Flame, CheckCircle2 } from 'lucide-react';

export interface PlayerGameControlsProps {
  gameState: GameState;
  onAddScore: (player: PlayerId, seconds: number, reason?: string) => void;
  onTriggerVfx?: (payload: { type: string; player?: PlayerId; title?: string; text?: string }) => void;
  awardSeconds?: number;
  className?: string;
  isStandalone?: boolean;
}

type ChallengePhase = 'IDLE' | 'COUNTDOWN' | 'WAITING_GREEN' | 'ARMED' | 'RESOLVED';

export function PlayerGameControls({
  gameState,
  onAddScore,
  onTriggerVfx,
  awardSeconds = 10,
  className = '',
  isStandalone = false,
}: PlayerGameControlsProps) {
  const [phase, setPhase] = useState<ChallengePhase>('IDLE');
  const [countdownNum, setCountdownNum] = useState<number | null>(null);
  const [armedTimestamp, setArmedTimestamp] = useState<number>(0);
  const [lastResult, setLastResult] = useState<ReactionChallengeResult | null>(null);
  const [eliasPressedAt, setEliasPressedAt] = useState<number | null>(null);
  const [emadPressedAt, setEmadPressedAt] = useState<number | null>(null);
  const [falseStartPlayer, setFalseStartPlayer] = useState<PlayerId | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [reactionHistory, setReactionHistory] = useState<ReactionChallengeResult[]>([]);

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  };

  /**
   * Start the reaction-based challenge sequence:
   * 1. 3... 2... 1... countdown animation
   * 2. Anti-anticipation random delay (1.2s - 2.8s)
   * 3. ARM both buttons at exact performance.now()
   */
  const handleStartReactionMatch = useCallback(() => {
    clearAllTimeouts();
    setLastResult(null);
    setFalseStartPlayer(null);
    setEliasPressedAt(null);
    setEmadPressedAt(null);
    setPhase('COUNTDOWN');
    setCountdownNum(3);

    if (!isMuted) showAudioEngine.playCountdownBeep(false);

    // 3 -> 2
    const t1 = setTimeout(() => {
      setCountdownNum(2);
      if (!isMuted) showAudioEngine.playCountdownBeep(false);
    }, 1000);

    // 2 -> 1
    const t2 = setTimeout(() => {
      setCountdownNum(1);
      if (!isMuted) showAudioEngine.playCountdownBeep(false);
    }, 2000);

    // 1 -> Waiting for random green flag
    const t3 = setTimeout(() => {
      setCountdownNum(null);
      setPhase('WAITING_GREEN');

      // Random delay between 1200ms and 2600ms to eliminate memorization
      const randomDelay = 1200 + Math.random() * 1400;

      const t4 = setTimeout(() => {
        const armedTime = performance.now();
        setArmedTimestamp(armedTime);
        setPhase('ARMED');

        // Play arm sound and trigger visual cue
        if (!isMuted) showAudioEngine.playBuzzerHit();
        if (onTriggerVfx) {
          onTriggerVfx({
            type: 'ARMED_FLASH',
            title: 'بزنید! (PRESS NOW!)',
            text: 'هر کس سریع‌تر دکمه را لمس کند برنده است!',
          });
        }
      }, randomDelay);

      timeoutRefs.current.push(t4);
    }, 3000);

    timeoutRefs.current.push(t1, t2, t3);
  }, [isMuted, onTriggerVfx]);

  /**
   * Handle physical button press by Elias or Emad
   */
  const handlePlayerPress = useCallback(
    (player: PlayerId) => {
      const now = performance.now();

      // Case 1: False start (pressed before ARMED)
      if (phase === 'COUNTDOWN' || phase === 'WAITING_GREEN') {
        clearAllTimeouts();
        setFalseStartPlayer(player);
        setPhase('RESOLVED');
        if (!isMuted) showAudioEngine.playPenaltySound();

        const playerName = player === 'ELIAS' ? 'الیاس' : 'عماد';
        const opponent: PlayerId = player === 'ELIAS' ? 'EMAD' : 'ELIAS';
        const opponentName = player === 'ELIAS' ? 'عماد' : 'الیاس';

        const falseStartResult: ReactionChallengeResult = {
          winner: opponent,
          loser: player,
          winnerReactionMs: 0,
          loserReactionMs: null,
          awardSeconds: 0,
          isFalseStart: true,
          timestamp: Date.now(),
          persianAnnouncement: `خطای شروع زودهنگام توسط ${playerName}! دکمه قبل از فرمان سبز فشرده شد.`,
        };

        setLastResult(falseStartResult);
        setReactionHistory((prev) => [falseStartResult, ...prev.slice(0, 9)]);

        // Voice announcement
        voiceCueEngine.playCustomVoice(
          `خطای شروع زودتر توسط ${playerName}! دکمه قبل از علامت سبز فشرده شد.`,
          'Kore',
          'sarcastic'
        );

        if (onTriggerVfx) {
          onTriggerVfx({
            type: 'FALSE_START',
            player,
            title: 'خطای شروع زودتر!',
            text: `شروع زودتر توسط ${playerName}`,
          });
        }
        return;
      }

      // Case 2: Reaction in armed state
      if (phase === 'ARMED') {
        // Record timestamp
        if (player === 'ELIAS') setEliasPressedAt(now);
        else setEmadPressedAt(now);

        setPhase('RESOLVED');

        // Pure calculation
        const result = calculateReactionMatch(player, armedTimestamp, now, awardSeconds);
        setLastResult(result);
        setReactionHistory((prev) => [result, ...prev.slice(0, 9)]);

        // SFX Trigger
        if (!isMuted) {
          showAudioEngine.playBuzzerHit();
          setTimeout(() => showAudioEngine.playRewardSound(), 200);
        }

        // Score update via game engine
        onAddScore(result.winner, result.awardSeconds, `برد در چالش واکنشی (${result.winnerReactionMs}ms)`);

        // VFX Trigger
        if (onTriggerVfx) {
          onTriggerVfx({
            type: 'REACTION_WINNER',
            player: result.winner,
            title: `${result.winner === 'ELIAS' ? 'الیاس' : 'عماد'} برنده شد!`,
            text: `زمان واکنش فوق‌العاده: ${result.winnerReactionMs} میلی‌ثانیه (+${awardSeconds} ثانیه)`,
          });
        }

        // Voice Announcement (Female referee voice)
        const winnerPersian = result.winner === 'ELIAS' ? 'الیاس' : 'عماد';
        voiceCueEngine.playCustomVoice(
          `${winnerPersian} سریع‌تر زد! زمان واکنش: ${result.winnerReactionMs} میلی‌ثانیه. ۱۰ ثانیه به بانک زمان ${winnerPersian} اضافه شد!`,
          'Kore',
          'hype'
        );
      }
    },
    [phase, armedTimestamp, awardSeconds, isMuted, onAddScore, onTriggerVfx]
  );

  // Keyboard shortcut listener (A for Elias, L/Enter for Emad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'KeyA') {
        handlePlayerPress('ELIAS');
      } else if (e.code === 'KeyL' || e.code === 'Enter') {
        handlePlayerPress('EMAD');
      } else if (e.code === 'Space' && (phase === 'IDLE' || phase === 'RESOLVED')) {
        e.preventDefault();
        handleStartReactionMatch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayerPress, handleStartReactionMatch, phase]);

  const isArmed = phase === 'ARMED';
  const isWaiting = phase === 'COUNTDOWN' || phase === 'WAITING_GREEN';

  return (
    <div
      className={`w-full flex flex-col items-center justify-between select-none relative ${className}`}
      dir="rtl"
    >
      {/* Top Status & Controls Header */}
      <div className="w-full flex items-center justify-between px-4 py-3 bg-neutral-900/90 border-b border-white/10 backdrop-blur-xl rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>سیستم کنترل کلیدهای فیزیکی بازیکنان</span>
          </div>

          <span className="hidden sm:inline text-xs text-neutral-400 font-mono">
            [کلید A: الیاس | کلید L / اینتر: عماد]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              isMuted
                ? 'bg-neutral-800 text-neutral-500 border-neutral-700'
                : 'bg-neutral-800 text-amber-400 border-amber-500/30'
            }`}
            title="قطع/وصل صدای دکمه‌ها"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleStartReactionMatch}
            disabled={isWaiting || isArmed}
            className={`px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition-all active:scale-95 ${
              isWaiting || isArmed
                ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-500/20'
            }`}
          >
            <Flame className="w-4 h-4 fill-black" />
            <span>{phase === 'RESOLVED' ? 'چالش بعدی (SPACE)' : 'شروع چالش واکنشی (SPACE)'}</span>
          </button>
        </div>
      </div>

      {/* Central Interactive Arena */}
      <div className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-[#090b10] via-[#0d1017] to-[#08090d] relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

        {/* Central Display Banner / Status Indicator */}
        <div className="mb-6 flex flex-col items-center justify-center text-center z-10">
          {phase === 'IDLE' && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-neutral-400 tracking-wider">
                آماده برای شروع مسابقه واکنشی صدم‌ثانیه‌ای
              </span>
              <p className="text-sm font-black text-white">
                روی دکمه «شروع چالش واکنشی» کلیک کنید یا کلید SPACE را بزنید.
              </p>
            </div>
          )}

          {phase === 'COUNTDOWN' && (
            <div className="flex flex-col items-center justify-center">
              <span className="text-xs font-mono font-bold text-amber-400 mb-1">آماده‌باش...</span>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-neutral-900/90 border-2 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center animate-bounce">
                <span className="text-5xl sm:text-6xl font-black font-mono text-amber-400">
                  {countdownNum}
                </span>
              </div>
            </div>
          )}

          {phase === 'WAITING_GREEN' && (
            <div className="flex flex-col items-center justify-center">
              <div className="px-6 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500 text-amber-300 font-black text-lg animate-pulse flex items-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                <span>دست‌ها روی کلید... منتظر چراغ سبز باشید!</span>
              </div>
            </div>
          )}

          {phase === 'ARMED' && (
            <div className="flex flex-col items-center justify-center">
              <div className="px-8 py-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-black font-black text-2xl sm:text-3xl animate-bounce shadow-[0_0_50px_rgba(16,185,129,0.8)] flex items-center gap-3">
                <Zap className="w-8 h-8 fill-black" />
                <span>💥 الان بزنید! (PRESS NOW!)</span>
              </div>
            </div>
          )}

          {phase === 'RESOLVED' && lastResult && (
            <div className="flex flex-col items-center gap-2">
              {lastResult.isFalseStart ? (
                <div className="px-6 py-2.5 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-300 font-black text-base flex items-center gap-2 shadow-[0_0_30px_rgba(239,68,68,0.4)]">
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                  <span>{lastResult.persianAnnouncement}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-amber-500/30 via-yellow-400/30 to-amber-500/30 border border-amber-400 text-white font-black text-lg flex items-center gap-2 shadow-[0_0_35px_rgba(245,158,11,0.4)]">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <span>{lastResult.winner === 'ELIAS' ? 'الیاس (ELIAS)' : 'عماد (EMAD)'} برنده شد!</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/40">
                      ⚡ زمان واکنش: {lastResult.winnerReactionMs} ms
                    </span>
                    <span className="text-amber-300 font-bold bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/40">
                      +{lastResult.awardSeconds} ثانیه به بانک زمان
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TWO INDEPENDENT MASSIVE PHYSICAL BUTTONS */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 z-10">
          {/* 1. ELIAS PHYSICAL BUTTON (Red ▲) */}
          <div className="flex flex-col items-center">
            {/* Player Info Header */}
            <div className="w-full flex items-center justify-between px-4 py-2 mb-3 rounded-2xl bg-neutral-900/80 border border-red-500/30 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-lg text-red-500 font-black">▲</span>
                <span className="font-black text-white text-base">ELIAS (اِلیاس)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-neutral-400">بانک زمان:</span>
                <span className="font-black text-red-400 text-sm">{gameState.players.ELIAS.seconds}s</span>
              </div>
            </div>

            {/* Giant 3D Physical Slam Plunger Button */}
            <button
              type="button"
              onClick={() => handlePlayerPress('ELIAS')}
              disabled={phase === 'RESOLVED' && lastResult?.winner !== 'ELIAS'}
              className={`group relative w-64 h-64 sm:w-72 sm:h-72 rounded-full transition-all duration-75 select-none focus:outline-none flex items-center justify-center p-4 cursor-pointer ${
                // Outer chassis & shadow
                'bg-gradient-to-b from-[#2a0e12] to-[#120507] border-[6px] border-[#4a181e] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,39,56,0.3)]'
              } ${
                // Armed pulsating state
                isArmed ? 'ring-8 ring-red-500/60 shadow-[0_0_60px_rgba(255,39,56,0.8)] animate-pulse' : ''
              } ${
                // Winner state
                phase === 'RESOLVED' && lastResult?.winner === 'ELIAS'
                  ? 'ring-8 ring-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.9)]'
                  : ''
              } ${
                // Loser / Locked out state
                phase === 'RESOLVED' && lastResult?.winner !== 'ELIAS'
                  ? 'opacity-40 grayscale cursor-not-allowed'
                  : ''
              } active:scale-95 active:translate-y-2`}
              title="دکمه شروع و چالش واکنشی الیاس (کلید A)"
            >
              {/* Inner metallic bezel rim */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-b from-[#5c1c25] to-[#1f0a0d] p-3 shadow-inner flex items-center justify-center">
                {/* Plunger Button Cap */}
                <div
                  className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all ${
                    'bg-gradient-to-b from-[#FF4757] via-[#FF2738] to-[#B31222] shadow-[inset_0_4px_10px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,0,0,0.6)]'
                  } group-active:translate-y-1.5 group-active:shadow-[inset_0_8px_15px_rgba(0,0,0,0.8)]`}
                >
                  <span className="text-5xl sm:text-6xl text-white font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                    ▲
                  </span>
                  <span className="mt-1 font-black text-white text-sm sm:text-base tracking-wider drop-shadow-md">
                    ELIAS
                  </span>
                  <span className="text-[10px] font-mono text-red-200/90 font-bold mt-0.5">
                    [کلید A]
                  </span>
                </div>
              </div>

              {/* Status Ring Badge */}
              {isArmed && (
                <span className="absolute -bottom-3 px-3 py-1 rounded-full bg-red-600 text-white font-black text-xs shadow-lg uppercase tracking-wider animate-bounce">
                  بزنید! (SLAM)
                </span>
              )}
            </button>

            {/* Reaction time display badge */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-neutral-400">خطاها: {gameState.players.ELIAS.fouls}</span>
              {lastResult && lastResult.winner === 'ELIAS' && !lastResult.isFalseStart && (
                <span className="px-2.5 py-0.5 rounded-lg bg-red-500/20 text-red-300 font-mono text-xs font-bold border border-red-500/40">
                  ⚡ {lastResult.winnerReactionMs} ms
                </span>
              )}
            </div>
          </div>

          {/* 2. EMAD PHYSICAL BUTTON (Green ●) */}
          <div className="flex flex-col items-center">
            {/* Player Info Header */}
            <div className="w-full flex items-center justify-between px-4 py-2 mb-3 rounded-2xl bg-neutral-900/80 border border-emerald-500/30 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-lg text-emerald-400 font-black">●</span>
                <span className="font-black text-white text-base">EMAD (عِماد)</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-neutral-400">بانک زمان:</span>
                <span className="font-black text-emerald-400 text-sm">{gameState.players.EMAD.seconds}s</span>
              </div>
            </div>

            {/* Giant 3D Physical Slam Plunger Button */}
            <button
              type="button"
              onClick={() => handlePlayerPress('EMAD')}
              disabled={phase === 'RESOLVED' && lastResult?.winner !== 'EMAD'}
              className={`group relative w-64 h-64 sm:w-72 sm:h-72 rounded-full transition-all duration-75 select-none focus:outline-none flex items-center justify-center p-4 cursor-pointer ${
                // Outer chassis & shadow
                'bg-gradient-to-b from-[#0b241c] to-[#04100c] border-[6px] border-[#133e31] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,201,141,0.3)]'
              } ${
                // Armed pulsating state
                isArmed ? 'ring-8 ring-emerald-500/60 shadow-[0_0_60px_rgba(0,201,141,0.8)] animate-pulse' : ''
              } ${
                // Winner state
                phase === 'RESOLVED' && lastResult?.winner === 'EMAD'
                  ? 'ring-8 ring-amber-400 shadow-[0_0_80px_rgba(245,158,11,0.9)]'
                  : ''
              } ${
                // Loser / Locked out state
                phase === 'RESOLVED' && lastResult?.winner !== 'EMAD'
                  ? 'opacity-40 grayscale cursor-not-allowed'
                  : ''
              } active:scale-95 active:translate-y-2`}
              title="دکمه شروع و چالش واکنشی عماد (کلید L یا Enter)"
            >
              {/* Inner metallic bezel rim */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-b from-[#144f3e] to-[#071f18] p-3 shadow-inner flex items-center justify-center">
                {/* Plunger Button Cap */}
                <div
                  className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all ${
                    'bg-gradient-to-b from-[#10e2a2] via-[#00C98D] to-[#057a55] shadow-[inset_0_4px_10px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,0,0,0.6)]'
                  } group-active:translate-y-1.5 group-active:shadow-[inset_0_8px_15px_rgba(0,0,0,0.8)]`}
                >
                  <span className="text-5xl sm:text-6xl text-white font-black drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                    ●
                  </span>
                  <span className="mt-1 font-black text-white text-sm sm:text-base tracking-wider drop-shadow-md">
                    EMAD
                  </span>
                  <span className="text-[10px] font-mono text-emerald-100/90 font-bold mt-0.5">
                    [کلید L / اینتر]
                  </span>
                </div>
              </div>

              {/* Status Ring Badge */}
              {isArmed && (
                <span className="absolute -bottom-3 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs shadow-lg uppercase tracking-wider animate-bounce">
                  بزنید! (SLAM)
                </span>
              )}
            </button>

            {/* Reaction time display badge */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs text-neutral-400">خطاها: {gameState.players.EMAD.fouls}</span>
              {lastResult && lastResult.winner === 'EMAD' && !lastResult.isFalseStart && (
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40">
                  ⚡ {lastResult.winnerReactionMs} ms
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reaction Match History Log */}
        {reactionHistory.length > 0 && (
          <div className="w-full max-w-2xl mt-8 p-3 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 px-1">
              <span className="font-bold flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-cyan-400" />
                <span>تاریخچه رکوردهای واکنشی این دست:</span>
              </span>
              <button
                type="button"
                onClick={() => setReactionHistory([])}
                className="text-[10px] text-neutral-500 hover:text-white"
              >
                پاک کردن
              </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {reactionHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1 rounded-xl text-xs font-mono flex items-center gap-2 border ${
                    item.isFalseStart
                      ? 'bg-red-950/60 border-red-500/40 text-red-300'
                      : item.winner === 'ELIAS'
                      ? 'bg-red-950/50 border-red-500/50 text-red-200'
                      : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  <span className="font-black">
                    {item.winner === 'ELIAS' ? '▲ الیاس' : '● عماد'}
                  </span>
                  {item.isFalseStart ? (
                    <span className="text-[10px] text-red-400">(خطای زودهنگام)</span>
                  ) : (
                    <span className="text-amber-300 font-bold">{item.winnerReactionMs}ms</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
