import React from 'react';
import { useSharedStateStore } from '../../store/useSharedStateStore';
import { socketClient } from '../../socket/socketClient';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export const SharedCounter: React.FC = () => {
  const counter = useSharedStateStore((s) => s.counter);

  const handleIncrement = () => {
    socketClient.emitCounter(1);
  };

  const handleDecrement = () => {
    socketClient.emitCounter(-1);
  };

  const handleReset = () => {
    socketClient.emitCounter('reset');
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>⚡ Shared Atomic Counter</span>
          </h3>
          <p className="text-xs text-slate-400">Synchronized across all participants</p>
        </div>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Reset counter"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/60">
        <button
          onClick={handleDecrement}
          className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white flex items-center justify-center transition-all shadow-sm cursor-pointer"
          title="Decrement"
        >
          <Minus size={16} />
        </button>

        <div className="text-center px-4">
          <div className="text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
            {counter}
          </div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
            Global Count
          </span>
        </div>

        <button
          onClick={handleIncrement}
          className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white flex items-center justify-center transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
          title="Increment"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
