# 🌍 Site InCitta

Site web institutionnel d’InCitta – cabinet d’études et d’ingénierie territoriale.

## 📁 Structure du projet

```
Site_InCitta/
├── 📄 Pages principales
│   ├── index.html                     # Accueil
│   ├── a-propos.html                  # Présentation / profil
│   ├── synergies.html                 # Partenaires et synergies
│   ├── demarche-participative.html    # Démarche participative
│   ├── programmation-territoriale.html# Programmation territoriale
│   ├── actualites.html                # Liste des actualités
│   ├── actualite-detail.html          # Détail d’une actualité
│   ├── contact.html                   # Contact
│   ├── inconcertta.html               # Présentation InConcertta + démo visionneuse
│   ├── inconcertta-demo.html          # Redirection vers inconcertta.html#demo-inconcertta
│   └── mentions-legales.html          # Mentions légales
├── ⚙️ JavaScript (site autonome — copier tel quel hors du dépôt parent)
│   ├── js/main.js                     # Point d’entrée (module ES)
│   ├── js/utils/                      # Utilitaires (perf, device…)
│   ├── js/hooks/                      # Comportements DOM (nav, scroll, formulaires…)
│   └── js/pages/                      # Scripts par page (ex. démo InConcertta)
├── scripts/build-for-netlify.sh       # Build dist/ pour Netlify (`npm run build`)
├── 🎨 Styles
│   └── styles.css                     # Styles globaux (design "glass", layout)
├── 🧩 SEO
│   ├── sitemap.xml                    # Sitemap InCitta
│   ├── robots.txt                     # Robots
│   └── SEO_TEMPLATE.html              # Template SEO
└── 📦 Assets
    └── assets/                        # Logos, images, icônes
```

## 🚀 Fonctionnalités

### Expérience à l’ouverture
- **Pas d’écran ni de barre de chargement** : le visiteur atterrit directement sur le site dès que le HTML/CSS est disponible (aucun préchargeur plein écran dans `js/main.js`).

### Navigation et interface
- Barre d’en‑tête fixe avec effet "glass"
- Navigation responsive (desktop / mobile)
- Hiérarchie visuelle claire et design sobre

### Contenus
- Pages thématiques (démarche participative, programmation territoriale)
- Pages éditoriales avec mise en forme avancée (cartes, sections)
- Système d’actualités (liste + détail)

### Performance & accessibilité
- CSS centralisé et optimisé
- Animations légères au scroll
- Navigation clavier et contrastes soignés

## 🔧 Configuration

- Site statique (HTML / CSS / JS)
- Hébergement : Netlify (ou équivalent)
- SEO géré manuellement (balises, sitemap, robots)

## 🎯 Utilisation

- Modifier les contenus directement dans les fichiers HTML
- Utiliser `SEO_TEMPLATE.html` pour les nouvelles pages
- Lancer `update-html-production.sh` avant mise en ligne

## 📝 Notes importantes

- Aucun lien avec des projets précédents (restaurants, e‑commerce, etc.)
- Architecture volontairement simple et maintenable
- Le site sert de vitrine institutionnelle pour InCitta
- Le dossier `Site_InCitta/` est prévu pour être **extrait** du dépôt mère : tout le JS vit sous `js/` (pas de dépendance au build React / hooks de l’app InConcertta)