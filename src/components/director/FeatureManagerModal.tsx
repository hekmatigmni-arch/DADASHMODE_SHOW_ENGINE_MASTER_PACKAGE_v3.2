import React, { useState } from 'react';
import { featureManager, SystemModule } from '../../engine/featureManager';
import { Sliders, Check, Archive, Eye, EyeOff, X } from 'lucide-react';

interface FeatureManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeatureManagerModal: React.FC<FeatureManagerModalProps> = ({ isOpen, onClose }) => {
  const [modules, setModules] = useState<SystemModule[]>(() => [...featureManager.getModules()]);

  if (!isOpen) return null;

  const toggle = (id: string) => {
    featureManager.toggleModule(id);
    setModules([...featureManager.getModules()]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white font-['Vazirmatn']">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                مدیریت ماژول‌ها و آرشیو سیستم (FEATURE MANAGER)
              </h2>
              <p className="text-xs text-neutral-400">
                ماژول‌های بدون استفاده در آرشیو غیرفعال نگهداری می‌شوند و هرگز حذف نمی‌شوند.
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

        {/* Modules List */}
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {modules.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                m.enabled
                  ? 'bg-neutral-950/70 border-neutral-700'
                  : 'bg-neutral-950/30 border-neutral-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-xs text-white">{m.persianName}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    m.category === 'LEGACY'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {m.category}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400">{m.description}</div>
              </div>

              <button
                type="button"
                onClick={() => toggle(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  m.enabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400'
                }`}
              >
                {m.enabled ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>فعال</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>غیرفعال</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
