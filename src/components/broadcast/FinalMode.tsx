import React from 'react';
import { PublicPlayerState, PlayerId } from '../../types/game';
import { PLAYERS_IDENTITY } from '../../styles/tokens';
import { FinalPrizeIcon, EliasTriangleIcon, EmadCircleIcon } from './GameIcons';

interface FinalModeProps {
  elias: PublicPlayerState;
  emad: PublicPlayerState;
  round6?: {
    currentStage: number;
    codes: { code1: string; code2: string; code3: string };
    revealedCodes: { code1: boolean; code2: boolean; code3: boolean };
    isCaseUnlocked: boolean;
    winner: PlayerId | null;
  };
  className?: string;
}

/**
 * FINAL SHOWDOWN HERO SCENE (Patch 2.3)
 * Replaces generic RoundCard in the final round:
 * - Prize/golden-box icon (48px)
 * - 'فینال' title with gold glow
 * - Both accumulated banks large with redundant player shapes
 * - Final countdown rule
 * - 3-digit sequence code display & golden case indicator
 */
export const FinalMode: React.FC<FinalModeProps> = ({
  elias,
  emad,
  round6,
  className = '',
}) => {
  const eliasMeta = PLAYERS_IDENTITY.ELIAS;
  const emadMeta = PLAYERS_IDENTITY.EMAD;

  return (
    <div
      id="broadcast-final-mode-card"
      className={`w-full rounded-3xl border-2 border-[#FFC400] bg-gradient-to-b from-[#221C04] via-[#141002] to-[#0A0801] p-4 sm:p-5 shadow-[0_0_48px_rgba(255,196,0,0.45)] select-none text-center flex flex-col items-center justify-center ${className}`}
      dir="rtl"
    >
      {/* Top Gold Emblem */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="p-2 rounded-2xl bg-[#FFC400]/20 border border-[#FFC400] text-[#FFC400] shadow-[0_0_20px_rgba(255,196,0,0.5)]">
          <FinalPrizeIcon size={44} color="#FFC400" />
        </div>
      </div>

      {/* Main Title */}
      <h2 className="font-['Vazirmatn'] font-black text-2xl sm:text-3xl text-[#FFC400] tracking-tight">
        فینال بزرگ
      </h2>
      <p className="font-['Vazirmatn'] text-xs sm:text-sm text-neutral-300 font-bold mt-0.5">
        شمارش معکوس بانک زمان • هر ثانیه طلاست!
      </p>

      {/* Both Time Banks Side-by-Side (Large & Dominant) */}
      <div className="w-full grid grid-cols-2 gap-3 my-3">
        {/* Elias Accumulated Bank */}
        <div className="p-3 rounded-2xl bg-[#140608] border border-[#FF2738]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EliasTriangleIcon size={26} color="#FF2738" />
            <div className="flex flex-col text-right leading-tight">
              <span className="font-['Vazirmatn'] font-black text-sm text-white">
                {eliasMeta.persianName}
              </span>
              <span className="font-mono text-[10px] text-neutral-400 font-bold">
                {eliasMeta.tag}
              </span>
            </div>
          </div>
          <bdi
            dir="ltr"
            className="font-mono font-black text-2xl sm:text-3xl text-[#FF2738] tabular-nums"
          >
            {elias.seconds}s
          </bdi>
        </div>

        {/* Emad Accumulated Bank */}
        <div className="p-3 rounded-2xl bg-[#05140F] border border-[#00C98D]/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EmadCircleIcon size={26} color="#00C98D" />
            <div className="flex flex-col text-right leading-tight">
              <span className="font-['Vazirmatn'] font-black text-sm text-white">
                {emadMeta.persianName}
              </span>
              <span className="font-mono text-[10px] text-neutral-400 font-bold">
                {emadMeta.tag}
              </span>
            </div>
          </div>
          <bdi
            dir="ltr"
            className="font-mono font-black text-2xl sm:text-3xl text-[#00C98D] tabular-nums"
          >
            {emad.seconds}s
          </bdi>
        </div>
      </div>

      {/* Round 6 Sequence Codes & Golden Case Status */}
      {round6 && (
        <div className="w-full my-2 p-2.5 rounded-2xl bg-black/60 border border-[#FFC400]/40 flex flex-col items-center gap-1.5">
          <div className="flex items-center justify-between w-full text-[11px] font-mono font-bold text-yellow-300 px-1">
            <span className="font-['Vazirmatn'] font-black">رمزهای ۳ مرحله فینال:</span>
            <span>مرحله {round6.currentStage} از ۴</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            {[
              { label: 'کد ۱', code: round6.codes.code1, rev: round6.revealedCodes.code1 },
              { label: 'کد ۲', code: round6.codes.code2, rev: round6.revealedCodes.code2 },
              { label: 'کد ۳', code: round6.codes.code3, rev: round6.revealedCodes.code3 },
            ].map((c, i) => (
              <div
                key={i}
                className={`px-3 py-1.5 rounded-xl border flex flex-col items-center justify-center font-mono font-black ${
                  c.rev
                    ? 'bg-amber-500/20 border-amber-400 text-yellow-300 shadow-[0_0_10px_rgba(255,196,0,0.3)]'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                }`}
              >
                <span className="text-[9px] text-neutral-400">{c.label}</span>
                <span className="text-base">{c.rev ? c.code : '🔒'}</span>
              </div>
            ))}
          </div>
          {round6.isCaseUnlocked && (
            <div className="mt-1 w-full py-1 bg-gradient-to-r from-yellow-500/30 via-amber-400/30 to-yellow-500/30 border border-yellow-400 text-yellow-300 font-['Vazirmatn'] font-black text-xs rounded-xl shadow-lg animate-pulse text-center">
              🏆 کیف طلایی باز شد! کیت قهرمانی داداش‌مد اهدا گردید
            </div>
          )}
        </div>
      )}

      {/* Final Countdown Rule Note */}
      <div className="w-full py-1.5 px-3 rounded-xl bg-black/60 border border-[#3A3008] text-center text-xs font-['Vazirmatn'] text-[#FFC400] font-bold">
        هر بازیکنی که زمانش به صفر برسد بازنده است!
      </div>
    </div>
  );
};
