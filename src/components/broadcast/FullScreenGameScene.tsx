import React from 'react';
import { PublicBroadcastState, PlayerId } from '../../types/game';
import { DadashWolfLogo } from './DadashWolfLogo';
import { VisualStageDiagram } from './VisualStageDiagram';
import { WinnerReveal } from './WinnerReveal';
import { ReviewOverlay } from './ReviewOverlay';
import { SabotageReveal } from './SabotageReveal';
import { MysteryReveal } from './MysteryReveal';
import {
  Trophy,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Award,
  Zap,
} from 'lucide-react';

interface FullScreenGameSceneProps {
  publicState: PublicBroadcastState;
  className?: string;
  is3dGlass?: boolean;
  isMrBeast?: boolean;
  isCleanFeed?: boolean;
}

export const FullScreenGameScene: React.FC<FullScreenGameSceneProps> = ({
  publicState,
  className = '',
  is3dGlass = true,
  isMrBeast = false,
  isCleanFeed = false,
}) => {
  const {
    roundNumber,
    totalRounds,
    roundTitle,
    roundPersianTitle,
    roundPersianRule,
    rewardSeconds,
    timer,
    players,
    aiState,
    review,
    winner,
    revealedSabotage,
    mysteryBoxes,
    latestAnnouncement,
  } = publicState;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const isTimerCritical = timer.secondsRemaining <= 5 && timer.isRunning;
  const isValidation = timer.isValidationTimer;

  return (
    <div
      id="full-screen-game-scene"
      className={`relative w-full aspect-video max-w-[1920px] mx-auto overflow-hidden select-none bg-[#07090e] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 ${className}`}
      dir="rtl"
    >
      {/* 1. ESPORTS AMBIENT BACKGROUND & MESH */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />
        {/* Subtle Esports Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* 2. TOP HEADER: DADASHMODE WOLF BRANDING & ROUND TITLE */}
      <header className="relative z-10 w-full flex items-center justify-between pb-3 border-b border-white/10">
        {/* Right side: Wolf branding & Show Title */}
        <div className="flex items-center gap-3">
          <DadashWolfLogo size={48} glow={true} />
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black tracking-widest text-white uppercase">
                DADASHMODE
              </span>
              <span className="font-mono text-xs font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/40">
                TIME BANK
              </span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
              OFFICIAL BROADCAST SCENE • 1920x1080 FULL
            </span>
          </div>
        </div>

        {/* Center: Round Badge & Reward Pill */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-mono text-xs font-black tracking-wider uppercase shadow-[0_0_15px_rgba(0,167,255,0.4)]">
              ROUND {roundNumber} OF {totalRounds}
            </span>
            {rewardSeconds && (
              <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/60 text-amber-300 font-mono text-xs font-black shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                +{rewardSeconds} SEC REWARD
              </span>
            )}
          </div>
          <h1 className="font-['Vazirmatn'] text-xl sm:text-2xl font-black text-white mt-1">
            {roundPersianTitle || roundTitle}
          </h1>
        </div>

        {/* Left side: AI Referee Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="flex flex-col text-left font-mono">
            <span className="text-[10px] text-neutral-400 uppercase leading-none">
              REFEREE
            </span>
            <span className="text-xs font-bold text-cyan-300 uppercase leading-tight">
              {aiState}
            </span>
          </div>
        </div>
      </header>

      {/* 3. MAIN BATTLE ARENA (3-Column Layout: ELIAS - CENTER STAGE - EMAD) */}
      <main className="relative z-10 w-full flex-1 grid grid-cols-12 gap-4 lg:gap-6 my-auto items-center py-4">
        {/* Left Column (cols 1-3): ELIAS (RED TEAM) */}
        <div className="col-span-3 h-full flex flex-col justify-center">
          <div className="relative rounded-3xl p-5 bg-gradient-to-b from-[#1c080d]/90 via-[#120508]/85 to-[#080204]/95 border-2 border-red-500/60 shadow-[0_0_40px_rgba(255,42,85,0.35)] backdrop-blur-2xl flex flex-col justify-between h-[360px] text-right">
            {/* Upper Player Identity */}
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] font-mono font-black uppercase">
                  RED TEAM
                </span>
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_16px_rgba(255,42,85,0.8)]">
                  <span className="text-white text-base font-black">▲</span>
                </div>
              </div>
              <h2 className="font-['Vazirmatn'] text-2xl font-black text-white mt-2">
                الیاس (ELIAS)
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                CHALLENGER 01
              </span>
            </div>

            {/* Time Bank Huge Counter */}
            <div className="my-auto text-center py-3 bg-black/40 rounded-2xl border border-red-900/40">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                TIME BANK
              </span>
              <div className="font-mono text-5xl sm:text-6xl font-black text-red-400 tracking-tight drop-shadow-[0_0_20px_rgba(255,42,85,0.8)]">
                <bdi dir="ltr">{players.ELIAS.seconds}s</bdi>
              </div>
              <span className="text-[11px] font-['Vazirmatn'] text-neutral-300 mt-1 block">
                موجودی زمان فینال
              </span>
            </div>

            {/* Status Footer */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-red-900/40">
              <span className="text-neutral-400 font-['Vazirmatn']">وضعیت:</span>
              <span className="text-red-300 font-bold font-mono uppercase">
                {players.ELIAS.fouls > 0 ? `${players.ELIAS.fouls} FOUL` : 'READY'}
              </span>
            </div>
          </div>
        </div>

        {/* Center Column (cols 4-9): STAGE DIAGRAM & HUGE TIMER */}
        <div className="col-span-6 h-full flex flex-col justify-center gap-3">
          {/* Active Overlay Check: Winner or VAR Review */}
          {winner && winner !== 'TIE' ? (
            <div className="w-full flex items-center justify-center py-4">
              <WinnerReveal winnerId={winner} winnerState={players[winner]} />
            </div>
          ) : review.isUnderReview ? (
            <div className="w-full flex items-center justify-center py-4">
              <ReviewOverlay review={review} />
            </div>
          ) : (
            <>
              {/* Giant 3D Countdown Timer */}
              <div className="w-full flex items-center justify-center">
                <div
                  className={`px-8 py-3 rounded-3xl border-2 flex items-center gap-4 shadow-2xl backdrop-blur-2xl transition-all ${
                    isValidation
                      ? 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_36px_rgba(255,215,0,0.6)] animate-pulse'
                      : isTimerCritical
                      ? 'bg-red-950/95 border-red-500 text-red-300 shadow-[0_0_40px_rgba(255,42,85,0.8)] animate-bounce'
                      : 'bg-[#0a1020]/90 border-cyan-400/60 text-white shadow-[0_0_32px_rgba(0,167,255,0.4)]'
                  }`}
                >
                  <Clock className={`w-8 h-8 ${isValidation ? 'text-amber-400' : 'text-cyan-400'}`} />
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-5xl sm:text-6xl font-black tracking-widest tabular-nums drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]">
                      {formatTimer(timer.secondsRemaining)}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300">
                      {isValidation ? 'VALIDATION COUNTDOWN' : 'CHALLENGE TIMER'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Embedded Visual Stage Diagram */}
              <div className="w-full rounded-2xl bg-black/60 border border-white/10 p-3 shadow-xl backdrop-blur-md">
                <VisualStageDiagram
                  roundNumber={roundNumber}
                  is3dGlass={is3dGlass}
                  isMrBeast={isMrBeast}
                  activeSabotageId={revealedSabotage?.title || null}
                />
              </div>

              {/* Persian Rule Chip */}
              <div className="w-full text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p className="font-['Vazirmatn'] text-sm text-neutral-200">
                  <strong className="text-amber-400 ml-1">قانون رسمی:</strong>
                  {roundPersianRule}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Right Column (cols 10-12): EMAD (GREEN TEAM) */}
        <div className="col-span-3 h-full flex flex-col justify-center">
          <div className="relative rounded-3xl p-5 bg-gradient-to-b from-[#051c11]/90 via-[#03120b]/85 to-[#020805]/95 border-2 border-emerald-500/60 shadow-[0_0_40px_rgba(0,230,118,0.35)] backdrop-blur-2xl flex flex-col justify-between h-[360px] text-right">
            {/* Upper Player Identity */}
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_0_16px_rgba(0,230,118,0.8)]">
                  <span className="text-white text-base font-black">●</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono font-black uppercase">
                  GREEN TEAM
                </span>
              </div>
              <h2 className="font-['Vazirmatn'] text-2xl font-black text-white mt-2">
                عماد (EMAD)
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                CHALLENGER 02
              </span>
            </div>

            {/* Time Bank Huge Counter */}
            <div className="my-auto text-center py-3 bg-black/40 rounded-2xl border border-emerald-900/40">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                TIME BANK
              </span>
              <div className="font-mono text-5xl sm:text-6xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_20px_rgba(0,230,118,0.8)]">
                <bdi dir="ltr">{players.EMAD.seconds}s</bdi>
              </div>
              <span className="text-[11px] font-['Vazirmatn'] text-neutral-300 mt-1 block">
                موجودی زمان فینال
              </span>
            </div>

            {/* Status Footer */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-emerald-900/40">
              <span className="text-neutral-400 font-['Vazirmatn']">وضعیت:</span>
              <span className="text-emerald-300 font-bold font-mono uppercase">
                {players.EMAD.fouls > 0 ? `${players.EMAD.fouls} FOUL` : 'READY'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* 4. BOTTOM SPORTS TICKER */}
      <footer className="relative z-10 w-full pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase font-black text-[10px]">
            AI REFEREE LIVE FEED
          </span>
          <span className="font-['Vazirmatn'] text-neutral-200">
            {latestAnnouncement?.text || 'مسابقه با نظارت کامل داور هوش مصنوعی در جریان است.'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>FORMAT: 1080P FULL SCENE</span>
          <span className="text-amber-400 font-bold">DADASHMODE V11</span>
        </div>
      </footer>
    </div>
  );
};
