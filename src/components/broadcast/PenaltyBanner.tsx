import React from 'react';
import { PlayerId } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { EliasTriangleIcon, EmadCircleIcon, SabotageIcon } from './GameIcons';

interface PenaltyBannerProps {
  player: PlayerId;
  seconds: number;
  reason?: string;
  className?: string;
}

export const PenaltyBanner: React.FC<PenaltyBannerProps> = ({
  player,
  seconds,
  reason,
  className = '',
}) => {
  const isElias = player === 'ELIAS';
  const meta = PLAYERS_IDENTITY[player];

  return (
    <div
      id="broadcast-penalty-banner"
      className={`animate-penalty-shake rounded-2xl bg-gradient-to-r from-[#FF3B30]/30 via-[#171717] to-[#FF3B30]/30 border-2 border-[#FF3B30] p-3 sm:p-4 flex items-center justify-between shadow-[0_0_30px_rgba(255,59,48,0.35)] select-none ${className}`}
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[#FF3B30]/20 border border-[#FF3B30]/50 text-[#FF3B30]">
          <SabotageIcon size={32} color="#FF3B30" />
        </div>
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <span className="font-['Vazirmatn'] font-black text-sm sm:text-base text-white">
              جریمه خطا / کسر زمان
            </span>
            <span className="font-mono text-[10px] font-bold text-[#FF3B30] uppercase tracking-wider">
              PENALTY
            </span>
          </div>
          {reason && (
            <span className="font-['Vazirmatn'] text-xs text-neutral-300 font-bold mt-0.5">
              {reason}
            </span>
          )}
        </div>
      </div>

      {/* Recipient Identity */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070707] border border-[#333333]">
        {isElias ? (
          <EliasTriangleIcon size={24} color="#FF2738" />
        ) : (
          <EmadCircleIcon size={24} color="#00C98D" />
        )}
        <span className="font-mono font-black text-lg sm:text-xl text-[#FF3B30] tabular-nums">
          -{Math.abs(seconds)} SEC
        </span>
      </div>
    </div>
  );
};
