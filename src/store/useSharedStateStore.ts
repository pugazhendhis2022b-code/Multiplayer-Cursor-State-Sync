import { create } from 'zustand';
import { SharedNote, SharedToggles, FlyingReaction } from '../types/state';

interface SharedStateStore {
  counter: number;
  editorText: string;
  editorActiveUser: string | null;
  notes: SharedNote[];
  toggles: SharedToggles;
  reactions: FlyingReaction[];

  // Actions
  setCounter: (counter: number) => void;
  incrementCounter: (delta?: number) => void;
  setEditorText: (text: string, activeUser?: string | null) => void;
  setNotes: (notes: SharedNote[]) => void;
  addNote: (note: SharedNote) => void;
  updateNote: (noteId: string, updates: Partial<SharedNote>) => void;
  deleteNote: (noteId: string) => void;
  setToggles: (toggles: SharedToggles) => void;
  updateToggle: (key: keyof SharedToggles, value: boolean) => void;
  addReaction: (reaction: FlyingReaction) => void;
  removeReaction: (id: string) => void;
  resetAll: () => void;
}

const DEFAULT_NOTES: SharedNote[] = [
  {
    id: 'note-welcome-1',
    x: 80,
    y: 120,
    color: '#fef08a', // Yellow
    content: '🚀 Real-time Cursor & State Sync\nMove your mouse to broadcast your position at 60 FPS.',
    author: 'System',
    authorId: 'system-bot',
    updatedAt: Date.now(),
  },
  {
    id: 'note-welcome-2',
    x: 360,
    y: 140,
    color: '#bae6fd', // Blue
    content: '⚡ Pro Tips:\n• Press / to open Cursor Chat\n• Select Laser tool for light drawing\n• Click anywhere to send pings',
    author: 'Elena',
    authorId: 'system-bot-2',
    updatedAt: Date.now(),
  },
];

const DEFAULT_TOGGLES: SharedToggles = {
  darkModeDefault: true,
  streamActive: true,
  gridSnap: false,
  readOnlyMode: false,
};

export const useSharedStateStore = create<SharedStateStore>((set) => ({
  counter: 42,
  editorText:
    '# SyncPoint Architecture Whitepaper\n\nSyncPoint demonstrates real-time distributed collaboration:\n\n1. Smooth Cursors: Coordinates are sent at 30Hz and interpolated at 60-120Hz using requestAnimationFrame + exponential lerp.\n2. Presence & State: Instant updates across Shared Notes, Shared Counter, and Live Document.\n3. Zero-Install Fallback: Automatic fallback into high-fidelity Demo Mode if backend is unreachable.\n\nType here to collaborate with peers in real-time!',
  editorActiveUser: null,
  notes: DEFAULT_NOTES,
  toggles: DEFAULT_TOGGLES,
  reactions: [],

  setCounter: (counter) => set({ counter }),

  incrementCounter: (delta = 1) => set((state) => ({ counter: state.counter + delta })),

  setEditorText: (text, activeUser = null) =>
    set({ editorText: text, editorActiveUser: activeUser }),

  setNotes: (notes) => set({ notes }),

  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),

  updateNote: (noteId, updates) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === noteId ? { ...n, ...updates, updatedAt: Date.now() } : n
      ),
    })),

  deleteNote: (noteId) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== noteId),
    })),

  setToggles: (toggles) => set({ toggles }),

  updateToggle: (key, value) =>
    set((state) => ({
      toggles: { ...state.toggles, [key]: value },
    })),

  addReaction: (reaction) =>
    set((state) => ({
      reactions: [...state.reactions, reaction].slice(-20),
    })),

  removeReaction: (id) =>
    set((state) => ({
      reactions: state.reactions.filter((r) => r.id !== id),
    })),

  resetAll: () =>
    set({
      counter: 42,
      editorText: '',
      editorActiveUser: null,
      notes: DEFAULT_NOTES,
      toggles: DEFAULT_TOGGLES,
      reactions: [],
    }),
}));
