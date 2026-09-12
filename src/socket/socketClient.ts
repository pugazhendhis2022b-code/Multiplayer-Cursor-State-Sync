import { io, Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from './events';
import { useRoomStore } from '../store/useRoomStore';
import { useCursorStore } from '../store/useCursorStore';
import { useSharedStateStore } from '../store/useSharedStateStore';
import { soundService } from '../services/soundService';
import { demoSimulator } from './demoSimulator';
import toast from 'react-hot-toast';

class SocketClient {
  private socket: Socket | null = null;
  private pingInterval: any = null;
  private fallbackTimeout: any = null;
  private currentRoomId: string | null = null;
  private isConnecting: boolean = false;

  public getSocketUrl(): string {
    return import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
  }

  public connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const roomStore = useRoomStore.getState();
    roomStore.setConnectionStatus('connecting');

    const url = this.getSocketUrl();

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 4,
      reconnectionDelay: 1000,
      timeout: 3000,
      autoConnect: true,
    });

    this.setupListeners();

    // Fallback timer: if not connected within 2.5 seconds, auto-enable Demo Mode
    clearTimeout(this.fallbackTimeout);
    this.fallbackTimeout = setTimeout(() => {
      if (!this.socket?.connected && !useRoomStore.getState().isDemoMode) {
        console.warn('Backend unavailable or delayed. Activating Demo Mode simulation.');
        this.enableDemoModeFallback();
      }
    }, 2500);

    return this.socket;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      clearTimeout(this.fallbackTimeout);
      const roomStore = useRoomStore.getState();
      roomStore.setConnectionStatus('connected');
      roomStore.setDemoMode(false);
      demoSimulator.stop();

      toast.success('Connected to real-time sync server', { id: 'socket-status' });
      this.startLatencyMonitor();
    });

    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
      console.warn('Socket connection error:', err.message);
      if (!useRoomStore.getState().isDemoMode) {
        this.enableDemoModeFallback();
      }
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      useRoomStore.getState().setConnectionStatus('disconnected');
      this.stopLatencyMonitor();
      if (reason === 'io server disconnect') {
        this.socket?.connect();
      }
    });

    // Room Events
    this.socket.on(SOCKET_EVENTS.ROOM_JOINED, (data: any) => {
      const roomStore = useRoomStore.getState();
      roomStore.setRoom(data.room.id, data.room.name, data.room.hostId);
      roomStore.setCurrentUser(data.currentUser);
      roomStore.setUsers(data.room.users);

      if (data.room.sharedState) {
        const stateStore = useSharedStateStore.getState();
        stateStore.setCounter(data.room.sharedState.counter);
        stateStore.setEditorText(data.room.sharedState.editorText);
        stateStore.setNotes(data.room.sharedState.notes || []);
        if (data.room.sharedState.toggles) {
          stateStore.setToggles(data.room.sharedState.toggles);
        }
      }
      soundService.playJoin();
    });

    this.socket.on(SOCKET_EVENTS.ROOM_USER_JOINED, (data: { user: any }) => {
      useRoomStore.getState().addUser(data.user);
      soundService.playJoin();
      toast(`${data.user.username} joined the room`, { icon: '👋' });
    });

    this.socket.on(SOCKET_EVENTS.ROOM_USER_LEFT, (data: { userId: string; username: string }) => {
      useRoomStore.getState().removeUser(data.userId);
      useCursorStore.getState().removeCursor(data.userId);
      soundService.playLeave();
      toast(`${data.username} left the room`, { icon: '🚪' });
    });

    this.socket.on(SOCKET_EVENTS.ROOM_HOST_CHANGED, (data: { hostId: string }) => {
      useRoomStore.getState().setHostId(data.hostId);
    });

    // Cursor Events
    this.socket.on(SOCKET_EVENTS.CURSOR_SYNC, (data: any) => {
      useCursorStore.getState().updateRemoteTarget(data.userId, data.x, data.y, data.timestamp, {
        username: data.username,
        color: data.color,
        isIdle: data.isIdle,
        typingMessage: data.typingMessage,
      });
    });

    this.socket.on(SOCKET_EVENTS.CURSOR_CLICKED, (data: any) => {
      const user = useRoomStore.getState().users.find((u) => u.id === data.userId);
      useCursorStore.getState().addClickRipple({
        id: `ripple-${Date.now()}-${Math.random()}`,
        x: data.x,
        y: data.y,
        color: user?.color || '#6366f1',
        timestamp: Date.now(),
      });
      soundService.playClick();
    });

    this.socket.on(SOCKET_EVENTS.CURSOR_PINGED, (data: any) => {
      useCursorStore.getState().addPing({
        id: `ping-${Date.now()}-${Math.random()}`,
        userId: data.userId,
        username: data.username,
        color: data.color,
        x: data.x,
        y: data.y,
        timestamp: Date.now(),
      });
      soundService.playPing();
    });

    this.socket.on(SOCKET_EVENTS.CURSOR_CHATTED, (data: any) => {
  console.log("CHAT RECEIVED:", data);
  useCursorStore.getState().setRemoteChat(data.userId, data.message);
});

    this.socket.on(SOCKET_EVENTS.LASER_DRAWN, (data: any) => {
      useCursorStore.getState().recordLaserPoints(data.userId, data.color, data.points);
    });

    // Shared State Events
    this.socket.on(SOCKET_EVENTS.STATE_COUNTER_CHANGED, (data: { counter: number; updatedBy: string }) => {
      useSharedStateStore.getState().setCounter(data.counter);
      soundService.playClick();
    });

    this.socket.on(SOCKET_EVENTS.STATE_EDITOR_CHANGED, (data: { text: string; userId: string; username: string }) => {
      useSharedStateStore.getState().setEditorText(data.text, data.username);
    });

    this.socket.on(SOCKET_EVENTS.STATE_NOTE_CREATED, (note: any) => {
      useSharedStateStore.getState().addNote(note);
      soundService.playNoteAdd();
    });

    this.socket.on(SOCKET_EVENTS.STATE_NOTE_UPDATED, (note: any) => {
      useSharedStateStore.getState().updateNote(note.id, note);
    });

    this.socket.on(SOCKET_EVENTS.STATE_NOTE_DELETED, (data: { noteId: string }) => {
      useSharedStateStore.getState().deleteNote(data.noteId);
    });

    this.socket.on(SOCKET_EVENTS.STATE_TOGGLE_CHANGED, (data: any) => {
      useSharedStateStore.getState().updateToggle(data.key, data.value);
    });

    this.socket.on(SOCKET_EVENTS.REACTION_BROADCAST, (data: any) => {
      useSharedStateStore.getState().addReaction({
        id: `reaction-${Date.now()}-${Math.random()}`,
        emoji: data.emoji,
        x: data.x,
        y: data.y,
        username: data.username,
        timestamp: Date.now(),
      });
      soundService.playReaction();
    });
  }

  private startLatencyMonitor() {
    this.stopLatencyMonitor();
    this.pingInterval = setInterval(() => {
      if (this.socket?.connected) {
        const start = performance.now();
        this.socket.emit(SOCKET_EVENTS.PING_CHECK, Date.now(), () => {
          const latency = Math.round(performance.now() - start);
          useRoomStore.getState().setLatency(latency);
        });
      }
    }, 3000);
  }

  private stopLatencyMonitor() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public enableDemoModeFallback() {
    clearTimeout(this.fallbackTimeout);
    const roomStore = useRoomStore.getState();
    roomStore.setDemoMode(true);
    toast.error('Server offline. Demo Mode activated with 5 simulated users!', {
      id: 'demo-mode-alert',
      duration: 4000,
    });
    demoSimulator.start(this.currentRoomId || 'demo-room');
  }

  public joinRoom(roomId: string, username: string, color?: string) {
    this.currentRoomId = roomId;
    if (useRoomStore.getState().isDemoMode) {
      demoSimulator.start(roomId, username, color);
      return;
    }

    if (!this.socket || !this.socket.connected) {
      this.connect();
    }

    this.socket?.emit(
      SOCKET_EVENTS.ROOM_JOIN,
      { roomId, username, color },
      (res: { success: boolean; data?: any; error?: string }) => {
        if (!res?.success) {
          toast.error(res?.error || 'Failed to join room');
        }
      }
    );
  }

  public leaveRoom() {
    if (useRoomStore.getState().isDemoMode) {
      demoSimulator.stop();
    } else {
      this.socket?.emit(SOCKET_EVENTS.ROOM_LEAVE);
    }
    useRoomStore.getState().leaveRoom();
    useCursorStore.getState().clearAllCursors();
    this.currentRoomId = null;
  }

  public emitCursor(x: number, y: number, isIdle = false, typingMessage: string | null = null) {
    if (useRoomStore.getState().isDemoMode) {
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.CURSOR_UPDATE, { x, y, isIdle, typingMessage });
    }
  }

  public emitClick(x: number, y: number) {
    if (useRoomStore.getState().isDemoMode) {
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.CURSOR_CLICK, { x, y });
    }
  }

  public emitPing(x: number, y: number) {
    if (useRoomStore.getState().isDemoMode) {
      demoSimulator.handleUserPing(x, y);
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.CURSOR_PING, { x, y });
    }
  }

  public emitChat(message: string) {
    if (useRoomStore.getState().isDemoMode) {
      demoSimulator.handleUserChat(message);
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.CURSOR_CHAT, message);
    }
  }

  public emitLaser(points: Array<{ x: number; y: number; timestamp: number }>) {
    if (useRoomStore.getState().isDemoMode) return;
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.LASER_DRAW, { points });
    }
  }

  public emitCounter(delta: number | 'reset') {
    if (useRoomStore.getState().isDemoMode) {
      demoSimulator.handleCounterChange(delta);
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.STATE_COUNTER_UPDATE, delta);
    }
  }

  public emitEditor(text: string) {
    if (useRoomStore.getState().isDemoMode) {
      demoSimulator.handleEditorChange(text);
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.STATE_EDITOR_UPDATE, text);
    }
  }

  public emitNoteCreate(note: any) {
    if (useRoomStore.getState().isDemoMode) {
      useSharedStateStore.getState().addNote(note);
      soundService.playNoteAdd();
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.STATE_NOTE_CREATE, note);
    }
  }

  public emitNoteUpdate(noteId: string, updates: any) {
    if (useRoomStore.getState().isDemoMode) {
      useSharedStateStore.getState().updateNote(noteId, updates);
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.STATE_NOTE_UPDATE, { noteId, updates });
    }
  }

  public emitNoteDelete(noteId: string) {
    if (useRoomStore.getState().isDemoMode) {
      useSharedStateStore.getState().deleteNote(noteId);
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.STATE_NOTE_DELETE, noteId);
    }
  }

  public emitToggle(key: string, value: boolean) {
    if (useRoomStore.getState().isDemoMode) {
      useSharedStateStore.getState().updateToggle(key as any, value);
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.STATE_TOGGLE_UPDATE, { key, value });
    }
  }

  public emitReaction(emoji: string, coords?: { x: number; y: number }) {
    if (useRoomStore.getState().isDemoMode) {
      demoSimulator.handleReaction(emoji, coords);
      return;
    }
    if (this.socket?.connected) {
      this.socket.emit(SOCKET_EVENTS.REACTION_SEND, emoji, coords);
    }
  }
}

export const socketClient = new SocketClient();
