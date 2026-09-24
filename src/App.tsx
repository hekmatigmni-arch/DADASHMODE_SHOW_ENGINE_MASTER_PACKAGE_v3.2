import React, { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { AudienceDisplayStage } from './components/audience/AudienceDisplayStage';
import { DirectorControlRoomStage } from './components/director/DirectorControlRoomStage';
import { PlayerGameControlsStage } from './components/player/PlayerGameControlsStage';
import { InactiveRuleCard, InactiveLegacyCounter } from './engine/inactiveModules';
import { Monitor, Tv, Gamepad2, Volume2, ShieldCheck } from 'lucide-react';
import { VoiceCenterModal } from './components/director/VoiceCenterModal';
import { OfflineShowTestModal } from './components/director/OfflineShowTestModal';

export type AppView = 'AUDIENCE' | 'DIRECTOR' | 'PLAYERS';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('DIRECTOR');
  const [isVoiceCenterOpen, setIsVoiceCenterOpen] = useState(false);
  const [isOfflineDrillOpen, setIsOfflineDrillOpen] = useState(false);

  const {
    gameState,
    publicBroadcast,
    activeVfx,
    isRehearsalActive,
    setIsRehearsalActive,
    addTime,
    subtractTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setRound,
    applyEpisode,
    nextRound,
    prevRound,
    requestReview,
    resolveReview,
    recordReactionPress,
    triggerManualVfx,
  } = useGameState();

  // Global Keyboard Shortcuts for Showrunners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState.isTimerRunning) {
          pauseTimer();
        } else if (gameState.isTimerPaused) {
          resumeTimer();
        } else {
          startTimer();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        resetTimer();
      } else if (e.key === 'v' || e.key === 'V') {
        if (!gameState.isUnderReview) {
          requestReview('بازبینی کلید میانبر کارگردان');
        } else {
          resolveReview('CONFIRMED');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isTimerRunning, gameState.isTimerPaused, gameState.isUnderReview, pauseTimer, resumeTimer, startTimer, resetTimer, requestReview, resolveReview]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-['Vazirmatn'] selection:bg-amber-500 selection:text-black">
      {/* PERSISTENT STUDIO VIEW SWITCHER HEADER */}
      <nav
        className="w-full bg-neutral-950/90 border-b border-neutral-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 backdrop-blur-xl"
        dir="rtl"
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
          <span className="font-['Chakra_Petch'] font-black tracking-wider text-sm sm:text-base text-white">
            DADASH<span className="text-amber-400">MODE</span> ENGINE
          </span>
          <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline border border-neutral-800 px-2 py-0.5 rounded-full">
            BROADCAST CORE V5
          </span>
        </div>

        {/* 3 Core System Tabs */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-2xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setCurrentView('AUDIENCE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
              currentView === 'AUDIENCE'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>۱. نمایشگر تماشاگر (AUDIENCE)</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('DIRECTOR')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
              currentView === 'DIRECTOR'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg shadow-amber-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>۲. اتاق فرمان کارگردان (DIRECTOR)</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('PLAYERS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition ${
              currentView === 'PLAYERS'
                ? 'bg-gradient-to-r from-red-500 to-emerald-500 text-white shadow-lg shadow-red-500/20'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>۳. کلیدهای الیاس و عماد (PLAYERS)</span>
          </button>
        </div>

        {/* Studio Status Indicators & Tools */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsVoiceCenterOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 font-bold text-[11px] text-cyan-300 transition"
          >
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>مرکز صدا (VOICE CENTER)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOfflineDrillOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 font-bold text-[11px] text-purple-300 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>آزمون آفلاین شو (OFFLINE DRILL)</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-neutral-300">
            <span className={`w-2 h-2 rounded-full ${gameState.isTimerRunning ? 'bg-emerald-400 animate-ping' : 'bg-neutral-500'}`} />
            <span>{gameState.timerSecondsRemaining}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-[11px]">
            <span className="text-red-400 font-bold">▲ {gameState.players.ELIAS.seconds}s</span>
            <span className="text-neutral-600">|</span>
            <span className="text-emerald-400 font-bold">● {gameState.players.EMAD.seconds}s</span>
          </div>
        </div>
      </nav>

      {/* VIEWPORT OUTLET */}
      <main className="flex-1 flex flex-col">
        {currentView === 'AUDIENCE' && (
          <AudienceDisplayStage
            broadcast={publicBroadcast}
            activeVfx={activeVfx}
          />
        )}

        {currentView === 'DIRECTOR' && (
          <DirectorControlRoomStage
            gameState={gameState}
            publicBroadcast={publicBroadcast}
            activeVfx={activeVfx}
            isRehearsalActive={isRehearsalActive}
            onToggleRehearsal={setIsRehearsalActive}
            onStartTimer={startTimer}
            onPauseTimer={pauseTimer}
            onResumeTimer={resumeTimer}
            onResetTimer={resetTimer}
            onNextRound={nextRound}
            onPrevRound={prevRound}
            onSetRound={setRound}
          onApplyEpisode={applyEpisode}
            onAddTime={addTime}
            onSubtractTime={subtractTime}
            onRequestReview={requestReview}
            onResolveReview={resolveReview}
            onTriggerVfx={triggerManualVfx}
          />
        )}

        {currentView === 'PLAYERS' && (
          <PlayerGameControlsStage
            onReactionPress={recordReactionPress}
            eliasSeconds={gameState.players.ELIAS.seconds}
            emadSeconds={gameState.players.EMAD.seconds}
          />
        )}
      </main>

      {/* MODALS */}
      <VoiceCenterModal
        isOpen={isVoiceCenterOpen}
        onClose={() => setIsVoiceCenterOpen(false)}
      />
      <OfflineShowTestModal
        isOpen={isOfflineDrillOpen}
        onClose={() => setIsOfflineDrillOpen(false)}
      />

      {/* INACTIVE OLD MODULES PRESERVATION (Rule Invariant) */}
      <div className="hidden" aria-hidden="true">
        <InactiveRuleCard title="Old Cup Rule" text="Stack 10 cups" />
        <InactiveLegacyCounter label="Old Score" count={0} />
      </div>
    </div>
  );
}
