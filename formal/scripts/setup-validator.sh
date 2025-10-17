set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
mkdir -p formal/tests/node_modules
cd formal/tests
npm init -y >/dev/null 2>&1
npm i node-fetch@3 form-data >/dev/null 2>&1
