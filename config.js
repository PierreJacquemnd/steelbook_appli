// Remplissez ces valeurs avant de déployer l'application.

window.CONFIG = {
  // Clé API TMDb (gratuite) : https://www.themoviedb.org/settings/api
  // → Créez un compte, "Paramètres" → "API" → "Demander une clé API" → "Développeur"
  // Collez ici la clé "API Key (v3 auth)".
  TMDB_API_KEY: "COLLEZ_VOTRE_CLE_TMDB_ICI",

  // Langue utilisée pour interroger TMDb (titres, résumés)
  TMDB_LANGUAGE: "fr-FR",

  // URL du fichier alerts.json publié par le scraper GitHub Actions.
  // Format : https://raw.githubusercontent.com/VOTRE-PSEUDO/VOTRE-DEPOT/main/public-data/alerts.json
  // Laissez vide pour garder les alertes d'exemple tant que le scraper
  // n'a pas encore été mis en place (voir README).
  ALERTS_FEED_URL: "https://raw.githubusercontent.com/PierreJacquemnd/steelbook_appli/refs/heads/main/public-data/alerts.json",
};
