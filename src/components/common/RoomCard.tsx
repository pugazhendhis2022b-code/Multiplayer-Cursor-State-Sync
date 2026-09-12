import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateRoomId } from '../../utils/formatters';
import { storageService } from '../../services/storageService';
import { Sparkles, ArrowRight, PlusCircle, Users, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

export const RoomCard: React.FC = () => {
  const navigate = useNavigate();
  const [roomIdInput, setRoomIdInput] = useState('');
  const [usernameInput, setUsernameInput] = useState(() => storageService.getUserName() || '');
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = usernameInput.trim() || `Collaborator-${Math.floor(100 + Math.random() * 900)}`;
    storageService.setUserName(finalName);

    const generatedId = generateRoomId();
    toast.success(`Created room "${generatedId}"`);
    navigate(`/room/${generatedId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomIdInput.trim()) {
      toast.error('Please enter a valid Room ID');
      return;
    }
    const finalName = usernameInput.trim() || `Collaborator-${Math.floor(100 + Math.random() * 900)}`;
    storageService.setUserName(finalName);

    const cleanId = roomIdInput.trim().toLowerCase();
    navigate(`/room/${cleanId}`);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900/80 border border-slate-700/80 rounded-3xl shadow-2xl p-6 backdrop-blur-2xl">
      {/* Tabs */}
      <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-slate-800 mb-5">
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'create'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle size={14} />
          <span>Create Room</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('join')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'join'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users size={14} />
          <span>Join Existing</span>
        </button>
      </div>

      {activeTab === 'create' ? (
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Your Display Name
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. Elena (Design)"
              maxLength={24}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
            />
          </div>

          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
            <Sparkles size={16} className="shrink-0 mt-0.5" />
            <span>A unique room code will be generated automatically. You will be designated as host.</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Launch Live Collaboration Room</span>
            <ArrowRight size={15} />
          </button>
        </form>
      ) : (
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Your Display Name
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. Marcus (Developer)"
              maxLength={24}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Room Identifier / Code
            </label>
            <div className="relative">
              <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="e.g. swift-orbit-421"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Connect to Room</span>
            <ArrowRight size={15} />
          </button>
        </form>
      )}
    </div>
  );
};
