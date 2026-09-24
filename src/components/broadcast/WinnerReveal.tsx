import React from 'react';
import { PlayerId, PublicPlayerState } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { WinnerIcon, FinalPrizeIcon, EliasTriangleIcon, EmadCircleIcon } from './GameIcons';

interface WinnerRevealProps {
  winnerId: PlayerId;
  winnerState: PublicPlayerState;
  className?: string;
}

export const WinnerReveal: React.FC<WinnerRevealProps> = ({
  winnerId,
  winnerState,
  className = '',
}) => {
  const isElias = winnerId === 'ELIAS';
  const meta = PLAYERS_IDENTITY[winnerId];

  return (
    <div
      id="broadcast-winner-reveal"
      className={`animate-hero-reveal relative rounded-3xl border-4 border-[#FFC400] bg-gradient-to-b from-[#1c1604] via-[#0d0a02] to-[#070707] p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(255,196,0,0.6)] select-none overflow-hidden ${className}`}
      dir="rtl"
    >
      {/* Background Glory Rays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFC400]/20 via-transparent to-transparent opacity-80" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Top Trophy */}
        <div className="p-4 rounded-3xl bg-[#FFC400]/20 border-2 border-[#FFC400] mb-3 shadow-[0_0_30px_rgba(255,196,0,0.5)]">
          <WinnerIcon size={64} color="#FFC400" />
        </div>

        <span className="font-mono font-black text-sm sm:text-base text-[#FFC400] tracking-widest uppercase mb-1">
          OFFICIAL CHAMPION
        </span>

        {/* Big Champion Name */}
        <h2 className="font-['Vazirmatn'] font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
          برنده نهایی: {meta.persianName}
        </h2>

        {/* Redundant Winner Badge (Shape + Letter + Color) */}
        <div className="flex items-center gap-3 my-4 px-6 py-2.5 rounded-2xl bg-[#070707] border-2 border-[#FFC400] shadow-xl">
          {isElias ? (
            <EliasTriangleIcon size={36} color="#FF2738" />
          ) : (
            <EmadCircleIcon size={36} color="#00C98D" />
          )}
          <span className="font-mono font-black text-2xl text-white tracking-wider">
            {meta.name} ({meta.tag})
          </span>
        </div>

        {/* Final Bank Balance */}
        <div className="flex items-baseline gap-2 bg-[#171717] px-6 py-2 rounded-2xl border border-[#333333]">
          <span className="font-['Vazirmatn'] text-sm sm:text-base text-neutral-300 font-bold">
            موجودی نهایی بانک زمان:
          </span>
          <bdi
            dir="ltr"
            className="font-mono font-black text-3xl sm:text-4xl text-[#FFC400] tabular-nums tracking-tight"
          >
            {winnerState.seconds}s
          </bdi>
        </div>
      </div>
    </div>
  );
};
