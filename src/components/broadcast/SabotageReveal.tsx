import React from 'react';
import { PlayerId, SabotageType, PublicSabotageState } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { BigGlovesIcon, DelayIcon, LimitedAttemptsIcon, SabotageIcon, EliasTriangleIcon, EmadCircleIcon } from './GameIcons';

interface SabotageRevealProps {
  sabotage: SabotageType | PublicSabotageState;
  targetPlayer?: PlayerId;
  className?: string;
}

/**
 * FULL HERO SABOTAGE REVEAL (Patch 2.3)
 * Replaces TimerHero during sabotage event:
 * - Giant sabotage icon (64-72px)
 * - One short label: دستکش بزرگ / ۵ ثانیه تأخیر / فقط ۲ تلاش
 * - Target player identity prominently highlighted
 * - Card flip animation
 */
export const SabotageReveal: React.FC<SabotageRevealProps> = ({
  sabotage,
  targetPlayer,
  className = '',
}) => {
  const isStateObj = typeof sabotage === 'object' && sabotage !== null;
  const target = isStateObj ? (sabotage as PublicSabotageState).target : targetPlayer;

  const getSabotageDetails = () => {
    if (isStateObj) {
      const s = sabotage as PublicSabotageState;
      const lower = s.title.toLowerCase();
      let icon = <SabotageIcon size={64} color="#FF3B30" />;
      let shortLabel = 'خرابکاری';
      if (lower.includes('glove')) {
        icon = <BigGlovesIcon size={64} color="#FF3B30" />;
        shortLabel = 'دستکش بزرگ';
      } else if (lower.includes('delay')) {
        icon = <DelayIcon size={64} color="#FFB000" />;
        shortLabel = '۵ ثانیه تأخیر';
      } else if (lower.includes('attempt')) {
        icon = <LimitedAttemptsIcon size={64} color="#FF2738" />;
        shortLabel = 'فقط ۲ تلاش';
      }

      return {
        title: shortLabel,
        desc: s.persianDescription || s.description,
        icon,
      };
    }

    switch (sabotage) {
      case 'BIG_GLOVES':
        return {
          title: 'دستکش بزرگ',
          icon: <BigGlovesIcon size={64} color="#FF3B30" />,
          desc: 'اجرای چالش با دستکش‌های بکس حجیم',
        };
      case '5_SEC_DELAY':
        return {
          title: '۵ ثانیه تأخیر',
          icon: <DelayIcon size={64} color="#FFB000" />,
          desc: 'شروع با ۵ ثانیه تأخیر نسبت به حریف',
        };
      case 'ONLY_2_ATTEMPTS':
        return {
          title: 'فقط ۲ تلاش',
          icon: <LimitedAttemptsIcon size={64} color="#FF2738" />,
          desc: 'کاهش فرصت پرتاب از ۳ به ۲ پرتاب',
        };
      default:
        return {
          title: 'خرابکاری راند',
          icon: <SabotageIcon size={64} color="#FF3B30" />,
          desc: 'مانع تصادفی برای حریف',
        };
    }
  };

  const info = getSabotageDetails();
  const meta = target ? PLAYERS_IDENTITY[target] : null;

  return (
    <div
      id="broadcast-sabotage-card"
      className={`w-[94%] max-w-xl mx-auto animate-flip-in rounded-3xl border-2 border-[#FF3B30] bg-gradient-to-b from-[#2B080A] via-[#140608] to-[#0A0506] p-4 sm:p-5 shadow-[0_0_48px_rgba(255,59,48,0.45)] select-none text-center flex flex-col items-center justify-center ${className}`}
      dir="rtl"
    >
      {/* Target Player Pill */}
      {target && meta && (
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/80 border border-[#FF3B30]/50 mb-2">
          <span className="font-['Vazirmatn'] text-xs text-neutral-400 font-bold">هدف خرابکاری:</span>
          {target === 'ELIAS' ? (
            <EliasTriangleIcon size={20} color="#FF2738" />
          ) : (
            <EmadCircleIcon size={20} color="#00C98D" />
          )}
          <span className="font-['Vazirmatn'] font-black text-sm text-white">{meta.persianName}</span>
          <span className="font-mono text-xs font-bold text-[#FF3B30]">({meta.tag})</span>
        </div>
      )}

      {/* Giant Sabotage Icon */}
      <div className="p-3 sm:p-4 rounded-3xl bg-[#080203] border border-[#FF3B30]/60 shadow-inner my-1">
        {info.icon}
      </div>

      {/* Short Dominant Label */}
      <h3 className="font-['Vazirmatn'] font-black text-2xl sm:text-3xl text-white mt-1">
        {info.title}
      </h3>

      {/* Short Description */}
      <p className="font-['Vazirmatn'] text-sm sm:text-base text-neutral-300 font-medium mt-1 max-w-xs">
        {info.desc}
      </p>
    </div>
  );
};
