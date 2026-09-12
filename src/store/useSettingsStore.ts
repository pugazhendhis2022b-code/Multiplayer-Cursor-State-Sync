import { create } from 'zustand';
import { soundService } from '../services/soundService';
import { storageService } from '../services/storageService';

export type ToolType = 'select' | 'chat' | 'laser' | 'note' | 'reaction';
export type CursorSize = 'small' | 'medium' | 'large';

interface SettingsState {
  theme: 'dark' | 'light';
  cursorSize: CursorSize;
  cursorTrailEnabled: boolean;
  cursorTrailLength: number;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  fpsMode: '60' | '120' | 'eco';
  highContrast: boolean;
  activeTool: ToolType;

  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setCursorSize: (size: CursorSize) => void;
  setCursorTrailEnabled: (enabled: boolean) => void;
  setCursorTrailLength: (length: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setFpsMode: (mode: '60' | '120' | 'eco') => void;
  setHighContrast: (enabled: boolean) => void;
  setActiveTool: (tool: ToolType) => void;
}

const initialTheme = storageService.get<'dark' | 'light'>('theme', 'dark');
const initialSound = storageService.get<boolean>('sound_enabled', true);
soundService.setEnabled(initialSound);

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: initialTheme,
  cursorSize: storageService.get<CursorSize>('cursor_size', 'medium'),
  cursorTrailEnabled: storageService.get<boolean>('cursor_trail', true),
  cursorTrailLength: storageService.get<number>('cursor_trail_length', 12),
  soundEnabled: initialSound,
  animationsEnabled: true,
  fpsMode: '60',
  highContrast: false,
  activeTool: 'select',

  setTheme: (theme) => {
    storageService.set('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },

  setCursorSize: (cursorSize) => {
    storageService.set('cursor_size', cursorSize);
    set({ cursorSize });
  },

  setCursorTrailEnabled: (cursorTrailEnabled) => {
    storageService.set('cursor_trail', cursorTrailEnabled);
    set({ cursorTrailEnabled });
  },

  setCursorTrailLength: (cursorTrailLength) => {
    storageService.set('cursor_trail_length', cursorTrailLength);
    set({ cursorTrailLength });
  },

  setSoundEnabled: (soundEnabled) => {
    storageService.set('sound_enabled', soundEnabled);
    soundService.setEnabled(soundEnabled);
    set({ soundEnabled });
  },

  toggleSound: () => {
    const next = !get().soundEnabled;
    get().setSoundEnabled(next);
  },

  setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),

  setFpsMode: (fpsMode) => set({ fpsMode }),

  setHighContrast: (highContrast) => set({ highContrast }),

  setActiveTool: (activeTool) => set({ activeTool }),
}));
