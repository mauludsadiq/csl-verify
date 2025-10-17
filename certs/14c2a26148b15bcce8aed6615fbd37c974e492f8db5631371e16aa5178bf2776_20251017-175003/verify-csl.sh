#!/usr/bin/env bash
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
cd "$here"
pdf_sha_calc=$(shasum -a 256 certificate.pdf | awk '{print $1}')
reg_sha_calc=$(shasum -a 256 registry.json | awk '{print $1}')
pdf_sha_reg=$(jq -r '.artifact_hashes["certificate.pdf"].sha256' registry.json)
reg_sha_reg=$(jq -r '.artifact_hashes["registry.json"].sha256' registry.json)
test "$pdf_sha_calc" = "$pdf_sha_reg"
test "$reg_sha_calc" = "$reg_sha_reg"
ssh-keygen -Y verify -f ../../keys/csl_signing_sk.pub -I "$(ssh-keygen -lf ../../keys/csl_signing_sk.pub | awk '{print $2}')" -n csl -s signatures/certificate.pdf.sig < certificate.pdf
ssh-keygen -Y verify -f ../../keys/csl_signing_sk.pub -I "$(ssh-keygen -lf ../../keys/csl_signing_sk.pub | awk '{print $2}')" -n csl -s signatures/registry.json.sig < registry.json
if command -v ots >/dev/null 2>&1; then
  ots verify certificate.pdf || true
  ots verify registry.json || true
fi
echo "OK"
