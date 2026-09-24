import React, { useEffect, useState, useRef } from 'react';
import { PlayerId, PublicPlayerState } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { EliasTriangleIcon, EmadCircleIcon } from './GameIcons';

interface PlayerScoreCardProps {
  player: PublicPlayerState;
  className?: string;
  isWinner?: boolean;
  compact?: boolean;
  is3dGlass?: boolean;
}

/**
 * PLAYER SCORE CARD (Patch 2.3 & V11 3D Glass)
 * - Shape + Letter + Persian Name
 * - Dominant Score readable at 25–30% video scale
 * - Isolated LTR format: <bdi dir="ltr">{player.seconds}s</bdi> (never 'S 20')
 * - No microtext clutter (removed 'TIME BANK' labels)
 * - Mode badge only when relevant
 */
export const PlayerScoreCard: React.FC<PlayerScoreCardProps> = ({
  player,
  className = '',
  isWinner = false,
  compact = false,
  is3dGlass = false,
}) => {
  const isElias = player.id === 'ELIAS';
  const meta = PLAYERS_IDENTITY[player.id];

  // Track score delta for motion
  const [animationClass, setAnimationClass] = useState<string>('');
  const prevScoreRef = useRef(player.seconds);

  useEffect(() => {
    const diff = player.seconds - prevScoreRef.current;
    if (diff > 0) {
      setAnimationClass('animate-reward-pop');
      const timer = setTimeout(() => setAnimationClass(''), 250);
      return () => clearTimeout(timer);
    } else if (diff < 0) {
      setAnimationClass('animate-penalty-shake');
      const timer = setTimeout(() => setAnimationClass(''), 250);
      return () => clearTimeout(timer);
    }
    prevScoreRef.current = player.seconds;
  }, [player.seconds]);

  return (
    <div
      id={`broadcast-score-card-${player.id.toLowerCase()}`}
      className={`relative rounded-3xl select-none transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        is3dGlass
          ? isElias
            ? 'lg-card glow-red'
            : 'lg-card glow-green'
          : isElias
          ? 'bg-[#140608] border border-[#FF2738]/60 shadow-[0_0_24px_rgba(255,39,56,0.22)]'
          : 'bg-[#05140F] border border-[#00C98D]/60 shadow-[0_0_24px_rgba(0,201,141,0.22)]'
      } ${isWinner ? 'ring-4 ring-[#FFC400] shadow-[0_0_36px_rgba(255,196,0,0.5)]' : ''} ${animationClass} ${className}`}
    >
      <div className="p-3 sm:p-4 flex flex-col justify-between h-full">
        {/* Top: Redundant Player Identification (Shape + Letter + Persian Name) */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <div className="shrink-0">
              {isElias ? (
                <EliasTriangleIcon size={compact ? 24 : 32} color="#FF2738" />
              ) : (
                <EmadCircleIcon size={compact ? 24 : 32} color="#00C98D" />
              )}
            </div>
            <div className="flex flex-col text-right leading-tight">
              <span className="font-['Vazirmatn'] font-black text-base sm:text-lg text-white">
                {meta.persianName}
              </span>
              <span className="font-mono text-[11px] font-bold text-neutral-400">
                {meta.tag}
              </span>
            </div>
          </div>

          {/* Mode/Choice Badge (Only when relevant) */}
          {player.lockedChoice && (
            <div className="px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#FFC400]/60 text-[#FFC400] font-mono text-xs font-black">
              🔒 {player.lockedChoice}
            </div>
          )}
        </div>

        {/* Center: Dominant Score Display in isolated LTR (e.g. 20s, NEVER S 20) */}
        <div className="my-2 sm:my-3 flex items-center justify-center">
          <bdi
            dir="ltr"
            className={`font-mono font-black tabular-nums tracking-tighter leading-none ${
              compact ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'
            } ${isElias ? 'text-[#FF2738]' : 'text-[#00C98D]'}`}
            style={{
              fontVariantNumeric: 'tabular-nums',
              textShadow: isElias
                ? '0 0 20px rgba(255, 39, 56, 0.45)'
                : '0 0 20px rgba(0, 201, 141, 0.45)',
            }}
          >
            {player.seconds}s
          </bdi>
        </div>

        {/* Minimal Bottom Status (>=14px for readability) */}
        <div className="w-full pt-1.5 border-t border-[#262626] flex items-center justify-between text-xs sm:text-sm font-['Vazirmatn'] text-neutral-300 font-bold">
          <span>بانک</span>
          <span>{player.seconds >= 20 ? 'آماده فینال' : 'در خطر'}</span>
        </div>
      </div>
    </div>
  );
};
