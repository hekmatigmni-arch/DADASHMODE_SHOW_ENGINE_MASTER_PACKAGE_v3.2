import React, { useState } from 'react';
import {
  REFEREE_VOICE_SHORTLIST,
  RefereeVoiceName,
  OFFICIAL_PERSIAN_TEST_PHRASE,
} from '../../styles/tokens';
import { liveAudioPlayer } from '../../utils/audio';
import { Volume2, Play, Check, X, Loader2, AlertTriangle } from 'lucide-react';

export const VOICE_RECONNECT_NOTICE = 'برای اعمال صدای جدید، اتصال داور را یک‌بار دوباره برقرار کنید.';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVoice: RefereeVoiceName;
  onSelectVoice: (voice: RefereeVoiceName) => void;
  isLiveConnected?: boolean;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  currentVoice,
  onSelectVoice,
  isLiveConnected = false,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<RefereeVoiceName>(currentVoice);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePlayTest = async (voiceToTest: RefereeVoiceName) => {
    setIsPlaying(true);
    setErrorMsg(null);
    setIsQuotaExceeded(false);

    try {
      const res = await fetch('/api/voice/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice: voiceToTest,
          text: OFFICIAL_PERSIAN_TEST_PHRASE,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429 || data.isRateLimited) {
          setIsQuotaExceeded(true);
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const result = await res.json();
      if (result.audioBase64) {
        liveAudioPlayer.playPcmChunk(result.audioBase64);
      }
    } catch (err: any) {
      console.warn('[VoicePreview] Preview failed:', err);
      // Safe, isolated error message that does not affect Live referee or game state
      setErrorMsg(err.message || 'خطا در پخش پیش‌نمایش صدا');
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSave = () => {
    onSelectVoice(selectedVoice);
    try {
      localStorage.setItem('dadashmode_referee_voice', selectedVoice);
    } catch {
      // ignore localstorage error
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      dir="rtl"
    >
      <div className="w-full max-w-lg rounded-3xl bg-[#111111] border-2 border-[#262626] p-5 sm:p-6 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222222] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFC400]/20 border border-[#FFC400]/50 text-[#FFC400]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Vazirmatn'] font-black text-lg text-white">
                تنظیمات و پیش‌نمایش صدای داور (Voice Settings)
              </h3>
              <p className="font-['Vazirmatn'] text-xs text-neutral-400">
                صدای مناسب برای زبان فارسی را با شنیدن عبارت آزمون انتخاب کنید
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persian Test Phrase Display */}
        <div className="rounded-2xl bg-[#171717] border border-[#2a2a2a] p-3 mb-4 text-right">
          <span className="font-mono text-[10px] font-bold text-[#FFC400] uppercase block mb-1">
            عبارت رسمی تست فارسی داور:
          </span>
          <p className="font-['Vazirmatn'] text-xs text-neutral-300 leading-relaxed font-bold whitespace-pre-line">
            {OFFICIAL_PERSIAN_TEST_PHRASE}
          </p>
        </div>

        {/* Voice Shortlist Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {REFEREE_VOICE_SHORTLIST.map((voice) => {
            const isSelected = selectedVoice === voice;
            return (
              <div
                key={voice}
                onClick={() => setSelectedVoice(voice)}
                className={`cursor-pointer rounded-2xl border-2 p-3 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1f1a09] border-[#FFC400] shadow-[0_0_16px_rgba(255,196,0,0.3)]'
                    : 'bg-[#141414] border-[#262626] hover:border-[#383838]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-sm text-white tracking-wider">
                    {voice}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-[#FFC400] text-black flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVoice(voice);
                    handlePlayTest(voice);
                  }}
                  disabled={isPlaying}
                  className="mt-1 w-full py-1.5 px-2 rounded-xl bg-[#070707] hover:bg-[#222222] border border-[#333333] flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-[#FFC400]"
                >
                  {isPlaying && selectedVoice === voice ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>PLAYING...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>PLAY TEST</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Reconnect notice if Live referee is active and voice is changed */}
        {isLiveConnected && (
          <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-300 text-xs font-['Vazirmatn'] font-medium mb-4 text-right flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{VOICE_RECONNECT_NOTICE}</span>
          </div>
        )}

        {/* Isolated Error Notice */}
        {errorMsg && (
          <div className={`p-2.5 rounded-xl border text-xs font-['Vazirmatn'] font-bold mb-4 text-right flex items-center gap-2 ${
            isQuotaExceeded 
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' 
              : 'bg-red-950/40 border-red-500/50 text-red-300'
          }`}>
            <AlertTriangle className={`w-4 h-4 shrink-0 ${isQuotaExceeded ? 'text-amber-400' : 'text-red-400'}`} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#222222]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-neutral-300 font-['Vazirmatn'] text-xs font-bold"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#FFC400] hover:bg-[#ffd84a] text-black font-['Vazirmatn'] text-xs font-black flex items-center gap-1.5 shadow-lg shadow-[#FFC400]/20"
          >
            <Check className="w-4 h-4" />
            ذخیره و تنظیم صدای مسابقه
          </button>
        </div>
      </div>
    </div>
  );
};
