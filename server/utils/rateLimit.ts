// Простой in-memory rate-limiter (скользящее окно) для одного инстанса Nitro.
// Для MVP достаточно; при масштабировании на несколько инстансов — заменить на Redis/БД.
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = (hits.get(key) ?? []).filter(ts => ts > windowStart);

  if (timestamps.length >= limit) {
    hits.set(key, timestamps);

    return false;
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  return true;
}

// периодически чистим старые ключи, чтобы Map не рос бесконечно
if (import.meta.server) {
  const CLEANUP_INTERVAL = 10 * 60 * 1000;

  setInterval(() => {
    const cutoff = Date.now() - CLEANUP_INTERVAL;

    for (const [key, timestamps] of hits) {
      const fresh = timestamps.filter(ts => ts > cutoff);

      if (fresh.length) hits.set(key, fresh);
      else hits.delete(key);
    }
  }, CLEANUP_INTERVAL).unref?.();
}
