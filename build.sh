#!/bin/bash

# Script de build pour le site InCitta (optimisation CSS / JavaScript)
# Installation requise: npm install -g csso-cli terser purgecss (ou utiliser les versions locales)

echo "🔨 Build et optimisation des ressources..."

# Créer le dossier dist s'il n'existe pas
mkdir -p dist

# Purger le CSS inutilisé avec PurgeCSS
if command -v purgecss &> /dev/null; then
    echo "🧹 Purge du CSS inutilisé..."
    purgecss --css styles.css --content "index.html" "a-propos.html" "synergies.html" "inconcertta.html" "demarche-participative.html" "programmation-territoriale.html" "contact.html" "actualites.html" "actualite-detail.html" "mentions-legales.html" "js/**/*.js" "**/*.js" \
        --output dist/ \
        --safelist "active,scrolled,fade-in-up,lazy,/^nav-/,/^hero-/,/^btn-/,/^popup-/,/^modal-/,/^animate-/,/^fade/,/^slide/,/^value-/,/^faq-/,/^level-/" \
        --font-face --keyframes --variables
    echo "   ✅ styles.css purgé créé"
    CSS_FILE="dist/styles.css"
elif command -v npx &> /dev/null; then
    echo "🧹 Purge du CSS inutilisé (via npx)..."
    npx purgecss --css styles.css --content "index.html" "a-propos.html" "synergies.html" "inconcertta.html" "demarche-participative.html" "programmation-territoriale.html" "contact.html" "actualites.html" "actualite-detail.html" "mentions-legales.html" "js/**/*.js" "**/*.js" \
        --output dist/ \
        --safelist "active,scrolled,fade-in-up,lazy,/^nav-/,/^hero-/,/^btn-/,/^popup-/,/^modal-/,/^animate-/,/^fade/,/^slide/,/^value-/,/^faq-/,/^level-/" \
        --font-face --keyframes --variables
    echo "   ✅ styles.css purgé créé"
    CSS_FILE="dist/styles.css"
else
    echo "   ⚠️  purgecss non trouvé. Installation: npm install -g purgecss"
    echo "   📋 Utilisation du CSS original"
    CSS_FILE="styles.css"
fi

# Minifier le CSS purgé
if command -v csso &> /dev/null; then
    echo "📝 Minification du CSS..."
    csso "$CSS_FILE" -o dist/styles.min.css --comments none
    echo "   ✅ styles.min.css créé"
elif command -v npx &> /dev/null; then
    echo "📝 Minification du CSS (via npx)..."
    npx csso-cli "$CSS_FILE" -o dist/styles.min.css --comments none
    echo "   ✅ styles.min.css créé"
else
    echo "   ⚠️  csso non trouvé. Installation: npm install -g csso-cli"
    if [ -f "$CSS_FILE" ]; then
        cp "$CSS_FILE" dist/styles.min.css
        echo "   📋 Copie de $CSS_FILE vers dist/styles.min.css (non minifié)"
    fi
fi

# Bundle + minification JS (js/main.js et modules — site autonome)
JS_BUNDLED=0
if command -v npx &> /dev/null; then
    echo "📝 Bundle JS (esbuild) : js/main.js → dist/script.min.js..."
    if npx --yes esbuild js/main.js --bundle --minify --legal-comments=none --outfile=dist/script.min.js 2>/dev/null; then
        echo "   ✅ script.min.js créé (bundle)"
        JS_BUNDLED=1
    fi
fi
if [ "$JS_BUNDLED" -eq 0 ]; then
    echo "   ⚠️  esbuild indisponible ou échec — copie du dossier js/ vers dist/js/ (modules non fusionnés)"
    mkdir -p dist/js
    cp -R js/. dist/js/
    for f in system/popup-system.js system/visit-tracker.js system/sw.js; do
        if [ -f "$f" ]; then
            out="dist/$(basename "${f%.js}.min.js")"
            if command -v terser &> /dev/null; then
                terser "$f" -o "$out" --compress --mangle --comments false && echo "   ✅ $out créé"
            elif command -v npx &> /dev/null; then
                npx terser "$f" -o "$out" --compress --mangle --comments false && echo "   ✅ $out créé"
            fi
        fi
    done
fi
for f in system/popup-system.js system/visit-tracker.js system/sw.js; do
    if [ -f "$f" ] && [ "$JS_BUNDLED" -eq 1 ]; then
        out="dist/$(basename "${f%.js}.min.js")"
        if command -v terser &> /dev/null; then
            terser "$f" -o "$out" --compress --mangle --comments false && echo "   ✅ $out créé"
        elif command -v npx &> /dev/null; then
            npx terser "$f" -o "$out" --compress --mangle --comments false && echo "   ✅ $out créé"
        fi
    fi
done

# (Ancienne copie de fichiers de configuration Supabase supprimée — plus utilisée)

echo ""
echo "✅ Build terminé !"
echo ""
echo "📋 Fichiers générés dans dist/:"
ls -lh dist/ | grep -E "\.(css|js)$" || echo "   Aucun fichier trouvé"
