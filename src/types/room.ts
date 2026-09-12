export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'demo';

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

export interface ActivityItem {
  id: string;
  type: 'join' | 'leave' | 'note' | 'counter' | 'chat' | 'reaction';
  username: string;
  text: string;
  timestamp: number;
}

export interface RoomData {
  id: string;
  name: string;
  hostId: string;
  users: User[];
  createdAt: number;
}
