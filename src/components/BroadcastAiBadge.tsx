import React from 'react';
import { BroadcastAiState } from '../types/game';
import { Shield, Radio, Volume2, Cpu, Eye, WifiOff, AlertTriangle } from 'lucide-react';

interface BroadcastAiBadgeProps {
  state: BroadcastAiState;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BroadcastAiBadge: React.FC<BroadcastAiBadgeProps> = ({
  state,
  className = '',
  size = 'md',
}) => {
  const getBadgeConfig = () => {
    switch (state) {
      case 'SPEAKING':
        return {
          icon: Volume2,
          bgClass: 'bg-yellow-500/20 border-yellow-400 text-yellow-300',
          indicatorColor: 'bg-yellow-400 animate-ping',
          labelFa: 'در حال صحبت',
          labelEn: 'REFEREE SPEAKING',
          badgeRing: 'ring-2 ring-yellow-400/50 animate-pulse',
        };
      case 'THINKING':
        return {
          icon: Cpu,
          bgClass: 'bg-purple-500/20 border-purple-400 text-purple-300',
          indicatorColor: 'bg-purple-400 animate-spin',
          labelFa: 'در حال تصمیم‌گیری',
          labelEn: 'AI PROCESSING',
          badgeRing: 'ring-2 ring-purple-400/40',
        };
      case 'LISTENING':
        return {
          icon: Radio,
          bgClass: 'bg-emerald-500/20 border-emerald-400 text-emerald-300',
          indicatorColor: 'bg-emerald-400 animate-pulse',
          labelFa: 'در حال شنیدن',
          labelEn: 'AI LISTENING',
          badgeRing: 'ring-2 ring-emerald-400/50',
        };
      case 'REVIEW':
        return {
          icon: Eye,
          bgClass: 'bg-amber-500/30 border-amber-400 text-amber-300',
          indicatorColor: 'bg-amber-500 animate-bounce',
          labelFa: 'بازبینی VAR',
          labelEn: 'VAR REVIEW ACTIVE',
          badgeRing: 'ring-4 ring-amber-400/60 animate-pulse',
        };
      case 'OFFLINE':
        return {
          icon: WifiOff,
          bgClass: 'bg-neutral-800 border-neutral-600 text-neutral-400',
          indicatorColor: 'bg-neutral-500',
          labelFa: 'موتور محلی',
          labelEn: 'OFFLINE MODE',
          badgeRing: '',
        };
      case 'IDLE':
      default:
        return {
          icon: Shield,
          bgClass: 'bg-sky-500/15 border-sky-400/80 text-sky-300',
          indicatorColor: 'bg-sky-400',
          labelFa: 'داور رسمی',
          labelEn: 'AI REFEREE ACTIVE',
          badgeRing: '',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      id="broadcast-ai-referee-badge"
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 ${config.bgClass} ${config.badgeRing} ${className}`}
      aria-label={`AI Referee Status: ${config.labelEn}`}
    >
      {/* Geometric Hexagon / Ring Container */}
      <div className="relative flex items-center justify-center">
        <div className={`w-2 h-2 rounded-full ${config.indicatorColor}`} />
      </div>

      <Icon className={`${iconSizes[size]} shrink-0`} />

      <div className="flex flex-col text-right leading-none">
        <span className="font-['Vazirmatn'] font-black text-xs sm:text-sm tracking-wide">
          {config.labelFa}
        </span>
        <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider opacity-80">
          {config.labelEn}
        </span>
      </div>
    </div>
  );
};
