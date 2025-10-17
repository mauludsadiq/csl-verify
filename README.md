
# CSL Verify — Vercel-Ready Proof Certification

A production-ready, deploy-in-minutes project that turns **proof artifacts** into **content-addressed certificates** with a deterministic chain:

```
ORIGINAL  --canonicalize-->  CANON  --zlib-->  PACK
   |                          |                 |
  sha256                     sha256            sha256
```

- **Frontend**: Next.js + Tailwind (upload UI + certificate viewer)
- **Backend**: Next.js API Route (`/api/verify`) — no extra servers
- **Certification**: Canonicalization + SHA-256 at each stage + zlib compression
- **Artifact**: Downloadable `.cslx.json` certificate (self-contained)

---

## Quickstart

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy (Vercel)

```bash
# Install Vercel CLI if needed: npm i -g vercel
vercel
```

Accept defaults; Vercel detects Next.js and deploys immediately.

---

## What It Does (Now)

- Accepts any file
- Canonicalizes it (LF newlines, trim trailing spaces)
- Computes SHA-256 for `ORIGINAL`, `CANON`, and `PACK(zlib)`
- Emits a signed certificate JSON you can download

> The **certificate id** is the SHA-256 of the canonicalized bytes.

## What You Can Add (Drop-in)

- Replace the simple chain with your **CSL verifier**:
  - Add a new stage, e.g., `VERIFY(CSL)` with its own digest.
  - Store execution logs as `cert.logs`.
  - Keep the content-addressability invariant: hash every stage.

- Payments (Stripe):
  - Gate `/api/verify` via a token from a checkout session
  - Add `/api/create-checkout-session`

- Registry:
  - Add a KV/DB and publish certificates to a feed or explorer.

---

## File Map

```
csl-verify/
  pages/
    index.tsx           # Upload UI
    api/verify.ts       # Certification API
  components/
    CertificateCard.tsx
  styles/globals.css
  package.json
  tsconfig.json
  next.config.js
  tailwind.config.js
  postcss.config.js
  vercel.json
  README.md
```

---

## Security Notes

- This MVP does **not execute** uploaded code. It performs deterministic transforms only.
- If you integrate an executor/verifier, sandbox it (e.g., Firecracker, containers).

---

## License

MIT
