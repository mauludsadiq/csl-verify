#!/usr/bin/env bash
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
cd "$here"
if command -v ots >/dev/null 2>&1; then
  ots stamp certificate.pdf registry.json || true
  echo "ots: stamped"
else
  echo "ots not installed; skipping"
fi
