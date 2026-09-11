type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

export function rateLimit(
  key: string,
  max = MAX_HITS,
  windowMs = WINDOW_MS,
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, retryAfter: Math.ceil(windowMs / 1000) };
  }

  if (current.count >= max) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    ok: true,
    remaining: max - current.count,
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}
