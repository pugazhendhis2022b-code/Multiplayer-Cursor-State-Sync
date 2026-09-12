import { useEffect, useRef } from 'react';
import { useCursorStore } from '../store/useCursorStore';
import { useSettingsStore } from '../store/useSettingsStore';

export function useInterpolation() {
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const loop = (time: number) => {
      const dt = time - lastTimeRef.current;
      lastTimeRef.current = time;

      const { cursorTrailEnabled, cursorTrailLength, fpsMode } = useSettingsStore.getState();

      // Adaptive lerp factor based on time delta
      // Target 60Hz tick ~ 16.6ms => alpha ~ 0.22
      const baseAlpha = 0.22;
      const normalizedAlpha = Math.min(0.9, baseAlpha * (dt / 16.6));

      useCursorStore
        .getState()
        .stepInterpolation(normalizedAlpha, cursorTrailEnabled, cursorTrailLength);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);
}
