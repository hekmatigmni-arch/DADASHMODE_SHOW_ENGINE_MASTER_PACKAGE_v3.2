import React from 'react';
import { PublicReviewState } from '../../types/game';
import { ReviewIcon } from './GameIcons';

interface ReviewOverlayProps {
  review: PublicReviewState;
  className?: string;
}

export const ReviewOverlay: React.FC<ReviewOverlayProps> = ({
  review,
  className = '',
}) => {
  if (!review.isUnderReview) return null;

  return (
    <div
      id="broadcast-review-overlay"
      className={`relative z-30 rounded-3xl border-2 border-[#FFB000] bg-[#1a1205]/95 p-5 sm:p-6 shadow-[0_0_48px_rgba(255,176,0,0.5)] select-none backdrop-blur-md overflow-hidden text-center flex flex-col items-center justify-center ${className}`}
      dir="rtl"
    >
      {/* Amber Scanline FX */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#FFB000]/15 to-transparent h-12 w-full animate-review-scan" />

      {/* Large Review Icon */}
      <div className="p-3.5 rounded-3xl bg-[#FFB000]/20 border border-[#FFB000]/60 text-[#FFB000] animate-pulse my-1">
        <ReviewIcon size={52} color="#FFB000" />
      </div>

      {/* Main Title: بازبینی */}
      <h2 className="font-['Vazirmatn'] font-black text-3xl sm:text-4xl text-[#FFB000] tracking-tight mt-1">
        بازبینی داور هوش مصنوعی
      </h2>

      {/* Frozen scores (visible but secondary) */}
      {review.frozenScores && (
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-[#0a0702] border border-[#FFB000]/50 my-2.5">
          <span className="font-['Vazirmatn'] text-xs font-bold text-neutral-400">بانک زمان متوقف:</span>
          <bdi dir="ltr" className="font-mono text-sm font-black text-[#FF2738]">
            E: {review.frozenScores.ELIAS}s
          </bdi>
          <span className="text-neutral-600">|</span>
          <bdi dir="ltr" className="font-mono text-sm font-black text-[#00C98D]">
            M: {review.frozenScores.EMAD}s
          </bdi>
        </div>
      )}

      {/* Reason Description */}
      <div className="bg-[#0e0a03] rounded-2xl px-4 py-2.5 border border-[#3d2a09] text-center w-full max-w-md my-1">
        <span className="font-['Vazirmatn'] text-sm sm:text-base font-bold text-neutral-200">
          {review.persianReason || review.reason || 'بررسی صحت اجرای حرکت'}
        </span>
      </div>

      {/* Snapshot Preview if exists */}
      {review.snapshotDataUrl && (
        <div className="relative w-full max-h-48 sm:max-h-60 rounded-2xl overflow-hidden border border-[#FFB000]/40 mt-3 bg-black flex items-center justify-center">
          <img
            src={review.snapshotDataUrl}
            alt="VAR Evidence Snapshot"
            className="w-full h-full object-contain"
          />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-black">
            VAR FRAME
          </div>
        </div>
      )}
    </div>
  );
};
