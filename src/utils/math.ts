/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Clamp a number between min and max bounds
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Euclidean distance between two 2D points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Deadband threshold filter: only update if delta exceeds threshold
 */
export function deadband(current: number, target: number, threshold = 0.05): number {
  return Math.abs(target - current) < threshold ? current : target;
}

/**
 * Position prediction based on velocity vector and delta time
 */
export function predictPosition(
  current: { x: number; y: number },
  velocity: { x: number; y: number },
  deltaTimeMs: number,
  damping = 0.8
): { x: number; y: number } {
  const dtSec = deltaTimeMs / 1000;
  return {
    x: clamp(current.x + velocity.x * dtSec * damping, 0, 100),
    y: clamp(current.y + velocity.y * dtSec * damping, 0, 100),
  };
}

/**
 * Cubic Bezier evaluation for smooth curved paths (used by demo simulator bots)
 */
export function cubicBezier(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number {
  const oneMinusT = 1 - t;
  return (
    Math.pow(oneMinusT, 3) * p0 +
    3 * Math.pow(oneMinusT, 2) * t * p1 +
    3 * oneMinusT * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3
  );
}
