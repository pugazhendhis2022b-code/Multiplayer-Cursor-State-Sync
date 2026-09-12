export class RoomManager {
    rooms = new Map();
    getDefaultSharedState() {
        return {
            counter: 42,
            editorText: '# Collaborative Architecture Document\n\nWelcome to SyncPoint!\n- Cursors are interpolated at 60 FPS using rAF + exponential smoothing.\n- State updates are broadcast with sub-50ms latency.\n- Press / anytime to chat above your cursor.\n- Pick the Laser tool to sketch ephemeral light paths.\n\nEnjoy real-time collaboration!',
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
    createRoom(roomId, name, hostUser) {
        const cleanId = roomId.trim().toLowerCase();
        const existing = this.rooms.get(cleanId);
        if (existing) {
            if (hostUser) {
                existing.users.set(hostUser.id, hostUser);
            }
            return existing;
        }
        const room = {
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
    getRoom(roomId) {
        return this.rooms.get(roomId.trim().toLowerCase());
    }
    joinRoom(roomId, user) {
        let room = this.getRoom(roomId);
        let isNewHost = false;
        if (!room) {
            room = this.createRoom(roomId, undefined, user);
            isNewHost = true;
        }
        else {
            if (room.users.size === 0 || !room.hostId) {
                room.hostId = user.id;
                user.role = 'host';
                isNewHost = true;
            }
            room.users.set(user.id, user);
        }
        return { room, isNewHost };
    }
    leaveRoom(roomId, userId) {
        const room = this.getRoom(roomId);
        if (!room) {
            return { isEmpty: true };
        }
        const leftUser = room.users.get(userId);
        room.users.delete(userId);
        let newHostId;
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
    updateHeartbeat(roomId, userId, isIdle) {
        const room = this.getRoom(roomId);
        if (!room)
            return;
        const user = room.users.get(userId);
        if (user) {
            user.lastSeen = Date.now();
            user.isIdle = isIdle;
        }
    }
    updateCounter(roomId, delta) {
        const room = this.getRoom(roomId);
        if (!room)
            return 0;
        if (delta === 'reset') {
            room.sharedState.counter = 0;
        }
        else {
            room.sharedState.counter += delta;
        }
        return room.sharedState.counter;
    }
    updateEditor(roomId, text, userId) {
        const room = this.getRoom(roomId);
        if (!room)
            return text;
        room.sharedState.editorText = text;
        room.sharedState.editorActiveUser = userId;
        return room.sharedState.editorText;
    }
    addNote(roomId, note) {
        const room = this.getRoom(roomId);
        if (!room)
            return note;
        room.sharedState.notes.push(note);
        return note;
    }
    updateNote(roomId, noteId, updates) {
        const room = this.getRoom(roomId);
        if (!room)
            return undefined;
        const idx = room.sharedState.notes.findIndex((n) => n.id === noteId);
        if (idx === -1)
            return undefined;
        const existing = room.sharedState.notes[idx];
        const updated = {
            ...existing,
            ...updates,
            updatedAt: Date.now(),
        };
        room.sharedState.notes[idx] = updated;
        return updated;
    }
    deleteNote(roomId, noteId) {
        const room = this.getRoom(roomId);
        if (!room)
            return false;
        const initialLength = room.sharedState.notes.length;
        room.sharedState.notes = room.sharedState.notes.filter((n) => n.id !== noteId);
        return room.sharedState.notes.length !== initialLength;
    }
    updateToggle(roomId, key, value) {
        const room = this.getRoom(roomId);
        if (!room || !(key in room.sharedState.toggles))
            return false;
        room.sharedState.toggles[key] = value;
        return true;
    }
    serializeRoom(room) {
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
