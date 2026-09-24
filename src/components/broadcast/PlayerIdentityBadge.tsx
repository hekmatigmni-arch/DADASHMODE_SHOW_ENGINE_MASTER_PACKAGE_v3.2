import React from 'react';
import { PlayerId } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { EliasTriangleIcon, EmadCircleIcon } from './GameIcons';

interface PlayerIdentityBadgeProps {
  playerId: PlayerId;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showName?: boolean;
  showPersianName?: boolean;
  className?: string;
}

export const PlayerIdentityBadge: React.FC<PlayerIdentityBadgeProps> = ({
  playerId,
  size = 'md',
  showName = true,
  showPersianName = true,
  className = '',
}) => {
  const isElias = playerId === 'ELIAS';
  const meta = PLAYERS_IDENTITY[playerId];

  const sizeClasses = {
    sm: 'text-xs gap-1.5 px-2 py-0.5',
    md: 'text-sm gap-2 px-2.5 py-1',
    lg: 'text-base gap-2.5 px-3 py-1.5',
    hero: 'text-xl gap-3 px-4 py-2',
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 28,
    hero: 38,
  };

  return (
    <div
      className={`inline-flex items-center rounded-xl border font-black transition-all ${
        isElias
          ? 'bg-[#1a080a] border-[#FF2738]/60 text-white'
          : 'bg-[#061813] border-[#00C98D]/60 text-white'
      } ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: isElias
          ? '0 0 12px rgba(255, 39, 56, 0.2)'
          : '0 0 12px rgba(0, 201, 141, 0.2)',
      }}
      aria-label={`Player ${playerId} (${meta.symbol} ${meta.letter})`}
    >
      {/* 1. Redundant Shape + Letter Vector (Always distinct even in grayscale) */}
      <div className="shrink-0 flex items-center justify-center">
        {isElias ? (
          <EliasTriangleIcon size={iconSizes[size]} color="#FF2738" />
        ) : (
          <EmadCircleIcon size={iconSizes[size]} color="#00C98D" />
        )}
      </div>

      {/* 2. Player Text Identifiers */}
      {showName && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-mono tracking-wider font-extrabold uppercase">
            {meta.name}
          </span>
          {showPersianName && (
            <span className="font-['Vazirmatn'] text-neutral-400 font-bold opacity-90">
              ({meta.persianName})
            </span>
          )}
        </div>
      )}
    </div>
  );
};
