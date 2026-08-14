#!/usr/bin/env bash
# Génère des variantes WebP pour l’accueil (PageSpeed mobile).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG="$ROOT/assets/images"
cd "$IMG"

if ! command -v cwebp >/dev/null; then
  echo "cwebp requis (brew install webp)" >&2
  exit 1
fi

for w in 400 800; do
  for f in plan.png concertation.png financement.png audit.png motfleche.png; do
    base="${f%.png}"
    cwebp -quiet -resize "$w" 0 -q 82 "$f" -o "${base}-${w}.webp"
  done
done

cwebp -quiet -resize 600 0 -q 82 "Flyer-2026 recto.png" -o "Flyer-2026 recto-600.webp"
echo "OK — variantes WebP régénérées dans assets/images/"
