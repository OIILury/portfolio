# Portfolio — Baptiste Rolland

Portfolio statique bilingue (FR/EN, thème clair/sombre) en HTML/CSS/JS pur.  
Site en ligne : https://oiilury.github.io/portfolio/

## Lancer en local

```bash
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000` dans un navigateur (ouvrir les fichiers HTML directement via `file://` ne fonctionne pas en raison du chargement des fichiers JSON avec `fetch`).

## Structure du dépôt

- `css/` : tokens de design (`tokens.css`), composants (`.tech-*`), mise en page (`layout.css`, `indexStyle.css`) et thème (`footer.css`).
- `js/` : gestion du thème (`switchTheme.js`), i18n (`i18n.js`), rendu des projets (`projects-grid.js`, `project-detail.js`, `home-projects.js`), compétences (`skills.js`), cube 3D et particules.
- `i18n/` : dictionnaires de traduction `fr.json` et `en.json`.
- `data/` : données structurées des projets (`projects.json`) et compétences (`skills.json`).
- `uploads/` : images, icônes et CV PDF.
- `project/` : anciennes pages de détail statiques conservées pour les brouillons liés via `legacy_page`.

## Ajouter ou publier un projet

1. Éditer `data/projects.json` et ajouter une entrée dans `"projects"` :
   - Métadonnées : `slug`, `status` (`"draft"` ou `"published"`), `featured` (`true`/`false`), `start` (`"AAAA-MM"` ou `null`), `end` (`"AAAA-MM"` ou `null`), `context` (`school`, `internship`, `work`, `personal`, `team`), `domains` (`ia`, `data`, `cloud`, `web`, `iot`, `game`, `tools`), `stack`, `confidential`, `cover`, `legacy_page`, `links` (`repo`, `demo`, `doc`), `gallery` (`[{ "src", "fr", "en" }]`).
   - Textes bilingues dans `"fr"` et `"en"` : `title`, `tagline`, `role`, `result` et `sections` (`context`, `approach`, `architecture`, `challenges`, `outcome`).
2. Prévisualiser un projet en brouillon (`"status": "draft"`) via `http://localhost:8000/project.html?p=<slug>&preview=1`.
3. Passer `"status"` à `"published"` pour l'afficher sur l'accueil et `projects.html`.

## Ajouter un texte traduit

1. Ajouter l'attribut `data-i18n="ma_cle"` (ou `data-i18n-attr="attr:ma_cle"`) sur l'élément HTML.
2. Ajouter `"ma_cle"` dans `i18n/fr.json` et `i18n/en.json`.

---

# Portfolio — Baptiste Rolland (EN)

Static bilingual portfolio (FR/EN, light/dark theme) built with plain HTML/CSS/JS.  
Live site: https://oiilury.github.io/portfolio/

## Run locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser (opening HTML files directly via `file://` fails due to `fetch` requests for JSON files).

## Folder structure

- `css/`: design tokens (`tokens.css`), components (`.tech-*`), layout (`layout.css`, `indexStyle.css`), and theme overrides (`footer.css`).
- `js/`: theme switcher (`switchTheme.js`), i18n (`i18n.js`), project rendering (`projects-grid.js`, `project-detail.js`, `home-projects.js`), skills (`skills.js`), 3D cube, and particles.
- `i18n/`: translation dictionaries `fr.json` and `en.json`.
- `data/`: structured data for projects (`projects.json`) and skills (`skills.json`).
- `uploads/`: images, icons, and PDF CV.
- `project/`: legacy static detail pages kept for drafts linked via `legacy_page`.

## Add or publish a project

1. Edit `data/projects.json` and add an entry under `"projects"`:
   - Metadata: `slug`, `status` (`"draft"` or `"published"`), `featured` (`true`/`false`), `start` (`"YYYY-MM"` or `null`), `end` (`"YYYY-MM"` or `null`), `context` (`school`, `internship`, `work`, `personal`, `team`), `domains` (`ia`, `data`, `cloud`, `web`, `iot`, `game`, `tools`), `stack`, `confidential`, `cover`, `legacy_page`, `links` (`repo`, `demo`, `doc`), `gallery` (`[{ "src", "fr", "en" }]`).
   - Bilingual content under `"fr"` and `"en"`: `title`, `tagline`, `role`, `result`, and `sections` (`context`, `approach`, `architecture`, `challenges`, `outcome`).
2. Preview a `"draft"` project at `http://localhost:8000/project.html?p=<slug>&preview=1`.
3. Set `"status"` to `"published"` to display it on the home page and `projects.html`.

## Add a translated string

1. Add `data-i18n="my_key"` (or `data-i18n-attr="attr:my_key"`) on the HTML element.
2. Add `"my_key"` to both `i18n/fr.json` and `i18n/en.json`.
