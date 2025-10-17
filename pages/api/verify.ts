import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
import fs from 'fs'
import crypto from 'crypto'
import zlib from 'zlib'

export const config = { api: { bodyParser: false } }

const sha256 = (b: Buffer) => crypto.createHash('sha256').update(b).digest('hex')

function canonicalize(input: Buffer): Buffer {
  let txt = input.toString('utf8')
  txt = txt.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  txt = txt.split('\n').map(line => line.replace(/[\t ]+$/g,'')).join('\n')
  return Buffer.from(txt, 'utf8')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, message: 'Method not allowed' })
  try {
    const form = formidable({ multiples: true, keepExtensions: true })
    const { files, fields } = await new Promise<{files: formidable.Files; fields: formidable.Fields}>((resolve, reject)=>{
      form.parse(req, (err, fields, files) => err ? reject(err) : resolve({fields, files}))
    })

    const all = Object.values(files).flat() as File[] | (File | File[])[]
    const list: File[] = Array.isArray(all) ? (all as any).flat() : [all as any]
    const f: File | undefined = list.find(Boolean)

    if (!f) return res.status(400).json({ ok:false, message: 'Missing file' })

    const original = await fs.promises.readFile((f as any).filepath)
    const canon = canonicalize(original)
    const compressed = zlib.deflateSync(canon)

    const stages = [
      { name: 'ORIGINAL',   bytes: original.length,   sha256: sha256(original) },
      { name: 'CANON',      bytes: canon.length,      sha256: sha256(canon) },
      { name: 'PACK(zlib)', bytes: compressed.length, sha256: sha256(compressed) }
    ]

    const certificate_id = sha256(canon)
    const cert = {
      version: 'CSL-CERT/1.0',
      theorem: (fields as any)?.theorem || undefined,
      stages,
      compression: { algo: 'zlib', ratio: compressed.length / Math.max(1, canon.length), bytes_before: canon.length, bytes_after: compressed.length },
      issued_at: new Date().toISOString(),
      certificate_id
    }

    const certJson = Buffer.from(JSON.stringify(cert, null, 2), 'utf8')
    return res.status(200).json({
      ok: true,
      cert,
      certFileBase64: certJson.toString('base64'),
      certFileName: `${certificate_id}.cslx.json`
    })
  } catch (e:any) {
    return res.status(500).json({ ok:false, message: e?.message || 'Internal error' })
  }
}
