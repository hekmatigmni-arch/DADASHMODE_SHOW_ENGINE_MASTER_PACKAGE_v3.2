import React, { useState } from 'react';
import { ProductionLogEntry } from '../../types/showEngine';
import {
  FileText,
  Download,
  Filter,
  Clock,
  X,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface ProductionLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ProductionLogEntry[];
  onClearLogs?: () => void;
}

export const ProductionLogsModal: React.FC<ProductionLogsModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((l) =>
    selectedCategory === 'ALL' ? true : l.category === selectedCategory
  );

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `dadashmode_production_logs_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Timecode', 'Round', 'Category', 'Actor', 'Event'];
    const rows = logs.map((l) => [
      l.id,
      l.timecode,
      l.roundIndex + 1,
      l.category,
      l.actor,
      `"${l.persianText.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute(
      'download',
      `dadashmode_production_logs_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl bg-[#0e0e14] border border-white/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Vazirmatn'] text-xl font-black text-white">
                لاگ‌های رسمی تولید و داوری مسابقه (Recording Logs)
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                TOTAL REGISTERED EVENTS: {logs.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              JSON EXPORT
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 flex items-center justify-center transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-black/20 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-mono text-neutral-400 uppercase">CATEGORY:</span>
            {['ALL', 'REFEREE', 'SCORE', 'TIMER', 'ANIMATION', 'VOICE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-black font-black'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-mono text-[11px] flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              CLEAR
            </button>
          )}
        </div>

        {/* Log Stream List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 font-mono">
              NO PRODUCTION EVENTS RECORDED YET.
            </div>
          ) : (
            filteredLogs.map((entry, idx) => (
              <div
                key={`${entry.id || 'log'}_${idx}`}
                className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-start gap-3 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-1 text-neutral-400 text-[11px] min-w-[70px]">
                  <Clock className="w-3 h-3" />
                  <span>{entry.timecode}</span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    entry.category === 'REFEREE'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : entry.category === 'SCORE'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : entry.category === 'ANIMATION'
                      ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                      : 'bg-white/10 text-neutral-300'
                  }`}
                >
                  {entry.category}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    entry.actor === 'ELIAS'
                      ? 'bg-red-950 text-red-300'
                      : entry.actor === 'EMAD'
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {entry.actor}
                </span>

                <span className="font-['Vazirmatn'] text-neutral-200 flex-1 text-right" dir="rtl">
                  {entry.persianText}
                </span>

                {entry.scoreDelta && (
                  <span
                    className={`font-mono font-black text-xs ${
                      entry.scoreDelta.seconds > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {entry.scoreDelta.seconds > 0
                      ? `+${entry.scoreDelta.seconds}s`
                      : `${entry.scoreDelta.seconds}s`}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
