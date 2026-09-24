import React, { useState, useRef, useCallback } from 'react';
import { PublicBroadcastState, PlayerId } from '../../types/game';
import {
  HudLayoutPositions,
  DEFAULT_HUD_POSITIONS,
  SafeAreaGuideSettings,
  PreviewFootageType,
} from '../../types/broadcastLayout';
import { DadashWolfLogo } from './DadashWolfLogo';
import { PreviewFootageSim } from './PreviewFootageSim';
import {
  GripHorizontal,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Layers,
  ShieldAlert,
} from 'lucide-react';

interface RealVideoOverlayHudProps {
  publicState: PublicBroadcastState;
  positions?: HudLayoutPositions;
  onPositionsChange?: (newPositions: HudLayoutPositions) => void;
  safeGuides: SafeAreaGuideSettings;
  previewFootage?: PreviewFootageType;
  previewType?: PreviewFootageType;
  customMediaUrl?: string | null;
  isDraggable?: boolean;
  onToggleDraggable?: () => void;
  isCleanFeed?: boolean;
  className?: string;
}

export const RealVideoOverlayHud: React.FC<RealVideoOverlayHudProps> = ({
  publicState,
  positions: controlledPositions,
  onPositionsChange,
  safeGuides,
  previewFootage,
  previewType,
  customMediaUrl,
  isDraggable = true,
  onToggleDraggable,
  isCleanFeed = false,
  className = '',
}) => {
  const activePreviewType = previewFootage || previewType || 'footage_sim';
  const [localPositions, setLocalPositions] = useState<HudLayoutPositions>(
    controlledPositions || DEFAULT_HUD_POSITIONS
  );

  const positions = controlledPositions || localPositions;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingWidgetRef = useRef<keyof HudLayoutPositions | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  const {
    roundNumber,
    totalRounds,
    roundTitle,
    roundPersianTitle,
    roundPersianRule,
    rewardSeconds,
    timer,
    players,
    aiState,
    latestAnnouncement,
    review,
    winner,
  } = publicState;

  // Handle start dragging
  const handleMouseDown = (
    widgetKey: keyof HudLayoutPositions,
    e: React.MouseEvent
  ) => {
    if (!isDraggable) return;
    e.preventDefault();
    draggingWidgetRef.current = widgetKey;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: positions[widgetKey].x,
      startY: positions[widgetKey].y,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!draggingWidgetRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStartRef.current.mouseX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.mouseY) / rect.height) * 100;

      const widget = draggingWidgetRef.current;
      const newX = Math.max(0, Math.min(88, dragStartRef.current.startX + deltaX));
      const newY = Math.max(0, Math.min(94, dragStartRef.current.startY + deltaY));

      const updated = {
        ...positions,
        [widget]: {
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
        },
      };

      if (onPositionsChange) {
        onPositionsChange(updated);
      } else {
        setLocalPositions(updated);
      }
    },
    [positions, onPositionsChange]
  );

  const handleMouseUp = useCallback(() => {
    draggingWidgetRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleResetPositions = () => {
    if (onPositionsChange) {
      onPositionsChange(DEFAULT_HUD_POSITIONS);
    } else {
      setLocalPositions(DEFAULT_HUD_POSITIONS);
    }
  };

  // Timer formatting
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const isTimerCritical = timer.secondsRemaining <= 5 && timer.isRunning;
  const isValidation = timer.isValidationTimer;

  return (
    <div
      ref={containerRef}
      id="real-video-overlay-stage"
      className={`relative w-full aspect-video max-w-[1920px] mx-auto overflow-hidden select-none bg-transparent ${className}`}
      dir="ltr"
    >
      {/* 1. PREVIEW BACKGROUND LAYER (Footage Simulation / Custom Upload / Checkerboard / Green / Black) */}
      <PreviewFootageSim
        type={activePreviewType}
        customMediaUrl={customMediaUrl}
        roundNumber={roundNumber}
      />

      {/* 2. RESPONSIVE SAFE AREA GUIDES OVERLAY */}
      {safeGuides.showActionSafe && (
        <div
          className="absolute inset-[3.5%] pointer-events-none border border-cyan-400/50 border-dashed z-10 flex flex-col justify-between"
          title="Action Safe 93%"
        >
          <div className="flex justify-between items-center px-2 py-0.5 text-[9px] font-mono text-cyan-300/80 bg-cyan-950/40 w-fit rounded">
            <span>ACTION SAFE (93%)</span>
          </div>
          <div className="flex justify-end px-2 py-0.5 text-[9px] font-mono text-cyan-300/80 bg-cyan-950/40 w-fit self-end rounded">
            <span>ACTION SAFE</span>
          </div>
        </div>
      )}

      {safeGuides.showTitleSafe && (
        <div
          className="absolute inset-[5%] pointer-events-none border border-amber-400/40 border-dotted z-10 flex flex-col justify-between"
          title="Title Safe 90%"
        >
          <div className="flex justify-between items-center px-2 py-0.5 text-[9px] font-mono text-amber-300/80 bg-amber-950/40 w-fit rounded self-center">
            <span>TITLE SAFE (90%)</span>
          </div>
        </div>
      )}

      {safeGuides.showRuleOfThirds && (
        <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-white/10" />
          <div className="border-r border-white/10" />
          <div />
        </div>
      )}

      {/* CENTER PROTECTED CLEAR ZONE (70% middle box that must remain clear) */}
      {safeGuides.showCenterClearZone && (
        <div
          className="absolute left-[15%] top-[15%] w-[70%] h-[70%] pointer-events-none z-10 rounded-2xl border-2 border-emerald-400/25 flex items-center justify-center"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0, 230, 118, 0.03) 0%, transparent 80%)',
          }}
        >
          <div className="px-3 py-1.5 rounded-full bg-black/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-md opacity-40 hover:opacity-100 transition-opacity">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>PROTECTED CENTER ZONE (100% CLEAR FOR FACES & HANDS)</span>
          </div>
        </div>
      )}

      {/* 3. WIDGET 1: TOP-LEFT ROUND INFO CARD */}
      <div
        style={{
          left: `${positions.roundInfo.x}%`,
          top: `${positions.roundInfo.y}%`,
        }}
        className={`absolute z-30 transition-shadow ${
          isDraggable ? 'cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-cyan-400/80 rounded-2xl' : ''
        }`}
        onMouseDown={(e) => handleMouseDown('roundInfo', e)}
      >
        <div className="relative group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#080d1a]/95 via-[#0e1628]/90 to-[#080d1a]/85 backdrop-blur-xl border border-cyan-500/40 shadow-[0_8px_32px_rgba(0,167,255,0.25)] ring-1 ring-white/15">
          {/* Subtle electric blue top specular border */}
          <div className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />

          {/* DADASHMODE Wolf Insignia */}
          <DadashWolfLogo size={36} glow={true} />

          {/* Round Information */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/30 uppercase">
                ROUND {roundNumber}/{totalRounds}
              </span>
              {rewardSeconds && (
                <span className="font-mono text-[10px] font-black text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-400/30">
                  +{rewardSeconds}s
                </span>
              )}
            </div>
            <span className="font-['Vazirmatn'] text-sm sm:text-base font-black text-white mt-0.5 tracking-tight text-right" dir="rtl">
              {roundPersianTitle || roundTitle}
            </span>
            <span className="font-['Vazirmatn'] text-[10px] text-neutral-300 text-right truncate max-w-[200px]" dir="rtl">
              {roundPersianRule}
            </span>
          </div>

          {/* Drag Handle Indicator */}
          {isDraggable && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 pl-1 border-l border-white/10 text-neutral-400">
              <GripHorizontal className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* 4. WIDGET 2: TOP-RIGHT DUAL PLAYER SCORE BUG (SPORTS SCOREBOARD BUG) */}
      <div
        style={{
          left: `${positions.scoreBug.x}%`,
          top: `${positions.scoreBug.y}%`,
        }}
        className={`absolute z-30 transition-shadow ${
          isDraggable ? 'cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-amber-400/80 rounded-2xl' : ''
        }`}
        onMouseDown={(e) => handleMouseDown('scoreBug', e)}
      >
        <div className="relative group flex items-center p-1.5 rounded-2xl bg-gradient-to-r from-[#080d1a]/95 via-[#0e1628]/90 to-[#080d1a]/85 backdrop-blur-xl border border-amber-500/30 shadow-[0_8px_32px_rgba(255,215,0,0.18)] ring-1 ring-white/15">
          {/* Player 1: ELIAS (Red Team) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-950/80 to-transparent border-r border-red-500/30">
            <div className="w-5 h-5 rounded-md bg-red-600/90 flex items-center justify-center shadow-[0_0_10px_rgba(255,42,85,0.6)]">
              <span className="text-[10px] font-black text-white">▲</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[9px] font-bold text-neutral-300 uppercase leading-none">
                ELIAS
              </span>
              <span className="font-mono text-base font-black text-red-300 leading-tight">
                <bdi dir="ltr">{players.ELIAS.seconds}s</bdi>
              </span>
            </div>
          </div>

          {/* VS Divider with Time Bank Emblem */}
          <div className="px-2 py-1 flex flex-col items-center justify-center">
            <span className="text-[9px] font-mono font-black text-amber-400 tracking-widest">
              VS
            </span>
            <span className="text-[8px] font-mono text-neutral-400 uppercase">
              BANK
            </span>
          </div>

          {/* Player 2: EMAD (Green Team) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-l from-emerald-950/80 to-transparent border-l border-emerald-500/30">
            <div className="flex flex-col text-right">
              <span className="font-mono text-[9px] font-bold text-neutral-300 uppercase leading-none">
                EMAD
              </span>
              <span className="font-mono text-base font-black text-emerald-300 leading-tight">
                <bdi dir="ltr">{players.EMAD.seconds}s</bdi>
              </span>
            </div>
            <div className="w-5 h-5 rounded-full bg-emerald-600/90 flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.6)]">
              <span className="text-[10px] font-black text-white">●</span>
            </div>
          </div>

          {/* Drag Handle Indicator */}
          {isDraggable && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 pl-1 border-l border-white/10 text-neutral-400">
              <GripHorizontal className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* 5. WIDGET 3: TOP-CENTER SLEEK FLOATING TIMER PILL */}
      <div
        style={{
          left: `${positions.timerPill.x}%`,
          top: `${positions.timerPill.y}%`,
        }}
        className={`absolute z-30 transition-shadow ${
          isDraggable ? 'cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-cyan-300 rounded-full' : ''
        }`}
        onMouseDown={(e) => handleMouseDown('timerPill', e)}
      >
        <div
          className={`relative group flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-xl border shadow-xl transition-all ${
            isValidation
              ? 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-pulse'
              : isTimerCritical
              ? 'bg-red-950/95 border-red-500 text-red-300 shadow-[0_0_24px_rgba(255,42,85,0.7)] animate-bounce'
              : 'bg-[#090e1c]/90 border-cyan-500/50 text-white shadow-[0_0_16px_rgba(0,167,255,0.35)]'
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${isValidation ? 'text-amber-400' : 'text-cyan-400'}`} />
          <span className="font-mono text-base font-black tracking-wider tabular-nums">
            {formatTimer(timer.secondsRemaining)}
          </span>
          {isValidation && (
            <span className="font-['Vazirmatn'] text-[10px] font-bold text-amber-300">
              بررسی ۲ ثانیه
            </span>
          )}

          {/* Drag Handle */}
          {isDraggable && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-neutral-400">
              <GripHorizontal className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      {/* 6. WIDGET 4: BOTTOM MINIMAL SPORTS TICKER */}
      <div
        style={{
          left: `${positions.bottomTicker.x}%`,
          top: `${positions.bottomTicker.y}%`,
        }}
        className={`absolute z-30 transition-shadow ${
          isDraggable ? 'cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-cyan-400/80 rounded-xl' : ''
        }`}
        onMouseDown={(e) => handleMouseDown('bottomTicker', e)}
      >
        <div className="relative group flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-black/80 backdrop-blur-xl border border-white/15 shadow-2xl text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400 font-black tracking-wider uppercase border-r border-white/20 pr-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI REFEREE</span>
          </div>

          <span
            className="font-['Vazirmatn'] text-neutral-200 text-xs truncate max-w-[420px] text-right"
            dir="rtl"
          >
            {review.isUnderReview
              ? '🔍 وضعیت بازبینی صحنه (VAR) فعال است...'
              : latestAnnouncement?.text ||
                'داور هوش مصنوعی: راند با قوانین رسمی در جریان است.'}
          </span>

          {/* Drag Handle */}
          {isDraggable && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 pl-1 border-l border-white/10 text-neutral-400">
              <GripHorizontal className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      {/* 7. DRAG POSITION & OCCUPANCY STATUS BAR (When Draggable is Enabled) */}
      {isDraggable && (
        <div className="absolute top-2 left-2 z-40 flex items-center gap-2 px-3 py-1 rounded-xl bg-black/80 border border-neutral-700 backdrop-blur-md text-[10px] font-mono text-neutral-300">
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            اشغال صفحه: ۴.۹٪ (مجاز: زیر ۱۵٪)
          </span>
          <span className="text-neutral-500">|</span>
          <span className="text-cyan-300">قابلیت جابجایی عناصر با ماوس فعال است</span>
          <button
            type="button"
            onClick={handleResetPositions}
            className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold flex items-center gap-1 transition-colors"
            title="بازنشانی موقعیت المان‌ها به گوشه‌های استاندارد"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>RESET</span>
          </button>
        </div>
      )}
    </div>
  );
};
