import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { useCursorSync } from '../hooks/useCursorSync';
import { useInterpolation } from '../hooks/useInterpolation';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Navbar } from '../components/layout/Navbar';
import { Toolbar } from '../components/layout/Toolbar';
import { Footer } from '../components/layout/Footer';
import { CursorOverlay } from '../components/cursor/CursorOverlay';
import { ActivityFeed } from '../components/presence/ActivityFeed';
import { SharedCounter } from '../components/shared-state/SharedCounter';
import { SharedEditor } from '../components/shared-state/SharedEditor';
import { SharedNotes } from '../components/shared-state/SharedNotes';
import { SharedToggles } from '../components/shared-state/SharedToggles';
import { LoadingScreen } from '../components/layout/LoadingScreen';
import { useRoomStore } from '../store/useRoomStore';
import toast from 'react-hot-toast';

export const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  // Establish connection or trigger demo simulation fallback
  const { connectionStatus } = useSocket(roomId);

  // Run cursor tracking and interpolation loop
  const { lastPosition } = useCursorSync();
  useInterpolation();

  // Bind keyboard shortcuts
  useKeyboardShortcuts({
    onLeaveRoom: () => {
      useRoomStore.getState().leaveRoom();
      navigate('/');
      toast('Left collaboration room', { icon: '👋' });
    },
  });

  if (connectionStatus === 'connecting' && !useRoomStore.getState().isDemoMode) {
    return <LoadingScreen message={`Connecting to room "${roomId}"...`} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-slate-100 relative overflow-hidden select-text">
      {/* Background Canvas Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 relative z-10">
        {/* Top Row: Notes Board & Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Notes Canvas (7 cols on desktop) */}
          <div className="lg:col-span-7">
            <SharedNotes />
          </div>

          {/* Collaborative Scratchpad (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <SharedEditor />
          </div>
        </div>

        {/* Bottom Row: Counter & Room Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">
          <div className="md:col-span-5">
            <SharedCounter />
          </div>
          <div className="md:col-span-7">
            <SharedToggles />
          </div>
        </div>
      </main>

      {/* Floating Activity Feed on the left */}
      <ActivityFeed />

      {/* Floating Bottom Toolbar */}
      <Toolbar />

      {/* Full-Screen Real-Time Cursor & Laser Overlay */}
      <CursorOverlay currentPosition={lastPosition} />

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
};
