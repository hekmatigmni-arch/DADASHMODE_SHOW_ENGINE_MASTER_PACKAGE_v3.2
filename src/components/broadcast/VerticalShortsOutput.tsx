import React from 'react';
import { PublicBroadcastState } from '../../types/game';
import { Clock, Zap, ShieldAlert, Award } from 'lucide-react';

interface VerticalShortsOutputProps {
  publicState: PublicBroadcastState;
  className?: string;
  isTransparent?: boolean;
  isCleanFeed?: boolean;
}

export const VerticalShortsOutput: React.FC<VerticalShortsOutputProps> = ({
  publicState,
  className = '',
  isTransparent = false,
  isCleanFeed = false,
}) => {
  const {
    roundNumber,
    roundPersianTitle,
    roundPersianRule,
    timer,
    players,
    aiState,
    latestAnnouncement,
    review,
    winner,
  } = publicState;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="vertical-shorts-output-stage"
      className={`relative w-full aspect-[9/16] max-w-[480px] mx-auto overflow-hidden flex flex-col justify-between p-4 select-none ${
        isTransparent ? 'bg-transparent' : 'bg-[#0a0a0f]'
      } ${className}`}
      dir="ltr"
    >
      {/* TOP DOCK: ROUND INFO & MATCH TIMER (TOP 15%) */}
      <header className="relative z-20 w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400 animate-pulse" />
            <span className="font-mono text-xs font-black text-cyan-300">
              ROUND {roundNumber}
            </span>
          </div>

          {/* Central High-Intensity Timer Pill */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 backdrop-blur-lg shadow-xl ${
              timer.secondsRemaining <= 5 && timer.isRunning
                ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse'
                : 'bg-black/80 border-amber-400/80 text-amber-300'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-lg font-black tracking-tight">
              {formatTimer(timer.secondsRemaining)}
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-[10px] font-mono text-neutral-300 uppercase">
            SHORTS
          </div>
        </div>

        {/* Persian Rule Headline */}
        <div className="w-full text-center px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md text-xs font-['Vazirmatn'] text-neutral-200" dir="rtl">
          <span className="font-black text-amber-400 ml-1">{roundPersianTitle}:</span>
          <span>{roundPersianRule}</span>
        </div>
      </header>

      {/* CENTER PROTECTED ZONE: 100% CLEAR FOR CONTESTANTS & CAMERA ACTION (CENTER 70%) */}
      <div className="relative flex-1 pointer-events-none flex items-center justify-center">
        {/* VAR Review Strobe if active */}
        {review.isUnderReview && (
          <div className="px-6 py-2 rounded-2xl bg-red-950/90 border-2 border-red-500 text-red-300 font-mono font-black text-sm uppercase animate-pulse shadow-2xl">
            🔍 VAR REVIEW ACTIVE
          </div>
        )}
      </div>

      {/* BOTTOM DOCK: DUAL TIME-BANK BATTLE BAR & TICKER (BOTTOM 15%) */}
      <footer className="relative z-20 w-full flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Elias Red Pill */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/90 to-red-900/60 border border-red-500/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="font-['Vazirmatn'] text-xs font-black text-red-200">
                الیاس (ELIAS)
              </span>
              <span className="font-mono text-[9px] text-red-400 uppercase">
                RED TEAM
              </span>
            </div>
            <div className="font-mono text-2xl font-black text-red-300">
              <bdi>{players.ELIAS.seconds}s</bdi>
            </div>
          </div>

          {/* Emad Green Pill */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/90 to-emerald-900/60 border border-emerald-500/60 backdrop-blur-md flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="font-['Vazirmatn'] text-xs font-black text-emerald-200">
                عماد (EMAD)
              </span>
              <span className="font-mono text-[9px] text-emerald-400 uppercase">
                GREEN TEAM
              </span>
            </div>
            <div className="font-mono text-2xl font-black text-emerald-300">
              <bdi>{players.EMAD.seconds}s</bdi>
            </div>
          </div>
        </div>

        {/* Referee Mini Ticker */}
        <div className="w-full px-3 py-1 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md flex items-center justify-between text-[11px] font-mono text-neutral-300">
          <span className="text-cyan-400 font-bold uppercase">AI REF</span>
          <span className="font-['Vazirmatn'] text-neutral-200 truncate max-w-[280px]" dir="rtl">
            {latestAnnouncement?.text || 'مسابقه با نظارت زنده داور هوش مصنوعی DADASHMODE در جریان است.'}
          </span>
        </div>
      </footer>
    </div>
  );
};
