export const CURSOR_PALETTE = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#3b82f6', // Blue
  '#84cc16', // Lime
  '#a855f7', // Purple
];

/**
 * Returns a deterministic color for a user ID
 */
export function getColorForUser(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CURSOR_PALETTE.length;
  return CURSOR_PALETTE[index];
}

/**
 * Returns a random vibrant color from the curated palette
 */
export function getRandomColor(): string {
  return CURSOR_PALETTE[Math.floor(Math.random() * CURSOR_PALETTE.length)];
}

/**
 * Computes high-contrast text color ('#ffffff' or '#090d16') for a given hex background
 */
export function getContrastTextColor(hexColor: string): string {
  const cleanHex = hexColor.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;

  // Relative luminance
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#090d16' : '#ffffff';
}
