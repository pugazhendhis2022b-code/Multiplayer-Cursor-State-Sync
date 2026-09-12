import React from 'react';
import { Keyboard, ShieldCheck, Gauge } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 px-6 border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-400 select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <Gauge size={13} className="text-emerald-400" />
            <span>Target: 60 FPS rAF Lerp</span>
          </span>
          <span className="h-3 w-px bg-slate-800" />
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck size={13} className="text-indigo-400" />
            <span>End-to-End WebSocket Sync</span>
          </span>
        </div>

        {/* Keyboard Shortcuts Chips */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
          <Keyboard size={13} className="text-slate-500" />
          <span>Shortcuts:</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">
            Ctrl+C Copy Link
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">
            Ctrl+D Theme
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">
            / Cursor Chat
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">
            Esc Leave
          </span>
        </div>

        <div className="text-[11px] text-slate-500">
          © {new Date().getFullYear()} SyncPoint Collaboration Systems
        </div>
      </div>
    </footer>
  );
};
