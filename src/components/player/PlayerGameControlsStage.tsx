import React, { useState, useEffect, useRef } from 'react';
import { PlayerId } from '../../types/game';
import { showAudioEngine } from '../../utils/showAudioEngine';
import { Zap, Play, Trophy, RotateCcw, ShieldCheck, Flame, Radio } from 'lucide-react';

interface PlayerGameControlsStageProps {
  onReactionPress: (player: PlayerId, reactionMs: number) => void;
  eliasSeconds: number;
  emadSeconds: number;
  className?: string;
}

export const PlayerGameControlsStage: React.FC<PlayerGameControlsStageProps> = ({
  onReactionPress,
  eliasSeconds,
  emadSeconds,
  className = '',
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [winner, setWinner] = useState<{ player: PlayerId; timeMs: number } | null>(null);
  const [earlyFault, setEarlyFault] = useState<PlayerId | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<any>(null);

  const startReactionDuel = () => {
    setWinner(null);
    setEarlyFault(null);
    setIsActive(false);
    setCountdown(3);

    showAudioEngine.playCountdownBeep(false);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        showAudioEngine.playCountdownBeep(false);
      } else if (count === 0) {
        setCountdown(0);
        showAudioEngine.playCountdownBeep(true);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setIsActive(true);
        startTimeRef.current = performance.now();
      }
    }, 1000);
    timerRef.current = interval;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSlam = (player: PlayerId) => {
    if (winner) return; // Duel already decided

    // Check false start / early fault
    if (countdown !== null && countdown >= 0) {
      setEarlyFault(player);
      showAudioEngine.playPenaltySound();
      return;
    }

    if (!isActive) return;

    const reactionMs = Math.round(performance.now() - startTimeRef.current);
    setIsActive(false);
    setWinner({ player, timeMs: reactionMs });
    onReactionPress(player, reactionMs);
  };

  return (
    <div
      id="player-game-controls-stage"
      className={`w-full min-h-screen bg-neutral-950 text-white flex flex-col p-4 sm:p-6 select-none font-['Vazirmatn'] ${className}`}
      dir="rtl"
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 via-amber-500 to-emerald-500 flex items-center justify-center text-black font-black shadow-lg">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wide flex items-center gap-2">
              <span>اتاق کلیدهای فیزیکی مسابقه (PLAYER GAME CONTROLS)</span>
            </h1>
            <p className="text-xs text-neutral-400">
              کلیدهای ۳ بعدی الیاس و عماد • ثبت صدم ثانیه • تشخیص لمس اول بدون دخالت دست
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startReactionDuel}
            disabled={countdown !== null}
            className={`py-2 px-5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition active:scale-95 ${
              countdown !== null
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-500/20'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>شروع دوئل سرعت و واکنش</span>
          </button>
        </div>
      </div>

      {/* Duel Center Status Indicator */}
      <div className="h-16 flex items-center justify-center mb-4">
        {countdown !== null ? (
          <div className="flex items-center gap-3 px-6 py-2 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 animate-pulse">
            <span className="font-mono text-2xl font-black">
              {countdown === 0 ? '🟢 همین حالا بزن!' : `آماده‌باش... ${countdown}`}
            </span>
          </div>
        ) : isActive ? (
          <div className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-emerald-500/30 border-2 border-emerald-400 text-emerald-300 animate-bounce">
            <Flame className="w-6 h-6 text-emerald-400 fill-current animate-ping" />
            <span className="font-mono text-xl sm:text-2xl font-black tracking-widest">
              کلیدها فعال شدند! اولین لمس برنده است!
            </span>
          </div>
        ) : winner ? (
          <div className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/30 via-yellow-500/30 to-amber-500/30 border-2 border-amber-400 text-amber-300 shadow-2xl animate-in zoom-in-95">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-black text-sm sm:text-base">
              🏆 برنده: {winner.player === 'ELIAS' ? 'الیاس (قرمز)' : 'عماد (سبز)'} در{' '}
              <span className="font-mono underline font-black">{winner.timeMs} میلی‌ثانیه</span>!
            </span>
          </div>
        ) : earlyFault ? (
          <div className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-red-950/60 border border-red-500 text-red-300 animate-shake">
            <span className="font-black text-sm">
              خطای استارت زودهنگام توسط {earlyFault === 'ELIAS' ? 'الیاس' : 'عماد'}!
            </span>
          </div>
        ) : (
          <div className="text-xs text-neutral-500 font-mono">
            روی «شروع دوئل سرعت و واکنش» کلیک کنید تا چراغ سبز روشن شود.
          </div>
        )}
      </div>

      {/* Two Giant Physical Slam Buttons */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full items-stretch">
        {/* ELIAS BUTTON (RED - TRIANGLE) */}
        <div
          className={`flex flex-col rounded-3xl p-6 border-2 transition-all relative overflow-hidden ${
            winner?.player === 'ELIAS'
              ? 'border-red-400 bg-red-950/40 shadow-[0_0_50px_rgba(255,39,56,0.5)] ring-4 ring-red-500/50'
              : 'border-red-500/40 bg-neutral-900/80 shadow-2xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 border-b border-red-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_10px_#FF2738]" />
              <span className="font-black text-lg text-red-400">ELIAS — اِلیاس</span>
            </div>
            <div className="text-left font-mono">
              <span className="text-xs text-neutral-400 block">بانک زمان:</span>
              <span className="text-xl font-black text-white">{eliasSeconds}s</span>
            </div>
          </div>

          {/* 3D Physical Slam Plunger Button */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <button
              type="button"
              onClick={() => handleSlam('ELIAS')}
              className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center border-8 border-red-950 transition-all duration-75 relative group select-none shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(255,39,56,0.3)] active:translate-y-4 active:shadow-[0_4px_15px_rgba(255,39,56,0.8)] ${
                isActive
                  ? 'bg-gradient-to-b from-red-500 via-red-600 to-red-800 ring-8 ring-red-400/40 cursor-pointer animate-pulse'
                  : 'bg-gradient-to-b from-red-700 via-red-800 to-red-950 opacity-90'
              }`}
            >
              {/* Plunger Lip Highlight */}
              <div className="absolute inset-2 rounded-full border-4 border-red-400/40 pointer-events-none" />

              <span className="text-5xl sm:text-6xl text-white mb-2 drop-shadow-md">▲</span>
              <span className="font-['Chakra_Petch'] text-xl sm:text-2xl font-black tracking-wider text-white uppercase drop-shadow-md">
                ELIAS SLAM
              </span>
              <span className="text-[11px] font-mono text-red-200 mt-1 uppercase tracking-widest">
                {isActive ? 'لمس فوری!' : 'آماده'}
              </span>
            </button>
          </div>

          {/* Player Footer Card */}
          <div className="mt-4 p-3 rounded-2xl bg-neutral-950/60 border border-red-500/20 flex items-center justify-between text-xs">
            <span className="text-neutral-400">نماد اختصاصی: مثلث سرخ (▲)</span>
            <span className="font-mono text-red-400 font-bold">REACTION PAD A</span>
          </div>
        </div>

        {/* EMAD BUTTON (GREEN - CIRCLE) */}
        <div
          className={`flex flex-col rounded-3xl p-6 border-2 transition-all relative overflow-hidden ${
            winner?.player === 'EMAD'
              ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_50px_rgba(0,201,141,0.5)] ring-4 ring-emerald-500/50'
              : 'border-emerald-500/40 bg-neutral-900/80 shadow-2xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#00C98D]" />
              <span className="font-black text-lg text-emerald-400">EMAD — عِماد</span>
            </div>
            <div className="text-left font-mono">
              <span className="text-xs text-neutral-400 block">بانک زمان:</span>
              <span className="text-xl font-black text-white">{emadSeconds}s</span>
            </div>
          </div>

          {/* 3D Physical Slam Plunger Button */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <button
              type="button"
              onClick={() => handleSlam('EMAD')}
              className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center border-8 border-emerald-950 transition-all duration-75 relative group select-none shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(0,201,141,0.3)] active:translate-y-4 active:shadow-[0_4px_15px_rgba(0,201,141,0.8)] ${
                isActive
                  ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-700 ring-8 ring-emerald-400/40 cursor-pointer animate-pulse'
                  : 'bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-950 opacity-90'
              }`}
            >
              {/* Plunger Lip Highlight */}
              <div className="absolute inset-2 rounded-full border-4 border-emerald-300/40 pointer-events-none" />

              <span className="text-5xl sm:text-6xl text-white mb-2 drop-shadow-md">●</span>
              <span className="font-['Chakra_Petch'] text-xl sm:text-2xl font-black tracking-wider text-white uppercase drop-shadow-md">
                EMAD SLAM
              </span>
              <span className="text-[11px] font-mono text-emerald-200 mt-1 uppercase tracking-widest">
                {isActive ? 'لمس فوری!' : 'آماده'}
              </span>
            </button>
          </div>

          {/* Player Footer Card */}
          <div className="mt-4 p-3 rounded-2xl bg-neutral-950/60 border border-emerald-500/20 flex items-center justify-between text-xs">
            <span className="text-neutral-400">نماد اختصاصی: دایره زمردی (●)</span>
            <span className="font-mono text-emerald-400 font-bold">REACTION PAD B</span>
          </div>
        </div>
      </div>
    </div>
  );
};
