import { Room, User, SharedNote, SharedState, CursorPosition } from './types.js';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  private getDefaultSharedState(): SharedState {
    return {
      counter: 42,
      editorText:
        '# Collaborative Architecture Document\n\nWelcome to SyncPoint!\n- Cursors are interpolated at 60 FPS using rAF + exponential smoothing.\n- State updates are broadcast with sub-50ms latency.\n- Press / anytime to chat above your cursor.\n- Pick the Laser tool to sketch ephemeral light paths.\n\nEnjoy real-time collaboration!',
      editorActiveUser: null,
      notes: [
        {
          id: 'note-1',
          x: 120,
          y: 180,
          color: '#fef08a', // Yellow
          content: '💡 Sprint Goal:\nImplement distributed delta compression for low-bandwidth environments.',
          author: 'Alex',
          authorId: 'system-1',
          updatedAt: Date.now() - 3600000,
        },
        {
          id: 'note-2',
          x: 420,
          y: 220,
          color: '#bae6fd', // Blue
          content: '⚡ Cursor Interpolation:\nTested lerp factor α = 0.25. Jitter reduced by 94% on simulated 120ms ping.',
          author: 'Elena',
          authorId: 'system-2',
          updatedAt: Date.now() - 1800000,
        },
      ],
      toggles: {
        darkModeDefault: true,
        streamActive: true,
        gridSnap: false,
        readOnlyMode: false,
      },
    };
  }

  public createRoom(roomId: string, name?: string, hostUser?: User): Room {
    const cleanId = roomId.trim().toLowerCase();
    const existing = this.rooms.get(cleanId);
    if (existing) {
      if (hostUser) {
        existing.users.set(hostUser.id, hostUser);
      }
      return existing;
    }

    const room: Room = {
      id: cleanId,
      name: name?.trim() || `Room ${cleanId.slice(0, 6)}`,
      hostId: hostUser ? hostUser.id : '',
      users: new Map(),
      sharedState: this.getDefaultSharedState(),
      createdAt: Date.now(),
    };

    if (hostUser) {
      room.users.set(hostUser.id, hostUser);
    }

    this.rooms.set(cleanId, room);
    return room;
  }

  public getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId.trim().toLowerCase());
  }

  public joinRoom(roomId: string, user: User): { room: Room; isNewHost: boolean } {
    let room = this.getRoom(roomId);
    let isNewHost = false;

    if (!room) {
      room = this.createRoom(roomId, undefined, user);
      isNewHost = true;
    } else {
      if (room.users.size === 0 || !room.hostId) {
        room.hostId = user.id;
        user.role = 'host';
        isNewHost = true;
      }
      room.users.set(user.id, user);
    }

    return { room, isNewHost };
  }

  public leaveRoom(
    roomId: string,
    userId: string
  ): { room?: Room; leftUser?: User; newHostId?: string; isEmpty: boolean } {
    const room = this.getRoom(roomId);
    if (!room) {
      return { isEmpty: true };
    }

    const leftUser = room.users.get(userId);
    room.users.delete(userId);

    let newHostId: string | undefined;

    if (room.users.size === 0) {
      // Auto-cleanup after delay if room is empty
      setTimeout(() => {
        const check = this.rooms.get(room.id);
        if (check && check.users.size === 0) {
          this.rooms.delete(room.id);
        }
      }, 60000);
      return { room, leftUser, isEmpty: true };
    }

    // Reassign host if previous host left
    if (room.hostId === userId) {
      const nextUser = room.users.values().next().value;
      if (nextUser) {
        nextUser.role = 'host';
        room.hostId = nextUser.id;
        newHostId = nextUser.id;
      }
    }

    return { room, leftUser, newHostId, isEmpty: false };
  }

  public updateHeartbeat(roomId: string, userId: string, isIdle: boolean): void {
    const room = this.getRoom(roomId);
    if (!room) return;
    const user = room.users.get(userId);
    if (user) {
      user.lastSeen = Date.now();
      user.isIdle = isIdle;
    }
  }

  public updateCounter(roomId: string, delta: number | 'reset'): number {
    const room = this.getRoom(roomId);
    if (!room) return 0;

    if (delta === 'reset') {
      room.sharedState.counter = 0;
    } else {
      room.sharedState.counter += delta;
    }
    return room.sharedState.counter;
  }

  public updateEditor(roomId: string, text: string, userId: string): string {
    const room = this.getRoom(roomId);
    if (!room) return text;

    room.sharedState.editorText = text;
    room.sharedState.editorActiveUser = userId;
    return room.sharedState.editorText;
  }

  public addNote(roomId: string, note: SharedNote): SharedNote {
    const room = this.getRoom(roomId);
    if (!room) return note;

    room.sharedState.notes.push(note);
    return note;
  }

  public updateNote(
    roomId: string,
    noteId: string,
    updates: Partial<SharedNote>
  ): SharedNote | undefined {
    const room = this.getRoom(roomId);
    if (!room) return undefined;

    const idx = room.sharedState.notes.findIndex((n) => n.id === noteId);
    if (idx === -1) return undefined;

    const existing = room.sharedState.notes[idx];
    const updated: SharedNote = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };
    room.sharedState.notes[idx] = updated;
    return updated;
  }

  public deleteNote(roomId: string, noteId: string): boolean {
    const room = this.getRoom(roomId);
    if (!room) return false;

    const initialLength = room.sharedState.notes.length;
    room.sharedState.notes = room.sharedState.notes.filter((n) => n.id !== noteId);
    return room.sharedState.notes.length !== initialLength;
  }

  public updateToggle(
    roomId: string,
    key: keyof SharedState['toggles'],
    value: boolean
  ): boolean {
    const room = this.getRoom(roomId);
    if (!room || !(key in room.sharedState.toggles)) return false;

    room.sharedState.toggles[key] = value;
    return true;
  }

  public serializeRoom(room: Room) {
    return {
      id: room.id,
      name: room.name,
      hostId: room.hostId,
      users: Array.from(room.users.values()),
      sharedState: room.sharedState,
      createdAt: room.createdAt,
    };
  }
}
