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
  inconcertta-presentation.html \
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

echo "→ Copie des feuilles a11y + cookies (styles.css @import)"
mkdir -p dist/styles/a11y dist/a11y
cp -R styles/a11y/. dist/styles/a11y/
cp -R styles/a11y/. dist/a11y/
cp styles/cookie-banner.css dist/styles/cookie-banner.css

echo "→ Minification CSS"
npx cleancss -o dist/styles.css dist/styles.css
for f in dist/styles/a11y/*.css dist/a11y/*.css dist/styles/cookie-banner.css; do
  if [[ -f "$f" ]]; then
    npx cleancss -o "$f" "$f"
  fi
done

echo "→ Minification JS"
for f in $(find dist/js -name "*.js"); do
  npx terser "$f" -o "$f" --compress --mangle
done

echo "→ Minification HTML"
for f in dist/*.html; do
  npx html-minifier-terser --collapse-whitespace --remove-comments --minify-css true --minify-js true -o "$f" "$f"
done

echo "✓ dist/ prêt (déployer avec : npx netlify deploy --prod --dir=dist)"
