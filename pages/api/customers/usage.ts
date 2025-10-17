import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/db'
import { planLimit } from '../../../lib/auth'
import { authenticate } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error:'method_not_allowed' })
  const auth = await authenticate(req as any)
  if (!auth) return res.status(401).json({ ok:false, error:'unauthorized' })
  const c = await prisma.customer.findUnique({ where: { id: auth.customer.id } })
  if (!c) return res.status(404).json({ ok:false, error:'not_found' })
  const limit = planLimit(c.plan)
  return res.status(200).json({ ok:true, plan: c.plan, used: c.requestsThisMonth, limit })
}
