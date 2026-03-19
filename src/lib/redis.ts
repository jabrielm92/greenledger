import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) return null;

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 200, 1000);
      },
      lazyConnect: true,
    });

    redis.on("error", (error) => {
      console.error("Redis connection error:", error.message);
    });
  }

  return redis;
}

export async function disconnectRedis() {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
