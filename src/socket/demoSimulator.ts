import { User } from '../types/room';
import { useRoomStore } from '../store/useRoomStore';
import { useCursorStore } from '../store/useCursorStore';
import { useSharedStateStore } from '../store/useSharedStateStore';
import { soundService } from '../services/soundService';

interface DemoBot {
  user: User;
  baseX: number;
  baseY: number;
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  radiusX: number;
  radiusY: number;
  isIdle: boolean;
  typingUntil?: number;
  typingText?: string;
}

const BOT_TEMPLATES = [
  {
    id: 'bot-alex',
    username: 'Alex (Design)',
    color: '#ec4899', // Pink
    baseX: 28,
    baseY: 35,
    radiusX: 18,
    radiusY: 15,
    speedX: 0.0008,
    speedY: 0.0012,
  },
  {
    id: 'bot-elena',
    username: 'Elena (R&D)',
    color: '#06b6d4', // Cyan
    baseX: 62,
    baseY: 42,
    radiusX: 22,
    radiusY: 18,
    speedX: 0.0011,
    speedY: 0.0007,
  },
  {
    id: 'bot-marcus',
    username: 'Marcus (Backend)',
    color: '#10b981', // Emerald
    baseX: 45,
    baseY: 65,
    radiusX: 25,
    radiusY: 16,
    speedX: 0.0009,
    speedY: 0.0014,
  },
  {
    id: 'bot-chloe',
    username: 'Chloe (Product)',
    color: '#f59e0b', // Amber
    baseX: 75,
    baseY: 28,
    radiusX: 16,
    radiusY: 14,
    speedX: 0.0014,
    speedY: 0.0009,
  },
  {
    id: 'bot-devon',
    username: 'Devon (QA)',
    color: '#8b5cf6', // Violet
    baseX: 20,
    baseY: 72,
    radiusX: 15,
    radiusY: 20,
    speedX: 0.0007,
    speedY: 0.0011,
  },
];

const BOT_CHAT_MESSAGES = [
  'Interpolation feels butter smooth! 🧈',
  'Check out the sticky notes 📝',
  'Testing sub-50ms latency sync ⚡',
  'Press / to chat above cursor!',
  'Look at this laser pointer trail ✨',
  '60 FPS confirmed in DevTools 🎯',
  'Figma-style collaboration is awesome 🚀',
  'Loving the dark glassmorphism UI 💎',
];

class DemoSimulator {
  private bots: DemoBot[] = [];
  private animFrameId: number | null = null;
  private actionIntervalId: any = null;
  private isRunning: boolean = false;

  public start(roomId = 'demo-room', username = 'You (Guest)', color = '#6366f1') {
    if (this.isRunning) return;
    this.isRunning = true;

    const roomStore = useRoomStore.getState();
    const currentUser: User = {
      id: 'current-user-demo',
      username,
      color,
      role: 'host',
      joinedAt: Date.now(),
      lastSeen: Date.now(),
      isIdle: false,
    };

    // Initialize 5 bots
    this.bots = BOT_TEMPLATES.map((tpl, i) => ({
      user: {
        id: tpl.id,
        username: tpl.username,
        color: tpl.color,
        role: 'member',
        joinedAt: Date.now() - (i + 1) * 60000,
        lastSeen: Date.now(),
        isIdle: false,
      },
      baseX: tpl.baseX,
      baseY: tpl.baseY,
      phaseX: i * 1.5,
      phaseY: i * 2.1,
      speedX: tpl.speedX,
      speedY: tpl.speedY,
      radiusX: tpl.radiusX,
      radiusY: tpl.radiusY,
      isIdle: false,
    }));

    roomStore.setRoom(roomId, 'Demo Workspace (Simulated)', currentUser.id);
    roomStore.setCurrentUser(currentUser);
    roomStore.setUsers([currentUser, ...this.bots.map((b) => b.user)]);
    roomStore.setDemoMode(true);
    roomStore.setLatency(14); // Simulated ultra-low latency

    // Start motion loop
    this.loop();

    // Start periodic bot actions (clicks, chats, counters, reactions)
    this.scheduleBotActions();
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.actionIntervalId) {
      clearInterval(this.actionIntervalId);
      this.actionIntervalId = null;
    }
  }

  private loop = () => {
    if (!this.isRunning) return;

    const t = performance.now();
    const cursorStore = useCursorStore.getState();

    for (const bot of this.bots) {
      if (bot.isIdle) continue;

      // Harmonic Lissajous / Perlin-like path simulation
      const x = Math.min(
        92,
        Math.max(
          8,
          bot.baseX +
            bot.radiusX * Math.sin(t * bot.speedX + bot.phaseX) +
            (bot.radiusX * 0.3) * Math.cos(t * bot.speedX * 2.2)
        )
      );

      const y = Math.min(
        88,
        Math.max(
          12,
          bot.baseY +
            bot.radiusY * Math.cos(t * bot.speedY + bot.phaseY) +
            (bot.radiusY * 0.3) * Math.sin(t * bot.speedY * 1.8)
        )
      );

      const isTyping = bot.typingUntil && bot.typingUntil > Date.now();
      const typingMessage = isTyping ? bot.typingText : null;

      cursorStore.updateRemoteTarget(bot.user.id, x, y, Date.now(), {
        username: bot.user.username,
        color: bot.user.color,
        isIdle: bot.isIdle,
        typingMessage,
      });
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private scheduleBotActions() {
    if (this.actionIntervalId) clearInterval(this.actionIntervalId);

    this.actionIntervalId = setInterval(() => {
      if (!this.isRunning || this.bots.length === 0) return;

      const randomBot = this.bots[Math.floor(Math.random() * this.bots.length)];
      const actionType = Math.floor(Math.random() * 6);

      switch (actionType) {
        case 0: {
          // Bot sends cursor chat
          const msg = BOT_CHAT_MESSAGES[Math.floor(Math.random() * BOT_CHAT_MESSAGES.length)];
          randomBot.typingText = msg;
          randomBot.typingUntil = Date.now() + 4500;
          useRoomStore.getState().addActivity({
            type: 'chat',
            username: randomBot.user.username,
            text: `said "${msg}"`,
          });
          break;
        }
        case 1: {
          // Bot clicks with ripple
          const cursor = useCursorStore.getState().cursors[randomBot.user.id];
          if (cursor) {
            useCursorStore.getState().addClickRipple({
              id: `ripple-bot-${Date.now()}`,
              x: cursor.currentX,
              y: cursor.currentY,
              color: randomBot.user.color,
              timestamp: Date.now(),
            });
            soundService.playClick();
          }
          break;
        }
        case 2: {
          // Bot sends an emoji reaction
          const emojis = ['❤️', '🔥', '🚀', '🎉', '👀', '👏', '✨'];
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          const cursor = useCursorStore.getState().cursors[randomBot.user.id];
          const x = cursor ? cursor.currentX : Math.random() * 80 + 10;
          const y = cursor ? cursor.currentY : Math.random() * 80 + 10;

          useSharedStateStore.getState().addReaction({
            id: `react-bot-${Date.now()}`,
            emoji,
            x,
            y,
            username: randomBot.user.username,
            timestamp: Date.now(),
          });
          soundService.playReaction();
          break;
        }
        case 3: {
          // Bot increments counter
          const delta = Math.random() > 0.3 ? 1 : -1;
          useSharedStateStore.getState().incrementCounter(delta);
          soundService.playClick();
          useRoomStore.getState().addActivity({
            type: 'counter',
            username: randomBot.user.username,
            text: `updated counter to ${useSharedStateStore.getState().counter}`,
          });
          break;
        }
        case 4: {
          // Bot laser draws
          const cursor = useCursorStore.getState().cursors[randomBot.user.id];
          if (cursor) {
            const points = [];
            const now = Date.now();
            for (let i = 0; i < 15; i++) {
              points.push({
                x: cursor.currentX + Math.sin(i * 0.4) * 3,
                y: cursor.currentY + Math.cos(i * 0.4) * 3,
                timestamp: now - (15 - i) * 30,
              });
            }
            useCursorStore.getState().recordLaserPoints(randomBot.user.id, randomBot.user.color, points);
          }
          break;
        }
        case 5: {
          // Bot pings location
          const cursor = useCursorStore.getState().cursors[randomBot.user.id];
          if (cursor) {
            useCursorStore.getState().addPing({
              id: `ping-bot-${Date.now()}`,
              userId: randomBot.user.id,
              username: randomBot.user.username,
              color: randomBot.user.color,
              x: cursor.currentX,
              y: cursor.currentY,
              timestamp: Date.now(),
            });
            soundService.playPing();
          }
          break;
        }
      }
    }, 3800);
  }

  public handleUserPing(x: number, y: number) {
    const user = useRoomStore.getState().currentUser;
    useCursorStore.getState().addPing({
      id: `ping-user-${Date.now()}`,
      userId: user?.id || 'you',
      username: user?.username || 'You',
      color: user?.color || '#6366f1',
      x,
      y,
      timestamp: Date.now(),
    });
    soundService.playPing();
  }

  public handleUserChat(message: string) {
    const user = useRoomStore.getState().currentUser;
    if (user) {
      useRoomStore.getState().addActivity({
        type: 'chat',
        username: user.username,
        text: `said "${message}"`,
      });
    }
  }

  public handleCounterChange(delta: number | 'reset') {
    if (delta === 'reset') {
      useSharedStateStore.getState().setCounter(0);
    } else {
      useSharedStateStore.getState().incrementCounter(delta);
    }
    soundService.playClick();
  }

  public handleEditorChange(text: string) {
    const user = useRoomStore.getState().currentUser;
    useSharedStateStore.getState().setEditorText(text, user?.username || 'You');
  }

  public handleReaction(emoji: string, coords?: { x: number; y: number }) {
    const user = useRoomStore.getState().currentUser;
    useSharedStateStore.getState().addReaction({
      id: `reaction-user-${Date.now()}`,
      emoji,
      x: coords?.x ?? 50,
      y: coords?.y ?? 50,
      username: user?.username || 'You',
      timestamp: Date.now(),
    });
    soundService.playReaction();
  }
}

export const demoSimulator = new DemoSimulator();
