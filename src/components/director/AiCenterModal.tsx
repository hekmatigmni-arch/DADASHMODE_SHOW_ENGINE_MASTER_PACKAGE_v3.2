import React, { useState } from 'react';
import { Bot, Wifi, WifiOff, ShieldCheck, Check, Key, HelpCircle, X, Sparkles } from 'lucide-react';

interface AiCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCenterModal: React.FC<AiCenterModalProps> = ({ isOpen, onClose }) => {
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className="w-full max-w-xl bg-neutral-900 border border-blue-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white font-['Vazirmatn']">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500 flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-blue-300">
                مرکز هوش مصنوعی داور (AI REFEREE CENTER)
              </h2>
              <p className="text-xs text-neutral-400">
                دستیار اختیاری — عدم وابستگی مسابقه به اینترنت و پایداری در حالت آفلاین
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

        {/* Offline Guarantee Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col gap-1.5 text-xs text-emerald-200">
          <div className="flex items-center gap-2 font-black text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>تضمین استقلال استودیو (Zero Internet Dependency):</span>
          </div>
          <p className="leading-relaxed text-emerald-200/90 text-[11px]">
            هوش مصنوعی جمینای صرفاً یک ناظر کمکی برای درک گفتار است. تمام امتیازها، تایمرها، زنگ‌ها و فرمان‌های صوتی در حافظه محلی ذخیره شده و مسابقه حتی با قطع کامل اینترنت بدون وقفه اجرا می‌شود.
          </p>
        </div>

        {/* Server Proxy Status */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-2">
          <div className="text-xs font-bold text-neutral-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-4 h-4 text-blue-400" />
              <span>وضعیت اتصال سرور Gemini Live:</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono border border-blue-500/40">
              پراکسی امن سرور (/api/proxy)
            </span>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            کلیدهای دسترسی به مدل Gemini به صورت ایمن در متغیرهای محیطی سمت سرور نگهداری می‌شوند تا امنیت در تولید رعایت شود و در فرانت‌اند افشا نگردد.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px]">
              <span className="text-neutral-500 block text-[10px]">مدل داوری زنده:</span>
              <span className="font-mono text-cyan-400 font-bold">gemini-3.8-live</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px]">
              <span className="text-neutral-500 block text-[10px]">موتور صدای زنانه:</span>
              <span className="font-mono text-amber-400 font-bold">gemini-3.1-flash-tts</span>
            </div>
          </div>
        </div>

        {/* Referee Invariants Check */}
        <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex flex-col gap-1">
          <span className="font-bold text-neutral-300">محدودیت‌های قطعی داور هوش مصنوعی:</span>
          <span>• عدم امکان تغییر امتیاز بدون تایید انسان</span>
          <span>• عدم دسترسی به محتوای جعبه‌های تصادفی محلی</span>
          <span>• در صورت ابهام در صحنه: اعلام «نتیجه واضح نیست. بازبینی»</span>
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
