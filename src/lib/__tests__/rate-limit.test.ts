import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock redis to return null (memory fallback)
vi.mock("@/lib/redis", () => ({
  getRedisClient: () => null,
}));

// Dynamic import after mocking
const { rateLimit, rateLimitSync } = await import("../rate-limit");

describe("rateLimit (memory fallback)", () => {
  beforeEach(() => {
    // Reset memory store by calling with high limit to clear
    // We can't access memoryStore directly, so we use unique keys per test
  });

  it("allows requests within limit", async () => {
    const key = `test-allow-${Date.now()}`;
    const config = { limit: 5, windowSeconds: 60 };

    const r1 = await rateLimit(key, config);
    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(4);
  });

  it("decrements remaining count", async () => {
    const key = `test-decrement-${Date.now()}`;
    const config = { limit: 3, windowSeconds: 60 };

    const r1 = await rateLimit(key, config);
    expect(r1.remaining).toBe(2);

    const r2 = await rateLimit(key, config);
    expect(r2.remaining).toBe(1);

    const r3 = await rateLimit(key, config);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests over limit", async () => {
    const key = `test-block-${Date.now()}`;
    const config = { limit: 2, windowSeconds: 60 };

    await rateLimit(key, config);
    await rateLimit(key, config);
    const r3 = await rateLimit(key, config);

    expect(r3.success).toBe(false);
    expect(r3.remaining).toBe(0);
  });

  it("returns resetAt timestamp in the future", async () => {
    const key = `test-reset-${Date.now()}`;
    const config = { limit: 5, windowSeconds: 60 };

    const result = await rateLimit(key, config);
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });
});

describe("rateLimitSync", () => {
  it("allows and tracks requests synchronously", () => {
    const key = `sync-test-${Date.now()}`;
    const config = { limit: 2, windowSeconds: 60 };

    const r1 = rateLimitSync(key, config);
    expect(r1.success).toBe(true);
    expect(r1.remaining).toBe(1);

    const r2 = rateLimitSync(key, config);
    expect(r2.success).toBe(true);
    expect(r2.remaining).toBe(0);

    const r3 = rateLimitSync(key, config);
    expect(r3.success).toBe(false);
  });
});
