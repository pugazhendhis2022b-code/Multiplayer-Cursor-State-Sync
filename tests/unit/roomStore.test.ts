import { describe, it, expect, beforeEach } from 'vitest';
import { useRoomStore } from '../../src/store/useRoomStore';
import { User } from '../../src/types/room';

describe('Room Store State Management', () => {
  beforeEach(() => {
    useRoomStore.getState().resetRoom();
  });

  it('initializes with default disconnected state', () => {
    const state = useRoomStore.getState();
    expect(state.roomId).toBeNull();
    expect(state.users).toHaveLength(0);
    expect(state.connectionStatus).toBe('disconnected');
    expect(state.isDemoMode).toBe(false);
  });

  it('sets room information and host correctly', () => {
    useRoomStore.getState().setRoom('room-123', 'Sprint Room', 'user-1');
    const state = useRoomStore.getState();
    expect(state.roomId).toBe('room-123');
    expect(state.roomName).toBe('Sprint Room');
    expect(state.hostId).toBe('user-1');
  });

  it('adds and removes users with activity logging', () => {
    const testUser: User = {
      id: 'user-2',
      username: 'Sarah',
      color: '#6366f1',
      role: 'member',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      isIdle: false,
    };

    useRoomStore.getState().addUser(testUser);
    expect(useRoomStore.getState().users).toHaveLength(1);
    expect(useRoomStore.getState().activityFeed).toHaveLength(1);
    expect(useRoomStore.getState().activityFeed[0].username).toBe('Sarah');

    useRoomStore.getState().removeUser('user-2');
    expect(useRoomStore.getState().users).toHaveLength(0);
    expect(useRoomStore.getState().activityFeed).toHaveLength(2);
  });

  it('switches to demo mode smoothly', () => {
    useRoomStore.getState().setDemoMode(true);
    const state = useRoomStore.getState();
    expect(state.isDemoMode).toBe(true);
    expect(state.connectionStatus).toBe('demo');
  });
});
