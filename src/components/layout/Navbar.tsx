import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoomStore } from '../../store/useRoomStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { StatusBadge } from '../presence/StatusBadge';
import { UserList } from '../presence/UserList';
import { UserProfileModal } from '../presence/UserProfileModal';
import { QRCodeModal } from '../common/QRCodeModal';
import { SettingsPanel } from '../common/SettingsPanel';
import {
  Share2,
  Copy,
  LogOut,
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  QrCode,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const roomId = useRoomStore((s) => s.roomId);
  const roomName = useRoomStore((s) => s.roomName);
  const isDemoMode = useRoomStore((s) => s.isDemoMode);
  const currentUser = useRoomStore((s) => s.currentUser);

  const theme = useSettingsStore((s) => s.theme);
  const toggleTheme = useSettingsStore((s) => s.toggleTheme);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const [showProfile, setShowProfile] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleCopyLink = () => {
    if (!roomId) return;
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    toast.success('Room link copied! Share it with your team 🚀');
  };

  const handleLeave = () => {
    useRoomStore.getState().leaveRoom();
    navigate('/');
    toast('Left collaboration room', { icon: '👋' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 py-3 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand & Room Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white font-bold text-sm sm:text-base tracking-tight hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M3 3l7 18 3-7 7-3L3 3z" />
                </svg>
              </div>
              <span className="hidden sm:inline font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                SyncPoint
              </span>
            </button>

            {roomId && (
              <>
                <div className="h-4 w-px bg-slate-800 shrink-0" />
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px] sm:max-w-[200px]">
                    {roomName || roomId}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
                    title="Copy Invite Link (Ctrl+C)"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Center Presence Status */}
          <div className="hidden md:flex items-center gap-2">
            <StatusBadge />
            {isDemoMode && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                <Sparkles size={12} />
                Simulating 5 Bots
              </span>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Online Users Avatar Stack */}
            <UserList />

            {/* QR Code Share Modal */}
            <button
              onClick={() => setShowQR(true)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="QR Code Invite"
            >
              <QrCode size={16} />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-900/80 text-indigo-400 border-slate-800 hover:bg-slate-800'
                  : 'bg-slate-900/40 text-slate-500 border-slate-800 hover:bg-slate-800'
              }`}
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Dark/Light Mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Toggle Theme (Ctrl+D)"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Preferences"
            >
              <Settings size={16} />
            </button>

            {/* User Profile Avatar */}
            {currentUser && (
              <button
                onClick={() => setShowProfile(true)}
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border border-white/20 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                style={{ backgroundColor: currentUser.color, color: '#ffffff' }}
                title="Edit Profile"
              >
                {currentUser.username.charAt(0).toUpperCase()}
              </button>
            )}

            {/* Leave Room */}
            <button
              onClick={handleLeave}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
              title="Leave Room (Esc)"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      {roomId && <QRCodeModal isOpen={showQR} onClose={() => setShowQR(false)} roomId={roomId} />}
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};
