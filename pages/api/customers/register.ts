import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/db'
import { newApiKey } from '../../../lib/auth'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'method_not_allowed' })
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const email = body?.email
  if (!email) return res.status(400).json({ ok:false, error:'email_required' })
  let customer = await prisma.customer.findUnique({ where: { email } })
  if (!customer) customer = await prisma.customer.create({ data: { email } })
  const key = newApiKey()
  await prisma.apiKey.create({ data: { key, customerId: customer.id } })
  return res.status(200).json({ ok:true, api_key: key, customer_id: customer.id, plan: customer.plan })
}
