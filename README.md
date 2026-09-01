# SteelVault — collection, envies et alertes réelles

Application PWA (installable, hors-ligne) pour gérer votre collection de
films en boîtier physique, une liste d'envie alimentée par la base TMDb
(tous les films existants), et de vraies alertes automatiques de sorties /
bons plans steelbook.

## Ce qui fonctionne réellement

- ✅ **Stockage réel sur le téléphone** (IndexedDB), hors-ligne, installable
- ✅ **Recherche du catalogue complet des films** via TMDb (≈1 million de
  films) pour remplir titre / année / affiche automatiquement
- ✅ **Import Letterboxd** : exportez votre watchlist ou diary en CSV
  depuis Letterboxd (Paramètres → Import & Export), importez-la
  directement dans l'appli — Letterboxd n'a pas d'API en libre-service
  (accès sur demande uniquement), le CSV est la voie la plus fiable
- ✅ **Champs détaillés** : titre, titre original, année, affiche, photo
  perso, prix, date, éditeur, genre, langues, support (DVD / Blu-ray /
  Blu-ray 4K), type de boîtier (Classique / Collector / Steelbook)
- ✅ **Vrai scraper** de steelbookpro.fr, 4k-ultra-hd.fr et Dealabs
- ✅ **Vraies notifications push** sur le téléphone via ntfy.sh
- ✅ **Vrai onglet Alertes dans l'appli** : le scraper publie un fichier
  `public-data/alerts.json` sur GitHub, que l'appli va lire directement —
  plus besoin de jongler entre deux applis

## 1. Obtenir une clé TMDb (gratuite, 2 minutes)

1. Créez un compte sur [themoviedb.org](https://www.themoviedb.org/signup)
2. Paramètres → API → "Demander une clé API" → type "Développeur"
3. Copiez la clé "API Key (v3 auth)" dans `config.js` :
   ```js
   TMDB_API_KEY: "votre_clé_ici",
   ```

Sans cette clé, l'appli fonctionne quand même (collection, photos, filtres)
mais la recherche automatique de films est désactivée — vous pouvez
toujours tout remplir à la main.

> On n'essaie pas de télécharger "toute la base de films" sur le
> téléphone : c'est ~1 million de fiches, impossible à stocker sur un
> mobile. À la place, la recherche interroge TMDb en direct à chaque fois
> — le résultat pour vous est le même (accès à n'importe quel film), mais
> ça nécessite d'être en ligne au moment de l'ajout.

## 2. Déployer l'appli (gratuit)

**Netlify (le plus simple)**
1. [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glissez-déposez ce dossier (`steelvault-pwa`, avec `config.js` déjà
   rempli) → vous obtenez une URL en `https://...netlify.app`

**GitHub Pages / Vercel** : voir les instructions dans la version
précédente de ce README, mêmes étapes.

## 3. Installer sur votre téléphone

- **iPhone** : Safari → Partager → "Sur l'écran d'accueil"
- **Android** : Chrome → menu (⋮) → "Installer l'application"

## 4. Activer les vraies alertes (steelbookpro.fr, 4k-ultra-hd.fr, Dealabs)

Le dossier `/scraper` est un vrai scraper, pas une maquette. Pour
l'activer gratuitement :

1. **Choisissez un topic ntfy** — un nom secret, par exemple
   `steelvault-a8f3k2` (évitez un nom trop simple, n'importe qui connaissant
   le nom peut s'abonner à vos alertes)
2. Installez l'app **ntfy** ([iOS](https://apps.apple.com/app/ntfy/id1625396347) /
   [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy)),
   ouvrez-la, abonnez-vous à ce topic
3. Poussez ce dossier sur GitHub (dépôt public ou privé)
4. Dans les Settings du dépôt → Secrets and variables → Actions, ajoutez
   un secret `NTFY_TOPIC` avec le nom choisi à l'étape 1
5. C'est tout — le workflow `.github/workflows/steelbook-watch.yml` tourne
   automatiquement toutes les 6h (gratuit sur GitHub Actions), et vous
   pouvez aussi le lancer manuellement depuis l'onglet "Actions" du dépôt

## 5. Connecter le vrai onglet Alertes de l'appli

Une fois le scraper actif (étape 4) et qu'il a tourné au moins une fois,
un fichier `public-data/alerts.json` apparaît dans votre dépôt GitHub.

1. Sur GitHub, ouvrez ce fichier, cliquez sur "Raw" — copiez l'URL de la
   barre d'adresse. Elle ressemble à :
   `https://raw.githubusercontent.com/VOTRE-PSEUDO/VOTRE-DEPOT/main/public-data/alerts.json`
2. Collez-la dans `config.js` :
   ```js
   ALERTS_FEED_URL: "https://raw.githubusercontent.com/...../alerts.json",
   ```
3. Redéployez sur Netlify, puis fermez et rouvrez l'appli sur votre
   téléphone (comme après tout changement, le service worker met en
   cache — voir la note ci-dessous si les données ne se mettent pas à jour)

L'onglet Alertes affichera alors les vraies trouvailles du scraper, avec
un bouton d'actualisation manuelle. Le repli sur les données d'exemple ne
se produit que si `ALERTS_FEED_URL` est vide ou injoignable.

> ⚠️ Cette URL suppose un dépôt **public**. Si votre dépôt est privé,
> `raw.githubusercontent.com` ne sera pas accessible sans authentification
> — dans ce cas gardez-le public (il ne contient que le code du scraper et
> les alertes, jamais votre collection personnelle, qui reste uniquement
> sur votre téléphone).

## 6. Après chaque mise à jour de l'appli : forcer le rafraîchissement

Le service worker (`sw.js`) met les fichiers en cache pour le mode
hors-ligne. Après un redéploiement, sur votre téléphone :
supprimez l'icône de l'écran d'accueil → rouvrez l'URL dans le navigateur
→ "Ajouter à l'écran d'accueil" à nouveau. Un simple rafraîchissement ne
suffit généralement pas.

## Limites à connaître, honnêtement

- **Pas de filtrage personnalisé pour l'instant** : le scraper alerte sur
  *toutes* les nouveautés steelbook repérées, pas seulement celles de
  votre liste d'envie — parce que votre liste vit uniquement dans
  l'IndexedDB de votre téléphone, que le scraper (qui tourne sur les
  serveurs de GitHub) ne peut pas voir. Pour un filtrage vraiment
  personnalisé, il faudrait synchroniser votre liste vers un petit espace
  partagé (ex. Supabase, gratuit) — je peux vous aider à construire cette
  brique si vous voulez aller plus loin.
- **Les sélecteurs HTML peuvent casser** : 4k-ultra-hd.fr et le repli HTML
  de Dealabs sont scrapés par structure de page, qui peut changer avec une
  refonte du site. Le flux RSS de steelbookpro.fr est plus stable par
  nature (format standardisé).
- **Vérifiez le flux RSS Dealabs** : l'URL utilisée
  (`dealabs.com/rss/groupe/blu-ray-4k`) suit le format standard des sites
  Pepper mais n'a pas pu être confirmée à 100% au moment de la rédaction —
  le script a un repli HTML automatique si elle ne répond pas.
- Respectez les CGU de chaque site et gardez une fréquence raisonnable
  (6h est déjà prudent).

## Structure du projet

```
steelvault-pwa/
├── index.html            page principale
├── styles.css             styles
├── app.js                   logique de l'appli
├── db.js                      stockage IndexedDB
├── config.js                clé API TMDb
├── tmdb.js                  recherche du catalogue de films
├── manifest.json          configuration PWA
├── sw.js                     service worker (hors-ligne)
├── icons/                      icônes de l'appli
├── scraper/                 scraper Node.js (à héberger séparément)
│   ├── check-releases.js
│   └── package.json
└── .github/workflows/
    └── steelbook-watch.yml  exécution planifiée gratuite (GitHub Actions)
```
