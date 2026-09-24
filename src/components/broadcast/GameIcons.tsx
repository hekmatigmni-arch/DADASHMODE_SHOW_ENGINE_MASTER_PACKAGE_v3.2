import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * 1. CUP TOWER (برج لیوان)
 */
export const CupTowerIcon: React.FC<IconProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Cup Tower"
  >
    {/* Top cup */}
    <path d="M13 5L12 11H20L19 5H13Z" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    {/* Middle 2 cups */}
    <path d="M9 13L8 19H14L13 13H9Z" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M19 13L18 19H24L23 13H19Z" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    {/* Base 3 cups */}
    <path d="M5 21L4 27H10L9 21H5Z" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M13 21L12 27H18L17 21H13Z" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    <path d="M21 21L20 27H26L25 21H21Z" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    {/* Base line */}
    <line x1="2" y1="28" x2="30" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 2. TARGET (سیبل هدف / پرتاب)
 */
export const TargetIcon: React.FC<IconProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Target"
  >
    <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="2.5" />
    <circle cx="16" cy="16" r="8.5" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
    <circle cx="16" cy="16" r="4" fill={color} />
    {/* Crosshairs */}
    <line x1="16" y1="1" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="26" x2="16" y2="31" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="1" y1="16" x2="6" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="16" x2="31" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 3. FOOD / MYSTERY BITE (لقمه مرموز)
 */
export const MysteryBiteIcon: React.FC<IconProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Mystery Bite"
  >
    {/* Burger / Sandwich bun */}
    <path d="M5 14C5 8.5 9.5 5 16 5C22.5 5 27 8.5 27 14H5Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />
    <rect x="4" y="15" width="24" height="3" rx="1.5" fill={color} />
    <path d="M6 19C6 19 8 21 11 21C14 21 14 19 17 19C20 19 20 21 23 21C25 21 26 19 26 19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M5 23H27V24C27 27 22.5 29 16 29C9.5 29 5 27 5 24V23Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />
    {/* Bite mark on the right */}
    <path d="M26 12C24 13.5 24 16.5 26 18" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

/**
 * 4. BIG GLOVES (دستکش‌های غول‌پیکر)
 */
export const BigGlovesIcon: React.FC<IconProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Big Gloves"
  >
    {/* Oversized Boxing Glove */}
    <path
      d="M7 16C5 12 7 6 13 5C19 4 23 7 24 13C24.5 16 23 18.5 21 20L21 24H10L10 20C8 19 7 17.5 7 16Z"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Glove thumb */}
    <path d="M7 14C5 15 4 18 6 20C8 22 10 21 11 19" stroke={color} strokeWidth="2" />
    {/* Wrist tape band */}
    <rect x="9" y="24" width="13" height="4" rx="1" fill={color} />
  </svg>
);

/**
 * 5. DELAY (تأخیر ۵ ثانیه)
 */
export const DelayIcon: React.FC<IconProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="5 Second Delay"
  >
    <circle cx="16" cy="17" r="11" stroke={color} strokeWidth="2.5" />
    <path d="M16 6V3" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Pause bars inside clock */}
    <rect x="13" y="12" width="2.5" height="10" rx="1" fill={color} />
    <rect x="17.5" y="12" width="2.5" height="10" rx="1" fill={color} />
    {/* +5 SEC badge */}
    <rect x="2" y="2" width="12" height="7" rx="2" fill={color} />
    <text x="8" y="7" fill="#070707" fontSize="5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">+5s</text>
  </svg>
);

/**
 * 6. LIMITED ATTEMPTS (فقط ۲ پرتاب)
 */
export const LimitedAttemptsIcon: React.FC<IconProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Only 2 Attempts"
  >
    {/* Attempt 1 (Valid) */}
    <circle cx="7" cy="16" r="4" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="2" />
    {/* Attempt 2 (Valid) */}
    <circle cx="16" cy="16" r="4" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="2" />
    {/* Attempt 3 (Struck Out / Denied) */}
    <circle cx="25" cy="16" r="4" stroke={color} strokeWidth="2" strokeDasharray="2 2" opacity="0.4" />
    <line x1="22" y1="13" x2="28" y2="19" stroke="#FF3B30" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="28" y1="13" x2="22" y2="19" stroke="#FF3B30" strokeWidth="2.5" strokeLinecap="round" />
    {/* '2x' header tag */}
    <text x="16" y="8" fill={color} fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">2 ATTEMPTS</text>
  </svg>
);

/**
 * 7. SAFE (حالت امن)
 */
export const SafeIcon: React.FC<IconProps> = ({ className = '', size = 32, color = '#00C98D' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Safe Mode"
  >
    <path
      d="M16 3L6 7V15C6 22 10.5 27.5 16 29C21.5 27.5 26 22 26 15V7L16 3Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Padlock inside shield */}
    <rect x="12" y="15" width="8" height="7" rx="1.5" fill={color} />
    <path d="M13.5 15V12C13.5 10.6 14.6 9.5 16 9.5C17.4 9.5 18.5 10.6 18.5 12V15" stroke={color} strokeWidth="2" />
  </svg>
);

/**
 * 8. RISK (حالت ریسک)
 */
export const RiskIcon: React.FC<IconProps> = ({ className = '', size = 32, color = '#FF2738' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Risk Mode"
  >
    {/* Flame / Lightning Hybrid */}
    <path
      d="M17 3L7 17H16L14 29L25 14H16L19 3H17Z"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Warning sparks */}
    <circle cx="6" cy="9" r="1.5" fill="#FFC400" />
    <circle cx="27" cy="8" r="1.5" fill="#FFC400" />
  </svg>
);

/**
 * 9. SABOTAGE (استخر خرابکاری)
 */
export const SabotageIcon: React.FC<IconProps> = ({ className = '', size = 32, color = '#FF3B30' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Sabotage"
  >
    {/* Hazard Diamond */}
    <rect x="16" y="2" width="19" height="19" rx="2" transform="rotate(45 16 2)" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.5" />
    {/* Exclamation / skull mark */}
    <line x1="16" y1="10" x2="16" y2="18" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <circle cx="16" cy="22.5" r="1.5" fill={color} />
  </svg>
);

/**
 * 10. MYSTERY BOX (جعبه مرموز)
 */
export const MysteryBoxIcon: React.FC<IconProps> = ({ className = '', size = 32, color = '#FFC400' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Mystery Box"
  >
    {/* 3D-styled crate */}
    <path d="M16 3L27 9V22L16 28L5 22V9L16 3Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="16" y1="3" x2="16" y2="28" stroke={color} strokeWidth="2" />
    <line x1="5" y1="9" x2="16" y2="15" stroke={color} strokeWidth="2" />
    <line x1="27" y1="9" x2="16" y2="15" stroke={color} strokeWidth="2" />
    {/* Question mark badge */}
    <circle cx="16" cy="15" r="4" fill="#070707" stroke={color} strokeWidth="1.5" />
    <text x="16" y="17.5" fill={color} fontSize="6" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">?</text>
  </svg>
);

/**
 * 11. REVIEW (بازبینی VAR / داور)
 */
export const ReviewIcon: React.FC<IconProps> = ({ className = '', size = 32, color = '#FFB000' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="VAR Review"
  >
    {/* Monitor screen */}
    <rect x="4" y="5" width="24" height="17" rx="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.5" />
    <path d="M12 26H20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M16 22V26" stroke={color} strokeWidth="2.5" />
    {/* Eye / scan in screen */}
    <path d="M8 13.5C8 13.5 11 9.5 16 9.5C21 9.5 24 13.5 24 13.5C24 13.5 21 17.5 16 17.5C11 17.5 8 13.5 8 13.5Z" stroke={color} strokeWidth="2" />
    <circle cx="16" cy="13.5" r="2" fill={color} />
  </svg>
);

/**
 * 12. WINNER (جام قهرمان)
 */
export const WinnerIcon: React.FC<IconProps> = ({ className = '', size = 32, color = '#FFC400' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Winner Trophy"
  >
    <path d="M8 5H24V14C24 18.5 20.5 22 16 22C11.5 22 8 18.5 8 14V5Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2.5" />
    <path d="M8 8H4C3 8 2 9 2 10V11C2 14 4.5 16.5 7.5 16.5L8 16.5" stroke={color} strokeWidth="2" />
    <path d="M24 8H28C29 8 30 9 30 10V11C30 14 27.5 16.5 24.5 16.5L24 16.5" stroke={color} strokeWidth="2" />
    <path d="M16 22V26" stroke={color} strokeWidth="2.5" />
    <path d="M10 27H22" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* Star inside trophy */}
    <polygon points="16,9 17.5,12 21,12.5 18.5,15 19,18 16,16.5 13,18 13.5,15 11,12.5 14.5,12" fill={color} />
  </svg>
);

/**
 * 13. STEAL (سرقت زمان)
 */
export const StealIcon: React.FC<IconProps> = ({ className = '', size = 32, color = '#FF2738' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Steal 5 Sec"
  >
    {/* Interlocking arrows */}
    <path d="M7 11H23M23 11L18 6M23 11L18 16" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M25 21H9M9 21L14 16M9 21L14 26" stroke="#FFC400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * 14. FINAL PRIZE (جایزه فینال)
 */
export const FinalPrizeIcon: React.FC<IconProps> = ({ className = '', size = 32, color = '#FFC400' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Final Prize"
  >
    {/* Big Diamond / Prize */}
    <polygon points="16,3 27,11 22,28 10,28 5,11" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="5" y1="11" x2="27" y2="11" stroke={color} strokeWidth="2" />
    <line x1="16" y1="3" x2="10" y2="28" stroke={color} strokeWidth="2" />
    <line x1="16" y1="3" x2="22" y2="28" stroke={color} strokeWidth="2" />
  </svg>
);

/**
 * 15. TIMER (تایمر مسابقه)
 */
export const TimerIcon: React.FC<IconProps> = ({ className = '', size = 32, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Timer"
  >
    <circle cx="16" cy="17" r="12" stroke={color} strokeWidth="2.5" />
    <path d="M16 17L16 10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M16 17L22 17" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M13 2H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M16 2V5" stroke={color} strokeWidth="2" />
  </svg>
);

/**
 * 16. ELIAS IDENTITY (▲ E - Red)
 */
export const EliasTriangleIcon: React.FC<IconProps> = ({ className = '', size = 28, color = '#FF2738' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Elias Identity (Triangle E)"
  >
    {/* High contrast border & inner shape */}
    <polygon points="14,3 26,24 2,24" fill={color} stroke="#070707" strokeWidth="2" strokeLinejoin="round" />
    <text x="14" y="21" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">E</text>
  </svg>
);

/**
 * 17. EMAD IDENTITY (● M - Teal)
 */
export const EmadCircleIcon: React.FC<IconProps> = ({ className = '', size = 28, color = '#00C98D' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Emad Identity (Circle M)"
  >
    {/* High contrast border & inner shape */}
    <circle cx="14" cy="14" r="12" fill={color} stroke="#070707" strokeWidth="2" />
    <text x="14" y="19" fill="#070707" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">M</text>
  </svg>
);
