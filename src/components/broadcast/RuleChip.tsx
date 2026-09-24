import React from 'react';
import { CupTowerIcon, TargetIcon, MysteryBiteIcon, SafeIcon, RiskIcon, TimerIcon } from './GameIcons';

interface RuleChipProps {
  roundNumber: number;
  persianRule: string;
  rewardSeconds?: number;
  rewardLabel?: string;
  className?: string;
}

export const RuleChip: React.FC<RuleChipProps> = ({
  roundNumber,
  persianRule,
  rewardSeconds,
  rewardLabel,
  className = '',
}) => {
  const getIcon = () => {
    switch (roundNumber) {
      case 1:
        return <CupTowerIcon size={24} color="#FFC400" />;
      case 2:
        return <TargetIcon size={24} color="#00C98D" />;
      case 3:
        return <MysteryBiteIcon size={24} color="#FFC400" />;
      case 4:
        return <TimerIcon size={24} color="#FF2738" />;
      case 5:
        return <SafeIcon size={24} color="#00C98D" />;
      default:
        return <TimerIcon size={24} color="#FFC400" />;
    }
  };

  const conciseText = persianRule
    ? persianRule.split(' ').slice(0, 8).join(' ')
    : '';

  return (
    <div
      className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#111111]/90 border border-[#262626] backdrop-blur-md shadow-lg select-none ${className}`}
      dir="rtl"
    >
      <div className="shrink-0 p-1.5 rounded-xl bg-[#171717] border border-[#333333]">
        {getIcon()}
      </div>

      <div className="flex flex-col text-right">
        <span className="font-['Vazirmatn'] font-bold text-xs sm:text-sm text-[#F7F7F7] leading-tight">
          {conciseText}
        </span>
      </div>

      {(rewardLabel || rewardSeconds) && (
        <span className="shrink-0 font-mono font-black text-xs text-[#FFC400] px-2 py-0.5 rounded-lg bg-[#FFC400]/20 border border-[#FFC400]/40 tabular-nums">
          {rewardLabel || `+${rewardSeconds}s`}
        </span>
      )}
    </div>
  );
};
