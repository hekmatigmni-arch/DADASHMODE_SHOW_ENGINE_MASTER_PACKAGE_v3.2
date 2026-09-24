import React from 'react';
import { PublicBroadcastState } from '../../types/game';
import { Clock, ShieldAlert, Zap } from 'lucide-react';

interface PhoneCompetitorOutputProps {
  publicState: PublicBroadcastState;
  className?: string;
}

export const PhoneCompetitorOutput: React.FC<PhoneCompetitorOutputProps> = ({
  publicState,
  className = '',
}) => {
  const {
    roundNumber,
    roundPersianTitle,
    timer,
    players,
    review,
    latestAnnouncement,
  } = publicState;

  const isCritical = timer.secondsRemaining <= 5 && timer.isRunning;

  return (
    <div
      id="phone-competitor-output"
      className={`w-full max-w-md mx-auto p-4 rounded-3xl bg-black border-2 border-white/20 text-white flex flex-col justify-between select-none shadow-2xl min-h-[560px] ${className}`}
      dir="ltr"
    >
      {/* Header: Round & Active State */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono font-black text-sm uppercase">
          ROUND {roundNumber}
        </div>
        <div className="font-['Vazirmatn'] text-sm font-bold text-neutral-300" dir="rtl">
          {roundPersianTitle}
        </div>
      </div>

      {/* Massive Center Countdown Timer (Readable from across the room) */}
      <div
        className={`my-6 p-6 rounded-3xl text-center border-4 shadow-2xl transition-all ${
          isCritical
            ? 'bg-red-950/90 border-red-500 animate-pulse text-red-300'
            : timer.isRunning
            ? 'bg-neutral-900 border-amber-400 text-amber-300'
            : 'bg-neutral-900 border-white/20 text-white'
        }`}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-1">
          CHALLENGE TIMER
        </span>
        <div className="font-mono text-7xl font-black tracking-tight">
          {timer.secondsRemaining}s
        </div>
        <div className="mt-2 text-xs font-mono uppercase text-neutral-400">
          {timer.isRunning ? '● ACTIVE COUNTDOWN' : '⏸ PAUSED'}
        </div>
      </div>

      {/* Dual Competitor Time Bank Comparison */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Elias Red */}
        <div className="p-4 rounded-2xl bg-red-950/80 border-2 border-red-500 text-right flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="font-['Vazirmatn'] text-xs font-black text-red-300">الیاس (ELIAS)</span>
          </div>
          <div className="font-mono text-4xl font-black text-white text-center my-2">
            <bdi>{players.ELIAS.seconds}s</bdi>
          </div>
          <div className="text-[11px] font-mono text-red-400 flex items-center justify-between">
            <span>FOULS:</span>
            <span className="font-black">{players.ELIAS.fouls}</span>
          </div>
        </div>

        {/* Emad Green */}
        <div className="p-4 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 text-right flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-['Vazirmatn'] text-xs font-black text-emerald-300">عماد (EMAD)</span>
          </div>
          <div className="font-mono text-4xl font-black text-white text-center my-2">
            <bdi>{players.EMAD.seconds}s</bdi>
          </div>
          <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-between">
            <span>FOULS:</span>
            <span className="font-black">{players.EMAD.fouls}</span>
          </div>
        </div>
      </div>

      {/* VAR Review or Referee Alert */}
      {review.isUnderReview ? (
        <div className="p-3 rounded-2xl bg-red-600 text-white font-mono font-black text-center text-sm uppercase animate-pulse">
          ⚠️ VAR REVIEW IN PROGRESS
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center font-['Vazirmatn'] text-xs text-neutral-300" dir="rtl">
          {latestAnnouncement?.text || 'داور هوش مصنوعی مسابقه را به صورت زنده رصد می‌کند.'}
        </div>
      )}
    </div>
  );
};
