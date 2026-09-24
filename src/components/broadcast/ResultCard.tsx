import React from 'react';
import { PlayerId } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { WinnerIcon, EliasTriangleIcon, EmadCircleIcon } from './GameIcons';

interface ResultCardProps {
  winnerId?: PlayerId | null;
  roundTitle: string;
  roundPersianTitle: string;
  rewardSeconds?: number;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  winnerId,
  roundTitle,
  roundPersianTitle,
  rewardSeconds,
  className = '',
}) => {
  const meta = winnerId ? PLAYERS_IDENTITY[winnerId] : null;

  return (
    <div
      id="broadcast-result-card"
      className={`rounded-3xl border border-[#333333] bg-[#111111]/90 p-4 sm:p-5 shadow-xl select-none backdrop-blur-md ${className}`}
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#FFC400]/20 border border-[#FFC400]/50 text-[#FFC400]">
            <WinnerIcon size={30} color="#FFC400" />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              ROUND RESULT • {roundTitle}
            </span>
            <h4 className="font-['Vazirmatn'] font-black text-base sm:text-lg text-white">
              {winnerId && meta
                ? `برنده راند: ${meta.persianName}`
                : 'راند بدون برنده'}
            </h4>
          </div>
        </div>

        {winnerId && meta && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070707] border border-[#262626]">
            {winnerId === 'ELIAS' ? (
              <EliasTriangleIcon size={22} color="#FF2738" />
            ) : (
              <EmadCircleIcon size={22} color="#00C98D" />
            )}
            <span className="font-mono font-black text-sm text-white">{meta.name}</span>
            {rewardSeconds && (
              <span className="font-mono font-black text-sm text-[#FFC400] tabular-nums">
                (+{rewardSeconds}s)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
