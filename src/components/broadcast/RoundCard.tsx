import React from 'react';
import {
  CupTowerIcon,
  TargetIcon,
  MysteryBiteIcon,
  SafeIcon,
  RiskIcon,
  TimerIcon,
} from './GameIcons';

interface RoundCardProps {
  roundNumber: number;
  totalRounds?: number;
  title?: string;
  persianTitle: string;
  persianRule: string;
  rewardSeconds?: number;
  rewardLabel?: string;
  className?: string;
  compact?: boolean;
  is3dGlass?: boolean;
}

/**
 * ROUND CARD — ICON FIRST (Patch 2.3 & V11 3D Glass)
 * - Width: 92–94% of stage
 * - Dominant icon: 56–64px
 * - Title: 22–26px
 * - Rule: max one line, 15–17px
 * - Prominent Reward chip: +10s / +25s / +30s with isolated LTR
 * - Clean visual hierarchy: ICON + TITLE + REWARD before rule
 * - No microtext clutter
 */
export const RoundCard: React.FC<RoundCardProps> = ({
  roundNumber,
  persianTitle,
  persianRule,
  rewardSeconds,
  rewardLabel,
  className = '',
  compact = false,
  is3dGlass = false,
}) => {
  // Dominant round icon (56-64px)
  const getRoundIcon = () => {
    const iconSize = compact ? 40 : 58;
    switch (roundNumber) {
      case 1:
        return <CupTowerIcon size={iconSize} color="#FFC400" />;
      case 2:
        return <TargetIcon size={iconSize} color="#00C98D" />;
      case 3:
        return <MysteryBiteIcon size={iconSize} color="#FFC400" />;
      case 4:
        return <TimerIcon size={iconSize} color="#FF2738" />;
      case 5:
        return (
          <div className="flex items-center gap-1">
            <SafeIcon size={compact ? 28 : 42} color="#00C98D" />
            <RiskIcon size={compact ? 28 : 42} color="#FF2738" />
          </div>
        );
      default:
        return <TimerIcon size={iconSize} color="#FFC400" />;
    }
  };

  // One line concise rule (max 6-8 Persian words)
  const singleLineRule = persianRule
    ? persianRule.split(' ').slice(0, 8).join(' ')
    : '';

  // Clean reward text with LTR isolation
  const formattedReward = rewardLabel
    ? rewardLabel
    : rewardSeconds
    ? `+${rewardSeconds}s`
    : roundNumber === 2
    ? '+5s / +20s'
    : roundNumber === 5
    ? '+8s / +25s'
    : '+15s';

  return (
    <div
      id="broadcast-round-card"
      className={`w-[94%] max-w-xl mx-auto p-3 sm:p-4 shadow-xl select-none ${
        is3dGlass
          ? 'lg-card glow-cyan'
          : 'rounded-2xl border border-[#262626] bg-[#0E0E0E]/95 backdrop-blur-md'
      } ${className}`}
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Right side: Dominant Icon + Title & One Line Rule */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Dominant Icon (56-64px) */}
          <div className="shrink-0 p-2 sm:p-2.5 rounded-2xl bg-[#171717] border border-[#2D2D2D] shadow-inner flex items-center justify-center">
            {getRoundIcon()}
          </div>

          <div className="flex flex-col text-right min-w-0 flex-1">
            {/* Title (22-26px) */}
            <h2 className="font-['Vazirmatn'] font-black text-xl sm:text-2xl text-white leading-tight truncate drop-shadow">
              {persianTitle}
            </h2>

            {/* Rule (max one line, 15-17px) */}
            <p className="font-['Vazirmatn'] text-[15px] sm:text-[16px] text-neutral-300 font-medium mt-1 truncate leading-tight">
              {singleLineRule}
            </p>
          </div>
        </div>

        {/* Left side: Prominent Reward Chip */}
        <div className="shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FFC400]/15 to-[#00C98D]/15 border border-[#FFC400]/60 flex items-center justify-center shadow-lg">
            <bdi dir="ltr" className="font-mono font-black text-base sm:text-lg text-[#FFC400] tracking-tight tabular-nums">
              {formattedReward}
            </bdi>
          </div>
        </div>
      </div>
    </div>
  );
};
