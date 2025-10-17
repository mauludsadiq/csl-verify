import crypto from 'crypto'
import fetch from 'node-fetch'
import FormData from 'form-data'
import fs from 'fs'

function sha256(b: Buffer){ return crypto.createHash('sha256').update(b).digest('hex') }

async function postVerify(base:string, apiKey:string, path:string){
  const form = new FormData()
  form.append('file', fs.createReadStream(path))
  const r = await fetch(`${base}/api/verify`, { method:'POST', headers:{ 'x-api-key': apiKey as string }, body: form as any })
  const t = await r.text()
  try { return JSON.parse(t) } catch { throw new Error(t) }
}

async function getJSON(base:string, apiKey:string, url:string){
  const r = await fetch(`${base}${url}`, { headers:{ 'x-api-key': apiKey as string } })
  const t = await r.text()
  try { return JSON.parse(t) } catch { throw new Error(t) }
}

async function main(){
  const base = process.env.CSL_BASE || 'http://localhost:3000'
  const apiKey = process.env.API_KEY || ''
  const sample = process.env.SAMPLE || 'sample.txt'
  if(!apiKey) throw new Error('API_KEY required')

  const orig = fs.readFileSync(sample)
  const h0 = sha256(orig)

  const v = await postVerify(base, apiKey, sample)
  if(!v.ok) throw new Error('verify failed')
  const stages = v.cert?.stages || []
  const H_original = stages.find((s:any)=>s.name==='ORIGINAL')?.sha256
  const H_canon = stages.find((s:any)=>s.name==='CANON')?.sha256

  if(!H_original || !H_canon) throw new Error('stages missing')

  const usage = await getJSON(base, apiKey, '/api/customers/usage')

  const v2 = await postVerify(base, apiKey, sample)
  if(!v2.ok) throw new Error('re-verify failed')
  const H_canon2 = v2.cert?.stages?.find((s:any)=>s.name==='CANON')?.sha256
  if(H_canon !== H_canon2) { console.error('T²≠T'); process.exit(1) }

  const tampered = Buffer.from(orig)
  tampered[0] = (tampered[0] ^ 1) & 0xff
  fs.writeFileSync('.tmp_tamper.bin', tampered)
  const vt = await postVerify(base, apiKey, '.tmp_tamper.bin')
  if(vt.ok){
    const H_canon_t = vt.cert?.stages?.find((s:any)=>s.name==='CANON')?.sha256
    if(H_canon_t === H_canon) { console.error('tamper undetected'); process.exit(1) }
  }

  console.log(JSON.stringify({ ok:true, h0, H_original, H_canon, usage }, null, 2))
}
main().catch(e=>{ console.error(e?.message || e); process.exit(1) })
