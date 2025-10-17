import { limiter } from './limits'
import { authenticate } from './auth'
import { checkQuota, bumpUsage } from './billing'
export function withGuards(handler: any) {
  return async (req: any, res: any) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString()
    const { success } = await limiter.limit(`ip:${ip}`)
    if (!success) return res.status(429).json({ ok:false, error:'rate_limited' })
    const auth = await authenticate(req)
    if (!auth) return res.status(401).json({ ok:false, error:'unauthorized' })
    const quota = await checkQuota(auth.customer.id)
    if (!quota.ok) return res.status(402).json({ ok:false, error: quota.reason })
    const out = await handler(req, res, auth)
    await bumpUsage(auth.customer.id)
    return out
  }
}
