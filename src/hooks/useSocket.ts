import { useEffect } from 'react';
import { socketClient } from '../socket/socketClient';
import { useRoomStore } from '../store/useRoomStore';
import { storageService } from '../services/storageService';
import { getRandomColor } from '../utils/colors';

export function useSocket(roomId?: string) {
  const connectionStatus = useRoomStore((s) => s.connectionStatus);
  const isDemoMode = useRoomStore((s) => s.isDemoMode);
  const latency = useRoomStore((s) => s.latency);

  useEffect(() => {
    if (!roomId) return;

    let username = storageService.getUserName();
    if (!username) {
      username = `Explorer-${Math.floor(100 + Math.random() * 900)}`;
      storageService.setUserName(username);
    }

    let color = storageService.getUserColor();
    if (!color) {
      color = getRandomColor();
      storageService.setUserColor(color);
    }

    storageService.addRecentRoom(roomId);
    socketClient.joinRoom(roomId, username, color);

    return () => {
      socketClient.leaveRoom();
    };
  }, [roomId]);

  return { connectionStatus, isDemoMode, latency };
}
