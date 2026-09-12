import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Connecting to real-time collaboration cluster...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-2xl">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-2 text-white font-bold text-lg mb-2">
        <Sparkles size={18} className="text-indigo-400" />
        <span>SyncPoint</span>
      </div>

      <p className="text-xs text-slate-400 max-w-xs text-center font-medium animate-pulse">
        {message}
      </p>
    </div>
  );
};
