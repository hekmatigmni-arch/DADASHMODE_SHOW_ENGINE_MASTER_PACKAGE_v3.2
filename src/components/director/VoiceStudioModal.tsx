import React, { useState } from 'react';
import { VoiceCue, VoiceEmotion, VoiceStyle } from '../../types/showEngine';
import { voiceDirector, parseVoiceScriptTags } from '../../utils/voiceDirectorEngine';
import {
  Mic,
  Play,
  Save,
  Volume2,
  Trash2,
  Sparkles,
  Zap,
  Clock,
  Layers,
  Check,
  AlertCircle,
  X,
  Sliders,
} from 'lucide-react';

interface VoiceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCueTriggered?: (cue: VoiceCue) => void;
}

export const VoiceStudioModal: React.FC<VoiceStudioModalProps> = ({
  isOpen,
  onClose,
  onCueTriggered,
}) => {
  const [scriptInput, setScriptInput] = useState<string>(
    '[Energy 90]\n[Pause 0.5]\nامروز یک چالش بزرگ داریم!'
  );
  const [cueLabel, setCueLabel] = useState<string>('چالش جدید امروز');
  const [emotion, setEmotion] = useState<VoiceEmotion>('hype');
  const [style, setStyle] = useState<VoiceStyle>('announcer');
  const [speed, setSpeed] = useState<number>(1.1);
  const [energy, setEnergy] = useState<number>(9);
  const [pauseMs, setPauseMs] = useState<number>(500);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState<boolean>(false);
  const [savedCues, setSavedCues] = useState<VoiceCue[]>(() => voiceDirector.getAllCues());

  if (!isOpen) return null;

  // Handle parsing tags from script input in real-time
  const parsedMeta = parseVoiceScriptTags(scriptInput);

  const handlePreview = async () => {
    setIsPlaying(true);
    try {
      await voiceDirector.speakText(scriptInput, {
        emotion,
        speed,
        energy,
        pauseMs,
        style,
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSaveCue = () => {
    const newCue: VoiceCue = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: cueLabel.trim() || 'فرمان اختصاصی داور',
      persianText: parsedMeta.cleanText,
      emotion,
      speed,
      pitch: 1.15, // Persian female tuned pitch
      pauseMs,
      energy,
      style,
    };

    voiceDirector.registerCustomCue(newCue);
    setSavedCues(voiceDirector.getAllCues());
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 2500);
  };

  const handleDeleteCue = (cueId: string) => {
    voiceDirector.deleteCustomCue(cueId);
    setSavedCues(voiceDirector.getAllCues());
  };

  const handlePlaySavedCue = async (cue: VoiceCue) => {
    setIsPlaying(true);
    try {
      if (onCueTriggered) onCueTriggered(cue);
      await voiceDirector.speak(cue);
    } finally {
      setIsPlaying(false);
    }
  };

  const insertTag = (tag: string) => {
    setScriptInput((prev) => `${tag} ${prev}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#090a10]/95 border-2 border-amber-400/40 shadow-[0_0_80px_rgba(255,196,0,0.3)] p-5 sm:p-7 text-white flex flex-col gap-5">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-0.5 shadow-[0_0_25px_rgba(255,196,0,0.6)]">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Mic className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Vazirmatn'] text-xl font-black text-white">
                  استودیوی کارگردانی صدای زنانه (PERSIAN FEMALE AI VOICE)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-300 font-mono text-[10px] font-black">
                  ONLINE + OFFLINE
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-['Vazirmatn'] mt-0.5">
                تولید صدای با انرژی داور مسابقه یوتیوب، پیش‌نمایش آنی، ذخیره در تایم‌لاین و اجرای دقیق اسکریپت
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script & Parameter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column (col-span-7): Script Textarea & Tags */}
          <div className="md:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-['Vazirmatn'] font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>متن و تگ‌های اسکریپت (Prepared Script):</span>
              </label>

              {/* Tag Quick Inserters */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertTag('[Energy 90]')}
                  className="px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30"
                >
                  +Energy 90
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('[Pause 0.5]')}
                  className="px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30"
                >
                  +Pause 0.5s
                </button>
                <button
                  type="button"
                  onClick={() => insertTag('[Emotion Hype]')}
                  className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30"
                >
                  +Hype
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              placeholder="مثال: [Energy 90] [Pause 0.5] امروز یک چالش بزرگ داریم..."
              className="w-full p-3.5 rounded-2xl bg-black/60 border-2 border-white/15 focus:border-amber-400 text-white font-['Vazirmatn'] text-sm leading-relaxed outline-none resize-none shadow-inner"
            />

            {/* Label Input */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-['Vazirmatn'] text-neutral-400 whitespace-nowrap">
                عنوان ذخیره:
              </span>
              <input
                type="text"
                value={cueLabel}
                onChange={(e) => setCueLabel(e.target.value)}
                placeholder="نام فرمان در تایم‌لاین..."
                className="w-full px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white outline-none focus:border-amber-400 font-['Vazirmatn']"
              />
            </div>

            {/* Action Buttons: Preview & Save */}
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handlePreview}
                disabled={isPlaying}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-['Vazirmatn'] text-sm font-black flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,196,0,0.5)] active:scale-95 transition-all"
              >
                <Play className={`w-4 h-4 fill-current ${isPlaying ? 'animate-spin' : ''}`} />
                <span>{isPlaying ? 'در حال پخش صدای زنانه...' : 'پیش‌نمایش صدا (VOICE PREVIEW)'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveCue}
                className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-['Vazirmatn'] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                {isSavedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">ذخیره شد!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>ذخیره در کیوها</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column (col-span-5): Parameter Sliders */}
          <div className="md:col-span-5 p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-3">
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>VOICE DIRECTOR PARAMETERS</span>
            </h4>

            {/* Emotion Selector */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-['Vazirmatn']">
                <span className="text-neutral-400">احساس (Emotion):</span>
                <span className="text-amber-400 font-bold uppercase">{emotion}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['hype', 'referee_strict', 'dramatic', 'calm', 'sarcastic'] as VoiceEmotion[]).map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmotion(em)}
                    className={`py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                      emotion === em
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-['Vazirmatn']">
                <span className="text-neutral-400">سطح انرژی (Energy):</span>
                <span className="text-amber-400 font-mono font-bold">{energy * 10}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Speed Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-['Vazirmatn']">
                <span className="text-neutral-400">سرعت کلام (Speed):</span>
                <span className="text-cyan-400 font-mono font-bold">{speed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.4"
                step="0.05"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Pause Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] font-['Vazirmatn']">
                <span className="text-neutral-400">مکث پایانی (Pause):</span>
                <span className="text-purple-400 font-mono font-bold">{(pauseMs / 1000).toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="100"
                value={pauseMs}
                onChange={(e) => setPauseMs(parseInt(e.target.value, 10))}
                className="w-full accent-purple-400"
              />
            </div>

            {/* Voice Model Info Pill */}
            <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-200 font-['Vazirmatn'] flex items-center gap-2 mt-auto">
              <Volume2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>پروفایل فعال: صدای رسمی زنانه مسابقه (Gemini Kore Female)</span>
            </div>
          </div>
        </div>

        {/* Timeline Synchronization & Saved Voice Cues Library */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>SAVED VOICE CUES & TIMELINE SYNCHRONIZATION:</span>
            </h3>
            <span className="text-[11px] text-neutral-400 font-['Vazirmatn']">
              {savedCues.length} فرمان صوتی آماده
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
            {savedCues.map((cue) => (
              <div
                key={cue.id}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col justify-between gap-2 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Vazirmatn'] text-xs font-black text-amber-300 truncate">
                    {cue.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {cue.id.startsWith('custom_') && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCue(cue.id)}
                        className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors"
                        title="حذف فرمان"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePlaySavedCue(cue)}
                      disabled={isPlaying}
                      className="px-2 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-mono font-bold flex items-center gap-1 shadow"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>TRIGGER</span>
                    </button>
                  </div>
                </div>

                <p className="font-['Vazirmatn'] text-[11px] text-neutral-300 line-clamp-2">
                  {cue.persianText}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-1 border-t border-white/5">
                  <span className="uppercase text-amber-400">{cue.emotion}</span>
                  <span>{cue.speed}x • {cue.energy * 10}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
