import { Redis } from 'ioredis';
import { NextRequest } from 'next/server';

const redis = new Redis(process.env.REDIS_URL!);

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS_PER_WINDOW = 100;

export async function rateLimit(req: NextRequest): Promise<boolean> {
  const ip = req.ip ?? '127.0.0.1';
  const key = `ratelimit:${ip}`;

  const requests = await redis.incr(key);
  if (requests === 1) {
    await redis.expire(key, WINDOW_SIZE_IN_SECONDS);
  }

  return requests <= MAX_REQUESTS_PER_WINDOW;
}
