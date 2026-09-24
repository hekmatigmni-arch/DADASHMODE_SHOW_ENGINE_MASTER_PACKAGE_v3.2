import { FC, useState } from 'react';
import { GameEvent } from '../types/game';
import { History, ChevronDown, ChevronUp, Clock, AlertTriangle, Gift, Skull, Trophy } from 'lucide-react';

interface EventLogListProps {
  events: GameEvent[];
}

export const EventLogList: FC<EventLogListProps> = ({ events }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const getEventBadge = (event: GameEvent) => {
    switch (event.type) {
      case 'TIME_ADD':
        return (
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-500 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
            +{event.secondsDelta}s پاداش
          </span>
        );
      case 'TIME_SUBTRACT':
        return (
          <span className="bg-red-950 text-red-300 border border-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
            {event.secondsDelta}s خطا
          </span>
        );
      case 'REVIEW_REQUESTED':
      case 'REVIEW_RESOLVED':
        return (
          <span className="bg-yellow-950 text-yellow-300 border border-yellow-400 text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
            <AlertTriangle className="w-2.5 h-2.5" />
            VAR بازبینی
          </span>
        );
      case 'MYSTERY_BOX':
        return (
          <span className="bg-purple-950 text-purple-300 border border-purple-400 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
            <Gift className="w-2.5 h-2.5" />
            جعبه شانس
          </span>
        );
      case 'SABOTAGE':
        return (
          <span className="bg-orange-950 text-orange-300 border border-orange-500 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
            <Skull className="w-2.5 h-2.5" />
            خرابکاری
          </span>
        );
      case 'WINNER_DECLARED':
        return (
          <span className="bg-yellow-400 text-black font-black text-[10px] px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
            <Trophy className="w-2.5 h-2.5" />
            قهرمان
          </span>
        );
      case 'ROUND_START':
        return (
          <span className="bg-blue-950 text-blue-300 border border-blue-500 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
            شروع راند
          </span>
        );
      default:
        return (
          <span className="bg-neutral-800 text-neutral-400 text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0">
            سیستم
          </span>
        );
    }
  };

  return (
    <section id="event-log-section" className="w-full bg-neutral-950 border-2 border-neutral-800 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 bg-neutral-900 hover:bg-neutral-850 flex items-center justify-between text-left transition border-b border-neutral-800"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-black text-white uppercase tracking-wider">
            گزارش زنده رویدادهای داوری (EVENT LOG)
          </span>
          <span className="bg-neutral-800 text-neutral-300 text-[10px] px-1.5 py-0.2 rounded font-mono">
            {events.length}
          </span>
        </div>
        <div className="text-neutral-400">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Events List */}
      {isExpanded && (
        <div className="p-2 flex flex-col gap-1.5 max-h-48 overflow-y-auto divide-y divide-neutral-900 font-['Vazirmatn']">
          {events.length === 0 ? (
            <div className="text-neutral-500 text-xs text-center py-3">
              هیچ رویدادی هنوز ثبت نشده است.
            </div>
          ) : (
            events.map((evt, idx) => (
              <div key={`${evt.id || 'evt'}_${idx}`} className="pt-1.5 first:pt-0 flex items-start gap-2 text-xs">
                {/* Timestamp */}
                <span className="text-neutral-500 font-mono text-[10px] shrink-0 pt-0.5">
                  {evt.formattedTime}
                </span>

                {/* Badge */}
                {getEventBadge(evt)}

                {/* Persian & English message */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium leading-snug">
                    {evt.persianMessage || evt.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};
