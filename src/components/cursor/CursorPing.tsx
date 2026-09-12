import React, { memo } from 'react';
import { ClickRipple, CursorPing as CursorPingType } from '../../types/cursor';

interface CursorPingProps {
  ripples: ClickRipple[];
  pings: CursorPingType[];
}

export const CursorPing = memo(function CursorPing({ ripples, pings }: CursorPingProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Click Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
          }}
        >
          <span
            className="block rounded-full animate-ping opacity-75"
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: ripple.color,
            }}
          />
        </div>
      ))}

      {/* Broadcast Pings with User Tag */}
      {pings.map((ping) => (
        <div
          key={ping.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
          style={{
            left: `${ping.x}%`,
            top: `${ping.y}%`,
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Concentric rings */}
            <span
              className="absolute w-12 h-12 rounded-full animate-ping"
              style={{ backgroundColor: `${ping.color}40` }}
            />
            <span
              className="w-4 h-4 rounded-full shadow-lg"
              style={{
                backgroundColor: ping.color,
                boxShadow: `0 0 16px 4px ${ping.color}`,
              }}
            />
          </div>

          <div
            className="mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xl border border-white/20 whitespace-nowrap animate-bounce"
            style={{ backgroundColor: ping.color, color: '#ffffff' }}
          >
            📍 {ping.username}
          </div>
        </div>
      ))}
    </div>
  );
});
