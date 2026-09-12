import React, { useState, useEffect, useRef } from 'react';
import { useCursorStore } from '../../store/useCursorStore';
import { useRoomStore } from '../../store/useRoomStore';
import { socketClient } from '../../socket/socketClient';

interface CursorChatBubbleProps {
  cursorPosition: { x: number; y: number };
}

export const CursorChatBubble: React.FC<CursorChatBubbleProps> = ({ cursorPosition }) => {
  const cursorChatInput = useCursorStore((s) => s.cursorChatInput);
  const setCursorChatInput = useCursorStore((s) => s.setCursorChatInput);
  const currentUser = useRoomStore((s) => s.currentUser);
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cursorChatInput !== null) {
      setText(cursorChatInput);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setText('');
    }
  }, [cursorChatInput]);

  if (cursorChatInput === null) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    setCursorChatInput(val);
    socketClient.emitChat(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (text.trim()) {
        socketClient.emitChat(text.trim());
        useRoomStore.getState().addActivity({
          type: 'chat',
          username: currentUser?.username || 'You',
          text: `said "${text.trim()}"`,
        });
      }
      setCursorChatInput(null);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setCursorChatInput(null);
      socketClient.emitChat('');
    }
  };

  return (
    <div
      className="fixed pointer-events-auto z-50 transition-transform duration-75"
      style={{
        left: `${cursorPosition.x}%`,
        top: `${cursorPosition.y}%`,
        transform: 'translate(14px, 14px)',
      }}
    >
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in zoom-in-95 duration-150"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          borderColor: currentUser?.color || '#6366f1',
          boxShadow: `0 10px 25px -5px ${currentUser?.color || '#6366f1'}40`,
        }}
      >
        <span className="text-xs select-none">💬</span>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Say something... (Enter to send, Esc to close)"
          className="bg-transparent border-none text-xs text-white placeholder-slate-400 focus:outline-none w-56 font-medium"
          maxLength={100}
        />
      </div>
    </div>
  );
};
