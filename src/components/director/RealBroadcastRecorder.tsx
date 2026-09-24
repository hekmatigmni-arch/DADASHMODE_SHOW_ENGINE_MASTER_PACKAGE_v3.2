import React, { useState } from 'react';
import { PublicBroadcastState } from '../../types/game';
import { useBroadcastRecorder, getSupportedMimeType } from '../../hooks/useBroadcastRecorder';
import { showAudioEngine } from '../../utils/showAudioEngine';
import { ShowOverlay } from '../../utils/showSceneOverlay';

interface Props { isOpen: boolean; onClose: () => void; broadcast: PublicBroadcastState; activeVfx?: ShowOverlay | null; }

async function testActualRecording(): Promise<{ codec: string; duration: number; bytes: number; maxVolumeDb: number }> {
  if (!('MediaRecorder' in window) || !HTMLCanvasElement.prototype.captureStream)
    throw new Error('MediaRecorder یا canvas.captureStream روی این مرورگر پشتیبانی نمی‌شود.');
  const inventory = await fetch('/api/voice/models/installed');
  if (!inventory.ok) throw new Error('سرور محلی صدا در دسترس نیست.');
  const installed = await inventory.json();
  const engine = installed.hasNeuralModel ? 'neural' : installed.hasFormantModel ? 'formant' : null;
  if (!engine) throw new Error('مدل گفتار آفلاین نصب نشده؛ تست ضبط صدای داور ممکن نیست.');
  const sample = await fetch('/api/voice/synthesize', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'راند اول آماده است. شروع مسابقه!', engine }),
  });
  if (!sample.ok) throw new Error('گویندهٔ محلی نتوانست نمونهٔ گفتار بسازد.');
  const narration = await sample.arrayBuffer();
  const canvas = document.createElement('canvas');
  canvas.width = 1280; canvas.height = 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas روی دستگاه فعال نشد.');
  const audio = showAudioEngine.getRecordingAudioTrack();
  if (!audio) throw new Error('ترک صدای قابل ضبط وجود ندارد.');
  await showAudioEngine.resume();
  const stream = new MediaStream([...canvas.captureStream(30).getVideoTracks(), audio]);
  const mimeType = getSupportedMimeType();
  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const finished = new Promise<Blob>((resolve, reject) => {
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    recorder.onerror = () => reject(new Error('MediaRecorder هنگام ضبط خطا داد.'));
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType }));
  });
  let frame = 0;
  const draw = window.setInterval(() => {
    ctx.fillStyle = '#152635'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f1c45c'; ctx.font = 'bold 90px sans-serif';
    ctx.fillText(`DADASHMODE TEST ${frame++}`, 80, 360);
  }, 33);
  try {
    recorder.start(250);
    showAudioEngine.playCountdownBeep(true);
    await showAudioEngine.playVoiceWav(narration);
    showAudioEngine.playRewardDing();
    await new Promise((resolve) => setTimeout(resolve, 700));
    recorder.stop();
    const clip = await finished;
    if (clip.size < 2000) throw new Error('فایل ضبط‌شده خالی یا بسیار کوچک است.');
    const response = await fetch('/api/recording/inspect', { method: 'POST', headers: { 'Content-Type': clip.type || 'application/octet-stream' }, body: clip });
    const inspection = await response.json();
    if (!response.ok || !inspection.pass) throw new Error(inspection.reason || 'سیگنال صوتی/تصویری در خروجی پیدا نشد.');
    return { ...inspection, bytes: clip.size, codec: recorder.mimeType };
  } finally {
    if (recorder.state !== 'inactive') recorder.stop();
    clearInterval(draw);
    stream.getVideoTracks().forEach((track) => track.stop());
  }
}

export const RealBroadcastRecorder: React.FC<Props> = ({ isOpen, onClose, broadcast, activeVfx }) => {
  const [testState, setTestState] = useState('هنوز تست نشده');
  const [testing, setTesting] = useState(false);
  const recorder = useBroadcastRecorder({ publicState: broadcast, events: [], activeVfx, enabled: isOpen });
  if (!isOpen) return null;
  const recording = recorder.recorderState === 'recording';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 p-4 text-neutral-100" dir="rtl">
      <section className="w-full max-w-xl max-h-[90vh] overflow-auto rounded-2xl bg-neutral-900 p-6 flex flex-col gap-5" aria-label="ضبط خروجی استودیو">
        <header className="flex items-start justify-between gap-4">
          <div><h2 className="text-xl font-black">ضبط خروجی گرافیکی</h2><p className="mt-2 text-sm text-neutral-300">فایل واقعی از canvas و باس صدای داور/افکت ساخته می‌شود. این ضبط، تصویر دوربین یا صدای میکروفون بازیکنان را شامل نمی‌شود.</p></div>
          <button onClick={onClose} disabled={recording} className="min-h-11 px-3 disabled:opacity-40" aria-label="بستن">✕</button>
        </header>
        <p className="text-sm text-amber-200">فرمت واقعی را مرورگر تعیین می‌کند: {getSupportedMimeType() || 'فرمت پیش‌فرض دستگاه'}. ProRes، آلفا و MP4 تضمین نشده‌اند.</p>
        <div className="flex gap-2 flex-wrap">
          <button disabled={recording} onClick={async () => { const ok = await recorder.startRecording(); if (!ok) setTestState('شروع ضبط ناموفق بود.'); }}
            className="min-h-11 rounded-lg bg-red-700 px-5 disabled:opacity-40">شروع ضبط واقعی</button>
          <button disabled={!recording} onClick={() => recorder.stopRecording()} className="min-h-11 rounded-lg bg-neutral-700 px-5 disabled:opacity-40">توقف و ذخیره</button>
          <button disabled={!recorder.hasRecordedFile} onClick={recorder.downloadRecording} className="min-h-11 rounded-lg bg-amber-600 px-5 text-neutral-950 disabled:opacity-40">دریافت ویدیو</button>
          <button disabled={!recorder.lastManifest} onClick={recorder.downloadEventsSidecar} className="min-h-11 rounded-lg bg-neutral-700 px-5 disabled:opacity-40">دریافت گزارش رویداد</button>
        </div>
        <p role="status">وضعیت: {recorder.recorderState} | {recorder.elapsedSeconds} ثانیه | {recorder.recordedBytes} بایت | ذخیره‌سازی {recorder.isOpfsActive ? 'OPFS + نسخهٔ حافظه' : 'حافظهٔ موقت'}</p>
        {recorder.recordingError && <p role="alert" className="text-red-300">{recorder.recordingError}</p>}
        {recorder.visibilityWarning && <p role="alert" className="text-amber-200">صفحه در حین ضبط پنهان شد؛ فایل را بررسی کنید، ضبط در پس‌زمینه تضمین ندارد.</p>}
        <hr className="border-neutral-700" />
        <h3 className="font-bold">تست خودکار ضبط واقعی، پیش از فیلم‌برداری</h3>
        <p className="text-sm text-neutral-300">تصویر متحرک، گفتار ساخته‌شدهٔ محلی و افکت ضبط و روی سرور همین دستگاه با ffprobe و ffmpeg بررسی می‌شوند. تست جنسیت و کیفیت گوینده یا پایداری قفل صفحه نیست.</p>
        <button disabled={testing || recording} className="min-h-11 rounded-lg bg-amber-700 px-5 disabled:opacity-40" onClick={async () => {
          setTesting(true); setTestState('در حال ضبط و تحلیل فایل واقعی...');
          try { const result = await testActualRecording(); setTestState(`قبول: ${result.codec}، ${result.duration.toFixed(1)} ثانیه، ${result.bytes} بایت، اوج صدا ${result.maxVolumeDb} dB`); }
          catch (error) { setTestState(`رد شد: ${error instanceof Error ? error.message : 'خطای نامشخص'}`); }
          finally { setTesting(false); }
        }}>{testing ? 'در حال تست...' : 'اجرای تست ضبط'}</button>
        <p role="status" className={testState.startsWith('رد') ? 'text-red-300' : 'text-amber-200'}>{testState}</p>
      </section>
    </div>
  );
};
