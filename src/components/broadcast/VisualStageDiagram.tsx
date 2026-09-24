import React from 'react';
import { PlayerId } from '../../types/game';

interface VisualStageDiagramProps {
  roundNumber: number;
  compact?: boolean;
  activeChoice?: string | null;
  activeSabotageId?: string | null;
  is3dGlass?: boolean;
  isMrBeast?: boolean;
}

export const VisualStageDiagram: React.FC<VisualStageDiagramProps> = ({
  roundNumber,
  compact = false,
  activeChoice,
  activeSabotageId,
  is3dGlass = false,
  isMrBeast = false,
}) => {
  // --- ROUND 1: 12-CUP TOWER PYRAMID + 1-HAND RULE ---
  if (roundNumber === 1) {
    return (
      <div
        id="diagram-round-1"
        className={`w-full rounded-2xl p-3 flex flex-col items-center justify-center transition-all ${
          isMrBeast
            ? 'bg-[#181818] border-4 border-black shadow-[4px_4px_0px_#000]'
            : is3dGlass
            ? 'bg-white/5 border border-white/20 backdrop-blur-xl shadow-lg'
            : 'bg-[#121212]/90 border border-[#2A2A2A]'
        }`}
        dir="rtl"
      >
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC400] animate-pulse" />
            <span className="text-xs font-['Vazirmatn'] font-black text-white">
              نقشه بصری: برج ۱۲ لیوان با یک دست
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#FFC400]/20 border border-[#FFC400]/50 text-[#FFC400] text-[11px] font-mono font-black">
            2s BALANCE REQUIRED
          </span>
        </div>

        {/* Cup Pyramid Graphic */}
        <div className="relative py-2 flex flex-col items-center justify-center gap-1">
          {/* Row 4 (Top: 1 cup) */}
          <div className="flex items-center justify-center">
            <div className="w-7 h-8 bg-gradient-to-b from-[#FFE066] to-[#FFC400] rounded-t-sm rounded-b-md border border-white/60 shadow-md flex items-center justify-center text-[10px] font-mono font-black text-black">
              1
            </div>
          </div>

          {/* Row 3 (2 cups) */}
          <div className="flex items-center justify-center gap-1.5">
            {[2, 3].map((num) => (
              <div
                key={num}
                className="w-7 h-8 bg-gradient-to-b from-[#FFD84A] to-[#E5AC00] rounded-t-sm rounded-b-md border border-white/40 shadow-sm flex items-center justify-center text-[10px] font-mono font-black text-black"
              >
                {num}
              </div>
            ))}
          </div>

          {/* Row 2 (3 cups) */}
          <div className="flex items-center justify-center gap-1.5">
            {[4, 5, 6].map((num) => (
              <div
                key={num}
                className="w-7 h-8 bg-gradient-to-b from-[#E5AC00] to-[#C99400] rounded-t-sm rounded-b-md border border-white/30 shadow-sm flex items-center justify-center text-[10px] font-mono font-black text-black"
              >
                {num}
              </div>
            ))}
          </div>

          {/* Row 1 (Base: 4 cups) */}
          <div className="flex items-center justify-center gap-1.5">
            {[7, 8, 9, 10].map((num) => (
              <div
                key={num}
                className="w-7 h-8 bg-gradient-to-b from-[#C99400] to-[#996F00] rounded-t-sm rounded-b-md border border-white/20 shadow-sm flex items-center justify-center text-[10px] font-mono font-black text-black"
              >
                {num}
              </div>
            ))}
          </div>

          {/* Table Line */}
          <div className="w-48 h-1.5 bg-[#444444] rounded-full shadow-inner mt-1 flex items-center justify-between px-1">
            {/* 2 standby cups on sides */}
            <div className="w-5 h-6 -mt-3.5 bg-neutral-600 rounded border border-neutral-400 flex items-center justify-center text-[8px] font-mono text-white">
              11
            </div>
            <div className="w-5 h-6 -mt-3.5 bg-neutral-600 rounded border border-neutral-400 flex items-center justify-center text-[8px] font-mono text-white">
              12
            </div>
          </div>
        </div>

        {/* Rule Indicators Banner */}
        <div className="w-full mt-2 grid grid-cols-2 gap-2 text-center text-[11px] font-['Vazirmatn'] font-bold">
          <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-600/40 text-red-300 flex items-center justify-center gap-1">
            <span>🚫</span>
            <span>استفاده از دست دوم = خطا!</span>
          </div>
          <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 flex items-center justify-center gap-1">
            <span>⏱️</span>
            <span>۲ ثانیه کامل سرپا بماند</span>
          </div>
        </div>
      </div>
    );
  }

  // --- ROUND 2: 3 DISTANCE THROW LINES & BASKET TARGET ---
  if (roundNumber === 2) {
    return (
      <div
        id="diagram-round-2"
        className={`w-full rounded-2xl p-3 flex flex-col items-center justify-center transition-all ${
          isMrBeast
            ? 'bg-[#181818] border-4 border-black shadow-[4px_4px_0px_#000]'
            : is3dGlass
            ? 'bg-white/5 border border-white/20 backdrop-blur-xl shadow-lg'
            : 'bg-[#121212]/90 border border-[#2A2A2A]'
        }`}
        dir="rtl"
      >
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-xs font-['Vazirmatn'] font-black text-white">
              خطوط ۳ گانه پرتاب به سمت سبد
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-300 text-[10px] font-mono font-bold">
            3 ATTEMPTS PER PLAYER
          </span>
        </div>

        {/* Court & Distance Lines Visualization */}
        <div className="w-full py-2 px-3 bg-[#080808] rounded-xl border border-neutral-800 flex items-center justify-between relative overflow-hidden">
          {/* 3 Throw Lines */}
          <div className="flex flex-col gap-2 flex-1">
            {/* GREEN LINE (+5s) */}
            <div
              className={`p-1.5 rounded-lg flex items-center justify-between border transition-all ${
                activeChoice === 'GREEN'
                  ? 'bg-emerald-950/90 border-[#00E676] ring-2 ring-[#00E676]'
                  : 'bg-emerald-950/30 border-emerald-600/40 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#00E676]" />
                <span className="font-['Vazirmatn'] text-xs font-black text-white">خط سبز (نزدیک)</span>
              </div>
              <bdi dir="ltr" className="font-mono font-black text-xs text-[#00E676]">
                +5 SEC
              </bdi>
            </div>

            {/* YELLOW LINE (+10s) */}
            <div
              className={`p-1.5 rounded-lg flex items-center justify-between border transition-all ${
                activeChoice === 'YELLOW'
                  ? 'bg-yellow-950/90 border-[#FFDE00] ring-2 ring-[#FFDE00]'
                  : 'bg-yellow-950/30 border-yellow-500/40 text-yellow-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FFDE00]" />
                <span className="font-['Vazirmatn'] text-xs font-black text-white">خط زرد (متوسط)</span>
              </div>
              <bdi dir="ltr" className="font-mono font-black text-xs text-[#FFDE00]">
                +10 SEC
              </bdi>
            </div>

            {/* RED LINE (+20s) */}
            <div
              className={`p-1.5 rounded-lg flex items-center justify-between border transition-all ${
                activeChoice === 'RED'
                  ? 'bg-red-950/90 border-[#FF2A55] ring-2 ring-[#FF2A55]'
                  : 'bg-red-950/30 border-red-600/40 text-red-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF2A55]" />
                <span className="font-['Vazirmatn'] text-xs font-black text-white">خط قرمز (دور و پرریسک)</span>
              </div>
              <bdi dir="ltr" className="font-mono font-black text-xs text-[#FF2A55]">
                +20 SEC
              </bdi>
            </div>
          </div>

          {/* Right: Basketball Target Hoop */}
          <div className="mr-3 flex flex-col items-center justify-center shrink-0">
            <div className="w-12 h-14 bg-gradient-to-b from-neutral-800 to-black rounded-lg border-2 border-amber-500 flex flex-col items-center justify-center relative shadow-lg">
              {/* Basketball Rim */}
              <div className="w-8 h-2.5 bg-orange-600 rounded-full border border-white flex items-center justify-center -mt-1 shadow" />
              {/* Net */}
              <div className="w-6 h-5 border-b-2 border-x-2 border-white/60 border-dashed rounded-b-lg mt-0.5" />
              {/* Ball */}
              <div className="w-4 h-4 rounded-full bg-orange-500 border border-orange-800 absolute -top-2 animate-bounce" />
            </div>
            <span className="text-[9px] font-['Vazirmatn'] font-bold text-neutral-400 mt-1">
              سبد هدف
            </span>
          </div>
        </div>

        {/* Footer info: locked choice warning */}
        <p className="w-full text-center text-[11px] font-['Vazirmatn'] text-neutral-400 mt-2">
          🔒 انتخاب فاصله قبل از اولین پرتاب الزامیست و پس از ثبت غیرقابل تغییر است.
        </p>
      </div>
    );
  }

  // --- ROUND 3: 6 MYSTERY BOWLS / BOXES ---
  if (roundNumber === 3) {
    return (
      <div
        id="diagram-round-3"
        className={`w-full rounded-2xl p-3 flex flex-col items-center justify-center transition-all ${
          isMrBeast
            ? 'bg-[#181818] border-4 border-black shadow-[4px_4px_0px_#000]'
            : is3dGlass
            ? 'bg-white/5 border border-white/20 backdrop-blur-xl shadow-lg'
            : 'bg-[#121212]/90 border border-[#2A2A2A]'
        }`}
        dir="rtl"
      >
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC400] animate-pulse" />
            <span className="text-xs font-['Vazirmatn'] font-black text-white">
              استخر ۶ لقمه مرموز (جعبه‌های ۱ تا ۶)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-300 text-[10px] font-mono font-bold">
            RANDOM LOCAL SHUFFLE
          </span>
        </div>

        {/* 6 Bowls Grid */}
        <div className="w-full grid grid-cols-6 gap-1.5 my-2">
          {[1, 2, 3, 4, 5, 6].map((boxNum) => (
            <div
              key={boxNum}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isMrBeast
                  ? 'bg-neutral-800 border-2 border-black hover:border-[#FFDE00]'
                  : 'bg-neutral-900 border border-neutral-700 hover:border-amber-400'
              }`}
            >
              {/* Plate / Bowl with Cloche */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-200 to-amber-600 border border-amber-300 shadow-md flex items-center justify-center text-black font-black text-xs font-mono">
                {boxNum}
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-300 mt-1">
                #{boxNum}
              </span>
            </div>
          ))}
        </div>

        {/* Revealed Outcome Reference Key */}
        <div className="w-full grid grid-cols-3 gap-1.5 text-center text-[10px] font-['Vazirmatn'] font-bold mt-1">
          <div className="p-1 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-300">
            ۲ جعبه = <bdi dir="ltr">+15s</bdi>
          </div>
          <div className="p-1 rounded-lg bg-red-950/60 border border-red-600/40 text-red-300">
            ۱ جعبه = <bdi dir="ltr">STEAL 5s</bdi>
          </div>
          <div className="p-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300">
            ۳ جعبه = <bdi dir="ltr">BLANK</bdi>
          </div>
        </div>
      </div>
    );
  }

  // --- ROUND 4: 4-STATION OBSTACLE RELAY MAP (TARGET → CUP STACK → CODE PUZZLE → FINISH) ---
  if (roundNumber === 4) {
    const stations = [
      { id: 'TARGET', name: '۱. سیبل هدف', icon: '🎯', desc: 'اصابت دقیق' },
      { id: 'CUP_STACK', name: '۲. برج لیوان', icon: '🥛', desc: 'چیدن سریع' },
      { id: 'CODE_PUZZLE', name: '۳. پازل کد', icon: '🧩', desc: 'حل معما' },
      { id: 'FINISH', name: '۴. خط پایان', icon: '🏁', desc: 'زنگ پایان' },
    ];

    return (
      <div
        id="diagram-round-4"
        className={`w-full rounded-2xl p-3 flex flex-col items-center justify-center transition-all ${
          isMrBeast
            ? 'bg-[#181818] border-4 border-black shadow-[4px_4px_0px_#000]'
            : is3dGlass
            ? 'bg-white/5 border border-white/20 backdrop-blur-xl shadow-lg'
            : 'bg-[#121212]/90 border border-[#2A2A2A]'
        }`}
        dir="rtl"
      >
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A55] animate-pulse" />
            <span className="text-xs font-['Vazirmatn'] font-black text-white">
              مسیر رله موانع سه‌گانه داداش مد
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-mono font-black">
            +30 SEC REWARD
          </span>
        </div>

        {/* 4 Stations connected by arrows */}
        <div className="w-full py-2 px-1 grid grid-cols-4 gap-1 relative items-center">
          {stations.map((st, idx) => (
            <div
              key={st.id}
              className={`p-2 rounded-xl flex flex-col items-center text-center relative ${
                isMrBeast
                  ? 'bg-neutral-800 border-2 border-black'
                  : 'bg-neutral-900/90 border border-neutral-700'
              }`}
            >
              <span className="text-xl mb-0.5">{st.icon}</span>
              <span className="text-[11px] font-['Vazirmatn'] font-black text-white leading-tight truncate w-full">
                {st.name}
              </span>
              <span className="text-[9px] font-['Vazirmatn'] text-neutral-400 mt-0.5">
                {st.desc}
              </span>

              {/* Connecting arrow except last */}
              {idx < 3 && (
                <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-black z-10">
                  ◀
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="w-full text-center text-[11px] font-['Vazirmatn'] text-neutral-400 mt-1">
          عبور از مراحل به ترتیب اجباری است • اولین نفری که به FINISH برسد ۳۰ ثانیه می‌گیرد!
        </p>
      </div>
    );
  }

  // --- ROUND 5: SAFE OR RISK (SAFE vs RISK) ---
  if (roundNumber === 5) {
    return (
      <div
        id="diagram-round-5"
        className={`w-full rounded-2xl p-3 flex flex-col items-center justify-center transition-all ${
          isMrBeast
            ? 'bg-[#181818] border-4 border-black shadow-[4px_4px_0px_#000]'
            : is3dGlass
            ? 'bg-white/5 border border-white/20 backdrop-blur-xl shadow-lg'
            : 'bg-[#121212]/90 border border-[#2A2A2A]'
        }`}
        dir="rtl"
      >
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-xs font-['Vazirmatn'] font-black text-white">
              انتخاب حالت چالش: امن یا ریسک
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
            LOCK BEFORE ATTEMPT
          </span>
        </div>

        {/* 2 Modes Comparison Cards */}
        <div className="w-full grid grid-cols-2 gap-2 my-1">
          {/* SAFE MODE */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
              activeChoice === 'SAFE'
                ? 'bg-emerald-950/90 border-[#00E676] ring-2 ring-[#00E676]'
                : 'bg-emerald-950/30 border-emerald-600/40'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-400 flex items-center justify-center text-lg mb-1">
              🛡️
            </div>
            <span className="font-['Vazirmatn'] font-black text-sm text-white">حالت امن (SAFE)</span>
            <div className="w-full mt-2 space-y-1 text-[11px] font-mono">
              <div className="flex justify-between px-2 py-0.5 rounded bg-black/40 text-emerald-300">
                <span className="font-['Vazirmatn']">موفقیت:</span>
                <bdi dir="ltr">+8 SEC</bdi>
              </div>
              <div className="flex justify-between px-2 py-0.5 rounded bg-black/40 text-neutral-400">
                <span className="font-['Vazirmatn']">شکست:</span>
                <bdi dir="ltr">0 SEC</bdi>
              </div>
            </div>
          </div>

          {/* RISK MODE */}
          <div
            className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
              activeChoice === 'RISK'
                ? 'bg-red-950/90 border-[#FF2A55] ring-2 ring-[#FF2A55]'
                : 'bg-red-950/30 border-red-600/40'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-red-600/30 border border-red-400 flex items-center justify-center text-lg mb-1">
              ⚡
            </div>
            <span className="font-['Vazirmatn'] font-black text-sm text-white">حالت ریسک (RISK)</span>
            <div className="w-full mt-2 space-y-1 text-[11px] font-mono">
              <div className="flex justify-between px-2 py-0.5 rounded bg-black/40 text-emerald-300">
                <span className="font-['Vazirmatn']">موفقیت:</span>
                <bdi dir="ltr">+25 SEC</bdi>
              </div>
              <div className="flex justify-between px-2 py-0.5 rounded bg-black/40 text-red-400">
                <span className="font-['Vazirmatn']">شکست:</span>
                <bdi dir="ltr">-10 SEC</bdi>
              </div>
            </div>
          </div>
        </div>

        <p className="w-full text-center text-[11px] font-['Vazirmatn'] text-neutral-400 mt-1">
          جمله رسمی داور پس از انتخاب: «انتخاب قفل شد.»
        </p>
      </div>
    );
  }

  // --- ROUND 6 / FINAL: BOSS GRAND FINALE & PRIZE TABLE ---
  return (
    <div
      id="diagram-round-final"
      className={`w-full rounded-2xl p-3 flex flex-col items-center justify-center transition-all ${
        isMrBeast
          ? 'bg-[#181818] border-4 border-black shadow-[4px_4px_0px_#000]'
          : is3dGlass
          ? 'bg-white/5 border border-white/20 backdrop-blur-xl shadow-lg'
          : 'bg-[#121212]/90 border border-[#2A2A2A]'
      }`}
      dir="rtl"
    >
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFC400] animate-pulse" />
          <span className="text-xs font-['Vazirmatn'] font-black text-white">
            میز جایزه فینال بزرگ داداش مد
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-300 text-[10px] font-mono font-black">
          WINNER TAKES ALL
        </span>
      </div>

      <div className="w-full py-3 px-4 bg-gradient-to-r from-amber-950/40 via-yellow-950/60 to-amber-950/40 rounded-xl border border-yellow-500/50 flex items-center justify-around text-center">
        <div className="flex flex-col items-center">
          <span className="text-2xl">👑</span>
          <span className="font-['Vazirmatn'] text-xs font-black text-yellow-300 mt-1">تاج پادشاهی</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl">🏆</span>
          <span className="font-['Vazirmatn'] text-xs font-black text-white mt-1">جام قهرمان</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl">💰</span>
          <span className="font-['Vazirmatn'] text-xs font-black text-yellow-300 mt-1">تمام ثانیه‌ها</span>
        </div>
      </div>
    </div>
  );
};
