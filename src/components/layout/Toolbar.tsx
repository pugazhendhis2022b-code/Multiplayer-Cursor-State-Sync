import React from 'react';
import { useSettingsStore, ToolType } from '../../store/useSettingsStore';
import { useCursorStore } from '../../store/useCursorStore';
import { MousePointer2, MessageSquare, Zap, StickyNote, Smile, Radio } from 'lucide-react';
import { EmojiReactionBar } from '../shared-state/EmojiReactionBar';

export const Toolbar: React.FC = () => {
  const activeTool = useSettingsStore((s) => s.activeTool);
  const setActiveTool = useSettingsStore((s) => s.setActiveTool);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  const handleToolSelect = (tool: ToolType) => {
    setActiveTool(tool);

    if (tool === 'chat') {
      useCursorStore.getState().setCursorChatInput('');
    } else if (tool === 'reaction') {
      setShowEmojiPicker(!showEmojiPicker);
    } else {
      setShowEmojiPicker(false);
    }
  };

  const tools: Array<{ id: ToolType; label: string; icon: React.ReactNode; shortcut: string }> = [
    { id: 'select', label: 'Select Cursor', icon: <MousePointer2 size={18} />, shortcut: 'V' },
    { id: 'chat', label: 'Cursor Chat', icon: <MessageSquare size={18} />, shortcut: '/' },
    { id: 'laser', label: 'Laser Pointer', icon: <Zap size={18} />, shortcut: 'L' },
    { id: 'reaction', label: 'Emoji Reaction', icon: <Smile size={18} />, shortcut: 'E' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 select-none">
      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-150">
          <EmojiReactionBar />
        </div>
      )}

      {/* Floating Pill Container */}
      <nav aria-label="Collaboration Tools" className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/70 shadow-2xl backdrop-blur-2xl">
        {tools.map((t) => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleToolSelect(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title={`${t.label} (${t.shortcut})`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
              <kbd className={`hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded ${
                isActive ? 'bg-indigo-700/50 text-indigo-100' : 'bg-slate-800 text-slate-400'
              }`}>
                {t.shortcut}
              </kbd>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
