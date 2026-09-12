import React from 'react';
import { useSharedStateStore } from '../../store/useSharedStateStore';
import { socketClient } from '../../socket/socketClient';
import { Sliders, Radio, Grid, Lock, Moon } from 'lucide-react';

export const SharedToggles: React.FC = () => {
  const toggles = useSharedStateStore((s) => s.toggles);

  const handleToggle = (key: keyof typeof toggles) => {
    socketClient.emitToggle(key, !toggles[key]);
  };

  const toggleItems = [
    {
      key: 'streamActive' as const,
      label: 'Ultra-Low Latency Mode',
      desc: '30Hz delta updates with client interpolation',
      icon: <Radio size={14} className="text-emerald-400" />,
      checked: toggles.streamActive,
    },
    {
      key: 'gridSnap' as const,
      label: 'Canvas Grid Alignment',
      desc: 'Snap cursor pings & notes to 16px grid',
      icon: <Grid size={14} className="text-cyan-400" />,
      checked: toggles.gridSnap,
    },
    {
      key: 'readOnlyMode' as const,
      label: 'Collaborator Lock',
      desc: 'Restricts editing permissions to host',
      icon: <Lock size={14} className="text-amber-400" />,
      checked: toggles.readOnlyMode,
    },
    {
      key: 'darkModeDefault' as const,
      label: 'Synced Room Dark Theme',
      desc: 'Enforce high-contrast dark palette',
      icon: <Moon size={14} className="text-purple-400" />,
      checked: toggles.darkModeDefault,
    },
  ];

  return (
    <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Sliders size={16} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Distributed Room Controls</h3>
          <p className="text-[11px] text-slate-400">Instant toggle sync across all connected clients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {toggleItems.map((item) => (
          <div
            key={item.key}
            onClick={() => handleToggle(item.key)}
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
              item.checked
                ? 'bg-indigo-950/40 border-indigo-500/40'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="p-2 rounded-xl bg-slate-800/80 shrink-0">{item.icon}</div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{item.label}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
              </div>
            </div>

            {/* Switch pill */}
            <div
              className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                item.checked ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  item.checked ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
