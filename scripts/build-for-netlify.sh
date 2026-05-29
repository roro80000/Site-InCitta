#!/usr/bin/env bash
# Assemble le dossier dist/ pour un déploiement manuel Netlify (site statique, sans bundler).
# Usage : npm run build
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Nettoyage de dist/"
rm -rf dist
mkdir -p dist

echo "→ Copie des fichiers racine (HTML, SEO, config Netlify)"
for f in \
  index.html \
  a-propos.html \
  synergies.html \
  inconcertta.html \
  inconcertta-demo.html \
  contact.html \
  demarche-participative.html \
  programmation-territoriale.html \
  evaluation-politiques-publiques.html \
  ingenierie-financiere.html \
  actualites.html \
  actualite-detail.html \
  mentions-legales.html \
  styles.css \
  manifest.json \
  netlify.toml \
  robots.txt \
  sitemap.xml
do
  if [[ -f "$f" ]]; then
    cp "$f" dist/
  fi
done

echo "→ Copie de js/ et assets/"
cp -R js dist/
cp -R assets dist/

echo "✓ dist/ prêt (déployer avec : npx netlify deploy --prod --dir=dist)"
