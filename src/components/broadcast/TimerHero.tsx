import React from 'react';
import { PublicTimerState } from '../../types/game';

interface TimerHeroProps {
  timer: PublicTimerState;
  className?: string;
  size?: 'normal' | 'large' | 'compact';
}

/**
 * TIMER HERO (Patch 2.3)
 * - Hero display only during active countdown
 * - Digits: ~64–76px font-mono tabular-nums in isolated LTR
 * - No micro English headings (removed "OFFICIAL COUNTDOWN" clutter)
 * - Single short Persian label (>=14px)
 * - Urgent red state during last 5 seconds
 */
export const TimerHero: React.FC<TimerHeroProps> = ({
  timer,
  className = '',
  size = 'large',
}) => {
  const { secondsRemaining, isRunning, isValidationTimer } = timer;

  const isUrgent = secondsRemaining <= 5 && isRunning && !isValidationTimer;

  // Format into MM:SS
  const mins = Math.floor(Math.max(0, secondsRemaining) / 60);
  const secs = Math.max(0, secondsRemaining) % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const sizeClasses = {
    compact: 'text-4xl sm:text-5xl py-1 px-3',
    normal: 'text-5xl sm:text-6xl py-2 px-5',
    large: 'text-6xl sm:text-7xl py-2.5 px-6',
  };

  return (
    <div
      id="broadcast-timer-hero"
      className={`w-[94%] max-w-xl mx-auto rounded-3xl border flex flex-col items-center justify-center select-none shadow-2xl transition-all duration-200 overflow-hidden ${
        isValidationTimer
          ? 'bg-[#261805] border-[#FFB000] text-[#FFB000] shadow-[0_0_24px_rgba(255,176,0,0.35)]'
          : isUrgent
          ? 'bg-[#260808] border-[#FF3B30] text-[#FF3B30] animate-pulse shadow-[0_0_32px_rgba(255,59,48,0.4)]'
          : isRunning
          ? 'bg-[#111111] border-[#FFC400]/60 text-[#FFC400] shadow-[0_0_20px_rgba(255,196,0,0.2)]'
          : 'bg-[#0E0E0E] border-[#2E2E2E] text-[#F7F7F7]'
      } ${className}`}
    >
      {/* Main Massive Tabular Digits (64-76px) */}
      <bdi
        dir="ltr"
        className={`font-mono font-black tabular-nums tracking-tight leading-none ${sizeClasses[size]}`}
        style={{
          fontVariantNumeric: 'tabular-nums',
          textShadow: isUrgent
            ? '0 0 24px rgba(255, 59, 48, 0.65)'
            : isRunning
            ? '0 0 20px rgba(255, 196, 0, 0.4)'
            : 'none',
        }}
      >
        {timeFormatted}
      </bdi>

      {/* Short Persian Label (>=14px) */}
      <div className="font-['Vazirmatn'] text-[14px] sm:text-[15px] font-bold pb-2 text-center" dir="rtl">
        {isValidationTimer
          ? 'اعتبارسنجی برج (۲ ثانیه)'
          : isUrgent
          ? 'ثانیه‌های پایانی!'
          : isRunning
          ? 'زمان باقی‌مانده'
          : 'توقف زمان'}
      </div>
    </div>
  );
};
