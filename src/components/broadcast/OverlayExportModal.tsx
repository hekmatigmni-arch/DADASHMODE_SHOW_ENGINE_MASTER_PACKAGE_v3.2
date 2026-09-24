import React, { useState } from 'react';
import {
  Download,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  HelpCircle,
  FileCode,
  Sliders,
} from 'lucide-react';
import { PublicBroadcastState } from '../../types/game';
import { HudLayoutPositions, DEFAULT_HUD_POSITIONS } from '../../types/broadcastLayout';

interface OverlayExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicState: PublicBroadcastState;
  positions: HudLayoutPositions;
  onStartWebmAlphaRecord: () => void;
  isRecording?: boolean;
}

export const OverlayExportModal: React.FC<OverlayExportModalProps> = ({
  isOpen,
  onClose,
  publicState,
  positions,
  onStartWebmAlphaRecord,
  isRecording = false,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<
    'webm_alpha' | 'png_snapshot' | 'png_sequence' | 'chroma_green' | 'capcut_black'
  >('webm_alpha');
  const [fps, setFps] = useState<30 | 60>(60);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);
  const [showNleHelp, setShowNleHelp] = useState<boolean>(false);

  if (!isOpen) return null;

  // Export 1920x1080 Transparent PNG Snapshot
  const handleExportPngSnapshot = () => {
    setIsExportingPng(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Clear to 100% transparent alpha
      ctx.clearRect(0, 0, 1920, 1080);

      // 2. Render HUD elements at exact coordinates
      // We can draw a high-res representation directly:
      const scale = 1.0;

      // Top Left Round Info
      const rX = (positions.roundInfo.x / 100) * 1920;
      const rY = (positions.roundInfo.y / 100) * 1080;
      ctx.save();
      ctx.fillStyle = 'rgba(8, 13, 26, 0.92)';
      ctx.strokeStyle = '#00A7FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rX, rY, 420, 96, 20);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#00E5FF';
      ctx.fillText(
        `ROUND ${publicState.roundNumber}/${publicState.totalRounds} • +${publicState.rewardSeconds || 10}s`,
        rX + 24,
        rY + 36
      );

      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(publicState.roundTitle || 'CHALLENGE', rX + 24, rY + 70);
      ctx.restore();

      // Top Right Score Bug
      const sX = (positions.scoreBug.x / 100) * 1920;
      const sY = (positions.scoreBug.y / 100) * 1080;
      ctx.save();
      ctx.fillStyle = 'rgba(8, 13, 26, 0.92)';
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sX, sY, 440, 96, 20);
      ctx.fill();
      ctx.stroke();

      // Elias
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#FF4D6D';
      ctx.fillText('▲ ELIAS', sX + 28, sY + 38);
      ctx.font = 'bold 36px monospace';
      ctx.fillStyle = '#FF2A55';
      ctx.fillText(`${publicState.players.ELIAS.seconds}s`, sX + 28, sY + 76);

      // VS
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('VS', sX + 200, sY + 56);

      // Emad
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#00E676';
      ctx.fillText('● EMAD', sX + 280, sY + 38);
      ctx.font = 'bold 36px monospace';
      ctx.fillStyle = '#00E676';
      ctx.fillText(`${publicState.players.EMAD.seconds}s`, sX + 280, sY + 76);
      ctx.restore();

      // Top Center Timer
      const tX = (positions.timerPill.x / 100) * 1920;
      const tY = (positions.timerPill.y / 100) * 1080;
      ctx.save();
      ctx.fillStyle = 'rgba(9, 14, 28, 0.95)';
      ctx.strokeStyle = '#00A7FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tX, tY, 200, 56, 28);
      ctx.fill();
      ctx.stroke();

      const mins = Math.floor(publicState.timer.secondsRemaining / 60);
      const rem = publicState.timer.secondsRemaining % 60;
      const timeStr = `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
      ctx.font = 'bold 30px monospace';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(timeStr, tX + 100, tY + 40);
      ctx.restore();

      // Download transparent PNG
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DADASHMODE_OVERLAY_HUD_1080P_R${publicState.roundNumber}_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExportingPng(false);
      }, 'image/png');
    } catch (err) {
      console.error('PNG export failed', err);
      setIsExportingPng(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div
        className="w-full max-w-2xl rounded-3xl bg-[#090d18] border border-cyan-500/40 p-5 sm:p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Vazirmatn'] text-lg font-black">
                خروجی حرفه‌ای اورلی یوتیوب (Export Presets)
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                1920x1080 CANVAS • PREMIERE PRO / DAVINCI / CAPCUT READY
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Grid */}
        <div className="space-y-2">
          <label className="text-xs font-['Vazirmatn'] text-neutral-300 font-bold block text-right">
            انتخاب فرمت خروجی:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. WebM with Alpha */}
            <button
              type="button"
              onClick={() => setSelectedFormat('webm_alpha')}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 ${
                selectedFormat === 'webm_alpha'
                  ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,167,255,0.4)] ring-1 ring-cyan-400'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-['Vazirmatn'] text-sm font-black text-cyan-300">
                  ویدیو شفاف (WebM with Alpha)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  توصیه شده
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-['Vazirmatn']">
                کانواس شفاف ۱۹۲۰x۱۰۸۰ بدون نیاز به کروماکی. در پریمیر و داوینچی مستقیماً روی ویدیو می‌نشیند.
              </p>
            </button>

            {/* 2. PNG Snapshot */}
            <button
              type="button"
              onClick={() => setSelectedFormat('png_snapshot')}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 ${
                selectedFormat === 'png_snapshot'
                  ? 'bg-amber-950/80 border-amber-400 text-white shadow-[0_0_20px_rgba(255,215,0,0.4)] ring-1 ring-amber-400'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-['Vazirmatn'] text-sm font-black text-amber-300">
                  تصویر تک‌فریم شفاف (PNG Snapshot)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  فوری
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-['Vazirmatn']">
                یک تصویر با کیفیت ۱۹۲۰x۱۰۸۰ با کانال آلفا برای قرار دادن در تایم‌لاین ادیتور.
              </p>
            </button>

            {/* 3. Chroma Green Screen */}
            <button
              type="button"
              onClick={() => setSelectedFormat('chroma_green')}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 ${
                selectedFormat === 'chroma_green'
                  ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_20px_rgba(0,230,118,0.4)] ring-1 ring-emerald-400'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-['Vazirmatn'] text-sm font-black text-emerald-300">
                  کروماکی سبز (#00FF00 Green)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  ULTRA KEY
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-['Vazirmatn']">
                مناسب حذف رنگ با ابزار Ultra Key در پریمیر پرو برای ادیتورهایی که ویدیو با پس‌زمینه سبز ترجیح می‌دهند.
              </p>
            </button>

            {/* 4. CapCut Black Screen */}
            <button
              type="button"
              onClick={() => setSelectedFormat('capcut_black')}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 ${
                selectedFormat === 'capcut_black'
                  ? 'bg-neutral-800 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.3)] ring-1 ring-white'
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-['Vazirmatn'] text-sm font-black text-white">
                  مشکی خالص کپ‌کات (CapCut Black)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white font-bold">
                  SCREEN BLEND
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed font-['Vazirmatn']">
                مناسب بلند مد Screen / Filter در کپ‌کات و گوشی، بدون نیاز به رندرهای سنگین آلفا.
              </p>
            </button>
          </div>
        </div>

        {/* Resolution & FPS Settings */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-['Vazirmatn'] text-neutral-300 font-bold">
              نرخ فریم (Frame Rate):
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setFps(60)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  fps === 60
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                60 FPS (پخش روان یوتیوب)
              </button>
              <button
                type="button"
                onClick={() => setFps(30)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  fps === 30
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                30 FPS (استاندارد)
              </button>
            </div>
          </div>

          <span className="text-xs font-mono text-cyan-300 font-bold">
            رزولوشن: 1920x1080 (16:9)
          </span>
        </div>

        {/* NLE Instructions Accordion */}
        <div>
          <button
            type="button"
            onClick={() => setShowNleHelp(!showNleHelp)}
            className="flex items-center gap-1.5 text-xs text-amber-300 font-bold hover:underline"
          >
            <HelpCircle className="w-4 h-4" />
            <span>راهنمای ایمپورت در پریمیر، داوینچی و کپ‌کات</span>
          </button>

          {showNleHelp && (
            <div className="mt-2 p-3 rounded-2xl bg-black/60 border border-neutral-800 text-xs text-neutral-300 space-y-2 font-['Vazirmatn'] leading-relaxed">
              <p>
                <strong>در Premiere Pro:</strong> فایل WebM یا PNG شفاف را در ترک بالای ویدیوی خود قرار دهید. اگر فایل WebM ترنسپرنسی نشان نداد، روی کلیپ راست‌کلیک کرده، Modify &gt; Interpret Footage &gt; Alpha Channel را روی "Premultiplied" قرار دهید.
              </p>
              <p>
                <strong>در DaVinci Resolve:</strong> فایل خروجی را به تایم‌لاین ببرید؛ ترنسپرنسی آلفا به صورت خودکار شناسایی می‌شود.
              </p>
              <p>
                <strong>در CapCut:</strong> فایل را به عنوان Overlay اضافه کنید و در بخش Blend Mode گزینه "Screen" یا "Filter" را انتخاب کنید.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-3">
          {selectedFormat === 'png_snapshot' ? (
            <button
              type="button"
              onClick={handleExportPngSnapshot}
              disabled={isExportingPng}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <ImageIcon className="w-5 h-5" />
              <span>{isExportingPng ? 'در حال ایجاد PNG...' : 'دانلود تصویر شفاف ۱۹۲۰x۱۰۸۰ (PNG)'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartWebmAlphaRecord();
              }}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-transform active:scale-95"
            >
              <Film className="w-5 h-5" />
              <span>
                {isRecording
                  ? 'ضبط در حال اجراست (مشاهده پنل ضبط)'
                  : 'شروع ضبط خروجی شفاف ۱۹۲۰x۱۰۸۰ (WebM)'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};
