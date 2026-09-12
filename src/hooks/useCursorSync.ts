import { useEffect, useRef, useCallback } from 'react';
import { socketClient } from '../socket/socketClient';
import { useCursorStore } from '../store/useCursorStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useRoomStore } from '../store/useRoomStore';
import { soundService } from '../services/soundService';

export function useCursorSync() {
  const lastEmitRef = useRef<number>(0);
  const idleTimerRef = useRef<any>(null);
  const isIdleRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number }>({ x: 50, y: 50 });
  const isPointerDownRef = useRef<boolean>(false);

  const activeTool = useSettingsStore((s) => s.activeTool);
  const cursorChatInput = useCursorStore((s) => s.cursorChatInput);

  const resetIdleTimer = useCallback(() => {
    if (isIdleRef.current) {
      isIdleRef.current = false;
      socketClient.emitCursor(
        lastPosRef.current.x,
        lastPosRef.current.y,
        false,
        cursorChatInput
      );
    }

    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      isIdleRef.current = true;
      socketClient.emitCursor(
        lastPosRef.current.x,
        lastPosRef.current.y,
        true,
        cursorChatInput
      );
    }, 3500);
  }, [cursorChatInput]);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const x = Math.min(100, Math.max(0, (e.clientX / window.innerWidth) * 100));
      const y = Math.min(100, Math.max(0, (e.clientY / window.innerHeight) * 100));

      lastPosRef.current = { x, y };
      resetIdleTimer();

      // If in Laser Mode and pointer is pressed, draw laser trail
      const currentTool = useSettingsStore.getState().activeTool;
      if (currentTool === 'laser' && isPointerDownRef.current) {
        useCursorStore.getState().addMyLaserPoint(x, y);
        socketClient.emitLaser([{ x, y, timestamp: Date.now() }]);
      }

      // Throttle outgoing cursor position updates to ~30Hz (every 33ms)
      const now = performance.now();
      if (now - lastEmitRef.current >= 33) {
        lastEmitRef.current = now;
        socketClient.emitCursor(x, y, false, cursorChatInput);
      }
    }

    function handlePointerDown(e: PointerEvent) {
      // Ignore clicks on inputs or buttons to prevent unwanted pings
      const target = e.target as HTMLElement;
      if (target?.closest('button, input, textarea, a, select')) {
        return;
      }

      isPointerDownRef.current = true;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      const currentTool = useSettingsStore.getState().activeTool;

      if (e.altKey || currentTool === 'reaction') {
        socketClient.emitPing(x, y);
      } else if (currentTool === 'laser') {
        useCursorStore.getState().addMyLaserPoint(x, y);
        socketClient.emitLaser([{ x, y, timestamp: Date.now() }]);
      } else {
        const currentUser = useRoomStore.getState().currentUser;
        useCursorStore.getState().addClickRipple({
          id: `my-ripple-${Date.now()}`,
          x,
          y,
          color: currentUser?.color || '#6366f1',
          timestamp: Date.now(),
        });
        soundService.playClick();
        socketClient.emitClick(x, y);
      }
    }

    function handlePointerUp() {
      isPointerDownRef.current = false;
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer, cursorChatInput]);

  return { lastPosition: lastPosRef.current };
}
