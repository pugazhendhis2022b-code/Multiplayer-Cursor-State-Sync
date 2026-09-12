import React, { memo } from 'react';
import { LaserStroke } from '../../types/cursor';
import { useCursorStore } from '../../store/useCursorStore';
import { useRoomStore } from '../../store/useRoomStore';

interface LaserPointerProps {
  laserStrokes: Record<string, LaserStroke>;
}

export const LaserPointer = memo(function LaserPointer({ laserStrokes }: LaserPointerProps) {
  const myLaserPoints = useCursorStore((s) => s.myLaserPoints);
  const currentUser = useRoomStore((s) => s.currentUser);

  // Convert array of points into SVG path string
  const pointsToPath = (points: Array<{ x: number; y: number }>) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Local User Laser */}
      {myLaserPoints.length > 1 && (
        <path
          d={pointsToPath(myLaserPoints)}
          fill="none"
          stroke={currentUser?.color || '#f43f5e'}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#laser-glow)"
          className="opacity-90 transition-opacity duration-300"
        />
      )}

      {/* Remote Users Lasers */}
      {Object.values(laserStrokes).map((stroke) => {
        if (stroke.points.length < 2) return null;
        return (
          <path
            key={stroke.id}
            d={pointsToPath(stroke.points)}
            fill="none"
            stroke={stroke.color}
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#laser-glow)"
            className="opacity-90 transition-opacity duration-300"
          />
        );
      })}
    </svg>
  );
});
