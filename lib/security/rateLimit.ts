/**
 * PSC Global — Sliding Window Rate Limiter
 * Provides IP-based rate limiting for authentication and submission endpoints.
 */
import 'server-only';

interface RateLimitRecord {
  timestamps: number[];
}

const cache = new Map<string, RateLimitRecord>();

/**
 * Checks rate limit for a given key (e.g. IP + endpoint).
 * @param key Unique identifier for the client (e.g. "login:192.168.1.1")
 * @param limit Maximum allowed requests within the time window
 * @param windowMs Time window in milliseconds (default: 60,000ms / 1 min)
 * @returns { allowed: boolean, remaining: number, resetMs: number }
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  let record = cache.get(key);
  if (!record) {
    record = { timestamps: [] };
    cache.set(key, record);
  }

  // Filter timestamps within the current window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetMs = oldest + windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
  };
}
