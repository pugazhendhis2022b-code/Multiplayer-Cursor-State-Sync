import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-xl">
        <span className="text-2xl font-black font-mono">404</span>
      </div>

      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
        Collaboration Room Not Found
      </h1>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        The room you are looking for does not exist or has expired. Create a new room or return to the landing page.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Home size={15} />
          <span>Return Home</span>
        </button>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};
