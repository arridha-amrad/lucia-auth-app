import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

type Unit = "ms" | "s" | "m" | "h" | "d";
type Duration = `${number} ${Unit}` | `${number}${Unit}`;

export const initRateLimiter = (token: number, window: Duration) => {
  const rateLimit = new Ratelimit({
    redis: kv, // Use Vercel KV for storage
    limiter: Ratelimit.slidingWindow(token, window), // Limit to 5 requests per minute
  });
  return rateLimit;
};
