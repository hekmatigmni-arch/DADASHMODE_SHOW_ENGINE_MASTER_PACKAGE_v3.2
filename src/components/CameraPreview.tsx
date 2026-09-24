import { FC, RefObject } from 'react';
import { Camera, RefreshCw, Eye, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { ConnectionStatus } from '../hooks/useGeminiLive';

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isCameraActive: boolean;
  isMicActive: boolean;
  status: ConnectionStatus;
  facingMode: 'environment' | 'user';
  isUnderReview: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onStartSession: () => void;
}

export const CameraPreview: FC<CameraPreviewProps> = ({
  videoRef,
  canvasRef,
  isCameraActive,
  isMicActive,
  status,
  facingMode,
  isUnderReview,
  onToggleCamera,
  onToggleMic,
  onStartSession,
}) => {
  return (
    <div
      id="camera-preview-container"
      className="relative w-full aspect-[4/3] bg-neutral-900 rounded-xl overflow-hidden border-2 border-neutral-700 shadow-xl"
    >
      {/* Hidden Canvas for JPEG frame sampling and VAR review captures */}
      <canvas ref={canvasRef} className="hidden" />

      {/* The Live Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isCameraActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Fallback Placeholder when Camera is inactive */}
      {!isCameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-center">
          <div className="w-14 h-14 rounded-full bg-neutral-800 border-2 border-amber-500/40 flex items-center justify-center mb-2 shadow-lg">
            <Camera className="w-7 h-7 text-amber-400" />
          </div>
          <p className="text-white font-black text-base sm:text-lg mb-1 font-['Vazirmatn']">
            موتور برودکست داداش مد (V8 MASTER)
          </p>
          <p className="text-neutral-300 text-xs mb-3 font-['Vazirmatn'] max-w-[320px] leading-relaxed">
            بدون درخواست دسترسی میکروفون و وبکم مرورگر • تمامی افکت‌های صوتی، دیاگرام‌ها و قوانین داوری کاملاً فعال هستند.
          </p>
          <div className="flex items-center gap-2">
            <button
              id="btn-activate-camera"
              type="button"
              onClick={onStartSession}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 active:scale-95 text-black font-black text-xs sm:text-sm rounded-xl shadow-lg border border-yellow-200 uppercase tracking-wider flex items-center gap-2"
            >
              <span>اتصال هوش مصنوعی داور (SESSION)</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Overlay Badges */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
        {/* Connection status badge */}
        <div
          className={`flex items-center gap-1.5 backdrop-blur-sm border px-2.5 py-1 rounded-full text-xs font-bold shadow ${
            status === 'connected'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : status === 'connecting'
              ? 'bg-yellow-950/90 text-yellow-300 border-yellow-500'
              : 'bg-black/80 text-neutral-300 border-neutral-700'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              status === 'connected'
                ? 'bg-emerald-400 animate-ping'
                : status === 'connecting'
                ? 'bg-yellow-400 animate-pulse'
                : 'bg-red-500'
            }`}
          />
          <span className="text-[11px] font-mono font-black tracking-wide">
            {status === 'connected'
              ? 'LIVE CONNECTED'
              : status === 'connecting'
              ? 'CONNECTING...'
              : 'OFFLINE'}
          </span>
        </div>

        {/* Camera Lens Indicator */}
        {isCameraActive && (
          <div className="flex items-center gap-1 bg-black/80 border border-neutral-700 px-2 py-0.5 rounded text-[11px] text-neutral-300 font-mono">
            <Eye className="w-3.5 h-3.5 text-yellow-400" />
            <span>{facingMode === 'environment' ? 'REAR (عقب)' : 'FRONT (جلو)'}</span>
          </div>
        )}
      </div>

      {/* Camera Crosshair Guides (Broadcast Studio Look) */}
      {isCameraActive && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-36 h-36 border border-dashed border-white/60 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Bottom Camera Action Bar */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        {/* Switch Camera Button */}
        <button
          id="btn-switch-camera"
          type="button"
          onClick={onToggleCamera}
          className="px-2.5 py-1.5 bg-black/85 hover:bg-black active:scale-95 text-white rounded-lg border border-neutral-700 flex items-center gap-1.5 text-xs font-bold shadow transition"
          title="Switch between front and rear camera"
        >
          <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
          <span>تغییر دوربین</span>
        </button>

        {/* Mic Toggle Button */}
        <button
          id="btn-toggle-mic"
          type="button"
          onClick={onToggleMic}
          className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs font-bold shadow transition active:scale-95 ${
            isMicActive
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500'
              : 'bg-red-950/90 text-red-300 border-red-500'
          }`}
        >
          {isMicActive ? (
            <>
              <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>میکروفون فعال</span>
            </>
          ) : (
            <>
              <MicOff className="w-3.5 h-3.5 text-red-400" />
              <span>میکروفون قطع</span>
            </>
          )}
        </button>
      </div>

      {/* Dramatic VAR / Review Flash Overlay */}
      {isUnderReview && (
        <div className="absolute inset-0 bg-yellow-500/20 pointer-events-none flex flex-col items-center justify-center p-3 animate-pulse border-4 border-yellow-400">
          <div className="bg-black/95 text-yellow-400 border-2 border-yellow-400 px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-400 animate-bounce" />
            <span className="text-base sm:text-lg font-black tracking-widest uppercase">
              VAR • بازبینی صحنه
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
