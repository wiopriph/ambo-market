// Простой in-memory rate-limiter (скользящее окно) для одного инстанса.
// В Cloudflare Workers память пер-изолятная и лимит мягче, чем на Node;
// при переезде насовсем или втором инстансе - заменить на KV/БД.
const hits = new Map<string, number[]>();

// Чистка старых ключей ленивая, при обращениях: глобальный setInterval
// в Workers запрещён (таймеры только внутри обработчиков запросов).
const CLEANUP_EVERY = 500;
const MAX_AGE = 60 * 60 * 1000;

let callsSinceCleanup = 0;

function cleanup() {
  const cutoff = Date.now() - MAX_AGE;

  for (const [key, timestamps] of hits) {
    const fresh = timestamps.filter(ts => ts > cutoff);

    if (fresh.length) hits.set(key, fresh);
    else hits.delete(key);
  }
}

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  if (++callsSinceCleanup >= CLEANUP_EVERY) {
    callsSinceCleanup = 0;
    cleanup();
  }

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
