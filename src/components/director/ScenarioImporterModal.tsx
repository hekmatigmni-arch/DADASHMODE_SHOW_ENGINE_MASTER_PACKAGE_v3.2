import React, { useState } from 'react';
import { storyEngine, EpisodeScenario } from '../../engine/storyEngine';
import { GameRound } from '../../types/game';
import {
  BookOpen,
  Film,
  Upload,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  X,
  Plus,
  Play,
} from 'lucide-react';

interface ScenarioImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRound?: (round: GameRound) => void;
  onApplyEpisode?: (episode: EpisodeScenario) => void;
}

export const ScenarioImporterModal: React.FC<ScenarioImporterModalProps> = ({
  isOpen,
  onClose,
  onSelectRound,
  onApplyEpisode,
}) => {
  const [episodes, setEpisodes] = useState<EpisodeScenario[]>(() => storyEngine.getEpisodes());
  const [selectedEp, setSelectedEp] = useState<EpisodeScenario>(() => storyEngine.getCurrentEpisode());
  const [importText, setImportText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [showImportForm, setShowImportForm] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectEpisode = (ep: EpisodeScenario) => {
    storyEngine.setEpisode(ep.id);
    setSelectedEp(ep);
    onApplyEpisode?.(ep);
  };

  const handleImportSubmit = () => {
    setImportError(null);
    setImportSuccess(false);

    if (!importText.trim()) {
      setImportError('لطفاً متن اسکریپت یا JSON سناریو را وارد کنید.');
      return;
    }

    const res = storyEngine.importScenarioFromText(importText);
    if (res.success && res.episode) {
      onApplyEpisode?.(res.episode);
      setEpisodes(storyEngine.getEpisodes());
      setSelectedEp(res.episode);
      setImportSuccess(true);
      setShowImportForm(false);
      setImportText('');
      setTimeout(() => setImportSuccess(false), 3000);
    } else {
      setImportError(res.error || 'خطا در بارگذاری اسکریپت');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className="w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-purple-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 overflow-hidden text-white font-['Vazirmatn']">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500 flex items-center justify-center text-purple-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-purple-300 flex items-center gap-2">
                <span>موتور داستان و سناریوی مسابقه (STORY & SCRIPT ENGINE)</span>
                {importSuccess && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500 flex items-center gap-1">
                    <Check className="w-3 h-3" /> سناریو بارگذاری شد
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-400">
                انتخاب اپیزود، وارد کردن فیلمنامه جدید و مدیریت راندهای رسمی مسابقه
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {episodes.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => handleSelectEpisode(ep)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  selectedEp.id === ep.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-black'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-white border border-neutral-700/60'
                }`}
              >
                <span>اپیزود {ep.episodeNumber}:</span>
                <span className="truncate max-w-[140px]">{ep.title}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowImportForm(!showImportForm)}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
          >
            <Upload className="w-4 h-4" />
            <span>{showImportForm ? 'بستن فرم' : 'وارد کردن اسکریپت جدید'}</span>
          </button>
        </div>

        {/* Import Script Form */}
        {showImportForm && (
          <div className="p-4 bg-neutral-950 border border-purple-500/40 rounded-2xl flex flex-col gap-3 animate-in fade-in">
            <div className="text-xs font-bold text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>ورود سناریو (پشتیبانی از متن فیلمنامه یا ساختار JSON):</span>
            </div>
            <textarea
              rows={5}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`نمونه اسکریپت:\n# اپیزود جدید: چالش در ارتفاع\n## راند ۱: تعادل روی خط باریک\nزمان: ۳۰ ثانیه\nجایزه: ۱۵ ثانیه\n\nیا ساختار JSON با فیلدهای title و rounds...`}
              className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-xl text-xs font-mono text-white leading-relaxed focus:border-purple-400 outline-none"
            />
            <label className="text-sm">یا فایل سناریو/دفتر کارگردانی را وارد کنید (.json, .md, .txt):
              <input type="file" accept=".json,.md,.txt,application/json,text/plain,text/markdown"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (file.size > 1024 * 1024) { setImportError('فایل سناریو باید کمتر از یک مگابایت باشد.'); return; }
                  setImportText(await file.text()); setImportError(null);
                }} className="block mt-2 w-full" />
            </label>
            {importError && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 p-2 rounded-lg">
                {importError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportForm(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>بارگذاری و ایجاد اپیزود</span>
              </button>
            </div>
          </div>
        )}

        {/* Selected Episode Details */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-purple-400">اپیزود فعال:</div>
              <div className="text-base sm:text-lg font-black text-white">{selectedEp.persianTitle}</div>
              <div className="text-xs text-neutral-400 mt-0.5">{selectedEp.tagline}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono">
                {selectedEp.rounds.length} راند ثبت شده
              </span>
            </div>
          </div>

          {/* Rounds List */}
          <div className="rounded-xl bg-neutral-950 p-4 text-sm">
            <h3 className="font-bold">یادآور صحنه و دیالوگ</h3>
            {selectedEp.scenes?.map((scene) => <div key={scene.id} className="my-3">
              <p className="font-bold">{scene.title} | {scene.roundId}</p><p>{scene.directions}</p>
              {selectedEp.dialogues?.filter((dialogue) => dialogue.sceneId === scene.id).map((dialogue) =>
                <p key={dialogue.id} className="mt-1 text-amber-200">{dialogue.speaker}: {dialogue.text} ({dialogue.emotion || 'لحن آزاد'})</p>)}
            </div>)}
            {!selectedEp.scenes?.length && <p className="text-neutral-400 mt-2">این اپیزود هنوز فهرست صحنه و دیالوگ ساختاریافته ندارد؛ متن خام فقط برای مطالعه ذخیره می‌شود.</p>}
            {selectedEp.directorBook && <details className="mt-3"><summary>متن دفتر کارگردانی</summary><pre className="whitespace-pre-wrap text-xs mt-2">{selectedEp.directorBook}</pre></details>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedEp.rounds.map((round) => (
              <div
                key={round.id}
                className="p-3 rounded-2xl bg-neutral-950/50 border border-neutral-800/80 hover:border-purple-500/50 transition flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-black text-purple-400">
                      راند {round.number}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-neutral-800 text-amber-300">
                      ⏱ {round.defaultTimerSeconds} ثانیه | 🎁 +{round.rewardSeconds}s
                    </span>
                  </div>
                  <div className="font-bold text-xs text-white mb-1">
                    {round.persianTitle || round.title}
                  </div>
                  <div className="text-[11px] text-neutral-400 leading-snug">
                    {round.persianRule || round.rule}
                  </div>
                </div>

                {onSelectRound && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectRound(round);
                      onClose();
                    }}
                    className="mt-2 py-1.5 px-3 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>انتقال مستقیم مسابقه به این راند</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
