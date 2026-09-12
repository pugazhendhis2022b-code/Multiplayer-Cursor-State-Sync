import { User, RoomData } from './room';
import { SharedNote, SharedState, SharedToggles } from './state';
import { CursorPosition, LaserPoint } from './cursor';

export interface ServerToClientEvents {
  'room:joined': (data: { room: RoomData & { sharedState: SharedState }; currentUser: User }) => void;
  'room:user_joined': (data: { user: User }) => void;
  'room:user_left': (data: { userId: string; username: string }) => void;
  'room:host_changed': (data: { hostId: string }) => void;
  'cursor:sync': (data: {
    userId: string;
    username?: string;
    color?: string;
    x: number;
    y: number;
    timestamp: number;
    isIdle: boolean;
    typingMessage?: string | null;
  }) => void;
  'cursor:clicked': (data: { userId: string; x: number; y: number; timestamp: number }) => void;
  'cursor:pinged': (data: {
    userId: string;
    username: string;
    color: string;
    x: number;
    y: number;
    timestamp: number;
  }) => void;
  'cursor:chatted': (data: { userId: string; message: string; timestamp: number }) => void;
  'laser:drawn': (data: {
    userId: string;
    color: string;
    points: Array<{ x: number; y: number; timestamp: number }>;
  }) => void;
  'state:counter:changed': (data: { counter: number; updatedBy: string }) => void;
  'state:editor:changed': (data: { text: string; userId: string; username: string }) => void;
  'state:note:created': (note: SharedNote) => void;
  'state:note:updated': (note: SharedNote) => void;
  'state:note:deleted': (data: { noteId: string }) => void;
  'state:toggle:changed': (data: { key: keyof SharedToggles; value: boolean }) => void;
  'reaction:broadcast': (data: {
    userId: string;
    username: string;
    emoji: string;
    x: number;
    y: number;
    timestamp: number;
  }) => void;
  'pong:reply': (clientTimestamp: number) => void;
}

export interface ClientToServerEvents {
  'ping:check': (clientTimestamp: number, callback?: (ts: number) => void) => void;
  'room:join': (
    payload: { roomId: string; username: string; color?: string; avatarUrl?: string },
    callback?: (response: { success: boolean; data?: any; error?: string }) => void
  ) => void;
  'room:leave': () => void;
  'cursor:update': (payload: {
    x: number;
    y: number;
    isIdle?: boolean;
    typingMessage?: string | null;
  }) => void;
  'cursor:click': (payload: { x: number; y: number }) => void;
  'cursor:ping': (payload: { x: number; y: number }) => void;
  'cursor:chat': (message: string) => void;
  'laser:draw': (payload: { points: Array<{ x: number; y: number; timestamp: number }> }) => void;
  'state:counter:update': (delta: number | 'reset') => void;
  'state:editor:update': (text: string) => void;
  'state:note:create': (note: SharedNote) => void;
  'state:note:update': (payload: { noteId: string; updates: Partial<SharedNote> }) => void;
  'state:note:delete': (noteId: string) => void;
  'state:toggle:update': (payload: { key: keyof SharedToggles; value: boolean }) => void;
  'reaction:send': (emoji: string, coords?: { x: number; y: number }) => void;
}
