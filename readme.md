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
│   ├── observatoire-des-territoires.html # Observatoire des territoires
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
├── scripts/dev-local.sh               # Dev local + ouverture navigateur (`npm run dev:open`)
├── 🎨 Styles
│   ├── styles.css                     # Point d’entrée (@import des modules)
│   └── styles/
│       ├── base.css, layout.css, nav.css, components.css…
│       ├── footer.css, utilities.css, home.css (accueil uniquement)
│       ├── a11y/                      # Accessibilité (+ site-overrides)
│       ├── cookie-banner.css
│       └── pages/                     # CSS par page (editorial, observatoire…)
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
- Hébergement : Netlify — publication directe depuis la racine (`publish = "."`, pas de dossier `dist/`)
- SEO géré manuellement (balises, sitemap, robots)

## 🎯 Utilisation

- **Français** : modifier directement les fichiers **HTML** (et `styles.css` / `styles/pages/` / `js/` si besoin).
- **Preview local** : `npm run dev` puis **http://127.0.0.1:3001/** (un seul serveur sur le port 3001).
- **EN / ES / IT** : textes dans `js/i18n/messages/` (le JS ne remplace le HTML qu’hors langue FR).
- Nouvelles pages : partir de `SEO_TEMPLATE.html` (fichier dev, non déployé).

## 📝 Notes importantes

- Aucun lien avec des projets précédents (restaurants, e‑commerce, etc.)
- Architecture volontairement simple et maintenable
- Le site sert de vitrine institutionnelle pour InCitta
- Le dossier `Site_InCitta/` est prévu pour être **extrait** du dépôt mère : tout le JS vit sous `js/` (pas de dépendance au build React / hooks de l’app InConcertta)