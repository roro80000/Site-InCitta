#!/usr/bin/env bash
# Démarre le site en local puis ouvre le navigateur par défaut.
# Usage : depuis la racine du repo — npm run dev:open   ou   bash scripts/dev-local.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-3001}"
URL="http://127.0.0.1:${PORT}/"

echo ""
echo "  Site InCitta — ${URL}"
echo "  Arrêt du serveur : Ctrl+C dans ce terminal."
echo ""

(
  sleep 1.25
  if command -v open >/dev/null 2>&1; then
    open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL"
  fi
) &

SERVE_BIN="$ROOT/node_modules/.bin/serve"
if [ -x "$SERVE_BIN" ]; then
  exec "$SERVE_BIN" -l "$PORT" .
else
  echo "  Installe les dépendances : npm install"
  exec npx serve -l "$PORT" .
fi
