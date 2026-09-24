import React from 'react';
import { CompetitionScenario } from '../../types/showEngine';
import { BUILT_IN_SCENARIOS } from '../../data/showScenarios';
import {
  Layers,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  Award,
  ChevronRight,
  X,
  Play,
} from 'lucide-react';

interface ScenarioSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenarioId: string;
  onSelectScenario: (scenario: CompetitionScenario) => void;
  scenarios?: CompetitionScenario[];
}

export const ScenarioSelectorModal: React.FC<ScenarioSelectorModalProps> = ({
  isOpen,
  onClose,
  activeScenarioId,
  onSelectScenario,
  scenarios = BUILT_IN_SCENARIOS,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl bg-[#0f0f16] border border-white/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Vazirmatn'] text-xl font-black text-white">
                انتخاب سناریوی مسابقه (Game Director Scenarios)
              </h2>
              <p className="text-xs text-neutral-400 font-['Vazirmatn']">
                تغییر سناریو به صورت خودکار تمام راندها، قوانین، صداها و تایمرها را کالیبره می‌کند.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {BUILT_IN_SCENARIOS.map((scenario) => {
            const isSelected = scenario.id === activeScenarioId;

            return (
              <div
                key={scenario.id}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-400 shadow-[0_0_30px_rgba(255,196,0,0.3)]'
                    : 'bg-black/40 border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono text-[10px] uppercase font-bold">
                        {scenario.category}
                      </span>
                      <h3 className="font-['Vazirmatn'] text-lg font-black text-white">
                        {scenario.persianName}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-amber-300/80 block mt-0.5">
                      {scenario.name}
                    </span>
                    <p className="text-xs text-neutral-300 font-['Vazirmatn'] mt-2 max-w-xl">
                      {scenario.persianDescription}
                    </p>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-400/40">
                      <CheckCircle2 className="w-4 h-4" />
                      ACTIVE SCENARIO
                    </span>
                  )}
                </div>

                {/* Scenario Specs Badges */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/10 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{scenario.rounds.length} ROUNDS</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{scenario.defaultTimerSeconds}s TIMER</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{scenario.initialPlayerSeconds.ELIAS}s BANK</span>
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => {
                      onSelectScenario(scenario);
                      onClose();
                    }}
                    className={`px-5 py-2 rounded-xl font-mono font-bold text-xs flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-black shadow-lg hover:bg-amber-300'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {isSelected ? 'LOADED / بارگذاری شده' : 'ACTIVATE SCENARIO / فعال‌سازی'}
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
