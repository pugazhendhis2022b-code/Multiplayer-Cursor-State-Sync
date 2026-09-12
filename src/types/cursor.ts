export interface CursorPosition {
  x: number; // Viewport percentage (0 to 100)
  y: number; // Viewport percentage (0 to 100)
  timestamp: number;
}

export interface RemoteCursor extends CursorPosition {
  userId: string;
  username: string;
  color: string;
  isIdle: boolean;
  lastActive: number;
  typingMessage?: string | null;
  currentX: number; // Current interpolated X
  currentY: number; // Current interpolated Y
  targetX: number;  // Network target X
  targetY: number;  // Network target Y
  velocityX?: number;
  velocityY?: number;
}

export interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  timestamp: number;
}

export interface ClickRipple {
  id: string;
  x: number;
  y: number;
  color: string;
  timestamp: number;
}

export interface CursorPing {
  id: string;
  userId: string;
  username: string;
  color: string;
  x: number;
  y: number;
  timestamp: number;
}

export interface LaserPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface LaserStroke {
  id: string;
  userId: string;
  color: string;
  points: LaserPoint[];
}
