import React from 'react';
import { showAudioEngine } from '../../utils/showAudioEngine';
import { Sparkles, Volume2, AlertTriangle, Trophy, Zap, Radio, X } from 'lucide-react';

interface VfxSfxPadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerVfx?: (type: string, message?: string) => void;
}

export const VfxSfxPadModal: React.FC<VfxSfxPadModalProps> = ({
  isOpen,
  onClose,
  onTriggerVfx,
}) => {
  if (!isOpen) return null;

  const playSfx = (type: string) => {
    switch (type) {
      case 'reward':
        showAudioEngine.playRewardDing();
        break;
      case 'buzzer':
        showAudioEngine.playBuzzerHit();
        break;
      case 'countdown':
        showAudioEngine.playCountdownBeep(true);
        break;
      case 'victory':
        showAudioEngine.playVictoryFanfare();
        break;
      case 'warning':
        showAudioEngine.playPenaltySound();
        break;
      case 'whoosh':
        showAudioEngine.playWhooshTransition();
        break;
      default:
        break;
    }
  };

  const triggerEffect = (vfxType: string, sfxType?: string, msg?: string) => {
    if (sfxType) playSfx(sfxType);
    if (onTriggerVfx) onTriggerVfx(vfxType, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className="w-full max-w-xl bg-neutral-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white font-['Vazirmatn']">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/30 border border-amber-500 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300">
                پد فوری جلوه‌های صوتی و بصری (LIVE VFX / SFX PAD)
              </h2>
              <p className="text-xs text-neutral-400">
                پرتاب دستی افکت‌های نمایشی و صوتی مستقیم در ضبط زنده مسابقه
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SFX Quick Trigger Grid */}
        <div>
          <div className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>افکت‌های صوتی پخش فوری (SFX):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => playSfx('reward')}
              className="py-2.5 px-3 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <span>🔔 زنگ پاداش (Ding)</span>
            </button>

            <button
              type="button"
              onClick={() => playSfx('buzzer')}
              className="py-2.5 px-3 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <span>🚨 بوق خطا (Buzzer)</span>
            </button>

            <button
              type="button"
              onClick={() => playSfx('countdown')}
              className="py-2.5 px-3 rounded-xl bg-yellow-950/50 hover:bg-yellow-900/60 border border-yellow-500/40 text-yellow-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <span>⏱ تیک ثانیه‌شمار</span>
            </button>

            <button
              type="button"
              onClick={() => playSfx('victory')}
              className="py-2.5 px-3 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <span>🎺 پیروزی قهرمان (Fanfare)</span>
            </button>

            <button
              type="button"
              onClick={() => playSfx('warning')}
              className="py-2.5 px-3 rounded-xl bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <span>⚠️ آژیر هشدار (Penalty)</span>
            </button>

            <button
              type="button"
              onClick={() => playSfx('whoosh')}
              className="py-2.5 px-3 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <span>💨 ووش انتقال صحنه</span>
            </button>
          </div>
        </div>

        {/* Visual Broadcast Effects (VFX) */}
        <div>
          <div className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>جلوه‌های تصویری روی نمایشگر تماشاگر (VFX OVERLAY):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => triggerEffect('CONFETTI', 'victory', 'جشن پیروزی و پایان راند!')}
              className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-600/30 to-yellow-600/30 hover:from-amber-600/40 hover:to-yellow-600/40 border border-amber-500/50 text-amber-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>باران آتش‌بازی و پولک طلایی</span>
            </button>

            <button
              type="button"
              onClick={() => triggerEffect('VAR_STAMP', 'warning', 'تصویر فریز شد: بازبینی داور')}
              className="py-3 px-3 rounded-xl bg-gradient-to-r from-red-600/30 to-rose-600/30 hover:from-red-600/40 hover:to-rose-600/40 border border-red-500/50 text-red-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>مهر قرمز بازبینی VAR</span>
            </button>

            <button
              type="button"
              onClick={() => triggerEffect('SHOCKWAVE', 'whoosh', 'تغییر لحظه‌ای لیدر')}
              className="py-3 px-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-500/50 text-cyan-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>موج شوک الکتریکی امتیاز</span>
            </button>

            <button
              type="button"
              onClick={() => triggerEffect('COUNTDOWN_RUSH', 'countdown', '۱۰ ثانیه بحرانی!')}
              className="py-3 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 border border-purple-500/50 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <Radio className="w-4 h-4 text-purple-400" />
              <span>پالس هشدار اضطراری زمان</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
