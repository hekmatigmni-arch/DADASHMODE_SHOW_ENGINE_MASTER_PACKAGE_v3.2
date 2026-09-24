import { FC, useState } from 'react';
import { GameState, GameRound, PlayerId } from '../types/game';
import { X, Sliders, Trophy, Plus, Minus, Check, Gift, Skull, RotateCcw } from 'lucide-react';

interface ManualOverrideModalProps {
  isOpen: boolean;
  state: GameState;
  rounds: GameRound[];
  onClose: () => void;
  onSetScore: (player: PlayerId, seconds: number) => void;
  onAddTime: (player: PlayerId, seconds: number) => void;
  onSubtractTime: (player: PlayerId, seconds: number) => void;
  onSelectRound: (roundNumber: number) => void;
  onDeclareWinner: (player: PlayerId) => void;
  onDeclareTie: () => void;
  onRollMysteryBox: () => void;
  onDrawSabotage: (player?: PlayerId) => void;
  onResetGame: () => void;
}

export const ManualOverrideModal: FC<ManualOverrideModalProps> = ({
  isOpen,
  state,
  rounds,
  onClose,
  onSetScore,
  onAddTime,
  onSubtractTime,
  onSelectRound,
  onDeclareWinner,
  onDeclareTie,
  onRollMysteryBox,
  onDrawSabotage,
  onResetGame,
}) => {
  const [eliasInput, setEliasInput] = useState<string>(String(state.players.ELIAS.seconds));
  const [emadInput, setEmadInput] = useState<string>(String(state.players.EMAD.seconds));

  if (!isOpen) return null;

  return (
    <div
      id="manual-override-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md"
    >
      <div className="w-full max-w-md bg-neutral-950 border-2 border-yellow-400 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-yellow-400 text-black px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-black" />
            <span className="font-black text-base uppercase tracking-wider">
              MANUAL OVERRIDE • کنترل دستی داور
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          {/* 1. Direct Score Editing */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-wide">
              ۱. تنظیم مستقیم امتیازات (SCORE OVERRIDE):
            </span>

            {/* Elias (RED) */}
            <div className="bg-red-950/70 border border-red-500 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm">الیاس (ELIAS - RED)</span>
                <span className="text-red-300 font-mono text-xs">فعلی: {state.players.ELIAS.seconds}s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  value={eliasInput}
                  onChange={(e) => setEliasInput(e.target.value)}
                  className="flex-1 bg-black border border-red-500 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
                  placeholder="ثانیه"
                />
                <button
                  type="button"
                  onClick={() => onSetScore('ELIAS', Number(eliasInput) || 0)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-lg uppercase"
                >
                  ثبت امتیاز
                </button>
              </div>
              <div className="flex items-center gap-1">
                {[+1, +5, +10].map((s) => (
                  <button
                    key={`elias-plus-${s}`}
                    type="button"
                    onClick={() => onAddTime('ELIAS', s)}
                    className="flex-1 py-1 bg-neutral-900 hover:bg-neutral-800 text-emerald-400 font-bold text-xs rounded border border-neutral-700"
                  >
                    +{s}s
                  </button>
                ))}
                {[-1, -5, -10].map((s) => (
                  <button
                    key={`elias-min-${s}`}
                    type="button"
                    onClick={() => onSubtractTime('ELIAS', Math.abs(s))}
                    className="flex-1 py-1 bg-neutral-900 hover:bg-neutral-800 text-red-400 font-bold text-xs rounded border border-neutral-700"
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>

            {/* Emad (GREEN) */}
            <div className="bg-emerald-950/70 border border-emerald-500 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-sm">عماد (EMAD - GREEN)</span>
                <span className="text-emerald-300 font-mono text-xs">فعلی: {state.players.EMAD.seconds}s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  value={emadInput}
                  onChange={(e) => setEmadInput(e.target.value)}
                  className="flex-1 bg-black border border-emerald-500 rounded-lg px-3 py-1.5 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  placeholder="ثانیه"
                />
                <button
                  type="button"
                  onClick={() => onSetScore('EMAD', Number(emadInput) || 0)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-lg uppercase"
                >
                  ثبت امتیاز
                </button>
              </div>
              <div className="flex items-center gap-1">
                {[+1, +5, +10].map((s) => (
                  <button
                    key={`emad-plus-${s}`}
                    type="button"
                    onClick={() => onAddTime('EMAD', s)}
                    className="flex-1 py-1 bg-neutral-900 hover:bg-neutral-800 text-emerald-400 font-bold text-xs rounded border border-neutral-700"
                  >
                    +{s}s
                  </button>
                ))}
                {[-1, -5, -10].map((s) => (
                  <button
                    key={`emad-min-${s}`}
                    type="button"
                    onClick={() => onSubtractTime('EMAD', Math.abs(s))}
                    className="flex-1 py-1 bg-neutral-900 hover:bg-neutral-800 text-red-400 font-bold text-xs rounded border border-neutral-700"
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Round Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-wide">
              ۲. پرش به راند مسابقه (SELECT ROUND):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {rounds.map((r, i) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRound(i + 1)}
                  className={`p-2 rounded-lg text-left text-xs font-bold border transition ${
                    state.currentRoundIndex === i
                      ? 'bg-yellow-400 text-black border-yellow-200'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  <div className="truncate font-['Vazirmatn']">{r.persianTitle}</div>
                  <div className="text-[10px] opacity-75">{r.defaultTimerSeconds}s</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Declare Winner / End Game */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-wide">
              ۳. اعلام برنده نهایی (DECLARE WINNER):
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => onDeclareWinner('ELIAS')}
                className="py-2 bg-red-700 hover:bg-red-600 text-white font-black text-xs rounded-lg border border-red-400 uppercase flex items-center justify-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5" />
                برنده: الیاس
              </button>
              <button
                type="button"
                onClick={() => onDeclareWinner('EMAD')}
                className="py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-lg border border-emerald-400 uppercase flex items-center justify-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5" />
                برنده: عماد
              </button>
              <button
                type="button"
                onClick={onDeclareTie}
                className="py-2 bg-neutral-800 hover:bg-neutral-700 text-yellow-300 font-bold text-xs rounded-lg border border-neutral-600 uppercase"
              >
                نتیجه مساوی
              </button>
            </div>
          </div>

          {/* 4. Instant Mystery Box or Sabotage */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-wide">
              ۴. قرعه‌کشی سریع آیتم‌ها (INSTANT DRAW):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onRollMysteryBox}
                className="py-2 bg-purple-900 hover:bg-purple-800 text-yellow-300 font-bold text-xs rounded-lg border border-purple-500 flex items-center justify-center gap-1"
              >
                <Gift className="w-4 h-4" />
                باز کردن جعبه شانس
              </button>
              <button
                type="button"
                onClick={() => onDrawSabotage()}
                className="py-2 bg-orange-950 hover:bg-orange-900 text-orange-200 font-bold text-xs rounded-lg border border-orange-600 flex items-center justify-center gap-1"
              >
                <Skull className="w-4 h-4" />
                اعمال خرابکاری تصادفی
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm rounded-xl uppercase tracking-wider mt-1"
          >
            بستن پنجره و بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    </div>
  );
};
