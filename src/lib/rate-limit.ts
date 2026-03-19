import { getRedisClient } from "./redis";

/**
 * Distributed rate limiting with Redis.
 * Falls back to in-memory if Redis is unavailable.
 */

// Memory fallback store
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  memoryStore.forEach((entry, key) => {
    if (entry.resetAt < now) memoryStore.delete(key);
  });
}, 60 * 1000);

interface RateLimitConfig {
  /** Max requests per window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given key.
 * Uses Redis if available, memory fallback otherwise.
 */
export async function rateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient();

  if (redis) {
    try {
      return await redisRateLimit(key, config);
    } catch {
      // Redis failed, fall back to memory
    }
  }

  return memoryRateLimit(key, config);
}

/**
 * Synchronous rate limit (memory only) for backward compatibility.
 */
export function rateLimitSync(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  return memoryRateLimit(key, config);
}

/**
 * Rate limit helper for API routes. Returns error info if rate limited, or null if allowed.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, windowSeconds: 60 }
): Promise<{
  limited: true;
  response: { error: string; retryAfter: number };
  headers: Record<string, string>;
} | { limited: false }> {
  const result = await rateLimit(identifier, config);
  if (!result.success) {
    return {
      limited: true as const,
      response: {
        error: "Too many requests",
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
      },
      headers: {
        "X-RateLimit-Limit": config.limit.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": result.resetAt.toString(),
        "Retry-After": Math.ceil(
          (result.resetAt - Date.now()) / 1000
        ).toString(),
      },
    };
  }
  return { limited: false as const };
}

// ---------------------------------------------------------------------------
// Redis implementation (sliding window)
// ---------------------------------------------------------------------------

async function redisRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = getRedisClient()!;
  const redisKey = `ratelimit:${key}`;
  const now = Date.now();
  const windowStart = now - config.windowSeconds * 1000;

  // Sliding window using sorted set
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(redisKey, 0, windowStart);
  pipeline.zadd(redisKey, now, `${now}-${Math.random()}`);
  pipeline.expire(redisKey, config.windowSeconds);
  pipeline.zcard(redisKey);
  const results = await pipeline.exec();

  const count = (results?.[3]?.[1] as number) || 0;
  const success = count <= config.limit;
  const remaining = Math.max(0, config.limit - count);
  const resetAt = now + config.windowSeconds * 1000;

  return { success, remaining, resetAt };
}

// ---------------------------------------------------------------------------
// Memory implementation (fixed window)
// ---------------------------------------------------------------------------

function memoryRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    });
    return {
      success: true,
      remaining: config.limit - 1,
      resetAt: now + config.windowSeconds * 1000,
    };
  }

  if (entry.count >= config.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return {
    success: true,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}
