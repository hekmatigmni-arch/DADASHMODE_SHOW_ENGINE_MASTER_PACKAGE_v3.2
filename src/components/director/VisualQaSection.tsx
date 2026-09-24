import React, { useState } from 'react';
import {
  QA_PRESET_BUTTONS,
  QA_VIEWPORT_PRESETS,
  VisualQaStateKey,
  QaViewportPreset,
} from '../../data/visualQaPresets';
import {
  Sparkles,
  Camera,
  Smartphone,
  Layers,
  Monitor,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface VisualQaSectionProps {
  onOpenQaTab: () => void;
  onNavigateToQa: () => void;
  onPreviewPreset?: (preset: VisualQaStateKey) => void;
}

export const VisualQaSection: React.FC<VisualQaSectionProps> = ({
  onOpenQaTab,
  onNavigateToQa,
}) => {
  const [selectedPresetForInfo, setSelectedPresetForInfo] = useState<VisualQaStateKey>('ROUND_ACTIVE');
  const [quickCopied, setQuickCopied] = useState<boolean>(false);

  const handleCopyQaUrl = () => {
    if (typeof window !== 'undefined') {
      const qaUrl = `${window.location.origin}/broadcast/qa`;
      navigator.clipboard.writeText(qaUrl).catch(() => {});
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 text-xs font-sans">
      {/* 1. Clear Director Notice Banner */}
      <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-mono font-black text-amber-300 text-[11px] uppercase tracking-wider">
            QA PREVIEW — NOT LIVE GAME
          </div>
          <p className="text-[11px] text-neutral-300 font-['Vazirmatn'] leading-relaxed">
            گالری Visual QA صرفاً از وضعیت‌های شبیه‌سازی‌شده (Mock Public Broadcast State) استفاده می‌کند. هیچ‌یک از مقادیر بانک زمان، امتیاز بازیکنان، وضعیت وب‌سوکت داور، یا زمان واقعی مسابقه دستخوش تغییر نخواهند شد.
          </p>
        </div>
      </div>

      {/* 2. One-Click Screenshot Presets (Requirement 7 & 8) */}
      <div className="space-y-2">
        <span className="font-mono font-bold text-[11px] text-amber-400 uppercase flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" /> 1-CLICK SCREENSHOT PRESETS:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* OPEN PORTRAIT PREVIEW */}
          <button
            type="button"
            id="btn-qa-open-portrait"
            onClick={onNavigateToQa}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700/90 border border-neutral-700 hover:border-amber-400 text-left transition-all flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-mono font-black text-[11px] text-white">OPEN PORTRAIT PREVIEW</div>
                <div className="text-[10px] text-neutral-400 font-mono">390×844 (9:16 Mobile)</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors" />
          </button>

          {/* OPEN COMPACT PREVIEW */}
          <button
            type="button"
            id="btn-qa-open-compact"
            onClick={onNavigateToQa}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700/90 border border-neutral-700 hover:border-amber-400 text-left transition-all flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-mono font-black text-[11px] text-white">OPEN COMPACT PREVIEW</div>
                <div className="text-[10px] text-neutral-400 font-mono">560×320 (PIP Overlay)</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors" />
          </button>

          {/* OPEN LANDSCAPE PREVIEW */}
          <button
            type="button"
            id="btn-qa-open-landscape"
            onClick={onNavigateToQa}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700/90 border border-neutral-700 hover:border-amber-400 text-left transition-all flex items-center justify-between group shadow"
          >
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-mono font-black text-[11px] text-white">OPEN LANDSCAPE PREVIEW</div>
                <div className="text-[10px] text-neutral-400 font-mono">1280×720 (16:9 OBS)</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* 3. Visual QA Direct Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-800">
        <button
          type="button"
          id="btn-open-visual-qa-gallery"
          onClick={onNavigateToQa}
          className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-mono font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <Eye className="w-4 h-4 shrink-0" />
          <span>OPEN VISUAL QA GALLERY (/broadcast/qa)</span>
        </button>

        <button
          type="button"
          id="btn-open-qa-new-tab"
          onClick={onOpenQaTab}
          className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          title="Open QA gallery in new browser tab for dedicated dual-monitor preview"
        >
          <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
          <span>OPEN IN NEW TAB</span>
        </button>

        <button
          type="button"
          onClick={handleCopyQaUrl}
          className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 font-mono text-xs rounded-xl flex items-center gap-1 transition-colors"
        >
          {quickCopied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">COPIED URL</span>
            </>
          ) : (
            <span>COPY /broadcast/qa URL</span>
          )}
        </button>
      </div>

      {/* 4. Complete List of 12 Mandatory Visual State Presets */}
      <div className="space-y-2 pt-2 border-t border-neutral-800">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-neutral-400 font-bold uppercase">12 MOCK VISUAL STATES CATALOG:</span>
          <span className="text-amber-400 font-bold">CLICK TO LAUNCH QA</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5" id="qa-director-state-buttons">
          {QA_PRESET_BUTTONS.map((item) => (
            <button
              key={item.key}
              type="button"
              id={`btn-director-qa-${item.key.toLowerCase().replace(/_/g, '-')}`}
              onClick={onNavigateToQa}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700/60 text-left font-mono font-bold text-[10px] flex items-center justify-between transition-colors shadow-sm"
              title={`${item.label} (${item.persianLabel})`}
            >
              <span className="truncate">{item.label}</span>
              <ChevronRight className="w-3 h-3 text-neutral-500 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
