import React, { useState, useEffect } from 'react';
import { themeEngine, THEME_CONFIGS, ThemeId, EpisodeThemeConfig } from '../../engine/themeEngine';
import { Palette, Check, ShieldCheck, Sparkles, X, Sun, Moon } from 'lucide-react';

interface ThemeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeManagerModal: React.FC<ThemeManagerModalProps> = ({ isOpen, onClose }) => {
  const [activeTheme, setActiveTheme] = useState<EpisodeThemeConfig>(() => themeEngine.getActiveTheme());

  useEffect(() => {
    return themeEngine.subscribe((theme) => {
      setActiveTheme(theme);
    });
  }, []);

  if (!isOpen) return null;

  const handleSelect = (id: ThemeId) => {
    themeEngine.setTheme(id);
  };

  const themes = Object.values(THEME_CONFIGS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className="w-full max-w-2xl bg-neutral-900 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-white font-['Vazirmatn']">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 border border-cyan-500 flex items-center justify-center text-cyan-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-cyan-300 flex items-center gap-2">
                <span>موتور تم و گرافیک پخش زنده (THEME ENGINE)</span>
              </h2>
              <p className="text-xs text-neutral-400">
                تغییر استایل بصری، نورپردازی تماشاگر، شیشه‌ای مایع و امنیت رنگ کروماکی
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

        {/* Chroma Safety Verification Banner */}
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>امنیت کروماکی فعال است: رنگ رزرو شده (#FF00FF) در تم‌ها و المان‌ها مسدود شده است.</span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-300 font-bold">
            CHROMA-SAFE
          </span>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {themes.map((t) => {
            const isSelected = activeTheme.id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelect(t.id)}
                className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-3 relative overflow-hidden ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                    : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-sm text-white flex items-center gap-1.5">
                      <span>{t.persianName}</span>
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
                    {t.description}
                  </p>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: t.primaryAccent }} title="Accent" />
                    <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: t.eliasAccent }} title="Elias Red" />
                    <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: t.emadAccent }} title="Emad Green" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 mr-auto">
                    {t.fontFamily.split(',')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow-md transition"
          >
            تایید و بستن
          </button>
        </div>
      </div>
    </div>
  );
};
