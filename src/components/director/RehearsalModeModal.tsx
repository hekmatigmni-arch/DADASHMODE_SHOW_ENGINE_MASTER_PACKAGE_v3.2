import React, { useState } from 'react';
import { voiceCueEngine } from '../../engine/voiceCueEngine';
import { showAudioEngine } from '../../utils/showAudioEngine';
import { PlayCircle, ShieldCheck, RefreshCw, X, Check, Volume2, Clock, Sparkles } from 'lucide-react';

interface RehearsalModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRehearsalActive: boolean;
  onToggleRehearsal: (active: boolean) => void;
}

export const RehearsalModeModal: React.FC<RehearsalModeModalProps> = ({
  isOpen,
  onClose,
  isRehearsalActive,
  onToggleRehearsal,
}) => {
  const [testStatus, setTestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const runFullDryRunTest = async () => {
    setTestStatus('در حال اجرای تست کامل تجهیزات استودیو...');
    showAudioEngine.playWhooshTransition();

    setTimeout(() => {
      setTestStatus('تست ۱/۳: شبیه‌سازی تیک ثانیه‌شمار و آژیر...');
      showAudioEngine.playCountdownBeep(true);
    }, 1000);

    setTestStatus('تست ۲/۳: تست صدای فارسی داور...');
    const voiceOk = await voiceCueEngine.playCustomVoice('سیستم صدای استودیو آماده است. تمرکز کامل برای ضبط اصلی.', 'Kore', 'hype');
    if (!voiceOk) {
      setTestStatus('⛔ صدای داور اجرا نشد. ضبط اصلی را شروع نکنید؛ مدل Piper و سرور محلی را بررسی کنید.');
      return;
    }
    setTestStatus('تست ۳/۳: زنگ امتیاز...');
    showAudioEngine.playRewardDing();
    setTestStatus('صدای داور پخش شد؛ برای تأیید ضبط، یک کلیپ آزمایشی بگیرید و با هدفون بشنوید.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className="w-full max-w-xl bg-neutral-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white font-['Vazirmatn']">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-emerald-300 flex items-center gap-2">
                <span>حالت تمرین و پیش‌نمایش (REHEARSAL MODE)</span>
                {isRehearsalActive && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-black font-black">
                    فعال
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-400">
                تست کامل تایمر، صداها و کلیدها قبل از کلید زدن ضبط رسمی بدون آلوده شدن لاگ مسابقه
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

        {/* Toggle Rehearsal Switch */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-white">فعال‌سازی حالت تمرین بدون ثبت دائم:</div>
            <div className="text-xs text-neutral-400 mt-0.5">
              در حالت تمرین، امتیازها و رویدادها در دفترچه رسمی مسابقه ذخیره نمی‌شوند.
            </div>
          </div>
          <button
            type="button"
            onClick={() => onToggleRehearsal(!isRehearsalActive)}
            className={`px-4 py-2 rounded-xl font-black text-xs transition shadow-md ${
              isRehearsalActive
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
            }`}
          >
            {isRehearsalActive ? 'حالت تمرین روشن است' : 'روشن کردن تمرین'}
          </button>
        </div>

        {/* Dry-run Simulator */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col gap-3">
          <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>اجرای خودکار شبیه‌سازی زنجیره مسابقه (Dry-Run Auto Check):</span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            یک سناریوی ۵ ثانیه‌ای شامل پخش شمارش معکوس، صدای فارسی داور و افکت برد را به طور خودکار اجرا می‌کند تا ولوم اسپیکر و هماهنگی تصویر بررسی شود.
          </p>

          {testStatus && (
            <div className="p-2.5 rounded-xl bg-black/60 border border-emerald-500/40 text-xs font-mono text-emerald-300">
              {testStatus}
            </div>
          )}

          <button
            type="button"
            onClick={runFullDryRunTest}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>شروع تست ۵ ثانیه‌ای استودیو</span>
          </button>
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
