import React, { useState } from 'react';
import { BroadcastStage, BroadcastLayoutMode } from '../BroadcastStage';
import {
  QA_MOCK_STATES,
  QA_PRESET_BUTTONS,
  QA_VIEWPORT_PRESETS,
  VisualQaStateKey,
  QaViewportPreset,
  QaPresetButtonItem,
} from '../../data/visualQaPresets';
import {
  Camera,
  Smartphone,
  Monitor,
  Maximize2,
  X,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface BroadcastQaViewProps {
  onExitQa?: () => void;
}

export const BroadcastQaView: React.FC<BroadcastQaViewProps> = ({ onExitQa }) => {
  const [selectedPreset, setSelectedPreset] = useState<VisualQaStateKey>('ROUND_ACTIVE');
  const [viewportPreset, setViewportPreset] = useState<QaViewportPreset>('PORTRAIT_390_844');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const activeMockState = QA_MOCK_STATES[selectedPreset] || QA_MOCK_STATES.ROUND_ACTIVE;
  const viewport = QA_VIEWPORT_PRESETS[viewportPreset];

  // Determine layout mode
  const getLayoutMode = (): BroadcastLayoutMode => {
    if (selectedPreset === 'COMPACT_OVERLAY') return 'COMPACT_OVERLAY';
    if (selectedPreset === 'CHROMA_OVERLAY') return 'CHROMA_KEY';
    if (viewportPreset === 'COMPACT_560_320') return 'COMPACT_OVERLAY';
    return 'FULL_PORTRAIT';
  };

  const currentLayoutMode = getLayoutMode();

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col select-none font-sans">
      {/* 1. QA PREVIEW BANNER (MANDATORY REQUIREMENT) */}
      <div className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-black px-4 py-2 font-mono font-black text-xs flex flex-wrap items-center justify-between gap-2 shadow-xl z-50 border-b-2 border-amber-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-black animate-ping" />
          <span className="tracking-widest uppercase text-sm">QA PREVIEW — NOT LIVE GAME</span>
          <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] hidden sm:inline-block font-sans font-bold">
            محیط ارزیابی آرت‌دایرکشن و اسکرین‌شات — هیچ داده واقعی تغییر نمی‌کند
          </span>
        </div>

        {/* Exit QA Button */}
        {onExitQa && (
          <button
            type="button"
            onClick={onExitQa}
            id="btn-exit-qa"
            className="px-3 py-1 bg-black text-amber-300 hover:text-white hover:bg-neutral-900 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow"
          >
            <X className="w-3.5 h-3.5 text-amber-400" />
            <span>EXIT QA</span>
          </button>
        )}
      </div>

      {/* 2. QA TOOLBAR & PRESET SELECTION */}
      <header className="w-full bg-neutral-900/95 border-b border-neutral-800 p-3 sm:p-4 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          {/* Top Bar: Viewport Presets & Zoom */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1">
                <Camera className="w-4 h-4" /> SCREENSHOT PRESETS:
              </span>
              <button
                type="button"
                id="btn-qa-portrait-preset"
                onClick={() => setViewportPreset('PORTRAIT_390_844')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  viewportPreset === 'PORTRAIT_390_844'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>PORTRAIT 390×844</span>
              </button>

              <button
                type="button"
                id="btn-qa-compact-preset"
                onClick={() => setViewportPreset('COMPACT_560_320')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  viewportPreset === 'COMPACT_560_320'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>COMPACT 560×320</span>
              </button>

              <button
                type="button"
                id="btn-qa-landscape-preset"
                onClick={() => setViewportPreset('LANDSCAPE_1280_720')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  viewportPreset === 'LANDSCAPE_1280_720'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>LANDSCAPE 1280×720</span>
              </button>

              <button
                type="button"
                id="btn-qa-responsive-preset"
                onClick={() => setViewportPreset('RESPONSIVE')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  viewportPreset === 'RESPONSIVE'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>RESPONSIVE FULL</span>
              </button>
            </div>

            {/* Scale/Zoom Controls */}
            {viewportPreset !== 'RESPONSIVE' && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-neutral-400">ZOOM:</span>
                {[0.75, 0.9, 1, 1.1].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setZoomLevel(scale)}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      zoomLevel === scale ? 'bg-neutral-700 text-white font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {Math.round(scale * 100)}%
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preset Buttons Grid (12 Mandatory Visual States) */}
          <div className="flex flex-wrap items-center gap-1.5" id="qa-visual-state-buttons">
            <span className="text-[11px] font-mono font-bold text-neutral-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> STATES:
            </span>
            {QA_PRESET_BUTTONS.map((item) => {
              const isActive = selectedPreset === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  id={`btn-qa-state-${item.key.toLowerCase().replace(/_/g, '-')}`}
                  onClick={() => setSelectedPreset(item.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase transition-all tracking-wider ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-black shadow-lg ring-2 ring-amber-300 scale-105'
                      : 'bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/60'
                  }`}
                  title={item.persianLabel}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. WORKSPACE CANVAS / STAGE PREVIEW CONTAINER */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-auto bg-[#020202]">
        {viewportPreset === 'RESPONSIVE' ? (
          <div className="w-full max-w-2xl min-h-screen bg-black rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
            <BroadcastStage
              publicState={activeMockState}
              isStandalone={false}
              initialMode={currentLayoutMode}
            />
          </div>
        ) : (
          <div
            className="transition-all duration-300 ease-out shadow-2xl border border-neutral-800 rounded-3xl overflow-hidden bg-black relative shrink-0"
            style={{
              width: typeof viewport.width === 'number' ? `${viewport.width}px` : viewport.width,
              height: typeof viewport.height === 'number' ? `${viewport.height}px` : viewport.height,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Viewport Meta Watermark (Discreet in corner) */}
            <div className="absolute bottom-2 right-2 z-40 bg-black/80 px-2 py-0.5 rounded border border-neutral-800 text-[10px] font-mono text-neutral-400 pointer-events-none">
              {viewport.label} • {selectedPreset}
            </div>

            <div className="w-full h-full overflow-y-auto">
              <BroadcastStage
                publicState={activeMockState}
                isStandalone={false}
                initialMode={currentLayoutMode}
              />
            </div>
          </div>
        )}
      </main>

      {/* 4. FOOTER STATUS */}
      <footer className="w-full bg-neutral-900 border-t border-neutral-800 px-4 py-2 text-xs font-mono text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>CURRENT STATE: <strong className="text-white">{selectedPreset}</strong></span>
          <span className="text-neutral-500">|</span>
          <span>VIEWPORT: <strong className="text-white">{viewport.label}</strong></span>
        </div>
        <div className="text-neutral-500 hidden sm:block">
          MOCK BROADCAST STATE IS READ-ONLY &amp; ISOLATED
        </div>
      </footer>
    </div>
  );
};
