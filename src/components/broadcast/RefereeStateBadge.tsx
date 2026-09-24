import React from 'react';
import { BroadcastAiState } from '../../types/game';
import { RefereeVisualMark } from './RefereeVisualMark';

interface RefereeStateBadgeProps {
  state: BroadcastAiState;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export const RefereeStateBadge: React.FC<RefereeStateBadgeProps> = ({
  state,
  className = '',
  size = 'md',
  compact = false,
}) => {
  const getBadgeMeta = () => {
    switch (state) {
      case 'SPEAKING':
        return {
          bgClass: 'bg-[#1a1608] border-[#FFC400] text-[#FFC400]',
          glowClass: 'shadow-[0_0_16px_rgba(255,196,0,0.35)]',
          labelFa: 'در حال صحبت',
          labelEn: 'REFEREE SPEAKING',
          dotClass: 'bg-[#FFC400] animate-pulse',
        };
      case 'THINKING':
        return {
          bgClass: 'bg-[#180d26] border-[#A855F7] text-[#D8B4FE]',
          glowClass: 'shadow-[0_0_16px_rgba(168,85,247,0.3)]',
          labelFa: 'در حال تصمیم‌گیری',
          labelEn: 'AI PROCESSING',
          dotClass: 'bg-[#A855F7] animate-ping',
        };
      case 'LISTENING':
        return {
          bgClass: 'bg-[#091b15] border-[#00C98D] text-[#00C98D]',
          glowClass: 'shadow-[0_0_16px_rgba(0,201,141,0.3)]',
          labelFa: 'در حال شنیدن',
          labelEn: 'AI LISTENING',
          dotClass: 'bg-[#00C98D] animate-pulse',
        };
      case 'REVIEW':
        return {
          bgClass: 'bg-[#261805] border-[#FFB000] text-[#FFB000]',
          glowClass: 'shadow-[0_0_20px_rgba(255,176,0,0.5)] ring-2 ring-[#FFB000]/60',
          labelFa: 'بازبینی VAR',
          labelEn: 'VAR REVIEW',
          dotClass: 'bg-[#FFB000] animate-bounce',
        };
      case 'OFFLINE':
        return {
          bgClass: 'bg-[#141414] border-[#444444] text-[#888888]',
          glowClass: '',
          labelFa: 'داور محلی',
          labelEn: 'LOCAL REFEREE',
          dotClass: 'bg-[#666666]',
        };
      case 'IDLE':
      default:
        return {
          bgClass: 'bg-[#111111] border-[#FFC400]/40 text-[#F7F7F7]',
          glowClass: '',
          labelFa: 'داور رسمی هوش مصنوعی',
          labelEn: 'AI REFEREE ACTIVE',
          dotClass: 'bg-[#FFC400]',
        };
    }
  };

  const meta = getBadgeMeta();

  const markSizes = {
    sm: 28,
    md: 38,
    lg: 48,
  };

  return (
    <div
      id="broadcast-referee-badge"
      className={`inline-flex items-center gap-2.5 px-2.5 py-1.5 rounded-2xl border backdrop-blur-md transition-all duration-200 ${meta.bgClass} ${meta.glowClass} ${className}`}
      aria-label={`AI Referee Status: ${meta.labelEn}`}
      dir="rtl"
    >
      {/* Visual Mark */}
      <RefereeVisualMark state={state} size={markSizes[size]} />

      {!compact && (
        <div className="flex flex-col text-right leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
            <span className="font-['Vazirmatn'] font-black text-xs sm:text-sm tracking-wide">
              {meta.labelFa}
            </span>
          </div>
          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider font-extrabold uppercase opacity-75">
            {meta.labelEn}
          </span>
        </div>
      )}
    </div>
  );
};
