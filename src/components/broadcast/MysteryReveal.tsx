import React from 'react';
import { PublicMysteryBoxItem } from '../../types/game';
import { MysteryBoxIcon, StealIcon, WinnerIcon } from './GameIcons';

interface MysteryRevealProps {
  boxes: PublicMysteryBoxItem[];
  className?: string;
}

export const MysteryReveal: React.FC<MysteryRevealProps> = ({
  boxes,
  className = '',
}) => {
  return (
    <div
      id="broadcast-mystery-grid"
      className={`w-full rounded-3xl border border-[#333333] bg-[#111111]/90 p-3 sm:p-4 shadow-xl select-none backdrop-blur-md ${className}`}
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <MysteryBoxIcon size={22} color="#FFC400" />
          <span className="font-['Vazirmatn'] font-black text-sm text-white">
            جعبه‌های لقمه مرموز (۱ تا ۶)
          </span>
        </div>
        <span className="font-mono text-[11px] font-black text-[#FFC400] uppercase tracking-wider">
          MYSTERY BITE BOXES
        </span>
      </div>

      {/* 6 Mystery Boxes Grid */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {boxes.map((box) => {
          const isRevealed = box.isRevealed;
          const isSelected = box.isLocked || box.chosenBy !== null;
          const outcome = box.outcome;

          return (
            <div
              key={box.boxNumber}
              className={`relative rounded-2xl border-2 flex flex-col items-center justify-center p-2 sm:p-3 transition-all duration-300 ${
                isRevealed
                  ? outcome === 'PLUS_15'
                    ? 'bg-[#181508] border-[#FFC400] animate-flip-in shadow-[0_0_16px_rgba(255,196,0,0.4)]'
                    : outcome === 'STEAL_5'
                    ? 'bg-[#1a080a] border-[#FF2738] animate-flip-in shadow-[0_0_16px_rgba(255,39,56,0.4)]'
                    : 'bg-[#141414] border-[#444444] animate-flip-in'
                  : isSelected
                  ? 'bg-[#221c08] border-[#FFC400] ring-2 ring-[#FFC400]/70 animate-pulse'
                  : 'bg-[#171717] border-[#2c2c2c] hover:border-[#444444]'
              }`}
              style={{ minHeight: '84px' }}
            >
              {/* Box Number */}
              <span className="font-mono font-black text-xs sm:text-sm text-neutral-400 absolute top-1.5 right-2">
                #{box.boxNumber}
              </span>

              {/* Center Content */}
              <div className="my-auto flex flex-col items-center justify-center text-center">
                {isRevealed ? (
                  outcome === 'PLUS_15' ? (
                    <>
                      <WinnerIcon size={26} color="#FFC400" />
                      <span className="font-mono font-black text-xs sm:text-sm text-[#FFC400] mt-1">
                        +15s
                      </span>
                    </>
                  ) : outcome === 'STEAL_5' ? (
                    <>
                      <StealIcon size={26} color="#FF2738" />
                      <span className="font-mono font-black text-xs text-[#FF2738] mt-1">
                        STEAL 5s
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl font-mono text-neutral-500 font-bold">∅</span>
                      <span className="font-mono font-extrabold text-[10px] text-neutral-400 mt-1">
                        BLANK
                      </span>
                    </>
                  )
                ) : (
                  <>
                    <span className="font-mono font-black text-2xl sm:text-3xl text-[#FFC400]">
                      ?
                    </span>
                    {isSelected && (
                      <span className="font-['Vazirmatn'] text-[10px] text-[#FFC400] font-black mt-0.5">
                        انتخاب شد
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
