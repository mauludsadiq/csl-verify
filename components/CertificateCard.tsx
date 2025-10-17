
import React from 'react'

type Props = {
  cert: {
    version: string
    theorem?: string
    stages: { name: string, bytes: number, sha256: string }[]
    compression: { algo: string, ratio: number, bytes_before: number, bytes_after: number }
    issued_at: string
    certificate_id: string
  }
}

export default function CertificateCard({ cert }: Props) {
  return (
    <div className="rounded-lg border p-4 bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">Certificate</h2>
      <div className="text-sm text-gray-700 space-y-1">
        <div><span className="font-medium">ID:</span> {cert.certificate_id}</div>
        <div><span className="font-medium">Version:</span> {cert.version}</div>
        <div><span className="font-medium">Issued:</span> {new Date(cert.issued_at).toLocaleString()}</div>
      </div>
      <h3 className="font-medium mt-4">Stages</h3>
      <ul className="text-sm mt-1 space-y-1">
        {cert.stages.map((s,i)=>(
          <li key={i} className="font-mono break-all">
            <span className="text-gray-600">{s.name}</span>: {s.sha256} ({s.bytes} bytes)
          </li>
        ))}
      </ul>
      <div className="mt-3 text-sm text-gray-700">
        <div><span className="font-medium">Compression:</span> {cert.compression.algo} · ratio {cert.compression.ratio.toFixed(3)}</div>
      </div>
    </div>
  )
}
