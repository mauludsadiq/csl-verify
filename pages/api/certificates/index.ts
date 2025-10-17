import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/db'
import { authenticate } from '../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error:'method_not_allowed' })
  const auth = await authenticate(req as any)
  if (!auth) return res.status(401).json({ ok:false, error:'unauthorized' })
  const certs = await prisma.certificate.findMany({
    where: { customerId: auth.customer.id },
    orderBy: { createdAt: 'desc' },
    take: 100
  })
  return res.status(200).json({ ok:true, certificates: certs })
}
