import React from 'react';
import { PlayerId } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { EliasTriangleIcon, EmadCircleIcon, WinnerIcon } from './GameIcons';

interface RewardBannerProps {
  player: PlayerId;
  seconds: number;
  reason?: string;
  className?: string;
}

export const RewardBanner: React.FC<RewardBannerProps> = ({
  player,
  seconds,
  reason,
  className = '',
}) => {
  const isElias = player === 'ELIAS';
  const meta = PLAYERS_IDENTITY[player];

  return (
    <div
      id="broadcast-reward-banner"
      className={`animate-reward-pop rounded-2xl bg-gradient-to-r from-[#FFC400]/25 via-[#171717] to-[#FFC400]/25 border-2 border-[#FFC400] p-3 sm:p-4 flex items-center justify-between shadow-[0_0_30px_rgba(255,196,0,0.35)] select-none ${className}`}
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[#FFC400]/20 border border-[#FFC400]/50 text-[#FFC400]">
          <WinnerIcon size={32} color="#FFC400" />
        </div>
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <span className="font-['Vazirmatn'] font-black text-sm sm:text-base text-white">
              جایزه راند اعمال شد
            </span>
            <span className="font-mono text-[10px] font-bold text-[#FFC400] uppercase tracking-wider">
              REWARD ADDED
            </span>
          </div>
          {reason && (
            <span className="font-['Vazirmatn'] text-xs text-neutral-300 font-bold mt-0.5">
              {reason}
            </span>
          )}
        </div>
      </div>

      {/* Recipient Identity (Redundant Shape + Letter + Value) */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070707] border border-[#333333]">
        {isElias ? (
          <EliasTriangleIcon size={24} color="#FF2738" />
        ) : (
          <EmadCircleIcon size={24} color="#00C98D" />
        )}
        <span className="font-mono font-black text-lg sm:text-xl text-[#FFC400] tabular-nums">
          +{seconds} SEC
        </span>
      </div>
    </div>
  );
};
