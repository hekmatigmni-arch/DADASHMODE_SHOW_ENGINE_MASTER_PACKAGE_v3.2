import React, { useState, useRef } from 'react';
import {
  CompetitionScenario,
  VoiceCue,
  CinematicAnimationPayload,
  ProductionLogEntry,
} from '../../types/showEngine';
import { OFFICIAL_VOICE_CUES } from '../../data/showScenarios';
import { voiceDirector } from '../../utils/voiceDirectorEngine';
import { soundEffects } from '../../utils/audio';
import { ExplainerContent } from './LongPressExplainerModal';
import {
  Zap,
  Layers,
  Sparkles,
  Volume2,
  Sliders,
  FileText,
  Flame,
  AlertTriangle,
  Award,
  ShieldAlert,
  Trophy,
  Clock,
  Mic,
  XCircle,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react';

interface ShowEngineControlCenterProps {
  activeScenario: CompetitionScenario;
  onOpenScenarioModal: () => void;
  onOpenModulesModal: () => void;
  onOpenLogsModal: () => void;
  onOpenVoiceStudio?: () => void;
  onOpenLogoManager?: () => void;
  onTriggerCinematic: (payload: CinematicAnimationPayload) => void;
  onExplainerRequest: (content: ExplainerContent) => void;
  onAddLog: (entry: Omit<ProductionLogEntry, 'id' | 'timestamp' | 'timecode'>) => void;
  currentRoundIndex: number;
}

export const ShowEngineControlCenter: React.FC<ShowEngineControlCenterProps> = ({
  activeScenario,
  onOpenScenarioModal,
  onOpenModulesModal,
  onOpenLogsModal,
  onOpenVoiceStudio,
  onOpenLogoManager,
  onTriggerCinematic,
  onExplainerRequest,
  onAddLog,
  currentRoundIndex,
}) => {
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle 3-second long press on any action button
  const startLongPress = (content: ExplainerContent) => {
    pressTimerRef.current = setTimeout(() => {
      onExplainerRequest(content);
    }, 3000);
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleTriggerFx = (
    type: CinematicAnimationPayload['type'],
    player?: 'ELIAS' | 'EMAD',
    value?: string | number,
    explainer?: ExplainerContent
  ) => {
    const payload: CinematicAnimationPayload = {
      type,
      player,
      value,
      timestamp: Date.now(),
    };

    onTriggerCinematic(payload);

    // Synchronize acoustic audio effect
    if (type === 'COUNTDOWN') soundEffects.playCountdownBeep(false);
    else if (type === 'FAIL' || type === 'PENALTY') soundEffects.playPenaltySound();
    else if (type === 'BONUS' || type === 'SCORE_CHANGE') soundEffects.playRewardDing();
    else if (type === 'WINNER') soundEffects.playFanfare();
    else if (type === 'ROUND_START') soundEffects.playWhistle();
    else if (type === 'INTRO') soundEffects.playRewardDing();

    onAddLog({
      roundIndex: currentRoundIndex,
      category: 'ANIMATION',
      actor: player || 'DIRECTOR',
      persianText: `اجرای انیمیشن سینمایی ${type} ${value ? `(${value})` : ''}`,
    });
  };

  const handleSpeakCue = async (cue: VoiceCue) => {
    setActiveVoiceId(cue.id);
    onAddLog({
      roundIndex: currentRoundIndex,
      category: 'VOICE',
      actor: 'REFEREE',
      persianText: `فرمان صوتی داور: «${cue.persianText}»`,
    });

    await voiceDirector.speak(cue);
    setActiveVoiceId(null);
  };

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-3xl bg-[#0b0b12]/90 border border-white/15 backdrop-blur-2xl shadow-2xl select-none">
      {/* 1. TOP HEADER & QUICK BARS */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-red-500 p-0.5 shadow-lg">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <h3 className="font-['Vazirmatn'] text-sm font-black text-white flex items-center gap-1.5">
              <span>سیستم مدیریت تولید (SHOW ENGINE)</span>
            </h3>
            <span className="text-[10px] font-mono text-neutral-400 uppercase">
              SCENARIO-BASED BROADCAST DIRECTOR
            </span>
          </div>
        </div>

        {/* Action Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          {onOpenLogoManager && (
            <button
              onClick={onOpenLogoManager}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/50 text-cyan-300 font-mono text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm"
              title="مدیریت و آپلود لوگوی رسمی چنل یوتیوب"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-['Vazirmatn']">لوگوی چنل</span>
            </button>
          )}

          {onOpenVoiceStudio && (
            <button
              onClick={onOpenVoiceStudio}
              className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-400/50 text-pink-300 font-mono text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm"
              title="استودیوی صدای زنانه فارسی"
            >
              <Mic className="w-3.5 h-3.5 text-pink-400" />
              <span className="font-['Vazirmatn']">استودیو صدا</span>
            </button>
          )}

          <button
            onClick={onOpenScenarioModal}
            className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-mono text-[11px] font-bold flex items-center gap-1 transition-all"
            title="انتخاب یا تغییر سناریو"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>سناریو</span>
          </button>

          <button
            onClick={onOpenModulesModal}
            className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-mono text-[11px] font-bold flex items-center gap-1 transition-all"
            title="تنظیم ماژول‌های هوشمند"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>ماژول‌ها</span>
          </button>

          <button
            onClick={onOpenLogsModal}
            className="px-2.5 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 text-purple-300 font-mono text-[11px] font-bold flex items-center gap-1 transition-all"
            title="مشاهده لاگ‌های رسمی مسابقه"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>لاگ‌ها</span>
          </button>
        </div>
      </div>

      {/* Active Scenario Card Pill */}
      <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-['Vazirmatn'] text-neutral-200 font-bold">
            سناریوی فعال: {activeScenario.persianName}
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-400/40 font-black">
          {activeScenario.rounds.length} ROUNDS • {activeScenario.defaultTimerSeconds}s
        </span>
      </div>

      {/* 2. CINEMATIC VISUAL ENGINE QUICK TRIGGERS */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-cyan-300 font-bold uppercase flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            <span>CINEMATIC VISUAL FX & ANIMATION EVENTS:</span>
          </span>
          <span className="text-[10px] text-neutral-500 font-['Vazirmatn']">
            (۳ ثانیه نگه دارید برای راهنما)
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
          {/* 1. Intro FX */}
          <button
            onClick={() =>
              handleTriggerFx('INTRO', undefined, undefined, {
                title: 'CINEMATIC INTRO',
                persianTitle: 'انیمیشن شروع مسابقه',
                description: 'Launches full-screen holographic wolf crest and dual team light sweeps.',
                persianDescription: 'انیمیشن حماسی شروع برنامه با نماد گرگ داداش‌مد و تابش پرتوهای لیزری قرمز و سبز.',
              })
            }
            onMouseDown={() =>
              startLongPress({
                title: 'CINEMATIC INTRO',
                persianTitle: 'انیمیشن شروع مسابقه',
                description: 'Launches full-screen holographic wolf crest and dual team light sweeps.',
                persianDescription: 'انیمیشن حماسی شروع برنامه با نماد گرگ داداش‌مد و تابش پرتوهای لیزری قرمز و سبز.',
              })
            }
            onMouseUp={cancelLongPress}
            onTouchStart={() =>
              startLongPress({
                title: 'CINEMATIC INTRO',
                persianTitle: 'انیمیشن شروع مسابقه',
                description: 'Launches full-screen holographic wolf crest and dual team light sweeps.',
                persianDescription: 'انیمیشن حماسی شروع برنامه با نماد گرگ داداش‌مد و تابش پرتوهای لیزری قرمز و سبز.',
              })
            }
            onTouchEnd={cancelLongPress}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="font-['Vazirmatn'] text-[11px] text-neutral-200">ROUND_START / شروع</span>
          </button>

          {/* 2. Countdown FX */}
          <button
            onClick={() => handleTriggerFx('COUNTDOWN', undefined, 3)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-['Vazirmatn'] text-[11px] text-neutral-200">COUNTDOWN (۳-۲-۱)</span>
          </button>

          {/* 3. Score Change Elias */}
          <button
            onClick={() => handleTriggerFx('SCORE_CHANGE', 'ELIAS', '+10s')}
            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <TrendingUp className="w-4 h-4 text-red-300" />
            <span className="font-['Vazirmatn'] text-[11px] text-red-200">SCORE: +۱۰ الیاس</span>
          </button>

          {/* 4. Score Change Emad */}
          <button
            onClick={() => handleTriggerFx('SCORE_CHANGE', 'EMAD', '+10s')}
            className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/50 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <TrendingUp className="w-4 h-4 text-emerald-300" />
            <span className="font-['Vazirmatn'] text-[11px] text-emerald-200">SCORE: +۱۰ عماد</span>
          </button>

          {/* 5. Warning FX */}
          <button
            onClick={() => handleTriggerFx('WARNING')}
            className="p-2 rounded-xl bg-yellow-950/40 hover:bg-yellow-950/70 border border-yellow-500/40 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="font-['Vazirmatn'] text-[11px] text-yellow-200">WARNING / هشدار</span>
          </button>

          {/* 6. Winner FX */}
          <button
            onClick={() => handleTriggerFx('WINNER', 'ELIAS')}
            className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span className="font-['Vazirmatn'] text-[11px] text-amber-300 font-black">WINNER / برنده</span>
          </button>

          {/* 7. Fail FX */}
          <button
            onClick={() => handleTriggerFx('FAIL', 'EMAD')}
            className="p-2 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/60 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="font-['Vazirmatn'] text-[11px] text-red-300">FAIL / شکست</span>
          </button>

          {/* 8. Penalty Foul */}
          <button
            onClick={() => handleTriggerFx('PENALTY', 'ELIAS', 'FOUL')}
            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/40 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="font-['Vazirmatn'] text-[11px] text-red-300">PENALTY / پنالتی</span>
          </button>

          {/* 9. Bonus Reward */}
          <button
            onClick={() => handleTriggerFx('BONUS', 'EMAD', '+15s')}
            className="p-2 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span className="font-['Vazirmatn'] text-[11px] text-amber-200">BONUS / پاداش</span>
          </button>

          {/* 10. Transition */}
          <button
            onClick={() => handleTriggerFx('TRANSITION')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center flex flex-col items-center gap-1 transition-all active:scale-95"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="font-['Vazirmatn'] text-[11px] text-neutral-200">TRANSITION / مایع</span>
          </button>
        </div>
      </div>

      {/* 3. OFFLINE VOICE DIRECTOR PERSIAN CUES */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-amber-300 font-bold uppercase flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" />
            <span>PERSIAN AI VOICE DIRECTOR (فرمان‌های صوتی زنانه):</span>
          </span>
          <div className="flex items-center gap-2">
            {onOpenVoiceStudio && (
              <button
                onClick={onOpenVoiceStudio}
                className="text-[10px] text-pink-300 hover:text-pink-200 flex items-center gap-1 font-['Vazirmatn'] font-bold"
              >
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>ویرایش و ساخت اسکریپت جدید</span>
              </button>
            )}
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/40">
              OFFLINE READY
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {OFFICIAL_VOICE_CUES.slice(0, 8).map((cue) => {
            const isSpeaking = activeVoiceId === cue.id;

            return (
              <button
                key={cue.id}
                onClick={() => handleSpeakCue(cue)}
                className={`p-2.5 rounded-xl border text-right flex flex-col justify-between gap-1 transition-all active:scale-95 ${
                  isSpeaking
                    ? 'bg-amber-400 text-black border-amber-300 shadow-lg'
                    : 'bg-black/40 hover:bg-black/70 border-white/10 text-white'
                }`}
                dir="rtl"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-['Vazirmatn'] text-xs font-bold truncate">
                    {cue.label}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSpeaking ? 'bg-black animate-ping' : 'bg-amber-400/60'
                    }`}
                  />
                </div>
                <span className="font-mono text-[9px] text-neutral-400 uppercase">
                  {cue.emotion} • {cue.style}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
