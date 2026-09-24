import React, { useState } from 'react';
import { offlineShowTestEngine, OfflineShowDrillReport } from '../../engine/offlineDrill/offlineShowTest';

interface OfflineShowTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineShowTestModal: React.FC<OfflineShowTestModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<OfflineShowDrillReport | null>(null);

  if (!isOpen) return null;

  const handleRunDrill = async () => {
    setIsRunning(true);
    setReport(null);
    try {
      const drillReport = await offlineShowTestEngine.executeDrill();
      setReport(drillReport);
    } catch (e: any) {
      alert(`Drill error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0b0e14] border border-[#2a3040] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-gray-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#1f2533] flex items-center justify-between bg-gradient-to-r from-[#171424] to-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xl">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-wide text-white">OFFLINE SHOW DRILL & VERIFICATION</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  LOCAL-SERVER DRILL
                </span>
              </div>
              <p className="text-xs text-gray-400">Complete Game Round Simulation (Start · Countdown · Voice · SFX · VFX · Timer · Score · Button · Winner · Save)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a202c] hover:bg-[#2d3748] flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Action Trigger Banner */}
          <div className="bg-[#121622] border border-[#22283a] rounded-xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">EXECUTE COMPLETE PRE-SHOW DRILL</h3>
              <p className="text-xs text-gray-400 max-w-xl">
                تمرین شبیه‌سازی و تست تولید صدای محلی است؛ تست قطع اینترنت، ضبط واقعی و کیفیت صدای زنانه نیست.
              </p>
            </div>
            <button
              onClick={handleRunDrill}
              disabled={isRunning}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isRunning ? 'SIMULATING SHOW...' : '⚡ RUN SHOW DRILL'}
            </button>
          </div>

          {/* Report Results */}
          {report && (
            <div className="space-y-4">
              
              {/* Verdict Header */}
              <div className={`p-5 rounded-xl border flex items-center justify-between ${
                report.overallStatus === 'OFFLINE SHOW READY'
                  ? 'bg-emerald-950/20 border-emerald-500/50'
                  : 'bg-red-950/20 border-red-500/50'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl ${report.overallStatus === 'OFFLINE SHOW READY' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {report.overallStatus === 'OFFLINE SHOW READY' ? '🏆' : '⚠️'}
                  </span>
                  <div>
                    <h3 className={`text-lg font-black tracking-wider ${
                      report.overallStatus === 'OFFLINE SHOW READY' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {report.overallStatus}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      Completed in {report.totalDurationMs}ms · Internet isolation not tested
                    </p>
                  </div>
                </div>

                <span className={`px-4 py-1.5 rounded-lg text-xs font-black tracking-wider ${
                  report.overallStatus === 'OFFLINE SHOW READY' ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                }`}>
                  {report.overallStatus === 'OFFLINE SHOW READY' ? 'CERTIFIED' : 'FAILED'}
                </span>
              </div>

              {/* Failed Dependencies (if any) */}
              {report.failedDependencies.length > 0 && (
                <div className="bg-red-950/30 border border-red-500/40 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">FAILED DEPENDENCIES:</h4>
                  <ul className="list-disc list-inside text-xs text-red-200 space-y-1">
                    {report.failedDependencies.map((dep, idx) => (
                      <li key={idx} className="font-mono">{dep}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 11 Steps Breakdown */}
              <div className="border border-[#22283a] rounded-xl overflow-hidden divide-y divide-[#1f2533] bg-[#121622]">
                {report.steps.map((st, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        st.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {st.passed ? '✓' : '✕'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-gray-400">{st.step}</span>
                          <span className="font-bold text-white">{st.name}</span>
                        </div>
                        <div className="text-gray-400 mt-0.5">{st.details}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-gray-500">{st.durationMs}ms</span>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2533] bg-[#0c0f17] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
