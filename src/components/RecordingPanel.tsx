import React from 'react';
import {
  RecordingPresetId,
  RECORDING_PRESETS,
} from '../types/recorder';
import {
  Video,
  Disc,
  Square,
  Download,
  FileText,
  HardDrive,
  AlertTriangle,
  Zap,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface RecordingPanelProps {
  recorderState: 'idle' | 'recording' | 'paused' | 'stopped' | 'exporting';
  activePresetId: RecordingPresetId;
  onSelectPreset: (preset: RecordingPresetId) => void;
  elapsedSeconds: number;
  recordedBytes: number;
  isOpfsActive: boolean;
  hasRecordedFile: boolean;
  performanceWarning: string | null;
  visibilityWarning: boolean;
  onDismissVisibilityWarning: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onDownloadRecording: () => void;
  onDownloadEventsSidecar: () => void;
}

export const RecordingPanel: React.FC<RecordingPanelProps> = ({
  recorderState,
  activePresetId,
  onSelectPreset,
  elapsedSeconds,
  recordedBytes,
  isOpfsActive,
  hasRecordedFile,
  performanceWarning,
  visibilityWarning,
  onDismissVisibilityWarning,
  onStartRecording,
  onStopRecording,
  onDownloadRecording,
  onDownloadEventsSidecar,
}) => {
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isRecording = recorderState === 'recording';

  return (
    <div
      id="director-recording-panel"
      className={`w-full rounded-2xl border transition-all p-3 sm:p-4 shadow-xl ${
        isRecording
          ? 'bg-neutral-950 border-red-500/80 ring-2 ring-red-500/20'
          : 'bg-neutral-900/90 border-neutral-800'
      }`}
    >
      {/* Header & REC Indicator */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isRecording ? 'bg-red-500 animate-ping' : 'bg-neutral-600'
            }`}
          />
          <span className="font-mono text-xs font-black uppercase text-neutral-300 flex items-center gap-1">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>CLEAN INTERNAL RECORDER</span>
          </span>
          <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold rounded">
            PHASE 1B
          </span>
        </div>

        {/* OPFS Status */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <HardDrive className={`w-3 h-3 ${isOpfsActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
          <span className={isOpfsActive ? 'text-emerald-400' : 'text-neutral-400'}>
            {isOpfsActive ? 'OPFS DISK' : 'RAM BUFFER'}
          </span>
        </div>
      </div>

      {/* Visibility / Lock Warning */}
      {visibilityWarning && (
        <div className="mb-2 p-2 bg-amber-950/80 border border-amber-500 rounded-xl text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>صفحه موقتاً به پس‌زمینه رفت؛ ضبط داخلی بدون وقفه ادامه دارد.</span>
          </div>
          <button
            type="button"
            onClick={onDismissVisibilityWarning}
            className="text-[10px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded"
          >
            تایید
          </button>
        </div>
      )}

      {/* Performance Recommendation */}
      {performanceWarning && !isRecording && (
        <div className="mb-2.5 p-2 bg-neutral-800/80 border border-neutral-700 rounded-xl text-[11px] text-neutral-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>{performanceWarning}</span>
        </div>
      )}

      {/* Active Recording View */}
      {isRecording ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-black/80 p-3 rounded-xl border border-red-900/60">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono text-2xl font-black text-red-400 tabular-nums">
                {formatTimer(elapsedSeconds)}
              </span>
              <span className="text-xs text-neutral-400 font-mono">REC TIME</span>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-neutral-400 block">EST. SIZE</span>
              <span className="text-sm font-bold text-white tabular-nums">
                {formatBytes(recordedBytes)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
            <span>پریست فعال: <strong className="text-amber-400 font-mono">{RECORDING_PRESETS[activePresetId].name}</strong></span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> بدون کنترل‌های Director
            </span>
          </div>

          <button
            type="button"
            id="btn-stop-recording"
            onClick={onStopRecording}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black text-sm rounded-xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 animate-pulse"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>STOP RECORDING</span>
          </button>
        </div>
      ) : (
        /* Idle / Ready State */
        <div className="space-y-3">
          {/* Preset Selector */}
          <div>
            <span className="text-xs text-neutral-400 font-bold block mb-1.5 text-right font-['Vazirmatn']">
              انتخاب پریست ویدیویی ضبط:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(Object.keys(RECORDING_PRESETS) as RecordingPresetId[]).map((key) => {
                const p = RECORDING_PRESETS[key];
                const isSelected = activePresetId === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectPreset(key)}
                    className={`p-2 rounded-xl text-right flex flex-col justify-between border text-xs transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow ring-1 ring-amber-400'
                        : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    <span className="font-mono text-[10px] font-black uppercase block truncate">
                      {p.id === 'YOUTUBE_60FPS_20MBPS'
                        ? '60FPS / 20M'
                        : p.id === 'COMPACT_OVERLAY'
                        ? '16:9 CHROMA'
                        : p.id === 'LOW_POWER'
                        ? 'LOW POWER'
                        : '9:16 FULL'}
                    </span>
                    <span className="font-mono text-[9px] opacity-80 mt-1">
                      {p.width}x{p.height} @{p.fps}fps
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Recording Button */}
          <button
            type="button"
            id="btn-start-recording"
            onClick={onStartRecording}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-black text-sm rounded-xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Disc className="w-4 h-4 animate-spin" />
            <span>START CLEAN RECORDING</span>
          </button>

          {/* Export / Download Previous Take */}
          {hasRecordedFile && (
            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="font-bold font-['Vazirmatn']">برداشت ضبط شده آماده دانلود است:</span>
                <span className="font-mono text-emerald-400 font-bold">{formatBytes(recordedBytes)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-download-recording"
                  onClick={onDownloadRecording}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>دانلود ویدیو (.webm)</span>
                </button>

                <button
                  type="button"
                  id="btn-download-sidecar"
                  onClick={onDownloadEventsSidecar}
                  className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 border border-neutral-700"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>مانیفست رویدادها (.json)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
