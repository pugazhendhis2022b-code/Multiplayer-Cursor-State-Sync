import React from 'react';
import { useCursorStore } from '../../store/useCursorStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Cursor } from './Cursor';
import { CursorTrail } from './CursorTrail';
import { CursorPing } from './CursorPing';
import { LaserPointer } from './LaserPointer';
import { CursorChatBubble } from './CursorChatBubble';

interface CursorOverlayProps {
  currentPosition?: { x: number; y: number };
}

export const CursorOverlay: React.FC<CursorOverlayProps> = ({ currentPosition = { x: 50, y: 50 } }) => {
  const cursors = useCursorStore((s) => s.cursors);
  const trails = useCursorStore((s) => s.trails);
  const clickRipples = useCursorStore((s) => s.clickRipples);
  const pings = useCursorStore((s) => s.pings);
  const laserStrokes = useCursorStore((s) => s.laserStrokes);
  const cursorTrailEnabled = useSettingsStore((s) => s.cursorTrailEnabled);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Laser Strokes */}
      <LaserPointer laserStrokes={laserStrokes} />

      {/* Cursor Trails */}
      {cursorTrailEnabled &&
        Object.entries(trails).map(([userId, userTrail]) => {
          const cursor = cursors[userId];
          if (!cursor) return null;
          return <CursorTrail key={`trail-${userId}`} trail={userTrail} color={cursor.color} />;
        })}

      {/* Clicks and Pings */}
      <CursorPing ripples={clickRipples} pings={pings} />

      {/* Remote Cursors */}
      {Object.values(cursors).map((cursor) => (
        <Cursor key={cursor.userId} cursor={cursor} />
      ))}

      {/* Local User Cursor Chat Bubble */}
      <CursorChatBubble cursorPosition={currentPosition} />
    </div>
  );
};
