import React, { useState, useEffect } from 'react';
import { PublicBroadcastState, PlayerId } from '../../types/game';
import { ShowOutputFormat } from '../../types/showEngine';
import { WolfBrandLogo } from '../brand/WolfBrandLogo';
import { themeEngine, EpisodeThemeConfig } from '../../engine/themeEngine';
import { getImage } from '../../engine/mediaLibrary';
import {
  Clock,
  Trophy,
  AlertTriangle,
  Flame,
  Radio,
  Sparkles,
  Maximize2,
  Layers,
  Smartphone,
} from 'lucide-react';

interface AudienceDisplayStageProps {
  broadcast: PublicBroadcastState;
  activeVfx?: { type: string; message?: string; id: number } | null;
  className?: string;
  initialFormat?: ShowOutputFormat;
}

export const AudienceDisplayStage: React.FC<AudienceDisplayStageProps> = ({
  broadcast,
  activeVfx,
  className = '',
  initialFormat = 'FULL_SCREEN_SCENE',
}) => {
  const [outputFormat, setOutputFormat] = useState<ShowOutputFormat>(initialFormat);
  const [theme, setTheme] = useState<EpisodeThemeConfig>(() => themeEngine.getActiveTheme());
  const [vfxAnimationActive, setVfxAnimationActive] = useState<boolean>(false);
  const [sceneImage, setSceneImage] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    let url: string | null = null;
    setSceneImage(null);
    if (activeVfx?.type === 'SHOW_ASSET' && activeVfx.message) {
      getImage(activeVfx.message).then((record) => {
        if (!record || !active) return;
        url = URL.createObjectURL(record.blob);
        setSceneImage(url);
      }).catch(console.error);
    }
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [activeVfx?.id]);

  useEffect(() => {
    return themeEngine.subscribe((newTheme) => setTheme(newTheme));
  }, []);

  useEffect(() => {
    if (activeVfx) {
      setVfxAnimationActive(true);
      const timer = setTimeout(() => setVfxAnimationActive(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [activeVfx]);

  const { round, players, timer, review } = broadcast;
  const elias = players.ELIAS;
  const emad = players.EMAD;

  // Format timer into MM:SS
  const mins = Math.floor(timer.secondsRemaining / 60);
  const secs = timer.secondsRemaining % 60;
  const formattedTimer = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Circular timer progress (assuming 60s max per gauge cycle)
  const maxCycle = 60;
  const progressRatio = Math.min(1, timer.secondsRemaining / maxCycle);
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference * (1 - progressRatio);

  const isLowTime = timer.isRunning && timer.secondsRemaining <= 10 && timer.secondsRemaining > 0;
  const isTimeUp = timer.secondsRemaining === 0;

  // Format container styling
  const isVertical = outputFormat === 'VERTICAL_SHORTS';
  const isTransparent = outputFormat === 'TRANSPARENT_OVERLAY';

  return (
    <div
      id="audience-display-stage"
      className={`relative w-full min-h-screen overflow-hidden select-none font-['Vazirmatn'] transition-colors duration-500 ${
        isTransparent
          ? 'bg-transparent'
          : theme.backgroundClass
      } text-white flex flex-col justify-between p-4 sm:p-8 ${className}`}
      dir="rtl"
    >
      {/* Format Switcher (Discreet hover tool at very top edge) */}
      {activeVfx && ['ROUND_INTRO', 'SHOW_ASSET'].includes(activeVfx.type) && (
        <section className="absolute inset-0 z-40 bg-[#152635] flex flex-col justify-between p-[6%] text-[#f7eee0]" aria-label="معرفی مرحله" dir="rtl">
          <p className="text-amber-300 text-xl font-bold">DADASHMODE | معرفی مرحله</p>
          {activeVfx.type === 'SHOW_ASSET'
            ? sceneImage ? <img src={sceneImage} alt="تصویر صحنه" className="max-h-[70%] max-w-full object-contain mx-auto" /> : <p>در حال بارگذاری تصویر...</p>
            : <div><h1 className="text-4xl sm:text-7xl font-black">{round.persianTitle}</h1><p className="text-xl sm:text-3xl leading-relaxed mt-8 max-w-4xl">{round.persianRule}</p></div>}
          <p className="text-lg">مرحله {round.current} از {round.total}</p>
        </section>
      )}
      <div className="absolute top-2 left-2 z-50 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 opacity-30 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setOutputFormat('FULL_SCREEN_SCENE')}
          title="Esports 16:9 Broadcast Scene"
          className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
            outputFormat === 'FULL_SCREEN_SCENE' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">16:9 Broadcast</span>
        </button>

        <button
          type="button"
          onClick={() => setOutputFormat('TRANSPARENT_OVERLAY')}
          title="Transparent HUD Alpha (OBS / Premiere)"
          className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
            outputFormat === 'TRANSPARENT_OVERLAY' ? 'bg-cyan-500 text-black font-bold' : 'text-neutral-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">HUD Overlay</span>
        </button>

        <button
          type="button"
          onClick={() => setOutputFormat('VERTICAL_SHORTS')}
          title="9:16 Vertical Shorts Format"
          className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
            outputFormat === 'VERTICAL_SHORTS' ? 'bg-purple-500 text-black font-bold' : 'text-neutral-400'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shorts 9:16</span>
        </button>
      </div>

      {/* TOP BROADCAST BAR */}
      <header className={`w-full max-w-7xl mx-auto flex items-center justify-between gap-4 z-20 ${isVertical ? 'flex-col items-center pt-8' : ''}`}>
        {/* Brand & Show Logo */}
        <div className="flex items-center gap-3">
          <WolfBrandLogo variant="3d" size="md" showText={!isVertical} />
        </div>

        {/* Center Round Card - Liquid Glass */}
        <div className="flex flex-col items-center justify-center px-6 py-2 rounded-2xl bg-neutral-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2">
            <span className="font-['Chakra_Petch'] font-black text-amber-400 tracking-wider text-xs sm:text-sm uppercase">
              ROUND {round.current} / {round.total}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <h2 className="font-black text-sm sm:text-base text-white tracking-wide mt-0.5">
            {round.persianTitle}
          </h2>
        </div>

        {/* Live Broadcast Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/30 border border-red-500/60 text-red-300 font-mono text-xs font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>DADASH ON-AIR</span>
          </div>
        </div>
      </header>

      {/* VAR REVIEW OVERLAY BANNER */}
      {review.isUnderReview && (
        <div className="w-full max-w-4xl mx-auto my-4 p-4 rounded-3xl bg-red-950/80 border-2 border-red-500/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(239,68,68,0.5)] flex items-center justify-between gap-4 animate-in slide-in-from-top-4 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg animate-pulse">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-black text-base sm:text-lg text-white">
                توقف بازی: بازبینی رسمی صحنه توسط داور (VAR)
              </div>
              <div className="text-xs text-red-200 mt-0.5">
                {review.reason || 'بررسی اعتبار برج، دست دوم یا لمس همزمان'}
              </div>
            </div>
          </div>
          <div className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-['Chakra_Petch'] font-black tracking-widest text-xs uppercase animate-bounce">
            OFFICIAL REVIEW
          </div>
        </div>
      )}

      {/* CENTER STAGE: LIQUID GLASS TIMER & ARENA */}
      <main className="flex-1 flex flex-col items-center justify-center relative my-6 z-10">
        {/* Glow ambient circle */}
        <div
          className="absolute w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40 transition-colors duration-700"
          style={{
            backgroundColor: isLowTime ? '#EF4444' : theme.primaryAccent,
          }}
        />

        {/* Circular Liquid Glass Timer Gauge */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1f2937"
              strokeWidth="5"
              opacity="0.4"
            />
            {/* Animated Active Track */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isLowTime ? '#EF4444' : theme.primaryAccent}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />
          </svg>

          {/* Inner Liquid Glass Core */}
          <div className="absolute inset-5 sm:inset-6 rounded-full bg-neutral-950/80 backdrop-blur-2xl border border-white/10 shadow-[inset_0_4px_25px_rgba(255,255,255,0.08),0_15px_40px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center">
            <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
              REMAINING TIME
            </span>

            <div
              className={`font-['Chakra_Petch'] font-black text-5xl sm:text-6xl tracking-tight transition-all ${
                isLowTime
                  ? 'text-red-500 scale-110 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]'
                  : 'text-white drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]'
              }`}
            >
              {formattedTimer}
            </div>

            <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-neutral-300">
              <span className={`w-2 h-2 rounded-full ${timer.isRunning ? 'bg-emerald-400 animate-ping' : timer.isPaused ? 'bg-amber-400' : 'bg-neutral-500'}`} />
              <span>{timer.isRunning ? 'RUNNING' : timer.isPaused ? 'PAUSED' : 'READY'}</span>
            </div>
          </div>
        </div>

        {/* Active VFX Overlay Banner */}
        {vfxAnimationActive && activeVfx && (
          <div className="absolute -bottom-8 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-500/90 text-black font-black text-base sm:text-lg shadow-[0_10px_40px_rgba(245,158,11,0.5)] border-2 border-white flex items-center gap-2 animate-in zoom-in-90 duration-200">
            <Sparkles className="w-5 h-5 fill-current animate-spin" />
            <span>{activeVfx.message || 'امتیاز جدید به بانک زمان افزوده شد!'}</span>
          </div>
        )}
      </main>

      {/* BOTTOM ARENA: COMPETITOR TIME BANKS (ELIAS & EMAD) */}
      <footer className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 z-20">
        {/* ELIAS TIME BANK CARD */}
        <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900/80 backdrop-blur-2xl border-2 border-red-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-400 flex items-center justify-center text-white text-2xl font-black shadow-[0_0_20px_rgba(255,39,56,0.4)]">
              ▲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Chakra_Petch'] font-black text-lg sm:text-xl text-white tracking-wide">
                  ELIAS
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-red-950/80 border border-red-500/50 text-red-300 font-bold">
                  اِلیاس
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider">
                TIME BANK CURRENCY
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="font-['Chakra_Petch'] font-black text-4xl sm:text-5xl text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,39,56,0.3)]">
              {elias.seconds}
              <span className="text-xl sm:text-2xl text-red-400 ml-1">s</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              BANKED SECONDS
            </span>
          </div>
        </div>

        {/* EMAD TIME BANK CARD */}
        <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900/80 backdrop-blur-2xl border-2 border-emerald-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 border-2 border-emerald-400 flex items-center justify-center text-white text-2xl font-black shadow-[0_0_20px_rgba(0,201,141,0.4)]">
              ●
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Chakra_Petch'] font-black text-lg sm:text-xl text-white tracking-wide">
                  EMAD
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold">
                  عِماد
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400 tracking-wider">
                TIME BANK CURRENCY
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="font-['Chakra_Petch'] font-black text-4xl sm:text-5xl text-white tracking-tight drop-shadow-[0_0_15px_rgba(0,201,141,0.3)]">
              {emad.seconds}
              <span className="text-xl sm:text-2xl text-emerald-400 ml-1">s</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
              BANKED SECONDS
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
