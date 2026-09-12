import React, { useState } from 'react';
import { useRoomStore } from '../../store/useRoomStore';
import { CURSOR_PALETTE, getContrastTextColor } from '../../utils/colors';
import { storageService } from '../../services/storageService';
import { X, Check, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const currentUser = useRoomStore((s) => s.currentUser);
  const updateUser = useRoomStore((s) => s.updateUser);

  const [username, setUsername] = useState(currentUser?.username || '');
  const [selectedColor, setSelectedColor] = useState(currentUser?.color || '#6366f1');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    storageService.setUserName(username.trim());
    storageService.setUserColor(selectedColor);

    if (currentUser) {
      updateUser(currentUser.id, {
        username: username.trim(),
        color: selectedColor,
      });
    }

    toast.success('Profile updated!');
    onClose();
  };

  const textColor = getContrastTextColor(selectedColor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 w-full max-w-md backdrop-blur-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <UserIcon size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Your Profile</h3>
              <p className="text-xs text-slate-400">Customize how peers see your cursor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Display Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={24}
              placeholder="e.g. Alex (Design Lead)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Cursor & Avatar Color
            </label>
            <div className="grid grid-cols-6 gap-2.5">
              {CURSOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-md cursor-pointer relative"
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <Check size={18} strokeWidth={3} style={{ color: getContrastTextColor(color) }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Card */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Live Cursor Preview
            </label>
            <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-center relative min-h-[100px] overflow-hidden">
              <div className="flex flex-col items-start origin-top-left">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg"
                >
                  <path
                    d="M3 3L10.07 20.97L12.58 13.11L20.44 10.6L3 3Z"
                    fill={selectedColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold shadow-md mt-1"
                  style={{ backgroundColor: selectedColor, color: textColor }}
                >
                  {username || 'Your Name'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
