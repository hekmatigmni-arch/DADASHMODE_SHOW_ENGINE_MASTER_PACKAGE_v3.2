import React from 'react';
import {
  SmartModulesState,
  CompetitionPresetType,
  ModuleStatus,
} from '../../types/showEngine';
import { PRESET_SMART_MODULES } from '../../data/showScenarios';
import {
  Sliders,
  Eye,
  EyeOff,
  Ban,
  X,
  Tv,
  Camera,
  Layers,
  Sparkles,
  Shield,
  RotateCcw,
} from 'lucide-react';

interface SmartModuleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  modules: SmartModulesState;
  onChangeModules: (modules: SmartModulesState) => void;
}

export const SmartModuleConfigModal: React.FC<SmartModuleConfigModalProps> = ({
  isOpen,
  onClose,
  modules,
  onChangeModules,
}) => {
  if (!isOpen) return null;

  const handleToggle = (key: keyof SmartModulesState, nextStatus: ModuleStatus) => {
    onChangeModules({
      ...modules,
      [key]: nextStatus,
    });
  };

  const handleApplyPreset = (preset: CompetitionPresetType) => {
    onChangeModules(PRESET_SMART_MODULES[preset]);
  };

  const moduleLabels: Record<
    keyof SmartModulesState,
    { persian: string; english: string }
  > = {
    refereeBadge: { persian: 'نشان وضعیت داور هوش مصنوعی', english: 'AI Referee Status Badge' },
    roundCard: { persian: 'کارت عنوان و قوانین راند', english: 'Round Title & Rules Card' },
    timerHero: { persian: 'شمارنده بزرگ زمان مسابقه', english: 'Challenge Countdown Hero' },
    playerElias: { persian: 'بانک زمان الیاس (تیم قرمز)', english: 'Player Elias Time Bank (Red)' },
    playerEmad: { persian: 'بانک زمان عماد (تیم سبز)', english: 'Player Emad Time Bank (Green)' },
    stageDiagram: { persian: 'دیاگرام گرافیکی استیج و چالش', english: 'Visual Stage Diagram' },
    bottomTicker: { persian: 'نوار زنده اطلاعیه‌های مسابقه', english: 'Broadcast News Ticker' },
    brandWatermark: { persian: 'واترمارک و لوگوی داداش‌مد', english: 'DadashMode Watermark' },
    safeAreaGuides: { persian: 'خطوط راهنمای کادر امن دوربین', english: 'Action/Title Safe Guides' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-[#0e0e14] border border-white/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Vazirmatn'] text-xl font-black text-white">
                سیستم ماژول‌های هوشمند (Smart Module System)
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                DYNAMIC COMPONENT VISIBILITY & BROADCAST PRESETS
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col gap-2">
          <span className="font-mono text-[11px] text-neutral-400 uppercase">
            COMPETITION TYPE PRESETS:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleApplyPreset('FULL_TV_BROADCAST')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-xs font-bold">
                <Tv className="w-3.5 h-3.5" />
                <span>FULL TV</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-['Vazirmatn']">پخش کامل تلویزیونی</span>
            </button>

            <button
              onClick={() => handleApplyPreset('MINIMAL_CREATOR_HUD')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-amber-300 font-mono text-xs font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>MINIMAL HUD</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-['Vazirmatn']">حداقل اشغال تصویر</span>
            </button>

            <button
              onClick={() => handleApplyPreset('OUTDOOR_ACTION')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-xs font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>OUTDOOR</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-['Vazirmatn']">چالش‌های پرتحرک</span>
            </button>

            <button
              onClick={() => handleApplyPreset('SPONSOR_CLEAN')}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all"
            >
              <div className="flex items-center gap-1.5 text-purple-300 font-mono text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CLEAN FEED</span>
              </div>
              <span className="text-[10px] text-neutral-400 font-['Vazirmatn']">فید تمیز تدوین</span>
            </button>
          </div>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {(Object.keys(modules) as Array<keyof SmartModulesState>).map((key) => {
            const currentStatus = modules[key];
            const meta = moduleLabels[key];

            return (
              <div
                key={key}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <h4 className="font-['Vazirmatn'] text-sm font-bold text-white">
                    {meta.persian}
                  </h4>
                  <span className="font-mono text-[10px] text-neutral-400 uppercase">
                    {meta.english}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
                  <button
                    onClick={() => handleToggle(key, 'visible')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                      currentStatus === 'visible'
                        ? 'bg-cyan-500 text-black shadow-lg'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>VISIBLE</span>
                  </button>

                  <button
                    onClick={() => handleToggle(key, 'hidden')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                      currentStatus === 'hidden'
                        ? 'bg-amber-500 text-black shadow-lg'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>HIDDEN</span>
                  </button>

                  <button
                    onClick={() => handleToggle(key, 'disabled')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                      currentStatus === 'disabled'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Ban className="w-3 h-3" />
                    <span>DISABLED</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
