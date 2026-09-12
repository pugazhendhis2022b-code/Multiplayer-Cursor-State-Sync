export interface User {
  id: string;
  username: string;
  color: string;
  role: 'host' | 'member';
  joinedAt: number;
  lastSeen: number;
  isIdle: boolean;
  avatarUrl?: string;
}

export interface CursorPosition {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  timestamp: number;
  isIdle?: boolean;
  typingMessage?: string | null;
}

export interface CursorUpdatePayload extends CursorPosition {
  userId: string;
  username?: string;
  color?: string;
}

export interface CursorClickPayload {
  userId: string;
  x: number;
  y: number;
  timestamp: number;
}

export interface CursorPingPayload {
  userId: string;
  x: number;
  y: number;
  timestamp: number;
}

export interface LaserPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface LaserDrawPayload {
  userId: string;
  points: LaserPoint[];
}

export interface SharedNote {
  id: string;
  x: number;
  y: number;
  color: string;
  content: string;
  author: string;
  authorId: string;
  updatedAt: number;
}

export interface SharedState {
  counter: number;
  editorText: string;
  editorActiveUser: string | null;
  notes: SharedNote[];
  toggles: {
    darkModeDefault: boolean;
    streamActive: boolean;
    gridSnap: boolean;
    readOnlyMode: boolean;
  };
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  users: Map<string, User>;
  sharedState: SharedState;
  createdAt: number;
}

export interface ReactionPayload {
  userId: string;
  username: string;
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
}
