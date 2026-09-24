import React from 'react';
import {
  HelpCircle,
  X,
  Keyboard,
  Shield,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

export interface ExplainerContent {
  title: string;
  persianTitle: string;
  description: string;
  persianDescription: string;
  shortcut?: string;
  ruleMapping?: string;
}

interface LongPressExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ExplainerContent | null;
}

export const LongPressExplainerModal: React.FC<LongPressExplainerModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111118]/95 border border-white/20 shadow-2xl p-6 flex flex-col gap-4 overflow-hidden">
        {/* Specular Liquid Glass Top Sheen */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Vazirmatn'] text-lg font-black text-white">
                {content.persianTitle}
              </h3>
              <span className="font-mono text-xs text-neutral-400 uppercase">
                {content.title}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Persian Description */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-['Vazirmatn'] text-neutral-200 leading-relaxed text-right" dir="rtl">
          {content.persianDescription}
        </div>

        {/* English Technical Specs */}
        <p className="text-xs font-mono text-neutral-400 leading-normal">
          {content.description}
        </p>

        {/* Metadata Footer */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 font-mono text-xs">
          {content.shortcut && (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 text-amber-300">
              <Keyboard className="w-3.5 h-3.5" />
              <span>SHORTCUT: {content.shortcut}</span>
            </div>
          )}

          {content.ruleMapping && (
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 text-cyan-300">
              <Shield className="w-3.5 h-3.5" />
              <span>RULE: {content.ruleMapping}</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-colors shadow-lg mt-2"
        >
          CONFIRM / متوجه شدم
        </button>
      </div>
    </div>
  );
};
