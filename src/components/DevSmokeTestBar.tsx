import React, { useState } from 'react';
import { ShieldCheck, Activity, Camera, Mic, RefreshCw, Cpu, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { GameState } from '../types/game';

interface DevSmokeTestBarProps {
  gameState: GameState;
  liveStatus: string;
  isCameraActive: boolean;
  isMicActive: boolean;
  hasCameraPermission: boolean | null;
  resumptionHandle: string | null;
  lastToolCall: { id: string; name: string; args: any; timestamp: number } | null;
  isBroadcastMode: boolean;
  onReconnect?: () => void;
}

export const DevSmokeTestBar: React.FC<DevSmokeTestBarProps> = ({
  gameState,
  liveStatus,
  isCameraActive,
  isMicActive,
  hasCameraPermission,
  resumptionHandle,
  lastToolCall,
  isBroadcastMode,
  onReconnect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Hidden in broadcast mode or production
  if (isBroadcastMode) {
    return null;
  }

  const isStorageWorking = typeof window !== 'undefined' && !!window.localStorage;
  const storedScoreElias = gameState.players.ELIAS.seconds;
  const storedScoreEmad = gameState.players.EMAD.seconds;

  return (
    <div
      id="dev-smoke-test-bar"
      className="fixed bottom-2 left-2 z-50 max-w-lg bg-neutral-900/95 backdrop-blur-md border border-neutral-700/80 rounded-xl shadow-2xl text-xs text-neutral-300 font-mono overflow-hidden transition-all"
    >
      <div
        className="px-3 py-2 bg-neutral-800/90 flex items-center justify-between cursor-pointer select-none gap-2 hover:bg-neutral-800"
        onClick={() => setIsExpanded(prev => !prev)}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-bold text-amber-400 tracking-wider">DEV SMOKE TEST</span>
          <span className="text-neutral-400 text-[10px]">
            [{liveStatus.toUpperCase()}] • ELIAS:{storedScoreElias}s EMAD:{storedScoreEmad}s
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onReconnect && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReconnect();
              }}
              title="Reconnect AI Referee"
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700/50"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto border-t border-neutral-800">
          {/* Local Engine */}
          <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local Engine</span>
            </div>
            <span className="text-emerald-400 font-semibold">
              ACTIVE (R{gameState.currentRoundIndex + 1} | Timer: {gameState.isTimerRunning ? 'RUNNING' : 'PAUSED'})
            </span>
          </div>

          {/* Mic & Cam */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 p-1.5 bg-neutral-800/50 rounded border border-neutral-800">
              <Mic className={`w-3 h-3 ${isMicActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
              <span>Mic:</span>
              <span className={isMicActive ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
                {isMicActive ? 'STREAMING' : 'MUTED'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 bg-neutral-800/50 rounded border border-neutral-800">
              <Camera className={`w-3 h-3 ${isCameraActive ? 'text-emerald-400' : 'text-neutral-400'}`} />
              <span>Camera:</span>
              <span className={isCameraActive ? 'text-emerald-400 font-bold' : 'text-neutral-400'}>
                {isCameraActive ? 'ACTIVE' : hasCameraPermission === false ? 'DENIED' : 'OFF'}
              </span>
            </div>
          </div>

          {/* Gemini Live Connection & Resumption */}
          <div className="p-2 bg-neutral-800/50 rounded border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Gemini Live Model:</span>
              <span className="text-amber-300 font-bold">gemini-3.8-live</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Resumption Handle:</span>
              <span className="text-neutral-300 font-mono text-[10px] truncate max-w-[180px]">
                {resumptionHandle ? `${resumptionHandle.substring(0, 16)}...` : 'None (initial)'}
              </span>
            </div>
          </div>

          {/* Last Function Call */}
          <div className="p-2 bg-neutral-800/50 rounded border border-neutral-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Last Function Call:</span>
              <span className="text-cyan-400 font-semibold">{lastToolCall ? lastToolCall.name : 'None yet'}</span>
            </div>
            {lastToolCall && (
              <pre className="text-[10px] text-neutral-300 bg-neutral-900 p-1.5 rounded overflow-x-auto">
                {JSON.stringify(lastToolCall.args, null, 2)}
              </pre>
            )}
          </div>

          {/* Persistence */}
          <div className="flex items-center justify-between py-1 border-t border-neutral-800/60 text-[11px]">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>Persistence (localStorage):</span>
            </div>
            <span className={isStorageWorking ? 'text-sky-400 font-bold' : 'text-red-400 font-bold'}>
              {isStorageWorking ? 'RESTORE ACTIVE' : 'UNAVAILABLE'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
