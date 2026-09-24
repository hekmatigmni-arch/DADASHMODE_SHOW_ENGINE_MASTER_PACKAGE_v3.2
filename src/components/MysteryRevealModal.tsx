import { FC, useState } from 'react';
import { MysteryBoxResult, SabotageResult, PlayerScore } from '../types/game';
import { Gift, Skull, Sparkles, X, Check } from 'lucide-react';

interface MysteryRevealModalProps {
  mysteryBox?: MysteryBoxResult | null;
  sabotage?: SabotageResult | null;
  elias: PlayerScore;
  emad: PlayerScore;
  onClose: () => void;
  onApplyTimeBonus?: (seconds: number) => void;
}

export const MysteryRevealModal: FC<MysteryRevealModalProps> = ({
  mysteryBox,
  sabotage,
  elias,
  emad,
  onClose,
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(true);

  if (!mysteryBox && !sabotage) return null;

  const isBox = Boolean(mysteryBox);

  return (
    <div
      id="mystery-reveal-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
    >
      <div className="w-full max-w-sm bg-neutral-950 border-3 border-yellow-400 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.5)] overflow-hidden flex flex-col">
        {/* Header */}
        <div
          className={`px-4 py-3 flex items-center justify-between border-b-2 ${
            isBox
              ? 'bg-purple-700 text-yellow-300 border-purple-400'
              : 'bg-orange-800 text-white border-orange-500'
          }`}
        >
          <div className="flex items-center gap-2">
            {isBox ? <Gift className="w-6 h-6 text-yellow-300" /> : <Skull className="w-6 h-6 text-white" />}
            <span className="font-black text-base uppercase tracking-wider">
              {isBox ? 'MYSTERY BOX • جعبه شانس' : 'SABOTAGE • خرابکاری داداش'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col items-center text-center gap-3">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 shadow-inner ${
              isBox
                ? 'bg-purple-900 border-purple-400 text-yellow-300'
                : 'bg-orange-900 border-orange-500 text-white'
            }`}
          >
            {isBox ? (
              <Gift className="w-12 h-12 text-yellow-400 animate-bounce" />
            ) : (
              <Skull className="w-12 h-12 text-orange-300 animate-pulse" />
            )}
          </div>

          {/* Persian Title & Description */}
          {mysteryBox && (
            <>
              <h3 className="text-xl font-black text-yellow-300 font-['Vazirmatn']">
                {mysteryBox.persianTitle}
              </h3>
              <p className="text-white text-sm font-medium font-['Vazirmatn'] leading-relaxed bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                {mysteryBox.persianDescription}
              </p>
              {mysteryBox.timeValue !== undefined && mysteryBox.timeValue !== 0 && (
                <div className="text-xs font-mono bg-yellow-400 text-black px-3 py-1 rounded-full font-black">
                  {mysteryBox.timeValue > 0 ? `+${mysteryBox.timeValue}s TIME BONUS` : `${mysteryBox.timeValue}s TIME PENALTY`}
                </div>
              )}
            </>
          )}

          {sabotage && (
            <>
              <div className="text-xs font-black uppercase text-orange-400">
                هدف خرابکاری:{' '}
                <span className="text-white font-mono">
                  {sabotage.target === 'ELIAS' ? 'الیاس (قرمز)' : 'عماد (سبز)'}
                </span>
              </div>
              <h3 className="text-xl font-black text-orange-300 font-['Vazirmatn']">
                {sabotage.persianTitle}
              </h3>
              <p className="text-white text-sm font-medium font-['Vazirmatn'] leading-relaxed bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                {sabotage.persianDescription}
              </p>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-black text-sm rounded-xl uppercase tracking-wider mt-2 transition"
          >
            تأیید و ادامه بازی (APPLY & RESUME)
          </button>
        </div>
      </div>
    </div>
  );
};
