import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Rate limiting for login and Gemini analysis endpoints.
 *
 * Uses Upstash when configured (correct across serverless instances); falls
 * back to an in-process sliding window otherwise — honest for a single
 * long-running dev/self-hosted process, and still far better than nothing.
 */

const redisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
);

const upstash = redisConfigured
  ? {
      login: new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "60 s"),
        prefix: "rl:login",
      }),
      analyze: new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, "300 s"),
        prefix: "rl:analyze",
      }),
      chat: new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(20, "60 s"),
        prefix: "rl:chat",
      }),
    }
  : null;

/** In-memory fallback: sliding window per key. */
const memoryBuckets = new Map<string, number[]>();

function memoryLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (memoryBuckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    memoryBuckets.set(key, hits);
    return false;
  }
  hits.push(now);
  memoryBuckets.set(key, hits);
  return true;
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

type Scope = "login" | "analyze" | "chat";

const memoryRules: Record<Scope, { limit: number; windowMs: number }> = {
  login: { limit: 5, windowMs: 60_000 },
  analyze: { limit: 10, windowMs: 300_000 },
  chat: { limit: 20, windowMs: 60_000 },
};

/** Returns true when the request is allowed. */
export async function checkRateLimit(
  scope: Scope,
  request: NextRequest,
): Promise<boolean> {
  const ip = getClientIp(request);

  if (upstash) {
    const { success } = await upstash[scope].limit(ip);
    return success;
  }

  const rule = memoryRules[scope];
  return memoryLimit(`${scope}:${ip}`, rule.limit, rule.windowMs);
}
