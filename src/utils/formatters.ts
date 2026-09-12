/**
 * Formats a timestamp into a clean relative time string (e.g., "just now", "2m ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

/**
 * Truncate long IDs (e.g. "a3f89e21" from full UUID)
 */
export function truncateId(id: string, length = 8): string {
  if (!id) return '';
  return id.length > length ? id.slice(0, length) : id;
}

/**
 * Generates an easy-to-read room identifier (e.g. "orbit-742")
 */
export function generateRoomId(): string {
  const adjectives = [
    'swift',
    'hyper',
    'neon',
    'cyber',
    'quantum',
    'stellar',
    'cosmic',
    'solar',
    'lunar',
    'vivid',
    'pulse',
    'zenith',
  ];
  const nouns = [
    'sync',
    'orbit',
    'vector',
    'matrix',
    'nexus',
    'flow',
    'canvas',
    'beacon',
    'spark',
    'stream',
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${adj}-${noun}-${num}`;
}
