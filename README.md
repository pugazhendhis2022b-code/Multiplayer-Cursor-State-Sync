# 🚀 SyncPoint: Real-Time Multiplayer Cursor & State Synchronization

[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.1-646cff.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101.svg?style=flat&logo=socketdotio)](https://socket.io/)
[![TailwindCSS 3](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.0-729b1b.svg?style=flat&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.50-45ba4b.svg?style=flat&logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SyncPoint** is a production-grade, GitHub-ready real-time multiplayer collaboration web application. It combines sub-frame cursor interpolation, low-latency WebSocket synchronization, presence tracking, Miro-style interactive sticky notes, Figma-style ephemeral cursor chat, and an autonomous offline simulation engine.

---

## 📸 Screenshots

```
+-----------------------------------------------------------------------------------------------+
| SyncPoint   | Room: swift-orbit-421 [Copy]   [● Live 18ms]   [Users (6)]  [QR] [🔊] [🌙] [⚙️]  |
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
|   +---------------------------------------+   +-------------------------------------------+   |
|   | 💡 Shared Sticky Notes Board          |   | 📝 Collaborative Scratchpad               |   |
|   | [Yellow] [Blue] [Green] [+ Add Note]  |   | [Alex typing...]                          |   |
|   |                                       |   |                                           |   |
|   | +-----------------+ +---------------+ |   | # Real-Time Sync Whitepaper               |   |
|   | | 💡 Sprint Goal  | | ⚡ rAF Lerp   | |   | • Coordinates: 30Hz network broadcast     |   |
|   | | By Alex         | | By Elena      | |   | • Smoothing: 60FPS requestAnimationFrame  |   |
|   | +-----------------+ +---------------+ |   | • Jitter reduced by 94%                   |   |
|   +---------------------------------------+   +-------------------------------------------+   |
|                                                                                               |
|   +---------------------------------------+   +-------------------------------------------+   |
|   | ⚡ Shared Atomic Counter              |   | 🎛️ Distributed Room Controls              |   |
|   | [ - ]       [ 42 ]       [ + ]        |   | [✓] Ultra-Low Latency Mode  [✓] Grid Snap |   |
|   +---------------------------------------+   +-------------------------------------------+   |
|                                                                                               |
|                       [ Select (V) | Chat (/) | Laser (L) | Reaction (E) ]                    |
+-----------------------------------------------------------------------------------------------+
```

---

## ✨ Features

### 1. Ultra-Smooth Cursors
- **Sub-Frame Exponential Lerp**: Client-side interpolation loop running at 60–120 FPS via `requestAnimationFrame`.
- **Bandwidth Throttling**: Mouse positions normalized into resolution-independent percentages ($[0, 100]\%$) and throttled to 30Hz.
- **Deadband Filtering & Prediction**: Eliminates microscopic mouse noise while extrapolating velocity for zero visual lag.
- **Dynamic Cursor Trails**: Fading, glowing particles following fast mouse motions.
- **Idle State Detection**: Dims cursor and displays last active relative time if idle for $>3.5$s.

### 2. Interactive Collaboration Tools
- **Figma-Style Cursor Chat (`/`)**: Press `/` anywhere to type a floating thought bubble attached to your cursor.
- **Miro-Style Laser Pointer (`L`)**: Hold or draw to emit glowing ephemeral light paths that fade after 1.5 seconds.
- **Click Ripples & Sonar Pings (`P` / `Alt+Click`)**: Broadcast location attention markers to all peers.
- **Emoji Burst Reactions (`E`)**: Pop flying reactions (❤️, 🔥, 🚀, 🎉, 👀, 👏) across the room.

### 3. Distributed State Synchronization
- **Shared Sticky Notes**: Add, drag, edit markdown content, delete, and color-code collaborative notes.
- **Collaborative Scratchpad**: Real-time shared editor with active collaborator typing locks and live broadcast.
- **Atomic Shared Counter**: Instant concurrent increment/decrement with visual glow and audit trail.
- **Synchronized Room Switches**: Toggle Grid Snapping, Read-Only Locks, and Dark Palette synchronously.

### 4. Autonomous Offline Demo Mode
- **Zero-Setup Fallback**: If the Node.js backend is offline or unreachable, the client automatically transitions to **Demo Mode** within 2.5 seconds.
- **5 Simulated Collaborator Bots**: Alex (Design), Elena (R&D), Marcus (Backend), Chloe (Product), Devon (QA) animate organic Bezier paths, send cursor chats, increment counters, post sticky notes, and emit reactions.

### 5. Sound & Accessibility
- **Procedural Web Audio API**: Crisp chime chords on user join, soft pop transients on click, and bounce tones on reactions without any external audio asset downloads.
- **Self-Contained SVG QR Code**: Scan invite links directly from mobile phones or tablets.
- **ARIA & Keyboard Navigation**: Complete keyboard shortcuts (`Ctrl+C`, `Ctrl+J`, `Ctrl+D`, `Esc`, `/`).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + C` | Copy room invite link to clipboard |
| `Ctrl + J` | Open room join prompt / navigate |
| `Ctrl + D` | Toggle Dark Mode / Light Mode |
| `Esc` | Leave room / Dismiss modal or chat bubble |
| `/` | Activate Cursor Chat input |
| `V` | Switch to Select tool |
| `L` | Switch to Laser Pointer tool |
| `E` | Open Emoji Reaction palette |

---

## 📁 Project Architecture & Folder Structure

```
Multiplayer Cursor State Sync/
├── src/
│   ├── components/
│   │   ├── cursor/          # Cursor, CursorTrail, LaserPointer, CursorPing, CursorChatBubble, CursorOverlay
│   │   ├── presence/        # UserList, StatusBadge, ActivityFeed, UserProfileModal
│   │   ├── shared-state/    # SharedCounter, SharedEditor, SharedNotes, SharedToggles, EmojiReactionBar
│   │   ├── layout/          # Navbar, Toolbar, Footer, LoadingScreen
│   │   └── common/          # RoomCard, SettingsPanel, QRCodeModal
│   ├── hooks/
│   │   ├── useSocket.ts             # Connection manager & lifecycle
│   │   ├── useCursorSync.ts         # Mouse listener & 30Hz network throttle
│   │   ├── useInterpolation.ts      # 60 FPS requestAnimationFrame lerp loop
│   │   ├── useKeyboardShortcuts.ts  # Global hotkeys binding
│   │   └── useWindowDimensions.ts   # Viewport dimension tracker
│   ├── pages/
│   │   ├── LandingPage.tsx   # Interactive hero, architecture demo, room launcher
│   │   ├── RoomPage.tsx      # Multi-user collaborative workspace
│   │   └── NotFoundPage.tsx  # 404 handler
│   ├── services/
│   │   ├── soundService.ts   # Web Audio API procedural synthesis
│   │   ├── qrCodeService.ts  # Zero-dependency SVG QR matrix generator
│   │   └── storageService.ts # LocalStorage cache for preferences & rooms
│   ├── socket/
│   │   ├── events.ts         # Typesafe event contract
│   │   ├── socketClient.ts   # Singleton Socket.IO client
│   │   └── demoSimulator.ts  # 5-bot autonomous simulation engine
│   ├── store/
│   │   ├── useRoomStore.ts        # Room & presence state
│   │   ├── useCursorStore.ts      # Remote cursors & trail points
│   │   ├── useSharedStateStore.ts # Notes, counter, editor text
│   │   └── useSettingsStore.ts    # Theme, cursor sizes, audio preferences
│   ├── styles/
│   │   └── index.css         # Glassmorphism utilities & Tailwind setup
│   ├── types/                # TypeScript interfaces (cursor, room, state, events)
│   ├── utils/                # Math (lerp, clamp, distance), colors, formatters
│   ├── App.tsx               # Client router & toast provider
│   └── main.tsx              # React 19 mount point
├── server/
│   ├── package.json          # Backend dependencies
│   ├── tsconfig.json         # NodeNext TypeScript configuration
│   ├── src/
│   │   ├── index.ts          # Express HTTP + Socket.IO server bootstrap
│   │   ├── roomManager.ts    # In-memory room & state repository
│   │   ├── socketHandlers.ts # Real-time event dispatches
│   │   └── types.ts          # Backend shared contracts
│   └── .env.example
├── tests/
│   ├── unit/                 # Vitest unit tests (math, roomStore, cursorStore)
│   └── e2e/                  # Playwright end-to-end test suite
├── package.json              # Frontend dependencies & scripts
├── vite.config.ts            # Vite 6 config with proxy & code-splitting
├── tailwind.config.js        # Custom glassmorphic color palette
├── vitest.config.ts          # Vitest testing setup
├── playwright.config.ts      # Playwright browser testing setup
├── vercel.json               # Frontend deployment config
└── render.yaml               # Backend deployment config
```

---

## ⚡ Performance Optimizations

1. **Normalized Float Coordinates**: Viewport coordinates are normalized as floats $(x, y \in [0, 100])$ so that high-resolution 4K monitors, laptops, and mobile screens render cursors consistently.
2. **Decoupled Tick Rate**: Network events are emitted at ~30Hz (33ms) to prevent network congestion, while client-side rendering runs smoothly at 60Hz or 120Hz via `requestAnimationFrame`.
3. **Atomic Zustand Selectors**: Components subscribe only to relevant slices of state (e.g. `useSharedStateStore(s => s.counter)`), preventing expensive re-renders across the full DOM tree.
4. **Hardware Acceleration**: Cursors, laser trails, and badges utilize CSS `transform: translate3d` and GPU layer promotion.
5. **Zero External Media**: All sound effects and QR codes are generated mathematically at runtime.

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js $\ge 18.0$ (Tested on Node v24)
- npm $\ge 9.0$

### 1. Frontend Setup

```bash
# In project root
npm install

# Run Vite dev server (runs on http://localhost:3000)
npm run dev
```

### 2. Backend Setup

```bash
# In a separate terminal
cd server
npm install

# Run Express + Socket.IO server (runs on http://localhost:4000)
npm run dev
```

> **Note**: If you run only the frontend without starting the backend, **Demo Mode** will automatically activate and simulate 5 active users so you can test all features immediately!

---

## 🧪 Running Tests

### Unit Tests (Vitest)
```bash
npm run test
```

### End-to-End Tests (Playwright)
```bash
npm run test:e2e
```

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push your repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set Environment Variable: `VITE_SOCKET_URL=https://your-backend-url.onrender.com`.
4. Deploy! (`vercel.json` handles Single Page App routing automatically).

### Backend (Render / Railway)
1. Connect repo to [Render](https://render.com).
2. Choose **Web Service** with Root Directory `server`.
3. Build Command: `npm install && npm run build`.
4. Start Command: `npm run start`.
5. Set `PORT=4000` and `CORS_ORIGIN=*`.

---

## 📜 License

MIT License © 2026 SyncPoint Contributors
