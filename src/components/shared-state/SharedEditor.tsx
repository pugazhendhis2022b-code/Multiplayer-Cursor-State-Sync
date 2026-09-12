import React, { useState, useEffect, useRef } from 'react';
import { useSharedStateStore } from '../../store/useSharedStateStore';
import { socketClient } from '../../socket/socketClient';
import { FileText, Sparkles } from 'lucide-react';

export const SharedEditor: React.FC = () => {
  const editorText = useSharedStateStore((s) => s.editorText);
  const editorActiveUser = useSharedStateStore((s) => s.editorActiveUser);
  const [localText, setLocalText] = useState(editorText);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!isTypingRef.current) {
      setLocalText(editorText);
    }
  }, [editorText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalText(val);
    isTypingRef.current = true;
    socketClient.emitEditor(val);

    // Release typing lock after 600ms
    setTimeout(() => {
      isTypingRef.current = false;
    }, 600);
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col h-[320px]">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <FileText size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Collaborative Scratchpad</h3>
            <p className="text-[11px] text-slate-400">Live markdown & sync documentation</p>
          </div>
        </div>

        {editorActiveUser && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium animate-pulse">
            <Sparkles size={12} />
            <span>{editorActiveUser} typing...</span>
          </div>
        )}
      </div>

      <div className="relative flex-1 min-h-0 rounded-2xl bg-slate-950/70 border border-slate-800/80 p-3 overflow-hidden focus-within:border-indigo-500/50 transition-colors">
        <textarea
          value={localText}
          onChange={handleChange}
          placeholder="Start typing notes, plans, or code here... changes broadcast instantly to all connected peers."
          className="w-full h-full bg-transparent border-none text-xs md:text-sm text-slate-200 placeholder-slate-500 font-mono resize-none focus:outline-none leading-relaxed selection:bg-indigo-500/30"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
