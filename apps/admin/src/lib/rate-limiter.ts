/**
 * In-memory rate limiter for brute-force protection.
 *
 * Tracks attempts per key (IP address) within a sliding window.
 * Suitable for single-instance deployments (admin panels).
 * For multi-instance, swap to Redis-backed implementation.
 */

interface RateLimitEntry {
    attempts: number;
    firstAttemptAt: number;
}

const store = new Map<string, RateLimitEntry>();

/** Clean up expired entries every 10 minutes */
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
        if (now - entry.firstAttemptAt > WINDOW_MS) {
            store.delete(key);
        }
    }
}, CLEANUP_INTERVAL_MS);

/** Max attempts allowed within the window */
const MAX_ATTEMPTS = 5;

/** Time window in milliseconds (15 minutes) */
const WINDOW_MS = 15 * 60 * 1000;

/**
 * Check if a key (IP) has exceeded the rate limit.
 *
 * @returns `{ limited: false }` if under limit,
 *          `{ limited: true, retryAfterSeconds }` if exceeded.
 */
export function checkRateLimit(key: string): {
    limited: boolean;
    retryAfterSeconds?: number;
} {
    const now = Date.now();
    const entry = store.get(key);

    // No previous attempts — allow
    if (!entry) {
        store.set(key, { attempts: 1, firstAttemptAt: now });
        return { limited: false };
    }

    // Window expired — reset
    if (now - entry.firstAttemptAt > WINDOW_MS) {
        store.set(key, { attempts: 1, firstAttemptAt: now });
        return { limited: false };
    }

    // Within window — check count
    entry.attempts += 1;

    if (entry.attempts > MAX_ATTEMPTS) {
        const retryAfterSeconds = Math.ceil(
            (WINDOW_MS - (now - entry.firstAttemptAt)) / 1000
        );
        return { limited: true, retryAfterSeconds };
    }

    return { limited: false };
}

/**
 * Reset the rate limit for a key (e.g., on successful login).
 */
export function resetRateLimit(key: string): void {
    store.delete(key);
}

/**
 * Extract client IP from request headers.
 * Checks X-Forwarded-For first (reverse proxy), then falls back to a default.
 */
export function getClientIp(headers: Headers): string {
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return headers.get("x-real-ip") ?? "unknown";
}
