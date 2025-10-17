import { prisma } from './db'
import { planLimit } from './auth'

export async function checkQuota(customerId: string) {
  const c = await prisma.customer.findUnique({ where: { id: customerId } })
  if (!c) return { ok: false, reason: 'no_customer' }
  const max = planLimit(c.plan)
  return c.requestsThisMonth < max ? { ok: true } : { ok: false, reason: 'quota_exceeded' }
}

export async function bumpUsage(customerId: string) {
  await prisma.customer.update({ where: { id: customerId }, data: { requestsThisMonth: { increment: 1 } } })
}
