import React, { useState } from 'react';
import { GameState, GameRound } from '../types/game';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { Scoreboard } from './Scoreboard';
import { CameraPreview } from './CameraPreview';
import { TimerDisplay } from './TimerDisplay';
import { Controls } from './Controls';
import { EventLogList } from './EventLogList';
import { VisualStageDiagram } from './broadcast/VisualStageDiagram';
import { soundEffects } from '../utils/audio';
import {
  Radio,
  Sliders,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Tv,
  Layers,
  RotateCcw,
  Eye,
  AlertOctagon,
  Flame,
  History,
  Wrench,
  Video,
  Sparkles,
} from 'lucide-react';
import { RecordingPanel } from './RecordingPanel';
import { useBroadcastRecorder } from '../hooks/useBroadcastRecorder';
import { VoiceSettingsModal, VOICE_RECONNECT_NOTICE } from './director/VoiceSettingsModal';
import { VisualQaSection } from './director/VisualQaSection';
import { OverlayStudioSection } from './director/OverlayStudioSection';
import {
  BroadcastOutputMode,
  HudLayoutPositions,
  DEFAULT_HUD_POSITIONS,
  PreviewFootageType,
  SafeAreaGuideSettings,
  DEFAULT_SAFE_GUIDES,
} from '../types/broadcastLayout';
import { derivePublicBroadcastState } from '../utils/broadcastState';
import { Volume2, AlertTriangle, Monitor } from 'lucide-react';
import {
  CompetitionScenario,
  SmartModulesState,
  ProductionLogEntry,
  CinematicAnimationPayload,
} from '../types/showEngine';
import { BUILT_IN_SCENARIOS, PRESET_SMART_MODULES } from '../data/showScenarios';
import { ShowEngineControlCenter } from './director/ShowEngineControlCenter';
import { ScenarioSelectorModal } from './director/ScenarioSelectorModal';
import { SmartModuleConfigModal } from './director/SmartModuleConfigModal';
import { ProductionLogsModal } from './director/ProductionLogsModal';
import { LongPressExplainerModal, ExplainerContent } from './director/LongPressExplainerModal';
import { CinematicVisualEngine } from './visual/CinematicVisualEngine';
import { VoiceStudioModal } from './director/VoiceStudioModal';
import { DadashWolfLogo } from './broadcast/DadashWolfLogo';
import { LogoManagerModal } from './director/LogoManagerModal';
import { DirectorLiveControlRoom } from './director/DirectorLiveControlRoom';
import { VoiceCueSystemPanel } from './director/VoiceCueSystemPanel';
import { moduleManager } from '../engine/moduleManager';
import { InactiveModulesContainer } from '../engine/inactiveModules';

export type DirectorTheme = 'liquid-glass' | 'mrbeast' | 'original' | 'black' | 'green';

interface DirectorStageProps {
  gameState: GameState;
  currentRound: GameRound;
  rounds: GameRound[];
  actions: any;
  live: ReturnType<typeof useGeminiLive>;
  recorder: ReturnType<typeof useBroadcastRecorder>;
  currentTheme?: DirectorTheme;
  onSelectTheme?: (theme: DirectorTheme) => void;
  onOpenBroadcast: () => void;
  onOpenBroadcastTab: () => void;
  onOpenQa?: () => void;
  onOpenQaTab?: () => void;
  onTriggerReview: () => void;
  onOpenManualOverride: () => void;
  outputMode?: BroadcastOutputMode;
  onOutputModeChange?: (mode: BroadcastOutputMode) => void;
  hudPositions?: HudLayoutPositions;
  onHudPositionsChange?: (positions: HudLayoutPositions) => void;
}

export const DirectorStage: React.FC<DirectorStageProps> = ({
  gameState,
  currentRound,
  rounds,
  actions,
  live,
  recorder,
  currentTheme,
  onSelectTheme,
  onOpenBroadcast,
  onOpenBroadcastTab,
  onOpenQa,
  onOpenQaTab,
  onTriggerReview,
  onOpenManualOverride,
  outputMode,
  onOutputModeChange,
  hudPositions,
  onHudPositionsChange,
}) => {
  // Default to 'liquid-glass' theme as requested
  const [internalTheme, setInternalTheme] = useState<DirectorTheme>('liquid-glass');
  const activeTheme = currentTheme || internalTheme;

  const handleSelectTheme = (t: DirectorTheme) => {
    setInternalTheme(t);
    if (onSelectTheme) onSelectTheme(t);
    soundEffects.playCardFlipWhoosh();
  };

  // Output mode & HUD layout state
  const [internalOutputMode, setInternalOutputMode] = useState<BroadcastOutputMode>('REAL_VIDEO_OVERLAY');
  const activeOutputMode = outputMode || internalOutputMode;

  const handleOutputModeChange = (m: BroadcastOutputMode) => {
    if (onOutputModeChange) onOutputModeChange(m);
    else setInternalOutputMode(m);
  };

  const [internalHudPositions, setInternalHudPositions] = useState<HudLayoutPositions>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dadashmode_hud_positions');
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.warn('Failed to parse saved HUD positions', err);
      }
    }
    return DEFAULT_HUD_POSITIONS;
  });

  const activeHudPositions = hudPositions || internalHudPositions;

  const handleHudPositionsChange = (newPos: HudLayoutPositions) => {
    if (onHudPositionsChange) {
      onHudPositionsChange(newPos);
    } else {
      setInternalHudPositions(newPos);
    }
    try {
      localStorage.setItem('dadashmode_hud_positions', JSON.stringify(newPos));
    } catch {}
  };

  const handleResetHudPositions = () => {
    handleHudPositionsChange(DEFAULT_HUD_POSITIONS);
    try {
      localStorage.removeItem('dadashmode_hud_positions');
    } catch {}
  };

  const [safeGuides, setSafeGuides] = useState<SafeAreaGuideSettings>(DEFAULT_SAFE_GUIDES);
  const [previewFootage, setPreviewFootage] = useState<PreviewFootageType>('footage_sim');
  const [customMediaUrl, setCustomMediaUrl] = useState<string | null>(null);

  const handleCustomMediaUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCustomMediaUrl(url);
    setPreviewFootage('custom_upload');
  };

  // Derive audience-safe public broadcast state for the studio
  const publicBroadcastState = derivePublicBroadcastState(gameState, {
    liveStatus: live.status,
    isMicActive: live.isMicActive,
  });

  // Collapsible sections state: all accessible and organized
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    controlRoom: false,
    voiceEngine: false,
    overlayStudio: false, // Expanded by default so user can preview and drag HUD elements
    session: false,
    recording: false,
    visualQa: false, // VISUAL QA section expanded by default for rapid review
    round: false,
    score: false,
    review: false,
    events: true, // collapsed by default for compactness
    display: false,
    diagnostics: true,
  });

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isVoiceStudioOpen, setIsVoiceStudioOpen] = useState<boolean>(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Show Engine State: Scenario, Smart Modules, Production Logs, and Cinematic Engine
  const [activeScenario, setActiveScenario] = useState<CompetitionScenario>(BUILT_IN_SCENARIOS[0]);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [smartModules, setSmartModules] = useState<SmartModulesState>(PRESET_SMART_MODULES.FULL_TV_BROADCAST);
  const [isSmartModulesModalOpen, setIsSmartModulesModalOpen] = useState<boolean>(false);
  const [productionLogs, setProductionLogs] = useState<ProductionLogEntry[]>([]);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState<boolean>(false);
  const [explainerContent, setExplainerContent] = useState<ExplainerContent | null>(null);
  const [cinematicPayload, setCinematicPayload] = useState<CinematicAnimationPayload | null>(null);

  const handleAddLog = (entry: Omit<ProductionLogEntry, 'id' | 'timestamp' | 'timecode'>) => {
    const now = Date.now();
    const d = new Date(now);
    const tc = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}.${d.getMilliseconds().toString().padStart(3, '0')}`;
    const newLog: ProductionLogEntry = {
      ...entry,
      id: `log_${now}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: now,
      timecode: tc,
    };
    setProductionLogs((prev) => [newLog, ...prev]);
  };

  const handleSelectScenario = (scenario: CompetitionScenario) => {
    setActiveScenario(scenario);
    setIsScenarioModalOpen(false);
    actions.resetGame();
    if (actions.setScore) {
      actions.setScore('ELIAS', scenario.initialPlayerSeconds.ELIAS);
      actions.setScore('EMAD', scenario.initialPlayerSeconds.EMAD);
    }
    handleAddLog({
      roundIndex: 0,
      category: 'SYSTEM',
      actor: 'DIRECTOR',
      persianText: `بارگذاری سناریوی ${scenario.persianName} (${scenario.name})`,
    });
  };

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleToggleMic = () => {
    if (live.isMicActive) {
      live.stopMic();
    } else {
      live.startMic();
    }
  };

  return (
    <div
      id="director-stage"
      className={`w-full flex flex-col space-y-3 font-sans pb-16 relative theme-${activeTheme} transition-all duration-300`}
    >
      {/* 3D Liquid Glass Fluid Mesh Canvas */}
      {activeTheme === 'liquid-glass' && (
        <div className="lg-fluid-canvas">
          <div className="lg-blob lg-blob-cyan" />
          <div className="lg-blob lg-blob-red" />
          <div className="lg-blob lg-blob-green" />
          <div className="lg-blob lg-blob-gold" />
        </div>
      )}

      {/* 1. TOP PROMINENT DIRECTOR HEADER & BROADCAST PREVIEW BUTTON */}
      <div className={`w-full p-3 sm:p-4 flex flex-col gap-3 director-header z-10 ${
        activeTheme === 'liquid-glass' ? 'lg-card glow-cyan' : 'bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="group relative cursor-pointer active:scale-95 transition-transform"
              title="مشاهده، تنظیم یا آپلود لوگوی رسمی چنل یوتیوب"
            >
              <DadashWolfLogo size={42} glow={true} />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-cyan-500 rounded-full border border-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-bold text-black">+</span>
              </div>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white font-['Vazirmatn'] leading-tight">
                  اتاق فرمان مسابقه (DADASHMODE DIRECTOR)
                </h1>
                <span className="px-2 py-0.5 bg-red-600/20 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold rounded">
                  PRIVATE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                DADASHMODE SHOW ENGINE • VOLUMETRIC 3D LIQUID GLASS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-neutral-700/80 text-xs font-mono backdrop-blur-md">
              <span className={`w-2 h-2 rounded-full ${live.status === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="text-neutral-300 uppercase">{live.status}</span>
            </div>
          </div>
        </div>

        {/* PROMINENT BROADCAST ACTION BAR */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-800/80">
          <button
            type="button"
            id="btn-open-broadcast-preview"
            onClick={onOpenBroadcast}
            className={`w-full py-2 px-2.5 uppercase tracking-wider flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
              activeTheme === 'liquid-glass'
                ? 'lg-pill lg-pill-amber'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black rounded-xl shadow-lg active:scale-95'
            }`}
          >
            <Tv className="w-4 h-4 shrink-0" />
            <span>BROADCAST</span>
          </button>

          <button
            type="button"
            id="btn-open-visual-qa-bar"
            onClick={onOpenQa}
            className={`w-full py-2 px-2.5 uppercase tracking-wider flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
              activeTheme === 'liquid-glass'
                ? 'lg-pill lg-pill-purple'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg active:scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>VISUAL QA</span>
          </button>

          <button
            type="button"
            id="btn-open-broadcast-tab"
            onClick={onOpenBroadcastTab}
            className={`w-full py-2 px-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${
              activeTheme === 'liquid-glass'
                ? 'lg-pill lg-pill-cyan'
                : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded-xl'
            }`}
          >
            <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
            <span>تماشاگران (/broadcast)</span>
          </button>

          <button
            type="button"
            id="btn-voice-settings"
            onClick={() => setIsVoiceModalOpen(true)}
            className={`w-full py-2 px-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${
              activeTheme === 'liquid-glass'
                ? 'lg-pill'
                : 'bg-neutral-800 hover:bg-neutral-700 border border-amber-500/40 text-amber-300 rounded-xl'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>تنظیمات صدا ({live.selectedVoice || 'Kore'})</span>
          </button>
        </div>

        {/* 2. DEDICATED PROMINENT THEME SWITCHER TOOLBAR IN DIRECTORSTAGE HEADER */}
        <div className="w-full pt-2 border-t border-neutral-800/80 flex flex-col gap-1.5" dir="rtl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-['Vazirmatn'] font-black text-amber-300 flex items-center gap-1.5">
              <span>🎨</span>
              <span>پوسته مسابقه:</span>
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 uppercase font-black tracking-wide shadow-sm">
              {activeTheme === 'liquid-glass' ? '💎 3D LIQUID GLASS (V11)' : activeTheme.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {/* Button 1: Liquid Glass */}
            <button
              type="button"
              id="theme-btn-liquid-glass"
              onClick={() => handleSelectTheme('liquid-glass')}
              className={`p-2 rounded-2xl text-center flex items-center justify-center gap-1.5 transition-all text-xs font-['Vazirmatn'] font-black ${
                activeTheme === 'liquid-glass'
                  ? 'theme-btn-active bg-cyan-950/90 border-2 border-cyan-400 text-white shadow-[0_0_24px_rgba(0,167,255,0.9)] ring-2 ring-cyan-300 scale-[1.02]'
                  : 'bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-300'
              }`}
            >
              <span>💎</span>
              <span className="truncate">شیشه مایع (Liquid Glass)</span>
            </button>

            {/* Button 2: MrBeast Style */}
            <button
              type="button"
              id="theme-btn-mrbeast"
              onClick={() => handleSelectTheme('mrbeast')}
              className={`p-2 rounded-2xl text-center flex items-center justify-center gap-1.5 transition-all text-xs font-['Vazirmatn'] font-black ${
                activeTheme === 'mrbeast'
                  ? 'theme-btn-active bg-yellow-400 text-black border-4 border-black shadow-[4px_4px_0px_#000] ring-2 ring-yellow-400 scale-[1.02]'
                  : 'bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-300'
              }`}
            >
              <span>⚡</span>
              <span className="truncate">مستربیس (MrBeast Style)</span>
            </button>

            {/* Button 3: Original */}
            <button
              type="button"
              id="theme-btn-original"
              onClick={() => handleSelectTheme('original')}
              className={`p-2 rounded-2xl text-center flex items-center justify-center gap-1.5 transition-all text-xs font-['Vazirmatn'] font-black ${
                activeTheme === 'original'
                  ? 'theme-btn-active bg-amber-500/30 border-2 border-amber-400 text-amber-300 shadow-[0_0_16px_rgba(255,196,0,0.8)] ring-2 ring-amber-400 scale-[1.02]'
                  : 'bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-300'
              }`}
            >
              <span>🎮</span>
              <span className="truncate">تم اورجینال (Original)</span>
            </button>

            {/* Button 4: CapCut Black */}
            <button
              type="button"
              id="theme-btn-black"
              onClick={() => handleSelectTheme('black')}
              className={`p-2 rounded-2xl text-center flex items-center justify-center gap-1.5 transition-all text-xs font-['Vazirmatn'] font-black ${
                activeTheme === 'black'
                  ? 'theme-btn-active bg-black border-2 border-white text-white shadow-[0_0_16px_rgba(255,255,255,0.8)] ring-2 ring-white scale-[1.02]'
                  : 'bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-300'
              }`}
            >
              <span>⬛</span>
              <span className="truncate">مشکی خالص (CapCut)</span>
            </button>

            {/* Button 5: Chroma Green */}
            <button
              type="button"
              id="theme-btn-green"
              onClick={() => handleSelectTheme('green')}
              className={`p-2 rounded-2xl text-center flex items-center justify-center gap-1.5 transition-all text-xs font-['Vazirmatn'] font-black ${
                activeTheme === 'green'
                  ? 'theme-btn-active bg-black border-2 border-[#00FF00] text-[#00FF00] shadow-[0_0_18px_rgba(0,255,0,0.9)] ring-2 ring-[#00FF00] scale-[1.02]'
                  : 'bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-300'
              }`}
            >
              <span>🟩</span>
              <span className="truncate">سبز کروماکی</span>
            </button>
          </div>
        </div>

        {/* Informational banner when voice is updated while Live session is active */}
        {voiceNotice && (
          <div className="w-full p-2.5 bg-amber-950/40 border border-amber-500/50 rounded-xl flex items-center justify-between gap-2 text-amber-200 text-xs font-['Vazirmatn'] font-bold">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{voiceNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setVoiceNotice(null)}
              className="px-2 py-0.5 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-300 text-[10px]"
            >
              بستن
            </button>
          </div>
        )}
      </div>

      {/* 1. DADASHMODE SHOW ENGINE - DIRECTOR CONTROL ROOM & LIVE OUTPUT PREVIEW */}
      <section className="director-card">
        <DirectorLiveControlRoom
          gameState={gameState}
          currentRound={currentRound}
          publicState={publicBroadcastState}
          onStartTimer={actions.startTimer}
          onStopTimer={actions.stopTimer}
          onTogglePause={() => (gameState.isPaused ? actions.resumeGame() : actions.pauseGame())}
          onResetRound={() => {
            actions.stopTimer();
            actions.setRound(gameState.currentRoundIndex);
          }}
          onNextStageOrRound={() => {
            if (gameState.currentRoundIndex === 5 && gameState.round6 && gameState.round6.currentStage < 4) {
              actions.advanceFinalStage(gameState.round6.currentStage + 1);
            } else {
              actions.nextRound();
            }
          }}
          onTriggerCinematic={(payload) => setCinematicPayload(payload)}
          onAddJournalLog={(category, text) => {
            handleAddLog({
              roundIndex: currentRound.number - 1,
              category: category as any,
              actor: 'DIRECTOR',
              persianText: text,
            });
          }}
        />
      </section>

      {/* 2. DADASHMODE REAL VOICE CUE ENGINE PANEL */}
      <section className="bg-neutral-900/90 border border-amber-500/40 rounded-2xl overflow-hidden shadow-xl director-card">
        <button
          type="button"
          onClick={() => toggleSection('voiceEngine')}
          className="w-full px-4 py-2.5 bg-neutral-800/80 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold text-amber-400 uppercase">[VOICE ENGINE]</span>
            <span className="font-['Vazirmatn'] text-white">موتور اعلام صوتی زنانه مسابقه (اسکریپت، صدا و پخش در شو)</span>
          </div>
          {collapsedSections.voiceEngine ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.voiceEngine && (
          <div className="p-3 sm:p-4">
            <VoiceCueSystemPanel
              onPlayDuringShow={(cue) => {
                handleAddLog({
                  roundIndex: currentRound.number - 1,
                  category: 'VOICE',
                  actor: 'REFEREE',
                  persianText: `اجرای زنده اسکریپت صوتی: «${cue.persianText}» (${cue.voiceName})`,
                });
              }}
            />
          </div>
        )}
      </section>

      {/* DADASHMODE SHOW ENGINE PRODUCTION CONTROL CENTER */}
      <ShowEngineControlCenter
        activeScenario={activeScenario}
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
        onOpenModulesModal={() => setIsSmartModulesModalOpen(true)}
        onOpenLogsModal={() => setIsLogsModalOpen(true)}
        onOpenVoiceStudio={() => setIsVoiceStudioOpen(true)}
        onOpenLogoManager={() => setIsLogoModalOpen(true)}
        onTriggerCinematic={(payload) => setCinematicPayload(payload)}
        onExplainerRequest={(content) => setExplainerContent(content)}
        onAddLog={handleAddLog}
        currentRoundIndex={currentRound.number - 1}
      />

      {/* 2. SECTION: 16:9 OVERLAY & GAME SCENE STUDIO (New Output Architecture) */}
      <section className="bg-neutral-900/90 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-xl director-card">
        <button
          type="button"
          onClick={() => toggleSection('overlayStudio')}
          className="w-full px-4 py-2.5 bg-neutral-800/80 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-bold text-cyan-400 uppercase">[16:9 OVERLAY STUDIO]</span>
            <span className="font-['Vazirmatn'] text-white">استودیوی خروجی ۱۹۲۰x۱۰۸۰ (اورلی شفاف و صحنه کامل)</span>
          </div>
          {collapsedSections.overlayStudio ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.overlayStudio && (
          <div className="p-3 sm:p-4">
            <OverlayStudioSection
              publicState={publicBroadcastState}
              outputMode={activeOutputMode}
              onOutputModeChange={handleOutputModeChange}
              hudPositions={activeHudPositions}
              onHudPositionsChange={handleHudPositionsChange}
              onResetHudPositions={handleResetHudPositions}
              safeGuides={safeGuides}
              onSafeGuidesChange={setSafeGuides}
              previewFootage={previewFootage}
              onPreviewFootageChange={setPreviewFootage}
              customMediaUrl={customMediaUrl}
              onCustomMediaUpload={handleCustomMediaUpload}
              onStartRecording={recorder.startRecording}
              isRecording={recorder.recorderState === 'recording'}
              onOpenBroadcast={onOpenBroadcast}
            />
          </div>
        )}
      </section>

      {/* 3. SECTION: SESSION (Camera Preview & Gemini Live Controls) */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg director-card">
        <button
          type="button"
          onClick={() => toggleSection('session')}
          className="w-full px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase">[1. SESSION]</span>
            <span className="font-['Vazirmatn']">ارتباط هوش مصنوعی و دوربین زنده</span>
          </div>
          {collapsedSections.session ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.session && (
          <div className="p-3 sm:p-4 space-y-3">
            <CameraPreview
              videoRef={live.videoRef}
              canvasRef={live.canvasRef}
              isCameraActive={live.isCameraActive}
              isMicActive={live.isMicActive}
              status={live.status}
              facingMode={live.facingMode}
              isUnderReview={gameState.review.isUnderReview}
              onToggleCamera={live.toggleFacingMode}
              onToggleMic={handleToggleMic}
              onStartSession={live.startSession}
            />
          </div>
        )}
      </section>

      {/* 2. SECTION: RECORDING (Clean Internal Broadcast Recorder - Phase 1B) */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg director-card">
        <button
          type="button"
          onClick={() => toggleSection('recording')}
          className="w-full px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-red-400" />
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase">[RECORDER]</span>
            <span className="font-['Vazirmatn']">ضبط داخلی برودکست (بدون کنترل‌های فرمان)</span>
          </div>
          {collapsedSections.recording ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.recording && (
          <div className="p-3 sm:p-4">
            <RecordingPanel
              recorderState={recorder.recorderState}
              activePresetId={recorder.activePresetId}
              onSelectPreset={recorder.setActivePreset}
              elapsedSeconds={recorder.elapsedSeconds}
              recordedBytes={recorder.recordedBytes}
              isOpfsActive={recorder.isOpfsActive}
              hasRecordedFile={recorder.hasRecordedFile}
              performanceWarning={recorder.performanceWarning}
              visibilityWarning={recorder.visibilityWarning}
              onDismissVisibilityWarning={recorder.dismissVisibilityWarning}
              onStartRecording={recorder.startRecording}
              onStopRecording={recorder.stopRecording}
              onDownloadRecording={recorder.downloadRecording}
              onDownloadEventsSidecar={recorder.downloadEventsSidecar}
            />
          </div>
        )}
      </section>

      {/* SECTION: VISUAL QA (Development Visual QA Gallery & Screenshot Presets) */}
      <section className="bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-950 border-2 border-purple-500/40 rounded-2xl overflow-hidden shadow-xl director-card">
        <button
          type="button"
          id="toggle-section-visual-qa"
          onClick={() => toggleSection('visualQa')}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-950/50 via-neutral-900 to-indigo-950/50 hover:bg-purple-900/30 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-purple-500/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-mono text-xs font-black text-amber-300 uppercase tracking-wider">[VISUAL QA]</span>
            <span className="font-['Vazirmatn'] text-white">گالری ارزیابی بصری برودکست و اسکرین‌شات</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-400/40 uppercase">
              12 MOCK STATES
            </span>
            {collapsedSections.visualQa ? <ChevronDown className="w-4 h-4 text-purple-300" /> : <ChevronUp className="w-4 h-4 text-purple-300" />}
          </div>
        </button>

        {!collapsedSections.visualQa && (
          <div className="p-3 sm:p-4">
            <VisualQaSection
              onOpenQaTab={onOpenQaTab || onOpenBroadcastTab}
              onNavigateToQa={onOpenQa || onOpenBroadcast}
            />
          </div>
        )}
      </section>

      {/* 3. SECTION: ROUND (Round Management & Time Bank Challenges) */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg director-card">
        <button
          type="button"
          onClick={() => toggleSection('round')}
          className="w-full px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase">[2. ROUND]</span>
            <span className="font-['Vazirmatn']">مدیریت راندها و چالش‌ها (راند {gameState.currentRoundIndex + 1})</span>
          </div>
          {collapsedSections.round ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.round && (
          <div className="p-3 sm:p-4 space-y-3">
            {/* Quick Round Navigation */}
            <div className="w-full flex items-center justify-between gap-1 p-1.5 bg-black/60 rounded-xl border border-neutral-800 overflow-x-auto">
              {rounds.map((r, idx) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => actions.setRound(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all shrink-0 ${
                    gameState.currentRoundIndex === idx
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  R{idx + 1}: {r.title.slice(0, 10)}
                </button>
              ))}
            </div>

            {/* 4. EMBEDDED VISUAL STAGE DIAGRAM FOR ACTIVE ROUND */}
            <div className="w-full my-2 bg-black/40 rounded-2xl p-2 border border-white/10">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-['Vazirmatn'] text-xs font-black text-white">
                    راهنما و نقشه بصری صحنه: {currentRound.persianTitle} (راند {gameState.currentRoundIndex + 1})
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 border border-neutral-700 text-cyan-300">
                  {currentRound.title}
                </span>
              </div>
              <VisualStageDiagram
                roundNumber={gameState.currentRoundIndex + 1}
                is3dGlass={activeTheme === 'liquid-glass'}
                isMrBeast={activeTheme === 'mrbeast'}
                activeChoice={
                  gameState.currentRoundIndex === 1
                    ? (gameState.round2?.ELIAS?.choice || gameState.round2?.EMAD?.choice || null)
                    : null
                }
                activeSabotageId={gameState.activeSabotage?.id || null}
              />
            </div>

            {/* Timer Display Component */}
            <TimerDisplay
              secondsRemaining={gameState.timerSecondsRemaining}
              initialSeconds={gameState.initialTimerSeconds}
              isRunning={gameState.isTimerRunning}
              isPaused={gameState.isPaused}
              currentRound={currentRound}
              isUnderReview={gameState.review.isUnderReview}
              validation={gameState.validation}
              round2={gameState.round2}
              round3={gameState.round3}
              round4={gameState.round4}
              round5={gameState.round5}
              round6={gameState.round6}
              onStartTimer={actions.startTimer}
              onStopTimer={actions.stopTimer}
              onTogglePause={() => (gameState.isPaused ? actions.resumeGame() : actions.pauseGame())}
              onStartValidation={actions.startValidationTimer}
              onCancelValidation={actions.cancelValidation}
              onCallFoul={actions.callFoul}
              onLockChoice={actions.lockChoice}
              onRecordBasket={actions.recordBasketAttempt}
              onRequestReview={(reason) => {
                const snapshot = live.captureSnapshot();
                actions.requestReview(reason, snapshot);
              }}
              onResetRound2={actions.resetRound2Player}
              onLockMysteryBite={actions.lockMysteryBiteBox}
              onRevealMysteryBite={actions.revealMysteryBiteBox}
              onResetRound3={actions.resetRound3}
              onAdvanceRound4Stage={actions.advanceRound4Stage}
              onResetRound4={actions.resetRound4}
              onLockRound5Choice={actions.lockRound5Choice}
              onRecordRound5Result={actions.recordRound5Result}
              onResetRound5={actions.resetRound5}
              onAdvanceFinalStage={actions.advanceFinalStage}
              onIssueCode={actions.issueCode}
              onUnlockCase={actions.unlockCase}
            />

            {/* Dedicated Challenge Controls Component */}
            <Controls
              status={live.status}
              isTimerRunning={gameState.isTimerRunning}
              isPaused={gameState.isPaused}
              isUnderReview={gameState.review.isUnderReview}
              onStartSession={live.startSession}
              onStartRound={() => actions.startRound(currentRound.id)}
              onRequestReview={onTriggerReview}
              onNextRound={actions.nextRound}
              onTogglePause={() => (gameState.isPaused ? actions.resumeGame() : actions.pauseGame())}
              onOpenManualOverride={onOpenManualOverride}
              onResetGame={actions.resetGame}
              onRollMysteryBox={actions.randomMysteryBox}
              onDrawSabotage={() => actions.drawSabotage()}
              onSendRefereePrompt={live.sendRefereePrompt}
            />
          </div>
        )}
      </section>

      {/* 4. SECTION: SCORE (Elias & Emad Bank Controls) */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg director-card">
        <button
          type="button"
          onClick={() => toggleSection('score')}
          className="w-full px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase">[3. SCORE]</span>
            <span className="font-['Vazirmatn']">بانک زمان بازیکنان (الیاس: {gameState.players.ELIAS.seconds}s | عماد: {gameState.players.EMAD.seconds}s)</span>
          </div>
          {collapsedSections.score ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.score && (
          <div className="p-3 sm:p-4 space-y-3">
            <Scoreboard
              elias={gameState.players.ELIAS}
              emad={gameState.players.EMAD}
              isUnderReview={gameState.review.isUnderReview}
              onQuickAdd={actions.addTime}
              onQuickSub={actions.subtractTime}
            />

            {/* Quick Undo and Balance Controls */}
            <div className="flex items-center justify-between gap-2 p-2 bg-black/60 rounded-xl border border-neutral-800">
              <button
                type="button"
                onClick={actions.undo}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>UNDO LAST SCORE ACTION</span>
              </button>

              <div className="text-[11px] font-mono text-neutral-400">
                DIFF: <span className="text-white font-bold">{Math.abs(gameState.players.ELIAS.seconds - gameState.players.EMAD.seconds)}s</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. SECTION: REVIEW (VAR & Snapshot Decision) */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg director-card">
        <button
          type="button"
          onClick={() => toggleSection('review')}
          className="w-full px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase">[4. REVIEW]</span>
            <span className="font-['Vazirmatn']">سیستم بازبینی ویدیویی (VAR)</span>
          </div>
          {collapsedSections.review ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.review && (
          <div className="p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-300 font-['Vazirmatn']">
                {gameState.review.isUnderReview
                  ? '⚠️ وضعیت بازبینی فعال است (امتیازها قفل موقت)'
                  : 'هیچ بازبینی فعالی در جریان نیست'}
              </span>

              <button
                type="button"
                onClick={onTriggerReview}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl flex items-center gap-1.5 shadow"
              >
                <Eye className="w-4 h-4" />
                <span>ثبت درخواست بازبینی فوری (VAR)</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 6. SECTION: EVENTS (Game Action Log) */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg director-card">
        <button
          type="button"
          onClick={() => toggleSection('events')}
          className="w-full px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-400" />
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase">[5. EVENTS]</span>
            <span className="font-['Vazirmatn']">لاگ رخدادهای رسمی ({gameState.events.length} رویداد)</span>
          </div>
          {collapsedSections.events ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.events && (
          <div className="p-3 sm:p-4">
            <EventLogList events={gameState.events} />
          </div>
        )}
      </section>

      {/* 7. SECTION: DISPLAY (Broadcast View Configuration) */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg director-card">
        <button
          type="button"
          onClick={() => toggleSection('display')}
          className="w-full px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-purple-400" />
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase">[6. DISPLAY]</span>
            <span className="font-['Vazirmatn']">تنظیمات نمایش و تماشاگران</span>
          </div>
          {collapsedSections.display ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.display && (
          <div className="p-3 sm:p-4 space-y-2">
            <div className="flex items-center justify-between p-2 bg-black/60 rounded-xl border border-neutral-800 text-xs">
              <span className="text-neutral-300 font-['Vazirmatn']">پیش‌نمایش خروجی تماشاگران در همین صفحه:</span>
              <button
                type="button"
                onClick={onOpenBroadcast}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-mono font-bold"
              >
                SWITCH TO BROADCAST VIEW
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 8. SECTION: DIAGNOSTICS (Manual Override & Dev Controls) */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg director-card">
        <button
          type="button"
          onClick={() => toggleSection('diagnostics')}
          className="w-full px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 flex items-center justify-between text-right font-bold text-sm text-neutral-200 border-b border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-yellow-500" />
            <span className="font-mono text-xs font-bold text-neutral-400 uppercase">[7. DIAGNOSTICS]</span>
            <span className="font-['Vazirmatn']">ابزارهای اضطراری و دیباگ</span>
          </div>
          {collapsedSections.diagnostics ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        {!collapsedSections.diagnostics && (
          <div className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onOpenManualOverride}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>MANUAL OVERRIDE MODAL</span>
            </button>

            <button
              type="button"
              onClick={actions.resetGame}
              className="px-3 py-2 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET GAME STATE</span>
            </button>
          </div>
        )}
      </section>

      {/* Voice Settings Modal (Phase 2 Director Voice Panel) */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentVoice={live.selectedVoice || 'Kore'}
        onSelectVoice={(voice) => {
          const prevVoice = live.selectedVoice;
          live.setSelectedVoice(voice);
          if (live.status === 'connected' && prevVoice !== voice) {
            setVoiceNotice(VOICE_RECONNECT_NOTICE);
          }
        }}
        isLiveConnected={live.status === 'connected'}
      />

      {/* Voice Studio Modal (Persian Female AI Voice Engine) */}
      <VoiceStudioModal
        isOpen={isVoiceStudioOpen}
        onClose={() => setIsVoiceStudioOpen(false)}
        onCueTriggered={(cue) => {
          handleAddLog({
            roundIndex: currentRound.number - 1,
            category: 'VOICE',
            actor: 'REFEREE',
            persianText: `اجرای فرمان صوتی زنانه: «${cue.persianText}»`,
          });
        }}
      />

      {/* Show Engine Modals */}
      <ScenarioSelectorModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        scenarios={BUILT_IN_SCENARIOS}
        activeScenarioId={activeScenario.id}
        onSelectScenario={handleSelectScenario}
      />

      <SmartModuleConfigModal
        isOpen={isSmartModulesModalOpen}
        onClose={() => setIsSmartModulesModalOpen(false)}
        modules={smartModules}
        onChangeModules={setSmartModules}
      />

      {/* Inactive Legacy Modules (Preserved, Disabled by Default) */}
      <InactiveModulesContainer isVisible={moduleManager.isModuleActive('old_screens')}>
        <ProductionLogsModal
          isOpen={isLogsModalOpen && moduleManager.isModuleActive('old_screens')}
          onClose={() => setIsLogsModalOpen(false)}
          logs={productionLogs}
          onClearLogs={() => setProductionLogs([])}
        />
      </InactiveModulesContainer>

      <InactiveModulesContainer isVisible={moduleManager.isModuleActive('old_text_explainer')}>
        <LongPressExplainerModal
          isOpen={!!explainerContent && moduleManager.isModuleActive('old_text_explainer')}
          onClose={() => setExplainerContent(null)}
          content={explainerContent}
        />
      </InactiveModulesContainer>

      <LogoManagerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      {/* Live Preview Cinematic Visual Overlay in Director View */}
      <CinematicVisualEngine
        payload={cinematicPayload}
        onAnimationEnd={() => setCinematicPayload(null)}
      />
    </div>
  );
};

