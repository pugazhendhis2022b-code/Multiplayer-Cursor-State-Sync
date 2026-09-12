import { create } from 'zustand';
import { User, ConnectionStatus, ActivityItem } from '../types/room';

interface RoomState {
  roomId: string | null;
  roomName: string;
  currentUser: User | null;
  users: User[];
  hostId: string | null;
  connectionStatus: ConnectionStatus;
  latency: number;
  isDemoMode: boolean;
  activityFeed: ActivityItem[];

  // Actions
  setRoom: (roomId: string, name?: string, hostId?: string) => void;
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  updateUser: (userId: string, partial: Partial<User>) => void;
  setHostId: (hostId: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setLatency: (latency: number) => void;
  setDemoMode: (isDemo: boolean) => void;
  addActivity: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  leaveRoom: () => void;
  resetRoom: () => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  roomId: null,
  roomName: '',
  currentUser: null,
  users: [],
  hostId: null,
  connectionStatus: 'disconnected',
  latency: 0,
  isDemoMode: false,
  activityFeed: [],

  setRoom: (roomId, name, hostId) => {
    set({
      roomId,
      roomName: name || `Room ${roomId.slice(0, 6)}`,
      hostId: hostId || null,
    });
  },

  setCurrentUser: (user) => set({ currentUser: user }),

  setUsers: (users) => set({ users }),

  addUser: (user) => {
    const existing = get().users.find((u) => u.id === user.id);
    if (!existing) {
      set((state) => ({
        users: [...state.users, user],
      }));
      get().addActivity({
        type: 'join',
        username: user.username,
        text: 'joined the room',
      });
    }
  },

  removeUser: (userId) => {
    const user = get().users.find((u) => u.id === userId);
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
      hostId: state.hostId === userId ? null : state.hostId,
    }));
    if (user) {
      get().addActivity({
        type: 'leave',
        username: user.username,
        text: 'left the room',
      });
    }
  },

  updateUser: (userId, partial) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, ...partial } : u)),
      currentUser:
        state.currentUser?.id === userId
          ? { ...state.currentUser, ...partial }
          : state.currentUser,
    }));
  },

  setHostId: (hostId) => set({ hostId }),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setLatency: (latency) => set({ latency }),

  setDemoMode: (isDemoMode) =>
    set({
      isDemoMode,
      connectionStatus: isDemoMode ? 'demo' : 'disconnected',
    }),

  addActivity: (item) => {
    const newItem: ActivityItem = {
      ...item,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    set((state) => ({
      activityFeed: [newItem, ...state.activityFeed].slice(0, 20),
    }));
  },

  leaveRoom: () => {
    set({
      roomId: null,
      roomName: '',
      users: [],
      hostId: null,
      connectionStatus: 'disconnected',
      activityFeed: [],
    });
  },

  resetRoom: () => {
    set({
      roomId: null,
      roomName: '',
      currentUser: null,
      users: [],
      hostId: null,
      connectionStatus: 'disconnected',
      latency: 0,
      isDemoMode: false,
      activityFeed: [],
    });
  },
}));
