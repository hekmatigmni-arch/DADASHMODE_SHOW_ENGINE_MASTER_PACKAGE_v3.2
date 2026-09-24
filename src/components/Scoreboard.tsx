import { FC } from 'react';
import { PlayerScore } from '../types/game';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ScoreboardProps {
  elias: PlayerScore;
  emad: PlayerScore;
  isUnderReview: boolean;
  onQuickAdd?: (player: 'ELIAS' | 'EMAD', sec: number) => void;
  onQuickSub?: (player: 'ELIAS' | 'EMAD', sec: number) => void;
}

export const Scoreboard: FC<ScoreboardProps> = ({
  elias,
  emad,
  isUnderReview,
  onQuickAdd,
  onQuickSub,
}) => {
  return (
    <section id="scoreboard-section" className="w-full">
      {/* Top Gold Time Bank Header */}
      <div className="flex items-center justify-between px-3 py-1 bg-amber-400 text-black font-black uppercase text-xs sm:text-sm tracking-wider rounded-t-xl shadow-md border-t-2 border-x-2 border-yellow-300">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-black animate-pulse"></span>
          <span>TIME BANK • بانک زمان</span>
        </div>
        <span className="font-bold text-[11px] bg-black text-amber-300 px-2 py-0.5 rounded">
          {isUnderReview ? '🔒 زمان‌ها قفل (VAR)' : 'رسمی داور'}
        </span>
      </div>

      {/* Two Player Cards Grid */}
      <div className="grid grid-cols-2 gap-2 p-2 bg-neutral-950 border-2 border-yellow-400 rounded-b-xl shadow-2xl">
        {/* ELIAS = RED */}
        <div
          id="player-card-elias"
          className={`relative flex flex-col items-center justify-between p-3 rounded-lg border-3 transition-all ${
            isUnderReview
              ? 'border-yellow-400 bg-red-950/80 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
              : 'border-red-500 bg-gradient-to-b from-red-950/90 to-red-900/90 shadow-[0_0_20px_rgba(220,38,38,0.5)]'
          }`}
        >
          {/* Player Tag */}
          <div className="w-full flex items-center justify-between border-b border-red-500/40 pb-1">
            <span className="bg-red-600 text-white font-black text-xs sm:text-sm px-2 py-0.5 rounded uppercase tracking-wider">
              ELIAS
            </span>
            <span className="text-red-200 font-bold text-xs sm:text-sm font-['Vazirmatn']">
              الیاس (قرمز)
            </span>
          </div>

          {/* Large Time Number */}
          <div className="my-2 flex flex-col items-center justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {elias.seconds}
              </span>
              <span className="text-red-300 font-black text-base sm:text-xl">
                SEC
              </span>
            </div>
            <span className="text-[11px] text-red-300 font-medium font-['Vazirmatn']">
              ثانیه ذخیره
            </span>
          </div>

          {/* Choice or Status */}
          {elias.lockedChoice && (
            <div className="w-full text-center bg-black/60 border border-red-400/50 rounded px-1.5 py-0.5 text-[11px] text-yellow-300 truncate mb-1">
              انتخاب: {elias.lockedChoice}
            </div>
          )}

          {/* Quick inline buttons for referee host */}
          <div className="w-full flex items-center gap-1 mt-1">
            <button
              id="quick-sub-elias-5"
              type="button"
              disabled={isUnderReview}
              onClick={() => onQuickSub && onQuickSub('ELIAS', 5)}
              className="flex-1 py-1 bg-red-700 hover:bg-red-600 active:scale-95 disabled:opacity-40 text-white text-xs font-black rounded border border-red-400 transition"
              title="Deduct 5 seconds foul"
            >
              -5s خطا
            </button>
            <button
              id="quick-add-elias-5"
              type="button"
              disabled={isUnderReview}
              onClick={() => onQuickAdd && onQuickAdd('ELIAS', 5)}
              className="flex-1 py-1 bg-emerald-700 hover:bg-emerald-600 active:scale-95 disabled:opacity-40 text-white text-xs font-black rounded border border-emerald-400 transition"
              title="Add 5 seconds reward"
            >
              +5s پاداش
            </button>
          </div>
        </div>

        {/* EMAD = GREEN */}
        <div
          id="player-card-emad"
          className={`relative flex flex-col items-center justify-between p-3 rounded-lg border-3 transition-all ${
            isUnderReview
              ? 'border-yellow-400 bg-green-950/80 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
              : 'border-emerald-500 bg-gradient-to-b from-green-950/90 to-emerald-900/90 shadow-[0_0_20px_rgba(34,197,94,0.5)]'
          }`}
        >
          {/* Player Tag */}
          <div className="w-full flex items-center justify-between border-b border-emerald-500/40 pb-1">
            <span className="bg-emerald-600 text-white font-black text-xs sm:text-sm px-2 py-0.5 rounded uppercase tracking-wider">
              EMAD
            </span>
            <span className="text-emerald-200 font-bold text-xs sm:text-sm font-['Vazirmatn']">
              عماد (سبز)
            </span>
          </div>

          {/* Large Time Number */}
          <div className="my-2 flex flex-col items-center justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {emad.seconds}
              </span>
              <span className="text-emerald-300 font-black text-base sm:text-xl">
                SEC
              </span>
            </div>
            <span className="text-[11px] text-emerald-300 font-medium font-['Vazirmatn']">
              ثانیه ذخیره
            </span>
          </div>

          {/* Choice or Status */}
          {emad.lockedChoice && (
            <div className="w-full text-center bg-black/60 border border-emerald-400/50 rounded px-1.5 py-0.5 text-[11px] text-yellow-300 truncate mb-1">
              انتخاب: {emad.lockedChoice}
            </div>
          )}

          {/* Quick inline buttons for referee host */}
          <div className="w-full flex items-center gap-1 mt-1">
            <button
              id="quick-sub-emad-5"
              type="button"
              disabled={isUnderReview}
              onClick={() => onQuickSub && onQuickSub('EMAD', 5)}
              className="flex-1 py-1 bg-red-700 hover:bg-red-600 active:scale-95 disabled:opacity-40 text-white text-xs font-black rounded border border-red-400 transition"
              title="Deduct 5 seconds foul"
            >
              -5s خطا
            </button>
            <button
              id="quick-add-emad-5"
              type="button"
              disabled={isUnderReview}
              onClick={() => onQuickAdd && onQuickAdd('EMAD', 5)}
              className="flex-1 py-1 bg-emerald-700 hover:bg-emerald-600 active:scale-95 disabled:opacity-40 text-white text-xs font-black rounded border border-emerald-400 transition"
              title="Add 5 seconds reward"
            >
              +5s پاداش
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
