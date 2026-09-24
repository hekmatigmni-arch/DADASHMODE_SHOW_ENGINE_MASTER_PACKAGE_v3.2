import { FC } from 'react';
import { ReviewState } from '../types/game';
import { AlertTriangle, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface ReviewModalProps {
  review: ReviewState;
  onResolve: (decision: 'NO_FOUL' | 'AWARD_ELIAS' | 'AWARD_EMAD' | 'PENALTY_ELIAS' | 'PENALTY_EMAD', note?: string) => void;
}

export const ReviewModal: FC<ReviewModalProps> = ({ review, onResolve }) => {
  if (!review.isUnderReview) return null;

  return (
    <div
      id="var-review-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md"
    >
      <div className="w-full max-w-md bg-neutral-950 border-3 border-yellow-400 rounded-2xl shadow-[0_0_50px_rgba(250,204,21,0.5)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="bg-yellow-400 text-black px-4 py-3 flex items-center justify-between border-b-2 border-yellow-500">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 fill-black text-yellow-400 animate-bounce" />
            <span className="font-black text-lg tracking-wider uppercase">
              VAR • بازبینی صحنه داور
            </span>
          </div>
          <span className="bg-black text-yellow-400 text-xs font-black px-2 py-1 rounded uppercase">
            امتیازها قفل
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
          {/* Persian Mandatory Referee Phrase */}
          <div className="bg-yellow-950/60 border border-yellow-500 rounded-xl p-3 text-center">
            <p className="text-yellow-300 font-['Vazirmatn'] font-black text-lg sm:text-xl">
              «نتیجه واضح نیست. بازبینی.»
            </p>
            <p className="text-neutral-400 text-xs mt-1">
              The referee flagged an ambiguous situation. Scores are frozen until resolved.
            </p>
          </div>

          {/* Reason */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-2.5">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide block mb-0.5">
              علت بازبینی (REASON):
            </span>
            <p className="text-white text-sm font-bold font-['Vazirmatn']">
              {review.persianReason || review.reason}
            </p>
          </div>

          {/* Frozen Scores Preview */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-red-950/80 border-2 border-red-500 rounded-lg p-2">
              <span className="text-xs font-bold text-red-300 uppercase block">الیاس (قرمز)</span>
              <span className="text-2xl font-black text-white">{review.frozenScores.ELIAS}s</span>
              <span className="text-[10px] text-red-300 block font-mono">LOCKED</span>
            </div>
            <div className="bg-emerald-950/80 border-2 border-emerald-500 rounded-lg p-2">
              <span className="text-xs font-bold text-emerald-300 uppercase block">عماد (سبز)</span>
              <span className="text-2xl font-black text-white">{review.frozenScores.EMAD}s</span>
              <span className="text-[10px] text-emerald-300 block font-mono">LOCKED</span>
            </div>
          </div>

          {/* Snapshot image if available */}
          {review.snapshotDataUrl && (
            <div className="w-full rounded-lg overflow-hidden border border-neutral-700 bg-black">
              <span className="text-[10px] text-neutral-400 px-2 py-0.5 block bg-neutral-900">
                فریم ثبت شده بازبینی (Snapshot)
              </span>
              <img
                src={review.snapshotDataUrl}
                alt="VAR Review Snapshot"
                className="w-full h-36 object-contain"
              />
            </div>
          )}

          {/* Decision Resolution Buttons */}
          <div className="flex flex-col gap-2 mt-1">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-wide">
              تصمیم نهایی داور / سرپرست:
            </span>

            {/* Award Elias */}
            <button
              type="button"
              onClick={() => onResolve('AWARD_ELIAS', 'تأیید برتری الیاس در صحنه')}
              className="py-2.5 px-3 bg-red-800 hover:bg-red-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-lg border border-red-400 flex items-center justify-between transition shadow"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>برنده صحنه: الیاس (+۵ ثانیه جایزه)</span>
              </div>
              <span className="font-mono text-xs bg-red-950 px-2 py-0.5 rounded">+5s ELIAS</span>
            </button>

            {/* Award Emad */}
            <button
              type="button"
              onClick={() => onResolve('AWARD_EMAD', 'تأیید برتری عماد در صحنه')}
              className="py-2.5 px-3 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-lg border border-emerald-400 flex items-center justify-between transition shadow"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>برنده صحنه: عماد (+۵ ثانیه جایزه)</span>
              </div>
              <span className="font-mono text-xs bg-emerald-950 px-2 py-0.5 rounded">+5s EMAD</span>
            </button>

            {/* Penalty Elias */}
            <button
              type="button"
              onClick={() => onResolve('PENALTY_ELIAS', 'تأیید خطای عمدی الیاس')}
              className="py-2 px-3 bg-neutral-900 hover:bg-red-950 active:scale-95 text-red-400 font-bold text-xs rounded-lg border border-red-800 flex items-center justify-between transition"
            >
              <span>جریمه خطای الیاس (-۵ ثانیه کسر)</span>
              <span className="font-mono text-xs">-5s ELIAS</span>
            </button>

            {/* Penalty Emad */}
            <button
              type="button"
              onClick={() => onResolve('PENALTY_EMAD', 'تأیید خطای عمدی عماد')}
              className="py-2 px-3 bg-neutral-900 hover:bg-emerald-950 active:scale-95 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-800 flex items-center justify-between transition"
            >
              <span>جریمه خطای عماد (-۵ ثانیه کسر)</span>
              <span className="font-mono text-xs">-5s EMAD</span>
            </button>

            {/* No Foul / Resume */}
            <button
              type="button"
              onClick={() => onResolve('NO_FOUL', 'صحنه عادی تشخیص داده شد')}
              className="py-2.5 px-3 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-black text-xs sm:text-sm rounded-lg border border-yellow-200 flex items-center justify-center gap-2 transition shadow mt-1"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>بدون خطا • رفع انسداد و ادامه بازی (RESUME)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
