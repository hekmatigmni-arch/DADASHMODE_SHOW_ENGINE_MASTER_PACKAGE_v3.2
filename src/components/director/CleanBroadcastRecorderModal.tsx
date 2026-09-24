import React, { useState } from 'react';
import { Video, Disc, Download, Check, ShieldCheck, X, HardDrive, Sparkles } from 'lucide-react';

interface CleanBroadcastRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CleanBroadcastRecorderModal: React.FC<CleanBroadcastRecorderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedSeconds, setRecordedSeconds] = useState<number>(0);
  const [recordFormat, setRecordFormat] = useState<'WEBM_PRORES' | 'MP4_H264' | 'ALPHA_TRANSPARENT'>('WEBM_PRORES');
  const [timerInterval, setTimerInterval] = useState<any>(null);

  if (!isOpen) return null;

  const startRecording = () => {
    setIsRecording(true);
    setRecordedSeconds(0);
    const int = setInterval(() => {
      setRecordedSeconds((prev) => prev + 1);
    }, 1000);
    setTimerInterval(int);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerInterval) clearInterval(timerInterval);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className="w-full max-w-xl bg-neutral-900 border border-red-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white font-['Vazirmatn']">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-red-300 flex items-center gap-2">
                <span>سیستم ضبط مستقل پخش (CLEAN BROADCAST RECORDER)</span>
                {isRecording && (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                )}
              </h2>
              <p className="text-xs text-neutral-400">
                ضبط تصویر شفاف همراه با افکت‌های صوتی تمیز (بدون آلودگی میکروفون بازیکنان) برای تدوین یوتیوب
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

        {/* Clean Audio Submix Guarantee */}
        <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col gap-1.5 text-xs text-neutral-300">
          <div className="flex items-center gap-2 font-black text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>معماری تفکیک کانال صوتی (Clean Audio Isolation):</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            کانال خروجی ضبط فقط شامل افکت‌های صوتی بازی (SFX)، زنگ‌های پاداش و صدای رسمی داور زنانه است. نویز محیط و میکروفون الیاس و عماد در ترک جداگانه قرار دارند.
          </p>
        </div>

        {/* Recording Status & Controls */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-red-500/30 flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'}`} />
            <span className="font-mono text-3xl font-black tracking-widest text-white">
              {formatTime(recordedSeconds)}
            </span>
          </div>

          <div className="text-xs text-neutral-400">
            {isRecording ? 'در حال رکورد مستقیم با کیفیت 1080p60...' : 'آماده ضبط کلاکت'}
          </div>

          <div className="flex items-center gap-2 mt-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="py-2.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition"
              >
                <Disc className="w-4 h-4" />
                <span>شروع رکورد تمیز استودیو</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="py-2.5 px-6 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-red-400 border border-red-500 font-black text-xs flex items-center gap-2 shadow-lg active:scale-95 transition"
              >
                <span>توقف ضبط و ذخیره فایل</span>
              </button>
            )}
          </div>
        </div>

        {/* Format Selector */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { id: 'WEBM_PRORES', label: 'ProRes / WebM (بیشترین کیفیت)' },
            { id: 'MP4_H264', label: 'H.264 MP4 (سازگار سریع)' },
            { id: 'ALPHA_TRANSPARENT', label: 'کانال آلفا (HUD Overlay)' },
          ].map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => setRecordFormat(fmt.id as any)}
              className={`p-2.5 rounded-xl border text-center transition ${
                recordFormat === fmt.id
                  ? 'border-red-500 bg-red-950/30 text-red-300 font-bold'
                  : 'border-neutral-800 bg-neutral-950/50 text-neutral-400 hover:text-white'
              }`}
            >
              {fmt.label}
            </button>
          ))}
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
