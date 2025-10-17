import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN
export const redis = hasUpstash ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL as string, token: process.env.UPSTASH_REDIS_REST_TOKEN as string }) : null as unknown as Redis
export const limiter = hasUpstash ? new Ratelimit({ redis: redis as any, limiter: Ratelimit.slidingWindow(100, '1 h') }) : { limit: async () => ({ success: true }) } as any
