import React from 'react';
import { PlayerId } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { EliasTriangleIcon, EmadCircleIcon, SabotageIcon } from './GameIcons';

interface PenaltyHeroProps {
  player: PlayerId;
  seconds: number;
  oldScore?: number;
  newScore?: number;
  reason?: string;
  className?: string;
}

/**
 * PENALTY HERO CARD (Patch 2.3)
 * Dominant Hero Card replacing timer/rule stack during penalty events:
 * - Player identity (shape + letter + color + name)
 * - Huge -10s in isolated LTR
 * - Red impact shake & glow
 * - Score transition OLD → NEW
 */
export const PenaltyHero: React.FC<PenaltyHeroProps> = ({
  player,
  seconds,
  oldScore,
  newScore,
  reason,
  className = '',
}) => {
  const isElias = player === 'ELIAS';
  const meta = PLAYERS_IDENTITY[player];

  const penaltyAmount = Math.abs(seconds);
  const calculatedOldScore = oldScore !== undefined ? oldScore : 35;
  const calculatedNewScore = newScore !== undefined ? newScore : Math.max(0, calculatedOldScore - penaltyAmount);

  return (
    <div
      id="broadcast-penalty-hero"
      className={`w-[94%] max-w-xl mx-auto animate-penalty-shake rounded-3xl bg-gradient-to-b from-[#2B080A] via-[#140608] to-[#0A0506] border-2 border-[#FF3B30] p-4 sm:p-5 flex flex-col items-center justify-center text-center shadow-[0_0_48px_rgba(255,59,48,0.5)] select-none transition-all ${className}`}
      dir="rtl"
    >
      {/* Top Banner: Warning Icon & Player Identity */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="p-1.5 rounded-xl bg-[#FF3B30]/20 border border-[#FF3B30] text-[#FF3B30]">
          <SabotageIcon size={28} color="#FF3B30" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/80 border border-[#FF3B30]/50">
          {isElias ? (
            <EliasTriangleIcon size={22} color="#FF2738" />
          ) : (
            <EmadCircleIcon size={22} color="#00C98D" />
          )}
          <span className="font-['Vazirmatn'] font-black text-base text-white">
            {meta.persianName}
          </span>
          <span className="font-mono text-xs font-bold text-[#FF3B30]">
            ({meta.tag})
          </span>
        </div>
      </div>

      {/* Main Dominant Value: Huge -10s */}
      <div className="my-1">
        <bdi
          dir="ltr"
          className="font-mono font-black text-6xl sm:text-7xl text-[#FF3B30] tabular-nums tracking-tight leading-none drop-shadow-[0_0_24px_rgba(255,59,48,0.6)]"
        >
          -{penaltyAmount}s
        </bdi>
      </div>

      {/* Persian Title & Subtitle */}
      <span className="font-['Vazirmatn'] font-black text-lg text-white mt-1">
        جریمه کسر زمان اعمال شد
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
          <span className="text-[#FF3B30] mx-2 font-black">→</span>
          <span className="text-[#FF3B30] font-black">{calculatedNewScore}s</span>
        </bdi>
      </div>
    </div>
  );
};
