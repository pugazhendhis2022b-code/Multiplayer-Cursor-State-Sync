import React, { memo } from 'react';
import { TrailPoint } from '../../types/cursor';

interface CursorTrailProps {
  trail: TrailPoint[];
  color: string;
}

export const CursorTrail = memo(function CursorTrail({ trail, color }: CursorTrailProps) {
  if (!trail || trail.length < 2) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {trail.map((point, index) => {
        const size = Math.max(3, (index / trail.length) * 8);
        return (
          <div
            key={`${point.timestamp}-${index}`}
            className="absolute rounded-full transition-transform duration-75"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              opacity: point.opacity * (index / trail.length) * 0.7,
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 8px 1px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
});
