import React, { useState } from 'react';
import { GameState, PublicBroadcastState, PlayerId, GameRound } from '../../types/game';
import { EpisodeScenario } from '../../engine/storyEngine';
import { VoiceCueSystemPanel } from './VoiceCueSystemPanel';
import { AudienceDisplayStage } from '../audience/AudienceDisplayStage';
import { ScenarioImporterModal } from './ScenarioImporterModal';
import { ThemeManagerModal } from './ThemeManagerModal';
import { VfxSfxPadModal } from './VfxSfxPadModal';
import { RehearsalModeModal } from './RehearsalModeModal';
import { AiCenterModal } from './AiCenterModal';
import { RealBroadcastRecorder } from './RealBroadcastRecorder';
import { LogoManagerModal } from './LogoManagerModal';
import { FeatureManagerModal } from './FeatureManagerModal';
import { WolfBrandLogo } from '../brand/WolfBrandLogo';
import { MediaLibraryPanel } from './MediaLibraryPanel';
import { voiceCueEngine } from '../../engine/voiceCueEngine';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Monitor,
  Film,
  Palette,
  Zap,
  PlayCircle,
  Bot,
  Video,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface DirectorControlRoomStageProps {
  gameState: GameState;
  publicBroadcast: PublicBroadcastState;
  activeVfx?: { type: string; message?: string; id: number } | null;
  isRehearsalActive: boolean;
  onToggleRehearsal: (active: boolean) => void;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onResetTimer: (customSeconds?: number) => void;
  onNextRound: () => void;
  onPrevRound: () => void;
  onSetRound: (index: number) => void;
  onApplyEpisode: (episode: EpisodeScenario) => void;
  onAddTime: (player: PlayerId, seconds: number, reason?: string) => void;
  onSubtractTime: (player: PlayerId, seconds: number, reason?: string) => void;
  onRequestReview: (reason?: string) => void;
  onResolveReview: (verdict: 'CONFIRMED' | 'OVERTURNED' | 'DISMISSED') => void;
  onTriggerVfx: (type: string, message?: string) => void;
  className?: string;
}

export const DirectorControlRoomStage: React.FC<DirectorControlRoomStageProps> = ({
  gameState,
  publicBroadcast,
  activeVfx,
  isRehearsalActive,
  onToggleRehearsal,
  onStartTimer,
  onPauseTimer,
  onResumeTimer,
  onResetTimer,
  onNextRound,
  onPrevRound,
  onSetRound,
  onApplyEpisode,
  onAddTime,
  onSubtractTime,
  onRequestReview,
  onResolveReview,
  onTriggerVfx,
  className = '',
}) => {
  // Modal states for the 11 modules
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isVfxPadOpen, setIsVfxPadOpen] = useState(false);
  const [isRehearsalModalOpen, setIsRehearsalModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isRecorderModalOpen, setIsRecorderModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [introVoiceStatus, setIntroVoiceStatus] = useState('');

  const currentRound = gameState.rounds[gameState.currentRoundIndex] || {
    number: 1,
    title: 'Round 1',
    persianTitle: 'راند ۱',
    rule: '',
    persianRule: '',
    defaultTimerSeconds: 30,
    rewardSeconds: 10,
  };

  const elias = gameState.players.ELIAS;
  const emad = gameState.players.EMAD;

  return (
    <div
      id="director-control-room-stage"
      className={`w-full min-h-screen bg-[#08090d] text-white flex flex-col p-3 sm:p-5 select-none font-['Vazirmatn'] ${className}`}
      dir="rtl"
    >
      {/* MASTER BROADCAST TOOLBAR */}
      <header className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl mb-4">
        <div className="flex items-center gap-3">
          <WolfBrandLogo variant="hud" size="sm" />
          <div>
            <h1 className="text-sm sm:text-base font-black text-amber-400 flex items-center gap-2">
              <span>اتاق فرمان و مانیتورینگ کارگردان (DIRECTOR CONTROL ROOM)</span>
              {isRehearsalActive && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 text-[10px] font-bold">
                  حالت تمرین (REHEARSAL)
                </span>
              )}
            </h1>
            <p className="text-[11px] text-neutral-400">
              مدیریت راندها، ثبت امتیازها، مانیتورینگ زنده دوربین و هدایت فرمان‌های صوتی
            </p>
          </div>
        </div>

        {/* 11 Modules Quick Access Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsScenarioModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/50 text-purple-300 text-xs font-bold flex items-center gap-1 transition"
          >
            <Film className="w-3.5 h-3.5" />
            <span>سناریو و اپیزود</span>
          </button>

          <button
            type="button"
            onClick={() => setIsThemeModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 text-xs font-bold flex items-center gap-1 transition"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>تم و گرافیک</span>
          </button>
          <button type="button" onClick={() => setIsLogoModalOpen(true)}
            className="min-h-11 rounded-xl bg-neutral-800 px-3 text-xs font-bold text-amber-200">
            بارگذاری لوگو
          </button>

          <button
            type="button"
            onClick={() => setIsVfxPadOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/50 text-amber-300 text-xs font-bold flex items-center gap-1 transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>پد VFX / SFX</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRehearsalModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1 transition"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>تمرین و تست</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRecorderModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-1 transition"
          >
            <Video className="w-3.5 h-3.5" />
            <span>رکورد تمیز</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/50 text-blue-300 text-xs font-bold flex items-center gap-1 transition"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>هوش مصنوعی</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFeatureModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs font-bold flex items-center gap-1 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>ماژول‌ها</span>
          </button>
        </div>
      </header>

      {/* MAIN TWO-COLUMN DASHBOARD */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: LIVE DIRECTOR MONITOR (6 COLUMNS) */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          {/* Real-time Audience Output Monitor */}
          <div className="p-3.5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-neutral-200">
                  مانیتور زنده خروجی تماشاگر و دوربین (LIVE BROADCAST FEED)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-red-600/30 text-red-400 font-mono text-[10px] font-bold border border-red-500/40">
                1080p60 STREAM
              </span>
            </div>

            {/* Embedded Live Audience Screen Scaled */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
              <div className="absolute inset-0 transform scale-[0.55] origin-top-left w-[181.8%] h-[181.8%] pointer-events-none">
                <AudienceDisplayStage broadcast={publicBroadcast} activeVfx={activeVfx} />
              </div>
            </div>

            {/* Current Stage Info Bar */}
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px]">راند فعال:</span>
                <span className="font-bold text-amber-300">
                  {currentRound.number}. {currentRound.persianTitle}
                </span>
              </div>
              <div className="text-left font-mono">
                <span className="text-neutral-500 block text-[10px]">زمان پایه راند:</span>
                <span className="text-neutral-300 font-bold">{currentRound.defaultTimerSeconds} ثانیه</span>
              </div>
            </div>
          </div>

          {/* MASTER TIMER & STAGE CONTROLS */}
          <div className="p-4 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300">کنترل تایمر و انتقال راندها:</span>
              <div className="font-mono text-xs px-2.5 py-1 rounded-xl bg-black border border-neutral-800 text-amber-400 font-black">
                ⏱ {gameState.timerSecondsRemaining}s باقی‌مانده
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {!gameState.isTimerRunning ? (
                <button
                  type="button"
                  onClick={gameState.isTimerPaused ? onResumeTimer : onStartTimer}
                  className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{gameState.isTimerPaused ? 'ادامهٔ تایمر' : 'شروع تایمر'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPauseTimer}
                  className="py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/30 active:scale-95 transition"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>توقف موقت</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onResetTimer()}
                className="py-3 px-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ریست زمان</span>
              </button>

              <button
                type="button"
                onClick={onPrevRound}
                disabled={gameState.currentRoundIndex === 0}
                className="py-3 px-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <SkipBack className="w-4 h-4" />
                <span>راند قبل</span>
              </button>

              <button
                type="button"
                onClick={onNextRound}
                disabled={gameState.currentRoundIndex === gameState.rounds.length - 1}
                className="py-3 px-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <SkipForward className="w-4 h-4" />
                <span>راند بعد</span>
              </button>
            </div>

            {/* VAR Review Trigger */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
              {!gameState.isUnderReview ? (
                <button
                  type="button"
                  onClick={() => onRequestReview('درخواست بازبینی صحنه توسط کارگردان')}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/60 text-red-300 font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>درخواست بازبینی رسمی صحنه (VAR Review)</span>
                </button>
              ) : (
                <div className="w-full flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onResolveReview('CONFIRMED')}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>تایید صحت حرکت</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onResolveReview('OVERTURNED')}
                    className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center gap-1"
                  >
                    <span>اعلام خطا (جریمه را جدا ثبت کنید)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SCORE MANAGEMENT & VOICE DIRECTING (6 COLUMNS) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* QUICK SCORE INJECTION CARDS (ELIAS & EMAD) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* ELIAS SCORE PAD */}
            <div className="p-4 rounded-3xl bg-neutral-900/90 border border-red-500/40 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-black text-sm text-red-400">ELIAS — الیاس</span>
                </div>
                <div className="font-mono text-xl font-black text-white">{elias.seconds}s</div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onAddTime('ELIAS', 10, 'پاداش راند')}
                  className="py-2 px-2 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-red-200 font-bold text-xs active:scale-95 transition"
                >
                  +10s
                </button>
                <button
                  type="button"
                  onClick={() => onAddTime('ELIAS', 15, 'پاداش ویژه')}
                  className="py-2 px-2 rounded-xl bg-red-950/60 hover:bg-red-900/70 border border-red-500/40 text-red-200 font-bold text-xs active:scale-95 transition"
                >
                  +15s
                </button>
                <button
                  type="button"
                  onClick={() => onSubtractTime('ELIAS', 5, 'جریمه')}
                  className="py-2 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs active:scale-95 transition"
                >
                  -5s
                </button>
              </div>
            </div>

            {/* EMAD SCORE PAD */}
            <div className="p-4 rounded-3xl bg-neutral-900/90 border border-emerald-500/40 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="font-black text-sm text-emerald-400">EMAD — عماد</span>
                </div>
                <div className="font-mono text-xl font-black text-white">{emad.seconds}s</div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onAddTime('EMAD', 10, 'پاداش راند')}
                  className="py-2 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-200 font-bold text-xs active:scale-95 transition"
                >
                  +10s
                </button>
                <button
                  type="button"
                  onClick={() => onAddTime('EMAD', 15, 'پاداش ویژه')}
                  className="py-2 px-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-200 font-bold text-xs active:scale-95 transition"
                >
                  +15s
                </button>
                <button
                  type="button"
                  onClick={() => onSubtractTime('EMAD', 5, 'جریمه')}
                  className="py-2 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs active:scale-95 transition"
                >
                  -5s
                </button>
              </div>
            </div>
          </div>

          {/* VOICE CUE SYSTEM PANEL */}
          <VoiceCueSystemPanel />
        </div>
      </div>

      <MediaLibraryPanel onPresent={(id) => onTriggerVfx('SHOW_ASSET', id)} />
      <button type="button" className="my-3 self-start min-h-11 rounded-xl bg-amber-700 px-5 font-bold"
        onClick={async () => {
          const line = `${currentRound.persianTitle}. قوانین: ${currentRound.persianRule}`;
          onTriggerVfx('ROUND_INTRO', line);
          setIntroVoiceStatus('در حال اجرای گفتار معرفی...');
          const spoken = await voiceCueEngine.playCustomVoice(line, 'Kore', 'dramatic');
          setIntroVoiceStatus(spoken ? 'دیالوگ اجرا شد؛ ضبط آزمایشی را بازشنوی کنید.' : 'صدای معرفی اجرا نشد: WAV همین متن را وارد کنید یا موتور محلی را نصب کنید.');
        }}>
        معرفی تمام‌صفحهٔ راند و قوانین
      </button>
      {introVoiceStatus && <p role="status" className="text-amber-200">{introVoiceStatus}</p>}
      {/* MODALS */}
      <ScenarioImporterModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onSelectRound={(r) => onSetRound(r.number - 1)}
        onApplyEpisode={onApplyEpisode}
      />

      <ThemeManagerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <VfxSfxPadModal
        isOpen={isVfxPadOpen}
        onClose={() => setIsVfxPadOpen(false)}
        onTriggerVfx={onTriggerVfx}
      />

      <RehearsalModeModal
        isOpen={isRehearsalModalOpen}
        onClose={() => setIsRehearsalModalOpen(false)}
        isRehearsalActive={isRehearsalActive}
        onToggleRehearsal={onToggleRehearsal}
      />

      <AiCenterModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <RealBroadcastRecorder
        isOpen={isRecorderModalOpen}
        onClose={() => setIsRecorderModalOpen(false)}
        broadcast={publicBroadcast}
        activeVfx={activeVfx}
      />

      <LogoManagerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      <FeatureManagerModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
      />
    </div>
  );
};
