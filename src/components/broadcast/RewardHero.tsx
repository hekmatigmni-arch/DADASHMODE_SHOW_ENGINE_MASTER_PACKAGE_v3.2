import React from 'react';
import { PlayerId } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { EliasTriangleIcon, EmadCircleIcon, WinnerIcon } from './GameIcons';

interface RewardHeroProps {
  player: PlayerId;
  seconds: number;
  oldScore?: number;
  newScore?: number;
  reason?: string;
  className?: string;
}

/**
 * REWARD HERO CARD (Patch 2.3)
 * Dominant Hero Card replacing timer/rule stack during reward events:
 * - Winning player identity (shape + letter + color + name)
 * - Huge +10s / +25s in isolated LTR
 * - Gold burst / pulse with restrained duration (0.7-1.2s)
 * - Score transition OLD → NEW
 */
export const RewardHero: React.FC<RewardHeroProps> = ({
  player,
  seconds,
  oldScore,
  newScore,
  reason,
  className = '',
}) => {
  const isElias = player === 'ELIAS';
  const meta = PLAYERS_IDENTITY[player];

  const calculatedOldScore = oldScore !== undefined ? oldScore : 20;
  const calculatedNewScore = newScore !== undefined ? newScore : calculatedOldScore + seconds;

  return (
    <div
      id="broadcast-reward-hero"
      className={`w-[94%] max-w-xl mx-auto animate-reward-pop rounded-3xl bg-gradient-to-b from-[#2A2004] via-[#141208] to-[#0A0A0A] border-2 border-[#FFC400] p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-[0_0_48px_rgba(255,196,0,0.5)] select-none transition-all ${className}`}
      dir="rtl"
    >
      {/* Top Banner: Winner Trophy & Player Identity */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="p-1.5 rounded-xl bg-[#FFC400]/20 border border-[#FFC400] text-[#FFC400]">
          <WinnerIcon size={28} color="#FFC400" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/80 border border-[#FFC400]/50">
          {isElias ? (
            <EliasTriangleIcon size={22} color="#FF2738" />
          ) : (
            <EmadCircleIcon size={22} color="#00C98D" />
          )}
          <span className="font-['Vazirmatn'] font-black text-base text-white">
            {meta.persianName}
          </span>
          <span className="font-mono text-xs font-bold text-[#FFC400]">
            ({meta.tag})
          </span>
        </div>
      </div>

      {/* Main Dominant Value: Huge +10s */}
      <div className="my-1">
        <bdi
          dir="ltr"
          className="font-mono font-black text-6xl sm:text-7xl text-[#FFC400] tabular-nums tracking-tight leading-none drop-shadow-[0_0_24px_rgba(255,196,0,0.6)]"
        >
          +{seconds}s
        </bdi>
      </div>

      {/* Persian Title & Subtitle */}
      <span className="font-['Vazirmatn'] font-black text-lg text-white mt-1">
        جایزه راند اعمال شد
      </span>
      {reason && (
        <span className="font-['Vazirmatn'] text-xs sm:text-sm text-neutral-300 font-bold mt-0.5">
          {reason}
        </span>
      )}

      {/* Score Transition OLD → NEW */}
      <div className="mt-3 px-4 py-1.5 rounded-2xl bg-black/70 border border-[#333333] flex items-center gap-3">
        <span className="font-['Vazirmatn'] text-xs text-neutral-400 font-bold">
          موجودی بانک:
        </span>
        <bdi dir="ltr" className="font-mono font-bold text-sm sm:text-base text-neutral-300">
          <span>{calculatedOldScore}s</span>
          <span className="text-[#FFC400] mx-2 font-black">→</span>
          <span className="text-[#FFC400] font-black">{calculatedNewScore}s</span>
        </bdi>
      </div>
    </div>
  );
};
