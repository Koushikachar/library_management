// /lib/ratelimit.ts
import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/database/redis";

export const ratelimit = new Ratelimit({
  redis, // from redis.ts
  limiter: Ratelimit.fixedWindow(5, "1 m"), // 5 requests per minute
  analytics: true,
  prefix: "@upstash/ratelimit",
});
