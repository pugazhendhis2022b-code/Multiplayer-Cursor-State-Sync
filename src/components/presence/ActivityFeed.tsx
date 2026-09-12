import React, { useState } from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { formatRelativeTime } from '../../utils/formatters';
import { Activity, ChevronRight, MessageSquare, PlusCircle, LogIn, LogOut, Heart } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const activityFeed = useRoomStore((s) => s.activityFeed);

  const getIcon = (type: string) => {
    switch (type) {
      case 'join':
        return <LogIn size={12} className="text-emerald-400" />;
      case 'leave':
        return <LogOut size={12} className="text-rose-400" />;
      case 'note':
        return <PlusCircle size={12} className="text-amber-400" />;
      case 'chat':
        return <MessageSquare size={12} className="text-cyan-400" />;
      case 'reaction':
        return <Heart size={12} className="text-pink-400" />;
      default:
        return <Activity size={12} className="text-indigo-400" />;
    }
  };

  if (activityFeed.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-6 z-30 hidden md:block max-w-xs transition-all duration-300">
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden">
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-between px-3 py-2 bg-slate-800/50 cursor-pointer border-b border-slate-700/40 select-none"
        >
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Live Activity</span>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded-full font-mono">
              {activityFeed.length}
            </span>
          </div>
          <ChevronRight
            size={14}
            className={`text-slate-400 transition-transform duration-200 ${
              collapsed ? '' : 'rotate-90'
            }`}
          />
        </div>

        {!collapsed && (
          <div className="p-2 space-y-1.5 max-h-48 overflow-y-auto">
            {activityFeed.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-800/40 text-xs text-slate-300 hover:bg-slate-800/70 transition-colors"
              >
                <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                <div className="min-w-0 flex-1 leading-snug">
                  <span className="font-semibold text-white">{item.username}</span>{' '}
                  <span className="text-slate-400">{item.text}</span>
                  <div className="text-[9px] text-slate-500 mt-0.5 font-mono">
                    {formatRelativeTime(item.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
