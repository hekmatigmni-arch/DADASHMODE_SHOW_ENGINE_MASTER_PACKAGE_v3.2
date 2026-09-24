import React, { useState } from 'react';
import {
  Film,
  Tv,
  Move,
  Lock,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  Layers,
  Upload,
  CheckCircle2,
  Sparkles,
  Shield,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { PublicBroadcastState } from '../../types/game';
import {
  BroadcastOutputMode,
  PreviewFootageType,
  HudLayoutPositions,
  DEFAULT_HUD_POSITIONS,
  SafeAreaGuideSettings,
  DEFAULT_SAFE_GUIDES,
} from '../../types/broadcastLayout';
import { RealVideoOverlayHud } from '../broadcast/RealVideoOverlayHud';
import { FullScreenGameScene } from '../broadcast/FullScreenGameScene';
import { OverlayExportModal } from '../broadcast/OverlayExportModal';

interface OverlayStudioSectionProps {
  publicState: PublicBroadcastState;
  outputMode: BroadcastOutputMode;
  onOutputModeChange: (mode: BroadcastOutputMode) => void;
  hudPositions: HudLayoutPositions;
  onHudPositionsChange: (positions: HudLayoutPositions) => void;
  onResetHudPositions: () => void;
  safeGuides: SafeAreaGuideSettings;
  onSafeGuidesChange: (guides: SafeAreaGuideSettings) => void;
  previewFootage: PreviewFootageType;
  onPreviewFootageChange: (type: PreviewFootageType) => void;
  customMediaUrl: string | null;
  onCustomMediaUpload: (file: File) => void;
  onStartRecording: () => void;
  isRecording: boolean;
  onOpenBroadcast: () => void;
}

export const OverlayStudioSection: React.FC<OverlayStudioSectionProps> = ({
  publicState,
  outputMode,
  onOutputModeChange,
  hudPositions,
  onHudPositionsChange,
  onResetHudPositions,
  safeGuides,
  onSafeGuidesChange,
  previewFootage,
  onPreviewFootageChange,
  customMediaUrl,
  onCustomMediaUpload,
  onStartRecording,
  isRecording,
  onOpenBroadcast,
}) => {
  const [isDraggable, setIsDraggable] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isGuidesMenuOpen, setIsGuidesMenuOpen] = useState<boolean>(false);

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCustomMediaUpload(e.target.files[0]);
    }
  };

  // Safe area toggles
  const toggleSafeGuide = (key: keyof SafeAreaGuideSettings) => {
    onSafeGuidesChange({
      ...safeGuides,
      [key]: !safeGuides[key],
    });
  };

  return (
    <div className="w-full flex flex-col gap-3 font-sans" dir="rtl">
      {/* 1. DUAL 16:9 OUTPUT MODE SELECTOR */}
      <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-xl flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-['Vazirmatn'] text-sm font-black text-white">
                انتخاب حالت خروجی ۱۶:۹ (Dual Output Architecture)
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                OUTPUT 1 (CUTAWAY SCENE) vs OUTPUT 2 (TRANSPARENT HUD OVERLAY)
              </p>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold">
            1920x1080 60FPS
          </div>
        </div>

        {/* 2 Big Mode Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Output 2: REAL VIDEO OVERLAY HUD */}
          <button
            type="button"
            onClick={() => onOutputModeChange('REAL_VIDEO_OVERLAY')}
            className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col gap-1.5 relative overflow-hidden ${
              outputMode === 'REAL_VIDEO_OVERLAY'
                ? 'bg-gradient-to-br from-cyan-950/90 to-blue-950/90 border-cyan-400 shadow-[0_0_24px_rgba(0,167,255,0.4)] ring-2 ring-cyan-400'
                : 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700 text-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📹</span>
                <span className="font-['Vazirmatn'] text-sm font-black text-white">
                  اورلی ویدیوی واقعی (HUD Overlay)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                اشغال &lt; ۱۵٪
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-['Vazirmatn']">
              <strong>مخصوص قرار دادن روی ویدیوی اصلی در پریمیر و داوینچی:</strong> کانواس شفاف ۱۹۲۰x۱۰۸۰، مرکز کاملاً خالی برای حفاظت از چهره‌ها و دست‌ها، آمار بازیکنان در گوشه‌ها.
            </p>
            {outputMode === 'REAL_VIDEO_OVERLAY' && (
              <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00A7FF]" />
            )}
          </button>

          {/* Output 1: FULL SCREEN GAME SCENE */}
          <button
            type="button"
            onClick={() => onOutputModeChange('FULL_SCREEN_SCENE')}
            className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col gap-1.5 relative overflow-hidden ${
              outputMode === 'FULL_SCREEN_SCENE'
                ? 'bg-gradient-to-br from-purple-950/90 to-indigo-950/90 border-purple-400 shadow-[0_0_24px_rgba(168,85,247,0.4)] ring-2 ring-purple-400'
                : 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700 text-neutral-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎬</span>
                <span className="font-['Vazirmatn'] text-sm font-black text-white">
                  صحنه تمام‌صفحه بازی (Game Scene)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                ترنزیشن کامل
              </span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-['Vazirmatn']">
              <strong>مخصوص کات و ترنزیشن در طول ویدیو:</strong> پس‌زمینه کامل بدون ترنسپرنسی، گرافیک مسابقات اسپورتس، تایمر بزرگ، کارت‌های نبرد، و قوانین کامل چالش.
            </p>
            {outputMode === 'FULL_SCREEN_SCENE' && (
              <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]" />
            )}
          </button>
        </div>
      </div>

      {/* 2. OVERLAY CONTROLS TOOLBAR (Only shown in Real Video Overlay Mode) */}
      {outputMode === 'REAL_VIDEO_OVERLAY' && (
        <div className="p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Background Footage Simulator Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-['Vazirmatn'] text-neutral-400 font-bold ml-1">
              پیش‌نمایش پس‌زمینه:
            </span>

            <button
              type="button"
              onClick={() => onPreviewFootageChange('footage_sim')}
              className={`px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold transition-all ${
                previewFootage === 'footage_sim'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              🎬 راش زنده (چهره و دست)
            </button>

            <button
              type="button"
              onClick={() => onPreviewFootageChange('checkerboard')}
              className={`px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold transition-all ${
                previewFootage === 'checkerboard'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              🏁 شطرنجی آلفا (شفاف)
            </button>

            <button
              type="button"
              onClick={() => onPreviewFootageChange('chroma_green')}
              className={`px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold transition-all ${
                previewFootage === 'chroma_green'
                  ? 'bg-[#00FF00] text-black shadow-md font-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              🟩 پرده سبز
            </button>

            <button
              type="button"
              onClick={() => onPreviewFootageChange('capcut_black')}
              className={`px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold transition-all ${
                previewFootage === 'capcut_black'
                  ? 'bg-white text-black shadow-md font-black'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              ⬛ مشکی خالص
            </button>

            {/* Upload Custom Footage */}
            <label className="px-2.5 py-1 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 cursor-pointer flex items-center gap-1 border border-neutral-700">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>آپلود راش خودتان</span>
              <input
                type="file"
                accept="video/*,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Right: Drag Elements, Safe Guides & Export */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Draggable HUD Toggle */}
            <button
              type="button"
              onClick={() => setIsDraggable(!isDraggable)}
              className={`px-3 py-1.5 rounded-xl text-xs font-['Vazirmatn'] font-bold flex items-center gap-1.5 transition-all ${
                isDraggable
                  ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)] ring-1 ring-amber-400 font-black'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
              }`}
            >
              {isDraggable ? <Move className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5 text-neutral-400" />}
              <span>{isDraggable ? 'جابجایی فعال (درگ کنید)' : 'قفل موقعیت‌ها'}</span>
            </button>

            {/* Reset Positions */}
            <button
              type="button"
              onClick={onResetHudPositions}
              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
              title="بازنشانی موقعیت به حالت استاندارد"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Safe Guides Popover Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsGuidesMenuOpen(!isGuidesMenuOpen)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-['Vazirmatn'] font-bold bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>خطوط راهنما (Guides)</span>
              </button>

              {isGuidesMenuOpen && (
                <div className="absolute top-full right-0 mt-1 z-30 w-56 p-2 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl flex flex-col gap-1.5 text-xs text-neutral-300">
                  <label className="flex items-center justify-between p-1.5 hover:bg-neutral-800 rounded-lg cursor-pointer">
                    <span className="text-cyan-400 font-bold">Action Safe (93%)</span>
                    <input
                      type="checkbox"
                      checked={safeGuides.showActionSafe}
                      onChange={() => toggleSafeGuide('showActionSafe')}
                      className="rounded accent-cyan-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-1.5 hover:bg-neutral-800 rounded-lg cursor-pointer">
                    <span className="text-amber-400 font-bold">Title Safe (90%)</span>
                    <input
                      type="checkbox"
                      checked={safeGuides.showTitleSafe}
                      onChange={() => toggleSafeGuide('showTitleSafe')}
                      className="rounded accent-amber-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-1.5 hover:bg-neutral-800 rounded-lg cursor-pointer">
                    <span className="text-emerald-400 font-bold">حفاظت از مرکز چهره‌ها (70%)</span>
                    <input
                      type="checkbox"
                      checked={safeGuides.showCenterClearZone}
                      onChange={() => toggleSafeGuide('showCenterClearZone')}
                      className="rounded accent-emerald-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-1.5 hover:bg-neutral-800 rounded-lg cursor-pointer">
                    <span className="text-neutral-400">شبکه ۳x۳ (Rule of Thirds)</span>
                    <input
                      type="checkbox"
                      checked={safeGuides.showRuleOfThirds}
                      onChange={() => toggleSafeGuide('showRuleOfThirds')}
                      className="rounded accent-neutral-500"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Export Preset Modal Button */}
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-['Vazirmatn'] font-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center gap-1.5 shadow-md shadow-cyan-500/25 active:scale-95 transition-transform"
            >
              <Download className="w-3.5 h-3.5" />
              <span>خروجی حرفه‌ای (Export)</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. 16:9 INTERACTIVE PREVIEW CANVAS CONTAINER */}
      <div className="w-full rounded-2xl border border-neutral-800 bg-black overflow-hidden shadow-2xl relative">
        {/* Aspect Ratio 16:9 Box */}
        <div className="w-full aspect-video relative flex items-center justify-center">
          {outputMode === 'REAL_VIDEO_OVERLAY' ? (
            <RealVideoOverlayHud
              publicState={publicState}
              previewFootage={previewFootage}
              customMediaUrl={customMediaUrl}
              safeGuides={safeGuides}
              positions={hudPositions}
              onPositionsChange={onHudPositionsChange}
              isDraggable={isDraggable}
              isCleanFeed={false}
              className="w-full h-full"
            />
          ) : (
            <FullScreenGameScene
              publicState={publicState}
              isCleanFeed={false}
              className="w-full h-full"
            />
          )}
        </div>

        {/* Bottom Bar: Screen Occupancy & Fullscreen Button */}
        <div className="w-full px-3 py-2 bg-neutral-950/90 border-t border-neutral-800 flex items-center justify-between text-xs font-['Vazirmatn'] text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              اشغال سطح صفحه: <strong>۴.۹٪</strong> (استاندارد یوتیوب: حداکثر ۱۵٪)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenBroadcast}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>تمام‌صفحه زنده (/broadcast)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. EXPORT PRESETS MODAL */}
      <OverlayExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        publicState={publicState}
        positions={hudPositions}
        onStartWebmAlphaRecord={onStartRecording}
        isRecording={isRecording}
      />
    </div>
  );
};
