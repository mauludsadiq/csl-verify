import { prisma } from './db'
import crypto from 'crypto'
export async function authenticate(req: any) {
  const header = (req.headers['x-api-key'] || req.headers['authorization'] || '').toString()
  const apiKey = header.startsWith('Bearer ') ? header.slice(7) : header
  if (!apiKey) return null
  const key = await prisma.apiKey.findFirst({ where: { key: apiKey, revoked: false }, include: { customer: true } })
  return key?.customer ? { customer: key.customer, apiKey } : null
}
export function planLimit(plan: string) {
  if (plan === 'FREE') return 100
  if (plan === 'DEVELOPER') return 5000
  if (plan === 'PROFESSIONAL') return 50000
  return 250000
}
export function newApiKey() {
  return crypto.randomBytes(24).toString('base64url')
}
