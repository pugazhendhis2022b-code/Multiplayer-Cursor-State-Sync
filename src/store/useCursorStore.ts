import { create } from 'zustand';
import { RemoteCursor, TrailPoint, ClickRipple, CursorPing, LaserStroke } from '../types/cursor';
import { lerp, distance } from '../utils/math';

interface CursorState {
  cursors: Record<string, RemoteCursor>;
  trails: Record<string, TrailPoint[]>;
  clickRipples: ClickRipple[];
  pings: CursorPing[];
  laserStrokes: Record<string, LaserStroke>;
  myLaserActive: boolean;
  myLaserPoints: Array<{ x: number; y: number; timestamp: number }>;
  cursorChatInput: string | null;

  // Actions
  updateRemoteTarget: (
    userId: string,
    x: number,
    y: number,
    timestamp: number,
    metadata?: { username?: string; color?: string; isIdle?: boolean; typingMessage?: string | null }
  ) => void;
  stepInterpolation: (lerpFactor: number, trailEnabled: boolean, maxTrailPoints: number) => void;
  removeCursor: (userId: string) => void;
  addClickRipple: (ripple: ClickRipple) => void;
  removeClickRipple: (id: string) => void;
  addPing: (ping: CursorPing) => void;
  removePing: (id: string) => void;
  recordLaserPoints: (userId: string, color: string, points: Array<{ x: number; y: number; timestamp: number }>) => void;
  setMyLaserActive: (active: boolean) => void;
  addMyLaserPoint: (x: number, y: number) => void;
  clearMyLaserPoints: () => void;
  setCursorChatInput: (input: string | null) => void;
  setRemoteChat: (userId: string, message: string) => void;
  clearAllCursors: () => void;
}

export const useCursorStore = create<CursorState>((set, get) => ({
  cursors: {},
  trails: {},
  clickRipples: [],
  pings: [],
  laserStrokes: {},
  myLaserActive: false,
  myLaserPoints: [],
  cursorChatInput: null,

  updateRemoteTarget: (userId, x, y, timestamp, metadata) => {
    set((state) => {
      const existing = state.cursors[userId];
      const currentX = existing ? existing.currentX : x;
      const currentY = existing ? existing.currentY : y;

      const updated: RemoteCursor = {
        userId,
        username: metadata?.username ?? existing?.username ?? 'Collaborator',
        color: metadata?.color ?? existing?.color ?? '#6366f1',
        isIdle: metadata?.isIdle ?? false,
        lastActive: timestamp,
        typingMessage: metadata?.typingMessage !== undefined ? metadata.typingMessage : existing?.typingMessage,
        currentX,
        currentY,
        targetX: x,
        targetY: y,
        x,
        y,
        timestamp,
      };

      return {
        cursors: { ...state.cursors, [userId]: updated },
      };
    });
  },

  stepInterpolation: (lerpFactor, trailEnabled, maxTrailPoints) => {
    const { cursors, trails, laserStrokes } = get();
    const updatedCursors: Record<string, RemoteCursor> = {};
    const updatedTrails: Record<string, TrailPoint[]> = { ...trails };
    let cursorsChanged = false;
    const now = Date.now();

    for (const [userId, cursor] of Object.entries(cursors)) {
      // Exponential smoothing towards target
      const nextX = lerp(cursor.currentX, cursor.targetX, lerpFactor);
      const nextY = lerp(cursor.currentY, cursor.targetY, lerpFactor);

      const delta = distance(cursor.currentX, cursor.currentY, nextX, nextY);

      if (delta > 0.001 || cursor.currentX !== nextX || cursor.currentY !== nextY) {
        cursorsChanged = true;
      }

      updatedCursors[userId] = {
        ...cursor,
        currentX: nextX,
        currentY: nextY,
      };

      // Generate trail point if moving and trail is enabled
      if (trailEnabled) {
        const userTrail = updatedTrails[userId] || [];
        if (delta > 0.05) {
          const newTrail = [
            ...userTrail,
            { x: nextX, y: nextY, opacity: 1, timestamp: now },
          ].slice(-maxTrailPoints);
          updatedTrails[userId] = newTrail;
        } else if (userTrail.length > 0) {
          // Fade existing trail
          updatedTrails[userId] = userTrail
            .map((p) => ({ ...p, opacity: p.opacity - 0.05 }))
            .filter((p) => p.opacity > 0 && now - p.timestamp < 1000);
        }
      }
    }

    // Clean old laser strokes (> 1.5 seconds old)
    const activeLaserStrokes: Record<string, LaserStroke> = {};
    for (const [key, stroke] of Object.entries(laserStrokes)) {
      const freshPoints = stroke.points.filter((p) => now - p.timestamp < 1500);
      if (freshPoints.length > 0) {
        activeLaserStrokes[key] = { ...stroke, points: freshPoints };
      }
    }

    if (cursorsChanged || trailEnabled) {
      set({
        cursors: updatedCursors,
        trails: updatedTrails,
        laserStrokes: activeLaserStrokes,
      });
    }
  },

  removeCursor: (userId) => {
    set((state) => {
      const newCursors = { ...state.cursors };
      const newTrails = { ...state.trails };
      delete newCursors[userId];
      delete newTrails[userId];
      return { cursors: newCursors, trails: newTrails };
    });
  },

  addClickRipple: (ripple) => {
    set((state) => ({
      clickRipples: [...state.clickRipples, ripple],
    }));
  },

  removeClickRipple: (id) => {
    set((state) => ({
      clickRipples: state.clickRipples.filter((r) => r.id !== id),
    }));
  },

  addPing: (ping) => {
    set((state) => ({
      pings: [...state.pings, ping],
    }));
  },

  removePing: (id) => {
    set((state) => ({
      pings: state.pings.filter((p) => p.id !== id),
    }));
  },

  recordLaserPoints: (userId, color, points) => {
    set((state) => {
      const existing = state.laserStrokes[userId];
      const combined = existing ? [...existing.points, ...points] : points;
      return {
        laserStrokes: {
          ...state.laserStrokes,
          [userId]: {
            id: `laser-${userId}`,
            userId,
            color,
            points: combined.slice(-150),
          },
        },
      };
    });
  },

  setMyLaserActive: (active) => set({ myLaserActive: active }),

  addMyLaserPoint: (x, y) => {
    const pt = { x, y, timestamp: Date.now() };
    set((state) => ({
      myLaserPoints: [...state.myLaserPoints.slice(-120), pt],
    }));
  },

  clearMyLaserPoints: () => set({ myLaserPoints: [] }),

  setCursorChatInput: (input) => set({ cursorChatInput: input }),

  setRemoteChat: (userId, message) => {
    set((state) => {
      const cursor = state.cursors[userId];
      if (!cursor) return state;
      return {
        cursors: {
          ...state.cursors,
          [userId]: {
            ...cursor,
            typingMessage: message,
            lastActive: Date.now(),
          },
        },
      };
    });
  },

  clearAllCursors: () =>
    set({
      cursors: {},
      trails: {},
      clickRipples: [],
      pings: [],
      laserStrokes: {},
      myLaserPoints: [],
      cursorChatInput: null,
    }),
}));
