import React from 'react';
import { useSettingsStore, CursorSize } from '../../store/useSettingsStore';
import { useRoomStore } from '../../store/useRoomStore';
import { demoSimulator } from '../../socket/demoSimulator';
import { X, Sliders, Volume2, Sparkles, Eye, Zap, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const cursorSize = useSettingsStore((s) => s.cursorSize);
  const setCursorSize = useSettingsStore((s) => s.setCursorSize);
  const cursorTrailEnabled = useSettingsStore((s) => s.cursorTrailEnabled);
  const setCursorTrailEnabled = useSettingsStore((s) => s.setCursorTrailEnabled);
  const cursorTrailLength = useSettingsStore((s) => s.cursorTrailLength);
  const setCursorTrailLength = useSettingsStore((s) => s.setCursorTrailLength);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);

  const isDemoMode = useRoomStore((s) => s.isDemoMode);
  const roomId = useRoomStore((s) => s.roomId);

  if (!isOpen) return null;

  const handleToggleDemo = () => {
    const next = !isDemoMode;
    useRoomStore.getState().setDemoMode(next);
    if (next) {
      demoSimulator.start(roomId || 'demo-room');
      toast.success('Demo Mode enabled (5 simulated bots active)');
    } else {
      demoSimulator.stop();
      toast('Demo Mode disabled');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 w-full max-w-md backdrop-blur-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Collaboration Settings</h3>
              <p className="text-xs text-slate-400">Tune rendering, sound, and simulator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-xs text-slate-300">
          {/* Theme */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Palette size={16} className="text-indigo-400" />
              <div>
                <span className="font-semibold text-white block">Theme Mode</span>
                <span className="text-[10px] text-slate-400">Dark glassmorphism / Light</span>
              </div>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  theme === 'dark' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  theme === 'light' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Light
              </button>
            </div>
          </div>

          {/* Cursor Size */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Eye size={16} className="text-cyan-400" />
              <div>
                <span className="font-semibold text-white block">Cursor Pointer Scale</span>
                <span className="text-[10px] text-slate-400">Scale cursor size</span>
              </div>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-xl">
              {(['small', 'medium', 'large'] as CursorSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setCursorSize(size)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                    cursorSize === size ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Cursor Trails */}
          <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap size={16} className="text-amber-400" />
                <div>
                  <span className="font-semibold text-white block">Cursor Motion Trails</span>
                  <span className="text-[10px] text-slate-400">Fading particles behind active cursors</span>
                </div>
              </div>
              <button
                onClick={() => setCursorTrailEnabled(!cursorTrailEnabled)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                  cursorTrailEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    cursorTrailEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {cursorTrailEnabled && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <span className="text-[11px] text-slate-400">Trail Length: {cursorTrailLength}</span>
                <input
                  type="range"
                  min="6"
                  max="24"
                  value={cursorTrailLength}
                  onChange={(e) => setCursorTrailLength(parseInt(e.target.value, 10))}
                  className="w-32 accent-indigo-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Web Audio Synthesizer */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Volume2 size={16} className="text-emerald-400" />
              <div>
                <span className="font-semibold text-white block">Procedural Audio (Web Audio API)</span>
                <span className="text-[10px] text-slate-400">Subtle chimes on join, clicks, & reactions</span>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Demo Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} className="text-purple-400" />
              <div>
                <span className="font-semibold text-white block">Demo Mode Simulation</span>
                <span className="text-[10px] text-slate-400">Simulate 5 realistic bots</span>
              </div>
            </div>
            <button
              onClick={handleToggleDemo}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                isDemoMode ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isDemoMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
