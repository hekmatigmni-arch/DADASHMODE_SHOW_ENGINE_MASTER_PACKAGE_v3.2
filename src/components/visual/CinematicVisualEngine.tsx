import React, { useEffect, useState } from 'react';
import { CinematicAnimationPayload } from '../../types/showEngine';
import { PlayerId } from '../../types/game';
import { soundEffects } from '../../utils/audio';
import { DadashWolfLogo } from '../broadcast/DadashWolfLogo';
import {
  Trophy,
  AlertTriangle,
  Flame,
  Zap,
  ShieldAlert,
  Sparkles,
  Award,
  Clock,
  XCircle,
  TrendingUp,
} from 'lucide-react';

interface CinematicVisualEngineProps {
  payload?: CinematicAnimationPayload | null;
  onAnimationEnd?: () => void;
  className?: string;
}

export const CinematicVisualEngine: React.FC<CinematicVisualEngineProps> = ({
  payload,
  onAnimationEnd,
  className = '',
}) => {
  const [activePayload, setActivePayload] = useState<CinematicAnimationPayload | null>(null);
  const [stageIndex, setStageIndex] = useState<number>(0);

  useEffect(() => {
    if (!payload || payload.type === 'NONE') {
      setActivePayload(null);
      return;
    }

    setActivePayload(payload);
    setStageIndex(0);

    // Audio SFX trigger mapping based on event if specified
    if (payload.soundEffect) {
      if (payload.soundEffect === 'buzzer') soundEffects.playBuzzer();
      else if (payload.soundEffect === 'whistle') soundEffects.playWhistle();
      else if (payload.soundEffect === 'fanfare') soundEffects.playFanfare();
      else if (payload.soundEffect === 'reward') soundEffects.playRewardDing();
      else if (payload.soundEffect === 'penalty') soundEffects.playPenaltySound();
    } else {
      // Default sound triggers for VFX events
      if (payload.type === 'COUNTDOWN') soundEffects.playCountdownBeep(false);
      else if (payload.type === 'FAIL' || payload.type === 'PENALTY') soundEffects.playPenaltySound();
      else if (payload.type === 'WINNER') soundEffects.playFanfare();
      else if (payload.type === 'SCORE_CHANGE' || payload.type === 'BONUS') soundEffects.playRewardDing();
      else if (payload.type === 'ROUND_START') soundEffects.playWhistle();
    }

    const duration = payload.durationMs || (payload.type === 'COUNTDOWN' ? 2800 : 2200);

    // Countdown step timer
    let stepTimer: NodeJS.Timeout | null = null;
    if (payload.type === 'COUNTDOWN') {
      let count = 3;
      stepTimer = setInterval(() => {
        count -= 1;
        setStageIndex((prev) => prev + 1);
        if (count > 0) {
          soundEffects.playCountdownBeep(false);
        } else if (count === 0) {
          soundEffects.playCountdownBeep(true);
        }
        if (count < 0) {
          if (stepTimer) clearInterval(stepTimer);
        }
      }, 700);
    }

    const endTimer = setTimeout(() => {
      setActivePayload(null);
      if (stepTimer) clearInterval(stepTimer);
      if (onAnimationEnd) onAnimationEnd();
    }, duration);

    return () => {
      clearTimeout(endTimer);
      if (stepTimer) clearInterval(stepTimer);
    };
  }, [payload, onAnimationEnd]);

  if (!activePayload) return null;

  const { type, player, value } = activePayload;

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center ${className}`}
    >
      {/* 1. CINEMATIC INTRO ANIMATION */}
      {type === 'INTRO' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-radial from-cyan-500/20 via-transparent to-transparent animate-pulse" />
          <div className="relative flex flex-col items-center gap-3 animate-in zoom-in-75 duration-300 max-w-2xl px-4">
            <DadashWolfLogo variant="full" size="100%" glow={true} showSubtitle={true} animate={true} />
          </div>
        </div>
      )}

      {/* 2. ROUND START ANIMATION */}
      {type === 'ROUND_START' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-radial from-cyan-500/20 via-transparent to-transparent animate-pulse" />
          <div className="relative flex flex-col items-center animate-in zoom-in-50 duration-300">
            <div className="w-28 h-28 rounded-full bg-cyan-500/20 border-4 border-cyan-400 flex items-center justify-center shadow-[0_0_60px_rgba(0,229,255,0.7)] animate-spin-slow">
              <Zap className="w-14 h-14 text-cyan-300 fill-cyan-400" />
            </div>
            <div className="mt-4 px-8 py-2 rounded-2xl bg-black/90 border border-cyan-400/80 shadow-2xl">
              <span className="font-mono text-2xl font-black text-cyan-300 tracking-wider">
                {value ? `ROUND ${value}` : 'ROUND START'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. COUNTDOWN (3 - 2 - 1 - GO) */}
      {type === 'COUNTDOWN' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black/60 backdrop-blur-md">
          {stageIndex < 3 ? (
            <div
              key={stageIndex}
              className="relative flex items-center justify-center animate-in zoom-in-75 duration-200"
            >
              <div className="absolute w-64 h-64 rounded-full border-8 border-amber-400 animate-ping opacity-60" />
              <div className="w-48 h-48 rounded-full bg-black/80 border-4 border-amber-400 flex items-center justify-center shadow-[0_0_80px_rgba(255,196,0,0.8)]">
                <span className="font-mono text-8xl font-black text-amber-300">
                  {3 - stageIndex}
                </span>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center animate-in zoom-in-50 duration-150">
              <div className="absolute w-96 h-96 rounded-full bg-emerald-500/30 animate-ping" />
              <div className="px-12 py-5 rounded-3xl bg-emerald-500 text-black border-4 border-white shadow-[0_0_100px_rgba(0,230,118,1)]">
                <span className="font-mono text-7xl font-black tracking-widest">
                  START!
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. WARNING ANIMATION */}
      {type === 'WARNING' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 border-8 border-amber-500 animate-pulse" />
          <div className="relative p-6 rounded-3xl bg-black/90 border-4 border-amber-400 shadow-[0_0_80px_rgba(255,196,0,0.8)] flex flex-col items-center animate-bounce">
            <AlertTriangle className="w-20 h-20 text-amber-400 fill-amber-400/20" />
            <div className="mt-2 font-mono text-xl font-black text-amber-300 tracking-wider">
              WARNING / احتیاط
            </div>
          </div>
        </div>
      )}

      {/* 5. SCORE CHANGE ANIMATION */}
      {(type === 'SCORE_CHANGE' || (type as string) === 'SCORE_UPDATE') && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative flex flex-col items-center animate-in slide-in-from-bottom-12 zoom-in duration-300">
            <div
              className={`px-10 py-5 rounded-3xl border-4 shadow-2xl flex items-center gap-4 ${
                player === 'ELIAS'
                  ? 'bg-red-950/90 border-red-500 text-red-300 shadow-[0_0_80px_rgba(255,42,85,0.9)]'
                  : 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_80px_rgba(0,230,118,0.9)]'
              }`}
            >
              <TrendingUp className="w-12 h-12 animate-bounce" />
              <div className="flex flex-col items-center">
                <span className="font-mono text-6xl font-black">
                  {value || '+10s'}
                </span>
                <span className="font-['Vazirmatn'] text-xs font-bold text-white/80">
                  {player === 'ELIAS' ? 'تیم قرمز (الیاس)' : 'تیم سبز (عماد)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. FAIL / ERROR ANIMATION */}
      {type === 'FAIL' && (
        <div className="relative w-full h-full flex items-center justify-center bg-red-950/50 backdrop-blur-sm">
          <div className="absolute inset-0 border-[12px] border-red-600 animate-ping opacity-40" />
          <div className="relative p-8 rounded-3xl bg-black/95 border-4 border-red-600 shadow-[0_0_120px_rgba(255,42,85,1)] flex flex-col items-center animate-in zoom-in-75 duration-200">
            <XCircle className="w-24 h-24 text-red-500 fill-red-500/20 animate-pulse" />
            <span className="font-mono text-5xl font-black text-red-500 mt-2 tracking-widest">
              FAIL / شکست
            </span>
            <span className="font-['Vazirmatn'] text-xl font-bold text-red-200 mt-1">
              {player === 'ELIAS' ? 'الیاس ناموفق بود' : player === 'EMAD' ? 'عماد ناموفق بود' : 'تلاش ناموفق'}
            </span>
          </div>
        </div>
      )}

      {/* 7. PENALTY ANIMATION */}
      {type === 'PENALTY' && (
        <div className="relative w-full h-full flex items-center justify-center bg-red-950/40">
          <div className="absolute inset-0 border-[12px] border-red-600 animate-ping opacity-50" />
          <div className="relative p-8 rounded-3xl bg-black/95 border-4 border-red-600 shadow-[0_0_100px_rgba(255,42,85,0.9)] flex flex-col items-center animate-in zoom-in-50 duration-200">
            <ShieldAlert className="w-24 h-24 text-red-500 fill-red-500/20 animate-pulse" />
            <span className="font-mono text-5xl font-black text-red-500 mt-2 tracking-widest">
              FOUL / خطا
            </span>
            {value && (
              <span className="font-mono text-2xl font-bold text-red-300 mt-1">
                {value}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 8. BONUS ANIMATION */}
      {type === 'BONUS' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
          <div className="relative p-8 rounded-3xl bg-black/95 border-4 border-amber-400 shadow-[0_0_100px_rgba(255,196,0,0.9)] flex flex-col items-center animate-in zoom-in-75 duration-200">
            <Award className="w-24 h-24 text-amber-400 fill-amber-400/20" />
            <span className="font-mono text-5xl font-black text-amber-300 mt-2 tracking-wider">
              BONUS REWARD
            </span>
            <span className="font-mono text-3xl font-black text-white mt-1">
              {value || '+15s'}
            </span>
          </div>
        </div>
      )}

      {/* 9. WINNER CELEBRATION */}
      {type === 'WINNER' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent animate-pulse" />
          <div className="relative flex flex-col items-center p-8 rounded-3xl bg-black/95 border-4 border-amber-400 shadow-[0_0_120px_rgba(255,196,0,1)] animate-in zoom-in-75 duration-300">
            <div className="w-28 h-28 rounded-full bg-amber-400/20 border-4 border-amber-400 flex items-center justify-center shadow-[0_0_80px_rgba(255,196,0,0.8)] animate-bounce">
              <Trophy className="w-16 h-16 text-amber-400 fill-amber-400" />
            </div>
            <span className="font-mono text-6xl font-black text-amber-300 mt-4 tracking-widest">
              CHAMPION
            </span>
            <div className="mt-3 px-6 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-['Vazirmatn'] text-xl font-black">
              {player === 'ELIAS' ? '🏆 پیروزی الیاس (تیم قرمز)' : player === 'EMAD' ? '🏆 پیروزی عماد (تیم سبز)' : '🏆 مساوی قهرمانانه!'}
            </div>
          </div>
        </div>
      )}

      {/* 10. TRANSITION WIPE */}
      {type === 'TRANSITION' && (
        <div className="relative w-full h-full flex items-center justify-center bg-black/90 animate-in fade-in duration-150">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_40px_rgba(0,229,255,1)] animate-pulse" />
        </div>
      )}
    </div>
  );
};
