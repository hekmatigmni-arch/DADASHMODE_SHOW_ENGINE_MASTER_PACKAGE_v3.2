import React, { useState, useEffect } from 'react';
import { VoiceModelMetadata, ApprovedCue, SynthesizedAudioResult } from '../../engine/voice/types';
import { voiceProviderManager, OfflineVerificationReport } from '../../engine/voice/voiceProviderManager';
import { loudnessEngine } from '../../engine/audio/loudnessEngine';
import { getOfflineVoiceCue, saveOfflineVoiceCue } from '../../engine/mediaLibrary';
import { showAudioEngine } from '../../utils/showAudioEngine';

interface VoiceCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCenterModal: React.FC<VoiceCenterModalProps> = ({ isOpen, onClose }) => {
  const [models, setModels] = useState<VoiceModelMetadata[]>([]);
  const [approvedCues, setApprovedCues] = useState<ApprovedCue[]>([]);
  const [selectedModel, setSelectedModel] = useState<VoiceModelMetadata | null>(null);
  const [testText, setTestText] = useState('راند اول، برج لیوان! آماده‌اید؟ شروع!');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isVerifyingOffline, setIsVerifyingOffline] = useState(false);
  const [verificationReport, setVerificationReport] = useState<OfflineVerificationReport | null>(null);
  const [lastAudioResult, setLastAudioResult] = useState<SynthesizedAudioResult | null>(null);
  const [activeTab, setActiveTab] = useState<'MODELS' | 'OFFLINE_VERIFY' | 'APPROVED_CUES'>('MODELS');
  const [diagnostic, setDiagnostic] = useState<string | null>(null);
  const [offlineCueStatus, setOfflineCueStatus] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const res = await fetch('/api/voice/models');
      if (res.ok) {
        const data = await res.json();
        setModels(data.models || voiceProviderManager.getModels());
        if (data.models && data.models.length > 0) {
          setSelectedModel(data.models[0]);
        }
      } else {
        setDiagnostic('سرور محلی صدا در دسترس نیست؛ موجودی صدا تأیید نشد.');
        setModels([]);
      }
    } catch {
      setDiagnostic('سرور محلی صدا در دسترس نیست؛ روی گوشی بدون سرور یا موتور نصب‌شده صدای آفلاین کار نمی‌کند.');
      setModels([]);
    }
    setApprovedCues(voiceProviderManager.getApprovedCues());
  };

  const handleRunOfflineVerification = async () => {
    setIsVerifyingOffline(true);
    setVerificationReport(null);
    try {
      const report = await voiceProviderManager.runMandatoryOfflineVerification();
      setVerificationReport(report);
    } catch (e: any) {
      setVerificationReport({
        timestamp: new Date().toISOString(),
        testPhrase: testText,
        networkBlocked: false,
        modelLoaded: false,
        modelName: selectedModel?.name || 'Local Neural Model',
        synthesized: false,
        wavGenerated: false,
        wavFormat: 'N/A',
        sampleRate: 0,
        bitDepth: 0,
        durationMs: 0,
        playbackVerified: false,
        checksumSha256: '',
        status: 'FAIL',
        failureReason: e.message,
      });
    } finally {
      setIsVerifyingOffline(false);
    }
  };

  const handleTestSynthesize = async (forceTier?: number) => {
    if (!testText.trim()) return;
    setIsSynthesizing(true);
    try {
      const result = await voiceProviderManager.synthesize({
        text: testText,
        voiceId: selectedModel?.id,
        speed: 1.0,
      }, forceTier);
      setLastAudioResult(result);

      // Playback test via Web Audio
      if (result.audioBuffer) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx({ sampleRate: 48000 });
        const source = ctx.createBufferSource();
        source.buffer = result.audioBuffer;
        source.connect(ctx.destination);
        source.start(0);
      }
    } catch (err: any) {
      alert(`Synthesis Error: ${err.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleApproveCurrentCue = async () => {
    if (!lastAudioResult || !lastAudioResult.masterWavBlob) {
      alert('Please synthesize and preview audio before approving.');
      return;
    }

    try {
      const cueId = `cue_${Date.now()}`;
      const approved: ApprovedCue = {
        id: cueId,
        text: testText,
        voiceId: selectedModel?.id || 'persian-female-neural-v1',
        durationMs: lastAudioResult.durationMs,
        masterWavPath: `/storage/cues/${cueId}_master.wav`,
        processedWavPath: `/storage/cues/${cueId}_playback.wav`,
        checksumSha256: lastAudioResult.checksumSha256,
        approvedAt: new Date().toISOString(),
        approvedBy: 'Director',
        loudness: lastAudioResult.loudnessMetrics || {
          integratedLufs: -18,
          loudnessRangeLu: 6,
          truePeakDbfs: -1.0,
        },
      };

      const response = await fetch(`/api/voice/cues/approve?id=${encodeURIComponent(cueId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'audio/wav' },
        body: lastAudioResult.masterWavBlob,
      });
      if (!response.ok) throw new Error(await response.text());
      approved.masterWavPath = `/api/voice/cues/${cueId}`;
      approved.processedWavPath = approved.masterWavPath;
      voiceProviderManager.registerApprovedCue(approved);
      setApprovedCues(voiceProviderManager.getApprovedCues());
      alert(`Cue "${approved.id}" successfully approved and cached as 48kHz 24-bit PCM WAV.`);
    } catch (e: any) {
      alert(`Approval error: ${e.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0b0e14] border border-[#2a3040] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-gray-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1f2533] flex items-center justify-between bg-gradient-to-r from-[#121622] to-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-wide text-white">VOICE CENTER — OFFLINE MASTER</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                  OFFLINE FIRST
                </span>
              </div>
              <p className="text-xs text-gray-400">Persian Female Neural Engine · 48 kHz 24-bit PCM Master · Zero-Internet Operation</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 bg-[#161a26] p-1 rounded-xl border border-[#232a3a]">
            <button
              onClick={() => setActiveTab('MODELS')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'MODELS' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              VOICE MODELS ({models.length})
            </button>
            <button
              onClick={() => setActiveTab('OFFLINE_VERIFY')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'OFFLINE_VERIFY' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              MANDATORY OFFLINE TEST
            </button>
            <button
              onClick={() => setActiveTab('APPROVED_CUES')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'APPROVED_CUES' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
              }`}
            >
              APPROVED CUES ({approvedCues.length})
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a202c] hover:bg-[#2d3748] flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <section className="rounded-xl border border-amber-500 p-4" dir="rtl">
            <h3 className="font-bold text-lg">دیالوگ آمادهٔ آفلاین روی همین گوشی</h3>
            <p className="text-sm mt-2">متن دیالوگ را پایین بنویسید و فایل WAV اجراشده با صدای گویندهٔ تأییدشده را وارد کنید. فایل داخل حافظهٔ همین مرورگر می‌ماند و دقیقاً برای همین متن بدون اتصال به سرور پخش و در خروجی گرافیکی ضبط می‌شود. این قابلیت تولید متن جدید با صدای زنانه نیست.</p>
            <textarea dir="rtl" rows={2} value={testText} onChange={(event) => setTestText(event.target.value)}
              aria-label="متن دیالوگ آفلاین" className="w-full rounded-lg bg-neutral-900 p-3 my-3" />
            <input type="file" accept="audio/wav,.wav" aria-label="فایل صوتی دیالوگ"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  const cue = await saveOfflineVoiceCue(testText, file);
                  setOfflineCueStatus(`فایل دیالوگ روی همین دستگاه ذخیره شد: ${cue.checksum.slice(0, 12)}…`);
                } catch (error) { setOfflineCueStatus(error instanceof Error ? error.message : 'ذخیره شکست خورد.'); }
                event.target.value = '';
              }} className="block w-full text-sm" />
            <button type="button" className="min-h-11 bg-amber-700 rounded-lg px-4 mt-3" onClick={async () => {
              try {
                const cue = await getOfflineVoiceCue(testText);
                if (!cue) throw new Error('برای این متن فایل WAV ذخیره نشده است.');
                await showAudioEngine.playVoiceWav(await cue.blob.arrayBuffer());
                setOfflineCueStatus('نمونه روی همین دستگاه پخش شد؛ صدای واقعی را با هدفون تأیید کنید.');
              } catch (error) { setOfflineCueStatus(error instanceof Error ? error.message : 'پخش شکست خورد.'); }
            }}>تست پخش محلی</button>
            {offlineCueStatus && <p role="status" className="text-amber-200 mt-2">{offlineCueStatus}</p>}
          </section>
          {diagnostic && <p role="alert" className="rounded-lg border border-red-500 p-3 text-sm text-red-200" dir="rtl">{diagnostic}</p>}
          
          {/* TAB 1: MODELS INVENTORY */}
          {activeTab === 'MODELS' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Models List */}
              <div className="md:col-span-1 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">INSTALLED VOICE ENGINES</h3>
                <div className="space-y-2">
                  {models.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedModel(m)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedModel?.id === m.id
                          ? 'bg-cyan-950/40 border-cyan-500 shadow-md'
                          : 'bg-[#121622] border-[#22283a] hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">{m.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          m.offlineReady ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {m.offlineReady ? 'نصب‌شده روی میزبان' : 'آماده نیست'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span>{m.engine}</span>
                        <span>•</span>
                        <span>{m.modelSizeFormatted}</span>
                        <span>•</span>
                        <span className="capitalize">{m.gender}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Model Details & Test Console */}
              <div className="md:col-span-2 bg-[#121622] border border-[#22283a] rounded-xl p-5 space-y-5">
                {selectedModel && (
                  <>
                    <div className="flex items-start justify-between border-b border-[#1f2533] pb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{selectedModel.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">{selectedModel.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-black/40 text-cyan-400 text-xs font-mono border border-cyan-500/20">
                          v{selectedModel.version}
                        </span>
                        <span className="px-2 py-1 rounded bg-black/40 text-gray-300 text-xs font-mono border border-gray-700">
                          {selectedModel.modelSizeFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Metadata Table */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/30 p-3 rounded-lg border border-[#1f2533] text-xs">
                      <div>
                        <div className="text-gray-500 font-mono">LANGUAGE</div>
                        <div className="font-bold text-white mt-0.5">{selectedModel.language} (Persian)</div>
                      </div>
                      <div>
                        <div className="text-gray-500 font-mono">GENDER</div>
                        <div className="font-bold text-white mt-0.5 capitalize">{selectedModel.gender}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 font-mono">BROADCAST FORMAT</div>
                        <div className="font-bold text-cyan-400 mt-0.5">48 kHz / 24-bit WAV</div>
                      </div>
                      <div>
                        <div className="text-gray-500 font-mono">STATUS</div>
                        <div className="font-bold text-amber-400 mt-0.5">{selectedModel.installed ? 'نصب‌شده، نیازمند تست صدا' : 'نصب نشده'}</div>
                      </div>
                    </div>

                    {/* Synthesis Test Rig */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Test Persian Cue</label>
                        <span className="text-[11px] text-gray-500">RTL colloquial Persian</span>
                      </div>
                      <textarea
                        value={testText}
                        onChange={(e) => setTestText(e.target.value)}
                        dir="rtl"
                        rows={2}
                        className="w-full bg-black/50 border border-[#2a3040] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-sans"
                        placeholder="متن فارسی را برای تست وارد کنید..."
                      />

                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => handleTestSynthesize()}
                          disabled={isSynthesizing}
                          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                          {isSynthesizing ? 'SYNTHESIZING 48kHz WAV...' : '▶ TEST PLAYBACK (TIER AUTO)'}
                        </button>
                        <button
                          onClick={() => handleTestSynthesize(1)}
                          disabled={isSynthesizing}
                          className="px-3 py-2 rounded-lg bg-[#1f2638] hover:bg-[#2c364e] text-cyan-300 font-bold text-xs border border-cyan-500/30 transition-all disabled:opacity-50"
                        >
                          FORCE TIER 1 (LOCAL NEURAL)
                        </button>
                        <button
                          onClick={handleApproveCurrentCue}
                          disabled={!lastAudioResult}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs ml-auto transition-all disabled:opacity-40"
                        >
                          ★ APPROVE AS MASTER CUE
                        </button>
                      </div>

                      {/* Result Inspector */}
                      {lastAudioResult && (
                        <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-3 space-y-2 mt-3 text-xs">
                          <div className="flex items-center justify-between text-cyan-400 font-bold">
                            <span>SYNTHESIS COMPLETE ({lastAudioResult.durationMs}ms)</span>
                            <span className="font-mono text-gray-400 text-[10px]">{lastAudioResult.format}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-300">
                            <div>Provider: <span className="text-white font-mono">{lastAudioResult.providerId}</span></div>
                            <div>Tier: <span className="text-white font-bold">Tier {lastAudioResult.tier}</span></div>
                            <div>Offline: <span className="text-green-400 font-bold">{lastAudioResult.isOffline ? 'YES' : 'NO'}</span></div>
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono truncate">
                            SHA-256: {lastAudioResult.checksumSha256}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MANDATORY OFFLINE VERIFICATION DRILL */}
          {activeTab === 'OFFLINE_VERIFY' && (
            <div className="space-y-5">
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-4">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-bold text-amber-400 text-sm">MANDATORY OFFLINE VERIFICATION SUITE</h4>
                  <p className="text-xs text-gray-300 mt-1">
                    این تست تولید فایل WAV روی سرور محلی را بررسی می‌کند. قطع اینترنت، جنسیت صدا و شنیدن صدای واقعی باید جداگانه روی دستگاه فیلم‌برداری تأیید شوند.
                  </p>
                </div>
                <button
                  onClick={handleRunOfflineVerification}
                  disabled={isVerifyingOffline}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider ml-auto shadow-lg disabled:opacity-50"
                >
                  {isVerifyingOffline ? 'VERIFYING...' : 'RUN OFFLINE TEST'}
                </button>
              </div>

              {/* Report Display */}
              {verificationReport && (
                <div className={`p-5 rounded-xl border ${
                  verificationReport.status === 'PASS'
                    ? 'bg-green-950/20 border-green-500/50'
                    : 'bg-red-950/20 border-red-500/50'
                } space-y-4`}>
                  <div className="flex items-center justify-between border-b border-[#2a3040] pb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${verificationReport.status === 'PASS' ? 'text-green-400' : 'text-red-400'}`}>
                        {verificationReport.status === 'PASS' ? '✔' : '✖'}
                      </span>
                      <div>
                        <h4 className="font-black text-base text-white tracking-wide">
                          OFFLINE VERIFICATION {verificationReport.status}
                        </h4>
                        <span className="text-xs text-gray-400 font-mono">{verificationReport.timestamp}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-black tracking-wider ${
                      verificationReport.status === 'PASS' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                    }`}>
                      {verificationReport.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="bg-black/40 p-2.5 rounded-lg border border-[#2a3040]">
                      <div className="text-gray-500 text-[10px]">NETWORK ISOLATION</div>
                      <div className="text-amber-400 font-bold mt-1">{verificationReport.networkBlocked ? 'تأیید شد' : 'در این تست بررسی نشد'}</div>
                    </div>
                    <div className="bg-black/40 p-2.5 rounded-lg border border-[#2a3040]">
                      <div className="text-gray-500 text-[10px]">LOCAL MODEL</div>
                      <div className="text-white font-bold mt-1 truncate">{verificationReport.modelName}</div>
                    </div>
                    <div className="bg-black/40 p-2.5 rounded-lg border border-[#2a3040]">
                      <div className="text-gray-500 text-[10px]">WAV FORMAT</div>
                      <div className="text-cyan-400 font-bold mt-1">{verificationReport.wavFormat}</div>
                    </div>
                    <div className="bg-black/40 p-2.5 rounded-lg border border-[#2a3040]">
                      <div className="text-gray-500 text-[10px]">PLAYBACK TEST</div>
                      <div className="text-green-400 font-bold mt-1">{verificationReport.playbackVerified ? 'VERIFIED' : 'FAILED'}</div>
                    </div>
                  </div>

                  <div className="bg-black/50 p-3 rounded-lg border border-[#2a3040] space-y-1 text-xs">
                    <div className="text-gray-400">Synthesized Test Phrase:</div>
                    <div className="text-white font-sans text-sm" dir="rtl">{verificationReport.testPhrase}</div>
                    <div className="text-[10px] text-gray-500 font-mono pt-1">
                      Checksum SHA-256: {verificationReport.checksumSha256}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: APPROVED PRODUCTION CUES */}
          {activeTab === 'APPROVED_CUES' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  TIER 0 PRE-RENDERED PRODUCTION CUES ({approvedCues.length})
                </h4>
                <span className="text-xs text-emerald-400 font-mono">48kHz 24-bit PCM WAV Master</span>
              </div>

              <div className="divide-y divide-[#1f2533] border border-[#22283a] rounded-xl overflow-hidden bg-[#121622]">
                {approvedCues.map((cue) => (
                  <div key={cue.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{cue.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          APPROVED
                        </span>
                        <span className="text-xs text-gray-400 font-mono">{cue.durationMs}ms</span>
                      </div>
                      <p className="text-xs text-gray-300 font-sans" dir="rtl">{cue.text}</p>
                      <div className="text-[10px] text-gray-500 font-mono">
                        Target: {cue.loudness.integratedLufs} LUFS · Peak: {cue.loudness.truePeakDbfs} dBFS
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        voiceProviderManager.synthesize({ text: cue.text, cueId: cue.id }, 0).then((res) => {
                          if (res.audioBuffer) {
                            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                            const ctx = new AudioCtx({ sampleRate: 48000 });
                            const source = ctx.createBufferSource();
                            source.buffer = res.audioBuffer;
                            source.connect(ctx.destination);
                            source.start(0);
                          }
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition-all"
                    >
                      ▶ PLAY CUE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2533] bg-[#0c0f17] flex items-center justify-between text-xs text-gray-400">
          <div>
            System Engine: <span className="text-cyan-400 font-mono font-bold">Piper ONNX Neural + eSpeak Formant Fallback</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
