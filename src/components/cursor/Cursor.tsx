import React, { memo } from 'react';
import { RemoteCursor } from '../../types/cursor';
import { getContrastTextColor } from '../../utils/colors';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatRelativeTime } from '../../utils/formatters';

interface CursorProps {
  cursor: RemoteCursor;
}

export const Cursor = memo(function Cursor({ cursor }: CursorProps) {
  const cursorSize = useSettingsStore((s) => s.cursorSize);
  const textColor = getContrastTextColor(cursor.color);

  // Size scaling
  const scale =
    cursorSize === 'small' ? 'scale-75' : cursorSize === 'large' ? 'scale-125' : 'scale-100';

  return (
    <div
      className="absolute pointer-events-none z-40 transition-opacity duration-300"
      style={{
        left: `${cursor.currentX}%`,
        top: `${cursor.currentY}%`,
        transform: 'translate(-2px, -2px)',
        opacity: cursor.isIdle ? 0.45 : 1,
      }}
    >
      <div className={`relative flex flex-col items-start ${scale} origin-top-left`}>
        {/* Figma-Style Pointer Arrow */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-100"
        >
          <path
            d="M3 3L10.07 20.97L12.58 13.11L20.44 10.6L3 3Z"
            fill={cursor.color}
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Username Label */}
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 mt-0.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm whitespace-nowrap select-none"
          style={{
            backgroundColor: cursor.color,
            color: textColor,
            boxShadow: `0 4px 14px -2px ${cursor.color}88`,
          }}
        >
          <span>{cursor.username}</span>

          {cursor.isIdle && (
            <span className="text-[10px] opacity-75 font-normal">
              (idle {formatRelativeTime(cursor.lastActive)})
            </span>
          )}
        </div>

        {/* Remote Chat Bubble */}
        {cursor.typingMessage && (
          <div className="mt-1 px-3 py-1.5 bg-slate-900/90 border border-slate-700/80 text-white rounded-2xl rounded-tl-sm text-xs shadow-2xl backdrop-blur-md max-w-xs animate-in fade-in zoom-in-95 duration-200">
            <p className="font-medium leading-relaxed">{cursor.typingMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
});
