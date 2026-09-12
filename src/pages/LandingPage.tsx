import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomCard } from '../components/common/RoomCard';
import { generateRoomId } from '../utils/formatters';
import {
  MousePointer2,
  Zap,
  Layers,
  Sparkles,
  ShieldCheck,
  Globe,
  Github,
  ArrowRight,
  Code2,
  Cpu,
  Smile,
  StickyNote,
  MessageSquare,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [demoPos, setDemoPos] = useState({ x: 50, y: 50 });

  const handleLaunchInstantDemo = () => {
    const demoId = generateRoomId();
    navigate(`/room/${demoId}`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDemoPos({ x, y });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Top Navigation */}
      <header className="w-full px-6 py-4 border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
              SyncPoint
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full ml-2">
              v1.0 R&D
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
            >
              <Github size={15} />
              <span>GitHub</span>
            </a>
            <button
              onClick={handleLaunchInstantDemo}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>Instant Room</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glowing Background Radial */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-indigo-400 mb-6 shadow-xl backdrop-blur-xl">
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <span>Next-Generation Real-Time Multiplayer Collaboration</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 leading-[1.15]">
          Multiplayer Cursor & State Synchronization at <span className="text-indigo-400 underline decoration-indigo-500/40">60 FPS</span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Sub-frame exponential cursor interpolation, low-latency WebSocket broadcast,
          ephemeral laser trails, Miro-style interactive sticky notes, and Figma-like cursor chat.
          Zero configuration required with autonomous offline Demo Mode.
        </p>

        {/* Live Interactive Hero Sandbox / Preview */}
        <div
          onMouseMove={handleMouseMove}
          className="mt-12 w-full max-w-4xl h-80 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-xl cursor-crosshair group select-none"
        >
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:2rem_2rem]" />

          {/* Interactive Mouse Cursor */}
          <div
            className="absolute pointer-events-none transition-transform duration-75 origin-top-left"
            style={{
              left: `${demoPos.x}%`,
              top: `${demoPos.y}%`,
              transform: 'translate(-2px, -2px)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3L10.07 20.97L12.58 13.11L20.44 10.6L3 3Z"
                fill="#6366f1"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>
            <div className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-lg mt-0.5 whitespace-nowrap">
              You (Move mouse inside)
            </div>
          </div>

          {/* Simulated Peer Cursor 1 */}
          <div className="absolute left-[25%] top-[40%] pointer-events-none animate-float origin-top-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3L10.07 20.97L12.58 13.11L20.44 10.6L3 3Z"
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>
            <div className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-pink-500 text-white shadow-lg mt-0.5 whitespace-nowrap">
              Alex (Design Lead)
            </div>
            <div className="mt-1 px-3 py-1 rounded-xl bg-slate-950/90 text-[10px] text-white border border-slate-700/80 shadow-md">
              Testing sticky notes sync 📝
            </div>
          </div>

          {/* Simulated Peer Cursor 2 */}
          <div className="absolute left-[70%] top-[35%] pointer-events-none animate-pulse origin-top-left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3L10.07 20.97L12.58 13.11L20.44 10.6L3 3Z"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>
            <div className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500 text-slate-900 shadow-lg mt-0.5 whitespace-nowrap">
              Elena (Frontend R&D)
            </div>
            <div className="mt-1 px-3 py-1 rounded-xl bg-slate-950/90 text-[10px] text-white border border-slate-700/80 shadow-md">
              rAF Lerp factor α = 0.22 ⚡
            </div>
          </div>

          <div className="absolute bottom-4 right-4 text-[11px] font-mono text-slate-500 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
            Interactive Canvas Preview • Hover to test
          </div>
        </div>

        {/* Room Launch Card */}
        <div className="mt-12 w-full max-w-md">
          <RoomCard />
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 border-t border-slate-800/60 bg-slate-950/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Ultra-Low Latency
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Every detail is tuned for 60 FPS fluidity, visual feedback, and zero backend bottlenecking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="text-amber-400" size={24} />,
                title: '60 FPS Exponential Interpolation',
                desc: 'Client-side requestAnimationFrame loop interpolates network coordinates smoothly, eliminating jitter even on 150ms latency.',
              },
              {
                icon: <MessageSquare className="text-cyan-400" size={24} />,
                title: 'Figma-Style Cursor Chat',
                desc: 'Press / anywhere to type fleeting thought bubbles directly attached to your cursor, visible in real time to all collaborators.',
              },
              {
                icon: <StickyNote className="text-emerald-400" size={24} />,
                title: 'Shared Sticky Notes Board',
                desc: 'Add, color-code, edit, and organize collaborative cards across devices with synchronized state.',
              },
              {
                icon: <Activity className="text-pink-400" size={24} />,
                title: 'Presence & Heartbeat Detection',
                desc: 'Automatic idle detection after 3.5s inactivity, host indicator, avatar roster, and ping notifications on join/leave.',
              },
              {
                icon: <Sparkles className="text-purple-400" size={24} />,
                title: 'Zero-Config Autonomous Demo Mode',
                desc: 'If the backend is offline, the app automatically switches to Demo Mode, simulating 5 intelligent collaborating bots.',
              },
              {
                icon: <Code2 className="text-indigo-400" size={24} />,
                title: 'Web Audio Procedural Synthesis',
                desc: 'Pleasant spatial chime harmonies synthesized directly in the browser with Web Audio API. Zero asset downloads required.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-3 rounded-2xl bg-slate-800/60 w-fit mb-4">{f.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Tech Stack */}
      <section className="px-6 py-20 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Production R&D Architecture
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-400">
              Clean separation of concerns with predictable state stores and binary-efficient WebSocket events.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-400 text-[11px]">
                <Cpu size={14} className="text-indigo-400" />
                <span>Synchronization Protocol Pipeline</span>
              </div>
              <div className="space-y-2 text-slate-400">
                <p className="text-indigo-300 font-semibold">1. Pointer Ingestion (Client)</p>
                <p className="pl-4">→ Mouse/touch converted to normalized 0..100% viewport coordinates</p>
                <p className="pl-4">→ Throttled to 30Hz network broadcast interval</p>

                <p className="text-purple-300 font-semibold pt-2">2. WebSocket Room Dispatch (Server)</p>
                <p className="pl-4">→ Express + Socket.IO broadcasts cursor deltas to room peers</p>
                <p className="pl-4">→ In-memory state manager handles atomic counter & notes</p>

                <p className="text-pink-300 font-semibold pt-2">3. Sub-Frame Smoothing (Client)</p>
                <p className="pl-4">→ `requestAnimationFrame` runs at native display refresh (60/120Hz)</p>
                <p className="pl-4">→ Exponential smoothing: current = lerp(current, target, 0.22)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">React 19 + TypeScript + Zustand</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Atomic state slices ensure cursor movements do not cause unnecessary re-renders in shared editor or notes.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Responsive Viewport Normalization</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Coordinates map across 4K desktops, laptops, tablets, and phones uniformly using percentage grids.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Lighthouse Optimized (&gt;95)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Zero heavy external UI libraries. CSS hardware acceleration, lazy code-splitting, and minimal bundle footprint.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/60 py-8 px-6 bg-slate-950 text-center text-xs text-slate-500">
        <p>SyncPoint • Real-Time Multiplayer Collaboration System</p>
        <p className="mt-1">Built with React 19, TypeScript, Socket.IO, TailwindCSS & Vitest</p>
      </footer>
    </div>
  );
};
