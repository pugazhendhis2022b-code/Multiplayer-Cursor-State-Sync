import React from 'react';
import { useSharedStateStore } from '../../store/useSharedStateStore';
import { socketClient } from '../../socket/socketClient';
import { soundService } from '../../services/soundService';

const EMOJIS = ['❤️', '🔥', '🚀', '🎉', '👀', '👏', '✨', '💯'];

export const EmojiReactionBar: React.FC = () => {
  const reactions = useSharedStateStore((s) => s.reactions);

  const handleSendReaction = (emoji: string) => {
    // Generate a burst at random or central coordinate
    const x = Math.floor(Math.random() * 60) + 20;
    const y = Math.floor(Math.random() * 40) + 40;

    socketClient.emitReaction(emoji, { x, y });
    soundService.playReaction();
  };

  return (
    <>
      {/* Floating Reactions on Canvas */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {reactions.map((r) => (
          <div
            key={r.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-out fade-out slide-out-to-top-24 duration-1000 fill-mode-forwards"
            style={{
              left: `${r.x}%`,
              top: `${r.y}%`,
            }}
          >
            <span className="text-3xl filter drop-shadow-md select-none transform hover:scale-125 transition-transform">
              {r.emoji}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-900/80 text-slate-200 shadow-md whitespace-nowrap mt-1 border border-slate-700/60">
              {r.username}
            </span>
          </div>
        ))}
      </div>

      {/* Floating Reaction Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleSendReaction(emoji)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-base hover:scale-125 active:scale-90 transition-all hover:bg-slate-800/80 cursor-pointer select-none"
            title={`Send ${emoji} reaction`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};
