import React from 'react';
import { BroadcastAiState } from '../../types/game';
import { RefereeVisualMark } from './RefereeVisualMark';
import { Flame } from 'lucide-react';

interface RefereeHeaderProps {
  showTitle?: string;
  roundNumber: number;
  totalRounds: number;
  aiState: BroadcastAiState;
  className?: string;
  compact?: boolean;
}

/**
 * COMPACT AUDIENCE BROADCAST HEADER (Patch 2.3)
 * - Max ~64–72px high in portrait
 * - AI Referee mark: 44px with halo animation
 * - DADASHMODE centered & strong
 * - Clean round progress dots (● ○ ○ ○ ○) & isolated LTR ratio (1 / 5)
 * - Safe padding >= 12px
 * - No microtext clutter or overflow
 */
export const RefereeHeader: React.FC<RefereeHeaderProps> = ({
  roundNumber,
  totalRounds = 5,
  aiState,
  className = '',
  compact = false,
}) => {
  // Render dot progress array
  const dots = Array.from({ length: totalRounds }, (_, i) => (i < roundNumber ? '●' : '○')).join(' ');

  return (
    <header
      id="broadcast-header"
      className={`relative z-20 w-full h-16 max-h-[68px] flex items-center justify-between px-3 sm:px-4 border-b border-[#222222] bg-[#070707]/95 backdrop-blur-md select-none shrink-0 ${className}`}
    >
      {/* 1. LEFT: AI REFEREE CHARACTER MARK (44px, Gold/White base, Dynamic Halo) */}
      <div className="flex items-center gap-2 shrink-0 min-w-[48px]">
        <RefereeVisualMark state={aiState} size={42} />
      </div>

      {/* 2. CENTER: DADASHMODE & ROUND PROGRESS DOTS */}
      <div className="flex flex-col items-center justify-center text-center leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-lg sm:text-xl tracking-wider text-white uppercase drop-shadow">
            DADASHMODE
          </span>
        </div>

        {/* Round Progress: Clean dots + LTR isolated ratio (1 / 5) */}
        <div className="flex items-center gap-2 mt-0.5">
          <bdi dir="ltr" className="text-xs sm:text-sm font-mono font-black text-[#FFC400] tracking-widest">
            {dots}
          </bdi>
          <span className="text-neutral-600 text-xs">•</span>
          <bdi dir="ltr" className="text-xs sm:text-sm font-mono font-bold text-neutral-300">
            {roundNumber} / {totalRounds}
          </bdi>
        </div>
      </div>

      {/* 3. RIGHT: EMBLEM BADGE (Symmetric balance to AI mark) */}
      <div className="flex items-center justify-end shrink-0 min-w-[48px]">
        <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#FFC400]/40 flex items-center justify-center shadow-md">
          <Flame className="w-5 h-5 text-[#FFC400] fill-[#FFC400]" />
        </div>
      </div>
    </header>
  );
};
