
import { useState } from 'react'
import CertificateCard from '../components/CertificateCard'

type CertResponse = {
  ok: boolean
  message?: string
  cert?: any
  certFileBase64?: string
  certFileName?: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [resp, setResp] = useState<CertResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const upload = async () => {
    if (!file) return
    setLoading(true)
    const form = new FormData()
    form.append('file', file)
    const r = await fetch('/api/verify', { method: 'POST', body: form })
    const j = await r.json()
    setResp(j)
    setLoading(false)
  }

  const downloadCert = () => {
    if (!resp?.certFileBase64 || !resp?.certFileName) return
    const bytes = Uint8Array.from(atob(resp.certFileBase64), c => c.charCodeAt(0))
    const blob = new Blob([bytes], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = resp.certFileName
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">CSL Verify</h1>
        <p className="text-gray-700 mb-6">Upload a proof artifact to generate a content-addressed certification chain.</p>
        <div className="bg-white p-6 rounded-lg border shadow">
          <input
            type="file"
            onChange={(e)=> setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-700"
          />
          <button
            onClick={upload}
            disabled={!file || loading}
            className="mt-4 px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Verify & Certify'}
          </button>
          {resp && (
            <div className="mt-6 space-y-4">
              {resp.ok && resp.cert ? (
                <>
                  <CertificateCard cert={resp.cert} />
                  <button onClick={downloadCert} className="px-4 py-2 rounded bg-gray-900 text-white">
                    Download .cslx
                  </button>
                </>
              ) : (
                <div className="text-red-600">{resp.message || 'Verification failed'}</div>
              )}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-8">
          Proofs-as-measurements · Content addressing · Deterministic certification
        </div>
      </div>
    </main>
  )
}
