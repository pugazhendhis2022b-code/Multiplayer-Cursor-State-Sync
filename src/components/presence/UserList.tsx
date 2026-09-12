import React, { useState } from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { useCursorStore } from '../../store/useCursorStore';
import { getContrastTextColor } from '../../utils/colors';
import { Crown, Users, ChevronDown, Radio } from 'lucide-react';

export const UserList: React.FC = () => {
  const users = useRoomStore((s) => s.users);
  const hostId = useRoomStore((s) => s.hostId);
  const currentUser = useRoomStore((s) => s.currentUser);
  const [isOpen, setIsOpen] = useState(false);

  const handlePingUser = (userId: string) => {
    const cursor = useCursorStore.getState().cursors[userId];
    if (cursor) {
      useCursorStore.getState().addPing({
        id: `ping-target-${Date.now()}`,
        userId: cursor.userId,
        username: cursor.username,
        color: cursor.color,
        x: cursor.currentX,
        y: cursor.currentY,
        timestamp: Date.now(),
      });
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button: Overlapping Avatars + Count */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 backdrop-blur-md transition-all shadow-sm group cursor-pointer"
        title="View online users"
      >
        <div className="flex items-center -space-x-2 overflow-hidden py-0.5">
          {users.slice(0, 4).map((user) => {
            const textColor = getContrastTextColor(user.color);
            return (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-slate-900 shadow-sm"
                style={{ backgroundColor: user.color, color: textColor }}
                title={user.username}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-slate-200">
          <Users size={14} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span>{users.length}</span>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Collaborators ({users.length})
            </span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {users.map((user) => {
              const isHost = user.id === hostId || user.role === 'host';
              const isMe = user.id === currentUser?.id;
              const textColor = getContrastTextColor(user.color);

              return (
                <div
                  key={user.id}
                  onClick={() => !isMe && handlePingUser(user.id)}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors ${
                    isMe ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-slate-800/60 cursor-pointer'
                  }`}
                  title={isMe ? 'You' : 'Click to locate cursor'}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm"
                      style={{ backgroundColor: user.color, color: textColor }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-slate-200 truncate">
                      {user.username} {isMe && <span className="text-[10px] text-indigo-400 font-semibold">(You)</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isHost && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-md">
                        <Crown size={11} />
                        Host
                      </span>
                    )}
                    {!isMe && (
                      <Radio size={12} className="text-slate-500 hover:text-indigo-400 transition-colors" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
