import React from 'react';
import { useRoomStore } from '../../store/useRoomStore';

export const StatusBadge: React.FC = () => {
  const status = useRoomStore((s) => s.connectionStatus);
  const latency = useRoomStore((s) => s.latency);
  const isDemoMode = useRoomStore((s) => s.isDemoMode);

  const getStatusColor = () => {
    if (isDemoMode) return 'bg-purple-500';
    switch (status) {
      case 'connected':
        return 'bg-emerald-500';
      case 'connecting':
      case 'reconnecting':
        return 'bg-amber-500 animate-pulse';
      case 'disconnected':
      default:
        return 'bg-rose-500';
    }
  };

  const getStatusText = () => {
    if (isDemoMode) return 'Demo Mode';
    switch (status) {
      case 'connected':
        return 'Live';
      case 'connecting':
        return 'Connecting...';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'disconnected':
      default:
        return 'Offline';
    }
  };

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 backdrop-blur-md text-xs select-none">
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatusColor()}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${getStatusColor()}`} />
      </span>

      <span className="font-medium text-slate-200">{getStatusText()}</span>

      {status === 'connected' && latency > 0 && (
        <span
          className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
            latency < 50
              ? 'text-emerald-400 bg-emerald-500/10'
              : latency < 150
              ? 'text-amber-400 bg-amber-500/10'
              : 'text-rose-400 bg-rose-500/10'
          }`}
        >
          {latency}ms
        </span>
      )}
    </div>
  );
};
