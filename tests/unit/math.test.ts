import { describe, it, expect } from 'vitest';
import { lerp, clamp, distance, deadband, predictPosition } from '../../src/utils/math';

describe('Math Utilities for Real-Time Cursor Interpolation', () => {
  it('lerps correctly between start and end values', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0.1)).toBeCloseTo(11);
    expect(lerp(50, 50, 0.5)).toBe(50);
  });

  it('clamps values strictly within min and max boundaries', () => {
    expect(clamp(-5, 0, 100)).toBe(0);
    expect(clamp(150, 0, 100)).toBe(100);
    expect(clamp(42, 0, 100)).toBe(42);
  });

  it('computes euclidean distance accurately', () => {
    expect(distance(0, 0, 3, 4)).toBe(5);
    expect(distance(10, 10, 10, 10)).toBe(0);
  });

  it('filters jitter using deadband threshold', () => {
    // Delta 0.02 < 0.05 threshold => keeps current
    expect(deadband(50, 50.02, 0.05)).toBe(50);
    // Delta 0.1 > 0.05 threshold => updates to target
    expect(deadband(50, 50.1, 0.05)).toBe(50.1);
  });

  it('predicts position extrapolated along velocity vector', () => {
    const current = { x: 50, y: 50 };
    const velocity = { x: 20, y: 10 }; // 20 units/sec, 10 units/sec
    const predicted = predictPosition(current, velocity, 500, 1.0); // 0.5 seconds
    expect(predicted.x).toBe(60);
    expect(predicted.y).toBe(55);
  });
});
