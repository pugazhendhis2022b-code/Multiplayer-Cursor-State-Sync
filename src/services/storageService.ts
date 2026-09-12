const STORAGE_PREFIX = 'syncpoint:';

export const storageService = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch {
      // Storage unavailable or quota exceeded
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch {
      // Ignore
    }
  },

  getUserName(): string {
    return this.get<string>('username', '');
  },

  setUserName(name: string): void {
    this.set('username', name);
  },

  getUserColor(): string {
    return this.get<string>('usercolor', '');
  },

  setUserColor(color: string): void {
    this.set('usercolor', color);
  },

  getRecentRooms(): string[] {
    return this.get<string[]>('recent_rooms', []);
  },

  addRecentRoom(roomId: string): void {
    const list = this.getRecentRooms().filter((r) => r !== roomId);
    list.unshift(roomId);
    this.set('recent_rooms', list.slice(0, 5));
  },
};
