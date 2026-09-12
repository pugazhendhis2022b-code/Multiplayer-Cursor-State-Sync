import { describe, it, expect, beforeEach } from 'vitest';
import { useCursorStore } from '../../src/store/useCursorStore';

describe('Cursor Store and Interpolation Step', () => {
  beforeEach(() => {
    useCursorStore.getState().clearAllCursors();
  });

  it('updates target coordinates for remote cursor', () => {
    useCursorStore.getState().updateRemoteTarget('bot-1', 40, 60, Date.now(), {
      username: 'Bot',
      color: '#10b981',
      isIdle: false,
    });

    const cursors = useCursorStore.getState().cursors;
    expect(cursors['bot-1']).toBeDefined();
    expect(cursors['bot-1'].targetX).toBe(40);
    expect(cursors['bot-1'].targetY).toBe(60);
    expect(cursors['bot-1'].currentX).toBe(40); // Initial position
  });

  it('steps interpolation towards target over multiple frames', () => {
    // Place at 0, 0 with target at 100, 100
    useCursorStore.getState().updateRemoteTarget('bot-2', 0, 0, Date.now(), {
      username: 'Bot 2',
      color: '#06b6d4',
    });

    // Update target to 100, 100
    useCursorStore.getState().updateRemoteTarget('bot-2', 100, 100, Date.now());

    // Step with lerp factor 0.5
    useCursorStore.getState().stepInterpolation(0.5, true, 10);

    const cursorAfterStep = useCursorStore.getState().cursors['bot-2'];
    expect(cursorAfterStep.currentX).toBeCloseTo(50);
    expect(cursorAfterStep.currentY).toBeCloseTo(50);
  });

  it('adds and clears pings and click ripples', () => {
    useCursorStore.getState().addClickRipple({
      id: 'rip-1',
      x: 30,
      y: 40,
      color: '#f43f5e',
      timestamp: Date.now(),
    });

    expect(useCursorStore.getState().clickRipples).toHaveLength(1);

    useCursorStore.getState().removeClickRipple('rip-1');
    expect(useCursorStore.getState().clickRipples).toHaveLength(0);
  });
});
