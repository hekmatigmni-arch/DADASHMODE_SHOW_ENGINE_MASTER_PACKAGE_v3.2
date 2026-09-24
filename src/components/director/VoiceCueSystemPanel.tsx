import React, { useState, useEffect } from 'react';
import {
  voiceCueEngine,
  VoiceItem,
  FEMALE_VOICE_OPTIONS,
} from '../../engine/voiceCueEngine';
import { VoiceEmotion, VoiceStyle } from '../../types/showEngine';
import {
  Volume2,
  Play,
  Save,
  Trash2,
  Plus,
  Sliders,
  Radio,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';

interface VoiceCueSystemPanelProps {
  onPlayDuringShow?: (item: VoiceItem) => void;
  className?: string;
}

export const VoiceCueSystemPanel: React.FC<VoiceCueSystemPanelProps> = ({
  onPlayDuringShow,
  className = '',
}) => {
  const [items, setItems] = useState<VoiceItem[]>(() => voiceCueEngine.getItems());
  const [activeTab, setActiveTab] = useState<'all' | 'rounds' | 'referee' | 'custom'>('all');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState<string>('');
  const [editingItem, setEditingItem] = useState<VoiceItem | null>(null);
  const [saveSuccessId, setSaveSuccessId] = useState<string | null>(null);

  useEffect(() => {
    return voiceCueEngine.subscribeSpeaking((speaking, text) => {
      setIsSpeaking(speaking);
      setCurrentSpeakingText(text || '');
    });
  }, []);

  const refreshItems = () => {
    setItems(voiceCueEngine.getItems());
  };

  const handlePreview = async (item: VoiceItem) => {
    await voiceCueEngine.previewItem(item);
  };

  const handlePlayShow = async (item: VoiceItem) => {
    if (onPlayDuringShow) onPlayDuringShow(item);
    await voiceCueEngine.playDuringShow(item);
  };

  const handleSaveItem = (itemToSave: VoiceItem) => {
    voiceCueEngine.saveItem(itemToSave);
    refreshItems();
    setSaveSuccessId(itemToSave.id);
    setTimeout(() => setSaveSuccessId(null), 2000);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    voiceCueEngine.deleteItem(id);
    refreshItems();
  };

  const startCreateNew = () => {
    const newItem: VoiceItem = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: 'فرمان صوتی جدید',
      persianText: 'متن جدید داور مسابقه...',
      voiceName: 'Kore',
      emotion: 'hype',
      speed: 1.1,
      pauseMs: 400,
      energy: 9,
      style: 'referee',
      soundEffectTrigger: 'countdown_beep',
      isSystemDefault: false,
    };
    setEditingItem(newItem);
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'rounds') return item.id.includes('round');
    if (activeTab === 'referee') return !item.id.includes('round') && item.isSystemDefault;
    if (activeTab === 'custom') return !item.isSystemDefault;
    return true;
  });

  return (
    <div
      id="voice-cue-system-panel"
      className={`w-full bg-neutral-900/90 border border-amber-500/40 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col gap-3.5 ${className}`}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-black font-black shadow-md">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-['Vazirmatn'] font-black text-sm text-amber-300 flex items-center gap-2">
              <span>سیستم فرمان‌های صوتی زنانه مسابقه (VOICE ENGINE)</span>
              {isSpeaking && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] animate-pulse font-mono font-bold">
                  <Radio className="w-3 h-3 animate-ping" />
                  <span>در حال پخش زنده</span>
                </span>
              )}
            </div>
            <div className="text-[11px] text-neutral-400">
              اجرای دقیق اسکریپت با صدای زنانه، تنظیم احساسات، سرعت، مکث و پیش‌نمایش
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={startCreateNew}
          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>فرمان صوتی جدید</span>
        </button>
      </div>

      {/* Live Speaking Banner if active */}
      {isSpeaking && currentSpeakingText && (
        <div className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/60 flex items-center justify-between text-xs text-emerald-200 font-['Vazirmatn'] shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold">در حال اجرا:</span>
            <span className="italic truncate max-w-xs sm:max-w-md">«{currentSpeakingText}»</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 font-bold">ON AIR</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-neutral-800 text-xs font-['Vazirmatn'] font-bold">
        {[
          { id: 'all', label: 'همه فرمان‌ها' },
          { id: 'rounds', label: 'راندهای مسابقه' },
          { id: 'referee', label: 'داوری و خطای VAR' },
          { id: 'custom', label: 'فرمان‌های اختصاصی کارگردان' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center ${
              activeTab === tab.id
                ? 'bg-amber-500 text-black shadow-md font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Edit / Create Custom Item Modal or Drawer */}
      {editingItem && (
        <div className="p-3.5 bg-neutral-950 border-2 border-amber-400/80 rounded-2xl flex flex-col gap-3 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="font-['Vazirmatn'] font-black text-sm text-yellow-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>ویرایش / تنظیم فرمان صوتی</span>
            </span>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="text-neutral-400 hover:text-white text-xs"
            >
              انصراف
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                عنوان فرمان:
              </label>
              <input
                type="text"
                value={editingItem.label}
                onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-['Vazirmatn']"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                انتخاب صدای زنانه:
              </label>
              <select
                value={editingItem.voiceName}
                onChange={(e) => setEditingItem({ ...editingItem, voiceName: e.target.value })}
                className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-amber-300 font-bold"
              >
                {FEMALE_VOICE_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.persianLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-300 block mb-1">
              متن اسکریپت فارسی (دقیقاً خوانده می‌شود):
            </label>
            <textarea
              rows={2}
              value={editingItem.persianText}
              onChange={(e) => setEditingItem({ ...editingItem, persianText: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-['Vazirmatn'] text-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                حس و لحن گفتار:
              </label>
              <select
                value={editingItem.emotion}
                onChange={(e) => setEditingItem({ ...editingItem, emotion: e.target.value as VoiceEmotion })}
                className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white"
              >
                <option value="hype">🔥 پرانرژی و هیجانی (Hype)</option>
                <option value="dramatic">⚡ دراماتیک و حساس (Dramatic)</option>
                <option value="referee_strict">⚖️ قاطع و جدی (Strict Referee)</option>
                <option value="calm">🕊️ آرام و مطمئن (Calm)</option>
                <option value="sarcastic">😏 کنایه‌آمیز (Sarcastic)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-neutral-300 mb-1">
                <span>سرعت بیان:</span>
                <span className="font-mono text-amber-400">{editingItem.speed}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={editingItem.speed}
                onChange={(e) => setEditingItem({ ...editingItem, speed: parseFloat(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-bold text-neutral-300 mb-1">
                <span>مکث پس از اجرا:</span>
                <span className="font-mono text-cyan-400">{editingItem.pauseMs}ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="100"
                value={editingItem.pauseMs}
                onChange={(e) => setEditingItem({ ...editingItem, pauseMs: parseInt(e.target.value, 10) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => handlePreview(editingItem)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-lg font-bold flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>پیش‌نمایش صدا (Preview)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveItem(editingItem)}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-lg shadow flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>ذخیره فرمان (Save)</span>
            </button>
          </div>
        </div>
      )}

      {/* Voice Items List */}
      <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
              saveSuccessId === item.id
                ? 'bg-emerald-950/40 border-emerald-400'
                : 'bg-black/50 hover:bg-neutral-900/60 border-neutral-800'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-['Vazirmatn'] font-black text-xs text-white">
                  {item.label}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-500/40">
                  {item.voiceName}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {item.speed}x
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-cyan-300">
                  +{item.pauseMs}ms
                </span>
              </div>
              <div className="font-['Vazirmatn'] text-xs text-neutral-300 leading-snug">
                «{item.persianText}»
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handlePreview(item)}
                title="پیش‌نمایش تست صدا"
                className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition"
              >
                <Play className="w-3.5 h-3.5" />
                <span>پیش‌نمایش</span>
              </button>

              <button
                type="button"
                onClick={() => setEditingItem({ ...item })}
                title="ویرایش سرعت، مکث و متن"
                className="px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>تنظیم</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlayShow(item)}
                title="پخش مستقیم در مسابقه زنده و ضبط"
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-black font-black text-xs rounded-lg shadow-md flex items-center gap-1.5 active:scale-95 transition"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>پخش در شو</span>
              </button>

              {!item.isSystemDefault && (
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
