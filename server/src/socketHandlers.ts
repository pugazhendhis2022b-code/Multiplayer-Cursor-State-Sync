import { Server, Socket } from 'socket.io';
import { RoomManager } from './roomManager.js';
import {
  User,
  CursorPosition,
  CursorClickPayload,
  CursorPingPayload,
  LaserDrawPayload,
  SharedNote,
  SharedState,
  ReactionPayload,
} from './types.js';

interface SocketSessionData {
  roomId?: string;
  user?: User;
}

export function registerSocketHandlers(io: Server, roomManager: RoomManager) {
  const sessions = new Map<string, SocketSessionData>();

  io.on('connection', (socket: Socket) => {
    sessions.set(socket.id, {});

    // Latency Ping-Pong
    socket.on('ping:check', (clientTimestamp: number, callback?: (ts: number) => void) => {
      if (typeof callback === 'function') {
        callback(clientTimestamp);
      } else {
        socket.emit('pong:reply', clientTimestamp);
      }
    });

    // Room Join / Create
    socket.on(
      'room:join',
      (
        payload: {
          roomId: string;
          username: string;
          color?: string;
          avatarUrl?: string;
        },
        callback?: (response: { success: boolean; data?: any; error?: string }) => void
      ) => {
        try {
          const { roomId, username, color, avatarUrl } = payload;
          if (!roomId || !username) {
            callback?.({ success: false, error: 'Room ID and Username are required' });
            return;
          }

          const cleanRoomId = roomId.trim().toLowerCase();
          const user: User = {
            id: socket.id,
            username: username.trim().slice(0, 30),
            color: color || '#6366f1',
            role: 'member',
            joinedAt: Date.now(),
            lastSeen: Date.now(),
            isIdle: false,
            avatarUrl,
          };

          const { room, isNewHost } = roomManager.joinRoom(cleanRoomId, user);
          if (isNewHost) {
            user.role = 'host';
          }

          socket.join(cleanRoomId);
          sessions.set(socket.id, { roomId: cleanRoomId, user });

          const serialized = roomManager.serializeRoom(room);

          // Reply to joined client
          callback?.({ success: true, data: { room: serialized, currentUser: user } });
          socket.emit('room:joined', { room: serialized, currentUser: user });

          // Broadcast to other users in room
          socket.to(cleanRoomId).emit('room:user_joined', { user });
        } catch (err: any) {
          console.error('Error joining room:', err);
          callback?.({ success: false, error: err?.message || 'Failed to join room' });
        }
      }
    );

    // Cursor Movement
    socket.on(
      'cursor:update',
      (payload: { x: number; y: number; isIdle?: boolean; typingMessage?: string | null }) => {
        const session = sessions.get(socket.id);
        if (!session?.roomId || !session.user) return;

        roomManager.updateHeartbeat(session.roomId, socket.id, !!payload.isIdle);

        socket.to(session.roomId).emit('cursor:sync', {
          userId: socket.id,
          username: session.user.username,
          color: session.user.color,
          x: payload.x,
          y: payload.y,
          timestamp: Date.now(),
          isIdle: payload.isIdle ?? false,
          typingMessage: payload.typingMessage ?? null,
        });
      }
    );

    // Cursor Click Ripple
    socket.on('cursor:click', (payload: { x: number; y: number }) => {
      const session = sessions.get(socket.id);
      if (!session?.roomId) return;

      socket.to(session.roomId).emit('cursor:clicked', {
        userId: socket.id,
        x: payload.x,
        y: payload.y,
        timestamp: Date.now(),
      });
    });

    // Cursor Ping
    socket.on('cursor:ping', (payload: { x: number; y: number }) => {
      const session = sessions.get(socket.id);
      if (!session?.roomId) return;

      io.in(session.roomId).emit('cursor:pinged', {
        userId: socket.id,
        username: session.user?.username || 'User',
        color: session.user?.color || '#6366f1',
        x: payload.x,
        y: payload.y,
        timestamp: Date.now(),
      });
    });

    // Cursor Chat Message
   socket.on('cursor:chat', (message: string) => {
  console.log("SERVER GOT CHAT:", message);

  const session = sessions.get(socket.id);
  if (!session?.roomId) return;

  socket.to(session.roomId).emit('cursor:chatted', {
    userId: socket.id,
    message: message.slice(0, 100),
    timestamp: Date.now(),
  });
});

    // Laser Pointer Drawing
    socket.on('laser:draw', (payload: { points: Array<{ x: number; y: number; timestamp: number }> }) => {
      const session = sessions.get(socket.id);
      if (!session?.roomId) return;

      socket.to(session.roomId).emit('laser:drawn', {
        userId: socket.id,
        color: session.user?.color || '#f43f5e',
        points: payload.points,
      });
    });

    // Shared State: Counter
    socket.on('state:counter:update', (delta: number | 'reset') => {
      const session = sessions.get(socket.id);
      if (!session?.roomId) return;

      const newCounter = roomManager.updateCounter(session.roomId, delta);
      io.in(session.roomId).emit('state:counter:changed', {
        counter: newCounter,
        updatedBy: session.user?.username || 'User',
      });
    });

    // Shared State: Editor Text
    socket.on('state:editor:update', (text: string) => {
      const session = sessions.get(socket.id);
      if (!session?.roomId) return;

      const updated = roomManager.updateEditor(session.roomId, text, socket.id);
      socket.to(session.roomId).emit('state:editor:changed', {
        text: updated,
        userId: socket.id,
        username: session.user?.username || 'User',
      });
    });

    // Shared State: Sticky Notes
    socket.on('state:note:create', (note: SharedNote) => {
      const session = sessions.get(socket.id);
      if (!session?.roomId) return;

      const created = roomManager.addNote(session.roomId, note);
      io.in(session.roomId).emit('state:note:created', created);
    });

    socket.on(
      'state:note:update',
      (payload: { noteId: string; updates: Partial<SharedNote> }) => {
        const session = sessions.get(socket.id);
        if (!session?.roomId) return;

        const updated = roomManager.updateNote(
          session.roomId,
          payload.noteId,
          payload.updates
        );
        if (updated) {
          io.in(session.roomId).emit('state:note:updated', updated);
        }
      }
    );

    socket.on('state:note:delete', (noteId: string) => {
      const session = sessions.get(socket.id);
      if (!session?.roomId) return;

      const deleted = roomManager.deleteNote(session.roomId, noteId);
      if (deleted) {
        io.in(session.roomId).emit('state:note:deleted', { noteId });
      }
    });

    // Shared State: Toggles
    socket.on(
      'state:toggle:update',
      (payload: { key: keyof SharedState['toggles']; value: boolean }) => {
        const session = sessions.get(socket.id);
        if (!session?.roomId) return;

        const ok = roomManager.updateToggle(
          session.roomId,
          payload.key,
          payload.value
        );
        if (ok) {
          io.in(session.roomId).emit('state:toggle:changed', payload);
        }
      }
    );

    // Emoji Reactions Burst
    socket.on('reaction:send', (emoji: string, coords?: { x: number; y: number }) => {
      const session = sessions.get(socket.id);
      if (!session?.roomId || !session.user) return;

      const reactionPayload: ReactionPayload = {
        userId: socket.id,
        username: session.user.username,
        emoji,
        x: coords?.x ?? 50,
        y: coords?.y ?? 50,
        timestamp: Date.now(),
      };

      io.in(session.roomId).emit('reaction:broadcast', reactionPayload);
    });

    // Explicit Leave Room
    socket.on('room:leave', () => {
      handleUserDeparture(socket);
    });

    // Disconnect
    socket.on('disconnect', () => {
      handleUserDeparture(socket);
      sessions.delete(socket.id);
    });
  });

  function handleUserDeparture(socket: Socket) {
    const session = sessions.get(socket.id);
    if (!session?.roomId) return;

    const roomId = session.roomId;
    const { room, leftUser, newHostId } = roomManager.leaveRoom(roomId, socket.id);

    socket.leave(roomId);
    session.roomId = undefined;

    if (leftUser) {
      socket.to(roomId).emit('room:user_left', {
        userId: socket.id,
        username: leftUser.username,
      });
    }

    if (newHostId) {
      io.in(roomId).emit('room:host_changed', { hostId: newHostId });
    }
  }
}
