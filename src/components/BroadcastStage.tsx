import React, { useState } from 'react';
import { PublicBroadcastState, PlayerId } from '../types/game';
import { BroadcastTheme, THEME_OPTIONS } from '../types/theme';
import {
  HudLayoutPositions,
  DEFAULT_HUD_POSITIONS,
  PreviewFootageType,
  SafeAreaGuideSettings,
  DEFAULT_SAFE_GUIDES,
} from '../types/broadcastLayout';
import { RealVideoOverlayHud } from './broadcast/RealVideoOverlayHud';
import { FullScreenGameScene } from './broadcast/FullScreenGameScene';
import { OverlayExportModal } from './broadcast/OverlayExportModal';
import { RefereeHeader } from './broadcast/RefereeHeader';
import { RefereeStateBadge } from './broadcast/RefereeStateBadge';
import { RoundCard } from './broadcast/RoundCard';
import { TimerHero } from './broadcast/TimerHero';
import { PlayerScoreCard } from './broadcast/PlayerScoreCard';
import { RewardHero } from './broadcast/RewardHero';
import { PenaltyHero } from './broadcast/PenaltyHero';
import { SabotageReveal } from './broadcast/SabotageReveal';
import { MysteryReveal } from './broadcast/MysteryReveal';
import { ReviewOverlay } from './broadcast/ReviewOverlay';
import { FinalMode } from './broadcast/FinalMode';
import { WinnerReveal } from './broadcast/WinnerReveal';
import { VisualStageDiagram } from './broadcast/VisualStageDiagram';
import {
  EliasTriangleIcon,
  EmadCircleIcon,
  WinnerIcon,
  SabotageIcon,
  ReviewIcon,
} from './broadcast/GameIcons';
import { VerticalShortsOutput } from './broadcast/VerticalShortsOutput';
import { PhoneCompetitorOutput } from './broadcast/PhoneCompetitorOutput';
import { CinematicVisualEngine } from './visual/CinematicVisualEngine';
import { CinematicAnimationPayload } from '../types/showEngine';
import {
  Monitor,
  Smartphone,
  Eye,
  EyeOff,
  Palette,
  Sparkles,
  Layers,
  ChevronDown,
  Volume2,
  Download,
  Shield,
  Move,
  Lock,
  Zap,
  Image as ImageIcon,
} from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { LogoManagerModal } from './director/LogoManagerModal';

export type BroadcastLayoutMode =
  | 'REAL_VIDEO_OVERLAY'
  | 'FULL_SCREEN_SCENE'
  | 'VERTICAL_SHORTS'
  | 'PHONE_DISPLAY'
  | 'FULL_PORTRAIT'
  | 'COMPACT_OVERLAY'
  | 'CHROMA_KEY';

interface BroadcastStageProps {
  publicState: PublicBroadcastState;
  className?: string;
  isStandalone?: boolean;
  initialMode?: BroadcastLayoutMode;
  initialTheme?: BroadcastTheme;
  positions?: HudLayoutPositions;
  onPositionsChange?: (positions: HudLayoutPositions) => void;
  onStartRecording?: () => void;
  isRecording?: boolean;
  cinematicPayload?: CinematicAnimationPayload | null;
}

export const BroadcastStage: React.FC<BroadcastStageProps> = ({
  publicState,
  className = '',
  isStandalone = false,
  initialMode = 'REAL_VIDEO_OVERLAY',
  initialTheme = 'LIQUID_GLASS',
  positions: propPositions,
  onPositionsChange,
  onStartRecording,
  isRecording = false,
  cinematicPayload,
}) => {
  const [layoutMode, setLayoutMode] = useState<BroadcastLayoutMode>(initialMode);
  const [theme, setTheme] = useState<BroadcastTheme>(initialTheme);
  const [isCleanFeed, setIsCleanFeed] = useState<boolean>(false);
  const [showDiagram, setShowDiagram] = useState<boolean>(true);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);
  const [isGrayscale, setIsGrayscale] = useState<boolean>(false);
  const [previewFootage, setPreviewFootage] = useState<PreviewFootageType>('footage_sim');
  const [customMediaUrl, setCustomMediaUrl] = useState<string | null>(null);
  const [isDraggable, setIsDraggable] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [safeGuides, setSafeGuides] = useState<SafeAreaGuideSettings>(DEFAULT_SAFE_GUIDES);

  // Local positions state fallback
  const [localPositions, setLocalPositions] = useState<HudLayoutPositions>(DEFAULT_HUD_POSITIONS);
  const activePositions = propPositions || localPositions;

  const handlePositionsChange = (newPos: HudLayoutPositions) => {
    if (onPositionsChange) {
      onPositionsChange(newPos);
    } else {
      setLocalPositions(newPos);
    }
  };

  const handleCustomMediaUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setCustomMediaUrl(url);
    setPreviewFootage('custom_upload');
  };

  const {
    showTitle,
    roundNumber,
    totalRounds,
    roundTitle,
    roundPersianTitle,
    roundPersianRule,
    rewardSeconds,
    timer,
    players,
    aiState,
    review,
    winner,
    mysteryBoxes,
    revealedSabotage,
    latestAnnouncement,
  } = publicState;

  const isFinalRound = roundNumber === totalRounds;

  // Determine active event hero state
  const isRewardActive = latestAnnouncement?.type === 'reward';
  const isPenaltyActive = latestAnnouncement?.type === 'penalty';

  // Determine reward/penalty player
  const rewardPlayer: PlayerId = latestAnnouncement?.text?.includes('EMAD') ? 'EMAD' : 'ELIAS';
  const penaltyPlayer: PlayerId = latestAnnouncement?.text?.includes('EMAD') ? 'EMAD' : 'ELIAS';

  const is3dGlass = theme === 'LIQUID_GLASS';
  const isMrBeast = theme === 'MRBEAST';
  const isCapcutBlack = theme === 'CAPCUT_BLACK';
  const isChromaGreen = theme === 'CHROMA_GREEN';

  // Background styling calculation based on theme
  const getBackgroundClass = () => {
    if (layoutMode === 'CHROMA_KEY') return 'bg-[#FF00FF]';
    if (isChromaGreen) return 'bg-[#00FF00]';
    if (isCapcutBlack) return 'bg-[#000000]';
    if (is3dGlass) return 'bg-gradient-to-br from-[#0c0d14] via-[#050608] to-[#0e101a]';
    if (isMrBeast) return 'bg-[#0e0e12]';
    return 'bg-[#070707]';
  };

  // --- 1. REAL VIDEO OVERLAY HUD MODE (1920x1080 Transparent Canvas, Protected Center) ---
  if (layoutMode === 'REAL_VIDEO_OVERLAY') {
    return (
      <div
        id="broadcast-stage-real-overlay"
        className={`w-full h-full min-h-screen flex flex-col items-center justify-center select-none relative overflow-hidden bg-black ${
          isGrayscale ? 'grayscale' : ''
        } ${className}`}
      >
        {/* Top Floating Control Bar (Hidden when clean feed is active) */}
        {!isCleanFeed && (
          <div
            className="absolute top-3 inset-x-3 z-50 flex flex-wrap items-center justify-between p-2 rounded-2xl bg-black/85 border border-neutral-700/80 backdrop-blur-xl text-white shadow-2xl gap-2"
            dir="rtl"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-['Vazirmatn'] font-black text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>اورلی ویدیوی واقعی (HUD Overlay)</span>
              </span>

              {/* Mode switches */}
              <button
                type="button"
                onClick={() => setLayoutMode('FULL_SCREEN_SCENE')}
                className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
              >
                🎬 صحنه کامل
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('VERTICAL_SHORTS')}
                className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
              >
                📱 شورتس ۹:۱۶
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('PHONE_DISPLAY')}
                className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
              >
                📟 مانیتور بازیکن
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('FULL_PORTRAIT')}
                className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
              >
                📱 عمودی ۹:۱۶
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Footage simulation selector */}
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewFootage('footage_sim')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-['Vazirmatn'] ${
                    previewFootage === 'footage_sim' ? 'bg-cyan-500 text-black font-bold' : 'text-neutral-400'
                  }`}
                >
                  راش شبیه‌ساز
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFootage('checkerboard')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-['Vazirmatn'] ${
                    previewFootage === 'checkerboard' ? 'bg-cyan-500 text-black font-bold' : 'text-neutral-400'
                  }`}
                >
                  شفاف آلفا
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFootage('chroma_green')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-['Vazirmatn'] ${
                    previewFootage === 'chroma_green' ? 'bg-[#00FF00] text-black font-bold' : 'text-neutral-400'
                  }`}
                >
                  پرده سبز
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFootage('capcut_black')}
                  className={`px-2 py-0.5 rounded-lg text-xs font-['Vazirmatn'] ${
                    previewFootage === 'capcut_black' ? 'bg-white text-black font-bold' : 'text-neutral-400'
                  }`}
                >
                  مشکی
                </button>
              </div>

              {/* Draggable HUD Toggle */}
              <button
                type="button"
                onClick={() => setIsDraggable(!isDraggable)}
                className={`px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold flex items-center gap-1 transition-all ${
                  isDraggable ? 'bg-amber-400 text-black font-black' : 'bg-neutral-800 text-neutral-300'
                }`}
              >
                {isDraggable ? <Move className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-neutral-400" />}
                <span>{isDraggable ? 'جابجایی فعال' : 'قفل موقعیت'}</span>
              </button>

              {/* Export Presets Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1 rounded-xl text-xs font-['Vazirmatn'] font-black bg-cyan-500 hover:bg-cyan-400 text-black flex items-center gap-1 shadow-md shadow-cyan-500/20 active:scale-95 transition-transform"
              >
                <Download className="w-3.5 h-3.5" />
                <span>خروجی (Export)</span>
              </button>

              {/* Clean feed toggle */}
              <button
                type="button"
                onClick={() => setIsCleanFeed(true)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                title="مخفی کردن منو (کلین فید)"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {isCleanFeed && (
          <button
            type="button"
            onClick={() => setIsCleanFeed(false)}
            className="absolute top-3 left-3 z-50 p-2 rounded-xl bg-black/60 hover:bg-black text-white/50 hover:text-white transition-opacity border border-white/10"
            title="نمایش کنترل‌ها"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}

        {/* 16:9 Canvas Viewport */}
        <div className="w-full aspect-video max-w-[1920px] max-h-screen relative flex items-center justify-center overflow-hidden">
          <RealVideoOverlayHud
            publicState={publicState}
            previewFootage={previewFootage}
            customMediaUrl={customMediaUrl}
            safeGuides={safeGuides}
            positions={activePositions}
            onPositionsChange={handlePositionsChange}
            isDraggable={isDraggable}
            isCleanFeed={isCleanFeed}
            className="w-full h-full"
          />
        </div>

        {/* Export Presets Modal */}
        <OverlayExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          publicState={publicState}
          positions={activePositions}
          onStartWebmAlphaRecord={onStartRecording || (() => {})}
          isRecording={isRecording}
        />

        <LogoManagerModal
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
        />

        {/* Global Cinematic Visual Overlay */}
        <CinematicVisualEngine payload={cinematicPayload} />
      </div>
    );
  }

  // --- 2. FULL SCREEN GAME SCENE MODE (1920x1080 Esports Cutaway Transition) ---
  if (layoutMode === 'FULL_SCREEN_SCENE') {
    return (
      <div
        id="broadcast-stage-fullscreen-scene"
        className={`w-full h-full min-h-screen flex flex-col items-center justify-center select-none relative overflow-hidden bg-[#070a12] ${
          isGrayscale ? 'grayscale' : ''
        } ${className}`}
      >
        {/* Top Control Bar */}
        {!isCleanFeed && (
          <div
            className="absolute top-3 inset-x-3 z-50 flex items-center justify-between p-2 rounded-2xl bg-black/85 border border-neutral-700/80 backdrop-blur-xl text-white shadow-2xl"
            dir="rtl"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-['Vazirmatn'] font-black text-purple-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span>صحنه تمام‌صفحه بازی (OUTPUT 1: GAME SCENE)</span>
              </span>

              {/* Mode switches */}
              <button
                type="button"
                onClick={() => setLayoutMode('REAL_VIDEO_OVERLAY')}
                className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-cyan-500/40 transition-colors"
              >
                📹 اورلی شفاف (HUD)
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('VERTICAL_SHORTS')}
                className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
              >
                📱 شورتس ۹:۱۶
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('PHONE_DISPLAY')}
                className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
              >
                📟 مانیتور بازیکن
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                className="px-3 py-1 rounded-xl text-xs font-['Vazirmatn'] font-black bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 text-cyan-200 flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
                title="مشاهده یا آپلود فایل عکس لوگوی چنل یوتیوب"
              >
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>لوگوی چنل</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="px-3 py-1 rounded-xl text-xs font-['Vazirmatn'] font-black bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1 shadow-md shadow-purple-500/25 active:scale-95 transition-transform"
              >
                <Download className="w-3.5 h-3.5" />
                <span>خروجی (Export)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCleanFeed(true)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                title="مخفی کردن منو (کلین فید)"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {isCleanFeed && (
          <button
            type="button"
            onClick={() => setIsCleanFeed(false)}
            className="absolute top-3 left-3 z-50 p-2 rounded-xl bg-black/60 hover:bg-black text-white/50 hover:text-white transition-opacity border border-white/10"
            title="نمایش کنترل‌ها"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}

        <div className="w-full aspect-video max-w-[1920px] max-h-screen relative flex items-center justify-center overflow-hidden">
          <FullScreenGameScene
            publicState={publicState}
            isCleanFeed={isCleanFeed}
            className="w-full h-full"
          />
        </div>

        <OverlayExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          publicState={publicState}
          positions={activePositions}
          onStartWebmAlphaRecord={onStartRecording || (() => {})}
          isRecording={isRecording}
        />

        <LogoManagerModal
          isOpen={isLogoModalOpen}
          onClose={() => setIsLogoModalOpen(false)}
        />

        {/* Global Cinematic Visual Overlay */}
        <CinematicVisualEngine payload={cinematicPayload} />
      </div>
    );
  }

  // --- 2.1 VERTICAL SHORTS / REELS 9:16 OUTPUT ---
  if (layoutMode === 'VERTICAL_SHORTS') {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-2 sm:p-4 relative">
        {/* Quick Top Switcher */}
        {!isCleanFeed && (
          <div className="fixed top-3 z-50 flex items-center gap-2 p-2 rounded-2xl bg-black/85 border border-neutral-700 backdrop-blur-xl">
            <button
              onClick={() => setLayoutMode('REAL_VIDEO_OVERLAY')}
              className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-neutral-700"
            >
              📹 اورلی افقی ۱۶:۹
            </button>
            <button
              onClick={() => setLayoutMode('PHONE_DISPLAY')}
              className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
            >
              📟 مانیتور بازیکن
            </button>
            <button
              onClick={() => setIsCleanFeed(true)}
              className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        )}

        {isCleanFeed && (
          <button
            onClick={() => setIsCleanFeed(false)}
            className="fixed top-3 left-3 z-50 p-2 rounded-xl bg-black/60 text-white border border-white/10"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        <VerticalShortsOutput publicState={publicState} isCleanFeed={isCleanFeed} />

        {/* Global Cinematic Visual Engine */}
        <CinematicVisualEngine payload={cinematicPayload} />
      </div>
    );
  }

  // --- 2.2 PHONE DISPLAY COMPETITOR-FACING MONITOR ---
  if (layoutMode === 'PHONE_DISPLAY') {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-2 relative">
        {!isCleanFeed && (
          <div className="fixed top-3 z-50 flex items-center gap-2 p-2 rounded-2xl bg-black/85 border border-neutral-700 backdrop-blur-xl">
            <button
              onClick={() => setLayoutMode('REAL_VIDEO_OVERLAY')}
              className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-neutral-700"
            >
              📹 اورلی افقی ۱۶:۹
            </button>
            <button
              onClick={() => setLayoutMode('VERTICAL_SHORTS')}
              className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
            >
              📱 شورتس ۹:۱۶
            </button>
            <button
              onClick={() => setIsCleanFeed(true)}
              className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
        )}

        {isCleanFeed && (
          <button
            onClick={() => setIsCleanFeed(false)}
            className="fixed top-3 left-3 z-50 p-2 rounded-xl bg-black/60 text-white border border-white/10"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        <PhoneCompetitorOutput publicState={publicState} />

        {/* Global Cinematic Visual Engine */}
        <CinematicVisualEngine payload={cinematicPayload} />
      </div>
    );
  }

  // --- 3. COMPACT OVERLAY & CHROMA KEY MODE (Legacy Compact) ---
  if (layoutMode === 'COMPACT_OVERLAY' || layoutMode === 'CHROMA_KEY') {
    const isChroma = layoutMode === 'CHROMA_KEY';

    return (
      <div
        id="broadcast-stage-overlay"
        className={`w-full h-full min-h-[320px] flex flex-col items-center justify-center p-2 select-none relative overflow-hidden ${
          isChroma ? 'bg-[#FF00FF]' : isChromaGreen ? 'bg-[#00FF00]' : 'bg-[#000000]'
        } ${isGrayscale ? 'grayscale' : ''} ${className}`}
        dir="rtl"
      >
        {/* Floating Quick Mode Controls (Hidden in Clean Feed) */}
        {!isCleanFeed && (
          <div className="absolute top-2 left-2 z-50 flex items-center gap-1.5 p-1 rounded-xl bg-black/90 border border-neutral-700 backdrop-blur-md">
            <button
              onClick={() => setLayoutMode('FULL_PORTRAIT')}
              className="px-2 py-1 rounded text-[10px] font-mono font-bold text-neutral-300 hover:text-white"
            >
              9:16 Portrait
            </button>
            <button
              onClick={() => setLayoutMode('COMPACT_OVERLAY')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                layoutMode === 'COMPACT_OVERLAY' ? 'bg-[#FFC400] text-black' : 'text-neutral-300'
              }`}
            >
              Overlay
            </button>
            <button
              onClick={() => setLayoutMode('CHROMA_KEY')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                layoutMode === 'CHROMA_KEY' ? 'bg-[#FF00FF] text-white border border-white' : 'text-neutral-300'
              }`}
            >
              Chroma
            </button>
            <button
              onClick={() => setIsCleanFeed(true)}
              className="p-1 rounded text-neutral-400 hover:text-amber-400"
              title="Clean Broadcast Mode"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Clean feed restore icon */}
        {isCleanFeed && (
          <button
            onClick={() => setIsCleanFeed(false)}
            className="absolute top-2 left-2 z-50 p-1.5 rounded-lg bg-black/40 hover:bg-black text-white/40 hover:text-white transition-opacity"
            title="خروج از حالت کلین فید (نمایش کنترل‌ها)"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* OVERLAY FRAME */}
        <div
          className={`w-full max-w-[560px] h-[300px] max-h-[310px] rounded-3xl p-3 shadow-2xl relative flex flex-col justify-between overflow-hidden ${
            isChroma
              ? 'bg-[#0A0A0A] border-4 border-[#1A1A1A] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] ring-2 ring-black'
              : is3dGlass
              ? 'bg-white/10 border border-white/20 backdrop-blur-2xl ring-1 ring-cyan-400/40 shadow-[0_8px_32px_0_rgba(0,255,255,0.15)]'
              : isMrBeast
              ? 'bg-[#181818] border-4 border-black shadow-[6px_6px_0px_#000]'
              : 'bg-[#0E0E0E]/95 border-2 border-[#262626] backdrop-blur-md'
          }`}
        >
          {/* Top: AI Referee Badge + Round Title */}
          <div className="flex items-center justify-between border-b border-[#222222] pb-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg bg-[#FFC400]/20 border border-[#FFC400]/50 text-[#FFC400] font-mono text-[10px] font-black uppercase">
                ROUND {roundNumber}
              </span>
              <span className="font-['Vazirmatn'] text-xs font-black text-white">
                {roundPersianTitle}
              </span>
            </div>
            <RefereeStateBadge state={aiState} size="sm" compact={true} />
          </div>

          {/* Center Area: Event or Persistent Timer */}
          <div className="flex-1 flex flex-col items-center justify-center my-1 relative">
            {review.isUnderReview ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-[#1F1504] border border-[#FFB000] flex items-center justify-center gap-3">
                <ReviewIcon size={28} color="#FFB000" />
                <div className="flex flex-col text-right">
                  <span className="font-['Vazirmatn'] text-sm font-black text-[#FFB000]">
                    بازبینی رسمی داور (VAR)
                  </span>
                  <span className="font-['Vazirmatn'] text-[11px] text-neutral-300 font-bold">
                    {review.persianReason || 'بررسی اجرای حرکت'}
                  </span>
                </div>
              </div>
            ) : isRewardActive ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-[#241A04] border border-[#FFC400] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WinnerIcon size={28} color="#FFC400" />
                  <span className="font-['Vazirmatn'] text-sm font-black text-white">
                    جایزه راند اعمال شد
                  </span>
                </div>
                <bdi dir="ltr" className="font-mono font-black text-2xl text-[#FFC400]">
                  +{rewardSeconds || 10}s
                </bdi>
              </div>
            ) : isPenaltyActive ? (
              <div className="w-full py-3 px-4 rounded-2xl bg-[#25090B] border border-[#FF3B30] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SabotageIcon size={28} color="#FF3B30" />
                  <span className="font-['Vazirmatn'] text-sm font-black text-white">
                    جریمه کسر زمان
                  </span>
                </div>
                <bdi dir="ltr" className="font-mono font-black text-2xl text-[#FF3B30]">
                  -10s
                </bdi>
              </div>
            ) : (
              <TimerHero timer={timer} size="compact" />
            )}
          </div>

          {/* Bottom Scores: Elias (Left) & Emad (Right) */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
            {/* Elias Score Card */}
            <div className="p-2 rounded-2xl bg-[#140608] border border-[#FF2738]/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <EliasTriangleIcon size={18} color="#FF2738" />
                <span className="font-mono text-xs font-black text-white">ELIAS</span>
              </div>
              <bdi dir="ltr" className="font-mono text-xl font-black text-[#FF2738] tabular-nums">
                {players.ELIAS.seconds}s
              </bdi>
            </div>

            {/* Emad Score Card */}
            <div className="p-2 rounded-2xl bg-[#05140F] border border-[#00C98D]/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <EmadCircleIcon size={18} color="#00C98D" />
                <span className="font-mono text-xs font-black text-white">EMAD</span>
              </div>
              <bdi dir="ltr" className="font-mono text-xl font-black text-[#00C98D] tabular-nums">
                {players.EMAD.seconds}s
              </bdi>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. FULL PORTRAIT BROADCAST (9:16 layout) ---
  return (
    <div
      id="broadcast-stage"
      className={`w-full h-full min-h-[100dvh] max-h-[100dvh] text-white flex flex-col justify-between p-2.5 sm:p-4 select-none relative overflow-hidden ${getBackgroundClass()} ${
        isGrayscale ? 'grayscale' : ''
      } ${className}`}
      dir="rtl"
    >
      {/* 3D Liquid Glass Fluid Mesh Canvas */}
      {is3dGlass && (
        <div className="lg-fluid-canvas">
          <div className="lg-blob lg-blob-cyan" />
          <div className="lg-blob lg-blob-red" />
          <div className="lg-blob lg-blob-green" />
          <div className="lg-blob lg-blob-gold" />
        </div>
      )}

      {/* MrBeast Background Grid Accents */}
      {isMrBeast && (
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#FFE600_1px,transparent_1px)] [background-size:16px_16px] z-0" />
      )}

      {/* TOP BAR: Advanced Theme Switcher & Clean Feed Toggle (Hidden in Clean Mode) */}
      {!isCleanFeed && (
        <div className="relative z-30 mb-1 p-1.5 rounded-2xl bg-[#111111]/90 border border-[#222222] backdrop-blur-md flex flex-wrap items-center justify-between gap-1.5 text-xs font-mono shrink-0">
          {/* Layout Mode Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLayoutMode('FULL_PORTRAIT')}
              className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                layoutMode === 'FULL_PORTRAIT'
                  ? 'bg-[#FFC400] text-black shadow-md'
                  : 'bg-[#1a1a1a] text-neutral-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => setLayoutMode('COMPACT_OVERLAY')}
              className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                (layoutMode as string) === 'COMPACT_OVERLAY'
                  ? 'bg-[#FFC400] text-black shadow-md'
                  : 'bg-[#1a1a1a] text-neutral-300 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Overlay</span>
            </button>
          </div>

          {/* Theme Dropdown / Selector */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-300 font-bold flex items-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-['Vazirmatn'] text-[11px]">
                {THEME_OPTIONS.find((t) => t.id === theme)?.persianName || 'تم پخش'}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isThemeMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-right">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTheme(opt.id);
                      setIsThemeMenuOpen(false);
                      soundEffects.playCardFlipWhoosh();
                    }}
                    className={`w-full p-2 rounded-xl flex items-center justify-between text-right transition-colors ${
                      theme === opt.id
                        ? 'bg-amber-400 text-black font-black'
                        : 'hover:bg-neutral-800 text-neutral-200'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-['Vazirmatn'] text-xs font-bold">{opt.persianName}</span>
                      <span className="text-[9px] opacity-75 font-mono">{opt.name}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/20">
                      {opt.badge}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Diagram & Clean Feed Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setShowDiagram(!showDiagram);
                soundEffects.playCardFlipWhoosh();
              }}
              className={`px-2 py-1 rounded-xl font-bold text-[10px] flex items-center gap-1 ${
                showDiagram ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-neutral-800 text-neutral-400'
              }`}
              title="نمایش/مخفی‌سازی نقشه بصری مرحله"
            >
              <Layers className="w-3 h-3" />
              <span className="font-['Vazirmatn']">نقشه مرحله</span>
            </button>

            <button
              onClick={() => setIsCleanFeed(true)}
              className="px-2 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1"
              title="فعال‌سازی کلین فید (مخفی کردن تمام کنترل‌های ناخواسته)"
            >
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-['Vazirmatn'] text-[11px] font-bold">کلین فید</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Restore Button when in Clean Feed */}
      {isCleanFeed && (
        <button
          onClick={() => setIsCleanFeed(false)}
          className="absolute top-2 left-2 z-50 p-2 rounded-xl bg-black/60 hover:bg-black text-white/50 hover:text-white transition-opacity flex items-center gap-1.5 backdrop-blur-md border border-white/10"
          title="خروج از کلین فید (نمایش منوهای پخش)"
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span className="font-['Vazirmatn'] text-[10px] font-bold">نمایش کنترل‌ها</span>
        </button>
      )}

      {/* TOP: Referee Header */}
      <header className="relative z-10 w-full max-w-xl mx-auto shrink-0">
        <RefereeHeader
          showTitle={showTitle}
          roundNumber={roundNumber}
          totalRounds={totalRounds}
          aiState={aiState}
        />
      </header>

      {/* MAIN: Event-Driven Hero Replacement & Prominent Visual Diagrams */}
      <main className="relative z-10 w-full max-w-xl mx-auto flex-1 flex flex-col justify-center gap-2 sm:gap-2.5 py-1 overflow-y-auto">
        {/* State A: Winner State */}
        {winner && winner !== 'TIE' ? (
          <div className="w-full my-auto flex items-center justify-center">
            <WinnerReveal winnerId={winner} winnerState={players[winner]} />
          </div>
        ) : review.isUnderReview ? (
          /* State B: Review Overlay (VAR) */
          <div className="w-full my-auto flex items-center justify-center">
            <ReviewOverlay review={review} />
          </div>
        ) : isRewardActive ? (
          /* State C: Reward Hero Event */
          <div className="w-full flex flex-col gap-2.5 my-auto">
            <RoundCard
              roundNumber={roundNumber}
              totalRounds={totalRounds}
              title={roundTitle}
              persianTitle={roundPersianTitle}
              persianRule={roundPersianRule}
              rewardSeconds={rewardSeconds}
            />
            <RewardHero
              player={rewardPlayer}
              seconds={rewardSeconds || 10}
              oldScore={players[rewardPlayer].seconds - (rewardSeconds || 10)}
              newScore={players[rewardPlayer].seconds}
              reason={latestAnnouncement?.text}
            />
          </div>
        ) : isPenaltyActive ? (
          /* State D: Penalty Hero Event */
          <div className="w-full flex flex-col gap-2.5 my-auto">
            <RoundCard
              roundNumber={roundNumber}
              totalRounds={totalRounds}
              title={roundTitle}
              persianTitle={roundPersianTitle}
              persianRule={roundPersianRule}
              rewardSeconds={rewardSeconds}
            />
            <PenaltyHero
              player={penaltyPlayer}
              seconds={10}
              oldScore={players[penaltyPlayer].seconds + 10}
              newScore={players[penaltyPlayer].seconds}
              reason={latestAnnouncement?.text}
            />
          </div>
        ) : revealedSabotage ? (
          /* State E: Sabotage Hero Reveal */
          <div className="w-full flex flex-col gap-2.5 my-auto">
            <RoundCard
              roundNumber={roundNumber}
              totalRounds={totalRounds}
              title={roundTitle}
              persianTitle={roundPersianTitle}
              persianRule={roundPersianRule}
              rewardSeconds={rewardSeconds}
            />
            <SabotageReveal sabotage={revealedSabotage} />
          </div>
        ) : isFinalRound ? (
          /* State F: Gold Final Mode Scene */
          <div className="w-full flex flex-col gap-2.5 my-auto">
            <FinalMode elias={players.ELIAS} emad={players.EMAD} round6={publicState.round6} />
            <TimerHero timer={timer} size="large" />
            {showDiagram && (
              <VisualStageDiagram
                roundNumber={roundNumber}
                is3dGlass={is3dGlass}
                isMrBeast={isMrBeast}
              />
            )}
          </div>
        ) : roundNumber === 3 && mysteryBoxes ? (
          /* State G: Mystery Bite Round 3 */
          <div className="w-full flex flex-col gap-2 my-auto">
            <RoundCard
              roundNumber={roundNumber}
              totalRounds={totalRounds}
              title={roundTitle}
              persianTitle={roundPersianTitle}
              persianRule={roundPersianRule}
              rewardSeconds={rewardSeconds}
            />
            <TimerHero timer={timer} size="compact" />
            {showDiagram && (
              <VisualStageDiagram
                roundNumber={roundNumber}
                is3dGlass={is3dGlass}
                isMrBeast={isMrBeast}
              />
            )}
            <MysteryReveal boxes={mysteryBoxes} />
          </div>
        ) : (
          /* State H: Normal Active Round Flow with Visual Stage Diagrams */
          <div className="w-full flex flex-col gap-2 my-auto">
            <RoundCard
              roundNumber={roundNumber}
              totalRounds={totalRounds}
              title={roundTitle}
              persianTitle={roundPersianTitle}
              persianRule={roundPersianRule}
              rewardSeconds={rewardSeconds}
              is3dGlass={is3dGlass}
            />

            <TimerHero timer={timer} size="large" />

            {/* Stage Visual Diagrams: Cup tower, distance lines, relay map, safe/risk */}
            {showDiagram && (
              <VisualStageDiagram
                roundNumber={roundNumber}
                is3dGlass={is3dGlass}
                isMrBeast={isMrBeast}
              />
            )}
          </div>
        )}

        {/* Player Score Cards (Side by side with isolated LTR 20s) */}
        {!isFinalRound && (!winner || winner === 'TIE') && (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 shrink-0 mt-1">
            <PlayerScoreCard
              player={players.ELIAS}
              isWinner={false}
              is3dGlass={is3dGlass}
            />
            <PlayerScoreCard
              player={players.EMAD}
              isWinner={false}
              is3dGlass={is3dGlass}
            />
          </div>
        )}
      </main>

      {/* FOOTER: Minimal single-line status (<32px) */}
      <footer className="relative z-10 w-full max-w-xl mx-auto pt-1 border-t border-[#1a1a1a] flex items-center justify-between text-[10px] font-mono text-neutral-500 shrink-0">
        <span>DADASHMODE TIME BANK</span>
        <span>AI REFEREE BROADCAST ENGINE V8</span>
      </footer>
    </div>
  );
};
