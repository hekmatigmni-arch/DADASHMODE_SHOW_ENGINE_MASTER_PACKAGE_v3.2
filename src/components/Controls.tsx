import { FC } from 'react';
import {
  Play,
  RotateCcw,
  AlertTriangle,
  SkipForward,
  Pause,
  Sliders,
  Sparkles,
  Zap,
  Mic,
  Gift,
  Skull,
} from 'lucide-react';
import { ConnectionStatus } from '../hooks/useGeminiLive';

interface ControlsProps {
  status: ConnectionStatus;
  isTimerRunning: boolean;
  isPaused: boolean;
  isUnderReview: boolean;
  onStartSession: () => void;
  onStartRound: () => void;
  onRequestReview: () => void;
  onNextRound: () => void;
  onTogglePause: () => void;
  onOpenManualOverride: () => void;
  onResetGame: () => void;
  onRollMysteryBox: () => void;
  onDrawSabotage: () => void;
  onSendRefereePrompt: (text: string) => void;
}

export const Controls: FC<ControlsProps> = ({
  status,
  isTimerRunning,
  isPaused,
  isUnderReview,
  onStartSession,
  onStartRound,
  onRequestReview,
  onNextRound,
  onTogglePause,
  onOpenManualOverride,
  onResetGame,
  onRollMysteryBox,
  onDrawSabotage,
  onSendRefereePrompt,
}) => {
  return (
    <section id="game-controls-section" className="w-full flex flex-col gap-2.5">
      {/* 1. START SESSION (Primary Connection & Live AI activation) */}
      <button
        id="btn-start-session"
        type="button"
        onClick={onStartSession}
        className={`w-full py-3.5 px-4 rounded-xl font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl border-2 transition active:scale-98 ${
          status === 'connected'
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
            : status === 'connecting'
            ? 'bg-yellow-500 text-black border-yellow-300 animate-pulse'
            : 'bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 hover:opacity-95 text-white border-white'
        }`}
      >
        <Zap className="w-5 h-5 fill-current" />
        <span>
          {status === 'connected'
            ? '🟢 LIVE CONNECTED • داور هوش مصنوعی فعال'
            : status === 'connecting'
            ? '⏳ CONNECTING... (در حال برقراری اتصال زنده)'
            : '🚀 START SESSION • شروع اتصال داور هوش مصنوعی'}
        </span>
      </button>

      {/* 2-Grid of Key Game Show Actions */}
      <div className="grid grid-cols-2 gap-2">
        {/* START ROUND */}
        <button
          id="btn-start-round"
          type="button"
          disabled={isUnderReview}
          onClick={onStartRound}
          className="py-3 px-3 bg-yellow-400 hover:bg-yellow-300 active:scale-95 disabled:opacity-40 text-black font-black text-sm sm:text-base rounded-xl shadow-lg border-2 border-yellow-200 uppercase tracking-wide flex items-center justify-center gap-2 transition"
        >
          <Play className="w-5 h-5 fill-black" />
          <span>START ROUND</span>
        </button>

        {/* REVIEW (VAR) */}
        <button
          id="btn-request-review"
          type="button"
          onClick={onRequestReview}
          className={`py-3 px-3 rounded-xl font-black text-sm sm:text-base uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg border-2 transition active:scale-95 ${
            isUnderReview
              ? 'bg-yellow-400 text-black border-white animate-bounce shadow-[0_0_25px_rgba(250,204,21,0.9)]'
              : 'bg-red-700 hover:bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
          }`}
        >
          <AlertTriangle className="w-5 h-5 fill-current" />
          <span>{isUnderReview ? 'VAR فعال است' : 'REVIEW • بازبینی'}</span>
        </button>

        {/* NEXT ROUND */}
        <button
          id="btn-next-round"
          type="button"
          onClick={onNextRound}
          className="py-3 px-3 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-black text-sm rounded-xl border-2 border-neutral-600 uppercase tracking-wide flex items-center justify-center gap-2 shadow transition"
        >
          <SkipForward className="w-4 h-4" />
          <span>NEXT ROUND</span>
        </button>

        {/* PAUSE / RESUME */}
        <button
          id="btn-pause-toggle"
          type="button"
          onClick={onTogglePause}
          className={`py-3 px-3 rounded-xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 border-2 shadow transition active:scale-95 ${
            isPaused
              ? 'bg-emerald-700 text-white border-emerald-400'
              : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-600'
          }`}
        >
          <Pause className="w-4 h-4" />
          <span>{isPaused ? 'RESUME • ادامه' : 'PAUSE • مکث'}</span>
        </button>
      </div>

      {/* Randomization Buttons: Mystery Box & Sabotage */}
      <div className="grid grid-cols-2 gap-2">
        <button
          id="btn-mystery-box-trigger"
          type="button"
          onClick={onRollMysteryBox}
          className="py-2.5 px-3 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-yellow-300 font-black text-xs sm:text-sm rounded-xl border-2 border-purple-400 shadow flex items-center justify-center gap-2 transition"
        >
          <Gift className="w-4 h-4 text-yellow-400" />
          <span>جعبه شانس (MYSTERY)</span>
        </button>

        <button
          id="btn-sabotage-trigger"
          type="button"
          onClick={onDrawSabotage}
          className="py-2.5 px-3 bg-gradient-to-r from-orange-800 to-red-800 hover:from-orange-700 hover:to-red-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-orange-400 shadow flex items-center justify-center gap-2 transition"
        >
          <Skull className="w-4 h-4 text-orange-300" />
          <span>خرابکاری (SABOTAGE)</span>
        </button>
      </div>

      {/* Sabotage Pool Info Tag */}
      <div className="flex items-center justify-between text-[10px] text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
        <span className="text-orange-400 font-bold flex items-center gap-1">
          <Skull className="w-3 h-3 text-orange-400 shrink-0" />
          استخر خرابکاری محلی:
        </span>
        <div className="flex items-center gap-1 text-[9.5px] font-mono text-neutral-300">
          <span className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded">BIG GLOVES</span>
          <span>•</span>
          <span className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded">5 SEC DELAY</span>
          <span>•</span>
          <span className="bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded">ONLY 2 ATTEMPTS</span>
        </div>
      </div>

      {/* Quick Referee Persian Prompts */}
      <div className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] text-neutral-400 font-bold px-1">
          <span className="flex items-center gap-1">
            <Mic className="w-3 h-3 text-yellow-400" />
            فرمان سریع صوتی به داور هوش مصنوعی:
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onSendRefereePrompt('داور، برج کی کامل شد؟ ۲ ثانیه ایستادگی رو چک کن!')}
            className="py-1 px-1.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-amber-300 text-[11px] font-bold rounded border border-neutral-700 truncate"
            title="Check tower stability"
          >
            برج کی کامله؟
          </button>
          <button
            type="button"
            onClick={() => onSendRefereePrompt('داور، خطای دست دوم یا افتادن لیوان کی بود؟ بررسی کن.')}
            className="py-1 px-1.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 text-[11px] font-bold rounded border border-neutral-700 truncate"
            title="Ask referee about foul"
          >
            کی خطا کرد؟
          </button>
          <button
            type="button"
            onClick={() => onSendRefereePrompt('داور، وضعیت امتیازات و برنده کیه؟ یک کری کوتاه بنداز!')}
            className="py-1 px-1.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-neutral-200 text-[11px] font-bold rounded border border-neutral-700 truncate"
            title="Ask referee about current standings"
          >
            کی جلوئه داداش؟
          </button>
        </div>
      </div>

      {/* Bottom Secondary Controls: MANUAL OVERRIDE & RESET */}
      <div className="grid grid-cols-2 gap-2 mt-0.5">
        {/* MANUAL OVERRIDE */}
        <button
          id="btn-manual-override"
          type="button"
          onClick={onOpenManualOverride}
          className="py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-yellow-400 font-black text-xs sm:text-sm rounded-xl border-2 border-yellow-500/80 uppercase tracking-wide flex items-center justify-center gap-2 shadow transition"
        >
          <Sliders className="w-4 h-4" />
          <span>MANUAL OVERRIDE</span>
        </button>

        {/* RESET */}
        <button
          id="btn-reset-game"
          type="button"
          onClick={onResetGame}
          className="py-2.5 px-3 bg-neutral-950 hover:bg-red-950 active:scale-95 text-red-400 font-bold text-xs sm:text-sm rounded-xl border border-red-800/80 uppercase tracking-wide flex items-center justify-center gap-1.5 shadow transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RESET GAME</span>
        </button>
      </div>
    </section>
  );
};
